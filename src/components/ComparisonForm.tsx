import React from 'react';
import { Country } from '../types';
import { ArrowLeftRight } from 'lucide-react';

interface ComparisonFormProps {
  countries: Country[];
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

  return (
    <section
      id="comparison-form-section"
      className="bg-white p-5 sm:p-6 rounded-lg border border-slate-200 shadow-sm"
      aria-label="Country and year comparison form"
    >
      <form
        id="compare-form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!isSameCountry && !isLoading) {
            onSubmit();
          }
        }}
      >
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          {/* Country A */}
          <div id="country-a-container">
            <label
              htmlFor="country-a-select"
              className="block text-xs font-semibold uppercase tracking-wider text-slate-700 mb-1.5"
            >
              Country A
            </label>
            <div className="relative">
              <select
                id="country-a-select"
                value={countryA}
                onChange={(e) => onCountryAChange(e.target.value)}
                className="w-full min-h-[44px] bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:ring-offset-2 appearance-none pr-8 cursor-pointer"
              >
                {countries.map((c) => (
                  <option key={`a-${c.code}`} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Country B */}
          <div id="country-b-container">
            <div className="flex items-center justify-between mb-1.5">
              <label
                htmlFor="country-b-select"
                className="block text-xs font-semibold uppercase tracking-wider text-slate-700"
              >
                Country B
              </label>
              <button
                type="button"
                id="swap-countries-btn"
                onClick={onSwapCountries}
                title="Swap countries"
                className="text-xs text-slate-500 hover:text-[#0F766E] flex items-center gap-1 transition px-1 py-0.5 rounded hover:bg-slate-100"
              >
                <ArrowLeftRight className="w-3 h-3" />
                <span>Swap</span>
              </button>
            </div>
            <div className="relative">
              <select
                id="country-b-select"
                value={countryB}
                onChange={(e) => onCountryBChange(e.target.value)}
                className="w-full min-h-[44px] bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:ring-offset-2 appearance-none pr-8 cursor-pointer"
              >
                {countries.map((c) => (
                  <option key={`b-${c.code}`} value={c.code}>
                    {c.name} ({c.code})
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Year */}
          <div id="year-container">
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
                onChange={(e) => onYearChange(Number(e.target.value))}
                className="w-full min-h-[44px] bg-white border border-slate-300 rounded-md px-3 py-2 text-sm text-slate-900 shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] focus-visible:ring-offset-2 appearance-none pr-8 cursor-pointer"
              >
                {years.map((y) => (
                  <option key={y} value={y}>
                    {y}
                  </option>
                ))}
              </select>
              <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2.5 text-slate-500">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </div>
            </div>
          </div>

          {/* Action Button */}
          <div id="submit-container">
            <button
              type="submit"
              id="compare-button"
              disabled={isSameCountry || isLoading}
              className="w-full min-h-[44px] px-4 rounded-md font-medium text-sm text-white bg-[#0F766E] hover:bg-[#0d655e] transition shadow-sm disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#0F766E] flex items-center justify-center gap-2 cursor-pointer"
            >
              {isLoading ? (
                <>
                  <svg
                    className="animate-spin h-4 w-4 text-white"
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
                'Compare countries'
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
            <span>Choose two different countries to compare.</span>
          </div>
        )}
      </form>
    </section>
  );
}
