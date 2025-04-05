// src/pages/SystemSettings.js
import React from 'react';
import './index.css';
import useAuth from '../../hooks/useAuth';
const SystemSettings = () => {
 const userData = useAuth(); 

  // Handle case when user is not authenticated (userData is null)
  if (!userData) {
    return <div>Loading...</div>; // Optionally show a loading state or redirect to login
  }

  const { id, role } = userData;
  return (
    <div>
      <h1>System Settings</h1>
      <p>Manage system configurations and user access settings.</p>

      <h2>User Management</h2>
      <p>Manage admin users and permissions.</p>

      <h2>Security Settings</h2>
      <p>Configure password policies, two-factor authentication, etc.</p>

      <h2>General Settings</h2>
      <p>Set system branding, like logo, welcome messages, and terms of use.</p>
    </div>
  );
};

export default SystemSettings;
