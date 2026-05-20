import { Router } from "express";
import { z } from "zod";
import { prisma } from "../../prisma.js";
import { requireAdmin, requireAuth } from "../../middleware/auth.js";

export const adminRouter = Router();
adminRouter.use(requireAuth, requireAdmin);

// Utility for generic CRUD
const createCrud = (modelName: string, schema: z.ZodObject<any>) => {
  const router = Router();
  const model = (prisma as any)[modelName];

  router.get("/", async (_req, res, next) => {
    try {
      const orderByField = modelName.toLowerCase().includes('banner') || modelName.toLowerCase().includes('category') || modelName.toLowerCase().includes('store') 
        ? { order: "asc" } 
        : { createdAt: "desc" };
      
      let items;
      try {
        // Safe check for model existence and method
        if (!model || typeof model.findMany !== 'function') {
          throw new Error(`Model ${modelName} not found in prisma client`);
        }

        items = await model.findMany({ 
          orderBy: orderByField
        });
      } catch (prismaError: any) {
        console.error(`[CRUD] Error fetching ${modelName}:`, prismaError);
        
        // Try fallback without custom sorting
        try {
          items = await model.findMany({ 
            orderBy: { createdAt: "desc" }
          });
        } catch (fallbackError) {
          console.error(`[CRUD] Fallback also failed for ${modelName}:`, fallbackError);
          // Last resort: just get all items and sort in memory if needed
          items = await model.findMany().catch(() => []);
        }
      }
      
      res.json(items);
    } catch (e) { next(e); }
  });

  router.post("/", async (req, res, next) => {
    try {
      const data = schema.parse(req.body);
      const item = await model.create({ data });
      res.status(201).json(item);
    } catch (e) { next(e); }
  });

  router.put("/:id", async (req, res, next) => {
    try {
      const data = schema.partial().parse(req.body);
      const item = await model.update({ where: { id: req.params.id }, data });
      res.json(item);
    } catch (e) { next(e); }
  });

  router.delete("/:id", async (req, res, next) => {
    try {
      await model.delete({ where: { id: req.params.id } });
      res.status(204).end();
    } catch (e) { next(e); }
  });

  return router;
};

// Schemas
const bannerSchema = z.object({
  title: z.string().min(1),
  subtitle: z.string().nullish(),
  imageDesktop: z.string().min(1),
  imageMobile: z.string().nullish(),
  buttonText: z.string().nullish(),
  buttonLink: z.string().nullish(),
  startDate: z.string().nullish().transform(v => v ? new Date(v) : null),
  endDate: z.string().nullish().transform(v => v ? new Date(v) : null),
  active: z.boolean().optional(),
  isDefault: z.boolean().optional(),
  fontFamily: z.string().nullish(),
  fontSize: z.string().nullish(),
  transitionTime: z.number().int().nullish(),
  transitionType: z.string().nullish(),
  order: z.number().int().optional(),
});

const categorySchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullish(),
  coverImage: z.string().url().nullish(),
  gallery: z.array(z.string().url()).optional(),
  whatsappMsg: z.string().nullish(),
  active: z.boolean().optional(),
  order: z.number().int().optional(),
  showInHome: z.boolean().optional(),
});

const storeSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  neighborhood: z.string().nullish(),
  phone: z.string().nullish(),
  whatsapp: z.string().nullish(),
  hours: z.string().nullish(),
  mapsLink: z.string().nullish(),
  images: z.array(z.string().url()).optional(),
  active: z.boolean().optional(),
  order: z.number().int().optional(),
});

// Register Routes
// Specific Banner Routes (to handle reordering)
const bannerCrud = createCrud("seasonalBanner", bannerSchema);
bannerCrud.post("/reorder", async (req, res, next) => {
  try {
    const { ids } = z.object({ ids: z.array(z.string()) }).parse(req.body);
    await Promise.all(
      ids.map((id, index) => 
        prisma.seasonalBanner.update({
          where: { id },
          data: { order: index }
        })
      )
    );
    res.json({ success: true });
  } catch (e) { next(e); }
});

adminRouter.use("/banners", bannerCrud);
adminRouter.use("/categories", createCrud("productCategory", categorySchema));
adminRouter.use("/stores", createCrud("store", storeSchema));

// Dashboard Stats
adminRouter.get("/stats", async (_req, res, next) => {
  try {
    const [
      modules, banners, categories, stores, clicks
    ] = await Promise.all([
      prisma.module.count({ where: { enabled: true } }),
      prisma.seasonalBanner.count({ where: { active: true } }),
      prisma.productCategory.count(),
      prisma.store.count(),
      prisma.whatsAppClick.count()
    ]);

    res.json({
      activeModules: modules,
      activeBanners: banners,
      totalCategories: categories,
      totalStores: stores,
      whatsappClicks: clicks
    });
  } catch (e) { next(e); }
});

// Company History (Single)
adminRouter.get("/history", async (_req, res, next) => {
  try {
    const history = await prisma.companyHistory.upsert({
      where: { id: "singleton" },
      update: {},
      create: { id: "singleton", content: "" }
    });
    res.json(history);
  } catch (e) { next(e); }
});

adminRouter.put("/history", async (req, res, next) => {
  try {
    const schema = z.object({
      title: z.string().optional(),
      content: z.string().optional(),
      mainImage: z.string().url().nullish(),
      timeline: z.any().optional(),
    });
    const data = schema.parse(req.body);
    const history = await prisma.companyHistory.update({
      where: { id: "singleton" },
      data
    });
    res.json(history);
  } catch (e) { next(e); }
});
