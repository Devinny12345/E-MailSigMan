import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  signatures: defineTable({
    name: v.string(),
    title: v.string(),
    email: v.string(),
    phone: v.string(),
    avatarUrl: v.string(),
    loopingGifUrl: v.string(),
    landingPageUrl: v.string(),
    tag: v.string(),
    isActive: v.boolean(),
    companyLogoUrl: v.string(),
    website: v.string(),
    address: v.string(),
    facebookUrl: v.string(),
    instagramUrl: v.string(),
    youtubeUrl: v.string(),
    taglineLine1: v.string(),
    taglineLine2: v.string(),
    imageUrl: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_tag", ["tag"])
    .index("by_created", ["createdAt"]),

  admins: defineTable({
    username: v.string(),
    password: v.string(),
  }),
});
