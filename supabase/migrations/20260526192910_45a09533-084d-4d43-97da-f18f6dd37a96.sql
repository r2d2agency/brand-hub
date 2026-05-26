-- Renomear tabelas se existirem com nomes diferentes
DO $$
BEGIN
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'courses') THEN
        ALTER TABLE public.courses RENAME TO "Course";
    END IF;
    
    IF EXISTS (SELECT 1 FROM information_schema.tables WHERE table_schema = 'public' AND table_name = 'pegue_monte') THEN
        ALTER TABLE public.pegue_monte RENAME TO "PegueMonte";
    END IF;
END $$;

-- Garantir que as tabelas existem (caso não existissem antes)
CREATE TABLE IF NOT EXISTS public."Course" (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    "coverImage" TEXT,
    gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
    date TIMESTAMP WITH TIME ZONE,
    "time" TEXT,
    location TEXT,
    instructor TEXT,
    "registrationStart" TIMESTAMP WITH TIME ZONE,
    "registrationEnd" TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'SOON',
    "whatsappMsg" TEXT,
    active BOOLEAN DEFAULT true,
    "showInHome" BOOLEAN DEFAULT true,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

CREATE TABLE IF NOT EXISTS public."PegueMonte" (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    theme TEXT,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    items TEXT[] DEFAULT ARRAY[]::TEXT[],
    "videoUrl" TEXT,
    "coverImage" TEXT,
    gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
    "partyType" TEXT,
    "peopleCount" TEXT,
    unit TEXT,
    obs TEXT,
    "whatsappMsg" TEXT,
    active BOOLEAN DEFAULT true,
    highlight BOOLEAN DEFAULT false,
    "storePhones" JSONB DEFAULT '[]'::JSONB,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT now(),
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Garantir permissões
GRANT ALL ON public."Course" TO authenticated, service_role, anon;
GRANT ALL ON public."PegueMonte" TO authenticated, service_role, anon;
