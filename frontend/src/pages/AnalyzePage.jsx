import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  ShieldAlert, 
  Search, 
  AlertCircle, 
  Lock, 
  Sparkles, 
  FileText, 
  Building2, 
  Globe, 
  Mail, 
  CheckCircle2, 
  X
} from 'lucide-react';
import { api } from '../services/api';
import { SAMPLE_CASES } from '../utils/sampleCases';

export default function AnalyzePage() {
  const navigate = useNavigate();

  const [inputType, setInputType] = useState('job_posting');
  const [submittedText, setSubmittedText] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [companyWebsite, setCompanyWebsite] = useState('');
  const [recruiterContact, setRecruiterContact] = useState('');

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [activeSampleId, setActiveSampleId] = useState(null);

  const inputTypes = [
    { id: 'job_posting', label: 'Job Posting' },
    { id: 'internship_offer', label: 'Internship Offer' },
    { id: 'recruiter_message', label: 'Recruiter Message (WhatsApp/SMS)' },
    { id: 'email', label: 'Recruitment Email' },
    { id: 'offer_letter', label: 'Appointment / Offer Letter' },
  ];

  const handleLoadSample = (sample) => {
    setActiveSampleId(sample.id);
    setInputType(sample.inputType);
    setCompanyName(sample.companyName);
    setCompanyWebsite(sample.companyWebsite);
    setRecruiterContact(sample.recruiterContact);
    setSubmittedText(sample.submittedText);
    setError(null);
  };

  const handleClear = () => {
    setActiveSampleId(null);
    setSubmittedText('');
    setCompanyName('');
    setCompanyWebsite('');
    setRecruiterContact('');
    setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!submittedText.trim()) {
      setError('Please paste the recruitment text or select a sample offer below.');
      return;
    }

    if (submittedText.trim().length < 20) {
      setError('The submitted text is too short. Please provide at least 20 characters for meaningful analysis.');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      const response = await api.analyzeOffer({
        inputType,
        submittedText,
        companyName,
        companyWebsite,
        recruiterContact,
      });

      if (response.success && response.data?._id) {
        navigate(`/results/${response.data._id}`, { state: { record: response.data } });
      } else {
        throw new Error('Analysis completed but failed to receive a valid report ID.');
      }
    } catch (err) {
      setError(err.message || 'Error occurred while performing security scan. Please check backend connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: '1000px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
        <div style={{
          display: 'inline-flex',
          alignItems: 'center',
          gap: '0.4rem',
          padding: '0.35rem 0.85rem',
          borderRadius: '9999px',
          background: 'rgba(56, 189, 248, 0.1)',
          border: '1px solid rgba(56, 189, 248, 0.25)',
          color: '#38bdf8',
          fontSize: '0.8125rem',
          fontWeight: 700,
          marginBottom: '0.75rem',
        }}>
          <Sparkles style={{ width: '0.95rem', height: '0.95rem' }} />
          <span>Heuristic & AI Threat Scanner</span>
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          Analyze a Job or Internship Offer
        </h1>
        <p style={{ fontSize: '1rem', color: '#94a3b8', marginTop: '0.5rem' }}>
          Paste suspicious emails, recruitment messages, or offer letters to detect advance-fee fraud and brand impersonations.
        </p>
      </div>

      {/* Safety Notice Banner */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.75)',
        border: '1px solid rgba(56, 189, 248, 0.2)',
        borderRadius: '0.75rem',
        padding: '1rem 1.25rem',
        display: 'flex',
        alignItems: 'center',
        gap: '0.85rem',
        marginBottom: '2rem',
      }}>
        <Lock style={{ width: '1.25rem', height: '1.25rem', color: '#38bdf8', flexShrink: 0 }} />
        <div style={{ fontSize: '0.8125rem', color: '#cbd5e1', lineHeight: 1.5 }}>
          <strong style={{ color: '#ffffff' }}>Privacy & Data Safety Notice: </strong>
          JobShield AI does not store your private credentials. Before pasting, please redact sensitive confidential numbers like your bank account, ATM PIN, or Aadhaar/SSN.
        </div>
      </div>

      {/* 1-Click Sample Pre-Loaders */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.85rem' }}>
          <span style={{ fontSize: '0.875rem', fontWeight: 700, color: '#ffffff' }}>
            ⚡ Quick Test Samples (Click to load fictional scenarios):
          </span>
          {activeSampleId && (
            <button
              type="button"
              onClick={handleClear}
              style={{
                background: 'transparent',
                border: 'none',
                color: '#ef4444',
                fontSize: '0.75rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.2rem',
              }}
            >
              <X style={{ width: '0.8rem', height: '0.8rem' }} /> Clear Inputs
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
          {SAMPLE_CASES.map((sample) => (
            <button
              key={sample.id}
              type="button"
              onClick={() => handleLoadSample(sample)}
              style={{
                padding: '0.45rem 0.85rem',
                borderRadius: '0.5rem',
                fontSize: '0.775rem',
                fontWeight: 600,
                border: activeSampleId === sample.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                background: activeSampleId === sample.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(15, 23, 42, 0.6)',
                color: activeSampleId === sample.id ? '#ffffff' : '#94a3b8',
                cursor: 'pointer',
                transition: 'all 0.15s ease',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.4rem',
              }}
            >
              <span className={sample.badgeClass} style={{
                fontSize: '0.65rem',
                padding: '0.1rem 0.35rem',
                borderRadius: '4px',
                fontWeight: 700,
              }}>
                {sample.badge.split(' ')[0]}
              </span>
              <span>{sample.title}</span>
            </button>
          ))}
        </div>
      </div>

      {/* Main Analysis Form */}
      <form onSubmit={handleSubmit} className="glass-card" style={{ padding: '2rem', position: 'relative' }}>
        {loading && <div className="scanner-line" />}

        {error && (
          <div style={{
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.3)',
            color: '#ef4444',
            padding: '0.85rem 1.15rem',
            borderRadius: '0.625rem',
            marginBottom: '1.5rem',
            display: 'flex',
            alignItems: 'center',
            gap: '0.65rem',
            fontSize: '0.875rem',
          }}>
            <AlertCircle style={{ width: '1.25rem', height: '1.25rem', flexShrink: 0 }} />
            <span>{error}</span>
          </div>
        )}

        {/* Input Type Selector */}
        <div style={{ marginBottom: '1.5rem' }}>
          <label style={{ display: 'block', fontSize: '0.875rem', fontWeight: 700, color: '#cbd5e1', marginBottom: '0.6rem' }}>
            Recruitment Content Type
          </label>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem' }}>
            {inputTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                onClick={() => setInputType(type.id)}
                style={{
                  padding: '0.55rem 1rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.8125rem',
                  fontWeight: 600,
                  cursor: 'pointer',
                  border: inputType === type.id ? '1px solid #38bdf8' : '1px solid rgba(255, 255, 255, 0.08)',
                  background: inputType === type.id ? 'rgba(56, 189, 248, 0.15)' : 'rgba(10, 16, 31, 0.6)',
                  color: inputType === type.id ? '#ffffff' : '#94a3b8',
                  transition: 'all 0.15s ease',
                }}
              >
                {type.label}
              </button>
            ))}
          </div>
        </div>

        {/* Paste Offer Textarea */}
        <div style={{ marginBottom: '1.5rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 700, color: '#cbd5e1' }}>
              Paste Recruitment Text / Offer Description *
            </label>
            <span style={{ fontSize: '0.75rem', color: submittedText.length > 15000 ? '#ef4444' : '#64748b' }}>
              {submittedText.length} / 15,000 characters
            </span>
          </div>
          <textarea
            className="input-control"
            rows={9}
            placeholder="Paste the full recruitment text here... (e.g. Email body, WhatsApp interview message, stipend details, UPI payment demands, or appointment letter text)"
            value={submittedText}
            onChange={(e) => setSubmittedText(e.target.value)}
            disabled={loading}
          />
        </div>

        {/* Optional Metadata Grid */}
        <div className="grid-3" style={{ marginBottom: '2rem' }}>
          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>
              <Building2 style={{ width: '0.9rem', height: '0.9rem' }} /> Company Name (Optional)
            </label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. Google, TCS, Acme Ltd"
              value={companyName}
              onChange={(e) => setCompanyName(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>
              <Globe style={{ width: '0.9rem', height: '0.9rem' }} /> Company Website (Optional)
            </label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. https://company.com"
              value={companyWebsite}
              onChange={(e) => setCompanyWebsite(e.target.value)}
              disabled={loading}
            />
          </div>

          <div>
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.8125rem', fontWeight: 600, color: '#94a3b8', marginBottom: '0.4rem' }}>
              <Mail style={{ width: '0.9rem', height: '0.9rem' }} /> Recruiter Contact (Optional)
            </label>
            <input
              type="text"
              className="input-control"
              placeholder="e.g. hr@company.com or phone"
              value={recruiterContact}
              onChange={(e) => setRecruiterContact(e.target.value)}
              disabled={loading}
            />
          </div>
        </div>

        {/* Submit Button */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end', gap: '1rem' }}>
          <button
            type="button"
            onClick={handleClear}
            className="btn btn-secondary"
            disabled={loading}
          >
            Clear Form
          </button>
          <button
            type="submit"
            className="btn btn-primary"
            disabled={loading}
            style={{ padding: '0.75rem 1.75rem', fontSize: '1rem' }}
          >
            {loading ? (
              <>
                <div style={{
                  width: '1.1rem',
                  height: '1.1rem',
                  border: '2px solid rgba(255,255,255,0.3)',
                  borderTopColor: '#ffffff',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite',
                }} />
                Scanning Threat Vectors...
              </>
            ) : (
              <>
                <Search style={{ width: '1.1rem', height: '1.1rem' }} />
                Run Threat Analysis
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
}
