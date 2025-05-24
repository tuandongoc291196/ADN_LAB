import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Badge, Table } from 'react-bootstrap';

const Sitemap = () => {
  const routes = [
    {
      category: 'Trang chính',
      icon: 'bi-house',
      color: 'primary',
      routes: [
        { path: '/', name: 'Trang chủ', description: 'Landing page với hero section, dịch vụ, testimonials', status: 'ready' },
        { path: '/about', name: 'Giới thiệu', description: 'Thông tin về trung tâm, đội ngũ chuyên gia', status: 'ready' },
        { path: '/contact', name: 'Liên hệ', description: 'Thông tin liên hệ, bản đồ, form liên hệ', status: 'development' },
        { path: '/prices', name: 'Bảng giá', description: 'Giá các dịch vụ xét nghiệm ADN', status: 'development' }
      ]
    },
    {
      category: 'Xác thực',
      icon: 'bi-person-lock',
      color: 'success',
      routes: [
        { path: '/login', name: 'Đăng nhập', description: 'Form đăng nhập với validation', status: 'ready' },
        { path: '/register', name: 'Đăng ký', description: 'Form đăng ký tài khoản mới', status: 'ready' },
        { path: '/forgot-password', name: 'Quên mật khẩu', description: 'Reset password functionality', status: 'planned' }
      ]
    },
    {
      category: 'Dịch vụ',
      icon: 'bi-gear',
      color: 'info',
      routes: [
        { path: '/services', name: 'Danh sách dịch vụ', description: 'Tất cả dịch vụ với filter & search', status: 'ready' },
        { path: '/services/:id', name: 'Chi tiết dịch vụ', description: 'Thông tin chi tiết, quy trình, FAQ', status: 'ready' },
        { path: '/services/category/:category', name: 'Dịch vụ theo danh mục', description: 'Filter theo loại dịch vụ', status: 'ready' }
      ]
    },
    {
      category: 'Đặt lịch & Theo dõi',
      icon: 'bi-calendar-check',
      color: 'warning',
      routes: [
        { path: '/appointment', name: 'Đặt lịch xét nghiệm', description: '4-step booking process với validation', status: 'development' },
        { path: '/booking-confirmation', name: 'Xác nhận đặt lịch', description: 'Trang xác nhận sau khi đặt lịch thành công', status: 'development' },
        { path: '/tracking', name: 'Tra cứu trạng thái', description: 'Search và theo dõi đơn hàng', status: 'development' },
        { path: '/tracking/:trackingId', name: 'Chi tiết trạng thái', description: 'Timeline chi tiết với actions', status: 'development' }
      ]
    },
    {
      category: 'Customer Dashboard',
      icon: 'bi-speedometer2',
      color: 'primary',
      routes: [
        { path: '/user', name: 'Tổng quan', description: 'Dashboard overview với statistics', status: 'ready' },
        { path: '/user/appointments', name: 'Lịch hẹn của tôi', description: 'Quản lý lịch hẹn với tabs & filters', status: 'ready' },
        { path: '/user/results', name: 'Kết quả xét nghiệm', description: 'Xem & tải kết quả với modal chi tiết', status: 'ready' },
        { path: '/user/profile', name: 'Hồ sơ cá nhân', description: 'Quản lý thông tin với 3 tabs', status: 'ready' },
        { path: '/user/history', name: 'Lịch sử đặt hẹn', description: 'Order history với analytics & invoice', status: 'ready' },
        { path: '/user/support', name: 'Hỗ trợ & Phản hồi', description: 'Support center với tickets, FAQ, feedback', status: 'ready' }
      ]
    },
    {
      category: 'Staff Dashboard',
      icon: 'bi-person-badge',
      color: 'secondary',
      routes: [
        { path: '/staff', name: 'Dashboard nhân viên', description: 'Trang tổng quan cho nhân viên', status: 'basic' },
        { path: '/staff/appointments', name: 'Lịch hẹn hôm nay', description: 'Danh sách appointments cần xử lý', status: 'planned' },
        { path: '/staff/samples', name: 'Quản lý mẫu', description: 'Thu thập và xử lý mẫu xét nghiệm', status: 'planned' },
        { path: '/staff/customers', name: 'Khách hàng', description: 'Thông tin và lịch sử khách hàng', status: 'planned' }
      ]
    },
    {
      category: 'Manager Dashboard',
      icon: 'bi-briefcase',
      color: 'purple',
      routes: [
        { path: '/manager', name: 'Dashboard quản lý', description: 'Trang tổng quan cho manager', status: 'basic' },
        { path: '/manager/reports', name: 'Báo cáo', description: 'Analytics và reports chi tiết', status: 'planned' },
        { path: '/manager/staff', name: 'Quản lý nhân viên', description: 'Quản lý team và performance', status: 'planned' },
        { path: '/manager/services', name: 'Quản lý dịch vụ', description: 'Cấu hình dịch vụ và giá', status: 'planned' }
      ]
    },
    {
      category: 'Admin Dashboard',
      icon: 'bi-shield-check',
      color: 'danger',
      routes: [
        { path: '/admin', name: 'Dashboard admin', description: 'Trang quản trị hệ thống', status: 'planned' },
        { path: '/admin/users', name: 'Quản lý người dùng', description: 'User management & permissions', status: 'planned' },
        { path: '/admin/system', name: 'Cài đặt hệ thống', description: 'System configuration', status: 'planned' },
        { path: '/admin/analytics', name: 'Analytics', description: 'Thống kê toàn hệ thống', status: 'planned' }
      ]
    },
    {
      category: 'Thư viện & Kiến thức',
      icon: 'bi-book',
      color: 'info',
      routes: [
        { path: '/library', name: 'Thư viện ADN', description: 'Hub của các kiến thức về ADN', status: 'development' },
        { path: '/library/technology', name: 'Công nghệ ADN', description: 'Thông tin về công nghệ và quy trình', status: 'development' },
        { path: '/library/samples', name: 'Mẫu xét nghiệm', description: 'Hướng dẫn về các loại mẫu', status: 'development' },
        { path: '/library/guides', name: 'Hướng dẫn', description: 'Các hướng dẫn chi tiết', status: 'development' }
      ]
    },
    {
      category: 'Phản hồi & Hỗ trợ',
      icon: 'bi-chat-heart',
      color: 'success',
      routes: [
        { path: '/feedback/:serviceId', name: 'Đánh giá dịch vụ', description: 'Form feedback cho từng dịch vụ', status: 'ready' },
        { path: '/support', name: 'Hỗ trợ khách hàng', description: 'Trang hỗ trợ chung', status: 'planned' }
      ]
    },
    {
      category: 'Legal & Chính sách',
      icon: 'bi-file-earmark-text',
      color: 'dark',
      routes: [
        { path: '/terms', name: 'Điều khoản dịch vụ', description: 'Terms of service', status: 'development' },
        { path: '/privacy', name: 'Chính sách bảo mật', description: 'Privacy policy', status: 'development' }
      ]
    }
  ];

  const getStatusBadge = (status) => {
    switch (status) {
      case 'ready':
        return <Badge bg="success">Hoàn thành</Badge>;
      case 'development':
        return <Badge bg="warning">Đang phát triển</Badge>;
      case 'basic':
        return <Badge bg="info">Cơ bản</Badge>;
      case 'planned':
        return <Badge bg="secondary">Đã lên kế hoạch</Badge>;
      default:
        return <Badge bg="light" text="dark">Không xác định</Badge>;
    }
  };

  const getTotalByStatus = (status) => {
    return routes.reduce((total, category) => {
      return total + category.routes.filter(route => route.status === status).length;
    }, 0);
  };

  const totalRoutes = routes.reduce((total, category) => total + category.routes.length, 0);

  return (
    <Container className="py-5">
      {/* Header */}
      <Row className="mb-5">
        <Col>
          <div className="text-center">
            <h1 className="display-4 fw-bold mb-3">
              <i className="bi bi-map text-primary me-3"></i>
              Sơ đồ trang web ADN LAB
            </h1>
            <p className="lead text-muted mb-4">
              Danh sách đầy đủ tất cả các trang và chức năng trong hệ thống
            </p>
            
            {/* Statistics */}
            <Row className="justify-content-center">
              <Col lg={8}>
                <Row>
                  <Col md={3} className="mb-3">
                    <Card className="border-success">
                      <Card.Body className="text-center py-3">
                        <div className="h3 text-success mb-1">{getTotalByStatus('ready')}</div>
                        <small className="text-muted">Hoàn thành</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Card className="border-warning">
                      <Card.Body className="text-center py-3">
                        <div className="h3 text-warning mb-1">{getTotalByStatus('development')}</div>
                        <small className="text-muted">Đang phát triển</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Card className="border-secondary">
                      <Card.Body className="text-center py-3">
                        <div className="h3 text-secondary mb-1">{getTotalByStatus('planned')}</div>
                        <small className="text-muted">Đã lên kế hoạch</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3} className="mb-3">
                    <Card className="border-primary">
                      <Card.Body className="text-center py-3">
                        <div className="h3 text-primary mb-1">{totalRoutes}</div>
                        <small className="text-muted">Tổng cộng</small>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </Col>
            </Row>
          </div>
        </Col>
      </Row>

      {/* Route Categories */}
      <Row>
        {routes.map((category, index) => (
          <Col key={index} lg={6} className="mb-4">
            <Card className="shadow-sm h-100">
              <Card.Header className={`bg-${category.color} text-white`}>
                <h5 className="mb-0">
                  <i className={`${category.icon} me-2`}></i>
                  {category.category}
                  <Badge bg="light" text="dark" className="ms-2">
                    {category.routes.length} trang
                  </Badge>
                </h5>
              </Card.Header>
              <Card.Body className="p-0">
                <Table className="mb-0" hover>
                  <tbody>
                    {category.routes.map((route, routeIndex) => (
                      <tr key={routeIndex}>
                        <td style={{ width: '30%' }}>
                          {route.status === 'ready' ? (
                            <Link 
                              to={route.path.includes(':') ? route.path.replace(':id', '1').replace(':serviceId', '1').replace(':trackingId', 'ADN123456').replace(':category', 'dna-testing') : route.path}
                              className="text-decoration-none fw-bold"
                            >
                              {route.name}
                            </Link>
                          ) : (
                            <span className="fw-bold text-muted">{route.name}</span>
                          )}
                          <div className="small text-muted">{route.path}</div>
                        </td>
                        <td>
                          <div className="small text-muted">{route.description}</div>
                        </td>
                        <td style={{ width: '20%' }} className="text-end">
                          {getStatusBadge(route.status)}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      {/* Development Notes */}
      <Row className="mt-5">
        <Col>
          <Card className="border-info">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">
                <i className="bi bi-info-circle me-2"></i>
                Ghi chú phát triển
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <h6 className="text-info">Trạng thái các trang:</h6>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <Badge bg="success" className="me-2">Hoàn thành</Badge>
                      Trang đã được phát triển đầy đủ và sẵn sàng sử dụng
                    </li>
                    <li className="mb-2">
                      <Badge bg="warning" className="me-2">Đang phát triển</Badge>
                      Trang đang được phát triển, có thể có placeholder content
                    </li>
                    <li className="mb-2">
                      <Badge bg="info" className="me-2">Cơ bản</Badge>
                      Trang có layout cơ bản, cần bổ sung chức năng
                    </li>
                    <li>
                      <Badge bg="secondary" className="me-2">Đã lên kế hoạch</Badge>
                      Trang trong roadmap phát triển
                    </li>
                  </ul>
                </Col>
                <Col md={6}>
                  <h6 className="text-info">Tính năng nổi bật:</h6>
                  <ul className="small">
                    <li>✅ Responsive design toàn bộ hệ thống</li>
                    <li>✅ Customer Dashboard hoàn chỉnh với 6 tabs</li>
                    <li>✅ Booking system 4 bước với validation</li>
                    <li>✅ Order tracking với timeline chi tiết</li>
                    <li>✅ Service catalog với search & filter</li>
                    <li>🔄 Staff/Manager/Admin dashboards đang phát triển</li>
                    <li>📋 API integration sẵn sàng</li>
                  </ul>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Sitemap;