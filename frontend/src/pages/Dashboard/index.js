// src/pages/Dashboard.js
import React, { useEffect, useState } from 'react';
import './index.css';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import { data } from 'react-router-dom';

const Dashboard = () => {
  const userData = useAuth();

  const [stats, setStats] = useState({
    totalCreditsToday: 0,
    totalCreditsThisMonth: 0,
    activeTransactions: 0,
    activeAgents: 0,
    activeClients: 0,
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
    return <div>טוען...</div>; // Loading...
  }

  const { id, role } = userData;

  return (
    <div className="dashboard">
      <h1>מערכת ניהול קרדיטים וסוכנים</h1> {/* Credit and Agent Management System */}

      <div className="stats">
        <div className="stat-item">
          <h3>סה"כ קרדיטים שנרכשו היום</h3> {/* Total Credits Purchased Today */}
          <p>{stats.totalCreditsToday} $</p>
        </div>
        <div className="stat-item">
          <h3>סה"כ קרדיטים שנרכשו החודש</h3> {/* Total Credits Purchased This Month */}
          <p>{stats.totalCreditsThisMonth} $</p>
        </div>
        <div className="stat-item">
          <h3>מספר עסקאות פעילות</h3> {/* Active Transactions */}
          <p>{stats.activeTransactions}</p>
        </div>
        {role !== 'client' && <div className="stat-item">
          <h3>מספר סוכנים פעילים</h3> {/* Active Agents */}
          <p>{stats.activeAgents}</p>
        </div>}
        {role !== 'client' && <div className="stat-item">
          <h3>מספר לקוחות פעילים</h3> {/* Active Agents */}
          <p>{stats.activeClients}</p>
        </div>}
      </div>
    </div>
  );
};

export default Dashboard;
