import React, { useState, useEffect, useMemo } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { Navbar, Nav, NavDropdown, Container, Button, Badge, Image } from 'react-bootstrap';
import { auth, logout } from './config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';
import Swal from 'sweetalert2';


// Component Navbar: Thanh điều hướng chính của website, hiển thị menu động theo quyền user
const MainNavbar = ({ setUser }) => {
  // State quản lý mở rộng navbar, danh mục dịch vụ, trạng thái loading, user
  const [expanded, setExpanded] = useState(false);
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const [userAuth, loadingAuth] = useAuthState(auth);
  const [logoUrl] = useState('https://firebasestorage.googleapis.com/v0/b/su25-swp391-g8.firebasestorage.app/o/assets%2Flogo.png?alt=media&token=1c903ba1-852a-4f5b-b498-97c31ffbb742');

  const getAdministrativeCategories = () => {
    return categories.filter(category => category.hasLegalValue);
  };

  const getCivilCategories = () => {
    return categories.filter(category => !category.hasLegalValue);
  };

  // Helper: Badge hiển thị vai trò user
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

  // Helper: Lấy link dashboard theo role
  const getDashboardLink = (role) => {
    switch (role) {
      case 'admin': return '/admin';
      case 'staff': return '/staff';
      case 'manager': return '/manager';
      case 'customer': return '/user';
      default: return '/user';
    }
  };

  // Helper function để extract role từ parsed data
  const extractRole = (parsed) => {
    let role = '';
    if (parsed.user_id === 0 || parsed.user_id === '0') {
      role = 'customer';
    } else if (parsed.role && typeof parsed.role === 'object' && parsed.role.name) {
      role = parsed.role.name;
    } else if (typeof parsed.role === 'string') {
      role = parsed.role;
    } else if (parsed.role_string) {
      role = parsed.role_string;
    }
    return (role || '').toLowerCase().trim();
  };

  // Helper function để tạo enhanced user object
  const createEnhancedUser = (parsed, role) => ({
    id: parsed.id || parsed.user_id || '',
    user_id: parsed.user_id || parsed.id || '',
    email: parsed.email || '',
    fullname: parsed.fullname || '',
    avatar: parsed.avatar || '',
    phone: parsed.phone || '',
    role: parsed.role || { name: role },
    accountStatus: parsed.accountStatus || '',
    authProvider: parsed.authProvider || '',
    createdAt: parsed.createdAt || '',
    lastLogin: parsed.lastLogin || '',
    gender: parsed.gender || '',
    address: parsed.address || '',
    role_string: role,
    isAdmin: ['admin', 'manager', 'staff'].includes(role)
  });

  // Lấy userData từ localStorage ngay lập tức (sync) để badge hiển thị nhanh
  const getUserDataFromStorage = () => {
    try {
      const storedUserData = localStorage.getItem('userData');
      if (!storedUserData) return null;
      
      const parsed = JSON.parse(storedUserData);
      const role = extractRole(parsed);
      return createEnhancedUser(parsed, role);
    } catch (error) {
      console.error('Error parsing localStorage userData:', error);
      localStorage.removeItem('userData');
      return null;
    }
  };

  // Khởi tạo userData ngay lập tức từ localStorage
  const [userData, setUserData] = useState(() => getUserDataFromStorage());

  // Function để refresh userData từ localStorage (có thể gọi từ bên ngoài)
  const refreshUserData = () => {
    const freshUserData = getUserDataFromStorage();
    if (freshUserData) {
      setUserData(freshUserData);
      setUser(freshUserData);
    }
  };

  // Expose refresh function to window for external access
  useEffect(() => {
    window.refreshNavbarUserData = refreshUserData;
    return () => {
      delete window.refreshNavbarUserData;
    };
  }, []);

  // Effect: Cập nhật userData ngay khi userAuth thay đổi (đăng nhập thành công)
  useEffect(() => {
    if (userAuth) {
      // Thử lấy userData fresh từ localStorage ngay khi đăng nhập
      const freshUserData = getUserDataFromStorage();
      if (freshUserData && (!userData || userData.user_id !== freshUserData.user_id)) {
        setUserData(freshUserData);
        setUser(freshUserData);
      }

      // Nếu chưa có userData, polling localStorage trong 5 giây đầu
      if (!userData) {
        let attempts = 0;
        const maxAttempts = 20; // 5 giây với interval 250ms
        
        const polling = setInterval(() => {
          attempts++;
          const pollingUserData = getUserDataFromStorage();
          
          if (pollingUserData) {
            setUserData(pollingUserData);
            setUser(pollingUserData);
            clearInterval(polling);
          } else if (attempts >= maxAttempts) {
            clearInterval(polling);
          }
        }, 250); // Check mỗi 250ms

        return () => clearInterval(polling);
      }
    } else if (!userAuth && userData) {
      // Đăng xuất - clear userData
      setUserData(null);
      setUser(null);
    }
  }, [userAuth]); // Chỉ phụ thuộc vào userAuth

  // Effect: Lắng nghe thay đổi localStorage để cập nhật userData real-time
  useEffect(() => {
    const handleStorageChange = () => {
      const freshUserData = getUserDataFromStorage();
      if (freshUserData && userAuth) {
        setUserData(freshUserData);
        setUser(freshUserData);
      }
    };

    // Lắng nghe sự kiện storage change
    window.addEventListener('storage', handleStorageChange);
    
    // Cleanup
    return () => {
      window.removeEventListener('storage', handleStorageChange);
    };
  }, [userAuth]);

  // Effect: Đồng bộ với parent component khi userData thay đổi
  useEffect(() => {
    if (userData) {
      setUser(userData);
    }
  }, [userData, setUser]);

  // Memoized helper functions để tránh re-computation không cần thiết
  const userRole = useMemo(() => {
    return userData?.role_string?.toLowerCase() || '';
  }, [userData?.role_string]);

  const hasAdminAccess = useMemo(() => {
    return ['admin', 'manager', 'staff'].includes(userRole);
  }, [userRole]);

  const isCustomer = useMemo(() => {
    return !userRole || userRole === 'customer';
  }, [userRole]);

  // Helper để kiểm tra role cụ thể
  const isRole = useMemo(() => ({
    admin: userRole === 'admin',
    manager: userRole === 'manager', 
    staff: userRole === 'staff',
    customer: userRole === 'customer'
  }), [userRole]);

  // Handler: Đăng xuất mượt mà với loading state và confirmation
  const handleLogout = async () => {
    try {
      // Hiển thị dialog xác nhận đăng xuất
      const result = await Swal.fire({
        title: 'Xác nhận đăng xuất',
        text: 'Bạn có chắc chắn muốn đăng xuất khỏi hệ thống?',
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
        confirmButtonText: 'Đăng xuất',
        cancelButtonText: 'Hủy',
        reverseButtons: true
      });

      if (!result.isConfirmed) {
        return; // User cancelled logout
      }

      // Set loading state
      setIsLoggingOut(true);

      // Show loading toast
      Swal.fire({
        title: 'Đang đăng xuất...',
        text: 'Vui lòng chờ một chút',
        icon: 'info',
        allowOutsideClick: false,
        allowEscapeKey: false,
        showConfirmButton: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      // Clear user data immediately for smooth UI transition
      setUserData(null);
      setUser(null);

      // Clear localStorage và sessionStorage
      localStorage.removeItem('userData');
      localStorage.removeItem('user');
      localStorage.removeItem('currentUser');
      localStorage.removeItem('loginData');
      localStorage.removeItem('isAuthenticated');
      sessionStorage.clear();

      // Đăng xuất Firebase
      await logout();

      // Close loading and show success
      Swal.close();
      
      // Show success message và reload trang
      setTimeout(() => {
        Swal.fire({
          title: 'Đăng xuất thành công!',
          text: 'Cảm ơn bạn đã sử dụng dịch vụ',
          icon: 'success',
          timer: 1500,
          showConfirmButton: false,
          toast: true,
          position: 'top-end'
        }).then(() => {
          // Navigate về trang chủ thay vì reload
          navigate('/', { replace: true });
        });
      }, 300);

    } catch (error) {
      console.error('Logout error:', error);
      
      // Clear data anyway
      setUserData(null);
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();

      // Show error and reload
      Swal.fire({
        title: 'Lỗi đăng xuất',
        text: 'Có lỗi xảy ra, nhưng bạn đã được đăng xuất',
        icon: 'warning',
        timer: 2000,
        showConfirmButton: false
      }).then(() => {
        // Navigate về trang chủ thay vì reload
        navigate('/', { replace: true });
      });
    } finally {
      setIsLoggingOut(false);
    }
  };

  // Handler: Đóng navbar khi click menu
  const handleNavClick = () => {
    setExpanded(false);
  };

  // Helper: Kiểm tra route active
  const isActive = (path) => {
    return location.pathname === path;
  };

  const isServiceActive = () => {
    return location.pathname.startsWith('/services');
  };

  // Handler: Xử lý click logo về home
  const handleLogoClick = (e) => {
    e.preventDefault();
    handleNavClick(); // Đóng navbar nếu đang mở
    // Chỉ navigate về home khi user thực sự click logo, không phải khi reload
    if (location.pathname !== '/') {
      navigate('/', { replace: true }); // Navigate về trang chủ
    }
  };

  // Handler for booking button
  const handleBookingClick = (e) => {
    if (!userData || !userData.user_id) {
      e.preventDefault();
      Swal.fire({
        icon: 'info',
        title: 'Bạn chưa đăng nhập',
        text: 'Vui lòng đăng nhập để đặt lịch xét nghiệm',
        confirmButtonText: 'Đăng nhập ngay',
        confirmButtonColor: '#3085d6',
      }).then((result) => {
        if (result.isConfirmed) {
          // Lưu redirect path để sau khi login sẽ về đây
          sessionStorage.setItem('redirectTo', '/appointment');
          navigate('/login', { state: { redirectTo: '/appointment' } });
        }
      });
    } else {
      handleNavClick();
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
          <Navbar.Brand 
            onClick={handleLogoClick} 
            className="fw-bold d-flex align-items-center" 
            style={{ cursor: 'pointer' }}
          >
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
            {/* Admin/Staff/Manager Navigation */}
            {hasAdminAccess && (
              <Nav className="me-auto">
                <Nav.Link
                  as={Link}
                  to={getDashboardLink(userData?.role_string || 'user')}
                  className={`fw-medium ${location.pathname.startsWith(getDashboardLink(userData?.role_string || 'user')) ? 'active text-primary' : ''}`}
                  onClick={handleNavClick}
                >
                  <i className="bi bi-speedometer2 me-2"></i>
                  Dashboard
                </Nav.Link>

                {isRole.admin && (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/admin/overview"
                      className={`fw-medium ${isActive('/admin/overview') ? 'active text-primary' : ''}`}
                      onClick={handleNavClick}
                    >
                      <i className="bi bi-speedometer2 me-2"></i>
                      Tổng quan
                    </Nav.Link>
                    
                    <Nav.Link
                      as={Link}
                      to="/admin/blog"
                      className={`fw-medium ${isActive('/admin/blog') ? 'active text-primary' : ''}`}
                      onClick={handleNavClick}
                    >
                      <i className="bi bi-newspaper me-2"></i>
                      Quản lý Blog
                    </Nav.Link>
                    
                    <Nav.Link
                      as={Link}
                      to="/admin/users"
                      className={`fw-medium ${isActive('/admin/users') ? 'active text-primary' : ''}`}
                      onClick={handleNavClick}
                    >
                      <i className="bi bi-people me-2"></i>
                      Quản lý tài khoản
                    </Nav.Link>
                    
                    <Nav.Link
                      as={Link}
                      to="/admin/reports"
                      className={`fw-medium ${isActive('/admin/reports') ? 'active text-primary' : ''}`}
                      onClick={handleNavClick}
                    >
                      <i className="bi bi-graph-up me-2"></i>
                      Báo cáo & Thống kê
                    </Nav.Link>
                    
                    <Nav.Link
                      as={Link}
                      to="/admin/settings"
                      className={`fw-medium ${isActive('/admin/settings') ? 'active text-primary' : ''}`}
                      onClick={handleNavClick}
                    >
                      <i className="bi bi-gear me-2"></i>
                      Cài đặt
                    </Nav.Link>
                  </>
                )}

                {isRole.manager && (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/manager/services"
                      className={`fw-medium ${isActive('/manager/services') ? 'active text-primary' : ''}`}
                      onClick={handleNavClick}
                    >
                      <i className="bi bi-gear me-2"></i>
                      Quản lý dịch vụ
                    </Nav.Link>
                    
                    <Nav.Link
                      as={Link}
                      to="/manager/appointments"
                      className={`fw-medium ${isActive('/manager/appointments') ? 'active text-primary' : ''}`}
                      onClick={handleNavClick}
                    >
                      <i className="bi bi-calendar-check me-2"></i>
                      Quản lý lịch hẹn
                    </Nav.Link>
                    
                    <Nav.Link
                      as={Link}
                      to="/manager/staff"
                      className={`fw-medium ${isActive('/manager/staff') ? 'active text-primary' : ''}`}
                      onClick={handleNavClick}
                    >
                      <i className="bi bi-people me-2"></i>
                      Quản lý nhân viên
                    </Nav.Link>
                    
                    <Nav.Link
                      as={Link}
                      to="/manager/reports"
                      className={`fw-medium ${isActive('/manager/reports') ? 'active text-primary' : ''}`}
                      onClick={handleNavClick}
                    >
                      <i className="bi bi-graph-up me-2"></i>
                      Báo cáo
                    </Nav.Link>
                    
                    <Nav.Link
                      as={Link}
                      to="/manager/feedback"
                      className={`fw-medium ${isActive('/manager/feedback') ? 'active text-primary' : ''}`}
                      onClick={handleNavClick}
                    >
                      <i className="bi bi-chat-dots me-2"></i>
                      Phản hồi
                    </Nav.Link>
                  </>
                )}

                {isRole.staff && (
                  <>
                    <Nav.Link
                      as={Link}
                      to="/staff/kit-preparation"
                      className={`fw-medium ${isActive('/staff/kit-preparation') ? 'active text-primary' : ''}`}
                      onClick={handleNavClick}
                    >
                      <i className="bi bi-box-seam me-2"></i>
                      Chuẩn bị Kit
                    </Nav.Link>
                    
                    <Nav.Link
                      as={Link}
                      to="/staff/sample-collection"
                      className={`fw-medium ${isActive('/staff/sample-collection') ? 'active text-primary' : ''}`}
                      onClick={handleNavClick}
                    >
                      <i className="bi bi-droplet me-2"></i>
                      Thu mẫu
                    </Nav.Link>
                    
                    <Nav.Link
                      as={Link}
                      to="/staff/lab-testing"
                      className={`fw-medium ${isActive('/staff/lab-testing') ? 'active text-primary' : ''}`}
                      onClick={handleNavClick}
                    >
                      <i className="bi bi-eye me-2"></i>
                      Xét nghiệm
                    </Nav.Link>
                    
                    <Nav.Link
                      as={Link}
                      to="/staff/results"
                      className={`fw-medium ${isActive('/staff/results') ? 'active text-primary' : ''}`}
                      onClick={handleNavClick}
                    >
                      <i className="bi bi-file-earmark-check me-2"></i>
                      Kết quả
                    </Nav.Link>
                  </>
                )}
              </Nav>
            )}

            {/* Main Navigation - Only show for customers */}
            {isCustomer && (
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
            )}

            {/* Spacer for admin/staff/manager to push user menu to right */}
            {!isCustomer && <div className="me-auto"></div>}

            {/* Right Side Actions */}
            <Nav className="align-items-lg-center">
              {/* Hotline Info - Desktop only - Only show for customers */}
              {isCustomer && (
                <Nav.Item className="d-none d-lg-block me-3">
                  <div className="text-center">
                    <div className="small text-muted">Hotline 24/7</div>
                    <strong className="text-primary">1900 1234</strong>
                  </div>
                </Nav.Item>
              )}

              {/* Booking Button - Only show for customers */}
              {isCustomer && (
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
              )}

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
                        {/* Badge role: chỉ hiển thị khi đã có userData */}
                        {userData?.role_string && getRoleBadge(userData.role_string)}
                      </span>
                    }
                    id="user-dropdown"
                    align="end"
                  >
                    {/* Dashboard Links based on role */}
                    {hasAdminAccess && (
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
                    {isRole.admin && (
                      <>
                        <NavDropdown.Item as={Link} to="/admin/overview" onClick={handleNavClick}>
                          <i className="bi bi-speedometer2 me-2"></i>
                          Tổng quan
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/admin/blog" onClick={handleNavClick}>
                          <i className="bi bi-newspaper me-2"></i>
                          Quản lý Blog
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/admin/users" onClick={handleNavClick}>
                          <i className="bi bi-people me-2"></i>
                          Quản lý tài khoản
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/admin/reports" onClick={handleNavClick}>
                          <i className="bi bi-graph-up me-2"></i>
                          Báo cáo & Thống kê
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/admin/settings" onClick={handleNavClick}>
                          <i className="bi bi-gear me-2"></i>
                          Cài đặt
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                      </>
                    )}

                    {/* Manager specific links */}
                    {isRole.manager && (
                      <>
                        <NavDropdown.Item as={Link} to="/manager/services" onClick={handleNavClick}>
                          <i className="bi bi-gear me-2"></i>
                          Quản lý dịch vụ
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/manager/appointments" onClick={handleNavClick}>
                          <i className="bi bi-calendar-check me-2"></i>
                          Quản lý lịch hẹn
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/manager/staff" onClick={handleNavClick}>
                          <i className="bi bi-people me-2"></i>
                          Quản lý nhân viên
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/manager/reports" onClick={handleNavClick}>
                          <i className="bi bi-graph-up me-2"></i>
                          Báo cáo
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/manager/feedback" onClick={handleNavClick}>
                          <i className="bi bi-chat-dots me-2"></i>
                          Phản hồi
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                      </>
                    )}

                    {/* Staff specific links */}
                    {isRole.staff && (
                      <>
                        <NavDropdown.Item as={Link} to="/staff/kit-preparation" onClick={handleNavClick}>
                          <i className="bi bi-box-seam me-2"></i>
                          Chuẩn bị Kit
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/staff/sample-collection" onClick={handleNavClick}>
                          <i className="bi bi-droplet me-2"></i>
                          Thu mẫu
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/staff/lab-testing" onClick={handleNavClick}>
                          <i className="bi bi-eye me-2"></i>
                          Xét nghiệm
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/staff/results" onClick={handleNavClick}>
                          <i className="bi bi-file-earmark-check me-2"></i>
                          Kết quả
                        </NavDropdown.Item>
                        <NavDropdown.Divider />
                      </>
                    )}

                    {/* Regular user links - show for everyone */}
                    <NavDropdown.Item as={Link} to="/user/profile" onClick={handleNavClick}>
                      <i className="bi bi-person me-2"></i>
                      Hồ sơ cá nhân
                    </NavDropdown.Item>

                    {/* Customer specific links */}
                    {isCustomer && (
                      <>
                        <NavDropdown.Item as={Link} to="/user/appointments" onClick={handleNavClick}>
                          <i className="bi bi-calendar-event me-2"></i>
                          Lịch hẹn của tôi
                        </NavDropdown.Item>
                        <NavDropdown.Item as={Link} to="/user/results" onClick={handleNavClick}>
                          <i className="bi bi-file-earmark-check me-2"></i>
                          Kết quả xét nghiệm
                        </NavDropdown.Item>
                      </>
                    )}
                    <NavDropdown.Divider />
                    <NavDropdown.Item onClick={handleLogout} disabled={isLoggingOut}>
                      {isLoggingOut ? (
                        <>
                          <div className="spinner-border spinner-border-sm me-2" role="status">
                            <span className="visually-hidden">Loading...</span>
                          </div>
                          Đang đăng xuất...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-box-arrow-right me-2"></i>
                          Đăng xuất
                        </>
                      )}
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

              {/* Mobile Hotline - Only show for customers */}
              {isCustomer && (
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
              )}
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Quick Contact Bar - Only on desktop */}
    </>
  );
};

export default MainNavbar;