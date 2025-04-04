// src/pages/PaymentLinkGenerator.js
import React, { useState } from 'react';
import './index.css';
import useAuth from '../../hooks/useAuth';

const PaymentLinkGenerator = () => {
  const [amount, setAmount] = useState('');
  const [notes, setNotes] = useState('');
  const [client, setClient] = useState('');
  const [paymentLink, setPaymentLink] = useState('');

  useAuth();

  const handleGenerateLink = () => {
    // Sample link generation logic
    const link = `https://mysite.com/payment?id=${client}&amount=${amount}`;
    setPaymentLink(link);
  };

  return (
    <div>
      <h1>Payment Link Generator</h1>
      <form onSubmit={(e) => e.preventDefault()}>
        <label>Amount:</label>
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
        <br />
        <label>Notes:</label>
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
        ></textarea>
        <br />
        <label>Client:</label>
        <input
          type="text"
          value={client}
          onChange={(e) => setClient(e.target.value)}
          required
        />
        <br />
        <button onClick={handleGenerateLink}>Generate Payment Link</button>
      </form>

      {paymentLink && (
        <div>
          <h2>Generated Payment Link:</h2>
          <a href={paymentLink} target="_blank" rel="noopener noreferrer">
            {paymentLink}
          </a>
        </div>
      )}
    </div>
  );
};

export default PaymentLinkGenerator;
