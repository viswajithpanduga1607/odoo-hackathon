import { useState } from 'react';
import { attendanceReport, salarySlips } from '../../data/mockData';

export default function Reports() {
  const [activeTab, setActiveTab] = useState('attendance');
  const [department, setDepartment] = useState('All');

  const departments = ['All', ...new Set(attendanceReport.map(r => r.department))];

  const filteredAttendance = department === 'All'
    ? attendanceReport
    : attendanceReport.filter(r => r.department === department);

  const filteredSalary = department === 'All'
    ? salarySlips
    : salarySlips.filter(s => {
        const emp = attendanceReport.find(a => a.name === s.name);
        return emp && emp.department === department;
      });

  // Calculate averages for attendance
  const avgAttendance = filteredAttendance.length > 0 ? {
    present: (filteredAttendance.reduce((a, r) => a + r.present, 0) / filteredAttendance.length).toFixed(1),
    absent: (filteredAttendance.reduce((a, r) => a + r.absent, 0) / filteredAttendance.length).toFixed(1),
    percentage: (filteredAttendance.reduce((a, r) => a + r.percentage, 0) / filteredAttendance.length).toFixed(1),
  } : null;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Reports</h1>
          <p className="page-subtitle">Attendance summaries and salary slip records</p>
        </div>
        <button className="btn btn--secondary">📥 Export CSV</button>
      </div>

      {/* Filters */}
      <div className="filter-bar">
        <div className="form-group">
          <label className="form-label">From</label>
          <input type="date" className="form-input" defaultValue="2024-07-01" />
        </div>
        <div className="form-group">
          <label className="form-label">To</label>
          <input type="date" className="form-input" defaultValue="2024-07-31" />
        </div>
        <div className="form-group">
          <label className="form-label">Department</label>
          <select className="form-select" value={department} onChange={(e) => setDepartment(e.target.value)}>
            {departments.map(d => <option key={d}>{d}</option>)}
          </select>
        </div>
        <div className="form-group" style={{ alignSelf: 'flex-end' }}>
          <button className="btn btn--primary">Generate Report</button>
        </div>
      </div>

      {/* Tabs */}
      <div className="tabs" style={{ marginBottom: 'var(--space-6)', width: 'fit-content' }}>
        <button className={`tab ${activeTab === 'attendance' ? 'tab--active' : ''}`} onClick={() => setActiveTab('attendance')}>
          Attendance Summary
        </button>
        <button className={`tab ${activeTab === 'salary' ? 'tab--active' : ''}`} onClick={() => setActiveTab('salary')}>
          Salary Slips
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
                {filteredAttendance.map((r, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{r.name}</td>
                    <td>{r.department}</td>
                    <td>{r.totalDays}</td>
                    <td style={{ color: 'var(--color-success)' }}>{r.present}</td>
                    <td style={{ color: r.absent > 0 ? 'var(--color-error)' : 'inherit' }}>{r.absent}</td>
                    <td>{r.halfDays}</td>
                    <td>{r.leaves}</td>
                    <td>
                      <span className={`badge ${r.percentage >= 90 ? 'badge--success' : r.percentage >= 75 ? 'badge--warning' : 'badge--error'}`}>
                        {r.percentage}%
                      </span>
                    </td>
                  </tr>
                ))}
                {avgAttendance && (
                  <tr className="summary-row">
                    <td>Average</td>
                    <td>—</td>
                    <td>22</td>
                    <td>{avgAttendance.present}</td>
                    <td>{avgAttendance.absent}</td>
                    <td>—</td>
                    <td>—</td>
                    <td>{avgAttendance.percentage}%</td>
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
                  <th>Month</th>
                  <th>Basic Salary</th>
                  <th>Gross Salary</th>
                  <th>Deductions</th>
                  <th>Net Pay</th>
                  <th>Status</th>
                  <th>Download</th>
                </tr>
              </thead>
              <tbody>
                {filteredSalary.map((s, i) => (
                  <tr key={i}>
                    <td style={{ fontWeight: 500 }}>{s.name}</td>
                    <td>{s.month}</td>
                    <td>₹{s.basic.toLocaleString()}</td>
                    <td>₹{s.gross.toLocaleString()}</td>
                    <td>₹{s.deductions.toLocaleString()}</td>
                    <td style={{ fontWeight: 600, color: 'var(--color-primary)' }}>₹{s.net.toLocaleString()}</td>
                    <td>
                      <span className={`badge ${s.status === 'Paid' ? 'badge--paid' : 'badge--pending'}`}>{s.status}</span>
                    </td>
                    <td><button className="btn btn--ghost btn--sm">⬇</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
