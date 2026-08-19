import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import * as aiController from "../controllers/ai.controller";
import * as leadsController from "../controllers/leads.controller";

const router = Router();

// CRUD operations
router.get("/", requireAuth, leadsController.getLeads);
router.post("/", requireAuth, leadsController.createLead);
router.get("/:id", requireAuth, leadsController.getLead);

// Lead Analysis and AI Pitch Generation routes
router.post("/:id/analyze", requireAuth, aiController.analyzeLead);
router.post("/:id/generate-pitch", requireAuth, aiController.generatePitch);

export { router as leadsRoutes };
