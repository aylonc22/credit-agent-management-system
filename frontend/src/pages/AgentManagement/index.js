// src/pages/AgentManagement.js
import React, { useState, useEffect } from 'react';
import './index.css'; // Make sure to rename or use this for styling
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios'; 
import {toast} from 'react-toastify';


const AgentManagement = () => {
  const userData = useAuth('admin');

  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  // Form state
  const [newAgent, setNewAgent] = useState({
    name: '',
    phone: '',
    email: '',
    credit: '',
    username: '',
    password: ''
  });

  useEffect(() => {
    if (userData) {
      fetchAgents();
    }
  }, [userData]);

  const fetchAgents = async () => {
    try {
      const res = await api.get('/api/agents');
      setAgents(res.data);
    } catch (err) {
      console.error('שגיאה בקבלת הסוכנים:', err);
      toast.error('שגיאה בטעינת הסוכנים');
    }
  };

  const handleInputChange = (e) => {
    setNewAgent({ ...newAgent, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
  
    if (!newAgent.name || !newAgent.phone || !newAgent.username || !newAgent.password) {
      toast.warn('נא למלא את כל השדות החיוניים');
      return;
    }
  
    try {
      await api.post('/agents', newAgent);
      toast.success('הסוכן נוסף בהצלחה 🎉');
      fetchAgents(); // Refresh list
      setNewAgent({
        name: '',
        phone: '',
        email: '',
        credit: '',
        username: '',
        password: ''
      });
    } catch (err) {
      console.error('שגיאה ביצירת סוכן:', err);
      toast.error('אירעה שגיאה בעת יצירת הסוכן');
    }
  };

  if (!userData) {
    return <div>טוען...</div>;
  }

  return (
    <div className="dashboard">
      <h1>ניהול סוכנים</h1>

      {/* 🔍 Advanced Search */}
      <div className="agent-search">
        <input
          type="text"
          placeholder="חיפוש לפי שם או מספר סוכן..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">כל הסטטוסים</option>
          <option value="active">פעיל</option>
          <option value="inactive">לא פעיל</option>
        </select>
      </div>

      {/* 📋 Agent Table */}
      <table className="agent-table">
        <thead>
          <tr>
            <th>מספר סוכן</th>
            <th>שם סוכן</th>
            <th>מספר לקוח</th>
            <th>קרדיט זמין</th>
            <th>סטטוס</th>
            <th>פעולות</th>
          </tr>
        </thead>
        <tbody>
          {agents
            .filter(agent =>
              (agent.name.includes(search) || agent.agentId.includes(search)) &&
              (!statusFilter || agent.status === statusFilter)
            )
            .map(agent => (
              <tr key={agent._id}>
                <td>{agent.agentId}</td>
                <td>{agent.name}</td>
                <td>{agent.clientId}</td>
                <td>{agent.credit}</td>
                <td>{agent.status === 'active' ? 'פעיל' : 'לא פעיל'}</td>
                <td>
                  <button>✏️ ערוך</button>
                  <button>➕ קרדיט</button>
                  <button>🚫 חסום</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>

      {/* ➕ Add Agent Form */}
      <div className="add-agent-form">
        <h2>הוסף סוכן חדש</h2>
        <form onSubmit={handleFormSubmit}>
          <input name="name" type="text" placeholder="שם סוכן" value={newAgent.name} onChange={handleInputChange} />
          <input name="phone" type="tel" placeholder="מספר טלפון" value={newAgent.phone} onChange={handleInputChange} />
          <input name="email" type="email" placeholder="כתובת אימייל" value={newAgent.email} onChange={handleInputChange} />
          <input name="credit" type="number" placeholder="כמות קרדיט ראשונית" value={newAgent.credit} onChange={handleInputChange} />
          <input name="username" type="text" placeholder="שם משתמש" value={newAgent.username} onChange={handleInputChange} />
          <input name="password" type="password" placeholder="סיסמה" value={newAgent.password} onChange={handleInputChange} />
          <button type="submit">שמור</button>
        </form>
      </div>
    </div>
  );
};

export default AgentManagement;
