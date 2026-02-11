import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { sendEmail, generateMagicLinkEmail } from "@/lib/email";

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email || !email.includes("@")) {
      return NextResponse.json(
        { error: "Valid email is required" },
        { status: 400 }
      );
    }

    // Check if user exists, if not create them
    let user = await db.findUserByEmail(email);
    if (!user) {
      user = await db.createUser(email);
    }

    // Generate magic link token
    const token = await db.createMagicLinkToken(email);

    // Send email with magic link
    const emailHtml = generateMagicLinkEmail(email, token);
    await sendEmail({
      to: email,
      subject: "Your SuperRichie Magic Link",
      html: emailHtml,
    });

    return NextResponse.json({
      success: true,
      message: "Magic link sent to your email",
    });
  } catch (error) {
    console.error("Magic link error:", error);
    return NextResponse.json(
      { error: "Failed to send magic link" },
      { status: 500 }
    );
  }
}
