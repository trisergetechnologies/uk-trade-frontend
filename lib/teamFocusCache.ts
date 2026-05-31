import type { ApiSuccess, TeamFocusWindowDto } from "@/lib/api";

const CACHE_TTL_MS = 60_000;

type CacheEntry = {
  data: TeamFocusWindowDto;
  at: number;
};

const cache = new Map<string, CacheEntry>();
const inflight = new Map<string, Promise<TeamFocusWindowDto | null>>();

export function focusWindowCacheKey(userCode?: string, scope = "user"): string {
  return `${scope}:${userCode?.trim().toUpperCase() || "__self__"}:depth5`;
}

export function getCachedFocusWindow(key: string): TeamFocusWindowDto | null {
  const hit = cache.get(key);
  if (!hit) return null;
  if (Date.now() - hit.at > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return hit.data;
}

export function setCachedFocusWindow(key: string, data: TeamFocusWindowDto): void {
  cache.set(key, { data, at: Date.now() });
}

export async function fetchFocusWindowDeduped(
  key: string,
  fetcher: () => Promise<ApiSuccess<TeamFocusWindowDto>>
): Promise<TeamFocusWindowDto | null> {
  const cached = getCachedFocusWindow(key);
  if (cached) return cached;

  const pending = inflight.get(key);
  if (pending) return pending;

  const request = fetcher()
    .then((res) => {
      const data = res.data || null;
      if (data) setCachedFocusWindow(key, data);
      return data;
    })
    .finally(() => {
      inflight.delete(key);
    });

  inflight.set(key, request);
  return request;
}
