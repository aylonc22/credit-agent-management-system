import './App.css';
import { BrowserRouter as Router, Route, Routes, useLocation } from 'react-router-dom';

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
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css'; // Import CSS for toastify

function App() {
  const location = useLocation();
  const isAuthPage =
    location.pathname === '/login' ||
    location.pathname === '/register' ||
    location.pathname === '/forgot-password';

  return (
    <div className={isAuthPage ? 'no-sidebar' : 'app-with-sidebar'}>
      {/* Navigation */}
      {!isAuthPage && <Navbar />}

      {/* Routes */}
      <div className="main-content">
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
         
         {/* Toast notifications */}
         <ToastContainer
          position="top-right"
          autoClose={5000} // Notification auto close time
          hideProgressBar={false} // Show progress bar
          newestOnTop={false} // Whether the newest notification is on top
          closeOnClick // Allow user to close notifications by clicking
          rtl={false} // Whether to support RTL (Right to Left)
          pauseOnFocusLoss // Pause notifications if user focuses away
          draggable
          pauseOnHover
        />

      </div>
    </div>
  );
}


export default App;
