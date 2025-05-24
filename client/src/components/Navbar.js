import React from 'react';
import { Link } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container } from 'react-bootstrap';

const MainNavbar = ({ user, setUser }) => {
  const handleLogout = () => {
    setUser(null);
    // Clear any stored tokens or user data
    localStorage.removeItem('token');
  };

  return (
    <Navbar bg="light" expand="lg" className="mb-3">
      <Container>
        <Navbar.Brand as={Link} to="/">
          <img 
            src="/logo.png" 
            alt="ADN LAB" 
            height="40" 
            className="d-inline-block align-top"
          />
        </Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="me-auto">
            <Nav.Link as={Link} to="/">Trang chủ</Nav.Link>
            <Nav.Link as={Link} to="/about">Giới thiệu</Nav.Link>
            
            <NavDropdown title="Dịch vụ" id="services-dropdown">
              <NavDropdown.Item as={Link} to="/services">Tất cả dịch vụ</NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item as={Link} to="/services/category/dna-testing">Xét nghiệm ADN huyết thống</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/services/category/birth-cert">Xét nghiệm ADN khai sinh</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/services/category/fetal-dna">Xét nghiệm ADN thai nhi</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/services/category/prenatal">Xét nghiệm sàng lọc trước sinh NIPT</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/services/category/paternal">Xét nghiệm ADN họ hàng dòng cha</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/services/category/maternal">Xét nghiệm ADN họ hàng dòng mẹ</NavDropdown.Item>
            </NavDropdown>
            
            <NavDropdown title="Thư viện ADN" id="library-dropdown">
              <NavDropdown.Item as={Link} to="/library/technology">Công nghệ ADN</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/library/samples">Mẫu xét nghiệm ADN</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/library/civil">ADN Dân sự</NavDropdown.Item>
              <NavDropdown.Item as={Link} to="/library/legal">ADN Pháp lý</NavDropdown.Item>
            </NavDropdown>
            
            <Nav.Link as={Link} to="/prices">Bảng Giá</Nav.Link>
            <Nav.Link as={Link} to="/contact">Liên hệ</Nav.Link>
          </Nav>
          
          <Nav>
            {user ? (
              <>
                <NavDropdown title={`Xin chào, ${user.name}`} id="user-dropdown">
                  {user.role === 'admin' && (
                    <NavDropdown.Item as={Link} to="/admin">Quản trị viên</NavDropdown.Item>
                  )}
                  {user.role === 'manager' && (
                    <NavDropdown.Item as={Link} to="/manager">Quản lý</NavDropdown.Item>
                  )}
                  {user.role === 'staff' && (
                    <NavDropdown.Item as={Link} to="/staff">Nhân viên</NavDropdown.Item>
                  )}
                  <NavDropdown.Item as={Link} to="/user/profile">Hồ sơ</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/user/appointments">Lịch hẹn</NavDropdown.Item>
                  <NavDropdown.Item as={Link} to="/user/results">Kết quả xét nghiệm</NavDropdown.Item>
                  <NavDropdown.Divider />
                  <NavDropdown.Item onClick={handleLogout}>Đăng xuất</NavDropdown.Item>
                </NavDropdown>
              </>
            ) : (
              <>
                <Nav.Link as={Link} to="/login">Đăng nhập</Nav.Link>
                <Nav.Link as={Link} to="/register">Đăng ký</Nav.Link>
              </>
            )}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
  );
};

export default MainNavbar; 