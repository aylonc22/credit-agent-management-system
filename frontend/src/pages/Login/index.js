import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './index.css';
import api from "../../api/axios";
import { toast } from 'react-toastify';

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await api.post('/auth/login', { username, password });
      localStorage.setItem('token', res.data.token); // Store JWT token
      toast.success('התחברות הצליחה!');
      navigate('/');
    } catch (e) {
      console.error('Login error:', e);
      toast.error('ההתחברות נכשלה. נסה שוב.');
    }
  };

  return (
    <div className="login-container" dir="rtl">
      <div className="login-box">
        <h2>התחברות לחשבון</h2>

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <input
              type="text"
              placeholder="שם משתמש"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="סיסמה"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "הסתר" : "הצג"}
            </span>
          </div>

          <button type="submit" className="btn">התחבר</button>
        </form>

        <div className="links">
          <a href="/forgot-password">שכחת סיסמה?</a>
        </div>

        <div className="register-link">
          <p>אין לך חשבון? <Link to="/register">הירשם</Link></p>
        </div>
      </div>
    </div>
  );
};

export default Login;
