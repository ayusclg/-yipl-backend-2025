import { asyncHandler } from "../Utils/AsyncHandler";
import { Request,Response } from "express";
import { user } from "../Utils/Interfaces";
import { prisma } from "..";
import { apiError } from "../Utils/ApiError";
import bcrypt from 'bcrypt'
import { uploadImageToCloud } from "../Middlewares/Multer";
import { apiResponse } from "../Utils/ApiRes";
import { generateAccessToken, generateRefreshToken } from "../Utils/Token";


const createAuthor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, name, password }: user = req.body
    
    const userCheck = await prisma.authors.findFirst({
        where: {
            email,
        }
    })
    if (userCheck) {
        throw new apiError(404,"User Already Exist")
    }
    const hashPassword = await bcrypt.hash(password, 10)
    const profilePicture = req.file as Express.Multer.File
    const uploadToCloud = await uploadImageToCloud(profilePicture)

    const createAuthor = await prisma.authors.create({
        data: {
            name: name,
            email,
            password: hashPassword,
            profilePicture:uploadToCloud
        }
    }) 
    if (!createAuthor) {
        throw new apiError(400,"Error In Creating Author")
    }
    const createdAuthor = await prisma.authors.findUnique({
        where: {
           id:createAuthor.id
        },
        select: {
            id: true,
            email: true,
            name: true,
            profilePicture: true,
            createdAt:true
        }
    })
    if (!createdAuthor) {
        throw new apiError(404,"Created Author Not Found")
    }

    res.status(201).json(new apiResponse(201,createdAuthor,"Author Successfully Created"))
})

const loginAuthor = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const { email, password }: user = req.body
    const checkAuthor = await prisma.authors.findFirst({
        where: {
            email,
        }
    })
    if (!checkAuthor) {
        throw new apiError(404,"Author Not Found")
    }

    const checkPassword = await bcrypt.compare(password, checkAuthor.password)
    if (!checkPassword) {
        throw new apiError(400,"Invalid Credentials")
    }
    const accessToken = generateAccessToken(checkAuthor)
    const refreshToken = generateRefreshToken(checkAuthor)
    if (!accessToken && !refreshToken) {
        throw new apiError(400,"Token Not Generated")
    }

    const loggedInUser = await prisma.authors.findUnique({
        where: {
             id:checkAuthor.id
        },
        select: {
            id: true,
            name: true,
            email: true,
            createdAt: true,
            profilePicture:true,
        }
    })
    const response = {
        loggedInUser,
        accessToken,
        refreshToken,
    }

    res.cookie("accessToken", accessToken, {
        httpOnly: true,
        secure:true,
    })
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure:true,
    })
    
    res.status(200).json(new apiResponse(200,response,"Author LoggedIn"))
})
export {createAuthor,loginAuthor}