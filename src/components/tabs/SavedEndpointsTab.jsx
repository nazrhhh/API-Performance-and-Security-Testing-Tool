import React from "react";
import { Database } from "lucide-react";

const SavedEndpointsTab = ({ savedEndpoints, onLoadEndpoint, onDeleteEndpoint }) => {
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
            background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
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
          <Database size={56} color="#cbd5e1" style={{ marginBottom: "1.25rem", opacity: 0.5 }} />
          <h3 style={{ color: "#64748b", fontSize: "1.25rem", marginBottom: "0.625rem", fontWeight: 700 }}>
            No Saved Configurations
          </h3>
          <p style={{ color: "#94a3b8", fontSize: "0.938rem" }}>
            Save endpoint configurations for quick re-testing
          </p>
        </div>
      ) : (
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "1rem" }}>
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
                e.currentTarget.style.boxShadow = "0 8px 24px rgba(139, 92, 246, 0.12)";
                e.currentTarget.style.borderColor = "#8b5cf6";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = "translateY(0)";
                e.currentTarget.style.boxShadow = "0 2px 8px rgba(0, 0, 0, 0.04)";
                e.currentTarget.style.borderColor = "rgba(0, 0, 0, 0.06)";
              }}
            >
              <div
                style={{
                  display: "inline-flex",
                  background: "linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(236, 72, 153, 0.1) 100%)",
                  padding: "0.375rem 0.875rem",
                  borderRadius: "8px",
                  marginBottom: "0.75rem",
                }}
              >
                <span style={{ fontSize: "0.75rem", fontWeight: 700, color: "#8b5cf6" }}>{config.method}</span>
              </div>
              <div style={{ fontSize: "0.875rem", color: "#1e293b", fontWeight: 600, marginBottom: "0.5rem", wordBreak: "break-all" }}>
                {config.url}
              </div>
              <div style={{ fontSize: "0.75rem", color: "#64748b", marginBottom: "1rem" }}>
                Saved {new Date(config.savedAt).toLocaleDateString()}
              </div>

              <div style={{ display: "flex", gap: "0.5rem" }}>
                <button
                  onClick={() => onLoadEndpoint(config)}
                  style={{
                    flex: 1,
                    padding: "0.75rem",
                    background: "linear-gradient(135deg, #8b5cf6 0%, #ec4899 100%)",
                    color: "#ffffff",
                    border: "none",
                    borderRadius: "10px",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.3s ease",
                  }}
                >
                  Load & Test
                </button>
                <button
                  onClick={() => onDeleteEndpoint(idx)}
                  style={{
                    padding: "0.75rem 1rem",
                    background: "transparent",
                    color: "#ef4444",
                    border: "2px solid #ef4444",
                    borderRadius: "10px",
                    fontSize: "0.875rem",
                    fontWeight: 600,
                    cursor: "pointer",
                    fontFamily: "inherit",
                    transition: "all 0.3s ease",
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SavedEndpointsTab;
