import mongoDb, { MongoClient, ObjectId } from 'mongodb'
import  bcrypt from "bcryptjs"
import generateCookie from '../utils/generateCookie.js'
import Item from '../model/item_model.js'
import cloudinary from './config/cloundinary.js'
import jwt from "jsonwebtoken"
import multer from "multer";

export const login = async(req,res)=>{

  
 
    const {username,password}=req.body;

       try {
         const client = await  MongoClient.connect(process.env.MONGODB_ADDRESS)
           const db= client.db("test")
           const admin = db.collection("admin") 
         const isAdmin= await admin.findOne({username:username})  
         if (!isAdmin){
            return res.status(404).json({"Error":"Unauthorized entry check username"})
         }
         const ispass= bcrypt.compare(password,isAdmin.password)
         if (!ispass ){
            return res.status(404).json({"Error":"Unauthorized entry check password"})


         }
         generateCookie(isAdmin._id, res);
         return res.status(200).json({"sucesss":"login sucessfully"})
         
       } 
       catch (error) {
               return res.status(404).json({"Error":`in logging admin${error}`})

           
       }
     

}

// Multer Storage Configuration
const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

export const addItems = async (req, res) => {
  try {
    console.log("Received Body:", req.body);  // Debug form data
    console.log("Received File:", req.file);  // Debug uploaded file

    const { itemname, price, description, rating, hotelName, hotelCity, category, percentage } = req.body;
    let imgUrl = "";

    if (req.file) {
      try {
        const uploadResult = await new Promise((resolve, reject) => {
          const uploadStream = cloudinary.v2.uploader.upload_stream(
            { 
              resource_type: "image", 
              folder: "items"  // Store images in "items" folder
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          uploadStream.end(req.file.buffer);
        });

        imgUrl = uploadResult.secure_url;  // Save uploaded image URL
      } catch (uploadError) {
        console.error("Cloudinary Upload Error:", uploadError);
        return res.status(500).json({ error: "Error uploading image to Cloudinary" });
      }
      const item = new Item({
        itemname,
        price,
        description,
        rating,
        hotelName,
        hotelCity,
        category,
        percentage,
        img: imgUrl
      });
     await item.save();
    }

    return res.status(200).json({
      itemname, 
      price, 
      description, 
      rating, 
      hotelName, 
      hotelCity, 
      category, 
      percentage, 
      img: imgUrl
    });

  } catch (error) {
    console.error("Error adding item:", error);
    return res.status(500).json({ error: `Error adding item: ${error.message}` });
  }
};

export const deleteItem=async(req,res)=>{
try{
    const {id}=req.params;
    if (!id){
      return res.status(404).json({"Error":`in req parrams id `})
    }
    await Item.findByIdAndDelete(id)
   
    
   
    return res.status(200).json({"sucesss":"deleted sucessfully"})
   }
   
   catch(error){
      return res.status(404).json({"Error":`error in adding items ${error}` })
   }

    
}

export const editItem = async (req, res) => {
  try {
     const { id } = req.params;
     const { itemname, price, description, rating, hotelName, img, hotelCity } = req.body;
     console.log("Received Body:", req.body);  // Debug form data cc

     if (!id) {
        return res.status(400).json({ "error": "Missing item ID in request parameters" });
     }

     const item = await Item.findById(id);
     if (!item) {
        return res.status(404).json({ "error": "Item not found" });
     }

     // Handle Image Update (If new image is provided)
     if (item.img && img) {
        const publicId = item.img.split("/").pop().split(".")[0]; // Extract Cloudinary Public ID
        await cloudinary.uploader.destroy(publicId); // Delete old image from Cloudinary

        const uploadedImg = await cloudinary.uploader.upload(img); // Upload new image
        item.img = uploadedImg.secure_url || item.img; // Update image URL
     }

     // Update Fields
     item.itemname = itemname || item.itemname;
     item.price = price || item.price;
     item.description = description || item.description;
     item.rating = rating || item.rating;
     item.hotelCity = hotelCity || item.hotelCity;
     item.hotelName = hotelName || item.hotelName;

     await item.save();
     return res.status(200).json({ "success": "Edit successful", item });

  } catch (error) {
     console.error(error);
     return res.status(500).json({ "error": "Internal server error" });
  }
};


export const getme=async(req,res)=>{

     try {
       const token = req.cookies.jwt; // Corrected from req.cookie.jvt
       if (!token) {
         return res.status(401).json({ error: "No token provided" });
       }
   
       // Verify JWT
       const secretKey = process.env.SECRET_KEY; // Ensure secret key is set
       const decoded = jwt.verify(token, secretKey);
       const { id } = decoded;
   
       // Connect to MongoDB
       const client = await MongoClient.connect(process.env.MONGODB_ADDRESS);
   
       const db = client.db("test");
       const adminCollection = db.collection("admin");
   
       // Find admin by ObjectId
       const isAdmin = await adminCollection.findOne({ _id:new ObjectId(id) });
   
       client.close(); // Close the DB connection
   
       if (isAdmin) {
         return res.status(200).json({ success: "Authentication complete" });
       } else {
         return res.status(404).json({ failed: "Authentication failed" });
       }
     } catch (error) {
       console.error(error);
       return res.status(500).json({ error: "Internal Server Error" });
     }
   };
  
   export const getallItems = async(req,res)=>{
      try {

         const items = await Item.find({});
         return res.status(200).json({items})
      } catch (error) {
         return res.status(500).json({ error: `Internal Server Error ${error}` });
      }
      
      
   }
   

   


