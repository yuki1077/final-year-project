const Stripe = require('stripe');

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);

const createPaymentIntent = async ({ amount, currency = 'npr', metadata = {} }) => {
  const intent = await stripe.paymentIntents.create({
    amount,
    currency,
    metadata,
    automatic_payment_methods: { enabled: true },
  });

  return intent;
};

module.exports = {
  createPaymentIntent,
};

