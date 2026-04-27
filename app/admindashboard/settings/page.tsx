"use client";

import { useState } from "react";
import { KeyRound, ShieldCheck } from "lucide-react";
import { patchMyPassword } from "@/lib/api";

export default function AdminSettingsPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const submit = async () => {
    setError("");
    setSuccess("");
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError("All password fields are required.");
      return;
    }
    if (newPassword.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPassword !== confirmPassword) {
      setError("New password and confirm password do not match.");
      return;
    }
    setLoading(true);
    try {
      await patchMyPassword({ currentPassword, newPassword, confirmPassword });
      setSuccess("Password updated successfully.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
        <h1 className="text-2xl font-semibold text-white flex items-center gap-2">
          <ShieldCheck size={22} className="text-indigo-300" />
          General settings
        </h1>
        <p className="text-sm text-slate-400 mt-1">
          Update sensitive account settings for this admin profile.
        </p>
      </div>

      <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 space-y-4">
        <h2 className="text-lg font-medium text-white flex items-center gap-2">
          <KeyRound size={18} className="text-amber-300" />
          Change password
        </h2>
        <p className="text-xs text-slate-500">
          Use a strong password (minimum 8 characters). You will need your current password to confirm this change.
        </p>

        <input
          type="password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          placeholder="Current password"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New password"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm new password"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white"
        />

        {error && <p className="text-sm text-red-400">{error}</p>}
        {success && <p className="text-sm text-emerald-400">{success}</p>}

        <button
          type="button"
          disabled={loading}
          onClick={() => void submit()}
          className="rounded-lg bg-indigo-600 px-4 py-2 text-sm text-white hover:bg-indigo-500 disabled:opacity-50"
        >
          {loading ? "Saving..." : "Update password"}
        </button>
      </div>
    </div>
  );
}
