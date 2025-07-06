import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Nav, Card, Alert, Spinner } from 'react-bootstrap';
import { getUserById, getBookingByUserId } from '../../services/api';

// Import dashboard components
import DashboardOverview from './DashboardOverview';
import MyAppointments from './MyAppointments';
import TestResults from './TestResults';
import UserProfile from './UserProfile';
import OrderHistory from './OrderHistory';
import SupportCenter from './SupportCenter';

const UserDashboard = ({ user }) => {
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [appointments, setAppointments] = useState([]);
  const [counts, setCounts] = useState({ total: 0, completed: 0, inProgress: 0 });

  // Get current tab from URL
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && path !== 'user') {
      setActiveTab(path);
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  // Fetch user data and appointments from API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        setLoading(true);
        
        // Lấy userId từ props user hoặc localStorage
        const userId = user?.id || user?.user_id || user?.uid || 
                      JSON.parse(localStorage.getItem('userData'))?.user_id || 
                      localStorage.getItem('user_id');
        
        if (!userId) {
          console.warn('No user ID found, using mock data');
          setCurrentUser({
            id: 1,
            fullname: 'Nguyễn Văn A',
            email: 'nguyenvana@example.com',
            phone: '0123456789',
            avatar: null,
            role: { name: 'customer' },
            createdAt: '2023-01-15'
          });
          setCounts({ total: 0, completed: 0, inProgress: 0 });
          return;
        }

        // Gọi API để lấy thông tin user
        const userData = await getUserById(userId);
        console.log('User data from API:', userData);
        

        
        if (userData) {
          setCurrentUser({
            ...userData,
            // Map các field từ BE sang FE
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

        // Fetch appointments để tính toán stats
        try {
          const appointmentsData = await getBookingByUserId(userId);
          setAppointments(appointmentsData || []);
          
          // Count status
          let completed = 0, inProgress = 0;
          (appointmentsData || []).forEach(b => {
            // Logic phân loại status giống DashboardOverview
            const createdAt = new Date(b.createdAt);
            const now = new Date();
            let isUpcoming = false;
            if (b.timeSlotId) {
              const parts = b.timeSlotId.split('_');
              if (parts.length >= 1) {
                const appointmentDate = new Date(parts[0]);
                isUpcoming = !isNaN(appointmentDate.getTime()) && appointmentDate > now;
              }
            }
            let status = 'confirmed';
            if (isUpcoming) {
              status = 'confirmed';
            } else if (createdAt.getTime() + (7 * 24 * 60 * 60 * 1000) < now.getTime()) {
              status = 'completed';
            } else {
              status = 'in-progress';
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
          console.error('Error fetching appointments:', appointmentsErr);
          setCounts({ total: 0, completed: 0, inProgress: 0 });
        }
      } catch (err) {
        console.error('Error fetching user data:', err);
        setError('Không thể tải thông tin người dùng');
        // Fallback to mock data
        setCurrentUser({
          id: 1,
          fullname: 'Nguyễn Văn A',
          email: 'nguyenvana@example.com',
          phone: '0123456789',
          avatar: null,
          role: { name: 'customer' },
          createdAt: '2023-01-15'
        });
        setCounts({ total: 0, completed: 0, inProgress: 0 });
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, [user]);

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
                  className={`d-flex align-items-center py-3 px-4 border-0 ${
                    activeTab === item.key ? `bg-${item.color} bg-opacity-10 text-${item.color} border-end border-${item.color} border-3` : 'text-dark'
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