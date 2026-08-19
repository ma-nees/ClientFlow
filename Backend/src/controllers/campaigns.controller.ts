import { Response, NextFunction } from "express";
import { CampaignsService } from "../services/campaigns.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export const listCampaigns = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const campaigns = await CampaignsService.listCampaigns(req.user!.uid);
    res.json({ success: true, data: campaigns });
  } catch (error) {
    next(error);
  }
};

export const getCampaign = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const campaign = await CampaignsService.getCampaign(req.user!.uid, req.params.id);
    res.json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};

export const createCampaign = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const campaign = await CampaignsService.createCampaign(req.user!.uid, req.body);
    res.json({ success: true, data: campaign });
  } catch (error) {
    next(error);
  }
};

export const updateStatus = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await CampaignsService.updateStatus(req.user!.uid, req.params.id, req.body.status);
    res.json({ success: true, data: { message: "Status updated" } });
  } catch (error) {
    next(error);
  }
};

export const deleteCampaign = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    await CampaignsService.deleteCampaign(req.user!.uid, req.params.id);
    res.json({ success: true, data: { message: "Campaign deleted" } });
  } catch (error) {
    next(error);
  }
};
