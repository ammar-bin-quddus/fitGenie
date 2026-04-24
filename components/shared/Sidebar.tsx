import { auth } from "@/lib/auth";
import { SidebarNav } from "@/components/shared/SidebarNav";

export async function Sidebar() {
  const session = await auth();

  return <SidebarNav isAdmin={session?.user?.role === "ADMIN"} />;
}
