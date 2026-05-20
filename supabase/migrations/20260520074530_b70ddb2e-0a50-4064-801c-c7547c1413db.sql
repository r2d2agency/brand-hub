-- The error suggests the column might be missing or the case-sensitivity is wrong
-- Prisma uses double quotes for table names in SQL to preserve casing

-- First, ensure the table itself is correctly named in public schema
-- If it was created without quotes, it might be 'peguemonte' (lowercase)
-- Prisma expects "PegueMonte"

DO $$ 
BEGIN 
    -- Add videoUrl with double quotes to ensure casing matches Prisma's expectation
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='PegueMonte' AND column_name='videoUrl') THEN
        ALTER TABLE public."PegueMonte" ADD COLUMN "videoUrl" TEXT;
    END IF;
END $$;

-- Verify all other columns used in upsert exist and match casing
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='PegueMonte' AND column_name='coverImage') THEN
        ALTER TABLE public."PegueMonte" ADD COLUMN "coverImage" TEXT;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='PegueMonte' AND column_name='whatsappMsg') THEN
        ALTER TABLE public."PegueMonte" ADD COLUMN "whatsappMsg" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='PegueMonte' AND column_name='partyType') THEN
        ALTER TABLE public."PegueMonte" ADD COLUMN "partyType" TEXT;
    END IF;

    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='PegueMonte' AND column_name='peopleCount') THEN
        ALTER TABLE public."PegueMonte" ADD COLUMN "peopleCount" TEXT;
    END IF;
END $$;