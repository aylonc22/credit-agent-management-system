import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../api/axios';
import './index.css';

const GeneralSettings = () => {
  const [logo, setLogo] = useState(null);
  const [backgroundImage, setBackgroundImage] = useState(null);
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [termsOfUse, setTermsOfUse] = useState('');
  const [existingLogo, setExistingLogo] = useState(null);  // State to hold the current logo
  const [existingBackgroundImage, setExistingBackgroundImage] = useState(null);  // State to hold the current background image

  // Fetch existing settings on page load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings/general'); // Adjust API endpoint as needed
        const { logo, backgroundImage, welcomeMessage, termsOfUse } = response.data;
        console.log(logo);
        setExistingLogo(logo);  // Set existing logo URL
        setExistingBackgroundImage(backgroundImage);  // Set existing background image URL
        setWelcomeMessage(welcomeMessage || '');  // Set welcome message
        setTermsOfUse(termsOfUse || '');  // Set terms of use
      } catch (error) {
        toast.error('שגיאה בהבאת הגדרות');
      }
    };

    fetchSettings();
  }, []);

  const handleSaveSettings = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    if (logo) formData.append('logo', logo);
    if (backgroundImage) formData.append('backgroundImage', backgroundImage);
    formData.append('welcomeMessage', welcomeMessage);
    formData.append('termsOfUse', termsOfUse);

    try {
      const response = await api.put('/settings/general', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('הגדרות כלליות נשמרו בהצלחה');
    } catch (error) {
      toast.error('שגיאה בשמירת ההגדרות');
    }
  };

  return (
    <div className="settings-container">
      {/* Logo and Background Image Section */}
      <div className="settings-section">
        <h3 className="settings-section__header">לוגו ותמונת רקע</h3>
        <div className="file-input-container">
          <label className="file-input-label">בחר לוגו (לוגו JPG או PNG):</label>
          <input
            type="file"
            onChange={(e) => setLogo(e.target.files[0])}
            className="file-input"
            accept="image/*"
            placeholder="בחר לוגו"
          />
          {existingLogo && (
            <div className="existing-image">
              <p>לוגו נוכחי:</p>
              <img src={existingLogo} alt="Current Logo" style={{ width: '100px', height: 'auto' }} />
            </div>
          )}
        </div>
        <div className="file-input-container">
          <label className="file-input-label">בחר תמונת רקע (תמונה JPG או PNG):</label>
          <input
            type="file"
            onChange={(e) => setBackgroundImage(e.target.files[0])}
            className="file-input"
            accept="image/*"
            placeholder="בחר תמונת רקע"
          />
          {existingBackgroundImage && (
            <div className="existing-image">
              <p>תמונת רקע נוכחית:</p>
              <img src={existingBackgroundImage} alt="Current Background" style={{ width: '100px', height: 'auto' }} />
            </div>
          )}
        </div>
      </div>

      {/* Welcome Message Section */}
      <div className="settings-section">
        <h3 className="settings-section__header">הודעות ברוכים הבאים לשחקנים</h3>
        <textarea
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
          className="textarea-input"
          placeholder="הזן הודעת ברוך הבא"
        />
      </div>

      {/* Terms of Use Section */}
      <div className="settings-section">
        <h3 className="settings-section__header">מדיניות שימוש</h3>
        <textarea
          value={termsOfUse}
          onChange={(e) => setTermsOfUse(e.target.value)}
          className="textarea-input"
          placeholder="הזן את מדיניות השימוש"
        />
      </div>

      <button onClick={handleSaveSettings} className="settings-section__btn">
        שמור הגדרות
      </button>
    </div>
  );
};

export default GeneralSettings;
