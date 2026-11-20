# JobShield AI — Testing & Quality Assurance Guide

JobShield AI features an end-to-end automated test suite utilizing Node.js's built-in native test runner (`node:test`) and assertion library (`node:assert/strict`).

---

## 1. Running the Automated Tests

### Backend Unit & Integration Tests:
Open a terminal in the `backend/` directory:
```bash
npm test
```
Or run directly with the native test runner:
```bash
node --test tests/*.test.js
```

### Frontend Build Verification:
Open a terminal in the `frontend/` directory:
```bash
npm run build
```

---

## 2. Test Suite Breakdown

### Suite 1: Rule Engine Threat Vector Tests (`tests/ruleEngine.test.js`)
- **Upfront Fee Scam Detection:** Submits a realistic registration fee offer with UPI handle. Verifies that `riskCategory === 'Critical'`, `riskScore >= 75`, and that both the payment demand and UPI indicators are flagged with exact extracted evidence.
- **Brand Impersonation Detection:** Submits an offer claiming to be from Google with recruiter contact `@gmail.com`. Verifies that brand impersonation is flagged with critical severity.
- **Campus Drive Legitimate Evaluation:** Submits a standard Infosys campus drive with HackerEarth test details and zero-fee disclaimers. Verifies that `riskCategory === 'Low'` (`riskScore <= 25`) and that protective signals are extracted.
- **Ambiguous Startup Detection:** Submits an unpaid 4-week trial with Telegram communication. Verifies that the score lands in the `Moderate` or `High` category and flags Telegram channels.

### Suite 2: Company Identity Verification Tests (`tests/companyVerifier.test.js`)
- **Domain Normalization:** Verifies stripping of protocols, ports, trailing paths, and `www.` subdomains.
- **Canonical Match:** Verifies that known corporate entries (e.g. Infosys, Google, Razorpay) resolve canonical domains and official careers portals.
- **Lookalike / Spoofing Detection:** Verifies that a domain diverging from canonical records (e.g. `google-careers-portal-india.xyz` vs `google.com`) is flagged with `domain_mismatch_warning` and `isVerified: false`.
- **Unverified Entity Safe Handling:** Verifies that unknown companies are clearly labeled as `unverified_entity` with safe manual steps, without fabricating verification records.

### Suite 3: REST API Integration Tests (`tests/api.test.js`)
- **Health Check (`GET /api/health`):** Verifies 200 OK and reports service status and database state.
- **Input Validation Rejections (`POST /api/analyze`):**
  - Rejects empty text with 400 Bad Request.
  - Rejects text shorter than 20 characters with 400 Bad Request.
- **Full Analysis Persistence (`POST /api/analyze`):** Analyzes valid text, verifies 201 Created, confirms returned MongoDB/local ID, and checks category output.
- **Paginated History Retrieval (`GET /api/analyses`):** Verifies 200 OK, checks array payload and pagination metadata.
- **Single Record Retrieval (`GET /api/analyses/:id`):** Tests 200 OK for valid IDs and 404 Not Found for non-existent IDs.
- **Dashboard Stats Aggregation (`GET /api/stats`):** Confirms calculation of total scans and risk category counts.
- **Company Verification Route (`POST /api/verify-company`):** Tests 200 OK and payload structure.
- **Record Deletion (`DELETE /api/analyses/:id`):** Tests 200 OK deletion, then verifies subsequent 404 lookup.

---

## 3. Manual Testing Checklist for Evaluation / Viva

| Test Scenario | Action in UI | Expected Visual & Functional Result |
| :--- | :--- | :--- |
| **Test Case 1: UPI Scam** | Click sample "Data Entry - UPI Fee Scam" and click Run Threat Analysis | Risk Gauge displays 75–100 (Critical Risk Red), flags "Mandatory Upfront Payment" with UPI quote, highlights refusal action. |
| **Test Case 2: Google Impersonation** | Click sample "Impersonation & Laptop Cheque Scam" and click Run Threat Analysis | Red warning badge, flags Google brand impersonation with `@gmail.com` contact, warns against equipment check deposit. |
| **Test Case 3: Legitimate Drive** | Click sample "Infosys Verified Off-Campus Drive" and click Run Threat Analysis | Risk Gauge displays 0–24 (Low Risk Green), lists zero-fee notice and HackerEarth test as positive protective signals. |
| **Test Case 4: Search & Filters** | Navigate to History page, filter by "Critical Risk" or type "Apex" in search bar | Instant filtering of table/cards, only matching records displayed. |
| **Test Case 5: Interactive Checklist** | On Results page, click on any verification checklist item | Checkbox toggles to checked, text strikes through, and the progress bar updates in real time. |
| **Test Case 6: Record Deletion** | Click the red trash icon on any history item | Modal prompt appears; confirming permanently deletes the record and updates the list. |
