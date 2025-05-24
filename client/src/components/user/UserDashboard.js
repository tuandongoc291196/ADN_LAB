import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Nav, Card, Alert } from 'react-bootstrap';

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

  // Get current tab from URL
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && path !== 'user') {
      setActiveTab(path);
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  // Mock user data if not provided
  const currentUser = user || {
    id: 1,
    name: 'Nguyễn Văn A',
    email: 'nguyenvana@example.com',
    phone: '0123456789',
    avatar: null,
    role: 'user',
    memberSince: '2023-01-15',
    totalAppointments: 8,
    completedTests: 5,
    pendingResults: 2
  };

  const menuItems = [
    {
      key: 'overview',
      label: 'Tổng quan',
      icon: 'bi-speedometer2',
      path: '/user',
      color: 'primary'
    },
    {
      key: 'appointments',
      label: 'Lịch hẹn của tôi',
      icon: 'bi-calendar-event',
      path: '/user/appointments',
      color: 'success',
      badge: currentUser.pendingResults
    },
    {
      key: 'results',
      label: 'Kết quả xét nghiệm',
      icon: 'bi-file-earmark-check',
      path: '/user/results',
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
              <h5 className="mb-1">{currentUser.name}</h5>
              <small className="opacity-75">{currentUser.email}</small>
              <div className="mt-2">
                <small className="d-block">
                  <i className="bi bi-calendar me-1"></i>
                  Thành viên từ {new Date(currentUser.memberSince).toLocaleDateString('vi-VN')}
                </small>
              </div>
            </Card.Header>

            {/* Quick Stats */}
            <Card.Body className="py-3">
              <Row className="text-center g-0">
                <Col xs={4}>
                  <div className="py-2">
                    <div className="h5 mb-0 text-primary">{currentUser.totalAppointments}</div>
                    <small className="text-muted">Tổng lịch hẹn</small>
                  </div>
                </Col>
                <Col xs={4} className="border-start border-end">
                  <div className="py-2">
                    <div className="h5 mb-0 text-success">{currentUser.completedTests}</div>
                    <small className="text-muted">Đã hoàn thành</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="py-2">
                    <div className="h5 mb-0 text-warning">{currentUser.pendingResults}</div>
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
          {!user && (
            <Alert variant="info" className="mb-4">
              <i className="bi bi-info-circle me-2"></i>
              Bạn đang xem dashboard demo. <Link to="/login">Đăng nhập</Link> để truy cập thông tin thực tế.
            </Alert>
          )}

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