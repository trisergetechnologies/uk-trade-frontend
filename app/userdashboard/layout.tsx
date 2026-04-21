import Sidebar from "@/components/ui/Sidebar";
import DashboardNavbar from "@/components/ui/DashboardNavbar";

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-[#060A14] text-white overflow-hidden">

      <Sidebar />

      {/* ✅ min-h-0 is the critical fix — allows flex child to shrink */}
      <div className="flex-1 flex flex-col min-h-0">

        <DashboardNavbar />

        <main className="flex-1 overflow-y-auto px-8 py-8">
          {children}
        </main>

      </div>
    </div>
  );
}