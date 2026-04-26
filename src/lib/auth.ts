// Decodifica um JWT e retorna o payload (ou null se inválido)
function decodeJwtPayload(token: string): any | null {
  try {
    const payload = token.split('.')[1];
    const decoded = atob(payload.replace(/-/g, '+').replace(/_/g, '/'));
    return JSON.parse(decodeURIComponent(escape(decoded)));
  } catch {
    return null;
  }
}

// Verifica se o token JWT está expirado
export function isTokenExpired(token: string | null): boolean {
  if (!token) return true;
  const payload = decodeJwtPayload(token);
  if (!payload || !payload.exp) return true;
  const now = Math.floor(Date.now() / 1000);
  return payload.exp < now;
}

// Versão aprimorada de isAuthenticated, agora checa expiração do token
export function isAuthenticated(): boolean {
  const token = getAccessToken();
  const user = getAuthUser();
  if (!token || !user?.id) return false;
  if (isTokenExpired(token)) {
    clearAuthSession();
    return false;
  }
  return true;
}
export { hasRequiredConsent } from './hasRequiredConsent';
import type { AuthUser } from "./types";

const ACCESS_TOKEN_KEY = "newbank_access_token";
const AUTH_USER_KEY = "newbank_auth_user";
const CONSENT_KEY = "newbank_consent";

export interface ConsentState {
  userId: string;
  acceptedAt: string;
  terms: boolean;
  privacy: boolean;
  marketing: boolean;
  dataUsage: boolean;
}

export function saveAuthSession(token: string, user: AuthUser): void {
  localStorage.setItem(ACCESS_TOKEN_KEY, token);
  localStorage.setItem(AUTH_USER_KEY, JSON.stringify(user));
}

export function getAccessToken(): string | null {
  return localStorage.getItem(ACCESS_TOKEN_KEY);
}

export function getAuthUser(): AuthUser | null {
  const userRaw = localStorage.getItem(AUTH_USER_KEY);
  if (!userRaw) return null;

  try {
    return JSON.parse(userRaw) as AuthUser;
  } catch {
    return null;
  }
}

export function clearAuthSession(): void {
  localStorage.removeItem(ACCESS_TOKEN_KEY);
  localStorage.removeItem(AUTH_USER_KEY);
  localStorage.removeItem(CONSENT_KEY);
}

export function isAuthenticated(): boolean {
  return Boolean(getAccessToken() && getAuthUser()?.id);
}

export function saveConsentState(consent: ConsentState): void {
  localStorage.setItem(CONSENT_KEY, JSON.stringify(consent));
}

export function getConsentState(): ConsentState | null {
  const raw = localStorage.getItem(CONSENT_KEY);
  if (!raw) return null;

  try {
    return JSON.parse(raw) as ConsentState;
  } catch {
    return null;
  }
}

export function hasRequiredConsent(userId: string): boolean {
  const consent = getConsentState();
  if (!consent) return false;
  return consent.userId === userId && consent.terms && consent.privacy;
}
