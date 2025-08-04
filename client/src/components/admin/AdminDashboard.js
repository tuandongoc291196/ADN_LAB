/**
 * COMPONENT: AdminDashboard
 * CHỨC NĂNG: Layout chính cho tất cả các trang quản trị của hệ thống ADN LAB
 * LUỒNG HOẠT ĐỘNG:
 * 1. Kiểm tra quyền admin từ context và localStorage
 * 2. Tải dữ liệu users và roles từ API getAllUsers() và getAllRoles()
 * 3. Fetch blog count từ API getAllBlogs()
 * 4. Hiển thị sidebar với menu điều hướng và thông tin admin
 * 5. Routing cho các trang con: overview, blog, reports, users, settings, profile
 * 6. Truyền dữ liệu preloaded xuống các component con
 */

import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useLocation, Navigate } from 'react-router-dom';
import { Container, Row, Col, Nav, Card, Alert, Badge } from 'react-bootstrap';
import { useAuth } from '../context/auth';
import { getAllUsers, getAllRoles, getAllBlogs } from '../../services/api';

// Import các component admin con để routing
import AdminOverview from './AdminOverview';
import BlogManagement from './BlogManagement';
import BlogEditor from './BlogEditor';
import AdminReports from './AdminReports';
import UserManagement from './UserManagement';
import SystemSettings from './SystemSettings';
import AdminProfile from './AdminProfile';

