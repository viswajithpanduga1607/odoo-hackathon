import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { applyForLeave, fetchEmployeeLeaveRequests } from '../../firebase/leaveService';

export default function LeaveApply() {
  const { user, profile } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    type: 'Paid Leave',
    from: '',
    to: '',
    remarks: '',
  });

  const loadLeaveHistory = async () => {
    if (!user?.uid) return;
    try {
      const liveLeaves = await fetchEmployeeLeaveRequests(user.uid);
      setRequests(liveLeaves);
    } catch (err) {
      console.error('Error loading leave history:', err);
      setError('Failed to load leave history.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeaveHistory();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const calcDaysNumber = () => {
    if (!form.from || !form.to) return 0;
    const diff = (new Date(form.to) - new Date(form.from)) / (1000 * 60 * 60 * 24) + 1;
    return diff > 0 ? diff : 0;
  };

  const calcDaysDisplay = () => {
    const days = calcDaysNumber();
    return days > 0 ? `${days} day${days > 1 ? 's' : ''}` : '-';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;

    if (!form.from || !form.to) {
      setError('Please select both Start Date and End Date.');
      return;
    }

    const daysCount = calcDaysNumber();
    if (daysCount <= 0) {
      setError('End Date must be on or after Start Date.');
      return;
    }

    setSubmitting(true);
    setError('');
    setSuccess('');

    try {
      // Create real document in Firestore leaveRequests collection
      await applyForLeave({
        uid: user.uid,
        profile: profile || {},
        leaveType: form.type,
        startDate: form.from,
        endDate: form.to,
        remarks: form.remarks,
        days: daysCount,
      });

      setSuccess('Leave application submitted successfully! Status: Pending HR approval.');
      setForm({ type: 'Paid Leave', from: '', to: '', remarks: '' });
      await loadLeaveHistory();
    } catch (err) {
      console.error('Leave application error:', err);
      setError(err.message || 'Failed to submit leave application.');
    } finally {
      setSubmitting(false);
    }
  };

  const badgeClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s === 'approved') return 'badge--approved';
    if (s === 'rejected') return 'badge--rejected';
    return 'badge--pending';
  };

  // Calculate used leaves from approved requests
  const approvedPaidDays = requests
    .filter(r => (r.leaveType || '').toLowerCase() === 'paid' && (r.status || '').toLowerCase() === 'approved')
    .reduce((sum, r) => sum + (Number(r.days) || 0), 0);

  const approvedSickDays = requests
    .filter(r => (r.leaveType || '').toLowerCase() === 'sick' && (r.status || '').toLowerCase() === 'approved')
    .reduce((sum, r) => sum + (Number(r.days) || 0), 0);

  const totalPaidEntitlement = 15;
  const totalSickEntitlement = 7;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave Management</h1>
          <p className="page-subtitle">Apply for leave and track your requests in real-time</p>
        </div>
      </div>

      {/* Leave Balances */}
      <div className="leave-balances">
        <div className="leave-balance-card leave-balance-card--paid">
          <div className="leave-balance-card__type">Paid Leave Balance</div>
          <div className="leave-balance-card__count">
            {Math.max(0, totalPaidEntitlement - approvedPaidDays)} <span>/ {totalPaidEntitlement}</span>
          </div>
        </div>
        <div className="leave-balance-card leave-balance-card--sick">
          <div className="leave-balance-card__type">Sick Leave Balance</div>
          <div className="leave-balance-card__count">
            {Math.max(0, totalSickEntitlement - approvedSickDays)} <span>/ {totalSickEntitlement}</span>
          </div>
        </div>
        <div className="leave-balance-card leave-balance-card--unpaid">
          <div className="leave-balance-card__type">Unpaid Leave</div>
          <div className="leave-balance-card__count">Unlimited</div>
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

      {/* Apply Form */}
      <div className="card" style={{ marginBottom: 'var(--space-8)' }}>
        <div className="card__header">
          <h3 className="card__title">Apply for Leave</h3>
        </div>
        <form onSubmit={handleSubmit}>
          <div className="grid-2" style={{ gap: 'var(--space-5)' }}>
            <div className="form-group">
              <label className="form-label">Leave Type</label>
              <select name="type" className="form-select" value={form.type} onChange={handleChange} disabled={submitting}>
                <option value="Paid Leave">Paid Leave</option>
                <option value="Sick Leave">Sick Leave</option>
                <option value="Unpaid Leave">Unpaid Leave</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Calculated Duration</label>
              <input type="text" className="form-input" value={calcDaysDisplay()} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">From Date</label>
              <input
                type="date"
                name="from"
                className="form-input"
                value={form.from}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>
            <div className="form-group">
              <label className="form-label">To Date</label>
              <input
                type="date"
                name="to"
                className="form-input"
                value={form.to}
                onChange={handleChange}
                required
                disabled={submitting}
              />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Remarks / Reason</label>
              <textarea
                name="remarks"
                className="form-textarea"
                placeholder="Describe the reason for your leave application..."
                value={form.remarks}
                onChange={handleChange}
                disabled={submitting}
              />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
            <button
              type="button"
              className="btn btn--secondary"
              onClick={() => setForm({ type: 'Paid Leave', from: '', to: '', remarks: '' })}
              disabled={submitting}
            >
              Reset
            </button>
            <button type="submit" className="btn btn--primary" disabled={submitting}>
              {submitting ? 'Submitting Application...' : 'Submit Application'}
            </button>
          </div>
        </form>
      </div>

      {/* Leave History */}
      <div className="card">
        <div className="card__header">
          <h3 className="card__title">My Leave History ({requests.length})</h3>
        </div>
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Type</th>
                <th>From</th>
                <th>To</th>
                <th>Days</th>
                <th>Status</th>
                <th>Admin Note</th>
                <th>Applied On</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                    Loading leave requests from Firestore...
                  </td>
                </tr>
              ) : requests.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                    No leave requests found. Submit a request using the form above!
                  </td>
                </tr>
              ) : (
                requests.map(lr => {
                  const appliedDate = lr.createdAt ? new Date(lr.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' }) : '-';
                  return (
                    <tr key={lr.id}>
                      <td>
                        <span className={`badge ${lr.leaveType === 'sick' ? 'badge--sick-leave' : 'badge--info'}`}>
                          {lr.leaveType ? `${lr.leaveType.charAt(0).toUpperCase() + lr.leaveType.slice(1)} Leave` : 'Leave'}
                        </span>
                      </td>
                      <td>{lr.startDate || lr.from}</td>
                      <td>{lr.endDate || lr.to}</td>
                      <td>{lr.days} {Number(lr.days) === 1 ? 'day' : 'days'}</td>
                      <td>
                        <span className={`badge ${badgeClass(lr.status)}`}>
                          {lr.status ? lr.status.charAt(0).toUpperCase() + lr.status.slice(1) : 'Pending'}
                        </span>
                      </td>
                      <td style={{ fontSize: 'var(--text-xs)', color: lr.adminComment ? 'var(--color-text-primary)' : 'var(--color-text-muted)' }}>
                        {lr.adminComment || (lr.status === 'pending' ? 'Awaiting review' : 'No comment')}
                      </td>
                      <td>{appliedDate}</td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
