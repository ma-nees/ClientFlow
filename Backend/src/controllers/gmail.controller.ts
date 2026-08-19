import { Request, Response, NextFunction } from "express";
import { GmailService } from "../services/gmail.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";
import { env } from "../config/env";

export const getConnectUrl = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const uid = req.user!.uid;
    const url = GmailService.generateAuthUrl(uid);
    res.json({ success: true, data: { url } });
  } catch (error) {
    next(error);
  }
};

export const handleCallback = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  try {
    const code = req.query.code as string;
    const state = req.query.state as string; // This is the firebase uid we passed in

    if (!code || !state) {
       res.status(400).json({ success: false, error: { message: "Missing code or state" } });
       return;
    }

    await GmailService.handleCallback(code, state);
    
    // Redirect back to frontend settings page after successful auth
    res.redirect(`${env.FRONTEND_URL}/settings/gmail?connected=true`);
  } catch (error) {
    console.error("Gmail OAuth Callback Error:", error);
    res.redirect(`${env.FRONTEND_URL}/settings/gmail?error=oauth_failed`);
  }
};

export const getStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const status = await GmailService.getStatus(req.user!.uid);
    res.json({ success: true, data: status });
  } catch (error) {
    next(error);
  }
};

export const disconnect = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await GmailService.disconnect(req.user!.uid);
    res.json({ success: true, data: { message: "Disconnected" } });
  } catch (error) {
    next(error);
  }
};
