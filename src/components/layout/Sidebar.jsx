import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { currentUser as defaultMockUser } from '../../data/mockData';
import {
  DashboardIcon,
  ProfileIcon,
  EmployeesIcon,
  AttendanceIcon,
  LeaveIcon,
  LeaveApprovalIcon,
  PayrollIcon,
  ReportsIcon,
  LogoutIcon,
} from '../common/Icons';
import './Sidebar.css';

const employeeNav = [
  { path: '/dashboard', label: 'Dashboard', icon: <DashboardIcon size={18} /> },
  { path: '/profile', label: 'Profile', icon: <ProfileIcon size={18} /> },
  { path: '/attendance', label: 'Attendance', icon: <AttendanceIcon size={18} /> },
  { path: '/leave/apply', label: 'Leave', icon: <LeaveIcon size={18} /> },
  { path: '/payroll', label: 'Payroll', icon: <PayrollIcon size={18} /> },
  { path: '/reports', label: 'Reports', icon: <ReportsIcon size={18} /> },
];

const adminNav = [
  { path: '/admin/dashboard', label: 'Dashboard', icon: <DashboardIcon size={18} /> },
  { path: '/admin/employees', label: 'Employees', icon: <EmployeesIcon size={18} /> },
  { path: '/attendance', label: 'Attendance', icon: <AttendanceIcon size={18} /> },
  { path: '/admin/leave-approvals', label: 'Leave Approvals', icon: <LeaveApprovalIcon size={18} /> },
  { path: '/admin/payroll', label: 'Payroll', icon: <PayrollIcon size={18} /> },
  { path: '/reports', label: 'Reports', icon: <ReportsIcon size={18} /> },
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
            <span className="sidebar__link-icon" style={{ display: 'inline-flex', alignItems: 'center' }}>{item.icon}</span>
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
          <span style={{ display: 'inline-flex', alignItems: 'center' }}><LogoutIcon size={16} /></span>
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}
