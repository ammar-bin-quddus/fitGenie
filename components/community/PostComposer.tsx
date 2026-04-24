"use client";

import { PostCategory } from "@prisma/client";
import { useTransition } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { createPost } from "@/actions/community.actions";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { postSchema } from "@/lib/validations/community";
import type { z } from "zod";

type PostValues = z.infer<typeof postSchema>;

export function PostComposer() {
  const [isPending, startTransition] = useTransition();
  const form = useForm<PostValues>({
    resolver: zodResolver(postSchema),
    defaultValues: {
      content: "",
      imageUrl: "",
      category: PostCategory.ALL,
    },
  });

  const onSubmit = (values: PostValues) => {
    startTransition(async () => {
      const result = await createPost(values);
      if (!result.success) {
        toast.error(result.error);
        return;
      }

      toast.success("Post shared");
      form.reset({ content: "", imageUrl: "", category: PostCategory.ALL });
    });
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Share with the community</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Category</Label>
            <Select
              options={Object.values(PostCategory).map((value) => ({
                value,
                label: value,
              }))}
              {...form.register("category")}
            />
          </div>
          <div className="space-y-2">
            <Label>Post</Label>
            <Textarea {...form.register("content")} />
          </div>
          <Button type="submit" disabled={isPending}>
            {isPending ? "Posting..." : "Create Post"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
