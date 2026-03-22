import { NextResponse } from 'next/server';
import { sessionStorage } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

const PLAN_PRICE = '9.99';
const PLAN_NAME = 'ShopLLMZ Pro';
const HOST_NAME = process.env.HOST_NAME || 'https://shopllmz.com';

export async function POST(req: Request) {
  try {
    const { shop } = await req.json();
    if (!shop) {
      return NextResponse.json({ error: 'Missing shop' }, { status: 400 });
    }

    // Load stored session from DB
    const sessionId = `offline_${shop}`;
    const session = await sessionStorage.loadSession(sessionId);

    if (!session?.accessToken) {
      return NextResponse.json({ error: 'Shop not authenticated. Please reinstall the app.' }, { status: 401 });
    }

    // Create a recurring application charge via Shopify Billing API
    const body = {
      recurring_application_charge: {
        name: PLAN_NAME,
        price: PLAN_PRICE,
        return_url: `${HOST_NAME}/api/billing/confirm?shop=${shop}`,
        trial_days: 7,
        test: process.env.NODE_ENV !== 'production', // test mode in dev
      },
    };

    const shopifyRes = await fetch(
      `https://${shop}/admin/api/2024-10/recurring_application_charges.json`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': session.accessToken as string,
        },
        body: JSON.stringify(body),
      }
    );

    if (!shopifyRes.ok) {
      const err = await shopifyRes.text();
      return NextResponse.json({ error: `Shopify billing error: ${err}` }, { status: 400 });
    }

    const data = await shopifyRes.json();
    const charge = data.recurring_application_charge;

    return NextResponse.json({
      confirmationUrl: charge.confirmation_url,
      chargeId: charge.id,
    });
  } catch (e) {
    const err = e as Error;
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
