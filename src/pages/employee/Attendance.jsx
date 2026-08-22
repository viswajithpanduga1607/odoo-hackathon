import { useState } from 'react';
import { attendanceRecords, attendanceSummary } from '../../data/mockData';

export default function Attendance() {
  const [view, setView] = useState('daily');
  const [checkedIn, setCheckedIn] = useState(true);
  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

  const badgeClass = (status) => {
    const map = {
      'Present': 'badge--present',
      'Absent': 'badge--absent',
      'Half-Day': 'badge--half-day',
      'On Leave': 'badge--on-leave',
      'Weekend': 'badge--weekend',
    };
    return map[status] || 'badge--neutral';
  };

  const dailyRecords = attendanceRecords.slice(0, 7);
  const weeklyRecords = attendanceRecords;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Attendance</h1>
          <p className="page-subtitle">Track your daily attendance and work hours</p>
        </div>
      </div>

      {/* Check In/Out Section */}
      <div className="checkin-section">
        <div className="checkin-status">
          <span className="checkin-status__label">{checkedIn ? 'Checked in at' : 'Not checked in'}</span>
          {checkedIn && <span className="checkin-status__time">09:15 AM</span>}
          <span className="checkin-status__date">{today}</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          {/* Summary Stats */}
          <div style={{ display: 'flex', gap: 'var(--space-6)', marginRight: 'var(--space-6)' }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-success)', fontFamily: 'var(--font-headline)' }}>{attendanceSummary.present}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Present</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-error)', fontFamily: 'var(--font-headline)' }}>{attendanceSummary.absent}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Absent</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-warning)', fontFamily: 'var(--font-headline)' }}>{attendanceSummary.halfDays}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Half Days</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-info)', fontFamily: 'var(--font-headline)' }}>{attendanceSummary.leaves}</div>
              <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Leaves</div>
            </div>
          </div>
          <button
            className={`btn ${checkedIn ? 'btn--danger' : 'btn--success'} btn--lg`}
            onClick={() => setCheckedIn(!checkedIn)}
          >
            {checkedIn ? '🔴 Check Out' : '🟢 Check In'}
          </button>
        </div>
      </div>

      {/* View Toggle */}
      <div className="tabs" style={{ marginBottom: 'var(--space-6)', width: 'fit-content' }}>
        <button className={`tab ${view === 'daily' ? 'tab--active' : ''}`} onClick={() => setView('daily')}>
          Daily View
        </button>
        <button className={`tab ${view === 'weekly' ? 'tab--active' : ''}`} onClick={() => setView('weekly')}>
          Weekly View
        </button>
      </div>

      {/* Attendance Table */}
      <div className="card">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Day</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {(view === 'daily' ? dailyRecords : weeklyRecords).map((record, i) => (
                <tr key={i}>
                  <td>{record.date}</td>
                  <td>{record.day}</td>
                  <td>{record.checkIn}</td>
                  <td>{record.checkOut}</td>
                  <td>{record.hours}</td>
                  <td><span className={`badge ${badgeClass(record.status)}`}>{record.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
