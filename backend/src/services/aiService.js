import { config } from '../config/env.js';
import { analyzeRecruitmentText as analyzeWithRules } from './ruleEngine.js';

/**
 * Validates and normalizes raw JSON returned by an LLM provider
 */
function validateAndNormalizeAIResponse(parsed, ruleResult) {
  let riskScore = typeof parsed.riskScore === 'number' ? Math.round(parsed.riskScore) : ruleResult.riskScore;
  riskScore = Math.max(0, Math.min(100, riskScore));

  let riskCategory = parsed.riskCategory;
  if (!['Low', 'Moderate', 'High', 'Critical'].includes(riskCategory)) {
    if (riskScore >= 75) riskCategory = 'Critical';
    else if (riskScore >= 50) riskCategory = 'High';
    else if (riskScore >= 25) riskCategory = 'Moderate';
    else riskCategory = 'Low';
  }

  // Sanitize indicators
  let indicators = Array.isArray(parsed.indicators) ? parsed.indicators : [];
  indicators = indicators.map(ind => ({
    name: String(ind.name || 'Unspecified Indicator'),
    severity: ['Low', 'Medium', 'High', 'Critical'].includes(ind.severity) ? ind.severity : 'Medium',
    evidence: String(ind.evidence || '').slice(0, 500),
    explanation: String(ind.explanation || '').slice(0, 1000),
    verificationAction: String(ind.verificationAction || '').slice(0, 500),
    confidence: typeof ind.confidence === 'number' ? Math.min(1, Math.max(0, ind.confidence)) : 0.85
  }));

  // If deterministic rules caught critical flags (e.g. fee demands) that AI hallucinated away, merge them safely
  for (const ruleInd of ruleResult.indicators) {
    if (ruleInd.severity === 'Critical') {
      const alreadyPresent = indicators.some(i => i.name.toLowerCase().includes(ruleInd.name.toLowerCase().slice(0, 15)));
      if (!alreadyPresent) {
        indicators.unshift(ruleInd);
      }
    }
  }

  const positiveSignals = Array.isArray(parsed.positiveSignals) && parsed.positiveSignals.length > 0
    ? parsed.positiveSignals.map(s => String(s).slice(0, 300))
    : ruleResult.positiveSignals;

  const missingInformation = Array.isArray(parsed.missingInformation) && parsed.missingInformation.length > 0
    ? parsed.missingInformation.map(m => String(m).slice(0, 300))
    : ruleResult.missingInformation;

  return {
    riskScore,
    riskCategory,
    summary: String(parsed.summary || ruleResult.summary),
    indicators,
    positiveSignals,
    missingInformation,
    verificationChecklist: ruleResult.verificationChecklist,
    sourceLinks: ruleResult.sourceLinks,
    analysisProvider: config.aiProvider || 'gemini',
    analysisStatus: 'completed'
  };
}

/**
 * Performs analysis via Gemini API or falls back to Rule Engine
 */
export async function performAIAnalysis(payload) {
  // Check if API key is configured
  if (!config.aiApiKey || config.aiApiKey.trim() === '' || config.aiApiKey === 'your_gemini_or_openai_api_key_here') {
    // Return deterministic rule-based analysis
    return analyzeWithRules(payload);
  }

  try {
    const prompt = `You are JobShield AI, a cybersecurity recruitment scam analyst.
Analyze the following recruitment communication. Look for scam indicators:
1. Registration/security/training fee demands or deposits.
2. Personal bank transfers, UPI handles, or crypto requests.
3. Unrealistic compensation for low-skill/part-time tasks.
4. Coercive urgency or arbitrary expiry deadlines.
5. Telegram/WhatsApp-only recruitment channels without corporate email.
6. Brand impersonation using free email addresses (e.g. Google HR using @gmail.com).
7. Direct selection without technical interview or assessments.
8. Requests for OTPs, bank credentials, or original academic certificates.

Return ONLY a valid JSON object matching this schema without markdown fences:
{
  "riskScore": (number from 0 to 100),
  "riskCategory": ("Low" | "Moderate" | "High" | "Critical"),
  "summary": "(2-3 sentences plain language summary explaining the assessment)",
  "indicators": [
    {
      "name": "Indicator Title",
      "severity": ("Low" | "Medium" | "High" | "Critical"),
      "evidence": "Quoted excerpt from text",
      "explanation": "Why this is a risk",
      "verificationAction": "What student should do",
      "confidence": 0.9
    }
  ],
  "positiveSignals": ["positive legitimate factor 1", ...],
  "missingInformation": ["missing detail 1", ...]
}

Recruitment Information:
Company: ${payload.companyName || 'Not specified'}
Website: ${payload.companyWebsite || 'Not specified'}
Contact: ${payload.recruiterContact || 'Not specified'}
Input Type: ${payload.inputType}
Text Content:
${payload.submittedText.slice(0, 8000)}`;

    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 12000); // 12s timeout

    let apiUrl = '';
    let body = {};
    let headers = { 'Content-Type': 'application/json' };

    if (config.aiProvider === 'openai') {
      apiUrl = 'https://api.openai.com/v1/chat/completions';
      headers['Authorization'] = `Bearer ${config.aiApiKey}`;
      body = {
        model: 'gpt-4o-mini',
        messages: [{ role: 'user', content: prompt }],
        temperature: 0.1,
        response_format: { type: 'json_object' }
      };
    } else {
      // Default to Google Gemini API
      const model = config.aiModel || 'gemini-1.5-flash';
      apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${config.aiApiKey}`;
      body = {
        contents: [{ parts: [{ text: prompt }] }],
        generationConfig: {
          temperature: 0.1,
          responseMimeType: 'application/json'
        }
      };
    }

    const response = await fetch(apiUrl, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
      signal: controller.signal
    });
    clearTimeout(timeout);

    if (!response.ok) {
      const errorText = await response.text();
      console.warn(`⚠️ [AI Service] API request failed with status ${response.status}: ${errorText.slice(0, 150)}. Falling back to Rule Engine.`);
      return analyzeWithRules(payload);
    }

    const data = await response.json();
    let textResponse = '';
    if (config.aiProvider === 'openai') {
      textResponse = data.choices?.[0]?.message?.content || '';
    } else {
      textResponse = data.candidates?.[0]?.content?.parts?.[0]?.text || '';
    }

    // Clean JSON string
    textResponse = textResponse.replace(/^```json/i, '').replace(/```$/i, '').trim();
    const parsed = JSON.parse(textResponse);

    const ruleResult = analyzeWithRules(payload);
    const normalized = validateAndNormalizeAIResponse(parsed, ruleResult);
    return normalized;
  } catch (err) {
    console.warn(`⚠️ [AI Service] AI analysis error: ${err.message}. Seamlessly engaging Rule Engine fallback.`);
    return analyzeWithRules(payload);
  }
}
