export function SupportingInfo() {
  return (
    <section
      id="supporting-info-section"
      className="bg-white p-5 rounded-lg border border-slate-200 text-xs sm:text-sm text-slate-600 space-y-2.5 shadow-sm"
    >
      <p className="leading-relaxed">
        GDP per capita is gross domestic product divided by midyear population. It is not average salary,
        living cost, or a measure of education quality.
      </p>
      <p className="leading-relaxed">
        Data is sourced from the World Bank World Development Indicators (WDI) catalog for indicator{' '}
        <code className="bg-slate-100 text-slate-800 px-1 py-0.5 rounded text-xs font-mono">
          NY.GDP.PCAP.CD
        </code>{' '}
        (current US$). Figures reflect annual national account aggregates compiled by official agencies.
      </p>
      <div className="pt-1">
        <a
          id="world-bank-indicator-link"
          href="https://data.worldbank.org/indicator/NY.GDP.PCAP.CD"
          target="_blank"
          rel="noopener noreferrer"
          className="text-[#0F766E] hover:text-[#0d655e] font-medium underline underline-offset-2 inline-flex items-center gap-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#0F766E] rounded-sm"
        >
          <span>About the World Bank indicator (NY.GDP.PCAP.CD)</span>
          <span aria-hidden="true" className="text-xs">
            ↗
          </span>
        </a>
      </div>
    </section>
  );
}
