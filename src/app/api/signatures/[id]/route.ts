import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  const signature = await prisma.signature.findUnique({ where: { id } });

  if (!signature) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(signature);
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();

  const signature = await prisma.signature.update({
    where: { id },
    data: {
      name: body.name,
      title: body.title,
      email: body.email,
      phone: body.phone,
      avatarUrl: body.avatarUrl,
      loopingGifUrl: body.loopingGifUrl,
      landingPageUrl: body.landingPageUrl,
      tag: body.tag,
      isActive: body.isActive,
      companyLogoUrl: body.companyLogoUrl,
      website: body.website,
      address: body.address,
      facebookUrl: body.facebookUrl,
      instagramUrl: body.instagramUrl,
      youtubeUrl: body.youtubeUrl,
      taglineLine1: body.taglineLine1,
      taglineLine2: body.taglineLine2,
    },
  });

  return NextResponse.json(signature);
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  await prisma.signature.delete({ where: { id } });

  return NextResponse.json({ success: true });
}
