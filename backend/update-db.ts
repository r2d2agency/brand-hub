import { prisma } from "./backend/src/prisma";

async function main() {
  try {
    console.log("Adding columns to SeasonalBanner...");
    await prisma.$executeRawUnsafe(`
      ALTER TABLE "SeasonalBanner" 
      ADD COLUMN IF NOT EXISTS "isDefault" BOOLEAN DEFAULT false,
      ADD COLUMN IF NOT EXISTS "fontFamily" TEXT DEFAULT 'Inter',
      ADD COLUMN IF NOT EXISTS "fontSize" TEXT DEFAULT '4xl md:text-6xl lg:text-8xl',
      ADD COLUMN IF NOT EXISTS "transitionTime" INTEGER DEFAULT 5000,
      ADD COLUMN IF NOT EXISTS "transitionType" TEXT DEFAULT 'fade';
    `);
    console.log("Columns added successfully.");
  } catch (error) {
    console.error("Error adding columns:", error);
    process.exit(1);
  } finally {
    await prisma.$disconnect();
  }
}

main();
