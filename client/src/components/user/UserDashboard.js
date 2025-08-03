// ========================================
// PHẦN IMPORT THƯ VIỆN
// ========================================
// Thư viện React cốt lõi cho chức năng component
import React, { useState, useEffect } from 'react';
// React Router để điều hướng và quản lý routes
import { Routes, Route, Link, useLocation } from 'react-router-dom';
// Các component Bootstrap cho giao diện
import { Container, Row, Col, Nav, Card, Alert, Spinner } from 'react-bootstrap';
// Các hàm API service để lấy dữ liệu user và booking
import { getUserById, getBookingByUserId } from '../../services/api';
// Context authentication để kiểm tra trạng thái đăng nhập
import { useAuth } from '../context/auth';

// ========================================
// PHẦN IMPORT COMPONENTS
// ========================================
// Import các component con của dashboard
import DashboardOverview from './DashboardOverview';
import MyAppointments from './MyAppointments';
import TestResults from './TestResults';
import UserProfile from './UserProfile';
import OrderHistory from './OrderHistory';
import SupportCenter from './SupportCenter';
import PrintableResult from './PrintableResult';

// ========================================
// COMPONENT CHÍNH: UserDashboard
// ========================================

/**
 * Component chính quản lý dashboard của user
 * 
 * LUỒNG HOẠT ĐỘNG CHÍNH:
 * 1. Component mount → useEffect chạy → gọi fetchUserData()
 * 2. Lấy userId từ props user hoặc localStorage
 * 3. Gọi API để lấy thông tin user và appointments
 * 4. Tính toán statistics và counts cho sidebar
 * 5. Render sidebar với thông tin user và navigation
 * 6. Render main content dựa trên active route
 * 
 * Props: 
 * - user: Thông tin user hiện tại
 */
