import AdminOverview from "@/components/admin/AdminOverview";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Admin dashboard</h1>
        <p className="text-slate-400 mt-1 text-sm">Operational overview of users, queues, and money flow.</p>
      </div>
      <AdminOverview />
    </div>
  );
}
