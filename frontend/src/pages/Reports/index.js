import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import './index.css'; // reuse your CSS

const Reports = () => {
  const userData = useAuth();
  const [agents, setAgents] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [selectedAgent, setSelectedAgent] = useState('');

  useEffect(() => {
    const init = async () => {
      if (userData) {
        const _agents = await fetchAgents();
      
        await fetchTransactions(_agents);
      }
    };
    init();
  }, [userData]);

  if (!userData) {
    return <div>טוען...</div>;
  }

  const fetchAgents = async () => {
    try {
      const res = await api.get(`/api/agent${userData.role === 'master-agent' ? '?pushSelf=true' : ''}`);
      setAgents(res.data.agents);
      return res.data.agents;
    } catch (err) {
      console.error('שגיאה בטעינת סוכנים:', err);
      toast.error('שגיאה בטעינת סוכנים');
    }
  };

  const fetchTransactions = async (_agents) => {
    try {
      console.log("agents",agents)
      console.log("_agents",_agents);
      if(agents.length>0){
        _agents = agents;
      }
      let clients = [];
      if(userData.role === 'master-agent'){
        console.log(_agents);
         const res = await api.get(`/api/client${userData.role === 'master-agent' ? `?agents=${encodeURIComponent(JSON.stringify(_agents.map(a=>a._id)))}`:'' }`);
         clients = res.data.clients;
         console.log(clients)
      }
      const res = await api.get(`/api/transaction${userData.role === 'master-agent' ? `?clients=${encodeURIComponent(JSON.stringify(clients.map(a=>a._id)))}`:'' }`);
      setTransactions(res.data.transactions);
    } catch (err) {
      console.error('שגיאה בטעינת עסקאות:', err);
      toast.error('שגיאה בטעינת עסקאות');
    }
  };
 
  const masterAgentAgents = agents.filter(a=>a.masterId === selectedAgent);
  const allowedAgentIds =  [selectedAgent, ...masterAgentAgents.map(a => a._id)];
  //console.log('allowed',allowedAgentIds);
  
  const filteredTransactions = transactions.filter(tx => {
    // If no selectedAgent, show all
    if (!selectedAgent) return true;
  
    // If selectedAgent, check if transaction agent is in allowed list
    return tx.agent && allowedAgentIds.includes(tx.agent._id);
  });

  const successfulTransactions = filteredTransactions.filter(tx => tx.status === 'completed');
  const failedTransactions = filteredTransactions.filter(tx => tx.status === 'failed');

  const totalCreditsGenerated = successfulTransactions.reduce((acc, tx) => acc + (tx.amount || 0), 0);

  const exportAllToExcel = () => {
    const dataToExport = filteredTransactions.map(tx => ({
      'Transaction ID': tx._id,
      'Agent Name': agents.find(agent => agent._id === tx.agentId)?.name || '---',
      'Client Name': tx.clientName || '---',
      'Status': tx.status,
      'Amount ($)': tx.amount || 0,
      'Created At': new Date(tx.createdAt).toLocaleDateString('he-IL'),
    }));

    const worksheet = XLSX.utils.json_to_sheet(dataToExport);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Transactions_Report");
    XLSX.writeFile(workbook, `Transactions_Report.xlsx`);
  };

  return (
    <div className="Reports">
      <h1>דוחות עסקאות</h1>

      {/* Agent Filter */}
      <div className="agent-search">
        <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
          <option value="">כל הסוכנים</option>
          {agents.map((agent) => (
            <option key={agent._id} value={agent._id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>

      {/* Export Button */}
      <div style={{ marginTop: '20px' }}>
        <button onClick={exportAllToExcel}>
          📥 ייצוא כל העסקאות לאקסל
        </button>
      </div>

      {/* Transaction Statistics */}
      <div className="agent-table-container" style={{ marginTop: '40px' }}>
        <h2>סטטיסטיקת עסקאות</h2>

        <div style={{ marginTop: '20px' }}>
          <h3>✅ עסקאות מוצלחות: {successfulTransactions.length}</h3>
          <h3>❌ עסקאות כושלות: {failedTransactions.length}</h3>
          <h3>💳 סך הקרדיטים שנוצרו: {totalCreditsGenerated}$</h3>
        </div>
      </div>
    </div>
  );
};

export default Reports;
