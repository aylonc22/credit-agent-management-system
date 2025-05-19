import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './index.css';
import api from "../../api/axios";
import { toast } from 'react-toastify';
import Header from "../../components/Header";

const ChangePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [token, setToken] = useState(null);

  const { userId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const queryParams = new URLSearchParams(location.search);
    const tokenParam = queryParams.get('token');
    if (tokenParam) {
     
        api.get(`/auth/generate-link/${tokenParam}`).then(res => {
          api.put(`/auth/generate-link/${tokenParam}`).then(() => setToken(tokenParam));
        }).catch(error => {
          const errorMessage = error.response?.data?.message || 'שינוי סיסמה נכשל נסה שוב.';
          toast.error(errorMessage);
          navigate('/login');
        });
    }
  }, [location]);


  
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error("הסיסמאות לא תואמות");
      return;
    }

    try {
      const payload = token
        ? { id: userId, token, newPassword }
        : { id: userId, currentPassword, newPassword };

      await api.put('/auth/change-password', payload);

      toast.success("הסיסמה עודכנה בהצלחה");
      navigate('/login');
    } catch (e) {
      console.error('Change password error:', e);
      if (e.response?.status === 401) {
        toast.error("הסיסמה הנוכחית שגויה או שהקישור לא תקף");
      } else {
        toast.error("שגיאה בעדכון הסיסמה");
      }
    }
  };

  return (
    <div className="page page--login">
      <Header flag={true}/>
      <div className="login">
        <div className="login__content">
          <div className="splash__logo__left">Pay<strong>glow</strong></div>
          <h2 className="login__title">Update Password</h2>        

        <form onSubmit={handleSubmit}>
          {!token && (
            <div className="login-form__row">
                    <label className="login-form__label">Current</label>
                    <input                     
                      className="login-form__input"
                      type={showPassword ? "text" : "password"}
                      placeholder="Current Password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                    />                  
            </div>           
          )}

            <div className="login-form__row">
                    <label className="login-form__label">New</label>
                    <input                     
                      className="login-form__input"                     
                      type={showPassword ? "text" : "password"}
                      placeholder="New Password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                    />                  
            </div>    
         
            <div className="login-form__row">
                    <label className="login-form__label">Verify</label>
                    <input                     
                      className="login-form__input"                     
                      type={showPassword ? "text" : "password"}
                      placeholder="Verify Password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                    />                  
            </div>            
          <div className="login-form__row">
                    <input
                      type="submit"
                      className="login-form__submit button button--main button--full"
                      value="Update password"
                    />
                  </div>
        </form>
      </div>
    </div>
    </div>
  );
};

export default ChangePassword;
