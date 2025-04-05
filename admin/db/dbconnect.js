import mongoose from "mongoose";
import dotenv from "dotenv"

    dotenv.config()
const dbconnect=async()=>{
    try {
       await mongoose.connect(process.env.MONGODB_ADDRESS)
       console.log("db connection successfully")
    } 
catch (error) {
    console.log(`db connection error ${error}`)
    }
}
export default dbconnect