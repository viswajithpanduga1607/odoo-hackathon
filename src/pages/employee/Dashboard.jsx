import { Link } from 'react-router-dom';
import { currentUser, attendanceSummary, leaveBalances, recentActivities } from '../../data/mockData';

export default function Dashboard() {
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const quickCards = [
    { icon: '👤', title: 'My Profile', stat: 'View & edit details', color: 'indigo', path: '/profile' },
    { icon: '🕐', title: 'Attendance', stat: `${attendanceSummary.present} days present`, color: 'emerald', path: '/attendance' },
    { icon: '📅', title: 'Leave Requests', stat: `${leaveBalances.paid.total - leaveBalances.paid.used} leaves remaining`, color: 'amber', path: '/leave/apply' },
    { icon: '💰', title: 'Payroll', stat: 'View salary details', color: 'purple', path: '/payroll' },
  ];

  return (
    <div>
      <div className="dashboard-greeting">
        <h1 className="dashboard-greeting__hello">
          Good Morning, <span>{currentUser.name.split(' ')[0]}!</span>
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
            {recentActivities.map(activity => (
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
                <div className="stat-card__value">{attendanceSummary.present}</div>
                <div className="stat-card__label">Days Present</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--red">✗</div>
              <div>
                <div className="stat-card__value">{attendanceSummary.absent}</div>
                <div className="stat-card__label">Days Absent</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--amber">½</div>
              <div>
                <div className="stat-card__value">{attendanceSummary.halfDays}</div>
                <div className="stat-card__label">Half Days</div>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-card__icon stat-card__icon--indigo">📅</div>
              <div>
                <div className="stat-card__value">{attendanceSummary.leaves}</div>
                <div className="stat-card__label">Leaves Taken</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
