import express from 'express'
import dotenv from 'dotenv'
import { PrismaClient } from '@prisma/client';
import cookieParser from 'cookie-parser';
import cors, { CorsOptionsDelegate, CorsRequest } from 'cors'
import { Request, Response, NextFunction } from 'express';
import authorRoutes from './Routes/author.routes'
import bookRoutes from './Routes/book.routes'
import morgan from 'morgan';
import { logger } from './Logger/logger';
dotenv.config()


const app = express()
const port = process.env.PORT || 3000
export const prisma = new PrismaClient();

const frontend =["https://localhost:5173"]
const corsOptions:CorsOptionsDelegate = async (req:CorsRequest, callback) => {
    const origin = req.headers.origin
    if (!origin || frontend.includes(origin))
        callback(null, {
            credentials: true,
            origin: true,
        })
    else {
        callback(new Error("Not Allowed By Cors"), { origin:false})
    }
}


app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors(corsOptions))
app.use(morgan("combined", {
    stream: {
        write:message =>logger.http(message.trim())
    }
}))

app.use("/api", authorRoutes)
app.use("/api",bookRoutes)
app.get("/", (req, res) => {
    res.send("Hi  this is libary management backend developed by Ayush Pandey")
})

//globalErrorHandler
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
    res.status(err.statusCode || 500).json({
        message: err.message || "Server Error",
        stack: err.stack,
        data: null,
        ...err
    })
})


app.listen(port, () => {
    console.log(
      `Server is Running on Server running on http://localhost:${port}`
    );
})