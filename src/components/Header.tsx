export function Header() {
  return (
    <header id="app-header" className="border-b border-slate-200 pb-5 mb-6">
      <div className="flex flex-wrap items-center justify-between gap-3 mb-2">
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-[#142D4E]">
          CountryLens
        </h1>
        <span
          id="data-indicator-badge"
          className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200"
        >
          World Bank Data · Current US$
        </span>
      </div>
      <p className="text-slate-600 text-sm sm:text-base">
        Compare GDP per capita across five Southeast Asian countries.
      </p>
    </header>
  );
}
