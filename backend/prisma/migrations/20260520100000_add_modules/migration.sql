-- CreateEnum
CREATE TYPE "CourseStatus" AS ENUM ('SOON', 'OPEN', 'CLOSED');

-- AlterTable
ALTER TABLE "Branding" ALTER COLUMN "siteName" SET DEFAULT 'Basmar Doces',
ALTER COLUMN "primaryColor" SET DEFAULT '#e91e63',
ALTER COLUMN "secondaryColor" SET DEFAULT '#9c27b0',
ALTER COLUMN "accentColor" SET DEFAULT '#ff4081';

-- AlterTable
ALTER TABLE "Module" DROP COLUMN "config",
DROP COLUMN "icon",
ADD COLUMN     "showInHome" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "showInNav" BOOLEAN NOT NULL DEFAULT true;

-- CreateTable
CREATE TABLE "SeasonalBanner" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "subtitle" TEXT,
    "imageDesktop" TEXT NOT NULL,
    "imageMobile" TEXT,
    "buttonText" TEXT,
    "buttonLink" TEXT,
    "startDate" TIMESTAMP(3),
    "endDate" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SeasonalBanner_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProductCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "whatsappMsg" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "showInHome" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProductCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "PegueMonte" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "theme" TEXT,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "items" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "coverImage" TEXT,
    "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "partyType" TEXT,
    "peopleCount" TEXT,
    "unit" TEXT,
    "obs" TEXT,
    "whatsappMsg" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "highlight" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PegueMonte_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Course" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "description" TEXT,
    "coverImage" TEXT,
    "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "date" TIMESTAMP(3),
    "time" TEXT,
    "location" TEXT,
    "instructor" TEXT,
    "status" "CourseStatus" NOT NULL DEFAULT 'SOON',
    "whatsappMsg" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "showInHome" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Course_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "GalleryItem" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT,
    "image" TEXT NOT NULL,
    "description" TEXT,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "showInHome" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "GalleryItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Partner" (
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

-- CreateTable
CREATE TABLE "Store" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "neighborhood" TEXT,
    "phone" TEXT,
    "whatsapp" TEXT,
    "hours" TEXT,
    "mapsLink" TEXT,
    "images" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Store_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CompanyHistory" (
    "id" TEXT NOT NULL DEFAULT 'singleton',
    "title" TEXT NOT NULL DEFAULT 'Nossa História',
    "content" TEXT NOT NULL,
    "mainImage" TEXT,
    "gallery" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "timeline" JSONB NOT NULL DEFAULT '[]',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CompanyHistory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FAQ" (
    "id" TEXT NOT NULL,
    "question" TEXT NOT NULL,
    "answer" TEXT NOT NULL,
    "category" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FAQ_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Testimonial" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "image" TEXT,
    "source" TEXT,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Testimonial_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "WhatsAppClick" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "relatedId" TEXT,
    "origin" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "WhatsAppClick_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ProductCategory_slug_key" ON "ProductCategory"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "PegueMonte_slug_key" ON "PegueMonte"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Course_slug_key" ON "Course"("slug");
