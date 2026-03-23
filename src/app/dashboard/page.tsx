import { prisma } from "@/lib/prisma";
import ClientPage from "./ClientPage";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: any }) {
  // Await searchParams to support both Next.js 14 and 15 safely
  const params = await Promise.resolve(searchParams);
  const shop = params?.shop || null;
  
  let isPro = false;
  
  if (shop) {
    try {
      // Ensure the merchant has a Lead record. For App Review, default to false.
      const lead = await (prisma as any).lead.upsert({
        where: { shop },
        create: { shop, isPro: false, scans: 0 },
        update: {} // Do not overwrite if exists
      });
      if (lead?.isPro) {
        isPro = true;
      }
    } catch (e) {
      console.error("Dashboard DB Init Error:", e);
    }
  }

  return <ClientPage initialShop={shop} initialIsPro={isPro} />;
}
