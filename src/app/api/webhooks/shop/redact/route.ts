import { NextResponse } from 'next/server';
import { verifyShopifyWebhook } from '@/lib/verifyWebhook';

export async function POST(req: Request) {
  const rawBody = await verifyShopifyWebhook(req);
  if (!rawBody) {
    return new NextResponse('Unauthorized: HMAC verification failed.', { status: 401 });
  }
  // GDPR: Automatically called 48h after app uninstall.
  // Our cleanup happens in the app/uninstalled webhook.
  return new NextResponse('OK', { status: 200 });
}
