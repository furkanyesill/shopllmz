import { NextResponse } from 'next/server';
import { shopify } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const shop = url.searchParams.get('shop');

  if (!shop) {
    return new NextResponse('Missing shop parameter.', { status: 400 });
  }

  const sanitizedShop = shopify.utils.sanitizeShop(shop, true);
  if (!sanitizedShop) {
    return new NextResponse('Invalid shop parameter.', { status: 400 });
  }

  // Construct start auth redirect
  const redirectParams = await shopify.auth.begin({
    shop: sanitizedShop,
    callbackPath: '/api/auth/callback',
    isOnline: false,
    rawRequest: req as any,
    rawResponse: new NextResponse() as any, // Not fully supported natively in App Router without adapter
  });

  return new NextResponse('Redirecting...', {
    status: 302,
    headers: {
      Location: redirectParams,
    },
  });
}
