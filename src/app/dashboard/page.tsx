import { prisma } from "@/lib/prisma";
import ClientPage from "./ClientPage";

export const dynamic = "force-dynamic";

export default async function DashboardPage({ searchParams }: { searchParams: any }) {
  // Await searchParams to support both Next.js 14 and 15 safely
  const params = await Promise.resolve(searchParams);
  const shop = params?.shop || null;
  
  let isPro = false;
  
  if (shop) {
    const lead = await (prisma as any).lead.findUnique({ where: { shop } });
    if (lead?.isPro) {
      isPro = true;
    }
  }

  return <ClientPage initialShop={shop} initialIsPro={isPro} />;
}
