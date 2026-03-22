/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { shopify, sessionStorage } from '@/lib/shopify';
import { cookies } from 'next/headers';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function POST(req: Request) {
  try {
    const { url, jsonLd } = await req.json();
    if (!url || !jsonLd) {
      return new NextResponse('Missing URL or JSON-LD data', { status: 400 });
    }

    // 1. Get secure session directly from Cookies (No frontend parameter needed)
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('shopify_app_session')?.value;

    if (!sessionId) {
      return NextResponse.json({ success: false, error: 'Oturum bulunamadı. Lütfen sayfayı yenileyip baştan bağlanın.' }, { status: 401 });
    }

    // 2. Load the authenticated Shopify session
    const session = await sessionStorage.loadSession(sessionId);
    if (!session || !session.shop) {
      return NextResponse.json({ success: false, error: 'Shopify oturumunuz zaman aşımına uğradı.' }, { status: 401 });
    }

    const shop = session.shop;

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
