# API Performance and Security Testing Tool

A web-based tool for evaluating RESTful API performance and security metrics, developed as a Final Year Project at Multimedia University (MMU).

**Project ID:** FYP02-SE-T2610-0302  
**Student:** Haizatul Nazirah Nizam Binti Hairunizam (1231303504)  
**Supervisor:** Dr. Shahid Kamal  
**Programme:** Bachelor of Computer Science (Hons.) in Software Engineering   

---

## About

This tool addresses the fragmented state of current API testing workflows, where developers must use multiple specialised platforms and manually correlate results from separate performance and security assessments. It integrates both testing dimensions within a single browser-based interface, enabling comprehensive API evaluation in under 10 minutes per endpoint.

---

## Features

- **Real HTTP Request Execution** — supports GET, POST, PUT, and DELETE methods via the browser fetch() API
- **Performance Measurement** — measures average, min, max, and 95th percentile response time, throughput, success rate, and error rate
- **Concurrent Request Simulation** — simulates load testing using Promise.all() for parallel request batches
- **OWASP Security Validation** — automated checks for HTTPS enforcement, authentication header presence, sensitive data exposure in response body, rate limiting, and missing security headers (HSTS, CSP, X-Frame-Options, X-Content-Type-Options)
- **Interactive Dashboard** — response time trend line chart and distribution bar chart powered by Recharts
- **CSV Export** — exports full test results as a downloadable .csv file
- **PDF Export** — generates a downloadable PDF report using jsPDF
- **Test History** — persists the last 10 test runs in browser localStorage, survives page refresh
- **Saved Endpoints** — saves endpoint configurations for quick re-testing
- **Header Validation** — validates JSON format of request headers with inline error feedback
- **Form Auto-Reset** — clears the configuration form after each test execution

---

## Project Structure

```
src/
├── App.js                            # Main app — state management and tab routing
├── index.js                          # React entry point
├── components/
│   ├── Header.jsx                    # App header with project info
│   ├── Navigation.jsx                # Tab navigation bar
│   └── tabs/
│       ├── ConfigureTab.jsx          # Endpoint configuration and test parameters
│       ├── ResultsTab.jsx            # Performance metrics, charts, security analysis, export
│       ├── HistoryTab.jsx            # Previous test results with clear history
│       └── SavedEndpointsTab.jsx     # Saved endpoint configurations
└── utils/
    ├── testRunner.js                 # Core HTTP request execution and performance measurement
    ├── securityChecks.js             # OWASP-based security validation logic
    ├── calculations.js               # Security score and chart data calculations
    └── exportUtils.js                # CSV and PDF export functions
```

---

## Getting Started

### Prerequisites

- Node.js v16 or above
- npm

### Installation

**1. Clone the repository:**
```bash
git clone https://github.com/nazrhhh/API-Performance-and-Security-Testing-Tool.git
```

**2. Navigate into the project folder:**
```bash
cd API-Performance-and-Security-Testing-Tool
```

**3. Install dependencies:**
```bash
npm install --legacy-peer-deps
```

> The `--legacy-peer-deps` flag is required due to a TypeScript version conflict between `react-scripts@5.0.1` and `typescript@5.7.2`. This is a build toolchain issue and does not affect the runtime behaviour of the application.

**4. Start the development server:**
```bash
npm start
```

**5. Open your browser:**
```
http://localhost:3000
```

---

## Usage

### Running a Test

1. Go to the **Configure Test** tab
2. Enter an API endpoint URL
3. Select HTTP method — GET, POST, PUT, or DELETE
4. Set authentication type if required — Bearer Token, API Key, or Basic Auth
5. Add request headers in JSON format if needed
6. For POST and PUT, add a request body in JSON format
7. Adjust test parameters:
   - **Total Requests** — number of requests to send (10–200)
   - **Test Duration** — target duration in seconds (5–60)
   - **Concurrent Users** — number of parallel requests per batch (1–100)
8. Click **Execute Performance & Security Test**
9. Results appear automatically in the **Test Results** tab

### Sample Public APIs for Testing

| Description | Method | URL |
|---|---|---|
| Get a post | GET | `https://jsonplaceholder.typicode.com/posts/1` |
| Create a post | POST | `https://jsonplaceholder.typicode.com/posts` |
| Update a post | PUT | `https://jsonplaceholder.typicode.com/posts/1` |
| Delete a post | DELETE | `https://jsonplaceholder.typicode.com/posts/1` |
| Echo request headers | GET | `https://httpbin.org/get` |
| Test 404 error rate | GET | `https://httpbin.org/status/404` |
| Test HTTP (insecure) | GET | `http://httpbin.org/get` |

### Saving and Reusing Endpoints

1. Configure an endpoint in the **Configure Test** tab
2. Click **Save Configuration** before running the test
3. Go to the **Saved Endpoints** tab to view saved configurations
4. Click **Load & Test** to reload a saved configuration into the form

### Exporting Results

- Click **Export CSV Data** to download a `.csv` file of all test metrics
- Click **Export PDF Report** to download a formatted `.pdf` report

---

## Security Checks

| Check | Severity | What It Detects |
|---|---|---|
| HTTPS Enforcement | HIGH | API using HTTP instead of HTTPS |
| Sensitive Data Exposure | HIGH | Passwords, tokens, API keys in response body |
| Authentication Header | MEDIUM | Missing Authorization or X-API-Key header |
| Rate Limiting | MEDIUM | No rate limit headers in response |
| Strict-Transport-Security | LOW | Missing HSTS header |
| Content-Security-Policy | LOW | Missing CSP header |
| X-Frame-Options | LOW | Missing clickjacking protection header |
| X-Content-Type-Options | LOW | Missing MIME sniffing protection header |

---

## Dependencies

| Package | Version | Purpose |
|---|---|---|
| react | ^19.0.0 | UI framework |
| react-dom | ^19.0.0 | DOM rendering |
| react-scripts | ^5.0.0 | Build toolchain |
| recharts | 3.7.0 | Performance charts |
| lucide-react | 0.563.0 | Icons |
| jspdf | ^4.2.1 | PDF report generation |
| ajv | ^8.20.0 | JSON schema validation |

---

## Known Limitations

- **CORS Restrictions** — browser security policies may block testing of APIs that do not permit cross-origin requests. Use public APIs or APIs with CORS enabled for testing.
- **Single-threaded Concurrency** — JavaScript's single-threaded model means concurrent requests are interleaved rather than truly parallel, limiting load testing accuracy at high concurrency.
- **localStorage Capacity** — history is capped at 10 entries with approximately 5–10 MB browser storage limit. Data is stored per browser and per device only.
- **PDF Export** — PDF generation is handled client-side using jsPDF. Complex layouts may differ from browser-rendered views.
- **Prototype Scope** — this tool is designed as a browser-based prototype and is not intended for enterprise-grade distributed load testing.

---

## License

This project was developed for academic purposes as part of CPT6324 Final Year Project II at Multimedia University (MMU).  
© 2026 Haizatul Nazirah Nizam Binti Hairunizam. All rights reserved.