/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { generateAEOContent } from '@/lib/gemini';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { url } = await req.json();
    if (!url) return NextResponse.json({ error: 'Missing shop URL' }, { status: 400 });

    let domain = url;
    try { domain = new URL(url).hostname; } catch {
      // fallback if it doesn't have http prefix
      domain = url.replace('https://', '').replace('http://', '').split('/')[0];
    }

    if (!domain) return NextResponse.json({ error: 'Invalid URL format' }, { status: 400 });

    // Track Lead in Database (Silent failure to not break user experience)
    try {
      await (prisma as any).lead.upsert({
        where: { shop: domain },
        update: { scans: { increment: 1 } },
        create: { shop: domain, scans: 1 }
      });
    } catch (dbErr) {
      console.error("Lead Tracking Error:", dbErr);
    }

    let rawProductData = "";
    let scannedProducts: string[] = [];

    try {
      // Fetch public products.json which all Shopify stores expose
      // Bypassing Shopify sanitizeShop here because custom domains (e.g. gymshark.com) don't end in .myshopify.com
      const publicResponse = await fetch(`https://${domain}/products.json?limit=3`, {
        cache: 'no-store',
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (!publicResponse.ok) {
        throw new Error("Store is password protected, not Shopify, or products.json is disabled.");
      }

      const publicData = await publicResponse.json();
      
      if (publicData.products && publicData.products.length > 0) {
        scannedProducts = publicData.products.map((p: any) => p.title);
        rawProductData = JSON.stringify(publicData.products.map((p: any) => ({
          title: p.title,
          tags: p.tags,
          body: p.body_html?.replace(/<[^>]*>?/gm, '').substring(0, 300), // Strip HTML
          vendor: p.vendor
        })));
      } else {
        return NextResponse.json({ error: "Mağazada açık ürün bulunamadı." }, { status: 404 });
      }
    } catch (fetchErr: any) {
      console.error("Public Fetch Error:", fetchErr.message);
      return NextResponse.json({ error: `Mağazanın public ürün verisine ulaşılamıyor. (${fetchErr.message})` }, { status: 400 });
    }

    // Pass real data to Gemini 2.5 Flash
    const aeoData = await generateAEOContent(rawProductData);

    // Calculate a dynamic low score to build FOMO
    const dynamicScore = Math.floor(Math.random() * 18) + 4; // random between 4 and 21

    return NextResponse.json({
      llmsTxt: aeoData.llmsTxt,
      jsonLd: aeoData.jsonLd,
      score: dynamicScore,
      scannedProducts
    });
  } catch (error: any) {
    console.error("Scan AI Error:", error);
    return NextResponse.json({ error: `Scan failed: ${error.message}` }, { status: 500 });
  }
}

