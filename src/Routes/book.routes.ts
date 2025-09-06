import express from 'express'
import { Upload } from '../Middlewares/Multer'
import { bookValidate } from '../Middlewares/validation'
import { getBookById, getBooks, postBook, updateBookDetails } from '../Controllers/book.controller'
import { verifyUser } from '../Middlewares/auth'

const router = express.Router()

router.post("/books", Upload.single("coverImage"),verifyUser, bookValidate, postBook)
router.put("/books/:id", verifyUser, updateBookDetails)
router.get("/books", verifyUser, getBooks)
router.get("/books/:id",verifyUser,getBookById)

export default router