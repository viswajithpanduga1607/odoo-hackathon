import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchEmployeeAttendance } from '../../firebase/attendanceService';
import { fetchEmployeeLeaveRequests } from '../../firebase/leaveService';
import { recentActivities } from '../../data/mockData';

export default function Dashboard() {
  const { user, profile } = useAuth();
  const [attendance, setAttendance] = useState([]);
  const [leaveList, setLeaveList] = useState([]);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  useEffect(() => {
    async function load() {
      if (user?.uid) {
        try {
          const [att, leaves] = await Promise.all([
            fetchEmployeeAttendance(user.uid),
            fetchEmployeeLeaveRequests(user.uid),
          ]);
          setAttendance(att);
          setLeaveList(leaves);
        } catch (err) {
          console.error('Error loading dashboard stats:', err);
        }
      }
    }
    load();
  }, [user]);

  const displayName = profile?.fullName || user?.displayName || 'Team Member';
  const firstName = displayName.split(' ')[0] || displayName;

  const presentCount = attendance.filter(r => (r.status || '').toLowerCase().includes('present')).length;
  const absentCount = attendance.filter(r => (r.status || '').toLowerCase().includes('absent')).length;
  const halfDayCount = attendance.filter(r => (r.status || '').toLowerCase().includes('half')).length;
  const leaveCount = attendance.filter(r => (r.status || '').toLowerCase().includes('leave')).length;

  const approvedLeaves = leaveList
    .filter(r => (r.status || '').toLowerCase() === 'approved')
    .reduce((sum, r) => sum + (Number(r.days) || 0), 0);
  const remainingLeaves = Math.max(0, 15 - approvedLeaves);

  const quickCards = [
    { icon: '👤', title: 'My Profile', stat: `${profile?.department || 'Engineering'} · ${profile?.jobTitle || 'Developer'}`, color: 'indigo', path: '/profile' },
    { icon: '🕐', title: 'Attendance', stat: `${presentCount} recorded shifts`, color: 'emerald', path: '/attendance' },
    { icon: '📅', title: 'Leave Requests', stat: `${remainingLeaves} paid leaves left`, color: 'amber', path: '/leave/apply' },
    { icon: '💰', title: 'Payroll', stat: 'View salary breakdown', color: 'purple', path: '/payroll' },
  ];

  return (
    <div>
      <div className="dashboard-greeting">
        <h1 className="dashboard-greeting__hello">
          Good Morning, <span>{firstName}!</span>
        </h1>
        <p className="dashboard-greeting__date">{today}</p>
      </div>

      <div className="quick-cards">
        {quickCards.map((card, i) => (
          <Link to={card.path} key={i} className="quick-card">
            <div className={`quick-card__icon stat-card__icon--${card.color}`}>
              {card.icon}
            </div>
            <span className="quick-card__title">{card.title}</span>
            <span className="quick-card__stat">{card.stat}</span>
          </Link>
        ))}
      </div>

      <div className="grid-2">
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Recent Activity</h3>
          </div>
          <div className="activity-feed">
            {leaveList.slice(0, 3).map(lr => (
              <div key={lr.id} className="activity-item">
                <span className="activity-item__icon">
                  {(lr.status || '').toLowerCase() === 'approved' ? '✅' : (lr.status || '').toLowerCase() === 'rejected' ? '❌' : '⏳'}
                </span>
                <div className="activity-item__content">
                  <p className="activity-item__text">
                    Leave request for {lr.startDate || lr.from} ({lr.leaveType || 'paid'}): <strong style={{ textTransform: 'capitalize' }}>{lr.status || 'pending'}</strong>
                  </p>
                  <span className="activity-item__time">{lr.createdAt ? new Date(lr.createdAt).toLocaleDateString() : 'Recent'}</span>
                </div>
              </div>
            ))}
            {recentActivities.slice(0, 3).map(activity => (
              <div key={activity.id} className="activity-item">
                <span className="activity-item__icon">{activity.icon}</span>
                <div className="activity-item__content">
                  <p className="activity-item__text">{activity.text}</p>
                  <span className="activity-item__time">{activity.time}</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Attendance Overview</h3>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--emerald">✓</div>
              <div>
                <div className="stat-card__value">{presentCount}</div>
                <div className="stat-card__label">Days Present</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--red">✗</div>
              <div>
                <div className="stat-card__value">{absentCount}</div>
                <div className="stat-card__label">Days Absent</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--amber">½</div>
              <div>
                <div className="stat-card__value">{halfDayCount}</div>
                <div className="stat-card__label">Half Days</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--indigo">📅</div>
              <div>
                <div className="stat-card__value">{leaveCount}</div>
                <div className="stat-card__label">Leaves Taken</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
