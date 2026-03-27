import { NextResponse, NextRequest } from 'next/server';
import { sessionStorage, shopify } from '@/lib/shopify';
import { createHmac, timingSafeEqual } from 'crypto';

export const dynamic = 'force-dynamic';

/**
 * Verifies the OAuth callback HMAC signature from Shopify.
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

/**
 * Verifies that the state was signed by us (CSRF protection without cookies/DB).
 * State format: base64url(shop:timestamp).hmac_hex
 */
function verifySignedState(state: string, secret: string): { valid: boolean; shop?: string } {
  try {
    const dotIdx = state.lastIndexOf('.');
    if (dotIdx === -1) return { valid: false };

    const payload = state.substring(0, dotIdx);
    const receivedSig = state.substring(dotIdx + 1);

    const expectedSig = createHmac('sha256', secret).update(payload).digest('hex');

    const a = Buffer.from(expectedSig, 'utf-8');
    const b = Buffer.from(receivedSig, 'utf-8');
    if (a.length !== b.length) return { valid: false };

    const sigValid = (() => { try { return timingSafeEqual(a, b); } catch { return false; } })();
    if (!sigValid) return { valid: false };

    // Decode and validate payload
    const decoded = Buffer.from(payload, 'base64url').toString('utf-8');
    const [shop, tsStr] = decoded.split(':');
    if (!shop || !tsStr) return { valid: false };

    // State must not be older than 10 minutes
    const ts = parseInt(tsStr, 10);
    const age = Date.now() - ts;
    if (age > 10 * 60 * 1000) return { valid: false };

    return { valid: true, shop };
  } catch {
    return { valid: false };
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

    const cleanShop = shop.trim().toLowerCase().replace(/^https?:\/\//, '');

    const secret = process.env.SHOPIFY_API_SECRET;
    if (!secret) {
      return new NextResponse('Server configuration error.', { status: 500 });
    }

    // 1. Verify Shopify HMAC signature
    if (!verifyOAuthHmac(url.searchParams, secret)) {
      return new NextResponse('Unauthorized: invalid HMAC.', { status: 401 });
    }

    // 2. Verify signed state (no cookies or DB required!)
    if (!state) {
      return new NextResponse('Unauthorized: missing state parameter.', { status: 401 });
    }

    const stateResult = verifySignedState(state, secret);
    if (!stateResult.valid) {
      console.error(`Invalid state for shop: ${cleanShop}`);
      return new NextResponse('Unauthorized: invalid state.', { status: 401 });
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

    const tokenData = (await accessTokenResponse.json()) as { access_token: string };
    const { access_token } = tokenData;

    // 4. Build Shopify SDK Session and persist to database
    const sessionId = shopify.session.getOfflineId(shop);
    const session = shopify.session.customAppSession(shop);
    session.accessToken = access_token;
    session.scope = process.env.SHOPIFY_SCOPES || 'read_products,write_themes,read_themes';
    session.state = state;

    await sessionStorage.storeSession(session);

    console.log(`✅ OAuth Success — Shop: ${shop}, Session ID: ${sessionId}`);

    // 5. Redirect to the dashboard with the shop param
    const hostName = process.env.HOST_NAME || 'https://www.shopllmz.com';
    const redirectUrl = `${hostName}/dashboard?shop=${encodeURIComponent(shop)}`;
    const response = NextResponse.redirect(redirectUrl);

    response.cookies.set('shopify_app_session', session.id, {
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
