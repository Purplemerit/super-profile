import { NextRequest, NextResponse } from "next/server";
import nodemailer from "nodemailer";

// In-memory store for OTPs (In a real app, use Redis or a Database)
const otpStore = new Map<string, string>();

// Configure Nodemailer transporter
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE || 'gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },
});

export async function POST(req: NextRequest) {
    try {
        const { type, target } = await req.json();

        if (!target) {
            return NextResponse.json({ error: "Target is required" }, { status: 400 });
        }

        // Generate a 4-digit OTP
        const otp = Math.floor(1000 + Math.random() * 9000).toString();

        // Store the OTP with the target (email or phone) as the key
        otpStore.set(target, otp);

        if (type === 'email') {
            try {
                await transporter.sendMail({
                    from: `"SuperProfile Verification" <${process.env.EMAIL_USER}>`,
                    to: target,
                    subject: "Your Verification Code",
                    text: `Your verification code is: ${otp}`,
                    html: `
                        <div style="font-family: sans-serif; padding: 20px; color: #333;">
                            <h2>Verification Code</h2>
                            <p>Use the code below to verify your email address:</p>
                            <div style="font-size: 32px; font-weight: bold; letter-spacing: 5px; padding: 10px; background: #f4f4f4; display: inline-block;">
                                ${otp}
                            </div>
                            <p>This code will expire shortly.</p>
                        </div>
                    `,
                });
                console.log(`[VERIFICATION] Email OTP sent to ${target}`);
            } catch (mailError: any) {
                console.error("Email sending error:", mailError);
                // Still log for debug if SMTP is not configured
                console.log(`[DEBUG] Email OTP was: ${otp}`);
                return NextResponse.json({
                    success: false,
                    error: "Failed to send email. Please check SMTP configuration."
                }, { status: 500 });
            }
        } else {
            // For phone, we still log to console until SMS provider is added
            console.log(`[VERIFICATION] Sent phone OTP: ${otp} to ${target}`);
        }

        return NextResponse.json({
            success: true,
            message: `OTP sent successfully to ${target}.`
        });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}

export async function PUT(req: NextRequest) {
    try {
        const { target, otp } = await req.json();

        const storedOtp = otpStore.get(target);

        if (storedOtp && storedOtp === otp) {
            otpStore.delete(target); // Clear after verification
            return NextResponse.json({ success: true, verified: true });
        }

        return NextResponse.json({ success: false, error: "Invalid OTP" }, { status: 400 });
    } catch (error: any) {
        return NextResponse.json({ error: error.message }, { status: 500 });
    }
}
