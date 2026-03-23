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

    // Self-Healing Logic: ZERO-FOOTPRINT
    // Save the customized AEO schema into the database. The Theme App Extension will fetch it dynamically via JavaScript.
    await (prisma as any).lead.update({
      where: { shop },
      data: { aiSchema: jsonLd }
    });

    console.log(`Zero-Footprint AEO stored securely for ${shop}`);
    return NextResponse.json({ success: true, message: 'AEO schemas applied securely via Zero-Footprint App Blocks.' });
  } catch (error: any) {
    console.error("Self-Healing Error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
