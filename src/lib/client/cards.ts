/** Cards this device has opened, kept so the host can find them again without any account. */
const KEY = "invitely:cards:v1";

export function getCardTokens(): string[] {
  try {
    const raw = window.localStorage.getItem(KEY);
    const list: unknown = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) ? list.filter((t): t is string => typeof t === "string") : [];
  } catch {
    return [];
  }
}

export function rememberCard(token: string): void {
  try {
    const list = getCardTokens().filter((t) => t !== token);
    list.unshift(token);
    window.localStorage.setItem(KEY, JSON.stringify(list.slice(0, 50)));
  } catch {
    // Private browsing or full storage. The manage link itself still works.
  }
}

export function forgetCard(token: string): void {
  try {
    window.localStorage.setItem(KEY, JSON.stringify(getCardTokens().filter((t) => t !== token)));
  } catch {
    // Nothing to do.
  }
}
