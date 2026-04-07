const ACCESS_TOKEN_KEY = "accessToken";

export function getAccessToken(): string | null {
  if (typeof window === "undefined") {
    return null;
  }

  return window.localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function setAccessToken(token: string): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.setItem(ACCESS_TOKEN_KEY, token);
}

export function clearAccessToken(): void {
  if (typeof window === "undefined") {
    return;
  }

  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
}

function decodeJwtPayload(token: string): { exp?: number } | null {
  const parts = token.split(".");
  if (parts.length < 2) {
    return null;
  }

  const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/");
  const normalized = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=");

  try {
    const decoded =
      typeof window !== "undefined"
        ? window.atob(normalized)
        : Buffer.from(normalized, "base64").toString("utf8");

    return JSON.parse(decoded) as { exp?: number };
  } catch {
    return null;
  }
}

export function isTokenExpired(token: string, skewInSeconds = 5): boolean {
  const payload = decodeJwtPayload(token);
  if (!payload?.exp) {
    return false;
  }

  const nowInSeconds = Math.floor(Date.now() / 1000);
  return nowInSeconds >= payload.exp - skewInSeconds;
}
