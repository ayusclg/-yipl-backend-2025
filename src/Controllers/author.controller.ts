 
import { asyncHandler } from "../Utils/AsyncHandler";
import { Request, Response } from "express";
import { Authors } from "@prisma/client";
import { prisma } from "..";
import { apiError } from "../Utils/ApiError";
import bcrypt from "bcrypt";
import { uploadImageToCloud } from "../Middlewares/Multer";
import { apiResponse } from "../Utils/ApiRes";
import { generateAccessToken, generateRefreshToken } from "../Utils/Token";
import { setCacheOrGet } from "../Utils/Cache";

const createAuthor = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, name, password }: Authors = req.body;

    const userCheck = await prisma.authors.findFirst({
      where: {
        email,
      },
    });
    if (userCheck) {
      throw new apiError(404, "User Already Exist");
    }
    const hashPassword = await bcrypt.hash(password, 10);
    let profilePicture;
    let uploadToCloud;
    if (req.file) {
      profilePicture = req.file as Express.Multer.File;
      uploadToCloud = await uploadImageToCloud(profilePicture);
    }

    const createAuthor = await prisma.authors.create({
      data: {
        name: name,
        email,
        password: hashPassword,
        profilePicture: uploadToCloud?uploadToCloud:"",
      },
    });
    if (!createAuthor) {
      throw new apiError(400, "Error In Creating Author");
    }
    const createdAuthor = await prisma.authors.findUnique({
      where: {
        id: createAuthor.id,
      },
      select: {
        id: true,
        email: true,
        name: true,
        profilePicture: true,
        createdAt: true,
      },
    });
    if (!createdAuthor) {
      throw new apiError(404, "Created Author Not Found");
    }

    res
      .status(201)
      .json(new apiResponse(201, createdAuthor, "Author Successfully Created"));
  }
);

const loginAuthor = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { email, password }: Authors = req.body;
    const checkAuthor = await prisma.authors.findFirst({
      where: {
        email,
      },
    });
    if (!checkAuthor) {
      throw new apiError(404, "Author Not Found");
    }

    const checkPassword = await bcrypt.compare(password, checkAuthor.password);
    if (!checkPassword) {
      throw new apiError(400, "Invalid Credentials");
    }
    const accessToken = generateAccessToken(checkAuthor);
    const refreshToken = generateRefreshToken(checkAuthor);
    if (!accessToken && !refreshToken) {
      throw new apiError(400, "Token Not Generated");
    }

    const loggedInUser = await prisma.authors.findUnique({
      where: {
        id: checkAuthor.id,
      },
      select: {
        id: true,
        name: true,
        email: true,
        createdAt: true,
        profilePicture: true,
      },
    });
    const response = {
      ...loggedInUser,
      accessToken,
      refreshToken,
    };

    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      secure: true,
    });
    res.cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
    });

    res.status(200).json(new apiResponse(200, response, "Author LoggedIn"));
  }
);

const getAllAuthor = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const filter = (req.query.filter as string) || {};
        const sortOption = (req.query.sortOption as "asc" | "desc") || "asc";
        const page = parseInt(req.query.page as string) || 1
        const perPage = parseInt(req.query.perPage as string) || 10
        

    const where: any = filter
      ? {
          name: {
            contains: filter,
          },
        }
        : {};
        const limit = perPage
        const skip = (page - 1) * perPage
         const cacheKey = `authorId:${req.authorId}`
        const authors =await setCacheOrGet( cacheKey,async()=>{return await prisma.authors.findMany({
            where,
            orderBy: {
                books:{
                    _count:sortOption
                }
            },
            select: {
                id: true,
                email: true,
                profilePicture: true,
                name: true,
                books: {
                    select: {
                        title: true,
                        publishedYear: true,
                        isbn:true,
                    }
                }
            },
            skip: skip,
            take:limit
     })},500)
    if (authors.length < 1) {
      throw new apiError(404, "No Authors Found");
    }
        const response = {
             authors,
            totalDocuments:authors.length,
            currentPage: page
        }

    res
      .status(200)
      .json(new apiResponse(200, response, "Authors Fetched Successfully"));
  }
);

const getAuthorById = asyncHandler(
    async (req: Request, res: Response): Promise<void> => {
        const authorId = req.params.id;
        if (!authorId) {
            throw new apiError(404, "Author id not found");
        }
        const cacheKey = `authorById:${req.authorId}`
        const authorFind = await setCacheOrGet(cacheKey, async () => {
            return prisma.authors.findUnique({
                where: {
                    id: authorId,
                },
                select: {
                    id: true,
                    name: true,
                    email: true,
                    books: {
                        select: {
                            title: true,
                            isbn: true,
                            publishedYear: true,
                        },
                    },
                },
            });
        },600);
    
    if (!authorFind) {
      throw new apiError(404, "No Such Author found");
    }
        res.status(200).json(new apiResponse(200,authorFind,"Author Found Successfully"))
  }
);
    
export { createAuthor, loginAuthor, getAllAuthor, getAuthorById };
 
