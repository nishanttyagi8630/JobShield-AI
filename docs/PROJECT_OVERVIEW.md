# JobShield AI — Project Overview & Architecture Specification

## 1. Abstract & Problem Statement

In recent years, collegiate students and fresh graduates in engineering and technology disciplines have become primary targets for predatory employment fraud. These scams manifest in various forms:
- **Upfront Registration Fees:** Demanding ₹999 to ₹5,000 under the pretext of "refundable security deposit", "training costs", or "portal access".
- **Brand Impersonation:** Fraudsters posing as HR managers from Google, Microsoft, Infosys, TCS, or Wipro using lookalike domains or free `@gmail.com` accounts.
- **Telegram & WhatsApp Task Scams:** Luring candidates with unrealistic daily payouts (₹2,000–₹5,000) for rating apps or liking videos, then coercing them into cryptocurrency/prepaid investment traps.
- **Counterfeit Equipment Cheques:** Sending fake appointment letters demanding candidates purchase hardware from fraudulent vendors.
- **Sensitive Credential Harvesting:** Demanding bank PINs, OTPs, or surrender of original educational marksheets.

**JobShield AI** is an explainable AI and heuristic security analysis platform designed to evaluate job descriptions, internship offers, recruiter emails, and appointment letters. The system computes a calibrated **Risk Score (0–100)** with transparent evidence citations, highlights protective corporate anti-fraud disclaimers, verifies company authenticity, and guides students with actionable verification steps.

---

## 2. Core Architectural Philosophy

### Key Principles
1. **Advisory Assessment, Not Legal Proof:** An AI prediction or heuristic flag is an advisory assessment to alert students. The system never labels an organization as fraudulent based solely on automated prediction.
2. **Dual-Tier Resilient Engine:**
   - **Tier 1 (Deterministic Heuristic Engine):** Evaluates 15+ threat vectors using calibrated weights, regex pattern extractors, and domain cross-referencing.
   - **Tier 2 (Configurable LLM Service):** Connects to Google Gemini or OpenAI when credentials are configured, parsing and strictly validating JSON responses against an enforcement schema.
   - **Automatic Fallback:** When no LLM key is present or when network errors occur, Tier 1 executes transparently with zero downtime.
3. **Dual-Mode Persistence Layer:**
   - Connects to MongoDB Atlas via Mongoose when configured.
   - Gracefully falls back to a local, file-persisted JSON datastore when running in offline or demo mode, allowing 100% functionality without requiring external database provisioning.
4. **Zero Frontend Secrets Exposure:**
   - All AI API keys and database credentials reside strictly within the backend environment.

---

## 3. High-Level System Architecture

```
+-------------------------------------------------------------------------+
|                              REACT FRONTEND                              |
|  (Vite + React Router + Recharts + Lucide Icons + Cyber Dark SaaS UI)   |
+------------------------------------+------------------------------------+
                                     | HTTP REST (JSON)
                                     v
+-------------------------------------------------------------------------+
|                           NODE.JS / EXPRESS API                         |
|   - Helmet Security Headers         - CORS Policy Engine                |
|   - Express Rate Limiters           - Input Validation Middlewares      |
+-------------------+-----------------+-------------------+---------------+
                    |                 |                   |
                    v                 v                   v
      +-----------------------------+ | +-------------------------------+
      |  DETERMINISTIC RULE ENGINE  | | |    COMPANY VERIFIER SERVICE   |
      |  - 15+ Threat Vector Checks | | | - Domain Normalization        |
      |  - Exact Evidence Slicing   | | | - Corporate Whitelist Match   |
      |  - Calibrated Risk Scoring  | | | - Lookalike Spoofing Detector |
      |  - Verification Checklist   | | | - Official Career Portals     |
      +--------------+--------------+ | +---------------+---------------+
                     |                |                 |
                     | Optional LLM   |                 |
                     v                v                 v
      +-----------------------------+ +---------------------------------+
      |      AI SERVICE ADAPTER     | |     STORAGE CONTROLLER ADAPTER  |
      | (Google Gemini / OpenAI /   | |   - Mongoose ODM (MongoDB Atlas)|
      |  Strict Schema Validator)   | |   - Local In-Memory Fallback    |
      +-----------------------------+ +---------------------------------+
```

---

## 4. Heuristic Threat Scoring Formula & Weights

The risk score $S \in [0, 100]$ is computed using a weighted penalty-deduction model:

$$S = \text{clamp}\left( S_{\text{base}} + \sum W_{\text{threat}} - \sum W_{\text{protective}}, 0, 100 \right)$$

### Threat Weights ($W_{\text{threat}}$):
| Indicator Category | Severity | Weight ($W$) | Trigger Condition |
| :--- | :--- | :--- | :--- |
| **Upfront Fee Demand** | Critical | +40 pts | Words matching `registration fee`, `refundable deposit`, `training charge` |
| **Direct UPI / Bank Transfer** | Critical | +30 pts | UPI handles (`@okaxis`, `@paytm`), bank account numbers |
| **Brand Impersonation (Free Email)** | Critical | +30 pts | Known enterprise (Google, TCS) with `@gmail.com`, `@yahoo.com` |
| **Sensitive Credential Demands** | Critical | +35 pts | Requests for `ATM PIN`, `OTP`, `surrender original certificates` |
| **Unrealistic Compensation** | High | +22 pts | High weekly stipends for low-skill tasks (e.g. ₹28,000/week data entry) |
| **Coercive Urgency Tactics** | High | +20 pts | Artificial deadlines (e.g. `expires in 2 hours`, `deposit immediately`) |
| **Unconditional Direct Selection** | High | +18 pts | `Direct selection without technical interview` or assessment |
| **Telegram-Only Recruitment** | High | +18 pts | Hiring conducted exclusively over Telegram handles |
| **WhatsApp-Only Informal Hiring** | Medium | +12 pts | Payment screenshots or communication strictly over WhatsApp |
| **Extended Unpaid Evaluation** | Medium | +10 pts | `Unpaid for first 4 weeks` or ambiguous trial periods |

### Protective Deductions ($W_{\text{protective}}$):
| Protective Signal | Deduction | Condition |
| :--- | :--- | :--- |
| **Explicit Zero-Fee Disclaimer** | -18 pts | Formal anti-fraud warning (e.g. "We never charge candidate fees") |
| **Structured Multi-Round Hiring** | -12 pts | Documented coding rounds, HackerEarth/Teams interviews |
| **Official Corporate Careers Portal** | -10 pts | Application submitted on authenticated domain (e.g. `careers.infosys.com`) |
| **Corporate Perks & Healthcare** | -6 pts | Professional benefits (PF, medical insurance, mentorship) |

### Score Categorization Bands:
- **0 – 24 (Low Risk):** Demonstrates standard professional hiring patterns.
- **25 – 49 (Moderate Risk):** Ambiguous or non-standard terms; manual due diligence required.
- **50 – 74 (High Risk):** Multiple severe warning flags; high probability of predatory practices.
- **75 – 100 (Critical Risk):** Direct presence of upfront fee demands, personal UPI transfer, or brand impersonation.
