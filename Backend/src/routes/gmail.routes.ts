import { Router } from "express";
import { requireAuth } from "../middleware/auth.middleware";
import * as gmailController from "../controllers/gmail.controller";

export const gmailRoutes = Router();

// OAuth callback does NOT use requireAuth because Google redirects here directly without the Bearer token.
// The user's UID is passed via the state query parameter.
gmailRoutes.get("/callback", gmailController.handleCallback);

// All other routes require authentication
gmailRoutes.use(requireAuth);

gmailRoutes.get("/connect", gmailController.getConnectUrl);
gmailRoutes.get("/status", gmailController.getStatus);
gmailRoutes.post("/disconnect", gmailController.disconnect);
