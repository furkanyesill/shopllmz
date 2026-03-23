/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { shop: requestShop, url, jsonLd } = await req.json();
    if (!url || !jsonLd || !requestShop) {
      return new NextResponse('Missing URL, Shop or JSON-LD data', { status: 400 });
    }

    const shop = shopify.utils.sanitizeShop(requestShop, true);
    if (!shop) return new NextResponse('Invalid shop', { status: 400 });

    // Look up the most recent session directly from the DB
    const dbSession = await (prisma as any).session.findFirst({
      where: { shop },
    });

    if (!dbSession) {
      return NextResponse.json({ success: false, error: 'Mağaza oturumu bulunamadı. Uygulamayı yeniden yükleyin.' }, { status: 401 });
    }

    // Reconstruct the Session object
    const session = shopify.session.customAppSession(shop);
    session.accessToken = dbSession.accessToken;
    session.scope = dbSession.scope;

    // 3. Pro Subscription Gate (Check Lead model)
    const lead = await (prisma as any).lead.findUnique({ where: { shop } });
    const isPro = lead?.isPro || false;

    if (!isPro) {
      return NextResponse.json({ success: false, requirePro: true, error: "AEO Otomatik Enjeksiyonu sadece Pro planlara özeldir." });
    }

    const client = new shopify.clients.Rest({ session });

    // Self-Healing Logic: We will inject a snippet into the active theme.
    // 1. Fetch active theme
    const themesRes = await client.get({ path: 'themes' }) as any;
    const activeTheme = themesRes.body.themes.find((t: any) => t.role === "main");

    if (!activeTheme) {
      return NextResponse.json({ success: false, error: 'No active theme found.' }, { status: 404 });
    }

    // 2. Fetch theme.liquid
    const assetRes = await client.get({
      path: `themes/${activeTheme.id}/assets`,
      query: { asset: { key: "layout/theme.liquid" } }
    }) as any;

    let themeLiquid = assetRes.body.asset.value;

    // 3. Inject JSON-LD before </head> if not already injected
    if (!themeLiquid.includes('id="shopllmz-aeo"')) {
      const injection = `\n<!-- ShopLLMZ AEO Integration -->\n<script type="application/ld+json" id="shopllmz-aeo">\n${jsonLd}\n</script>\n<!-- End ShopLLMZ -->\n`;
      themeLiquid = themeLiquid.replace('</head>', `${injection}</head>`);

      // 4. Save updated theme.liquid
      await client.put({
        path: `themes/${activeTheme.id}/assets`,
        data: {
          asset: {
            key: "layout/theme.liquid",
            value: themeLiquid
          }
        }
      });
      console.log(`Self-healing applied to ${shop}`);
      return NextResponse.json({ success: true, message: 'AEO schemas applied securely to your Shopify Theme.' });
    } else {
      return NextResponse.json({ success: true, message: 'AEO schemas were already present. Optimization is up-to-date.' });
    }
  } catch (error: any) {
    console.error("Self-Healing Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
