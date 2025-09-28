import jwt from "jsonwebtoken"


const generateCookie = (id,res) => {
    const token = jwt.sign({id},process.env.SECRET_JWT,{expiresIn:"15d"})
    res.cookie("jwt",token,
        {
            httpOnly:true,
            secure: process.env.NODE_ENV  !== "development",
            sameSite:"strict",
            maxAge: 15 * 24 * 60 * 60 * 1000})
 
}

export default generateCookie
