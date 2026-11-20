import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Shield, LayoutDashboard, Search, History, BookOpen, Activity } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar() {
  const location = useLocation();
  const [backendStatus, setBackendStatus] = useState('checking');

  useEffect(() => {
    api.getHealth()
      .then(() => setBackendStatus('online'))
      .catch(() => setBackendStatus('offline'));
  }, [location.pathname]);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analyze Offer', path: '/analyze', icon: Search },
    { name: 'History', path: '/history', icon: History },
    { name: 'Safety Guide', path: '/about', icon: BookOpen },
  ];

  return (
    <header style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'rgba(8, 13, 26, 0.85)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
    }}>
      <div className="container" style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '4.25rem',
      }}>
        {/* Brand Logo */}
        <Link to="/" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', textDecoration: 'none' }}>
          <div style={{
            position: 'relative',
            width: '2.5rem',
            height: '2.5rem',
            borderRadius: '0.75rem',
            background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.2) 0%, rgba(139, 92, 246, 0.2) 100%)',
            border: '1px solid rgba(56, 189, 248, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: '0 0 15px rgba(56, 189, 248, 0.25)',
          }}>
            <Shield style={{ width: '1.4rem', height: '1.4rem', color: '#38bdf8' }} />
          </div>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span style={{ fontSize: '1.25rem', fontWeight: 800, letterSpacing: '-0.02em', color: '#ffffff' }}>
                JobShield<span style={{ color: '#38bdf8' }}>.AI</span>
              </span>
              <span style={{
                fontSize: '0.625rem',
                fontWeight: 700,
                textTransform: 'uppercase',
                padding: '0.15rem 0.4rem',
                borderRadius: '0.35rem',
                background: 'rgba(139, 92, 246, 0.25)',
                color: '#c4b5fd',
                border: '1px solid rgba(139, 92, 246, 0.4)',
              }}>
                Defense
              </span>
            </div>
            <p style={{ fontSize: '0.6875rem', color: '#94a3b8', margin: 0 }}>
              Recruitment Scam Threat Analyzer
            </p>
          </div>
        </Link>

        {/* Navigation Links */}
        <nav style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          {navLinks.map((link) => {
            const isActive = location.pathname === link.path;
            const Icon = link.icon;
            return (
              <Link
                key={link.path}
                to={link.path}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '0.4rem',
                  padding: '0.5rem 0.85rem',
                  borderRadius: '0.5rem',
                  fontSize: '0.875rem',
                  fontWeight: 500,
                  textDecoration: 'none',
                  color: isActive ? '#38bdf8' : '#94a3b8',
                  background: isActive ? 'rgba(56, 189, 248, 0.12)' : 'transparent',
                  border: isActive ? '1px solid rgba(56, 189, 248, 0.25)' : '1px solid transparent',
                  transition: 'all 0.2s ease',
                }}
              >
                {Icon && <Icon style={{ width: '1rem', height: '1rem' }} />}
                {link.name}
              </Link>
            );
          })}
        </nav>

        {/* Status & CTA */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '0.4rem',
            fontSize: '0.75rem',
            padding: '0.35rem 0.65rem',
            borderRadius: '9999px',
            background: 'rgba(15, 23, 42, 0.8)',
            border: '1px solid rgba(255, 255, 255, 0.08)',
          }}>
            <span style={{
              width: '0.5rem',
              height: '0.5rem',
              borderRadius: '50%',
              background: backendStatus === 'online' ? '#10b981' : backendStatus === 'offline' ? '#ef4444' : '#f59e0b',
              boxShadow: backendStatus === 'online' ? '0 0 8px #10b981' : 'none',
            }} />
            <span style={{ color: '#94a3b8' }}>
              {backendStatus === 'online' ? 'Engine Active' : backendStatus === 'offline' ? 'Offline' : 'Checking'}
            </span>
          </div>

          <Link to="/analyze" className="btn btn-primary" style={{ padding: '0.5rem 1rem', fontSize: '0.875rem' }}>
            <Search style={{ width: '0.95rem', height: '0.95rem' }} />
            Scan Offer
          </Link>
        </div>
      </div>
    </header>
  );
}
