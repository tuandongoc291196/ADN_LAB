/**
 * COMPONENT: Login
 * MỤC ĐÍCH: Form đăng nhập với tích hợp Firebase Authentication
 * CHỨC NĂNG:
 * - Đăng nhập bằng email/password hoặc Google
 * - Validation form với Formik và Yup
 * - Tự động điều hướng theo role của user
 * - Xử lý trạng thái loading và error
 * - Lưu thông tin user vào localStorage
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, InputGroup, Badge } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  auth, 
  logInWithEmailAndPassword, 
  signInWithGoogle,
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
      
      if (user) {
        try {
          const { data: userData } = await getUser(dataConnect, { userId: user.uid });
          
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
  }, [user, loading, navigate, setUser]);

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

                {/* DIVIDER - Phân cách giữa form đăng nhập và Google Sign In */}
                <div className="text-center mb-4">
                  <div className="position-relative">
                    <hr />
                    <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                      Hoặc đăng nhập với
                    </span>
                  </div>
                </div>

                {/* GOOGLE SIGN IN - Đăng nhập bằng tài khoản Google */}
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

                {/* LINK ĐĂNG KÝ - Chuyển đến trang đăng ký */}
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
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Login;
