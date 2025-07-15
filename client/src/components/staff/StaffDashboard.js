import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate, Navigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Card, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/auth';

// Import staff dashboard components
import StaffOverview from './StaffOverview';
import KitPreparation from './KitPreparation';
import SampleCollection from './SampleCollection';
import LabTesting from './LabTesting';
import ResultsManagement from './ResultsManagement';
import StaffProfile from './StaffProfile';

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

const StaffDashboard = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && path !== 'staff') {
      setActiveTab(path);
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
      }, 1300); 
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

  // Kiểm tra quyền staff
  if (!user?.role?.id || user.role.id !== '1') {
    return <Navigate to="/" replace />;
  }

  // Tạo currentUser với thông tin từ context
  const currentUser = {
    ...user,
    name: user.fullname || user.name || 'Nhân viên',
    position: 'Nhân viên xét nghiệm',
    employeeId: user.staffId || user.id || 'STF001',
    totalTests: 120, // TODO: Lấy từ API
    completedTests: 105, // TODO: Lấy từ API
    pendingResults: 15 // TODO: Lấy từ API
  };

  const menuItems = [
    {
      key: 'overview',
      label: 'Tổng quan',
      icon: 'bi-house',
      path: '/staff',
      color: 'primary',
      description: 'Dashboard tổng quan công việc'
    },
    {
      key: 'kit-preparation',
      label: 'Chuẩn bị Kit',
      icon: 'bi-box-seam',
      path: '/staff/kit-preparation',
      color: 'success',
      description: 'Chuẩn bị và gửi kit test'
    },
    {
      key: 'sample-collection',
      label: 'Thu mẫu',
      icon: 'bi-droplet',
      path: '/staff/sample-collection',
      color: 'warning',
      badge: currentUser.pendingTests,
      description: 'Tiếp nhận và thu mẫu xét nghiệm'
    },
    {
      key: 'lab-testing',
      label: 'Xét nghiệm',
      icon: 'bi-eye',
      path: '/staff/lab-testing',
      color: 'info',
      description: 'Thực hiện phân tích ADN'
    },
    {
      key: 'results',
      label: 'Kết quả',
      icon: 'bi-file-earmark-check',
      path: '/staff/results',
      color: 'danger',
      description: 'Quản lý và trả kết quả'
    },
    {
      key: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: 'bi-person',
      path: '/staff/profile',
      color: 'secondary',
      description: 'Thông tin cá nhân và ca làm việc'
    }
  ];

  return (
    <Container fluid className="py-4">
      <Row>
        {/* Sidebar */}
        <Col lg={3} md={4} className="mb-4">
          <Card className="shadow-sm">
            {/* Staff Info Header */}
            <Card.Header className="bg-info text-white text-center py-4">
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
                    <i className="bi bi-person-badge fs-1 text-white"></i>
                  </div>
                )}
              </div>
              <h5 className="mb-1">{currentUser.fullname}</h5>
              <p className="mb-1 small opacity-75">{currentUser.email}</p>
              <p className="mb-1 small opacity-75">{getRoleLabel(currentUser.role)}</p>
            </Card.Header>

            {/* Navigation Menu */}
            <Nav className="flex-column" style={{ borderRadius: '0 0 8px 8px' }}>
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
                  <i className={`${item.icon} me-3 fs-5`}></i>
                  <div className="flex-grow-1">
                    <div>{item.label}</div>
                    <small className="text-muted">{item.description}</small>
                  </div>
                  {item.badge && item.badge > 0 && (
                    <span className={`badge bg-${item.color} rounded-pill ms-2`}>
                      {item.badge}
                    </span>
                  )}
                </Nav.Link>
              ))}
            </Nav>

            {/* Quick Stats */}
            <Card.Footer className="bg-light">
              <div className="row text-center">
                <div className="col-4">
                  <div className="fw-bold text-success">{currentUser.totalSamples}</div>
                  <small className="text-muted">Tổng mẫu</small>
                </div>
                <div className="col-4">
                  <div className="fw-bold text-primary">{currentUser.completedTests}</div>
                  <small className="text-muted">Hoàn thành</small>
                </div>
                <div className="col-4">
                  <div className="fw-bold text-warning">{currentUser.pendingTests}</div>
                  <small className="text-muted">Đang xử lý</small>
                </div>
              </div>
            </Card.Footer>
          </Card>

          {/* Work Shift Info */}
          <Card className="shadow-sm mt-3">
            <Card.Body>
              <h6 className="text-info mb-3">
                <i className="bi bi-clock me-2"></i>
                Ca làm việc hôm nay
              </h6>
              <p className="mb-2">
                <strong>{currentUser.workShift}</strong>
              </p>
              <div className="d-flex justify-content-between align-items-center">
                <small className="text-muted">Trạng thái</small>
                <span className="badge bg-success">Đang làm việc</span>
              </div>
            </Card.Body>
          </Card>
        </Col>

        {/* Main Content */}
        <Col lg={9} md={8}>
          <Routes>
            <Route path="/" element={<StaffOverview user={currentUser} />} />
            <Route path="/kit-preparation" element={<KitPreparation user={currentUser} />} />
            <Route path="/sample-collection" element={<SampleCollection user={currentUser} />} />
            <Route path="/lab-testing" element={<LabTesting user={currentUser} />} />
            <Route path="/results" element={<ResultsManagement user={currentUser} />} />
            <Route path="/profile" element={<StaffProfile user={currentUser} />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default StaffDashboard;