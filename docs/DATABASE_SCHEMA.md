# JobShield AI — Database Schema & Persistence Architecture

## 1. Mongoose Model: `Analysis`

The primary schema stores recruitment scam evaluations. It includes field validations, sub-documents, and compound indexes.

```javascript
const IndicatorSchema = new mongoose.Schema({
  name: { type: String, required: true },
  severity: { type: String, enum: ['Low', 'Medium', 'High', 'Critical'], default: 'Medium' },
  evidence: { type: String, default: '' },
  explanation: { type: String, default: '' },
  verificationAction: { type: String, default: '' },
  confidence: { type: Number, min: 0, max: 1, default: 0.8 }
}, { _id: true });

const SourceLinkSchema = new mongoose.Schema({
  label: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, default: 'official' }
}, { _id: false });

const AnalysisSchema = new mongoose.Schema({
  inputType: {
    type: String,
    enum: ['job_posting', 'internship_offer', 'recruiter_message', 'email', 'offer_letter'],
    default: 'job_posting',
    required: true
  },
  companyName: {
    type: String,
    trim: true,
    maxlength: [120, 'Company name cannot exceed 120 characters'],
    default: 'Unspecified Company'
  },
  companyWebsite: {
    type: String,
    trim: true,
    maxlength: [255, 'Website URL cannot exceed 255 characters'],
    default: ''
  },
  recruiterContact: {
    type: String,
    trim: true,
    maxlength: [200, 'Recruiter contact cannot exceed 200 characters'],
    default: ''
  },
  submittedText: {
    type: String,
    required: [true, 'Submitted text is required'],
    maxlength: [15000, 'Submitted text cannot exceed 15000 characters']
  },
  riskScore: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  riskCategory: {
    type: String,
    enum: ['Low', 'Moderate', 'High', 'Critical'],
    required: true
  },
  summary: {
    type: String,
    required: true
  },
  indicators: [IndicatorSchema],
  positiveSignals: [{ type: String }],
  missingInformation: [{ type: String }],
  verificationChecklist: [{
    item: { type: String, required: true },
    completed: { type: Boolean, default: false }
  }],
  companyVerification: {
    isVerified: { type: Boolean, default: false },
    officialSourceFound: { type: Boolean, default: false },
    sourceUrl: { type: String, default: '' },
    verificationNotes: { type: String, default: '' },
    flaggedDomainMismatch: { type: Boolean, default: false }
  },
  sourceLinks: [SourceLinkSchema],
  analysisProvider: {
    type: String,
    enum: ['rule-engine', 'gemini', 'openai', 'anthropic', 'custom-ai'],
    default: 'rule-engine'
  },
  analysisStatus: {
    type: String,
    enum: ['completed', 'partial', 'failed'],
    default: 'completed'
  }
}, {
  timestamps: true
});
```

---

## 2. Database Indexes

To maintain sub-10ms response times on history searches and filtered queries, the schema maintains the following indexes:

```javascript
AnalysisSchema.index({ createdAt: -1 });      // Fast chronological sorting
AnalysisSchema.index({ riskScore: -1 });      // Sorting by highest severity
AnalysisSchema.index({ riskCategory: 1 });     // Quick category filtering (Critical, High, etc.)
AnalysisSchema.index({ companyName: 'text' }); // Full-text search on company names
```

---

## 3. High-Availability Dual-Mode Architecture

### Mode A: MongoDB Atlas (Production)
- Activated when `MONGODB_URI` is provided in `.env`.
- Uses Mongoose connection pooling with `serverSelectionTimeoutMS: 5000`.
- Supports clustering, replica sets, and automatic reconnection.

### Mode B: Local In-Memory & File-Persisted Fallback (Evaluation & Offline Mode)
- Automatically engaged if `MONGODB_URI` is absent or the database server is unreachable.
- Maintains an identical query interface (`create`, `find`, `findById`, `findByIdAndDelete`, `countDocuments`).
- Changes are mirrored to `backend/data/analyses_local.json`.
- Pre-seeded with 6 realistic fictional scenarios for instant out-of-the-box viva and lab demonstration without manual setup.
