import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Component imports
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import Reset from './components/auth/Reset';
import AdminDashboard from './components/admin/AdminDashboard';
import UserDashboard from './components/user/UserDashboard';
import ManagerDashboard from './components/manager/ManagerDashboard';
import ServiceList from './components/services/ServiceList';
import ServiceDetail from './components/services/ServiceDetail';
import FeedbackForm from './components/feedback/FeedbackForm';
import StaffDashboard from './components/staff/StaffDashboard';

// Booking System Components
import AppointmentBooking from './components/booking/AppointmentBooking';
import BookingConfirmation from './components/booking/BookingConfirmation';
import OrderTracking from './components/booking/OrderTracking';

// Additional Components
import Sitemap from './components/Sitemap';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <Navbar user={user} setUser={setUser} />
        <div className="container-fluid flex-grow-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/login" element={<Login setUser={setUser} />} />
            <Route path="/register" element={<Register />} />
            <Route path="/reset" element={<Reset />} />
            
            {/* Services Routes */}
            <Route path="/services" element={<ServiceList />} />
            <Route path="/services/:id" element={<ServiceDetail />} />
            <Route path="/services/category/:category" element={<ServiceList />} />
            <Route path="/feedback/:serviceId" element={<FeedbackForm user={user} />} />
            
            {/* Booking System Routes */}
            <Route path="/appointment" element={<AppointmentBooking />} />
            <Route path="/booking-confirmation" element={<BookingConfirmation />} />
            <Route path="/tracking" element={<OrderTracking />} />
            <Route path="/tracking/:trackingId" element={<OrderTracking />} />
            
            {/* Customer Dashboard Routes */}
            <Route path="/user/*" element={<UserDashboard user={user} />} />
            
            {/* Staff Dashboard Routes */}
            <Route path="/staff/*" element={<StaffDashboard />} />
            
            {/* Manager Dashboard Routes */}
            <Route path="/manager/*" element={<ManagerDashboard />} />
            
            {/* Admin Dashboard Routes */}
            <Route path="/admin/*" element={<AdminDashboard />} />
            
            {/* Additional Public Pages */}
            <Route path="/sitemap" element={<Sitemap />} />
            <Route path="/about" element={<About />} />
            <Route path="/prices" element={<div className="container py-5"><h2>Bảng giá</h2><p>Bảng giá dịch vụ đang được cập nhật...</p></div>} />
            <Route path="/contact" element={<div className="container py-5"><h2>Liên hệ</h2><p>Thông tin liên hệ đang được cập nhật...</p></div>} />
            <Route path="/library" element={<div className="container py-5"><h2>Thư viện ADN</h2><p>Thư viện kiến thức đang được phát triển...</p></div>} />
            <Route path="/library/technology" element={<div className="container py-5"><h2>Công nghệ ADN</h2><p>Nội dung đang được cập nhật...</p></div>} />
            <Route path="/library/samples" element={<div className="container py-5"><h2>Mẫu xét nghiệm</h2><p>Nội dung đang được cập nhật...</p></div>} />
            <Route path="/library/guides" element={<div className="container py-5"><h2>Hướng dẫn</h2><p>Nội dung đang được cập nhật...</p></div>} />
            
            {/* Legal Pages */}
            <Route path="/terms" element={<div className="container py-5"><h2>Điều khoản dịch vụ</h2><p>Điều khoản đang được cập nhật...</p></div>} />
            <Route path="/privacy" element={<div className="container py-5"><h2>Chính sách bảo mật</h2><p>Chính sách đang được cập nhật...</p></div>} />
            
            {/* 404 Page */}
            <Route path="*" element={
              <div className="container py-5 text-center">
                <div className="row justify-content-center">
                  <div className="col-md-6">
                    <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '5rem' }}></i>
                    <h1 className="mt-3">404 - Không tìm thấy trang</h1>
                    <p className="text-muted mb-4">Trang bạn đang tìm kiếm có thể đã được di chuyển hoặc không tồn tại.</p>
                    <div className="d-flex gap-3 justify-content-center">
                      <a href="/" className="btn btn-primary">
                        <i className="bi bi-house me-2"></i>
                        Về trang chủ
                      </a>
                      <a href="/services" className="btn btn-outline-primary">
                        <i className="bi bi-grid me-2"></i>
                        Xem dịch vụ
                      </a>
                    </div>
                  </div>
                </div>
              </div>
            } />
          </Routes>
        </div>
        <Footer />
      </div>
    </Router>
  );
}

export default App;