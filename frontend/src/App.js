import './App.css';
import { BrowserRouter as Router, Route, Routes,Link, useLocation } from 'react-router-dom';

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
import Register from './pages/Register/index.js';
import ForgotPassword from './pages/ForgotPassword/index.js';

function App() {
  const location = useLocation();
    // Check if the current route is Login / register / forgot-password
    const isAuthPage = location.pathname === '/login' ||  location.pathname === '/register' ||location.pathname === '/forgot-password';
  return (   
      <div className="App">
        {/* Navigation */}
        {!isAuthPage && <Navbar />}

        {/* Routes */}
        <div className={`main-content ${isAuthPage ? 'no-sidebar' : ''}`}>
        <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/agents" element={<AgentManagement />} />
            <Route path="/clients" element={<ClientManagement />} />
            <Route path="/transactions" element={<TransactionManagement />} />
            <Route path="/payment-links" element={<PaymentLinkGenerator />} />
            <Route path="/reports" element={<Reports />} />
            <Route path="/settings" element={<SystemSettings />} />
          </Routes>
        </div>
      </div>    
  );
}

export default App;
