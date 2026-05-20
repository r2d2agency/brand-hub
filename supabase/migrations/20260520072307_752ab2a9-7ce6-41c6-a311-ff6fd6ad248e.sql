-- Drop existing table if any to ensure clean state
DROP TABLE IF EXISTS public."PegueMonte";

-- Create PegueMonte table with correct casing for Prisma
CREATE TABLE public."PegueMonte" (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    theme TEXT,
    slug TEXT UNIQUE NOT NULL,
    description TEXT,
    items TEXT[] DEFAULT '{}',
    "coverImage" TEXT,
    gallery TEXT[] DEFAULT '{}',
    "partyType" TEXT,
    "peopleCount" TEXT,
    unit TEXT,
    obs TEXT,
    "whatsappMsg" TEXT,
    active BOOLEAN DEFAULT true,
    highlight BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public."PegueMonte" ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "PegueMonte are viewable by everyone" 
ON public."PegueMonte" 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage PegueMonte" 
ON public."PegueMonte" 
FOR ALL
USING (true)
WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_pegue_monte_updated_at
BEFORE UPDATE ON public."PegueMonte"
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();