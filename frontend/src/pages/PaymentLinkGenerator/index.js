import React, { useState, useEffect } from 'react';
import './index.css';
import useAuth from '../../hooks/useAuth';
import api from '../../api/axios';
import { toast } from 'react-toastify';
import { useLocation } from 'react-router-dom';
import Header from '../../components/Header';

const PaymentLinkGenerator = ({isPanelOpen, panelClickHandle}) => {
  const [amount, setAmount] = useState(15);
  const [notes, setNotes] = useState('');
  const [clients, setClients] = useState([]);
  const [agents, setAgents] = useState([]);
  const [client, setClient] = useState('');
  const [paymentLink, setPaymentLink] = useState('');
  const location = useLocation();
  const userData = useAuth(isPanelOpen, panelClickHandle);

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
    if (!amount || (!client && userData.role !== 'client')) {
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
    <>
     <div className={`body-overlay ${isPanelOpen?'active':""}`} style={isPanelOpen? { display: 'block' } : {}}></div>
    <div id="panel-left"/>
    <div className="page page--main" data-page="cards">
    <Header flag={false} panelClickHandle={panelClickHandle}/>
    <div className="page__content page__content--with-header">
    {(!paymentLink || userData.role !=='client') ? (
      <>
       <h2 className="page__title">
        {userData.role !== 'client' ? 'Create Payment Link' : 'Create Payment'}
       </h2>

      <div className="fieldset">
      <div className="form">
      <form onSubmit={(e) => e.preventDefault()}>
        <div className="form__row">
          <h3 className="pb-20 pt-20">Amount ($)</h3>
          <input
              type="number"
              className="input-field"
              value={amount }
              onChange={(e) => setAmount(e.target.value)}
              min={15}
              placeholder="Enter Amount"
              required
              />
        </div>
      
        <div className="form__row">
          <h3 className="pb-20 pt-20">Notes</h3>
          <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="textarea-input"
          placeholder="Enter notes (optional)"
          style={{ resize: 'vertical', maxHeight: '100px' }} // limit dragability
          ></textarea>
        </div>        

        {userData.role !== 'client' && (                  
          <div className="form__select">
            <select
            value={client}
            onChange={(e) => setClient(e.target.value)}
            required
            >
            <option disabled value="">Choose Client</option>
            {clients.map((c,index) => (
              <option key={c._id} value={index}>
                {c.name}
              </option>
            ))}
            </select>
					</div>          
       )}
          <div className="form__row mt-40">
                <input onClick={handleGenerateLink} type="submit" name="submit" className="form__submit button button--main button--full" id="submit"
                value= {userData.role !== 'client' ? "Create Link" : "Proceed to Payment"}/>
          </div>        
      </form>
      </div>
      </div>
      {paymentLink && userData.role !== 'cleint' && (
        <div className="generated-link">
    <p>🔗 Payment Link:</p>
    <div className="link-container">
      <input
        type="text"
        value={paymentLink}
        readOnly
        onClick={(e) => e.target.select()}
        />
      <button
        type="button"
        className="button button--main button--ex-small"
        onClick={() => {
          navigator.clipboard.writeText(paymentLink);
          toast.success('הקישור הועתק!');
        }}
        >
        Copy Link
      </button>
    </div>
  </div>
)}
      </>
    ):(
      <div className='alchemyFrame'>
         <iframe height="625" title="AlchemyPay On/Off Ramp Widget"
          src={paymentLink}
          frameBorder="no" allowTransparency="true" allowFullScreen="" 
          />        
      </div>
    )}
    </div>
    </div>
    </>
  );
};

export default PaymentLinkGenerator;
