import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Button } from 'react-bootstrap';

const MainNavbar = ({ user, setUser }) => {
  const handleLogout = () => {
    setUser(null);
    // Clear any stored tokens or user data
    localStorage.removeItem('token');
  };

  return (
    <Navbar bg="light" expand="lg" className="shadow-sm">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <div className="d-flex align-items-center">
            <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-2" 
                 style={{ width: '40px', height: '40px' }}>
              <i className="bi bi-dna fs-5"></i>
            </div>
            <div>
              <div className="fw-bold text-primary">ADN LAB</div>
              <small className="text-muted">Trung tâm xét nghiệm</small>
            </div>
          </div>
        </Navbar.Brand>
        
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">
              <i className="bi bi-house me-1"></i>
              Trang chủ
            </Nav.Link>
            <Nav.Link as={Link} to="/about">
              <i className="bi bi-info-circle me-1"></i>
              Giới thiệu
            </Nav.Link>
            
            <NavDropdown title={<><i className="bi bi-gear me-1"></i>Dịch vụ</>} id="services-dropdown">
              <NavDropdown.Item as={Link} to="/services">
                <i className="bi bi-list me-2"></i>
                Tất cả dịch vụ
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Header>ADN Dân sự</NavDropdown.Header>
              <NavDropdown.Item as={Link} to="/services/category/dna-testing">
                <i className="bi bi-people me-2"></i>
                Xét nghiệm ADN huyết thống
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/services/category/fetal-dna">
                <i className="bi bi-heart me-2"></i>
                Xét nghiệm ADN thai nhi
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Header>ADN Hành chính</NavDropdown.Header>
              <NavDropdown.Item as={Link} to="/services/category/birth-cert">
                <i className="bi bi-file-earmark-text me-2"></i>
                Xét nghiệm ADN khai sinh
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/services/category/legal">
                <i className="bi bi-building me-2"></i>
                Xét nghiệm ADN pháp lý
              </NavDropdown.Item>
            </NavDropdown>
            
            <NavDropdown title={<><i className="bi bi-book me-1"></i>Thư viện</>} id="library-dropdown">
              <NavDropdown.Item as={Link} to="/library/technology">
                <i className="bi bi-cpu me-2"></i>
                Công nghệ ADN
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/library/samples">
                <i className="bi bi-droplet me-2"></i>
                Mẫu xét nghiệm ADN
              </NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/library/guides">
                <i className="bi bi-question-circle me-2"></i>
                Hướng dẫn xét nghiệm
              </NavDropdown.Item>
            </NavDropdown>
            
            <Nav.Link as={Link} to="/prices">
              <i className="bi bi-currency-dollar me-1"></i>
              Bảng Giá
            </Nav.Link>
            
            <Nav.Link as={Link} to="/tracking">
              <i className="bi bi-search me-1"></i>
              Tra cứu
            </Nav.Link>
            
            <Nav.Link as={Link} to="/sitemap" className="d-lg-none">
              <i className="bi bi-map me-1"></i>
              Sơ đồ trang
            </Nav.Link>
          </Nav>
          
          {/* Booking Button */}
          <Nav className="me-3">
            <Button variant="warning" as={Link} to="/appointment" className="me-2">
              <i className="bi bi-calendar-plus me-1"></i>
              Đặt lịch xét nghiệm
            </Button>
          </Nav>
          
          <Nav>
            {user ? (
              <>
                <NavDropdown 
                  title={
                    <span>
                      <i className="bi bi-person-circle me-1"></i>
                      {user.name}
                    </span>
                  } 
                  id="user-dropdown"
                >
                  {user.role === 'admin' && (
                    <NavDropdown.Item as={Link} to="/admin">
                      <i className="bi bi-shield-check me-2"></i>
                      Quản trị viên
                    </NavDropdown.Item>
                  )}
                  {user.role === 'manager' && (
                    <NavDropdown.Item as={Link} to="/manager">
                      <i className="bi bi-briefcase me-2"></i>
                      Quản lý
                    </NavDropdown.Item>
                  )}
                  {user.role === 'staff' && (
                    <NavDropdown.Item as={Link} to="/staff">
                      <i className="bi bi-person-badge me-2"></i>
                      Nhân viên
                    </NavDropdown.Item>
                  )}
                  <NavDropdown.Item as={Link} to="/user/profile">
                    <i className="bi bi-person me-2"></i>
                    Hồ sơ cá nhân
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/user/appointments">
                    <i className="bi bi-calendar-event me-2"></i>
                    Lịch hẹn của tôi
                  </NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/user/results">
                    <i className="bi bi-file-earmark-check me-2"></i>
                    Kết quả xét nghiệm
                  </NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>
                    <i className="bi bi-box-arrow-right me-2"></i>
                    Đăng xuất
                  </NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">
                  <i className="bi bi-box-arrow-in-right me-1"></i>
                  Đăng nhập
                </Nav.Link>
                <Nav.Link as={Link} to="/register">
                  <i className="bi bi-person-plus me-1"></i>
                  Đăng ký
                </Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar;