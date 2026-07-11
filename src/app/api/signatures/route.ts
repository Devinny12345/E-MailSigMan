import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const tag = searchParams.get("tag");

    const where = tag && tag !== "all" ? { tag } : {};

    const signatures = await prisma.signature.findMany({
      where,
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json(signatures);
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const signature = await prisma.signature.create({
      data: {
        name: body.name,
        title: body.title,
        email: body.email,
        phone: body.phone,
        avatarUrl: body.avatarUrl || "",
        loopingGifUrl: body.loopingGifUrl || "",
        landingPageUrl: body.landingPageUrl || "",
        tag: body.tag || "",
        isActive: body.isActive ?? true,
        companyLogoUrl: body.companyLogoUrl || "",
        website: body.website || "",
        address: body.address || "",
        facebookUrl: body.facebookUrl || "",
        instagramUrl: body.instagramUrl || "",
        youtubeUrl: body.youtubeUrl || "",
        taglineLine1: body.taglineLine1 || "",
        taglineLine2: body.taglineLine2 || "",
      },
    });

    return NextResponse.json(signature, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: String(error) }, { status: 500 });
  }
}
