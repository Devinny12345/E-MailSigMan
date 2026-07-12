import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const list = query({
  args: { tag: v.optional(v.string()) },
  handler: async (ctx, args) => {
    if (args.tag && args.tag !== "all") {
      return await ctx.db
        .query("signatures")
        .withIndex("by_tag", (q) => q.eq("tag", args.tag!))
        .order("desc")
        .collect();
    }
    return await ctx.db
      .query("signatures")
      .withIndex("by_created")
      .order("desc")
      .collect();
  },
});

export const get = query({
  args: { id: v.id("signatures") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});

export const create = mutation({
  args: {
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
  },
  handler: async (ctx, args) => {
    const now = Date.now();
    return await ctx.db.insert("signatures", {
      ...args,
      imageUrl: "",
      createdAt: now,
      updatedAt: now,
    });
  },
});

export const update = mutation({
  args: {
    id: v.id("signatures"),
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
  },
  handler: async (ctx, args) => {
    const { id, ...data } = args;
    await ctx.db.patch(id, { ...data, updatedAt: Date.now() });
    return await ctx.db.get(id);
  },
});

export const updateImageUrl = mutation({
  args: {
    id: v.id("signatures"),
    imageUrl: v.string(),
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.id, { imageUrl: args.imageUrl, updatedAt: Date.now() });
    return await ctx.db.get(args.id);
  },
});

export const remove = mutation({
  args: { id: v.id("signatures") },
  handler: async (ctx, args) => {
    await ctx.db.delete(args.id);
  },
});
