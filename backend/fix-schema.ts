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

    console.log("Checking columns in Store...");
    const storeColumns = [
      { name: 'city', type: 'TEXT' },
      { name: 'state', type: 'TEXT' },
      { name: 'zipCode', type: 'TEXT' },
      { name: 'latitude', type: 'DOUBLE PRECISION' },
      { name: 'longitude', type: 'DOUBLE PRECISION' }
    ];

    for (const col of storeColumns) {
      await prisma.$executeRawUnsafe(`
        DO $$ 
        BEGIN 
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Store' AND column_name='${col.name}') THEN
            ALTER TABLE "Store" ADD COLUMN "${col.name}" ${col.type};
          END IF;
        END $$;
      `);
    }

    console.log("Checking table Promotion...");
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Promotion" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "image" TEXT NOT NULL,
        "price" TEXT,
        "oldPrice" TEXT,
        "description" TEXT,
        "whatsappMsg" TEXT,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,

        CONSTRAINT "Promotion_pkey" PRIMARY KEY ("id")
      );
    `);

  } catch (error) {
    console.error("Error updating database schema:", error);
  } finally {
    await prisma.$disconnect();
  }
}

main();
