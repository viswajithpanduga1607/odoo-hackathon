import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchAllPayrolls, updateEmployeePayroll } from '../../firebase/payrollService';
import {
  PayrollIcon,
  CheckCircleIcon,
  ClockPendingIcon,
  CreditCardIcon,
  AlertIcon,
  EditIcon,
  XIcon,
} from '../../components/common/Icons';

export default function AdminPayroll() {
  const { user } = useAuth();
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('August 2026');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const loadData = async () => {
    try {
      const list = await fetchAllPayrolls();
      setPayrolls(list);
    } catch (err) {
      console.error('Error fetching admin payroll list:', err);
      setError('Failed to load payroll list from Firestore.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleEdit = (emp) => {
    setEditingId(emp.id);
    setEditForm({
      employeeDisplayId: emp.employeeDisplayId || '',
      employeeName: emp.employeeName || '',
      department: emp.department || '',
      basic: emp.basic,
      hra: emp.hra,
      specialAllowance: emp.specialAllowance,
      medicalAllowance: emp.medicalAllowance || 5000,
      pfDeduction: emp.pfDeduction,
      professionalTax: emp.professionalTax || 200,
      incomeTax: emp.incomeTax,
      status: emp.status || 'Paid',
    });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSave = async (empId) => {
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateEmployeePayroll(empId, editForm, user?.uid || 'admin');
      setSuccess(`Payroll for ${editForm.employeeName || 'employee'} updated successfully!`);
      setEditingId(null);
      await loadData();
    } catch (err) {
      console.error('Error saving payroll:', err);
      setError(err.message || 'Failed to save payroll changes.');
    } finally {
      setSaving(false);
    }
  };

  const filtered = payrolls.filter(e => {
    const name = (e.employeeName || '').toLowerCase();
    const dept = (e.department || '').toLowerCase();
    const id = (e.employeeDisplayId || '').toLowerCase();
    return name.includes(search.toLowerCase()) || dept.includes(search.toLowerCase()) || id.includes(search.toLowerCase());
  });

  const totalPayrollCost = payrolls.reduce((sum, emp) => sum + (Number(emp.net) || 0), 0);
  const processedCount = payrolls.filter(e => (e.status || '').toLowerCase() === 'paid').length;
  const pendingCount = payrolls.length - processedCount;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Payroll Management</h1>
          <p className="page-subtitle">View and configure employee salary structures in Firestore</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <select className="form-select" value={period} onChange={(e) => setPeriod(e.target.value)} style={{ width: 'auto' }}>
            <option>August 2026</option>
            <option>July 2026</option>
            <option>June 2026</option>
          </select>
          <button
            className="btn btn--primary"
            onClick={() => setSuccess('All pending payrolls marked as processed!')}
            style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}
          >
            <CreditCardIcon size={16} />
            <span>Process Payroll</span>
          </button>
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

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--indigo" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <PayrollIcon size={20} />
          </div>
          <div>
            <div className="stat-card__value">₹{totalPayrollCost.toLocaleString()}</div>
            <div className="stat-card__label">Total Monthly Payroll Cost</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--emerald" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <CheckCircleIcon size={20} />
          </div>
          <div>
            <div className="stat-card__value">{processedCount}</div>
            <div className="stat-card__label">Processed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--amber" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
            <ClockPendingIcon size={20} />
          </div>
          <div>
            <div className="stat-card__value">{pendingCount}</div>
            <div className="stat-card__label">Pending</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search by name, ID, or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '360px' }}
        />
      </div>

      {/* Payroll Table */}
      <div className="card">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Basic</th>
                <th>Gross</th>
                <th>Deductions</th>
                <th>Net Pay</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                    Loading payroll data from Firestore...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="8" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                    No employee payroll records found.
                  </td>
                </tr>
              ) : (
                filtered.map(emp => {
                  const isEditing = editingId === emp.id;
                  const avatarUrl = emp.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(emp.employeeName)}`;

                  return (
                    <React.Fragment key={emp.id}>
                      <tr>
                        <td>
                          <div className="employee-cell">
                            <img src={avatarUrl} alt={emp.employeeName} className="avatar avatar--sm" />
                            <div className="employee-cell__info">
                              <span className="employee-cell__name">{emp.employeeName}</span>
                              <span className="employee-cell__id">{emp.employeeDisplayId}</span>
                            </div>
                          </div>
                        </td>
                        <td>{emp.department}</td>
                        <td>₹{Number(emp.basic).toLocaleString()}</td>
                        <td>₹{Number(emp.gross).toLocaleString()}</td>
                        <td>₹{Number(emp.totalDeductions).toLocaleString()}</td>
                        <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>
                          ₹{Number(emp.net).toLocaleString()}
                        </td>
                        <td>
                          <span className={`badge ${emp.status === 'Pending' ? 'badge--pending' : 'badge--paid'}`}>
                            {emp.status || 'Paid'}
                          </span>
                        </td>
                        <td>
                          <div className="action-buttons">
                            <button
                              className="btn btn--ghost btn--sm"
                              onClick={() => isEditing ? setEditingId(null) : handleEdit(emp)}
                              title={isEditing ? 'Cancel' : 'Edit Salary Structure'}
                              style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                            >
                              {isEditing ? <XIcon size={14} /> : <EditIcon size={13} />}
                              <span>{isEditing ? 'Close' : 'Edit'}</span>
                            </button>
                          </div>
                        </td>
                      </tr>
                      {isEditing && (
                        <tr>
                          <td colSpan="8" style={{ background: 'var(--color-bg-primary)', padding: 'var(--space-6)', borderLeft: '3px solid var(--color-primary)' }}>
                            <div style={{ marginBottom: 'var(--space-3)', fontWeight: 600, color: 'var(--color-text-primary)' }}>
                              Configure Salary Structure for {emp.employeeName}:
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                              <div className="form-group" style={{ minWidth: '130px' }}>
                                <label className="form-label">Basic (₹)</label>
                                <input
                                  type="number"
                                  className="form-input"
                                  value={editForm.basic}
                                  onChange={(e) => setEditForm({ ...editForm, basic: +e.target.value })}
                                />
                              </div>
                              <div className="form-group" style={{ minWidth: '130px' }}>
                                <label className="form-label">HRA (₹)</label>
                                <input
                                  type="number"
                                  className="form-input"
                                  value={editForm.hra}
                                  onChange={(e) => setEditForm({ ...editForm, hra: +e.target.value })}
                                />
                              </div>
                              <div className="form-group" style={{ minWidth: '130px' }}>
                                <label className="form-label">Spl. Allowance (₹)</label>
                                <input
                                  type="number"
                                  className="form-input"
                                  value={editForm.specialAllowance}
                                  onChange={(e) => setEditForm({ ...editForm, specialAllowance: +e.target.value })}
                                />
                              </div>
                              <div className="form-group" style={{ minWidth: '130px' }}>
                                <label className="form-label">PF (₹)</label>
                                <input
                                  type="number"
                                  className="form-input"
                                  value={editForm.pfDeduction}
                                  onChange={(e) => setEditForm({ ...editForm, pfDeduction: +e.target.value })}
                                />
                              </div>
                              <div className="form-group" style={{ minWidth: '130px' }}>
                                <label className="form-label">Income Tax (₹)</label>
                                <input
                                  type="number"
                                  className="form-input"
                                  value={editForm.incomeTax}
                                  onChange={(e) => setEditForm({ ...editForm, incomeTax: +e.target.value })}
                                />
                              </div>
                              <div className="form-group" style={{ minWidth: '120px' }}>
                                <label className="form-label">Status</label>
                                <select
                                  className="form-select"
                                  value={editForm.status}
                                  onChange={(e) => setEditForm({ ...editForm, status: e.target.value })}
                                >
                                  <option value="Paid">Paid</option>
                                  <option value="Pending">Pending</option>
                                </select>
                              </div>
                              <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                                <button
                                  className="btn btn--primary btn--sm"
                                  onClick={() => handleSave(emp.id)}
                                  disabled={saving}
                                >
                                  {saving ? 'Saving...' : 'Save Changes'}
                                </button>
                                <button
                                  className="btn btn--secondary btn--sm"
                                  onClick={() => setEditingId(null)}
                                  disabled={saving}
                                >
                                  Cancel
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
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
