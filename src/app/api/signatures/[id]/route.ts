import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { generateSignatureImage } from "@/lib/generateImage";

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

  try {
    const imageUrl = await generateSignatureImage({
      id: signature.id,
      name: signature.name,
      title: signature.title,
      email: signature.email,
      phone: signature.phone,
      avatarUrl: signature.avatarUrl,
      companyLogoUrl: signature.companyLogoUrl,
      website: signature.website,
      address: signature.address,
      facebookUrl: signature.facebookUrl,
      instagramUrl: signature.instagramUrl,
      youtubeUrl: signature.youtubeUrl,
      taglineLine1: signature.taglineLine1,
      taglineLine2: signature.taglineLine2,
    });
    await prisma.signature.update({ where: { id }, data: { imageUrl } });
    signature.imageUrl = imageUrl;
  } catch (e) {
    console.error("Failed to regenerate signature image:", e);
  }

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
