import express from 'express';
import Stripe from 'stripe';

const stripe = new Stripe("sk_test_51RLdujGIFC7YAJ2pL1yHXn2lVz4eisq3mD1mlXkALzrDVxnDgs9HRJFIYOu6nrtDKHdt3R6OkGpQJeHdZAkbbfqn00czmVKOTO"); // Replace with your actual Stripe secret key
const paymentRoute = express.Router();

paymentRoute.post("/create-checkout-session", async (req, res) => {
    try {
        const { data } = req.body;

        const line_items = data.map(product => ({
            price_data: {
                currency: "inr",
                unit_amount: product.price * 100, // Stripe expects amount in cents
                product_data: {
                    name: product.itemname,
                    images: [product.img] // "images" should be used, not "image"
                }
            },
            quantity: product.quantity
        }));

        const session = await stripe.checkout.sessions.create({
            payment_method_types: ["card"],
            line_items,
            mode: "payment",
            success_url: "http://localhost:3000/success",
            cancel_url: "http://localhost:3000/cancel",
        });

        res.json({ id: session.id });
    } catch (error) {
        console.error("Stripe session error:", error);
        res.status(500).json({ error: "Failed to create checkout session" });
    }
});

export default paymentRoute;
