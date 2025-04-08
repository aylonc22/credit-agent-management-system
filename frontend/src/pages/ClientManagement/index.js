import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import './index.css';

const ClientManagement = () => {
  const userData = useAuth('agent');
  const [clients, setClients] = useState([]);
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState('');
  const [newClient, setNewClient] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    credits: 0,
    agentId: ''
  });

  // Use `useLocation` to get the query parameters
  const location = useLocation();

  useEffect(() => {
   const init = async ()=>{
    let agents = [];
    if (userData) {  
      if (userData.role !== 'agent') {
       agents = await fetchAgents();
      } 
      if(userData.role !=='admin')
      {
        // For non-admin, set agentId automatically
        setNewClient((prev) => ({ ...prev, agentId: userData.agentId }));
        console.log(userData);
      }
      fetchClients(agents);
    }

    // Check if the URL contains the query parameter for agent_name
    const urlParams = new URLSearchParams(location.search);
    const agentId = urlParams.get('agent_id');

    // If there's an agent name in the query, filter the agent
    if (agentId) {
      setAgentFilter(agentId);
    }
   }

   init();
  }, [userData, location]);

  if (!userData) {
    return <div>טוען...</div>; // Optionally show a loading state or redirect to login
  }

  const fetchClients = async (agents) => {
    try {     
      const res = await api.get(`/api/client${userData.role==='master-agent'?`?agents=${encodeURIComponent(JSON.stringify(agents.map(a=>a._id)))}`:'' }`);
      setClients(res.data.clients);     
    } catch (err) {
      console.error('שגיאה בטעינת לקוחות:', err);
      toast.error('שגיאה בטעינת לקוחות');
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await api.get(`/api/agent${userData.role === 'master-agent' ?'?pushSelf=true':'' }`);
      setAgents(res.data.agents);
     return res.data.agents;
    } catch (err) {
      console.error('שגיאה בקבלת סוכנים:', err);
    }
  };

  const handleBlockClient = async (clientId) => {
    if (window.confirm('האם אתה בטוח שברצונך לחסום את הלקוח?')) {
      try {
        await api.put(`/api/client/${clientId}/block`);
        toast.success('הלקוח נחסם בהצלחה 🚫');
        fetchClients();
      } catch (err) {
        console.error('שגיאה בחסימת לקוח:', err);
        toast.error('אירעה שגיאה בעת חסימת הלקוח');
      }
    }
  };

  const handleUnblockClient = async (clientId) => {
    if (window.confirm('האם אתה בטוח שברצונך לשחרר את הלקוח?')) {
      try {
        await api.put(`/api/client/${clientId}/unblock`);
        toast.success('הלקוח שוחרר בהצלחה ✔️');
        fetchClients();
      } catch (err) {
        console.error('שגיאה בשחרור לקוח:', err);
        toast.error('אירעה שגיאה בעת שחרור הלקוח');
      }
    }
  };

  const handleInputChange = (e) => {
    setNewClient({ ...newClient, [e.target.name]: e.target.value });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();

    const requiredFields = ['name', 'username', 'password', 'email'];
    if (userData.role === 'admin') {
      requiredFields.push('agentId');
    }

    const hasEmpty = requiredFields.some((field) => !newClient[field]);
    if (hasEmpty) {
      toast.warn('נא למלא את כל השדות');
      return;
    }

    try {
      await api.post('/api/client', newClient);
      toast.success('לקוח נוסף בהצלחה 🎉');
      fetchClients();
      setNewClient({
        name: '',
        email: '',
        username: '',
        password: '',
        credits: 0,
        agentId: userData.role === 'admin' ? '' : userData.agentId
      });
    } catch (err) {
      console.error('שגיאה ביצירת לקוח:', err);
      toast.error('אירעה שגיאה בעת יצירת הלקוח');
    }
  };

  const filteredClients = clients.filter((client) => {
    const agent = agents.find((a) => a._id === client.agentId);
    const fullSearch = `${client.name} ${agent?.name || ''}`;
    const matchesSearch = fullSearch.includes(search.trim());

    const matchesStatus = !statusFilter || client.status === statusFilter;
    const matchesAgent =
      (userData.role !== 'admin' && userData.role !== 'master-agent') || !agentFilter || client.agentId === agentFilter;

    return matchesSearch && matchesStatus && matchesAgent;
  });

  return (
    <div className="dashboard">
      <h1>ניהול לקוחות</h1>

      {/* Filters */}
      <div className="agent-search">
        <input
          type="text"
          placeholder="חיפוש לפי שם או סוכן..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">כל הסטטוסים</option>
          <option value="active">פעיל</option>
          <option value="inactive">לא פעיל</option>
        </select>

        { (userData.role === 'admin'  || userData.role === 'master-agent')&& (
          <select value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)}>
            <option value="">כל הסוכנים</option>
            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name}
              </option>
            ))}
          </select>
        )}
      </div>

      {/* Client Table */}
      <div className="agent-table-container">
        <table className="agent-table-head">
          <thead>
            <tr>
              <th>מספר</th>
              <th>שם לקוח</th>
              <th>מייל</th>
              {userData.role !== 'agent' && <th>סוכן</th>}
              <th>קרדיטים</th>
              <th>נוצר בתאריך</th>
              <th>סטטוס</th>
              <th>פעולות</th>
            </tr>
          </thead>
        </table>

        <div className="agent-table-body-wrapper">
          <table className="agent-table-body">
          <tbody>
              {filteredClients.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'right', padding: '1rem' }}>
                    לא נמצאו לקוחות
                  </td>
                </tr>
              ) : (
                filteredClients.map((client, index) => {
                  const agent = agents.find((a) => a._id === client.agentId);
                  return (
                    <tr key={client._id}>
                      <td>{index + 1}</td>
                      <td>{client.name}</td>
                      <td>{client.userId?.email || '-'}</td>
                      {userData.role !== 'agent' && <td>{agent?.name || '-'}</td>}
                      <td>{client.credits ?? 0}</td>
                      <td>{new Date(client.createdAt).toLocaleDateString('he-IL')}</td>
                      <td>{client.status === 'active' ? 'פעיל' : 'לא פעיל'}</td>
                      <td>
                        {client.status === 'inactive' ? (
                          <button onClick={() => handleUnblockClient(client._id)}>✔️ שחרר</button>
                        ) : (
                          <button onClick={() => handleBlockClient(client._id)}>🚫 חסום</button>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* ➕ Add Client Form */}
      {userData.role !== 'agent' && (
        <div className="add-agent-form">
          <h2>הוסף לקוח חדש</h2>
          <form onSubmit={handleFormSubmit}>
            <input name="name" type="text" placeholder="שם הלקוח" value={newClient.name} onChange={handleInputChange} />
            <input name="email" type="email" placeholder="כתובת אימייל" value={newClient.email} onChange={handleInputChange} />
            <input name="username" type="text" placeholder="שם משתמש" value={newClient.username} onChange={handleInputChange} />
            <input name="password" type="password" placeholder="סיסמה" value={newClient.password} onChange={handleInputChange} />
            <input name="credits" min={0} type="number" placeholder="כמות קרדיטים" value={newClient.credits} onChange={handleInputChange} />
            {userData.role === 'admin' && (
              <select name="agentId" value={newClient.agentId} onChange={handleInputChange}>
                <option value="">בחר סוכן</option>
                {agents.map((agent) => (
                  <option key={agent._id} value={agent._id}>
                    {agent.name}
                  </option>
                ))}
              </select>
            )}

            <button type="submit">שמור</button>
          </form>
        </div>
      )}
    </div>
  );
};

export default ClientManagement;
