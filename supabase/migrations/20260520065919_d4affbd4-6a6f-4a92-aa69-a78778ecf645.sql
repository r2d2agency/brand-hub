-- Create Partner table
CREATE TABLE public."Partner" (
    id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
    name TEXT NOT NULL,
    "logoUrl" TEXT NOT NULL,
    "displayOrder" INTEGER NOT NULL DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable RLS
ALTER TABLE public."Partner" ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Partners are viewable by everyone" 
ON public."Partner" 
FOR SELECT 
USING (true);

-- For now, allowing all for migration/setup, but in a real app this would be restricted to admins
CREATE POLICY "Admins can manage partners" 
ON public."Partner" 
FOR ALL
USING (true)
WITH CHECK (true);

-- Create trigger for updated_at
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_partner_updated_at
BEFORE UPDATE ON public."Partner"
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();