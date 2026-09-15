import { ComparisonResult, ComparisonStatus, StructuredError } from '../types';
import { motion } from 'motion/react';
import { AlertCircle, RefreshCw, ExternalLink } from 'lucide-react';

interface ResultsViewProps {
  status: ComparisonStatus;
  result: ComparisonResult | null;
  error: StructuredError | null;
  year: number;
  isSameCountry: boolean;
  onRetry: () => void;
}

export function ResultsView({
  status,
  result,
  error,
  year,
  isSameCountry,
  onRetry,
}: ResultsViewProps) {
  // Format the ISO retrievedAt timestamp into a human-readable string
  const formatRetrievedTime = (isoString?: string) => {
    if (!isoString) return '';
    try {
      const date = new Date(isoString);
      return date.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
      });
    } catch {
      return '';
    }
  };

  return (
    <section id="results-section" aria-live="polite" className="min-h-[170px]">
      {/* 1. Loading State */}
      {status === 'loading' && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          id="loading-state"
          role="status"
          className="p-8 text-center bg-white rounded-lg border border-slate-200 shadow-sm flex flex-col items-center justify-center gap-2"
        >
          <div className="w-8 h-8 rounded-full border-2 border-[#0F766E]/20 border-t-[#0F766E] animate-spin mb-1"></div>
          <p className="text-base font-medium text-slate-700">Loading comparison data…</p>
          <p className="text-xs text-slate-500">
            Retrieving official World Bank indicators for observation year {year}…
          </p>
        </motion.div>
      )}

      {/* 2. Initial State */}
      {status === 'initial' && !isSameCountry && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          id="initial-state"
          className="p-8 text-center bg-white rounded-lg border border-dashed border-slate-300 text-slate-600"
        >
          <p className="text-sm sm:text-base">
            Choose two countries and a year, then select{' '}
            <strong className="text-slate-800 font-semibold">Compare countries</strong>.
          </p>
        </motion.div>
      )}

      {/* Same Country Selected Helper */}
      {status === 'initial' && isSameCountry && (
        <div
          id="same-country-hint"
          className="p-8 text-center bg-white rounded-lg border border-dashed border-amber-200 text-amber-700"
        >
          <p className="text-sm sm:text-base">
            Select two different countries above to enable comparison.
          </p>
        </div>
      )}

      {/* 3. Structured Error / Failure States (Distinct written messages) */}
      {status === 'error' && error && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          id="error-state-alert"
          role="alert"
          className="p-5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4 shadow-sm"
        >
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold text-amber-950 mb-0.5">
                {error.code === 'PROVIDER_REFUSED' && 'Provider Refused'}
                {error.code === 'PROVIDER_UNREACHABLE' && 'Provider Unreachable'}
                {error.code === 'MALFORMED_RESPONSE' && 'Unexpected Provider Response'}
                {error.code === 'EMPTY_DATA' && 'Data Empty'}
                {error.code === 'INVALID_REQUEST' && 'Invalid Request'}
                {error.code === 'UNKNOWN_ERROR' && 'Request Notice'}
              </p>
              <p className="text-slate-700 leading-relaxed">{error.message}</p>
              {error.detail && (
                <p className="text-xs text-slate-500 mt-1 font-mono">{error.detail}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            id="retry-button"
            onClick={onRetry}
            className="self-start sm:self-center shrink-0 px-3.5 py-1.5 rounded-md text-xs font-medium text-[#0F766E] bg-white border border-slate-200 hover:bg-slate-50 hover:border-slate-300 transition shadow-xs flex items-center gap-1.5 cursor-pointer"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            <span>Retry request</span>
          </button>
        </motion.div>
      )}

      {/* 4. Compared Results Cards */}
      {status === 'compared' && result && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {/* Country A Card */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              id="country-a-card"
              className="bg-white p-5 sm:p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <h2 className="text-xl font-bold text-[#142D4E] tracking-tight">
                    {result.countryA.name}
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {result.countryA.code}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  GDP per capita · current US$ ({result.year})
                </p>
                <div className="my-2">
                  {result.countryA.formatted ? (
                    <p className="text-2xl sm:text-3xl font-bold text-[#142D4E] tracking-tight">
                      {result.countryA.formatted}
                    </p>
                  ) : (
                    <p className="text-xl sm:text-2xl font-medium text-slate-500 italic">
                      Data unavailable
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Source: {result.source} ({result.indicator})
                </p>
              </div>
            </motion.div>

            {/* Country B Card */}
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              id="country-b-card"
              className="bg-white p-5 sm:p-6 rounded-lg border border-slate-200 shadow-sm flex flex-col justify-between hover:border-slate-300 transition-colors"
            >
              <div>
                <div className="flex items-baseline justify-between mb-1">
                  <h2 className="text-xl font-bold text-[#142D4E] tracking-tight">
                    {result.countryB.name}
                  </h2>
                  <span className="text-xs font-semibold px-2 py-0.5 bg-slate-100 text-slate-600 rounded">
                    {result.countryB.code}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  GDP per capita · current US$ ({result.year})
                </p>
                <div className="my-2">
                  {result.countryB.formatted ? (
                    <p className="text-2xl sm:text-3xl font-bold text-[#142D4E] tracking-tight">
                      {result.countryB.formatted}
                    </p>
                  ) : (
                    <p className="text-xl sm:text-2xl font-medium text-slate-500 italic">
                      Data unavailable
                    </p>
                  )}
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100">
                <p className="text-xs text-slate-500">
                  Source: {result.source} ({result.indicator})
                </p>
              </div>
            </motion.div>
          </div>

          {/* Comparative Ratio & Insight bar when both data points are present */}
          {result.countryA.value !== null && result.countryB.value !== null && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.25, delay: 0.1 }}
              id="comparison-ratio-insight"
              className="bg-white p-4 rounded-lg border border-slate-200 shadow-sm text-xs sm:text-sm text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-[#0F766E] shrink-0"></span>
                <span>
                  <strong>{result.higherCountryName}</strong> had{' '}
                  <strong className="text-[#0F766E]">{result.multiplier}x</strong> higher GDP per
                  capita in observation year {result.year} (difference of{' '}
                  {result.differenceFormatted}).
                </span>
              </div>
              {/* Ratio bar */}
              <div className="w-full sm:w-48 bg-slate-100 rounded-full h-2.5 overflow-hidden flex shrink-0">
                <div
                  className="bg-[#0F766E] h-2.5 transition-all duration-500"
                  style={{
                    width: `${Math.max(
                      5,
                      Math.min(
                        95,
                        (result.countryA.value /
                          (result.countryA.value + result.countryB.value)) *
                          100
                      )
                    )}%`,
                  }}
                  title={`${result.countryA.name}: ${result.countryA.formatted}`}
                ></div>
                <div
                  className="bg-slate-400 h-2.5 transition-all duration-500 flex-1"
                  title={`${result.countryB.name}: ${result.countryB.formatted}`}
                ></div>
              </div>
            </motion.div>
          )}

          {/* Observation vs Retrieval provenance metadata */}
          <div
            id="provenance-metadata"
            className="flex flex-wrap items-center justify-between text-xs text-slate-500 px-1 pt-1 gap-2"
          >
            <span>
              Observation Year: <strong className="text-slate-700">{result.year}</strong> (Annual aggregate)
            </span>
            <span className="flex items-center gap-1.5">
              <span>
                Retrieved at {formatRetrievedTime(result.retrievedAt)} via{' '}
                <a
                  href={result.sourceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-[#0F766E] inline-flex items-center gap-0.5"
                >
                  World Bank WDI
                  <ExternalLink className="w-2.5 h-2.5" />
                </a>
              </span>
            </span>
          </div>
        </div>
      )}
    </section>
  );
}
