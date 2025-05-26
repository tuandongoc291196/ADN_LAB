import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Component imports
import MainNavbar from './components/Navbar'; // Updated import name
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

// Payment System Components (NEW)
import Payment from './components/payment/Payment';
import PaymentSuccess from './components/payment/PaymentSuccess';

// Additional Components
import Sitemap from './components/Sitemap';

function App() {
  const [user, setUser] = useState(null);

  return (
    <Router>
      <div className="App d-flex flex-column min-vh-100">
        <MainNavbar user={user} setUser={setUser} />
        <div className="flex-grow-1">
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
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
            
            {/* Payment System Routes (NEW) */}
            <Route path="/payment" element={<Payment />} />
            <Route path="/payment-success" element={<PaymentSuccess />} />
            
            {/* Customer Dashboard Routes */}
            <Route path="/user/*" element={<UserDashboard user={user} />} />
            <Route path="/user/appointments" element={<UserDashboard user={user} />} />
            <Route path="/user/profile" element={<UserDashboard user={user} />} />
            <Route path="/user/results" element={<UserDashboard user={user} />} />
            
            {/* Staff Dashboard Routes */}
            <Route path="/staff/*" element={<StaffDashboard />} />
            
            {/* Manager Dashboard Routes */}
            <Route path="/manager/*" element={<ManagerDashboard />} />
            
            {/* Admin Dashboard Routes */}
            <Route path="/admin/*" element={<AdminDashboard />} />
            
            {/* Information & Library Pages */}
            <Route path="/library" element={<div className="container py-5"><h2>Thư viện ADN</h2><p>Thư viện kiến thức đang được phát triển...</p></div>} />
            <Route path="/library/technology" element={<div className="container py-5"><h2>Công nghệ ADN</h2><p>Nội dung đang được cập nhật...</p></div>} />
            <Route path="/library/samples" element={<div className="container py-5"><h2>Mẫu xét nghiệm</h2><p>Nội dung đang được cập nhật...</p></div>} />
            <Route path="/library/guides" element={<div className="container py-5"><h2>Hướng dẫn</h2><p>Nội dung đang được cập nhật...</p></div>} />
            
            {/* Business Pages */}
            <Route path="/prices" element={
              <div className="container py-5">
                <div className="text-center mb-5">
                  <h2>Bảng giá dịch vụ</h2>
                  <p className="lead text-muted">Giá cả minh bạch và cạnh tranh</p>
                </div>
                <div className="alert alert-info text-center">
                  <i className="bi bi-info-circle me-2"></i>
                  Bảng giá chi tiết đang được cập nhật. Vui lòng liên hệ hotline <strong>1900 1234</strong> để biết thêm thông tin.
                </div>
              </div>
            } />
            
            <Route path="/contact" element={
              <div className="container py-5">
                <div className="text-center mb-5">
                  <h2>Liên hệ với chúng tôi</h2>
                  <p className="lead text-muted">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
                </div>
                <div className="row">
                  <div className="col-md-4 text-center mb-4">
                    <i className="bi bi-telephone text-primary" style={{ fontSize: '3rem' }}></i>
                    <h5 className="mt-3">Hotline</h5>
                    <p><strong>1900 1234</strong></p>
                    <p className="text-muted">Hỗ trợ 24/7</p>
                  </div>
                  <div className="col-md-4 text-center mb-4">
                    <i className="bi bi-envelope text-primary" style={{ fontSize: '3rem' }}></i>
                    <h5 className="mt-3">Email</h5>
                    <p><strong>support@adnlab.vn</strong></p>
                    <p className="text-muted">Phản hồi trong 2h</p>
                  </div>
                  <div className="col-md-4 text-center mb-4">
                    <i className="bi bi-geo-alt text-primary" style={{ fontSize: '3rem' }}></i>
                    <h5 className="mt-3">Địa chỉ</h5>
                    <p><strong>123 Đường ABC</strong></p>
                    <p className="text-muted">Quận XYZ, Hà Nội</p>
                  </div>
                </div>
              </div>
            } />

            {/* Consultation & Support Routes (NEW) */}
            <Route path="/consultation" element={
              <div className="container py-5">
                <div className="text-center">
                  <h2>Tư vấn trực tuyến</h2>
                  <p className="lead text-muted mb-4">Chuyên gia ADN LAB sẵn sàng tư vấn miễn phí</p>
                  <div className="alert alert-info">
                    <i className="bi bi-info-circle me-2"></i>
                    Tính năng tư vấn trực tuyến đang được phát triển. Vui lòng gọi hotline <strong>1900 1234</strong> để được tư vấn ngay.
                  </div>
                </div>
              </div>
            } />
            
            {/* Legal & Policy Pages */}
            <Route path="/terms" element={
              <div className="container py-5">
                <h2>Điều khoản sử dụng dịch vụ</h2>
                <div className="alert alert-warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  Điều khoản chi tiết đang được cập nhật. Vui lòng liên hệ để biết thêm thông tin.
                </div>
                <div className="mt-4">
                  <h5>Các điều khoản cơ bản:</h5>
                  <ul>
                    <li>Thông tin cá nhân được bảo mật tuyệt đối</li>
                    <li>Kết quả xét nghiệm chỉ được cung cấp cho khách hàng</li>
                    <li>Dịch vụ tuân thủ các quy định pháp luật Việt Nam</li>
                    <li>Hoàn tiền 100% nếu có sai sót từ phía trung tâm</li>
                  </ul>
                </div>
              </div>
            } />
            
            <Route path="/privacy" element={
              <div className="container py-5">
                <h2>Chính sách bảo mật thông tin</h2>
                <div className="alert alert-success">
                  <i className="bi bi-shield-check me-2"></i>
                  <strong>Cam kết bảo mật tuyệt đối</strong> - Thông tin của bạn được mã hóa và bảo vệ nghiêm ngặt.
                </div>
                <div className="mt-4">
                  <h5>Chúng tôi bảo vệ:</h5>
                  <ul>
                    <li>Thông tin cá nhân và liên hệ</li>
                    <li>Kết quả xét nghiệm ADN</li>
                    <li>Lịch sử giao dịch</li>
                    <li>Dữ liệu y tế nhạy cảm</li>
                  </ul>
                  <h5 className="mt-4">Cam kết của chúng tôi:</h5>
                  <ul>
                    <li>Không chia sẻ thông tin với bên thứ ba</li>
                    <li>Mã hóa dữ liệu theo tiêu chuẩn quốc tế</li>
                    <li>Tuân thủ luật Bảo vệ dữ liệu cá nhân</li>
                    <li>Quyền xóa dữ liệu theo yêu cầu khách hàng</li>
                  </ul>
                </div>
              </div>
            } />
            
            {/* Utility Pages */}
            <Route path="/sitemap" element={<Sitemap />} />
            
            {/* 404 Page - Enhanced */}
            <Route path="*" element={
              <div className="container py-5">
                <div className="row justify-content-center">
                  <div className="col-lg-6 text-center">
                    <div className="mb-4">
                      <i className="bi bi-exclamation-triangle text-warning" style={{ fontSize: '5rem' }}></i>
                    </div>
                    <h1 className="display-4 fw-bold text-primary mb-3">404</h1>
                    <h2 className="mb-3">Không tìm thấy trang</h2>
                    <p className="text-muted mb-4">
                      Trang bạn đang tìm kiếm có thể đã được di chuyển, xóa hoặc không tồn tại. 
                      Vui lòng kiểm tra lại đường dẫn hoặc sử dụng các liên kết bên dưới.
                    </p>
                    
                    <div className="d-flex gap-3 justify-content-center flex-wrap mb-4">
                      <a href="/" className="btn btn-primary btn-lg">
                        <i className="bi bi-house me-2"></i>
                        Về trang chủ
                      </a>
                      <a href="/services" className="btn btn-outline-primary btn-lg">
                        <i className="bi bi-grid me-2"></i>
                        Xem dịch vụ
                      </a>
                      <a href="/appointment" className="btn btn-warning btn-lg">
                        <i className="bi bi-calendar-plus me-2"></i>
                        Đặt lịch ngay
                      </a>
                    </div>

                    <div className="mt-5">
                      <h5>Có thể bạn đang tìm kiếm:</h5>
                      <div className="row mt-3">
                        <div className="col-md-6">
                          <ul className="list-unstyled text-start">
                            <li><a href="/services?type=civil" className="text-decoration-none">Dịch vụ ADN Dân sự</a></li>
                            <li><a href="/services?type=administrative" className="text-decoration-none">Dịch vụ ADN Hành chính</a></li>
                            <li><a href="/tracking" className="text-decoration-none">Tra cứu kết quả</a></li>
                          </ul>
                        </div>
                        <div className="col-md-6">
                          <ul className="list-unstyled text-start">
                            <li><a href="/about" className="text-decoration-none">Về chúng tôi</a></li>
                            <li><a href="/contact" className="text-decoration-none">Liên hệ hỗ trợ</a></li>
                            <li><a href="/prices" className="text-decoration-none">Bảng giá dịch vụ</a></li>
                          </ul>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-light rounded">
                      <small className="text-muted">
                        <i className="bi bi-telephone me-2"></i>
                        Cần hỗ trợ? Gọi hotline <strong>1900 1234</strong> hoặc chat với chúng tôi
                      </small>
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