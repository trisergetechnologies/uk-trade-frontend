"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { ArrowLeft } from "lucide-react";
import TeamVisualTree from "@/components/team/TeamVisualTree";
import { getAdminUserTeamFocus } from "@/lib/api";

export default function AdminUserTreePage() {
  const params = useParams<{ userCode: string }>();
  const rootUserCode = decodeURIComponent(String(params?.userCode || "")).toUpperCase();

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center gap-3">
        <Link
          href={`/admindashboard/users/${encodeURIComponent(rootUserCode)}`}
          className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
        >
          <ArrowLeft size={16} />
          Back to user
        </Link>
      </div>
      <h1 className="text-2xl font-semibold text-white">Team tree — {rootUserCode}</h1>
      <p className="text-sm text-slate-400">Admin view: same focus window as the member sees, rooted at this user.</p>
      <TeamVisualTree
        loading={false}
        variant="admin"
        fetchFocusWindow={(targetUserCode) => getAdminUserTeamFocus(rootUserCode, targetUserCode)}
      />
    </div>
  );
}
