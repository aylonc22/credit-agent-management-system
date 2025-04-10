import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import './index.css';

const TransactionManagement = () => {
  const userData = useAuth('agent');  // Use the hook to get user data for 'admin' role
  const [transactions, setTransactions] = useState([]);
  const [clients, setClients] = useState([]);
  const [agents, setAgents] = useState([]);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [clientFilter, setClientFilter] = useState('');
  const [agentFilter, setAgentFilter] = useState(''); // Added state for agent filter

  useEffect(() => {
    if (!userData) {
      return;
    }

    // Fetch agents and clients only if the user is an admin
    if (userData.role === 'admin') {
      fetchAgents();
      fetchClients();
      fetchTransactions();
    }
  }, [userData]);

  if (!userData) {
    return <div>טוען...</div>;  // Optionally show a loading state or redirect to login
  }

  const fetchTransactions = async () => {
    try {
      const res = await api.get('/api/transaction');
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error('שגיאה בטעינת עסקאות:', err);
      toast.error('שגיאה בטעינת עסקאות');
    }
  };

  const fetchClients = async () => {
    try {
      const res = await api.get(`/api/client${userData.role === 'master-agent' ? '?pushSelf=true' : ''}`);
      setClients(res.data.clients);
    } catch (err) {
      console.error('שגיאה בטעינת לקוחות:', err);
      toast.error('שגיאה בטעינת לקוחות');
    }
  };

  const fetchAgents = async () => {
    try {
      const res = await api.get(`/api/agent${userData.role === 'master-agent' ? '?pushSelf=true' : ''}`);
      setAgents(res.data.agents);
    } catch (err) {
      console.error('שגיאה בטעינת סוכנים:', err);
      toast.error('שגיאה בטעינת סוכנים');
    }
  };

  const filteredTransactions = transactions.filter((transaction) => {
    const fullSearch = `${transaction.agent?.name || ''} ${transaction.client?.name || ''}`;
    const matchesSearch = fullSearch.includes(search.trim());

    const matchesStatus = !statusFilter || transaction.status === statusFilter;
    const matchesClient = !clientFilter || transaction.clientId === clientFilter;
    const matchesAgent = !agentFilter || transaction.agentId === agentFilter;

    return matchesSearch && matchesStatus && matchesClient && matchesAgent;
  });

  return (
    <div className="dashboard">
      <h1>ניהול עסקאות</h1>

      {/* Filters */}
      <div className="agent-search">
        <input
          type="text"
          placeholder="חיפוש לפי שם סוכן או לקוח..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)}>
          <option value="">כל הסטטוסים</option>
          <option value="completed">הושלמה</option>
          <option value="pending">ממתינה</option>
          <option value="failed">נכשלה</option>
        </select>

        <select value={clientFilter} onChange={(e) => setClientFilter(e.target.value)}>
          <option value="">כל הלקוחות</option>
          {clients.map((client) => (
            <option key={client._id} value={client._id}>
              {client.name}
            </option>
          ))}
        </select>

        <select value={agentFilter} onChange={(e) => setAgentFilter(e.target.value)}>
          <option value="">כל הסוכנים</option>
          {agents.map((agent) => (
            <option key={agent._id} value={agent._id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>

      {/* Transaction Table */}
      <div className="agent-table-container">
        <table className="agent-table-head">
          <thead>
            <tr>
              <th>מספר</th>
              <th>סוכן</th>
              <th>לקוח</th>
              <th>סכום</th>
              <th>שיטת תשלום</th>
              <th>תאריך יצירה</th>
              <th>סטטוס</th>
            </tr>
          </thead>
        </table>

        <div className="agent-table-body-wrapper">
          <table className="agent-table-body">
            <tbody>
              {filteredTransactions.length === 0 ? (
                <tr>
                  <td colSpan={7} style={{
                    textAlign: 'center',
                    color: '#777',
                    padding: '20px',
                    fontSize: '16px',
                  }}>
                    לא נמצאו עסקאות
                  </td>
                </tr>
              ) : (
                filteredTransactions.map((transaction, index) => (
                  <tr key={transaction._id}>
                    <td>{index + 1}</td>
                    <td>{transaction.agent?.name || '-'}</td>
                    <td>{transaction.client?.name || '-'}</td>
                    <td>{transaction.amount}</td>
                    <td>{transaction.paymentMethod}</td>
                    <td>{new Date(transaction.createdAt).toLocaleDateString('he-IL')}</td>
                    <td>{transaction.status === 'completed' ? 'הושלמה' : transaction.status === 'pending' ? 'ממתינה' : 'נכשלה'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default TransactionManagement;
