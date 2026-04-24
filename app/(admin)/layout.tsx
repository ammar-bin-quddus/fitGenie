import { Navbar } from "@/components/shared/Navbar";

export default function AdminLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <div className="mx-auto min-h-screen max-w-7xl space-y-6 px-4 py-6 lg:px-6">
      <Navbar />
      <main>{children}</main>
    </div>
  );
}
