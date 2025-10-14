import jwt from "jsonwebtoken";
import User from "../model/user_model.js";

const protectCookie = async (req, res, next) => {
    try {
    
        const token = req.cookies?.jwt;
        if (!token) {
          return res.status(401).json({ Error: "Unauthorized: No token provided" });
      }

        // Verify JWT
        const decoded = jwt.verify(token, process.env.SECRET_JWT);

        // Find user
        const user = await User.findById(decoded.id);
        if (!user) {
            return res.status(401).json({ Error: "Unauthorized: User not found" });
        }

        // Attach user to request object
        req.user = user;
        next();

    } catch (error) {
        console.error(`Authentication error: ${error.message}`);
        
        // Clear invalid cookie
        res.cookie("jwt", "", {
            httpOnly: true,
            expires: new Date(0)
        });
        
        return res.status(401).json({ 
            Error: "Unauthorized: Invalid token",
            message: "Please log in again"
        });
    }
};

export default protectCookie;
