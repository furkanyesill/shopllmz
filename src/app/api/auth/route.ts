import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const shop = url.searchParams.get('shop');

  if (!shop) {
    return new NextResponse('Missing shop parameter.', { status: 400 });
  }

  // Basic shop format validation (must end in .myshopify.com or be a valid domain)
  const cleanShop = shop.trim().toLowerCase().replace(/^https?:\/\//, '');

  const apiKey = process.env.SHOPIFY_API_KEY || '';
  const scopes = process.env.SHOPIFY_SCOPES || 'read_products,write_themes,read_themes';
  const hostName = process.env.HOST_NAME || 'https://www.shopllmz.com';
  const redirectUri = `${hostName}/api/auth/callback`;

  // Generate a random nonce
  const state = Math.random().toString(36).substring(2) + Date.now().toString(36);

  const authUrl =
    `https://${cleanShop}/admin/oauth/authorize` +
    `?client_id=${apiKey}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}`;

  // We MUST break out of the iframe because Shopify's /admin/oauth/authorize sets X-Frame-Options: DENY.
  // Instead of an HTTP redirect, we return an HTML page that redirects the parent frame.
  const html = `<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8">
    <title>Shopify Redirect</title>
    <script>
      if (window.top !== window.self) {
        window.top.location.href = "${authUrl}";
      } else {
        window.location.href = "${authUrl}";
      }
    </script>
  </head>
  <body>
    <p>Redirecting to Shopify for authorization...</p>
    <p>If you are not redirected, <a href="${authUrl}" target="_top">click here</a>.</p>
  </body>
</html>`;

  const response = new NextResponse(html, {
    status: 200,
    headers: {
      'Content-Type': 'text/html',
    },
  });

  // Store state in cookie for verification at callback
  response.cookies.set('shopify_oauth_state', state, {
    httpOnly: true,
    sameSite: 'lax',
    secure: true,
    maxAge: 600,
    path: '/',
  });

  return response;
}
