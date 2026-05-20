import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../prisma.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";

export const pagesRouter = Router();

const upsertSchema = z.object({
  slug: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/, "use apenas letras minúsculas, números e hífen"),
  title: z.string().min(1),
  content: z.any().optional(),
  published: z.boolean().optional(),
  seoTitle: z.string().nullish(),
  seoDescription: z.string().nullish(),
  order: z.number().int().optional(),
});

pagesRouter.get("/", async (_req, res, next) => {
  try {
    const pages = await prisma.page.findMany({ orderBy: [{ order: "asc" }, { createdAt: "desc" }] });
    res.json(pages);
  } catch (e) {
    next(e);
  }
});

pagesRouter.get("/:slug", async (req, res, next) => {
  try {
    const page = await prisma.page.findUnique({ where: { slug: req.params.slug } });
    if (!page) return res.status(404).json({ error: "Página não encontrada" });
    res.json(page);
  } catch (e) {
    next(e);
  }
});

pagesRouter.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = upsertSchema.parse(req.body);
    const page = await prisma.page.create({ data });
    res.status(201).json(page);
  } catch (e) {
    next(e);
  }
});

pagesRouter.put("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = upsertSchema.partial().parse(req.body);
    const page = await prisma.page.update({ where: { id: req.params.id }, data });
    res.json(page);
  } catch (e) {
    next(e);
  }
});

pagesRouter.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    await prisma.page.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});
