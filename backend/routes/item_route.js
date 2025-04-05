import express from "express"
import { getItems,addCartItems ,getCartItems} from "../controller/item_control.js"
import protectCookie from "../middleware/protectCookie.js"
 const itemRoute = express.Router()
 itemRoute.get("/getallitems",getItems)

 itemRoute.get("/getcartitems",protectCookie,getCartItems)
 itemRoute.post("/addcartitem/:id",protectCookie,addCartItems)


    export default itemRoute