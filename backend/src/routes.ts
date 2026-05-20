import { Router } from "express";
import { authRouter } from "./modules/auth/auth.routes.js";
import { usersRouter } from "./modules/users/users.routes.js";
import { brandingRouter } from "./modules/branding/branding.routes.js";
import { pagesRouter } from "./modules/pages/pages.routes.js";
import { modulesRouter } from "./modules/modules/modules.routes.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => res.json({ ok: true }));
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/branding", brandingRouter);
apiRouter.use("/pages", pagesRouter);
apiRouter.use("/modules", modulesRouter);
