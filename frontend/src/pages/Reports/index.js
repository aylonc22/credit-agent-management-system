import React, { useEffect, useState } from 'react';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import * as XLSX from 'xlsx';
import './index.css'; // reuse your CSS
import Header from '../../components/Header';
import coin from '../../assets/images/logos/bitcoin.png';

const Reports = ({isPanelOpen, panelClickHandle}) => {
  const userData = useAuth(isPanelOpen, panelClickHandle);
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
    <>
    <div className={`body-overlay ${isPanelOpen?'active':""}`} style={isPanelOpen? { display: 'block' } : {}}></div>
    <div id="panel-left"/>
    <div className="page page--main">
      <Header flag={false} panelClickHandle={panelClickHandle}/>
      <div className="page__content page__content--with-header">
      <h2 className="page__title"> Transactions Report </h2>     
      {/* Agent Filter */}
      <div className="agent-search">
        <select value={selectedAgent} onChange={(e) => setSelectedAgent(e.target.value)}>
          <option value="">All Agents</option>
          {agents.map((agent) => (
            <option key={agent._id} value={agent._id}>
              {agent.name}
            </option>
          ))}
        </select>
      </div>     

      {/* Transaction Statistics */}
      <div class="page__title-bar">
			<p className='welcome'>Transaction Statistics</p>
		</div>		
	       <div className='form'> 
        <div class="cards cards--11 mb-20">
			  <div class="card card--style-inline card--style-inline-bg card--style-round-corners">
				  <div class="card__icon"><img src="images/icons/mobile.svg" alt="" title=""/></div>
				  <div class="card__details">
				  <h4 class="card__title">Successful Transactions</h4>
				  <p class="card__text">{successfulTransactions.length}</p>
				  </div>				  
			  </div>
			  <div class="card card--style-inline card--style-inline-bg card--style-round-corners">
				  <div class="card__icon"><img src="images/icons/code.svg" alt="" title=""/></div>
				  <div class="card__details">
				  <h4 class="card__title">Failed Transactions</h4>
				  <p class="card__text">{failedTransactions.length}</p>
				  </div>				  
			  </div>
			  <div class="card card--style-inline card--style-inline-bg card--style-round-corners">
				  <div class="card__icon"><img src={coin} alt="" title=""/></div>
				  <div class="card__details">
				  <h4 class="card__title">Total Credits Generated</h4>
				  <p class="card__text">{totalCreditsGenerated}$</p>
				  </div>				 
			  </div>			  
     </div>      
      </div>

      {/* Export Button */}
      <div className="form__row mt-40">
                <input onClick={exportAllToExcel} type="submit" name="submit" className="form__submit button button--main button--full" id="submit"
                value= "Export All Transactions to Excel"/>
      </div> 
      </div> 

    </div>
    </>
  );
};

export default Reports;
