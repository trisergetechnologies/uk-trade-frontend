"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useMemo, useState } from "react";
import { authRegister } from "@/lib/api";
import { dashboardPathForRole, setAuthToken } from "@/lib/session";

function safePostLoginPath(from: string | null, role: string) {
  const fallback = dashboardPathForRole(role);
  if (!from || !from.startsWith("/")) return fallback;
  if (from.startsWith("/userdashboard") || from.startsWith("/admindashboard")) {
    if (role !== "admin" && from.startsWith("/admindashboard")) return "/userdashboard";
    return from;
  }
  return fallback;
}

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  const [community, setCommunity] = useState<"left" | "right">("left");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const refFromLink = searchParams.get("ref") || searchParams.get("referralCode") || "";
  const sideFromLink = searchParams.get("community") || searchParams.get("side") || "";

  useEffect(() => {
    if (refFromLink) setReferralCode(refFromLink.trim().toUpperCase());
    if (sideFromLink === "left" || sideFromLink === "right") {
      setCommunity(sideFromLink);
    }
  }, [refFromLink, sideFromLink]);

  const isReferralPrefilled = useMemo(() => Boolean(refFromLink), [refFromLink]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authRegister({
        name: name.trim(),
        email: email.trim(),
        password,
        referralCode: referralCode.trim(),
        community,
      });
      setAuthToken(res.data.token);
      router.push(safePostLoginPath(searchParams.get("from"), res.data.user.role));
      router.refresh();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Registration failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-[#060A14] text-white px-4 py-12">
      <div className="w-full max-w-md rounded-2xl border border-white/10 bg-white/5 p-8 shadow-xl">
        <h1 className="text-2xl font-bold text-center">Create account</h1>
        <p className="mt-2 text-center text-sm text-gray-400">
          You need a valid sponsor referral code. Already registered?{" "}
          <Link href="/login" className="text-blue-400 hover:underline">
            Sign in
          </Link>
        </p>
        {isReferralPrefilled && (
          <p className="mt-3 text-xs text-emerald-300 bg-emerald-500/10 border border-emerald-500/20 rounded-lg px-3 py-2">
            Referral link detected. Sponsor code and default community have been auto-filled.
          </p>
        )}

        <form onSubmit={onSubmit} className="mt-8 space-y-4">
          <div>
            <label htmlFor="name" className="block text-sm text-gray-300 mb-1">
              Name
            </label>
            <input
              id="name"
              required
              minLength={2}
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm text-gray-300 mb-1">
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm text-gray-300 mb-1">
              Password (min 6 characters)
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={6}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500"
            />
          </div>
          <div>
            <label htmlFor="referral" className="block text-sm text-gray-300 mb-1">
              Sponsor referral code
            </label>
            <input
              id="referral"
              required
              minLength={3}
              value={referralCode}
              onChange={(e) => setReferralCode(e.target.value)}
              placeholder="e.g. UTXXXXXX from your sponsor"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500 placeholder:text-gray-600"
            />
            <p className="mt-1 text-xs text-gray-500">Use the sponsor code received in referral link or from your sponsor.</p>
          </div>
          <div>
            <span className="block text-sm text-gray-300 mb-2">Preferred community</span>
            <div className="flex gap-4">
              {(["left", "right"] as const).map((side) => (
                <label key={side} className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="radio"
                    name="community"
                    checked={community === side}
                    onChange={() => setCommunity(side)}
                    className="accent-blue-500"
                  />
                  <span className="capitalize">{side}</span>
                </label>
              ))}
            </div>
          </div>

          {error && (
            <p className="text-sm text-red-400 bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-xl bg-gradient-to-r from-purple-600 to-blue-600 py-3 font-semibold hover:opacity-90 disabled:opacity-50 transition"
          >
            {loading ? "Creating account…" : "Create account"}
          </button>
        </form>
      </div>
      <Link href="/" className="mt-8 text-sm text-gray-400 hover:text-white">
        ← Back to home
      </Link>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen flex items-center justify-center bg-[#060A14] text-slate-400 text-sm">
          Loading…
        </div>
      }
    >
      <RegisterForm />
    </Suspense>
  );
}
