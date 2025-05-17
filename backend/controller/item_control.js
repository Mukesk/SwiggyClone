import e from "express";
import Item from "../model/item_model.js";
import User from "../model/user_model.js";
const check = (user, id) => {
    return user.cart.some((val) => val.item.equals(id));
}
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
          const  exists = user.cart.find((val) => val.item && val.item.equals(id)); // Check if the item already exists in the cart
        // Toggle item in the cart
        if (exists) {
            user.cart = user.cart.filter((val) => !(val.item && val.item.equals(id)));
        } else {
            user.cart.push({item: id, quantity: 1});
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
export const decrement = async (req, res) => {
    const { id } = req.params;
    const item=await Item.findById(id)
    const user = await User.findById(req.user._id);
    if (!item) {
        return res.status(404).json({ error: "Item not found" });
    }
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const cartItem = user.cart.find((val) => val.item&&val.item.equals(id));  
    if (!cartItem) {
        return res.status(404).json({ error: "Item not found in cart" });
    }
    if (cartItem.quantity <= 1) {
        return res.status(400).json({ error: "Quantity cannot be less than 1" });
    }
    cartItem.quantity -= 1; 
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
}
export const increment = async (req, res) => {
    const { id } = req.params;
    const item=await Item.findById(id)
    const user = await User.findById(req.user._id);
    if (!item) {
        return res.status(404).json({ error: "Item not found" });
    }
    if (!user) {
        return res.status(404).json({ error: "User not found" });
    }
    const cartItem = user.cart.find((val) => val.item && val.item.equals(id));  
    if (!cartItem) {
        return res.status(404).json({ error: "Item not found in cart" });
    }
    cartItem.quantity += 1; 
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
}
export const getCartItems = async (req, res) => {
    try {
        const user = await User.findById(req.user._id).populate('cart.item');

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const items = user.cart
            .filter(val => val.item) // only include cart entries with valid item data
            .map(val => ({
                ...val.item._doc,
                quantity: val.quantity
            }));


        return res.status(200).json({ items });
    } catch (error) {
        return res.status(500).json({ error: `Error in getting cart items: ${error.message}` });
    }
};
