/** HttpOnly=false so client `fetch` can attach `Authorization` (same-origin cookie is not sent to API gateway). */
export const AUTH_TOKEN_COOKIE = 'uk_trade_token';

/** Max-Age seconds (7 days). */
export const AUTH_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
