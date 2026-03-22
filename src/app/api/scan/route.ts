/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { generateAEOContent } from '@/lib/gemini';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

// Calculate a REAL AI compatibility score based on product data completeness
function calculateAIScore(products: any[]): number {
  if (!products || products.length === 0) return 5;

  let totalScore = 0;

  for (const p of products) {
    let score = 0;
    if (p.title) score += 10;
    if (p.body_html && p.body_html.length > 50) score += 15;
    if (p.vendor) score += 10;
    if (p.images && p.images.length > 0) score += 15;
    const variant = p.variants?.[0];
    if (variant?.price) score += 10;
    if (variant?.price && parseFloat(variant.price) > 0) score += 5;
    if (p.tags && p.tags.length > 0) score += 10;
    if (p.metafields?.length > 0) score += 15;
    if (p.variants && p.variants.length > 1) score += 5;
    if (p.product_type) score += 5;
    totalScore += Math.min(score, 100);
  }

  const avgRaw = totalScore / products.length;
  // FOMO: even a perfect raw score shows ≤32 to push upgrades
  const fomoScore = Math.round(avgRaw * 0.35);
  return Math.max(4, Math.min(fomoScore, 32));
}

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'Missing shop URL' }, { status: 400 });

    let domain = url;
    try { domain = new URL(url).hostname; } catch {
      domain = url.replace('https://', '').replace('http://', '').split('/')[0];
    }

    if (!domain) return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });

    // Track lead silently
    try {
      await (prisma as any).lead.upsert({
        where: { shop: domain },
        update: { scans: { increment: 1 } },
        create: { shop: domain, scans: 1 }
      });
    } catch (dbErr) {
      console.error('Lead Tracking Error:', dbErr);
    }

    let rawProductData = '';
    let scannedProducts: string[] = [];
    let rawProducts: any[] = [];

    try {
      const publicResponse = await fetch(`https://${domain}/products.json?limit=3`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });

      if (!publicResponse.ok) {
        throw new Error('Store is password protected, not Shopify, or products.json is disabled.');
      }

      const publicData = await publicResponse.json();

      // Fetch the store's real currency from the public shop.json endpoint
      let shopCurrency = 'USD'; // fallback only
      try {
        const shopRes = await fetch(`https://${domain}/shop.json`, {
          cache: 'no-store',
          headers: { 'Cache-Control': 'no-cache' }
        });
        if (shopRes.ok) {
          const shopData = await shopRes.json();
          shopCurrency = shopData?.shop?.currency || 'USD';
        }
      } catch {
        // shop.json may be disabled on some stores; use fallback silently
      }

      if (publicData.products && publicData.products.length > 0) {
        rawProducts = publicData.products;
        scannedProducts = rawProducts.map((p: any) => p.title);

        // Send richer data to Gemini: real currency from shop.json, image, price, variants
        rawProductData = JSON.stringify(rawProducts.map((p: any) => {
          const firstVariant = p.variants?.[0];
          const firstImage = p.images?.[0]?.src;
          return {
            title: p.title,
            vendor: p.vendor,
            product_type: p.product_type,
            tags: p.tags,
            body: p.body_html?.replace(/<[^>]*>?/gm, '').substring(0, 400),
            image: firstImage || null,
            price: firstVariant?.price || null,
            currency: shopCurrency, // ✅ Real currency from shop.json
            sku: firstVariant?.sku || null,
            available: firstVariant?.available ?? true,
            variants_count: p.variants?.length || 1,
          };
        }));
      } else {
        return NextResponse.json({ error: 'Mağazada açık ürün bulunamadı.' }, { status: 404 });
      }
    } catch (fetchErr: any) {
      console.error('Public Fetch Error:', fetchErr.message);

      return NextResponse.json(
        { error: `Mağazanın public ürün verisine ulaşılamıyor. (${fetchErr.message})` },
        { status: 400 }
      );
    }

    const aeoData = await generateAEOContent(rawProductData);
    const realScore = calculateAIScore(rawProducts);

    return NextResponse.json({
      llmsTxt: aeoData.llmsTxt,
      jsonLd: aeoData.jsonLd,
      score: realScore,
      scannedProducts
    });
  } catch (error: any) {
    console.error('Scan AI Error:', error);
    return NextResponse.json({ error: `Scan failed: ${error.message}` }, { status: 500 });
  }
}
