import './App.css';
import { BrowserRouter as Router, Route, Routes,Link } from 'react-router-dom';

// Import pages
import Dashboard from './pages/Dashboard/index';
import Login from './pages/Login/index';
import AgentManagement from './pages/AgentManagement/index';
import ClientManagement from './pages/ClientManagement/index';
import TransactionManagement from './pages/TransactionManagement/index';
import PaymentLinkGenerator from './pages/PaymentLinkGenerator/index';
import Reports from './pages/Reports/index';
import SystemSettings from './pages/SystemSettings/index';
import Navbar from './components/Navbar.js';

function App() {
  return (
    <Router>
      <div className="App">
        {/* Navigation */}
        <Navbar/>

        {/* Routes */}
        <div className="main-content">
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/agents" element={<AgentManagement />} />
            <Route path="/clients" element={<ClientManagement />} />
            <Route path="/transactions" element={<TransactionManagement />} />
            <Route path="/payment-links" element={<PaymentLinkGenerator />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<SystemSettings />} />
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default App;
