import React, { useState } from 'react';
import { CheckSquare, Square, ShieldCheck } from 'lucide-react';

export default function VerificationChecklist({ initialItems = [] }) {
  const [items, setItems] = useState(
    initialItems.length > 0
      ? initialItems.map((item, index) => ({
          id: index,
          text: typeof item === 'string' ? item : item.item,
          completed: typeof item === 'object' ? item.completed : false,
        }))
      : [
          { id: 0, text: 'Verify company domain and careers portal URL on official web search', completed: false },
          { id: 1, text: 'Search recruiter profile on LinkedIn and verify current employment title', completed: false },
          { id: 2, text: 'Confirm zero fees (registration, laptop, portal, or security) are required', completed: false },
          { id: 3, text: 'Request formal written offer letter on official letterhead from corporate email', completed: false },
          { id: 4, text: 'Check company registration on Ministry of Corporate Affairs (MCA) directory', completed: false },
          { id: 5, text: 'Consult college placement officer or faculty advisor before signing', completed: false },
        ]
  );

  const toggleItem = (id) => {
    setItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, completed: !item.completed } : item))
    );
  };

  const completedCount = items.filter((i) => i.completed).length;
  const progressPercent = Math.round((completedCount / items.length) * 100);

  return (
    <div className="glass-card" style={{ padding: '1.5rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
          <ShieldCheck style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }} />
          <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
            Candidate Verification Checklist
          </h3>
        </div>
        <span style={{ fontSize: '0.8125rem', color: '#94a3b8', fontWeight: 600 }}>
          {completedCount} of {items.length} completed
        </span>
      </div>

      {/* Progress Bar */}
      <div style={{
        height: '6px',
        width: '100%',
        background: 'rgba(255, 255, 255, 0.08)',
        borderRadius: '9999px',
        overflow: 'hidden',
        marginBottom: '1.25rem',
      }}>
        <div style={{
          height: '100%',
          width: `${progressPercent}%`,
          background: progressPercent === 100 ? '#10b981' : 'linear-gradient(90deg, #38bdf8, #8b5cf6)',
          transition: 'width 0.3s ease',
        }} />
      </div>

      {/* Checklist items */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
        {items.map((item) => (
          <div
            key={item.id}
            onClick={() => toggleItem(item.id)}
            style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '0.75rem',
              padding: '0.75rem 1rem',
              borderRadius: '0.5rem',
              background: item.completed ? 'rgba(16, 185, 129, 0.08)' : 'rgba(15, 23, 42, 0.5)',
              border: item.completed ? '1px solid rgba(16, 185, 129, 0.25)' : '1px solid rgba(255, 255, 255, 0.05)',
              cursor: 'pointer',
              transition: 'all 0.15s ease',
            }}
          >
            {item.completed ? (
              <CheckSquare style={{ width: '1.15rem', height: '1.15rem', color: '#10b981', flexShrink: 0, marginTop: '0.15rem' }} />
            ) : (
              <Square style={{ width: '1.15rem', height: '1.15rem', color: '#64748b', flexShrink: 0, marginTop: '0.15rem' }} />
            )}
            <span style={{
              fontSize: '0.875rem',
              color: item.completed ? '#cbd5e1' : '#f1f5f9',
              textDecoration: item.completed ? 'line-through' : 'none',
              lineHeight: 1.45,
            }}>
              {item.text}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
