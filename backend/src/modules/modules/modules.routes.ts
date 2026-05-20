import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../prisma.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";

export const modulesRouter = Router();

const upsertSchema = z.object({
  key: z
    .string()
    .min(1)
    .regex(/^[a-z0-9-]+$/),
  title: z.string().min(1),
  description: z.string().nullish(),
  icon: z.string().nullish(),
  enabled: z.boolean().optional(),
  config: z.any().optional(),
  order: z.number().int().optional(),
});

modulesRouter.get("/", async (_req, res, next) => {
  try {
    const items = await prisma.module.findMany({ orderBy: [{ order: "asc" }, { createdAt: "asc" }] });
    res.json(items);
  } catch (e) {
    next(e);
  }
});

modulesRouter.post("/", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = upsertSchema.parse(req.body);
    const item = await prisma.module.create({ data });
    res.status(201).json(item);
  } catch (e) {
    next(e);
  }
});

modulesRouter.put("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    const data = upsertSchema.partial().parse(req.body);
    const item = await prisma.module.update({ where: { id: req.params.id }, data });
    res.json(item);
  } catch (e) {
    next(e);
  }
});

modulesRouter.delete("/:id", requireAuth, requireAdmin, async (req, res, next) => {
  try {
    await prisma.module.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});
