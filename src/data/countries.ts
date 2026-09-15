/**
 * CountryLens - Core Constants & Formatters
 * Countries are loaded dynamically from /api/country-list (World Bank catalogue).
 */

export const DEFAULT_COUNTRY_A = 'KH'; // Cambodia
export const DEFAULT_COUNTRY_B = 'SG'; // Singapore
export const DEFAULT_YEAR = 2023;

export const YEARS: number[] = [2020, 2021, 2022, 2023, 2024];

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
