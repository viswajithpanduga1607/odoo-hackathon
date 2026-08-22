import { useState } from 'react';
import { leaveRequests } from '../../data/mockData';

export default function LeaveApprovals() {
  const [filter, setFilter] = useState('All');
  const [requests, setRequests] = useState(leaveRequests);
  const [comments, setComments] = useState({});

  const filtered = filter === 'All' ? requests : requests.filter(r => r.status === filter);
  const pendingCount = requests.filter(r => r.status === 'Pending').length;

  const handleAction = (id, action) => {
    setRequests(requests.map(r =>
      r.id === id ? { ...r, status: action === 'approve' ? 'Approved' : 'Rejected' } : r
    ));
  };

  const badgeClass = (status) => {
    const map = { 'Approved': 'badge--approved', 'Pending': 'badge--pending', 'Rejected': 'badge--rejected' };
    return map[status] || 'badge--neutral';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave Approvals</h1>
          <p className="page-subtitle">Review and manage employee leave requests</p>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="tabs" style={{ marginBottom: 'var(--space-6)', width: 'fit-content' }}>
        {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
          <button
            key={f}
            className={`tab ${filter === f ? 'tab--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f} {f === 'Pending' && pendingCount > 0 && <span style={{ marginLeft: '4px', fontSize: 'var(--text-xs)', opacity: 0.8 }}>({pendingCount})</span>}
          </button>
        ))}
      </div>

      {/* Leave Request Cards */}
      <div>
        {filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-muted)' }}>
            No {filter.toLowerCase()} leave requests found
          </div>
        ) : (
          filtered.map(lr => (
            <div key={lr.id} className="leave-request-card">
              <div className="leave-request-card__header">
                <div className="leave-request-card__employee">
                  <img src={lr.avatar} alt={lr.employeeName} className="avatar" />
                  <div>
                    <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{lr.employeeName}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{lr.employeeId}</div>
                  </div>
                </div>
                <span className={`badge ${badgeClass(lr.status)}`}>{lr.status}</span>
              </div>

              <div className="leave-request-card__details">
                <div>
                  <div className="leave-request-card__detail-label">Leave Type</div>
                  <div className="leave-request-card__detail-value">
                    <span className={`badge ${lr.type === 'Sick Leave' ? 'badge--sick-leave' : lr.type === 'Unpaid Leave' ? 'badge--warning' : 'badge--info'}`}>
                      {lr.type}
                    </span>
                  </div>
                </div>
                <div>
                  <div className="leave-request-card__detail-label">Duration</div>
                  <div className="leave-request-card__detail-value">{lr.from} → {lr.to}</div>
                </div>
                <div>
                  <div className="leave-request-card__detail-label">Days</div>
                  <div className="leave-request-card__detail-value">{lr.days} day{lr.days > 1 ? 's' : ''}</div>
                </div>
                <div>
                  <div className="leave-request-card__detail-label">Applied On</div>
                  <div className="leave-request-card__detail-value">{lr.appliedOn}</div>
                </div>
              </div>

              {lr.reason && (
                <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', padding: '0 var(--space-2)' }}>
                  <strong style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)' }}>REASON: </strong>
                  {lr.reason}
                </div>
              )}

              {lr.status === 'Pending' && (
                <div className="leave-request-card__actions">
                  <input
                    type="text"
                    className="form-input leave-request-card__comment"
                    placeholder="Add a comment (optional)..."
                    value={comments[lr.id] || ''}
                    onChange={(e) => setComments({ ...comments, [lr.id]: e.target.value })}
                  />
                  <button className="btn btn--success btn--sm" onClick={() => handleAction(lr.id, 'approve')}>
                    ✓ Approve
                  </button>
                  <button className="btn btn--danger btn--sm" onClick={() => handleAction(lr.id, 'reject')}>
                    ✗ Reject
                  </button>
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}
