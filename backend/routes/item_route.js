import express from "express"
import { getItems,addCartItems ,getCartItems, increment, decrement, removeCartItem} from "../controller/item_control.js"
import protectCookie from "../middleware/protectCookie.js"
 const itemRoute = express.Router()
 itemRoute.get("/getallitems",getItems)

 itemRoute.get("/getcartitems",protectCookie,getCartItems)

 itemRoute.post("/addcartitem/:id",protectCookie,addCartItems)
 
 itemRoute.post("/removecartitem/:id",protectCookie,removeCartItem)
 itemRoute.post ("/increment/:id",protectCookie,increment)
 itemRoute.post ("/decrement/:id",protectCookie,decrement)


    export default itemRoute