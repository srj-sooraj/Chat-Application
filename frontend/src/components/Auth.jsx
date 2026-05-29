import React, { useState } from 'react';
import * as api from '../api';
import './Auth.css';

const Auth = ({ onAuthSuccess }) => {
  const [isSignup, setIsSignup] = useState(false);
  const [formData, setFormData] = useState({ name: '', password: '', appID: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (isSignup) {
        const { data } = await api.register(formData);
        localStorage.setItem('profile', JSON.stringify(data));
        onAuthSuccess(data);
      } else {
        const { data } = await api.login(formData);
        localStorage.setItem('profile', JSON.stringify(data));
        onAuthSuccess(data);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-logo">
          <img src="https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg" alt="WhatsApp" />
          <h1>{isSignup ? 'Create Account' : 'Welcome Back'}</h1>
        </div>
        
        <form onSubmit={handleSubmit}>
          {isSignup && (
            <div className="input-field">
              <label>Full Name</label>
              <input 
                type="text" 
                placeholder="Enter your name"
                required
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              />
            </div>
          )}
          
          {!isSignup && (
            <div className="input-field">
              <label>App ID</label>
              <input 
                type="text" 
                placeholder="Enter your 8-digit App ID"
                required
                onChange={(e) => setFormData({ ...formData, appID: e.target.value })}
              />
            </div>
          )}

          <div className="input-field">
            <label>Password</label>
            <input 
              type="password" 
              placeholder="••••••••"
              required
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
          </div>

          {error && <p className="error-msg">{error}</p>}

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? 'Processing...' : (isSignup ? 'Sign Up' : 'Login')}
          </button>
        </form>

        <p className="auth-toggle">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <span onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? ' Login' : ' Sign Up'}
          </span>
        </p>
      </div>
    </div>
  );
};

export default Auth;
