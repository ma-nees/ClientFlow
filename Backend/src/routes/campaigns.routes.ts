import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import * as campaignsController from "../controllers/campaigns.controller";

const router = Router();

router.use(requireAuth);

// CRUD operations
router.get("/", campaignsController.listCampaigns);
router.get("/:id", campaignsController.getCampaign);
router.post("/", campaignsController.createCampaign);
router.patch("/:id/status", campaignsController.updateStatus);
router.delete("/:id", campaignsController.deleteCampaign);

export { router as campaignsRoutes };
