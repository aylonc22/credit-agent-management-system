import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../api/axios';
import './index.css';

const GeneralSettings = () => {
  const [welcomeMessage, setWelcomeMessage] = useState('');
  const [termsOfUse, setTermsOfUse] = useState('');

  // Fetch existing settings on page load
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        const response = await api.get('/settings/general'); // Adjust API endpoint as needed
        const { welcomeMessage, termsOfUse } = response.data;            
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
    formData.append('welcomeMessage', welcomeMessage);
    formData.append('termsOfUse', termsOfUse);

    try {
       await api.put('/settings/general', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('הגדרות כלליות נשמרו בהצלחה');
    } catch (error) {
      toast.error('שגיאה בשמירת ההגדרות');
    }
  };

  return(
    <div className="fieldset">
      {/* Welcome Message Section */}
      <div className="settings-section">                
        <h3 className="pb-20 pt-20">Welcome Message for Players</h3>
        <textarea
          value={welcomeMessage}
          onChange={(e) => setWelcomeMessage(e.target.value)}
          className="textarea-input"
          placeholder="Enter a welcome message"
        />
      </div>

      {/* Terms of Use Section */}
      <div className="settings-section">
        <h3 className="pb-20 pt-20">Terms of Use</h3>
        <textarea
          value={termsOfUse}
          onChange={(e) => setTermsOfUse(e.target.value)}
          className="textarea-input"
          placeholder="Enter the terms of use"
        />
      </div>

      <div className="form__row mt-40">
						<button onClick={handleSaveSettings} type="submit" name="submit" className="form__submit button button--main button--full" id="submit" value="Save" >
              Save
            </button>
				</div>     
    </div>
  )
};

export default GeneralSettings;
