// // server/src/routes/webhook.js
// require('dotenv').config();
// const express = require('express');
// const Stripe  = require('stripe');
// const router  = express.Router();

// // Initialize Stripe
// const stripe           = Stripe(process.env.STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });
// const endpointSecret   = process.env.STRIPE_WEBHOOK_SECRET;

// // IMPORTANT: use raw body parser for webhooks
// router.post(
//   '/webhook',
//   express.raw({ type: 'application/json' }),
//   (req, res) => {
//     const sig = req.headers['stripe-signature']!;
//     let event;

//     try {
//       event = stripe.webhooks.constructEvent(req.body, sig, endpointSecret);
//     } catch (err) {
//       console.error('⚠️  Webhook signature verification failed.', err.message);
//       return res.status(400).send(`Webhook Error: ${err.message}`);
//     }

//     // Handle the checkout.session.completed event
//     if (event.type === 'checkout.session.completed') {
//       const session = event.data.object;
//       // Example: grab your customer / session info
//       const customerId    = session.customer;                   // Stripe Customer ID
//       const subscriptionId = session.subscription;              // Stripe Subscription ID
//       const clientReference = session.client_reference_id;      // Set below
//       // TODO: mark your user in DB as “subscribed”
//       // e.g. await User.updateOne({ _id: clientReference }, { stripeSubscriptionId: subscriptionId, active: true });
//       console.log(
//         `✅ Checkout complete for client_reference_id=${clientReference}`
//       );
//     }

//     // Return a 200 to acknowledge receipt
//     res.json({ received: true });
//   }
// );

// module.exports = router;
