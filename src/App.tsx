import { useState, useCallback, useRef, useEffect } from 'react';
import { COUNTRIES, YEARS, formatCurrencyUSD } from './data/countries';
import {
  ComparisonStatus,
  ComparisonResult,
  StructuredError,
  ApiComparisonResponse,
} from './types';
import { Header } from './components/Header';
import { ComparisonForm } from './components/ComparisonForm';
import { ResultsView } from './components/ResultsView';
import { SupportingInfo } from './components/SupportingInfo';

export default function App() {
  // Form selection state: Defaults Cambodia (KH), Singapore (SG), 2023
  const [countryA, setCountryA] = useState<string>('KH');
  const [countryB, setCountryB] = useState<string>('SG');
  const [year, setYear] = useState<number>(2023);

  // Async comparison state
  const [comparisonStatus, setComparisonStatus] = useState<ComparisonStatus>('initial');
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [structuredError, setStructuredError] = useState<StructuredError | null>(null);

  // Prevent race conditions and stale responses
  const activeAbortControllerRef = useRef<AbortController | null>(null);
  const requestSeqRef = useRef<number>(0);

  const isSameCountry = countryA === countryB;

  // Reset results when inputs change
  const resetResults = useCallback(() => {
    if (activeAbortControllerRef.current) {
      activeAbortControllerRef.current.abort();
      activeAbortControllerRef.current = null;
    }
    if (comparisonStatus !== 'initial') {
      setComparisonStatus('initial');
      setComparisonResult(null);
      setStructuredError(null);
    }
  }, [comparisonStatus]);

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (activeAbortControllerRef.current) {
        activeAbortControllerRef.current.abort();
      }
    };
  }, []);

  const handleCountryAChange = (code: string) => {
    setCountryA(code);
    resetResults();
  };

  const handleCountryBChange = (code: string) => {
    setCountryB(code);
    resetResults();
  };

  const handleYearChange = (newYear: number) => {
    setYear(newYear);
    resetResults();
  };

  const handleSwapCountries = () => {
    const temp = countryA;
    setCountryA(countryB);
    setCountryB(temp);
    resetResults();
  };

  const handleCompare = async () => {
    if (isSameCountry) return;

    // Abort previous in-flight request if any
    if (activeAbortControllerRef.current) {
      activeAbortControllerRef.current.abort();
    }

    const abortController = new AbortController();
    activeAbortControllerRef.current = abortController;

    const currentSeq = ++requestSeqRef.current;

    setStructuredError(null);
    setComparisonResult(null);
    setComparisonStatus('loading');

    try {
      const queryParams = new URLSearchParams({
        countryA,
        countryB,
        year: String(year),
      });

      const response = await fetch(`/api/countries?${queryParams.toString()}`, {
        signal: abortController.signal,
        headers: {
          Accept: 'application/json',
        },
      });

      // Ignore if a newer request was dispatched in the meantime
      if (currentSeq !== requestSeqRef.current) {
        return;
      }

      let data: ApiComparisonResponse | { error?: string; code?: string; message?: string };
      try {
        data = await response.json();
      } catch {
        if (currentSeq !== requestSeqRef.current) return;
        setComparisonStatus('error');
        setStructuredError({
          code: 'MALFORMED_RESPONSE',
          message: 'The data provider returned an unrecognized response format.',
        });
        return;
      }

      if (!response.ok) {
        if (currentSeq !== requestSeqRef.current) return;
        const errPayload = data as { error?: string; code?: string; message?: string };
        const code = (errPayload.code || '') as StructuredError['code'];

        if (code === 'PROVIDER_REFUSED' || response.status === 502) {
          setStructuredError({
            code: 'PROVIDER_REFUSED',
            message:
              errPayload.message ||
              'The World Bank API rejected or was unable to process this request. Please try again later.',
          });
        } else if (code === 'PROVIDER_UNREACHABLE' || response.status === 504) {
          setStructuredError({
            code: 'PROVIDER_UNREACHABLE',
            message:
              errPayload.message ||
              'Could not reach the World Bank API. Please check your connection or retry shortly.',
          });
        } else if (code === 'MALFORMED_RESPONSE') {
          setStructuredError({
            code: 'MALFORMED_RESPONSE',
            message:
              errPayload.message ||
              'The World Bank returned an unexpected data structure. Our team has been notified.',
          });
        } else if (code === 'INVALID_REQUEST' || response.status === 400) {
          setStructuredError({
            code: 'INVALID_REQUEST',
            message:
              errPayload.message ||
              'Invalid selection: Country A and Country B must be different, and the year must be between 2020 and 2024.',
          });
        } else {
          setStructuredError({
            code: 'UNKNOWN_ERROR',
            message: errPayload.error || 'An unexpected error occurred while fetching country data.',
          });
        }
        setComparisonStatus('error');
        return;
      }

      const comparisonData = data as ApiComparisonResponse;

      // Handle completely empty data scenario
      if (comparisonData.emptyData) {
        setStructuredError({
          code: 'EMPTY_DATA',
          message:
            'No GDP per capita data is available from the World Bank for this comparison. Please try another observation year.',
        });
        setComparisonStatus('error');
        return;
      }

      // Calculate comparative insights when both countries have values
      const valA = comparisonData.countryA.value;
      const valB = comparisonData.countryB.value;
      const nameA = comparisonData.countryA.name;
      const nameB = comparisonData.countryB.name;

      let multiplier: number | null = null;
      let differenceFormatted: string | null = null;
      let higherCountryName: string | null = null;

      if (valA !== null && valB !== null && valA > 0 && valB > 0) {
        if (valA >= valB) {
          multiplier = Math.round((valA / valB) * 10) / 10;
          higherCountryName = nameA;
          differenceFormatted = formatCurrencyUSD(valA - valB);
        } else {
          multiplier = Math.round((valB / valA) * 10) / 10;
          higherCountryName = nameB;
          differenceFormatted = formatCurrencyUSD(valB - valA);
        }
      }

      setComparisonResult({
        ...comparisonData,
        multiplier,
        differenceFormatted,
        higherCountryName,
      });
      setComparisonStatus('compared');
    } catch (err: unknown) {
      if (abortController.signal.aborted) {
        // User aborted or superseded by newer request; ignore silently
        return;
      }

      if (currentSeq !== requestSeqRef.current) {
        return;
      }

      setComparisonStatus('error');
      setStructuredError({
        code: 'PROVIDER_UNREACHABLE',
        message: 'Could not reach the World Bank data service. Please verify your internet connection.',
        detail: err instanceof Error ? err.message : undefined,
      });
    } finally {
      if (activeAbortControllerRef.current === abortController) {
        activeAbortControllerRef.current = null;
      }
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] text-slate-800 antialiased selection:bg-teal-100 selection:text-teal-900">
      <div className="max-w-4xl mx-auto px-4 py-8 sm:px-6 sm:py-10">
        {/* Header */}
        <Header />

        {/* Main Content Area */}
        <main className="space-y-6">
          {/* Comparison Form Panel */}
          <ComparisonForm
            countries={COUNTRIES}
            years={YEARS}
            countryA={countryA}
            countryB={countryB}
            year={year}
            isLoading={comparisonStatus === 'loading'}
            onCountryAChange={handleCountryAChange}
            onCountryBChange={handleCountryBChange}
            onYearChange={handleYearChange}
            onSwapCountries={handleSwapCountries}
            onSubmit={handleCompare}
          />

          {/* Results Area */}
          <ResultsView
            status={comparisonStatus}
            result={comparisonResult}
            error={structuredError}
            year={year}
            isSameCountry={isSameCountry}
            onRetry={handleCompare}
          />

          {/* Supporting Explanatory Note */}
          <SupportingInfo />
        </main>
      </div>
    </div>
  );
}
