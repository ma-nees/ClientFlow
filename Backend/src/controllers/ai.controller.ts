import { Request, Response, NextFunction } from "express";
import { AiService } from "../services/ai.service";
import { AuthenticatedRequest } from "../middleware/auth.middleware";

export const generatePitch = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await AiService.generatePitch(id as string);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};

export const analyzeLead = async (req: AuthenticatedRequest, res: Response, next: NextFunction): Promise<void> => {
  try {
    const { id } = req.params;
    const result = await AiService.analyzeLead(id as string);
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
};
