import  Mongoose  from "mongoose";
import dotenv from "dotenv"
const dbConnect=async()=>{
    dotenv.config()

try {
  
 await Mongoose.connect(process.env.MONGODB_ADDRESS)
 console.log("database connection successfully")
 
    
} catch (error) {
    console.log(error)
    
}
}

    

export default dbConnect   

