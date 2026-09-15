import React from 'react';
import { Country, CatalogStatus } from '../types';
import { CountrySelect } from './CountrySelect';
import { ArrowLeftRight, AlertCircle, RefreshCw } from 'lucide-react';

interface ComparisonFormProps {
  countries: Country[];
  catalogStatus: CatalogStatus;
  catalogError: string | null;
  onRetryCatalog: () => void;
  years: number[];
  countryA: string;
  countryB: string;
  year: number;
  isLoading: boolean;
  onCountryAChange: (val: string) => void;
  onCountryBChange: (val: string) => void;
  onYearChange: (val: number) => void;
  onSwapCountries: () => void;
  onSubmit: () => void;
}

export function ComparisonForm({
  countries,
  catalogStatus,
  catalogError,
  onRetryCatalog,
  years,
  countryA,
  countryB,
  year,
  isLoading,
  onCountryAChange,
  onCountryBChange,
  onYearChange,
  onSwapCountries,
  onSubmit,
}: ComparisonFormProps) {
  const isSameCountry = countryA === countryB;
  const isCatalogLoading = catalogStatus === 'loading';
  const isCatalogError = catalogStatus === 'error';

  return (
    <section
      id="comparison-form-section"
      className="bg-white p-5 sm:p-6 rounded-lg border border-slate-200 shadow-sm"
      aria-label="Country and year comparison form"
    >
      {/* Catalogue Loading Banner */}
      {isCatalogLoading && (
        <div
          id="catalog-loading-banner"
          className="mb-4 p-3 bg-slate-50 border border-slate-200 rounded-md text-xs text-slate-600 flex items-center gap-2"
        >
          <div className="w-3.5 h-3.5 border-2 border-slate-400 border-t-transparent rounded-full animate-spin shrink-0" />
          <span>Loading World Bank country catalogue…</span>
        </div>
      )}

      {/* Catalogue Error Banner with Retry */}
      {isCatalogError && (
        <div
          id="catalog-error-banner"
          className="mb-4 p-3.5 bg-rose-50 border border-rose-200 rounded-md text-xs text-rose-900 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2"
          role="alert"
        >
          <div className="flex items-center gap-2">
            <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
            <span>
              {catalogError || 'Unable to retrieve country catalogue from World Bank.'}
            </span>
          </div>
          <button
            type="button"
            id="retry-catalog-btn"
            onClick={onRetryCatalog}
            className="px-2.5 py-1 bg-white border border-rose-300 rounded text-xs font-semibold text-rose-700 hover:bg-rose-100/50 transition flex items-center gap-1 cursor-pointer shrink-0"
          >
            <RefreshCw className="w-3 h-3" />
            <span>Retry catalogue</span>
          </button>
        </div>
      )}

      <form
        id="compare-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!isSameCountry && !isLoading && !isCatalogLoading && !isCatalogError) {
            onSubmit();
          }
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
          {/* Country A (5 cols on md) */}
          <div id="country-a-container" className="md:col-span-4">
            <CountrySelect
              id="country-a-select"
              label="Country/economy A"
              value={countryA}
              disabledCountryCode={countryB}
              disabledCountryLabel="Country B"
              countries={countries}
              variant="countryA"
              disabled={isCatalogLoading || isLoading}
              onChange={onCountryAChange}
            />
          </div>

          {/* Swap Button (1 col on md or flex center) */}
          <div
            id="swap-container"
            className="md:col-span-1 flex items-center justify-center pb-1.5"
          >
            <button
              type="button"
              id="swap-countries-btn"
              onClick={onSwapCountries}
              disabled={isLoading || isCatalogLoading}
              title="Swap Country A and Country B"
              aria-label="Swap Country A and Country B"
              className="min-h-[44px] w-full md:w-[44px] flex items-center justify-center gap-1 text-xs text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-md transition cursor-pointer disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-400"
            >
              <ArrowLeftRight className="w-4 h-4 text-slate-600" />
              <span className="md:hidden text-xs font-medium">Swap countries</span>
            </button>
          </div>

          {/* Country B (4 cols on md) */}
          <div id="country-b-container" className="md:col-span-4">
            <CountrySelect
              id="country-b-select"
              label="Country/economy B"
              value={countryB}
              disabledCountryCode={countryA}
              disabledCountryLabel="Country A"
              countries={countries}
              variant="countryB"
              disabled={isCatalogLoading || isLoading}
              onChange={onCountryBChange}
            />
          </div>

          {/* Year (1.5 cols on md) */}
          <div id="year-container" className="md:col-span-1.5">
            <label
              htmlFor="year-select"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Year
            </label>
            <div className="relative">
              <select
                id="year-select"
                value={year}
                disabled={isLoading || isCatalogLoading}
                onChange={(e) => onYearChange(Number(e.target.value))}
                className="w-full min-h-[44px] bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 shadow-xs focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-700 focus-visible:ring-offset-1 appearance-none pr-8 cursor-pointer disabled:opacity-50"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Action Button (1.5 cols on md) */}
          <div id="submit-container" className="md:col-span-1.5">
            <button
              type="submit"
              id="compare-button"
              disabled={isSameCountry || isLoading || isCatalogLoading || isCatalogError}
              className="w-full min-h-[44px] px-4 rounded-md font-semibold text-sm text-white bg-slate-900 hover:bg-slate-800 transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-slate-900 flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  <span>Loading…</span>
                </>
              ) : (
                'Compare'
              )}
            </button>
          </div>
        </div>

        {/* Inline validation message */}
        {isSameCountry && (
          <div
            id="validation-same-country-alert"
            className="mt-3.5 pt-3 border-t border-slate-100 flex items-center gap-2 text-sm text-amber-800"
            role="alert"
          >
            <svg
              className="w-4 h-4 text-amber-600 shrink-0"
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-hidden="true"
            >
              <path
                fillRule="evenodd"
                d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z"
                clipRule="evenodd"
              />
            </svg>
            <span>Choose two different countries/economies to compare.</span>
          </div>
        )}
      </form>
    </section>
  );
}
