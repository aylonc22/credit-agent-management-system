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
  const [twofaCode, setTwofaCode] = useState('');  // New state for 2FA code
  const [isTwofaRequired, setIsTwofaRequired] = useState(false);  // Flag to show 2FA input

  const navigate = useNavigate();

  // Handle login form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (isTwofaRequired) {
      // If 2FA is required, submit the 2FA code
      try {
        const res = await api.post('/auth/verify-2fa', { username, twofaCode });
        localStorage.setItem('token', res.data.token); // Store JWT token
        toast.success('ההתחברות בוצעה בהצלחה');
        navigate('/');
      } catch (err) {
        console.error('2FA verification error:', err);
        if (err.response && err.response.data.message) {
          toast.error(err.response.data.message);
        } else {
          toast.error('שגיאה בהזנת קוד האימות. נסה שוב.');
        }
      }
    } else {
      // If 2FA is not required, proceed with the usual login
      try {
        const res = await api.post('/auth/login', { username, password });
        localStorage.setItem('token', res.data.token); // Store JWT token
        toast.success(res.data.message);
        navigate('/');
      } catch (e) {
        console.error('Login error:', e);
        if (e.response && e.response.status === 403 && e.response.id) {
          // If password expired, redirect to the "change password" page
          toast.error('הסיסמה שלך פגה. אנא שנה את הסיסמה שלך.');
          navigate(`/change-password/${e.response.data.id}`);
        } else if (e.response && e.response.status === 401 && e.response.twofaRequired) {
          // If 2FA is required, show the 2FA input
          setIsTwofaRequired(true);
        } else {
          // For other errors
          console.log(e);
          if (e.response.data.message) {
            toast.error(e.response.data.message);
          } else {
            toast.error('ההתחברות נכשלה. נסה שוב.');
          }
        }
      }
    }
  };

  return (
    <div className="login-container" dir="rtl">
      <div className="login-box">
        <h2>התחברות לחשבון</h2>

        <form onSubmit={handleSubmit}>
          {!isTwofaRequired && (
            <>
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
            </>
          )}

          {isTwofaRequired && (
            <div className="input-group">
              <input
                type="text"
                placeholder="הזן קוד אימות"
                value={twofaCode}
                onChange={(e) => setTwofaCode(e.target.value)}
                required
              />
            </div>
          )}

          <button type="submit" className="btn">
            {isTwofaRequired ? 'אמת קוד' : 'התחבר'}
          </button>
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
