import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { currentUser, employees } from '../../data/mockData';

export default function ProfileEdit() {
  const navigate = useNavigate();
  const employee = employees.find(e => e.id === currentUser.id) || employees[0];

  const [form, setForm] = useState({
    phone: employee.phone,
    street: '123 Tech Lane',
    city: 'San Francisco',
    state: 'CA',
    zip: '94105',
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Mock save
    navigate('/profile');
  };

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Profile</h1>
          <p className="page-subtitle">Update your personal information</p>
        </div>
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
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>{employee.id}</p>
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
                <label className="form-label">Full Name 🔒</label>
                <input type="text" className="form-input" value={employee.name} disabled />
              </div>
              <div className="form-group">
                <label className="form-label">Email 🔒</label>
                <input type="email" className="form-input" value={employee.email} disabled />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number</label>
                <input type="tel" name="phone" className="form-input" value={form.phone} onChange={handleChange} />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Birth 🔒</label>
                <input type="text" className="form-input" value={new Date(employee.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })} disabled />
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

          {/* Job Details (Read-Only) */}
          <div className="card" style={{ gridColumn: '1 / -1' }}>
            <div className="card__header">
              <h3 className="card__title">Job Details</h3>
              <span className="badge badge--info">Read Only</span>
            </div>
            <div className="grid-3">
              <div className="form-group">
                <label className="form-label">Department 🔒</label>
                <input type="text" className="form-input" value={employee.department} disabled />
              </div>
              <div className="form-group">
                <label className="form-label">Designation 🔒</label>
                <input type="text" className="form-input" value={employee.designation} disabled />
              </div>
              <div className="form-group">
                <label className="form-label">Date of Joining 🔒</label>
                <input type="text" className="form-input" value={employee.joiningDate} disabled />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end', marginTop: 'var(--space-8)' }}>
          <Link to="/profile" className="btn btn--secondary">Cancel</Link>
          <button type="submit" className="btn btn--primary">Save Changes</button>
        </div>
      </form>
    </div>
  );
}
