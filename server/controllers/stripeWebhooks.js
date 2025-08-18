import stripe from "stripe";
import Booking from "../models/Booking.js";
import express from 'express'; // Import express for raw body parsing

// Define the endpoint with a raw body parser specifically for the webhook
export const stripeWebhooks = async (request, response) => {
    const stripeInstance = new stripe(process.env.STRIPE_SECRET_KEY);
    const sig = request.headers["stripe-signature"];
    const endpointSecret = process.env.STRIPE_WEBHOOK_SECRET;

    let event;

    try {
        event = stripeInstance.webhooks.constructEvent(request.body, sig, endpointSecret);
    } catch (error) {
        console.error(`Webhook signature verification failed.`, error.message);
        return response.status(400).send(`Webhook Error: ${error.message}`);
    }

    // Handle the checkout.session.completed event
    if (event.type === "checkout.session.completed") {
        const session = event.data.object;
        const bookingId = session.metadata.bookingId;

        console.log(`Checkout session completed for bookingId: ${bookingId}`);

        try {
            // Mark Payment as Paid
            await Booking.findByIdAndUpdate(bookingId, { isPaid: true, paymentMethod: "stripe" });
            console.log(`Booking ${bookingId} successfully updated to isPaid: true`);
        } catch (dbError) {
            console.error(`Database update failed for booking ${bookingId}:`, dbError);
            return response.status(500).send("Database update failed.");
        }
    } else {
        // Log all other events for debugging
        console.log(`Unhandled event type: ${event.type}`);
    }

    // Return a 200 response to acknowledge receipt of the event
    response.json({ received: true });
};