import express from 'express';
import Stripe from 'stripe';
import { protect } from '../middleware/auth.middleware.js';
import  Cart  from '../models/Cart.js';
import env from 'dotenv';
import Product from '../models/Product.js';
import Order from '../models/Order.js';

env.config();

const router = express.Router();
const stripe = new Stripe(process.env.STRIPE_SECRET);

router.post('/create-checkout-session', protect, async (req, res) => {
  try {
    const cart = await Cart.findOne({ user: req.user._id }).populate('items.product');

    if (!cart || cart.items.length === 0) {
      return res.status(400).json({ message: 'Cart is empty' });
    }

    const line_items = cart.items.map(item => ({
      price_data: {
        currency: 'usd',
        product_data: {
          name: item.product.name,
          images: [item.product.image],
        },
        unit_amount: Math.round(item.product.price * 100), // in cents
      },
      quantity: item.quantity,
    }));

    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      line_items,
      mode: 'payment',
      success_url: `${process.env.VITE_API_URL}/success`,
      cancel_url: `${process.env.VITE_API_URL}/cart`,
    });

    res.json({ url: session.url });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Stripe checkout failed' });
  }
});

export default router;
