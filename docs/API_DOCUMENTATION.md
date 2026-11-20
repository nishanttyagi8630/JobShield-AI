# JobShield AI — REST API Documentation

Base URL: `http://localhost:5000/api`

All API responses follow a normalized JSON structure:
```json
{
  "success": true,
  "data": { ... },
  "meta": { ... }
}
```

---

## 1. Health & Status Endpoint

### `GET /health`
Returns system uptime, environment, AI provider mode, and database connection status.

**Response (200 OK):**
```json
{
  "status": "healthy",
  "service": "JobShield AI Backend Service",
  "version": "1.0.0",
  "timestamp": "2026-11-20T05:20:00.000Z",
  "uptimeSeconds": 1420,
  "database": {
    "connected": false,
    "mode": "local-in-memory",
    "state": 0
  },
  "aiProvider": "rule-engine (deterministic fallback)",
  "environment": "development"
}
```

---

## 2. Threat Analysis Endpoint

### `POST /analyze`
Analyzes submitted recruitment content, extracts indicators, computes risk score, runs company verification, and persists the record.

**Rate Limit:** 45 requests / 15 minutes per IP.

**Request Headers:** `Content-Type: application/json`

**Request Body Parameters:**
| Field | Type | Required | Description | Constraints |
| :--- | :--- | :--- | :--- | :--- |
| `submittedText` | String | Yes | The pasted job/internship description, email, or offer | 20 to 15,000 characters |
| `inputType` | String | No | Channel classification | `job_posting`, `internship_offer`, `recruiter_message`, `email`, `offer_letter` |
| `companyName` | String | No | Claimed employer name | Max 120 chars |
| `companyWebsite` | String | No | Claimed employer domain/website | Max 255 chars |
| `recruiterContact`| String | No | Recruiter contact details (email/phone) | Max 200 chars |

**Example Request:**
```json
{
  "inputType": "internship_offer",
  "companyName": "Apex Data Global",
  "companyWebsite": "http://apexdata-fastjobs.site",
  "recruiterContact": "hr@apex-fastjobs.site",
  "submittedText": "Direct selection for Data Entry Internship. Stipend Rs 28,000/week. Pay Rs 1,499 refundable registration fee to UPI ID hr@okaxis. Offer expires in 2 hours."
}
```

**Response (201 Created):**
```json
{
  "success": true,
  "data": {
    "_id": "loc_1732080000000_abc12",
    "inputType": "internship_offer",
    "companyName": "Apex Data Global",
    "riskScore": 85,
    "riskCategory": "Critical",
    "summary": "⚠️ Critical Threat Detected (Score: 85/100). This recruitment communication exhibits hallmark characteristics of advance-fee employment fraud...",
    "indicators": [
      {
        "name": "Mandatory Upfront Payment or Security Deposit Demand",
        "severity": "Critical",
        "evidence": "Pay Rs 1,499 refundable registration fee",
        "explanation": "Legitimate employers and campus placement drives NEVER charge candidates registration...",
        "verificationAction": "Immediately refuse payment. Genuine companies provide all required equipment...",
        "confidence": 0.98
      }
    ],
    "positiveSignals": [],
    "missingInformation": [
      "No physical registered corporate office address or clear work mode mentioned."
    ],
    "verificationChecklist": [
      { "item": "Verify company domain on official web search", "completed": false }
    ],
    "companyVerification": {
      "isVerified": false,
      "officialSourceFound": false,
      "sourceUrl": "",
      "verificationNotes": "Company was not found in our curated verified enterprise directory...",
      "flaggedDomainMismatch": false
    },
    "sourceLinks": [
      { "label": "National Cyber Crime Reporting Portal", "url": "https://cybercrime.gov.in", "type": "reporting" }
    ],
    "analysisProvider": "rule-engine",
    "analysisStatus": "completed",
    "createdAt": "2026-11-20T05:20:10.000Z"
  }
}
```

---

## 3. Analysis History Endpoints

### `GET /analyses`
Retrieves paginated history with multi-parameter filtering and text search.

**Query Parameters:**
| Parameter | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `page` | Integer | `1` | Page number |
| `limit` | Integer | `10` | Records per page (max 50) |
| `search` | String | `null` | Filter by company name or submitted text |
| `riskCategory`| String | `null` | `Low`, `Moderate`, `High`, `Critical` |
| `inputType` | String | `null` | `job_posting`, `internship_offer`, etc. |
| `sortBy` | String | `createdAt`| `createdAt` or `riskScore` |
| `sortOrder` | String | `desc` | `asc` or `desc` |

**Response (200 OK):**
```json
{
  "success": true,
  "data": [ ... ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 6,
    "totalPages": 1
  }
}
```

### `GET /analyses/:id`
Retrieves a single saved analysis by identifier. Returns 404 if not found.

### `DELETE /analyses/:id`
Deletes an analysis record. Returns 200 with confirmation or 404 if not found.

---

## 4. Threat Metrics Endpoint

### `GET /stats`
Returns aggregated metrics for the dashboard (counts of critical, high, moderate, and low-risk items, average score, and recent scans).

---

## 5. Company Verification Endpoint

### `POST /verify-company`
Checks company identity against verified enterprise databases and identifies domain spoofing.

**Request Body:**
```json
{
  "companyName": "Google",
  "companyWebsite": "http://google-careers-portal.xyz",
  "recruiterContact": "hr@google.com"
}
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": {
    "status": "domain_mismatch_warning",
    "isVerified": false,
    "officialSourceFound": true,
    "officialName": "Google",
    "canonicalDomain": "google.com",
    "careerPortal": "https://careers.google.com",
    "flaggedDomainMismatch": true,
    "verificationNotes": "⚠️ Potential Domain Impersonation Detected! User-supplied website does NOT match official registered domain google.com.",
    "sourceLinks": [
      { "label": "Official Google Careers Portal", "url": "https://careers.google.com" }
    ],
    "safeManualSteps": [
      "Navigate directly to careers.google.com and search for the Job ID listed in your offer."
    ]
  }
}
```
