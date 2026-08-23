import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { fetchUserProfile } from '../../firebase/userService';
import { getSalaryBreakdown, documents } from '../../data/mockData';
import { EditIcon, DocumentIcon, DownloadIcon } from '../../components/common/Icons';

export default function ProfileView() {
  const { user, profile: authProfile } = useAuth();
  const [profile, setProfile] = useState(authProfile);
  const [loading, setLoading] = useState(true);

  // Keep in sync when authProfile is updated by AuthContext
  useEffect(() => {
    if (authProfile) {
      setProfile(authProfile);
    }
  }, [authProfile]);

  useEffect(() => {
    async function load() {
      if (user?.uid) {
        try {
          const liveProfile = await fetchUserProfile(user.uid);
          if (liveProfile) {
            setProfile(liveProfile);
          } else if (authProfile) {
            // Fallback to authProfile if Firestore returns nothing
            setProfile(authProfile);
          }
        } catch (err) {
          console.error('Error fetching profile:', err);
          if (authProfile) setProfile(authProfile);
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  const displayName = profile?.fullName || user?.displayName || 'Employee';
  const displayEmail = profile?.email || user?.email || 'employee@dayflow.io';
  const displayId = profile?.employeeId || 'EMP-2024-001';
  const displayRole = profile?.jobTitle || profile?.designation || 'Software Engineer';
  const displayDepartment = profile?.department || 'Engineering';
  const displayPhone = profile?.phone || 'Not provided';
  const displayAddress = profile?.address || 'Not provided';
  const displayDob = profile?.dob ? new Date(profile.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : 'Not provided';
  const displayGender = profile?.gender || 'Not specified';
  const displayDateJoined = profile?.dateJoined ? new Date(profile.dateJoined).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  const displayAvatar = profile?.profilePictureUrl || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(displayName)}`;

  const salary = getSalaryBreakdown(displayId);

  if (loading) {
    return (
      <div style={{ padding: 'var(--space-8)', textAlign: 'center', color: 'var(--color-text-muted)' }}>
        Loading profile details...
      </div>
    );
  }

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">View your personal and professional details</p>
        </div>
        <Link to="/profile/edit" className="btn btn--primary" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem' }}>
          <EditIcon size={15} />
          <span>Edit Profile</span>
        </Link>
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <img src={displayAvatar} alt={displayName} className="profile-avatar" />
        </div>
        <div className="profile-info">
          <h2 className="profile-info__name">{displayName}</h2>
          <p className="profile-info__role">{displayRole}</p>
          <p className="profile-info__department">{displayDepartment}</p>
          <p className="profile-info__id">{displayId}</p>
        </div>
        <div style={{ marginLeft: 'auto' }}>
          <span className="badge badge--active">Active</span>
        </div>
      </div>

      {/* Details Grid */}
      <div className="profile-details">
        {/* Personal Details */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Personal Details</h3>
          </div>
          <div className="detail-row">
            <span className="detail-label">Full Name</span>
            <span className="detail-value">{displayName}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{displayEmail}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Phone</span>
            <span className="detail-value">{displayPhone}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date of Birth</span>
            <span className="detail-value">{displayDob}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Gender</span>
            <span className="detail-value">{displayGender}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Address</span>
            <span className="detail-value">{displayAddress}</span>
          </div>
        </div>

        {/* Job Details */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Job Details</h3>
          </div>
          <div className="detail-row">
            <span className="detail-label">Department</span>
            <span className="detail-value">{displayDepartment}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Designation</span>
            <span className="detail-value">{displayRole}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date of Joining</span>
            <span className="detail-value">{displayDateJoined}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Employment Type</span>
            <span className="detail-value">{profile?.employmentType || 'Full-time'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Reporting Manager</span>
            <span className="detail-value">{profile?.reportingManager || 'Jane Smith'}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Work Location</span>
            <span className="detail-value">{profile?.workLocation || 'Main Office'}</span>
          </div>
        </div>

        {/* Salary Structure (Read Only) */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Salary Structure</h3>
            <span className="badge badge--info">Read Only</span>
          </div>
          <div className="salary-table">
            <div className="section__title" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)' }}>Earnings</div>
            <div className="row"><span className="row__label">Basic Salary</span><span className="row__value">₹{salary.basic.toLocaleString()}</span></div>
            <div className="row"><span className="row__label">House Rent Allowance</span><span className="row__value">₹{salary.hra.toLocaleString()}</span></div>
            <div className="row"><span className="row__label">Special Allowance</span><span className="row__value">₹{salary.specialAllowance.toLocaleString()}</span></div>
            <div className="row"><span className="row__label">Medical Allowance</span><span className="row__value">₹{salary.medicalAllowance.toLocaleString()}</span></div>
            <div className="row row--subtotal"><span className="row__label">Gross Salary</span><span className="row__value">₹{salary.gross.toLocaleString()}</span></div>

            <div className="section__title" style={{ fontSize: 'var(--text-sm)', marginBottom: 'var(--space-2)', marginTop: 'var(--space-4)' }}>Deductions</div>
            <div className="row"><span className="row__label">Provident Fund</span><span className="row__value">₹{salary.pfDeduction.toLocaleString()}</span></div>
            <div className="row"><span className="row__label">Professional Tax</span><span className="row__value">₹{salary.professionalTax.toLocaleString()}</span></div>
            <div className="row"><span className="row__label">Income Tax</span><span className="row__value">₹{salary.incomeTax.toLocaleString()}</span></div>
            <div className="row row--subtotal"><span className="row__label">Total Deductions</span><span className="row__value">₹{salary.totalDeductions.toLocaleString()}</span></div>

            <div className="row row--total"><span className="row__label">Net Salary</span><span className="row__value">₹{salary.net.toLocaleString()}</span></div>
          </div>
        </div>

        {/* Documents */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Documents</h3>
          </div>
          {documents.map(doc => (
            <div key={doc.id} className="document-item">
              <div className="document-item__info">
                <div className="document-item__icon" style={{ display: 'inline-flex', alignItems: 'center' }}>
                  <DocumentIcon size={18} />
                </div>
                <div>
                  <div className="document-item__name">{doc.name}</div>
                  <div className="document-item__meta">{doc.type} · {doc.size} · Uploaded {doc.uploadedOn}</div>
                </div>
              </div>
              <button className="btn btn--ghost btn--sm" style={{ display: 'inline-flex', alignItems: 'center', gap: '0.35rem' }}>
                <DownloadIcon size={14} />
                <span>Download</span>
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
