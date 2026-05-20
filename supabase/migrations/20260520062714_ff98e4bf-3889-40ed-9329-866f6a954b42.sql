-- Create tables if they don't exist (fixing schema discrepancy)
CREATE TABLE IF NOT EXISTS public."Branding" (
    id TEXT NOT NULL DEFAULT 'singleton' PRIMARY KEY,
    "siteName" TEXT NOT NULL DEFAULT 'Basmar Doces',
    tagline TEXT,
    "logoUrl" TEXT,
    "faviconUrl" TEXT,
    "primaryColor" TEXT NOT NULL DEFAULT '#e91e63',
    "secondaryColor" TEXT NOT NULL DEFAULT '#9c27b0',
    "accentColor" TEXT NOT NULL DEFAULT '#ff4081',
    "backgroundColor" TEXT NOT NULL DEFAULT '#ffffff',
    "foregroundColor" TEXT NOT NULL DEFAULT '#0f172a',
    "fontHeading" TEXT NOT NULL DEFAULT 'Inter',
    "fontBody" TEXT NOT NULL DEFAULT 'Inter',
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Add new columns
ALTER TABLE public."Branding" 
ADD COLUMN IF NOT EXISTS "footerText" TEXT DEFAULT 'Sua parceira ideal para transformar qualquer comemoração em um momento mágico. Desde o doce até a decoração, estamos com você desde 1991.',
ADD COLUMN IF NOT EXISTS "footerLogo" TEXT,
ADD COLUMN IF NOT EXISTS "instagramUrl" TEXT,
ADD COLUMN IF NOT EXISTS "facebookUrl" TEXT,
ADD COLUMN IF NOT EXISTS "youtubeUrl" TEXT,
ADD COLUMN IF NOT EXISTS "whatsappPhone" TEXT DEFAULT '5511999999999',
ADD COLUMN IF NOT EXISTS "whatsappMessage" TEXT DEFAULT 'Olá! Gostaria de saber mais sobre os produtos da Basmar.',
ADD COLUMN IF NOT EXISTS "footerBgColor" TEXT DEFAULT '#0f172a',
ADD COLUMN IF NOT EXISTS "footerTextColor" TEXT DEFAULT '#ffffff',
ADD COLUMN IF NOT EXISTS "buttonBgColor" TEXT DEFAULT '#e91e63',
ADD COLUMN IF NOT EXISTS "buttonTextColor" TEXT DEFAULT '#ffffff';

-- Enable RLS
ALTER TABLE public."Branding" ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read branding" ON public."Branding" FOR SELECT USING (true);
