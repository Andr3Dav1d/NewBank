import { getConsentState } from './auth';

/**
 * Verifica se o usuário deu os consentimentos obrigatórios (termos e privacidade).
 * @param userId string
 * @returns boolean
 */
export function hasRequiredConsent(userId: string): boolean {
  const consent = getConsentState();
  if (!consent) return false;
  if (consent.userId !== userId) return false;
  return Boolean(consent.terms && consent.privacy);
}
