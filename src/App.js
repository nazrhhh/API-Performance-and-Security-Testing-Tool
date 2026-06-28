import React, { useState, useEffect } from "react";
import Header from "./components/Header";
import Navigation from "./components/Navigation";
import ConfigureTab from "./components/tabs/ConfigureTab";
import ResultsTab from "./components/tabs/ResultsTab";
import HistoryTab from "./components/tabs/HistoryTab";
import SavedEndpointsTab from "./components/tabs/SavedEndpointsTab";
import { runTest } from "./utils/testRunner";

const App = () => {
  // Tab state
  const [activeTab, setActiveTab] = useState("configure");

  // Configure form state
  const [apiUrl, setApiUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [httpMethod, setHttpMethod] = useState("GET");
  const [headers, setHeaders] = useState('{"Content-Type": "application/json"}');
  const [requestBody, setRequestBody] = useState("");
  const [authType, setAuthType] = useState("none");
  const [authValue, setAuthValue] = useState("");
  const [testConfig, setTestConfig] = useState({ requestCount: 10, duration: 10, concurrency: 3 });

  // Results state
  const [testResults, setTestResults] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Persistent state — load from localStorage on mount
  const [testHistory, setTestHistory] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fyp_history")) || []; } catch { return []; }
  });
  const [savedEndpoints, setSavedEndpoints] = useState(() => {
    try { return JSON.parse(localStorage.getItem("fyp_endpoints")) || []; } catch { return []; }
  });

  // Save to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem("fyp_history", JSON.stringify(testHistory));
  }, [testHistory]);

  useEffect(() => {
    localStorage.setItem("fyp_endpoints", JSON.stringify(savedEndpoints));
  }, [savedEndpoints]);

  // Run test handler
  const [progress, setProgress] = useState(0);

  const handleRunTest = async () => {
    setIsLoading(true);
    try {
      const results = await runTest(
        apiUrl, httpMethod, headers, requestBody,
        authType, authValue, testConfig,
        (count) => setProgress(count)
      );
      setTestResults(results);
      setTestHistory((prev) => [results, ...prev.slice(0, 9)]);
      setActiveTab("results");

      setApiUrl("");
      setHttpMethod("GET");
      setHeaders('{"Content-Type": "application/json"}');
      setRequestBody("");
      setAuthType("none");
      setAuthValue("");
      setTestConfig({ requestCount: 10, duration: 10, concurrency: 3 });
      setProgress(0);

    } catch (err) {
      alert(err.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Save endpoint handler
  const handleSaveEndpoint = () => {
    const config = {
      id: Date.now(),
      url: apiUrl,
      method: httpMethod,
      headers,
      authType,
      authValue,
      savedAt: new Date().toISOString(),
    };
    setSavedEndpoints((prev) => [config, ...prev]);
    alert("Endpoint configuration saved!");
  };

  // Load endpoint handler
  const handleLoadEndpoint = (config) => {
    setApiUrl(config.url);
    setHttpMethod(config.method);
    setHeaders(config.headers);
    setAuthType(config.authType);
    setAuthValue(config.authValue);
    setActiveTab("configure");
  };

  // Delete endpoint handler
  const handleDeleteEndpoint = (idx) => {
    setSavedEndpoints((prev) => prev.filter((_, i) => i !== idx));
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #f0f4f8 0%, #e6f2ff 50%, #f5f0ff 100%)",
        fontFamily: '"Inter", -apple-system, BlinkMacSystemFont, sans-serif',
        color: "#1e293b",
        width: "100%",
      }}
    >
      <Header />

      <div
        style={{
          maxWidth: "1400px",
          margin: "0 auto",
          padding: "2rem clamp(1rem, 4vw, 2rem)",
          width: "100%",
        }}
      >
        <Navigation activeTab={activeTab} setActiveTab={setActiveTab} />

        {activeTab === "configure" && (
          <ConfigureTab
            apiUrl={apiUrl} setApiUrl={setApiUrl}
            httpMethod={httpMethod} setHttpMethod={setHttpMethod}
            headers={headers} setHeaders={setHeaders}
            requestBody={requestBody} setRequestBody={setRequestBody}
            authType={authType} setAuthType={setAuthType}
            authValue={authValue} setAuthValue={setAuthValue}
            testConfig={testConfig} setTestConfig={setTestConfig}
            isLoading={isLoading}
            onRunTest={handleRunTest}
            onSaveEndpoint={handleSaveEndpoint}
          />
        )}

        {activeTab === "results" && (
          <ResultsTab testResults={testResults} />
        )}

        {activeTab === "history" && (
          <HistoryTab
            testHistory={testHistory}
            setTestHistory={setTestHistory}
            setTestResults={setTestResults}
            setActiveTab={setActiveTab}
          />
        )}

        {activeTab === "saved" && (
          <SavedEndpointsTab
            savedEndpoints={savedEndpoints}
            onLoadEndpoint={handleLoadEndpoint}
            onDeleteEndpoint={handleDeleteEndpoint}
          />
        )}
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Fira+Code:wght@400;500&display=swap');
        html, body { margin: 0; padding: 0; width: 100%; overflow-x: hidden; }
        * { box-sizing: border-box; }
        @keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }
        input[type="range"]::-webkit-slider-thumb { appearance: none; width: 20px; height: 20px; border-radius: 50%; background: #ffffff; cursor: pointer; box-shadow: 0 2px 8px rgba(0,0,0,0.15); border: 3px solid currentColor; }
        @media (max-width: 1024px) { .grid-2-cols { grid-template-columns: 1fr !important; } }
        @media (max-width: 768px) { .grid-4-cols { grid-template-columns: repeat(2, 1fr) !important; } .grid-3-cols { grid-template-columns: 1fr !important; } }
      `}</style>
    </div>
  );
};

export default App;
