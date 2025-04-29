
import type { JwtPayload } from "jsonwebtoken";
import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { JWT_SECERET } from "../config";
import { boolean } from "zod";
// Extend the Express Request type to include userId
declare global {
    namespace Express {
      interface Request {
        userId?: string;
      }
    }
  }


const authMiddleware = (req:Request, res:Response, next:NextFunction) => {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer')) {
         res.status(403).json({});
         return 
    }

    const token = authHeader.split(' ')[1];

    try {
        const decoded = jwt.verify(token, JWT_SECERET);
        
        if (!((decoded as JwtPayload).userid==undefined)) {
            req.userId = (decoded as JwtPayload ).userid;
            next();
        }else{
             res.json({"m":"nothing"})
             return

        }

      
    } catch (err) {
       res.status(403).json({});
       return
    }
};
export{
    authMiddleware
}