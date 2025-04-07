// src/components/SecuritySettings/PermissionsSettings.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../api/axios';
import './index.css';

const PermissionsSettings = () => {
  const [passwordExpiryDays, setPasswordExpiryDays] = useState('');
  const [generatedLink, setGeneratedLink] = useState('');

  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings/general');
        setPasswordExpiryDays(response.data.passwordExpiryDays || '');
      } catch (error) {
        toast.error('שגיאה בטעינת הגדרות האבטחה');
      }
    };

    fetchSettings();
  }, []);

  const handleSave = async () => {
    try {
      await api.put('/settings/general', { passwordExpiryDays });
      toast.success('תוקף הסיסמא עודכן בהצלחה');
    } catch (error) {
      toast.error('שגיאה בשמירת תוקף הסיסמא');
    }
  };

  const handleGenerateLink = async (role) => {
    try {         
        const  response = await api.post(`/auth/generate-link/${role}`);           
        setGeneratedLink(response.data.link);      
        // Copy the generated link to clipboard
        await navigator.clipboard.writeText(response.data.link);
        toast.success('הקישור הועתק ללוח');
    } catch (error) {
      toast.error('שגיאה ביצירת הקישור');
    }
  };
  

  return (
    <div className="settings-section">
      <h2 className="settings-section__header">הגדרת הרשאות</h2>
      <p>נהל את ההרשאות של משתמשים במערכת.</p>

      {/* Password Expiry Setting */}
      <div className="form-group">
        <label>תוקף סיסמא (בימים)</label>
        <input
          type="number"
          className="input-field"
          min={1}
          value={passwordExpiryDays}
          onChange={(e) => {
            const value = parseInt(e.target.value, 10);
            if (value >= 1 || e.target.value === '') {
              setPasswordExpiryDays(e.target.value);
            }
          }}
          placeholder="הכנס מספר ימים"
        />
      </div>

      <button className="settings-section__btn" onClick={handleSave}>
        שמור תוקף סיסמא
      </button>

      {/* Generate Admin Link */}
      <div className="admin-link-section">
        <div className='links'>
          <div>
            <h4>יצירת משתמש מנהל חדש</h4>
            <button className="settings-section__btn" onClick={()=>handleGenerateLink('admin')}>
              צור קישור למנהל חדש
            </button>
          </div>

          <div>
            <h4>יצירת משתמש סוכן חדש</h4>
              <button className="settings-section__btn" onClick={()=>handleGenerateLink('agent')}>
                צור קישור לסוכן חדש
              </button>
          </div>
        </div>

        {generatedLink && (
          <div className="generated-link">
            <label>קישור הרשמה:</label>
            <input type="text" readOnly value={generatedLink} onClick={(e) => e.target.select()} />
          </div>
        )}
      </div>
    </div>
  );
};

export default PermissionsSettings;
