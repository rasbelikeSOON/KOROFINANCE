import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
    try {
        const { email } = await req.json();

        if (!email || !email.includes('@')) {
            return NextResponse.json({ error: "Invalid email address" }, { status: 400 });
        }

        const { error } = await supabase
            .from("subscribers")
            .insert([{ email }]);

        if (error) {
            // Check for unique constraint violation
            if (error.code === '23505') {
                return NextResponse.json({ error: "This email is already subscribed." }, { status: 400 });
            }
            throw error;
        }

        // Send Welcome Email via Resend
        try {
            console.log(`Attempting to send welcome email to: ${email}`);
            const { data, error: emailError } = await resend.emails.send({
                from: "KoroFinance <hello@korofinance.com>", // Ready once domain is verified
                to: email,
                subject: "Welcome to the Koro Brief! 📈",
                html: `
                    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; color: #1a1a1a;">
                        <h1 style="color: #00ff88; text-transform: uppercase;">Welcome to the Terminal.</h1>
                        <p>Thanks for subscribing to the <strong>Koro Brief</strong>.</p>
                        <p>You'll now receive weekly insights into the Nigerian Exchange (NGX), Crypto markets, and African financial policy, delivered straight to your inbox.</p>
                        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;" />
                        <p style="font-size: 12px; color: #666;">
                            Money's an easy thing. <br />
                            © 2026 Korofinance
                        </p>
                    </div>
                `,
            });

            if (emailError) {
                console.error("Resend API error:", emailError);
            } else {
                console.log("Welcome email sent successfully:", data?.id);
            }
        } catch (err: any) {
            console.error("Resend execution error:", err.message);
        }

        return NextResponse.json({ success: true, message: "Successfully subscribed!" });
    } catch (error) {
        console.error("Newsletter subscription error:", error);
        return NextResponse.json({ error: "Failed to subscribe. Please try again later." }, { status: 500 });
    }
}
