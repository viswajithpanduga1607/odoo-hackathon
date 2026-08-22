import { Link } from 'react-router-dom';
import { currentUser, employees, getSalaryBreakdown, documents } from '../../data/mockData';

export default function ProfileView() {
  const employee = employees.find(e => e.id === currentUser.id) || employees[0];
  const salary = getSalaryBreakdown(employee.id);

  return (
    <div>
      <div className="page-header">
        <div>
          <h1 className="page-title">My Profile</h1>
          <p className="page-subtitle">View your personal and professional details</p>
        </div>
        <Link to="/profile/edit" className="btn btn--primary">✏️ Edit Profile</Link>
      </div>

      {/* Profile Header */}
      <div className="profile-header">
        <div className="profile-avatar-wrapper">
          <img src={employee.avatar} alt={employee.name} className="profile-avatar" />
        </div>
        <div className="profile-info">
          <h2 className="profile-info__name">{employee.name}</h2>
          <p className="profile-info__role">{employee.designation}</p>
          <p className="profile-info__department">{employee.department}</p>
          <p className="profile-info__id">{employee.id}</p>
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
            <span className="detail-value">{employee.name}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Email</span>
            <span className="detail-value">{employee.email}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Phone</span>
            <span className="detail-value">{employee.phone}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date of Birth</span>
            <span className="detail-value">{new Date(employee.dob).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Gender</span>
            <span className="detail-value">{employee.gender}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Address</span>
            <span className="detail-value">{employee.address}</span>
          </div>
        </div>

        {/* Job Details */}
        <div className="card">
          <div className="card__header">
            <h3 className="card__title">Job Details</h3>
          </div>
          <div className="detail-row">
            <span className="detail-label">Department</span>
            <span className="detail-value">{employee.department}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Designation</span>
            <span className="detail-value">{employee.designation}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Date of Joining</span>
            <span className="detail-value">{new Date(employee.joiningDate).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Employment Type</span>
            <span className="detail-value">{employee.employmentType}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Reporting Manager</span>
            <span className="detail-value">{employee.reportingManager}</span>
          </div>
          <div className="detail-row">
            <span className="detail-label">Work Location</span>
            <span className="detail-value">{employee.workLocation}</span>
          </div>
        </div>

        {/* Salary Structure */}
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
                <div className="document-item__icon">📄</div>
                <div>
                  <div className="document-item__name">{doc.name}</div>
                  <div className="document-item__meta">{doc.type} · {doc.size} · Uploaded {doc.uploadedOn}</div>
                </div>
              </div>
              <button className="btn btn--ghost btn--sm">⬇ Download</button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
