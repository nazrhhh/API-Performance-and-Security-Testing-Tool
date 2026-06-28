// Core HTTP request execution and performance measurement

import { runSecurityChecks } from "./securityChecks";
import {
  buildResponseTimeDistribution,
  buildPerformanceOverTime,
} from "./calculations";

export const runTest = async (
  apiUrl,
  httpMethod,
  headers,
  requestBody,
  authType,
  authValue,
  testConfig,
  onProgress
) => {
  // Validate URL
  try {
    new URL(apiUrl);
  } catch {
    throw new Error("Please enter a valid URL including https://");
  }

  const results = [];
  const batchSize = testConfig.concurrency;
  const totalBatches = Math.ceil(testConfig.requestCount / batchSize);
  const overallStart = performance.now();

  for (let i = 0; i < totalBatches; i++) {
    const batchPromises = Array.from({ length: batchSize }, async () => {
      const reqStart = performance.now();
      try {
        // Build headers
        let parsedHeaders = {};
        try {
          parsedHeaders = JSON.parse(headers);
        } catch (e) {
          // Invalid JSON headers — use empty
        }

        // Add authentication header
        if (authType === "bearer" && authValue) {
          parsedHeaders["Authorization"] = `Bearer ${authValue}`;
        } else if (authType === "apikey" && authValue) {
          parsedHeaders["X-API-Key"] = authValue;
        } else if (authType === "basic" && authValue) {
          parsedHeaders["Authorization"] = `Basic ${btoa(authValue)}`;
        }

        const fetchOptions = {
          method: httpMethod,
          headers: parsedHeaders,
        };

        if (
          (httpMethod === "POST" || httpMethod === "PUT") &&
          requestBody
        ) {
          fetchOptions.body = requestBody;
        }

        const response = await fetch(apiUrl, fetchOptions);
        const reqEnd = performance.now();

        // Try to parse body as JSON, fall back to text
        let responseBody;
        try {
          responseBody = await response.json();
        } catch {
          responseBody = await response.text().catch(() => null);
        }

        return {
          success: response.ok,
          status: response.status,
          statusText: response.statusText,
          responseTime: reqEnd - reqStart,
          headers: Object.fromEntries(response.headers.entries()),
          body: responseBody,
        };
      } catch (err) {
        const reqEnd = performance.now();
        return {
          success: false,
          status: 0,
          statusText: "Network Error",
          responseTime: reqEnd - reqStart,
          headers: {},
          body: null,
          error: err.message,
        };
      }
    });

    const batchResults = await Promise.all(batchPromises);
    results.push(...batchResults);
    if (onProgress) onProgress(results.length);
  }

  const totalTime = (performance.now() - overallStart) / 1000;
  const successful = results.filter((r) => r.success);
  const failed = results.filter((r) => !r.success);
  const responseTimes = results.map((r) => r.responseTime);
  const sorted = [...responseTimes].sort((a, b) => a - b);

  // Use first successful response for security checks
  const lastResult = successful[0] || results[0];
  const responseHeaders = lastResult?.headers || {};

  const security = runSecurityChecks(
    apiUrl,
    authType,
    headers,
    responseHeaders,
    lastResult?.body
  );

  return {
    timestamp: new Date().toISOString(),
    endpoint: apiUrl,
    method: httpMethod,
    performance: {
      avgResponseTime:
        responseTimes.reduce((a, b) => a + b, 0) / responseTimes.length,
      minResponseTime: Math.min(...responseTimes),
      maxResponseTime: Math.max(...responseTimes),
      p95ResponseTime: sorted[Math.floor(sorted.length * 0.95)] || 0,
      throughput: results.length / totalTime,
      errorRate: (failed.length / results.length) * 100,
      successRate: (successful.length / results.length) * 100,
      totalRequests: results.length,
      successfulRequests: successful.length,
      failedRequests: failed.length,
    },
    security,
    responseTimeDistribution: buildResponseTimeDistribution(responseTimes),
    performanceOverTime: buildPerformanceOverTime(results),
    requestDetails: {
      url: apiUrl,
      method: httpMethod,
      headers: (() => {
        try {
          return JSON.parse(headers);
        } catch {
          return {};
        }
      })(),
      body: requestBody || null,
      timestamp: new Date().toISOString(),
    },
    responseDetails: {
      status: lastResult?.status || 0,
      statusText: lastResult?.statusText || "Unknown",
      headers: responseHeaders,
      body: lastResult?.body || null,
    },
  };
};
