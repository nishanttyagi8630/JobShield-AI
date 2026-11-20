import React from 'react';
import { AlertOctagon, AlertTriangle, AlertCircle, Info, CheckCircle2 } from 'lucide-react';

export default function IndicatorCard({ indicator }) {
  const { name, severity, evidence, explanation, verificationAction, confidence } = indicator;

  const severityConfigs = {
    Critical: {
      color: '#ef4444',
      bg: 'rgba(239, 68, 68, 0.1)',
      border: 'rgba(239, 68, 68, 0.25)',
      icon: AlertOctagon,
      label: 'Critical Warning',
    },
    High: {
      color: '#f97316',
      bg: 'rgba(249, 115, 22, 0.1)',
      border: 'rgba(249, 115, 22, 0.25)',
      icon: AlertTriangle,
      label: 'High Severity',
    },
    Medium: {
      color: '#f59e0b',
      bg: 'rgba(245, 158, 11, 0.1)',
      border: 'rgba(245, 158, 11, 0.25)',
      icon: AlertCircle,
      label: 'Medium Caution',
    },
    Low: {
      color: '#38bdf8',
      bg: 'rgba(56, 189, 248, 0.1)',
      border: 'rgba(56, 189, 248, 0.25)',
      icon: Info,
      label: 'Low Severity',
    },
  };

  const config = severityConfigs[severity] || severityConfigs.Medium;
  const Icon = config.icon;

  return (
    <div style={{
      background: 'rgba(13, 22, 43, 0.75)',
      border: `1px solid ${config.border}`,
      borderRadius: '0.875rem',
      padding: '1.25rem',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Top Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '1rem', marginBottom: '0.85rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
          <div style={{
            width: '2.25rem',
            height: '2.25rem',
            borderRadius: '0.5rem',
            background: config.bg,
            border: `1px solid ${config.border}`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            flexShrink: 0,
          }}>
            <Icon style={{ width: '1.25rem', height: '1.25rem', color: config.color }} />
          </div>
          <div>
            <h4 style={{ fontSize: '1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
              {name}
            </h4>
            {confidence && (
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Confidence: {Math.round(confidence * 100)}%
              </span>
            )}
          </div>
        </div>

        <span style={{
          fontSize: '0.75rem',
          fontWeight: 700,
          padding: '0.25rem 0.65rem',
          borderRadius: '9999px',
          background: config.bg,
          color: config.color,
          border: `1px solid ${config.border}`,
          whiteSpace: 'nowrap',
        }}>
          {config.label}
        </span>
      </div>

      {/* Evidence Excerpt */}
      {evidence && (
        <div style={{
          background: 'rgba(5, 10, 20, 0.7)',
          borderLeft: `3px solid ${config.color}`,
          borderRadius: '0.375rem',
          padding: '0.65rem 0.85rem',
          marginBottom: '0.85rem',
          fontFamily: 'var(--font-mono)',
          fontSize: '0.8125rem',
          color: '#e2e8f0',
          wordBreak: 'break-word',
        }}>
          <span style={{ color: '#94a3b8', fontSize: '0.7rem', display: 'block', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            Flagged Excerpt:
          </span>
          "{evidence}"
        </div>
      )}

      {/* Explanation */}
      <p style={{ fontSize: '0.875rem', color: '#cbd5e1', lineHeight: 1.55, marginBottom: '0.85rem' }}>
        {explanation}
      </p>

      {/* Verification Action */}
      {verificationAction && (
        <div style={{
          display: 'flex',
          alignItems: 'flex-start',
          gap: '0.5rem',
          background: 'rgba(56, 189, 248, 0.05)',
          border: '1px solid rgba(56, 189, 248, 0.15)',
          borderRadius: '0.5rem',
          padding: '0.65rem 0.85rem',
          fontSize: '0.8125rem',
          color: '#38bdf8',
        }}>
          <CheckCircle2 style={{ width: '1rem', height: '1rem', flexShrink: 0, marginTop: '0.15rem' }} />
          <div>
            <strong style={{ color: '#ffffff' }}>Recommended Action: </strong>
            {verificationAction}
          </div>
        </div>
      )}
    </div>
  );
}
