import { NextRequest, NextResponse } from "next/server";
import { getStripe } from "@/lib/stripe";

type Mode = "now" | "installments" | "subscribe";

export async function POST(req: NextRequest) {
  try {
    const stripe = getStripe();
    const body = await req.json();
    const description: string = (body?.description ?? "Pagamento FelizViaje").toString();
    const amountInput = body?.amount;
    const mode: Mode = body?.mode;

    if (!mode || !["now", "installments", "subscribe"].includes(mode)) {
      return NextResponse.json(
        { error: "Invalid mode. Use 'now' | 'installments' | 'subscribe'." },
        { status: 400 }
      );
    }

    // Amount in cents. Accept numbers or strings like "123.45"
    const parsedAmount = typeof amountInput === "number" ? amountInput : parseFloat(String(amountInput));
    if (!Number.isFinite(parsedAmount) || parsedAmount <= 0) {
      return NextResponse.json({ error: "Invalid amount" }, { status: 400 });
    }
    const amountInCents = Math.round(parsedAmount * 100);

    const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";

    let session;

    if (mode === "now") {
      session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["card"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: { name: description },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/canceled`,
        billing_address_collection: "auto",
        allow_promotion_codes: false,
      });
    } else if (mode === "installments") {
      session = await stripe.checkout.sessions.create({
        mode: "payment",
        payment_method_types: ["klarna"],
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: { name: description },
              unit_amount: amountInCents,
            },
            quantity: 1,
          },
        ],
        success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/canceled`,
        billing_address_collection: "auto",
        allow_promotion_codes: false,
      });
    } else {
      // subscribe
      session = await stripe.checkout.sessions.create({
        mode: "subscription",
        line_items: [
          {
            price_data: {
              currency: "eur",
              product_data: { name: description },
              unit_amount: amountInCents,
              recurring: { interval: "month" },
            },
            quantity: 1,
          },
        ],
        success_url: `${siteUrl}/success?session_id={CHECKOUT_SESSION_ID}`,
        cancel_url: `${siteUrl}/canceled`,
        billing_address_collection: "auto",
        allow_promotion_codes: false,
      });
    }

    return NextResponse.json({ id: session.id, url: session.url });
  } catch (error: unknown) {
    console.error("Failed to create checkout session", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}


