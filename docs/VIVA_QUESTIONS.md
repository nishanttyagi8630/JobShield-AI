# JobShield AI — Comprehensive Viva & Technical Defense Guide

This guide contains frequently asked technical and conceptual questions prepared specifically for B.Tech Computer Science & Engineering (CSE) viva examinations, project defense, and lab assessments.

---

### Q1. What is JobShield AI, and what real-world problem does it solve?
**Answer:**
JobShield AI is an explainable AI and heuristic security analysis platform designed to protect students and fresh graduates from employment scams, fake internship drives, registration-fee traps, and recruiter impersonation. It analyzes recruitment messages, emails, and offer letters to generate a transparent 0–100 risk score, extracts exact evidence snippets, performs company domain verification, and provides an actionable safety checklist.

---

### Q2. Why did you choose a dual-tier approach (Heuristics + LLM) instead of relying solely on an LLM?
**Answer:**
Relying solely on an LLM introduces three major engineering risks:
1. **Hallucination & Inconsistency:** LLMs can miss subtle pattern triggers or hallucinate legitimacy.
2. **Availability & Latency:** External LLM APIs can encounter rate limits, network outages, or key exhaustion.
3. **Deterministic Explainability:** Deterministic heuristic rules guarantee that critical threats—such as upfront registration fees or personal UPI payment handles—are **never** missed, even if an LLM is offline. Tier 1 guarantees 100% uptime with deterministic weights, while Tier 2 provides semantic context enhancement.

---

### Q3. How is the Risk Score (0–100) mathematically calculated?
**Answer:**
The score is computed using a weighted penalty-deduction formula:
$$S = \text{clamp}\left( S_{\text{base}} + \sum W_{\text{threat}} - \sum W_{\text{protective}}, 0, 100 \right)$$
- **Base Score:** 5 points baseline.
- **Threat Weights:** Critical indicators (e.g. upfront fee demand: +40 pts; personal UPI transfer: +30 pts; brand impersonation: +30 pts; credential harvesting: +35 pts). High indicators add +18 to +22 pts.
- **Protective Deductions:** Corporate zero-fee notices (-18 pts), multi-round coding evaluations (-12 pts), and authenticated career portals (-10 pts) reduce the risk score.
- **Score Bands:** 0–24 (Low), 25–49 (Moderate), 50–74 (High), 75–100 (Critical).

---

### Q4. Does JobShield AI label an organization as "Fraudulent"?
**Answer:**
**No.** JobShield AI adheres to strict ethical and legal boundaries: an AI prediction is an advisory threat assessment, not legally binding proof. The application clearly discloses that low risk does not guarantee legitimacy, and high risk does not prove fraud. It prompts the candidate to verify independently via official registries (such as the Ministry of Corporate Affairs).

---

### Q5. How does the system detect Brand Impersonation?
**Answer:**
The system cross-references employer names against a verified corporate directory (Google, Microsoft, Infosys, TCS, Wipro, Razorpay, etc.). If a message claims to represent a Fortune 500 enterprise but provides an email on a free public domain (`@gmail.com`, `@yahoo.com`) or a lookalike domain (`@google-careers-portal.xyz`), the engine flags a **Brand Impersonation** warning with Critical severity.

---

### Q6. How does your backend handle MongoDB connectivity if the database server is offline?
**Answer:**
We built a resilient **Dual-Mode Persistence Architecture**. When a valid `MONGODB_URI` is provided, Mongoose connects with a 5000ms timeout. If MongoDB is offline or unavailable, the backend automatically transitions to an in-memory, file-persisted JSON datastore that mirrors the exact Mongoose interface (`create`, `find`, `findById`, `findByIdAndDelete`, `countDocuments`). This ensures that the entire application and its REST APIs remain fully operational during presentations and offline grading.

---

