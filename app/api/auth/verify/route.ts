import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const token = searchParams.get("token");

  if (!token) {
    return NextResponse.redirect(new URL("/signup?error=invalid", request.url));
  }

  try {
    // Verify the magic link token
    const email = await db.verifyMagicLinkToken(token);

    if (!email) {
      return NextResponse.redirect(
        new URL("/signup?error=expired", request.url)
      );
    }

    // Update user's last login
    await db.updateUserLastLogin(email);

    // In a real app, you would set a session cookie here
    // For now, redirect to a success page
    const response = NextResponse.redirect(
      new URL("/dashboard?success=true", request.url)
    );

    // Set a simple session cookie (in production, use proper session management)
    response.cookies.set("user_email", email, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7, // 7 days
    });

    return response;
  } catch (error) {
    console.error("Verification error:", error);
    return NextResponse.redirect(new URL("/signup?error=failed", request.url));
  }
}
