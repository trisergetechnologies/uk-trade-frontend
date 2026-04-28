import { AUTH_COOKIE_MAX_AGE, AUTH_TOKEN_COOKIE } from '@/lib/auth.constants';

const LEGACY_STORAGE_KEY = 'uk_trade_token';

/** Fired on same-tab login/logout so UI (navbar, hero) can refresh without reload. */
export const AUTH_CHANGE_EVENT = 'uk-trade-auth-change';

function notifyAuthChange() {
  if (typeof window === 'undefined') return;
  window.dispatchEvent(new CustomEvent(AUTH_CHANGE_EVENT));
}

function readCookie(name: string): string | null {
  if (typeof document === 'undefined') return null;
  const match = document.cookie.match(new RegExp(`(?:^|; )${name.replace(/[$()*+.?[\\\]^{|}]/g, '\\$&')}=([^;]*)`));
  return match ? decodeURIComponent(match[1]) : null;
}

/** Token for `Authorization` header (cookie is not sent to another origin / API gateway). */
export function getToken(): string {
  if (typeof window === 'undefined') return '';
  const fromCookie = readCookie(AUTH_TOKEN_COOKIE);
  if (fromCookie) return fromCookie;
  try {
    return localStorage.getItem(LEGACY_STORAGE_KEY) || '';
  } catch {
    return '';
  }
}

export function setAuthToken(token: string) {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  const secure = window.location.protocol === 'https:';
  const parts = [
    `${AUTH_TOKEN_COOKIE}=${encodeURIComponent(token)}`,
    'Path=/',
    `Max-Age=${AUTH_COOKIE_MAX_AGE}`,
    'SameSite=Lax',
  ];
  if (secure) parts.push('Secure');
  document.cookie = parts.join('; ');
  notifyAuthChange();
}

export function clearAuthToken() {
  if (typeof window === 'undefined') return;
  try {
    localStorage.removeItem(LEGACY_STORAGE_KEY);
  } catch {
    /* ignore */
  }
  document.cookie = `${AUTH_TOKEN_COOKIE}=; Path=/; Max-Age=0`;
  notifyAuthChange();
}

export function dashboardPathForRole(role: string) {
  return role === 'admin' ? '/admindashboard' : '/userdashboard';
}
