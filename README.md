# JobShield AI — AI-Powered Fake Job & Internship Scam Detector

> **B.Tech Computer Science & Engineering (CSE) Capstone / Mini Project**  
> An explainable AI and heuristic security analysis platform designed to protect students and job seekers from predatory recruitment fraud, fake placement drives, registration-fee scams, and brand impersonation.

---

## 🛡️ Project Overview

Every year, thousands of college students encounter fraudulent job postings, fake campus recruitment drives, and deceptive internship offers. Scammers exploit students' anxiety by demanding "refundable registration fees", issuing counterfeit appointment letters with free email addresses (e.g. `@gmail.com` claiming to be Google HR), or trapping them in Telegram task scams.

**JobShield AI** provides a cybersecurity shield:
- **Comprehensive Threat Scanning:** Evaluates pasted recruitment messages, emails, and offer letters across 15+ threat vectors.
- **Calibrated Heuristic Risk Score (0–100):** Provides an explainable risk metric categorized into **Low**, **Moderate**, **High**, and **Critical**.
- **Exact Evidence Slicing:** Extracts exact quoted text snippets and explains why each indicator represents a threat.
- **Corporate Whitelist & Spoofing Detection:** Compares claimed companies against verified corporate registries to detect lookalike domains.
- **Candidate Verification Checklist:** Guides students through practical verification actions (MCA registry lookup, LinkedIn verification, zero-fee validation).
- **Official Reporting Links:** Direct integrations with the **National Cyber Crime Reporting Portal (1930 / cybercrime.gov.in)**, Ministry of Corporate Affairs, and National Career Service.
- **Dual-Mode Persistence:** Seamlessly connects to MongoDB Atlas using Mongoose, while offering an automatic local file-persisted fallback for offline viva presentations.

---

## 💻 Tech Stack

### Frontend
- **Framework:** React.js (ES6+ JavaScript)
- **Tooling & Bundler:** Vite
- **Routing:** React Router v6
- **HTTP Client:** Axios
- **Visualizations:** Recharts (SVG Pie & Bar Charts)
- **Icons:** Lucide React
- **Design System:** Custom Dark Cyber SaaS Theme (Dark navy backgrounds `#080d1a`, electric blue `#38bdf8`, and cyber violet `#8b5cf6`)

### Backend
- **Runtime:** Node.js (v18+) using ES Modules (`type: "module"`)
- **Server Framework:** Express.js REST API
- **Security Middlewares:** Helmet (Security Headers), CORS Policy Engine, Express-Rate-Limit
- **Database ODM:** Mongoose with compound indexes and timestamps
- **Validation:** Custom request sanitization and schema validators
- **AI Integration Adapter:** Dual-Tier Architecture supporting Google Gemini 1.5 Flash, OpenAI API, and an autonomous deterministic Heuristic Rule Engine.

---

## 📁 Project Structure

```
JobShield-AI/
|-- backend/
|   |-- src/
|   |   |-- config/          # Environment variables & DB connection
|   |   |-- controllers/     # Analysis, company verification & health controllers
|   |   |-- middleware/      # Helmet, CORS, Rate Limiters, Error handlers
|   |   |-- models/          # Mongoose Analysis schema and indexes
|   |   |-- routes/          # REST API route definitions
|   |   |-- services/        # Rule engine, AI adapter, Company verifier, Storage service
|   |   |-- utils/           # Preset sample cases & helpers
|   |   |-- validators/      # Input validation logic
|   |   |-- app.js           # Express app assembly
|   |   |-- server.js        # Server bootstrap & graceful shutdown
|   |-- tests/               # 18 automated unit and integration tests
|   |-- .env.example         # Environment template
|   |-- package.json
|
|-- frontend/
|   |-- public/              # Static assets & favicon
|   |-- src/
|   |   |-- assets/          # SVG graphics
|   |   |-- components/      # Navbar, Footer, RiskGauge, IndicatorCard, Checklist
|   |   |-- pages/           # Landing, Dashboard, Analyze, Results, History, About
|   |   |-- services/        # Axios API client
|   |   |-- utils/           # 6 one-click test scenarios
|   |   |-- App.jsx          # Route configuration
|   |   |-- main.jsx         # React DOM mount
|   |   |-- index.css        # Cyber Dark Design System
|   |-- .env.example
|   |-- package.json
|   |-- vite.config.js
|
|-- docs/
|   |-- PROJECT_OVERVIEW.md  # Abstract, architecture & heuristic scoring formula
|   |-- API_DOCUMENTATION.md # REST endpoints specification
|   |-- DATABASE_SCHEMA.md   # Mongoose model & indexing documentation
|   |-- TESTING_GUIDE.md     # Test execution & QA guide
|   |-- VIVA_QUESTIONS.md    # 25+ technical Q&A for college defense
|
|-- .gitignore
|-- README.md
```

