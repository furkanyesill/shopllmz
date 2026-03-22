/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { shopify, sessionStorage } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const shop = url.searchParams.get('shop');
    
    if (!shop) {
      return new NextResponse('Missing shop parameter.', { status: 400 });
    }

    // Process the OAuth callback
    const callbackResponse = await shopify.auth.callback({
      rawRequest: req as any,
      rawResponse: new NextResponse() as any, // Not fully native App Router, needs manual header merging
    });

    const { session } = callbackResponse;
    
    // Store session in DB via Prisma
    await sessionStorage.storeSession(session);

    // Redirect to Dashboard
    return new NextResponse('Auth Successful! Redirecting...', {
      status: 302,
      headers: {
        Location: `/dashboard?shop=${shop}`,
        'Set-Cookie': `shopify_app_session=${session.id}; Path=/; HttpOnly; SameSite=Lax`,
      },
    });
  } catch (e: any) {
    console.error('OAuth Callback Error:', e);
    return new NextResponse(`OAuth error: ${e.message}`, { status: 500 });
  }
}

