/**
 * Generates a cryptographically secure random string.
 * Uses crypto.randomUUID() if available, otherwise falls back to crypto.getRandomValues().
 *
 * @returns {string} A secure random string.
 */
export function generateSecureRandomString() {
  const cryptoObj = typeof globalThis !== 'undefined' ? globalThis.crypto : (typeof window !== 'undefined' ? window.crypto : null);

  if (!cryptoObj) {
    throw new Error('Crypto API not available');
  }

  if (cryptoObj.randomUUID) {
    return cryptoObj.randomUUID();
  }

  // Fallback for environments where randomUUID is not available but getRandomValues is.
  const array = new Uint8Array(16);
  cryptoObj.getRandomValues(array);

  // Convert to hex string as an alternative to UUID format
  return Array.from(array).map(b => b.toString(16).padStart(2, '0')).join('');
}
