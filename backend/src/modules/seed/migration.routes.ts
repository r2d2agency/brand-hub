import { Router } from "express";
import { prisma } from "../../prisma.js";

export const migrationRouter = Router();

migrationRouter.post("/push", async (req, res, next) => {
  try {
    // In a real production app we would use migrations, 
    // but for dev/quick setup in this environment we can use dbPush if needed
    // However, the user is getting table not found in production build.
    // The issue is that the Easypanel build didn't run the migrations or prisma db push.
    
    // We can't easily run "prisma db push" from inside a running node app 
    // unless we use child_process (which is blocked in some workers but not in this dev-server/docker setup).
    // But we are on a standard Node server here.
    
    // Actually, the best way is for the user to have a migration.
    // Let's create a "manual" seed that also checks if we can help.
    
    res.json({ 
      message: "Por favor, execute 'npx prisma db push' ou garanta que as migrações foram aplicadas no Easypanel.",
      tip: "No Easypanel, você pode adicionar 'npx prisma db push --accept-data-loss' ao seu comando de deploy/start se for um ambiente de teste."
    });
  } catch (e) {
    next(e);
  }
});
