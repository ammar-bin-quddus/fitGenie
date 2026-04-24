import { Navbar } from "@/components/shared/Navbar";
import { Sidebar } from "@/components/shared/Sidebar";

export default async function DashboardLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mx-auto grid min-h-screen w-full max-w-[1600px] gap-6 px-4 py-6 lg:grid-cols-[288px_1fr] lg:px-6">
      <Sidebar />
      <div className="space-y-6">
        <Navbar />
        <main>{children}</main>
      </div>
    </div>
  );
}
