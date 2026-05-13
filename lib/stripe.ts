import Stripe from "stripe";

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: "2024-04-10",
  typescript: true,
});

export const PLANS = {
  free: {
    name: "Bepul",
    price: 0,
    credits: 3,
    features: [
      "3 ta rasm yaratish",
      "512x512 o'lcham",
      "Asosiy modellar",
      "Standart sifat",
    ],
    priceId: null,
    badge: null,
  },
  normal: {
    name: "Normal",
    price: 10,
    credits: 50,
    features: [
      "50 ta rasm/oy",
      "1024x1024 o'lcham",
      "Barcha modellar",
      "Yuqori sifat",
      "Rasm tarixi",
      "Yuklab olish",
    ],
    priceId: process.env.STRIPE_NORMAL_PRICE_ID,
    badge: "Mashhur",
  },
  pro: {
    name: "Pro",
    price: 100,
    credits: -1, // unlimited
    features: [
      "Cheksiz rasm yaratish",
      "4K o'lcham",
      "Barcha premium modellar",
      "Ultra sifat",
      "Animatsiya yaratish",
      "API kirish",
      "Ustuvor qo'llab-quvvatlash",
      "Maxsus modellar",
    ],
    priceId: process.env.STRIPE_PRO_PRICE_ID,
    badge: "Pro",
  },
};
