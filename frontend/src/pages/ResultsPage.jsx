import React, { useState, useEffect } from 'react';
import { useParams, useLocation, Link, useNavigate } from 'react-router-dom';
import { 
  ShieldCheck, 
  AlertTriangle, 
  ArrowLeft, 
  Copy, 
  Printer, 
  ExternalLink, 
  Building2, 
  Globe, 
  FileCheck, 
  History, 
  Check, 
  AlertOctagon,
  Sparkles,
  Info
} from 'lucide-react';
import { api } from '../services/api';
import RiskGauge from '../components/RiskGauge';
import IndicatorCard from '../components/IndicatorCard';
import VerificationChecklist from '../components/VerificationChecklist';

export default function ResultsPage() {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  const [record, setRecord] = useState(location.state?.record || null);
  const [loading, setLoading] = useState(!record);
  const [error, setError] = useState(null);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (!record && id) {
      setLoading(true);
      api.getAnalysisById(id)
        .then((res) => {
          if (res.success && res.data) {
            setRecord(res.data);
          } else {
            setError('Record not found');
          }
        })
        .catch((err) => setError(err.message || 'Failed to load analysis report'))
        .finally(() => setLoading(false));
    }
  }, [id, record]);

  const handleCopySummary = () => {
    if (!record) return;
    const textToCopy = `JobShield AI Security Assessment:
Company: ${record.companyName}
Risk Score: ${record.riskScore}/100 (${record.riskCategory})
Summary: ${record.summary}
Indicators Flagged: ${record.indicators?.length || 0}
Assessed on: ${new Date(record.createdAt).toLocaleString()}
Disclaimer: This is an AI threat assessment, not definitive legal proof.`;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '6rem 1.25rem', textAlign: 'center' }}>
        <div style={{
          width: '3.5rem',
          height: '3.5rem',
          border: '3px solid rgba(56, 189, 248, 0.2)',
          borderTopColor: '#38bdf8',
          borderRadius: '50%',
          animation: 'spin 1s linear infinite',
          margin: '0 auto 1.5rem auto',
        }} />
        <h2 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Compiling Security Intelligence Report...</h2>
        <p style={{ color: '#94a3b8' }}>Evaluating heuristic threat indicators and domain authenticity.</p>
      </div>
    );
  }

  if (error || !record) {
    return (
      <div className="container" style={{ padding: '4rem 1.25rem', textAlign: 'center' }}>
        <div className="glass-card" style={{ padding: '3rem', maxWidth: '600px', margin: '0 auto' }}>
          <AlertOctagon style={{ width: '3rem', height: '3rem', color: '#ef4444', margin: '0 auto 1rem auto' }} />
          <h2 style={{ color: '#ffffff', marginBottom: '0.75rem' }}>Report Not Found</h2>
          <p style={{ color: '#94a3b8', marginBottom: '1.75rem' }}>
            {error || 'The requested analysis record could not be loaded.'}
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
            <Link to="/analyze" className="btn btn-primary">Analyze an Offer</Link>
            <Link to="/history" className="btn btn-secondary">View History</Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: '1100px' }}>
      {/* Top Breadcrumb & Actions Bar */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <button
          onClick={() => navigate(-1)}
          className="btn btn-secondary"
          style={{ padding: '0.5rem 0.85rem', fontSize: '0.8125rem' }}
        >
          <ArrowLeft style={{ width: '0.9rem', height: '0.9rem' }} /> Back
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={handleCopySummary}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.8125rem' }}
          >
            {copied ? <Check style={{ width: '0.9rem', height: '0.9rem', color: '#10b981' }} /> : <Copy style={{ width: '0.9rem', height: '0.9rem' }} />}
            {copied ? 'Copied Assessment!' : 'Copy Summary'}
          </button>
          <button
            onClick={handlePrint}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 0.85rem', fontSize: '0.8125rem' }}
          >
            <Printer style={{ width: '0.9rem', height: '0.9rem' }} /> Print / Export
          </button>
          <Link to="/analyze" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.8125rem' }}>
            Scan Another Offer
          </Link>
        </div>
      </div>

      {/* Hero Overview Card: Risk Gauge & Executive Summary */}
      <div className="glass-card" style={{
        padding: '2.25rem',
        marginBottom: '2rem',
        background: 'linear-gradient(135deg, rgba(13, 22, 43, 0.85) 0%, rgba(18, 30, 58, 0.75) 100%)',
        position: 'relative',
        overflow: 'hidden',
      }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
          gap: '2.5rem',
          alignItems: 'center',
        }}>
          {/* Gauge Column */}
          <div style={{ display: 'flex', justifyContent: 'center' }}>
            <RiskGauge score={record.riskScore} category={record.riskCategory} size={210} />
          </div>

          {/* Details Column */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                Official Threat Assessment
              </span>
              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>•</span>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Mode: {record.analysisProvider === 'gemini' ? 'AI + Heuristics' : 'Deterministic Rule Engine'}
              </span>
            </div>

            <h1 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
              {record.companyName || 'Unspecified Entity'}
            </h1>

            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.65rem', marginBottom: '1.25rem' }}>
              <span style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '0.375rem',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#cbd5e1',
                textTransform: 'capitalize',
              }}>
                📄 {record.inputType?.replace('_', ' ')}
              </span>
              {record.companyWebsite && (
                <span style={{
                  fontSize: '0.75rem',
                  padding: '0.2rem 0.55rem',
                  borderRadius: '0.375rem',
                  background: 'rgba(56, 189, 248, 0.08)',
                  color: '#38bdf8',
                }}>
                  🌐 {record.companyWebsite}
                </span>
              )}
              <span style={{
                fontSize: '0.75rem',
                padding: '0.2rem 0.55rem',
                borderRadius: '0.375rem',
                background: 'rgba(255, 255, 255, 0.05)',
                color: '#94a3b8',
              }}>
                🕒 {new Date(record.createdAt).toLocaleDateString()}
              </span>
            </div>

            {/* Plain-Language Summary Box */}
            <div style={{
              background: 'rgba(5, 10, 20, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              borderRadius: '0.625rem',
              padding: '1rem 1.15rem',
              fontSize: '0.9375rem',
              color: '#e2e8f0',
              lineHeight: 1.6,
            }}>
              {record.summary}
            </div>
          </div>
        </div>
      </div>

      {/* Official Company Verification Status Card */}
      {record.companyVerification && (
        <div className="glass-card" style={{
          padding: '1.5rem',
          marginBottom: '2rem',
          borderLeft: record.companyVerification.flaggedDomainMismatch
            ? '4px solid #ef4444'
            : record.companyVerification.officialSourceFound
            ? '4px solid #10b981'
            : '4px solid #f59e0b',
        }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', flexWrap: 'wrap' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
              <div style={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '0.5rem',
                background: record.companyVerification.flaggedDomainMismatch
                  ? 'rgba(239, 68, 68, 0.15)'
                  : record.companyVerification.officialSourceFound
                  ? 'rgba(16, 185, 129, 0.15)'
                  : 'rgba(245, 158, 11, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Building2 style={{
                  width: '1.25rem',
                  height: '1.25rem',
                  color: record.companyVerification.flaggedDomainMismatch
                    ? '#ef4444'
                    : record.companyVerification.officialSourceFound
                    ? '#10b981'
                    : '#f59e0b',
                }} />
              </div>
              <div>
                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                  Corporate Identity & Official Source Check
                </h3>
                <span style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                  Cross-referenced against verified enterprise domains and registry records.
                </span>
              </div>
            </div>

            <span style={{
              fontSize: '0.75rem',
              fontWeight: 700,
              padding: '0.3rem 0.75rem',
              borderRadius: '9999px',
              background: record.companyVerification.flaggedDomainMismatch
                ? 'rgba(239, 68, 68, 0.15)'
                : record.companyVerification.officialSourceFound
                ? 'rgba(16, 185, 129, 0.15)'
                : 'rgba(245, 158, 11, 0.15)',
              color: record.companyVerification.flaggedDomainMismatch
                ? '#ef4444'
                : record.companyVerification.officialSourceFound
                ? '#10b981'
                : '#f59e0b',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}>
              {record.companyVerification.flaggedDomainMismatch
                ? 'Lookalike Domain Warning'
                : record.companyVerification.officialSourceFound
                ? 'Official Source Established'
                : 'Unverified Entity'}
            </span>
          </div>

          <p style={{ fontSize: '0.875rem', color: '#cbd5e1', marginTop: '1rem', lineHeight: 1.6 }}>
            {record.companyVerification.verificationNotes}
          </p>

          {record.companyVerification.sourceUrl && (
            <div style={{ marginTop: '0.75rem' }}>
              <a
                href={record.companyVerification.sourceUrl}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: '0.35rem',
                  fontSize: '0.8125rem',
                  color: '#38bdf8',
                  textDecoration: 'none',
                }}
              >
                <ExternalLink style={{ width: '0.85rem', height: '0.85rem' }} />
                Open Verified Careers Portal: {record.companyVerification.sourceUrl}
              </a>
            </div>
          )}
        </div>
      )}

      {/* Flagged Threat Indicators Section */}
      <div style={{ marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
          <div>
            <h2 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
              Flagged Warning Indicators ({record.indicators?.length || 0})
            </h2>
            <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
              Exact evidence snippets, risk explanations, and immediate counter-measures.
            </p>
          </div>
        </div>

        {record.indicators && record.indicators.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
            {record.indicators.map((ind, i) => (
              <IndicatorCard key={ind._id || i} indicator={ind} />
            ))}
          </div>
        ) : (
          <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', color: '#10b981' }}>
            <ShieldCheck style={{ width: '2.5rem', height: '2.5rem', margin: '0 auto 0.75rem auto' }} />
            <h3 style={{ color: '#ffffff', marginBottom: '0.35rem' }}>No Major Threat Indicators Flagged</h3>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
              The submitted text did not trigger any upfront fee demands, lookalike domain alerts, or known scam signatures.
            </p>
          </div>
        )}
      </div>

      {/* Positive Signals & Missing Information Grid */}
      <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
        {/* Positive Signals */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#10b981' }}>
            <ShieldCheck style={{ width: '1.2rem', height: '1.2rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
              Positive Reassuring Signals
            </h3>
          </div>
          {record.positiveSignals && record.positiveSignals.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {record.positiveSignals.map((sig, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
                  <span style={{ color: '#10b981', fontWeight: 700 }}>✓</span>
                  <span>{sig}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: '0.875rem', color: '#64748b' }}>
              No explicit protective clauses (such as corporate zero-fee notices or formal assessment portals) were found in the text.
            </p>
          )}
        </div>

        {/* Missing Information */}
        <div className="glass-card" style={{ padding: '1.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem', color: '#f59e0b' }}>
            <AlertTriangle style={{ width: '1.2rem', height: '1.2rem' }} />
            <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
              Missing or Unverifiable Details
            </h3>
          </div>
          {record.missingInformation && record.missingInformation.length > 0 ? (
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {record.missingInformation.map((mis, i) => (
                <li key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: '0.5rem', fontSize: '0.875rem', color: '#cbd5e1' }}>
                  <span style={{ color: '#f59e0b', fontWeight: 700 }}>•</span>
                  <span>{mis}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p style={{ fontSize: '0.875rem', color: '#10b981' }}>
              All essential parameters (registered office, website, clear job specifications) were detected in the submission.
            </p>
          )}
        </div>
      </div>

      {/* Interactive Candidate Verification Checklist */}
      <div style={{ marginBottom: '2.5rem' }}>
        <VerificationChecklist initialItems={record.verificationChecklist || []} />
      </div>

      {/* Official Reporting Resources Links */}
      {record.sourceLinks && record.sourceLinks.length > 0 && (
        <div className="glass-card" style={{ padding: '1.75rem', marginBottom: '2.5rem' }}>
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
            Verified Authorities & Reporting Resources
          </h3>
          <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '1.25rem' }}>
            If you suspect this offer is fraudulent or financial demands have been made, refer to these authorized portals:
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '0.75rem' }}>
            {record.sourceLinks.map((link, idx) => (
              <a
                key={idx}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0.75rem 1rem',
                  borderRadius: '0.5rem',
                  background: 'rgba(15, 23, 42, 0.6)',
                  border: '1px solid rgba(255, 255, 255, 0.08)',
                  color: '#38bdf8',
                  textDecoration: 'none',
                  fontSize: '0.875rem',
                  transition: 'all 0.15s ease',
                }}
                onMouseOver={(e) => (e.currentTarget.style.borderColor = '#38bdf8')}
                onMouseOut={(e) => (e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)')}
              >
                <span>{link.label}</span>
                <ExternalLink style={{ width: '0.9rem', height: '0.9rem', flexShrink: 0 }} />
              </a>
            ))}
          </div>
        </div>
      )}

      {/* Mandatory Academic Disclaimer Box */}
      <div style={{
        background: 'rgba(15, 23, 42, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
        borderRadius: '0.75rem',
        padding: '1.25rem',
        display: 'flex',
        alignItems: 'flex-start',
        gap: '0.75rem',
        marginBottom: '2rem',
      }}>
        <Info style={{ width: '1.25rem', height: '1.25rem', color: '#94a3b8', flexShrink: 0, marginTop: '0.15rem' }} />
        <div style={{ fontSize: '0.8125rem', color: '#94a3b8', lineHeight: 1.5 }}>
          <strong style={{ color: '#ffffff' }}>Important Academic Evaluation Notice: </strong>
          JobShield AI scores are heuristic advisory ratings calculated from textual signals and domain patterns. An AI prediction does NOT constitute legal evidence of crime or fraud, nor does a low score constitute an absolute guarantee of safety. When in doubt, always consult your college Training & Placement Cell.
        </div>
      </div>

      {/* Bottom Navigation Actions */}
      <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
        <Link to="/analyze" className="btn btn-primary" style={{ padding: '0.75rem 1.75rem' }}>
          Analyze Another Recruitment Offer
        </Link>
        <Link to="/history" className="btn btn-secondary" style={{ padding: '0.75rem 1.75rem' }}>
          <History style={{ width: '1.1rem', height: '1.1rem' }} />
          View All Saved Reports
        </Link>
      </div>
    </div>
  );
}
