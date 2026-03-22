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
  const hostName = process.env.HOST_NAME || 'https://shopllmz.com';
  const redirectUri = `${hostName}/api/auth/callback`;

  // Generate a random nonce
  const state = Math.random().toString(36).substring(2) + Date.now().toString(36);

  const authUrl =
    `https://${cleanShop}/admin/oauth/authorize` +
    `?client_id=${apiKey}` +
    `&scope=${encodeURIComponent(scopes)}` +
    `&redirect_uri=${encodeURIComponent(redirectUri)}` +
    `&state=${state}`;

  const response = NextResponse.redirect(authUrl);

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
