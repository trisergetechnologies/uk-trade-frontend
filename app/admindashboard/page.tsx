import Link from "next/link";
import { ArrowRight, Banknote, CalendarDays, Wallet } from "lucide-react";

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-2xl font-semibold text-white">Admin dashboard</h1>
        <p className="text-slate-400 mt-1 text-sm">Review money in and money out. Lists are paginated.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 max-w-5xl">
        <Link
          href="/admindashboard/fund-requests"
          className="group rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06] hover:border-indigo-500/30 transition flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-indigo-500/15 text-indigo-300">
              <Banknote size={22} />
            </span>
            <ArrowRight className="text-slate-500 group-hover:text-indigo-300 transition" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-medium text-white">Payment requests</h2>
            <p className="text-sm text-slate-400 mt-1">Add-fund submissions, proof, approve or reject.</p>
          </div>
        </Link>

        <Link
          href="/admindashboard/withdrawals"
          className="group rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06] hover:border-emerald-500/30 transition flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-emerald-500/15 text-emerald-300">
              <Wallet size={22} />
            </span>
            <ArrowRight className="text-slate-500 group-hover:text-emerald-300 transition" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-medium text-white">Withdrawals</h2>
            <p className="text-sm text-slate-400 mt-1">User withdrawal queue with filters and pagination.</p>
          </div>
        </Link>

        <Link
          href="/admindashboard/holidays"
          className="group rounded-xl border border-white/10 bg-white/[0.03] p-6 hover:bg-white/[0.06] hover:border-amber-500/30 transition flex flex-col gap-3"
        >
          <div className="flex items-center justify-between">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-amber-500/15 text-amber-300">
              <CalendarDays size={22} />
            </span>
            <ArrowRight className="text-slate-500 group-hover:text-amber-300 transition" size={20} />
          </div>
          <div>
            <h2 className="text-lg font-medium text-white">Holidays</h2>
            <p className="text-sm text-slate-400 mt-1">IST dates when the market is closed (no trade credits).</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
