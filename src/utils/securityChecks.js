// OWASP-based security validation logic

export const runSecurityChecks = (apiUrl, authType, headers, responseHeaders, responseBody) => {
  const isHttps = apiUrl.startsWith("https");
  const hasAuth =
    authType !== "none" ||
    (headers && headers.toLowerCase().includes("authorization"));
  const hasRateLimit = !!(
    responseHeaders["x-ratelimit-limit"] ||
    responseHeaders["ratelimit-limit"] ||
    responseHeaders["retry-after"]
  );
  const hasHSTS = !!responseHeaders["strict-transport-security"];
  const hasCSP = !!responseHeaders["content-security-policy"];
  const hasXFrame = !!responseHeaders["x-frame-options"];
  const hasXContent = !!responseHeaders["x-content-type-options"];

  // Check sensitive data exposure in response body
  const bodyStr = JSON.stringify(responseBody || "");
  const sensitivePatterns = /password|secret|token|api_key|credit_card|ssn/i;
  const hasSensitiveData = sensitivePatterns.test(bodyStr);

  const security = {
    httpsEnabled: isHttps,
    certificateValid: isHttps,
    authenticationPresent: hasAuth,
    rateLimitingDetected: hasRateLimit,
    sensitiveDataExposed: hasSensitiveData,
    securityHeaders: {
      strictTransportSecurity: hasHSTS,
      contentSecurityPolicy: hasCSP,
      xFrameOptions: hasXFrame,
      xContentTypeOptions: hasXContent,
    },
    vulnerabilities: [],
  };

  // Build vulnerability list
  if (!isHttps) {
    security.vulnerabilities.push({
      severity: "HIGH",
      type: "Insecure Connection",
      description: "API does not use HTTPS, exposing data in transit.",
    });
  }
  if (!hasAuth) {
    security.vulnerabilities.push({
      severity: "MEDIUM",
      type: "Missing Authentication",
      description: "No authentication headers detected, potential for unauthorized access.",
    });
  }
  if (!hasRateLimit) {
    security.vulnerabilities.push({
      severity: "MEDIUM",
      type: "No Rate Limiting",
      description: "No rate limiting headers found in response, vulnerable to resource exhaustion attacks.",
    });
  }
  if (hasSensitiveData) {
    security.vulnerabilities.push({
      severity: "HIGH",
      type: "Sensitive Data Exposure",
      description: "Response body may contain sensitive data (password, token, secret, api_key, etc.).",
    });
  }
  const missingHeaders = Object.entries(security.securityHeaders)
    .filter(([_, v]) => !v)
    .map(([k]) => k);
  if (missingHeaders.length > 0) {
    security.vulnerabilities.push({
      severity: "LOW",
      type: "Missing Security Headers",
      description: `Missing headers: ${missingHeaders.join(", ")}`,
    });
  }

  return security;
};
