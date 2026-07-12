import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const verify = query({
  args: { password: v.string() },
  handler: async (ctx, args) => {
    const admin = await ctx.db.query("admins").first();
    if (!admin) return null;
    if (args.password !== admin.password) return null;
    return { success: true };
  },
});

export const seed = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("admins").first();
    if (existing) return "already seeded";
    await ctx.db.insert("admins", {
      username: "admin",
      password: "admin123",
    });
    return "seeded";
  },
});
