export interface Country {
  code: string;
  name: string;
  id?: string;
}

export type CatalogStatus = 'idle' | 'loading' | 'success' | 'error';

export interface CountryListResponse {
  countries: Country[];
  total: number;
  retrievedAt: string;
  cached?: boolean;
}

export type ErrorCode =
  | 'EMPTY_DATA'
  | 'PROVIDER_REFUSED'
  | 'PROVIDER_UNREACHABLE'
  | 'MALFORMED_RESPONSE'
  | 'INVALID_REQUEST'
  | 'UNKNOWN_ERROR';

export type ComparisonStatus = 'initial' | 'loading' | 'compared' | 'error';

export interface StructuredError {
  code: ErrorCode;
  message: string;
  detail?: string;
}

export interface CountryDataPayload {
  code: string;
  name: string;
  indicator: string;
  indicatorName: string;
  year: number;
  value: number | null;
  formatted: string | null;
}

export interface ApiComparisonResponse {
  year: number;
  countryA: CountryDataPayload;
  countryB: CountryDataPayload;
  unit: string;
  indicator: string;
  indicatorName: string;
  source: string;
  sourceUrl: string;
  retrievedAt: string;
  emptyData: boolean;
}

export interface ComparisonResult {
  year: number;
  countryA: CountryDataPayload;
  countryB: CountryDataPayload;
  unit: string;
  indicator: string;
  indicatorName: string;
  source: string;
  sourceUrl: string;
  retrievedAt: string;
  multiplier?: number | null;
  differenceFormatted?: string | null;
  higherCountryName?: string | null;
}
