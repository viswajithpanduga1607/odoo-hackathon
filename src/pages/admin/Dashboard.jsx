import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchAllEmployees } from '../../firebase/userService';
import { fetchAllLeaveRequests, reviewLeaveRequest } from '../../firebase/leaveService';
import { fetchAllAttendance } from '../../firebase/attendanceService';
import { employees as mockEmployees, leaveRequests as mockLeaveRequests } from '../../data/mockData';

export default function AdminDashboard() {
  const { user, profile } = useAuth();
  const [employees, setEmployees] = useState([]);
  const [leaveList, setLeaveList] = useState([]);
  const [attendance, setAttendance] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState({});

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const loadData = async () => {
    try {
      const [empList, leaves, att] = await Promise.all([
        fetchAllEmployees(),
        fetchAllLeaveRequests(),
        fetchAllAttendance(),
      ]);
      setEmployees(empList.length > 0 ? empList : mockEmployees.map(e => ({ ...e, uid: e.id, fullName: e.name })));
      setLeaveList(leaves.length > 0 ? leaves : mockLeaveRequests);
      setAttendance(att);
    } catch (err) {
      console.error('Error loading admin dashboard stats:', err);
      setEmployees(mockEmployees.map(e => ({ ...e, uid: e.id, fullName: e.name })));
      setLeaveList(mockLeaveRequests);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleQuickAction = async (id, status) => {
    setActionLoading(prev => ({ ...prev, [id]: true }));
    try {
      const adminName = profile?.fullName || user?.displayName || 'HR Admin';
      await reviewLeaveRequest(id, {
        status,
        adminComment: `Quick ${status} from Dashboard`,
        adminName,
      });
      setLeaveList(prev => prev.map(r => r.id === id ? { ...r, status } : r));
    } catch (err) {
      console.error('Error in quick review:', err);
    } finally {
      setActionLoading(prev => ({ ...prev, [id]: false }));
    }
  };

  const pendingLeaves = leaveList.filter(lr => (lr.status || '').toLowerCase() === 'pending');
  const presentToday = attendance.filter(r => (r.status || '').toLowerCase().includes('present')).length;

  const filteredEmployees = employees.filter(e => {
    const name = (e.fullName || e.name || '').toLowerCase();
    const dept = (e.department || '').toLowerCase();
    return name.includes(search.toLowerCase()) || dept.includes(search.toLowerCase());
  });

  const stats = [
    { icon: '👥', label: 'Total Employees', value: employees.length, color: 'indigo' },
    { icon: '✅', label: 'Present Today', value: presentToday, color: 'emerald' },
    { icon: '📅', label: 'Pending Leaves', value: pendingLeaves.length, color: 'amber' },
    { icon: '💰', label: 'Payroll Due', value: '₹4.85L', color: 'purple' },
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
                  <th>Role</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredEmployees.slice(0, 5).map(emp => {
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
                      <td>
                        <span className={`badge ${role === 'admin' ? 'badge--warning' : 'badge--active'}`}>
                          {role === 'admin' ? 'HR Admin' : 'Employee'}
                        </span>
                      </td>
                      <td>
                        <Link to={`/admin/profile/edit/${targetUid}`} className="btn btn--ghost btn--sm">
                          Edit
                        </Link>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>

        {/* Pending Leave Approvals */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Pending Leave Approvals ({pendingLeaves.length})</h3>
            <Link to="/admin/leave-approvals" className="btn btn--ghost btn--sm">View All →</Link>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            {pendingLeaves.length === 0 ? (
              <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', textAlign: 'center', padding: 'var(--space-6)' }}>
                No pending leave approvals 🎉
              </p>
            ) : (
              pendingLeaves.slice(0, 4).map(lr => {
                const empName = lr.employeeName || 'Employee';
                const empId = lr.employeeDisplayId || lr.employeeId || 'EMP';
                const avatar = lr.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(empName)}`;
                const isProcessing = !!actionLoading[lr.id];

                return (
                  <div key={lr.id} style={{
                    padding: 'var(--space-4)',
                    background: 'var(--color-bg-primary)',
                    borderRadius: 'var(--radius-lg)',
                    border: '1px solid var(--color-border)'
                  }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-3)', marginBottom: 'var(--space-3)' }}>
                      <img src={avatar} alt={empName} className="avatar avatar--sm" />
                      <div>
                        <div style={{ fontWeight: 500, color: 'var(--color-text-primary)', fontSize: 'var(--text-sm)' }}>{empName}</div>
                        <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>{empId}</div>
                      </div>
                      <span className={`badge ${lr.leaveType === 'sick' ? 'badge--sick-leave' : 'badge--info'}`} style={{ marginLeft: 'auto' }}>
                        {lr.leaveType ? `${lr.leaveType.charAt(0).toUpperCase() + lr.leaveType.slice(1)} Leave` : 'Leave'}
                      </span>
                    </div>
                    <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-secondary)', marginBottom: 'var(--space-3)' }}>
                      {lr.startDate || lr.from} → {lr.endDate || lr.to} · {lr.days} {Number(lr.days) === 1 ? 'day' : 'days'}
                    </div>
                    <div style={{ display: 'flex', gap: 'var(--space-2)' }}>
                      <button
                        className="btn btn--success btn--sm"
                        style={{ flex: 1 }}
                        onClick={() => handleQuickAction(lr.id, 'approved')}
                        disabled={isProcessing}
                      >
                        {isProcessing ? '...' : 'Approve'}
                      </button>
                      <button
                        className="btn btn--danger btn--sm"
                        style={{ flex: 1 }}
                        onClick={() => handleQuickAction(lr.id, 'rejected')}
                        disabled={isProcessing}
                      >
                        {isProcessing ? '...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
