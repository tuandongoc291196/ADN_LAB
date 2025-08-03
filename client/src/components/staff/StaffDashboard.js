import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Card, Alert, Spinner } from 'react-bootstrap';
import { useAuth } from '../context/auth';

// Import staff dashboard components
import StaffOverview from './StaffOverview';
import KitPreparation from './KitPreparation';
import SampleCollection from './SampleCollection';
import LabTesting from './LabTesting';
import StaffProfile from './StaffProfile';

/**
 * HELPER FUNCTION: Chuyển đổi role từ database sang label tiếng Việt
 * INPUT: role (object/string) - role từ database
 * OUTPUT: string - label tiếng Việt tương ứng
 */
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
 * COMPONENT: StaffDashboard
 * CHỨC NĂNG: Dashboard chính cho nhân viên phòng xét nghiệm - container chứa sidebar và routing
 * LUỒNG HOẠT ĐỘNG:
 * 1. Kiểm tra authentication và quyền truy cập staff
 * 2. Quản lý state user từ context và localStorage
 * 3. Hiển thị sidebar với thông tin nhân viên và navigation menu
 * 4. Quản lý routing cho các component con (StaffOverview, KitPreparation, etc.)
 * 5. Đồng bộ activeTab với URL hiện tại
 */
const StaffDashboard = () => {
  // ROUTER HOOKS
  const location = useLocation();
  const { user } = useAuth();

  // STATE QUẢN LÝ USER VÀ AUTHENTICATION
  // BƯỚC 1: Lấy user từ localStorage nếu context chưa có
  const cachedUser = (() => {
    try {
      const data = localStorage.getItem('userData');
      return data ? JSON.parse(data) : null;
    } catch {
      return null;
    }
  })();

  // BƯỚC 2: Quản lý state user hiện tại
  const [currentUser, setCurrentUser] = useState(user || cachedUser);
  const [loading, setLoading] = useState(!user && !cachedUser);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // CONSTANT DATA: Menu items cho navigation
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
      badge: currentUser?.pendingTests,
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
      key: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: 'bi-person',
      path: '/staff/profile',
      color: 'secondary',
      description: 'Thông tin cá nhân và ca làm việc'
    }
  ];

  /**
   * EFFECT 1: Đồng bộ activeTab với URL hiện tại
   * BƯỚC 1: Lấy path từ URL
   * BƯỚC 2: Map path sang tab key tương ứng
   * BƯỚC 3: Cập nhật activeTab
   */
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && path !== 'staff') {
      setActiveTab(path);
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  /**
   * EFFECT 2: Quản lý user state khi context thay đổi
   * BƯỚC 1: Nếu có user từ context, cập nhật currentUser và lưu vào localStorage
   * BƯỚC 2: Nếu không có user context nhưng có cachedUser, sử dụng cachedUser
   * BƯỚC 3: Nếu không có user nào, set loading = true
   */
  useEffect(() => {
    if (user) {
      setCurrentUser(user);
      setLoading(false);
      localStorage.setItem('userData', JSON.stringify(user));
    } else if (cachedUser) {
      setCurrentUser(cachedUser);
      setLoading(false);
    } else {
      setLoading(true);
    }
  }, [user]);

  /**
   * EFFECT 3: Đồng bộ activeTab khi pathname hoặc menuItems thay đổi
   * BƯỚC 1: Sắp xếp menuItems theo độ dài path (dài nhất trước)
   * BƯỚC 2: Tìm menu item khớp với pathname hiện tại
   * BƯỚC 3: Cập nhật activeTab
   */
  useEffect(() => {
    const sortedMenu = [...menuItems].sort((a, b) => b.path.length - a.path.length);
    const matched = sortedMenu.find(item =>
      location.pathname === item.path || location.pathname.startsWith(item.path + '/')
    );
    setActiveTab(matched ? matched.key : 'overview');
  }, [location.pathname, menuItems]);

  // BƯỚC 3: Kiểm tra quyền truy cập - chỉ cho phép staff
  if (!currentUser || !currentUser.role || (currentUser.role.id && currentUser.role.id !== '1' && currentUser.role !== 'staff')) {
    return <Navigate to="/" replace />;
  }

  // BƯỚC 4: Hiển thị loading spinner nếu đang tải
  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center" style={{ minHeight: '60vh' }}>
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  // BƯỚC 5: Hiển thị error nếu có lỗi
  if (error) {
    return <Alert variant="danger" className="mt-4">{error}</Alert>;
  }

  // BƯỚC 6: Kiểm tra user tồn tại
  if (!currentUser) {
    return null;
  }

  // BƯỚC 7: Chuẩn bị dữ liệu user để hiển thị với các trường mặc định
  const displayUser = {
    ...currentUser,
    name: currentUser.fullname || currentUser.name || 'Nhân viên',
    position: currentUser.position || 'Nhân viên xét nghiệm',
    employeeId: currentUser.staffId || currentUser.id || 'STF001',
    totalSamples: currentUser.totalSamples || 120, // TODO: Lấy từ API nếu có
    completedTests: currentUser.completedTests || 105, // TODO: Lấy từ API nếu có
    pendingTests: currentUser.pendingTests || 15, // TODO: Lấy từ API nếu có
    workShift: currentUser.workShift || 'Sáng 8:00 - 12:00', // TODO: Lấy từ API nếu có
  };

  return (
    <Container fluid className="py-4">
      <Row>
        {/* SIDEBAR: Thông tin nhân viên và navigation */}
        <Col lg={3} md={4} className="mb-4">
          <Card className="shadow-sm">
            {/* CARD HEADER: Thông tin nhân viên */}
            <Card.Header className="bg-info text-white text-center py-4">
              {/* Avatar */}
              <div className="mb-3">
                {displayUser.avatar ? (
                  <img
                    src={displayUser.avatar}
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

              {/* Thông tin cá nhân */}
              <h5 className="mb-1">{displayUser.fullname}</h5>
              <p className="mb-1 small opacity-75">{displayUser.email}</p>
              <p className="mb-1 small opacity-75">{getRoleLabel(displayUser.role)}</p>
            </Card.Header>

            {/* NAVIGATION MENU: Menu điều hướng */}
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
                  {/* Icon menu */}
                  <i className={`${item.icon} me-3 fs-5`}></i>

                  {/* Thông tin menu item */}
                  <div className="flex-grow-1">
                    <div>{item.label}</div>
                    <small className="text-muted">{item.description}</small>
                  </div>

                  {/* Badge số lượng (nếu có) */}
                  {item.badge && item.badge > 0 && (
                    <span className={`badge bg-${item.color} rounded-pill ms-2`}>
                      {item.badge}
                    </span>
                  )}
                </Nav.Link>
              ))}
            </Nav>
          </Card>
        </Col>

        {/* MAIN CONTENT: Routing cho các component con */}
        <Col lg={9} md={8}>
          <Routes>
            {/* Route chính - StaffOverview */}
            <Route path="/" element={<StaffOverview user={displayUser} />} />
            
            {/* Route cho KitPreparation */}
            <Route path="/kit-preparation" element={<KitPreparation user={displayUser} />} />
            <Route path="/kit-preparation/:bookingId" element={<KitPreparation user={displayUser} />} />
            
            {/* Route cho SampleCollection */}
            <Route path="/sample-collection" element={<SampleCollection user={displayUser} />} />
            <Route path="/sample-collection/:bookingId" element={<SampleCollection user={displayUser} />} />
            
            {/* Route cho LabTesting */}
            <Route path="/lab-testing" element={<LabTesting user={displayUser} />} />
            <Route path="/lab-testing/:bookingId" element={<LabTesting user={displayUser} />} />
            
            {/* Route cho StaffProfile */}
            <Route path="/profile" element={<StaffProfile user={displayUser} />} />
            
            {/* Fallback route */}
            <Route path="*" element={<StaffOverview user={displayUser} />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default StaffDashboard;