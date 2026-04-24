import { getPosts } from "@/actions/community.actions";
import { PostComposer } from "@/components/community/PostComposer";
import { PostFeed } from "@/components/community/PostFeed";
import { PageHeader } from "@/components/shared/PageHeader";

export const dynamic = "force-dynamic";

export default async function CommunityPage() {
  const posts = await getPosts();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Community"
        description="Share wins, ask questions, and learn from others."
      />
      <PostComposer />
      <PostFeed posts={posts} />
    </div>
  );
}
