import { useState } from 'react';
import { leaveBalances, leaveRequests, currentUser } from '../../data/mockData';

export default function LeaveApply() {
  const [form, setForm] = useState({
    type: 'Paid Leave',
    from: '',
    to: '',
    remarks: '',
  });
  const [submitted, setSubmitted] = useState(false);

  const myLeaves = leaveRequests.filter(lr => lr.employeeId === currentUser.id);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => setSubmitted(false), 3000);
    setForm({ type: 'Paid Leave', from: '', to: '', remarks: '' });
  };

  const calcDays = () => {
    if (!form.from || !form.to) return '-';
    const diff = (new Date(form.to) - new Date(form.from)) / (1000 * 60 * 60 * 24) + 1;
    return diff > 0 ? `${diff} day${diff > 1 ? 's' : ''}` : '-';
  };

  const badgeClass = (status) => {
    const map = { 'Approved': 'badge--approved', 'Pending': 'badge--pending', 'Rejected': 'badge--rejected' };
    return map[status] || 'badge--neutral';
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Leave Management</h1>
          <p className="page-subtitle">Apply for leave and track your requests</p>
        </div>
      </div>

      {/* Leave Balances */}
      <div className="leave-balances">
        <div className="leave-balance-card leave-balance-card--paid">
          <div className="leave-balance-card__type">Paid Leave</div>
          <div className="leave-balance-card__count">
            {leaveBalances.paid.total - leaveBalances.paid.used} <span>/ {leaveBalances.paid.total}</span>
          </div>
        </div>
        <div className="leave-balance-card leave-balance-card--sick">
          <div className="leave-balance-card__type">Sick Leave</div>
          <div className="leave-balance-card__count">
            {leaveBalances.sick.total - leaveBalances.sick.used} <span>/ {leaveBalances.sick.total}</span>
          </div>
        </div>
        <div className="leave-balance-card leave-balance-card--unpaid">
          <div className="leave-balance-card__type">Unpaid Leave</div>
          <div className="leave-balance-card__count">Unlimited</div>
        </div>
      </div>

      {submitted && (
        <div className="alert alert--success" style={{ marginBottom: 'var(--space-6)' }}>
          <span>✅</span> Leave application submitted successfully!
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
              <select name="type" className="form-select" value={form.type} onChange={handleChange}>
                <option>Paid Leave</option>
                <option>Sick Leave</option>
                <option>Unpaid Leave</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Number of Days</label>
              <input type="text" className="form-input" value={calcDays()} disabled />
            </div>
            <div className="form-group">
              <label className="form-label">From Date</label>
              <input type="date" name="from" className="form-input" value={form.from} onChange={handleChange} required />
            </div>
            <div className="form-group">
              <label className="form-label">To Date</label>
              <input type="date" name="to" className="form-input" value={form.to} onChange={handleChange} required />
            </div>
            <div className="form-group" style={{ gridColumn: '1 / -1' }}>
              <label className="form-label">Remarks / Reason</label>
              <textarea name="remarks" className="form-textarea" placeholder="Describe the reason for your leave..." value={form.remarks} onChange={handleChange} />
            </div>
          </div>
          <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end', marginTop: 'var(--space-6)' }}>
            <button type="button" className="btn btn--secondary" onClick={() => setForm({ type: 'Paid Leave', from: '', to: '', remarks: '' })}>Cancel</button>
            <button type="submit" className="btn btn--primary">Submit Application</button>
          </div>
        </form>
      </div>

      {/* Leave History */}
      <div className="card">
        <div className="card__header">
          <h3 className="card__title">My Leave History</h3>
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
                <th>Applied On</th>
              </tr>
            </thead>
            <tbody>
              {myLeaves.length > 0 ? myLeaves.map(lr => (
                <tr key={lr.id}>
                  <td><span className={`badge ${lr.type === 'Sick Leave' ? 'badge--sick-leave' : 'badge--info'}`}>{lr.type}</span></td>
                  <td>{lr.from}</td>
                  <td>{lr.to}</td>
                  <td>{lr.days}</td>
                  <td><span className={`badge ${badgeClass(lr.status)}`}>{lr.status}</span></td>
                  <td>{lr.appliedOn}</td>
                </tr>
              )) : (
                <tr><td colSpan="6" style={{ textAlign: 'center', color: 'var(--color-text-muted)', padding: 'var(--space-8)' }}>No leave requests found</td></tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
