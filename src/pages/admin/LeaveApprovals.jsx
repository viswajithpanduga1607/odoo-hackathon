import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchAllLeaveRequests, reviewLeaveRequest } from '../../firebase/leaveService';

export default function LeaveApprovals() {
  const { user, profile } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('All');
  const [comments, setComments] = useState({});
  const [actionLoading, setActionLoading] = useState({});
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadRequests = async () => {
    try {
      const list = await fetchAllLeaveRequests();
      setRequests(list);
    } catch (err) {
      console.error('Error loading leave requests for admin:', err);
      setError('Failed to load leave requests from Firestore.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleAction = async (id, newStatus) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    setError('');
    setSuccess('');

    try {
      const commentText = comments[id] || '';
      const adminName = profile?.fullName || user?.displayName || 'HR Admin';

      await reviewLeaveRequest(id, {
        status: newStatus,
        adminComment: commentText,
        adminName,
      });

      setSuccess(`Leave request successfully marked as ${newStatus}!`);
      // Update locally
      setRequests(prev => prev.map(r =>
        r.id === id ? { ...r, status: newStatus, adminComment: commentText, reviewedBy: adminName } : r
      ));
    } catch (err) {
      console.error('Error reviewing leave request:', err);
      setError(err.message || 'Failed to update leave request status.');
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const filtered = filter === 'All'
    ? requests
    : requests.filter(r => (r.status || '').toLowerCase() === filter.toLowerCase());

  const pendingCount = requests.filter(r => (r.status || '').toLowerCase() === 'pending').length;

  const badgeClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'approved') return 'badge--approved';
    if (s === 'rejected') return 'badge--rejected';
    return 'badge--pending';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave Approvals</h1>
          <p className="page-subtitle">Review, approve, or reject employee leave requests</p>
        </div>
      </div>

      {error && (
        <div className="alert alert--error" style={{ marginBottom: 'var(--space-6)' }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert--success" style={{ marginBottom: 'var(--space-6)' }}>
          <span>✅</span>
          <span>{success}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="tabs" style={{ marginBottom: 'var(--space-6)', width: 'fit-content' }}>
        {['All', 'Pending', 'Approved', 'Rejected'].map(f => (
          <button
            key={f}
            className={`tab ${filter === f ? 'tab--active' : ''}`}
            onClick={() => setFilter(f)}
          >
            {f} {f === 'Pending' && pendingCount > 0 && (
              <span style={{ marginLeft: '4px', fontSize: 'var(--text-xs)', background: 'var(--color-warning)', color: '#0F0F23', padding: '2px 6px', borderRadius: '999px', fontWeight: 700 }}>
                {pendingCount}
              </span>
            )}
          </button>
        ))}
      </div>

      {/* Leave Request Cards */}
      <div>
        {loading ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-muted)' }}>
            Loading leave requests from Firestore...
          </div>
        ) : filtered.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: 'var(--space-12)', color: 'var(--color-text-muted)' }}>
            No {filter.toLowerCase()} leave requests found.
          </div>
        ) : (
          filtered.map(lr => {
            const isPending = (lr.status || '').toLowerCase() === 'pending';
            const empName = lr.employeeName || 'Employee';
            const empId = lr.employeeDisplayId || lr.employeeId || 'EMP';
            const avatar = lr.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(empName)}`;
            const isProcessing = !!actionLoading[lr.id];

            return (
              <div key={lr.id} className="leave-request-card">
                <div className="leave-request-card__header">
                  <div className="leave-request-card__employee">
                    <img src={avatar} alt={empName} className="avatar" />
                    <div>
                      <div style={{ fontWeight: 600, color: 'var(--color-text-primary)' }}>{empName}</div>
                      <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{empId}</div>
                    </div>
                  </div>
                  <span className={`badge ${badgeClass(lr.status)}`}>
                    {lr.status ? lr.status.charAt(0).toUpperCase() + lr.status.slice(1) : 'Pending'}
                  </span>
                </div>

                <div className="leave-request-card__details">
                  <div>
                    <div className="leave-request-card__detail-label">Leave Type</div>
                    <div className="leave-request-card__detail-value">
                      <span className={`badge ${lr.leaveType === 'sick' ? 'badge--sick-leave' : lr.leaveType === 'unpaid' ? 'badge--warning' : 'badge--info'}`}>
                        {lr.leaveType ? `${lr.leaveType.charAt(0).toUpperCase() + lr.leaveType.slice(1)} Leave` : 'Leave'}
                      </span>
                    </div>
                  </div>
                  <div>
                    <div className="leave-request-card__detail-label">Duration</div>
                    <div className="leave-request-card__detail-value">{lr.startDate || lr.from} → {lr.endDate || lr.to}</div>
                  </div>
                  <div>
                    <div className="leave-request-card__detail-label">Days</div>
                    <div className="leave-request-card__detail-value">{lr.days} {Number(lr.days) === 1 ? 'day' : 'days'}</div>
                  </div>
                  <div>
                    <div className="leave-request-card__detail-label">Applied On</div>
                    <div className="leave-request-card__detail-value">
                      {lr.createdAt ? new Date(lr.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-'}
                    </div>
                  </div>
                </div>

                {lr.remarks && (
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-bg-primary)', borderRadius: 'var(--radius-md)' }}>
                    <strong style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-xs)', display: 'block', marginBottom: '4px' }}>
                      REASON / REMARKS:
                    </strong>
                    {lr.remarks}
                  </div>
                )}

                {lr.adminComment && (
                  <div style={{ fontSize: 'var(--text-sm)', color: 'var(--color-primary)', marginBottom: 'var(--space-4)', padding: 'var(--space-3)', background: 'var(--color-primary-light)', borderRadius: 'var(--radius-md)' }}>
                    <strong style={{ fontSize: 'var(--text-xs)', display: 'block', marginBottom: '2px' }}>
                      HR NOTE ({lr.reviewedBy || 'Admin'}):
                    </strong>
                    {lr.adminComment}
                  </div>
                )}

                {isPending && (
                  <div className="leave-request-card__actions">
                    <input
                      type="text"
                      className="form-input leave-request-card__comment"
                      placeholder="Add an admin comment / note (optional)..."
                      value={comments[lr.id] || ''}
                      onChange={(e) => setComments({ ...comments, [lr.id]: e.target.value })}
                      disabled={isProcessing}
                    />
                    <button
                      className="btn btn--success btn--sm"
                      onClick={() => handleAction(lr.id, 'approved')}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Saving...' : '✓ Approve'}
                    </button>
                    <button
                      className="btn btn--danger btn--sm"
                      onClick={() => handleAction(lr.id, 'rejected')}
                      disabled={isProcessing}
                    >
                      {isProcessing ? 'Saving...' : '✗ Reject'}
                    </button>
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>
    </div>
  );
}
