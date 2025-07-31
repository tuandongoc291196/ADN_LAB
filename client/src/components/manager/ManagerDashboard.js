/**
 * Dashboard chính cho quản lý phòng xét nghiệm
 * Cung cấp giao diện quản lý tổng quan và điều hướng đến các chức năng quản lý
 */
import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Card, Alert, Badge, Button, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/auth';
import {
  Speedometer2,
  Gear,
  CalendarCheck,
  People,
  GraphUp,
  ChatDots,
  BoxArrowRight,
  StarFill,
  Star,
  PersonBadge,
  Clock,
  Bell,
  BellFill,
  ThreeDots
} from 'react-bootstrap-icons';

// Import các component con
import ServiceManagement from './ServiceManagement';
import AppointmentManagement from './AppointmentManagement';
import StaffManagement from './StaffManagement';
import ReportManagement from './ReportManagement';
import FeedbackManagement from './FeedbackManagement';
import ManagerProfile from './ManagerProfile';
import ResultsManagement from './ResultsManagement';

// Thêm hàm getRoleLabel để mapping role sang tiếng Việt
function getRoleLabel(role) {
  if (!role) return '';
  const roleName = typeof role === 'object' && role !== null ? (role.name || role.role_string || '') : (role || '');
  switch (roleName.toLowerCase()) {
    case 'admin': return 'Quản trị viên';
    case 'manager': return 'Quản lý';
    case 'staff': return 'Nhân viên';
    case 'customer': return 'Khách hàng';
    default: return roleName;
  }
}

/**
 * Component chính cho dashboard quản lý
 * @param {Object} user - Thông tin người dùng quản lý
 */
