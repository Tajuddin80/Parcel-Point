import { Request } from "express";

declare global {
  namespace Express {
    interface Request {
      decoded?: {
        uid: string;
        email?: string;
        [key: string]: any; // other Firebase fields
      };
    }
  }
}
