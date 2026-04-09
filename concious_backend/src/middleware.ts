import jwt, { JwtPayload } from 'jsonwebtoken'
import { JWT_PASSWORD } from './config.js';
import { NextFunction,Response,Request } from 'express';

export function auth(req:Request,res:Response,next:NextFunction)
{
    try{
    const header = req.headers['authorization'];
    console.log(header)
    if(!header)
    {
       return res.json({
            message:" you are not logged in!"
        })
    }
    const decode = jwt.verify(header as string , JWT_PASSWORD) as JwtPayload;
    //console.log(decode)

    if (!decode || !decode.id) {
      return res.status(403).json({
        message: "Invalid token"
      });
    }
    req.userId = decode.id;
    next();
    
    }catch(e)
    {
        return res.status(403).json({
            message:"invalid token"
        })
    }
}