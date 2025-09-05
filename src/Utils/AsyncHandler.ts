import { NextFunction,Request,Response } from "express";

export const asyncHandler = async (requestFunction: (req: Request, res: Response, next: NextFunction)=>Promise<void>) => {
    return (req: Request, res: Response, next: NextFunction) => {
        Promise.resolve(requestFunction(req,res,next)).catch((err)=>next(err))
    }
}