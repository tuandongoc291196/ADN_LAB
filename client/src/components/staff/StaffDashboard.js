import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Card, Alert, Spinner } from 'react-bootstrap';
import { getUserById } from '../../services/api';

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
  const [activeTab, setActiveTab] = useState('overview');
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      setLoading(true);
      setError(null);
      try {
        const storedUserData = localStorage.getItem('userData');
        let userId = null;
        if (storedUserData) {
          const userData = JSON.parse(storedUserData);
          userId = userData.id || userData.user_id || userData.uid;
        }
        if (!userId) {
          setError('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
          setLoading(false);
          setTimeout(() => navigate('/login'), 2000);
          return;
        }
        const user = await getUserById(userId);
        setCurrentUser(user);
      } catch (err) {
        setError('Không thể lấy thông tin người dùng: ' + err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [navigate]);

  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && path !== 'staff') {
      setActiveTab(path);
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }
  if (error) {
    return <Alert variant="danger" className="mt-4">{error}</Alert>;
  }
  if (!currentUser) {
    return null;
  }

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
      badge: 8,
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
      badge: 5,
      description: 'Thực hiện phân tích ADN'
    },
    {
      key: 'results',
      label: 'Kết quả',
      icon: 'bi-file-earmark-check',
      path: '/staff/results',
      color: 'danger',
      badge: 3,
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
                  className={`d-flex align-items-center py-3 px-4 border-0 ${
                    activeTab === item.key
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