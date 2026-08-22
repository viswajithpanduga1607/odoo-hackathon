import { useState } from 'react';
import { Link } from 'react-router-dom';
import { employees } from '../../data/mockData';

export default function EmployeeList() {
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');
  const departments = ['All', ...new Set(employees.map(e => e.department))];

  const filtered = employees.filter(e => {
    const matchSearch = e.name.toLowerCase().includes(search.toLowerCase()) || e.id.toLowerCase().includes(search.toLowerCase());
    const matchDept = dept === 'All' || e.department === dept;
    return matchSearch && matchDept;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Directory</h1>
          <p className="page-subtitle">View and manage all employees</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          type="text"
          className="form-input"
          placeholder="Search by name or ID..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '300px' }}
        />
        <select className="form-select" value={dept} onChange={(e) => setDept(e.target.value)} style={{ width: 'auto' }}>
          {departments.map(d => <option key={d}>{d}</option>)}
        </select>
      </div>

      {/* Employee Table */}
      <div className="card">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Employee</th>
                <th>Department</th>
                <th>Designation</th>
                <th>Email</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(emp => (
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
                  <td>{emp.designation}</td>
                  <td style={{ color: 'var(--color-text-secondary)' }}>{emp.email}</td>
                  <td>
                    <span className={`badge ${emp.status === 'Active' ? 'badge--active' : 'badge--on-leave'}`}>
                      {emp.status}
                    </span>
                  </td>
                  <td>
                    <Link to={`/admin/profile/edit/${emp.id}`} className="btn btn--ghost btn--sm">✏️ Edit</Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
