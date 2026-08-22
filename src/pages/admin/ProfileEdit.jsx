import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { employees, getSalaryBreakdown } from '../../data/mockData';

export default function AdminProfileEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [selectedId, setSelectedId] = useState(id || employees[0].id);
  const employee = employees.find(e => e.id === selectedId) || employees[0];
  const salary = getSalaryBreakdown(selectedId);

  const [form, setForm] = useState({
    name: employee.name,
    email: employee.email,
    phone: employee.phone,
    dob: employee.dob,
    gender: employee.gender,
    street: employee.address.split(',')[0]?.trim() || '',
    city: employee.address.split(',')[1]?.trim() || '',
    state: employee.address.split(',')[2]?.trim() || '',
    zip: '94105',
    department: employee.department,
    designation: employee.designation,
    joiningDate: employee.joiningDate,
    employmentType: employee.employmentType,
    reportingManager: employee.reportingManager,
    workLocation: employee.workLocation,
    basic: salary.basic,
    hra: salary.hra,
    specialAllowance: salary.specialAllowance,
    pfDeduction: salary.pfDeduction,
    incomeTax: salary.incomeTax,
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEmployeeChange = (e) => {
    const newId = e.target.value;
    setSelectedId(newId);
    const emp = employees.find(e => e.id === newId) || employees[0];
    const sal = getSalaryBreakdown(newId);
    setForm({
      name: emp.name, email: emp.email, phone: emp.phone, dob: emp.dob, gender: emp.gender,
      street: emp.address.split(',')[0]?.trim() || '', city: emp.address.split(',')[1]?.trim() || '',
      state: emp.address.split(',')[2]?.trim() || '', zip: '94105',
      department: emp.department, designation: emp.designation, joiningDate: emp.joiningDate,
      employmentType: emp.employmentType, reportingManager: emp.reportingManager, workLocation: emp.workLocation,
      basic: sal.basic, hra: sal.hra, specialAllowance: sal.specialAllowance,
      pfDeduction: sal.pfDeduction, incomeTax: sal.incomeTax,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/admin/dashboard');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Employee Profile</h1>
          <p className="page-subtitle">All fields are editable by HR Admin</p>
        </div>
      </div>

      {/* Employee Selector */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card__header">
          <h3 className="card__title">Select Employee</h3>
        </div>
        <select className="form-select" value={selectedId} onChange={handleEmployeeChange}>
          {employees.map(emp => (
            <option key={emp.id} value={emp.id}>{emp.name} — {emp.id}</option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Profile Picture */}
        <div className="card" style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          <div className="profile-avatar-wrapper">
            <img src={employee.avatar} alt={employee.name} className="profile-avatar" style={{ width: '80px', height: '80px' }} />
            <div className="profile-avatar-edit">📷</div>
          </div>
          <div>
            <h3 style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-headline)', fontWeight: 600 }}>{employee.name}</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>{employee.id} · {employee.department}</p>
            <button type="button" className="btn btn--ghost btn--sm" style={{ marginTop: 'var(--space-2)' }}>Change Photo</button>
          </div>
        </div>

        <div className="grid-2">
          {/* Personal Information */}
          <div className="card">
            <div className="card__header">
              <h3 className="card__title">Personal Information</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input type="text" name="name" className="form-input" value={form.name} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-input" value={form.email} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Phone</label>
                <input type="tel" name="phone" className="form-input" value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth</label>
                <input type="date" name="dob" className="form-input" value={form.dob} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Gender</label>
                <select name="gender" className="form-select" value={form.gender} onChange={handleChange}>
                  <option>Male</option>
                  <option>Female</option>
                  <option>Non-binary</option>
                  <option>Prefer not to say</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="card">
            <div className="card__header">
              <h3 className="card__title">Address</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Street Address</label>
                <input type="text" name="street" className="form-input" value={form.street} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">City</label>
                <input type="text" name="city" className="form-input" value={form.city} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">State</label>
                <input type="text" name="state" className="form-input" value={form.state} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Zip Code</label>
                <input type="text" name="zip" className="form-input" value={form.zip} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Job Details */}
          <div className="card">
            <div className="card__header">
              <h3 className="card__title">Job Details</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Department</label>
                <select name="department" className="form-select" value={form.department} onChange={handleChange}>
                  <option>Engineering</option>
                  <option>Design</option>
                  <option>Marketing</option>
                  <option>HR</option>
                  <option>Sales</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Designation</label>
                <input type="text" name="designation" className="form-input" value={form.designation} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Joining</label>
                <input type="date" name="joiningDate" className="form-input" value={form.joiningDate} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Employment Type</label>
                <select name="employmentType" className="form-select" value={form.employmentType} onChange={handleChange}>
                  <option>Full-time</option>
                  <option>Part-time</option>
                  <option>Contract</option>
                  <option>Intern</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Reporting Manager</label>
                <input type="text" name="reportingManager" className="form-input" value={form.reportingManager} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Work Location</label>
                <input type="text" name="workLocation" className="form-input" value={form.workLocation} onChange={handleChange} />
              </div>
            </div>
          </div>

          {/* Salary Details */}
          <div className="card">
            <div className="card__header">
              <h3 className="card__title">Salary Details</h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 'var(--space-4)' }}>
              <div className="form-group">
                <label className="form-label">Basic Salary (₹)</label>
                <input type="number" name="basic" className="form-input" value={form.basic} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">HRA (₹)</label>
                <input type="number" name="hra" className="form-input" value={form.hra} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Special Allowance (₹)</label>
                <input type="number" name="specialAllowance" className="form-input" value={form.specialAllowance} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">PF Deduction (₹)</label>
                <input type="number" name="pfDeduction" className="form-input" value={form.pfDeduction} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Income Tax (₹)</label>
                <input type="number" name="incomeTax" className="form-input" value={form.incomeTax} onChange={handleChange} />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end', marginTop: 'var(--space-8)' }}>
          <button type="button" className="btn btn--secondary" onClick={() => navigate('/admin/dashboard')}>Cancel</button>
          <button type="submit" className="btn btn--primary">Save Changes</button>
        </div>
      </form>
    </div>
  );
}
