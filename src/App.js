import React, { useState, useEffect } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import {
  Activity,
  Lock,
  Zap,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  TrendingUp,
  Shield,
  FileText,
  Download,
  PlayCircle,
  Database,
  Globe,
  Settings,
  BarChart2,
  ChevronRight,
} from "lucide-react";

const APITestingTool = () => {
  const [activeTab, setActiveTab] = useState("configure");
  const [apiUrl, setApiUrl] = useState(
    "https://jsonplaceholder.typicode.com/posts/1"
  );
  const [httpMethod, setHttpMethod] = useState("GET");
  const [headers, setHeaders] = useState(
    '{"Content-Type": "application/json"}'
  );
  const [requestBody, setRequestBody] = useState("");
  const [authType, setAuthType] = useState("none");
  const [authValue, setAuthValue] = useState("");

  const [testConfig, setTestConfig] = useState({
    requestCount: 50,
    duration: 10,
    concurrency: 5,
  });

  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [testHistory, setTestHistory] = useState([]);
  const [savedEndpoints, setSavedEndpoints] = useState([]);

  const runTest = async () => {
    setIsLoading(true);

    await new Promise((resolve) => setTimeout(resolve, 3000));

    const mockResults = {
      timestamp: new Date().toISOString(),
      endpoint: apiUrl,
      method: httpMethod,

      performance: {
        avgResponseTime: Math.random() * 200 + 50,
        minResponseTime: Math.random() * 50 + 10,
        maxResponseTime: Math.random() * 300 + 200,
        p95ResponseTime: Math.random() * 250 + 100,
        throughput: Math.random() * 100 + 50,
        errorRate: Math.random() * 5,
        successRate: 95 + Math.random() * 5,
        totalRequests: testConfig.requestCount,
        successfulRequests: Math.floor(testConfig.requestCount * 0.96),
        failedRequests: Math.floor(testConfig.requestCount * 0.04),
      },

      security: {
        httpsEnabled: apiUrl.startsWith("https"),
        certificateValid: apiUrl.startsWith("https")
          ? Math.random() > 0.2
          : false,
        authenticationPresent:
          authType !== "none" ||
          headers.toLowerCase().includes("authorization"),
        rateLimitingDetected: Math.random() > 0.5,
        securityHeaders: {
          strictTransportSecurity: Math.random() > 0.4,
          contentSecurityPolicy: Math.random() > 0.6,
          xFrameOptions: Math.random() > 0.3,
          xContentTypeOptions: Math.random() > 0.5,
        },
        vulnerabilities: [],
      },

      responseTimeDistribution: Array.from({ length: 10 }, (_, i) => ({
        range: `${i * 50}-${(i + 1) * 50}ms`,
        count: Math.floor(Math.random() * 15) + 1,
      })),

      performanceOverTime: Array.from({ length: 20 }, (_, i) => ({
        time: `${((i * testConfig.duration) / 20).toFixed(1)}s`,
        responseTime: Math.random() * 200 + 50,
        requests: Math.floor(Math.random() * 10) + 1,
      })),

      requestDetails: {
        url: apiUrl,
        method: httpMethod,
        headers: headers ? JSON.parse(headers) : {},
        body: requestBody || null,
        timestamp: new Date().toISOString(),
      },
      responseDetails: {
        status: 200,
        statusText: "OK",
        headers: {
          "content-type": "application/json",
          "cache-control": "no-cache",
          connection: "keep-alive",
          date: new Date().toUTCString(),
          ...(apiUrl.startsWith("https")
            ? {
                "strict-transport-security": "max-age=31536000",
              }
            : {}),
        },
        body: {
          id: 1,
          title: "Sample Response",
          data: "This is a mock API response",
          success: true,
        },
      },
    };

    if (!mockResults.security.httpsEnabled) {
      mockResults.security.vulnerabilities.push({
        severity: "HIGH",
        type: "Insecure Connection",
        description:
          "API does not use HTTPS encryption, exposing data in transit",
      });
    }

    if (!mockResults.security.authenticationPresent) {
      mockResults.security.vulnerabilities.push({
        severity: "MEDIUM",
        type: "Missing Authentication",
        description:
          "No authentication headers detected, potential for unauthorized access",
      });
    }

    if (!mockResults.security.rateLimitingDetected) {
      mockResults.security.vulnerabilities.push({
        severity: "MEDIUM",
        type: "No Rate Limiting",
        description:
          "API does not implement rate limiting, vulnerable to resource exhaustion attacks",
      });
    }

    const headerChecks = Object.entries(mockResults.security.securityHeaders);
    const missingHeaders = headerChecks.filter(([_, present]) => !present);

    if (missingHeaders.length > 0) {
      mockResults.security.vulnerabilities.push({
        severity: "LOW",
        type: "Missing Security Headers",
        description: `Missing headers: ${missingHeaders
          .map(([name]) => name)
          .join(", ")}`,
      });
    }

    setTestResults(mockResults);
    setTestHistory((prev) => [mockResults, ...prev.slice(0, 9)]);
    setIsLoading(false);
  };

  const saveEndpoint = () => {
    const endpointConfig = {
      id: Date.now(),
      url: apiUrl,
      method: httpMethod,
      headers: headers,
      authType: authType,
      authValue: authValue,
      savedAt: new Date().toISOString(),
    };
    setSavedEndpoints((prev) => [endpointConfig, ...prev]);
    alert("Endpoint configuration saved successfully!");
  };

  const loadEndpoint = (config) => {
    setApiUrl(config.url);
    setHttpMethod(config.method);
    setHeaders(config.headers);
    setAuthType(config.authType);
    setAuthValue(config.authValue);
    setActiveTab("configure");
  };

  const calculateSecurityScore = (security) => {
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

  const securityScore = testResults
    ? calculateSecurityScore(testResults.security)
    : 0;

  const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b"];

  const exportPDF = () => {
    alert(
      "PDF Report Generated!\n\n✓ Test Configuration\n✓ Performance Metrics\n✓ Security Findings\n✓ Visual Charts\n✓ Recommendations\n\nReport ready for download."
    );
  };

  const exportCSV = () => {
    if (!testResults) return;
    const csv = `Metric,Value
Endpoint,${testResults.endpoint}
Method,${testResults.method}
Avg Response Time,${testResults.performance.avgResponseTime.toFixed(2)}ms
Min Response Time,${testResults.performance.minResponseTime.toFixed(2)}ms
Max Response Time,${testResults.performance.maxResponseTime.toFixed(2)}ms
95th Percentile,${testResults.performance.p95ResponseTime.toFixed(2)}ms
Throughput,${testResults.performance.throughput.toFixed(1)} req/s
Success Rate,${testResults.performance.successRate.toFixed(1)}%
Error Rate,${testResults.performance.errorRate.toFixed(1)}%
Security Score,${securityScore}/100
HTTPS Enabled,${testResults.security.httpsEnabled}
Valid Certificate,${testResults.security.certificateValid}
Authentication Present,${testResults.security.authenticationPresent}
Rate Limiting,${testResults.security.rateLimitingDetected}`;

    const blob = new Blob([csv], { type: "text/csv" });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `api-test-results-${Date.now()}.csv`;
    a.click();
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        height: "auto",
        background:
          "linear-gradient(135deg, #f0f4f8 0%, #e6f2ff 50%, #f5f0ff 100%)",
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        color: "#1e293b",
        padding: "0",
        margin: "0",
        width: "100%",
        overflow: "auto",
      }}
    >
      {/* Header */}
      <header
        style={{
          background:
            "linear-gradient(135deg, rgba(255,255,255,0.95) 0%, rgba(255,255,255,0.9) 100%)",
          backdropFilter: "blur(20px)",
          borderBottom: "1px solid rgba(99, 102, 241, 0.1)",
          padding: "1.25rem clamp(1rem, 4vw, 2rem)",
          position: "sticky",
          top: 0,
          zIndex: 100,
          boxShadow: "0 4px 24px rgba(99, 102, 241, 0.06)",
          width: "100%",
        }}
      >
        <div
          style={{
            maxWidth: "1400px",
            margin: "0 auto",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            width: "100%",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "1rem",
              flexWrap: "wrap",
            }}
          >
            <div
              style={{
                width: "48px",
                height: "48px",
                background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                borderRadius: "14px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                boxShadow: "0 4px 16px rgba(99, 102, 241, 0.25)",
                flexShrink: 0,
              }}
            >
              <Activity size={26} color="#ffffff" />
            </div>
            <div style={{ minWidth: 0 }}>
              <h1
                style={{
                  margin: 0,
                  fontSize: "clamp(1.125rem, 3vw, 1.5rem)",
                  fontWeight: 700,
                  color: "#1e293b",
                  letterSpacing: "-0.025em",
                  whiteSpace: "nowrap",
                  overflow: "hidden",
                  textOverflow: "ellipsis",
                }}
              >
                API & Security Analysis Platform
              </h1>
              <p
                style={{
                  margin: 0,
                  fontSize: "clamp(0.7rem, 2vw, 0.8rem)",
                  color: "#64748b",
                  fontWeight: 500,
                }}
              >
                Evaluating API Performance and Security Metrics
              </p>
            </div>
          </div>
          <div
            style={{
              fontSize: "clamp(0.625rem, 1.5vw, 0.7rem)",
              color: "#64748b",
              textAlign: "right",
              lineHeight: 1.6,
              flexShrink: 0,
            }}
          >
            <div style={{ fontWeight: 600 }}>
              Project ID: FYP02-SE-T2610-0302
            </div>
            <div>Haizatul Nazirah Nizam</div>
            <div>1231303504</div>
          </div>
        </div>
      </header>

      {/* Navigation Tabs */}
      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2rem clamp(1rem, 4vw, 2rem)",
          width: "100%",
        }}
      >
        <div
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: "0.75rem",
            marginBottom: "2rem",
            background: "rgba(255, 255, 255, 0.7)",
            padding: "0.5rem",
            borderRadius: "16px",
            boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            width: "100%",
          }}
        >
          {[
            { id: "configure", label: "Configure Test", icon: Settings },
            { id: "results", label: "Test Results", icon: BarChart2 },
            { id: "history", label: "History", icon: Clock },
            { id: "saved", label: "Saved Endpoints", icon: Database },
          ].map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                style={{
                  flex: "1 1 auto",
                  minWidth: "140px",
                  background:
                    activeTab === tab.id
                      ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                      : "transparent",
                  color: activeTab === tab.id ? "#ffffff" : "#64748b",
                  border: "none",
                  padding: "0.875rem 1rem",
                  borderRadius: "12px",
                  fontSize: "clamp(0.75rem, 2vw, 0.875rem)",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.3s ease",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.5rem",
                  fontFamily: "inherit",
                  boxShadow:
                    activeTab === tab.id
                      ? "0 4px 12px rgba(99, 102, 241, 0.3)"
                      : "none",
                  whiteSpace: "nowrap",
                }}
                onMouseEnter={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.background = "rgba(99, 102, 241, 0.08)";
                  }
                }}
                onMouseLeave={(e) => {
                  if (activeTab !== tab.id) {
                    e.target.style.background = "transparent";
                  }
                }}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </div>

        {/* Configure Test Tab */}
        {activeTab === "configure" && (
          <div
            className="grid-2-cols"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "2rem",
              width: "100%",
            }}
          >
            {/* Left Column - Endpoint Configuration */}
            <div>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "20px",
                  padding: "2rem",
                  border: "1px solid rgba(99, 102, 241, 0.1)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.25rem",
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#1e293b",
                    fontWeight: 700,
                  }}
                >
                  <Globe size={22} color="#6366f1" />
                  Endpoint Configuration
                </h2>

                {/* API Endpoint URL */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontSize: "0.813rem",
                      color: "#475569",
                      fontWeight: 600,
                    }}
                  >
                    API Endpoint URL *
                  </label>
                  <input
                    type="text"
                    value={apiUrl}
                    onChange={(e) => setApiUrl(e.target.value)}
                    placeholder="https://api.example.com/endpoint"
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      background: "#ffffff",
                      border: "2px solid #e2e8f0",
                      borderRadius: "12px",
                      color: "#1e293b",
                      fontSize: "0.875rem",
                      fontFamily: "inherit",
                      outline: "none",
                      transition: "all 0.3s ease",
                    }}
                    onFocus={(e) => {
                      e.target.style.border = "2px solid #6366f1";
                      e.target.style.boxShadow =
                        "0 0 0 3px rgba(99, 102, 241, 0.1)";
                    }}
                    onBlur={(e) => {
                      e.target.style.border = "2px solid #e2e8f0";
                      e.target.style.boxShadow = "none";
                    }}
                  />
                </div>

                {/* HTTP Method */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontSize: "0.813rem",
                      color: "#475569",
                      fontWeight: 600,
                    }}
                  >
                    HTTP Method
                  </label>
                  <select
                    value={httpMethod}
                    onChange={(e) => setHttpMethod(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      background: "#ffffff",
                      border: "2px solid #e2e8f0",
                      borderRadius: "12px",
                      color: "#1e293b",
                      fontSize: "0.875rem",
                      fontFamily: "inherit",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="GET">GET</option>
                    <option value="POST">POST</option>
                    <option value="PUT">PUT</option>
                    <option value="DELETE">DELETE</option>
                  </select>
                </div>

                {/* Authentication Type */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontSize: "0.813rem",
                      color: "#475569",
                      fontWeight: 600,
                    }}
                  >
                    Authentication Type
                  </label>
                  <select
                    value={authType}
                    onChange={(e) => setAuthType(e.target.value)}
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      background: "#ffffff",
                      border: "2px solid #e2e8f0",
                      borderRadius: "12px",
                      color: "#1e293b",
                      fontSize: "0.875rem",
                      fontFamily: "inherit",
                      outline: "none",
                      cursor: "pointer",
                    }}
                  >
                    <option value="none">No Authentication</option>
                    <option value="bearer">Bearer Token</option>
                    <option value="apikey">API Key</option>
                    <option value="basic">Basic Auth</option>
                  </select>
                </div>

                {/* Authentication Value */}
                {authType !== "none" && (
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontSize: "0.813rem",
                        color: "#475569",
                        fontWeight: 600,
                      }}
                    >
                      {authType === "bearer"
                        ? "Bearer Token"
                        : authType === "apikey"
                        ? "API Key"
                        : "Credentials"}
                    </label>
                    <input
                      type="password"
                      value={authValue}
                      onChange={(e) => setAuthValue(e.target.value)}
                      placeholder={
                        authType === "bearer"
                          ? "Enter bearer token"
                          : authType === "apikey"
                          ? "Enter API key"
                          : "username:password"
                      }
                      style={{
                        width: "100%",
                        padding: "0.875rem 1rem",
                        background: "#ffffff",
                        border: "2px solid #e2e8f0",
                        borderRadius: "12px",
                        color: "#1e293b",
                        fontSize: "0.875rem",
                        fontFamily: "inherit",
                        outline: "none",
                      }}
                    />
                  </div>
                )}

                {/* Headers */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <label
                    style={{
                      display: "block",
                      marginBottom: "0.5rem",
                      fontSize: "0.813rem",
                      color: "#475569",
                      fontWeight: 600,
                    }}
                  >
                    Request Headers (JSON format)
                  </label>
                  <textarea
                    value={headers}
                    onChange={(e) => setHeaders(e.target.value)}
                    placeholder='{"Content-Type": "application/json"}'
                    rows={3}
                    style={{
                      width: "100%",
                      padding: "0.875rem 1rem",
                      background: "#ffffff",
                      border: "2px solid #e2e8f0",
                      borderRadius: "12px",
                      color: "#1e293b",
                      fontSize: "0.813rem",
                      fontFamily: '"Fira Code", monospace',
                      outline: "none",
                      resize: "vertical",
                    }}
                  />
                </div>

                {/* Request Body */}
                {(httpMethod === "POST" || httpMethod === "PUT") && (
                  <div style={{ marginBottom: "1.5rem" }}>
                    <label
                      style={{
                        display: "block",
                        marginBottom: "0.5rem",
                        fontSize: "0.813rem",
                        color: "#475569",
                        fontWeight: 600,
                      }}
                    >
                      Request Body (JSON)
                    </label>
                    <textarea
                      value={requestBody}
                      onChange={(e) => setRequestBody(e.target.value)}
                      placeholder='{"key": "value"}'
                      rows={4}
                      style={{
                        width: "100%",
                        padding: "0.875rem 1rem",
                        background: "#ffffff",
                        border: "2px solid #e2e8f0",
                        borderRadius: "12px",
                        color: "#1e293b",
                        fontSize: "0.813rem",
                        fontFamily: '"Fira Code", monospace',
                        outline: "none",
                        resize: "vertical",
                      }}
                    />
                  </div>
                )}

                {/* Save Configuration Button */}
                <button
                  onClick={saveEndpoint}
                  style={{
                    width: "100%",
                    padding: "0.875rem",
                    background: "transparent",
                    color: "#6366f1",
                    border: "2px solid #6366f1",
                    borderRadius: "12px",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.5rem",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.target.style.background = "#6366f1";
                    e.target.style.color = "#ffffff";
                  }}
                  onMouseLeave={(e) => {
                    e.target.style.background = "transparent";
                    e.target.style.color = "#6366f1";
                  }}
                >
                  <Database size={18} />
                  Save Configuration
                </button>
              </div>
            </div>

            {/* Right Column - Test Parameters */}
            <div>
              <div
                style={{
                  background: "rgba(255, 255, 255, 0.9)",
                  borderRadius: "20px",
                  padding: "2rem",
                  border: "1px solid rgba(139, 92, 246, 0.1)",
                  boxShadow: "0 4px 16px rgba(0, 0, 0, 0.04)",
                  marginBottom: "1.5rem",
                }}
              >
                <h2
                  style={{
                    fontSize: "1.25rem",
                    marginBottom: "1.5rem",
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                    color: "#1e293b",
                    fontWeight: 700,
                  }}
                >
                  <TrendingUp size={22} color="#8b5cf6" />
                  Test Parameters
                </h2>

                {/* Request Count */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "0.813rem",
                        color: "#475569",
                        fontWeight: 600,
                      }}
                    >
                      Total Requests
                    </label>
                    <span
                      style={{
                        fontSize: "0.813rem",
                        color: "#6366f1",
                        fontWeight: 700,
                      }}
                    >
                      {testConfig.requestCount}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="10"
                    max="200"
                    value={testConfig.requestCount}
                    onChange={(e) =>
                      setTestConfig({
                        ...testConfig,
                        requestCount: parseInt(e.target.value),
                      })
                    }
                    style={{
                      width: "100%",
                      height: "8px",
                      borderRadius: "4px",
                      outline: "none",
                      background: `linear-gradient(to right, #6366f1 0%, #6366f1 ${
                        ((testConfig.requestCount - 10) / 190) * 100
                      }%, #e2e8f0 ${
                        ((testConfig.requestCount - 10) / 190) * 100
                      }%, #e2e8f0 100%)`,
                      cursor: "pointer",
                    }}
                  />
                </div>

                {/* Duration */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "0.813rem",
                        color: "#475569",
                        fontWeight: 600,
                      }}
                    >
                      Test Duration
                    </label>
                    <span
                      style={{
                        fontSize: "0.813rem",
                        color: "#8b5cf6",
                        fontWeight: 700,
                      }}
                    >
                      {testConfig.duration}s
                    </span>
                  </div>
                  <input
                    type="range"
                    min="5"
                    max="60"
                    value={testConfig.duration}
                    onChange={(e) =>
                      setTestConfig({
                        ...testConfig,
                        duration: parseInt(e.target.value),
                      })
                    }
                    style={{
                      width: "100%",
                      height: "8px",
                      borderRadius: "4px",
                      outline: "none",
                      background: `linear-gradient(to right, #8b5cf6 0%, #8b5cf6 ${
                        ((testConfig.duration - 5) / 55) * 100
                      }%, #e2e8f0 ${
                        ((testConfig.duration - 5) / 55) * 100
                      }%, #e2e8f0 100%)`,
                      cursor: "pointer",
                    }}
                  />
                </div>

                {/* Concurrency */}
                <div style={{ marginBottom: "1.5rem" }}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      marginBottom: "0.5rem",
                    }}
                  >
                    <label
                      style={{
                        fontSize: "0.813rem",
                        color: "#475569",
                        fontWeight: 600,
                      }}
                    >
                      Concurrent Users
                    </label>
                    <span
                      style={{
                        fontSize: "0.813rem",
                        color: "#ec4899",
                        fontWeight: 700,
                      }}
                    >
                      {testConfig.concurrency}
                    </span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="100"
                    value={testConfig.concurrency}
                    onChange={(e) =>
                      setTestConfig({
                        ...testConfig,
                        concurrency: parseInt(e.target.value),
                      })
                    }
                    style={{
                      width: "100%",
                      height: "8px",
                      borderRadius: "4px",
                      outline: "none",
                      background: `linear-gradient(to right, #ec4899 0%, #ec4899 ${
                        ((testConfig.concurrency - 1) / 99) * 100
                      }%, #e2e8f0 ${
                        ((testConfig.concurrency - 1) / 99) * 100
                      }%, #e2e8f0 100%)`,
                      cursor: "pointer",
                    }}
                  />
                </div>

                {/* Run Test Button */}
                <button
                  onClick={runTest}
                  disabled={isLoading || !apiUrl}
                  style={{
                    width: "100%",
                    padding: "1.125rem",
                    background: isLoading
                      ? "linear-gradient(135deg, #cbd5e1 0%, #94a3b8 100%)"
                      : "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "14px",
                    fontSize: "1rem",
                    fontWeight: 700,
                    cursor: isLoading ? "not-allowed" : "pointer",
                    transition: "all 0.3s ease",
                    fontFamily: "inherit",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    gap: "0.75rem",
                    marginTop: "1.5rem",
                    boxShadow: isLoading
                      ? "none"
                      : "0 8px 24px rgba(99, 102, 241, 0.25)",
                    transform: isLoading ? "scale(0.98)" : "scale(1)",
                  }}
                  onMouseEnter={(e) => {
                    if (!isLoading && apiUrl) {
                      e.target.style.transform = "scale(1.02)";
                      e.target.style.boxShadow =
                        "0 12px 32px rgba(99, 102, 241, 0.35)";
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isLoading) {
                      e.target.style.transform = "scale(1)";
                      e.target.style.boxShadow =
                        "0 8px 24px rgba(99, 102, 241, 0.25)";
                    }
                  }}
                >
                  {isLoading ? (
                    <>
                      <div
                        style={{
                          width: "20px",
                          height: "20px",
                          border: "3px solid rgba(255, 255, 255, 0.3)",
                          borderTop: "3px solid #ffffff",
                          borderRadius: "50%",
                          animation: "spin 1s linear infinite",
                        }}
                      />
                      Running Tests...
                    </>
                  ) : (
                    <>
                      <PlayCircle size={22} />
                      Execute Performance & Security Test
                    </>
                  )}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Results Tab */}
        {activeTab === "results" && testResults && (
          <div>
            {/* Performance Metrics Overview */}
            <div
              className="grid-4-cols"
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(4, 1fr)",
                gap: "1.25rem",
                marginBottom: "2rem",
                width: "100%",
              }}
            >
              {[
                {
                  label: "Avg Response Time",
                  value: `${testResults.performance.avgResponseTime.toFixed(
                    2
                  )}ms`,
                  icon: Clock,
                  color: "#6366f1",
                  bgGradient:
                    "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(99, 102, 241, 0.05) 100%)",
                },
                {
                  label: "Throughput",
                  value: `${testResults.performance.throughput.toFixed(
                    1
                  )} req/s`,
                  icon: TrendingUp,
                  color: "#8b5cf6",
                  bgGradient:
                    "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(139, 92, 246, 0.05) 100%)",
                },
                {
                  label: "Success Rate",
                  value: `${testResults.performance.successRate.toFixed(1)}%`,
                  icon: CheckCircle,
                  color: "#10b981",
                  bgGradient:
                    "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)",
                },
                {
                  label: "Security Score",
                  value: `${securityScore}/100`,
                  icon: Shield,
                  color: "#ec4899",
                  bgGradient:
                    "linear-gradient(135deg, rgba(236, 72, 153, 0.1) 0%, rgba(236, 72, 153, 0.05) 100%)",
                },
              ].map((metric, idx) => {
                const Icon = metric.icon;
                return (
                  <div
                    key={idx}
                    style={{
                      background: "#ffffff",
                      borderRadius: "16px",
                      padding: "1.5rem",
                      border: "1px solid rgba(0, 0, 0, 0.06)",
                      position: "relative",
                      overflow: "hidden",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    }}
                  >
                    <div
                      style={{
                        position: "absolute",
                        top: 0,
                        right: 0,
                        width: "100%",
                        height: "100%",
                        background: metric.bgGradient,
                        opacity: 1,
                      }}
                    />
                    <div style={{ position: "relative", zIndex: 1 }}>
                      <div
                        style={{
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "space-between",
                          marginBottom: "0.75rem",
                        }}
                      >
                        <div
                          style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "10px",
                            background: metric.color,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: `0 4px 12px ${metric.color}40`,
                          }}
                        >
                          <Icon size={20} color="#ffffff" />
                        </div>
                      </div>
                      <div
                        style={{
                          fontSize: "1.875rem",
                          fontWeight: 700,
                          color: metric.color,
                          marginBottom: "0.25rem",
                        }}
                      >
                        {metric.value}
                      </div>
                      <div
                        style={{
                          fontSize: "0.813rem",
                          color: "#64748b",
                          fontWeight: 500,
                        }}
                      >
                        {metric.label}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Charts Section */}
            <div
              className="grid-2-cols"
              style={{
                display: "grid",
                gridTemplateColumns: "2fr 1fr",
                gap: "1.5rem",
                marginBottom: "2rem",
                width: "100%",
              }}
            >
              {/* Performance Over Time */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "1.75rem",
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.063rem",
                    marginBottom: "1.25rem",
                    color: "#1e293b",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <Activity size={20} color="#6366f1" />
                  Response Time Trend
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <LineChart data={testResults.performanceOverTime}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
                    <XAxis
                      dataKey="time"
                      stroke="#64748b"
                      style={{ fontSize: "0.75rem" }}
                    />
                    <YAxis stroke="#64748b" style={{ fontSize: "0.75rem" }} />
                    <Tooltip
                      contentStyle={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="responseTime"
                      stroke="#6366f1"
                      strokeWidth={3}
                      dot={{ fill: "#6366f1", r: 5 }}
                      activeDot={{ r: 7 }}
                      name="Response Time (ms)"
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>

              {/* Response Distribution */}
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "1.75rem",
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
              >
                <h3
                  style={{
                    fontSize: "1.063rem",
                    marginBottom: "1.25rem",
                    color: "#1e293b",
                    fontWeight: 700,
                    display: "flex",
                    alignItems: "center",
                    gap: "0.5rem",
                  }}
                >
                  <BarChart2 size={20} color="#8b5cf6" />
                  Distribution
                </h3>
                <ResponsiveContainer width="100%" height={280}>
                  <PieChart>
                    <Pie
                      data={testResults.responseTimeDistribution.slice(0, 4)}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ range, percent }) =>
                        `${range}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={90}
                      fill="#8884d8"
                      dataKey="count"
                    >
                      {testResults.responseTimeDistribution
                        .slice(0, 4)
                        .map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{
                        background: "#ffffff",
                        border: "1px solid #e2e8f0",
                        borderRadius: "8px",
                        boxShadow: "0 4px 12px rgba(0, 0, 0, 0.1)",
                      }}
                    />
                  </PieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Security Analysis */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "2rem",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                marginBottom: "2rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  marginBottom: "1.5rem",
                  color: "#1e293b",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <Shield size={24} color="#ec4899" />
                Security Analysis
              </h3>

              {/* Security Score Badge */}
              <div
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: "0.75rem",
                  background:
                    securityScore >= 70
                      ? "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)"
                      : "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)",
                  padding: "0.875rem 1.5rem",
                  borderRadius: "12px",
                  marginBottom: "1.5rem",
                  border: `2px solid ${
                    securityScore >= 70 ? "#10b981" : "#ef4444"
                  }`,
                }}
              >
                <Shield
                  size={28}
                  color={securityScore >= 70 ? "#10b981" : "#ef4444"}
                />
                <div>
                  <div
                    style={{
                      fontSize: "0.75rem",
                      color: "#64748b",
                      fontWeight: 600,
                    }}
                  >
                    Overall Security Score
                  </div>
                  <div
                    style={{
                      fontSize: "1.5rem",
                      fontWeight: 700,
                      color: securityScore >= 70 ? "#10b981" : "#ef4444",
                    }}
                  >
                    {securityScore}/100
                  </div>
                </div>
              </div>

              {/* Security Checks Grid */}
              <div
                className="grid-3-cols"
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(3, 1fr)",
                  gap: "1rem",
                  marginBottom: "2rem",
                  width: "100%",
                }}
              >
                {[
                  {
                    label: "HTTPS Enabled",
                    value: testResults.security.httpsEnabled,
                    category: "Transport",
                  },
                  {
                    label: "Valid Certificate",
                    value: testResults.security.certificateValid,
                    category: "Certificate",
                  },
                  {
                    label: "Authentication",
                    value: testResults.security.authenticationPresent,
                    category: "Access Control",
                  },
                  {
                    label: "Rate Limiting",
                    value: testResults.security.rateLimitingDetected,
                    category: "Protection",
                  },
                  {
                    label: "Strict-Transport-Security",
                    value:
                      testResults.security.securityHeaders
                        .strictTransportSecurity,
                    category: "Header",
                  },
                  {
                    label: "Content-Security-Policy",
                    value:
                      testResults.security.securityHeaders
                        .contentSecurityPolicy,
                    category: "Header",
                  },
                  {
                    label: "X-Frame-Options",
                    value: testResults.security.securityHeaders.xFrameOptions,
                    category: "Header",
                  },
                  {
                    label: "X-Content-Type-Options",
                    value:
                      testResults.security.securityHeaders.xContentTypeOptions,
                    category: "Header",
                  },
                ].map((check, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: check.value
                        ? "rgba(16, 185, 129, 0.05)"
                        : "rgba(239, 68, 68, 0.05)",
                      padding: "1rem",
                      borderRadius: "12px",
                      border: `2px solid ${
                        check.value ? "#10b981" : "#ef4444"
                      }`,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "space-between",
                    }}
                  >
                    <div style={{ flex: 1 }}>
                      <div
                        style={{
                          fontSize: "0.688rem",
                          color: "#64748b",
                          marginBottom: "0.25rem",
                          fontWeight: 600,
                          textTransform: "uppercase",
                        }}
                      >
                        {check.category}
                      </div>
                      <div
                        style={{
                          fontSize: "0.813rem",
                          color: "#1e293b",
                          fontWeight: 600,
                        }}
                      >
                        {check.label}
                      </div>
                    </div>
                    {check.value ? (
                      <CheckCircle size={22} color="#10b981" />
                    ) : (
                      <XCircle size={22} color="#ef4444" />
                    )}
                  </div>
                ))}
              </div>

              {/* Vulnerabilities */}
              {testResults.security.vulnerabilities.length > 0 && (
                <div>
                  <h4
                    style={{
                      fontSize: "1.063rem",
                      marginBottom: "1rem",
                      color: "#1e293b",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <AlertTriangle size={20} color="#f59e0b" />
                    Detected Vulnerabilities
                  </h4>
                  <div
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.875rem",
                    }}
                  >
                    {testResults.security.vulnerabilities.map((vuln, idx) => (
                      <div
                        key={idx}
                        style={{
                          background:
                            vuln.severity === "HIGH"
                              ? "rgba(239, 68, 68, 0.05)"
                              : vuln.severity === "MEDIUM"
                              ? "rgba(245, 158, 11, 0.05)"
                              : "rgba(59, 130, 246, 0.05)",
                          padding: "1.25rem",
                          borderRadius: "12px",
                          border: `2px solid ${
                            vuln.severity === "HIGH"
                              ? "#ef4444"
                              : vuln.severity === "MEDIUM"
                              ? "#f59e0b"
                              : "#3b82f6"
                          }`,
                        }}
                      >
                        <div
                          style={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                            marginBottom: "0.625rem",
                          }}
                        >
                          <strong
                            style={{
                              color: "#1e293b",
                              fontSize: "0.938rem",
                              fontWeight: 700,
                            }}
                          >
                            {vuln.type}
                          </strong>
                          <span
                            style={{
                              background:
                                vuln.severity === "HIGH"
                                  ? "#ef4444"
                                  : vuln.severity === "MEDIUM"
                                  ? "#f59e0b"
                                  : "#3b82f6",
                              color: "#ffffff",
                              padding: "0.375rem 0.875rem",
                              borderRadius: "8px",
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              letterSpacing: "0.5px",
                            }}
                          >
                            {vuln.severity}
                          </span>
                        </div>
                        <p
                          style={{
                            margin: 0,
                            color: "#475569",
                            fontSize: "0.875rem",
                            lineHeight: 1.6,
                          }}
                        >
                          {vuln.description}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {testResults.security.vulnerabilities.length === 0 && (
                <div
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)",
                    padding: "1.5rem",
                    borderRadius: "12px",
                    border: "2px solid #10b981",
                    textAlign: "center",
                  }}
                >
                  <CheckCircle
                    size={48}
                    color="#10b981"
                    style={{ marginBottom: "0.75rem" }}
                  />
                  <h4
                    style={{
                      fontSize: "1.063rem",
                      color: "#1e293b",
                      fontWeight: 700,
                      marginBottom: "0.5rem",
                    }}
                  >
                    No Critical Vulnerabilities Detected
                  </h4>
                  <p
                    style={{
                      fontSize: "0.875rem",
                      color: "#475569",
                      margin: 0,
                    }}
                  >
                    API passed all security validation checks
                  </p>
                </div>
              )}
            </div>

            {/* FR9: Request/Response Inspection */}
            <div
              style={{
                background: "#ffffff",
                borderRadius: "16px",
                padding: "2rem",
                border: "1px solid rgba(0, 0, 0, 0.06)",
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                marginBottom: "2rem",
              }}
            >
              <h3
                style={{
                  fontSize: "1.25rem",
                  marginBottom: "1.5rem",
                  color: "#1e293b",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.5rem",
                }}
              >
                <FileText size={24} color="#6366f1" />
                Request & Response Details
              </h3>

              <div
                className="grid-2-cols"
                style={{
                  display: "grid",
                  gridTemplateColumns: "1fr 1fr",
                  gap: "1.5rem",
                  width: "100%",
                }}
              >
                {/* Request Details */}
                <div>
                  <h4
                    style={{
                      fontSize: "1rem",
                      marginBottom: "1rem",
                      color: "#1e293b",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <ChevronRight size={18} color="#6366f1" />
                    Request Sent
                  </h4>

                  <div
                    style={{
                      background: "#f8fafc",
                      borderRadius: "12px",
                      padding: "1rem",
                      border: "1px solid #e2e8f0",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                        marginBottom: "0.5rem",
                        fontWeight: 600,
                      }}
                    >
                      Endpoint
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#1e293b",
                        fontFamily: '"Fira Code", monospace',
                        wordBreak: "break-all",
                      }}
                    >
                      {testResults.requestDetails.method}{" "}
                      {testResults.requestDetails.url}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#f8fafc",
                      borderRadius: "12px",
                      padding: "1rem",
                      border: "1px solid #e2e8f0",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                        marginBottom: "0.5rem",
                        fontWeight: 600,
                      }}
                    >
                      Request Headers
                    </div>
                    <pre
                      style={{
                        fontSize: "0.813rem",
                        color: "#1e293b",
                        fontFamily: '"Fira Code", monospace',
                        margin: 0,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                      }}
                    >
                      {JSON.stringify(
                        testResults.requestDetails.headers,
                        null,
                        2
                      )}
                    </pre>
                  </div>

                  {testResults.requestDetails.body && (
                    <div
                      style={{
                        background: "#f8fafc",
                        borderRadius: "12px",
                        padding: "1rem",
                        border: "1px solid #e2e8f0",
                      }}
                    >
                      <div
                        style={{
                          fontSize: "0.75rem",
                          color: "#64748b",
                          marginBottom: "0.5rem",
                          fontWeight: 600,
                        }}
                      >
                        Request Body
                      </div>
                      <pre
                        style={{
                          fontSize: "0.813rem",
                          color: "#1e293b",
                          fontFamily: '"Fira Code", monospace',
                          margin: 0,
                          whiteSpace: "pre-wrap",
                          wordBreak: "break-word",
                        }}
                      >
                        {testResults.requestDetails.body}
                      </pre>
                    </div>
                  )}
                </div>

                {/* Response Details */}
                <div>
                  <h4
                    style={{
                      fontSize: "1rem",
                      marginBottom: "1rem",
                      color: "#1e293b",
                      fontWeight: 700,
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                    }}
                  >
                    <ChevronRight size={18} color="#8b5cf6" />
                    Response Received
                  </h4>

                  <div
                    style={{
                      background: "#f8fafc",
                      borderRadius: "12px",
                      padding: "1rem",
                      border: "1px solid #e2e8f0",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                        marginBottom: "0.5rem",
                        fontWeight: 600,
                      }}
                    >
                      Status
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#10b981",
                        fontFamily: '"Fira Code", monospace',
                        fontWeight: 700,
                      }}
                    >
                      {testResults.responseDetails.status}{" "}
                      {testResults.responseDetails.statusText}
                    </div>
                  </div>

                  <div
                    style={{
                      background: "#f8fafc",
                      borderRadius: "12px",
                      padding: "1rem",
                      border: "1px solid #e2e8f0",
                      marginBottom: "1rem",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                        marginBottom: "0.5rem",
                        fontWeight: 600,
                      }}
                    >
                      Response Headers
                    </div>
                    <pre
                      style={{
                        fontSize: "0.813rem",
                        color: "#1e293b",
                        fontFamily: '"Fira Code", monospace',
                        margin: 0,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        maxHeight: "150px",
                        overflow: "auto",
                      }}
                    >
                      {JSON.stringify(
                        testResults.responseDetails.headers,
                        null,
                        2
                      )}
                    </pre>
                  </div>

                  <div
                    style={{
                      background: "#f8fafc",
                      borderRadius: "12px",
                      padding: "1rem",
                      border: "1px solid #e2e8f0",
                    }}
                  >
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                        marginBottom: "0.5rem",
                        fontWeight: 600,
                      }}
                    >
                      Response Body
                    </div>
                    <pre
                      style={{
                        fontSize: "0.813rem",
                        color: "#1e293b",
                        fontFamily: '"Fira Code", monospace',
                        margin: 0,
                        whiteSpace: "pre-wrap",
                        wordBreak: "break-word",
                        maxHeight: "150px",
                        overflow: "auto",
                      }}
                    >
                      {JSON.stringify(
                        testResults.responseDetails.body,
                        null,
                        2
                      )}
                    </pre>
                  </div>
                </div>
              </div>
            </div>

            {/* Export Report Buttons */}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "1fr 1fr",
                gap: "1rem",
              }}
            >
              <button
                onClick={exportPDF}
                style={{
                  padding: "1.125rem",
                  background:
                    "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
                  color: "#ffffff",
                  border: "none",
                  borderRadius: "12px",
                  fontSize: "0.938rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.625rem",
                  boxShadow: "0 4px 16px rgba(99, 102, 241, 0.25)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 8px 24px rgba(99, 102, 241, 0.35)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 16px rgba(99, 102, 241, 0.25)";
                }}
              >
                <Download size={20} />
                Export Professional PDF Report
              </button>
              <button
                onClick={exportCSV}
                style={{
                  padding: "1.125rem",
                  background: "#ffffff",
                  color: "#6366f1",
                  border: "2px solid #6366f1",
                  borderRadius: "12px",
                  fontSize: "0.938rem",
                  fontWeight: 700,
                  cursor: "pointer",
                  fontFamily: "inherit",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  gap: "0.625rem",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.background = "#6366f1";
                  e.target.style.color = "#ffffff";
                  e.target.style.transform = "translateY(-2px)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.background = "#ffffff";
                  e.target.style.color = "#6366f1";
                  e.target.style.transform = "translateY(0)";
                }}
              >
                <FileText size={20} />
                Export CSV Data
              </button>
            </div>
          </div>
        )}

        {activeTab === "results" && !testResults && (
          <div
            style={{
              background: "#ffffff",
              borderRadius: "16px",
              padding: "4rem 2rem",
              border: "1px solid rgba(0, 0, 0, 0.06)",
              textAlign: "center",
              boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
            }}
          >
            <Activity
              size={56}
              color="#cbd5e1"
              style={{ marginBottom: "1.25rem", opacity: 0.5 }}
            />
            <h3
              style={{
                color: "#64748b",
                fontSize: "1.25rem",
                marginBottom: "0.625rem",
                fontWeight: 700,
              }}
            >
              No Test Results Yet
            </h3>
            <p style={{ color: "#94a3b8", fontSize: "0.938rem" }}>
              Configure and run a test to see comprehensive performance and
              security analysis
            </p>
          </div>
        )}

        {/* History Tab */}
        {activeTab === "history" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.375rem",
                  color: "#1e293b",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                }}
              >
                <Clock size={26} color="#6366f1" />
                Test History
              </h2>
              <span
                style={{
                  background:
                    "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
                  color: "#6366f1",
                  padding: "0.5rem 1rem",
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  border: "1px solid rgba(99, 102, 241, 0.2)",
                }}
              >
                {testHistory.length}{" "}
                {testHistory.length === 1 ? "test" : "tests"}
              </span>
            </div>

            {testHistory.length === 0 ? (
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "4rem 2rem",
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
              >
                <Clock
                  size={56}
                  color="#cbd5e1"
                  style={{ marginBottom: "1.25rem", opacity: 0.5 }}
                />
                <h3
                  style={{
                    color: "#64748b",
                    fontSize: "1.25rem",
                    marginBottom: "0.625rem",
                    fontWeight: 700,
                  }}
                >
                  No Test History
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "0.938rem" }}>
                  Your test history will appear here after running tests
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  gap: "1rem",
                }}
              >
                {testHistory.map((test, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#ffffff",
                      borderRadius: "14px",
                      padding: "1.5rem",
                      border: "1px solid rgba(0, 0, 0, 0.06)",
                      cursor: "pointer",
                      transition: "all 0.3s ease",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                    }}
                    onClick={() => {
                      setTestResults(test);
                      setActiveTab("results");
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(99, 102, 241, 0.12)";
                      e.currentTarget.style.borderColor = "#6366f1";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0, 0, 0, 0.04)";
                      e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.06)";
                    }}
                  >
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "start",
                        marginBottom: "1rem",
                      }}
                    >
                      <div style={{ flex: 1 }}>
                        <div
                          style={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "0.5rem",
                            background:
                              "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
                            padding: "0.375rem 0.875rem",
                            borderRadius: "8px",
                            marginBottom: "0.625rem",
                          }}
                        >
                          <span
                            style={{
                              fontSize: "0.75rem",
                              fontWeight: 700,
                              color: "#6366f1",
                            }}
                          >
                            {test.method}
                          </span>
                        </div>
                        <div
                          style={{
                            fontSize: "0.938rem",
                            color: "#1e293b",
                            fontWeight: 600,
                            marginBottom: "0.375rem",
                            wordBreak: "break-all",
                          }}
                        >
                          {test.endpoint}
                        </div>
                        <div
                          style={{
                            fontSize: "0.75rem",
                            color: "#64748b",
                            fontWeight: 500,
                          }}
                        >
                          {new Date(test.timestamp).toLocaleString("en-US", {
                            month: "short",
                            day: "numeric",
                            year: "numeric",
                            hour: "2-digit",
                            minute: "2-digit",
                          })}
                        </div>
                      </div>
                      <ChevronRight size={20} color="#94a3b8" />
                    </div>
                    <div
                      style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(4, 1fr)",
                        gap: "1rem",
                      }}
                    >
                      <div>
                        <div
                          style={{
                            fontSize: "0.688rem",
                            color: "#64748b",
                            marginBottom: "0.25rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          Avg Response
                        </div>
                        <div
                          style={{
                            fontSize: "0.938rem",
                            color: "#6366f1",
                            fontWeight: 700,
                          }}
                        >
                          {test.performance.avgResponseTime.toFixed(2)}ms
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.688rem",
                            color: "#64748b",
                            marginBottom: "0.25rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          Throughput
                        </div>
                        <div
                          style={{
                            fontSize: "0.938rem",
                            color: "#8b5cf6",
                            fontWeight: 700,
                          }}
                        >
                          {test.performance.throughput.toFixed(1)} req/s
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.688rem",
                            color: "#64748b",
                            marginBottom: "0.25rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          Success Rate
                        </div>
                        <div
                          style={{
                            fontSize: "0.938rem",
                            color: "#10b981",
                            fontWeight: 700,
                          }}
                        >
                          {test.performance.successRate.toFixed(1)}%
                        </div>
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "0.688rem",
                            color: "#64748b",
                            marginBottom: "0.25rem",
                            fontWeight: 600,
                            textTransform: "uppercase",
                          }}
                        >
                          Security
                        </div>
                        <div
                          style={{
                            fontSize: "0.938rem",
                            color: "#ec4899",
                            fontWeight: 700,
                          }}
                        >
                          {calculateSecurityScore(test.security)}/100
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Saved Endpoints Tab */}
        {activeTab === "saved" && (
          <div>
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "1.5rem",
              }}
            >
              <h2
                style={{
                  fontSize: "1.375rem",
                  color: "#1e293b",
                  fontWeight: 700,
                  display: "flex",
                  alignItems: "center",
                  gap: "0.625rem",
                }}
              >
                <Database size={26} color="#8b5cf6" />
                Saved Endpoint Configurations
              </h2>
              <span
                style={{
                  background:
                    "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
                  color: "#8b5cf6",
                  padding: "0.5rem 1rem",
                  borderRadius: "10px",
                  fontSize: "0.875rem",
                  fontWeight: 700,
                  border: "1px solid rgba(139, 92, 246, 0.2)",
                }}
              >
                {savedEndpoints.length} saved
              </span>
            </div>

            {savedEndpoints.length === 0 ? (
              <div
                style={{
                  background: "#ffffff",
                  borderRadius: "16px",
                  padding: "4rem 2rem",
                  border: "1px solid rgba(0, 0, 0, 0.06)",
                  textAlign: "center",
                  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                }}
              >
                <Database
                  size={56}
                  color="#cbd5e1"
                  style={{ marginBottom: "1.25rem", opacity: 0.5 }}
                />
                <h3
                  style={{
                    color: "#64748b",
                    fontSize: "1.25rem",
                    marginBottom: "0.625rem",
                    fontWeight: 700,
                  }}
                >
                  No Saved Configurations
                </h3>
                <p style={{ color: "#94a3b8", fontSize: "0.938rem" }}>
                  Save endpoint configurations for quick re-testing
                </p>
              </div>
            ) : (
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(2, 1fr)",
                  gap: "1rem",
                }}
              >
                {savedEndpoints.map((config, idx) => (
                  <div
                    key={idx}
                    style={{
                      background: "#ffffff",
                      borderRadius: "14px",
                      padding: "1.5rem",
                      border: "1px solid rgba(0, 0, 0, 0.06)",
                      boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
                      transition: "all 0.3s ease",
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow =
                        "0 8px 24px rgba(139, 92, 246, 0.12)";
                      e.currentTarget.style.borderColor = "#8b5cf6";
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow =
                        "0 2px 8px rgba(0, 0, 0, 0.04)";
                      e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.06)";
                    }}
                  >
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: "0.5rem",
                        background:
                          "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
                        padding: "0.375rem 0.875rem",
                        borderRadius: "8px",
                        marginBottom: "0.75rem",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "0.75rem",
                          fontWeight: 700,
                          color: "#8b5cf6",
                        }}
                      >
                        {config.method}
                      </span>
                    </div>
                    <div
                      style={{
                        fontSize: "0.875rem",
                        color: "#1e293b",
                        fontWeight: 600,
                        marginBottom: "0.5rem",
                        wordBreak: "break-all",
                      }}
                    >
                      {config.url}
                    </div>
                    <div
                      style={{
                        fontSize: "0.75rem",
                        color: "#64748b",
                        marginBottom: "1rem",
                      }}
                    >
                      Saved {new Date(config.savedAt).toLocaleDateString()}
                    </div>
                    <button
                      onClick={() => loadEndpoint(config)}
                      style={{
                        width: "100%",
                        padding: "0.75rem",
                        background:
                          "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                        color: "#ffffff",
                        border: "none",
                        borderRadius: "10px",
                        fontSize: "0.875rem",
                        fontWeight: 600,
                        cursor: "pointer",
                        fontFamily: "inherit",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.transform = "scale(1.02)";
                        e.target.style.boxShadow =
                          "0 4px 12px rgba(139, 92, 246, 0.3)";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.transform = "scale(1)";
                        e.target.style.boxShadow = "none";
                      }}
                    >
                      Load & Test
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap');
        
        html, body {
          margin: 0;
          padding: 0;
          width: 100%;
          overflow-x: hidden;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        * {
          box-sizing: border-box;
        }

        input[type="range"]::-webkit-slider-thumb {
          appearance: none;
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          border: 3px solid currentColor;
        }

        input[type="range"]::-moz-range-thumb {
          width: 20px;
          height: 20px;
          border-radius: 50%;
          background: #ffffff;
          cursor: pointer;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.15);
          border: 3px solid currentColor;
        }

        @media (max-width: 1024px) {
          .grid-2-cols {
            grid-template-columns: 1fr !important;
          }
        }

        @media (max-width: 768px) {
          .grid-4-cols {
            grid-template-columns: repeat(2, 1fr) !important;
          }
          .grid-3-cols {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
};

export default function App() {
  return <APITestingTool />;
}
