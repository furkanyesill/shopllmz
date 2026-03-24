import { NextResponse } from 'next/server';
import { verifyShopifyWebhook } from '@/lib/verifyWebhook';

export async function POST(req: Request) {
  const rawBody = await verifyShopifyWebhook(req);
  if (!rawBody) {
    return new NextResponse('Unauthorized: HMAC verification failed.', { status: 401 });
  }
  // GDPR: We do not store customer PII, so no data to export.
  return new NextResponse('OK', { status: 200 });
}
