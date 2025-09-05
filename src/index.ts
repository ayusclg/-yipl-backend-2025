import express from 'express'
import dotenv from 'dotenv'
import {PrismaClient} from '@prisma/client';
dotenv.config()


const app = express()
const port = process.env.PORT || 3000


app.get("/", (req, res) => {
    res.send("Hi  this is libary management backend developed by Ayush Pandey")
})
export const prisma = new PrismaClient();



app.listen(port, () => {
    console.log(
      `Server is Running on Server running on http://localhost:${port}`
    );
})