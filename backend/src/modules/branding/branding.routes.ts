import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../prisma.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";

export const brandingRouter = Router();

const updateSchema = z.object({
  siteName: z.string().min(1).optional(),
  tagline: z.string().nullish(),
  logoUrl: z.string().nullish(),
  faviconUrl: z.string().nullish(),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  accentColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  foregroundColor: z.string().optional(),
  fontHeading: z.string().optional(),
  fontBody: z.string().optional(),
  footerText: z.string().nullish(),
  footerLogo: z.string().nullish(),
  instagramUrl: z.string().nullish(),
  facebookUrl: z.string().nullish(),
  youtubeUrl: z.string().nullish(),
  whatsappPhone: z.string().nullish(),
  whatsappMessage: z.string().nullish(),
  footerBgColor: z.string().optional(),
  footerTextColor: z.string().optional(),
  buttonBgColor: z.string().optional(),
  buttonTextColor: z.string().optional(),
});

brandingRouter.get("/", async (_req, res, next) => {
  try {
    const branding = await prisma.branding.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton" },
    });
    res.json(branding);
  } catch (e) {
    next(e);
  }
});

brandingRouter.put("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = updateSchema.parse(req.body);
    const branding = await prisma.branding.upsert({
      where: { id: "singleton" },
      update: data,
      create: { id: "singleton", ...data },
    });
    res.json(branding);
  } catch (e) {
    next(e);
  }
});
