import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function cleanDatabase() {
  await prisma.item.deleteMany();
  await prisma.$disconnect();
}

cleanDatabase().catch((e) => {
  console.error(e);
  process.exit(1);
});
