import { NextFunction, Request, Response } from "express";
import { usersCollection } from "../config/db";
  
  // verify rider role
  export const verifyRider = async (req: Request, res: Response, next: NextFunction) => {
  const email = req.decoded?.email;
  if (!email) return res.status(401).send({ message: "Unauthorized" });

  const user = await usersCollection.findOne({ email });
  if (!user || user.role !== "rider") {
    return res.status(403).send({ message: "Forbidden access" });
  }
  next();
};

