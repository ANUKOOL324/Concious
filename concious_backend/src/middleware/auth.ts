import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_PASSWORD } from "../config.js";
import { NextFunction, Response, Request } from "express";

export function auth(req: Request, res: Response, next: NextFunction) {
  try {
    const header = req.headers["authorization"];
    if (!header) {
      return res.status(401).json({
        message: "Unauthorized. Please sign in again.",
      });
    }
    const decode = jwt.verify(header as string, JWT_PASSWORD) as JwtPayload;

    if (!decode || !decode.id) {
      return res.status(401).json({
        message: "Unauthorized. Please sign in again.",
      });
    }
    req.userId = decode.id;
    next();
  } catch (e) {
    return res.status(401).json({
      message: "Unauthorized. Please sign in again.",
    });
  }
}
