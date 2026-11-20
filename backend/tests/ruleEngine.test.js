import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { analyzeRecruitmentText } from '../src/services/ruleEngine.js';

describe('JobShield AI - Rule Engine Detection Tests', () => {
  test('should detect upfront registration fee scam as Critical risk', () => {
    const scamText = `URGENT: Selected for Data Entry Internship. Weekly stipend Rs 25,000. 
    You must pay a mandatory Refundable Registration Fee of Rs 1,499 to UPI ID hr@okhdfcbank before joining. Offer expires in 2 hours!`;

    const result = analyzeRecruitmentText({
      submittedText: scamText,
      inputType: 'internship_offer',
      companyName: 'Apex Data Services'
    });

    assert.equal(result.riskCategory, 'Critical');
    assert.ok(result.riskScore >= 75, `Expected score >= 75, got ${result.riskScore}`);

    const feeIndicator = result.indicators.find(i => i.name.includes('Payment') || i.name.includes('Deposit'));
    assert.ok(feeIndicator, 'Should flag payment/deposit demand indicator');
    assert.equal(feeIndicator.severity, 'Critical');

    const upiIndicator = result.indicators.find(i => i.name.includes('UPI') || i.name.includes('Transfer'));
    assert.ok(upiIndicator, 'Should flag suspicious UPI channel');
  });

  test('should detect brand impersonation with free email domain', () => {
    const impersonationText = `Congratulations! You are selected as Software Engineer at Google.
    Send your documents to recruitment.google.desk@gmail.com within 24 hours.`;

    const result = analyzeRecruitmentText({
      submittedText: impersonationText,
      inputType: 'offer_letter',
      companyName: 'Google',
      recruiterContact: 'recruitment.google.desk@gmail.com'
    });

    assert.ok(result.riskScore >= 50, `Expected score >= 50, got ${result.riskScore}`);
    const impersonationInd = result.indicators.find(i => i.name.includes('Brand Impersonation') || i.name.includes('Free Email'));
    assert.ok(impersonationInd, 'Should flag brand impersonation with free email');
  });

  test('should evaluate legitimate enterprise campus drive as Low risk', () => {
    const legitimateText = `Infosys Off-Campus Recruitment 2026.
    Role: Specialist Programmer. Selection Process: Online Coding Assessment on HackerEarth followed by Technical Interview.
    Infosys never charges any fee at any stage of the recruitment process. Register on official portal at https://careers.infosys.com/jobseeker`;

    const result = analyzeRecruitmentText({
      submittedText: legitimateText,
      inputType: 'job_posting',
      companyName: 'Infosys Limited',
      companyWebsite: 'https://careers.infosys.com'
    });

    assert.equal(result.riskCategory, 'Low');
    assert.ok(result.riskScore <= 25, `Expected score <= 25, got ${result.riskScore}`);
    assert.ok(result.positiveSignals.length > 0, 'Should detect positive protective signals');
  });

  test('should handle ambiguous startup listing with moderate caution', () => {
    const ambiguousText = `Early stage stealth startup looking for React intern.
    Unpaid for the first 4 weeks during evaluation period. Message on Telegram @stealth_cto with your GitHub portfolio.`;

    const result = analyzeRecruitmentText({
      submittedText: ambiguousText,
      inputType: 'internship_offer',
      companyName: 'Stealth AI'
    });

    assert.ok(result.riskCategory === 'Moderate' || result.riskCategory === 'High');
    const telegramInd = result.indicators.find(i => i.name.includes('Telegram'));
    assert.ok(telegramInd, 'Should flag Telegram recruitment channel');
  });
});
