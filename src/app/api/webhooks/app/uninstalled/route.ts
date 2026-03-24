import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { verifyShopifyWebhook } from '@/lib/verifyWebhook';

export async function POST(req: Request) {
  try {
    // Step 1: HMAC Verification (required by Shopify App Store)
    const rawBody = await verifyShopifyWebhook(req);
    if (!rawBody) {
      return new NextResponse('Unauthorized: HMAC verification failed.', { status: 401 });
    }

    // Step 2: Process the payload
    const shop = req.headers.get('x-shopify-shop-domain');
    if (!shop) {
      return new NextResponse('Missing shop header', { status: 400 });
    }
    
    // Shopify Rule: Clean up session and merchant tokens on app removal
    await prisma.session.deleteMany({ where: { shop } });

    return new NextResponse('App successfully uninstalled and tokens erased', { status: 200 });
  } catch (error) {
    console.error('Uninstall webhook error:', error);
    // Return 200 so Shopify doesn't retry aggressively
    return new NextResponse('Error processed safely', { status: 200 });
  }
}
