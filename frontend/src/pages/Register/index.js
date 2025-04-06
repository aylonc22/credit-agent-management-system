import React, { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import './index.css';
import api from "../../api/axios";
import { toast } from 'react-toastify';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();
  const { agent } = useParams();
  
  // Handle registration form submission
  const handleRegister = (e) => {
    e.preventDefault();

    api.post('/auth/register', { email, name, username, password, agent })
      .then((response) => {
        // Store token
        localStorage.setItem('token', response.data.token);
        toast.success('ההרשמה הצליחה! ברוך הבא.');
        navigate('/');
      })
      .catch((error) => {
        console.error('Registration failed', error);
        toast.error('ההרשמה נכשלה. אנא נסה שוב.');
      });
  };

  return (
    <div className="login-container">
      <div className="login-box">
        <h2>צור חשבון חדש</h2>

        <form onSubmit={handleRegister}>
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
              type="text"
              placeholder="שם מלא"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type="email"
              placeholder="כתובת אימייל"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="צור סיסמה"
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

          <button type="submit" className="btn">הירשם</button>
        </form>

        <div className="links">
          כבר יש לך חשבון? <Link to="/login">התחבר</Link>
        </div>
      </div>
    </div>
  );
};

export default Register;
