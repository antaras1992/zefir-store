import Stripe from "stripe";

// Created on first use, so builds without STRIPE_SECRET_KEY (e.g. preview deployments) don't fail
let client;
export function getStripe() {
  if (!client) client = new Stripe(process.env.STRIPE_SECRET_KEY);
  return client;
}

// Drop-in replacement for a module-level `new Stripe(...)` instance
export const stripe = new Proxy({}, {
  get: (_, key) => {
    const c = getStripe();
    const v = c[key];
    return typeof v === "function" ? v.bind(c) : v;
  },
});
