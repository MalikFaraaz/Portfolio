import { requireAdmin } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { redirect } from "next/navigation";

export default async function ProtectedAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  let session;
  try {
    session = await requireAdmin();
  } catch {
    redirect("/admin/login");
  }

  const unreadMessagesCount = await db.message.count({
    where: { read: false },
  });

  return (
    <div className="min-h-screen bg-bg text-ink flex flex-col md:flex-row">
      <AdminSidebar unreadMessagesCount={unreadMessagesCount} />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader email={session.email} />
        <main className="flex-1 p-6 md:p-8 max-w-6xl w-full mx-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
