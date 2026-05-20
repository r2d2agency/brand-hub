import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Checking columns in SeasonalBanner...");
    
    // Check if 'order' column exists, if not add it
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='SeasonalBanner' AND column_name='order') THEN
          ALTER TABLE "SeasonalBanner" ADD COLUMN "order" INTEGER DEFAULT 0;
        END IF;
      END $$;
    `);

    // Check if 'active' column exists, if not add it
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='SeasonalBanner' AND column_name='active') THEN
          ALTER TABLE "SeasonalBanner" ADD COLUMN "active" BOOLEAN DEFAULT true;
        END IF;
      END $$;
    `);
    
    console.log("Database schema updated successfully.");
  } catch (error) {
    console.error("Error updating database schema:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
