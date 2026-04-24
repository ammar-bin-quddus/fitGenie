import { PostCategory } from "@prisma/client";
import { z } from "zod";

export const postSchema = z.object({
  content: z.string().min(3).max(500),
  imageUrl: z.string().url().optional().or(z.literal("")),
  category: z.nativeEnum(PostCategory),
});

export const commentSchema = z.object({
  postId: z.string().min(1),
  content: z.string().min(1).max(280),
});
