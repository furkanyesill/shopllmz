import { NextResponse, NextRequest } from 'next/server';
import { sessionStorage, shopify } from '@/lib/shopify';
import { createHmac, timingSafeEqual } from 'crypto';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

/**
 * Verifies the OAuth callback HMAC signature from Shopify.
 * Required by: https://shopify.dev/docs/apps/launch/shopify-app-store/best-practices#a-authentication
 */
function verifyOAuthHmac(queryParams: URLSearchParams, secret: string): boolean {
  const receivedHmac = queryParams.get('hmac');
  if (!receivedHmac) return false;

  const pairs: string[] = [];
  queryParams.forEach((value, key) => {
    if (key !== 'hmac') {
      pairs.push(`${encodeURIComponent(key)}=${encodeURIComponent(value)}`);
    }
  });
  pairs.sort();
  const message = pairs.join('&');

  const generatedHmac = createHmac('sha256', secret).update(message).digest('hex');
  const a = Buffer.from(generatedHmac, 'utf-8');
  const b = Buffer.from(receivedHmac, 'utf-8');
  if (a.length !== b.length) return false;
  try {
    return timingSafeEqual(a, b);
  } catch {
    return false;
  }
}

export async function GET(req: NextRequest) {
  try {
    const url = new URL(req.url);
    const shop = url.searchParams.get('shop');
    const code = url.searchParams.get('code');
    const state = url.searchParams.get('state');

    if (!shop || !code) {
      return new NextResponse('Missing required OAuth callback parameters.', { status: 400 });
    }

    const secret = process.env.SHOPIFY_API_SECRET;
    if (!secret) {
      return new NextResponse('Server configuration error.', { status: 500 });
    }

    // 1. Verify the HMAC signature on the OAuth callback
    if (!verifyOAuthHmac(url.searchParams, secret)) {
      return new NextResponse('Unauthorized: invalid HMAC.', { status: 401 });
    }

    // 2. Verify the state nonce matches what we set in the cookie
    const cookieStore = await cookies();
    const storedState = cookieStore.get('shopify_oauth_state')?.value;
    if (!storedState || !state) {
      return new NextResponse('Unauthorized: missing state.', { status: 401 });
    }
    const aBuf = Buffer.from(storedState, 'utf-8');
    const bBuf = Buffer.from(state, 'utf-8');
    const stateValid = aBuf.length === bBuf.length && (() => { try { return timingSafeEqual(aBuf, bBuf); } catch { return false; } })();
    if (!stateValid) {
      return new NextResponse('Unauthorized: state mismatch.', { status: 401 });
    }

    // 3. Exchange the authorization code for a permanent access token
    const accessTokenResponse = await fetch(`https://${shop}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: process.env.SHOPIFY_API_KEY,
        client_secret: secret,
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

    // 4. Build Shopify SDK Session and persist to Neon Postgres
    const sessionId = shopify.session.getOfflineId(shop);
    const session = shopify.session.customAppSession(shop);
    session.accessToken = access_token;
    session.scope = process.env.SHOPIFY_SCOPES || 'read_products,write_themes,read_themes';
    session.state = state;

    await sessionStorage.storeSession(session);

    console.log(`✅ OAuth Success — Shop: ${shop}, Session ID: ${sessionId}`);

    // 5. Redirect into Shopify Admin embedded app
    const redirectUrl = `https://${shop}/admin/apps/shopllmz`;
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set('shopify_app_session', session.id, {
      httpOnly: true,
      sameSite: 'none',
      secure: true,
      maxAge: 60 * 60 * 24 * 7,
      path: '/',
    });

    // Clear the state nonce cookie
    response.cookies.delete('shopify_oauth_state');

    return response;
  } catch (e) {
    const err = e as Error;
    console.error('OAuth Callback Error:', err);
    return new NextResponse(`OAuth error: ${err.message}`, { status: 500 });
  }
}
