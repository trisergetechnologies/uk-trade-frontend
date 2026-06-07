const IST = "Asia/Kolkata";

export function getTodayIstYmd(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: IST,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

export function toIstYmd(d: string | Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: IST,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(typeof d === "string" ? new Date(d) : d);
}

function parseIstInput(value: string | Date): Date {
  if (typeof value === "string" && /^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return new Date(`${value}T00:00:00+05:30`);
  }
  return typeof value === "string" ? new Date(value) : value;
}

/** Calendar date in India timezone (e.g. for purchaseDateIst). */
export function formatIstDate(value: string | Date | null | undefined): string {
  if (value == null || value === "") return "—";
  const d = parseIstInput(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST,
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(d);
}

/** Full date and time in India timezone (for admin timestamps, ledgers, etc.). */
export function formatIstDateTime(value: string | Date | null | undefined): string {
  if (value == null || value === "") return "—";
  const d = parseIstInput(value);
  if (Number.isNaN(d.getTime())) return "—";
  return new Intl.DateTimeFormat("en-IN", {
    timeZone: IST,
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    second: "2-digit",
    hour12: true,
    timeZoneName: "short",
  }).format(d);
}
