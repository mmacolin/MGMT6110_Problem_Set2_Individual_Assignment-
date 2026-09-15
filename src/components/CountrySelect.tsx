import { useState, useRef, useEffect, useId, useMemo, KeyboardEvent } from 'react';
import { Country } from '../types';
import { getCountryFlag } from '../utils/flags';
import { Search, ChevronDown, Check, X } from 'lucide-react';

interface CountrySelectProps {
  id: string;
  label: string;
  value: string;
  disabledCountryCode?: string;
  disabledCountryLabel?: string;
  countries: Country[];
  variant: 'countryA' | 'countryB';
  disabled?: boolean;
  onChange: (code: string) => void;
}

export function CountrySelect({
  id,
  label,
  value,
  disabledCountryCode,
  disabledCountryLabel = 'other selection',
  countries,
  variant,
  disabled = false,
  onChange,
}: CountrySelectProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const containerRef = useRef<HTMLDivElement>(null);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const listboxRef = useRef<HTMLUListElement>(null);
  const listboxId = useId();

  // Find currently selected country
  const selectedCountry = useMemo(() => {
    return countries.find((c) => c.code === value) || {
      code: value,
      name: value,
    };
  }, [countries, value]);

  // Filter countries based on search
  const filteredCountries = useMemo(() => {
    if (!searchQuery.trim()) return countries;
    const q = searchQuery.toLowerCase().trim();
    return countries.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.code.toLowerCase().includes(q) ||
        (c.id && c.id.toLowerCase().includes(q))
    );
  }, [countries, searchQuery]);

  // Close dropdown on outside click
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
        setSearchQuery('');
      }
    }
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Focus search input when dropdown opens
  useEffect(() => {
    if (isOpen) {
      setHighlightedIndex(-1);
      setTimeout(() => {
        searchInputRef.current?.focus();
      }, 30);
    }
  }, [isOpen]);

  // Scroll highlighted item into view
  useEffect(() => {
    if (isOpen && highlightedIndex >= 0 && listboxRef.current) {
      const activeEl = listboxRef.current.children[highlightedIndex] as HTMLElement;
      if (activeEl) {
        activeEl.scrollIntoView({ block: 'nearest' });
      }
    }
  }, [highlightedIndex, isOpen]);

  const handleSelect = (code: string) => {
    if (code === disabledCountryCode) return;
    onChange(code);
    setIsOpen(false);
    setSearchQuery('');
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (disabled) return;

    if (!isOpen) {
      if (e.key === 'Enter' || e.key === ' ' || e.key === 'ArrowDown') {
        e.preventDefault();
        setIsOpen(true);
      }
      return;
    }

    if (e.key === 'Escape') {
      e.preventDefault();
      setIsOpen(false);
      setSearchQuery('');
    } else if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev < filteredCountries.length - 1 ? prev + 1 : 0
      );
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlightedIndex((prev) =>
        prev > 0 ? prev - 1 : filteredCountries.length - 1
      );
    } else if (e.key === 'Enter') {
      e.preventDefault();
      if (highlightedIndex >= 0 && highlightedIndex < filteredCountries.length) {
        const item = filteredCountries[highlightedIndex];
        if (item.code !== disabledCountryCode) {
          handleSelect(item.code);
        }
      }
    }
  };

  const isA = variant === 'countryA';
  const accentBorder = isA
    ? 'focus-within:border-blue-600 focus-within:ring-2 focus-within:ring-blue-600'
    : 'focus-within:border-teal-600 focus-within:ring-2 focus-within:ring-teal-600';
  const labelAccent = isA ? 'text-blue-900' : 'text-teal-900';
  const badgeAccent = isA
    ? 'bg-blue-50 text-blue-800 border-blue-200'
    : 'bg-teal-50 text-teal-800 border-teal-200';

  return (
    <div ref={containerRef} className="relative w-full" id={`${id}-wrapper`}>
      <label
        htmlFor={`${id}-button`}
        className={`block text-xs font-semibold uppercase tracking-wider mb-1.5 ${labelAccent}`}
      >
        {label}
      </label>

      {/* Trigger Button */}
      <button
        type="button"
        id={`${id}-button`}
        aria-haspopup="listbox"
        aria-expanded={isOpen}
        aria-controls={listboxId}
        disabled={disabled}
        onClick={() => setIsOpen((prev) => !prev)}
        onKeyDown={handleKeyDown}
        className={`w-full min-h-[44px] px-3.5 py-2.5 bg-white border border-slate-300 rounded-md text-left flex items-center justify-between gap-2 shadow-xs transition cursor-pointer hover:border-slate-400 disabled:opacity-50 disabled:cursor-not-allowed focus-visible:outline-none focus-visible:ring-2 ${
          isA ? 'focus-visible:ring-blue-600' : 'focus-visible:ring-teal-600'
        }`}
      >
        <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
          <span
            className="text-lg leading-none shrink-0"
            role="img"
            aria-label={`${selectedCountry.name} flag`}
          >
            {getCountryFlag(selectedCountry.code)}
          </span>
          <span className="font-medium text-sm text-slate-900 truncate">
            {selectedCountry.name}
          </span>
          <span
            className={`text-xs font-mono font-medium px-1.5 py-0.5 rounded border shrink-0 ${badgeAccent}`}
          >
            {selectedCountry.code}
          </span>
        </div>
        <ChevronDown
          className={`w-4 h-4 text-slate-500 shrink-0 transition-transform ${
            isOpen ? 'rotate-180' : ''
          }`}
          aria-hidden="true"
        />
      </button>

      {/* Dropdown Panel */}
      {isOpen && (
        <div
          className={`absolute left-0 right-0 z-50 mt-1.5 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden flex flex-col ${accentBorder}`}
          style={{ maxHeight: '340px' }}
        >
          {/* Search Box */}
          <div className="p-2 border-b border-slate-100 bg-slate-50/80 flex items-center gap-2">
            <Search className="w-4 h-4 text-slate-400 shrink-0 ml-1" />
            <input
              ref={searchInputRef}
              type="text"
              id={`${id}-search`}
              value={searchQuery}
              onChange={(e) => {
                setSearchQuery(e.target.value);
                setHighlightedIndex(0);
              }}
              onKeyDown={handleKeyDown}
              placeholder="Search by country or code…"
              aria-label={`Search countries for ${label}`}
              className="w-full bg-transparent text-sm text-slate-900 placeholder-slate-400 outline-none py-1"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  searchInputRef.current?.focus();
                }}
                className="p-1 text-slate-400 hover:text-slate-600 rounded"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Results List */}
          <ul
            ref={listboxRef}
            id={listboxId}
            role="listbox"
            aria-label={`Options for ${label}`}
            className="overflow-y-auto py-1 divide-y divide-slate-50 flex-1"
            tabIndex={-1}
          >
            {filteredCountries.length === 0 ? (
              <li className="px-4 py-6 text-center text-xs text-slate-500">
                No matching country or economy found for “{searchQuery}”.
              </li>
            ) : (
              filteredCountries.map((country, idx) => {
                const isCurrent = country.code === value;
                const isConflict = country.code === disabledCountryCode;
                const isHighlighted = idx === highlightedIndex;

                return (
                  <li
                    key={country.code}
                    role="option"
                    aria-selected={isCurrent}
                    aria-disabled={isConflict}
                    onClick={() => {
                      if (!isConflict) {
                        handleSelect(country.code);
                      }
                    }}
                    onMouseEnter={() => setHighlightedIndex(idx)}
                    className={`px-3 py-2.5 text-sm flex items-center justify-between gap-2 transition cursor-pointer select-none min-h-[44px] ${
                      isConflict
                        ? 'opacity-45 bg-slate-50 cursor-not-allowed text-slate-400'
                        : isCurrent
                        ? isA
                          ? 'bg-blue-50/80 text-blue-900 font-semibold'
                          : 'bg-teal-50/80 text-teal-900 font-semibold'
                        : isHighlighted
                        ? 'bg-slate-100 text-slate-900'
                        : 'text-slate-800 hover:bg-slate-50'
                    }`}
                  >
                    <div className="flex items-center gap-2.5 min-w-0 overflow-hidden">
                      <span
                        className="text-base leading-none shrink-0"
                        role="img"
                        aria-label={`${country.name} flag`}
                      >
                        {getCountryFlag(country.code)}
                      </span>
                      <span className="truncate">{country.name}</span>
                      <span className="text-xs font-mono text-slate-400 shrink-0">
                        ({country.code})
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 shrink-0">
                      {isConflict && (
                        <span className="text-[11px] font-normal text-amber-700 bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200">
                          Selected in {disabledCountryLabel}
                        </span>
                      )}
                      {isCurrent && (
                        <Check
                          className={`w-4 h-4 ${
                            isA ? 'text-blue-700' : 'text-teal-700'
                          }`}
                        />
                      )}
                    </div>
                  </li>
                );
              })
            )}
          </ul>
        </div>
      )}
    </div>
  );
}
