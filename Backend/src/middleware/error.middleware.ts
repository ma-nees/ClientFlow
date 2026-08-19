import { Request, Response, NextFunction } from "express";

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

export function errorMiddleware(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`[Error] ${err.name}: ${err.message}`);

  const statusCode = err.statusCode || 500;
  const errorCode = err.code || "INTERNAL_SERVER_ERROR";
  
  // Never expose internal error details in production
  const message =
    statusCode === 500
      ? "An unexpected error occurred."
      : err.message;

  res.status(statusCode).json({
    success: false,
    error: {
      code: errorCode,
      message,
    },
  });
}
