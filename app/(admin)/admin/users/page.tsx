import { getAdminUsers } from "@/actions/admin.actions";
import { PageHeader } from "@/components/shared/PageHeader";
import { Card, CardContent } from "@/components/ui/card";

export const dynamic = "force-dynamic";

export default async function AdminUsersPage() {
  const users = await getAdminUsers();

  return (
    <div className="space-y-6">
      <PageHeader title="Users" description="Review platform members and profiles." />
      <Card>
        <CardContent className="divide-y divide-white/10 p-0">
          {users.map((user) => (
            <div key={user.id} className="flex items-center justify-between px-6 py-4">
              <div>
                <p className="font-medium text-white">{user.name ?? "Unnamed user"}</p>
                <p className="text-sm text-slate-400">{user.email}</p>
              </div>
              <p className="text-sm text-slate-400">{user.role}</p>
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}
