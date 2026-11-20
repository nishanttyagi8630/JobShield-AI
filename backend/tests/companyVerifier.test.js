import { test, describe } from 'node:test';
import assert from 'node:assert/strict';
import { verifyCompanyIdentity, normalizeDomain } from '../src/services/companyVerifier.js';

describe('JobShield AI - Company Verification Service Tests', () => {
  test('should normalize domains properly', () => {
    assert.equal(normalizeDomain('https://www.google.com/careers/index.html'), 'google.com');
    assert.equal(normalizeDomain('http://tcs.com:8080/jobs'), 'tcs.com');
    assert.equal(normalizeDomain('careers.microsoft.com/'), 'careers.microsoft.com');
  });

  test('should establish official source for known enterprises', () => {
    const verified = verifyCompanyIdentity({
      companyName: 'Infosys Limited',
      companyWebsite: 'https://careers.infosys.com'
    });

    assert.equal(verified.status, 'official_source_found');
    assert.equal(verified.officialSourceFound, true);
    assert.equal(verified.isVerified, true);
    assert.equal(verified.canonicalDomain, 'infosys.com');
    assert.ok(verified.sourceLinks.length > 0);
  });

  test('should detect domain mismatch / lookalike spoofing', () => {
    const spoofAttempt = verifyCompanyIdentity({
      companyName: 'Google',
      companyWebsite: 'http://google-careers-portal-india.xyz',
      recruiterContact: 'google.hr@fake-domain.xyz'
    });

    assert.equal(spoofAttempt.status, 'domain_mismatch_warning');
    assert.equal(spoofAttempt.flaggedDomainMismatch, true);
    assert.equal(spoofAttempt.isVerified, false);
    assert.ok(spoofAttempt.verificationNotes.includes('Potential Domain Impersonation'));
  });

  test('should gracefully handle unverified companies without fabricating data', () => {
    const unverified = verifyCompanyIdentity({
      companyName: 'XYZ Local Digital Media Pvt Ltd',
      companyWebsite: 'https://xyzlocalrandom.in'
    });

    assert.equal(unverified.status, 'unverified_entity');
    assert.equal(unverified.isVerified, false);
    assert.equal(unverified.officialSourceFound, false);
    assert.ok(unverified.safeManualSteps.length > 0);
  });
});
