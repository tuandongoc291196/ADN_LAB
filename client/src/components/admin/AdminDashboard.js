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
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { Container, Row, Col, Nav, Card, Alert, Badge } from 'react-bootstrap';

// Import các component admin con để routing
import AdminOverview from './AdminOverview';
import BlogManagement from './BlogManagement';
import AdminReports from './AdminReports';
import UserManagement from './UserManagement';
import SystemSettings from './SystemSettings';
import StaffManagementByAdmin from './StaffManagementByAdmin';

const AdminDashboard = ({ user }) => {
  // Hook lấy thông tin URL hiện tại để xác định tab đang active
  const location = useLocation();
  const [activeTab, setActiveTab] = useState('overview');

  // Effect cập nhật activeTab khi URL thay đổi
  useEffect(() => {
    const path = location.pathname.split('/').pop();
    if (path && path !== 'admin') {
      setActiveTab(path);
    } else {
      setActiveTab('overview');
    }
  }, [location.pathname]);

  // Dữ liệu mặc định của admin nếu không có props user
  const adminUser = user || {
    id: 1,
    name: 'Admin ADN LAB',
    email: 'admin@adnlab.vn',
    role: 'admin',
    avatar: null,
    permissions: ['all']
  };

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
      key: 'staff',
      label: 'Quản lý nhân viên',
      icon: 'bi-book',
      path: '/admin/staff',
      color: 'info',
      description: 'Quản lý nhân viên'
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
      label: 'Quản lý người dùng',
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
                {adminUser.avatar ? (
                  <img 
                    src={adminUser.avatar} 
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
              <h5 className="mb-1">{adminUser.name}</h5>
              <Badge bg="warning" text="dark" className="mb-2">
                <i className="bi bi-crown me-1"></i>
                Administrator
              </Badge>
              
              {/* Email admin */}
              <div className="mt-2">
                <small className="d-block opacity-75">
                  <i className="bi bi-envelope me-1"></i>
                  {adminUser.email}
                </small>
              </div>
            </Card.Header>

            {/* STATS - Thống kê nhanh */}
            <Card.Body className="py-3">
              <Row className="text-center g-0">
                <Col xs={4}>
                  <div className="py-2">
                    <div className="h5 mb-0 text-primary">1,234</div>
                    <small className="text-muted">Người dùng</small>
                  </div>
                </Col>
                <Col xs={4} className="border-start border-end">
                  <div className="py-2">
                    <div className="h5 mb-0 text-success">89</div>
                    <small className="text-muted">Bài viết</small>
                  </div>
                </Col>
                <Col xs={4}>
                  <div className="py-2">
                    <div className="h5 mb-0 text-warning">15</div>
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
          {/* React Router để hiển thị component tương ứng với đường dẫn */}
          <Routes>
            <Route path="/" element={<AdminOverview user={adminUser} />} />
            <Route path="/overview" element={<AdminOverview user={adminUser} />} />
            <Route path="/blog/*" element={<BlogManagement user={adminUser} />} />
            <Route path="/staff/*" element={<StaffManagementByAdmin user={adminUser} />} />
            <Route path="/reports/*" element={<AdminReports user={adminUser} />} />
            <Route path="/users/*" element={<UserManagement user={adminUser} />} />
            <Route path="/settings/*" element={<SystemSettings user={adminUser} />} />
          </Routes>
        </Col>
      </Row>
    </Container>
  );
};

export default AdminDashboard;