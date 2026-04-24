import { ChatInterface } from "@/components/ai-coach/ChatInterface";
import { PageHeader } from "@/components/shared/PageHeader";

export const dynamic = "force-dynamic";

export default function AICoachPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        title="AI Coach"
        description="Get coaching support, plan ideas, and practical answers in one place."
      />
      <ChatInterface />
    </div>
  );
}
