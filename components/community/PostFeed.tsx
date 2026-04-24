"use client";

import { useState, useTransition } from "react";
import { Heart, MessageCircle, SendHorizonal } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { addComment, likePost } from "@/actions/community.actions";
import { Avatar } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { formatRelativeTime } from "@/lib/utils";

type PostItem = {
  id: string;
  content: string;
  imageUrl?: string | null;
  likes: number;
  viewerHasLiked: boolean;
  createdAt: Date;
  category: string;
  user: { name?: string | null; image?: string | null };
  comments: Array<{
    id: string;
    content: string;
    createdAt: Date;
    user: { name?: string | null };
  }>;
};

export function PostFeed({ posts }: { posts: PostItem[] }) {
  const router = useRouter();
  const [comment, setComment] = useState<Record<string, string>>({});
  const [postState, setPostState] = useState<
    Record<string, { likes: number; viewerHasLiked: boolean }>
  >(() =>
    Object.fromEntries(
      posts.map((post) => [
        post.id,
        { likes: post.likes, viewerHasLiked: post.viewerHasLiked },
      ]),
    ),
  );
  const [isPending, startTransition] = useTransition();

  return (
    <div className="space-y-4">
      {posts.map((post) => (
        <Card key={post.id}>
          <CardContent className="space-y-4 p-6">
            <div className="flex items-center gap-3">
              <Avatar fallback={post.user.name ?? "FG"} src={post.user.image} />
              <div>
                <p className="font-semibold text-white">{post.user.name ?? "FitGenie User"}</p>
                <p className="text-sm text-slate-400">
                  {post.category} | {formatRelativeTime(post.createdAt)}
                </p>
              </div>
            </div>
            <p className="text-sm leading-7 text-slate-200">{post.content}</p>
            {post.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={post.imageUrl}
                alt="Post attachment"
                className="max-h-96 w-full rounded-3xl border border-white/10 object-cover"
              />
            ) : null}
            <div className="flex gap-3">
              <Button
                variant={postState[post.id]?.viewerHasLiked ? "default" : "outline"}
                disabled={isPending}
                onClick={() =>
                  startTransition(async () => {
                    const result = await likePost(post.id);
                    if (!result.success) {
                      toast.error(result.error);
                      return;
                    }

                    setPostState((current) => ({
                      ...current,
                      [post.id]: {
                        likes: result.data?.likes ?? current[post.id]?.likes ?? post.likes,
                        viewerHasLiked:
                          result.data?.liked ?? current[post.id]?.viewerHasLiked ?? false,
                      },
                    }));
                    router.refresh();
                  })
                }
              >
                <Heart className="size-4" />
                {postState[post.id]?.likes ?? post.likes}
              </Button>
            </div>
            <div className="space-y-4 rounded-3xl border border-white/10 bg-white/[0.03] p-4">
              <div className="flex items-center gap-2 text-sm text-slate-400">
                <MessageCircle className="size-4" />
                Comments
              </div>
              <div className="space-y-3">
                {post.comments.length ? (
                  post.comments.map((item) => (
                    <div
                      key={item.id}
                      className="rounded-2xl border border-white/8 bg-slate-950/35 px-4 py-3"
                    >
                      <div className="flex items-center justify-between gap-3">
                        <p className="text-sm font-semibold text-white">
                          {item.user.name ?? "Member"}
                        </p>
                        <p className="text-xs text-slate-500">
                          {formatRelativeTime(item.createdAt)}
                        </p>
                      </div>
                      <p className="mt-2 text-sm leading-6 text-slate-300">{item.content}</p>
                    </div>
                  ))
                ) : (
                  <div className="rounded-2xl border border-dashed border-white/10 px-4 py-5 text-sm text-slate-500">
                    No comments yet. Start the conversation.
                  </div>
                )}
              </div>
              <div className="flex items-end gap-3">
                <Input
                  value={comment[post.id] ?? ""}
                  onChange={(event) =>
                    setComment((current) => ({
                      ...current,
                      [post.id]: event.target.value,
                    }))
                  }
                  placeholder="Add a comment"
                />
                <Button
                  disabled={isPending || !(comment[post.id] ?? "").trim()}
                  onClick={() =>
                    startTransition(async () => {
                      const value = comment[post.id];
                      if (!value?.trim()) return;
                      const result = await addComment({ postId: post.id, content: value });
                      if (!result.success) {
                        toast.error(result.error);
                        return;
                      }
                      setComment((current) => ({ ...current, [post.id]: "" }));
                      router.refresh();
                    })
                  }
                >
                  <SendHorizonal className="size-4" />
                  Reply
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
