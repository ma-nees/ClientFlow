import { Request, Response, NextFunction } from "express";
import { getAuth } from "firebase-admin/auth";
import { firebaseAdmin } from "../config/firebase";

export interface AuthenticatedRequest extends Request {
  user?: {
    uid: string;
    email?: string;
  };
}

export const requireAuth = async (
  req: AuthenticatedRequest,
  res: Response,
  next: NextFunction
): Promise<void> => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Missing or invalid authorization header" },
    });
    return;
  }

  const token = authHeader.split("Bearer ")[1];

  try {
    const decodedToken = await getAuth(firebaseAdmin).verifyIdToken(token);
    
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email,
    };
    
    next();
  } catch (error) {
    console.error("Auth Middleware Error:", error);
    res.status(401).json({
      success: false,
      error: { code: "UNAUTHORIZED", message: "Invalid or expired token" },
    });
  }
};
