import { Authors, Books } from "@prisma/client";
import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { apiError } from "../Utils/ApiError";
import { title } from "process";

const authorValidation = Joi.object<Authors>({
  name: Joi.string().min(4).max(20).required(),
  email: Joi.string().email().required(),
  password: Joi.string()
    .pattern(
      new RegExp(
        "^(?=.*[a-z])(?=.*[A-Z])(?=.*\\d)(?=.*[@$!%*?&#^])[A-Za-z\\d@$!%*?&#^]{8,30}$"
      )
    )
    .message(
      "Password must be 8-30 characters long, include uppercase, lowercase, number, and special character"
    )
    .required(),
});

export const authorValidate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await authorValidation.validateAsync(req.body);
    next();
  } catch (error: any) {
    throw new apiError(400, error.details[0].message || "Validation Failed");
  }
};

const bookValidation = Joi.object<Books>({
  title: Joi.string().min(3).max(20).required(),
  isbn: Joi.string()
    .pattern(/^[0-9]{10}$/)
    .message("ISBN Numbers Must Be 10 digits")
    .required(),
  publishedYear: Joi.date().required(),
});

export const bookValidate = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    await bookValidation.validateAsync(req.body);
    next();
  } catch (error: any) {
    throw new apiError(
      400,
      error.details[0].message || "Book Validation Failed"
    );
  }
};
