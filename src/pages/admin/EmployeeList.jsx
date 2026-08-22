import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { fetchAllEmployees } from '../../firebase/userService';
import { employees as mockEmployees } from '../../data/mockData';
import { EditIcon } from '../../components/common/Icons';

export default function EmployeeList() {
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [dept, setDept] = useState('All');

  useEffect(() => {
    async function load() {
      try {
        const liveList = await fetchAllEmployees();
        setEmployees(liveList.length > 0 ? liveList : mockEmployees.map(e => ({ ...e, uid: e.id, fullName: e.name })));
      } catch (err) {
        console.error('Error loading employees:', err);
        setEmployees(mockEmployees.map(e => ({ ...e, uid: e.id, fullName: e.name })));
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const departments = ['All', ...new Set(employees.map(e => e.department).filter(Boolean))];

  const filtered = employees.filter(e => {
    const name = (e.fullName || e.name || '').toLowerCase();
    const id = (e.employeeId || e.id || '').toLowerCase();
    const email = (e.email || '').toLowerCase();
    const matchSearch = name.includes(search.toLowerCase()) || id.includes(search.toLowerCase()) || email.includes(search.toLowerCase());
    const matchDept = dept === 'All' || e.department === dept;
    return matchSearch && matchDept;
  });

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Employee Directory</h1>
          <p className="page-subtitle">View and manage all registered team members</p>
        </div>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <input
          type="text"
          className="form-input"
          placeholder="Search by name, ID, or email..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          style={{ maxWidth: '320px' }}
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
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                    Loading employees from Firestore...
                  </td>
                </tr>
              ) : filtered.length === 0 ? (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                    No employees found matching criteria.
                  </td>
                </tr>
              ) : (
                filtered.map(emp => {
                  const name = emp.fullName || emp.name || 'Employee';
                  const empId = emp.employeeId || emp.id;
                  const targetUid = emp.uid || emp.id;
                  const avatar = emp.profilePictureUrl || emp.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(name)}`;
                  const role = emp.role || 'employee';

                  return (
                    <tr key={targetUid}>
                      <td>
                        <div className="employee-cell">
                          <img src={avatar} alt={name} className="avatar avatar--sm" />
                          <div className="employee-cell__info">
                            <span className="employee-cell__name">{name}</span>
                            <span className="employee-cell__id">{empId}</span>
                          </div>
                        </div>
                      </td>
                      <td>{emp.department || 'General'}</td>
                      <td>{emp.jobTitle || emp.designation || 'Software Engineer'}</td>
                      <td style={{ color: 'var(--color-text-secondary)' }}>{emp.email}</td>
                      <td>
                        <span className={`badge ${role === 'admin' ? 'badge--warning' : 'badge--active'}`}>
                          {role === 'admin' ? 'HR Admin' : 'Employee'}
                        </span>
                      </td>
                      <td>
                        <Link to={`/admin/profile/edit/${targetUid}`} className="btn btn--ghost btn--sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}>
                          <EditIcon size={13} />
                          <span>Edit</span>
                        </Link>
                      </td>
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
