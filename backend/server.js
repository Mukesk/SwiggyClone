import express from "express"
import cookieParser from "cookie-parser"
import dbConnect from "./db/dbconnect.js"
import router from "./routes/auth_Route.js"
import dotenv from "dotenv"
import cors from "cors"
import itemRoute from "./routes/item_route.js"
import paymentRoute from "./routes/payment_route.js"
import helmet from "helmet"
import compression from "compression"
import { securityHeaders, createRateLimiter } from "./middleware/validation.js"
dotenv.config()

const app = express()

// Security middleware
app.use(helmet({
    contentSecurityPolicy: false, // Disable for now, configure later
    crossOriginEmbedderPolicy: false
}))
app.use(compression())
app.use(securityHeaders)

// Trust proxy for accurate client IP
app.set('trust proxy', 1)

// Body parsing middleware
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(cookieParser())
// CORS configuration
app.use(cors({
    origin: process.env.NODE_ENV === 'production' 
        ? process.env.FRONTEND_URL 
        : "http://localhost:5173",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
    optionsSuccessStatus: 200
}))
// Rate limiting for auth endpoints (more lenient in development)
const authRateLimit = process.env.NODE_ENV === 'production' 
    ? createRateLimiter(15 * 60 * 1000, 5)    // 5 requests per 15 minutes in production
    : createRateLimiter(15 * 60 * 1000, 50)   // 50 requests per 15 minutes in development

const generalRateLimit = process.env.NODE_ENV === 'production'
    ? createRateLimiter(15 * 60 * 1000, 100)  // 100 requests per 15 minutes in production  
    : createRateLimiter(15 * 60 * 1000, 1000) // 1000 requests per 15 minutes in development

// Routes with rate limiting
app.use("/api/payment", generalRateLimit, paymentRoute)
app.use("/api/auth", authRateLimit, router)
app.use("/api/items", generalRateLimit, itemRoute)

// Health check endpoint
app.get("/health", (req, res) => {
    res.status(200).json({ 
        status: "OK", 
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development"
    })
})

// 404 handler
app.use("*", (req, res) => {
    res.status(404).json({ error: "Route not found" })
})

// Global error handler
app.use((err, req, res, next) => {
    console.error('Error:', err.stack)
    
    if (err.type === 'entity.too.large') {
        return res.status(413).json({ error: 'Request entity too large' })
    }
    
    res.status(err.status || 500).json({
        error: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message
    })
})

app.listen(process.env.PORT||3000,()=>{
dbConnect();
    console.log(`server started running on 3000`);
})