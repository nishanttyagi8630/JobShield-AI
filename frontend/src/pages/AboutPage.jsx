import React from 'react';
import { 
  ShieldCheck, 
  AlertTriangle, 
  Lock, 
  ExternalLink, 
  PhoneCall, 
  BookOpen, 
  CheckCircle, 
  XCircle,
  HelpCircle,
  Info
} from 'lucide-react';

export default function AboutPage() {
  const commonScams = [
    {
      title: '1. Upfront Registration & Portal Security Fees',
      desc: 'Scammers promise high-paying data entry, coding, or content jobs but ask for a "refundable" registration fee (e.g. ₹999 to ₹2,500) via UPI to activate an employee portal. Once paid, the recruiter vanishes or demands additional gate pass charges.',
      redFlags: ['Mandatory fee before joining', 'Payment to personal UPI handle', 'Urgent 2-hour deadline'],
    },
    {
      title: '2. Telegram / WhatsApp Rating & Liking Tasks',
      desc: 'Victims are asked to subscribe to YouTube channels, rate hotels on Google Maps, or install APK apps for small initial payouts (₹150). They are then lured into Telegram "VIP Crypto/Prepaid Task" groups where thousands of rupees are stolen.',
      redFlags: ['Hiring exclusively on Telegram', 'Promises of ₹3,000–₹5,000 daily for minimal tasks', 'Task prepaid deposits'],
    },
    {
      title: '3. Fake Equipment Reimbursement Cheque Scams',
      desc: 'Candidates receive an impressive offer letter claiming to be from Google or Microsoft. The scammer sends a counterfeit electronic check to buy a laptop from a "specific vendor" and asks the candidate to wire money before the check bounces.',
      redFlags: ['Candidate instructed to buy hardware from specific portal', 'Check deposit instructions', 'Free email like google.desk@gmail.com'],
    },
    {
      title: '4. Endless Unpaid "Evaluation" Internships',
      desc: 'Unregistered entities assign full production-grade development or digital marketing workloads to students under the guise of an "unpaid 4-week trial," only to terminate the candidate without certificate or pay upon project delivery.',
      redFlags: ['No formal offer letter', 'No physical registered office', 'Ambiguous milestone clauses'],
    },
    {
      title: '5. Brand Impersonation & Lookalike Domains',
      desc: 'Fraudsters register lookalike domains like "infosys-careers-portal.site" or "tcs-hiring.xyz" and issue fake appointment letters asking students to submit original educational marksheets or pay training charges.',
      redFlags: ['Domain mismatch with canonical website', 'Free email address from major enterprise', 'Request for original marksheets'],
    },
  ];

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem', maxWidth: '1000px' }}>
      {/* Title */}
      <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
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
          <BookOpen style={{ width: '0.95rem', height: '0.95rem' }} />
          <span>Student Education & Threat Advisory</span>
        </div>
        <h1 style={{ fontSize: '2.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
          About JobShield AI & Scam Prevention Guide
        </h1>
        <p style={{ fontSize: '1rem', color: '#94a3b8', marginTop: '0.5rem', maxWidth: '650px', margin: '0.5rem auto 0 auto' }}>
          Understanding the recruitment fraud landscape, our heuristic evaluation architecture, and official safety practices.
        </p>
      </div>

      {/* Critical System Philosophy & Disclaimer */}
      <div className="glass-card" style={{
        padding: '2rem',
        marginBottom: '2.5rem',
        borderLeft: '4px solid #f59e0b',
        background: 'linear-gradient(135deg, rgba(13, 22, 43, 0.8) 0%, rgba(20, 25, 45, 0.8) 100%)',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.75rem', color: '#f59e0b' }}>
          <AlertTriangle style={{ width: '1.4rem', height: '1.4rem' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            System Scope & Academic Boundaries
          </h2>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9375rem', color: '#cbd5e1', lineHeight: 1.6 }}>
          <p>
            <strong style={{ color: '#ffffff' }}>1. AI Output is an Advisory Assessment, Not Legal Proof: </strong>
            JobShield AI computes a heuristic risk rating based on natural language threat indicators, payment keywords, and domain records. It does NOT possess legal investigatory authority to declare any registered entity fraudulent.
          </p>
          <p>
            <strong style={{ color: '#ffffff' }}>2. Low Risk Does Not Guarantee Legitimacy: </strong>
            Sophisticated threat actors may use clean grammar and avoid obvious payment triggers. A score between 0–24 simply indicates an absence of flagged red flags in the submitted text; it does not replace independent due diligence.
          </p>
          <p>
            <strong style={{ color: '#ffffff' }}>3. High Risk Does Not Prove Malice: </strong>
            Informal early-stage founders or non-profit collectives may lack corporate domains or use informal messaging channels. Such listings receive caution warnings to safeguard students, not as criminal indictments.
          </p>
        </div>
      </div>

      {/* Top 5 Recruitment Scams Educational Guide */}
      <div style={{ marginBottom: '3rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.5rem' }}>
          The Anatomy of Internship Scams
        </h2>
        <p style={{ fontSize: '0.9rem', color: '#94a3b8', marginBottom: '1.5rem' }}>
          Key threat mechanics every engineering, BCA, MCA, and degree student should know:
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          {commonScams.map((scam, i) => (
            <div key={i} className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
                {scam.title}
              </h3>
              <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '0.85rem' }}>
                {scam.desc}
              </p>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.75rem', color: '#ef4444', fontWeight: 700 }}>Red Flags:</span>
                {scam.redFlags.map((rf, rIdx) => (
                  <span
                    key={rIdx}
                    style={{
                      fontSize: '0.75rem',
                      padding: '0.2rem 0.6rem',
                      borderRadius: '0.375rem',
                      background: 'rgba(239, 68, 68, 0.1)',
                      border: '1px solid rgba(239, 68, 68, 0.25)',
                      color: '#f87171',
                    }}
                  >
                    ⚠ {rf}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Official Reporting Helplines (Govt of India & International) */}
      <div className="glass-card" style={{ padding: '2rem', marginBottom: '2.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '1.25rem' }}>
          <PhoneCall style={{ width: '1.35rem', height: '1.35rem', color: '#38bdf8' }} />
          <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Official Incident Reporting Hotlines
          </h2>
        </div>

        <div className="grid-2">
          {/* India Helpline */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '1.25rem',
            borderRadius: '0.625rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
              🇮🇳 India: National Cyber Crime Reporting Portal
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
              Operated by Ministry of Home Affairs (MHA), Government of India for financial cyber fraud.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#10b981', fontWeight: 700 }}>📞 Emergency Helpline: 1930 (Toll-Free)</span>
              <a
                href="https://cybercrime.gov.in"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#38bdf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <ExternalLink style={{ width: '0.85rem', height: '0.85rem' }} /> cybercrime.gov.in
              </a>
            </div>
          </div>

          {/* Ministry of Corporate Affairs */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.6)',
            padding: '1.25rem',
            borderRadius: '0.625rem',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.35rem' }}>
              🏢 Ministry of Corporate Affairs (MCA)
            </h4>
            <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginBottom: '0.75rem' }}>
              Verify company Corporate Identity Number (CIN), registered directors, and active incorporation.
            </p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.85rem' }}>
              <span style={{ color: '#94a3b8' }}>Check active registration status before joining</span>
              <a
                href="https://www.mca.gov.in/mcafoportal/viewCompanyMasterData.do"
                target="_blank"
                rel="noopener noreferrer"
                style={{ color: '#38bdf8', textDecoration: 'none', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
              >
                <ExternalLink style={{ width: '0.85rem', height: '0.85rem' }} /> MCA Master Data Search
              </a>
            </div>
          </div>
        </div>
      </div>

      {/* College Project Architecture Overview */}
      <div className="glass-card" style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
          Technical Architecture: Dual-Engine Verification
        </h2>
        <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.6, marginBottom: '1rem' }}>
          JobShield AI operates a resilient two-tier analysis pipeline. Tier 1 executes a deterministic heuristic engine with 15+ weighted regex patterns for payment keywords, UPI channels, urgency manipulation, and domain mismatch detection. Tier 2 connects via an isolated backend service to configurable LLM endpoints (Gemini / OpenAI) with strict JSON schema validation, ensuring consistent evaluation even during network degradation.
        </p>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.75rem' }}>
          <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', borderRadius: '4px', background: 'rgba(56, 189, 248, 0.1)', color: '#38bdf8', border: '1px solid rgba(56, 189, 248, 0.2)' }}>
            Frontend: React + Vite + Recharts + Lucide
          </span>
          <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', borderRadius: '4px', background: 'rgba(139, 92, 246, 0.1)', color: '#c4b5fd', border: '1px solid rgba(139, 92, 246, 0.2)' }}>
            Backend: Node.js + Express (ES Modules)
          </span>
          <span style={{ fontSize: '0.75rem', padding: '0.3rem 0.65rem', borderRadius: '4px', background: 'rgba(16, 185, 129, 0.1)', color: '#6ee7b7', border: '1px solid rgba(16, 185, 129, 0.2)' }}>
            Database: MongoDB Atlas via Mongoose + Local Fallback
          </span>
        </div>
      </div>
    </div>
  );
}