const UserDashboard = ({ user }) => {
  // ========================================
  // PHẦN QUẢN LÝ STATE
  // ========================================
  
  // Hook React Router để lấy thông tin location hiện tại
  const location = useLocation();
  
  // Hook authentication để kiểm tra trạng thái đăng nhập
  const { loading: authLoading } = useAuth();
  
  // State Giao diện - Điều khiển tab active và loading
  const [activeTab, setActiveTab] = useState('overview'); // Tab đang được chọn
  const [loading, setLoading] = useState(true); // Hiển thị spinner khi đang tải dữ liệu
  const [error, setError] = useState(null); // Lưu trữ thông báo lỗi
  
  // State Dữ liệu - Lưu trữ thông tin user và appointments
  const [currentUser, setCurrentUser] = useState(null); // Thông tin user chi tiết từ API
  const [appointments, setAppointments] = useState([]); // Danh sách appointments của user
  
  // State Statistics - Thống kê cho sidebar
  const [counts, setCounts] = useState({ 
    total: 0, // Tổng số lịch hẹn
    completed: 0, // Số lịch hẹn đã hoàn thành
    inProgress: 0 // Số lịch hẹn đang trong quá trình
  });

  // ========================================
  // PHẦN EFFECTS
  // ========================================
  
  /**
   * useEffect để cập nhật activeTab dựa trên URL hiện tại
   * 
   * LUỒNG HOẠT ĐỘNG:
   * 1. Lắng nghe thay đổi location.pathname
   * 2. Tách path để lấy phần cuối của URL
   * 3. Cập nhật activeTab tương ứng
   * 4. Fallback về 'overview' nếu không có path cụ thể
   */
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && path !== 'user') {
      setActiveTab(path);
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  /**
   * useEffect chính để lấy dữ liệu user và appointments
   * 
   * LUỒNG LẤY DỮ LIỆU:
   * 1. Chờ auth loading hoàn thành
   * 2. Lấy userId từ props hoặc localStorage
   * 3. Gọi API getUserById để lấy thông tin user
   * 4. Gọi API getBookingByUserId để lấy appointments
   * 5. Tính toán statistics dựa trên booking history
   * 6. Cập nhật state với dữ liệu đã xử lý
   */
  useEffect(() => {
          const fetchUserData = async () => {
        // BƯỚC 1: Chờ auth loading hoàn thành
        if (authLoading) return;
        
        try {
          // BƯỚC 2: Bắt đầu loading
          setLoading(true);

          // BƯỚC 3: Lấy userId từ props user hoặc localStorage
          const userId = user?.id || user?.user_id || user?.uid ||
            JSON.parse(localStorage.getItem('userData'))?.user_id ||
            localStorage.getItem('user_id');

                    if (!userId) {
            setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
            setLoading(false);
            return;
          }

          // BƯỚC 4: Gọi API để lấy thông tin user
          const userData = await getUserById(userId);

          if (userData) {
            // BƯỚC 5: Mapping dữ liệu user từ BE sang FE
            setCurrentUser({
              ...userData,
              // Map các field từ BE sang FE để đảm bảo tính nhất quán
              fullname: userData.fullname || userData.name || 'Không có tên',
              email: userData.email || '',
              phone: userData.phone || '',
              avatar: userData.avatar || null,
              role: userData.role || { name: 'customer' },
              createdAt: userData.createdAt || userData.memberSince || new Date().toISOString()
            });
          } else {
            throw new Error('Không thể lấy thông tin người dùng');
          }

                  // BƯỚC 6: Fetch appointments để tính toán statistics
          try {
            const appointmentsData = await getBookingByUserId(userId);
            setAppointments(appointmentsData || []);

            // BƯỚC 7: Tính toán statistics dựa trên booking history
            let completed = 0, inProgress = 0;
            (appointmentsData || []).forEach(b => {
              // Xác định status dựa trên booking history (cùng logic với DashboardOverview)
              const history = b.bookingHistories_on_booking?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];
              const currentHistoryStatus = history.length > 0 ? history[0].status : null;
              
              let status = 'confirmed'; // default status
              let isUpcoming = false;
              
              // Kiểm tra xem appointment có phải là upcoming không
              if (b.timeSlotId) {
                try {
                  const parts = b.timeSlotId.split('_');
                  if (parts.length >= 1) {
                    const appointmentDate = new Date(parts[0]);
                    isUpcoming = !isNaN(appointmentDate.getTime()) && appointmentDate > new Date();
                  }
                } catch (e) {
                  isUpcoming = false;
                }
              }

            // Improved status mapping based on timeline and method (same as DashboardOverview)
            if (currentHistoryStatus) {
              if (currentHistoryStatus === 'COMPLETED' || currentHistoryStatus === 'COMPLETE') {
                status = 'completed';
              } else if (currentHistoryStatus === 'CANCELLED' || currentHistoryStatus === 'EXPIRED') {
                status = 'cancelled';
              } else {
                // Use same mapping logic as DashboardOverview
                const methodId = b.method?.id;
                const methodName = b.method?.name?.toLowerCase() || '';
                
                // Self-sample method (Method ID: 0)
                if (methodId === '0' || methodName.includes('tự') || methodName.includes('self') || methodName.includes('kit')) {
                  if (['CREATED', 'PENDING_PAYMENT', 'BOOKED', 'KIT_PREPARED', 'KIT_SENT', 'KIT_RECEIVED'].includes(currentHistoryStatus)) {
                    status = 'confirmed';
                  } else if (['SELF_COLLECTED', 'KIT_RETURNED', 'SAMPLE_RECEIVED', 'SAMPLE_COLLECTED', 'RESULT_PENDING'].includes(currentHistoryStatus)) {
                    status = 'in-progress';
                  } else {
                    status = 'completed';
                  }
                }
                // Home-visit method (Method ID: 1)
                else if (methodId === '1' || methodName.includes('tại nhà') || methodName.includes('home') || methodName.includes('visit')) {
                  if (['CREATED', 'PENDING_PAYMENT', 'BOOKED', 'STAFF_ASSIGNED'].includes(currentHistoryStatus)) {
                    status = 'confirmed';
                  } else if (['SAMPLE_RECEIVED', 'SAMPLE_COLLECTED', 'RESULT_PENDING'].includes(currentHistoryStatus)) {
                    status = 'in-progress';
                  } else {
                    status = 'completed';
                  }
                }
                // Lab-visit method (Method ID: 2)
                else if (methodId === '2' || methodName.includes('tại lab') || methodName.includes('cơ sở') || methodName.includes('lab') || methodName.includes('facility')) {
                  if (['CREATED', 'PENDING_PAYMENT', 'BOOKED'].includes(currentHistoryStatus)) {
                    status = 'confirmed';
                  } else if (['SAMPLE_RECEIVED', 'SAMPLE_COLLECTED', 'RESULT_PENDING'].includes(currentHistoryStatus)) {
                    status = 'in-progress';
                  } else {
                    status = 'completed';
                  }
                }
                // Default mapping
                else {
                  if (['SAMPLE_COLLECTED', 'SAMPLE_PROCESSING', 'RESULT_PENDING', 'KIT_RETURNED', 'SAMPLE_RECEIVED'].includes(currentHistoryStatus)) {
                    status = 'in-progress';
                  } else if (['CREATED', 'PENDING_PAYMENT', 'BOOKED', 'KIT_PREPARED', 'KIT_SENT', 'KIT_RECEIVED', 'SELF_COLLECTED', 'STAFF_ASSIGNED'].includes(currentHistoryStatus)) {
                    status = 'confirmed';
                  } else {
                    status = 'confirmed'; // fallback
                  }
                }
              }
            } else {
              // Fallback to time-based status if no history
              const createdAt = new Date(b.createdAt);
              const now = new Date();
              
              if (isUpcoming) {
                status = 'confirmed';
              } else if (createdAt.getTime() + (7 * 24 * 60 * 60 * 1000) < now.getTime()) {
                status = 'completed';
              } else {
                status = 'in-progress';
              }
            }
            
            if (status === 'completed') completed++;
            if (status === 'in-progress') inProgress++;
          });
          setCounts({
            total: (appointmentsData || []).length,
            completed,
            inProgress
          });
        } catch (appointmentsErr) {
          setCounts({ total: 0, completed: 0, inProgress: 0 });
        }
      } catch (err) {
        setError('Không thể tải thông tin người dùng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user, authLoading]);

  // Show loading state
  if (loading) {
    return (
      <Container fluid className="py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3">Đang tải thông tin người dùng...</p>
        </div>
      </Container>
    );
  }

  // Show error state
  if (error) {
    return (
      <Container fluid className="py-4">
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
        <div className="text-center mt-3">
          <button 
            className="btn btn-primary" 
            onClick={() => window.location.reload()}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Thử lại
          </button>
          <button 
            className="btn btn-outline-secondary ms-2" 
            onClick={() => window.location.href = '/login'}
          >
            <i className="bi bi-box-arrow-in-right me-2"></i>
            Đăng nhập lại
          </button>
        </div>
      </Container>
    );
  }

  // Fallback if no user data
  if (!currentUser) {
    return (
      <Container fluid className="py-4">
        <Alert variant="warning">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Không tìm thấy thông tin người dùng
        </Alert>
      </Container>
    );
  }

  const menuItems = [
    {
      key: 'overview',
      label: 'Tổng quan',
      icon: 'bi-house',
      path: '/user',
      color: 'primary',
    },
    {
      key: 'appointments',
      label: 'Lịch hẹn của tôi',
      icon: 'bi-calendar-event',
      path: '/user/appointments',
      color: 'success',
      badge: counts.total
    },
    {
      key: 'results',
      label: 'Kết quả xét nghiệm',
      icon: 'bi-file-earmark-check',
      path: '/user/results',
      badge: counts.completed,
      color: 'warning'
    },
    {
      key: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: 'bi-person',
      path: '/user/profile',
      color: 'info'
    },
    {
      key: 'history',
      label: 'Lịch sử đặt hẹn',
      icon: 'bi-clock-history',
      path: '/user/history',
      color: 'secondary'
    },
    {
      key: 'support',
      label: 'Hỗ trợ & Phản hồi',
      icon: 'bi-headset',
      path: '/user/support',
      color: 'danger'
    }
  ];

  return (
    <Container fluid className="py-4">
      <Row>
        {/* Sidebar */}
        <Col lg={3} md={4} className="mb-4">
          <Card className="shadow-sm">
            {/* User Info Header */}
            <Card.Header className="bg-primary text-white text-center py-4">
              <div className="mb-3">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt="Avatar"
                    className="rounded-circle"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="bg-white text-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                    style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-person fs-1"></i>
                  </div>
                )}
              </div>
              <h5 className="mb-1">{currentUser.fullname}</h5>
              <small className="opacity-75">{currentUser.email}</small>
              <div className="mt-2">
                <small className="d-block">
                  <i className="bi bi-calendar me-1"></i>
                  Thành viên từ {new Date(currentUser.createdAt).toLocaleDateString('vi-VN')}
                </small>
              </div>
            </Card.Header>

            {/* Quick Stats */}
            <Card.Body className="py-3">
              <Row className="text-center g-0">
                <Col xs={4}>
                  <div className="py-2">
                    <div className="h5 mb-0 text-primary">
                      {loading ? <Spinner size="sm" /> : counts.total}
                    </div>
                    <small className="text-muted">Tổng lịch hẹn</small>
                  </div>
                </Col>
                <Col xs={4} className="border-start border-end">
                  <div className="py-2">
                    <div className="h5 mb-0 text-success">
                      {loading ? <Spinner size="sm" /> : counts.completed}
                    </div>
                    <small className="text-muted">Đã hoàn thành</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="py-2">
                    <div className="h5 mb-0 text-warning">
                      {loading ? <Spinner size="sm" /> : counts.inProgress}
                    </div>
                    <small className="text-muted">Chờ kết quả</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>

            {/* Navigation Menu */}
            <Nav className="flex-column">
              {menuItems.map(item => (
                <Nav.Link
                  key={item.key}
                  as={Link}
                  to={item.path}
                  className={`d-flex align-items-center py-3 px-4 border-0 ${activeTab === item.key ? `bg-${item.color} bg-opacity-10 text-${item.color} border-end border-${item.color} border-3` : 'text-dark'
                    }`}
                  style={{ textDecoration: 'none' }}
                >
                  <i className={`${item.icon} me-3 fs-5`}></i>
                  <span className="flex-grow-1">{item.label}</span>
                  {item.badge && item.badge > 0 && (
                    <span className={`badge bg-${item.color} rounded-pill`}>
                      {item.badge}
                    </span>
                  )}
                </Nav.Link>
              ))}
            </Nav>

            {/* Quick Actions */}
            <Card.Footer className="bg-light">
              <div className="d-grid gap-2">
                <Link to="/appointment" className="btn btn-warning btn-sm">
                  <i className="bi bi-plus-circle me-2"></i>
                  Đặt lịch mới
                </Link>
                <Link to="/tracking" className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-search me-2"></i>
                  Tra cứu trạng thái
                </Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>

        {/* Main Content */}
        <Col lg={9} md={8}>
          <Routes>
            <Route path="/" element={<DashboardOverview user={currentUser} />} />
            <Route path="/appointments" element={<MyAppointments user={currentUser} />} />
            <Route path="/results" element={<TestResults user={currentUser} />} />
            <Route path="/print-result/:resultId" element={<PrintableResult user={currentUser} />} />
            <Route path="/profile" element={<UserProfile user={currentUser} />} />
            <Route path="/history" element={<OrderHistory user={currentUser} />} />
            <Route path="/support" element={<SupportCenter user={currentUser} />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard;