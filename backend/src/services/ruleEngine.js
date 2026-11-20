/**
 * JobShield AI - Deterministic Rule-Based Analysis Engine
 * Evaluates recruitment text against verified threat indicators,
 * extracts exact evidence, calculates calibrated heuristic risk scores (0-100),
 * and generates actionable verification checklists.
 */

// Enterprise companies often impersonated by scammers
const KNOWN_ENTERPRISES = [
  { name: 'Google', domain: 'google.com', careerUrl: 'https://careers.google.com' },
  { name: 'Microsoft', domain: 'microsoft.com', careerUrl: 'https://careers.microsoft.com' },
  { name: 'Amazon', domain: 'amazon.jobs', careerUrl: 'https://amazon.jobs' },
  { name: 'Apple', domain: 'apple.com', careerUrl: 'https://jobs.apple.com' },
  { name: 'Infosys', domain: 'infosys.com', careerUrl: 'https://careers.infosys.com' },
  { name: 'Tata Consultancy Services', aliases: ['TCS'], domain: 'tcs.com', careerUrl: 'https://ibegin.tcs.com' },
  { name: 'Wipro', domain: 'wipro.com', careerUrl: 'https://careers.wipro.com' },
  { name: 'Accenture', domain: 'accenture.com', careerUrl: 'https://www.accenture.com/careers' },
  { name: 'Cognizant', domain: 'cognizant.com', careerUrl: 'https://careers.cognizant.com' },
  { name: 'HCL Technologies', aliases: ['HCL'], domain: 'hcltech.com', careerUrl: 'https://www.hcltech.com/careers' },
  { name: 'Razorpay', domain: 'razorpay.com', careerUrl: 'https://razorpay.com/jobs' },
  { name: 'Flipkart', domain: 'flipkartcareers.com', careerUrl: 'https://www.flipkartcareers.com' }
];

const FREE_EMAIL_DOMAINS = [
  'gmail.com', 'yahoo.com', 'yahoo.co.in', 'hotmail.com',
  'outlook.com', 'rediffmail.com', 'aol.com', 'proton.me', 'protonmail.com'
];

/**
 * Main analysis function for deterministic rule engine
 */
