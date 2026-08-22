import React from 'react';
import { useLocation } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { currentUser as defaultMockUser } from '../../data/mockData';
import { BellIcon } from '../common/Icons';
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
  const { profile } = useAuth();
  const title = routeTitles[location.pathname] || 'Dayflow';

  const displayName = profile?.fullName || defaultMockUser.name;
  const avatarUrl = profile?.profilePictureUrl || defaultMockUser.avatar;

  return (
    <header className="topbar">
      <div className="topbar__title">{title}</div>
      <div className="topbar__actions">
        <button className="topbar__notification" title="Notifications">
          <span style={{ display: 'inline-flex', alignItems: 'center' }}>
            <BellIcon size={18} />
          </span>
          <span className="topbar__notification-badge">3</span>
        </button>
        <div className="topbar__user">
          <img src={avatarUrl} alt={displayName} className="avatar avatar--sm" />
          <span className="topbar__user-name">{displayName}</span>
        </div>
      </div>
    </header>
  );
}
