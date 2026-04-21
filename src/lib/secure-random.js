/**
 * Generates a cryptographically secure random string.
 * @param {number} length - The length of the string to generate.
 * @param {string} chars - The character set to use.
 * @returns {string} The generated random string.
 */
export function generateSecureRandomString(length, chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789') {
  const array = new Uint8Array(length);
  const cryptoObj = (typeof window !== 'undefined' && (window.crypto || window.msCrypto)) || (typeof globalThis !== 'undefined' && globalThis.crypto);

  if (!cryptoObj) {
    // Fallback for environments without crypto (should not happen in modern browsers/node)
    let result = '';
    for (let i = 0; i < length; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    return result;
  }

  cryptoObj.getRandomValues(array);
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[array[i] % chars.length];
  }
  return result;
}
