-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
NEW.updated_at = now();
RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create a table for physical stores
CREATE TABLE public.stores (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  address TEXT NOT NULL,
  city TEXT NOT NULL,
  state TEXT NOT NULL,
  zip_code TEXT NOT NULL,
  latitude DOUBLE PRECISION,
  longitude DOUBLE PRECISION,
  phone TEXT,
  whatsapp TEXT,
  facade_url TEXT,
  is_active BOOLEAN NOT NULL DEFAULT true,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE public.stores ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (everyone can view active stores)
CREATE POLICY "Stores are viewable by everyone" 
ON public.stores 
FOR SELECT 
USING (is_active = true);

-- Create policies for admin access (assuming authenticated users can manage stores)
CREATE POLICY "Authenticated users can manage stores" 
ON public.stores 
FOR ALL 
USING (auth.role() = 'authenticated');

-- Create trigger for automatic timestamp updates
CREATE TRIGGER update_stores_updated_at
BEFORE UPDATE ON public.stores
FOR EACH ROW
EXECUTE FUNCTION public.update_updated_at_column();

-- Create storage bucket for store photos
INSERT INTO storage.buckets (id, name, public) VALUES ('store-facades', 'store-facades', true);

-- Create policies for storage access
CREATE POLICY "Store facades are publicly accessible" 
ON storage.objects 
FOR SELECT 
USING (bucket_id = 'store-facades');

CREATE POLICY "Authenticated users can upload store facades" 
ON storage.objects 
FOR INSERT 
WITH CHECK (bucket_id = 'store-facades' AND auth.role() = 'authenticated');
