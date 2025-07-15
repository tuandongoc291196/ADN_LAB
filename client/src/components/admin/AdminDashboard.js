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

// Import các component admin con để routing
import AdminOverview from './AdminOverview';
import BlogManagement from './BlogManagement';
import BlogEditor from './BlogEditor';
import AdminReports from './AdminReports';
import UserManagement from './UserManagement';
import SystemSettings from './SystemSettings';

const AdminDashboard = () => {
  // Hook lấy thông tin URL hiện tại để xác định tab đang active
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  // Effect cập nhật activeTab khi URL thay đổi
  useEffect(() => {
    const pathSegments = location.pathname.split('/');
    const currentPath = pathSegments[2]; // Lấy phần sau /admin/
    const subPath = pathSegments[3]; // Lấy phần sau /admin/xxx/
    
    // Nếu đang ở trang con của blog (create/edit), vẫn giữ blog tab active
    if (currentPath === 'blog' && (subPath === 'create' || subPath === 'edit')) {
      setActiveTab('blog');
    } else if (currentPath) {
      setActiveTab(currentPath);
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  // Effect để kiểm tra auth và set loading
  useEffect(() => {
    const checkAuth = () => {
      // Đợi lâu hơn để context có thể load hoàn toàn
      setTimeout(() => {
        setIsLoading(false);
      }, 500); // Tăng từ 100ms lên 500ms
    };
    
    checkAuth();
  }, [user]);

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

  // Lấy thống kê từ localStorage
  const getAdminStats = () => {
    try {
      const adminStats = localStorage.getItem('adminStats');
      if (adminStats) {
        return JSON.parse(adminStats);
      }
    } catch (error) {
      console.error('Error parsing adminStats from localStorage:', error);
    }
    return {
      totalUsers: 0,
      totalPosts: 0,
      totalGuides: 0
    };
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
    }
  ];

  return (
    <Container fluid className="py-4">
      <Row>
        {/* SIDEBAR - Menu điều hướng bên trái */}
        <Col lg={3} md={4} className="mb-4">
          <Card className="shadow-sm">
            {/* HEADER - Thông tin admin */}
            <Card.Header className="bg-danger text-white text-center py-4">
              {/* Avatar hoặc icon mặc định */}
              <div className="mb-3">
                {currentUser.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt="Avatar"
                    className="rounded-circle"
                    style={{ width: '80px', height: '80px', objectFit: 'cover' }}
                  />
                ) : (
                  <div className="bg-white text-danger rounded-circle mx-auto d-flex align-items-center justify-content-center"
                       style={{ width: '80px', height: '80px' }}>
                    <i className="bi bi-shield-check fs-1"></i>
                  </div>
                )}
              </div>
              
              {/* Tên và role của admin */}
              <h5 className="mb-1">{currentUser.fullname || 'Administrator'}</h5>
              <Badge bg="warning" text="dark" className="mb-2">
                <i className="bi bi-crown me-1"></i>
                Administrator
              </Badge>
              
              {/* Email admin */}
              <div className="mt-2">
                <small className="d-block opacity-75">
                  <i className="bi bi-envelope me-1"></i>
                  {currentUser.email || 'admin@example.com'}
                </small>
              </div>
            </Card.Header>

            {/* STATS - Thống kê nhanh */}
            <Card.Body className="py-3">
              <Row className="text-center g-0">
                <Col xs={4}>
                  <div className="py-2">
                    <div className="h5 mb-0 text-primary">{stats.totalUsers || 0}</div>
                    <small className="text-muted">Người dùng</small>
                  </div>
                </Col>
                <Col xs={4} className="border-start border-end">
                  <div className="py-2">
                    <div className="h5 mb-0 text-success">{stats.totalPosts || 0}</div>
                    <small className="text-muted">Bài viết</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="py-2">
                    <div className="h5 mb-0 text-warning">{stats.totalGuides || 0}</div>
                    <small className="text-muted">Hướng dẫn</small>
                  </div>
                </Col>
              </Row>
            </Card.Body>

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

            {/* FOOTER - Trạng thái hệ thống */}
            <Card.Footer className="bg-light">
              <div className="small">
                <div className="d-flex justify-content-between mb-2">
                  <span>Hệ thống:</span>
                  <Badge bg="success">Online</Badge>
                </div>
                <div className="d-flex justify-content-between mb-2">
                  <span>Database:</span>
                  <Badge bg="success">Connected</Badge>
                </div>
                <div className="d-flex justify-content-between">
                  <span>Backup:</span>
                  <Badge bg="info">Auto</Badge>
                </div>
              </div>
            </Card.Footer>
          </Card>
        </Col>

        {/* MAIN CONTENT - Khu vực hiển thị nội dung chính */}
        <Col lg={9} md={8}>
          <Routes>
            <Route index element={<AdminOverview />} />
            <Route path="overview" element={<AdminOverview />} />
            <Route path="blog" element={<BlogManagement />} />
            <Route path="blog/create" element={<BlogEditor />} />
            <Route path="blog/edit/:id" element={<BlogEditor />} />
            <Route path="reports" element={<AdminReports />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="settings" element={<SystemSettings />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;