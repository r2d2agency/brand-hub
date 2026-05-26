import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function main() {
  try {
    const tables = await prisma.$queryRaw`SELECT table_name FROM information_schema.tables WHERE table_schema = 'public'`;
    console.log('Tables in public schema:', tables);
    
    // Test access to courses
    try {
      const coursesCount = await prisma.course.count();
      console.log('Courses count:', coursesCount);
    } catch (e) {
      console.error('Failed to access Course model:', e.message);
    }
  } catch (err) {
    console.error('Error during check:', err);
  } finally {
    await prisma.$disconnect();
  }
}

main();
