import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchAllEmployees, updateAdminUserProfile } from '../../firebase/userService';
import { employees as mockEmployees, getSalaryBreakdown } from '../../data/mockData';

export default function AdminProfileEdit() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [employeesList, setEmployeesList] = useState([]);
  const [selectedUid, setSelectedUid] = useState(id || '');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    fullName: '',
    email: '',
    phone: '',
    dob: '',
    gender: 'Prefer not to say',
    address: '',
    department: 'Engineering',
    jobTitle: 'Senior Software Engineer',
    dateJoined: '',
    employmentType: 'Full-time',
    reportingManager: '',
    workLocation: 'Main Office',
    role: 'employee',
    profilePictureUrl: '',
    basic: 50000,
    hra: 20000,
    specialAllowance: 10000,
    pfDeduction: 6000,
    incomeTax: 8500,
  });

  useEffect(() => {
    async function loadEmployees() {
      try {
        const liveList = await fetchAllEmployees();
        const list = liveList.length > 0 ? liveList : mockEmployees.map(e => ({ ...e, uid: e.id, fullName: e.name }));
        setEmployeesList(list);

        const initialTarget = list.find(e => e.uid === id || e.id === id) || list[0];
        if (initialTarget) {
          const targetUid = initialTarget.uid || initialTarget.id;
          setSelectedUid(targetUid);
          populateForm(initialTarget);
        }
      } catch (err) {
        console.error('Error fetching employees list:', err);
        setError('Failed to load employee list.');
      } finally {
        setLoading(false);
      }
    }
    loadEmployees();
  }, [id]);

  const populateForm = (emp) => {
    const sal = getSalaryBreakdown(emp.employeeId || emp.id || 'EMP-2024-001');
    setForm({
      fullName: emp.fullName || emp.name || '',
      email: emp.email || '',
      phone: emp.phone || '',
      dob: emp.dob || '1992-05-15',
      gender: emp.gender || 'Prefer not to say',
      address: emp.address || '',
      department: emp.department || 'Engineering',
      jobTitle: emp.jobTitle || emp.designation || 'Software Engineer',
      dateJoined: emp.dateJoined || emp.joiningDate || '2023-01-15',
      employmentType: emp.employmentType || 'Full-time',
      reportingManager: emp.reportingManager || 'Jane Smith',
      workLocation: emp.workLocation || 'Main Office',
      role: emp.role || 'employee',
      profilePictureUrl: emp.profilePictureUrl || emp.avatar || '',
      basic: emp.basic || sal.basic,
      hra: emp.hra || sal.hra,
      specialAllowance: emp.specialAllowance || sal.specialAllowance,
      pfDeduction: emp.pfDeduction || sal.pfDeduction,
      incomeTax: emp.incomeTax || sal.incomeTax,
    });
  };

  const handleEmployeeChange = (e) => {
    const targetUid = e.target.value;
    setSelectedUid(targetUid);
    const target = employeesList.find(emp => (emp.uid || emp.id) === targetUid);
    if (target) {
      populateForm(target);
    }
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedUid) return;

    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateAdminUserProfile(selectedUid, form);
      setSuccess('Employee profile updated successfully!');
      setTimeout(() => {
        navigate('/admin/employees');
      }, 1200);
    } catch (err) {
      console.error('Admin profile update error:', err);
      setError(err.message || 'Failed to save changes. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Loading employee data...
      </div>
    );
  }

  const currentEmp = employeesList.find(emp => (emp.uid || emp.id) === selectedUid) || employeesList[0];
  const avatarUrl = form.profilePictureUrl || currentEmp?.profilePictureUrl || currentEmp?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(form.fullName || 'Employee')}`;

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Employee Profile</h1>
          <p className="page-subtitle">All fields are editable by HR Admin</p>
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

      {/* Employee Selector */}
      <div className="card" style={{ marginBottom: 'var(--space-6)' }}>
        <div className="card__header">
          <h3 className="card__title">Select Employee</h3>
        </div>
        <select className="form-select" value={selectedUid} onChange={handleEmployeeChange}>
          {employeesList.map(emp => (
            <option key={emp.uid || emp.id} value={emp.uid || emp.id}>
              {emp.fullName || emp.name} — {emp.employeeId || emp.id} ({emp.department})
            </option>
          ))}
        </select>
      </div>

      <form onSubmit={handleSubmit}>
        {/* Profile Picture */}
        <div className="card" style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          <div className="profile-avatar-wrapper">
            <img src={avatarUrl} alt={form.fullName} className="profile-avatar" style={{ width: '80px', height: '80px' }} />
            <div className="profile-avatar-edit">📷</div>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-headline)', fontWeight: 600 }}>{form.fullName}</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)' }}>
              {currentEmp?.employeeId || currentEmp?.id} · {form.department}
            </p>
            <div style={{ marginTop: 'var(--space-3)', maxWidth: '400px' }}>
              <input
                type="text"
                name="profilePictureUrl"
                className="form-input"
                placeholder="Avatar / Photo URL"
                value={form.profilePictureUrl}
                onChange={handleChange}
              />
            </div>
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
                <input type="text" name="fullName" className="form-input" value={form.fullName} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input type="email" name="email" className="form-input" value={form.email} onChange={handleChange} required />
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
                <label className="form-label">Full Address</label>
                <textarea
                  name="address"
                  className="form-textarea"
                  placeholder="Street, City, State, ZIP"
                  value={form.address}
                  onChange={handleChange}
                  style={{ minHeight: '180px' }}
                />
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
                  <option>Human Resources</option>
                  <option>Sales</option>
                </select>
              </div>
              <div className="form-group">
                <label className="form-label">Designation / Job Title</label>
                <input type="text" name="jobTitle" className="form-input" value={form.jobTitle} onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Joining</label>
                <input type="date" name="dateJoined" className="form-input" value={form.dateJoined} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Role</label>
                <select name="role" className="form-select" value={form.role} onChange={handleChange}>
                  <option value="employee">Employee</option>
                  <option value="admin">HR Admin</option>
                </select>
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
          <button type="button" className="btn btn--secondary" onClick={() => navigate('/admin/employees')} disabled={saving}>
            Cancel
          </button>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
