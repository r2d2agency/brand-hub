-- Add videoUrl column to PegueMonte table with correct casing for Prisma
DO $$ 
BEGIN 
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='PegueMonte' AND column_name='videoUrl') THEN
        ALTER TABLE public."PegueMonte" ADD COLUMN "videoUrl" TEXT;
    END IF;
END $$;