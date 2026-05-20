import { Router } from "express";
import { authRouter } from "./modules/auth/auth.routes.js";
import { usersRouter } from "./modules/users/users.routes.js";
import { brandingRouter } from "./modules/branding/branding.routes.js";
import { pagesRouter } from "./modules/pages/pages.routes.js";
import { modulesRouter } from "./modules/modules/modules.routes.js";
import { siteRouter } from "./modules/site/site.routes.js";
import { adminRouter } from "./modules/admin/admin.routes.js";

export const apiRouter = Router();

apiRouter.get("/health", (_req, res) => res.json({ ok: true }));
apiRouter.use("/auth", authRouter);
apiRouter.use("/users", usersRouter);
apiRouter.use("/branding", brandingRouter);
apiRouter.use("/pages", pagesRouter);
apiRouter.use("/modules", modulesRouter);
apiRouter.use("/site", siteRouter);
apiRouter.use("/admin-cms", adminRouter);
