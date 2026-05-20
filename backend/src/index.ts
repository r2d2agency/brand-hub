import express from "express";
import cors from "cors";
import morgan from "morgan";
import { env } from "./env.js";
import { apiRouter } from "./routes.js";
import { errorHandler } from "./middleware/error.js";

const app = express();

app.use(
  cors({
    origin: env.CORS_ORIGIN === "*" ? true : env.CORS_ORIGIN.split(",").map((s) => s.trim()),
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);
app.use(express.json({ limit: "2mb" }));
app.use(morgan("tiny"));

app.use("/api", apiRouter);

app.use(errorHandler);

app.listen(env.PORT, () => {
  console.log(`🚀 API rodando em http://localhost:${env.PORT}`);
});
