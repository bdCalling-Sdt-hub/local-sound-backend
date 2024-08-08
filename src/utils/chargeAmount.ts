import Stripe from "stripe";
import error from "./error";
import dotenv from 'dotenv'; 
dotenv.config();

const stripe_secret_key = process.env.STRIPE_SECRET_KEY;

if (!stripe_secret_key) {
  throw new Error("Stripe secret key is not provided");
}

const stripe = new Stripe(stripe_secret_key);

export default async function chargeAmount({
  stripeToken,
  amount,
  email,
  description,
}: {
  stripeToken: string;
  amount: number;
  email: string;
  description: string;
}) {
  const customer = await stripe.customers.create({
    source: stripeToken,
    email,
  });

  if (!customer) {
    throw error("Payment failed", 400);
  }

  const charge = await stripe.charges.create({
    amount: amount * 100,
    currency: "usd",
    customer: customer.id,
    description,
  });

  if (charge.status !== "succeeded") {
    throw error("Payment failed", 400);
  }

  return charge;
}
