CREATE TABLE IF NOT EXISTS "SeasonalBanner" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "imageDesktop" TEXT NOT NULL,
    "imageMobile" TEXT,
    "buttonText" TEXT,
    "buttonLink" TEXT,
    "startDate" TIMESTAMP WITH TIME ZONE,
    "endDate" TIMESTAMP WITH TIME ZONE,
    "active" BOOLEAN DEFAULT TRUE,
    "isDefault" BOOLEAN DEFAULT FALSE,
    "fontFamily" TEXT DEFAULT 'Inter',
    "fontSize" TEXT DEFAULT '4xl md:text-6xl lg:text-8xl',
    "transitionTime" INTEGER DEFAULT 5000,
    "transitionType" TEXT DEFAULT 'fade',
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "GalleryItem" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "image" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[] DEFAULT '{}',
    "active" BOOLEAN DEFAULT TRUE,
    "showInHome" BOOLEAN DEFAULT TRUE,
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "CompanyHistory" (
    "id" TEXT PRIMARY KEY DEFAULT 'singleton',
    "title" TEXT NOT NULL DEFAULT 'Nossa História',
    "content" TEXT NOT NULL,
    "mainImage" TEXT,
    "gallery" TEXT[] DEFAULT '{}',
    "timeline" JSONB DEFAULT '[]'::JSONB,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "FAQ" (
    "id" TEXT PRIMARY KEY,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "active" BOOLEAN DEFAULT TRUE,
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Testimonial" (
    "id" TEXT PRIMARY KEY,
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "image" TEXT,
    "source" TEXT,
    "active" BOOLEAN DEFAULT TRUE,
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "WhatsAppClick" (
    "id" TEXT PRIMARY KEY,
    "type" TEXT NOT NULL,
    "relatedId" TEXT,
    "origin" TEXT,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS "Promotion" (
    "id" TEXT PRIMARY KEY,
    "title" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "price" TEXT,
    "oldPrice" TEXT,
    "description" TEXT,
    "whatsappMsg" TEXT,
    "active" BOOLEAN DEFAULT TRUE,
    "order" INTEGER DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Grant permissions
GRANT ALL ON ALL TABLES IN SCHEMA public TO authenticated;
GRANT ALL ON ALL TABLES IN SCHEMA public TO service_role;
GRANT ALL ON ALL TABLES IN SCHEMA public TO anon;