const ManagerDashboard = () => {
  // Lấy thông tin đường dẫn hiện tại
  const location = useLocation();
  const { user } = useAuth();

  // State quản lý tab đang active
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  // State quản lý thông báo
  const [notifications, setNotifications] = useState([
    // { id: 1, message: 'Có 5 lịch hẹn mới cần xác nhận', time: '5 phút trước', read: false },
    // { id: 2, message: 'Báo cáo doanh thu tháng 3 đã sẵn sàng', time: '1 giờ trước', read: false }
  ]);

  // Cập nhật tab active dựa trên đường dẫn URL
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const currentPath = pathSegments[2]; // Lấy phần sau /manager/

    if (currentPath) {
      setActiveTab(currentPath);
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  // Effect để kiểm tra auth và set loading
  useEffect(() => {
    const checkAuth = () => {
      // Đợi 1400ms để context có thể load hoàn toàn
      setTimeout(() => {
        setIsLoading(false);
      }, 1500);
    };

    checkAuth();
  }, [user]);

  // Hiển thị loading trong khi kiểm tra auth
  if (isLoading) {
    return (
      <Container fluid className="py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Đang tải dashboard...</p>
        </div>
      </Container>
    );
  }

  // Kiểm tra quyền manager
  if (!user?.role?.id || user.role.id !== '2') {
    return <Navigate to="/" replace />;
  }

  // Tạo currentUser với thông tin từ context
  const currentUser = {
    ...user,
    name: user.fullname || user.name || 'Quản lý',
    position: 'Quản lý phòng xét nghiệm',
    employeeId: user.staffId || user.id || 'MGR001',
  };

  // Cấu hình các mục menu trong sidebar
  const menuItems = [
    {
      key: 'overview',
      label: 'Tổng quan',
      icon: Speedometer2,
      path: '/manager/overview',
      color: 'primary',
      description: 'Dashboard tổng quan quản lý'
    },
    {
      key: 'services',
      label: 'Quản lý dịch vụ',
      icon: Gear,
      path: '/manager/services',
      color: 'success',
      description: 'Quản lý và cấu hình dịch vụ'
    },
    // {
    //   key: 'appointments',
    //   label: 'Quản lý lịch hẹn',
    //   icon: CalendarCheck,
    //   path: '/manager/appointments',
    //   color: 'warning',
    //   description: 'Theo dõi và quản lý lịch hẹn'
    // },
    {
      key: 'results',
      label: 'Quản lý kết quả',
      icon: GraphUp,
      path: '/manager/results',
      color: 'primary',
      description: 'Quản lý kết quả xét nghiệm ADN'
    },
    {
      key: 'staff',
      label: 'Quản lý nhân viên',
      icon: People,
      path: '/manager/staff',
      color: 'info',
      description: 'Quản lý thông tin nhân viên'
    },
    // {
    //   key: 'reports',
    //   label: 'Báo cáo',
    //   icon: GraphUp,
    //   path: '/manager/reports',
    //   color: 'danger',
    //   description: 'Xem báo cáo và thống kê'
    // },
    // {
    //   key: 'feedback',
    //   label: 'Phản hồi',
    //   icon: ChatDots,
    //   path: '/manager/feedback',
    //   color: 'secondary',
    //   description: 'Quản lý phản hồi khách hàng'
    // },
    {
      key: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: PersonBadge,
      path: '/manager/profile',
      color: 'dark',
      description: 'Quản lý thông tin cá nhân'
    }

  ];

  return (
    <Container fluid className="py-4">
      <Row>
        {/* Sidebar */}
        <Col lg={3} md={4} className="mb-4">
          <Card className="shadow-sm">
            {/* Manager Info Header */}
            <Card.Header className="bg-warning text-dark text-center py-4">
              <div className="mb-3">
                {currentUser.avatar ? (
                  <img
                    src={currentUser.avatar}
                    alt="Avatar"
                    className="rounded-circle"
                    width="60"
                    height="60"
                  />
                ) : (
                  <div className="bg-white bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center"
                    style={{ width: '60px', height: '60px' }}>
                    <i className="bi bi-person-badge fs-1 text-dark"></i>
                  </div>
                )}
              </div>
              <h5 className="mb-1">{currentUser.fullname}</h5>
              <p className="mb-1 small opacity-75">{currentUser.email}</p>
              <p className="mb-1 small opacity-75">{getRoleLabel(currentUser.role)}</p>
            </Card.Header>

            {/* Navigation Menu */}
            <Nav className="flex-column">
              {menuItems.map((item) => (
                <Nav.Link
                  key={item.key}
                  as={Link}
                  to={item.path}
                  className={`d-flex align-items-center py-3 px-4 border-0 ${activeTab === item.key
                    ? `bg-${item.color} bg-opacity-10 text-${item.color} border-end border-${item.color} border-3`
                    : 'text-dark'
                    }`}
                  style={{ textDecoration: 'none' }}
                >
                  <span className="me-3">
                    <item.icon className="fs-5" />
                  </span>
                  <div className="flex-grow-1">
                    <div>{item.label}</div>
                    <small className="text-muted">{item.description}</small>
                  </div>
                </Nav.Link>
              ))}
            </Nav>
          </Card>
        </Col>

        {/* Main Content */}
        <Col lg={9} md={8}>
          {/* Header with Notifications */}
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h2 className="mb-1">Chào mừng, {currentUser.name}!</h2>
              <p className="text-muted mb-0">
                <Clock className="me-1" />
                Hôm nay là {new Date().toLocaleDateString('vi-VN', {
                  weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                })}
              </p>
            </div>
            <div className="d-flex align-items-center">
              <div className="position-relative me-3">
                <Button variant="light" className="rounded-circle p-2">
                  {notifications.some(n => !n.read) ? <BellFill /> : <Bell />}
                </Button>
                {notifications.some(n => !n.read) && (
                  <Badge
                    bg="danger"
                    className="position-absolute top-0 start-100 translate-middle rounded-circle"
                    style={{ transform: 'translate(-50%, -50%)' }}
                  >
                    {notifications.filter(n => !n.read).length}
                  </Badge>
                )}
              </div>
              <Button variant="light" className="rounded-circle p-2">
                <ThreeDots />
              </Button>
            </div>
          </div>

          <Routes>
            <Route index element={<ManagerOverview user={currentUser} />} />
            <Route path="overview" element={<ManagerOverview user={currentUser} />} />
            <Route path="services" element={<ServiceManagement user={currentUser} />} />
            <Route path="appointments" element={<AppointmentManagement user={currentUser} />} />
            <Route path="results" element={<ResultsManagement user={currentUser} />} />
            <Route path="staff" element={<StaffManagement user={currentUser} />} />
            <Route path="reports" element={<ReportManagement user={currentUser} />} />
            <Route path="feedback" element={<FeedbackManagement user={currentUser} />} />
            <Route path="profile" element={<ManagerProfile user={currentUser} />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

// Overview component
const ManagerOverview = ({ user }) => {
  return (
    <div>
      {/* Welcome Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Chào mừng, {user.fullname}!</h2>
          <p className="text-muted mb-0">
            <Clock className="me-1" />
            Hôm nay là {new Date().toLocaleDateString('vi-VN', {
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
            })}
          </p>
        </div>
        <div className="text-end">
          <div className="h4 text-success mb-0">
            {user.totalRevenue ? user.totalRevenue.toLocaleString('vi-VN') : '0'} VNĐ
          </div>
          <small className="text-muted">Doanh thu tháng này</small>
        </div>
      </div>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-start border-success border-4 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <Gear className="fs-1 text-success" />
              </div>
              <div>
                <div className="h4 mb-0">{user.totalServices}</div>
                <div className="text-muted small">Dịch vụ đang hoạt động</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-start border-warning border-4 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <CalendarCheck className="fs-1 text-warning" />
              </div>
              <div>
                <div className="h4 mb-0">{user.totalAppointments}</div>
                <div className="text-muted small">Lịch hẹn tháng này</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-start border-info border-4 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <People className="fs-1 text-info" />
              </div>
              <div>
                <div className="h4 mb-0">{user.totalStaff}</div>
                <div className="text-muted small">Nhân viên đang làm việc</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-start border-danger border-4 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <GraphUp className="fs-1 text-danger" />
              </div>
              <div>
                <div className="h4 mb-0">
                  {(user.totalRevenue / 1000000).toFixed(1)}M
                </div>
                <div className="text-muted small">Doanh thu (VNĐ)</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Recent Appointments */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-light">
          <h5 className="card-title mb-0">Lịch hẹn gần đây</h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Dịch vụ</th>
                  <th>Ngày hẹn</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Nguyễn Văn A</td>
                  <td>Xét nghiệm ADN Cha Con</td>
                  <td>20/03/2024</td>
                  <td><Badge bg="success">Đã xác nhận</Badge></td>
                </tr>
                <tr>
                  <td>Lê Văn C</td>
                  <td>Xét nghiệm ADN Mẹ Con</td>
                  <td>21/03/2024</td>
                  <td><Badge bg="warning">Chờ xác nhận</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      {/* Recent Feedback */}
      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="card-title mb-0">Phản hồi mới</h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Dịch vụ</th>
                  <th>Đánh giá</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>Phạm Thị D</td>
                  <td>Xét nghiệm ADN Họ Hàng</td>
                  <td>
                    <div className="text-warning">
                      <StarFill />
                      <StarFill />
                      <StarFill />
                      <Star />
                      <Star />
                    </div>
                  </td>
                  <td><Badge bg="warning">Chờ phản hồi</Badge></td>
                </tr>
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ManagerDashboard; 