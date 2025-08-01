/**
 * COMPONENT: AdminDashboard
 * MỤC ĐÍCH: Layout chính cho tất cả các trang quản trị của hệ thống ADN LAB
 * CHỨC NĂNG: 
 * - Hiển thị sidebar với menu điều hướng
 * - Thông tin admin và thống kê nhanh
 * - Routing cho các trang con của admin
 * - Hiển thị trạng thái hệ thống
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
  // Hook lấy thông tin URL hiện tại để xác định tab đang active
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();
  
  // State để lưu dữ liệu users để truyền xuống UserManagement
  const [allUsers, setAllUsers] = useState([]);
  const [allRoles, setAllRoles] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);
  
  // State để lưu blog count
  const [blogCount, setBlogCount] = useState(0);
  


  // Effect cập nhật activeTab khi URL thay đổi
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const currentPath = pathSegments[2]; // Lấy phần sau /admin/
    const subPath = pathSegments[3]; // Lấy phần sau /admin/xxx/
    
    // Debug logging (chỉ trong development)
    if (process.env.NODE_ENV === 'development') {
      console.log('AdminDashboard URL:', location.pathname, '-> currentPath:', currentPath, 'subPath:', subPath);
    }
    
    // Nếu đang ở trang con của blog (create/edit), vẫn giữ blog tab active
    if (currentPath === 'blog' && (subPath === 'create' || subPath === 'edit')) {
      setActiveTab('blog');
    } else if (currentPath && currentPath.trim() !== '') {
      setActiveTab(currentPath);
      
      // Nếu chuyển đến tab users, load dữ liệu users
      if (currentPath === 'users' && allUsers.length === 0) {
        loadUsersData();
      }
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname, allUsers.length]);

  // Function để load dữ liệu users và roles
  const loadUsersData = async () => {
    if (usersLoading) return; // Tránh load nhiều lần
    
    setUsersLoading(true);
    setUsersError(null);
    
    try {
      console.log('Loading users data for admin dashboard...');
      
      // Load song song users và roles
      const [usersResponse, rolesResponse] = await Promise.all([
        getAllUsers(),
        getAllRoles()
      ]);
      
      setAllUsers(usersResponse || []);
      setAllRoles(rolesResponse || []);
      
      console.log('Users data loaded successfully:', {
        usersCount: usersResponse?.length || 0,
        rolesCount: rolesResponse?.length || 0
      });
      
    } catch (error) {
      console.error('Error loading users data:', error);
      setUsersError(error.message);
    } finally {
      setUsersLoading(false);
    }
  };

  // Effect để kiểm tra auth và set loading
  useEffect(() => {
    const checkAuth = () => {
      // Đợi lâu hơn để context có thể load hoàn toàn
      setTimeout(() => {
        setIsLoading(false);
      }, 2500); 
    };
    
    checkAuth();
  }, [user]);

  // Effect để fetch blog count
  useEffect(() => {
    const fetchBlogCount = async () => {
      try {
        const blogs = await getAllBlogs();
        setBlogCount(blogs.length);
      } catch (error) {
        console.error('Error fetching blog count:', error);
        // Keep default value if API fails
      }
    };

    fetchBlogCount();
  }, []);



  // Kiểm tra quyền admin từ context hoặc localStorage - MẠNH MẼ HƠN
  const checkAdminRole = () => {
    console.log('Checking admin role...', { user, isLoading });
    
    // Kiểm tra từ context trước
    if (user?.role?.id === '3') {
      console.log('Admin role check PASSED from context');
      return true;
    }
    
    // Nếu context chưa có, kiểm tra localStorage
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        const parsedUser = JSON.parse(userData);
        console.log('Checking localStorage userData:', parsedUser);
        if (parsedUser?.role?.id === '3') {
          console.log('Admin role check PASSED from localStorage');
          return true;
        }
      }
    } catch (error) {
      console.error('Error parsing userData from localStorage:', error);
    }
    
    console.log('Admin role check FAILED');
    return false;
  };

  // Hiển thị loading trong khi kiểm tra auth
  if (isLoading) {
    console.log('Admin dashboard still loading...');
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

  const hasAdminRole = checkAdminRole();
  
  if (!hasAdminRole) {
    console.log('Redirecting to home - no admin role');
    return <Navigate to="/" replace />;
  }

  // Lấy thông tin user từ context hoặc localStorage làm fallback
  const getUserInfo = () => {
    if (user) return user;
    
    try {
      const userData = localStorage.getItem('userData');
      if (userData) {
        return JSON.parse(userData);
      }
    } catch (error) {
      console.error('Error parsing userData from localStorage:', error);
    }
    
    return null;
  };

  const currentUser = getUserInfo() || {};

  // Lấy thống kê từ localStorage và cập nhật với dữ liệu thực
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
      
      // Cập nhật số users từ dữ liệu thực nếu có
      if (allUsers.length > 0) {
        stats.totalUsers = allUsers.length;
      }
      
      return stats;
    } catch (error) {
      console.error('Error parsing adminStats from localStorage:', error);
      return {
        totalUsers: allUsers.length || 0,
        totalPosts: 0
      };
    }
  };

  const stats = getAdminStats();

  // Cấu hình menu items cho sidebar
  // Mỗi item chứa: key, label, icon, path, color và description
  const menuItems = [
    {
      key: 'overview',
      label: 'Tổng quan',
      icon: 'bi-speedometer2', // Bootstrap icon
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

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
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
              
              {/* Tên và thông tin admin - giống manager */}
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
          {/* Header with Welcome Message - Inspired by Manager */}
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