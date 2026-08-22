import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { currentUser as defaultMockUser } from '../../data/mockData';
import './Sidebar.css';

const employeeNav = [
  { path: '/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/profile', label: 'Profile', icon: '👤' },
  { path: '/attendance', label: 'Attendance', icon: '🕐' },
  { path: '/leave/apply', label: 'Leave', icon: '📅' },
  { path: '/payroll', label: 'Payroll', icon: '💰' },
  { path: '/reports', label: 'Reports', icon: '📈' },
];

const adminNav = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: '📊' },
  { path: '/admin/employees', label: 'Employees', icon: '👥' },
  { path: '/attendance', label: 'Attendance', icon: '🕐' },
  { path: '/admin/leave-approvals', label: 'Leave Approvals', icon: '✅' },
  { path: '/admin/payroll', label: 'Payroll', icon: '💰' },
  { path: '/reports', label: 'Reports', icon: '📈' },
];

export default function Sidebar() {
  const navigate = useNavigate();
  const { profile, role, logout } = useAuth();

  const isAdmin = (role || defaultMockUser.role) === 'admin';
  const navItems = isAdmin ? adminNav : employeeNav;

  const displayName = profile?.fullName || defaultMockUser.name;
  const avatarUrl = profile?.profilePictureUrl || defaultMockUser.avatar;

  const handleLogout = async () => {
    try {
      await logout();
    } catch (err) {
      console.error('Logout error:', err);
    }
    navigate('/signin');
  };

  return (
    <aside className="sidebar">
      <div className="sidebar__brand" onClick={() => navigate(isAdmin ? '/admin/dashboard' : '/dashboard')}>
        <div className="sidebar__logo">
          <span className="sidebar__logo-icon">D</span>
        </div>
        <div className="sidebar__brand-text">
          <span className="sidebar__brand-name">Dayflow</span>
          <span className="sidebar__brand-tag">HRMS</span>
        </div>
      </div>

      <nav className="sidebar__nav">
        {navItems.map(item => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `sidebar__link ${isActive ? 'sidebar__link--active' : ''}`}
          >
            <span className="sidebar__link-icon">{item.icon}</span>
            <span className="sidebar__link-label">{item.label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar__footer">
        <div className="sidebar__user">
          <img src={avatarUrl} alt={displayName} className="avatar avatar--sm" />
          <div className="sidebar__user-info">
            <span className="sidebar__user-name">{displayName}</span>
            <span className="sidebar__user-role">{isAdmin ? 'HR Admin' : 'Employee'}</span>
          </div>
        </div>
        <button className="sidebar__logout" onClick={handleLogout}>
          <span>🚪</span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
