import type { Metadata } from "next";
import AdminShell from "@/components/admin/AdminShell";
import "@/styles/admin-panel.css";
import "@/styles/blog-public.css";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export const metadata: Metadata = {
  title: "Blog Admin",
  robots: { index: false, follow: false },
};

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="admin-root">
      <AdminShell>{children}</AdminShell>
    </div>
  );
}
