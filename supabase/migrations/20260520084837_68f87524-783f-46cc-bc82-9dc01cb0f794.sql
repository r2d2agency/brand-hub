
CREATE TABLE IF NOT EXISTS public."PageView" (
  "id" SERIAL PRIMARY KEY,
  "path" TEXT NOT NULL,
  "sessionId" TEXT NOT NULL,
  "userAgent" TEXT,
  "referrer" TEXT,
  "createdAt" TIMESTAMPTZ NOT NULL DEFAULT now()
);

CREATE INDEX IF NOT EXISTS "PageView_createdAt_idx" ON public."PageView" ("createdAt");
CREATE INDEX IF NOT EXISTS "PageView_path_idx" ON public."PageView" ("path");
CREATE INDEX IF NOT EXISTS "PageView_session_idx" ON public."PageView" ("sessionId");

ALTER TABLE public."PageView" ENABLE ROW LEVEL SECURITY;

CREATE POLICY "PageView readable by everyone"
  ON public."PageView" FOR SELECT
  USING (true);

CREATE POLICY "PageView insertable by everyone"
  ON public."PageView" FOR INSERT
  WITH CHECK (true);
