import AdminSidebar from "@/components/admin/AdminSidebar";
import DashboardNavbar from "@/components/ui/DashboardNavbar";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-screen bg-[#060A14] text-white overflow-hidden">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-h-0">
        <DashboardNavbar />
        <main className="flex-1 overflow-y-auto px-8 py-8">{children}</main>
      </div>
    </div>
  );
}
