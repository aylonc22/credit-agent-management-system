// src/pages/Dashboard.js
import React from 'react';
import './index.css';
import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
  useAuth();
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the Credit and Agent Management System</p>
    </div>
  );
};

export default Dashboard;
