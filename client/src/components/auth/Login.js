import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, InputGroup, Badge } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  auth, 
  logInWithEmailAndPassword, 
  signInWithGoogle,
  adminEmails,
  staffEmails,
  managerEmails,
  dataConnect
} from '../config/firebase';
import {
  getUser
} from '../../lib/dataconnect';
import { useAuthState } from 'react-firebase-hooks/auth';

const Login = ({ setUser }) => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [showQuickLogin, setShowQuickLogin] = useState(false);
  const [isQuickLogin, setIsQuickLogin] = useState(false);

  // Function to get redirect path based on role
  const getRedirectPath = (role) => {
    switch (role) {
      case 'admin': return '/admin';
      case 'staff': return '/staff';
      case 'manager': return '/manager';
      case 'customer': return '/user';
      default: return '/user';
    }
  };

  useEffect(() => {
    const handleUserLogin = async () => {
      if (loading) return;
      
      if (isQuickLogin) return;
      
      if (user) {
        try {
          const { data: userData } = await getUser(dataConnect);
          
          if (userData && userData.user) {
            const userInfo = userData.user;           
            const appUser = {
              ...userInfo,
              id: userInfo.id,
              name: userInfo.fullname,
              email: userInfo.email,
              role: userInfo.role?.name || 'customer',
              avatar: userInfo.avatar,
              verified: user.emailVerified,
              phone: userInfo.phone,
              department: userInfo.role?.name === 'admin' ? 'Administration' : 
                         userInfo.role?.name === 'staff' ? 'Laboratory' :
                         userInfo.role?.name === 'manager' ? 'Management' : null,
              permissions: userInfo.role?.name === 'admin' ? ['all'] : 
                          userInfo.role?.name === 'staff' ? ['tests', 'reports'] :
                          userInfo.role?.name === 'manager' ? ['users', 'reports', 'guides'] :
                          ['profile', 'tests']
            };

            setUser(appUser);
            localStorage.setItem('isAuthenticated', 'true');
            
            navigate(getRedirectPath(appUser.role));
          } else {
            setLoginError('Không tìm thấy thông tin người dùng trong hệ thống.');
          }
        } catch (error) {
          console.error('Error processing user login:', error);
          setLoginError('Đã có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
        }
      }
    };

    handleUserLogin();
  }, [user, loading, navigate, setUser, isQuickLogin]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setLoginError('');
      await signInWithGoogle();
    } catch (error) {
      setLoginError('Đăng nhập Google thất bại. Vui lòng thử lại.');
      console.error('Google sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Quick login for testing
  const handleQuickLogin = async (role) => {
    try {
      setIsLoading(true);
      setLoginError('');
      setIsQuickLogin(true);
      
      const mockUsers = {
        admin: {
          id: 'admin-test-id',
          name: 'Test Admin',
          email: 'admin@adnlab.vn',
          role: 'admin',
          role_string: 'admin',
          avatar: null,
          verified: true,
          phone: '0123456789',
          department: 'Administration',
          permissions: ['all']
        },
        staff: {
          id: 'staff-test-id',
          name: 'Test Staff',
          email: 'staff@adnlab.vn',
          role: 'staff',
          role_string: 'staff',
          avatar: null,
          verified: true,
          phone: '0123456788',
          department: 'Laboratory',
          permissions: ['tests', 'reports']
        },
        manager: {
          id: 'manager-test-id',
          name: 'Test Manager',
          email: 'manager@adnlab.vn',
          role: 'manager',
          role_string: 'manager',
          avatar: null,
          verified: true,
          phone: '0123456787',
          department: 'Management',
          permissions: ['users', 'reports', 'guides']
        },
        customer: {
          id: 'customer-test-id',
          name: 'Test Customer',
          email: 'customer@adnlab.vn',
          role: 'customer',
          role_string: 'customer',
          avatar: null,
          verified: true,
          phone: '0123456786',
          department: null,
          permissions: ['profile', 'tests']
        }
      };

      const mockUser = mockUsers[role];
      if (mockUser) {
        localStorage.setItem('isAuthenticated', 'true');
        
        navigate(getRedirectPath(mockUser.role));
      }
    } catch (error) {
      setLoginError(`Không thể mô phỏng đăng nhập với tài khoản ${role}.`);
      console.error('Quick login error:', error);
    } finally {
      setIsLoading(false);
      setTimeout(() => setIsQuickLogin(false), 1000);
    }
  };

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
    },
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setLoginError('');
        const { email, password } = values;
        await logInWithEmailAndPassword(email, password);
      } catch (error) {
        setLoginError('Email hoặc mật khẩu không đúng. Vui lòng thử lại.');
        console.error('Login error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required('Email là bắt buộc')
        .email('Email không hợp lệ'),
      password: Yup.string()
        .required('Mật khẩu là bắt buộc')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự'),
    }),
  });

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={5} md={7} sm={9}>
            {/* Header */}
            <div className="text-center mb-4">
              <div 
                className="rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center logo-circle" 
                style={{
                  width: '80px', 
                  height: '80px', 
                  backgroundColor: '#f8f9fa', 
                  border: '3px solid #007bff'
                }}
              >
                <img 
                  src="https://firebasestorage.googleapis.com/v0/b/su25-swp391-g8.firebasestorage.app/o/assets%2Flogo.png?alt=media&token=1c903ba1-852a-4f5b-b498-97c31ffbb742" 
                  alt="ADN Lab Logo"
                  style={{ 
                    width: '50px', 
                    height: '50px', 
                    objectFit: 'contain'
                  }}
                />
              </div>
              <h2 className="text-primary fw-bold">ADN LAB</h2>
              <p className="text-muted">Trung tâm xét nghiệm ADN hàng đầu</p>
            </div>

            <Card className="shadow-lg border-0">
              <Card.Header className="bg-primary text-white text-center py-4">
                <h4 className="mb-0 fw-bold">
                  <i className="bi bi-box-arrow-in-right me-2"></i>
                  Đăng nhập
                </h4>
                <p className="mb-0 mt-2 opacity-75">
                  Truy cập vào tài khoản của bạn
                </p>
              </Card.Header>

              <Card.Body className="p-4">
                {/* Error Alert */}
                {loginError && (
                  <Alert variant="danger" className="mb-4">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {loginError}
                  </Alert>
                )}

                {/* Quick Login Toggle */}
                <div className="text-center mb-3">
                  <Button 
                    variant="outline-secondary" 
                    size="sm"
                    onClick={() => setShowQuickLogin(!showQuickLogin)}
                  >
                    <i className="bi bi-lightning me-1"></i>
                    {showQuickLogin ? 'Ẩn' : 'Hiện'} Quick Login (Dev)
                  </Button>
                </div>

                {/* Quick Login Section */}
                {showQuickLogin && (
                  <Card className="bg-light mb-4">
                    <Card.Body className="p-3">
                      <h6 className="text-center mb-3">
                        <i className="bi bi-lightning text-warning me-1"></i>
                        Quick Login for Testing
                      </h6>
                      <Row>
                        <Col xs={6} className="mb-2">
                          <Button 
                            variant="outline-danger" 
                            size="sm" 
                            className="w-100"
                            onClick={() => handleQuickLogin('admin')}
                            disabled={isLoading || loading}
                          >
                            <i className="bi bi-crown me-1"></i>
                            Admin
                          </Button>
                        </Col>
                        <Col xs={6} className="mb-2">
                          <Button 
                            variant="outline-info" 
                            size="sm" 
                            className="w-100"
                            onClick={() => handleQuickLogin('staff')}
                            disabled={isLoading || loading}
                          >
                            <i className="bi bi-person-badge me-1"></i>
                            Staff
                          </Button>
                        </Col>
                        <Col xs={6} className="mb-2">
                          <Button 
                            variant="outline-warning" 
                            size="sm" 
                            className="w-100"
                            onClick={() => handleQuickLogin('manager')}
                            disabled={isLoading || loading}
                          >
                            <i className="bi bi-briefcase me-1"></i>
                            Manager
                          </Button>
                        </Col>
                        <Col xs={6} className="mb-2">
                          <Button 
                            variant="outline-primary" 
                            size="sm" 
                            className="w-100"
                            onClick={() => handleQuickLogin('customer')}
                            disabled={isLoading || loading}
                          >
                            <i className="bi bi-person me-1"></i>
                            Customer
                          </Button>
                        </Col>
                      </Row>
                      <div className="mt-2">
                        <small className="text-muted">
                          <i className="bi bi-info-circle me-1"></i>
                          Simulates login and direct redirect (bypasses Firebase)
                        </small>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                {/* Login Form */}
                <Form onSubmit={formik.handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">
                      <i className="bi bi-envelope me-2"></i>
                      Email <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="email"
                      name="email"
                      placeholder="Nhập địa chỉ email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.email && formik.errors.email}
                      size="lg"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.email}
                    </Form.Control.Feedback>
                    <Form.Text className="text-muted">
                      💡 Tip: Sử dụng admin@adnlab.vn để truy cập Admin Dashboard
                    </Form.Text>
                  </Form.Group>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">
                      <i className="bi bi-lock me-2"></i>
                      Mật khẩu <span className="text-danger">*</span>
                    </Form.Label>
                    <InputGroup size="lg">
                      <Form.Control
                        type={showPassword ? 'text' : 'password'}
                        name="password"
                        placeholder="Nhập mật khẩu"
                        value={formik.values.password}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isInvalid={formik.touched.password && formik.errors.password}
                      />
                      <Button 
                        variant="outline-secondary"
                        onClick={() => setShowPassword(!showPassword)}
                        style={{ borderLeft: 'none' }}
                      >
                        <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                      </Button>
                      <Form.Control.Feedback type="invalid">
                        {formik.errors.password}
                      </Form.Control.Feedback>
                    </InputGroup>
                  </Form.Group>

                  <div className="text-end mb-4">
                    <Link to="/reset" className="text-decoration-none small">
                      <i className="bi bi-arrow-clockwise me-1"></i>
                      Quên mật khẩu?
                    </Link>
                  </div>

                  <div className="d-grid gap-2 mb-4">
                    <Button
                      type="submit"
                      variant="primary" 
                      size="lg"
                      disabled={isLoading || loading}
                      className="fw-medium"
                    >
                      {isLoading || loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Đang xử lý...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-box-arrow-in-right me-2"></i>
                          Đăng nhập
                        </>
                      )}
                    </Button>
                  </div>
                </Form>

                {/* Divider */}
                <div className="text-center mb-4">
                  <div className="position-relative">
                    <hr />
                    <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                      Hoặc đăng nhập với
                    </span>
                  </div>
                </div>

                {/* Google Sign In */}
                <div className="d-grid gap-2 mb-4">
                  <Button
                    variant="outline-danger"
                    size="lg"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading || loading}
                    className="fw-medium"
                  >
                    {isLoading || loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-google me-2"></i>
                        Đăng nhập với Google
                      </>
                    )}
                  </Button>
                </div>

                {/* Register Link */}
                <div className="text-center">
                  <p className="text-muted mb-0">
                    Chưa có tài khoản?{' '}
                    <Link to="/register" className="text-decoration-none fw-medium">
                      Đăng ký ngay
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>

            {/* Admin Info Card */}
            <Card className="border-0 bg-warning bg-opacity-10 mt-3">
              <Card.Body className="p-3">
                <h6 className="text-warning mb-2">
                  <i className="bi bi-crown me-1"></i>
                  Admin Access Information
                </h6>
                <div className="small text-muted">
                  <div className="mb-1">
                    <strong>Admin Emails:</strong> {adminEmails.join(', ')}
                  </div>
                  <div className="mb-1">
                    <strong>Staff Emails:</strong> {staffEmails.join(', ')}
                  </div>
                  <div>
                    <strong>Manager Emails:</strong> {managerEmails.join(', ')}
                  </div>
                  <hr className="my-2" />
                  <div className="text-center">
                    <small>
                      <i className="bi bi-info-circle me-1"></i>
                      Auto role assignment based on login email and Firestore data
                    </small>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* Footer Info */}
            <div className="text-center mt-4">
              <div className="mb-3">
                <small className="text-muted">
                  <i className="bi bi-shield-check me-1"></i>
                  Thông tin đăng nhập được bảo mật theo tiêu chuẩn quốc tế
                </small>
              </div>
              <div className="d-flex justify-content-center gap-4 flex-wrap">
                <Link to="/contact" className="text-decoration-none small text-muted">
                  <i className="bi bi-telephone me-1"></i>
                  Hỗ trợ: 1900 1234
                </Link>
                <Link to="/privacy" className="text-decoration-none small text-muted">
                  <i className="bi bi-shield me-1"></i>
                  Chính sách bảo mật
                </Link>
              </div>
            </div>
          </Col>
        </Row>

        {/* Benefits Section */}
        <Row className="justify-content-center mt-5">
          <Col lg={10}>
            <Card className="border-0 bg-light">
              <Card.Body className="p-4">
                <h5 className="text-center mb-4 text-primary">
                  <i className="bi bi-star me-2"></i>
                  Lợi ích khi có tài khoản ADN LAB
                </h5>
                <Row>
                  <Col md={3} className="text-center mb-3">
                    <i className="bi bi-calendar-check text-success fs-1 mb-2 d-block"></i>
                    <h6>Quản lý lịch hẹn</h6>
                    <small className="text-muted">
                      Theo dõi và quản lý tất cả lịch hẹn xét nghiệm của bạn
                    </small>
                  </Col>
                  <Col md={3} className="text-center mb-3">
                    <i className="bi bi-file-earmark-check text-info fs-1 mb-2 d-block"></i>
                    <h6>Xem kết quả trực tuyến</h6>
                    <small className="text-muted">
                      Nhận và tải kết quả xét nghiệm ngay khi có
                    </small>
                  </Col>
                  <Col md={3} className="text-center mb-3">
                    <i className="bi bi-bell text-warning fs-1 mb-2 d-block"></i>
                    <h6>Thông báo tự động</h6>
                    <small className="text-muted">
                      Nhận thông báo về lịch hẹn và kết quả qua email/SMS
                    </small>
                  </Col>
                  <Col md={3} className="text-center mb-3">
                    <i className="bi bi-shield-lock text-danger fs-1 mb-2 d-block"></i>
                    <h6>Admin Dashboard</h6>
                    <small className="text-muted">
                      Quản lý hệ thống và dữ liệu (dành cho admin)
                    </small>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
