import mongoose from "mongoose";
import  Mongoose from "mongoose";
import { type } from "os";
const userScehema = new  Mongoose.Schema({
    username:{
        type:"String",
        required:true
    },
    fullname:{
        type:"String",
        required:true

    },
    password:{
        type:"String",
        required:true
    },
    address:{
        city:{
            type:"String"


        },
        pincode:{
            type:Number

        },
        

    },
    phoneno:{
        type:Number,

        required:true
    },
    cart:
        [{
        type:Mongoose.SchemaTypes.ObjectId,
        ref:"Item",
       
        
         default:[] }
        ]



  

},{timestamps:true})
const User = Mongoose.model("User",userScehema)
export default User