const AdminDashboard = () => {
  // ROUTER HOOKS
  const location = useLocation(); // Hook lấy thông tin URL hiện tại để xác định tab đang active
  
  // AUTH CONTEXT
  const { user } = useAuth(); // Context authentication
  
  // STATE QUẢN LÝ UI
  const [activeTab, setActiveTab] = useState('overview'); // Tab đang active
  const [isLoading, setIsLoading] = useState(true); // Loading state cho auth check
  
  // STATE QUẢN LÝ DỮ LIỆU API
  const [allUsers, setAllUsers] = useState([]); // Danh sách users để truyền xuống UserManagement
  const [allRoles, setAllRoles] = useState([]); // Danh sách roles để truyền xuống UserManagement
  const [usersLoading, setUsersLoading] = useState(false); // Loading state cho users data
  const [usersError, setUsersError] = useState(null); // Error state cho users data
  const [blogCount, setBlogCount] = useState(0); // Số lượng blog
  
  /**
   * EFFECT: Cập nhật activeTab khi URL thay đổi
   * BƯỚC 1: Tách URL thành các phần để xác định path hiện tại
   * BƯỚC 2: Xử lý trường hợp đặc biệt cho blog (create/edit)
   * BƯỚC 3: Cập nhật activeTab dựa trên path
   * BƯỚC 4: Load dữ liệu users nếu chuyển đến tab users
   */
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const currentPath = pathSegments[2]; // Lấy phần sau /admin/
    const subPath = pathSegments[3]; // Lấy phần sau /admin/xxx/
    
    // BƯỚC 2: Xử lý trường hợp đặc biệt cho blog (create/edit)
    if (currentPath === 'blog' && (subPath === 'create' || subPath === 'edit')) {
      setActiveTab('blog');
    } else if (currentPath && currentPath.trim() !== '') {
      setActiveTab(currentPath);
      
      // BƯỚC 4: Load dữ liệu users nếu chuyển đến tab users
      if (currentPath === 'users' && allUsers.length === 0) {
        loadUsersData();
      }
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname, allUsers.length]);

  /**
   * API CALL: Load dữ liệu users và roles
   * BƯỚC 1: Kiểm tra nếu đang loading thì return
   * BƯỚC 2: Set loading state và reset error
   * BƯỚC 3: Gọi song song API getAllUsers() và getAllRoles()
   * BƯỚC 4: Cập nhật state với dữ liệu nhận được
   * BƯỚC 5: Xử lý lỗi nếu có
   * BƯỚC 6: Set loading state thành false
   */
  const loadUsersData = async () => {
    if (usersLoading) return; // BƯỚC 1: Tránh load nhiều lần
    
    setUsersLoading(true);
    setUsersError(null);
    
    try {
      // BƯỚC 3: Load song song users và roles
      const [usersResponse, rolesResponse] = await Promise.all([
        getAllUsers(),
        getAllRoles()
      ]);
      
      // BƯỚC 4: Cập nhật state với dữ liệu nhận được
      setAllUsers(usersResponse || []);
      setAllRoles(rolesResponse || []);
      
    } catch (error) {
      // BƯỚC 5: Xử lý lỗi nếu có
      setUsersError(error.message);
    } finally {
      // BƯỚC 6: Set loading state thành false
      setUsersLoading(false);
    }
  };

  /**
   * EFFECT: Kiểm tra auth và set loading
   * BƯỚC 1: Đợi 2.5 giây để context có thể load hoàn toàn
   * BƯỚC 2: Set loading state thành false
   */
  useEffect(() => {
    const checkAuth = () => {
      setTimeout(() => {
        setIsLoading(false);
      }, 2500); 
    };
    
    checkAuth();
  }, [user]);

  /**
   * EFFECT: Fetch blog count từ API
   * BƯỚC 1: Gọi API getAllBlogs()
   * BƯỚC 2: Cập nhật blogCount với số lượng blog
   * BƯỚC 3: Xử lý lỗi nếu có (giữ giá trị mặc định)
   */
  useEffect(() => {
    const fetchBlogCount = async () => {
      try {
        const blogs = await getAllBlogs();
        setBlogCount(blogs.length);
      } catch (error) {
        // BƯỚC 3: Giữ giá trị mặc định nếu API fails
      }
    };

    fetchBlogCount();
  }, []);

  /**
   * HELPER FUNCTION: Kiểm tra quyền admin từ context hoặc localStorage
   * OUTPUT: boolean - true nếu có quyền admin
   * BƯỚC 1: Kiểm tra từ context trước (user?.role?.id === '3')
   * BƯỚC 2: Nếu context chưa có, kiểm tra localStorage
   * BƯỚC 3: Parse userData từ localStorage và kiểm tra role
   * BƯỚC 4: Return true nếu có quyền admin, false nếu không
   */
  const checkAdminRole = () => {
    // BƯỚC 1: Kiểm tra từ context trước
    if (user?.role?.id === '3') {
      return true;
    }
    
    // BƯỚC 2: Nếu context chưa có, kiểm tra localStorage
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        // BƯỚC 3: Kiểm tra role từ localStorage
        if (parsedUser?.role?.id === '3') {
          return true;
        }
      }
    } catch (error) {
      // Xử lý lỗi parse JSON
    }
    
    // BƯỚC 4: Return false nếu không có quyền admin
    return false;
  };

  /**
   * HELPER FUNCTION: Lấy thông tin user từ context hoặc localStorage làm fallback
   * OUTPUT: object - thông tin user hoặc object rỗng
   * BƯỚC 1: Kiểm tra nếu có user từ context
   * BƯỚC 2: Nếu không có, parse userData từ localStorage
   * BƯỚC 3: Return user info hoặc object rỗng
   */
  const getUserInfo = () => {
    if (user) return user;
    
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      // Xử lý lỗi parse JSON
    }
    
    return null;
  };

  /**
   * HELPER FUNCTION: Lấy thống kê từ localStorage và cập nhật với dữ liệu thực
   * OUTPUT: object - thống kê admin
   * BƯỚC 1: Lấy adminStats từ localStorage
   * BƯỚC 2: Parse JSON hoặc sử dụng giá trị mặc định
   * BƯỚC 3: Cập nhật số users từ dữ liệu thực nếu có
   * BƯỚC 4: Return stats object
   */
  const getAdminStats = () => {
    try {
      const adminStats = localStorage.getItem('adminStats');
      let stats = {
        totalUsers: 0,
        totalPosts: 0
      };
      
      if (adminStats) {
        stats = JSON.parse(adminStats);
      }
      
      // BƯỚC 3: Cập nhật số users từ dữ liệu thực nếu có
      if (allUsers.length > 0) {
        stats.totalUsers = allUsers.length;
      }
      
      return stats;
    } catch (error) {
      return {
        totalUsers: allUsers.length || 0,
        totalPosts: 0
      };
    }
  };

  // COMPUTED VALUES
  const hasAdminRole = checkAdminRole();
  const currentUser = getUserInfo() || {};
  const stats = getAdminStats();

  /**
   * CONSTANT DATA: Cấu hình menu items cho sidebar
   * Mỗi item chứa: key, label, icon, path, color và description
   */
  const menuItems = [
    {
      key: 'overview',
      label: 'Tổng quan',
      icon: 'bi-speedometer2',
      path: '/admin/overview',
      color: 'primary',
      description: 'Dashboard tổng quan hệ thống'
    },
    {
      key: 'blog',
      label: 'Quản lý Blog',
      icon: 'bi-newspaper',
      path: '/admin/blog',
      color: 'success',
      description: 'Tạo và quản lý bài viết blog'
    },      
    {
      key: 'reports',
      label: 'Báo cáo & Thống kê',
      icon: 'bi-graph-up',
      path: '/admin/reports',
      color: 'danger',
      description: 'Analytics và báo cáo hệ thống'
    },
    {
      key: 'users',
      label: 'Quản lý tài khoản',
      icon: 'bi-people',
      path: '/admin/users',
      color: 'purple',
      description: 'Quản lý tài khoản người dùng'
    },
    {
      key: 'settings',
      label: 'Cài đặt',
      icon: 'bi-gear',
      path: '/admin/settings',
      color: 'dark',
      description: 'Cấu hình giao diện và xóa cache'
    },
    {
      key: 'profile',
      label: 'Hồ sơ cá nhân',
      icon: 'bi-person-circle',
      path: '/admin/profile',
      color: 'info',
      description: 'Quản lý thông tin cá nhân'
    }
  ];

  // LOADING STATE: Hiển thị loading trong khi kiểm tra auth
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

  // AUTH GUARD: Redirect nếu không có quyền admin
  if (!hasAdminRole) {
    return <Navigate to="/" replace />;
  }

  return (
    <>
      {/* INLINE STYLES: CSS cho animation */}
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      
      {/* MAIN LAYOUT: Container chính */}
      <Container fluid className="py-4">
        <Row>
          {/* SIDEBAR - Menu điều hướng bên trái */}
          <Col lg={3} md={4} className="mb-4">
            <Card className="shadow-lg border-3 border-warning">
              {/* HEADER - Thông tin admin */}
              <Card.Header className="bg-danger text-white text-center py-4 border-bottom border-warning border-3">
                {/* Avatar hoặc icon mặc định */}
                <div className="mb-3">
                  {currentUser.avatar ? (
                    <img 
                      src={currentUser.avatar} 
                      alt="Avatar"
                      className="rounded-circle border border-warning border-3"
                      width="60"
                      height="60"
                      style={{ boxShadow: '0 0 15px rgba(255,193,7,0.5)' }}
                    />
                  ) : (
                    <div className="bg-white bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center border border-warning border-3" 
                         style={{ width: '60px', height: '60px', boxShadow: '0 0 15px rgba(255,193,7,0.5)' }}>
                      <i className="bi bi-shield-check fs-1 text-warning" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)' }}></i>
                    </div>
                  )}
                </div>
                
                {/* Tên và thông tin admin */}
                <h5 className="mb-1 fw-bold text-warning" style={{ textShadow: '2px 2px 4px rgba(0,0,0,0.3)', fontSize: '1.5rem' }}>{currentUser.fullname || 'Administrator'}</h5>
                <p className="mb-1 small opacity-75">{currentUser.email || 'admin@example.com'}</p>
                <p className="mb-1 small opacity-75 fw-bold text-warning" style={{ textShadow: '1px 1px 2px rgba(0,0,0,0.3)' }}>Quản trị viên hệ thống</p>
              </Card.Header>

              {/* MENU - Danh sách các trang quản trị */}
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
                    <div className="flex-grow-1">
                      <div className="fw-medium">{item.label}</div>
                      <small className="text-muted d-block">{item.description}</small>
                    </div>
                  </Nav.Link>
                ))}
              </Nav>
            </Card>
          </Col>

          {/* MAIN CONTENT - Khu vực hiển thị nội dung chính */}
          <Col lg={9} md={8}>
            {/* Header with Welcome Message */}
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h2 className="mb-1">
                  Chào mừng, <span className="text-warning fw-bold" style={{ 
                    textShadow: '2px 2px 4px rgba(0,0,0,0.2)', 
                    fontSize: '1.1em',
                    textDecoration: 'underline',
                    textDecorationColor: '#ffc107'
                  }}>{currentUser.fullname || 'Administrator'}!</span> 
                </h2>
                <p className="text-muted mb-0">
                  <i className="bi bi-clock me-1"></i>
                  Hôm nay là {new Date().toLocaleDateString('vi-VN', { 
                    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
                  })}
                </p>
              </div>
              <div className="d-flex align-items-center">
                <Badge bg="danger" className="me-2 fs-6 px-3 py-2">
                  <i className="bi bi-shield-check me-1"></i>
                  <span className="fw-bold">QUẢN TRỊ VIÊN</span>
                </Badge>
                <i className="bi bi-gear-fill text-warning fs-3" style={{ 
                  animation: 'spin 3s linear infinite',
                  filter: 'drop-shadow(2px 2px 4px rgba(0,0,0,0.3))'
                }}></i>
              </div>
            </div>

            {/* ROUTING - Định tuyến cho các trang con */}
            <Routes>
              <Route index element={<AdminOverview />} />
              <Route path="overview" element={<AdminOverview />} />
              <Route path="blog" element={<BlogManagement />} />
              <Route path="blog/create" element={<BlogEditor />} />
              <Route path="blog/edit/:id" element={<BlogEditor />} />
              <Route path="reports" element={<AdminReports />} />
              <Route path="profile" element={<AdminProfile user={currentUser} />} />
              <Route path="settings" element={<SystemSettings />} />
              <Route 
                path="users" 
                element={
                  <UserManagement 
                    preloadedUsers={allUsers}
                    preloadedRoles={allRoles}
                    usersLoading={usersLoading}
                    usersError={usersError}
                    onRefreshUsers={loadUsersData}
                  />
                } 
              />
            </Routes>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default AdminDashboard;