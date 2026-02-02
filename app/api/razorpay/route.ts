import { NextRequest, NextResponse } from "next/server";
import Razorpay from "razorpay";

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID!,
    key_secret: process.env.RAZORPAY_KEY_SECRET!,
});

export async function POST(req: NextRequest) {
    try {
        const { amount, currency, receipt } = await req.json();

        const options = {
            amount: Math.round(Number(amount) * 100), // amount in the smallest currency unit (paise)
            currency: currency || "INR",
            receipt: receipt || "receipt_" + Math.random().toString(36).substring(7),
        };

        console.log("Creating Razorpay Order with options:", options);
        const order = await razorpay.orders.create(options);

        return NextResponse.json(order);
    } catch (error: any) {
        console.error("Razorpay Order Creation Error:", error);
        return NextResponse.json({
            error: error.message || "Failed to create order",
            description: error.description || "Check Razorpay dashboard"
        }, { status: 500 });
    }
}
