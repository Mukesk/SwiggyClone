import express, { Router } from "express"

import { getme, login, logout, signUp } from "../controller/auth_control.js"
import protectCookie from "../middleware/protectCookie.js"
const app = express()
const route=express.Router()

route.post("/signup",signUp)
route.post("/login",login)
route.post("/logout",logout)
route.get("/me",protectCookie,getme)
export default route