import { prisma } from "..";
import { uploadImageToCloud } from "../Middlewares/Multer";
import { apiError } from "../Utils/ApiError";
import { apiResponse } from "../Utils/ApiRes";
import { asyncHandler } from "../Utils/AsyncHandler";
import { Request, Response } from "express";

const postBook = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const { title, isbn, publishedYear } = req.body;
    const userFind = await prisma.authors.findUnique({
      where: {
        id: req.authorId,
      },
    });
    if (!userFind) {
      throw new apiError(401, "Unauthorized Request");
    }

    let uploadToCloud;
    if (req.file) {
      const coverImage = req.file as Express.Multer.File;
      uploadToCloud = await uploadImageToCloud(coverImage);
    }

    const createBook = await prisma.books.create({
      data: {
        title,
        isbn,
        publishedYear: new Date(publishedYear),
        coverImage: uploadToCloud || "",
        author_id: userFind.id,
      },
    });
    if (!createBook) {
      throw new apiError(400, "Book Not Posted");
    }

    res
      .status(200)
      .json(new apiResponse(200, createBook, "Book Posted Successfully"));
  }
);

const updateBookDetails = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const bookId = parseInt(req.params.id);
    const { title, isbn, publishedYear } = req.body;
    if (!bookId) {
      throw new apiError(404, "Book Id Not Found");
    }
    let coverImageCloud;
    if (req.file) {
      const coverImage = req.file as Express.Multer.File;
      coverImageCloud = await uploadImageToCloud(coverImage);
    }
    const findBook = await prisma.books.update({
      where: {
        id: bookId,
        author_id: req.authorId,
      },
      data: {
        title,
        isbn,
        publishedYear,
        coverImage: coverImageCloud,
      },
      include: {
        author: {
          select: {
            id: true,
            name: true,
            profilePicture: true,
            email: true,
          },
        },
      },
    });
    if (!findBook) {
      throw new apiError(404, "No Such Books Found");
    }

    res
      .status(200)
      .json(new apiResponse(200, findBook, "Book Details Updated"));
  }
);

const getBooks = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const filter = (req.query.filter as string) || " ";
    const sortOptions =
      (req.query.sortOption as "title" | "publishedYear" | "createdAt") ||
      "createdAt";
    const sortOrder = (req.query.sortOrder as "desc" | "asc") || "asc";
    const page = parseInt(req.query.page as string) || 1;
    const perPage = parseInt(req.query.perPage as string) || 5;

    const skip = (page - 1) * perPage;
    const limit = perPage;
    let publishedYearFilter;
    if (!isNaN(Number(filter))) {
      const year = Number(filter);
      publishedYearFilter = {
        gte: new Date(`${year}-01-01`),
        lt: new Date(`${year + 1}-01-01`),
      };
    } else {
      publishedYearFilter = undefined;
    }
    const getBooks = await prisma.books.findMany({
      where: {
        OR: [
          { title: isNaN(Number(filter)) ? filter : undefined },
          {
            author: !isNaN(Number(filter))
              ? undefined
              : {
                  name: filter,
                },
          },
          { publishedYear: publishedYearFilter },
        ],
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
            profilePicture: true,
          },
        },
      },
      orderBy: [
        {
          [sortOptions]: sortOrder,
        },
      ],
      skip: skip,
      take: limit,
    });
    if (getBooks.length < 1) {
      throw new apiError(404, "No Books Found");
    }
    res
      .status(200)
      .json(new apiResponse(200, getBooks, "Books Fetched Successfully"));
  }
);

const getBookById = asyncHandler(
  async (req: Request, res: Response): Promise<void> => {
    const bookId = parseInt(req.params.id);
    if (!bookId) {
      throw new apiError(404, "Book Id Not Found");
    }

    const findBook = await prisma.books.findUnique({
      where: {
        id: bookId,
      },
      include: {
        author: {
          select: {
            id: true,
            email: true,
            name: true,
            profilePicture: true,
          },
        },
      },
    });
    if (!findBook) {
      throw new apiError(404, "No Books Found");
    }

    res
      .status(200)
      .json(new apiResponse(200, findBook, "Book Found Successfully"));
  }
);

export { postBook, updateBookDetails, getBooks, getBookById };
