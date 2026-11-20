import React from 'react';
import { ShieldAlert, ShieldCheck, AlertTriangle, AlertOctagon } from 'lucide-react';

export default function RiskGauge({ score = 0, category = 'Low', size = 200 }) {
  const strokeWidth = 14;
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  let theme = {
    color: '#10b981',
    bgColor: 'rgba(16, 185, 129, 0.12)',
    borderColor: 'rgba(16, 185, 129, 0.3)',
    label: 'Low Risk',
    icon: ShieldCheck,
    tagline: 'Standard Hiring Signals'
  };

  if (category === 'Critical' || score >= 75) {
    theme = {
      color: '#ef4444',
      bgColor: 'rgba(239, 68, 68, 0.12)',
      borderColor: 'rgba(239, 68, 68, 0.3)',
      label: 'Critical Risk',
      icon: AlertOctagon,
      tagline: 'High Threat of Employment Scam'
    };
  } else if (category === 'High' || score >= 50) {
    theme = {
      color: '#f97316',
      bgColor: 'rgba(249, 115, 22, 0.12)',
      borderColor: 'rgba(249, 115, 22, 0.3)',
      label: 'High Risk',
      icon: ShieldAlert,
      tagline: 'Multiple Severe Warning Signals'
    };
  } else if (category === 'Moderate' || score >= 25) {
    theme = {
      color: '#f59e0b',
      bgColor: 'rgba(245, 158, 11, 0.12)',
      borderColor: 'rgba(245, 158, 11, 0.3)',
      label: 'Moderate Risk',
      icon: AlertTriangle,
      tagline: 'Ambiguous Offer - Proceed with Caution'
    };
  }

  const Icon = theme.icon;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
      <div style={{ position: 'relative', width: size, height: size }}>
        <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
          {/* Background track circle */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255, 255, 255, 0.08)"
            strokeWidth={strokeWidth}
            fill="transparent"
          />
          {/* Animated score indicator */}
          <circle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke={theme.color}
            strokeWidth={strokeWidth}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            strokeLinecap="round"
            fill="transparent"
            style={{
              transition: 'stroke-dashoffset 1s cubic-bezier(0.16, 1, 0.3, 1)',
              filter: `drop-shadow(0 0 10px ${theme.color})`,
            }}
          />
        </svg>

        {/* Center content */}
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
        }}>
          <span style={{
            fontSize: '2.75rem',
            fontWeight: 800,
            color: '#ffffff',
            lineHeight: 1,
            letterSpacing: '-0.03em',
            fontFamily: 'var(--font-sans)',
          }}>
            {score}
          </span>
          <span style={{ fontSize: '0.8125rem', color: '#94a3b8', fontWeight: 600 }}>
            out of 100
          </span>
        </div>
      </div>

      {/* Risk Badge */}
      <div style={{
        marginTop: '1.25rem',
        display: 'inline-flex',
        alignItems: 'center',
        gap: '0.45rem',
        padding: '0.45rem 1rem',
        borderRadius: '9999px',
        background: theme.bgColor,
        border: `1px solid ${theme.borderColor}`,
        color: theme.color,
        fontWeight: 700,
        fontSize: '0.9375rem',
      }}>
        <Icon style={{ width: '1.1rem', height: '1.1rem' }} />
        <span>{theme.label}</span>
      </div>
      <p style={{ fontSize: '0.8125rem', color: '#94a3b8', marginTop: '0.4rem' }}>
        {theme.tagline}
      </p>
    </div>
  );
}
