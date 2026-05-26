-- Rename Course table
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'Course') THEN
        ALTER TABLE "Course" RENAME TO "courses";
    END IF;
END $$;

-- Rename Course columns
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'coverImage') THEN
        ALTER TABLE "courses" RENAME COLUMN "coverImage" TO "cover_image";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'registrationStart') THEN
        ALTER TABLE "courses" RENAME COLUMN "registrationStart" TO "registration_start";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'registrationEnd') THEN
        ALTER TABLE "courses" RENAME COLUMN "registrationEnd" TO "registration_end";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'whatsappMsg') THEN
        ALTER TABLE "courses" RENAME COLUMN "whatsappMsg" TO "whatsapp_msg";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'showInHome') THEN
        ALTER TABLE "courses" RENAME COLUMN "showInHome" TO "show_in_home";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'createdAt') THEN
        ALTER TABLE "courses" RENAME COLUMN "createdAt" TO "created_at";
    END IF;
    IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'courses' AND column_name = 'updatedAt') THEN
        ALTER TABLE "courses" RENAME COLUMN "updatedAt" TO "updated_at";
    END IF;
END $$;
