import { Country } from '../types';

export const COUNTRIES: Country[] = [
  { code: 'KH', name: 'Cambodia' },
  { code: 'SG', name: 'Singapore' },
  { code: 'MY', name: 'Malaysia' },
  { code: 'VN', name: 'Vietnam' },
  { code: 'ID', name: 'Indonesia' },
];

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
