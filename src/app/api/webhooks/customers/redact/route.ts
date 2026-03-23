import { NextResponse } from 'next/server';

export async function POST() {
  // GDPR Webhook: Shopify expects a 200 OK to acknowledge receipt.
  // We do not store customer PII in our database, so no action is required.
  return new NextResponse('OK', { status: 200 });
}
