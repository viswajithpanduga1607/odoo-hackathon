import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signUpUser, validatePassword } from '../../firebase/authService';
import { EyeIcon, EyeOffIcon, AlertIcon, MailIcon } from '../../components/common/Icons';

export default function SignUp() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    employeeId: '',
    fullName: '',
    email: '',
    password: '',
    confirmPassword: '',
    role: 'employee',
  });
  const [errors, setErrors] = useState({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [generalError, setGeneralError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: '' });
    }
    if (generalError) setGeneralError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setGeneralError('');
    setSuccessMessage('');

    // Client-side field validations
    const newErrors = {};
    if (!form.employeeId.trim()) newErrors.employeeId = 'Employee ID is required';
    if (!form.fullName.trim()) newErrors.fullName = 'Full Name is required';
    if (!form.email.trim()) newErrors.email = 'Email Address is required';
    
    // Password validation (min 8 chars, 1 number, 1 symbol)
    const pwdValidation = validatePassword(form.password);
    if (!pwdValidation.isValid) {
      newErrors.password = pwdValidation.error;
    }

    if (form.password !== form.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoading(true);

    try {
      const result = await signUpUser({
        employeeId: form.employeeId,
        fullName: form.fullName,
        email: form.email,
        password: form.password,
        role: form.role,
      });

      setSuccessMessage(result.message || 'Account created! A verification email has been sent. Please verify your email before signing in.');
      setForm({
        employeeId: '',
        fullName: '',
        email: '',
        password: '',
        confirmPassword: '',
        role: 'employee',
      });
    } catch (err) {
      console.error('Sign Up error:', err);
      let errorMsg = err.message || 'Failed to create account. Please try again.';
      if (err.code === 'auth/email-already-in-use') {
        errorMsg = 'This email address is already registered. Please sign in instead.';
      } else if (err.code === 'auth/invalid-email') {
        errorMsg = 'Please provide a valid email address.';
      } else if (err.code === 'auth/operation-not-allowed') {
        errorMsg = 'Email/Password sign up is not enabled. Please enable it in Firebase Console.';
      }
      setGeneralError(errorMsg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-brand">
        <div className="auth-brand__logo">
          <div className="auth-brand__logo-icon">D</div>
          Dayflow
        </div>
        <p className="auth-brand__tagline">Streamline your workforce</p>
      </div>

      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1 className="auth-form__title">Create Account</h1>
          <p className="auth-form__subtitle">Join Dayflow to manage your HR needs</p>

          {generalError && (
            <div className="alert alert--error" style={{ marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <AlertIcon size={18} />
              <span>{generalError}</span>
            </div>
          )}

          {successMessage && (
            <div className="alert alert--success" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <MailIcon size={18} />
                <span style={{ fontWeight: 600 }}>Verification Required</span>
              </div>
              <p style={{ fontSize: 'var(--text-sm)', lineHeight: '1.4' }}>{successMessage}</p>
              <Link to="/signin" className="btn btn--primary btn--sm" style={{ marginTop: '0.5rem', alignSelf: 'flex-start' }}>
                Proceed to Sign In →
              </Link>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Employee ID</label>
            <input
              type="text"
              name="employeeId"
              className={`form-input ${errors.employeeId ? 'form-input--error' : ''}`}
              placeholder="e.g. EMP-2024-001"
              value={form.employeeId}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.employeeId && <span className="form-error">{errors.employeeId}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Full Name</label>
            <input
              type="text"
              name="fullName"
              className={`form-input ${errors.fullName ? 'form-input--error' : ''}`}
              placeholder="e.g. John Doe"
              value={form.fullName}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.fullName && <span className="form-error">{errors.fullName}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className={`form-input ${errors.email ? 'form-input--error' : ''}`}
              placeholder="name@company.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
            />
            {errors.email && <span className="form-error">{errors.email}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className={`form-input ${errors.password ? 'form-input--error' : ''}`}
                placeholder="Min 8 chars, 1 number, 1 symbol"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
                title={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            </div>
            {errors.password ? (
              <span className="form-error">{errors.password}</span>
            ) : (
              <span className="form-hint">At least 8 characters with 1 number and 1 special symbol</span>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">Confirm Password</label>
            <div className="password-wrapper">
              <input
                type={showConfirm ? 'text' : 'password'}
                name="confirmPassword"
                className={`form-input ${errors.confirmPassword ? 'form-input--error' : ''}`}
                placeholder="Re-enter password"
                value={form.confirmPassword}
                onChange={handleChange}
                disabled={loading}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex="-1"
                title={showConfirm ? 'Hide password' : 'Show password'}
              >
                {showConfirm ? <EyeOffIcon size={16} /> : <EyeIcon size={16} />}
              </button>
            </div>
            {errors.confirmPassword && <span className="form-error">{errors.confirmPassword}</span>}
          </div>

          <div className="form-group">
            <label className="form-label">Role</label>
            <select
              name="role"
              className="form-select"
              value={form.role}
              onChange={handleChange}
              disabled={loading}
            >
              <option value="employee">Employee</option>
              <option value="admin">HR Admin</option>
            </select>
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full btn--lg"
            style={{ marginTop: '0.5rem' }}
            disabled={loading}
          >
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>

          <div className="auth-form__footer">
            Already have an account? <Link to="/signin">Sign In</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
