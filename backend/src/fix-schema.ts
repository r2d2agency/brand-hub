import { prisma } from "./prisma.js";

export async function fixSchema() {
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

    console.log("Checking columns in Branding...");
    const brandingColumns = [
      { name: 'footerText', type: 'TEXT', default: "'Sua parceira ideal para transformar qualquer comemoração em um momento mágico. Desde o doce até a decoração, estamos com você desde 1991.'" },
      { name: 'footerLogo', type: 'TEXT', default: 'NULL' },
      { name: 'instagramUrl', type: 'TEXT', default: 'NULL' },
      { name: 'facebookUrl', type: 'TEXT', default: 'NULL' },
      { name: 'youtubeUrl', type: 'TEXT', default: 'NULL' },
      { name: 'instagramColor', type: 'TEXT', default: "'#e1306c'" },
      { name: 'facebookColor', type: 'TEXT', default: "'#1877f2'" },
      { name: 'youtubeColor', type: 'TEXT', default: "'#ff0000'" },
      { name: 'whatsappPhone', type: 'TEXT', default: "'5511999999999'" },
      { name: 'whatsappMessage', type: 'TEXT', default: "'Olá! Gostaria de saber mais sobre os produtos da Basmar.'" },
      { name: 'footerBgColor', type: 'TEXT', default: "'#0f172a'" },
      { name: 'footerTextColor', type: 'TEXT', default: "'#ffffff'" },
      { name: 'buttonBgColor', type: 'TEXT', default: "'#e91e63'" },
      { name: 'buttonTextColor', type: 'TEXT', default: "'#ffffff'" }
    ];

    for (const col of brandingColumns) {
      await prisma.$executeRawUnsafe(`
        DO $$ 
        BEGIN 
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Branding' AND column_name='${col.name}') THEN
            ALTER TABLE "Branding" ADD COLUMN "${col.name}" ${col.type} DEFAULT ${col.default};
          END IF;
        END $$;
      `);
    }

    console.log("Checking table NewsVideo...");
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "NewsVideo" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "youtubeUrl" TEXT NOT NULL,
        "thumbnail" TEXT NOT NULL,
        "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
        "orientation" TEXT NOT NULL DEFAULT 'horizontal',
        "active" BOOLEAN NOT NULL DEFAULT true,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,

        CONSTRAINT "NewsVideo_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log("Checking columns in CompanyHistory...");
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='CompanyHistory' AND column_name='gallery') THEN
          ALTER TABLE "CompanyHistory" ADD COLUMN "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[];
        END IF;
      END $$;
    `);
    console.log("Checking columns in PegueMonte...");
    await prisma.$executeRawUnsafe(`
      DO $$ 
      BEGIN 
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='PegueMonte' AND column_name='videoUrl') THEN
          ALTER TABLE "PegueMonte" ADD COLUMN "videoUrl" TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='PegueMonte' AND column_name='theme') THEN
          ALTER TABLE "PegueMonte" ADD COLUMN "theme" TEXT;
        END IF;
      END $$;
    `);

    console.log("Checking table Partner...");
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Partner" (
        "id" TEXT NOT NULL,
        "name" TEXT NOT NULL,
        "logo" TEXT NOT NULL,
        "description" TEXT,
        "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
        "active" BOOLEAN NOT NULL DEFAULT true,
        "showInHome" BOOLEAN NOT NULL DEFAULT true,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL,

        CONSTRAINT "Partner_pkey" PRIMARY KEY ("id")
      );
    `);

    console.log("Checking columns in Branding (extras)...");
    const extraBrandingCols = [
      { name: 'coursesIntro', type: 'TEXT', default: "'Aprenda com quem entende do assunto: workshops, oficinas e cursos para todos os níveis.'" },
      { name: 'seoTitle', type: 'TEXT', default: 'NULL' },
      { name: 'seoDescription', type: 'TEXT', default: 'NULL' },
      { name: 'seoKeywords', type: 'TEXT', default: 'NULL' },
      { name: 'seoOgImage', type: 'TEXT', default: 'NULL' },
      { name: 'seoAuthor', type: 'TEXT', default: 'NULL' },
      { name: 'gtmId', type: 'TEXT', default: 'NULL' },
      { name: 'gaId', type: 'TEXT', default: 'NULL' },
      { name: 'facebookPixelId', type: 'TEXT', default: 'NULL' },
      { name: 'headCode', type: 'TEXT', default: 'NULL' },
      { name: 'bodyCode', type: 'TEXT', default: 'NULL' },
    ];
    for (const col of extraBrandingCols) {
      await prisma.$executeRawUnsafe(`
        DO $$
        BEGIN
          IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Branding' AND column_name='${col.name}') THEN
            ALTER TABLE "Branding" ADD COLUMN "${col.name}" TEXT DEFAULT ${col.default};
          END IF;
        END $$;
      `);
    }

    console.log("Checking columns in Course...");
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Course' AND column_name='gallery') THEN
          ALTER TABLE "Course" ADD COLUMN "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[];
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Course' AND column_name='showInHome') THEN
          ALTER TABLE "Course" ADD COLUMN "showInHome" BOOLEAN DEFAULT true;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Course' AND column_name='time') THEN
          ALTER TABLE "Course" ADD COLUMN "time" TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='Course' AND column_name='whatsappMsg') THEN
          ALTER TABLE "Course" ADD COLUMN "whatsappMsg" TEXT;
        END IF;
      END $$;
    `);

    // PageView analytics table
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "PageView" (
        "id" SERIAL PRIMARY KEY,
        "path" TEXT NOT NULL,
        "sessionId" TEXT NOT NULL,
        "userAgent" TEXT,
        "referrer" TEXT,
        "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
      );
    `);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "PageView_createdAt_idx" ON "PageView" ("createdAt");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "PageView_path_idx" ON "PageView" ("path");`);
    await prisma.$executeRawUnsafe(`CREATE INDEX IF NOT EXISTS "PageView_session_idx" ON "PageView" ("sessionId");`);

    // ====== NEW: ProductCategory extras (icon, showInMenu) ======
    console.log("Checking columns in ProductCategory...");
    await prisma.$executeRawUnsafe(`
      DO $$
      BEGIN
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ProductCategory' AND column_name='icon') THEN
          ALTER TABLE "ProductCategory" ADD COLUMN "icon" TEXT;
        END IF;
        IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='ProductCategory' AND column_name='showInMenu') THEN
          ALTER TABLE "ProductCategory" ADD COLUMN "showInMenu" BOOLEAN DEFAULT true;
        END IF;
      END $$;
    `);

    // ====== NEW: Benefit table (rodapé de benefícios) ======
    console.log("Checking table Benefit...");
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Benefit" (
        "id" TEXT NOT NULL,
        "icon" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "subtitle" TEXT,
        "order" INTEGER NOT NULL DEFAULT 0,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Benefit_pkey" PRIMARY KEY ("id")
      );
    `);

    // ====== NEW: Inspiration table ======
    console.log("Checking table Inspiration...");
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "Inspiration" (
        "id" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "image" TEXT NOT NULL,
        "link" TEXT,
        "order" INTEGER NOT NULL DEFAULT 0,
        "active" BOOLEAN NOT NULL DEFAULT true,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "Inspiration_pkey" PRIMARY KEY ("id")
      );
    `);

    // ====== NEW: HomeBanner table (Cursos/Sobre destaque) ======
    console.log("Checking table HomeBanner...");
    await prisma.$executeRawUnsafe(`
      CREATE TABLE IF NOT EXISTS "HomeBanner" (
        "id" TEXT NOT NULL,
        "key" TEXT NOT NULL,
        "title" TEXT NOT NULL,
        "subtitle" TEXT,
        "description" TEXT,
        "image" TEXT,
        "ctaText" TEXT,
        "ctaLink" TEXT,
        "bgColor" TEXT DEFAULT '#1e3a8a',
        "textColor" TEXT DEFAULT '#ffffff',
        "active" BOOLEAN NOT NULL DEFAULT true,
        "order" INTEGER NOT NULL DEFAULT 0,
        "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
        CONSTRAINT "HomeBanner_pkey" PRIMARY KEY ("id")
      );
    `);
    await prisma.$executeRawUnsafe(`CREATE UNIQUE INDEX IF NOT EXISTS "HomeBanner_key_key" ON "HomeBanner" ("key");`);

    console.log("✅ Database schema fix completed successfully.");

  } catch (error) {
    console.error("❌ Error updating database schema:", error);
  }
}
