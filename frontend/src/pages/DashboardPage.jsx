import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldAlert, 
  ShieldCheck, 
  AlertTriangle, 
  AlertOctagon, 
  Search, 
  BarChart3, 
  Clock, 
  ArrowRight,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { 
  PieChart, 
  Pie, 
  Cell, 
  ResponsiveContainer, 
  Tooltip, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid 
} from 'recharts';
import { api } from '../services/api';

export default function DashboardPage() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getDashboardStats();
      if (res.success) {
        setStats(res.data);
      }
    } catch (err) {
      setError(err.message || 'Failed to load dashboard metrics');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const riskData = stats ? [
    { name: 'Critical Risk', value: stats.criticalRisk || 0, color: '#ef4444' },
    { name: 'High Risk', value: stats.highRisk || 0, color: '#f97316' },
    { name: 'Moderate Risk', value: stats.moderateRisk || 0, color: '#f59e0b' },
    { name: 'Low Risk', value: stats.lowRisk || 0, color: '#10b981' },
  ].filter(d => d.value > 0) : [];

  const inputTypeData = stats ? [
    { name: 'Jobs', count: stats.inputTypeCounts?.job_posting || 0 },
    { name: 'Internships', count: stats.inputTypeCounts?.internship_offer || 0 },
    { name: 'Messages', count: stats.inputTypeCounts?.recruiter_message || 0 },
    { name: 'Emails', count: stats.inputTypeCounts?.email || 0 },
    { name: 'Offer Letters', count: stats.inputTypeCounts?.offer_letter || 0 },
  ] : [];

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      {/* Top Header */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1.25rem',
        marginBottom: '2rem',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Threat Intelligence Dashboard
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#94a3b8', marginTop: '0.3rem' }}>
            Real-time analytics on scanned recruitment messages and fraudulent offer patterns.
          </p>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <button
            onClick={fetchStats}
            className="btn btn-secondary"
            title="Refresh metrics"
            style={{ padding: '0.625rem 0.85rem' }}
          >
            <RefreshCw style={{ width: '1rem', height: '1rem' }} />
          </button>
          <Link to="/analyze" className="btn btn-primary">
            <Search style={{ width: '1rem', height: '1rem' }} />
            Analyze New Offer
          </Link>
        </div>
      </div>

      {loading ? (
        <div style={{ textAlign: 'center', padding: '5rem 0' }}>
          <div style={{
            width: '3rem',
            height: '3rem',
            border: '3px solid rgba(56, 189, 248, 0.2)',
            borderTopColor: '#38bdf8',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1.5rem auto',
          }} />
          <p style={{ color: '#94a3b8' }}>Loading security intelligence data...</p>
        </div>
      ) : error ? (
        <div className="glass-card" style={{ padding: '2.5rem', textAlign: 'center' }}>
          <AlertOctagon style={{ width: '2.5rem', height: '2.5rem', color: '#ef4444', margin: '0 auto 1rem auto' }} />
          <h3 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Failed to Load Dashboard</h3>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>{error}</p>
          <button onClick={fetchStats} className="btn btn-primary">Try Again</button>
        </div>
      ) : (
        <>
          {/* Key Metric Cards */}
          <div className="grid-4" style={{ marginBottom: '2rem' }}>
            {/* Total Scanned */}
            <div className="glass-card" style={{ padding: '1.25rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#94a3b8', fontWeight: 600 }}>Total Analyzed</span>
                <BarChart3 style={{ width: '1.25rem', height: '1.25rem', color: '#38bdf8' }} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff' }}>
                {stats.total}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#38bdf8' }}>
                Avg Risk: {stats.avgRiskScore}/100
              </span>
            </div>

            {/* Critical Threats */}
            <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '3px solid #ef4444' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#94a3b8', fontWeight: 600 }}>Critical Threats</span>
                <AlertOctagon style={{ width: '1.25rem', height: '1.25rem', color: '#ef4444' }} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#ef4444' }}>
                {stats.criticalRisk}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Upfront fees & impersonations
              </span>
            </div>

            {/* High/Moderate Risk */}
            <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '3px solid #f59e0b' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#94a3b8', fontWeight: 600 }}>High / Moderate Risk</span>
                <AlertTriangle style={{ width: '1.25rem', height: '1.25rem', color: '#f59e0b' }} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#f59e0b' }}>
                {(stats.highRisk || 0) + (stats.moderateRisk || 0)}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                {stats.highRisk} High, {stats.moderateRisk} Moderate
              </span>
            </div>

            {/* Verified Safe / Low Risk */}
            <div className="glass-card" style={{ padding: '1.25rem', borderLeft: '3px solid #10b981' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.65rem' }}>
                <span style={{ fontSize: '0.8125rem', color: '#94a3b8', fontWeight: 600 }}>Low Risk / Safe</span>
                <ShieldCheck style={{ width: '1.25rem', height: '1.25rem', color: '#10b981' }} />
              </div>
              <div style={{ fontSize: '2rem', fontWeight: 800, color: '#10b981' }}>
                {stats.lowRisk}
              </div>
              <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                Standard hiring protocols
              </span>
            </div>
          </div>

          {/* Charts Row */}
          <div className="grid-2" style={{ marginBottom: '2.5rem' }}>
            {/* Risk Distribution Chart */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem' }}>
                Risk Severity Breakdown
              </h3>
              {riskData.length > 0 ? (
                <div style={{ height: '240px', width: '100%' }}>
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={riskData}
                        cx="50%"
                        cy="50%"
                        innerRadius={60}
                        outerRadius={90}
                        paddingAngle={5}
                        dataKey="value"
                      >
                        {riskData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip
                        contentStyle={{
                          backgroundColor: '#0d162b',
                          borderColor: 'rgba(255,255,255,0.1)',
                          borderRadius: '0.5rem',
                          color: '#fff',
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', flexWrap: 'wrap', marginTop: '0.5rem' }}>
                    {riskData.map((d, i) => (
                      <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem' }}>
                        <span style={{ width: '0.65rem', height: '0.65rem', borderRadius: '50%', background: d.color }} />
                        <span style={{ color: '#94a3b8' }}>{d.name} ({d.value})</span>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '3rem 0', color: '#64748b' }}>
                  No risk data available yet.
                </div>
              )}
            </div>

            {/* Input Type Breakdown Chart */}
            <div className="glass-card" style={{ padding: '1.5rem' }}>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 700, color: '#ffffff', marginBottom: '1.25rem' }}>
                Scanned Content Channels
              </h3>
              <div style={{ height: '240px', width: '100%' }}>
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={inputTypeData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" />
                    <XAxis dataKey="name" stroke="#64748b" fontSize={12} />
                    <YAxis stroke="#64748b" fontSize={12} allowDecimals={false} />
                    <Tooltip
                      contentStyle={{
                        backgroundColor: '#0d162b',
                        borderColor: 'rgba(255,255,255,0.1)',
                        borderRadius: '0.5rem',
                        color: '#fff',
                      }}
                    />
                    <Bar dataKey="count" fill="#38bdf8" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>

          {/* Recent Scans Table */}
          <div className="glass-card" style={{ padding: '1.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.25rem' }}>
              <div>
                <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                  Recent Analysis Reports
                </h3>
                <p style={{ fontSize: '0.8125rem', color: '#94a3b8', margin: '0.2rem 0 0 0' }}>
                  Latest verified recruitment messages and offer audits.
                </p>
              </div>
              <Link to="/history" style={{ fontSize: '0.875rem', color: '#38bdf8', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                View All History <ArrowRight style={{ width: '0.9rem', height: '0.9rem' }} />
              </Link>
            </div>

            {stats.recent && stats.recent.length > 0 ? (
              <div style={{ overflowX: 'auto' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.875rem' }}>
                  <thead>
                    <tr style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.08)', color: '#94a3b8' }}>
                      <th style={{ padding: '0.75rem 1rem' }}>Company / Source</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Input Type</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Risk Score</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Risk Category</th>
                      <th style={{ padding: '0.75rem 1rem' }}>Date</th>
                      <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recent.map((rec) => {
                      const badgeClass =
                        rec.riskCategory === 'Critical' ? 'badge-critical' :
                        rec.riskCategory === 'High' ? 'badge-high' :
                        rec.riskCategory === 'Moderate' ? 'badge-moderate' : 'badge-low';

                      return (
                        <tr
                          key={rec._id}
                          style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.05)', transition: 'background 0.15s' }}
                          onMouseOver={(e) => (e.currentTarget.style.background = 'rgba(255, 255, 255, 0.02)')}
                          onMouseOut={(e) => (e.currentTarget.style.background = 'transparent')}
                        >
                          <td style={{ padding: '1rem', fontWeight: 600, color: '#ffffff' }}>
                            {rec.companyName || 'Unspecified'}
                          </td>
                          <td style={{ padding: '1rem', color: '#94a3b8', textTransform: 'capitalize' }}>
                            {rec.inputType?.replace('_', ' ')}
                          </td>
                          <td style={{ padding: '1rem', fontWeight: 700, color: '#ffffff' }}>
                            {rec.riskScore}/100
                          </td>
                          <td style={{ padding: '1rem' }}>
                            <span className={badgeClass} style={{
                              display: 'inline-block',
                              padding: '0.2rem 0.55rem',
                              borderRadius: '9999px',
                              fontSize: '0.75rem',
                              fontWeight: 700,
                            }}>
                              {rec.riskCategory}
                            </span>
                          </td>
                          <td style={{ padding: '1rem', color: '#94a3b8', fontSize: '0.8125rem' }}>
                            {new Date(rec.createdAt).toLocaleDateString()}
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right' }}>
                            <Link
                              to={`/results/${rec._id}`}
                              className="btn btn-secondary"
                              style={{ padding: '0.35rem 0.75rem', fontSize: '0.75rem' }}
                            >
                              View Report
                            </Link>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div style={{ textAlign: 'center', padding: '3rem 0', color: '#94a3b8' }}>
                <p>No analyses found in database.</p>
                <Link to="/analyze" className="btn btn-primary" style={{ marginTop: '1rem' }}>
                  Analyze Your First Offer
                </Link>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
