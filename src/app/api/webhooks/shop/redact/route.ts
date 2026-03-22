import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  // GDPR Webhook: Shop Data Erasure
  try {
    const payload = await req.json();
    const shopDomain = payload?.shop_domain;

    if (shopDomain) {
      // Delete all records connected to this shop domain for App Store compliance
      await prisma.session.deleteMany({ where: { shop: shopDomain } });
    }
  } catch (error) {
    // Optionally log error, but ALWAYS return 200 to Shopify
    console.error("Shop Redact Webhook Error:", error);
  }

  return new NextResponse('OK', { status: 200 });
}
