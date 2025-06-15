import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Button, Badge, Image } from 'react-bootstrap';
import { auth, logout, adminEmails, staffEmails, managerEmails } from './config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const MainNavbar = ({ setUser }) => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [userAuth, loadingAuth] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [logoUrl] = useState('https://firebasestorage.googleapis.com/v0/b/su25-swp391-g8.firebasestorage.app/o/assets%2Flogo.png?alt=media&token=1c903ba1-852a-4f5b-b498-97c31ffbb742');

  const getUserRole = (email) => {
    if (adminEmails.includes(email)) return 'admin';
    if (staffEmails.includes(email)) return 'staff';
    if (managerEmails.includes(email)) return 'manager';
    return 'customer';
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { bg: 'danger', icon: 'bi-crown', text: 'Admin' },
      staff: { bg: 'info', icon: 'bi-person-badge', text: 'Staff' },
      manager: { bg: 'warning', icon: 'bi-briefcase', text: 'Manager' },
      customer: { bg: 'primary', icon: 'bi-person', text: 'Khách hàng' }
    };
    
    const config = roleConfig[role] || roleConfig.customer;
    return (
      <Badge bg={config.bg} className="ms-2">
        <i className={`${config.icon} me-1`}></i>
        {config.text}
      </Badge>
    );
  };

  const getDashboardLink = (role) => {
    switch (role) {
      case 'admin': return '/admin';
      case 'staff': return '/staff';
      case 'manager': return '/manager';
      case 'customer': return '/user';
      default: return '/user';
    }
  };

  useEffect(() => {
    if (userAuth) {
      const storedUserData = localStorage.getItem('userData');
      let enhancedUserData = null;
      
      if (storedUserData) {
        const parsed = JSON.parse(storedUserData);
        const detectedRole = getUserRole(userAuth.email);
        
        // Enhance user data with role detection
        enhancedUserData = {
          ...parsed,
          role_string: detectedRole,
          role: ['admin', 'staff', 'manager'].includes(detectedRole), // Keep boolean for backward compatibility
          email: userAuth.email,
          displayName: userAuth.displayName,
          photoURL: userAuth.photoURL
        };
        
        setUserData(enhancedUserData);
        setUser(enhancedUserData);
        
        // Update localStorage with enhanced data
        localStorage.setItem('isAuthenticated', 'true');
      } else {
        // Create user data if not exists
        const detectedRole = getUserRole(userAuth.email);
        enhancedUserData = {
          user_id: userAuth.uid,
          fullname: userAuth.displayName || userAuth.email.split('@')[0],
          email: userAuth.email,
          role_string: detectedRole,
          role: ['admin', 'staff', 'manager'].includes(detectedRole),
          avatar: userAuth.photoURL,
          verified: userAuth.emailVerified,
          authProvider: 'firebase'
        };
        
        setUserData(enhancedUserData);
        setUser(enhancedUserData);
        localStorage.setItem('isAuthenticated', 'true');
      }
    } else {
      setUserData(null);
      setUser(null);
      localStorage.removeItem('user');
      localStorage.removeItem('isAuthenticated');
    }
  }, [userAuth, setUser]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('user_id');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    setUser(null);
    navigate('/');
  };

  const handleNavClick = () => {
    setExpanded(false);
  };

  const isActive = (path) => {
    return location.pathname === path;
  };

  const isServiceActive = () => {
    return location.pathname.startsWith('/services');
  };

  // Check if user has admin/staff/manager access
  const hasAdminAccess = () => {
    return userData?.role || userData?.role_string === 'admin' || userData?.role_string === 'staff' || userData?.role_string === 'manager';
  };

  return (
    <>
      <Navbar 
        bg="white" 
        expand="lg" 
        sticky="top" 
        className="shadow-sm border-bottom"
        expanded={expanded}
        onToggle={setExpanded}
      >
        <Container>
          {/* Brand Logo */}
          <Navbar.Brand as={Link} to="/" className="fw-bold d-flex align-items-center">
            {/* Logo Section */}
            <div className="me-2 d-flex align-items-center justify-content-center" style={{ width: '50px', height: '50px' }}>
              {logoUrl ? (
                <Image 
                  src={logoUrl} 
                  alt="ADN LAB Logo"
                  style={{ 
                    width: '100%', 
                    height: '100%', 
                    objectFit: 'contain',
                    borderRadius: '8px'
                  }}
                  onError={(e) => {
                    // Fallback khi logo không load được
                    e.target.style.display = 'none';
                    e.target.parentElement.querySelector('.fallback-icon').style.display = 'flex';
                  }}
                />
              ) : null}
              
              {/* Fallback icon */}
              <div 
                className="bg-primary rounded-circle p-2 fallback-icon"
                style={{ display: logoUrl ? 'none' : 'flex' }}
              >
                <i className="bi bi-dna text-white fs-5"></i>
              </div>
            </div>
            
            <div>
              <span className="text-primary fs-4">ADN LAB</span>
              <div className="small text-muted" style={{ fontSize: '0.7rem', lineHeight: '1' }}>
                Trung tâm xét nghiệm ADN
              </div>
            </div>
          </Navbar.Brand>

          {/* Mobile Toggle */}
          <Navbar.Toggle aria-controls="navbar-nav" />

          <Navbar.Collapse id="navbar-nav">
            {/* Main Navigation */}
            <Nav className="me-auto">
              <Nav.Link 
                as={Link} 
                to="/" 
                className={`fw-medium ${isActive('/') ? 'active text-primary' : ''}`}
                onClick={handleNavClick}
              >
                <i className="bi bi-house me-2"></i>
                Trang chủ
              </Nav.Link>

              {/* Services Dropdown */}
              <NavDropdown 
                title={
                  <span className={`fw-medium ${isServiceActive() ? 'text-primary' : ''}`}>
                    <i className="bi bi-grid-3x3-gap me-2"></i>
                    Dịch vụ ADN
                  </span>
                } 
                id="services-dropdown"
                className={isServiceActive() ? 'active' : ''}
              >
                <NavDropdown.Item 
                  as={Link} 
                  to="/services" 
                  onClick={handleNavClick}
                  className="py-2"
                >
                  <i className="bi bi-list-ul me-2 text-primary"></i>
                  <strong>Tất cả dịch vụ</strong>
                  <div className="small text-muted">Xem toàn bộ danh sách</div>
                </NavDropdown.Item>
                
                <NavDropdown.Divider />
                
                <NavDropdown.Header className="text-warning">
                  <i className="bi bi-award me-2"></i>
                  ADN Hành chính
                </NavDropdown.Header>
                <NavDropdown.Item 
                  as={Link} 
                  to="/services?type=administrative" 
                  onClick={handleNavClick}
                  className="py-2"
                >
                  <i className="bi bi-file-earmark-text me-2 text-warning"></i>
                  <strong>Xét nghiệm ADN khai sinh</strong>
                  <Badge bg="warning" text="dark" className="ms-2 small">Có giá trị pháp lý</Badge>
                  <div className="small text-muted">Phục vụ làm giấy khai sinh</div>
                </NavDropdown.Item>
                
                <NavDropdown.Item 
                  as={Link} 
                  to="/services?type=administrative" 
                  onClick={handleNavClick}
                  className="py-2"
                >
                  <i className="bi bi-building me-2 text-warning"></i>
                  <strong>Xét nghiệm ADN pháp lý</strong>
                  <Badge bg="warning" text="dark" className="ms-2 small">Có giá trị pháp lý</Badge>
                  <div className="small text-muted">Thừa kế, nhập tịch, visa...</div>
                </NavDropdown.Item>
                
                <NavDropdown.Divider />
                
                <NavDropdown.Header className="text-success">
                  <i className="bi bi-house me-2"></i>
                  ADN Dân sự
                </NavDropdown.Header>
                <NavDropdown.Item 
                  as={Link} 
                  to="/services?type=civil" 
                  onClick={handleNavClick}
                  className="py-2"
                >
                  <i className="bi bi-people me-2 text-success"></i>
                  <strong>Xét nghiệm ADN huyết thống</strong>
                  <Badge bg="success" className="ms-2 small">Tham khảo cá nhân</Badge>
                  <div className="small text-muted">Tìm hiểu quan hệ cha con, anh em</div>
                </NavDropdown.Item>
                
                <NavDropdown.Item 
                  as={Link} 
                  to="/services?type=civil" 
                  onClick={handleNavClick}
                  className="py-2"
                >
                  <i className="bi bi-heart me-2 text-success"></i>
                  <strong>Xét nghiệm ADN trước sinh</strong>
                  <Badge bg="success" className="ms-2 small">Tham khảo cá nhân</Badge>
                  <div className="small text-muted">An toàn cho mẹ và bé</div>
                </NavDropdown.Item>
              </NavDropdown>

              {/* Information Dropdown */}
              <NavDropdown 
                title={
                  <span className="fw-medium">
                    <i className="bi bi-book me-2"></i>
                    Thông tin
                  </span>
                } 
                id="info-dropdown"
              >
                <NavDropdown.Item 
                  as={Link} 
                  to="/about" 
                  onClick={handleNavClick}
                  className="py-2"
                >
                  <i className="bi bi-building me-2 text-primary"></i>
                  Về chúng tôi
                </NavDropdown.Item>
                
                <NavDropdown.Item 
                  as={Link} 
                  to="/library/technology" 
                  onClick={handleNavClick}
                  className="py-2"
                >
                  <i className="bi bi-cpu me-2 text-info"></i>
                  Công nghệ ADN
                </NavDropdown.Item>
                
                <NavDropdown.Item 
                  as={Link} 
                  to="/library/samples" 
                  onClick={handleNavClick}
                  className="py-2"
                >
                  <i className="bi bi-droplet me-2 text-success"></i>
                  Mẫu xét nghiệm ADN
                </NavDropdown.Item>
                
                <NavDropdown.Item 
                  as={Link} 
                  to="/library/guides" 
                  onClick={handleNavClick}
                  className="py-2"
                >
                  <i className="bi bi-question-circle me-2 text-warning"></i>
                  Hướng dẫn xét nghiệm
                </NavDropdown.Item>
              </NavDropdown>

              <Nav.Link 
                as={Link} 
                to="/prices" 
                className={`fw-medium ${isActive('/prices') ? 'active text-primary' : ''}`}
                onClick={handleNavClick}
              >
                <i className="bi bi-currency-dollar me-2"></i>
                Bảng giá
              </Nav.Link>

              <Nav.Link 
                as={Link} 
                to="/tracking" 
                className={`fw-medium ${isActive('/tracking') ? 'active text-primary' : ''}`}
                onClick={handleNavClick}
              >
                <i className="bi bi-search me-2"></i>
                Tra cứu
              </Nav.Link>
            </Nav>

            {/* Right Side Actions */}
            <Nav className="align-items-lg-center">
              {/* Hotline Info - Desktop only */}
              <Nav.Item className="d-none d-lg-block me-3">
                <div className="text-center">
                  <div className="small text-muted">Hotline 24/7</div>
                  <strong className="text-primary">1900 1234</strong>
                </div>
              </Nav.Item>

              {/* Booking Button */}
              <Nav.Item className="me-lg-3">
                <Button 
                  variant="warning" 
                  as={Link} 
                  to="/appointment"
                  onClick={handleNavClick}
                  className="fw-medium"
                >
                  <i className="bi bi-calendar-plus me-1"></i>
                  <span className="d-lg-none">Đặt lịch xét nghiệm</span>
                  <span className="d-none d-lg-inline">Đặt lịch</span>
                </Button>
              </Nav.Item>

              {/* User Authentication */}
              <Nav>
                {loadingAuth ? (
                  <div className="spinner-border spinner-border-sm text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                ) : userAuth ? (
                  <NavDropdown 
                    title={
                      <span className="d-flex align-items-center">
                        {userAuth.photoURL ? (
                          <Image 
                            src={userAuth.photoURL} 
                            roundedCircle 
                            width="24" 
                            height="24" 
                            className="me-2" 
                          />
                        ) : (
                          <i className="bi bi-person-circle me-1"></i>
                        )}
                        <span className="me-1">
                          {userData?.fullname || userAuth.displayName || userAuth.email}
                        </span>
                        {userData?.role_string && getRoleBadge(userData.role_string)}
                      </span>
                    } 
                    id="user-dropdown"
                    align="end"
                  >
                    {/* Dashboard Links based on role */}
                    {hasAdminAccess() && (
                      <>
                        <NavDropdown.Item 
                          as={Link} 
                          to={getDashboardLink(userData?.role_string || 'user')} 
                          onClick={handleNavClick}
                        >
                          <i className="bi bi-speedometer2 me-2"></i>
                          Dashboard
                          {userData?.role_string && (
                            <Badge bg="secondary" className="ms-2 small">
                              {userData.role_string.charAt(0).toUpperCase() + userData.role_string.slice(1)}
                            </Badge>
                          )}
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                      </>
                    )}

                    {/* Admin specific links */}
                    {userData?.role_string === 'admin' && (
                      <>
                        <NavDropdown.Item as={Link} to="/admin/users" onClick={handleNavClick}>
                          <i className="bi bi-people me-2"></i>
                          Quản lý người dùng
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/admin/reports" onClick={handleNavClick}>
                          <i className="bi bi-graph-up me-2"></i>
                          Báo cáo & Thống kê
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/admin/settings" onClick={handleNavClick}>
                          <i className="bi bi-gear me-2"></i>
                          Cài đặt hệ thống
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                      </>
                    )}

                    {/* Regular user links */}
                    <NavDropdown.Item as={Link} to="/user/profile" onClick={handleNavClick}>
                      <i className="bi bi-person me-2"></i>
                      Hồ sơ cá nhân
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/user/appointments" onClick={handleNavClick}>
                      <i className="bi bi-calendar-event me-2"></i>
                      Lịch hẹn của tôi
                    </NavDropdown.Item>
                    <NavDropdown.Item as={Link} to="/user/results" onClick={handleNavClick}>
                      <i className="bi bi-file-earmark-check me-2"></i>
                      Kết quả xét nghiệm
                    </NavDropdown.Item>
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout}>
                      <i className="bi bi-box-arrow-right me-2"></i>
                      Đăng xuất
                    </NavDropdown.Item>
                  </NavDropdown>
                ) : (
                  <div className="d-flex align-items-center">
                    <Nav.Link as={Link} to="/login" onClick={handleNavClick}>
                      <i className="bi bi-box-arrow-in-right me-1"></i>
                      Đăng nhập
                    </Nav.Link>
                    <Nav.Link as={Link} to="/register" onClick={handleNavClick}>
                      <i className="bi bi-person-plus me-1"></i>
                      Đăng ký
                    </Nav.Link>
                  </div>
                )}
              </Nav>

              {/* Mobile Hotline */}
              <Nav.Item className="d-lg-none mt-3 pt-3 border-top">
                <div className="text-center">
                  <div className="mb-2">
                    <i className="bi bi-telephone text-primary me-2"></i>
                    <span className="text-muted">Hotline:</span> 
                    <strong className="text-primary ms-1">1900 1234</strong>
                  </div>
                  <div className="small text-muted">Hỗ trợ 24/7 - Tư vấn miễn phí</div>
                </div>
              </Nav.Item>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Quick Contact Bar - Only on desktop */}
    </>
  );
};

export default MainNavbar;