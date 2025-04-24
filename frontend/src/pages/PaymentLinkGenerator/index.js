import React, { useState, useEffect } from 'react';
import './index.css';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';

const PaymentLinkGenerator = () => {
  const [amount, setAmount] = useState(15);
  const [notes, setNotes] = useState('');
  const [clients, setClients] = useState([]);
  const [agents, setAgents] = useState([]);
  const [client, setClient] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const location = useLocation();
  const userData = useAuth();

  useEffect(() => {
    const init = async () => {
      let agents = [];
      if (userData) {
        if (userData.role !== 'agent' && userData.role !== 'client') {
          agents = await fetchAgents();
        }
        if(userData.role !=='client'){
          fetchClients(agents);
        }
      }

      const urlParams = new URLSearchParams(location.search);
      const clientID = urlParams.get('client_id');
      if (clientID) {
        setClient(clientID);
      }
    };

    init();
  }, [userData, location]);

  const fetchClients = async (agents) => {
    try {
      const res = await api.get(`/api/client${userData.role === 'master-agent' ? `?agents=${encodeURIComponent(JSON.stringify(agents.map(a => a._id)))}` : ''}`);
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
      return res.data.agents;
    } catch (err) {
      console.error('שגיאה בקבלת סוכנים:', err);
    }
  };

  if (!userData) {
    return <div>טוען...</div>;
  }

  const handleGenerateLink = async () => {
    if (!amount || (!client && !userData.id)) {
      toast.warn('יש למלא את הסכום ולבחור לקוח');
      return;
    }
    if(amount<15){
      toast.warn('מינימום קניה של 15 דולר');
      return;
    }
    try {

      const res = await api.post('/api/create-inovice', {
        clientId: clients[client]?._id || userData.id,
        amount,
        notes,
      });
      setPaymentLink(res.data.checkout_url);
     if(userData.role !== 'client'){
       toast.success('קישור נוצר בהצלחה');
     }
    } catch (err) {
      console.error('שגיאה ביצירת קישור תשלום:', err);
      toast.error('שגיאה ביצירת קישור');
    }
  };

  return (
    <div className="dashboard">
    {(!paymentLink || userData.role !=='client') ? (
      <>
        <h1>יצירת {userData.role !== 'client' && 'קישור'} תשלום</h1>
      <form className="payment-form" onSubmit={(e) => e.preventDefault()}>
        <label>סכום לתשלום:</label>
        <input
          type="number"
          value={amount }
          onChange={(e) => setAmount(e.target.value)}
          min={15}
          placeholder="הכנס סכום"
          required
        />

        <label>הערות:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="הכנס הערות (אופציונלי)"
          style={{ resize: 'vertical', maxHeight: '100px' }} // limit dragability
        ></textarea>

        {userData.role !== 'client' && (
          <>
          <label>לקוח:</label>
        <select
          value={client}
          onChange={(e) => setClient(e.target.value)}
          required
        >
          <option value="">בחר לקוח</option>
          {clients.map((c,index) => (
            <option key={c._id} value={index}>
              {c.name}
            </option>
          ))}
        </select>
        </>)}

        <button type="button" onClick={handleGenerateLink}>
          {userData.role!=='client'?"יצירת קישור":"מעבר לתשלום"}
        </button>
      </form>

      {paymentLink && userData.role !== 'cleint' && (
  <div className="generated-link">
    <p>🔗 קישור תשלום:</p>
    <div className="link-container">
      <input
        type="text"
        value={paymentLink}
        readOnly
        onClick={(e) => e.target.select()}
      />
      <button
        type="button"
        className="copy-btn"
        onClick={() => {
          navigator.clipboard.writeText(paymentLink);
          toast.success('הקישור הועתק!');
        }}
      >
        העתק קישור
      </button>
    </div>
  </div>
)}
      </>
    ):(
      <div className='alchemyFrame'>
         <iframe height="625" title="AlchemyPay On/Off Ramp Widget"
          src={paymentLink}
          frameborder="no" allowtransparency="true" allowfullscreen="" 
          />        
      </div>
    )}

    </div>
  );
};

export default PaymentLinkGenerator;
