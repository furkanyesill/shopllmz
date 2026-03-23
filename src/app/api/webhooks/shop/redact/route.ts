import { NextResponse } from 'next/server';

export async function POST() {
  // GDPR Webhook: Shopify expects a 200 OK to acknowledge receipt.
  // Automatically called 48 hours after application uninstall. 
  // All our actual cleanup is done inside the app/uninstall webhook, so we just acknowledge it here.
  return new NextResponse('OK', { status: 200 });
}
