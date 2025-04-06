import React from 'react';
import './index.css'; // Ensure styles are defined in this file
import useAuth from '../../hooks/useAuth';
import SecuritySettings from './components/SecuritySettings/'; // Import the SecuritySettings component

const SystemSettings = () => {
  const userData = useAuth(); 

  // Handle case when user is not authenticated (userData is null)
  if (!userData) {
    return <div>טוען...</div>; // Optionally show a loading state or redirect to login
  }

  const { id, role } = userData;

  return (
    <div className="system-settings-container">
      <h1>הגדרות מערכת</h1>      

      <div className="settings-section">
        <h2>הגדרת הרשאות</h2>
        <p>נהל את ההרשאות של משתמשים במערכת.</p>
      </div>

      <div className="settings-section">
        <h2>הגדרות אבטחה</h2>                      
        <SecuritySettings />
      </div>

      <div className="settings-section">
        <h2>הגדרות כלליות</h2>
        <p>הגדר את פרטי המערכת הכלליים.</p>
        <ul>
          <li>לוגו ותמונת רקע</li>
          <li>הודעות ברוכים הבאים לשחקנים</li>
          <li>מדיניות שימוש</li>
        </ul>
      </div>
    </div>
  );
};

export default SystemSettings;
