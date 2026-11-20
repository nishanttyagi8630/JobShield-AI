import { test, describe, before, after } from 'node:test';
import assert from 'node:assert/strict';
import app from '../src/app.js';

let server;
let baseUrl = '';

describe('JobShield AI - Backend REST API Integration Tests', () => {
  before(async () => {
    await new Promise((resolve) => {
      server = app.listen(0, () => {
        const port = server.address().port;
        baseUrl = `http://127.0.0.1:${port}`;
        resolve();
      });
    });
  });

  after(async () => {
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  test('GET /api/health should return 200 with service health info', async () => {
    const res = await fetch(`${baseUrl}/api/health`);
    assert.equal(res.status, 200);
    const data = await res.json();
    assert.equal(data.status, 'healthy');
    assert.ok(data.database);
    assert.ok(data.service.includes('JobShield'));
  });

  test('POST /api/analyze should reject empty text with 400', async () => {
    const res = await fetch(`${baseUrl}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submittedText: '' })
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.ok(data.message.includes('required'));
  });

  test('POST /api/analyze should reject too-short text (<20 chars) with 400', async () => {
    const res = await fetch(`${baseUrl}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ submittedText: 'Short text' })
    });
    assert.equal(res.status, 400);
    const data = await res.json();
    assert.equal(data.success, false);
    assert.ok(data.message.includes('too short'));
  });

  let createdId = null;

  test('POST /api/analyze should analyze and persist valid recruitment text', async () => {
    const payload = {
      inputType: 'internship_offer',
      companyName: 'Apex Data Services',
      companyWebsite: 'https://apex-fastjobs.site',
      recruiterContact: 'hr@apex-fastjobs.site',
      submittedText: `Immediate selection for Data Entry Internship! Pay Rs 1,499 registration fee to UPI hr@okaxis. Hurry offer expires in 2 hours.`
    };

    const res = await fetch(`${baseUrl}/api/analyze`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    assert.equal(res.status, 201);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.data._id);
    assert.equal(json.data.riskCategory, 'Critical');
    assert.ok(json.data.riskScore >= 75);
    createdId = json.data._id;
  });

  test('GET /api/analyses should return paginated list of analyses', async () => {
    const res = await fetch(`${baseUrl}/api/analyses?page=1&limit=5`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(Array.isArray(json.data));
    assert.ok(json.pagination);
    assert.ok(json.pagination.total >= 1);
  });

  test('GET /api/analyses/:id should return single record for valid ID', async () => {
    assert.ok(createdId, 'Must have a createdId');
    const res = await fetch(`${baseUrl}/api/analyses/${createdId}`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data._id, createdId);
  });

  test('GET /api/analyses/:id should return 404 for non-existent ID', async () => {
    const res = await fetch(`${baseUrl}/api/analyses/non_existent_id_9999`);
    assert.equal(res.status, 404);
  });

  test('GET /api/stats should return dashboard summary statistics', async () => {
    const res = await fetch(`${baseUrl}/api/stats`);
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.ok(json.data.total >= 1);
    assert.ok(typeof json.data.lowRisk === 'number');
    assert.ok(typeof json.data.criticalRisk === 'number');
  });

  test('POST /api/verify-company should return verification details', async () => {
    const res = await fetch(`${baseUrl}/api/verify-company`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ companyName: 'Infosys Limited' })
    });

    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);
    assert.equal(json.data.isVerified, true);
    assert.equal(json.data.officialName, 'Infosys Limited');
  });

  test('DELETE /api/analyses/:id should delete record', async () => {
    assert.ok(createdId, 'Must have a createdId');
    const res = await fetch(`${baseUrl}/api/analyses/${createdId}`, {
      method: 'DELETE'
    });
    assert.equal(res.status, 200);
    const json = await res.json();
    assert.equal(json.success, true);

    // Verify it is gone
    const verifyRes = await fetch(`${baseUrl}/api/analyses/${createdId}`);
    assert.equal(verifyRes.status, 404);
  });
});
