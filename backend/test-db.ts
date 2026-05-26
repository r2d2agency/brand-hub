
import { PrismaClient } from '@prisma/client';

async function test() {
  const prisma = new PrismaClient();
  try {
    const result = await prisma.$queryRaw`SELECT column_name FROM information_schema.columns WHERE table_name = 'PegueMonte'`;
    console.log('Columns in PegueMonte:', result);
    
    // Try a simple select
    const pms = await prisma.pegueMonte.findMany({ take: 1 });
    console.log('Success findMany PegueMonte');
  } catch (err) {
    console.error('Error in Prisma test:', err);
  } finally {
    await prisma.$disconnect();
  }
}

test();
