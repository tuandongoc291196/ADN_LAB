import React, { useState, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Button, Badge, Image } from 'react-bootstrap';
import { auth, logout } from './config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Swal from 'sweetalert2';
import { getServiceCategories } from '../services/api';

const MainNavbar = ({ setUser }) => {
  const [expanded, setExpanded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [userAuth, loadingAuth] = useAuthState(auth);
  const [userData, setUserData] = useState(null);
  const [logoUrl] = useState('https://firebasestorage.googleapis.com/v0/b/su25-swp391-g8.firebasestorage.app/o/assets%2Flogo.png?alt=media&token=1c903ba1-852a-4f5b-b498-97c31ffbb742');

  // Fetch categories from API
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoadingCategories(true);
        const response = await getServiceCategories();
        console.log('Categories API response:', response);
        
        if (response && Array.isArray(response)) {
          setCategories(response);
        } else {
          setCategories([]);
        }
      } catch (error) {
        console.error('Error fetching categories:', error);
        setCategories([]);
      } finally {
        setLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []);

  // Helper function để phân loại categories
  const getAdministrativeCategories = () => {
    return categories.filter(category => category.hasLegalValue);
  };

  const getCivilCategories = () => {
    return categories.filter(category => !category.hasLegalValue);
  };

  const getRoleBadge = (role) => {
    const roleConfig = {
      admin: { bg: 'danger', icon: 'bi-crown', text: 'Quản trị viên' },
      staff: { bg: 'info', icon: 'bi-person-badge', text: 'Nhân viên' },
      manager: { bg: 'warning', icon: 'bi-briefcase', text: 'Quản lí' },
      customer: { bg: 'primary', icon: 'bi-person', text: 'Khách hàng' }
    };
    // Normalize role string
    const normalizedRole = (role || '').toLowerCase().trim();
    const config = roleConfig[normalizedRole] || roleConfig.customer;
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
  const storedUserData = localStorage.getItem('userData');
  useEffect(() => {
    const justLoggedOut = sessionStorage.getItem('justLoggedOut') === 'true';
    if (justLoggedOut) {
      // Nếu vừa đăng xuất, reset userData và user
      sessionStorage.removeItem('justLoggedOut');
      return;
    }
    // Lấy userData mới nhất từ localStorage mỗi lần render
    if (storedUserData) {
      const parsed = JSON.parse(storedUserData);
      // Ưu tiên lấy role từ role.name nếu có
      let role = '';
      // Nếu userId là 0 thì role là customer
      if (parsed.user_id === 0 || parsed.user_id === '0') {
        role = 'customer';
      } else if (parsed.role && typeof parsed.role === 'object' && parsed.role.name) {
        role = parsed.role.name;
      } else if (typeof parsed.role === 'string') {
        role = parsed.role;
      } else if (parsed.role_string) {
        role = parsed.role_string;
      }
      // Normalize role
      role = (role || '').toLowerCase().trim();
      const enhancedUser = {
        ...parsed,
        role_string: role,
        isAdmin: ['admin', 'manager', 'staff'].includes(role),
      };
      setUserData(enhancedUser);
      setUser(enhancedUser);
    } else if (auth.currentUser) {
      // 🔥 Nếu không có localStorage nhưng đã login Firebase → gọi API lấy user
      const fetchUserData = async () => {
        try {
          const res = await fetch(`https://app-bggwpxm32a-uc.a.run.app/users`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ userId: auth.currentUser.uid }),
          });
          const result = await res.json();
          const userInfo = result.data;
          const role = userInfo?.role?.name?.toLowerCase() || 'customer';

          const enhancedUser = {
            ...userInfo,
            role_string: role,
            isAdmin: ['admin', 'manager', 'staff'].includes(role),
          };

          localStorage.setItem('userData', JSON.stringify(enhancedUser));
          localStorage.setItem('isAuthenticated', 'true');
          setUserData(enhancedUser);
          setUser(enhancedUser);
        } catch (error) {
          console.error('Error fetching user data:', error);
          // setUserData(null);
          // setUser(null);
        }
      };
      fetchUserData();
    }
  }, [storedUserData, setUser]);
  console.log('userData', userData);

  const handleLogout = () => {
    logout();
    localStorage.removeItem('user_id');
    localStorage.removeItem('userData');
    localStorage.removeItem('user');
    localStorage.removeItem('isAuthenticated');
    sessionStorage.setItem('justLoggedOut', 'true');
    // Reset user state
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
    return userData?.isAdmin === true;
  };

  // Handler for booking button
  const handleBookingClick = (e) => {
    if (!storedUserData) {
      e.preventDefault(); // chặn click chuyển trang
      Swal.fire({
        icon: 'info',
        title: 'Bạn chưa đăng nhập',
        text: 'Vui lòng đăng nhập để đặt lịch xét nghiệm',
        confirmButtonText: 'Đăng nhập ngay',
        confirmButtonColor: '#3085d6',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { state: { redirectTo: '/appointment' } });
        }
      });
    } else {
      handleNavClick(); // vẫn xử lý bình thường nếu đã login
    }
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

                {/* ADN Hành chính - Dynamic từ API */}
                {getAdministrativeCategories().length > 0 && (
                  <>
                    <NavDropdown.Header className="text-warning">
                      <i className="bi bi-award me-2"></i>
                      ADN Hành chính
                    </NavDropdown.Header>
                    {getAdministrativeCategories().map(category => (
                      <NavDropdown.Item
                        key={category.id}
                        as={Link}
                        to="/services?type=administrative"
                        onClick={handleNavClick}
                        className="py-2"
                      >
                        <i className="bi bi-file-earmark-text me-2 text-warning"></i>
                        <strong>{category.name}</strong>
                        <Badge bg="warning" text="dark" className="ms-2 small">Có giá trị pháp lý</Badge>
                        <div className="small text-muted">{category.description || 'Dịch vụ hành chính'}</div>
                      </NavDropdown.Item>
                    ))}
                  </>
                )}

                {/* ADN Dân sự - Dynamic từ API */}
                {getCivilCategories().length > 0 && (
                  <>
                    <NavDropdown.Header className="text-success">
                      <i className="bi bi-house me-2"></i>
                      ADN Dân sự
                    </NavDropdown.Header>
                    {getCivilCategories().map(category => (
                      <NavDropdown.Item
                        key={category.id}
                        as={Link}
                        to="/services?type=civil"
                        onClick={handleNavClick}
                        className="py-2"
                      >
                        <i className="bi bi-people me-2 text-success"></i>
                        <strong>{category.name}</strong>
                        <Badge bg="success" className="ms-2 small">Tham khảo cá nhân</Badge>
                        <div className="small text-muted">{category.description || 'Dịch vụ dân sự'}</div>
                      </NavDropdown.Item>
                    ))}
                  </>
                )}

                {/* Fallback nếu không có categories */}
                {categories.length === 0 && !loadingCategories && (
                  <>
                    <NavDropdown.Item
                      as={Link}
                      to="/services?type=administrative"
                      onClick={handleNavClick}
                      className="py-2"
                    >
                      <i className="bi bi-award me-2 text-warning"></i>
                      <strong>ADN Hành chính</strong>
                      <Badge bg="warning" text="dark" className="ms-2 small">Có giá trị pháp lý</Badge>
                      <div className="small text-muted">Khai sinh, pháp lý, thừa kế...</div>
                    </NavDropdown.Item>

                    <NavDropdown.Item
                      as={Link}
                      to="/services?type=civil"
                      onClick={handleNavClick}
                      className="py-2"
                    >
                      <i className="bi bi-house me-2 text-success"></i>
                      <strong>ADN Dân sự</strong>
                      <Badge bg="success" className="ms-2 small">Tham khảo cá nhân</Badge>
                      <div className="small text-muted">Huyết thống, trước sinh...</div>
                    </NavDropdown.Item>
                  </>
                )}

                {/* Loading state */}
                {loadingCategories && (
                  <NavDropdown.Item disabled className="py-2">
                    <i className="bi bi-hourglass-split me-2 text-muted"></i>
                    <span className="text-muted">Đang tải...</span>
                  </NavDropdown.Item>
                )}
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
                  to="/guides"
                  onClick={handleNavClick}
                  className="py-2"
                >
                  <i className="bi bi-question-circle me-2 text-warning"></i>
                  Hướng dẫn xét nghiệm
                </NavDropdown.Item>
              </NavDropdown>

              <Nav.Link
                as={Link}
                to="/blog"
                className={`fw-medium ${location.pathname.startsWith('/blog') ? 'active text-primary' : ''}`}
                onClick={handleNavClick}
              >
                <i className="bi bi-newspaper me-2"></i>
                Blog
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
                  onClick={handleBookingClick}
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
                              {/* Sửa lỗi: chỉ hiển thị nếu role_string tồn tại */}
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