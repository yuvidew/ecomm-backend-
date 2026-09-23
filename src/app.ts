import express from "express"
import cors from "cors"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import authRoutes from "@/routers/auth.routes"
import createRoutes from "@/routers/category.routes"
import productRoutes from "@/routers/product.routes"
import uploadRoutes from "@/routers/upload.routes";
import { errorHandler } from "./middlewares/error.middleware";


const app = express()

app.use(cors({
    origin: true, 
    credentials: true,
}))
app.use(helmet())
app.use(express.json())
app.use(cookieParser())

// health api t check is working or not
app.get("/health", (req, res) => res.json({status : "ok"}))

app.use("/api/auth", authRoutes)
app.use("/api/categories", createRoutes)
app.use("/api/products", productRoutes)
app.use("/api/uploads", uploadRoutes)

app.use(errorHandler) // must be last

export default app