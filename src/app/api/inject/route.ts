/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextResponse } from 'next/server';
import { sessionStorage } from '@/lib/shopify';

export const dynamic = 'force-dynamic';

// Inject AI-optimized JSON-LD into the shop's theme via Shopify Asset API
export async function POST(req: Request) {
  try {
    const { shop, jsonLd, llmsTxt } = await req.json();

    if (!shop) {
      return NextResponse.json({ error: 'Missing shop parameter' }, { status: 400 });
    }

    const sessionId = `offline_${shop}`;
    const session = await sessionStorage.loadSession(sessionId);

    if (!session?.accessToken) {
      return NextResponse.json(
        { error: 'Shop not authenticated. Please reinstall the app.' },
        { status: 401 }
      );
    }

    const token = session.accessToken as string;
    const results: Record<string, string> = {};

    // 1. Get the active theme ID
    const themesRes = await fetch(`https://${shop}/admin/api/2024-10/themes.json`, {
      headers: { 'X-Shopify-Access-Token': token },
    });
    const themesData = await themesRes.json();
    const activeTheme = (themesData.themes || []).find((t: any) => t.role === 'main');

    if (!activeTheme) {
      return NextResponse.json({ error: 'No active theme found.' }, { status: 404 });
    }

    const themeId = activeTheme.id;

    // 2. Inject llms.txt as a theme asset (accessible at /llms.txt via URL rewriting)
    if (llmsTxt) {
      const llmsRes = await fetch(
        `https://${shop}/admin/api/2024-10/themes/${themeId}/assets.json`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': token,
          },
          body: JSON.stringify({
            asset: {
              key: 'assets/shopllmz-llms.txt',
              value: llmsTxt,
            },
          }),
        }
      );
      results.llmsTxt = llmsRes.ok ? 'injected' : 'failed';
    }

    // 3. Inject JSON-LD snippet into theme snippets
    if (jsonLd) {
      const snippetRes = await fetch(
        `https://${shop}/admin/api/2024-10/themes/${themeId}/assets.json`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': token,
          },
          body: JSON.stringify({
            asset: {
              key: 'snippets/shopllmz-json-ld.liquid',
              value: `<script type="application/ld+json">\n${jsonLd}\n</script>`,
            },
          }),
        }
      );
      results.jsonLd = snippetRes.ok ? 'injected' : 'failed';
    }

    return NextResponse.json({
      success: true,
      themeId,
      themeName: activeTheme.name,
      results,
    });
  } catch (e) {
    const err = e as Error;
    console.error('Inject Error:', err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
