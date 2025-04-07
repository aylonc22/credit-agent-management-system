import React, { useState, useEffect } from 'react';
import './index.css';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios'; 
import { toast } from 'react-toastify';

const AgentManagement = () => {
  const userData = useAuth('admin');

  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');

  const [newAgent, setNewAgent] = useState({
    name: '',
    email: '',
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
      const res = await api.get('/api/agent');
      setAgents(res.data.agents);
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

    if (!newAgent.name || !newAgent.username || !newAgent.password || !newAgent.email) {
      toast.warn('נא למלא את כל השדות החיוניים');
      return;
    }

    try {
      await api.post('/api/agent', newAgent);
      toast.success('סוכן נוסף בהצלחה 🎉');
      fetchAgents();
      setNewAgent({
        name: '',
        email: '',
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

  // Filtered agents
  const filteredAgents = agents.filter((agent, index) =>
    (agent.name.includes(search) || index + 1 === +search) &&
    (!statusFilter || agent.status === statusFilter)
  );

  const handleBlockAgent = async (agentId) => {
    if (window.confirm('האם אתה בטוח שברצונך לחסום את הסוכן?')) {
      try {
        // Make API call to update the agent's status
        await api.put(`/api/agent/${agentId}/block`);
        toast.success('הסוכן חסום בהצלחה 🚫');
        fetchAgents(); // Refresh agent list
      } catch (err) {
        console.error('שגיאה בחסימת הסוכן:', err);
        toast.error('אירעה שגיאה בעת חסימת הסוכן');
      }
    }
  };

  const handleUnblockAgent = async (agentId) => {
    if (window.confirm('האם אתה בטוח שברצונך לשחרר את הסוכן?')) {
      try {
        // Make API call to update the agent's status to "active"
        await api.put(`/api/agent/${agentId}/unblock`);
        toast.success('הסוכן שוחרר בהצלחה ✔️');
        fetchAgents(); // Refresh agent list
      } catch (err) {
        console.error('שגיאה בשחרור הסוכן:', err);
        toast.error('אירעה שגיאה בעת שחרור הסוכן');
      }
    }
  };

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
      <div className="agent-table-container">
        <table className="agent-table-head">
          <thead>
            <tr>
              <th>מספר סוכן</th>
              <th>שם סוכן</th>
              <th>מייל סוכן</th>
              <th>סטטוס</th>
              <th>פעולות</th>
            </tr>
          </thead>
        </table>

        <div className="agent-table-body-wrapper">
          <table className="agent-table-body">
            <tbody>
              {filteredAgents.map((agent, index) => (
                <tr key={agent._id}>
                  <td>{index + 1}</td>
                  <td>{agent.name}</td>
                  <td>{agent.userId?.email || '-'}</td>
                  <td>{agent.status === 'active' ? 'פעיל' : 'לא פעיל'}</td>
                  <td>
                    <button>✏️ ערוך</button>
                    <button>➕ קרדיט</button>
                    {agent.status === 'inactive' ? (
                    <button onClick={() => handleUnblockAgent(agent._id)}>✔️ שחרר</button>
                  ) : (
                    <button onClick={() => handleBlockAgent(agent._id)}>🚫 חסום</button>
                  )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ➕ Add Agent Form */}
      <div className="add-agent-form">
        <h2>הוסף סוכן חדש</h2>
        <form onSubmit={handleFormSubmit}>
          <input name="name" type="text" placeholder="שם סוכן" value={newAgent.name} onChange={handleInputChange} />
          <input name="email" type="email" placeholder="כתובת אימייל" value={newAgent.email} onChange={handleInputChange} />
          <input name="username" type="text" placeholder="שם משתמש" value={newAgent.username} onChange={handleInputChange} />
          <input name="password" type="password" placeholder="סיסמה" value={newAgent.password} onChange={handleInputChange} />
          <button type="submit">שמור</button>
        </form>
      </div>
    </div>
  );
};

export default AgentManagement;
