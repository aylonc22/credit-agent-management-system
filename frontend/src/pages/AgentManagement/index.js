// src/pages/AgentManagement.js
import React from 'react';
import './index.css';
import useAuth from '../../hooks/useAuth';

const AgentManagement = () => { 
  const userData = useAuth('admin'); 

  // Handle case when user is not authenticated (userData is null)
  if (!userData) {
    return <div>Loading...</div>; // Optionally show a loading state or redirect to login
  }

  const { id } = userData;
  return (
    <div>
      <h1>Agent Management</h1>
      <p>Manage your agents here.</p>
    </div>
  );
};

export default AgentManagement;
