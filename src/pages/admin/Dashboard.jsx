import { useState } from 'react';
import { Link } from 'react-router-dom';
import { employees, adminStats, leaveRequests } from '../../data/mockData';

export default function AdminDashboard() {
  const [search, setSearch] = useState('');
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const pendingLeaves = leaveRequests.filter(lr => lr.status === 'Pending');
  const filteredEmployees = employees.filter(e =>
    e.name.toLowerCase().includes(search.toLowerCase()) ||
    e.department.toLowerCase().includes(search.toLowerCase())
  );

  const stats = [
    { icon: '👥', label: 'Total Employees', value: adminStats.totalEmployees, color: 'indigo' },
    { icon: '✅', label: 'Present Today', value: adminStats.presentToday, color: 'emerald' },
    { icon: '📅', label: 'Pending Leaves', value: adminStats.pendingLeaves, color: 'amber' },
    { icon: '💰', label: 'Payroll Due', value: adminStats.payrollDue, color: 'purple' },
  ];

  return (
    <div>
      <div className="dashboard-greeting">
        <h1 className="dashboard-greeting__hello">
          HR Admin <span>Dashboard</span>
        </h1>
        <p className="dashboard-greeting__date">{today}</p>
      </div>

      {/* Stats */}
      <div className="grid-4" style={{ marginBottom: 'var(--space-8)' }}>
        {stats.map((stat, i) => (
          <div key={i} className="stat-card">
            <div className={`stat-card__icon stat-card__icon--${stat.color}`}>{stat.icon}</div>
            <div>
              <div className="stat-card__value">{stat.value}</div>
              <div className="stat-card__label">{stat.label}</div>
            </div>
          </div>
        ))}
      </div>

      {/* Two Column Layout */}
      <div className="admin-grid">
        {/* Employee Directory */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Employee Directory</h3>
            <Link to="/admin/employees" className="btn btn--ghost btn--sm">View All →</Link>
          </div>
          <div style={{ marginBottom: 'var(--space-4)' }}>
            <input
              type="text"
              className="form-input"
              placeholder="Search employees..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee</th>
                  <th>Department</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.slice(0, 6).map(emp => (
                  <tr key={emp.id}>
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
                    <td>
                      <span className={`badge ${emp.status === 'Active' ? 'badge--active' : 'badge--on-leave'}`}>
                        {emp.status}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/profile/edit/${emp.id}`} className="btn btn--ghost btn--sm">View</Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Leave Approvals */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Pending Leave Approvals</h3>
            <Link to="/admin/leave-approvals" className="btn btn--ghost btn--sm">View All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {pendingLeaves.slice(0, 4).map(lr => (
              <div key={lr.id} style={{
                padding: 'var(--space-4)',
                background: 'var(--color-bg-primary)',
                borderRadius: 'var(--radius-lg)',
                border: '1px solid var(--color-border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                  <img src={lr.avatar} alt={lr.employeeName} className="avatar avatar--sm" />
                  <div>
                    <div style={{ fontWeight: 500, color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>{lr.employeeName}</div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{lr.employeeId}</div>
                  </div>
                  <span className={`badge ${lr.type === 'Sick Leave' ? 'badge--sick-leave' : 'badge--info'}`} style={{ marginLeft: 'auto' }}>
                    {lr.type}
                  </span>
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
                  {lr.from} → {lr.to} · {lr.days} day{lr.days > 1 ? 's' : ''}
                </div>
                <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                  <button className="btn btn--success btn--sm" style={{ flex: 1 }}>Approve</button>
                  <button className="btn btn--danger btn--sm" style={{ flex: 1 }}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