### Q7. What security controls are implemented on the Express backend?
**Answer:**
1. **Helmet Middleware:** Sets secure HTTP response headers (Content-Security-Policy, anti-clickjacking `X-Frame-Options`, cross-origin resource policy).
2. **Strict CORS Configuration:** Restricts allowed origins to the frontend client URL and rejects unauthorized cross-origin requests.
3. **Rate Limiting (`express-rate-limit`):** Protects general endpoints with a 120 req/15min quota and the `/api/analyze` route with a 45 req/15min quota to prevent brute-force abuse.
4. **Input Sanitization & Validation:** Validates string lengths (20–15,000 chars for text) and sanitizes optional parameters before processing.
5. **No Frontend Secrets:** API keys and MongoDB connection URIs are stored exclusively in backend environment variables.

---

### Q8. What is the role of Recharts and Lucide React on the frontend?
**Answer:**
- **Recharts:** Used on the Dashboard to render SVG-based, responsive visualizations including a Donut/Pie Chart for risk severity distribution and a Bar Chart for content channel breakdowns.
- **Lucide React:** Provides clean, accessible SVG iconography for risk states (AlertOctagon for Critical, AlertTriangle for Moderate/High, ShieldCheck for Low).

---

### Q9. How do you mitigate False Positives (e.g. genuine startups with informal communication)?
**Answer:**
Startups often use Gmail or informal channels without malicious intent. To prevent unfairly flagging them as scams:
1. We categorize informal communication as **Medium Severity** (+12 pts), which places them in the **Moderate Risk** band (25–49) rather than Critical.
2. Only explicit advance-fee demands, personal UPI transfers, or sensitive credential harvesting will push an offer into the Critical band.
3. The UI explicitly states that moderate risk indicates non-standard terms, not definitive fraud.

---

### Q10. What is the difference between "Official Source Found" and "Company Verified"?
**Answer:**
- **Official Source Found:** Indicates our system located an authoritative canonical domain or government registry entry matching the claimed organization name.
- **Company Verified:** Requires establishing cryptographic or authenticated alignment between the recruiter's specific contact channel and that verified corporate domain.

---

### Q11. Which official Indian regulatory and cybercrime resources are integrated into the application?
**Answer:**
1. **National Cyber Crime Reporting Portal (`cybercrime.gov.in`) & Toll-Free Helpline 1930** for reporting financial fraud.
2. **Ministry of Corporate Affairs (`mca.gov.in`)** for verifying Corporate Identity Numbers (CIN) and registered directors.
3. **National Career Service (`ncs.gov.in`)** for authentic government-accredited recruitment drives.

---

### Q12. What are the key advantages of using Vite over Create-React-App (CRA)?
**Answer:**
Vite utilizes native ES modules (ESM) in the browser and leverages `esbuild` written in Go for pre-bundling dependencies. This provides instant server start (under 300ms) and lightning-fast Hot Module Replacement (HMR), compared to CRA which bundles the entire application via Webpack before serving.

---

### Q13. Explain the Mongoose Schema indexes created for the `Analysis` model.
**Answer:**
- `{ createdAt: -1 }`: Optimizes chronological timeline ordering for recent scans.
- `{ riskScore: -1 }`: Enables fast ranking by highest severity.
- `{ riskCategory: 1 }`: Speeds up categorical filtering on the History page.
- `{ companyName: 'text' }`: Provides full-text search across company names.

---

### Q14. What are the top 3 most common recruitment fraud schemes observed today?
**Answer:**
1. **Advance-Fee / Registration Fee Scams:** Demanding money before joining under the guise of training or refundable laptop deposits.
2. **Telegram Task Scams:** Luring candidates with small initial payouts for simple tasks (liking YouTube videos, reviewing apps) before trapping them in prepaid cryptocurrency tasks.
3. **Lookalike Domain / Cheque Overpayment Scams:** Sending fake appointment letters with counterfeit reimbursement checks for hardware.

---

### Q15. What are the future enhancements planned for JobShield AI?
**Answer:**
1. **OCR Offer Letter Parsing:** Extracting text directly from PDF and image files using Tesseract.js.
2. **Automated WHOIS API Integration:** Real-time domain registration age lookups to automatically flag domains registered within the last 90 days.
3. **Browser Extension:** A Chrome/Edge extension that scans LinkedIn, Internshala, and Indeed job posts inline before application submission.
