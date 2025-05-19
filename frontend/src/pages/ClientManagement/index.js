import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import './index.css';
import Header from '../../components/Header';

const ClientManagement = ({ isPanelOpen, panelClickHandle }) => {
  const userData = useAuth(isPanelOpen, panelClickHandle, 'agent');
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
  const navigate = useNavigate();

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
        fetchClients(agents);
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
        fetchClients(agents);
      } catch (err) {
        console.error('שגיאה בשחרור לקוח:', err);
        toast.error('אירעה שגיאה בעת שחרור הלקוח');
      }
    }
  };

  const goToReports = (clientId) => {
    navigate(`/reports?client_id=${clientId}`);
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
      fetchClients(agents);
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
    <>
    <div className={`body-overlay ${isPanelOpen?'active':""}`} style={isPanelOpen? { display: 'block' } : {}}></div>
    <div id="panel-left"></div>
    <div className="page page--main">
      <Header flag={false} panelClickHandle={panelClickHandle}/>
    <div className="page__content page__content--with-header">
    <h2 class="page__title">Clients Management</h2>      

      {/* Filters */}
      <div className="agent-search">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
        <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">InActive</option>
        </select>

        { (userData.role === 'admin'  || userData.role === 'master-agent')&& (
          <select value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)}>
            <option value="">All Agents</option>
            {agents.map((agent) => (
              <option key={agent._id} value={agent._id}>
                {agent.name}
              </option>
            ))}
          </select>
        )}
        <input
          type="text"
          placeholder="Search by name or id..."
          className='input-field-d'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Client Table */}
      <div className="table table--6cols mb-20">
      <div className="table__inner">
      <div class="table__row">
            <div class="table__section table__section--header">Number</div>
            <div class="table__section table__section--header">Client Name</div>
            <div class="table__section table__section--header">Client Email</div>
            {userData.role !== 'agent' && <div class="table__section table__section--header">Agent</div>}
            <div class="table__section table__section--header">Credits</div>
            <div class="table__section table__section--header">Created At</div>
            <div class="table__section table__section--header">Status</div>	
            <div class="table__section table__section--header">Actions</div>            						
          </div>
                        
                   
              {filteredClients.length === 0 ? (
                <div className="empty-table-message">No agents to display</div> // Display this if no agents match the filters
              ) : (
                filteredClients.map((client, index) => {
                  const agent = agents.find((a) => a._id === client.agentId);
                  return (
                    <div class="table__row">
                      <div class="table__section">{index + 1}</div>
                      <div class="table__section">{client.name}</div>
                      <div class="table__section">{client.userId?.email || '-'}</div>
                      {userData.role !== 'agent' && <div class="table__section">{agent?.name || '-'}</div>}                     
                      <div class="table__section">{client.credit ?? 0}</div>
                      <div class="table__section">{new Date(client.createdAt).toLocaleDateString('he-IL')}</div>
                      <div class="table__section">{client.status === 'active' ? 'active' : 'inactive'}</div>
                      <div class="table__section">
                      {client.status === 'inactive' ? (
                          <a class="button button--main button--ex-small" onClick={() => handleUnblockClient(client._id)}>Unblock</a>
                        ) : (
                          <a class="button button--main button--ex-small" onClick={() => handleBlockClient(client._id)}>Block</a>
                        )}
                      <a  onClick={() => goToReports(client._id)} class="button button--main button--ex-small">Reports</a>
                      </div>                     
                    </div>
                  );
                })
              )}                    
      </div>
      </div>

      {/* ➕ Add Client Form */}
      {userData.role !== 'agent' && (
        <div className="fieldset">
          <div className="form">
            <p className="welcome">
                Add new client
            </p>	          
          <form onSubmit={handleFormSubmit}>
              <div className="form__row">
                <input className="form__input required" name="name" type="text" placeholder="full name" value={newClient.name} onChange={handleInputChange} />
              </div>
              <div className="form__row">
                <input className="form__input required" name="email" type="email" placeholder="Email" value={newClient.email} onChange={handleInputChange} />
              </div>
              <div className="form__row">
                <input className="form__input required" name="username" type="text" placeholder="username" value={newClient.username} onChange={handleInputChange} />
              </div>
              <div className="form__row">
                <input className="form__input required"name="password" type="password" placeholder="password" value={newClient.password} onChange={handleInputChange} />
              </div>                                  
            {userData.role === 'admin' && (
               <div className="form__select">
                <select name="agentId" value={newClient.agentId} onChange={handleInputChange}>
                  <option disabled value="">Choose agent</option>
                  {agents.map((agent) => (
                    <option key={agent._id} value={agent._id}>
                      {agent.name}
                    </option>
                  ))}
                </select>
              </div>
            )}

              <div class="form__row mt-40">
                <input type="submit" name="submit" className="form__submit button button--main button--full" id="submit" value="SUBMIT" />
              </div>
          </form>
        </div>
        </div>
      )}
    </div>
    </div>
    </>
  );
};

export default ClientManagement;
