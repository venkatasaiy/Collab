import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Library, Eye, EyeOff, Lock, User, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

const Login = () => {
  const { login, isAuthenticated } = useApp();
  const navigate = useNavigate();

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
    const savedUser = localStorage.getItem('bms_remembered_user');
    if (savedUser) {
      setUsername(savedUser);
      setRemember(true);
    }
  }, [isAuthenticated, navigate]);

  const validate = () => {
    const errs = {};
    if (!username.trim()) errs.username = 'Username or email is required';
    if (!password.trim()) errs.password = 'Password is required';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      const success = login(username, password, remember);
      if (success) {
        navigate('/dashboard');
      }
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <div className="login-brand-icon">
            <Library size={32} />
          </div>
          <h1>Book Management System</h1>
          <p>Sign in to manage library inventory, borrowers & issues</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="username">Username / Email</label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                id="username"
                className="form-control"
                placeholder="e.g. admin or admin@library.com"
                value={username}
                onChange={(e) => {
                  setUsername(e.target.value);
                  if (errors.username) setErrors(prev => ({ ...prev, username: '' }));
                }}
                style={{ paddingLeft: '2.5rem' }}
              />
              <User 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '0.85rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-muted)' 
                }} 
              />
            </div>
            {errors.username && <span className="error-text">{errors.username}</span>}
          </div>

          <div className="form-group" style={{ marginBottom: '1.25rem' }}>
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                type={showPassword ? 'text' : 'password'}
                id="password"
                className="form-control"
                placeholder="••••••••"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  if (errors.password) setErrors(prev => ({ ...prev, password: '' }));
                }}
                style={{ paddingLeft: '2.5rem', paddingRight: '2.5rem' }}
              />
              <Lock 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '0.85rem', 
                  top: '50%', 
                  transform: 'translateY(-50%)', 
                  color: 'var(--text-muted)' 
                }} 
              />
              <button
                type="button"
                className="password-toggle-btn"
                onClick={() => setShowPassword(prev => !prev)}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
            {errors.password && <span className="error-text">{errors.password}</span>}
          </div>

          <div className="remember-forgot" style={{ marginBottom: '1.5rem' }}>
            <label className="checkbox-label">
              <input
                type="checkbox"
                checked={remember}
                onChange={(e) => setRemember(e.target.checked)}
                style={{ width: '16px', height: '16px', accentColor: 'var(--primary)' }}
              />
              <span>Remember me</span>
            </label>
            <span style={{ fontSize: '0.825rem', color: 'var(--primary)', cursor: 'pointer' }}>
              Forgot password?
            </span>
          </div>

          <button 
            type="submit" 
            className="btn btn-primary" 
            style={{ width: '100%', padding: '0.75rem', fontSize: '0.95rem' }}
          >
            <span>Sign In to Dashboard</span>
            <ArrowRight size={18} />
          </button>
        </form>

        <div style={{ marginTop: '1.75rem', textAlign: 'center', fontSize: '0.825rem', color: 'var(--text-muted)' }}>
          <p>Demo Login: Enter any username/email & password</p>
        </div>
      </div>
    </div>
  );
};

export default Login;
