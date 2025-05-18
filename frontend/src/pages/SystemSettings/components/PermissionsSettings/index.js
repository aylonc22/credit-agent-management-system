// src/components/SecuritySettings/PermissionsSettings.js
import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import api from '../../../../api/axios';
import './index.css';

const PermissionsSettings = ({role}) => {
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
    if(role === 'admin'){
      fetchSettings();
    }
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
      if(error.response.data && error.response.data.message){
          toast.error(error.response.data.message);
      }else{
        toast.error('שגיאה ביצירת הקישור');
      }
    }
  };
  
  return (
    <div className="fieldset">
       { role === 'admin' && (
        <div>
          {/* Password Expiry Setting */}
        <div className="form-group">
          <h3 className="pb-20 pt-20">Password Expiration (in days)</h3>
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
            placeholder="Enter number of days"
          />
        </div>

        <div className="form__row mt-40">
						<input onClick={handleSave} type="submit" name="submit" className="form__submit button button--main button--full" id="submit" value="Save" />
				</div>
        </div>
      )}

        {/* Generate Admin Link */}
        <div className="admin-link-section">
        <div className='links'>
          { role === 'admin' && (<div>
            <h3 className="pb-20 pt-20">Create New Admin User</h3>            
            <button className="button button--main" onClick={()=>handleGenerateLink('admin')}>
              Generate
            </button>
          </div>)}

          { role === 'admin' && (
            <div>
               <h3 className="pb-20 pt-20">Create New Primary Agent User</h3>   
               <button className="button button--main" onClick={()=>handleGenerateLink('master')}>
                Generate
               </button>
          </div>
          )}

          <div>
           <h3 className="pb-20 pt-20">Create New Agent User</h3>
           <button className="button button--main" onClick={()=>handleGenerateLink('agent')}>
             Generate
           </button>
          </div>
          
          { role === 'master-agent' && (
            <div>
              <h3 className="pb-20 pt-20">Create New Client User</h3>
              <button className="button button--main" onClick={()=>handleGenerateLink('client')}>
                Generate
              </button>
          </div>
          )}
        </div>

        {generatedLink && (
          <div className="generated-link">
            <label>Registration Link:</label>
            <input type="text" readOnly value={generatedLink} onClick={(e) => e.target.select()} />
          </div>
        )}
      </div>

    </div>
  )
};

export default PermissionsSettings;
