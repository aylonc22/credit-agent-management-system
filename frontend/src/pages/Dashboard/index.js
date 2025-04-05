// src/pages/Dashboard.js
import React from 'react';
import './index.css';
import useAuth from '../../hooks/useAuth';

const Dashboard = () => {
  const userData = useAuth('agent'); 

  // Handle case when user is not authenticated (userData is null)
  if (!userData) {
    return <div>Loading...</div>; // Optionally show a loading state or redirect to login
  }

  const { id, role } = userData;
  return (
    <div>
      <h1>Dashboard</h1>
      <p>Welcome to the Credit and Agent Management System</p>
    </div>
  );
};

export default Dashboard;
