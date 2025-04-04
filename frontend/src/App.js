import './App.css';
import { BrowserRouter as Router, Route, Routes,Link } from 'react-router-dom';

// Import pages
import Dashboard from './pages/Dashboard/index';
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
        <Routes>
          <Route exact path="/" component={Dashboard} />
          <Route path="/agents" component={AgentManagement} />
          <Route path="/clients" component={ClientManagement} />
          <Route path="/transactions" component={TransactionManagement} />
          <Route path="/payment-links" component={PaymentLinkGenerator} />
          <Route path="/reports" component={Reports} />
          <Route path="/settings" component={SystemSettings} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
