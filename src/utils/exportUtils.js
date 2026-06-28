// CSV and PDF export functions

export const exportCSV = (testResults, securityScore) => {
  if (!testResults) return;

  const csv = `Metric,Value
Endpoint,${testResults.endpoint}
Method,${testResults.method}
Timestamp,${testResults.timestamp}
Avg Response Time,${testResults.performance.avgResponseTime.toFixed(2)}ms
Min Response Time,${testResults.performance.minResponseTime.toFixed(2)}ms
Max Response Time,${testResults.performance.maxResponseTime.toFixed(2)}ms
95th Percentile,${testResults.performance.p95ResponseTime.toFixed(2)}ms
Throughput,${testResults.performance.throughput.toFixed(1)} req/s
Success Rate,${testResults.performance.successRate.toFixed(1)}%
Error Rate,${testResults.performance.errorRate.toFixed(1)}%
Total Requests,${testResults.performance.totalRequests}
Successful Requests,${testResults.performance.successfulRequests}
Failed Requests,${testResults.performance.failedRequests}
Security Score,${securityScore}/100
HTTPS Enabled,${testResults.security.httpsEnabled}
Valid Certificate,${testResults.security.certificateValid}
Authentication Present,${testResults.security.authenticationPresent}
Rate Limiting Detected,${testResults.security.rateLimitingDetected}
Sensitive Data Exposed,${testResults.security.sensitiveDataExposed}
Strict-Transport-Security,${testResults.security.securityHeaders.strictTransportSecurity}
Content-Security-Policy,${testResults.security.securityHeaders.contentSecurityPolicy}
X-Frame-Options,${testResults.security.securityHeaders.xFrameOptions}
X-Content-Type-Options,${testResults.security.securityHeaders.xContentTypeOptions}
Vulnerabilities Found,${testResults.security.vulnerabilities.length}`;

  const blob = new Blob([csv], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `api-test-results-${Date.now()}.csv`;
  a.click();
  window.URL.revokeObjectURL(url);
};

export const exportPDF = (testResults, securityScore) => {
  if (!testResults) return;

  const { jsPDF } = require("jspdf");
  const doc = new jsPDF();

  // Title
  doc.setFontSize(18);
  doc.setFont("helvetica", "bold");
  doc.text("API Performance & Security Test Report", 14, 20);

  // Metadata
  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  doc.text(`Generated: ${new Date(testResults.timestamp).toLocaleString()}`, 14, 30);
  doc.text(`Endpoint: ${testResults.endpoint}`, 14, 36);
  doc.text(`Method: ${testResults.method}`, 14, 42);

  // Performance section
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Performance Results", 14, 55);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const perf = testResults.performance;
  const perfLines = [
    `Avg Response Time: ${perf.avgResponseTime.toFixed(2)}ms`,
    `Min Response Time: ${perf.minResponseTime.toFixed(2)}ms`,
    `Max Response Time: ${perf.maxResponseTime.toFixed(2)}ms`,
    `95th Percentile: ${perf.p95ResponseTime.toFixed(2)}ms`,
    `Throughput: ${perf.throughput.toFixed(1)} req/s`,
    `Success Rate: ${perf.successRate.toFixed(1)}%`,
    `Error Rate: ${perf.errorRate.toFixed(1)}%`,
    `Total Requests: ${perf.totalRequests}`,
    `Successful: ${perf.successfulRequests}`,
    `Failed: ${perf.failedRequests}`,
  ];
  perfLines.forEach((line, i) => doc.text(line, 14, 63 + i * 7));

  // Security section
  doc.setFontSize(13);
  doc.setFont("helvetica", "bold");
  doc.text("Security Results", 14, 140);

  doc.setFontSize(10);
  doc.setFont("helvetica", "normal");
  const sec = testResults.security;
  const secLines = [
    `Security Score: ${securityScore}/100`,
    `HTTPS Enabled: ${sec.httpsEnabled}`,
    `Certificate Valid: ${sec.certificateValid}`,
    `Authentication Present: ${sec.authenticationPresent}`,
    `Rate Limiting Detected: ${sec.rateLimitingDetected}`,
    `Sensitive Data Exposed: ${sec.sensitiveDataExposed || false}`,
    `Strict-Transport-Security: ${sec.securityHeaders.strictTransportSecurity}`,
    `Content-Security-Policy: ${sec.securityHeaders.contentSecurityPolicy}`,
    `X-Frame-Options: ${sec.securityHeaders.xFrameOptions}`,
    `X-Content-Type-Options: ${sec.securityHeaders.xContentTypeOptions}`,
  ];
  secLines.forEach((line, i) => doc.text(line, 14, 148 + i * 7));

  // Vulnerabilities
  if (testResults.security.vulnerabilities.length > 0) {
    doc.setFontSize(13);
    doc.setFont("helvetica", "bold");
    doc.text("Detected Vulnerabilities", 14, 225);

    doc.setFontSize(10);
    doc.setFont("helvetica", "normal");
    testResults.security.vulnerabilities.forEach((v, i) => {
      doc.text(`[${v.severity}] ${v.type}: ${v.description}`, 14, 233 + i * 10, { maxWidth: 180 });
    });
  }

  doc.save(`api-test-report-${Date.now()}.pdf`);
};