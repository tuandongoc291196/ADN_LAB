import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Component imports
import MainNavbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './components/Home';
import About from './components/About';
import Guides from './components/Guides';
import Blog from './components/Blog';
import BlogDetail from './components/BlogDetail';
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

// Payment System Components
import Payment from './components/payment/Payment';
import PaymentSuccess from './components/payment/PaymentSuccess';

// Additional Components
import Sitemap from './components/Sitemap';
import LoadingSpinner from './components/common/LoadingSpinner';

// Test Results Components
import TestResults from './components/user/TestResults';
import PrintableResult from './components/user/PrintableResult';

// User Information Components
import UserProfile from './components/user/UserProfile';
import MyAppointments from './components/user/MyAppointments';

import LinkChatbox from "./components/chat/chatButton/linkChatbox.js";
import ChatBoxButton from "./components/chat/chatButton/chatboxButton.js";
import EnhancedChatButton from "./components/chat/chatButton/EnhancedChatButton.js";
import { Landing as ChatLanding } from "./components/chat/landing/index.js";
import { ChatRoom } from "./components/chat/chatRoom/index.js";
import MessengerChat from "./components/chat/messenger/MessengerChat.js";
import { AuthProvider } from "./components/context/auth.js";
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from './components/config/firebase';

// Admin Components
import AdminOverview from './components/admin/AdminOverview';
import BlogManagement from './components/admin/BlogManagement';
import BlogEditor from './components/admin/BlogEditor';
import AdminReports from './components/admin/AdminReports';
import UserManagement from './components/admin/UserManagement';
import SystemSettings from './components/admin/SystemSettings';

// Protected Route Component for general authentication
const ProtectedRoute = ({ children, user, requiredRole }) => {
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <i className="bi bi-shield-exclamation text-danger" style={{ fontSize: '4rem' }}></i>
          <h2 className="mt-3">Không có quyền truy cập</h2>
          <p className="text-muted">Bạn không có quyền truy cập vào trang này.</p>
          <a href="/" className="btn btn-primary">Về trang chủ</a>
        </div>
      </div>
    );
  }

  return children;
};