---

## 🚀 Step-by-Step Installation & Run Guide

### 1. Prerequisites
- **Node.js:** v18.0.0 or higher (`node -v`)
- **npm:** v9.0.0 or higher (`npm -v`)
- **MongoDB (Optional):** MongoDB Atlas connection string or local MongoDB instance. If not configured, the backend automatically runs in **Local Persistence Mode** with zero manual setup required.

### 2. Setup the Backend
Open a terminal in the `backend/` directory:
```bash
cd backend
npm install
```

Configure your environment variables:
```bash
# Copy template to active .env
cp .env.example .env
```
*(Optional)* Add your `MONGODB_URI` or `AI_API_KEY` (Gemini or OpenAI) in `backend/.env`. If left blank, the app will run with the deterministic heuristic rule engine and local persistence store.

Start the backend server:
```bash
npm start
```
The backend will launch on `http://localhost:5000`. You can verify health at `http://localhost:5000/api/health`.

### 3. Setup the Frontend
Open a new terminal in the `frontend/` directory:
```bash
cd frontend
npm install
npm run dev
```
The frontend will start on `http://localhost:5173`. Open your browser and navigate to `http://localhost:5173`.

---

## 🧪 Running Automated Tests

JobShield AI includes 18 native unit and integration tests covering the threat detection engine, company verifier, and REST API routes:

```bash
cd backend
npm test
```

Expected output:
```
✔ JobShield AI - Backend REST API Integration Tests (10 tests passing)
✔ JobShield AI - Company Verification Service Tests (4 tests passing)
✔ JobShield AI - Rule Engine Detection Tests (4 tests passing)
ℹ tests 18
ℹ pass 18
ℹ fail 0
```

To verify the frontend production build:
```bash
cd frontend
npm run build
```

---

## 🎬 College Presentation & Demo Script

When demonstrating JobShield AI to your project guide or external examiner, follow this 4-minute demonstration flow:

1. **Step 1: Introduction (Landing Page)**
   - Open `http://localhost:5173`.
   - Explain the problem: Students being lured into ₹1,500 registration-fee scams or fake appointment letters.
   - Point out the cybersecurity dark UI, anti-scam philosophy, and system statistics.

2. **Step 2: Instant 1-Click Scan (Analyze Page)**
   - Click **"Scan Offer"** in the top navigation.
   - Click the **"Data Entry - UPI Fee Scam"** quick sample button.
   - Notice how the form auto-fills with an urgent message demanding a ₹1,499 refundable registration fee to a personal UPI ID.
   - Click **"Run Threat Analysis"**.

3. **Step 3: Explainable Results (Results Page)**
   - Highlight the **Risk Gauge (85/100 - Critical Risk)**.
   - Review the **Flagged Threat Indicators**: point out the exact quoted evidence snippet ("Pay Rs 1,499 refundable registration fee") and the recommended action ("Immediately refuse payment").
   - Demonstrate the interactive **Candidate Verification Checklist** by checking off items.

4. **Step 4: Legitimate Campus Drive Comparison**
   - Click **"Analyze Another Offer"**.
   - Click **"Infosys Verified Off-Campus Drive"** and submit.
   - Show how the score drops to **Low Risk (0–24)**, and point out how the engine detected positive protective signals like the corporate zero-fee disclaimer and official careers portal.

5. **Step 5: Threat Analytics (Dashboard)**
   - Navigate to **"Dashboard"** to display real-time SVG charts powered by Recharts (Risk severity distribution & content channels breakdown).

6. **Step 6: History & Record Management**
   - Navigate to **"History"** to demonstrate multi-parameter filtering, keyword searching, and record deletion.

---

## ⚖️ Ethical & Academic Disclaimer

JobShield AI provides **heuristic risk assessments and educational threat detection**. An automated AI score does **not** constitute legal proof that an organization is fraudulent or genuine. When evaluating employment opportunities, candidates must always perform independent due diligence through official government registries (e.g. Ministry of Corporate Affairs) and college placement advisors.
