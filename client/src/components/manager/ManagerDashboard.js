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
  ThreeDots,
  FileEarmarkText,
  PersonCheck,
  Eye,
  Inbox
} from 'react-bootstrap-icons';

// Import API functions
import { getAllServices, getAllBookings, getStaffListByRole } from '../../services/api';

// Import các component con
import ServiceManagement from './ServiceManagement';
import AppointmentManagement from './AppointmentManagement';
import StaffManagement from './StaffManagement';
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

  // State để lưu dashboard data cho sidebar
  const [sidebarData, setSidebarData] = useState({
    totalServices: 0,
    totalResults: 0,
    totalStaff: 0
  });

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
      <Container fluid className="py-4">
        <div className="text-center py-5">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-3">Đang tải thông tin quản lý...</p>
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
      icon: 'bi-house',
      path: '/manager/overview',
      color: 'primary',
    },
    {
      key: 'services',
      label: 'Quản lý dịch vụ',
      icon: 'bi-gear',
      path: '/manager/services',
      color: 'success',
    },
    {
      key: 'results',
      label: 'Quản lý kết quả',
      icon: 'bi-file-earmark-check',
      path: '/manager/results',
      color: 'warning',
    },
    {
      key: 'staff',
      label: 'Quản lý nhân viên',
      icon: 'bi-people',
      path: '/manager/staff',
      color: 'info',
    },
    {
      key: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: 'bi-person',
      path: '/manager/profile',
      color: 'secondary',
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
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="bg-white text-warning rounded-circle mx-auto d-flex align-items-center justify-content-center"
                    style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-person-badge fs-1"></i>
                  </div>
                )}
              </div>
              <h5 className="mb-1">{currentUser.fullname}</h5>
              <small className="opacity-75">{currentUser.email}</small>
              <div className="mt-2">
                <small className="d-block">
                  <i className="bi bi-briefcase me-1"></i>
                  {getRoleLabel(currentUser.role)}
                </small>
              </div>
            </Card.Header>

            {/* Quick Stats */}
            <Card.Body className="py-3">
              <Row className="text-center g-0">
                <Col xs={4}>
                  <div className="py-2">
                    <div className="h5 mb-0 text-primary">
                      {sidebarData.totalServices}
                    </div>
                    <small className="text-muted">Dịch vụ</small>
                  </div>
                </Col>
                <Col xs={4} className="border-start border-end">
                  <div className="py-2">
                    <div className="h5 mb-0 text-success">
                      {sidebarData.totalResults}
                    </div>
                    <small className="text-muted">Kết quả</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="py-2">
                    <div className="h5 mb-0 text-warning">
                      {sidebarData.totalStaff}
                    </div>
                    <small className="text-muted">Nhân viên</small>
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
                <Link to="/manager/services" className="btn btn-warning btn-sm">
                  <i className="bi bi-plus-circle me-2"></i>
                  Thêm dịch vụ
                </Link>
                <Link to="/manager/results" className="btn btn-outline-primary btn-sm">
                  <i className="bi bi-search me-2"></i>
                  Xem kết quả
                </Link>
              </div>
            </Card.Footer>
          </Card>
        </Col>

        {/* Main Content */}
        <Col lg={9} md={8}>
          <Routes>
            <Route index element={<ManagerOverview user={currentUser} onDataUpdate={setSidebarData} />} />
            <Route path="overview" element={<ManagerOverview user={currentUser} onDataUpdate={setSidebarData} />} />
            <Route path="services" element={<ServiceManagement user={currentUser} />} />
            <Route path="appointments" element={<AppointmentManagement user={currentUser} />} />
            <Route path="results" element={<ResultsManagement user={currentUser} />} />
            <Route path="staff" element={<StaffManagement user={currentUser} />} />
            <Route path="profile" element={<ManagerProfile user={currentUser} />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

// Overview component - Restructured with real data fetching
const ManagerOverview = ({ user, onDataUpdate }) => {
  const [dashboardData, setDashboardData] = useState({
    totalServices: 0,
    totalResults: 0,
    totalStaff: 0,
    pendingResults: 0,
    completedResults: 0,
    featuredServices: [],
    recentResults: []
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch dashboard data
  useEffect(() => {
    const fetchDashboardData = async () => {
      setLoading(true);
      try {
        // Fetch services data
        const services = await getAllServices();
        const activeServices = Array.isArray(services) 
          ? services.filter(service => service.isActive) 
          : [];
        const featuredServices = activeServices.filter(service => service.featured).slice(0, 5);

        // Fetch bookings/results data
        const bookings = await getAllBookings();
        const bookingList = Array.isArray(bookings) 
          ? bookings 
          : (Array.isArray(bookings?.bookings) ? bookings.bookings : []);
        
        // Filter results (bookings with result_pending or complete status)
        const results = bookingList.filter(b => {
          const histories = Array.isArray(b.bookingHistories_on_booking) ? b.bookingHistories_on_booking : [];
          const sorted = [...histories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          const latestStatus = sorted[0]?.status?.toLowerCase() || b.status?.toLowerCase() || '';
          return latestStatus === 'result_pending' || latestStatus === 'complete';
        });

        const pendingResults = results.filter(r => {
          const histories = Array.isArray(r.bookingHistories_on_booking) ? r.bookingHistories_on_booking : [];
          const sorted = [...histories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          const latestStatus = sorted[0]?.status?.toLowerCase() || r.status?.toLowerCase() || '';
          return latestStatus === 'result_pending';
        });

        const completedResults = results.filter(r => {
          const histories = Array.isArray(r.bookingHistories_on_booking) ? r.bookingHistories_on_booking : [];
          const sorted = [...histories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          const latestStatus = sorted[0]?.status?.toLowerCase() || r.status?.toLowerCase() || '';
          return latestStatus === 'complete';
        });

        // Fetch staff data
        const staffList = await getStaffListByRole([1, 2]); // Lấy cả staff và manager
        const activeStaff = Array.isArray(staffList) 
          ? staffList.filter(staff => staff.accountStatus === 'active' && staff.role?.name === 'staff')
          : [];

        // Get recent results (last 5)
        const recentResults = results.slice(0, 5).map(result => ({
          id: result.id,
          customerName: result.informations_on_booking?.[0]?.name || 'Không rõ',
          phone: result.informations_on_booking?.[0]?.phone || '',
          serviceName: result.service?.title || 'Không rõ dịch vụ',
          serviceType: result.service?.category?.hasLegalValue ? 'administrative' : 'civil',
          status: (() => {
            const histories = Array.isArray(result.bookingHistories_on_booking) ? result.bookingHistories_on_booking : [];
            const sorted = [...histories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            return sorted[0]?.status?.toLowerCase() || result.status?.toLowerCase() || '';
          })(),
          completedDate: result.completedDate || result.updatedAt || result.createdAt
        }));

        setDashboardData({
          totalServices: activeServices.length,
          totalResults: results.length,
          totalStaff: activeStaff.length,
          pendingResults: pendingResults.length,
          completedResults: completedResults.length,
          featuredServices: featuredServices,
          recentResults: recentResults
        });

        // Update parent state
        onDataUpdate({
          totalServices: activeServices.length,
          totalResults: results.length,
          totalStaff: activeStaff.length
        });

      } catch (err) {
        setError('Không thể tải dữ liệu dashboard');
        console.error('Error fetching dashboard data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now - date);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays} ngày trước`;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'result_pending': { bg: 'warning', text: 'Chờ xử lý' },
      'complete': { bg: 'success', text: 'Hoàn thành' },
      'cancelled': { bg: 'danger', text: 'Đã hủy' }
    };
    const config = statusConfig[status] || { bg: 'secondary', text: 'Không xác định' };
    return <Badge bg={config.bg} className="px-3 py-2">{config.text}</Badge>;
  };

  const getServiceTypeBadge = (type) => {
    return type === 'administrative' ? (
      <Badge bg="outline-primary" className="border-0">
        <FileEarmarkText className="me-1" />
        ADN Hành chính
      </Badge>
    ) : (
      <Badge bg="outline-success" className="border-0">
        <PersonCheck className="me-1" />
        ADN Dân sự
      </Badge>
    );
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-3 text-muted">Đang tải dữ liệu dashboard...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger">
        <i className="bi bi-exclamation-triangle me-2"></i>
        {error}
      </Alert>
    );
  }

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
      </div>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center shadow-sm bg-success text-white h-100">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <Gear className="fs-4 me-2" />
                <h6 className="mb-0">Dịch vụ hoạt động</h6>
              </div>
              <h3 className="fw-bold mb-0">{dashboardData.totalServices}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center shadow-sm bg-primary text-white h-100">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <GraphUp className="fs-4 me-2" />
                <h6 className="mb-0">Quản lý kết quả</h6>
              </div>
              <h3 className="fw-bold mb-0">{dashboardData.totalResults}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center shadow-sm bg-info text-white h-100">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <People className="fs-4 me-2" />
                <h6 className="mb-0">Nhân viên làm việc</h6>
              </div>
              <h3 className="fw-bold mb-0">{dashboardData.totalStaff}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="text-center shadow-sm bg-warning text-white h-100">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <CalendarCheck className="fs-4 me-2" />
                <h6 className="mb-0">Kết quả chờ xử lý</h6>
              </div>
              <h3 className="fw-bold mb-0">{dashboardData.pendingResults}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Featured Services */}
      <Card className="shadow-sm mb-4">
        <Card.Header className="bg-light">
          <h5 className="card-title mb-0">Dịch vụ nổi bật</h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Dịch vụ</th>
                  <th>Loại</th>
                  <th>Giá</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.featuredServices.map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-primary bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center me-3"
                          style={{ width: '40px', height: '40px' }}>
                          <i className={`bi ${service.icon || 'bi-gear'} text-primary`}></i>
                        </div>
                        <div>
                          <div className="fw-medium">{service.title}</div>
                          <small className="text-muted">{service.description}</small>
                        </div>
                      </div>
                    </td>
                    <td>
                      {service.category?.hasLegalValue ? (
                        <Badge bg="warning" text="dark">ADN Hành chính</Badge>
                      ) : (
                        <Badge bg="success" text="white">ADN Dân sự</Badge>
                      )}
                    </td>
                    <td>
                      <div className="fw-medium">{formatPrice(service.price)}</div>
                    </td>
                    <td>
                      <Badge bg={service.isActive ? "success" : "secondary"}>
                        {service.isActive ? "Hoạt động" : "Không hoạt động"}
                      </Badge>
                    </td>
                  </tr>
                ))}
                {dashboardData.featuredServices.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      <i className="bi bi-inbox fs-1 text-muted mb-2 d-block"></i>
                      <p className="text-muted mb-0">Không có dịch vụ nổi bật</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>

      {/* Recent Results */}
      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <h5 className="card-title mb-0">Quản lý kết quả</h5>
        </Card.Header>
        <Card.Body>
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Dịch vụ</th>
                  <th>Ngày hoàn thành</th>
                  <th>Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {dashboardData.recentResults.map((result) => (
                  <tr key={result.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        <div className="bg-success bg-opacity-10 rounded-circle d-inline-flex align-items-center justify-content-center me-3"
                          style={{ width: '40px', height: '40px' }}>
                          <span className="fw-bold text-success">
                            {result.customerName.charAt(0)}
                          </span>
                        </div>
                        <div>
                          <div className="fw-medium">{result.customerName}</div>
                          <small className="text-muted">
                            <i className="bi bi-telephone me-1"></i>
                            {result.phone}
                          </small>
                        </div>
                      </div>
                    </td>
                    <td>
                      <div className="fw-medium">{result.serviceName}</div>
                      {getServiceTypeBadge(result.serviceType)}
                    </td>
                    <td>
                      <div className="fw-medium">{new Date(result.completedDate).toLocaleDateString('vi-VN')}</div>
                      <small className="text-muted">{formatDate(result.completedDate)}</small>
                    </td>
                    <td>
                      {getStatusBadge(result.status)}
                    </td>
                  </tr>
                ))}
                {dashboardData.recentResults.length === 0 && (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      <i className="bi bi-inbox fs-1 text-muted mb-2 d-block"></i>
                      <p className="text-muted mb-0">Không có kết quả gần đây</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default ManagerDashboard; 