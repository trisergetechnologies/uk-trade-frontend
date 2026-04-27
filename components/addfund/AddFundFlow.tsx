"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { ArrowLeft, ArrowRight, CheckCircle2, History, IndianRupee, Loader2, Upload } from "lucide-react";
import { apiFetch } from "@/lib/api";

const MAX_SCREENSHOT_CHARS = 600_000;

/** Temporary payment details — replace with real UPI / bank when ready. */
const PAYMENT_DETAILS = {
  beneficiary: "UK Trade Collections (Demo)",
  bankName: "Example Bank Ltd.",
  accountNumber: "XXXX1234567890",
  ifsc: "EXBK0001234",
  upiId: "uktrade.pay@examplebank",
};

type Step = 1 | 2;

export default function AddFundFlow() {
  const [step, setStep] = useState<Step>(1);
  const [amount, setAmount] = useState("");
  const [notes, setNotes] = useState("");
  const [screenshotDataUrl, setScreenshotDataUrl] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [done, setDone] = useState(false);

  function onPickFile(file: File | null) {
    setError(null);
    setScreenshotDataUrl(null);
    setFileName(null);
    if (!file) return;
    if (!file.type.startsWith("image/")) {
      setError("Please choose an image file (PNG or JPG).");
      return;
    }
    const reader = new FileReader();
    reader.onload = () => {
      const result = typeof reader.result === "string" ? reader.result : "";
      if (result.length > MAX_SCREENSHOT_CHARS) {
        setError("Image is too large. Use a smaller screenshot (under ~400KB).");
        return;
      }
      setScreenshotDataUrl(result);
      setFileName(file.name);
    };
    reader.readAsDataURL(file);
  }

  async function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    const n = Number(amount);
    if (!Number.isFinite(n) || n < 100) {
      setError("Enter a valid amount (minimum ₹100).");
      return;
    }
    if (!screenshotDataUrl) {
      setError("Upload a payment screenshot.");
      return;
    }
    setLoading(true);
    try {
      await apiFetch("/api/fund-requests", {
        method: "POST",
        body: JSON.stringify({
          amount: n,
          screenshotUrl: screenshotDataUrl,
          notes: notes.trim() || "Add fund request",
        }),
      });
      setDone(true);
      setAmount("");
      setNotes("");
      setScreenshotDataUrl(null);
      setFileName(null);
      setStep(1);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      setLoading(false);
    }
  }

  if (done) {
    return (
      <div className="relative w-full max-w-lg mx-auto px-4 py-6 md:py-10">
        <div className="mb-6">
          <Link
            href="/userdashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white transition"
          >
            <ArrowLeft size={18} aria-hidden />
            Back to dashboard
          </Link>
        </div>
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-6 md:p-8 text-center">
          <CheckCircle2 className="mx-auto text-emerald-400 mb-4" size={48} aria-hidden />
          <h1 className="text-xl font-semibold text-white">Request sent</h1>
          <p className="text-sm text-slate-400 mt-2">
            Your payment is <span className="text-amber-200">pending</span> until an admin approves it.
          </p>
          <p className="text-xs text-slate-500 mt-3">
            Track it under <strong className="text-slate-400">Finance → Add fund → Request history</strong> on the left menu, or use the link below.
          </p>
          <div className="mt-6 flex flex-col gap-2">
            <Link
              href="/userdashboard/add-fund/history"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-white/15 bg-white/5 px-4 py-2.5 text-sm text-white hover:bg-white/10"
            >
              <History size={16} aria-hidden />
              Open request history
            </Link>
            <Link
              href="/userdashboard"
              className="text-sm text-indigo-300 hover:underline"
            >
              Return to dashboard
            </Link>
            <button
              type="button"
              onClick={() => setDone(false)}
              className="text-sm text-slate-500 hover:text-slate-300 pt-1"
            >
              Submit another payment
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="relative w-full max-w-2xl mx-auto px-4 py-6 md:py-8">
      {/* Top navigation — always know where you are and how to leave */}
      <header className="mb-6 space-y-4">
        <div className="flex items-center justify-between gap-3 flex-wrap">
          <Link
            href="/userdashboard"
            className="inline-flex items-center gap-2 text-sm text-slate-300 hover:text-white transition shrink-0"
          >
            <ArrowLeft size={18} aria-hidden />
            <span>Dashboard</span>
          </Link>
          <Link
            href="/userdashboard/add-fund/history"
            className="inline-flex items-center gap-1.5 text-sm text-indigo-300/90 hover:text-indigo-200"
          >
            <History size={16} aria-hidden />
            Request history
          </Link>
        </div>
        <div>
          <p className="text-xs font-medium uppercase tracking-wider text-slate-500">Finance · Add fund</p>
          <h1 className="text-2xl font-bold text-white mt-1">Add money to your wallet</h1>
          <p className="text-sm text-slate-400 mt-1.5 max-w-prose">
            {step === 1
              ? "Step 1 of 2 — Use the details below to pay, then go to the next step to tell us how much you sent and upload proof."
              : "Step 2 of 2 — Enter the amount, attach your payment screenshot, and send for admin review."}
          </p>
        </div>
        <div
          className="flex h-2 rounded-full bg-white/5 overflow-hidden"
          role="progressbar"
          aria-valuenow={step}
          aria-valuemin={1}
          aria-valuemax={2}
          aria-label="Add fund progress"
        >
          <div
            className="h-full bg-indigo-500 transition-[width] duration-200"
            style={{ width: step === 1 ? "50%" : "100%" }}
          />
        </div>
        <p className="text-xs text-slate-500">
          <span className="text-slate-400">{step === 1 ? "① Pay" : "✓ Pay"}</span>
          <span className="mx-2">→</span>
          <span className={step === 2 ? "text-slate-300" : "text-slate-500"}>② Proof &amp; submit</span>
        </p>
      </header>

      {step === 1 && (
        <section className="space-y-6 rounded-2xl border border-white/10 bg-[#0b0f1a]/90 p-6 md:p-8" aria-labelledby="step1-title">
          <h2 id="step1-title" className="text-lg font-semibold text-white">
            Pay (QR or bank / UPI)
          </h2>
          <p className="text-sm text-slate-400">
            Do not close this page until you finish. After paying, use the button at the bottom to continue.
          </p>

          <div className="flex flex-col items-center gap-3 rounded-xl border border-white/10 bg-black/30 p-6">
            <Image
              src="/add-fund-qr-placeholder.svg"
              alt="Scan to pay with UPI"
              width={200}
              height={200}
              className="rounded-lg"
              priority
            />
          </div>

          <div className="rounded-xl border border-white/10 bg-white/5 p-4 text-sm text-slate-300 space-y-2">
            <p className="font-medium text-white">Bank transfer</p>
            <p>
              <span className="text-slate-500">Beneficiary: </span>
              {PAYMENT_DETAILS.beneficiary}
            </p>
            <p>
              <span className="text-slate-500">Bank: </span>
              {PAYMENT_DETAILS.bankName}
            </p>
            <p>
              <span className="text-slate-500">Account: </span>
              {PAYMENT_DETAILS.accountNumber}
            </p>
            <p>
              <span className="text-slate-500">IFSC: </span>
              {PAYMENT_DETAILS.ifsc}
            </p>
            <p className="pt-2 font-medium text-white">UPI</p>
            <p>
              <span className="text-slate-500">UPI ID: </span>
              <span className="text-indigo-300">{PAYMENT_DETAILS.upiId}</span>
            </p>
          </div>

          <button
            type="button"
            onClick={() => setStep(2)}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-semibold text-white hover:opacity-95"
          >
            I have paid — next: amount &amp; proof
            <ArrowRight size={18} aria-hidden />
          </button>
        </section>
      )}

      {step === 2 && (
        <form
          onSubmit={onSubmit}
          className="space-y-6 rounded-2xl border border-white/10 bg-[#0b0f1a]/90 p-6 md:p-8"
          aria-labelledby="step2-title"
        >
          <h2 id="step2-title" className="text-lg font-semibold text-white">
            Confirm payment
          </h2>

          <button
            type="button"
            onClick={() => setStep(1)}
            className="inline-flex items-center gap-2 text-sm text-slate-400 hover:text-white"
          >
            <ArrowLeft size={16} aria-hidden />
            Back to pay &amp; details
          </button>

          <div>
            <label htmlFor="add-fund-amount" className="mb-2 block text-sm text-slate-300">
              Amount you paid (₹)
            </label>
            <div className="relative">
              <IndianRupee className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500" size={18} aria-hidden />
              <input
                id="add-fund-amount"
                type="number"
                min={100}
                step={1}
                required
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="e.g. 5000"
                className="w-full rounded-xl border border-white/10 bg-black/40 py-3 pl-10 pr-4 text-white outline-none focus:border-indigo-500"
              />
            </div>
            <p className="mt-1 text-xs text-slate-500">Minimum ₹100. Should match your transfer.</p>
          </div>

          <div>
            <span className="mb-2 block text-sm text-slate-300">Payment screenshot</span>
            <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-xl border border-dashed border-white/20 bg-white/5 py-8 hover:bg-white/10">
              <Upload className="text-slate-400" size={28} aria-hidden />
              <span className="text-sm text-slate-400">{fileName || "Tap to upload an image"}</span>
              <input type="file" accept="image/*" className="hidden" onChange={(e) => onPickFile(e.target.files?.[0] || null)} />
            </label>
            {screenshotDataUrl && (
              <Image
                src={screenshotDataUrl}
                alt="Your payment screenshot preview"
                width={400}
                height={300}
                unoptimized
                className="mt-3 max-h-48 w-auto rounded-lg border border-white/10 object-contain"
              />
            )}
          </div>

          <div>
            <label htmlFor="add-fund-notes" className="mb-2 block text-sm text-slate-300">
              Notes (optional)
            </label>
            <textarea
              id="add-fund-notes"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="UTR, bank ref, or anything that helps match your payment"
              className="w-full rounded-xl border border-white/10 bg-black/40 px-4 py-3 text-white outline-none focus:border-indigo-500 placeholder:text-slate-600"
            />
          </div>

          {error && (
            <p className="rounded-lg border border-red-500/30 bg-red-500/10 px-3 py-2 text-sm text-red-300" role="alert">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 py-3 font-semibold text-white disabled:opacity-50"
          >
            {loading ? <Loader2 className="animate-spin" size={20} aria-hidden /> : null}
            {loading ? "Submitting…" : "Submit for review"}
          </button>
        </form>
      )}
    </div>
  );
}
