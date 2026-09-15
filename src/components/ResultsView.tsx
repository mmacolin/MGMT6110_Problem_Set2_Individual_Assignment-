import { motion } from 'motion/react';
import { ComparisonStatus, ComparisonResult, StructuredError } from '../types';
import { getCountryFlag } from '../utils/flags';
import {
  AlertCircle,
  ExternalLink,
  RefreshCw,
  Info,
} from 'lucide-react';

interface ResultsViewProps {
  status: ComparisonStatus;
  result: ComparisonResult | null;
  error: StructuredError | null;
  onRetry: () => void;
}

function formatRetrievedTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  } catch {
    return 'recently';
  }
}

export function ResultsView({ status, result, error, onRetry }: ResultsViewProps) {
  return (
    <section id="results-view-section" aria-live="polite" className="w-full">
      {/* 1. Initial State */}
      {status === 'initial' && (
        <div
          id="initial-prompt-card"
          className="p-6 bg-white rounded-lg border border-slate-200 text-center shadow-xs flex flex-col items-center justify-center min-h-[160px]"
        >
          <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 mb-2.5">
            <Info className="w-5 h-5" />
          </div>
          <p className="font-semibold text-slate-800 text-base mb-1">Ready to compare</p>
          <p className="text-xs text-slate-500 max-w-md">
            Select two countries or economies and an observation year (1950–2025), then click
            “Compare” to fetch live GDP per capita data from the World Bank.
          </p>
        </div>
      )}

      {/* 2. Loading State */}
      {status === 'loading' && (
        <div
          id="loading-skeleton-container"
          className="p-8 bg-white rounded-lg border border-slate-200 shadow-xs flex flex-col items-center justify-center min-h-[220px]"
        >
          <div className="w-9 h-9 border-3 border-slate-300 border-t-slate-800 rounded-full animate-spin mb-4" />
          <p className="font-semibold text-slate-800 text-sm mb-1">
            Fetching World Bank indicator data…
          </p>
          <p className="text-xs text-slate-500">
            Querying indicator <span className="font-mono">NY.GDP.PCAP.CD</span> via serverless proxy
          </p>
        </div>
      )}

      {/* 3. Error Notice */}
      {status === 'error' && error && (
        <motion.div
          initial={{ opacity: 0, y: 4 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.15 }}
          id="error-state-card"
          role="alert"
          className="p-5 rounded-lg bg-amber-50 border border-amber-200 text-amber-900 text-sm flex flex-col sm:flex-row sm:items-start justify-between gap-4 shadow-xs"
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
              <p className="text-slate-700 leading-relaxed text-xs sm:text-sm">{error.message}</p>
              {error.detail && (
                <p className="text-xs text-slate-500 mt-1 font-mono">{error.detail}</p>
              )}
            </div>
          </div>
          <button
            type="button"
            id="retry-button"
            onClick={onRetry}
            className="self-start sm:self-center shrink-0 px-3.5 py-1.5 rounded-md text-xs font-semibold text-slate-800 bg-white border border-slate-300 hover:bg-slate-50 transition shadow-xs flex items-center gap-1.5 cursor-pointer"
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
            {/* Country A Card (Royal Blue Accent) */}
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              id="country-a-card"
              className="bg-white p-5 sm:p-6 rounded-lg border-2 border-blue-200 shadow-sm flex flex-col justify-between hover:border-blue-300 transition-colors relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-blue-600" />
              <div>
                <div className="flex items-center justify-between mb-1.5 pt-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="text-2xl leading-none shrink-0"
                      role="img"
                      aria-label={`${result.countryA.name} flag`}
                    >
                      {getCountryFlag(result.countryA.code)}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight truncate">
                      {result.countryA.name}
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-blue-50 text-blue-800 border border-blue-200 rounded shrink-0">
                    Country A · {result.countryA.code}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  GDP per capita · current US$ ({result.year})
                </p>
                <div className="my-2">
                  {result.countryA.formatted ? (
                    <p className="text-2xl sm:text-3xl font-bold text-blue-900 tracking-tight font-sans">
                      {result.countryA.formatted}
                    </p>
                  ) : (
                    <div className="py-1">
                      <p className="text-lg sm:text-xl font-medium text-slate-500 italic">
                        Data unavailable
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        No reported value in World Bank database for {result.year}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Source: {result.source}</span>
                <span className="font-mono text-[11px] text-slate-400">{result.indicator}</span>
              </div>
            </motion.div>

            {/* Country B Card (Deep Spruce Teal Accent) */}
            <motion.div
              initial={{ opacity: 0, y: 4 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2, delay: 0.05 }}
              id="country-b-card"
              className="bg-white p-5 sm:p-6 rounded-lg border-2 border-teal-200 shadow-sm flex flex-col justify-between hover:border-teal-300 transition-colors relative overflow-hidden"
            >
              <div className="absolute top-0 left-0 right-0 h-1.5 bg-teal-600" />
              <div>
                <div className="flex items-center justify-between mb-1.5 pt-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span
                      className="text-2xl leading-none shrink-0"
                      role="img"
                      aria-label={`${result.countryB.name} flag`}
                    >
                      {getCountryFlag(result.countryB.code)}
                    </span>
                    <h2 className="text-xl font-bold text-slate-900 tracking-tight truncate">
                      {result.countryB.name}
                    </h2>
                  </div>
                  <span className="text-xs font-mono font-semibold px-2 py-0.5 bg-teal-50 text-teal-800 border border-teal-200 rounded shrink-0">
                    Country B · {result.countryB.code}
                  </span>
                </div>
                <p className="text-xs text-slate-500 mb-4">
                  GDP per capita · current US$ ({result.year})
                </p>
                <div className="my-2">
                  {result.countryB.formatted ? (
                    <p className="text-2xl sm:text-3xl font-bold text-teal-900 tracking-tight font-sans">
                      {result.countryB.formatted}
                    </p>
                  ) : (
                    <div className="py-1">
                      <p className="text-lg sm:text-xl font-medium text-slate-500 italic">
                        Data unavailable
                      </p>
                      <p className="text-xs text-slate-400 mt-0.5">
                        No reported value in World Bank database for {result.year}
                      </p>
                    </div>
                  )}
                </div>
              </div>
              <div className="mt-5 pt-3 border-t border-slate-100 flex items-center justify-between text-xs text-slate-500">
                <span>Source: {result.source}</span>
                <span className="font-mono text-[11px] text-slate-400">{result.indicator}</span>
              </div>
            </motion.div>
          </div>

          {/* Comparative Ratio & Insight bar when both data points are present */}
          {result.countryA.value !== null && result.countryB.value !== null ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.2, delay: 0.1 }}
              id="comparison-ratio-insight"
              className="bg-white p-4 rounded-lg border border-slate-200 shadow-xs text-xs sm:text-sm text-slate-700 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-700 shrink-0"></span>
                <span>
                  <strong>{result.higherCountryName}</strong> had{' '}
                  <strong className="text-slate-900 font-semibold">{result.multiplier}x</strong> higher GDP per
                  capita in observation year {result.year} (difference of{' '}
                  {result.differenceFormatted}).
                </span>
              </div>
              {/* Dual-color ratio bar */}
              <div className="w-full sm:w-56 bg-slate-100 rounded-full h-3 overflow-hidden flex shrink-0">
                <div
                  className="bg-blue-600 h-3 transition-all duration-300"
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
                  title={`${result.countryA.name} (Country A): ${result.countryA.formatted}`}
                ></div>
                <div
                  className="bg-teal-600 h-3 transition-all duration-300 flex-1"
                  title={`${result.countryB.name} (Country B): ${result.countryB.formatted}`}
                ></div>
              </div>
            </motion.div>
          ) : (
            /* Note when one or both countries are missing data */
            <div
              id="missing-data-notice"
              className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg text-xs text-slate-600 flex items-center gap-2"
            >
              <Info className="w-4 h-4 text-slate-500 shrink-0" />
              <span>
                {result.countryA.value === null && result.countryB.value === null
                  ? `Neither ${result.countryA.name} nor ${result.countryB.name} has reported GDP per capita data for ${result.year}. Comparative ratios cannot be calculated.`
                  : result.countryA.value === null
                  ? `GDP per capita for ${result.countryA.name} is not available for ${result.year}. Comparative ratio cannot be calculated.`
                  : `GDP per capita for ${result.countryB.name} is not available for ${result.year}. Comparative ratio cannot be calculated.`}
              </span>
            </div>
          )}

          {/* Provenance Metadata */}
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
                  className="underline hover:text-slate-900 inline-flex items-center gap-0.5"
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
