// src/pages/ClientManagement.js
import React from 'react';
import './index.css';
import useAuth from '../../hooks/useAuth';

const ClientManagement = () => {
  useAuth();
  return (
    <div>
      <h1>Client Management</h1>
      <p>Manage your clients here.</p>
    </div>
  );
};

export default ClientManagement;
