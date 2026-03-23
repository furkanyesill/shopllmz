import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const url = new URL(req.url);
  const shop = url.searchParams.get('shop');
  
  if (!shop) {
    return new NextResponse('console.log("ShopLLMZ: No shop identifier provided");', { 
      headers: { 'Content-Type': 'application/javascript' }
    });
  }

  try {
    /* eslint-disable @typescript-eslint/no-explicit-any */
    const lead = await (prisma as any).lead.findUnique({ where: { shop } });
    
    // Only inject schema if they have one and are actively paying (Pro)
    if (lead && lead.aiSchema && lead.isPro) {
      const jsInjection = `
        (function() {
          if(document.getElementById('shopllmz-aeo-dynamic')) return;
          var script = document.createElement('script');
          script.type = 'application/ld+json';
          script.id = 'shopllmz-aeo-dynamic';
          script.innerHTML = ${JSON.stringify(lead.aiSchema)};
          document.head.appendChild(script);
          console.log('ShopLLMZ Zero-Footprint AEO initialized.');
        })();
      `;
      return new NextResponse(jsInjection, {
         headers: { 'Content-Type': 'application/javascript', 'Cache-Control': 'no-cache, no-store, must-revalidate' }
      });
    }
    
    return new NextResponse('console.log("ShopLLMZ AEO: No active schema or Pro plan found.");', {
         headers: { 'Content-Type': 'application/javascript', 'Cache-Control': 'no-cache, no-store, must-revalidate' }
    });
  } catch (err) {
    console.error(err);
    return new NextResponse('console.error("ShopLLMZ Database connection error.");', {
      headers: { 'Content-Type': 'application/javascript' }
   });
  }
}
