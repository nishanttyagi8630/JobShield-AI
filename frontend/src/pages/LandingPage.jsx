import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Shield, 
  Search, 
  AlertTriangle, 
  CheckCircle, 
  ArrowRight, 
  Zap, 
  Lock, 
  FileText, 
  Eye, 
  Award,
  ExternalLink
} from 'lucide-react';

export default function LandingPage() {
  const threatFeatures = [
    {
      title: 'Upfront Registration Fee Traps',
      desc: 'Detects illegal demands for registration fees, training charges, laptop deposits, or refundable fees via UPI/GPay.',
      icon: AlertTriangle,
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.1)',
    },
    {
      title: 'Brand Impersonation & Lookalikes',
      desc: 'Identifies spoofed domains and scammers posing as Google, Infosys, or TCS using free @gmail.com or fraudulent portals.',
      icon: Lock,
      color: '#f97316',
      bg: 'rgba(249, 115, 22, 0.1)',
    },
    {
      title: 'Telegram & WhatsApp Task Scams',
      desc: 'Flags suspicious anonymous recruitment channels demanding video likes, app reviews, or daily crypto/UPI payouts.',
      icon: Zap,
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
    },
    {
      title: 'Explainable Risk Scoring (0–100)',
      desc: 'Produces transparent, evidence-backed heuristic risk ratings with exact quoted text snippets and verification action items.',
      icon: Award,
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.1)',
    },
  ];

  const steps = [
    {
      num: '01',
      title: 'Paste Recruitment Message',
      desc: 'Copy the job description, WhatsApp message, email, or appointment letter you received.',
    },
    {
      num: '02',
      title: 'AI & Heuristic Security Scan',
      desc: 'JobShield cross-examines 15+ scam signals, verified corporate registries, and domain authenticity.',
    },
    {
      num: '03',
      title: 'Get Explainable Risk Report',
      desc: 'Receive an immediate 0-100 risk score, flagged evidence excerpts, and a candidate safety checklist.',
    },
  ];

  return (
    <div>
      {/* Hero Section */}
      <section style={{
        position: 'relative',
        padding: '5rem 0 4rem 0',
        overflow: 'hidden',
        textAlign: 'center',
      }}>
        <div className="container" style={{ position: 'relative', zIndex: 10 }}>
          {/* Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '0.5rem',
            padding: '0.4rem 1rem',
            borderRadius: '9999px',
            background: 'rgba(56, 189, 248, 0.1)',
            border: '1px solid rgba(56, 189, 248, 0.25)',
            color: '#38bdf8',
            fontSize: '0.8125rem',
            fontWeight: 700,
            marginBottom: '1.75rem',
          }}>
            <Shield style={{ width: '1rem', height: '1rem' }} />
            <span>AI-Powered Recruitment Threat Defense for Students</span>
          </div>

          {/* Heading */}
          <h1 style={{
            fontSize: 'clamp(2.5rem, 5vw, 4.25rem)',
            fontWeight: 800,
            lineHeight: 1.15,
            letterSpacing: '-0.03em',
            marginBottom: '1.5rem',
            maxWidth: '900px',
            margin: '0 auto 1.5rem auto',
          }}>
            Verify Before You Trust. <br />
            <span style={{
              background: 'linear-gradient(135deg, #38bdf8 0%, #8b5cf6 50%, #ec4899 100%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}>
              Detect Fake Jobs & Internship Scams.
            </span>
          </h1>

          {/* Subheading */}
          <p style={{
            fontSize: '1.125rem',
            color: '#94a3b8',
            maxWidth: '680px',
            margin: '0 auto 2.25rem auto',
            lineHeight: 1.6,
          }}>
            Every year, thousands of college students lose money and personal credentials to fake placement drives and registration fee traps. JobShield AI analyzes offer details to expose hidden scam indicators before you pay or share documents.
          </p>

          {/* CTA Buttons */}
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap' }}>
            <Link to="/analyze" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              <Search style={{ width: '1.15rem', height: '1.15rem' }} />
              Analyze an Offer Free
            </Link>
            <Link to="/dashboard" className="btn btn-secondary" style={{ padding: '0.85rem 1.75rem', fontSize: '1rem' }}>
              <Eye style={{ width: '1.15rem', height: '1.15rem' }} />
              View Threat Dashboard
            </Link>
          </div>

          {/* Mini Stats Bar */}
          <div style={{
            marginTop: '3.5rem',
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '1.25rem',
            maxWidth: '850px',
            margin: '3.5rem auto 0 auto',
          }}>
            {[
              { val: '100% Free', label: 'Engineered for Students' },
              { val: '15+ Signals', label: 'Heuristic Threat Rules' },
              { val: '0–100 Score', label: 'Explainable Risk Metrics' },
              { val: 'Local Fallback', label: '100% Offline Capable' },
            ].map((stat, i) => (
              <div key={i} className="glass-card" style={{ padding: '1.1rem', textAlign: 'center' }}>
                <div style={{ fontSize: '1.5rem', fontWeight: 800, color: '#38bdf8', marginBottom: '0.2rem' }}>
                  {stat.val}
                </div>
                <div style={{ fontSize: '0.8125rem', color: '#94a3b8' }}>
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Threat Defense Capabilities */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
              Scam Vectors Analyzed by JobShield AI
            </h2>
            <p style={{ fontSize: '1rem', color: '#94a3b8', maxWidth: '600px', margin: '0 auto' }}>
              Our hybrid engine combines deterministic heuristic rules with configurable LLM analysis to flag red flags that standard anti-virus tools miss.
            </p>
          </div>

          <div className="grid-2">
            {threatFeatures.map((feat, idx) => {
              const Icon = feat.icon;
              return (
                <div key={idx} className="glass-card" style={{ padding: '1.75rem' }}>
                  <div style={{
                    width: '3rem',
                    height: '3rem',
                    borderRadius: '0.75rem',
                    background: feat.bg,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    marginBottom: '1.25rem',
                  }}>
                    <Icon style={{ width: '1.5rem', height: '1.5rem', color: feat.color }} />
                  </div>
                  <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.6rem' }}>
                    {feat.title}
                  </h3>
                  <p style={{ fontSize: '0.9375rem', color: '#94a3b8', lineHeight: 1.6 }}>
                    {feat.desc}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* 3 Step Workflow */}
      <section style={{ padding: '4rem 0', background: 'rgba(13, 22, 43, 0.4)' }}>
        <div className="container">
          <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
            <h2 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
              How JobShield AI Protects You in 3 Steps
            </h2>
            <p style={{ fontSize: '1rem', color: '#94a3b8' }}>
              Immediate verification without sign-ups or privacy exposure.
            </p>
          </div>

          <div className="grid-3">
            {steps.map((st, i) => (
              <div key={i} className="glass-card" style={{ padding: '2rem', position: 'relative' }}>
                <span style={{
                  fontSize: '2.5rem',
                  fontWeight: 900,
                  color: 'rgba(56, 189, 248, 0.2)',
                  fontFamily: 'var(--font-mono)',
                  display: 'block',
                  marginBottom: '0.75rem',
                }}>
                  {st.num}
                </span>
                <h3 style={{ fontSize: '1.2rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.65rem' }}>
                  {st.title}
                </h3>
                <p style={{ fontSize: '0.9rem', color: '#94a3b8', lineHeight: 1.6 }}>
                  {st.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Student Safety Pledge / Banner */}
      <section style={{ padding: '4rem 0' }}>
        <div className="container">
          <div className="glass-card" style={{
            padding: '2.5rem',
            background: 'linear-gradient(135deg, rgba(13, 22, 43, 0.9) 0%, rgba(26, 16, 50, 0.8) 100%)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            textAlign: 'center',
          }}>
            <div style={{
              width: '3.5rem',
              height: '3.5rem',
              borderRadius: '50%',
              background: 'rgba(139, 92, 246, 0.2)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: '1rem',
            }}>
              <CheckCircle style={{ width: '1.75rem', height: '1.75rem', color: '#a855f7' }} />
            </div>
            <h2 style={{ fontSize: '1.75rem', fontWeight: 800, color: '#ffffff', marginBottom: '0.75rem' }}>
              The Golden Rule of College Placements
            </h2>
            <p style={{ fontSize: '1.05rem', color: '#cbd5e1', maxWidth: '680px', lineHeight: 1.6, marginBottom: '1.75rem' }}>
              Genuine companies pay YOU for your skills. Legitimate employers, TCS, Infosys, Google, and verified startups NEVER ask candidates for registration fees, training deposits, or laptop charges.
            </p>
            <Link to="/analyze" className="btn btn-primary" style={{ padding: '0.85rem 1.75rem' }}>
              Scan Suspicious Message Now
              <ArrowRight style={{ width: '1.1rem', height: '1.1rem' }} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
