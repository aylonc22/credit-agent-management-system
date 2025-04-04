// src/pages/TransactionManagement.js
import React from 'react';
import './index.css';
import useAuth from '../../hooks/useAuth';

const TransactionManagement = () => {
  useAuth();
  return (
    <div>
      <h1>Transaction Management</h1>
      <p>View and manage all the transactions here.</p>
      {/* You can add a table for listing transactions */}
    </div>
  );
};

export default TransactionManagement;
