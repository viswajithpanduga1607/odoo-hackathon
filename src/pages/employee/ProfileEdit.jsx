import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchUserProfile, updateEmployeeSelfProfile } from '../../firebase/userService';
import { CameraIcon, LockIcon, AlertIcon, CheckCircleIcon } from '../../components/common/Icons';

export default function ProfileEdit() {
  const navigate = useNavigate();
  const { user, profile: authProfile, setUserProfile } = useAuth();
  const [profile, setProfile] = useState(authProfile);
  const [loading, setLoading] = useState(!authProfile);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [form, setForm] = useState({
    phone: '',
    address: '',
    profilePictureUrl: '',
  });

  useEffect(() => {
    async function load() {
      if (user?.uid) {
        try {
          const liveProfile = await fetchUserProfile(user.uid);
          if (liveProfile) {
            setProfile(liveProfile);
            setForm({
              phone: liveProfile.phone || '',
              address: liveProfile.address || '',
              profilePictureUrl: liveProfile.profilePictureUrl || '',
            });
          }
        } catch (err) {
          console.error('Error loading profile:', err);
        } finally {
          setLoading(false);
        }
      }
    }
    load();
  }, [user]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
    if (success) setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user?.uid) return;
    setSaving(true);
    setError('');
    setSuccess('');

    try {
      await updateEmployeeSelfProfile(user.uid, {
        phone: form.phone,
        address: form.address,
        profilePictureUrl: form.profilePictureUrl || profile?.profilePictureUrl,
      });

      const updated = { ...profile, ...form };
      setProfile(updated);
      setUserProfile(updated);
      setSuccess('Profile updated successfully!');
      setTimeout(() => {
        navigate('/profile');
      }, 1200);
    } catch (err) {
      console.error('Profile update error:', err);
      setError(err.message || 'Failed to update profile. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  const displayName = profile?.fullName || user?.displayName || 'Employee';
  const displayEmail = profile?.email || user?.email || 'employee@dayflow.io';
  const displayId = profile?.employeeId || 'EMP-2024-001';
  const displayRole = profile?.jobTitle || profile?.designation || 'Software Engineer';
  const displayDepartment = profile?.department || 'Engineering';
  const displayDateJoined = profile?.dateJoined || '2024-01-15';
  const displayAvatar = form.profilePictureUrl || profile?.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Loading profile...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">Edit Profile</h1>
          <p className="page-subtitle">Update your personal contact details</p>
        </div>
      </div>

      {error && (
        <div className="alert alert--error" style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <AlertIcon size={18} />
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert--success" style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <CheckCircleIcon size={18} />
          <span>{success}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        {/* Profile Picture */}
        <div className="card" style={{ marginBottom: 'var(--space-6)', display: 'flex', alignItems: 'center', gap: 'var(--space-6)' }}>
          <div className="profile-avatar-wrapper">
            <img src={displayAvatar} alt={displayName} className="profile-avatar" style={{ width: '80px', height: '80px' }} />
            <div className="profile-avatar-edit" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center' }}>
              <CameraIcon size={14} color="#FFFFFF" />
            </div>
          </div>
          <div style={{ flex: 1 }}>
            <h3 style={{ color: 'var(--color-text-primary)', fontFamily: 'var(--font-headline)', fontWeight: 600 }}>{displayName}</h3>
            <p style={{ color: 'var(--color-text-muted)', fontSize: 'var(--text-sm)', marginTop: 'var(--space-1)' }}>{displayId}</p>
            <div style={{ marginTop: 'var(--space-3)', maxWidth: '400px' }}>
              <input
                type="text"
                name="profilePictureUrl"
                className="form-input"
                placeholder="Custom Avatar/Image URL"
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
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Full Name</span>
                  <LockIcon size={13} color="var(--color-text-muted)" />
                </label>
                <input type="text" className="form-input" value={displayName} disabled />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Email</span>
                  <LockIcon size={13} color="var(--color-text-muted)" />
                </label>
                <input type="email" className="form-input" value={displayEmail} disabled />
              </div>
              <div className="form-group">
                <label className="form-label">Phone Number (Editable)</label>
                <input
                  type="tel"
                  name="phone"
                  className="form-input"
                  placeholder="+1 (555) 000-0000"
                  value={form.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Date of Birth</span>
                  <LockIcon size={13} color="var(--color-text-muted)" />
                </label>
                <input type="text" className="form-input" value={profile?.dob || '1992-05-15'} disabled />
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
                <label className="form-label">Full Address (Editable)</label>
                <textarea
                  name="address"
                  className="form-textarea"
                  placeholder="e.g. 123 Tech Lane, San Francisco, CA 94105"
                  value={form.address}
                  onChange={handleChange}
                  style={{ minHeight: '120px' }}
                />
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
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Department</span>
                  <LockIcon size={13} color="var(--color-text-muted)" />
                </label>
                <input type="text" className="form-input" value={displayDepartment} disabled />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Designation</span>
                  <LockIcon size={13} color="var(--color-text-muted)" />
                </label>
                <input type="text" className="form-input" value={displayRole} disabled />
              </div>
              <div className="form-group">
                <label className="form-label" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span>Date of Joining</span>
                  <LockIcon size={13} color="var(--color-text-muted)" />
                </label>
                <input type="text" className="form-input" value={displayDateJoined} disabled />
              </div>
            </div>
          </div>
        </div>

        {/* Actions */}
        <div style={{ display: 'flex', gap: 'var(--space-4)', justifyContent: 'flex-end', marginTop: 'var(--space-8)' }}>
          <Link to="/profile" className="btn btn--secondary" disabled={saving}>Cancel</Link>
          <button type="submit" className="btn btn--primary" disabled={saving}>
            {saving ? 'Saving Changes...' : 'Save Changes'}
          </button>
        </div>
      </form>
    </div>
  );
}
