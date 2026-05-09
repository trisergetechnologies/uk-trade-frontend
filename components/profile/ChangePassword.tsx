"use client";

import { useState } from "react";
import { Lock } from "lucide-react";
import { patchMyPassword } from "@/lib/api";

export default function ChangePassword() {
  const [form, setForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    const { current, newPass, confirm } = form;
    if (!current || !newPass || !confirm) {
      setError("All password fields are required.");
      return;
    }
    if (current.length < 6) {
      setError("Current password must be at least 6 characters.");
      return;
    }
    if (newPass.length < 8) {
      setError("New password must be at least 8 characters.");
      return;
    }
    if (newPass !== confirm) {
      setError("New password and confirm password do not match.");
      return;
    }
    if (current === newPass) {
      setError("New password must be different from your current password.");
      return;
    }

    setLoading(true);
    try {
      await patchMyPassword({
        currentPassword: current,
        newPassword: newPass,
        confirmPassword: confirm,
      });
      setSuccess("Password updated successfully.");
      setForm({ current: "", newPass: "", confirm: "" });
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to change password.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#03050a] text-white p-6 flex justify-center">
      <div className="w-full max-w-md bg-[#050816] border border-white/10 rounded-2xl p-6 shadow-xl">
        <h2 className="text-xl font-semibold mb-6">Change Password</h2>

        <form onSubmit={(e) => void handleSubmit(e)} className="space-y-4">
          {["current", "newPass", "confirm"].map((field, i) => (
            <div key={i} className="relative">
              <Lock size={14} className="absolute left-3 top-3 text-slate-500" />
              <input
                type="password"
                name={field}
                value={form[field as keyof typeof form]}
                placeholder={
                  field === "current"
                    ? "Current Password"
                    : field === "newPass"
                      ? "New Password"
                      : "Confirm Password"
                }
                onChange={handleChange}
                autoComplete={
                  field === "current" ? "current-password" : "new-password"
                }
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#03050a] border border-white/10 text-sm focus:border-indigo-500 outline-none"
              />
            </div>
          ))}

          {error && <p className="text-sm text-red-400">{error}</p>}
          {success && <p className="text-sm text-emerald-400">{success}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 mt-2 disabled:opacity-50"
          >
            {loading ? "Saving…" : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}
