// src/pages/AgentManagement.js
import React from 'react';
import './index.css';
import useAuth from '../../hooks/useAuth';

const AgentManagement = () => {
  useAuth();
  return (
    <div>
      <h1>Agent Management</h1>
      <p>Manage your agents here.</p>
    </div>
  );
};

export default AgentManagement;
