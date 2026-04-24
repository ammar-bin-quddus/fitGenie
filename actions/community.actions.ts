"use server";

import { revalidatePath } from "next/cache";

import type { PostCategory } from "@prisma/client";

import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { commentSchema, postSchema } from "@/lib/validations/community";
import type { ActionState } from "@/types";

export async function createPost(
  values: Parameters<typeof postSchema.parse>[0],
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const validated = postSchema.parse(values);

    await prisma.post.create({
      data: {
        userId: session.user.id,
        content: validated.content,
        imageUrl: validated.imageUrl || undefined,
        category: validated.category,
      },
    });

    revalidatePath("/community");
    return { success: true };
  } catch (error) {
    console.error("[CREATE_POST_ERROR]", error);
    return { success: false, error: "Failed to create post." };
  }
}

export async function likePost(
  postId: string,
): Promise<ActionState<{ liked: boolean; likes: number }>> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const result = await prisma.$transaction(async (tx) => {
      const existingLike = await tx.postLike.findUnique({
        where: {
          postId_userId: {
            postId,
            userId: session.user.id,
          },
        },
      });

      if (existingLike) {
        const currentPost = await tx.post.findUnique({
          where: { id: postId },
          select: { likes: true },
        });

        const post = await tx.post.update({
          where: { id: postId },
          data: {
            likes: Math.max((currentPost?.likes ?? 0) - 1, 0),
          },
        });

        await tx.postLike.delete({
          where: { id: existingLike.id },
        });

        return { liked: false, likes: Math.max(post.likes, 0) };
      }

      await tx.postLike.create({
        data: {
          postId,
          userId: session.user.id,
        },
      });

      const post = await tx.post.update({
        where: { id: postId },
        data: {
          likes: {
            increment: 1,
          },
        },
      });

      return { liked: true, likes: post.likes };
    });

    revalidatePath("/community");
    return { success: true, data: result };
  } catch (error) {
    console.error("[LIKE_POST_ERROR]", error);
    return { success: false, error: "Failed to like post." };
  }
}

export async function addComment(
  values: Parameters<typeof commentSchema.parse>[0],
): Promise<ActionState> {
  try {
    const session = await auth();
    if (!session?.user?.id) return { success: false, error: "Unauthorized" };

    const validated = commentSchema.parse(values);

    await prisma.comment.create({
      data: {
        postId: validated.postId,
        userId: session.user.id,
        content: validated.content,
      },
    });

    revalidatePath("/community");
    return { success: true };
  } catch (error) {
    console.error("[ADD_COMMENT_ERROR]", error);
    return { success: false, error: "Failed to add comment." };
  }
}

export async function getPosts(filter: PostCategory = "ALL") {
  try {
    const session = await auth();
    const where = filter === "ALL" ? {} : { category: filter };

    const posts = await prisma.post.findMany({
      where,
      include: {
        user: true,
        ...(session?.user?.id
          ? {
              postLikes: {
                where: { userId: session.user.id },
                select: { id: true },
              },
            }
          : {}),
        comments: {
          include: {
            user: true,
          },
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      take: 20,
    });

    return posts.map(({ postLikes = [], ...post }) => ({
      ...post,
      viewerHasLiked: postLikes.length > 0,
    }));
  } catch (error) {
    console.error("[GET_POSTS_ERROR]", error);
    return [];
  }
}
