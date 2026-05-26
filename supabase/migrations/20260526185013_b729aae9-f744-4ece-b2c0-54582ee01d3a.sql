-- Rename table to snake_case
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'PegueMonte') THEN
        ALTER TABLE "PegueMonte" RENAME TO "pegue_monte";
    END IF;
END $$;

-- Rename columns to snake_case if they exist in camelCase
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pegue_monte' AND column_name = 'storePhones') THEN
        ALTER TABLE "pegue_monte" RENAME COLUMN "storePhones" TO "store_phones";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pegue_monte' AND column_name = 'createdAt') THEN
        ALTER TABLE "pegue_monte" RENAME COLUMN "createdAt" TO "created_at";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pegue_monte' AND column_name = 'updatedAt') THEN
        ALTER TABLE "pegue_monte" RENAME COLUMN "updatedAt" TO "updated_at";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pegue_monte' AND column_name = 'coverImage') THEN
        ALTER TABLE "pegue_monte" RENAME COLUMN "coverImage" TO "cover_image";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pegue_monte' AND column_name = 'videoUrl') THEN
        ALTER TABLE "pegue_monte" RENAME COLUMN "videoUrl" TO "video_url";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pegue_monte' AND column_name = 'whatsappMsg') THEN
        ALTER TABLE "pegue_monte" RENAME COLUMN "whatsappMsg" TO "whatsapp_msg";
    END IF;
END $$;

-- Ensure store_phones exists
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'pegue_monte' AND column_name = 'store_phones') THEN
        ALTER TABLE "pegue_monte" ADD COLUMN "store_phones" JSONB DEFAULT '[]'::JSONB;
    END IF;
END $$;

-- Permissions
GRANT ALL ON TABLE "pegue_monte" TO authenticated;
GRANT ALL ON TABLE "pegue_monte" TO service_role;
GRANT ALL ON TABLE "pegue_monte" TO anon;
