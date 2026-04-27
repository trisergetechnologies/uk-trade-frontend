"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { User, Mail, BadgeCheck, Copy, Share2, Link2 } from "lucide-react";
import { getAuthMe, type AuthUser } from "@/lib/api";

export default function ProfileView() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [shareSide, setShareSide] = useState<"left" | "right">("left");
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await getAuthMe();
        if (!cancelled) setUser(res.data);
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load profile");
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  if (error) {
    return (
      <div className="w-full max-w-2xl mx-auto text-sm text-amber-400 border border-white/10 rounded-2xl p-6">
        {error}
      </div>
    );
  }

  if (!user) {
    return (
      <div className="w-full max-w-2xl mx-auto h-48 rounded-2xl bg-white/5 border border-white/10 animate-pulse" />
    );
  }

  const initial = user.name?.[0] || "?";
  const referralUrl =
    typeof window !== "undefined"
      ? `${window.location.origin}/register?ref=${encodeURIComponent(user.referralCode || "")}&community=${shareSide}`
      : "";

  async function onCopy() {
    if (!referralUrl) return;
    try {
      await navigator.clipboard.writeText(referralUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {}
  }

  async function onShare() {
    if (!referralUrl) return;
    if (navigator.share) {
      try {
        await navigator.share({
          title: "Join via my referral",
          text: `Join with my referral and default community ${shareSide.toUpperCase()}.`,
          url: referralUrl,
        });
      } catch {}
      return;
    }
    await onCopy();
  }

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="bg-[#050816] border border-white/10 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xl font-bold">
            {initial}
          </div>

          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-slate-400 text-sm">User Profile</p>
          </div>
        </div>

        <div className="space-y-4 text-sm">
          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
            <User size={16} className="text-indigo-400" />
            <span>{user.name}</span>
          </div>

          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
            <Mail size={16} className="text-indigo-400" />
            <span>{user.email}</span>
          </div>

          <div className="flex items-center gap-3 bg-white/5 p-3 rounded-lg">
            <BadgeCheck size={16} className="text-indigo-400" />
            <span>{user.userCode || user.id}</span>
          </div>

          {user.referralCode && (
            <div className="bg-white/5 p-3 rounded-lg text-xs text-slate-400 space-y-3">
              <div className="flex items-center justify-between gap-2">
                <span className="text-slate-300 font-medium">Referral code</span>
                <code className="text-indigo-300">{user.referralCode}</code>
              </div>
              <div>
                <span className="text-slate-300 font-medium">Default community in link</span>
                <div className="mt-1 flex items-center gap-2">
                  {(["left", "right"] as const).map((side) => (
                    <button
                      type="button"
                      key={side}
                      onClick={() => setShareSide(side)}
                      className={`px-2 py-1 rounded-md border text-[11px] capitalize ${
                        shareSide === side
                          ? "border-indigo-400/30 bg-indigo-500/20 text-indigo-200"
                          : "border-white/10 bg-white/5 text-slate-300"
                      }`}
                    >
                      {side}
                    </button>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2 rounded-lg border border-white/10 bg-black/20 px-2 py-1.5">
                <Link2 size={12} className="text-slate-500 shrink-0" />
                <span className="truncate text-[11px] text-slate-300">{referralUrl || "Generating..."}</span>
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={onCopy}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-white/10 bg-white/5 hover:bg-white/10"
                >
                  <Copy size={12} />
                  {copied ? "Copied" : "Copy Link"}
                </button>
                <button
                  type="button"
                  onClick={onShare}
                  className="inline-flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-md border border-indigo-400/30 bg-indigo-500/20 text-indigo-100"
                >
                  <Share2 size={12} />
                  Share
                </button>
              </div>
            </div>
          )}
        </div>

        <div className="flex gap-4 mt-6">
          <Link
            href="/userdashboard/profile/edit"
            className="flex-1 text-center bg-gradient-to-r from-indigo-600 to-purple-600 py-2 rounded-lg"
          >
            Edit Profile
          </Link>

          <Link
            href="/userdashboard/profile/change-password"
            className="flex-1 text-center border border-white/10 py-2 rounded-lg hover:bg-white/5"
          >
            Change Password
          </Link>
        </div>
      </div>
    </div>
  );
}
