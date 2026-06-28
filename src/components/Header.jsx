import React from "react";
import { Activity } from "lucide-react";

const Header = () => {
  return (
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
              }}
            >
              API Performance and Security Testing Tool
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
          <div style={{ fontWeight: 600 }}>FYP01-SE-T2610-0302</div>
          <div>Haizatul Nazirah Nizam</div>
          <div>1231303504</div>
        </div>
      </div>
    </header>
  );
};

export default Header;
