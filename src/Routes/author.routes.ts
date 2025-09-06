import express from "express";
import { Upload } from "../Middlewares/Multer";
import  {createAuthor, getAllAuthor, getAuthorById, loginAuthor}  from "../Controllers/author.controller";

const router = express.Router()

router.post("/author", Upload.single("profilePicture"), createAuthor);
router.post("author/login", loginAuthor)
router.get("/author/all", getAllAuthor)
router.get("/author/:id",getAuthorById)

export default router