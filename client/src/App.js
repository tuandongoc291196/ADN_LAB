import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Component imports
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import AdminDashboard from './components/admin/AdminDashboard';
import UserDashboard from './components/user/UserDashboard';
import ManagerDashboard from './components/manager/ManagerDashboard';
import ServiceList from './components/services/ServiceList';
import ServiceDetail from './components/services/ServiceDetail';
import FeedbackForm from './components/feedback/FeedbackForm';
import StaffDashboard from './components/staff/StaffDashboard';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Navbar user={user} setUser={setUser} />
        <div className="container mt-4 flex-grow-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/*" element={<AdminDashboard />} />
            <Route path="/user/*" element={<UserDashboard user={user} />} />
            <Route path="/manager/*" element={<ManagerDashboard />} />
            <Route path="/staff/*" element={<StaffDashboard />} />
            <Route path="/services" element={<ServiceList />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/feedback/:serviceId" element={<FeedbackForm user={user} />} />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;
