import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    // Read the shop header from Shopify webhook payload
    const shop = req.headers.get('x-shopify-shop-domain');
    if (!shop) {
      return new NextResponse('Missing shop header', { status: 400 });
    }
    
    // Shopify Rule: Clean up session and merchant tokens exactly upon app removal
    await prisma.session.deleteMany({
      where: { shop }
    });

    // Explicitly return 200 OK to Shopify to acknowledge receipt
    return new NextResponse('App successfully uninstalled and tokens erased', { status: 200 });
  } catch (error) {
    console.error('Uninstall webhook error:', error);
    // Must return 200 even on some errors so Shopify doesn't aggressively retry and disable the webhook hook
    return new NextResponse('Error processed safely', { status: 200 });
  }
}
