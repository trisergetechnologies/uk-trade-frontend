"use client";

import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { authRegister, getReferrerLookup } from "@/lib/api";
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
  const [mobileNumber, setMobileNumber] = useState("");
  const [password, setPassword] = useState("");
  const [referralCode, setReferralCode] = useState("");
  // Empty = let the sponsor's preferred community decide placement.
  // Only set when the referral link explicitly carries ?community=left|right.
  const [community, setCommunity] = useState<"left" | "right" | "">("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [sponsorPreview, setSponsorPreview] = useState<{ name: string } | null>(null);
  const [sponsorLookupErr, setSponsorLookupErr] = useState<string | null>(null);
  const refFromLink = searchParams.get("ref") || searchParams.get("referralCode") || "";
  const sideFromLink = searchParams.get("community") || searchParams.get("side") || "";

  useEffect(() => {
    if (refFromLink) setReferralCode(refFromLink.trim());
    if (sideFromLink === "left" || sideFromLink === "right") {
      setCommunity(sideFromLink);
    }
  }, [refFromLink, sideFromLink]);

  useEffect(() => {
    const code = referralCode.trim();
    if (code.length < 3) {
      setSponsorPreview(null);
      setSponsorLookupErr(null);
      return;
    }
    const t = setTimeout(() => {
      (async () => {
        try {
          setSponsorLookupErr(null);
          const res = await getReferrerLookup(code);
          setSponsorPreview({ name: res.data.name });
        } catch {
          setSponsorPreview(null);
          setSponsorLookupErr("Invalid or unknown referral code");
        }
      })();
    }, 400);
    return () => clearTimeout(t);
  }, [referralCode]);

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await authRegister({
        name: name.trim(),
        email: email.trim(),
        mobileNumber: mobileNumber.trim(),
        password,
        referralCode: referralCode.trim(),
        ...(community ? { community } : {}),
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
            <label htmlFor="mobile" className="block text-sm text-gray-300 mb-1">
              Mobile number
            </label>
            <input
              id="mobile"
              type="tel"
              required
              minLength={7}
              maxLength={20}
              pattern="[0-9+\\-() ]{7,20}"
              title="7–20 digits or common phone characters"
              value={mobileNumber}
              onChange={(e) => setMobileNumber(e.target.value)}
              placeholder="+91 98765 43210"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500 placeholder:text-gray-600"
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
              placeholder="5-digit code from your sponsor"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-blue-500 placeholder:text-gray-600"
            />
            <p className="mt-1 text-xs text-gray-500">Use the 5-digit sponsor code received in the referral link or from your sponsor.</p>
            {sponsorPreview && (
              <p className="mt-2 text-sm text-emerald-400/95">
                Sponsor: <span className="font-medium text-white">{sponsorPreview.name}</span>
              </p>
            )}
            {referralCode.trim().length >= 3 && sponsorLookupErr && (
              <p className="mt-2 text-xs text-amber-400">{sponsorLookupErr}</p>
            )}
          </div>
          <div>
            <span className="block text-sm text-gray-300 mb-2">Community placement</span>
            {community ? (
              <p className="text-sm text-emerald-400/95">
                You will be placed on your sponsor&apos;s{" "}
                <span className="font-medium capitalize text-white">{community}</span> side (from your invite link).
              </p>
            ) : (
              <p className="text-xs text-gray-500">
                Your sponsor decides which side (left/right) you are placed on. This is set automatically from their
                referral link.
              </p>
            )}
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
