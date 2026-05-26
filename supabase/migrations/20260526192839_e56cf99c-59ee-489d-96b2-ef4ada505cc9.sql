-- Garantir que a tabela courses existe com a estrutura correta
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    cover_image TEXT,
    gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
    date TIMESTAMP WITH TIME ZONE,
    "time" TEXT,
    location TEXT,
    instructor TEXT,
    registration_start TIMESTAMP WITH TIME ZONE,
    registration_end TIMESTAMP WITH TIME ZONE,
    status TEXT DEFAULT 'SOON',
    whatsapp_msg TEXT,
    active BOOLEAN DEFAULT true,
    show_in_home BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Garantir que a tabela pegue_monte existe com a estrutura correta
CREATE TABLE IF NOT EXISTS public.pegue_monte (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    theme TEXT,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    items TEXT[] DEFAULT ARRAY[]::TEXT[],
    video_url TEXT,
    cover_image TEXT,
    gallery TEXT[] DEFAULT ARRAY[]::TEXT[],
    "partyType" TEXT,
    "peopleCount" TEXT,
    unit TEXT,
    obs TEXT,
    whatsapp_msg TEXT,
    active BOOLEAN DEFAULT true,
    highlight BOOLEAN DEFAULT false,
    store_phones JSONB DEFAULT '[]'::JSONB,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Garantir permissões para todos os papéis necessários
GRANT ALL ON public.courses TO authenticated, service_role, anon;
GRANT ALL ON public.pegue_monte TO authenticated, service_role, anon;

-- Caso as tabelas já existam mas sem algumas colunas, adicioná-las defensivamente
DO $$
BEGIN
    -- Courses
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='registration_start') THEN
        ALTER TABLE public.courses ADD COLUMN registration_start TIMESTAMP WITH TIME ZONE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='registration_end') THEN
        ALTER TABLE public.courses ADD COLUMN registration_end TIMESTAMP WITH TIME ZONE;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='courses' AND column_name='whatsapp_msg') THEN
        ALTER TABLE public.courses ADD COLUMN whatsapp_msg TEXT;
    END IF;

    -- Pegue Monte
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pegue_monte' AND column_name='store_phones') THEN
        ALTER TABLE public.pegue_monte ADD COLUMN store_phones JSONB DEFAULT '[]'::JSONB;
    END IF;
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name='pegue_monte' AND column_name='video_url') THEN
        ALTER TABLE public.pegue_monte ADD COLUMN video_url TEXT;
    END IF;
END $$;
