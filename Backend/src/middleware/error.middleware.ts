import { Request, Response, NextFunction } from "express";

export interface CustomError extends Error {
  statusCode?: number;
  code?: string;
}

import fs from 'fs';

export function errorMiddleware(
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  console.error(`[Error] ${err.name}: ${err.message}`);
  if (err.stack) {
    console.error(err.stack);
    fs.appendFileSync('error.log', `[${new Date().toISOString()}] ${req.method} ${req.url}\n${err.stack}\n\n`);
  }

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
