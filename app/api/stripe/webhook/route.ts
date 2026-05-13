import { NextRequest, NextResponse } from "next/server";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import Stripe from "stripe";

export async function POST(req: NextRequest) {
  const body = await req.text();
  const signature = req.headers.get("stripe-signature")!;

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch (error: any) {
    console.error("Webhook signature error:", error);
    return NextResponse.json(
      { error: "Webhook signature xatosi" },
      { status: 400 }
    );
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.CheckoutSession;
        const userId = session.metadata?.userId;
        const plan = session.metadata?.plan;

        if (!userId || !plan) break;

        const credits = plan === "pro" ? -1 : plan === "normal" ? 50 : 3;

        await prisma.user.update({
          where: { id: userId },
          data: {
            plan,
            credits,
            stripeSubscriptionId: session.subscription as string,
          },
        });

        // Save payment record
        await prisma.payment.create({
          data: {
            userId,
            stripePaymentId: session.id,
            amount: session.amount_total || 0,
            currency: session.currency || "usd",
            plan,
            status: "completed",
          },
        });

        console.log(`User ${userId} upgraded to ${plan} plan`);
        break;
      }

      case "customer.subscription.deleted": {
        const subscription = event.data.object as Stripe.Subscription;
        const customerId = subscription.customer as string;

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (user) {
          await prisma.user.update({
            where: { id: user.id },
            data: {
              plan: "free",
              credits: 3,
              stripeSubscriptionId: null,
            },
          });
          console.log(`User ${user.id} downgraded to free plan`);
        }
        break;
      }

      case "invoice.payment_succeeded": {
        const invoice = event.data.object as Stripe.Invoice;
        const customerId = invoice.customer as string;

        const user = await prisma.user.findFirst({
          where: { stripeCustomerId: customerId },
        });

        if (user && user.plan !== "free") {
          // Refresh credits on renewal
          const credits = user.plan === "pro" ? -1 : 50;
          await prisma.user.update({
            where: { id: user.id },
            data: { credits },
          });
          console.log(`Credits refreshed for user ${user.id}`);
        }
        break;
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook processing error:", error);
    return NextResponse.json(
      { error: "Webhook processing xatosi" },
      { status: 500 }
    );
  }
}
