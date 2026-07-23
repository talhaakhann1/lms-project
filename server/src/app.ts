import express from "express"
import {v2 as cloudinary} from "cloudinary"
import cookieParser from "cookie-parser"
import cors from "cors"

const app=express()

const allowedOrigins = [
  "http://localhost:3000",
  process.env.CORS_ORIGIN,
].filter((origin): origin is string => Boolean(origin));


app.use(
    cors({
        origin:allowedOrigins,
        credentials:true
    })
)

cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME!,
    api_key: process.env.CLOUDINARY_API_KEY!,
    api_secret: process.env.CLOUDINARY_API_SECRET!
})


app.use(express.static("/public"));
app.use(express.urlencoded({extended:true,limit:"16kb"}))
app.use(express.json({limit:"16kb"}))
app.use(cookieParser())

export default app