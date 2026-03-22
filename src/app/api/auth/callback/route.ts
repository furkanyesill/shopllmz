import { NextResponse } from 'next/server';
import { sessionStorage } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const shop = url.searchParams.get('shop');
    const code = url.searchParams.get('code');
    const hmac = url.searchParams.get('hmac');

    if (!shop || !code || !hmac) {
      return new NextResponse('Missing required OAuth callback parameters.', { status: 400 });
    }

    // Exchange the authorization code for a permanent access token
    const accessTokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: process.env.SHOPIFY_API_SECRET,
        code,
      }),
    });

    if (!accessTokenResponse.ok) {
      const errText = await accessTokenResponse.text();
      console.error('Access token exchange failed:', errText);
      return new NextResponse(`Token exchange failed: ${errText}`, { status: 400 });
    }

    const tokenData = await accessTokenResponse.json() as { access_token: string };
    const { access_token } = tokenData;

    // Build a session compatible with @shopify/shopify-api PrismaSessionStorage
    const sessionId = `offline_${shop}`;
    const session = {
      id: sessionId,
      shop,
      state: url.searchParams.get('state') || '',
      isOnline: false,
      accessToken: access_token,
      scope: process.env.SHOPIFY_SCOPES || 'read_products,write_themes,read_themes',
    };

    // Persist session to database
    await sessionStorage.storeSession(session as Parameters<typeof sessionStorage.storeSession>[0]);

    console.log(`OAuth Success — Shop: ${shop}`);

    // Redirect to the Shopify Admin embedded app page
    const redirectUrl = `https://${shop}/admin/apps/shopllmz`;
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set('shopify_app_session', sessionId, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    return response;
  } catch (e) {
    const err = e as Error;
    console.error('OAuth Callback Error:', err);
    return new NextResponse(`OAuth error: ${err.message}`, { status: 500 });
  }
}
