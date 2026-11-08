import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import DonorPortal from './components/DonorPortal';
import PaymentPage from './components/PaymentPage';
import TransactionSuccess from './components/TransactionSuccess';
import PendingPage from './components/PendingPage';
import AdminDashboard from './components/AdminDashboard';

function App() {
    return (
        <Router basename="/">
            <Routes>
                <Route path="/" element={<LandingPage />} />
                <Route path="/portal-donatur" element={<DonorPortal />} />
                <Route path="/admin" element={<AdminDashboard />} />
                <Route path="/admin/login" element={<AdminDashboard />} />
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/payment" element={<PaymentPage />} />
                <Route path="/pending" element={<PendingPage />} />
                <Route path="/success" element={<TransactionSuccess />} />
            </Routes>
        </Router>
    );
}

export default App;
