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
        if (!model || typeof model.findMany !== 'function') {
          throw new Error(`Model ${modelName} not found in prisma client`);
        }

        items = await model.findMany({ 
          orderBy: orderByField
        });
      } catch (prismaError: any) {
        console.error(`[CRUD] Error fetching ${modelName}:`, prismaError);
        
        try {
          // If sorting fails, try sorting by id or createdAt (which are more likely to exist)
          items = await model.findMany({ 
            orderBy: { id: "desc" }
          });
        } catch (fallbackError) {
          console.error(`[CRUD] Fallback also failed for ${modelName}:`, fallbackError);
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
  coverImage: z.string().nullish(),
  icon: z.string().nullish(),
  gallery: z.array(z.string()).optional(),
  whatsappMsg: z.string().nullish(),
  active: z.boolean().optional(),
  order: z.number().int().optional(),
  showInHome: z.boolean().optional(),
  showInMenu: z.boolean().optional(),
});

const benefitSchema = z.object({
  icon: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().nullish(),
  order: z.number().int().optional(),
  active: z.boolean().optional(),
});

const inspirationSchema = z.object({
  title: z.string().min(1),
  image: z.string().min(1),
  gallery: z.array(z.string()).optional(),
  link: z.string().nullish(),
  order: z.number().int().optional(),
  active: z.boolean().optional(),
});

const homeBannerSchema = z.object({
  key: z.string().min(1),
  title: z.string().min(1),
  subtitle: z.string().nullish(),
  description: z.string().nullish(),
  image: z.string().nullish(),
  ctaText: z.string().nullish(),
  ctaLink: z.string().nullish(),
  bgColor: z.string().nullish(),
  textColor: z.string().nullish(),
  active: z.boolean().optional(),
  order: z.number().int().optional(),
});


const storeSchema = z.object({
  name: z.string().min(1),
  address: z.string().min(1),
  city: z.string().nullish(),
  state: z.string().nullish(),
  zipCode: z.string().nullish(),
  neighborhood: z.string().nullish(),
  phone: z.string().nullish(),
  whatsapp: z.string().nullish(),
  hours: z.string().nullish(),
  mapsLink: z.string().nullish(),
  latitude: z.number().nullish(),
  longitude: z.number().nullish(),
  images: z.array(z.string().url()).optional(),
  active: z.boolean().optional(),
  order: z.number().int().optional(),
});

const promotionSchema = z.object({
  title: z.string().min(1),
  image: z.string().min(1),
  price: z.string().nullish(),
  oldPrice: z.string().nullish(),
  description: z.string().nullish(),
  whatsappMsg: z.string().nullish(),
  active: z.boolean().optional(),
  order: z.number().int().optional(),
});

const newsVideoSchema = z.object({
  title: z.string().min(1),
  youtubeUrl: z.string().url(),
  thumbnail: z.string().min(1),
  tags: z.array(z.string()).optional(),
  orientation: z.enum(["horizontal", "vertical"]).optional(),
  active: z.boolean().optional(),
  order: z.number().int().optional(),
});

const partnerSchema = z.object({
  name: z.string().min(1),
  logo: z.string().min(1),
  active: z.boolean().optional(),
  order: z.number().int().optional(),
});

const pegueMonteSchema = z.object({
  name: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullish(),
  theme: z.string().nullish(),
  coverImage: z.string().nullish(),
  videoUrl: z.string().nullish(),
  gallery: z.array(z.string()).optional(),
  items: z.array(z.string()).optional(),
  active: z.boolean().optional(),
  highlight: z.boolean().optional(),
  storePhones: z.array(z.object({
    name: z.string(),
    phone: z.string()
  })).optional(),
});

const courseSchema = z.object({
  title: z.string().min(1),
  slug: z.string().min(1),
  description: z.string().nullish(),
  coverImage: z.string().nullish(),
  gallery: z.array(z.string()).optional(),
  date: z.string().nullish().transform(v => v ? new Date(v) : null),
  time: z.string().nullish(),
  location: z.string().nullish(),
  instructor: z.string().nullish(),
  status: z.enum(["SOON", "OPEN", "CLOSED"]).optional(),
  whatsappMsg: z.string().nullish(),
  active: z.boolean().optional(),
  showInHome: z.boolean().optional(),
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
adminRouter.use("/promotions", createCrud("promotion", promotionSchema));
adminRouter.use("/news-videos", createCrud("newsVideo", newsVideoSchema));
adminRouter.use("/partners", createCrud("partner", partnerSchema));
adminRouter.use("/pegue-monte", createCrud("pegueMonte", pegueMonteSchema));
adminRouter.use("/courses", createCrud("course", courseSchema));
adminRouter.use("/benefits", createCrud("benefit", benefitSchema));
adminRouter.use("/inspirations", createCrud("inspiration", inspirationSchema));
adminRouter.use("/home-banners", createCrud("homeBanner", homeBannerSchema));


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

// Visitor Analytics
adminRouter.get("/analytics", async (req, res, next) => {
  try {
    const from = req.query.from ? new Date(String(req.query.from)) : new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);
    const to = req.query.to ? new Date(String(req.query.to)) : new Date();
    if (isNaN(from.getTime()) || isNaN(to.getTime())) {
      return res.status(400).json({ error: "Datas inválidas" });
    }

    const [totals, byPath, daily, topReferrers, recent] = await Promise.all([
      prisma.$queryRawUnsafe<any[]>(
        `SELECT COUNT(*)::int AS views, COUNT(DISTINCT "sessionId")::int AS visitors
         FROM "PageView" WHERE "createdAt" >= $1 AND "createdAt" <= $2`,
        from, to
      ),
      prisma.$queryRawUnsafe<any[]>(
        `SELECT "path", COUNT(*)::int AS views, COUNT(DISTINCT "sessionId")::int AS visitors
         FROM "PageView" WHERE "createdAt" >= $1 AND "createdAt" <= $2
         GROUP BY "path" ORDER BY views DESC LIMIT 50`,
        from, to
      ),
      prisma.$queryRawUnsafe<any[]>(
        `SELECT date_trunc('day', "createdAt") AS day,
                COUNT(*)::int AS views,
                COUNT(DISTINCT "sessionId")::int AS visitors
         FROM "PageView" WHERE "createdAt" >= $1 AND "createdAt" <= $2
         GROUP BY day ORDER BY day ASC`,
        from, to
      ),
      prisma.$queryRawUnsafe<any[]>(
        `SELECT COALESCE(NULLIF("referrer", ''), 'Direto') AS referrer, COUNT(*)::int AS views
         FROM "PageView" WHERE "createdAt" >= $1 AND "createdAt" <= $2
         GROUP BY referrer ORDER BY views DESC LIMIT 10`,
        from, to
      ),
      prisma.$queryRawUnsafe<any[]>(
        `SELECT "path", "referrer", "userAgent", "createdAt"
         FROM "PageView" WHERE "createdAt" >= $1 AND "createdAt" <= $2
         ORDER BY "createdAt" DESC LIMIT 30`,
        from, to
      ),
    ]);

    res.json({
      range: { from, to },
      totals: totals[0] || { views: 0, visitors: 0 },
      byPath,
      daily,
      topReferrers,
      recent,
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
      mainImage: z.string().nullish(),
      gallery: z.array(z.string()).optional(),
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
