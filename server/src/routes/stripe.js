const express = require('express');
const Stripe  = require('stripe');
const router  = express.Router();

// pull your $5/month Price ID & secret key from env
const { STRIPE_SECRET_KEY, STRIPE_PRICE_ID_DONATION } = process.env;
if (!STRIPE_SECRET_KEY) {
  throw new Error('Missing STRIPE_SECRET_KEY in environment');
}
if (!STRIPE_PRICE_ID_DONATION) {
  throw new Error('Missing STRIPE_PRICE_ID_DONATION in environment');
}

const stripe = Stripe(STRIPE_SECRET_KEY, { apiVersion: '2022-11-15' });

router.post('/checkout', async (req, res) => {
  const origin = req.get('origin') || 'http://localhost:3000';

  try {
    const session = await stripe.checkout.sessions.create({
      mode: 'subscription',               // still using a subscription flow
      payment_method_types: ['card'],
      line_items: [{ price: STRIPE_PRICE_ID_DONATION, quantity: 1 }],
      success_url: `${origin}/billing/success`,
      cancel_url:  `${origin}/billing/cancel`,
    });
    res.json({ url: session.url });
  } catch (err) {
    console.error('Stripe checkout error', err);
    res.status(500).json({ error: 'Checkout failed' });
  }
});

module.exports = router;
