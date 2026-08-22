import { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { fetchAllEmployees } from '../../firebase/userService';
import { fetchAllAttendance, fetchEmployeeAttendance } from '../../firebase/attendanceService';
import { fetchAllPayrolls, fetchEmployeePayroll } from '../../firebase/payrollService';

export default function Reports() {
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState('attendance');
  const [department, setDepartment] = useState('All');
  const [fromDate, setFromDate] = useState('2026-08-01');
  const [toDate, setToDate] = useState('2026-08-31');

  const [employees, setEmployees] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [payrolls, setPayrolls] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadReportData() {
      try {
        if (isAdmin) {
          const [empList, attList, payList] = await Promise.all([
            fetchAllEmployees(),
            fetchAllAttendance(),
            fetchAllPayrolls(),
          ]);
          setEmployees(empList);
          setAttendanceRecords(attList);
          setPayrolls(payList);
        } else if (user?.uid) {
          const [attList, payDoc] = await Promise.all([
            fetchEmployeeAttendance(user.uid),
            fetchEmployeePayroll(user.uid),
          ]);
          setAttendanceRecords(attList);
          setPayrolls(payDoc ? [payDoc] : []);
        }
      } catch (err) {
        console.error('Error loading reports data from Firestore:', err);
      } finally {
        setLoading(false);
      }
    }
    loadReportData();
  }, [user, isAdmin]);

  const departments = ['All', ...new Set(employees.map(e => e.department).filter(Boolean))];

  // Process real attendance per employee
  const attendanceSummaries = (isAdmin ? employees : [{ uid: user?.uid, fullName: user?.displayName || 'My Attendance', department: 'General' }]).map(emp => {
    const targetUid = emp.uid || emp.id;
    const empAtt = attendanceRecords.filter(r => r.employeeId === targetUid);

    const totalLogged = empAtt.length;
    const present = empAtt.filter(r => (r.status || '').toLowerCase().includes('present')).length;
    const absent = empAtt.filter(r => (r.status || '').toLowerCase().includes('absent')).length;
    const halfDays = empAtt.filter(r => (r.status || '').toLowerCase().includes('half')).length;
    const leaves = empAtt.filter(r => (r.status || '').toLowerCase().includes('leave')).length;

    // Working days baseline (standard 22 monthly work days or logged count)
    const workingDays = Math.max(22, totalLogged);
    const percentage = workingDays > 0 ? Math.min(100, Math.round(((present + halfDays * 0.5) / workingDays) * 100)) : 0;

    return {
      uid: targetUid,
      name: emp.fullName || emp.name || 'Employee',
      department: emp.department || 'General',
      workingDays,
      present,
      absent,
      halfDays,
      leaves,
      percentage,
    };
  });

  const filteredAttendance = department === 'All'
    ? attendanceSummaries
    : attendanceSummaries.filter(r => r.department === department);

  const filteredSalary = department === 'All'
    ? payrolls
    : payrolls.filter(s => s.department === department);

  // Calculate organization average attendance percentage
  const avgPercentage = filteredAttendance.length > 0
    ? Math.round(filteredAttendance.reduce((sum, r) => sum + r.percentage, 0) / filteredAttendance.length)
    : 0;
  const avgPresent = filteredAttendance.length > 0
    ? (filteredAttendance.reduce((sum, r) => sum + r.present, 0) / filteredAttendance.length).toFixed(1)
    : 0;
  const avgAbsent = filteredAttendance.length > 0
    ? (filteredAttendance.reduce((sum, r) => sum + r.absent, 0) / filteredAttendance.length).toFixed(1)
    : 0;

  const handleExportCSV = () => {
    let csvContent = 'data:text/csv;charset=utf-8,';
    if (activeTab === 'attendance') {
      csvContent += 'Employee Name,Department,Working Days,Present,Absent,Half Days,Leaves,Attendance %\n';
      filteredAttendance.forEach(r => {
        csvContent += `"${r.name}","${r.department}",${r.workingDays},${r.present},${r.absent},${r.halfDays},${r.leaves},${r.percentage}%\n`;
      });
    } else {
      csvContent += 'Employee Name,Department,Basic Salary,Gross Salary,Total Deductions,Net Pay,Status\n';
      filteredSalary.forEach(s => {
        csvContent += `"${s.employeeName || 'Employee'}","${s.department || ''}",${s.basic},${s.gross},${s.totalDeductions},${s.net},"${s.status || 'Paid'}"\n`;
      });
    }
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `dayflow_${activeTab}_report.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Real-time attendance summaries and salary slip records from Firestore</p>
        </div>
        <button className="btn btn--secondary" onClick={handleExportCSV}>
          📥 Export CSV
        </button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="form-group">
          <label className="form-label">From</label>
          <input
            type="date"
            className="form-input"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
          />
        </div>
        <div className="form-group">
          <label className="form-label">To</label>
          <input
            type="date"
            className="form-input"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
          />
        </div>
        {isAdmin && (
          <div className="form-group">
            <label className="form-label">Department</label>
            <select
              className="form-select"
              value={department}
              onChange={(e) => setDepartment(e.target.value)}
            >
              {departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>
          </div>
        )}
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 'var(--space-6)', width: 'fit-content' }}>
        <button
          className={`tab ${activeTab === 'attendance' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('attendance')}
        >
          Attendance Summary ({filteredAttendance.length})
        </button>
        <button
          className={`tab ${activeTab === 'salary' ? 'tab--active' : ''}`}
          onClick={() => setActiveTab('salary')}
        >
          Salary Slips ({filteredSalary.length})
        </button>
      </div>

      {/* Attendance Summary Table */}
      {activeTab === 'attendance' && (
        <div className="card">
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th>Working Days</th>
                  <th>Present</th>
                  <th>Absent</th>
                  <th>Half Days</th>
                  <th>Leaves</th>
                  <th>Attendance %</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                      Loading live attendance summary...
                    </td>
                  </tr>
                ) : filteredAttendance.length === 0 ? (
                  <tr>
                    <td colSpan="8" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                      No attendance data found for this period.
                    </td>
                  </tr>
                ) : (
                  filteredAttendance.map((r, i) => (
                    <tr key={r.uid || i}>
                      <td style={{ fontWeight: 600 }}>{r.name}</td>
                      <td>{r.department}</td>
                      <td>{r.workingDays}</td>
                      <td style={{ color: 'var(--color-success)', fontWeight: 500 }}>{r.present}</td>
                      <td style={{ color: r.absent > 0 ? 'var(--color-error)' : 'inherit' }}>{r.absent}</td>
                      <td>{r.halfDays}</td>
                      <td>{r.leaves}</td>
                      <td>
                        <span className={`badge ${r.percentage >= 85 ? 'badge--success' : r.percentage >= 60 ? 'badge--warning' : 'badge--error'}`}>
                          {r.percentage}%
                        </span>
                      </td>
                    </tr>
                  ))
                )}
                {!loading && filteredAttendance.length > 1 && (
                  <tr className="summary-row" style={{ fontWeight: 700, background: 'var(--color-bg-primary)' }}>
                    <td>Organization Average</td>
                    <td>—</td>
                    <td>22</td>
                    <td>{avgPresent}</td>
                    <td>{avgAbsent}</td>
                    <td>—</td>
                    <td>—</td>
                    <td>
                      <span className="badge badge--info">{avgPercentage}%</span>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Salary Slips Table */}
      {activeTab === 'salary' && (
        <div className="card">
          <div className="data-table-container">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Employee Name</th>
                  <th>Department</th>
                  <th>Basic Salary</th>
                  <th>Gross Salary</th>
                  <th>Deductions</th>
                  <th>Net Pay</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {loading ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                      Loading salary slips from Firestore...
                    </td>
                  </tr>
                ) : filteredSalary.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ textAlign: 'center', padding: 'var(--space-8)', color: 'var(--color-text-muted)' }}>
                      No salary slip records found.
                    </td>
                  </tr>
                ) : (
                  filteredSalary.map((s, i) => (
                    <tr key={s.id || i}>
                      <td style={{ fontWeight: 600 }}>{s.employeeName || 'Employee'}</td>
                      <td>{s.department || 'General'}</td>
                      <td>₹{Number(s.basic || 0).toLocaleString()}</td>
                      <td>₹{Number(s.gross || 0).toLocaleString()}</td>
                      <td>₹{Number(s.totalDeductions || 0).toLocaleString()}</td>
                      <td style={{ fontWeight: 700, color: 'var(--color-primary)' }}>
                        ₹{Number(s.net || 0).toLocaleString()}
                      </td>
                      <td>
                        <span className={`badge ${(s.status || 'Paid') === 'Paid' ? 'badge--paid' : 'badge--pending'}`}>
                          {s.status || 'Paid'}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
