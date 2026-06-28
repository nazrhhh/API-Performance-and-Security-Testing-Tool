// Performance and security score calculations

export const calculateSecurityScore = (security) => {
  if (!security) return 0;
  let score = 0;
  if (security.httpsEnabled) score += 25;
  if (security.certificateValid) score += 20;
  if (security.authenticationPresent) score += 15;
  if (security.rateLimitingDetected) score += 15;
  const headerScore =
    Object.values(security.securityHeaders).filter(Boolean).length * 6.25;
  score += headerScore;
  return Math.round(score);
};

export const buildResponseTimeDistribution = (responseTimes) => {
  return Array.from({ length: 10 }, (_, i) => ({
    range: `${i * 50}-${(i + 1) * 50}ms`,
    count: responseTimes.filter((t) => t >= i * 50 && t < (i + 1) * 50).length,
  }));
};

export const buildPerformanceOverTime = (results) => {
  return results.map((r, i) => ({
    time: `${i + 1}`,
    responseTime: r.responseTime,
    requests: 1,
  }));
};
