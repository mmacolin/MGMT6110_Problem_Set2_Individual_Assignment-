/**
 * CountryLens - Shared Serverless Utility: Country Catalogue
 * Fetches, filters, and caches the World Bank country catalogue.
 * Excludes regional aggregates, income groups, and Thailand (TH).
 */

const CATALOG_URL = 'https://api.worldbank.org/v2/country?format=json&per_page=300';
const UPSTREAM_TIMEOUT_MS = 10000;
const CACHE_TTL_MS = 24 * 60 * 60 * 1000; // 24 hours
const USER_AGENT = 'CountryLens/1.0 (https://countrylens.app; educational)';

let cachedCatalog = null;
let cacheTimestamp = 0;

/**
 * Fetches all pages of the World Bank country catalogue and filters out aggregates.
 */
export async function getSupportedCatalog(forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedCatalog && now - cacheTimestamp < CACHE_TTL_MS) {
    return cachedCatalog;
  }

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  let rawItems = [];
  try {
    const response = await fetch(CATALOG_URL, {
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
    });

    if (!response.ok) {
      const err = new Error(`World Bank catalogue returned HTTP ${response.status}`);
      err.status = response.status;
      err.code = 'CATALOGUE_UNAVAILABLE';
      throw err;
    }

    const data = await response.json();

    if (!Array.isArray(data) || data.length < 2 || !Array.isArray(data[1])) {
      const err = new Error('Unexpected World Bank catalogue response format');
      err.status = 502;
      err.code = 'MALFORMED_CATALOGUE';
      throw err;
    }

    rawItems = data[1];

    // Check pagination: if pages > 1, fetch remaining pages
    const totalPages = data[0]?.pages || 1;
    if (totalPages > 1) {
      for (let p = 2; p <= totalPages; p++) {
        const pageController = new AbortController();
        const pageTimeoutId = setTimeout(() => pageController.abort(), UPSTREAM_TIMEOUT_MS);
        try {
          const pageRes = await fetch(`${CATALOG_URL}&page=${p}`, {
            signal: pageController.signal,
            headers: {
              'User-Agent': USER_AGENT,
              Accept: 'application/json',
            },
          });
          if (pageRes.ok) {
            const pageData = await pageRes.json();
            if (Array.isArray(pageData) && Array.isArray(pageData[1])) {
              rawItems = rawItems.concat(pageData[1]);
            }
          }
        } finally {
          clearTimeout(pageTimeoutId);
        }
      }
    }
  } catch (err) {
    // If upstream timed out or failed, but we have a stale cache, use it
    if (cachedCatalog) {
      return cachedCatalog;
    }
    if (err.name === 'AbortError') {
      const timeoutErr = new Error(`Catalogue request timed out after ${UPSTREAM_TIMEOUT_MS}ms`);
      timeoutErr.status = 504;
      timeoutErr.code = 'CATALOGUE_TIMEOUT';
      throw timeoutErr;
    }
    throw err;
  } finally {
    clearTimeout(timeoutId);
  }

  // Filter individual countries and economies, excluding aggregates and Thailand
  const filtered = rawItems.filter((item) => {
    // Exclude aggregates using provider metadata
    const isAggregate =
      item.region?.value === 'Aggregates' ||
      item.region?.id === 'NA' ||
      item.id === 'AFE' ||
      item.id === 'AFW' ||
      item.id === 'ARB' ||
      item.id === 'WLD';

    if (isAggregate) return false;

    // Explicitly exclude Thailand per requirement
    if (item.iso2Code === 'TH' || item.id === 'THA') {
      return false;
    }

    // Must have a valid 2-letter uppercase ISO code
    if (!item.iso2Code || item.iso2Code.trim().length !== 2) {
      return false;
    }

    if (!item.name || !item.name.trim()) {
      return false;
    }

    return true;
  });

  // Map to clean structure, deduplicate by 2-letter code, and sort alphabetically by name
  const seenCodes = new Set();
  const countries = [];
  const codeToNameMap = {};

  for (const item of filtered) {
    const code = item.iso2Code.trim().toUpperCase();
    if (seenCodes.has(code)) continue;
    seenCodes.add(code);

    const name = item.name.trim();
    countries.push({
      code,
      id: item.id?.trim() || '',
      name,
    });
    codeToNameMap[code] = name;
  }

  countries.sort((a, b) => a.name.localeCompare(b.name, 'en', { sensitivity: 'base' }));

  const result = {
    countries,
    codeToNameMap,
    total: countries.length,
    retrievedAt: new Date().toISOString(),
  };

  cachedCatalog = result;
  cacheTimestamp = now;

  return result;
}
