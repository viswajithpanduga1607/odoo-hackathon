import { useLocation } from 'react-router-dom';
import { currentUser } from '../../data/mockData';
import './TopBar.css';

const routeTitles = {
  '/dashboard': 'Employee Dashboard',
  '/admin/dashboard': 'HR Admin Panel',
  '/profile': 'My Profile',
  '/profile/edit': 'Edit Profile',
  '/admin/profile/edit': 'Edit Employee Profile',
  '/attendance': 'Attendance',
  '/leave/apply': 'Leave Management',
  '/admin/leave-approvals': 'Leave Approvals',
  '/payroll': 'My Payroll',
  '/admin/payroll': 'Payroll Management',
  '/reports': 'Reports',
  '/admin/employees': 'Employee Directory',
};

export default function TopBar() {
  const location = useLocation();
  const title = routeTitles[location.pathname] || 'Dayflow';

  return (
    <header className="topbar">
      <div className="topbar__title">{title}</div>
      <div className="topbar__actions">
        <button className="topbar__notification">
          <span>🔔</span>
          <span className="topbar__notification-badge">3</span>
        </button>
        <div className="topbar__user">
          <img src={currentUser.avatar} alt={currentUser.name} className="avatar avatar--sm" />
          <span className="topbar__user-name">{currentUser.name}</span>
        </div>
      </div>
    </header>
  );
}
