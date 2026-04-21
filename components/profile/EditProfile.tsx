"use client";

import { useState } from "react";
import { User, Mail, Phone } from "lucide-react";

export default function EditProfile() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log(form);
  };

  return (
    <div className="min-h-screen bg-[#03050a] text-white p-6 flex justify-center">

      <div className="w-full max-w-md bg-[#050816] border border-white/10 rounded-2xl p-6 shadow-xl">

        <h2 className="text-xl font-semibold mb-6">Edit Profile</h2>

        <form onSubmit={handleSubmit} className="space-y-4">

          {/* NAME */}
          <div className="relative">
            <User size={14} className="absolute left-3 top-3 text-slate-500" />
            <input
              name="name"
              placeholder="Full Name"
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#03050a] border border-white/10 text-sm focus:border-indigo-500 outline-none"
            />
          </div>

          {/* EMAIL */}
          <div className="relative">
            <Mail size={14} className="absolute left-3 top-3 text-slate-500" />
            <input
              name="email"
              placeholder="Email Address"
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#03050a] border border-white/10 text-sm focus:border-indigo-500 outline-none"
            />
          </div>

          {/* PHONE */}
          <div className="relative">
            <Phone size={14} className="absolute left-3 top-3 text-slate-500" />
            <input
              name="phone"
              placeholder="Phone Number"
              onChange={handleChange}
              className="w-full pl-9 pr-3 py-2 rounded-lg bg-[#03050a] border border-white/10 text-sm focus:border-indigo-500 outline-none"
            />
          </div>

          <button className="w-full py-2 rounded-lg bg-gradient-to-r from-indigo-600 to-purple-600 mt-2">
            Save Changes
          </button>

        </form>
      </div>
    </div>
  );
}