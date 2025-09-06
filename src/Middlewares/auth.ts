import { NextFunction, Request, Response } from "express";
import Jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from ".."; 
import { apiError } from "../Utils/ApiError";
import { Authors } from "@prisma/client";
declare global{
    namespace Express{
        interface Request{
            authorId?:string;
        }
    }
}

export const verifyUser = async (req: Request, res: Response, next: NextFunction) => {
    try {
        const token = req.headers.authorization?.startsWith("Bearer ") ? req.headers.authorization?.split(" ")[1] : req.cookies.accessToken

        if(!token){throw new apiError(404,"Token Not Found")}
        
        const decode =  Jwt.verify(token, process.env.ACCESS_TOKEN_SECRET!) as JwtPayload
        const author = await prisma.authors.findUnique({
          where: {
            id: decode.id,
          },
          select: {
            id: true,
            name: true,
            email: true,
            profilePicture: true,
          },
        });
        if (!author) {
            throw new apiError(404,"Author Not Found")
        }

        req.authorId =author.id.toString()
        next()
    } catch (error) {
        throw new apiError(401,"Please Login")
    }
}