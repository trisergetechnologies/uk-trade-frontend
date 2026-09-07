"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  Search,
  Users,
  IndianRupee,
  Hash,
} from "lucide-react";
import { formatInr } from "@/lib/formatInr";
import {
  getAuthMe,
  getMyFundTransferRecipients,
  type FundTransferRecipientRow,
  type FundTransferRecipientsData,
} from "@/lib/api";

const ALLOWED_USER_CODE = "USRIWHLVT";

function formatDate(value?: string) {
  if (!value) return "-";
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? "-" : d.toLocaleString();
}

export default function TransferRecipientsReport() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [forbidden, setForbidden] = useState(false);
  const [data, setData] = useState<FundTransferRecipientsData | null>(null);
  const [search, setSearch] = useState("");
  const [expanded, setExpanded] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const me = await getAuthMe();
        const code = String(me.data.userCode || "").toUpperCase();
        if (code !== ALLOWED_USER_CODE) {
          setForbidden(true);
          return;
        }
        const res = await getMyFundTransferRecipients();
        setData(res.data);
      } catch (e) {
        const msg = e instanceof Error ? e.message : "Failed to load recipients";
        if (/not available|403|forbidden/i.test(msg)) setForbidden(true);
        else setError(msg);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const filtered = useMemo(() => {
    const rows = data?.recipients || [];
    const q = search.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter((r) => {
      const hay = [
        r.userCode,
        r.name,
        r.email,
        r.mobileNumber,
        r.referralCode,
        r.kycStatus,
        r.bankAccount?.bankName,
        r.bankAccount?.accountNumber,
        r.bankAccount?.upiId,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();
      return hay.includes(q);
    });
  }, [data, search]);

  function toggle(code: string) {
    setExpanded((prev) => (prev === code ? null : code));
  }

  if (forbidden) {
    return (
      <div className="min-h-screen bg-[#05070d] text-white p-6 flex items-center justify-center">
        <div className="max-w-md text-center space-y-4">
          <p className="text-slate-300">This report is not available for your account.</p>
          <Link
            href="/userdashboard/fund-transfer/fund-transfer-to-user"
            className="inline-flex items-center gap-2 px-3 py-2 text-sm rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
          >
            <ArrowLeft size={15} />
            Back to Transfer
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#05070d] text-white p-3 md:p-6">
      <div className="max-w-6xl mx-auto mb-8 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold">Transfer Recipients</h1>
          <p className="text-slate-400 text-sm mt-1">
            Users you sent money to, with profile and bank details
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            href="/userdashboard/fund-transfer/user-transfer-history"
            className="px-3 py-2 text-sm rounded-lg border border-white/10 bg-white/5 hover:bg-white/10"
          >
            Transfer history
          </Link>
          <Link
            href="/userdashboard/fund-transfer/fund-transfer-to-user"
            className="px-3 py-2 text-sm rounded-lg border border-white/10 bg-white/5 hover:bg-white/10 inline-flex items-center gap-2"
          >
            <ArrowLeft size={15} />
            Back to Transfer
          </Link>
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        <SummaryCard
          icon={Users}
          label="Recipients"
          value={String(data?.summary.recipientCount ?? 0)}
        />
        <SummaryCard
          icon={Hash}
          label="Transfers"
          value={String(data?.summary.transferCount ?? 0)}
        />
        <SummaryCard
          icon={IndianRupee}
          label="Total sent"
          value={formatInr(data?.summary.totalAmount ?? 0)}
        />
      </div>

      <div className="max-w-6xl mx-auto mb-4 relative">
        <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
        <input
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search by user ID, name, email, mobile, bank…"
          className="w-full pl-9 pr-3 py-2.5 rounded-xl border border-white/10 bg-white/5 text-sm outline-none focus:ring-2 focus:ring-indigo-500/40"
        />
      </div>

      <div className="max-w-6xl mx-auto rounded-3xl p-[1px] bg-gradient-to-br from-indigo-500/40 via-purple-500/30 to-transparent">
        <div className="bg-[#0b0f1a]/90 backdrop-blur-xl rounded-3xl border border-white/10 overflow-hidden">
          {loading && <div className="text-center py-12 text-slate-400 text-sm">Loading recipients…</div>}
          {error && <div className="text-center py-12 text-red-300 text-sm">{error}</div>}
          {!loading && !error && !filtered.length && (
            <div className="text-center py-12 text-slate-400 text-sm">No recipients found</div>
          )}

          <div className="divide-y divide-white/5">
            {filtered.map((row) => (
              <RecipientRow
                key={row.userCode}
                row={row}
                open={expanded === row.userCode}
                onToggle={() => toggle(row.userCode)}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function SummaryCard({
  icon: Icon,
  label,
  value,
}: {
  icon: typeof Users;
  label: string;
  value: string;
}) {
  return (
    <div className="p-[1px] rounded-2xl bg-gradient-to-br from-indigo-500/30 via-purple-500/20 to-transparent">
      <div className="bg-[#0b0f1a]/90 p-5 rounded-2xl border border-white/10 flex items-start gap-3">
        <div className="p-2 rounded-lg bg-white/5 text-indigo-300">
          <Icon size={18} />
        </div>
        <div>
          <p className="text-slate-400 text-sm">{label}</p>
          <h2 className="text-2xl font-semibold mt-1">{value}</h2>
        </div>
      </div>
    </div>
  );
}

function RecipientRow({
  row,
  open,
  onToggle,
}: {
  row: FundTransferRecipientRow;
  open: boolean;
  onToggle: () => void;
}) {
  const bank = row.bankAccount || {};
  return (
    <div>
      <button
        type="button"
        onClick={onToggle}
        className="w-full text-left px-4 md:px-6 py-4 hover:bg-white/5 transition flex flex-wrap items-center gap-3 md:gap-4"
      >
        <div className="flex-1 min-w-[160px]">
          <p className="font-semibold text-white">{row.name || "—"}</p>
          <p className="text-xs text-indigo-300 mt-0.5">{row.userCode}</p>
        </div>
        <div className="text-sm text-slate-300 min-w-[120px]">
          <p>{row.mobileNumber || "—"}</p>
          <p className="text-xs text-slate-500 truncate max-w-[200px]">{row.email || "—"}</p>
        </div>
        <div className="text-sm min-w-[90px]">
          <span
            className={`px-2 py-0.5 rounded-full text-xs border ${
              row.isActive
                ? "text-emerald-300 border-emerald-500/30 bg-emerald-500/10"
                : "text-rose-300 border-rose-500/30 bg-rose-500/10"
            }`}
          >
            {row.isActive ? "Active" : "Inactive"}
          </span>
          <p className="text-xs text-slate-500 mt-1 capitalize">KYC: {row.kycStatus || "—"}</p>
        </div>
        <div className="text-sm text-slate-300 min-w-[100px]">
          <p>{row.transferCount} txn{row.transferCount === 1 ? "" : "s"}</p>
          <p className="text-indigo-300 font-semibold">{formatInr(row.totalAmount)}</p>
        </div>
        <div className="text-slate-400">
          {open ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      {open && (
        <div className="px-4 md:px-6 pb-5 grid grid-cols-1 md:grid-cols-2 gap-4 text-sm bg-white/[0.02]">
          <DetailBlock title="Profile">
            <Detail label="User ID" value={row.userCode} />
            <Detail label="Name" value={row.name} />
            <Detail label="Email" value={row.email} />
            <Detail label="Mobile" value={row.mobileNumber} />
            <Detail label="Referral code" value={row.referralCode} />
            <Detail label="Community" value={row.preferredCommunity} />
            <Detail label="Registered" value={formatDate(row.registeredAt)} />
          </DetailBlock>

          <DetailBlock title="Transfers">
            <Detail label="Count" value={String(row.transferCount)} />
            <Detail label="Total amount" value={formatInr(row.totalAmount)} />
            <Detail label="First sent" value={formatDate(row.firstTransferAt)} />
            <Detail label="Last sent" value={formatDate(row.lastTransferAt)} />
            <Detail
              label="Notes"
              value={row.notes?.length ? row.notes.join(" · ") : "—"}
            />
          </DetailBlock>

          <DetailBlock title="Bank / UPI" className="md:col-span-2">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6">
              <Detail label="Account holder" value={bank.accountHolderName} />
              <Detail label="Bank name" value={bank.bankName} />
              <Detail label="Account number" value={bank.accountNumber} />
              <Detail label="IFSC" value={bank.ifscCode} />
              <Detail label="UPI ID" value={bank.upiId} />
            </div>
          </DetailBlock>
        </div>
      )}
    </div>
  );
}

function DetailBlock({
  title,
  children,
  className = "",
}: {
  title: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={`rounded-xl border border-white/10 bg-white/[0.03] p-4 ${className}`}>
      <p className="text-xs uppercase tracking-wider text-slate-500 mb-3">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

function Detail({ label, value }: { label: string; value?: string }) {
  return (
    <div className="flex flex-wrap gap-x-2 gap-y-0.5">
      <span className="text-slate-500 min-w-[110px]">{label}</span>
      <span className="text-slate-200 break-all">{value?.trim() ? value : "—"}</span>
    </div>
  );
}
