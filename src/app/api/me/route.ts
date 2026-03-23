import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import { sessionStorage } from '@/lib/shopify';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('shopify_app_session')?.value;

    if (!sessionId) {
      return NextResponse.json({ isPro: false });
    }

    const session = await sessionStorage.loadSession(sessionId);
    if (!session || !session.shop) {
      return NextResponse.json({ isPro: false });
    }

    const lead = await (prisma as any).lead.findUnique({ where: { shop: session.shop } });
    const isPro = lead?.isPro || false;

    return NextResponse.json({ isPro });
  } catch (error) {
    return NextResponse.json({ isPro: false });
  }
}
