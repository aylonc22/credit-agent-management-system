// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import './index.css';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';

const Dashboard = () => {
  const userData = useAuth('agent'); 

  const [stats, setStats] = useState({
    totalCreditsToday: 0,
    totalCreditsThisMonth: 0,
    activeTransactions: 0,
    activeAgents: 0,
  });

  // Fetch statistics data from the API
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/stats');
        setStats(response.data);
      } catch (error) {
        console.error('Error fetching statistics', error);
      }
    };

    fetchStats();
  }, []);

  // Handle case when user is not authenticated (userData is null)
  if (!userData) {
    return <div>Loading...</div>; // Optionally show a loading state or redirect to login
  }

  const { id, role } = userData;

  return (
    <div className="dashboard">
      <h1>Credit and Agent Management System</h1>
      
      <div className="stats">
        <div className="stat-item">
          <h3>Total Credits Purchased Today</h3>
          <p>{stats.totalCreditsToday} ₪</p>
        </div>
        <div className="stat-item">
          <h3>Total Credits Purchased This Month</h3>
          <p>{stats.totalCreditsThisMonth} ₪</p>
        </div>
        <div className="stat-item">
          <h3>Active Transactions</h3>
          <p>{stats.activeTransactions}</p>
        </div>
        <div className="stat-item">
          <h3>Active Agents</h3>
          <p>{stats.activeAgents}</p>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;