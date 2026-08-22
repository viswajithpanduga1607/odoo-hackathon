import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import {
  getTodayAttendanceRecord,
  checkInUser,
  checkOutUser,
  fetchEmployeeAttendance,
  fetchAllAttendance,
} from '../../firebase/attendanceService';
import { fetchAllEmployees } from '../../firebase/userService';

export default function Attendance() {
  const { user, profile, isAdmin } = useAuth();
  const [view, setView] = useState('daily');
  const [records, setRecords] = useState([]);
  const [todayRecord, setTodayRecord] = useState(null);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Admin filter
  const [employeesList, setEmployeesList] = useState([]);
  const [filterEmployeeUid, setFilterEmployeeUid] = useState('All');

  const todayFormatted = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const loadData = async () => {
    if (!user?.uid) return;
    try {
      if (isAdmin) {
        const [attList, empList] = await Promise.all([
          fetchAllAttendance(filterEmployeeUid),
          fetchAllEmployees(),
        ]);
        setRecords(attList);
        setEmployeesList(empList);
      } else {
        const [attList, todayDoc] = await Promise.all([
          fetchEmployeeAttendance(user.uid),
          getTodayAttendanceRecord(user.uid),
        ]);
        setRecords(attList);
        setTodayRecord(todayDoc);
      }
    } catch (err) {
      console.error('Error fetching attendance data:', err);
      setError('Failed to load attendance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [user, isAdmin, filterEmployeeUid]);

  const isCheckedIn = !!todayRecord && todayRecord.checkOut === '-';

  const handleCheckInOut = async () => {
    if (!user?.uid) return;
    setActionLoading(true);
    setError('');
    setSuccess('');

    try {
      if (!todayRecord) {
        // Check in
        const newRecord = await checkInUser(user.uid, profile || {});
        setTodayRecord(newRecord);
        setSuccess('Successfully checked in!');
      } else if (todayRecord && todayRecord.checkOut === '-') {
        // Check out
        await checkOutUser(todayRecord.id, todayRecord.checkIn);
        setSuccess('Successfully checked out!');
      }
      await loadData();
    } catch (err) {
      console.error('Check-in/out error:', err);
      setError(err.message || 'Operation failed.');
    } finally {
      setActionLoading(false);
    }
  };

  const badgeClass = (status) => {
    const s = (status || '').toLowerCase();
    if (s.includes('present')) return 'badge--present';
    if (s.includes('absent')) return 'badge--absent';
    if (s.includes('half')) return 'badge--half-day';
    if (s.includes('leave')) return 'badge--on-leave';
    return 'badge--neutral';
  };

  // Calculate live summary stats
  const totalRecords = records.length;
  const presentCount = records.filter(r => (r.status || '').toLowerCase().includes('present')).length;
  const absentCount = records.filter(r => (r.status || '').toLowerCase().includes('absent')).length;
  const halfDayCount = records.filter(r => (r.status || '').toLowerCase().includes('half')).length;
  const leaveCount = records.filter(r => (r.status || '').toLowerCase().includes('leave')).length;

  const displayRecords = view === 'daily' ? records.slice(0, 7) : records;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">{isAdmin ? 'Organization Attendance' : 'My Attendance'}</h1>
          <p className="page-subtitle">
            {isAdmin ? 'View and monitor employee attendance records across the organization' : 'Track your daily attendance and work hours'}
          </p>
        </div>
      </div>

      {error && (
        <div className="alert alert--error" style={{ marginBottom: 'var(--space-6)' }}>
          <span>⚠️</span>
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert--success" style={{ marginBottom: 'var(--space-6)' }}>
          <span>✅</span>
          <span>{success}</span>
        </div>
      )}

      {/* Check In / Check Out Card (For Employee or Admin personal check-in) */}
      {!isAdmin && (
        <div className="checkin-section">
          <div className="checkin-status">
            <span className="checkin-status__label">
              {todayRecord ? (todayRecord.checkOut !== '-' ? `Checked out (${todayRecord.hours})` : `Checked in at`) : 'Not checked in today'}
            </span>
            {todayRecord && todayRecord.checkOut === '-' && (
              <span className="checkin-status__time">{todayRecord.checkIn}</span>
            )}
            <span className="checkin-status__date">{todayFormatted}</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
            {/* Live Summary Stats */}
            <div style={{ display: 'flex', gap: 'var(--space-6)', marginRight: 'var(--space-6)' }}>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-success)', fontFamily: 'var(--font-headline)' }}>
                  {presentCount}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Present</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-error)', fontFamily: 'var(--font-headline)' }}>
                  {absentCount}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Absent</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-warning)', fontFamily: 'var(--font-headline)' }}>
                  {halfDayCount}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Half Days</div>
              </div>
              <div style={{ textAlign: 'center' }}>
                <div style={{ fontSize: 'var(--text-2xl)', fontWeight: 700, color: 'var(--color-info)', fontFamily: 'var(--font-headline)' }}>
                  {leaveCount}
                </div>
                <div style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>Leaves</div>
              </div>
            </div>

            {todayRecord && todayRecord.checkOut !== '-' ? (
              <span className="badge badge--success" style={{ padding: '0.75rem 1.25rem', fontSize: 'var(--text-sm)' }}>
                ✓ Completed Today
              </span>
            ) : (
              <button
                className={`btn ${isCheckedIn ? 'btn--danger' : 'btn--success'} btn--lg`}
                onClick={handleCheckInOut}
                disabled={actionLoading}
              >
                {actionLoading ? 'Processing...' : isCheckedIn ? '🔴 Check Out' : '🟢 Check In'}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Admin Filters */}
      {isAdmin && (
        <div className="filter-bar" style={{ marginBottom: 'var(--space-6)' }}>
          <div className="form-group" style={{ minWidth: '240px' }}>
            <label className="form-label">Filter by Employee</label>
            <select
              className="form-select"
              value={filterEmployeeUid}
              onChange={(e) => setFilterEmployeeUid(e.target.value)}
            >
              <option value="All">All Employees</option>
              {employeesList.map(emp => (
                <option key={emp.uid || emp.id} value={emp.uid || emp.id}>
                  {emp.fullName || emp.name} ({emp.employeeId || emp.id})
                </option>
              ))}
            </select>
          </div>
        </div>
      )}

      {/* View Toggle */}
      <div className="tabs" style={{ marginBottom: 'var(--space-6)', width: 'fit-content' }}>
        <button className={`tab ${view === 'daily' ? 'tab--active' : ''}`} onClick={() => setView('daily')}>
          Recent (7 Days)
        </button>
        <button className={`tab ${view === 'weekly' ? 'tab--active' : ''}`} onClick={() => setView('weekly')}>
          All Records ({totalRecords})
        </button>
      </div>

      {/* Attendance Records Table */}
      <div className="card">
        <div className="data-table-container">
          <table className="data-table">
            <thead>
              <tr>
                {isAdmin && <th>Employee</th>}
                <th>Date</th>
                <th>Day</th>
                <th>Check In</th>
                <th>Check Out</th>
                <th>Total Hours</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                    Loading attendance records from Firestore...
                  </td>
                </tr>
              ) : displayRecords.length === 0 ? (
                <tr>
                  <td colSpan={isAdmin ? 7 : 6} style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                    No attendance records found. Check in above to create today's record!
                  </td>
                </tr>
              ) : (
                displayRecords.map((record) => (
                  <tr key={record.id}>
                    {isAdmin && (
                      <td style={{ fontWeight: 500 }}>
                        {record.employeeName || 'Employee'}
                        {record.employeeDisplayId && <span style={{ fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)', display: 'block' }}>{record.employeeDisplayId}</span>}
                      </td>
                    )}
                    <td>{record.date}</td>
                    <td>{record.day || '-'}</td>
                    <td>{record.checkIn || '-'}</td>
                    <td>{record.checkOut || '-'}</td>
                    <td>{record.hours || '-'}</td>
                    <td>
                      <span className={`badge ${badgeClass(record.status)}`}>
                        {record.status || 'Present'}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
