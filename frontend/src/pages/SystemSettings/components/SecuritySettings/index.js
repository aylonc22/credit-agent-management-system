import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../api/axios';
import './index.css';
import useAuth from '../../../../hooks/useAuth';
import {jwtDecode} from 'jwt-decode';

const SecuritySettings = ({isPanelOpen, panelClickHandle}) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [is2faSent, setIs2faSent] = useState(false);
  const [twofaCode, setTwofaCode] = useState('');
  const [is2faVerified, setIs2faVerified] = useState(false);
  
  const userData = useAuth(isPanelOpen, panelClickHandle);
  
  useEffect(()=>{
    const token = localStorage.getItem('token');
    const twofaEnabled = jwtDecode(token).twofaEnabled;  
    
    setIs2faEnabled(twofaEnabled);
    
  },[]);
  
  if (!userData) {
    return <div>טוען...</div>;
  }
  
  const { id, role } = userData;

  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('הסיסמאות החדשות אינן תואמות');
      return;
    }

    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
        id
      });
      toast.success('הסיסמה שונתה בהצלחה');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
      if (error.response && error.response.data.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('שגיאה בשינוי הסיסמה');
      }
    }
  };

  const handleEnable2fa = async () => {
    try {
      const response = await api.post('/auth/enable-2fa/protected');
      if (response.status === 200) {
        setIs2faEnabled(true);
        setIs2faSent(true);
        toast.success('אימייל עם קוד 2FA נשלח');
      }
    } catch (error) {     
      toast.error('שגיאה בהפעלה של 2FA');
    }
  };

  const handleVerify2fa = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post('/auth/verify-2fa/protected', { twofaCode });
      if (response.status === 200) {
        setIs2faVerified(true);       
        toast.success('אימות 2FA הושלם בהצלחה');
      }
    } catch (error) {
      console.log(error)
      toast.error('שגיאה בהזנת קוד האימות');
    }
  };

  const handleDisable2fa = async () => {
    try {
      const response = await api.post('/auth/disable-2fa');
      if (response.status === 200) {
        setIs2faEnabled(false);
        toast.success('2FA בוטל בהצלחה');
      }
    } catch (error) {
      toast.error('שגיאה בביטול 2FA');
    }
  };

  return (
    <div className="fieldset">
       <h3 className="pb-20 pt-20">Change Password</h3>      
        <form onSubmit={handleChangePassword}>
          <div className="input-group">
            <input
              className="settings-password"
              type="password"
              placeholder="Current Password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              className="settings-password"
              type="password"
              placeholder="New Password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              className="settings-password"
              type="password"
              placeholder="Verify New Password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <div className="form__row mt-40">
          <button type="submit" className="form__submit button button--main button--full">
           Save
          </button>
				  </div>
        </form>

      {/* Enable/Disable 2FA Section */}
      {role === 'client' && (
        <div className="section">
          <h3 className="pb-20 pt-20">Two-Factor Authentication (2FA)</h3>            
          {is2faSent && !is2faVerified ? (
            <form onSubmit={handleVerify2fa}>
              <div className="input-group">
                <input
                  type="text"
                  className="input-field"
                  placeholder="Enter 2FA Verification Code"
                  value={twofaCode}
                  onChange={(e) => setTwofaCode(e.target.value)}
                  required
                />
              </div>
              <button type="submit" className="button button--main">
                Verify Code
              </button>
            </form>
          ) : !is2faEnabled && (
            <>
              <h3 className="pb-20 pt-20">Enable two-factor authentication (2FA) via email to secure your account.</h3>
              <button className="button button--main" onClick={handleEnable2fa}>
                Enable 2fa
              </button>
            </>
          )}
          {is2faEnabled && (
            <>
              <h3 className="pb-20 pt-20">Two-factor authentication has been successfully enabled!</h3>             
              <button className="button button--main" onClick={handleDisable2fa}>
                Disable 2fa
              </button>
            </>
          )}
          {is2faVerified && <h3 className="pb-20 pt-20">Two-factor authentication completed successfully!</h3>}
        </div>
      )}
    </div>
  )

  return (
    <div className="settings-container">
      {/* Change Password Section */}
      <div className="section">
        <h2>שינוי סיסמה</h2>
        <form onSubmit={handleChangePassword}>
          <div className="input-group">
            <input
              className="settings-password"
              type="password"
              placeholder="סיסמה נוכחית"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              className="settings-password"
              type="password"
              placeholder="סיסמה חדשה"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input
              className="settings-password"
              type="password"
              placeholder="אשר סיסמה חדשה"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">
            שנה סיסמה
          </button>
        </form>
      </div>

      {/* Enable/Disable 2FA Section */}
     {role === 'client' && (
       <div className="section">
        <h2>הפעלת אימות דו-שלבי (2FA)</h2>
        {is2faSent && !is2faVerified ? (
          <form onSubmit={handleVerify2fa}>
            <div className="input-group">
              <input
                type="text"
                placeholder="הזן קוד אימות 2FA"
                value={twofaCode}
                onChange={(e) => setTwofaCode(e.target.value)}
                required
              />
            </div>
            <button type="submit" className="btn">
              אמת קוד
            </button>
          </form>
        ) : !is2faEnabled && (
          <>
            <p>הפעל אימות דו-שלבי (2FA) באמצעות אימייל כדי לאבטח את חשבונך.</p>
            <button className="btn" onClick={handleEnable2fa}>
              הפעל 2FA
            </button>
          </>
        )}
        {is2faEnabled && (
          <>
            <p>הפעלת אימות דו-שלבי הושלמה בהצלחה!</p>
            <button className="btn" onClick={handleDisable2fa}>
              בטל 2FA
            </button>
          </>
        )}
        {is2faVerified && <p>הזדהות דו-שלבית הושלמה בהצלחה!</p>}
      </div>
    )}
    </div>
  );
};

export default SecuritySettings;
