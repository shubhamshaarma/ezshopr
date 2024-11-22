import Stripe from "stripe";
import { ICart } from "../redux/slices/cartSlice";

if (!process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY) {
    throw new Error("Stripe key not found...");
}
const stripe = new Stripe(process.env.NEXT_PUBLIC_STRIPE_SECRET_KEY);

export async function createCheckoutSession(
    items: ICart[],
    orderNumber: string
) {
    try {
        const session = await stripe.checkout.sessions.create({
            mode: "payment",
            success_url: `${window.location.origin}/cart/success?orderNumber=${orderNumber}`,
            cancel_url: `${window.location.origin}/cart?cancel_stripe_checkout`,
            line_items: items.map((item) => ({
                price_data: {
                    currency: "usd",
                    unit_amount: Math.round(item.product.price * 100),
                    product_data: {
                        name: item.product.title,
                        description: item.product.description,
                        metadata: {
                            id: item._id,
                        },
                        images: [item.product.images[0]], // Wrap the image in an array
                    },
                },
                quantity: item.quantity,
            })),
        });

        return session.url;
    } catch (error) {
        console.error("Error creating checkout session:", error);
        throw error;
    }
}
