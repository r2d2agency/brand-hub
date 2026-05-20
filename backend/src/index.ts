import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./env.js";
import { apiRouter } from "./routes.js";
import { errorHandler } from "./middleware/error.js";

const app = express();

app.use(
  cors({
    origin: (origin, callback) => {
      // Se CORS_ORIGIN for "*", permite qualquer origem
      if (env.CORS_ORIGIN === "*") {
        callback(null, true);
        return;
      }
      
      const allowedOrigins = env.CORS_ORIGIN.split(",").map((s) => s.trim());
      
      // Permite se a origem estiver na lista ou se não houver origem (ex: apps mobile, curl)
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(null, false);
      }
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "X-Requested-With", "Accept"],
  }),
);
app.use(express.json({ limit: "50mb" }));
app.use(morgan("tiny"));

app.use("/api", apiRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${env.PORT}`);
});
