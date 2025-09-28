import express from "express"
import { getme, login, logout, signUp } from "../controller/auth_control.js"
import protectCookie from "../middleware/protectCookie.js"
import { validateSignup, validateLogin, handleValidationErrors } from "../middleware/validation.js"

const route = express.Router()

route.post("/signup", validateSignup, handleValidationErrors, signUp)
route.post("/login", validateLogin, handleValidationErrors, login)
route.post("/logout", logout)
route.post("/clear-cookies", (req, res) => {
    res.cookie("jwt", "", {
        httpOnly: true,
        expires: new Date(0)
    });
    res.status(200).json({ message: "Cookies cleared successfully" });
})
route.get("/me", protectCookie, getme)
export default route