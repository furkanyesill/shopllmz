import { NextResponse } from 'next/server';
import { createHmac } from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * Creates a self-contained, signed state token.
 * Format: base64(shop + ":" + timestamp) + "." + hmac_signature
 * No cookies, no DB — the signature IS the verification.
 */
function createSignedState(shop: string, secret: string): string {
  const payload = Buffer.from(`${shop}:${Date.now()}`).toString('base64url');
  const sig = createHmac('sha256', secret).update(payload).digest('hex');
  return `${payload}.${sig}`;
}

export async function GET(req: Request) {
  const url = new URL(req.url);
  const shop = url.searchParams.get('shop');

  if (!shop) {
    return new NextResponse('Missing shop parameter.', { status: 400 });
  }

  const cleanShop = shop.trim().toLowerCase().replace(/^https?:\/\//, '');

  const apiKey = process.env.SHOPIFY_API_KEY || '';
  const secret = process.env.SHOPIFY_API_SECRET || '';
  const scopes = process.env.SHOPIFY_SCOPES || 'read_products,write_themes,read_themes';
  const hostName = process.env.HOST_NAME || 'https://www.shopllmz.com';
  const redirectUri = `${hostName}/api/auth/callback`;

  if (!secret) {
    return new NextResponse('Server configuration error.', { status: 500 });
  }

  // Signed state — no cookies, no DB needed (CSRF-safe via HMAC signature)
  const state = createSignedState(cleanShop, secret);

  const authUrl =
    `https://${cleanShop}/admin/oauth/authorize` +
    `?client_id=${apiKey}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${encodeURIComponent(state)}`;

  // Break out of iframe (Shopify's oauth page blocks iframes)
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>ShopLLMZ - Authenticating...</title>
    <script>
      try {
        if (window.top !== window.self) {
          window.top.location.href = ${JSON.stringify(authUrl)};
        } else {
          window.location.href = ${JSON.stringify(authUrl)};
        }
      } catch(e) {
        window.location.href = ${JSON.stringify(authUrl)};
      }
    </script>
  </head>
  <body style="background:#000;color:#fff;font-family:sans-serif;display:flex;align-items:center;justify-content:center;height:100vh;margin:0;">
    <p>Redirecting to Shopify for authorization...</p>
  </body>
</html>`;

  return new NextResponse(html, {
    status: 200,
    headers: { 'Content-Type': 'text/html' },
  });
}
