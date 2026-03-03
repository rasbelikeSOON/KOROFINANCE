import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

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

        return NextResponse.json({ success: true, message: "Successfully subscribed!" });
    } catch (error) {
        console.error("Newsletter subscription error:", error);
        return NextResponse.json({ error: "Failed to subscribe. Please try again later." }, { status: 500 });
    }
}