// Protected Route Component specifically for chat features using Firebase auth
const ChatProtectedRoute = ({ children }) => {
  const [user, loading] = useAuthState(auth);

  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Đang kiểm tra đăng nhập...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

function App() {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on app load
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const savedUser = localStorage.getItem('user');
        if (savedUser) {
          setUser(JSON.parse(savedUser));
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  // Prevent unwanted redirects on page reload
  useEffect(() => {
    const currentPath = window.location.pathname;
    console.log('App loaded at path:', currentPath);
    
    // Nếu user đã đăng nhập và không phải trang login/register thì lưu current path
    const savedUser = localStorage.getItem('user');
    if (savedUser && !['/login', '/register', '/reset'].includes(currentPath)) {
      sessionStorage.setItem('lastVisitedPath', currentPath);
    }
  }, []);

  // Show loading spinner while checking auth
  if (isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthProvider>
      <Router>
        <div className="App d-flex flex-column min-vh-100">
          <MainNavbar user={user} setUser={setUser} />
          <div className="flex-grow-1">
            <Routes>
              {/* ======================== PUBLIC ROUTES ======================== */}
              <Route path="/" element={<Home />} />
              <Route path="/about" element={<About />} />
              <Route path="/guides" element={<Guides />} />
              <Route path="/blog" element={<Blog />} />
              <Route path="/blog/:id" element={<BlogDetail />} />

              {/* Authentication Routes */}
              <Route path="/login" element={<Login setUser={setUser} />} />
              <Route path="/register" element={<Register setUser={setUser} />} />
              <Route path="/reset" element={<Reset />} />

              {/* Services Routes */}
              <Route path="/services" element={<ServiceList />} />
              <Route path="/services/category/:category" element={<ServiceList />} />
              <Route path="/services/:id" element={<ServiceDetail />} />
              <Route path="/feedback/:serviceId" element={<FeedbackForm user={user} />} />

              {/* Booking System Routes */}
              <Route path="/appointment" element={<AppointmentBooking />} />
              <Route path="/booking-confirmation" element={<BookingConfirmation />} />
              <Route path="/tracking" element={<OrderTracking />} />
              <Route path="/tracking/:bookingId" element={<OrderTracking />} />
              <Route path="/booking/track/:bookingId" element={<OrderTracking />} />

              {/* Payment System Routes */}
              <Route path="/payment" element={<Payment />} />
              <Route path="/payment-success" element={<PaymentSuccess />} />

              {/* Customer Dashboard Routes */}
              <Route path="/user/*" element={<UserDashboard user={user} />} />
              <Route path="/appointments" element={<MyAppointments user={user} />} />
              <Route path="/profile" element={<UserProfile user={user} />} />
              <Route path="/results" element={<TestResults user={user} />} />
              <Route path="/results/:resultId" element={<TestResults user={user} />} />
              <Route path="/print-result/:resultId" element={
                <div className="container-fluid p-0">
                  <PrintableResult />
                </div>
              } />

              {/* Staff Dashboard Routes */}
              <Route path="/staff/*" element={<StaffDashboard />} />

              {/* Manager Dashboard Routes */}
              <Route path="/manager/*" element={<ManagerDashboard />} />

              {/* Admin Dashboard Routes */}
              <Route path="/admin/*" element={<AdminDashboard />} />

              {/* Information & Library Pages */}
              <Route path="/library" element={<div className="container py-5"><h2>Thư viện ADN</h2><p>Thư viện kiến thức đang được phát triển...</p></div>} />

              {/* Business Pages */}
              <Route path="/contact" element={
                <div className="container py-5">
                  <div className="text-center mb-5">
                    <h2>
                      <i className="bi bi-headset text-primary me-2"></i>
                      Liên hệ với chúng tôi
                    </h2>
                    <p className="lead text-muted">Chúng tôi luôn sẵn sàng hỗ trợ bạn 24/7</p>
                  </div>
                  <div className="row justify-content-center">
                    <div className="col-lg-10">
                      <div className="row">
                        <div className="col-md-4 text-center mb-4">
                          <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                              <i className="bi bi-telephone text-primary" style={{ fontSize: '3rem' }}></i>
                              <h5 className="mt-3">Hotline</h5>
                              <p><strong>1900 1234</strong></p>
                              <p className="text-muted">Hỗ trợ 24/7</p>
                              <a href="tel:19001234" className="btn btn-outline-primary">Gọi ngay</a>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 text-center mb-4">
                          <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                              <i className="bi bi-envelope text-primary" style={{ fontSize: '3rem' }}></i>
                              <h5 className="mt-3">Email</h5>
                              <p><strong>support@adnlab.vn</strong></p>
                              <p className="text-muted">Phản hồi trong 2h</p>
                              <a href="mailto:support@adnlab.vn" className="btn btn-outline-primary">Gửi email</a>
                            </div>
                          </div>
                        </div>
                        <div className="col-md-4 text-center mb-4">
                          <div className="card border-0 shadow-sm h-100">
                            <div className="card-body">
                              <i className="bi bi-geo-alt text-primary" style={{ fontSize: '3rem' }}></i>
                              <h5 className="mt-3">Địa chỉ</h5>
                              <p><strong>123 Đường ABC</strong></p>
                              <p className="text-muted">Quận XYZ, Hà Nội</p>
                              <a href="#" className="btn btn-outline-primary">Xem bản đồ</a>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              } />

              {/* ======================== CHAT ROUTES ======================== */}
              <Route path="/chatbox" element={<LinkChatbox />} />
              <Route path="/chat" element={<ChatProtectedRoute><ChatLanding /></ChatProtectedRoute>} />
              <Route path="/chat/:roomId" element={<ChatProtectedRoute><ChatRoom /></ChatProtectedRoute>} />
              <Route path="/messenger" element={<ChatProtectedRoute><MessengerChat /></ChatProtectedRoute>} />
              <Route path="/messenger/:roomId" element={<ChatProtectedRoute><MessengerChat /></ChatProtectedRoute>} />

              {/* ======================== CONSULTATION & SUPPORT ROUTES ======================== */}
              <Route path="/consultation" element={
                <div className="container py-5">
                  <div className="text-center mb-5">
                    <h2>
                      <i className="bi bi-chat-dots text-primary me-2"></i>
                      Tư vấn trực tuyến
                    </h2>
                    <p className="lead text-muted mb-4">Chuyên gia ADN LAB sẵn sàng tư vấn miễn phí</p>
                  </div>
                  <div className="row justify-content-center">
                    <div className="col-lg-8">
                      <div className="alert alert-info text-center">
                        <i className="bi bi-info-circle me-2"></i>
                        Tính năng tư vấn trực tuyến đang được phát triển. Vui lòng gọi hotline <strong>1900 1234</strong> để được tư vấn ngay.
                      </div>
                      <div className="card border-0 shadow-sm">
                        <div className="card-body text-center">
                          <h5>Các hình thức tư vấn hiện có:</h5>
                          <div className="row mt-4">
                            <div className="col-md-6 mb-3">
                              <i className="bi bi-telephone text-success fs-2"></i>
                              <h6 className="mt-2">Tư vấn qua điện thoại</h6>
                              <p className="text-muted small">Gọi ngay 1900 1234</p>
                            </div>
                            <div className="col-md-6 mb-3">
                              <i className="bi bi-envelope text-info fs-2"></i>
                              <h6 className="mt-2">Tư vấn qua email</h6>
                              <p className="text-muted small">Gửi email cho chúng tôi</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              } />

              {/* Legal & Policy Pages */}
              <Route path="/terms" element={
                <div className="container py-5">
                  <h2>
                    <i className="bi bi-file-text text-primary me-2"></i>
                    Điều khoản sử dụng dịch vụ
                  </h2>
                  <div className="alert alert-warning mt-4">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    Điều khoản chi tiết đang được cập nhật. Vui lòng liên hệ để biết thêm thông tin.
                  </div>
                  <div className="card border-0 shadow-sm mt-4">
                    <div className="card-body">
                      <h5>Các điều khoản cơ bản:</h5>
                      <ul className="mt-3">
                        <li>Thông tin cá nhân được bảo mật tuyệt đối</li>
                        <li>Kết quả xét nghiệm chỉ được cung cấp cho khách hàng</li>
                        <li>Dịch vụ tuân thủ các quy định pháp luật Việt Nam</li>
                        <li>Hoàn tiền 100% nếu có sai sót từ phía trung tâm</li>
                        <li>Khách hàng có quyền hủy dịch vụ trong vòng 24h</li>
                        <li>Kết quả xét nghiệm có giá trị pháp lý theo quy định</li>
                      </ul>
                    </div>
                  </div>
                </div>
              } />

              <Route path="/privacy" element={
                <div className="container py-5">
                  <h2>
                    <i className="bi bi-shield-lock text-primary me-2"></i>
                    Chính sách bảo mật thông tin
                  </h2>
                  <div className="alert alert-success mt-4">
                    <i className="bi bi-shield-check me-2"></i>
                    <strong>Cam kết bảo mật tuyệt đối</strong> - Thông tin của bạn được mã hóa và bảo vệ nghiêm ngặt.
                  </div>
                  <div className="row mt-4">
                    <div className="col-lg-6">
                      <div className="card border-0 shadow-sm">
                        <div className="card-body">
                          <h5>
                            <i className="bi bi-lock text-primary me-2"></i>
                            Chúng tôi bảo vệ:
                          </h5>
                          <ul className="mt-3">
                            <li>Thông tin cá nhân và liên hệ</li>
                            <li>Kết quả xét nghiệm ADN</li>
                            <li>Lịch sử giao dịch</li>
                            <li>Dữ liệu y tế nhạy cảm</li>
                            <li>Thông tin thanh toán</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                    <div className="col-lg-6">
                      <div className="card border-0 shadow-sm">
                        <div className="card-body">
                          <h5>
                            <i className="bi bi-check-circle text-success me-2"></i>
                            Cam kết của chúng tôi:
                          </h5>
                          <ul className="mt-3">
                            <li>Không chia sẻ thông tin với bên thứ ba</li>
                            <li>Mã hóa dữ liệu theo tiêu chuẩn quốc tế</li>
                            <li>Tuân thủ luật Bảo vệ dữ liệu cá nhân</li>
                            <li>Quyền xóa dữ liệu theo yêu cầu khách hàng</li>
                            <li>Kiểm tra bảo mật định kỳ</li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              } />

              {/* Utility Pages */}
              <Route path="/sitemap" element={<Sitemap />} />

              {/* 404 Page - Enhanced */}
              <Route path="*" element={
                <div className="container py-5">
                  <div className="row justify-content-center">
                    <div className="col-lg-8 text-center">
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

                      <div className="card border-0 shadow-sm">
                        <div className="card-body">
                          <h5>Có thể bạn đang tìm kiếm:</h5>
                          <div className="row mt-3">
                            <div className="col-md-4">
                              <h6 className="text-primary">Dịch vụ</h6>
                              <ul className="list-unstyled text-start">
                                <li><a href="/services?type=civil" className="text-decoration-none">ADN Dân sự</a></li>
                                <li><a href="/services?type=administrative" className="text-decoration-none">ADN Hành chính</a></li>
                                <li><a href="/services?type=forensic" className="text-decoration-none">ADN Pháp y</a></li>
                              </ul>
                            </div>
                            <div className="col-md-4">
                              <h6 className="text-primary">Hỗ trợ</h6>
                              <ul className="list-unstyled text-start">
                                <li><a href="/tracking" className="text-decoration-none">Tra cứu kết quả</a></li>
                                <li><a href="/contact" className="text-decoration-none">Liên hệ hỗ trợ</a></li>
                                <li><a href="/consultation" className="text-decoration-none">Tư vấn trực tuyến</a></li>
                              </ul>
                            </div>
                            <div className="col-md-4">
                              <h6 className="text-primary">Thông tin</h6>
                              <ul className="list-unstyled text-start">
                                <li><a href="/about" className="text-decoration-none">Về chúng tôi</a></li>
                                <li><a href="/prices" className="text-decoration-none">Bảng giá</a></li>
                                <li><a href="/library" className="text-decoration-none">Thư viện ADN</a></li>
                              </ul>
                            </div>
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
          <EnhancedChatButton />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;