import React, { useEffect, useState } from 'react';
import './index.scss';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import coin from '../../assets/images/logos/bitcoin.png';
import swap from '../../assets/images/icons/swap.svg';
import users from '../../assets/images/icons/users.svg';
import Header from '../../components/Header';

const Dashboard = () => {
  const userData = useAuth();

  const [stats, setStats] = useState({
    totalCreditsToday: 0,
    totalCreditsThisMonth: 0,
    activeTransactions: 0,
    activeAgents: 0,
    activeClients: 0,
  });

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

  if (!userData) {
    return <div>Loading...</div>;
  }

  const { role } = userData;

  const cards = [
    {
      icon: coin,
      title: "Total Credits Today",
      value: `${stats.totalCreditsToday} $`
    },
    {
      icon: coin,
      title: "Total Credits This Month",
      value: `${stats.totalCreditsThisMonth} $`
    },
    {
      icon: swap,
      title: "Active Transactions",
      value: stats.activeTransactions
    },
    ...(role !== 'client' ? [
      {
        icon:users,
        title: "Active Agents",
        value: stats.activeAgents
      },
      {
        icon: users,
        title: "Active Clients",
        value: stats.activeClients
      }
    ] : [])
  ];

  return (
<>
    <div className="body-overlay"></div>
    <div id="panel-left"></div>
    <Header flag={false}/>
    <div className="page page--main" data-page="cards">
     
	
	<div className="page__content page__content--with-header">
  <h1 className="mb-20">
        {role === 'client'
          ? "Welcome to PAY GLOW Payment System"
          : "Credit and Agent Management System"}
      </h1>				
	  
        <div className="cards cards--11 mb-20">
        {cards.map((card, index) => (
          <div key={index} className="card card--style-icon card--style-round-corners">
            <div className="card__icon card__icon--centered">
              <img src={card.icon} alt={card.title} />
            </div>
              <h4 className="card__title card__title--centered">{card.title}</h4>
              <p className="card__text card__text--centered">{card.value}</p>                       
          </div>
        ))}
        </div>
    </div>
    </div>
</>
  );
};

export default Dashboard;
