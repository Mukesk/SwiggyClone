import e from "express";
import Item from "../model/item_model.js";
import User from "../model/user_model.js";
export const getItems = async (req, res) => {
    try {

        const items = await Item.find({});
        return res.status(200).json({items})
     } catch (error) {
        return res.status(500).json({ error: `Internal Server Error ${error}` });
     }
}
export const addCartItems = async (req, res) => {
    try {
        const { id } = req.params;
        const user = await User.findById(req.user._id);
        const item = await Item.findById(id);

        if (!item) {
            return res.status(404).json({ error: "Item not found" });
        }

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Toggle item in the cart
        if (user.cart.includes(id)) {
            user.cart = user.cart.filter((val) => val.toString() !== id);
        } else {
            user.cart.push(id);
        }

        await user.save();

        res.status(200).json({
            success: {
                username: user.username,
                fullname: user.fullname,
                cart: user.cart,
                city: user.address?.city,
                pincode: user.address?.pincode,
            },
        });
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
};

export const getCartItems=async(req,res)=>{
    try{
        const user = await User.findById({_id:req.user._id})
        return res.status(200).json({cart:user.cart})
    }
    catch(error){
        return res.status(404).json({error:`error in getting cart items ${error}`})
    }
}

