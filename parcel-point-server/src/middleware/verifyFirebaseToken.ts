import { NextFunction, Request, Response } from "express";
import admin from "firebase-admin"

    // custom middlewares here
    
  export  const verifyFireBaseToken = async (req: Request, res: Response, next: NextFunction) => {
      // console.log('header in iddleware', req.headers);
      const authHeader = req.headers.authorization;
      if (!authHeader) {
        return res.status(401).send({ message: "unauthorized access" });
      }
      const token = authHeader.split(" ")[1];

      if (!token) {
        return res.status(401).send({ message: "unauthorized access" });
      }

      //  verify the token here
      try {
        const decoded = await admin.auth().verifyIdToken(token);
        req.decoded = decoded;
        next();
      } catch (error) {
        return res.status(403).send({ message: "forbidden access" });
      }
    };
