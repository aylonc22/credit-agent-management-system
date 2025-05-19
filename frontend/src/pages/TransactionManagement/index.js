import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import './index.css';
import Header from '../../components/Header';

const TransactionManagement = ({isPanelOpen, panelClickHandle}) => {
  const userData = useAuth(isPanelOpen, panelClickHandle, 'agent');  // Use the hook to get user data for 'admin' role
  const [transactions, setTransactions] = useState([]);
  const [clients, setClients] = useState([]);
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState(''); // Added state for agent filter

  useEffect(() => {
   const init = async () =>{
    if (!userData) {
      return;
    }
    let agents = [];
    let clients = [];
    // Fetch agents and clients only if the user is an admin
    if (userData.role !== 'agent') {
       agents = await fetchAgents();
    }
    clients = await fetchClients(agents);
    fetchTransactions(clients);
   }
   init();
  }, [userData]);

  if (!userData) {
    return <div>טוען...</div>;  // Optionally show a loading state or redirect to login
  }

  const fetchTransactions = async (clients) => {
    try {
      const res = await api.get(`/api/transaction${userData.role === 'master-agent' ? `?clients=${encodeURIComponent(JSON.stringify(clients.map(a=>a._id)))}`:'' }`);
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error('שגיאה בטעינת עסקאות:', err);
      toast.error('שגיאה בטעינת עסקאות');
    }
  };

  const fetchClients = async (agents) => {
    try {
      const res = await api.get(`/api/client${userData.role === 'master-agent' ? `?agents=${encodeURIComponent(JSON.stringify(agents.map(a=>a._id)))}`:'' }`);
      setClients(res.data.clients);
      return res.data.clients;
    } catch (err) {
      console.error('שגיאה בטעינת לקוחות:', err);
      toast.error('שגיאה בטעינת לקוחות');
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await api.get(`/api/agent${userData.role === 'master-agent' ? '?pushSelf=true' : ''}`);
      setAgents(res.data.agents);
      return res.data.agents
    } catch (err) {
      console.error('שגיאה בטעינת סוכנים:', err);
      toast.error('שגיאה בטעינת סוכנים');
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const fullSearch = `${transaction.agent?.name || ''} ${transaction.client?.name || ''}`;
    const matchesSearch = fullSearch.includes(search.trim());

    const matchesStatus = !statusFilter || transaction.status === statusFilter;
    const matchesClient = !clientFilter || transaction.client._id === clientFilter;
    const matchesAgent = !agentFilter || transaction.agent._id === agentFilter;

    return matchesSearch && matchesStatus && matchesClient && matchesAgent;
  });

  const approveTransaction = async (transactionId) => {
    try {
      await api.put(`/api/transaction/${transactionId}`); // Example endpoint
      toast.success('העסקה אושרה בהצלחה');
      // Refresh transactions after approval
      fetchTransactions(clients);
    } catch (err) {
      console.error('שגיאה באישור עסקה:', err);
      toast.error('שגיאה באישור עסקה');
    }
  };

  return (
    <>
    <div className={`body-overlay ${isPanelOpen?'active':""}`} style={isPanelOpen? { display: 'block' } : {}}></div>
    <div id="panel-left"></div>
    <div className="page page--main">
      <Header flag={false} panelClickHandle={panelClickHandle}/>
    <div className="page__content page__content--with-header">
    <h2 className="page__title">Transaction Management</h2>     

      {/* Filters */}
      <div className="agent-search">
        

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">All Status</option>
          <option value="completed">completed</option>
          <option value="pending">pending</option>
          <option value="failed">failed</option>
        </select>

        <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)}>
          <option value="">All Clients</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name}
            </option>
          ))}
        </select>

        {(userData.role !== 'client' && userData.role !== "agent") && (
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
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* Transaction Table */}
      <div  className="table table--6cols mb-20">
        <div  className="table__inner">          
          <div className="table__row">
            <div className="table__section table__section--header">Number</div>
            <div className="table__section table__section--header">Agent Name</div>
            <div className="table__section table__section--header">Client Name</div>
            <div className="table__section table__section--header">Amount</div>	
            <div className="table__section table__section--header">Created At</div>
            <div className="table__section table__section--header">Status</div>            						
          </div>
                            
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{
                    textAlign: 'center',
                    color: '#777',
                    padding: '20px',
                    fontSize: '16px',
                  }}>
                    No transactions to display
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction, index) => (
                  <div className="table__row">
                  <div className="table__section">{index + 1}</div>
                  <div className="table__section">{transaction.agent?.name || '-'}</div>
                  <div className="table__section">{transaction.client?.name || '-'}</div> 
                  <div className="table__section">{transaction.amount}</div>
                  <div className="table__section">{new Date(transaction.createdAt).toLocaleDateString('he-IL')}</div>     
                  <div className="table__section">
                  {transaction.status === 'completed'
                        ? 'הושלמה'
                        : transaction.status === 'pending'
                        ? (
                          <button
                            style={{
                              padding: '5px 10px',
                              backgroundColor: '#4caf50',
                              color: 'white',
                              border: 'none',
                              borderRadius: '4px',
                              cursor: 'pointer',
                            }}
                            onClick={() => approveTransaction(transaction._id)}
                          >
                            אשר
                          </button>
                        )
                        : 'נכשלה'}
                  </div>     
                  </div>                 
                ))
              )}                      
      </div>
      </div>
    </div>
    </div>
    </>
  );
};

export default TransactionManagement;
