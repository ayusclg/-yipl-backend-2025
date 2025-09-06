import express from "express";
import { Upload } from "../Middlewares/Multer";
import  {createAuthor, getAllAuthor, getAuthorById, loginAuthor}  from "../Controllers/author.controller";
import { authorValidate } from "../Middlewares/validation";
import { verifyUser } from "../Middlewares/auth";

const router = express.Router()

router.post("/author", Upload.single("profilePicture"),authorValidate, createAuthor);
router.post("/author/login", loginAuthor)
router.get("/author/all",verifyUser, getAllAuthor)
router.get("/author/:id",verifyUser,getAuthorById)

export default router