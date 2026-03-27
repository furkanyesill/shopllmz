import { NextResponse } from 'next/server';
import { verifySessionToken } from '@/lib/verifySessionToken';
import { sessionStorage } from '@/lib/shopify';
import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    let shop: string | null = null;

    // 1. Try session token first (embedded app, Shopify Admin)
    const sessionTokenShop = await verifySessionToken(request);
    if (sessionTokenShop) {
      shop = sessionTokenShop;
    }

    // 2. Fallback: cookie-based session (for non-embedded / older flows)
    if (!shop) {
      const cookieStore = await cookies();
      const sessionId = cookieStore.get('shopify_app_session')?.value;
      if (sessionId) {
        const session = await sessionStorage.loadSession(sessionId);
        if (session?.shop) {
          shop = session.shop;
        }
      }
    }

    if (!shop) {
      return NextResponse.json({ isPro: false });
    }

    const lead = await (prisma as any).lead.findUnique({ where: { shop } });
    const isPro = lead?.isPro || false;

    return NextResponse.json({ isPro, shop });
  } catch (error) {
    console.error('[/api/me] Error:', error);
    return NextResponse.json({ isPro: false });
  }
}
