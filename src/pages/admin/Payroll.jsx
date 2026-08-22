import React, { useState } from 'react';
import { employees, getSalaryBreakdown } from '../../data/mockData';

export default function AdminPayroll() {
  const [search, setSearch] = useState('');
  const [period, setPeriod] = useState('July 2024');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({});

  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

  const handleEdit = (empId) => {
    const sal = getSalaryBreakdown(empId);
    setEditingId(empId);
    setEditForm({ basic: sal.basic, hra: sal.hra, specialAllowance: sal.specialAllowance, pfDeduction: sal.pfDeduction, incomeTax: sal.incomeTax });
  };

  const handleSave = () => {
    setEditingId(null);
    setEditForm({});
  };

  const totalPayroll = employees.reduce((sum, emp) => sum + getSalaryBreakdown(emp.id).net, 0);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Payroll Management</h1>
          <p className="page-subtitle">View and edit employee payroll details</p>
        </div>
        <div style={{ display: 'flex', gap: 'var(--space-3)' }}>
          <select className="form-select" value={period} onChange={(e) => setPeriod(e.target.value)} style={{ width: 'auto' }}>
            <option>July 2024</option>
            <option>June 2024</option>
            <option>May 2024</option>
          </select>
          <button className="btn btn--primary">💳 Process Payroll</button>
        </div>
      </div>

      {/* Stats */}
      <div className="grid-3" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--indigo">💰</div>
          <div>
            <div className="stat-card__value">₹{totalPayroll.toLocaleString()}</div>
            <div className="stat-card__label">Total Payroll Cost</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--emerald">✅</div>
          <div>
            <div className="stat-card__value">{employees.length - 2}</div>
            <div className="stat-card__label">Processed</div>
          </div>
        </div>
        <div className="stat-card">
          <div className="stat-card__icon stat-card__icon--amber">⏳</div>
          <div>
            <div className="stat-card__value">2</div>
            <div className="stat-card__label">Pending</div>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ marginBottom: 'var(--space-4)' }}>
        <input
          type="text"
          className="form-input"
          placeholder="Search employees by name or department..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '400px' }}
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
              {filteredEmployees.map(emp => {
                const sal = getSalaryBreakdown(emp.id);
                const isEditing = editingId === emp.id;
                const isPending = emp.id === 'EMP-2024-005' || emp.id === 'EMP-2024-008';

                return (
                  <React.Fragment key={emp.id}>
                    <tr>
                      <td>
                        <div className="employee-cell">
                          <img src={emp.avatar} alt={emp.name} className="avatar avatar--sm" />
                          <div className="employee-cell__info">
                            <span className="employee-cell__name">{emp.name}</span>
                            <span className="employee-cell__id">{emp.id}</span>
                          </div>
                        </div>
                      </td>
                      <td>{emp.department}</td>
                      <td>₹{sal.basic.toLocaleString()}</td>
                      <td>₹{sal.gross.toLocaleString()}</td>
                      <td>₹{sal.totalDeductions.toLocaleString()}</td>
                      <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>₹{sal.net.toLocaleString()}</td>
                      <td>
                        <span className={`badge ${isPending ? 'badge--pending' : 'badge--paid'}`}>
                          {isPending ? 'Pending' : 'Processed'}
                        </span>
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="btn btn--ghost btn--sm" onClick={() => isEditing ? setEditingId(null) : handleEdit(emp.id)}>
                            {isEditing ? '✕' : '✏️'}
                          </button>
                        </div>
                      </td>
                    </tr>
                    {isEditing && (
                      <tr>
                        <td colSpan="8" style={{ background: 'var(--color-bg-primary)', padding: 'var(--space-5)' }}>
                          <div style={{ display: 'flex', gap: 'var(--space-4)', flexWrap: 'wrap', alignItems: 'flex-end' }}>
                            <div className="form-group" style={{ minWidth: '140px' }}>
                              <label className="form-label">Basic (₹)</label>
                              <input type="number" className="form-input" value={editForm.basic} onChange={(e) => setEditForm({ ...editForm, basic: +e.target.value })} />
                            </div>
                            <div className="form-group" style={{ minWidth: '140px' }}>
                              <label className="form-label">HRA (₹)</label>
                              <input type="number" className="form-input" value={editForm.hra} onChange={(e) => setEditForm({ ...editForm, hra: +e.target.value })} />
                            </div>
                            <div className="form-group" style={{ minWidth: '140px' }}>
                              <label className="form-label">Spl. Allowance (₹)</label>
                              <input type="number" className="form-input" value={editForm.specialAllowance} onChange={(e) => setEditForm({ ...editForm, specialAllowance: +e.target.value })} />
                            </div>
                            <div className="form-group" style={{ minWidth: '140px' }}>
                              <label className="form-label">PF (₹)</label>
                              <input type="number" className="form-input" value={editForm.pfDeduction} onChange={(e) => setEditForm({ ...editForm, pfDeduction: +e.target.value })} />
                            </div>
                            <div className="form-group" style={{ minWidth: '140px' }}>
                              <label className="form-label">Income Tax (₹)</label>
                              <input type="number" className="form-input" value={editForm.incomeTax} onChange={(e) => setEditForm({ ...editForm, incomeTax: +e.target.value })} />
                            </div>
                            <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                              <button className="btn btn--primary btn--sm" onClick={handleSave}>Save</button>
                              <button className="btn btn--secondary btn--sm" onClick={() => setEditingId(null)}>Cancel</button>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
