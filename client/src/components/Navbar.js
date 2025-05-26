import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Button, Badge, Image } from 'react-bootstrap';
import { auth, logout } from './config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const MainNavbar = ({ setUser }) => {
  const [expanded, setExpanded] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [userAuth, loadingAuth] = useAuthState(auth);
  const [userData, setUserData] = useState(null);

  useEffect(() => {
    if (userAuth) {
      // Get user data from localStorage that was set during login
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        setUserData(JSON.parse(storedUserData));
        setUser(JSON.parse(storedUserData));
      }
    } else {
      setUserData(null);
      setUser(null);
    }
  }, [userAuth, setUser]);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('user_id');
    localStorage.removeItem('userData');
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
            <div className="bg-primary rounded-circle p-2 me-2">
              <i className="bi bi-dna text-white fs-5"></i>
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
                        {userData?.fullname || userAuth.displayName || userAuth.email}
                      </span>
                    } 
                    id="user-dropdown"
                    align="end"
                  >
                    {userData?.role && (
                      <NavDropdown.Item as={Link} to="/admin" onClick={handleNavClick}>
                        <i className="bi bi-shield-check me-2"></i>
                        Quản trị viên
                      </NavDropdown.Item>
                    )}
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
      <div className="d-none d-lg-block position-fixed bottom-0 end-0 p-3" style={{ zIndex: 1000 }}>
        <div className="d-flex flex-column gap-2">
          <Button 
            variant="success" 
            className="rounded-circle shadow-lg"
            style={{ width: '50px', height: '50px' }}
            title="Chat với chuyên gia"
          >
            <i className="bi bi-chat-dots fs-5"></i>
          </Button>
          <Button 
            variant="primary" 
            className="rounded-circle shadow-lg"
            style={{ width: '50px', height: '50px' }}
            title="Gọi hotline"
            href="tel:19001234"
          >
            <i className="bi bi-telephone fs-5"></i>
          </Button>
        </div>
      </div>
    </>
  );
};

export default MainNavbar;