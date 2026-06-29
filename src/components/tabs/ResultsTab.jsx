import React from "react";
import {
  LineChart, Line, BarChart, Bar, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from "recharts";
import {
  Activity, Clock, TrendingUp, CheckCircle, Shield,
  AlertTriangle, XCircle, FileText, Download, ChevronRight, BarChart2,
} from "lucide-react";
import { calculateSecurityScore } from "../../utils/calculations";
import { exportCSV, exportPDF } from "../../utils/exportUtils";

const COLORS = ["#6366f1", "#8b5cf6", "#ec4899", "#f59e0b"];

const ResultsTab = ({ testResults }) => {
  if (!testResults) {
    return (
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
        <Activity size={56} color="#cbd5e1" style={{ marginBottom: "1.25rem", opacity: 0.5 }} />
        <h3 style={{ color: "#64748b", fontSize: "1.25rem", marginBottom: "0.625rem", fontWeight: 700 }}>
          No Test Results Yet
        </h3>
        <p style={{ color: "#94a3b8", fontSize: "0.938rem" }}>
          Configure and run a test to see comprehensive performance and security analysis
        </p>
      </div>
    );
  }

  const securityScore = calculateSecurityScore(testResults.security);

  return (
    <div>
      {/* Performance Metric Cards */}
      <div
        className="grid-4-cols"
        style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1.25rem", marginBottom: "2rem" }}
      >
        {[
          { label: "Avg Response Time", value: `${testResults.performance.avgResponseTime.toFixed(2)}ms`, icon: Clock, color: "#6366f1" },
          { label: "Throughput", value: `${testResults.performance.throughput.toFixed(1)} req/s`, icon: TrendingUp, color: "#8b5cf6" },
          { label: "Success Rate", value: `${testResults.performance.successRate.toFixed(1)}%`, icon: CheckCircle, color: "#10b981" },
          { label: "Security Score", value: `${securityScore}/100`, icon: Shield, color: "#ec4899" },
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
                boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.75rem" }}>
                <div
                  style={{
                    width: "40px", height: "40px", borderRadius: "10px",
                    background: metric.color, display: "flex",
                    alignItems: "center", justifyContent: "center",
                  }}
                >
                  <Icon size={20} color="#ffffff" />
                </div>
              </div>
              <div style={{ fontSize: "1.875rem", fontWeight: 700, color: metric.color, marginBottom: "0.25rem" }}>
                {metric.value}
              </div>
              <div style={{ fontSize: "0.813rem", color: "#64748b", fontWeight: 500 }}>{metric.label}</div>
            </div>
          );
        })}
      </div>

      {/* Charts */}
      <div
        className="grid-2-cols"
        style={{ display: "grid", gridTemplateColumns: "2fr 1fr", gap: "1.5rem", marginBottom: "2rem" }}
      >
        {/* Response Time Trend */}
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>
            <Activity size={20} color="#6366f1" /> Response Time Trend
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            <LineChart data={testResults.performanceOverTime}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis dataKey="time" stroke="#64748b" style={{ fontSize: "0.75rem" }} />
              <YAxis stroke="#64748b" style={{ fontSize: "0.75rem" }} />
              <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              <Legend />
              <Line type="monotone" dataKey="responseTime" stroke="#6366f1" strokeWidth={3}
                dot={{ fill: "#6366f1", r: 5 }} activeDot={{ r: 7 }} name="Response Time (ms)" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Distribution Pie */}
        <div style={cardStyle}>
          <h3 style={cardTitleStyle}>
            <BarChart2 size={20} color="#8b5cf6" /> Distribution
          </h3>
          <ResponsiveContainer width="100%" height={280}>
            {testResults.responseTimeDistribution.filter(d => d.count > 0).length === 1 ? (
              <PieChart>
                <Pie
                  data={[{ range: testResults.responseTimeDistribution.find(d => d.count > 0).range, count: 1 }]}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="count"
                  label={({ range }) => `${range}: 100%`}
                  labelLine={false}
                >
                  <Cell fill={COLORS[0]} />
                </Pie>
                <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              </PieChart>
            ) : (
              <PieChart>
                <Pie
                  data={testResults.responseTimeDistribution.filter(d => d.count > 0).slice(0, 4)}
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  dataKey="count"
                  label={({ range, percent }) => `${range}: ${(percent * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {testResults.responseTimeDistribution.filter(d => d.count > 0).slice(0, 4).map((_, index) => (
                    <Cell key={index} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ background: "#ffffff", border: "1px solid #e2e8f0", borderRadius: "8px" }} />
              </PieChart>
            )}
          </ResponsiveContainer>
        </div>
      </div>

      {/* Additional Performance Stats */}
      <div style={{ ...cardStyle, marginBottom: "2rem" }}>
        <h3 style={cardTitleStyle}><TrendingUp size={20} color="#6366f1" /> Detailed Performance Metrics</h3>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
          {[
            { label: "Min Response Time", value: `${testResults.performance.minResponseTime.toFixed(2)}ms` },
            { label: "Max Response Time", value: `${testResults.performance.maxResponseTime.toFixed(2)}ms` },
            { label: "95th Percentile", value: `${testResults.performance.p95ResponseTime.toFixed(2)}ms` },
            { label: "Error Rate", value: `${testResults.performance.errorRate.toFixed(1)}%` },
            { label: "Total Requests", value: testResults.performance.totalRequests },
            { label: "Successful", value: testResults.performance.successfulRequests },
            { label: "Failed", value: testResults.performance.failedRequests },
            { label: "Status Code", value: testResults.responseDetails.status || "N/A" },
          ].map((m, i) => (
            <div key={i} style={{ background: "#f8fafc", borderRadius: "10px", padding: "1rem", border: "1px solid #e2e8f0" }}>
              <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.25rem", fontWeight: 600 }}>{m.label}</div>
              <div style={{ fontSize: "1rem", color: "#1e293b", fontWeight: 700 }}>{m.value}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Security Analysis */}
      <div style={{ ...cardStyle, marginBottom: "2rem" }}>
        <h3 style={{ ...cardTitleStyle, fontSize: "1.25rem" }}>
          <Shield size={24} color="#ec4899" /> Security Analysis
        </h3>

        {/* Score Badge */}
        <div
          style={{
            display: "inline-flex", alignItems: "center", gap: "0.75rem",
            background: securityScore >= 70
              ? "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)"
              : "linear-gradient(135deg, rgba(239, 68, 68, 0.1) 0%, rgba(239, 68, 68, 0.05) 100%)",
            padding: "0.875rem 1.5rem",
            borderRadius: "12px",
            marginBottom: "1.5rem",
            border: `2px solid ${securityScore >= 70 ? "#10b981" : "#ef4444"}`,
          }}
        >
          <Shield size={28} color={securityScore >= 70 ? "#10b981" : "#ef4444"} />
          <div>
            <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 600 }}>Overall Security Score</div>
            <div style={{ fontSize: "1.5rem", fontWeight: 700, color: securityScore >= 70 ? "#10b981" : "#ef4444" }}>
              {securityScore}/100
            </div>
          </div>
        </div>

        {/* Security Checks Grid */}
        <div
          className="grid-3-cols"
          style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "1rem", marginBottom: "2rem" }}
        >
          {[
            { label: "HTTPS Enabled", value: testResults.security.httpsEnabled, category: "Transport" },
            { label: "Valid Certificate", value: testResults.security.certificateValid, category: "Certificate" },
            { label: "Authentication", value: testResults.security.authenticationPresent, category: "Access Control" },
            { label: "Rate Limiting", value: testResults.security.rateLimitingDetected, category: "Protection" },
            { label: "Strict-Transport-Security", value: testResults.security.securityHeaders.strictTransportSecurity, category: "Header" },
            { label: "Content-Security-Policy", value: testResults.security.securityHeaders.contentSecurityPolicy, category: "Header" },
            { label: "X-Frame-Options", value: testResults.security.securityHeaders.xFrameOptions, category: "Header" },
            { label: "X-Content-Type-Options", value: testResults.security.securityHeaders.xContentTypeOptions, category: "Header" },
          ].map((check, idx) => (
            <div
              key={idx}
              style={{
                background: check.value ? "rgba(16, 185, 129, 0.05)" : "rgba(239, 68, 68, 0.05)",
                padding: "1rem", borderRadius: "12px",
                border: `2px solid ${check.value ? "#10b981" : "#ef4444"}`,
                display: "flex", alignItems: "center", justifyContent: "space-between",
              }}
            >
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: "0.688rem", color: "#64748b", marginBottom: "0.25rem", fontWeight: 600, textTransform: "uppercase" }}>
                  {check.category}
                </div>
                <div style={{ fontSize: "0.813rem", color: "#1e293b", fontWeight: 600 }}>{check.label}</div>
              </div>
              {check.value
                ? <CheckCircle size={22} color="#10b981" />
                : <XCircle size={22} color="#ef4444" />
              }
            </div>
          ))}
        </div>

        {/* Vulnerabilities */}
        {testResults.security.vulnerabilities.length > 0 ? (
          <div>
            <h4 style={{ fontSize: "1.063rem", marginBottom: "1rem", color: "#1e293b", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <AlertTriangle size={20} color="#f59e0b" /> Detected Vulnerabilities
            </h4>
            <div style={{ display: "flex", flexDirection: "column", gap: "0.875rem" }}>
              {testResults.security.vulnerabilities.map((vuln, idx) => (
                <div
                  key={idx}
                  style={{
                    background: vuln.severity === "HIGH" ? "rgba(239, 68, 68, 0.05)" : vuln.severity === "MEDIUM" ? "rgba(245, 158, 11, 0.05)" : "rgba(59, 130, 246, 0.05)",
                    padding: "1.25rem", borderRadius: "12px",
                    border: `2px solid ${vuln.severity === "HIGH" ? "#ef4444" : vuln.severity === "MEDIUM" ? "#f59e0b" : "#3b82f6"}`,
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "0.625rem" }}>
                    <strong style={{ color: "#1e293b", fontSize: "0.938rem", fontWeight: 700 }}>{vuln.type}</strong>
                    <span
                      style={{
                        background: vuln.severity === "HIGH" ? "#ef4444" : vuln.severity === "MEDIUM" ? "#f59e0b" : "#3b82f6",
                        color: "#ffffff", padding: "0.375rem 0.875rem",
                        borderRadius: "8px", fontSize: "0.75rem", fontWeight: 700,
                      }}
                    >
                      {vuln.severity}
                    </span>
                  </div>
                  <p style={{ margin: 0, color: "#475569", fontSize: "0.875rem", lineHeight: 1.6 }}>{vuln.description}</p>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ background: "linear-gradient(135deg, rgba(16, 185, 129, 0.1) 0%, rgba(16, 185, 129, 0.05) 100%)", padding: "1.5rem", borderRadius: "12px", border: "2px solid #10b981", textAlign: "center" }}>
            <CheckCircle size={48} color="#10b981" style={{ marginBottom: "0.75rem" }} />
            <h4 style={{ fontSize: "1.063rem", color: "#1e293b", fontWeight: 700, marginBottom: "0.5rem" }}>No Critical Vulnerabilities Detected</h4>
            <p style={{ fontSize: "0.875rem", color: "#475569", margin: 0 }}>API passed all security validation checks</p>
          </div>
        )}
      </div>

      {/* Request / Response Details */}
      <div style={{ ...cardStyle, marginBottom: "2rem" }}>
        <h3 style={{ ...cardTitleStyle, fontSize: "1.25rem" }}>
          <FileText size={24} color="#6366f1" /> Request & Response Details
        </h3>
        <div className="grid-2-cols" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1.5rem" }}>
          <div>
            <h4 style={{ fontSize: "1rem", marginBottom: "1rem", color: "#1e293b", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ChevronRight size={18} color="#6366f1" /> Request Sent
            </h4>
            <CodeBlock label="Endpoint" value={`${testResults.requestDetails.method} ${testResults.requestDetails.url}`} />
            <CodeBlock label="Request Headers" value={JSON.stringify(testResults.requestDetails.headers, null, 2)} />
            {testResults.requestDetails.body && (
              <CodeBlock label="Request Body" value={testResults.requestDetails.body} />
            )}
          </div>
          <div>
            <h4 style={{ fontSize: "1rem", marginBottom: "1rem", color: "#1e293b", fontWeight: 700, display: "flex", alignItems: "center", gap: "0.5rem" }}>
              <ChevronRight size={18} color="#8b5cf6" /> Response Received
            </h4>
            <CodeBlock label="Status" value={`${testResults.responseDetails.status} ${testResults.responseDetails.statusText}`} color="#10b981" />
            <CodeBlock label="Response Headers" value={JSON.stringify(testResults.responseDetails.headers, null, 2)} maxHeight="150px" />
            <CodeBlock label="Response Body" value={JSON.stringify(testResults.responseDetails.body, null, 2)} maxHeight="150px" />
          </div>
        </div>
      </div>

      {/* Export Buttons */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
        <button
          onClick={() => exportPDF(testResults, securityScore)}
          style={{
            padding: "1.125rem",
            background: "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)",
            color: "#ffffff", border: "none", borderRadius: "12px",
            fontSize: "0.938rem", fontWeight: 700, cursor: "pointer",
            fontFamily: "inherit", display: "flex", alignItems: "center",
            justifyContent: "center", gap: "0.625rem",
            boxShadow: "0 4px 16px rgba(99, 102, 241, 0.25)",
          }}
        >
          <Download size={20} /> Export PDF Report
        </button>
        <button
          onClick={() => exportCSV(testResults, securityScore)}
          style={{
            padding: "1.125rem",
            background: "#ffffff", color: "#6366f1",
            border: "2px solid #6366f1", borderRadius: "12px",
            fontSize: "0.938rem", fontWeight: 700, cursor: "pointer",
            fontFamily: "inherit", display: "flex", alignItems: "center",
            justifyContent: "center", gap: "0.625rem",
          }}
        >
          <FileText size={20} /> Export CSV Data
        </button>
      </div>
    </div>
  );
};

const CodeBlock = ({ label, value, color = "#1e293b", maxHeight }) => (
  <div style={{ background: "#f8fafc", borderRadius: "12px", padding: "1rem", border: "1px solid #e2e8f0", marginBottom: "1rem" }}>
    <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "0.5rem", fontWeight: 600 }}>{label}</div>
    <pre style={{ fontSize: "0.813rem", color, fontFamily: '"Fira Code", monospace', margin: 0, whiteSpace: "pre-wrap", wordBreak: "break-word", maxHeight, overflow: maxHeight ? "auto" : "visible" }}>
      {value}
    </pre>
  </div>
);

const cardStyle = {
  background: "#ffffff",
  borderRadius: "16px",
  padding: "1.75rem",
  border: "1px solid rgba(0, 0, 0, 0.06)",
  boxShadow: "0 2px 8px rgba(0, 0, 0, 0.04)",
};

const cardTitleStyle = {
  fontSize: "1.063rem",
  marginBottom: "1.25rem",
  color: "#1e293b",
  fontWeight: 700,
  display: "flex",
  alignItems: "center",
  gap: "0.5rem",
};

export default ResultsTab;
