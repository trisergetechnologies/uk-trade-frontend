"use client";

import Link from "next/link";
import { User, Mail, Phone } from "lucide-react";

export default function ProfileView() {
  const user = {
    name: "Krishna",
    email: "krishna@gmail.com",
    phone: "9876543210",
  };

  return (
    <div className="w-full max-w-2xl mx-auto">

      <div className="bg-[#050816] border border-white/10 rounded-2xl p-6 shadow-xl">

        {/* HEADER */}
        <div className="flex items-center gap-4 mb-6">
          <div className="w-14 h-14 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-xl font-bold">
            {user.name[0]}
          </div>

          <div>
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-slate-400 text-sm">User Profile</p>
          </div>
        </div>

        {/* DETAILS */}
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
            <Phone size={16} className="text-indigo-400" />
            <span>{user.phone}</span>
          </div>
        </div>

        {/* ACTIONS */}
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