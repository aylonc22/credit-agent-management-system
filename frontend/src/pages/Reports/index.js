// src/pages/Reports.js
import React from 'react';
import useAuth from '../../hooks/useAuth';

const Reports = () => {  
  const userData = useAuth();

  // Handle case when user is not authenticated (userData is null)
  if (!userData) {
    return <div>Loading...</div>; // Optionally show a loading state or redirect to login
  }

  const { id, role } = userData;
  return (
    <div>
      <h1>Reports</h1>
      <p>View various system reports here:</p>
      <ul>
        <li>Revenue by Agent</li>
        <li>New Client Registrations</li>
        <li>Successful vs Failed Transactions</li>
      </ul>
      <p>You can export reports to Excel or PDF.</p>
      {/* You can integrate charts or tables to display actual data */}
    </div>
  );
};

export default Reports;
