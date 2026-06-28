import React, { useState } from "react";
import { Globe, TrendingUp, Database, PlayCircle } from "lucide-react";

const ConfigureTab = ({
  apiUrl, setApiUrl,
  httpMethod, setHttpMethod,
  headers, setHeaders,
  requestBody, setRequestBody,
  authType, setAuthType,
  authValue, setAuthValue,
  testConfig, setTestConfig,
  isLoading,
  progress,
  onRunTest,
  onSaveEndpoint,
}) => {
  const [headerError, setHeaderError] = useState("");

  return (
    <div
      className="grid-2-cols"
      style={{
        display: "grid",
        gridTemplateColumns: "1fr 1fr",
        gap: "2rem",
        width: "100%",
      }}
    >
      {/* Left — Endpoint Configuration */}
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

        {/* URL */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={labelStyle}>API Endpoint URL *</label>
          <input
            type="text"
            value={apiUrl}
            onChange={(e) => setApiUrl(e.target.value)}
            placeholder="https://api.example.com/endpoint"
            style={inputStyle}
            onFocus={(e) => {
              e.target.style.border = "2px solid #6366f1";
              e.target.style.boxShadow = "0 0 0 3px rgba(99, 102, 241, 0.1)";
            }}
            onBlur={(e) => {
              e.target.style.border = "2px solid #e2e8f0";
              e.target.style.boxShadow = "none";
            }}
          />
        </div>

        {/* HTTP Method */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={labelStyle}>HTTP Method</label>
          <select
            value={httpMethod}
            onChange={(e) => setHttpMethod(e.target.value)}
            style={inputStyle}
          >
            <option value="GET">GET</option>
            <option value="POST">POST</option>
            <option value="PUT">PUT</option>
            <option value="DELETE">DELETE</option>
          </select>
        </div>

        {/* Auth Type */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={labelStyle}>Authentication Type</label>
          <select
            value={authType}
            onChange={(e) => setAuthType(e.target.value)}
            style={inputStyle}
          >
            <option value="none">No Authentication</option>
            <option value="bearer">Bearer Token</option>
            <option value="apikey">API Key</option>
            <option value="basic">Basic Auth</option>
          </select>
        </div>

        {/* Auth Value */}
        {authType !== "none" && (
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>
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
              style={inputStyle}
            />
          </div>
        )}

        {/* Headers */}
        <div style={{ marginBottom: "1.5rem" }}>
          <label style={labelStyle}>Request Headers (JSON format)</label>
          <textarea
            value={headers}
            onChange={(e) => {
              setHeaders(e.target.value);
              try {
                JSON.parse(e.target.value);
                setHeaderError("");
              } catch {
                setHeaderError("Invalid JSON format");
              }
            }}
            placeholder='{"Content-Type": "application/json"}'
            rows={3}
            style={{
              ...inputStyle,
              fontFamily: '"Fira Code", monospace',
              resize: "vertical",
            }}
          />
          {headerError && (
            <p style={{ color: "#ef4444", fontSize: "0.75rem", margin: "0.25rem 0 0 0" }}>
              {headerError}
            </p>
          )}
        </div>

        {/* Request Body */}
        {(httpMethod === "POST" || httpMethod === "PUT") && (
          <div style={{ marginBottom: "1.5rem" }}>
            <label style={labelStyle}>Request Body (JSON)</label>
            <textarea
              value={requestBody}
              onChange={(e) => setRequestBody(e.target.value)}
              placeholder='{"key": "value"}'
              rows={4}
              style={{
                ...inputStyle,
                fontFamily: '"Fira Code", monospace',
                resize: "vertical",
              }}
            />
          </div>
        )}

        {/* Save Button */}
        <button
          onClick={onSaveEndpoint}
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
            e.currentTarget.style.background = "#6366f1";
            e.currentTarget.style.color = "#ffffff";
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = "transparent";
            e.currentTarget.style.color = "#6366f1";
          }}
        >
          <Database size={18} />
          Save Configuration
        </button>
      </div>

      {/* Right — Test Parameters */}
      <div>
        <div
          style={{
            background: "rgba(255, 255, 255, 0.9)",
            borderRadius: "20px",
            padding: "2rem",
            border: "1px solid rgba(139, 92, 246, 0.1)",
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
            <TrendingUp size={22} color="#8b5cf6" />
            Test Parameters
          </h2>

          <SliderField
            label="Total Requests"
            value={testConfig.requestCount}
            min={10}
            max={200}
            color="#6366f1"
            onChange={(v) => setTestConfig({ ...testConfig, requestCount: v })}
          />

          <SliderField
            label="Test Duration"
            value={testConfig.duration}
            min={5}
            max={60}
            color="#8b5cf6"
            unit="s"
            onChange={(v) => setTestConfig({ ...testConfig, duration: v })}
          />

          <SliderField
            label="Concurrent Users"
            value={testConfig.concurrency}
            min={1}
            max={100}
            color="#ec4899"
            onChange={(v) => setTestConfig({ ...testConfig, concurrency: v })}
          />

          {/* Run Button */}
          <button
            onClick={onRunTest}
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
  );
};

const SliderField = ({ label, value, min, max, color, unit = "", onChange }) => (
  <div style={{ marginBottom: "1.5rem" }}>
    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "0.5rem" }}>
      <label style={{ fontSize: "0.813rem", color: "#475569", fontWeight: 600 }}>
        {label}
      </label>
      <span style={{ fontSize: "0.813rem", color, fontWeight: 700 }}>
        {value}{unit}
      </span>
    </div>
    <div style={{ position: "relative" }}>
      <input
        type="range"
        min={min}
        max={max}
        value={value}
        onChange={(e) => onChange(parseInt(e.target.value))}
        style={{
          width: "100%",
          height: "8px",
          borderRadius: "4px",
          outline: "none",
          appearance: "none",
          WebkitAppearance: "none",
          background: `linear-gradient(to right, ${color} 0%, ${color} ${
            ((value - min) / (max - min)) * 100
          }%, #e2e8f0 ${((value - min) / (max - min)) * 100}%, #e2e8f0 100%)`,
          cursor: "pointer",
          accentColor: color,
        }}
      />
    </div>
  </div>
);

const labelStyle = {
  display: "block",
  marginBottom: "0.5rem",
  fontSize: "0.813rem",
  color: "#475569",
  fontWeight: 600,
};

const inputStyle = {
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
  boxSizing: "border-box",
};

export default ConfigureTab;
