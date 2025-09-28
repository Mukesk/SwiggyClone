import jwt from "jsonwebtoken"

const generateCookie = (id, res) => {
    const token = jwt.sign({id}, process.env.JWT_SECRET || process.env.SECRET_JWT, {expiresIn: "15d"})
    
    const cookieOptions = {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? "none" : "strict",
        maxAge: 15 * 24 * 60 * 60 * 1000, // 15 days
        path: "/"
    }
    
    res.cookie("jwt", token, cookieOptions)
}

export default generateCookie
