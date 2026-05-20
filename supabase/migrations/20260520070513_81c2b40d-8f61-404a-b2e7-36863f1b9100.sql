-- Drop previous attempt if it exists
DROP TABLE IF EXISTS public."Partner";
DROP TABLE IF EXISTS public.Partner;

-- Create Partner table matching Prisma's name and case
CREATE TABLE public.Partner (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    logo TEXT NOT NULL,
    "description" TEXT,
    gallery TEXT[] DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    "showInHome" BOOLEAN DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public.Partner ENABLE ROW LEVEL SECURITY;

-- Create policies (keeping public access for now as per project pattern)
CREATE POLICY "Partners are viewable by everyone" 
ON public.Partner 
FOR SELECT 
USING (true);

CREATE POLICY "Admins can manage partners" 
ON public.Partner 
FOR ALL
USING (true)
WITH CHECK (true);

-- Trigger for updated_at
CREATE TRIGGER update_partner_updated_at
BEFORE UPDATE ON public.Partner
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();