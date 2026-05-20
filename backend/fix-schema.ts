import { PrismaClient } from "@prisma/client";
const prisma = new PrismaClient();

async function main() {
  try {
    console.log("Checking columns in SeasonalBanner...");
    
    // Check and add 'order' column
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='SeasonalBanner' AND column_name='order') THEN
          ALTER TABLE "SeasonalBanner" ADD COLUMN "order" INTEGER DEFAULT 0;
        END IF;
      END $$;
    `);

    // Check and add 'active' column
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='SeasonalBanner' AND column_name='active') THEN
          ALTER TABLE "SeasonalBanner" ADD COLUMN "active" BOOLEAN DEFAULT true;
        END IF;
      END $$;
    `);

    // Check and add 'isDefault' column
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='SeasonalBanner' AND column_name='isDefault') THEN
          ALTER TABLE "SeasonalBanner" ADD COLUMN "isDefault" BOOLEAN DEFAULT false;
        END IF;
      END $$;
    `);

    // Check and add 'fontFamily' column
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='SeasonalBanner' AND column_name='fontFamily') THEN
          ALTER TABLE "SeasonalBanner" ADD COLUMN "fontFamily" TEXT DEFAULT 'Inter';
        END IF;
      END $$;
    `);

    // Check and add 'fontSize' column
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='SeasonalBanner' AND column_name='fontSize') THEN
          ALTER TABLE "SeasonalBanner" ADD COLUMN "fontSize" TEXT DEFAULT '4xl md:text-6xl lg:text-8xl';
        END IF;
      END $$;
    `);

    // Check and add 'transitionTime' column
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='SeasonalBanner' AND column_name='transitionTime') THEN
          ALTER TABLE "SeasonalBanner" ADD COLUMN "transitionTime" INTEGER DEFAULT 5000;
        END IF;
      END $$;
    `);

    // Check and add 'transitionType' column
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='SeasonalBanner' AND column_name='transitionType') THEN
          ALTER TABLE "SeasonalBanner" ADD COLUMN "transitionType" TEXT DEFAULT 'fade';
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
