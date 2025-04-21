import React, { useState,useEffect } from 'react';
import './index.css';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const PaymentLinkGenerator = () => {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [clients, setClients] = useState([]);
  const [agents, setAgents] = useState([]);
  const [client, setClient] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const location = useLocation();
  const userData = useAuth();

    useEffect(() => {
     const init = async ()=>{
      let agents = [];
      if (userData) {  
        if (userData.role !== 'agent') {
         agents = await fetchAgents();
        } 
        fetchClients(agents);
      }
  
      // Check if the URL contains the query parameter for agent_name
      const urlParams = new URLSearchParams(location.search);
      const clientID = urlParams.get('client_id');
  
      // If there's an agent name in the query, filter the client
      if (clientID) {
        setClient(clientID);
      }
     }
  
     init();
    }, [userData, location]);


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

  if (!userData) {
    return <div>טוען...</div>;
  }

  const handleGenerateLink = () => {
    const link = `https://mysite.com/payment?id=${client}&amount=${amount}`;
    setPaymentLink(link);
  };

  return (
    <div className="dashboard">
      <h1>יצירת קישור תשלום</h1>
      <form className="payment-form" onSubmit={(e) => e.preventDefault()}>
        <label>סכום לתשלום:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="הכנס סכום"
          required
        />
  
        <label>הערות:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="הכנס הערות (אופציונלי)"
        ></textarea>
  
        <label>לקוח:</label>
        <select
          value={client}
          onChange={(e) => setClient(e.target.value)}
          required
        >
          <option value="">בחר לקוח</option>
          {clients.map((c) => (
            <option key={c._id} value={c._id}>
              {c.name} ({c._id})
            </option>
          ))}
        </select>
  
        <button type="button" onClick={handleGenerateLink}>
          יצירת קישור
        </button>
      </form>     
    </div>
  );
  
};

export default PaymentLinkGenerator;
