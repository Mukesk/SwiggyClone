import mongoose from "mongoose";
const itemSchmea=new mongoose.Schema({
    itemname:{
        type:"String",
        required:true

    },
    description:{
        type:"String"

    },
    discount:{
        type:"Double",
        default:0

    },
    price:{
        type:Number,
        required:true
    },
    img:{
        type:"String"
    },
    rating:{
        type:Number,
        
        enum:[1,2,3,4,5]
        
        
    },
   
       hotelName:{
            type:"String"

        },
       hotelCity:{
        type:"String"


       },
       category:{
        type:"String"
       }
    }

    

,{timestamps:true})
const Item= mongoose.model("Item",itemSchmea)
export default Item
