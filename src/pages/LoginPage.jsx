import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './LoginPage.css';

const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // First check if email is correct
    if (email !== 'eve.holt@reqres.in') {
      setError('Invalid Mail ID');
      setLoading(false);
      return;
    }

    // Then check password
    if (password !== 'cityslicka') {
      setError('Invalid Password');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.post('https://reqres.in/api/login', {
        email,
        password
      });

      onLogin(response.data.token);
      navigate('/users');
    } catch (err) {
      setError('Server error. Please try again.');
    }
    setLoading(false);
  };

  const handleForgotPassword = (e) => {
    e.preventDefault();
    if (!email) {
      setError('Please enter your email address first');
      return;
    }
    alert('Email has been sent to your EmailID, change your password');
    setError('');
  };

  const handleSocialLogin = (provider) => {
    window.location.href = `https://reqres.in/oauth/${provider}`;
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1>Login</h1>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label>Username</label>
            <div className="input-with-icon">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="👤 Enter your Email"
                required
              />
            </div>
          </div>
          <div className="form-group">
            <label>Password</label>
            <div className="input-with-icon">
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="🔒 Type your password"
                required
              />
            </div>
          </div>
          <div className="forgot-password">
            <a href="#" onClick={handleForgotPassword}>
              Forgot password?
            </a>
          </div>
          {error && <div className="error-message">{error}</div>}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'LOGIN'}
          </button>
        </form>
        <div className="social-login">
          <p>Or Sign Up Using</p>
          <div className="social-icons">
            <button 
              className="social-button facebook"
              onClick={() => handleSocialLogin('facebook')}
              aria-label="Login with Facebook"
            >
              <i className="fab fa-facebook-f"></i>
            </button>
            <button 
              className="social-button twitter"
              onClick={() => handleSocialLogin('twitter')}
              aria-label="Login with Twitter"
            >
              <i className="fab fa-twitter"></i>
            </button>
            <button 
              className="social-button google"
              onClick={() => handleSocialLogin('google')}
              aria-label="Login with Google"
            >
              <i className="fab fa-google"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginPage; 