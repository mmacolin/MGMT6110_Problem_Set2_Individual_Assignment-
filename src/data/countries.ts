/**
 * CountryLens - Core Constants & Formatters
 * Countries are loaded dynamically from /api/country-list (World Bank catalogue).
 */

export const DEFAULT_COUNTRY_A = 'KH'; // Cambodia
export const DEFAULT_COUNTRY_B = 'SG'; // Singapore
export const DEFAULT_YEAR = 2023;

// Historical range from 2025 down to 1950 (World Bank indicator NY.GDP.PCAP.CD coverage)
export const YEARS: number[] = Array.from(
  { length: 2025 - 1950 + 1 },
  (_, i) => 2025 - i
);

export function formatCurrencyUSD(val: number | null | undefined): string | null {
  if (val === null || val === undefined || isNaN(val)) {
    return null;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}
