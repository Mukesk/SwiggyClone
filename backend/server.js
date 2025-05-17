import express from "express"
import cookieParser from "cookie-parser"
import dbConnect from "./db/dbconnect.js"
import bodyParser from "body-parser"
import router from "./routes/auth_Route.js"
import dotenv from "dotenv"
import cors from "cors"
import itemRoute from "./routes/item_route.js"
import stripe from "stripe"
import paymentRoute from "./routes/payment_route.js"
 dotenv.config()
const app=express()
app.use(cookieParser())

app.use(express.json())
app.use(cors({
    origin:"http://localhost:5173",
    methods:"GET,POST,PUT,DELETE,OPTIONS",
    allowedHeaders:"Content-Type,Authorization",
    credentials:true
}
   
))
app.use("/api/payment",paymentRoute)
app.use("/api/auth",router)
app.use("/api/items",itemRoute)

app.listen(process.env.PORT||3000,()=>{
dbConnect();
    console.log(`server started running on 3000`);
})