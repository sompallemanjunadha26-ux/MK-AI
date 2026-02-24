import { Request, Response, NextFunction } from "express";

export const protect = (req: Request, res: Response, next: NextFunction) => {
  // For now simple pass (production lo JWT verify cheyyachu)
  next();
};

export const adminOnly = (req: Request, res: Response, next: NextFunction) => {
  next();
};