import React from 'react';
import { Shield, ExternalLink, AlertTriangle, PhoneCall, Heart } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer style={{
      marginTop: '5rem',
      background: 'linear-gradient(to top, #04070d, #080d1a)',
      borderTop: '1px solid rgba(255, 255, 255, 0.08)',
      padding: '3.5rem 0 2rem 0',
    }}>
      <div className="container">
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '2.5rem',
          marginBottom: '2.5rem',
        }}>
          {/* Column 1: Brand & Purpose */}
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.9rem' }}>
              <div style={{
                width: '2rem',
                height: '2rem',
                borderRadius: '0.5rem',
                background: 'rgba(56, 189, 248, 0.15)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
              }}>
                <Shield style={{ width: '1.15rem', height: '1.15rem', color: '#38bdf8' }} />
              </div>
              <span style={{ fontSize: '1.15rem', fontWeight: 800, color: '#ffffff' }}>
                JobShield<span style={{ color: '#38bdf8' }}>.AI</span>
              </span>
            </div>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.6, marginBottom: '1rem' }}>
              An academic AI & heuristic threat analyzer engineered to protect college students and fresh graduates from predatory internship scams, fake placement drives, and recruitment fraud.
            </p>
            <div style={{
              display: 'inline-flex',
              alignItems: 'center',
              gap: '0.4rem',
              padding: '0.3rem 0.65rem',
              borderRadius: '0.375rem',
              background: 'rgba(15, 23, 42, 0.6)',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              fontSize: '0.75rem',
              color: '#38bdf8',
            }}>
              <span>🎓 B.Tech CSE Mini Project</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Navigation
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
              {[
                { label: 'Security Dashboard', path: '/dashboard' },
                { label: 'Analyze Job Offer', path: '/analyze' },
                { label: 'Scan Audit History', path: '/history' },
                { label: 'Scam Prevention Guide', path: '/about' },
              ].map((item) => (
                <li key={item.path}>
                  <Link
                    to={item.path}
                    style={{ fontSize: '0.875rem', color: '#94a3b8', textDecoration: 'none', transition: 'color 0.2s' }}
                    onMouseOver={(e) => (e.currentTarget.style.color = '#38bdf8')}
                    onMouseOut={(e) => (e.currentTarget.style.color = '#94a3b8')}
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 3: Emergency Reporting Resources */}
          <div>
            <h4 style={{ fontSize: '0.9375rem', fontWeight: 700, color: '#ffffff', marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              Report Scams (India & Global)
            </h4>
            <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              <li>
                <a
                  href="https://cybercrime.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: '#38bdf8', textDecoration: 'none' }}
                >
                  <ExternalLink style={{ width: '0.85rem', height: '0.85rem' }} />
                  National Cyber Crime Portal (1930)
                </a>
              </li>
              <li>
                <a
                  href="https://www.ncs.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: '#94a3b8', textDecoration: 'none' }}
                >
                  <ExternalLink style={{ width: '0.85rem', height: '0.85rem' }} />
                  National Career Service (NCS)
                </a>
              </li>
              <li>
                <a
                  href="https://www.mca.gov.in"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: '#94a3b8', textDecoration: 'none' }}
                >
                  <ExternalLink style={{ width: '0.85rem', height: '0.85rem' }} />
                  Ministry of Corporate Affairs (MCA)
                </a>
              </li>
              <li>
                <a
                  href="https://consumer.ftc.gov/articles/job-scams"
                  target="_blank"
                  rel="noopener noreferrer"
                  style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.875rem', color: '#94a3b8', textDecoration: 'none' }}
                >
                  <ExternalLink style={{ width: '0.85rem', height: '0.85rem' }} />
                  FTC Job Scam Advisory
                </a>
              </li>
            </ul>
          </div>

          {/* Column 4: Critical Disclaimer */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.7)',
            padding: '1.25rem',
            borderRadius: '0.75rem',
            border: '1px solid rgba(245, 158, 11, 0.2)',
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.5rem', color: '#f59e0b' }}>
              <AlertTriangle style={{ width: '1.1rem', height: '1.1rem' }} />
              <span style={{ fontSize: '0.875rem', fontWeight: 700 }}>Mandatory Disclaimer</span>
            </div>
            <p style={{ fontSize: '0.775rem', color: '#94a3b8', lineHeight: 1.5, margin: 0 }}>
              JobShield AI delivers heuristic risk assessments, not legally binding proof. Never transfer money, pay registration charges, or deposit equipment checks for any job or internship.
            </p>
          </div>
        </div>

        {/* Bottom bar */}
        <div style={{
          paddingTop: '1.5rem',
          borderTop: '1px solid rgba(255, 255, 255, 0.05)',
          display: 'flex',
          flexWrap: 'wrap',
          alignItems: 'center',
          justifyContent: 'space-between',
          gap: '1rem',
          fontSize: '0.8125rem',
          color: '#64748b',
        }}>
          <div>
            © {new Date().getFullYear()} JobShield AI. Built for Computer Science Mini Project presentation.
          </div>
          <div>
            Heuristic Rule Engine & LLM Scam Detection Architecture
          </div>
        </div>
      </div>
    </footer>
  );
}
