-- Add storePhones to PegueMonte if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'PegueMonte' AND column_name = 'storePhones') THEN
        ALTER TABLE "PegueMonte" ADD COLUMN "storePhones" JSONB DEFAULT '[]'::JSONB;
    END IF;
END $$;

-- Add registration dates to Course if missing
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Course' AND column_name = 'registrationStart') THEN
        ALTER TABLE "Course" ADD COLUMN "registrationStart" TIMESTAMP WITH TIME ZONE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'Course' AND column_name = 'registrationEnd') THEN
        ALTER TABLE "Course" ADD COLUMN "registrationEnd" TIMESTAMP WITH TIME ZONE;
    END IF;
END $$;

-- Ensure Course status has correct values (if it's an enum, we might need to handle it, but in Postgres it's often a text or a created type)
-- In the schema it's an enum CourseStatus. Let's check if the type exists and has the values.
DO $$
BEGIN
    IF NOT EXISTS (SELECT 1 FROM pg_type WHERE typname = 'CourseStatus') THEN
        CREATE TYPE "CourseStatus" AS ENUM ('SOON', 'OPEN', 'CLOSED');
    ELSE
        -- Add missing values if any
        BEGIN
            ALTER TYPE "CourseStatus" ADD VALUE IF NOT EXISTS 'SOON';
            ALTER TYPE "CourseStatus" ADD VALUE IF NOT EXISTS 'OPEN';
            ALTER TYPE "CourseStatus" ADD VALUE IF NOT EXISTS 'CLOSED';
        EXCEPTION
            WHEN OTHERS THEN NULL; -- Ignore if value exists
        END;
    END IF;
END $$;
