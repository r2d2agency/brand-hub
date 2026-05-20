-- Create NewsVideo table
CREATE TABLE public."NewsVideo" (
    id TEXT NOT NULL PRIMARY KEY,
    title TEXT NOT NULL,
    "youtubeUrl" TEXT NOT NULL,
    thumbnail TEXT NOT NULL,
    tags TEXT[] DEFAULT ARRAY[]::TEXT[],
    orientation TEXT NOT NULL DEFAULT 'horizontal',
    active BOOLEAN NOT NULL DEFAULT true,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL,
    "updatedAt" TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP NOT NULL
);

-- Enable RLS
ALTER TABLE public."NewsVideo" ENABLE ROW LEVEL SECURITY;

-- Simple policies (assuming admin access via API which bypasses RLS if using service role, or we can add public read)
CREATE POLICY "News videos are viewable by everyone" ON public."NewsVideo" FOR SELECT USING (true);
