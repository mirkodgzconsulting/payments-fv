import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

export const runtime = "nodejs"; // Required for using Node APIs

export async function POST(req: NextRequest) {
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;
  if (!webhookSecret) {
    return new NextResponse("Missing STRIPE_WEBHOOK_SECRET", { status: 500 });
  }

  const signature = req.headers.get("stripe-signature");
  if (!signature) {
    return new NextResponse("Missing Stripe signature", { status: 400 });
  }

  const bodyText = await req.text();
  let event;
  try {
    const stripe = getStripe();
    event = stripe.webhooks.constructEvent(Buffer.from(bodyText), signature, webhookSecret);
  } catch (err) {
    console.error("Webhook signature verification failed.", err);
    return new NextResponse("Invalid signature", { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        // Payment or subscription created successfully
        break;
      }
      case "invoice.paid": {
        // Subscription invoice paid
        break;
      }
      case "customer.subscription.deleted": {
        // Subscription canceled
        break;
      }
      default: {
        // Unhandled event type
        break;
      }
    }
  } catch (err) {
    console.error("Error handling webhook:", err);
    return new NextResponse("Webhook handler failed", { status: 500 });
  }

  return NextResponse.json({ received: true });
}


