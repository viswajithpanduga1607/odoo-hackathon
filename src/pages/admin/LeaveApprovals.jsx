import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchAllLeaveRequests, reviewLeaveRequest } from '../../firebase/leaveService';
import { leaveRequests as mockLeaveRequests } from '../../data/mockData';
import { AlertIcon, CheckCircleIcon, CheckIcon, XIcon } from '../../components/common/Icons';

export default function LeaveApprovals() {
  const { user, profile } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('pending');
  const [activeModal, setActiveModal] = useState(null);
  const [adminComment, setAdminComment] = useState('');
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadRequests = async () => {
    try {
      const liveList = await fetchAllLeaveRequests();
      setRequests(liveList.length > 0 ? liveList : mockLeaveRequests);
    } catch (err) {
      console.error('Error loading leave requests:', err);
      setRequests(mockLeaveRequests);
      setError('Failed to load leave requests.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const openReviewModal = (req, action) => {
    setActiveModal({ req, action });
    setAdminComment('');
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleConfirmReview = async () => {
    if (!activeModal) return;
    const { req, action } = activeModal;
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      const adminName = profile?.fullName || user?.displayName || 'HR Admin';
      await reviewLeaveRequest(req.id, {
        status: action === 'approve' ? 'approved' : 'rejected',
        adminComment,
        adminName,
      });

      setSuccess(`Leave request from ${req.employeeName || 'employee'} has been ${action === 'approve' ? 'approved' : 'rejected'}!`);
      setActiveModal(null);
      await loadRequests();
    } catch (err) {
      console.error('Error reviewing leave request:', err);
      setError(err.message || 'Failed to update leave request.');
    } finally {
      setActionLoading(false);
    }
  };

  const filtered = requests.filter(r => {
    if (filter === 'all') return true;
    return (r.status || '').toLowerCase() === filter;
  });

  const pendingCount = requests.filter(r => (r.status || '').toLowerCase() === 'pending').length;
  const approvedCount = requests.filter(r => (r.status || '').toLowerCase() === 'approved').length;
  const rejectedCount = requests.filter(r => (r.status || '').toLowerCase() === 'rejected').length;

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
        <div className="alert alert--error" style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertIcon size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert--success" style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircleIcon size={18} />
          <span>{success}</span>
        </div>
      )}

      {/* Filter Tabs */}
      <div className="tabs" style={{ marginBottom: 'var(--space-6)', width: 'fit-content' }}>
        <button className={`tab ${filter === 'pending' ? 'tab--active' : ''}`} onClick={() => setFilter('pending')}>
          Pending Review ({pendingCount})
        </button>
        <button className={`tab ${filter === 'approved' ? 'tab--active' : ''}`} onClick={() => setFilter('approved')}>
          Approved ({approvedCount})
        </button>
        <button className={`tab ${filter === 'rejected' ? 'tab--active' : ''}`} onClick={() => setFilter('rejected')}>
          Rejected ({rejectedCount})
        </button>
        <button className={`tab ${filter === 'all' ? 'tab--active' : ''}`} onClick={() => setFilter('all')}>
          All Requests ({requests.length})
        </button>
      </div>

      {/* Leave Request Table */}
      <div className="card">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Leave Type</th>
                <th>Dates</th>
                <th>Days</th>
                <th>Reason / Remarks</th>
                <th>Status</th>
                <th>Admin Note</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                    Loading leave requests from Firestore...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                    No leave requests found in this category.
                  </td>
                </tr>
              ) : (
                filtered.map(req => {
                  const empName = req.employeeName || 'Employee';
                  const empId = req.employeeDisplayId || req.employeeId || 'EMP';
                  const avatar = req.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(empName)}`;
                  const isPending = (req.status || '').toLowerCase() === 'pending';

                  return (
                    <tr key={req.id}>
                      <td>
                        <div className="employee-cell">
                          <img src={avatar} alt={empName} className="avatar avatar--sm" />
                          <div className="employee-cell__info">
                            <span className="employee-cell__name">{empName}</span>
                            <span className="employee-cell__id">{empId}</span>
                          </div>
                        </div>
                      </td>
                      <td>
                        <span className={`badge ${req.leaveType === 'sick' ? 'badge--sick-leave' : 'badge--info'}`}>
                          {req.leaveType ? `${req.leaveType.charAt(0).toUpperCase() + req.leaveType.slice(1)} Leave` : 'Leave'}
                        </span>
                      </td>
                      <td>{req.startDate || req.from} → {req.endDate || req.to}</td>
                      <td>{req.days} {Number(req.days) === 1 ? 'day' : 'days'}</td>
                      <td style={{ maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={req.remarks}>
                        {req.remarks || 'No remarks provided'}
                      </td>
                      <td>
                        <span className={`badge ${badgeClass(req.status)}`}>
                          {req.status ? req.status.charAt(0).toUpperCase() + req.status.slice(1) : 'Pending'}
                        </span>
                      </td>
                      <td style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', maxWidth: '160px' }}>
                        {req.adminComment || (isPending ? '—' : 'None')}
                      </td>
                      <td>
                        {isPending ? (
                          <div className="action-buttons" style={{ display: 'flex', gap: 'var(--space-2)' }}>
                            <button
                              className="btn btn--success btn--sm"
                              onClick={() => openReviewModal(req, 'approve')}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                            >
                              <CheckIcon size={14} />
                              <span>Approve</span>
                            </button>
                            <button
                              className="btn btn--danger btn--sm"
                              onClick={() => openReviewModal(req, 'reject')}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                            >
                              <XIcon size={14} />
                              <span>Reject</span>
                            </button>
                          </div>
                        ) : (
                          <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
                            Reviewed by {req.reviewedBy || 'Admin'}
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Review Modal */}
      {activeModal && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'rgba(0,0,0,0.7)',
          backdropFilter: 'blur(4px)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          zIndex: 1000,
        }}>
          <div className="card" style={{ maxWidth: '480px', width: '90%', animation: 'slideIn 0.2s ease' }}>
            <div className="card__header">
              <h3 className="card__title">
                {activeModal.action === 'approve' ? 'Approve Leave Request' : 'Reject Leave Request'}
              </h3>
            </div>
            <p style={{ color: 'var(--color-text-secondary)', fontSize: 'var(--text-sm)', marginBottom: 'var(--space-4)' }}>
              Confirm {activeModal.action === 'approve' ? 'approval' : 'rejection'} for{' '}
              <strong>{activeModal.req.employeeName || 'Employee'}</strong> from{' '}
              <strong>{activeModal.req.startDate || activeModal.req.from}</strong> to{' '}
              <strong>{activeModal.req.endDate || activeModal.req.to}</strong> ({activeModal.req.days} days).
            </p>
            <div className="form-group" style={{ marginBottom: 'var(--space-6)' }}>
              <label className="form-label">Admin Comment / Note (Optional)</label>
              <textarea
                className="form-textarea"
                placeholder="Add comments for the employee..."
                value={adminComment}
                onChange={(e) => setAdminComment(e.target.value)}
                style={{ minHeight: '80px' }}
              />
            </div>
            <div style={{ display: 'flex', gap: 'var(--space-3)', justifyContent: 'flex-end' }}>
              <button className="btn btn--secondary" onClick={() => setActiveModal(null)} disabled={actionLoading}>
                Cancel
              </button>
              <button
                className={`btn ${activeModal.action === 'approve' ? 'btn--success' : 'btn--danger'}`}
                onClick={handleConfirmReview}
                disabled={actionLoading}
              >
                {actionLoading ? 'Saving...' : `Confirm ${activeModal.action === 'approve' ? 'Approve' : 'Reject'}`}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
