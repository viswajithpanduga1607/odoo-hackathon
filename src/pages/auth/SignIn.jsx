import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function SignIn() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: '', password: '' });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [remember, setRemember] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    if (error) setError('');
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Mock authentication
    if (form.email === 'admin@dayflow.io' && form.password === 'admin123') {
      navigate('/admin/dashboard');
    } else if (form.email && form.password === 'password') {
      navigate('/dashboard');
    } else if (form.email && form.password) {
      setError('Invalid email or password. Please try again.');
    } else {
      setError('Please fill in all fields.');
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
            <div className="alert alert--error" style={{ marginBottom: '1.5rem' }}>
              <span>⚠️</span>
              <span>{error}</span>
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
              />
              <button type="button" className="password-toggle" onClick={() => setShowPassword(!showPassword)}>
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          </div>

          <div className="auth-form__extras">
            <label className="auth-form__remember">
              <input type="checkbox" checked={remember} onChange={() => setRemember(!remember)} />
              Remember me
            </label>
            <a href="#" className="auth-form__forgot">Forgot password?</a>
          </div>

          <button type="submit" className="btn btn--primary btn--full btn--lg">
            Sign In
          </button>

          <div className="auth-form__footer">
            Don't have an account? <Link to="/signup">Sign Up</Link>
          </div>

          <div style={{ marginTop: '2rem', padding: '1rem', background: 'var(--color-bg-elevated)', borderRadius: 'var(--radius-lg)', fontSize: 'var(--text-xs)', color: 'var(--color-text-muted)' }}>
            <strong style={{ color: 'var(--color-text-secondary)' }}>Demo Credentials:</strong><br />
            Employee: any email + password: <code>password</code><br />
            Admin: <code>admin@dayflow.io</code> + password: <code>admin123</code>
          </div>
        </form>
      </div>
    </div>
  );
}
