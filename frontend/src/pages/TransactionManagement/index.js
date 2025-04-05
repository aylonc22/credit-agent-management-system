// src/pages/TransactionManagement.js
import React from 'react';
import './index.css';
import useAuth from '../../hooks/useAuth';

const TransactionManagement = () => {
  const userData = useAuth('agent'); 

  // Handle case when user is not authenticated (userData is null)
  if (!userData) {
    return <div>Loading...</div>; // Optionally show a loading state or redirect to login
  }

  const { id, role } = userData;
  return (
    <div>
      <h1>Transaction Management</h1>
      <p>View and manage all the transactions here.</p>
      {/* You can add a table for listing transactions */}
    </div>
  );
};

export default TransactionManagement;
