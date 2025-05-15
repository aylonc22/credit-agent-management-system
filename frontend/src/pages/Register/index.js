import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import './index.scss';
import api from "../../api/axios";
import { toast } from 'react-toastify';
import Header from "../../components/Header";

const Register = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [inviteToken, setInviteToken] = useState(null);
  const [isPendingVerification, setIsPendingVerification] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');
  const [isResending, setIsResending] = useState(false);
  const [errors, setErrors] = useState({});

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

  const validateFields = () => {
    const newErrors = {};
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!username.trim()) newErrors.username = "This field is required.";
    if (!name.trim()) newErrors.name = "This field is required.";
    if (!email.trim()) {
      newErrors.email = "This field is required.";
    } else if (!emailRegex.test(email)) {
      newErrors.email = "Please enter a valid email address.";
    }
    if (!password.trim()) newErrors.password = "This field is required.";
    if (!confirmPassword.trim()) {
      newErrors.confirmPassword = "This field is required.";
    } else if (password !== confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleRegister = (e) => {
    e.preventDefault();
    if (!validateFields()) return;

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
    <div className="page page--login" data-page="login">
       <Header flag={true}/>

      <div className="login">
        <div className="login__content">
          <div className="splash__logo__left">Pay<strong>glow</strong></div>
          {!isPendingVerification ? (
            <>
              <h2 className="login__title">Create an account</h2>
              <div className="login-form">
                <form onSubmit={handleRegister} noValidate>
                  <div className="login-form__row">
                    <label className="login-form__label">Username</label>
                    <input
                      type="text"
                      className="login-form__input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && <label className="error">{errors.username}</label>}
                  </div>

                  <div className="login-form__row">
                    <label className="login-form__label">Full Name</label>
                    <input
                      type="text"
                      className="login-form__input"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                    />
                    {errors.name && <label className="error">{errors.name}</label>}
                  </div>

                  <div className="login-form__row">
                    <label className="login-form__label">Email</label>
                    <input
                      type="email"
                      className="login-form__input"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    {errors.email && <label className="error">{errors.email}</label>}
                  </div>

                  <div className="login-form__row">
                    <label className="login-form__label">Password</label>
                    <input
                      type="password"
                      className="login-form__input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && <label className="error">{errors.password}</label>}
                  </div>

                  <div className="login-form__row">
                    <label className="login-form__label">Verify Password</label>
                    <input
                      type="password"
                      className="login-form__input"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                    />
                    {errors.confirmPassword && <label className="error">{errors.confirmPassword}</label>}
                  </div>

                  <div className="login-form__row">
                    <input
                      type="submit"
                      className="login-form__submit button button--main button--full"
                      value="SIGN UP"
                    />
                  </div>
                </form>
              </div>
            </>
          ) : (
            <>
              <h2 className="login__title">Verify your email</h2>
              <div className="login-form">
                <form onSubmit={handleVerifyCode}>
                  <div className="login-form__row">
                    <label className="login-form__label">Verification Code</label>
                    <input
                      type="text"
                      className="login-form__input"
                      value={verificationCode}
                      onChange={(e) => setVerificationCode(e.target.value)}
                    />
                  </div>

                  <div className="login-form__row">
                    <input
                      type="submit"
                      className="login-form__submit button button--main button--full"
                      value="VERIFY"
                    />
                  </div>
                </form>

                <div className="login-form__row links">
                  <button
                    className="button button--border button--full"
                    onClick={handleResendCode}
                    disabled={isResending}
                  >
                    {isResending ? "Sending..." : "Resend Code"}
                  </button>
                </div>

                <div className="login-form__row links">
                  <button
                    className="button button--border button--full"
                    onClick={() => {
                      sessionStorage.removeItem("pendingUsername");
                      setIsPendingVerification(false);
                      setUsername('');
                    }}
                  >
                    Change User
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Register;
