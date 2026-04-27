"use client";

import { useEffect, useMemo, useState } from "react";
import { User, Mail, CheckCircle2 } from "lucide-react";
import { getAuthMe, putAuthMe, type AuthUser } from "@/lib/api";
import Link from "next/link";

export default function EditProfile() {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [form, setForm] = useState({
    name: "",
    email: "",
    preferredCommunity: "left" as "left" | "right",
  });

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        setLoading(true);
        setError(null);
        const res = await getAuthMe();
        if (cancelled) return;
        setUser(res.data);
        setForm({
          name: res.data.name || "",
          email: res.data.email || "",
          preferredCommunity: (res.data.preferredCommunity as "left" | "right") || "left",
        });
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "Failed to load profile");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const changed = useMemo(() => {
    if (!user) return false;
    return (
      form.name.trim() !== (user.name || "") ||
      form.email.trim().toLowerCase() !== (user.email || "").toLowerCase() ||
      form.preferredCommunity !== ((user.preferredCommunity as "left" | "right") || "left")
    );
  }, [form, user]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!changed) return;
    try {
      setSaving(true);
      setError(null);
      setSuccess(null);
      const res = await putAuthMe({
        name: form.name.trim(),
        email: form.email.trim(),
        preferredCommunity: form.preferredCommunity,
      });
      setUser(res.data);
      setSuccess("Profile updated successfully.");
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#03050a] text-white p-6 flex justify-center">
      <div className="w-full max-w-lg bg-[#050816] border border-white/10 rounded-2xl p-6 shadow-xl">
        <div className="mb-6 flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold">Edit Profile</h2>
            <p className="text-xs text-slate-400 mt-1">Keep account details up to date.</p>
          </div>
          <Link href="/userdashboard/profile" className="text-xs px-3 py-1.5 rounded-lg border border-white/10 hover:bg-white/5">
            Back
          </Link>
        </div>

        {loading && <div className="h-40 rounded-xl bg-white/5 animate-pulse border border-white/10" />}
        {!loading && (
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="relative">
              <User size={14} className="absolute left-3 top-3 text-slate-500" />
              <input
                name="name"
                placeholder="Full Name"
                value={form.name}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#03050a] border border-white/10 text-sm focus:border-indigo-500 outline-none"
              />
            </div>

            <div className="relative">
              <Mail size={14} className="absolute left-3 top-3 text-slate-500" />
              <input
                name="email"
                placeholder="Email Address"
                value={form.email}
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#03050a] border border-white/10 text-sm focus:border-indigo-500 outline-none"
              />
            </div>

            <div>
              <p className="text-sm text-slate-300 mb-2">Preferred community (default for referrals)</p>
              <div className="flex gap-3">
                {(["left", "right"] as const).map((side) => (
                  <label key={side} className="flex items-center gap-2 px-3 py-2 rounded-lg border border-white/10 bg-white/5">
                    <input
                      type="radio"
                      name="preferredCommunity"
                      checked={form.preferredCommunity === side}
                      onChange={() => setForm((prev) => ({ ...prev, preferredCommunity: side }))}
                      className="accent-indigo-500"
                    />
                    <span className="capitalize text-sm">{side}</span>
                  </label>
                ))}
              </div>
            </div>

            {error && <p className="text-sm text-red-300 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">{error}</p>}
            {success && (
              <p className="text-sm text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2 inline-flex items-center gap-2">
                <CheckCircle2 size={14} />
                {success}
              </p>
            )}

            <button
              disabled={!changed || saving}
              className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 mt-2 disabled:opacity-50"
            >
              {saving ? "Saving..." : "Save Changes"}
            </button>
          </form>
        )}

      </div>
    </div>
  );
}