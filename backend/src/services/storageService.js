import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Analysis } from '../models/Analysis.js';
import { isConnected } from '../config/db.js';
import { SAMPLE_CASES } from '../utils/sampleData.js';
import { analyzeRecruitmentText } from './ruleEngine.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.resolve(__dirname, '../../data');
const DATA_FILE = path.join(DATA_DIR, 'analyses_local.json');

// Ensure local fallback data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// In-memory array cache
let localAnalyses = [];

function loadLocalFile() {
  try {
    if (fs.existsSync(DATA_FILE)) {
      const content = fs.readFileSync(DATA_FILE, 'utf-8');
      localAnalyses = JSON.parse(content);
    } else {
      // Seed with sample cases analyzed by rule engine for instant rich dashboard presentation!
      seedInitialData();
      saveLocalFile();
    }
  } catch (err) {
    console.warn('⚠️ [StorageService] Error reading local data file, re-initializing:', err.message);
    seedInitialData();
  }
}

function saveLocalFile() {
  try {
    fs.writeFileSync(DATA_FILE, JSON.stringify(localAnalyses, null, 2), 'utf-8');
  } catch (err) {
    console.warn('⚠️ [StorageService] Error saving local data file:', err.message);
  }
}

function seedInitialData() {
  localAnalyses = SAMPLE_CASES.map((sample, idx) => {
    const analysis = analyzeRecruitmentText(sample);
    const createdAt = new Date(Date.now() - (idx * 3600000 * 5)).toISOString();
    return {
      _id: `local-seed-${idx + 1}`,
      inputType: sample.inputType,
      companyName: sample.companyName,
      companyWebsite: sample.companyWebsite,
      recruiterContact: sample.recruiterContact,
      submittedText: sample.submittedText,
      riskScore: analysis.riskScore,
      riskCategory: analysis.riskCategory,
      summary: analysis.summary,
      indicators: analysis.indicators,
      positiveSignals: analysis.positiveSignals,
      missingInformation: analysis.missingInformation,
      verificationChecklist: analysis.verificationChecklist,
      companyVerification: {
        isVerified: analysis.riskCategory === 'Low',
        officialSourceFound: sample.companyName.includes('Infosys') || sample.companyName.includes('Razorpay'),
        sourceUrl: sample.companyWebsite,
        verificationNotes: 'Sample pre-loaded case'
      },
      sourceLinks: analysis.sourceLinks,
      analysisProvider: 'rule-engine',
      analysisStatus: 'completed',
      createdAt,
      updatedAt: createdAt
    };
  });
}

// Initial load
loadLocalFile();

export const storageService = {
  async create(data) {
    if (isConnected) {
      return await Analysis.create(data);
    }

    const newRecord = {
      ...data,
      _id: `loc_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    localAnalyses.unshift(newRecord);
    saveLocalFile();
    return newRecord;
  },

  async find({ query = {}, sort = { createdAt: -1 }, skip = 0, limit = 20 }) {
    if (isConnected) {
      return await Analysis.find(query).sort(sort).skip(skip).limit(limit).lean();
    }

    let results = [...localAnalyses];

    // Filter by riskCategory
    if (query.riskCategory) {
      results = results.filter(r => r.riskCategory.toLowerCase() === query.riskCategory.toLowerCase());
    }

    // Filter by inputType
    if (query.inputType) {
      results = results.filter(r => r.inputType.toLowerCase() === query.inputType.toLowerCase());
    }

    // Search query on companyName or submittedText
    if (query.$text || query.search) {
      const q = (query.search || query.$text?.$search || '').toLowerCase();
      results = results.filter(r =>
        (r.companyName && r.companyName.toLowerCase().includes(q)) ||
        (r.submittedText && r.submittedText.toLowerCase().includes(q))
      );
    }

    // Sort
    const sortField = Object.keys(sort)[0] || 'createdAt';
    const sortOrder = sort[sortField] === -1 ? -1 : 1;
    results.sort((a, b) => {
      if (sortField === 'riskScore') {
        return (a.riskScore - b.riskScore) * sortOrder;
      }
      return (new Date(a.createdAt) - new Date(b.createdAt)) * sortOrder;
    });

    return results.slice(skip, skip + limit);
  },

  async countDocuments(query = {}) {
    if (isConnected) {
      return await Analysis.countDocuments(query);
    }

    let count = localAnalyses.length;
    if (query.riskCategory) {
      count = localAnalyses.filter(r => r.riskCategory.toLowerCase() === query.riskCategory.toLowerCase()).length;
    }
    if (query.inputType) {
      count = localAnalyses.filter(r => r.inputType.toLowerCase() === query.inputType.toLowerCase()).length;
    }
    return count;
  },

  async findById(id) {
    if (isConnected) {
      return await Analysis.findById(id).lean();
    }
    return localAnalyses.find(r => r._id === id || r.id === id) || null;
  },

  async findByIdAndDelete(id) {
    if (isConnected) {
      return await Analysis.findByIdAndDelete(id);
    }
    const idx = localAnalyses.findIndex(r => r._id === id || r.id === id);
    if (idx !== -1) {
      const deleted = localAnalyses.splice(idx, 1)[0];
      saveLocalFile();
      return deleted;
    }
    return null;
  },

  async getDashboardStats() {
    let items = [];
    if (isConnected) {
      items = await Analysis.find({}).sort({ createdAt: -1 }).lean();
    } else {
      items = [...localAnalyses];
    }

    const total = items.length;
    let lowRisk = 0;
    let moderateRisk = 0;
    let highRisk = 0;
    let criticalRisk = 0;

    const inputTypeCounts = {
      job_posting: 0,
      internship_offer: 0,
      recruiter_message: 0,
      email: 0,
      offer_letter: 0
    };

    let totalScore = 0;

    for (const item of items) {
      if (item.riskCategory === 'Low') lowRisk++;
      else if (item.riskCategory === 'Moderate') moderateRisk++;
      else if (item.riskCategory === 'High') highRisk++;
      else if (item.riskCategory === 'Critical') criticalRisk++;

      if (inputTypeCounts[item.inputType] !== undefined) {
        inputTypeCounts[item.inputType]++;
      }
      totalScore += (item.riskScore || 0);
    }

    const avgRiskScore = total > 0 ? Math.round(totalScore / total) : 0;
    const recent = items.slice(0, 5);

    return {
      total,
      lowRisk,
      moderateRisk,
      highRisk,
      criticalRisk,
      avgRiskScore,
      inputTypeCounts,
      recent
    };
  }
};
