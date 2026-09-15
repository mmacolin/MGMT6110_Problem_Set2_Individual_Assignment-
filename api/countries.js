/**
 * CountryLens - Serverless API: /api/countries
 * Proxies World Bank indicator queries for GDP per capita (current US$).
 * 
 * Query parameters:
 *  - countryA: Country code (KH, SG, MY, VN, ID)
 *  - countryB: Country code (KH, SG, MY, VN, ID)
 *  - year: Observation year (2020-2024)
 */

const ALLOWED_COUNTRIES = {
  KH: 'Cambodia',
  SG: 'Singapore',
  MY: 'Malaysia',
  VN: 'Vietnam',
  ID: 'Indonesia',
};

const ALLOWED_YEARS = [2020, 2021, 2022, 2023, 2024];
const INDICATOR_CODE = 'NY.GDP.PCAP.CD';
const INDICATOR_NAME = 'GDP per capita (current US$)';
const UPSTREAM_TIMEOUT_MS = 8000;

function formatCurrencyUSD(val) {
  if (val === null || val === undefined || isNaN(val)) {
    return null;
  }
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(val);
}

function sendResponse(res, statusCode, body, isCacheable = false) {
  if (isCacheable && statusCode === 200) {
    res.setHeader('Cache-Control', 's-maxage=86400, stale-while-revalidate=172800');
  } else {
    res.setHeader('Cache-Control', 'no-store');
  }

  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(body);
  }

  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

async function fetchCountryData(countryCode, year) {
  const url = `https://api.worldbank.org/v2/country/${encodeURIComponent(countryCode)}/indicator/${INDICATOR_CODE}?date=${encodeURIComponent(year)}&format=json`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), UPSTREAM_TIMEOUT_MS);

  let response;
  try {
    response = await fetch(url, {
      signal: controller.signal,
      headers: {
        Accept: 'application/json',
      },
    });
  } catch (err) {
    clearTimeout(timeoutId);
    if (err.name === 'AbortError') {
      const error = new Error(`Request to World Bank API timed out after ${UPSTREAM_TIMEOUT_MS}ms`);
      error.code = 'PROVIDER_UNREACHABLE';
      error.status = 504;
      throw error;
    }
    const error = new Error('Could not reach World Bank API. Network error or provider unreachable.');
    error.code = 'PROVIDER_UNREACHABLE';
    error.status = 502;
    throw error;
  } finally {
    clearTimeout(timeoutId);
  }

  // Check response.ok before parsing JSON
  if (!response.ok) {
    const error = new Error(`World Bank API returned HTTP status ${response.status}`);
    error.code = 'PROVIDER_REFUSED';
    error.status = 502;
    error.upstreamStatus = response.status;
    throw error;
  }

  let data;
  try {
    data = await response.json();
  } catch (err) {
    const error = new Error('Failed to parse World Bank API response as valid JSON.');
    error.code = 'MALFORMED_RESPONSE';
    error.status = 502;
    throw error;
  }

  // Handle World Bank error structure: [ { message: [ { id: "120", key: "...", value: "..." } ] } ]
  if (Array.isArray(data) && data[0]?.message && Array.isArray(data[0].message)) {
    const msg = data[0].message[0]?.value || 'World Bank API returned an upstream error';
    const error = new Error(`World Bank API error: ${msg}`);
    error.code = 'PROVIDER_REFUSED';
    error.status = 502;
    throw error;
  }

  if (!Array.isArray(data) || data.length < 2) {
    const error = new Error('Unexpected World Bank API response structure.');
    error.code = 'MALFORMED_RESPONSE';
    error.status = 502;
    throw error;
  }

  const records = data[1];

  // Missing data for this year/country combination: data[1] may be null or an empty array
  if (records === null || !Array.isArray(records) || records.length === 0) {
    return {
      code: countryCode,
      name: ALLOWED_COUNTRIES[countryCode],
      indicator: INDICATOR_CODE,
      indicatorName: INDICATOR_NAME,
      year: Number(year),
      value: null,
      formatted: null,
    };
  }

  const record = records[0];

  if (!record) {
    return {
      code: countryCode,
      name: ALLOWED_COUNTRIES[countryCode],
      indicator: INDICATOR_CODE,
      indicatorName: INDICATOR_NAME,
      year: Number(year),
      value: null,
      formatted: null,
    };
  }

  // Strict verification: check indicator matches requested indicator
  if (record.indicator?.id && record.indicator.id !== INDICATOR_CODE) {
    const error = new Error(`Mismatched indicator returned: expected ${INDICATOR_CODE}, got ${record.indicator.id}`);
    error.code = 'MALFORMED_RESPONSE';
    error.status = 502;
    throw error;
  }

  // Strict verification: check observation date matches requested year
  if (record.date && String(record.date) !== String(year)) {
    const error = new Error(`Mismatched year returned: expected ${year}, got ${record.date}`);
    error.code = 'MALFORMED_RESPONSE';
    error.status = 502;
    throw error;
  }

  // Strict preservation of null values: never convert null to 0
  let numericValue = null;
  if (record.value !== null && record.value !== undefined && !isNaN(record.value)) {
    numericValue = typeof record.value === 'number' ? record.value : parseFloat(record.value);
    if (!isNaN(numericValue)) {
      numericValue = Math.round(numericValue * 100) / 100;
    } else {
      numericValue = null;
    }
  }

  return {
    code: countryCode,
    name: ALLOWED_COUNTRIES[countryCode],
    indicator: INDICATOR_CODE,
    indicatorName: record.indicator?.value || INDICATOR_NAME,
    year: Number(year),
    value: numericValue,
    formatted: formatCurrencyUSD(numericValue),
  };
}

