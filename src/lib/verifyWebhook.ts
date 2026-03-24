import { createHmac, timingSafeEqual } from 'crypto';

/**
 * Verifies the HMAC signature on incoming Shopify webhook requests.
 * Shopify signs every webhook with HMAC-SHA256 using the app's API secret.
 *
 * REQUIRED by Shopify App Store: https://shopify.dev/docs/apps/build/webhooks/subscribe/https#step-5-verify-the-webhook
 *
 * @param req - The incoming Next.js Request object
 * @returns The raw body as Buffer if valid, or null if verification fails
 */
export async function verifyShopifyWebhook(req: Request): Promise<Buffer | null> {
  const secret = process.env.SHOPIFY_API_SECRET;
  if (!secret) {
    console.error('SHOPIFY_API_SECRET is not set — cannot verify webhook.');
    return null;
  }

  const hmacHeader = req.headers.get('x-shopify-hmac-sha256');
  if (!hmacHeader) {
    console.warn('Missing x-shopify-hmac-sha256 header.');
    return null;
  }

  // Read the raw body as buffer — must happen BEFORE any other body parsing
  const rawBody = Buffer.from(await req.arrayBuffer());

  const generatedHmac = createHmac('sha256', secret).update(rawBody).digest('base64');
  const generatedHmacBuf = Buffer.from(generatedHmac, 'utf-8');
  const headerBuf = Buffer.from(hmacHeader, 'utf-8');

  // Use timing-safe comparison to prevent timing attacks
  if (generatedHmacBuf.length !== headerBuf.length) {
    console.warn('HMAC length mismatch — webhook rejected.');
    return null;
  }

  try {
    if (!timingSafeEqual(generatedHmacBuf, headerBuf)) {
      console.warn('HMAC mismatch — webhook rejected.');
      return null;
    }
  } catch {
    return null;
  }

  return rawBody;
}
