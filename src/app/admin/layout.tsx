import { AdminSidebar } from "@/components/admin-sidebar";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="grid gap-6 md:grid-cols-[220px_1fr]">
      <AdminSidebar />
      <div className="space-y-4">{children}</div>
    </div>
  );
}
