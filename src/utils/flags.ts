/**
 * CountryLens - Flag and Country Utilities
 * Uses standard Unicode Regional Indicator Symbols (ISO 3166-1 alpha-2)
 * No external API dependencies.
 */

export function getCountryFlag(iso2: string): string {
  if (!iso2 || typeof iso2 !== 'string' || iso2.trim().length !== 2) {
    return '🌐';
  }
  const clean = iso2.trim().toUpperCase();
  // Valid 2-letter ASCII uppercase
  if (!/^[A-Z]{2}$/.test(clean)) {
    return '🌐';
  }
  // Convert each letter to regional indicator symbol (A = 0x1F1E6)
  const codePoints = [...clean].map((char) => 0x1f1e6 + char.charCodeAt(0) - 65);
  return String.fromCodePoint(...codePoints);
}
