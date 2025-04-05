import express from "express";
import { login,getme, addItems, deleteItem, editItem, getallItems } from "../controller/auth_controller.js";
import protector from "../protecter/protectCookie.js";
import multer from "multer";
const authRoute = express.Router();
const storage = multer.memoryStorage();
const upload = multer({ storage });
authRoute.post("/login", login);
authRoute.get("/me",getme)
authRoute.post("/additem",upload.single("img"), addItems);
authRoute.delete("/deleteitem/:id", protector, deleteItem);
authRoute.post("/edititem/:id", protector, editItem);
authRoute.get("/getallitems",protector,getallItems)

export default authRoute;
