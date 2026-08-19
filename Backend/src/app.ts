import express from "express";
import helmet from "helmet";
import cors from "cors";
import { env } from "./config/env";
import { errorMiddleware } from "./middleware/error.middleware";

const app = express();

// Security Headers
app.use(helmet());

// CORS configuration
app.use(
  cors({
    origin: [env.FRONTEND_URL, "http://localhost:8080", "http://localhost:5173"],
    credentials: true,
  })
);

// Body Parsing
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true, limit: "2mb" }));

import { gmailRoutes } from "./routes/gmail.routes";
import { leadsRoutes } from "./routes/leads.routes";
import { campaignsRoutes } from "./routes/campaigns.routes";

// Health Check
app.get("/health", (req, res) => {
  res.json({ status: "ok", service: "clientflow-ai-api" });
});

// API routes
app.use("/api/gmail", gmailRoutes);
app.use("/api/leads", leadsRoutes);
app.use("/api/campaigns", campaignsRoutes);

// Error Handling (must be last)
app.use(errorMiddleware);

export { app };
