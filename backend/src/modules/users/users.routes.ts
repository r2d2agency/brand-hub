import { Router } from "express";
import bcrypt from "bcryptjs";
import { z } from "zod";
import { prisma } from "../../prisma.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";

export const usersRouter = Router();
usersRouter.use(requireAuth, requireAdmin);

const createSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  name: z.string().min(1),
  role: z.enum(["ADMIN", "EDITOR"]).default("EDITOR"),
});

const updateSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(6).optional(),
  name: z.string().min(1).optional(),
  role: z.enum(["ADMIN", "EDITOR"]).optional(),
});

const select = { id: true, email: true, name: true, role: true, createdAt: true } as const;

usersRouter.get("/", async (_req, res, next) => {
  try {
    const users = await prisma.user.findMany({ select, orderBy: { createdAt: "desc" } });
    res.json(users);
  } catch (e) {
    next(e);
  }
});

usersRouter.post("/", async (req, res, next) => {
  try {
    const data = createSchema.parse(req.body);
    const passwordHash = await bcrypt.hash(data.password, 10);
    const user = await prisma.user.create({
      data: { email: data.email, name: data.name, role: data.role, passwordHash },
      select,
    });
    res.status(201).json(user);
  } catch (e) {
    next(e);
  }
});

usersRouter.put("/:id", async (req, res, next) => {
  try {
    const data = updateSchema.parse(req.body);
    const payload: Record<string, unknown> = { ...data };
    if (data.password) {
      payload.passwordHash = await bcrypt.hash(data.password, 10);
      delete payload.password;
    }
    const user = await prisma.user.update({ where: { id: req.params.id }, data: payload, select });
    res.json(user);
  } catch (e) {
    next(e);
  }
});

usersRouter.delete("/:id", async (req, res, next) => {
  try {
    if (req.params.id === req.user!.sub) {
      return res.status(400).json({ error: "Você não pode excluir o próprio usuário" });
    }
    await prisma.user.delete({ where: { id: req.params.id } });
    res.status(204).end();
  } catch (e) {
    next(e);
  }
});
