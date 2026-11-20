import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  Trash2, 
  Eye, 
  AlertOctagon, 
  ChevronLeft, 
  ChevronRight, 
  Filter, 
  ArrowUpDown,
  Building2,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { api } from '../services/api';

export default function HistoryPage() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filters & Search
  const [search, setSearch] = useState('');
  const [riskCategory, setRiskCategory] = useState('All');
  const [inputType, setInputType] = useState('All');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');

  // Pagination
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ totalPages: 1, total: 0 });

  // Delete modal state
  const [deleteId, setDeleteId] = useState(null);
  const [deleting, setDeleting] = useState(false);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await api.getAnalyses({
        page,
        limit: 8,
        search: search.trim() || undefined,
        riskCategory: riskCategory !== 'All' ? riskCategory : undefined,
        inputType: inputType !== 'All' ? inputType : undefined,
        sortBy,
        sortOrder,
      });

      if (res.success) {
        setItems(res.data);
        setPagination(res.pagination);
      }
    } catch (err) {
      setError(err.message || 'Failed to fetch analysis records');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, [page, riskCategory, inputType, sortBy, sortOrder]);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    setPage(1);
    fetchHistory();
  };

  const confirmDelete = async () => {
    if (!deleteId) return;
    try {
      setDeleting(true);
      const res = await api.deleteAnalysis(deleteId);
      if (res.success) {
        setItems((prev) => prev.filter((i) => i._id !== deleteId));
        setDeleteId(null);
        fetchHistory();
      }
    } catch (err) {
      alert(`Delete failed: ${err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="container" style={{ padding: '2.5rem 1.25rem' }}>
      {/* Title */}
      <div style={{
        display: 'flex',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '1rem',
        marginBottom: '2rem',
      }}>
        <div>
          <h1 style={{ fontSize: '2rem', fontWeight: 800, color: '#ffffff', margin: 0 }}>
            Analysis Audit History
          </h1>
          <p style={{ fontSize: '0.9375rem', color: '#94a3b8', marginTop: '0.25rem' }}>
            Browse, search, and review previously scanned recruitment communications.
          </p>
        </div>

        <Link to="/analyze" className="btn btn-primary">
          <Search style={{ width: '0.95rem', height: '0.95rem' }} />
          Scan New Offer
        </Link>
      </div>

      {/* Filter and Search Bar Card */}
      <div className="glass-card" style={{ padding: '1.25rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearchSubmit} style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '1rem',
          alignItems: 'center',
        }}>
          {/* Search text input */}
          <div style={{ position: 'relative' }}>
            <Search style={{
              position: 'absolute',
              left: '0.85rem',
              top: '50%',
              transform: 'translateY(-50%)',
              width: '1rem',
              height: '1rem',
              color: '#64748b',
            }} />
            <input
              type="text"
              className="input-control"
              style={{ paddingLeft: '2.3rem' }}
              placeholder="Search company or text..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* Risk Category Filter */}
          <div>
            <select
              className="input-control"
              value={riskCategory}
              onChange={(e) => { setRiskCategory(e.target.value); setPage(1); }}
            >
              <option value="All">All Risk Levels</option>
              <option value="Critical">Critical Risk</option>
              <option value="High">High Risk</option>
              <option value="Moderate">Moderate Risk</option>
              <option value="Low">Low Risk</option>
            </select>
          </div>

          {/* Input Type Filter */}
          <div>
            <select
              className="input-control"
              value={inputType}
              onChange={(e) => { setInputType(e.target.value); setPage(1); }}
            >
              <option value="All">All Content Types</option>
              <option value="job_posting">Job Postings</option>
              <option value="internship_offer">Internship Offers</option>
              <option value="recruiter_message">Recruiter Messages</option>
              <option value="email">Emails</option>
              <option value="offer_letter">Offer Letters</option>
            </select>
          </div>

          {/* Sort By */}
          <div>
            <select
              className="input-control"
              value={`${sortBy}_${sortOrder}`}
              onChange={(e) => {
                const [sb, so] = e.target.value.split('_');
                setSortBy(sb);
                setSortOrder(so);
                setPage(1);
              }}
            >
              <option value="createdAt_desc">Newest First</option>
              <option value="createdAt_asc">Oldest First</option>
              <option value="riskScore_desc">Highest Risk Score</option>
              <option value="riskScore_asc">Lowest Risk Score</option>
            </select>
          </div>
        </form>
      </div>

      {/* History Items List / Table */}
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
          <p style={{ color: '#94a3b8' }}>Loading analysis records...</p>
        </div>
      ) : error ? (
        <div className="glass-card" style={{ padding: '3rem', textAlign: 'center' }}>
          <AlertOctagon style={{ width: '2.5rem', height: '2.5rem', color: '#ef4444', margin: '0 auto 1rem auto' }} />
          <h3 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>Failed to Load History</h3>
          <p style={{ color: '#94a3b8', marginBottom: '1.5rem' }}>{error}</p>
          <button onClick={fetchHistory} className="btn btn-primary">Try Again</button>
        </div>
      ) : items.length === 0 ? (
        <div className="glass-card" style={{ padding: '4rem 2rem', textAlign: 'center' }}>
          <Search style={{ width: '3rem', height: '3rem', color: '#64748b', margin: '0 auto 1rem auto' }} />
          <h3 style={{ color: '#ffffff', marginBottom: '0.5rem' }}>No Analysis Records Found</h3>
          <p style={{ color: '#94a3b8', maxWidth: '450px', margin: '0 auto 1.5rem auto' }}>
            No records matched your search query or filter criteria. Try resetting filters or analyzing a new offer.
          </p>
          <Link to="/analyze" className="btn btn-primary">
            Analyze An Offer Now
          </Link>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
          {items.map((item) => {
            const badgeClass =
              item.riskCategory === 'Critical' ? 'badge-critical' :
              item.riskCategory === 'High' ? 'badge-high' :
              item.riskCategory === 'Moderate' ? 'badge-moderate' : 'badge-low';

            const scoreColor =
              item.riskCategory === 'Critical' ? '#ef4444' :
              item.riskCategory === 'High' ? '#f97316' :
              item.riskCategory === 'Moderate' ? '#f59e0b' : '#10b981';

            return (
              <div
                key={item._id}
                className="glass-card"
                style={{
                  padding: '1.25rem 1.5rem',
                  display: 'flex',
                  flexWrap: 'wrap',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  gap: '1.25rem',
                  borderLeft: `4px solid ${scoreColor}`,
                }}
              >
                {/* Left Info */}
                <div style={{ flex: '1 1 300px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', marginBottom: '0.35rem' }}>
                    <h3 style={{ fontSize: '1.15rem', fontWeight: 700, color: '#ffffff', margin: 0 }}>
                      {item.companyName || 'Unspecified Entity'}
                    </h3>
                    <span className={badgeClass} style={{
                      fontSize: '0.75rem',
                      fontWeight: 700,
                      padding: '0.15rem 0.5rem',
                      borderRadius: '9999px',
                    }}>
                      {item.riskCategory} ({item.riskScore}/100)
                    </span>
                  </div>

                  <p style={{
                    fontSize: '0.85rem',
                    color: '#94a3b8',
                    margin: '0 0 0.5rem 0',
                    lineHeight: 1.4,
                    display: '-webkit-box',
                    WebkitLineClamp: 2,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden',
                  }}>
                    {item.summary}
                  </p>

                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '1rem', fontSize: '0.75rem', color: '#64748b' }}>
                    <span>📄 {item.inputType?.replace('_', ' ')}</span>
                    <span>⚠️ {item.indicators?.length || 0} Threat Flags</span>
                    <span>🕒 {new Date(item.createdAt).toLocaleString()}</span>
                  </div>
                </div>

                {/* Right Actions */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem' }}>
                  <Link
                    to={`/results/${item._id}`}
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem 0.85rem', fontSize: '0.8125rem' }}
                  >
                    <Eye style={{ width: '0.9rem', height: '0.9rem' }} />
                    View Report
                  </Link>
                  <button
                    onClick={() => setDeleteId(item._id)}
                    className="btn btn-danger"
                    title="Delete record"
                    style={{ padding: '0.5rem 0.75rem' }}
                  >
                    <Trash2 style={{ width: '0.9rem', height: '0.9rem' }} />
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination Controls */}
      {pagination.totalPages > 1 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginTop: '2rem' }}>
          <button
            onClick={() => setPage((p) => Math.max(1, p - 1))}
            disabled={page === 1}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 0.85rem' }}
          >
            <ChevronLeft style={{ width: '1rem', height: '1rem' }} /> Previous
          </button>
          <span style={{ fontSize: '0.875rem', color: '#94a3b8' }}>
            Page {page} of {pagination.totalPages} ({pagination.total} records)
          </span>
          <button
            onClick={() => setPage((p) => Math.min(pagination.totalPages, p + 1))}
            disabled={page === pagination.totalPages}
            className="btn btn-secondary"
            style={{ padding: '0.5rem 0.85rem' }}
          >
            Next <ChevronRight style={{ width: '1rem', height: '1rem' }} />
          </button>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteId && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0, 0, 0, 0.75)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 100,
          padding: '1.25rem',
        }}>
          <div className="glass-card" style={{ padding: '2rem', maxWidth: '420px', width: '100%', textAlign: 'center' }}>
            <AlertTriangle style={{ width: '2.5rem', height: '2.5rem', color: '#ef4444', margin: '0 auto 1rem auto' }} />
            <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: '#ffffff', marginBottom: '0.5rem' }}>
              Confirm Record Deletion
            </h3>
            <p style={{ fontSize: '0.875rem', color: '#94a3b8', lineHeight: 1.5, marginBottom: '1.5rem' }}>
              Are you sure you want to delete this analysis report? This action removes the assessment from database history permanently.
            </p>
            <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
              <button
                onClick={() => setDeleteId(null)}
                className="btn btn-secondary"
                disabled={deleting}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="btn btn-danger"
                disabled={deleting}
              >
                {deleting ? 'Deleting...' : 'Delete Permanently'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
