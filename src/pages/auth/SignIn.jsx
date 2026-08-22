import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { signInUser, resendVerificationEmail } from '../../firebase/authService';

export default function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [successInfo, setSuccessInfo] = useState('');
  const [isUnverified, setIsUnverified] = useState(false);
  const [resending, setResending] = useState(false);
  const [loading, setLoading] = useState(false);
  const [remember, setRemember] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
    if (successInfo) setSuccessInfo('');
  };

  const handleResendVerification = async () => {
    if (!form.email || !form.password) {
      setError('Please provide your email and password to resend the verification email.');
      return;
    }
    setResending(true);
    setError('');
    setSuccessInfo('');
    try {
      const res = await resendVerificationEmail(form.email, form.password);
      setSuccessInfo(res.message || 'Verification email resent! Please check your inbox.');
    } catch (err) {
      setError(err.message || 'Failed to resend verification email.');
    } finally {
      setResending(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessInfo('');
    setIsUnverified(false);

    if (!form.email.trim() || !form.password) {
      setError('Please enter both email address and password.');
      return;
    }

    setLoading(true);

    try {
      const result = await signInUser({
        email: form.email,
        password: form.password,
      });

      // Successful verified login — route based on role
      const userRole = result.role || result.profile?.role || 'employee';

      if (userRole === 'admin') {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Sign In error:', err);
      if (err.code === 'auth/email-not-verified') {
        setIsUnverified(true);
        setError('Your email is not verified yet. Please click the verification link sent to your inbox before signing in.');
      } else if (
        err.code === 'auth/user-not-found' ||
        err.code === 'auth/wrong-password' ||
        err.code === 'auth/invalid-credential'
      ) {
        setError('Invalid email or password. Please try again.');
      } else if (err.code === 'auth/too-many-requests') {
        setError('Too many failed attempts. Please reset your password or try again later.');
      } else if (err.code === 'auth/invalid-email') {
        setError('Please enter a valid email address.');
      } else {
        setError(err.message || 'Authentication failed. Please verify your credentials.');
      }
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
        <p className="auth-brand__tagline">Welcome back</p>
      </div>

      <div className="auth-form-container">
        <form className="auth-form" onSubmit={handleSubmit}>
          <h1 className="auth-form__title">Sign In</h1>
          <p className="auth-form__subtitle">Enter your credentials to access your account</p>

          {error && (
            <div className="alert alert--error" style={{ marginBottom: '1.5rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>⚠️</span>
                <span>{error}</span>
              </div>
              {isUnverified && (
                <button
                  type="button"
                  onClick={handleResendVerification}
                  disabled={resending}
                  className="btn btn--secondary btn--sm"
                  style={{ alignSelf: 'flex-start', marginTop: '0.25rem' }}
                >
                  {resending ? 'Resending...' : '✉️ Resend Verification Email'}
                </button>
              )}
            </div>
          )}

          {successInfo && (
            <div className="alert alert--success" style={{ marginBottom: '1.5rem' }}>
              <span>✅</span>
              <span>{successInfo}</span>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Email Address</label>
            <input
              type="email"
              name="email"
              className="form-input"
              placeholder="name@company.com"
              value={form.email}
              onChange={handleChange}
              disabled={loading}
              autoComplete="email"
            />
          </div>

          <div className="form-group">
            <label className="form-label">Password</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-input"
                placeholder="Enter your password"
                value={form.password}
                onChange={handleChange}
                disabled={loading}
                autoComplete="current-password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="auth-form__extras">
            <label className="auth-form__remember">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                disabled={loading}
              />
              Remember me
            </label>
            <a href="#" className="auth-form__forgot" onClick={(e) => e.preventDefault()}>
              Forgot password?
            </a>
          </div>

          <button
            type="submit"
            className="btn btn--primary btn--full btn--lg"
            disabled={loading}
          >
            {loading ? 'Signing In...' : 'Sign In'}
          </button>

          <div className="auth-form__footer">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>
        </form>
      </div>
    </div>
  );
}
