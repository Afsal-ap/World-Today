"use strict";
// import express from 'express';
// import Stripe from 'stripe';
// import bodyParser from 'body-parser';
// const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!);
// const router = express.Router();
// Use raw body for Stripe signature verification
// router.post('/webhook', bodyParser.raw({ type: 'application/json' }), async (req, res) => {
//     const sig = req.headers['stripe-signature'];
//     try {
//         const event = stripe.webhooks.constructEvent(req.body, sig!, process.env.STRIPE_WEBHOOK_SECRET!);
//         if (event.type === 'invoice.payment_succeeded') {
//             const invoice = event.data.object as Stripe.Invoice;
//             const subscriptionId = invoice.subscription as string;
//             // TODO: Update your database subscription status to "active"
//             console.log(`Subscription ${subscriptionId} is now active`);
//         }
//         res.status(200).send('Webhook received');
//     } catch (err) {
//         console.error('Webhook Error:', err);
//         res.status(400).send('Webhook Error');
//     }
// });
// export default router;
