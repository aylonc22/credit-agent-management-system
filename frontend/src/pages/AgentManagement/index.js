import React, { useState, useEffect } from 'react';
import './index.css';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios'; 
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';
import Header from '../../components/Header';

const AgentManagement = ({isPanelOpen, panelClickHandle}) => {
  const userData = useAuth(isPanelOpen, panelClickHandle, 'master-agent');
  const navigate = useNavigate();

  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [roleFilter, setRoleFilter] = useState('');

  const [newAgent, setNewAgent] = useState({
    name: '',
    email: '',
    username: '',
    password: '',
    role: 'agent'
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
        password: '',
        role: 'agent'
      });
    } catch (err) {
      console.error('שגיאה ביצירת סוכן:', err);
      toast.error('אירעה שגיאה בעת יצירת הסוכן');
    }
  };

  if (!userData) {
    return <div>טוען...</div>;
  }

  // Filtered agents based on status and role
  const filteredAgents = agents.filter((agent, index) =>
    (agent.name.includes(search) || index + 1 === +search) &&
    (!statusFilter || agent.status === statusFilter) &&
    (!roleFilter || agent.userId?.role === roleFilter)
  );

  const handleBlockAgent = async (agentId) => {
    if (window.confirm('האם אתה בטוח שברצונך לחסום את הסוכן?')) {
      try {
        await api.put(`/api/agent/${agentId}/block`);
        toast.success('הסוכן נחסם בהצלחה 🚫');
        fetchAgents();
      } catch (err) {
        console.error('שגיאה בחסימת הסוכן:', err);
        toast.error('אירעה שגיאה בעת חסימת הסוכן');
      }
    }
  };

  const handleUnblockAgent = async (agentId) => {
    if (window.confirm('האם אתה בטוח שברצונך לשחרר את הסוכן?')) {
      try {
        await api.put(`/api/agent/${agentId}/unblock`);
        toast.success('הסוכן שוחרר בהצלחה ✔️');
        fetchAgents();
      } catch (err) {
        console.error('שגיאה בשחרור הסוכן:', err);
        toast.error('אירעה שגיאה בעת שחרור הסוכן');
      }
    }
  };

  const handlePromoteToMaster = async (userId) => {
    try {
      await api.put(`/api/agent/${userId}/promote`);
      toast.success('הסוכן קודם בהצלחה לסוכן ראשי 🎉');
      fetchAgents();
    } catch (err) {
      console.error('שגיאה בקידום הסוכן:', err);
      toast.error('אירעה שגיאה בעת קידום הסוכן');
    }
  };

  const handleDemoteToAgent = async (userId) => {
    try {
      await api.put(`/api/agent/${userId}/demote`);
      toast.success('הסוכן הוחזר בהצלחה לסוכן רגיל 🎉');
      fetchAgents();
    } catch (err) {
      console.error('שגיאה בהורדת הסוכן:', err);
      toast.error('אירעה שגיאה בעת הורדת הסוכן');
    }
  };

  const goToReports = (agentId) => {   
    navigate(`/reports?agent_id=${agentId}`);
  };

  const goToClients = (agentId) => {
    navigate(`/clients?agent_id=${agentId}`); // Redirect to the clients list page
  };

  return (
    <div className="page page--main">
      <Header flag={false} panelClickHandle={panelClickHandle}/>
      <div className="page__content page__content--with-header">     
      <h2 class="page__title">Agent Management</h2>
      {/* 🔍 Advanced Search */}
      <div className="agent-search">
        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">InActive</option>
        </select>

        {/* Role filter dropdown */}
        <select value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
          <option value="">All Roles</option>
          <option value="agent">Agent</option>
          <option value="master-agent">Primary Agent</option>
        </select>
        
        <input
          type="text"
          placeholder="Search by name or id"
          className='input-field-d'
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* 📋 Agent Table */}
      <div className="table table--6cols mb-20">                 
        <div className="table__inner">
          <div class="table__row">
            <div class="table__section table__section--header">Agent Number</div>
            <div class="table__section table__section--header">Agent Name</div>
            <div class="table__section table__section--header">Agent Email</div>
            <div class="table__section table__section--header">Status</div>	
            <div class="table__section table__section--header">Role</div>
            <div class="table__section table__section--header">Actions</div>            						
          </div>
          {filteredAgents.length === 0 ? (
            <div className="empty-table-message">אין סוכנים לתצוגה</div> // Display this if no agents match the filters
          ) : (
              <>
                {filteredAgents.map((agent, index) => (
                  
                  <>

                  <div class="table__row">
                    <div class="table__section">{index + 1}</div>
                    <div class="table__section">{agent.name}</div>
                    <div class="table__section">{agent.userId?.email || '-'}</div> 
                    <div class="table__section">{agent.status === 'active' ? 'active' : 'inactive'}</div>
                    <div class="table__section">{agent.userId?.role === 'master-agent' ? 'primary agent' : 'agent'}</div>                    
                    <div class="table__section">
                    {agent.userId?.role !== 'master-agent' ? (
                      <a  onClick={() => handlePromoteToMaster(agent.userId._id)} class="button button--main button--ex-small">Promote</a>                               
                        ) : (
                          <a  onClick={() => handleDemoteToAgent(agent.userId._id)} class="button button--main button--ex-small">Demote</a>                           
                        )}
                    {agent.status === 'inactive' ? (
                       <a  onClick={() => handleUnblockAgent(agent._id)} class="button button--main button--ex-small">Unblock</a>                         
                        ) : (
                          <a  onClick={() => handleBlockAgent(agent._id)} class="button button--main button--ex-small">Block</a>                         
                        )}
                      <a  onClick={() => goToReports(agent._id)} class="button button--main button--ex-small">Reports</a>
                      <a  onClick={() => goToClients(agent._id)} class="button button--main button--ex-small">Clients</a>
                    </div>                    
                  </div>
                    
                    {/* <td className='mobile-hide'>{index + 1}</td>
                    <td>{agent.name}</td>
                    <td className='mobile-hide'>{agent.userId?.email || '-'}</td>
                    <td className='mobile-hide'>{agent.status === 'active' ? 'פעיל' : 'לא פעיל'}</td>
                    <td>{agent.userId?.role === 'master-agent' ? 'סוכן ראשי' : 'סוכן'}</td>
                    <td>
                      <div className="actions-container">
                        {agent.userId?.role !== 'master-agent' ? (
                          <button className="promote" onClick={() => handlePromoteToMaster(agent.userId._id)}>
                            <span>🔼</span> קדם
                          </button>
                        ) : (
                          <button className="demote" onClick={() => handleDemoteToAgent(agent.userId._id)}>
                            <span>🔽</span> החזר
                          </button>
                        )}

                        {agent.status === 'inactive' ? (
                          <button className="unblock" onClick={() => handleUnblockAgent(agent._id)}>
                            <span>✔️</span> שחרר
                          </button>
                        ) : (
                          <button className="block" onClick={() => handleBlockAgent(agent._id)}>
                            <span>🚫</span> חסום
                          </button>
                        )}

                        <button className="reports" onClick={() => goToReports(agent._id)}>
                          <span>🔍</span> דוחות
                        </button>

                        <button className="clients" onClick={() => goToClients(agent._id)}>
                          <span>🔍</span> לקוחות
                        </button>
                      </div>
                    </td> */}
                  </>
                ))}              
            </>
          )}
        </div>
      </div>
{/**
 * 
 * <div class="fieldset">
			<div class="form">
				<form id="Form" method="post" action="checkout.html">
					<div class="form__row">
						<input type="text" name="Text" value="" class="form__input required" placeholder="Text" />
					</div>
					<div class="form__row d-flex align-items-center justify-space">
						<input type="text" name="Text" value="" class="form__input form__input--12" placeholder="Text 1/2" />
						<input type="text" name="Text" value="" class="form__input form__input--12" placeholder="Text 1/2" />
					</div>
					<div class="form__row d-flex align-items-center justify-space">
						<input type="text" name="Text" value="" class="form__input form__input--23" placeholder="Text 2/3" />
						<input type="text" name="Text" value="" class="form__input form__input--13" placeholder="Text 1/3" />
					</div>
 */}
      {/* ➕ Add Agent Form */}
      {userData.role === 'admin' && (
        <div className="fieldset">
          <div className="form">
            <p class="welcome">
                Add new agent
            </p>	
          
            <form onSubmit={handleFormSubmit}>
              <div class="form__row">
                <input class="form__input required" name="name" type="text" placeholder="full name" value={newAgent.name} onChange={handleInputChange} />
              </div>
              <div class="form__row">
                <input class="form__input required"  name="email" type="email" placeholder="email" value={newAgent.email} onChange={handleInputChange} />
              </div>
              <div class="form__row">
                <input class="form__input required" name="username" type="text" placeholder="username" value={newAgent.username} onChange={handleInputChange}/>
              </div>
              <div class="form__row">
                <input class="form__input required" name="password" type="password" placeholder="password" value={newAgent.password} onChange={handleInputChange} />
              </div>                    
              {/* Role selection */}
              <div class="form__select">
							<select name="role" value={newAgent.role} onChange={handleInputChange}>								
                <option value="agent">agent</option>
                <option value="master-agent">primary agent</option>
							</select>
						</div>                    
              <div class="form__row mt-40">
                <input type="submit" name="submit" class="form__submit button button--main button--full" id="submit" value="SUBMIT" />
              </div>
            </form>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};

export default AgentManagement;
