import React, { useState } from "react";
import { useNavigate, Link } from 'react-router-dom';
import './index.scss';
import '../LandingPage/index.scss';
import api from "../../api/axios";
import { toast } from 'react-toastify';

import backArrow from '../../assets/images/icons/arrow-back.svg';
import Header from "../../components/Header";

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twofaCode, setTwofaCode] = useState('');
  const [isTwofaRequired, setIsTwofaRequired] = useState(false);
  const [errors, setErrors] = useState({});

  const navigate = useNavigate();

  const validateFields = () => {
    const newErrors = {};

    if (!isTwofaRequired && !username.trim()) newErrors.username = "This field is required.";
    if (!isTwofaRequired && !password.trim()) newErrors.password = "This field is required.";
    if (isTwofaRequired && !twofaCode.trim()) newErrors.twofaCode = "This field is required.";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateFields()) return;

    if (isTwofaRequired) {
      try {
        const res = await api.post('/auth/verify-2fa', { username, twofaCode });
        toast.success(res.data.welcome || 'ההתחברות בוצעה בהצלחה');
        navigate('/');
      } catch (err) {
        console.error('2FA verification error:', err);
        toast.error(err.response?.data?.message || 'שגיאה בהזנת קוד האימות. נסה שוב.');
      }
    } else {
      try {
        const res = await api.post('/auth/login', { username, password });
        localStorage.setItem('token', res.data.token);
        toast.success(res.data.message);
        navigate('/');
      } catch (e) {
        console.error('Login error:', e);
        if (e.response?.status === 403 && e.response.data.id) {
          toast.error('הסיסמה שלך פגה. אנא שנה את הסיסמה שלך.');
          navigate(`/change-password/${e.response.data.id}`);
        } else if (e.response?.status === 401 && e.response.data.twofaRequired) {
          setIsTwofaRequired(true);
        } else {
          toast.error(e.response?.data?.message || 'ההתחברות נכשלה. נסה שוב.');
        }
      }
    }
  };

  const handleResend2fa = async () => {
    try {
      await api.post('/auth/resend-2fa', { username });
      toast.success('קוד האימות נשלח שוב');
    } catch (err) {
      toast.error('שגיאה בשליחת קוד האימות');
    }
  };

  const handleGoBack = () => {
    setIsTwofaRequired(false);
    setTwofaCode('');
    setErrors({});
  };

  return (
    <div className="page page--login" data-page="login">
      <Header flag={true}/>

      <div className="login">
        <div className="login__content">
          <div className="splash__logo__left">Pay<strong>glow</strong></div>
          <h2 className="login__title">LOGIN</h2>

          <div className="login-form">
            <form onSubmit={handleSubmit} noValidate>
              {!isTwofaRequired ? (
                <>
                  <div className="login-form__row">
                    <label className="login-form__label">Username</label>
                    <input
                      type="text"
                      className="login-form__input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                    {errors.username && (
                      <label className="error" htmlFor="username">{errors.username}</label>
                    )}
                  </div>

                  <div className="login-form__row">
                    <label className="login-form__label">Password</label>
                    <input
                      type="password"
                      className="login-form__input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                    {errors.password && (
                      <label className="error" htmlFor="password">{errors.password}</label>
                    )}
                  </div>

                  <div className="login-form__forgot-pass">
                    <Link to="/forgot-password">Forgot Password?</Link>
                  </div>
                </>
              ) : (
                <>
                  <div className="login-form__row">
                    <label className="login-form__label">קוד אימות</label>
                    <input
                      type="text"
                      className="login-form__input"
                      value={twofaCode}
                      onChange={(e) => setTwofaCode(e.target.value)}
                    />
                    {errors.twofaCode && (
                      <label className="error" htmlFor="twofaCode">{errors.twofaCode}</label>
                    )}
                  </div>

                  <div className="twofa-links">
                    <button type="button" onClick={handleResend2fa} className="resend-btn">
                      שלח קוד אימות שוב
                    </button>
                    <button type="button" onClick={handleGoBack} className="go-back-btn">
                      חזור להתחברות
                    </button>
                  </div>
                </>
              )}

              <div className="login-form__row">
                <input
                  type="submit"
                  className="login-form__submit button button--main button--full"
                  value={isTwofaRequired ? 'אמת קוד' : 'Sign In'}
                />
              </div>
            </form>

            {!isTwofaRequired && (
              <div className="login-form__bottom">
                <p>Don't have an account? <br /><Link to="/register">SIGNUP NOW!</Link></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
