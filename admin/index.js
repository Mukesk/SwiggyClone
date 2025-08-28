import express from "express";
import cookieParser from "cookie-parser";
import dotenv from "dotenv";
import dbConnect from "./db/dbconnect.js";
import authRoute from "./route/auth_route.js";
import cors from "cors";

dotenv.config();
const app = express();

app.use(cookieParser());

// ✅ Use CORS Middleware Before Routes
app.use(
  cors({
    origin: "https://swiggy-clone-7tcu4f5wa-mukesks-projects.vercel.app", // Frontend URL
    methods: "GET, POST, PUT, DELETE, OPTIONS",
    allowedHeaders: "Content-Type, Authorization",
    credentials: true, // Required for cookies/auth
  })
);


app.use(express.json());

app.use(express.json()); // Parse JSON data
app.use(express.urlencoded({ extended: true })); 

app.use("/api/auth", authRoute);
app.use("/api/items", authRoute);

app.listen(process.env.PORT, () => {
  console.log("Server running on port", process.env.PORT);
  dbConnect();
});
                                                   