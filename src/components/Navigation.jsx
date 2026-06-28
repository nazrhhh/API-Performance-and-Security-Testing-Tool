import React from "react";
import { Settings, BarChart2, Clock, Database } from "lucide-react";

const tabs = [
  { id: "configure", label: "Configure Test", icon: Settings },
  { id: "results", label: "Test Results", icon: BarChart2 },
  { id: "history", label: "History", icon: Clock },
  { id: "saved", label: "Saved Endpoints", icon: Database },
];

const Navigation = ({ activeTab, setActiveTab }) => {
  return (
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
      {tabs.map((tab) => {
        const Icon = tab.icon;
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            style={{
              flex: "1 1 auto",
              minWidth: "140px",
              background: isActive
                ? "linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%)"
                : "transparent",
              color: isActive ? "#ffffff" : "#64748b",
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
              boxShadow: isActive
                ? "0 4px 12px rgba(99, 102, 241, 0.3)"
                : "none",
              whiteSpace: "nowrap",
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "rgba(99, 102, 241, 0.08)";
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = "transparent";
              }
            }}
          >
            <Icon size={18} />
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default Navigation;
