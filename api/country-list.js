/**
 * CountryLens - Serverless API: /api/country-list
 * Serves the list of supported individual countries and economies from the World Bank catalogue.
 * Excludes regional aggregates, income groups, and Thailand.
 */

import { getSupportedCatalog } from './country-catalog.js';

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

export default async function handler(req, res) {
  if (req.method && req.method !== 'GET') {
    return sendResponse(
      res,
      405,
      { error: 'Method Not Allowed', code: 'METHOD_NOT_ALLOWED' },
      false
    );
  }

  // Parse query params (supports Vercel req.query and Node req.url)
  let simulate = '';
  if (req.query) {
    simulate = req.query.simulate || '';
  } else if (req.url) {
    const url = new URL(req.url, `http://${req.headers?.host || 'localhost'}`);
    simulate = url.searchParams.get('simulate') || '';
  }

  // Controlled Development-Only Simulation: Catalogue failure
  // Strictly gated to non-production environments
  if (process.env.NODE_ENV !== 'production' && simulate === 'failure') {
    return sendResponse(
      res,
      502,
      {
        error: 'Simulated World Bank catalogue retrieval failure',
        code: 'CATALOGUE_UNAVAILABLE',
        simulation: true,
      },
      false
    );
  }

  try {
    const catalog = await getSupportedCatalog();
    return sendResponse(res, 200, catalog, true);
  } catch (err) {
    const statusCode = err.status || 502;
    const errorCode = err.code || 'CATALOGUE_UNAVAILABLE';

    return sendResponse(
      res,
      statusCode,
      {
        error: err.message || 'Unable to load World Bank country catalogue.',
        code: errorCode,
      },
      false
    );
  }
}
