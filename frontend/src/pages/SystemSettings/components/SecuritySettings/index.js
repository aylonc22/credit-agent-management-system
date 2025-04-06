import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify'; // Import toast from react-toastify
import api from '../../../../api/axios';
import './index.css';
import useAuth from '../../../../hooks/useAuth';

const SecuritySettings = () => {  
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [is2faEnabled, setIs2faEnabled] = useState(false);
  const [is2faSent, setIs2faSent] = useState(false);
  const userData = useAuth(); 

  // Handle case when user is not authenticated (userData is null)
  if (!userData) {
    return <div>טוען...</div>; // Optionally show a loading state or redirect to login
  }

  const { id, role } = userData;

  // Handle change password submission
  const handleChangePassword = async (e) => {
    e.preventDefault();

    if (newPassword !== confirmPassword) {
      toast.error('הסיסמאות החדשות אינן תואמות'); // Show error toast
      return;
    }

    try {
      const response = await api.put('/auth/change-password', {
        currentPassword,
        newPassword,
        id
      });
      toast.success('הסיסמה שונתה בהצלחה'); // Show success toast
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error) {
        if (error.response && error.response.data.message) {
            toast.error(error.response.data.message); // Show the error message from the server
          } else {
            toast.error('שגיאה בשינוי הסיסמה');
          }
    }
  };

  // Handle enable 2FA
  const handleEnable2fa = async () => {
    try {
      const response = await api.post('/auth/enable-2fa', { userId: id });
      if (response.status === 200) {
        setIs2faEnabled(true);
        setIs2faSent(true);
        toast.success('אימייל עם קוד 2FA נשלח'); // Show success toast
      }
    } catch (error) {
      toast.error('שגיאה בהפעלה של 2FA'); // Show error toast
    }
  };

  return (
    <div className="settings-container">
      {/* Change Password Section */}
      <div className="section">
        <h2>שינוי סיסמה</h2>
        <form onSubmit={handleChangePassword}>
          <div className="input-group">
            <input className='settings-password'
              type="password"
              placeholder="סיסמה נוכחית"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input className='settings-password'
              type="password"
              placeholder="סיסמה חדשה"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              required
            />
          </div>
          <div className="input-group">
            <input className='settings-password'
              type="password"
              placeholder="אשר סיסמה חדשה"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>
          <button type="submit" className="btn">שנה סיסמה</button>
        </form>
      </div>
      {/** 
       * TODO make it work (email service)
       */}
      {/* Enable 2FA Section */}
      <div className="section">
        <h2>הפעלת אימות דו-שלבי (2FA)</h2>
        {is2faSent ? (
          <p>אימייל עם קוד 2FA נשלח אליך. אנא עקוב אחרי ההוראות.</p>
        ) : (
          <>
            <p>הפעל אימות דו-שלבי (2FA) באמצעות אימייל כדי לאבטח את חשבונך.</p>
            <button className="btn" onClick={handleEnable2fa}>הפעל 2FA</button>
          </>
        )}
        {is2faEnabled && <p>הפעלת אימות דו-שלבי הושלמה בהצלחה!</p>}
      </div>
    </div>
  );
};

export default SecuritySettings;
