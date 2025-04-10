import React, { useState, useEffect } from "react";
import { Link, useNavigate, useParams, useLocation } from "react-router-dom";
import './index.css';
import api from "../../api/axios";
import { toast } from 'react-toastify';

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [inviteToken, setInviteToken] = useState(null);
  const [isPendingVerification, setIsPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isResending, setIsResending] = useState(false);

  const navigate = useNavigate();
  const { agent } = useParams();
  const location = useLocation();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const token = queryParams.get('token');
    if (token) {
      api.get(`/auth/generate-link/${token}`).then(res => {
        api.put(`/auth/generate-link/${token}`).then(() => setInviteToken(token));
      }).catch(error => {
        const errorMessage = error.response?.data?.message || 'ההרשמה נכשלה. אנא נסה שוב.';
        toast.error(errorMessage);
        navigate('/register');
      });
    }

    const storedUsername = sessionStorage.getItem("pendingUsername");
    if (storedUsername) {
      setUsername(storedUsername);
      setIsPendingVerification(true);
    }
  }, [location]);

  const handleRegister = (e) => {
    e.preventDefault();

    const registrationData = { email, name, username, password };
    if (inviteToken) registrationData.inviteToken = inviteToken;

    let url = '/auth/register';
    if (agent) url = `/auth/register/${agent}`;

    api.post(url, registrationData)
      .then((response) => {
        if (response.status === 202) {
          toast.info(response.data.message || "נשלח קוד אימות למייל שלך");
          sessionStorage.setItem("pendingUsername", username);
          setIsPendingVerification(true);
        } else {
          localStorage.setItem('token', response.data.token);
          toast.success(response.data.message || 'ההרשמה הצליחה! ברוך הבא.');
          navigate('/');
        }
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || 'ההרשמה נכשלה. אנא נסה שוב.';
        toast.error(errorMessage);
      });
  };

  const handleVerifyCode = (e) => {
    e.preventDefault();
    const storedUsername = sessionStorage.getItem("pendingUsername");

    if (!storedUsername) {
      toast.error("לא ניתן לאמת. נסה להירשם מחדש.");
      return;
    }

    api.post('/auth/verify-2fa', {
      username: storedUsername,
      twofaCode: verificationCode,
    })
      .then(res => {
        sessionStorage.removeItem("pendingUsername");
        toast.success("האימות הצליח! ברוך הבא.");
        navigate('/');
      })
      .catch(error => {
        const errorMessage = error.response?.data?.message || 'האימות נכשל. נסה שוב.';
        toast.error(errorMessage);
      });
  };

  const handleResendCode = () => {
    const storedUsername = sessionStorage.getItem("pendingUsername");

    if (!storedUsername) {
      toast.error("אין משתמש לאימות.");
      return;
    }

    setIsResending(true);
    api.post('/auth/resend-2fa', { username: storedUsername })
      .then(() => {
        toast.success("הקוד נשלח שוב למייל שלך.");
      })
      .catch((error) => {
        const errorMessage = error.response?.data?.message || 'שליחת הקוד נכשלה.';
        toast.error(errorMessage);
      })
      .finally(() => setIsResending(false));
  };

  return (
    <div className="login-container">
      <div className="login-box">
        {!isPendingVerification ? (
          <>
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

            {!inviteToken && (
              <div className="links">
                כבר יש לך חשבון? <Link to="/login">התחבר</Link>
              </div>
            )}
          </>
        ) : (
          <>
            <h2>אימות כתובת אימייל</h2>
            <form onSubmit={handleVerifyCode}>
              <div className="input-group">
                <input
                  type="text"
                  placeholder="הזן את קוד האימות שנשלח אליך"
                  value={verificationCode}
                  onChange={(e) => setVerificationCode(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="btn">אמת</button>
            </form>
            <div className="links">
              <button className="btn-secondary" onClick={handleResendCode} disabled={isResending}>
                {isResending ? "שולח..." : "שלח קוד מחדש"}
              </button>
              <button
                className="btn-secondary"
                onClick={() => {
                  sessionStorage.removeItem("pendingUsername");
                  setIsPendingVerification(false);
                  setUsername('');
                }}
              >
                שינוי משתמש
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Register;
