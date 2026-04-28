/**
 * Read `role` from JWT payload (client-side UI only; verification happens on the API).
 */
export function getRoleFromToken(token: string): string | null {
  if (!token) return null;
  try {
    const parts = token.split(".");
    if (parts.length < 2) return null;
    let base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
    while (base64.length % 4) base64 += "=";
    if (typeof atob === "undefined") return null;
    const json = JSON.parse(atob(base64)) as { role?: string };
    return typeof json.role === "string" ? json.role : null;
  } catch {
    return null;
  }
}
