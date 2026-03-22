import { sessionStorage } from '@/lib/shopify';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const shop = url.searchParams.get('shop');
    const chargeId = url.searchParams.get('charge_id');

    if (!shop || !chargeId) {
      return new Response('Missing parameters', { status: 400 });
    }

    const sessionId = `offline_${shop}`;
    const session = await sessionStorage.loadSession(sessionId);

    if (!session?.accessToken) {
      return new Response('Unauthorized', { status: 401 });
    }

    // Verify the charge status
    const chargeRes = await fetch(
      `https://${shop}/admin/api/2024-10/recurring_application_charges/${chargeId}.json`,
      {
        headers: { 'X-Shopify-Access-Token': session.accessToken as string },
      }
    );

    const chargeData = await chargeRes.json();
    const charge = chargeData.recurring_application_charge;

    if (charge?.status === 'active') {
      // Mark shop as Pro in our DB
      /* eslint-disable @typescript-eslint/no-explicit-any */
      await (prisma as any).lead.upsert({
        where: { shop },
        update: { isPro: true, chargeId: String(chargeId) },
        create: { shop, scans: 0, isPro: true, chargeId: String(chargeId) },
      });
    }

    // Redirect to dashboard
    return Response.redirect(`https://${shop}/admin/apps/shopllmz`);
  } catch (e) {
    const err = e as Error;
    return new Response(`Billing confirm error: ${err.message}`, { status: 500 });
  }
}
