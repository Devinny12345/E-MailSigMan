import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { ConvexHttpClient } from "convex/browser";
import { api } from "@convex/_generated/api";

function getConvex() {
  return new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL!);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { password } = body;

  try {
    const convex = getConvex();
    const result = await convex.query(api.admins.verify, { password });

    if (!result) {
      return NextResponse.json({ error: "Invalid password" }, { status: 401 });
    }

    const tokenValue = process.env.ADMIN_TOKEN || "admin123_secure_token";
    const response = NextResponse.json({ success: true });
    response.cookies.set("admin_token", tokenValue, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
    });
    return response;
  } catch {
    return NextResponse.json({ error: "Auth service unavailable" }, { status: 503 });
  }
}
