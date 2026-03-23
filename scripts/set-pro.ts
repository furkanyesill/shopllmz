import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function setPro() {
  try {
    const result = await prisma.lead.updateMany({
      data: { isPro: true },
    });
    console.log(`Updated ${result.count} leads to PRO status.`);
  } catch (error) {
    console.error('Failed to update leads:', error);
  } finally {
    await prisma.$disconnect();
  }
}

setPro();
