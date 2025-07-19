import User from "../model/user_model.js"
import bcrypt from "bcrypt"
import generateCookie from "../utils/generateCookie.js"

export const signUp= async (req,res)=>{
   
    try {
        const {username,fullname,password,city,pincode,phoneno}=req.body
        const existsUser = await User.findOne({ username: username });
        
        if ( existsUser){
           return res.status(404).json({Error:"user already exists"})
        } 
        const salt =await bcrypt.genSalt(10)
        const hasspass= await bcrypt.hash(password,salt)
        const newUser= new User({
            username,
            fullname,
            password:hasspass,
            address:{
                city,pincode
            },
            phoneno
        
        })
        await newUser.save()
         generateCookie(newUser._id,res)
        return res.status(200).json({username: newUser.username,fullname:newUser.fullname,password:newUser.password,city:newUser.address.city,pincode:newUser.address.pincode})
    
      

    } catch (error) {
        console.log(`something went wrong while signup ${error}`)
      return  res.status(404).json({"error":`something went wrong while signup ${error}`})
    
    }
}
export const login= async (req,res)=>{
    try {
        const {username,password}= req.body
        const user=await User.findOne({username})
        if (!user){
           return res.status(404).json({"Error":"username not found"})
        }
        const pas=await bcrypt.compare(password,user?.password||" ")
        if (!pas){
           return res.status(404).json({"Error":"pasword id incorrect"})
        }
        generateCookie(user._id,res)
         
        return res.status(200).json({
            
            username: user.username,
            fullname:user.fullname,
            password:user.password,
            city:user.address.city,
            pincode:user.address.pincode
             
        })
      
    } catch (error) {
        console.log(`something went wrong while login ${error}`)
      return  res.json({Error:`something went wrong while login ${error}`})
        
    }


}
export const logout = async(req,res)=>{
   
        try {
            res.cookie("jwt", "", {
                httpOnly: true,
                expires: new Date(0) 
            });
    
            return res.status(200).json({ message: "Logout successful" });
    
        } catch (error) {
            console.error(`Something went wrong while logging out: ${error}`);
            return res.status(500).json({ Error: `Internal server error: ${error.message}` });
        }
    };
    

    
        


export const getme=async(req,res)=>{
    try {
        const id=req.user._id
        const user = await User.findById(id)
        res.status(200).json({
            username: user.username,
            fullname:user.fullname,
          
            city:user.address.city,
            pincode:user.address.pincode
             
        })

    } catch (error) {
        console.log(`something went wrong while gettinme ${error}`)
        
    }
}

