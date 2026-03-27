/**
 * Shopify Session Token Verification Utility
 * 
 * Verifies Shopify-issued JWT session tokens for embedded app API routes.
 * Shopify's automated checks look for this pattern to confirm session token usage.
 * 
 * Usage in API routes:
 *   const shop = await verifySessionToken(request);
 *   if (!shop) return new NextResponse('Unauthorized', { status: 401 });
 */

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const env = (typeof process !== 'undefined' ? process.env : {}) as Record<string, string | undefined>;
const SHOPIFY_API_KEY = env.SHOPIFY_API_KEY || '';
const SHOPIFY_API_SECRET = env.SHOPIFY_API_SECRET || '';

interface SessionTokenPayload {
  iss: string;   // e.g. "https://my-store.myshopify.com/admin"
  dest: string;  // e.g. "https://my-store.myshopify.com"
  aud: string;   // client_id / api_key
  sub: string;   // user ID
  exp: number;   // expiry timestamp
  nbf: number;   // not before timestamp
  iat: number;   // issued at timestamp
  jti: string;   // JWT ID
  sid: string;   // session ID
}

/**
 * Extract and verify a Shopify session token from the Authorization header.
 * Returns the shop domain string on success, or null on failure.
 */
export async function verifySessionToken(request: Request): Promise<string | null> {
  try {
    const authHeader = request.headers.get('Authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return null;
    }

    const token = authHeader.replace('Bearer ', '').trim();
    if (!token) return null;

    // Decode the JWT without verification first to get header/payload
    const parts = token.split('.');
    if (parts.length !== 3) return null;

    const payloadBase64 = parts[1];
    const base64 = payloadBase64.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
    const payloadJson = decodeURIComponent(atob(padded).split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''));
    const payload: SessionTokenPayload = JSON.parse(payloadJson);

    // Validate audience matches our API key
    if (payload.aud !== SHOPIFY_API_KEY) {
      console.warn('[SessionToken] Audience mismatch:', payload.aud, '!==', SHOPIFY_API_KEY);
      return null;
    }

    // Validate expiry
    const now = Math.floor(Date.now() / 1000);
    if (payload.exp < now) {
      console.warn('[SessionToken] Token expired at', payload.exp, 'current:', now);
      return null;
    }

    // Validate not-before
    if (payload.nbf > now) {
      console.warn('[SessionToken] Token not yet valid (nbf):', payload.nbf);
      return null;
    }

    // Verify the HMAC signature using the API secret
    const isValid = await verifyHmacSignature(token, SHOPIFY_API_SECRET);
    if (!isValid) {
      console.warn('[SessionToken] HMAC signature verification failed');
      return null;
    }

    // Extract shop from `dest` field (e.g. "https://my-store.myshopify.com")
    const dest = payload.dest;
    const shopMatch = dest.match(/https?:\/\/([^/]+)/);
    if (!shopMatch) return null;

    return shopMatch[1]; // e.g. "my-store.myshopify.com"
  } catch (err) {
    console.error('[SessionToken] Verification error:', err);
    return null;
  }
}

/**
 * Verify the JWT's HMAC-SHA256 signature using the Shopify API secret.
 */
async function verifyHmacSignature(token: string, secret: string): Promise<boolean> {
  try {
    const parts = token.split('.');
    const header = parts[0];
    const payload = parts[1];
    const signature = parts[2];

    const encoder = new TextEncoder();
    const key = await crypto.subtle.importKey(
      'raw',
      encoder.encode(secret),
      { name: 'HMAC', hash: 'SHA-256' },
      false,
      ['verify']
    );

    const data = encoder.encode(`${header}.${payload}`);
    const sig = base64UrlToUint8Array(signature);

    return await crypto.subtle.verify('HMAC', key, sig as unknown as ArrayBuffer, data);
  } catch {
    return false;
  }
}

function base64UrlToUint8Array(base64url: string): Uint8Array {
  const base64 = base64url.replace(/-/g, '+').replace(/_/g, '/');
  const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), '=');
  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes;
}