export function analyzeRecruitmentText({
  submittedText = '',
  inputType = 'job_posting',
  companyName = '',
  companyWebsite = '',
  recruiterContact = ''
}) {
  const text = `${submittedText}\n${companyName}\n${companyWebsite}\n${recruiterContact}`;
  const lowerText = text.toLowerCase();

  const indicators = [];
  const positiveSignals = [];
  const missingInformation = [];
  let rawScore = 5; // Base baseline score for unverified text

  // -------------------------------------------------------------
  // 1. PAYMENT DEMANDS (CRITICAL SEVERITY - Weight: 35-40 pts)
  // -------------------------------------------------------------
  const feeRegex = /(?:registration|application|security|training|laptop|equipment|portal|document verification|id card|onboarding)\s*(?:fee|deposit|charge|cost|amount|payment|money)|(?:pay|deposit|transfer|send)\s*(?:rs\.?|inr|\$|₹)\s*\d+/i;
  const refundableRegex = /refundable\s*(?:deposit|fee|charge|security|amount)/i;

  if (feeRegex.test(lowerText) || refundableRegex.test(lowerText)) {
    const match = text.match(feeRegex) || text.match(refundableRegex);
    indicators.push({
      name: 'Mandatory Upfront Payment or Security Deposit Demand',
      severity: 'Critical',
      evidence: match ? match[0] : 'Payment/deposit demanded before joining or onboarding',
      explanation: 'Legitimate employers and campus placement drives NEVER charge candidates registration, training, or equipment fees. Asking for "refundable" security deposits is the #1 signature of employment fraud.',
      verificationAction: 'Immediately refuse payment. Genuine companies provide all required equipment, software, and training at zero cost to the candidate.',
      confidence: 0.98
    });
    rawScore += 40;
  }

  // -------------------------------------------------------------
  // 2. SUSPICIOUS PAYMENT DESTINATIONS (UPI / PERSONAL BANK / CRYPTO) (CRITICAL - Weight: 30 pts)
  // -------------------------------------------------------------
  const upiRegex = /[a-zA-Z0-9.\-_]{2,256}@(okaxis|okhdfcbank|okicici|oksbi|paytm|ybl|apl|upi)/i;
  const personalBankRegex = /(?:transfer\s*to\s*account|account\s*(?:no|number)|ifsc\s*code|bank\s*transfer|google\s*pay|phonepe|paytm\s*transfer|crypto|usdt|bitcoin)/i;

  if (upiRegex.test(text) || personalBankRegex.test(lowerText)) {
    const match = text.match(upiRegex) || text.match(personalBankRegex);
    indicators.push({
      name: 'Direct Money Transfer / Personal UPI / Cryptocurrency Channel',
      severity: 'Critical',
      evidence: match ? match[0] : 'Personal UPI or bank transfer requested',
      explanation: 'Recruitment processes do not conduct payments via personal UPI handles (GPay, PhonePe, Paytm) or direct bank wire instructions.',
      verificationAction: 'Do not transfer any funds. Real corporations maintain enterprise billing workflows and will never ask money to be sent to personal accounts.',
      confidence: 0.96
    });
    rawScore += 30;
  }

  // -------------------------------------------------------------
  // 3. EXTREME URGENCY & PRESSURE TACTICS (HIGH - Weight: 20 pts)
  // -------------------------------------------------------------
  const urgencyRegex = /(?:within\s*(?:24|12|2|3|4|6)\s*hours|expires?\s*(?:in|within)\s*\d+\s*(?:hours|minutes|mins)|immediate\s*(?:transfer|deposit|action)|hurry|limited\s*seats\s*(?:left|available)|legal\s*action|penalty|breach\s*penalty)/i;
  if (urgencyRegex.test(lowerText)) {
    const match = text.match(urgencyRegex);
    indicators.push({
      name: 'Artificial Urgency & Coercive Pressure Tactics',
      severity: 'High',
      evidence: match ? match[0] : 'Arbitrary deadline or legal threats to force swift action',
      explanation: 'Scammers manufacture artificial panic (e.g. 2-hour deadline, fear of losing seat, fake legal threats) to prevent students from consulting parents, mentors, or campus placement cells.',
      verificationAction: 'Step back and pause. Formal job offers give candidates at least 3 to 14 business days to review employment terms.',
      confidence: 0.92
    });
    rawScore += 20;
  }

  // -------------------------------------------------------------
  // 4. IMPERSONATION OF ESTABLISHED BRANDS WITH FREE EMAIL DOMAINS (HIGH/CRITICAL - Weight: 25 pts)
  // -------------------------------------------------------------
  const enterpriseFound = KNOWN_ENTERPRISES.find(e => {
    const nameMatch = new RegExp(`\\b${e.name}\\b`, 'i').test(text);
    const aliasMatch = e.aliases ? e.aliases.some(a => new RegExp(`\\b${a}\\b`, 'i').test(text)) : false;
    return nameMatch || aliasMatch;
  });

  const emailRegex = /([a-zA-Z0-9._-]+@[a-zA-Z0-9._-]+\.[a-zA-Z0-9._-]+)/gi;
  const emailsFound = text.match(emailRegex) || [];
  const freeEmailFound = emailsFound.find(email => {
    const domain = email.split('@')[1]?.toLowerCase();
    return FREE_EMAIL_DOMAINS.includes(domain);
  });

  if (enterpriseFound && freeEmailFound) {
    indicators.push({
      name: `Brand Impersonation (${enterpriseFound.name} using Free Email Provider)`,
      severity: 'Critical',
      evidence: `Mentions ${enterpriseFound.name} but contact address is "${freeEmailFound}"`,
      explanation: `Major corporations like ${enterpriseFound.name} NEVER use free Gmail, Yahoo, or Outlook accounts for official candidate communications. Hiring emails originate exclusively from official company domains (e.g. @${enterpriseFound.domain}).`,
      verificationAction: `Cross-check on the official ${enterpriseFound.name} careers portal (${enterpriseFound.careerUrl}). Any communication from a free email address claiming to be a Fortune 500 company is fraudulent.`,
      confidence: 0.97
    });
    rawScore += 30;
  } else if (freeEmailFound && (inputType === 'offer_letter' || inputType === 'internship_offer')) {
    indicators.push({
      name: 'Official Offer Issued via Generic Free Email Service',
      severity: 'Medium',
      evidence: `Recruiter email: ${freeEmailFound}`,
      explanation: 'While informal micro-startups sometimes use free emails, formal appointment letters and corporate agreements should originate from authenticated corporate domain names with SPF/DKIM records.',
      verificationAction: 'Request the recruiter to send an email confirmation from their registered corporate domain before taking further action.',
      confidence: 0.82
    });
    rawScore += 12;
  }

  // -------------------------------------------------------------
  // 5. DIRECT SELECTION WITHOUT ASSESSMENT OR INTERVIEW (HIGH - Weight: 18 pts)
  // -------------------------------------------------------------
  const directSelectionRegex = /(?:direct\s*selection|shortlisted\s*directly\s*without|no\s*(?:technical\s*)?interview\s*(?:required|needed)|guaranteed\s*selection|selected\s*without\s*(?:any\s*)?(?:test|assessment|interview))/i;
  if (directSelectionRegex.test(lowerText)) {
    const match = text.match(directSelectionRegex);
    indicators.push({
      name: 'Unconditional Direct Selection Without Assessment or Interview',
      severity: 'High',
      evidence: match ? match[0] : 'Selected without formal interview or technical screening',
      explanation: 'Genuine employers always conduct at least one interview, coding assessment, or background check before issuing a job or internship offer. "Instant selection" is used by scammers to flatter and bait victims.',
      verificationAction: 'Inquire about the technical evaluation and request a live video interview with the hiring manager on Google Meet, Teams, or Zoom.',
      confidence: 0.89
    });
    rawScore += 18;
  }

  // -------------------------------------------------------------
  // 6. UNREALISTIC SALARY / STIPEND CLAIMS FOR LOW-SKILL TASKS (HIGH - Weight: 20 pts)
  // -------------------------------------------------------------
  const unrealisticPayRegex = /(?:data\s*entry|copy\s*paste|sms\s*sending|form\s*filling|video\s*rating|app\s*review).*(?:(?:rs\.?|inr|₹)\s*(?:2[0-9]|[3-9][0-9]),?\d{3}\s*(?:\/|per)\s*(?:week|day)|(?:rs\.?|inr|₹)\s*[1-9][0-9]{5,}\s*(?:\/|per)\s*month)|(?:part\s*time.*1-2\s*hours.*(?:rs\.?|inr|₹)\s*[2-9][0-9],?\d{3})/i;
  if (unrealisticPayRegex.test(lowerText) || /(?:earn\s*(?:rs\.?|inr|₹)?\s*[2-9][0-9],?\d{3}\s*daily)/i.test(lowerText)) {
    const match = text.match(unrealisticPayRegex) || text.match(/(?:earn\s*(?:rs\.?|inr|₹)?\s*[2-9][0-9],?\d{3}\s*daily)/i);
    indicators.push({
      name: 'Unrealistic Compensation for Minimal / Low-Skill Work',
      severity: 'High',
      evidence: match ? match[0] : 'Disproportionately high daily/weekly payouts for simple tasks',
      explanation: 'Offering Rs 25,000/week or Rs 3,000/day for 1-2 hours of data entry, rating apps, or copy-pasting is statistically impossible in the real job market and is standard lure for advance-fee scams.',
      verificationAction: 'Compare offered wages against Glassdoor, AmbitionBox, or Payscale industry standards for the same position.',
      confidence: 0.94
    });
    rawScore += 22;
  }

  // -------------------------------------------------------------
  // 7. INFORMAL / UNENCRYPTED RECRUITMENT CHANNELS (TELEGRAM / WHATSAPP ONLY) (MEDIUM/HIGH - Weight: 15 pts)
  // -------------------------------------------------------------
  const telegramRegex = /(?:telegram|t\.me\/|@\w{4,}\s*(?:on\s*telegram)|telegram\s*group)/i;
  const whatsappOnlyRegex = /(?:send\s*screenshot\s*on\s*whatsapp|whatsapp\s*only|join\s*(?:our\s*)?whatsapp\s*group)/i;

  if (telegramRegex.test(lowerText)) {
    const match = text.match(telegramRegex);
    indicators.push({
      name: 'Hiring Channeled via Telegram / Anonymous Chat handles',
      severity: 'High',
      evidence: match ? match[0] : 'Communication conducted via Telegram handle or channel',
      explanation: 'Telegram provides extreme anonymity and enables scammers to delete conversations and channels instantly without a trace. Corporate recruitment is never conducted solely over Telegram.',
      verificationAction: 'Demand formal communication via official corporate email and corporate LinkedIn or career portals.',
      confidence: 0.93
    });
    rawScore += 18;
  } else if (whatsappOnlyRegex.test(lowerText)) {
    const match = text.match(whatsappOnlyRegex);
    indicators.push({
      name: 'Informal Hiring & Payment Screenshot Collection via WhatsApp',
      severity: 'Medium',
      evidence: match ? match[0] : 'Exclusive reliance on WhatsApp for hiring updates and receipts',
      explanation: 'While recruiters may send courtesy reminders via WhatsApp, relying strictly on personal WhatsApp numbers without official enterprise correspondence is a significant vulnerability.',
      verificationAction: 'Verify recruiter identity on LinkedIn and ask for a written offer on official letterhead from an authorized HR email.',
      confidence: 0.80
    });
    rawScore += 12;
  }

  // -------------------------------------------------------------
  // 8. SENSITIVE CREDENTIALS HARVESTING (CRITICAL - Weight: 35 pts)
  // -------------------------------------------------------------
  const credentialRegex = /(?:bank\s*pin|atm\s*pin|otp|internet\s*banking\s*password|original\s*(?:marksheets?|certificates?)\s*(?:deposit|submission|surrender))/i;
  if (credentialRegex.test(lowerText)) {
    const match = text.match(credentialRegex);
    indicators.push({
      name: 'Harvesting of Financial Credentials or Original Documents',
      severity: 'Critical',
      evidence: match ? match[0] : 'Request for OTP, banking passwords, or surrender of original educational marksheets',
      explanation: 'Under no circumstances will a legitimate company request your bank PIN, OTP, or demand you surrender original academic certificates.',
      verificationAction: 'Immediately terminate all communication. Never share OTPs or surrender physical academic marksheets.',
      confidence: 0.99
    });
    rawScore += 35;
  }

  // -------------------------------------------------------------
  // 9. UNPAID LONG EVALUATION PERIODS OR TRIAL PERIOD SCAMS (MEDIUM - Weight: 10 pts)
  // -------------------------------------------------------------
  const unpaidTrialRegex = /(?:unpaid\s*(?:for\s*(?:the\s*)?)?(?:first\s*)?\d+\s*(?:weeks?|months?)|unpaid\s*evaluation\s*period|trial\s*without\s*(?:stipend|pay))/i;
  if (unpaidTrialRegex.test(lowerText)) {
    const match = text.match(unpaidTrialRegex);
    indicators.push({
      name: 'Extended Unpaid Evaluation or Trial Period',
      severity: 'Medium',
      evidence: match ? match[0] : 'Unpaid trial or initial evaluation period mentioned',
      explanation: 'Some informal startups exploit student labor through promises of "performance-based stipends later" after weeks of unpaid work.',
      verificationAction: 'Insist on a clearly documented internship agreement defining deliverables, working hours, and fair compensation terms from Day 1.',
      confidence: 0.85
    });
    rawScore += 10;
  }

  // -------------------------------------------------------------
  // 10. POSITIVE SIGNALS DETECTION (Protective - Decreases risk score)
  // -------------------------------------------------------------
  const zeroFeeNoticeRegex = /(?:never\s*(?:charges?|asks?|solicits?)\s*(?:any\s*)?(?:fee|money|deposit)|zero\s*fee|do\s*not\s*charge|no\s*fee\s*at\s*any\s*stage)/i;
  if (zeroFeeNoticeRegex.test(lowerText)) {
    positiveSignals.push('Explicit corporate anti-fraud disclaimer stating the company never charges candidate fees.');
    rawScore -= 18;
  }

  const structuredHiringRegex = /(?:selection\s*process|hiring\s*flow|rounds?|technical\s*interview|coding\s*assessment|hackerearth|hackerrank|live\s*interview)/i;
  if (structuredHiringRegex.test(lowerText)) {
    positiveSignals.push('Transparent, multi-round technical assessment process outlined.');
    rawScore -= 12;
  }

  const officialCareersPortalRegex = /https?:\/\/(?:careers\.|jobs\.|www\.)?[a-zA-Z0-9-]+\.(?:com|org|net|in|io)\/(?:job|careers?|jobseeker)/i;
  if (officialCareersPortalRegex.test(text)) {
    const match = text.match(officialCareersPortalRegex);
    positiveSignals.push(`Application directed to dedicated corporate portal: ${match ? match[0] : 'Careers Portal'}`);
    rawScore -= 10;
  }

  const professionalPerksRegex = /(?:medical\s*insurance|provident\s*fund|catered\s*meals|paid\s*time\s*off|mentorship)/i;
  if (professionalPerksRegex.test(lowerText)) {
    positiveSignals.push('Standard professional corporate benefits and mentorship structure detailed.');
    rawScore -= 6;
  }

  // -------------------------------------------------------------
  // 11. MISSING INFORMATION CHECKS
  // -------------------------------------------------------------
  if (!companyWebsite || companyWebsite.trim() === '') {
    missingInformation.push('No verifiable company website URL provided in the submission.');
  }

  if (!text.includes('location') && !text.includes('bangalore') && !text.includes('hyderabad') && !text.includes('pune') && !text.includes('delhi') && !text.includes('remote') && !text.includes('office')) {
    missingInformation.push('No physical registered corporate office address or clear work mode mentioned.');
  }

  if (!/(?:skills?|requirements?|technolog|stack|qualifications?|b\.tech|degree)/i.test(lowerText)) {
    missingInformation.push('Lack of technical prerequisites, required skillsets, or academic eligibility criteria.');
  }

  // -------------------------------------------------------------
  // 12. NORMALIZE RISK SCORE (0 to 100) & CLASSIFY RISK CATEGORY
  // -------------------------------------------------------------
  // Clamp score
  let finalScore = Math.max(0, Math.min(100, Math.round(rawScore)));

  // If there are critical indicators, ensure score is at least 70
  const hasCritical = indicators.some(i => i.severity === 'Critical');
  if (hasCritical && finalScore < 70) {
    finalScore = 75;
  }

  // Determine category
  let riskCategory = 'Low';
  if (finalScore >= 75) {
    riskCategory = 'Critical';
  } else if (finalScore >= 50) {
    riskCategory = 'High';
  } else if (finalScore >= 25) {
    riskCategory = 'Moderate';
  } else {
    riskCategory = 'Low';
  }

  // -------------------------------------------------------------
  // 13. GENERATE PLAIN-LANGUAGE EXECUTIVE SUMMARY
  // -------------------------------------------------------------
  let summary = '';
  if (riskCategory === 'Critical') {
    summary = `⚠️ Critical Threat Detected (Score: ${finalScore}/100). This recruitment communication exhibits hallmark characteristics of advance-fee employment fraud, including upfront financial demands, brand impersonation, or suspicious payment channels. Do NOT transfer money or surrender personal banking credentials under any pretext.`;
  } else if (riskCategory === 'High') {
    summary = `🚨 High Caution Advised (Score: ${finalScore}/100). Multiple high-severity warning flags were identified, such as urgency pressure, unconditional selection without technical interviews, or communication through anonymous channels. Exercise extreme caution and do not disclose sensitive personal information.`;
  } else if (riskCategory === 'Moderate') {
    summary = `⚠️ Moderate Ambiguity (Score: ${finalScore}/100). The offer contains certain non-standard recruitment elements, such as uncompensated trial periods or third-party messaging. While not necessarily fraudulent, independent corporate identity verification is required before proceeding.`;
  } else {
    summary = `🛡️ Low Risk Indicators (Score: ${finalScore}/100). The evaluated communication demonstrates standard hiring protocols, clear interview phases, and standard corporate anti-scam advisories. Always remember that a low AI risk score is an assessment and does not constitute a legal guarantee of company legitimacy.`;
  }

  // -------------------------------------------------------------
  // 14. GENERATE ACTIONABLE VERIFICATION CHECKLIST
  // -------------------------------------------------------------
  const verificationChecklist = [
    { item: 'Verify company domain and careers portal URL on official web search', completed: false },
    { item: 'Search recruiter profile on LinkedIn and verify current employment title', completed: false },
    { item: 'Confirm that zero fees (registration, laptop, portal, or security) are required', completed: false },
    { item: 'Request a formal written offer letter on official letterhead from corporate domain email', completed: false },
    { item: 'Check company registration on Ministry of Corporate Affairs (MCA) / regulatory directory', completed: false },
    { item: 'Consult college placement officer or faculty advisor before signing agreements', completed: false }
  ];

  // -------------------------------------------------------------
  // 15. CURATED OFFICIAL & REPORTING SOURCE LINKS
  // -------------------------------------------------------------
  const sourceLinks = [
    {
      label: 'National Cyber Crime Reporting Portal (Govt of India)',
      url: 'https://cybercrime.gov.in',
      type: 'reporting'
    },
    {
      label: 'National Career Service Portal (NCS India)',
      url: 'https://www.ncs.gov.in',
      type: 'official-career'
    },
    {
      label: 'Ministry of Corporate Affairs (MCA Company Master Data)',
      url: 'https://www.mca.gov.in/mcafoportal/viewCompanyMasterData.do',
      type: 'government-registry'
    },
    {
      label: 'FTC Job Scams Consumer Advice',
      url: 'https://consumer.ftc.gov/articles/job-scams',
      type: 'advisory'
    }
  ];

  if (enterpriseFound) {
    sourceLinks.unshift({
      label: `Official ${enterpriseFound.name} Careers Website`,
      url: enterpriseFound.careerUrl,
      type: 'official-portal'
    });
  }

  return {
    riskScore: finalScore,
    riskCategory,
    summary,
    indicators,
    positiveSignals,
    missingInformation,
    verificationChecklist,
    sourceLinks,
    analysisProvider: 'rule-engine',
    analysisStatus: 'completed'
  };
}
