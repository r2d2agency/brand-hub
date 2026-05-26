DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'PegueMonte' AND column_name = 'created_at') THEN
        ALTER TABLE "PegueMonte" RENAME COLUMN "created_at" TO "createdAt";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'PegueMonte' AND column_name = 'updated_at') THEN
        ALTER TABLE "PegueMonte" RENAME COLUMN "updated_at" TO "updatedAt";
    END IF;
END $$;
