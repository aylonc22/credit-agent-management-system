import React, { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import './index.css';
import api from "../../api/axios";
import { toast } from 'react-toastify';

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
    <div className="login-container" dir="rtl">
      <div className="login-box">
        <h2>שנה סיסמה</h2>

        <form onSubmit={handleSubmit}>
          {!token && (
            <div className="input-group">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="סיסמה נוכחית"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                required
              />
            </div>
          )}

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="סיסמה חדשה"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>

          <div className="input-group">
            <input
              type={showPassword ? "text" : "password"}
              placeholder="אשר סיסמה חדשה"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
            <span
              className="password-toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "הסתר" : "הצג"}
            </span>
          </div>

          <button type="submit" className="btn">עדכן סיסמה</button>
        </form>
      </div>
    </div>
  );
};

export default ChangePassword;
