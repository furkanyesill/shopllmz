import { NextResponse } from 'next/server';

export async function POST() {
  // GDPR Webhook: Shopify expects a 200 OK to acknowledge receipt.
  // We do not store customer PII, so no deletion is necessary.
  return new NextResponse('OK', { status: 200 });
}
