// src/pages/ClientManagement.js
import React from 'react';
import './index.css';
import useAuth from '../../hooks/useAuth';

const ClientManagement = () => {
 const userData = useAuth('admin'); 

  // Handle case when user is not authenticated (userData is null)
  if (!userData) {
    return <div>Loading...</div>; // Optionally show a loading state or redirect to login
  }

  const { id, role } = userData;
  return (
    <div>
      <h1>Client Management</h1>
      <p>Manage your clients here.</p>
    </div>
  );
};

export default ClientManagement;
