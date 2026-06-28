import React from "react";
import { Clock, ChevronRight } from "lucide-react";
import { calculateSecurityScore } from "../../utils/calculations";

const HistoryTab = ({ testHistory, setTestHistory, setTestResults, setActiveTab }) => {
  return (
    <div>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: "1.5rem",
        }}
      >
        {/* Left — Title */}
        <h2
          style={{
            fontSize: "1.375rem",
            color: "#1e293b",
            fontWeight: 700,
            display: "flex",
            alignItems: "center",
            gap: "0.625rem",
            margin: 0,
          }}
        >
          <Clock size={26} color="#6366f1" />
          Test History
        </h2>

        {/* Right — Count + Clear button */}
        <div style={{ display: "flex", alignItems: "center", gap: "0.75rem" }}>
          <span
            style={{
              background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
              color: "#6366f1",
              padding: "0.5rem 1rem",
              borderRadius: "10px",
              fontSize: "0.875rem",
              fontWeight: 700,
              border: "1px solid rgba(99, 102, 241, 0.2)",
            }}
          >
            {testHistory.length} {testHistory.length === 1 ? "test" : "tests"}
          </span>
          {testHistory.length > 0 && (
            <button
              onClick={() => {
                if (window.confirm("Clear all test history?")) {
                  setTestHistory([]);
                  setTestResults(null);
                }
              }}
              style={{
                padding: "0.5rem 1rem",
                background: "transparent",
                color: "#ef4444",
                border: "2px solid #ef4444",
                borderRadius: "10px",
                fontSize: "0.875rem",
                fontWeight: 600,
                cursor: "pointer",
                fontFamily: "inherit",
              }}
            >
              Clear History
            </button>
          )}
        </div>
      </div>

      {testHistory.length === 0 ? (
        <EmptyState
          icon={<Clock size={56} color="#cbd5e1" style={{ opacity: 0.5 }} />}
          title="No Test History"
          message="Your test history will appear here after running tests"
        />
      ) : (
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
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
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(99, 102, 241, 0.12)";
                e.currentTarget.style.borderColor = "#6366f1";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.06)";
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "start", marginBottom: "1rem" }}>
                <div style={{ flex: 1 }}>
                  <div
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      background: "linear-gradient(135deg, rgba(99, 102, 241, 0.1) 0%, rgba(139, 92, 246, 0.1) 100%)",
                      padding: "0.375rem 0.875rem",
                      borderRadius: "8px",
                      marginBottom: "0.625rem",
                    }}
                  >
                    <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#6366f1" }}>
                      {test.method}
                    </span>
                  </div>
                  <div style={{ fontSize: "0.938rem", color: "#1e293b", fontWeight: 600, marginBottom: "0.375rem", wordBreak: "break-all" }}>
                    {test.endpoint}
                  </div>
                  <div style={{ fontSize: "0.75rem", color: "#64748b", fontWeight: 500 }}>
                    {new Date(test.timestamp).toLocaleString("en-US", {
                      month: "short", day: "numeric", year: "numeric",
                      hour: "2-digit", minute: "2-digit",
                    })}
                  </div>
                </div>
                <ChevronRight size={20} color="#94a3b8" />
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "1rem" }}>
                {[
                  { label: "Avg Response", value: `${test.performance.avgResponseTime.toFixed(2)}ms`, color: "#6366f1" },
                  { label: "Throughput", value: `${test.performance.throughput.toFixed(1)} req/s`, color: "#8b5cf6" },
                  { label: "Success Rate", value: `${test.performance.successRate.toFixed(1)}%`, color: "#10b981" },
                  { label: "Security", value: `${calculateSecurityScore(test.security)}/100`, color: "#ec4899" },
                ].map((m, i) => (
                  <div key={i}>
                    <div style={{ fontSize: "0.688rem", color: "#64748b", marginBottom: "0.25rem", fontWeight: 600, textTransform: "uppercase" }}>
                      {m.label}
                    </div>
                    <div style={{ fontSize: "0.938rem", color: m.color, fontWeight: 700 }}>
                      {m.value}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

const EmptyState = ({ icon, title, message }) => (
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
    <div style={{ marginBottom: "1.25rem" }}>{icon}</div>
    <h3 style={{ color: "#64748b", fontSize: "1.25rem", marginBottom: "0.625rem", fontWeight: 700 }}>
      {title}
    </h3>
    <p style={{ color: "#94a3b8", fontSize: "0.938rem" }}>{message}</p>
  </div>
);

export default HistoryTab;
