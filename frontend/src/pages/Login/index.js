import React, { useState } from "react";
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import './index.scss';
import '../LandingPage/index.scss';
import api from "../../api/axios";
import { toast } from 'react-toastify';

import backArrow from '../../assets/images/icons/arrow-back.svg';
const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [twofaCode, setTwofaCode] = useState('');
  const [isTwofaRequired, setIsTwofaRequired] = useState(false);

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (isTwofaRequired) {
      try {
        const res = await api.post('/auth/verify-2fa', { username, twofaCode });
        toast.success(res.data.welcome ? res.data.welcome : 'ההתחברות בוצעה בהצלחה');
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
  };

  return (
    <div className="page page--login" data-page="login" >
      <header className="header header--fixed">
        <div className="header__inner">
          <div className="header__icon">
            <Link to='/landing'><img src={backArrow} alt="Back" title="back" /></Link>
          </div>
        </div>
      </header>

      <div className="login">
        <div className="login__content">
          <div className="splash__logo__left">Pay<strong>glow</strong></div>
          <h2 className="login__title">LOGIN</h2>

          <div className="login-form">
            <form onSubmit={handleSubmit}>
              {!isTwofaRequired ? (
                <>
                  <div className="login-form__row">
                    <label className="login-form__label required">Username</label>
                    <input
                      type="text"
                      className="login-form__input"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                      required
                    />
                  </div>

                  <div className="login-form__row">
                    <label className="login-form__label">Password</label>
                    <input
                      type="password"
                      className="login-form__input"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                    />                   
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
                      required
                    />
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
                <p> Don't have an account? <br /><Link to="/register">SIGNUP NOW!</Link></p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
