/**
 * CountryLens - Serverless API: /api/health
 * Health check endpoint verifying connectivity and data integrity with the World Bank Open Data API.
 */

const TEST_COUNTRY = 'SG';
const TEST_YEAR = 2023;
const TEST_INDICATOR = 'NY.GDP.PCAP.CD';
const TIMEOUT_MS = 10000;
const USER_AGENT = 'CountryLens/1.0 (https://countrylens.app; educational)';

function sendResponse(res, statusCode, body) {
  res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate');

  if (typeof res.status === 'function' && typeof res.json === 'function') {
    return res.status(statusCode).json(body);
  }

  res.statusCode = statusCode;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.end(JSON.stringify(body));
}

export default async function handler(req, res) {
  const checkedAt = new Date().toISOString();
  const url = `https://api.worldbank.org/v2/country/${TEST_COUNTRY}/indicator/${TEST_INDICATOR}?date=${TEST_YEAR}&format=json`;

  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

  let upstreamStatus = null;
  let responseOk = false;
  let dataHasUsableValue = false;
  let parsedValue = null;
  let statusMessage = 'healthy';
  let failureReason = null;

  try {
    const response = await fetch(url, {
      signal: controller.signal,
      headers: {
        'User-Agent': USER_AGENT,
        Accept: 'application/json',
      },
    });

    upstreamStatus = response.status;
    responseOk = response.ok;

    if (!response.ok) {
      statusMessage = 'unhealthy';
      failureReason = `Upstream returned status ${response.status}`;
    } else {
      const data = await response.json();

      // Check for World Bank error envelope
      if (Array.isArray(data) && data[0]?.message) {
        statusMessage = 'degraded';
        failureReason = data[0].message[0]?.value || 'World Bank returned error structure';
      } else if (
        Array.isArray(data) &&
        data.length >= 2 &&
        Array.isArray(data[1]) &&
        data[1].length > 0
      ) {
        const record = data[1][0];
        if (
          record.indicator?.id === TEST_INDICATOR &&
          typeof record.value === 'number' &&
          !isNaN(record.value) &&
          record.value > 0
        ) {
          dataHasUsableValue = true;
          parsedValue = record.value;
          statusMessage = 'healthy';
        } else {
          statusMessage = 'degraded';
          failureReason = 'Response lacked valid numeric indicator value';
        }
      } else {
        statusMessage = 'degraded';
        failureReason = 'Response lacked expected data records array';
      }
    }
  } catch (err) {
    upstreamStatus = null;
    statusMessage = 'unhealthy';
    if (err.name === 'AbortError') {
      failureReason = `World Bank upstream timed out after ${TIMEOUT_MS}ms`;
    } else {
      failureReason = err.message || 'World Bank upstream is unreachable';
    }
  } finally {
    clearTimeout(timeoutId);
  }

  const isHealthy = statusMessage === 'healthy';
  const httpCode = isHealthy ? 200 : 503;

  const responsePayload = {
    service: 'CountryLens World Bank Proxy',
    status: statusMessage,
    keyRequired: false,
    keyConfigured: null,
    upstreamStatus,
    checkedAt,
    testTarget: {
      country: TEST_COUNTRY,
      indicator: TEST_INDICATOR,
      year: TEST_YEAR,
      dataVerified: dataHasUsableValue,
      sampleValue: parsedValue,
    },
    ...(failureReason ? { reason: failureReason } : {}),
  };

  return sendResponse(res, httpCode, responsePayload);
}