export default async function handler(req, res) {
  // Support both GET requests
  if (req.method && req.method !== 'GET') {
    return sendResponse(
      res,
      405,
      {
        error: 'Method Not Allowed',
        code: 'METHOD_NOT_ALLOWED',
        message: 'Only GET requests are supported.',
      },
      false
    );
  }

  try {
    // Parse query params (handles both Vercel req.query and Node req.url)
    let countryA = '';
    let countryB = '';
    let year = '';

    if (req.query) {
      countryA = req.query.countryA;
      countryB = req.query.countryB;
      year = req.query.year;
    } else if (req.url) {
      const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
      countryA = url.searchParams.get('countryA') || '';
      countryB = url.searchParams.get('countryB') || '';
      year = url.searchParams.get('year') || '';
    }

    countryA = (countryA || '').trim().toUpperCase();
    countryB = (countryB || '').trim().toUpperCase();
    const numYear = Number(year);

    // 1. Validation: Missing inputs
    if (!countryA || !countryB || !year) {
      return sendResponse(
        res,
        400,
        {
          error: 'Missing required query parameters',
          code: 'INVALID_REQUEST',
          message: 'Please provide countryA, countryB, and year query parameters.',
        },
        false
      );
    }

    // 2. Validation: Disallow identical countries
    if (countryA === countryB) {
      return sendResponse(
        res,
        400,
        {
          error: 'Identical countries selected',
          code: 'INVALID_REQUEST',
          message: 'Country A and Country B must be two different countries.',
        },
        false
      );
    }

    // 3. Validation: Allowed countries
    if (!ALLOWED_COUNTRIES[countryA] || !ALLOWED_COUNTRIES[countryB]) {
      return sendResponse(
        res,
        400,
        {
          error: 'Invalid country code',
          code: 'INVALID_REQUEST',
          message: `Country codes must be chosen from: ${Object.keys(ALLOWED_COUNTRIES).join(', ')}.`,
          allowedCountries: Object.keys(ALLOWED_COUNTRIES),
        },
        false
      );
    }

    // 4. Validation: Allowed years
    if (!ALLOWED_YEARS.includes(numYear)) {
      return sendResponse(
        res,
        400,
        {
          error: 'Invalid observation year',
          code: 'INVALID_REQUEST',
          message: `Year must be one of: ${ALLOWED_YEARS.join(', ')}.`,
          allowedYears: ALLOWED_YEARS,
        },
        false
      );
    }

    // Fetch both countries in parallel from World Bank upstream
    const [dataA, dataB] = await Promise.all([
      fetchCountryData(countryA, numYear),
      fetchCountryData(countryB, numYear),
    ]);

    // Check if both countries returned empty/null data
    const isBothEmpty = dataA.value === null && dataB.value === null;

    const result = {
      year: numYear,
      countryA: dataA,
      countryB: dataB,
      unit: 'current US$',
      indicator: INDICATOR_CODE,
      indicatorName: INDICATOR_NAME,
      source: 'World Bank World Development Indicators',
      sourceUrl: 'https://data.worldbank.org/indicator/NY.GDP.PCAP.CD',
      retrievedAt: new Date().toISOString(),
      emptyData: isBothEmpty,
    };

    return sendResponse(res, 200, result, true);
  } catch (err) {
    const statusCode = err.status || 500;
    const errorCode = err.code || 'INTERNAL_ERROR';

    return sendResponse(
      res,
      statusCode,
      {
        error: err.message || 'An error occurred while fetching country data.',
        code: errorCode,
        upstreamStatus: err.upstreamStatus || null,
      },
      false
    );
  }
}
