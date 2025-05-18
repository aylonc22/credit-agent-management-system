import React from 'react';
import './index.scss'; // Ensure styles are defined in this file
import useAuth from '../../hooks/useAuth';
import SecuritySettings from './components/SecuritySettings/'; // Import the SecuritySettings component
import GeneralSettings from './components/GeneralSettings';
import PermissionsSettings from './components/PermissionsSettings';
import Header from '../../components/Header';

const SystemSettings = ({isPanelOpen, panelClickHandle}) => {
  const userData = useAuth(isPanelOpen, panelClickHandle); 

  // Handle case when user is not authenticated (userData is null)
  if (!userData) {
    return <div>טוען...</div>; // Optionally show a loading state or redirect to login
  }

  const { role } = userData;
  return (
    <div className="page page--main" data-page="form">
      <Header flag={false} panelClickHandle={panelClickHandle}/>
      <div className="page__content page__content--with-header">
        <h2 class="page__title">Settings</h2>

        {(role === 'admin' || role === 'master-agent') && <div>
          <p className="welcome"> Permissions & Link Management </p>
          <PermissionsSettings role={role}/>
        </div>}

        <div>
          <p className="welcome"> Security Settings </p>                            
          <SecuritySettings />
        </div>

        {role === 'admin' && <div>
          <p className="welcome"> General Settings </p>
          <GeneralSettings/>
        </div>}
 
      </div>
    </div>
  )
};

export default SystemSettings;
