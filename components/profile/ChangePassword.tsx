"use client";

import { useState } from "react";
import { Lock } from "lucide-react";

export default function ChangePassword() {
  const [form, setForm] = useState({
    current: "",
    newPass: "",
    confirm: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (form.newPass !== form.confirm) {
      alert("Passwords do not match");
      return;
    }

    console.log(form);
  };

  return (
    <div className="min-h-screen bg-[#03050a] text-white p-6 flex justify-center">

      <div className="w-full max-w-md bg-[#050816] border border-white/10 rounded-2xl p-6 shadow-xl">

        <h2 className="text-xl font-semibold mb-6">Change Password</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {["current", "newPass", "confirm"].map((field, i) => (
            <div key={i} className="relative">
              <Lock size={14} className="absolute left-3 top-3 text-slate-500" />
              <input
                type="password"
                name={field}
                placeholder={
                  field === "current"
                    ? "Current Password"
                    : field === "newPass"
                    ? "New Password"
                    : "Confirm Password"
                }
                onChange={handleChange}
                className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#03050a] border border-white/10 text-sm focus:border-indigo-500 outline-none"
              />
            </div>
          ))}

          <button className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 mt-2">
            Update Password
          </button>

        </form>
      </div>
    </div>
  );
}