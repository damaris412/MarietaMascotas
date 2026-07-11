import { redirect } from "next/navigation";
import { auth } from "@/server/auth/auth";
import { AdminSidebar } from "@/components/admin/AdminSidebar";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();

  if (!session?.user || session.user.role !== "ADMIN") {
    redirect("/acceso-admin");
  }

  return (
    <div className="flex min-h-[calc(100vh-1px)] bg-linen-dark">
      <AdminSidebar />
      <div className="flex-1 overflow-x-hidden px-6 py-8 md:px-10">{children}</div>
    </div>
  );
}
