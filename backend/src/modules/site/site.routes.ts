import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../prisma.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";

export const siteRouter = Router();

// Banners
siteRouter.get("/banners", async (_req, res, next) => {
  try {
    const now = new Date();
    
    // Buscar banners ativos que estão dentro do período programado
    let items = await prisma.seasonalBanner.findMany({
      where: {
        active: true,
        OR: [
          {
            AND: [
              { startDate: { lte: now } },
              { endDate: { gte: now } }
            ]
          },
          {
            AND: [
              { startDate: null },
              { endDate: null },
              { isDefault: false } // Banners normais sem data
            ]
          }
        ]
      },
      orderBy: { order: "asc" }
    });

    // Se não houver banners programados ativos, buscar o padrão
    if (items.length === 0) {
      items = await prisma.seasonalBanner.findMany({
        where: {
          active: true,
          isDefault: true
        },
        orderBy: { order: "asc" }
      });
    }

    res.json(items);
  } catch (e) { next(e); }
});

// Categories
siteRouter.get("/categories", async (_req, res, next) => {
  try {
    const items = await prisma.productCategory.findMany({
      where: { active: true },
      orderBy: { order: "asc" }
    });
    res.json(items);
  } catch (e) { next(e); }
});

siteRouter.get("/categories/:slug", async (req, res, next) => {
  try {
    const item = await prisma.productCategory.findUnique({
      where: { slug: req.params.slug }
    });
    if (!item) return res.status(404).json({ error: "Categoria não encontrada" });
    res.json(item);
  } catch (e) { next(e); }
});

// Pegue e Monte
siteRouter.get("/pegue-monte", async (_req, res, next) => {
  try {
    const items = await prisma.pegueMonte.findMany({
      where: { active: true },
      orderBy: { createdAt: "desc" }
    });
    res.json(items);
  } catch (e) { next(e); }
});

siteRouter.get("/pegue-monte/:slug", async (req, res, next) => {
  try {
    const item = await prisma.pegueMonte.findUnique({
      where: { slug: req.params.slug }
    });
    if (!item) return res.status(404).json({ error: "Kit não encontrado" });
    res.json(item);
  } catch (e) { next(e); }
});

// Courses
siteRouter.get("/courses", async (_req, res, next) => {
  try {
    const items = await prisma.course.findMany({
      where: { active: true },
      orderBy: { date: "asc" }
    });
    res.json(items);
  } catch (e) { next(e); }
});

// Stores
siteRouter.get("/stores", async (_req, res, next) => {
  try {
    const items = await prisma.store.findMany({
      where: { active: true },
      orderBy: { order: "asc" }
    });
    res.json(items);
  } catch (e) { next(e); }
});

// Promotions
siteRouter.get("/promotions", async (_req, res, next) => {
  try {
    const items = await prisma.promotion.findMany({
      where: { active: true },
      orderBy: { order: "asc" }
    });
    res.json(items);
  } catch (e) { next(e); }
});

// News Videos
siteRouter.get("/news-videos", async (_req, res, next) => {
  try {
    const items = await prisma.newsVideo.findMany({
      where: { active: true },
      orderBy: { order: "asc" }
    });
    res.json(items);
  } catch (e) { next(e); }
});

// Partners
siteRouter.get("/partners", async (_req, res, next) => {
  try {
    const items = await prisma.partner.findMany({
      where: { active: true },
      orderBy: { order: "asc" }
    });
    res.json(items);
  } catch (e) { next(e); }
});

// FAQ
siteRouter.get("/faq", async (_req, res, next) => {
  try {
    const items = await prisma.fAQ.findMany({
      where: { active: true },
      orderBy: { order: "asc" }
    });
    res.json(items);
  } catch (e) { next(e); }
});

// Testimonials
siteRouter.get("/testimonials", async (_req, res, next) => {
  try {
    const items = await prisma.testimonial.findMany({
      where: { active: true },
      orderBy: { order: "asc" }
    });
    res.json(items);
  } catch (e) { next(e); }
});

// History
siteRouter.get("/history", async (_req, res, next) => {
  try {
    const history = await prisma.companyHistory.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton", content: "Nossa história começa aqui..." }
    });
    res.json(history);
  } catch (e) { next(e); }
});

// WhatsApp Analytics
siteRouter.post("/whatsapp-click", async (req, res, next) => {
  try {
    const schema = z.object({
      type: z.string(),
      relatedId: z.string().optional(),
      origin: z.string().optional(),
    });
    const data = schema.parse(req.body);
    const click = await prisma.whatsAppClick.create({ data });
    res.status(201).json(click);
  } catch (e) { next(e); }
});
