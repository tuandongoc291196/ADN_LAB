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
  // Hooks và state quản lý đăng nhập
  const [user, loading] = useAuthState(auth);          // Trạng thái auth từ Firebase
  const navigate = useNavigate();                      // Hook điều hướng
  const [showPassword, setShowPassword] = useState(false); // Ẩn/hiện mật khẩu
  const [loginError, setLoginError] = useState('');    // Thông báo lỗi
  const [isLoading, setIsLoading] = useState(false);   // Trạng thái loading

  // Hàm xác định đường dẫn điều hướng theo role
  const getRedirectPath = (role) => {
    switch (role) {
      case 'admin': return '/admin';
      case 'staff': return '/staff';
      case 'manager': return '/manager';
      case 'customer': return '/user';
      default: return '/user';
    }
  };

  // Effect xử lý sau khi đăng nhập thành công
  useEffect(() => {
    const handleUserLogin = async () => {
      if (loading) return;
      
      if (user) {
        try {
          // Thử lấy thông tin user từ database với retry logic cho trường hợp Google Sign-In
          let userData = null;
          let retries = 3;
          
          while (retries > 0 && !userData?.user) {
            try {
              const { data } = await getUser(dataConnect, { userId: user.uid });
              userData = data;
              
              if (userData?.user) {
                break; // Tìm thấy user, thoát khỏi loop
              }
            } catch (error) {
              console.log(`Retry ${4 - retries}: User not found yet, retrying...`);
            }
            
            retries--;
            if (retries > 0) {
              // Đợi 1 giây trước khi thử lại (cho phép Firebase hoàn thành tạo user)
              await new Promise(resolve => setTimeout(resolve, 1000));
            }
          }
          
          if (userData && userData.user) {
            const userInfo = userData.user;
            
            // Tạo object chứa thông tin user cho app
            const appUser = {
              ...userInfo,
              id: userInfo.id,
              name: userInfo.fullname,
              email: userInfo.email,
              role: userInfo.role?.name || 'customer',
              avatar: userInfo.avatar,
              verified: user.emailVerified,
              phone: userInfo.phone,
              // Xác định department dựa trên role
              department: userInfo.role?.name === 'admin' ? 'Administration' : 
                         userInfo.role?.name === 'staff' ? 'Laboratory' :
                         userInfo.role?.name === 'manager' ? 'Management' : null,
              // Phân quyền dựa trên role
              permissions: userInfo.role?.name === 'admin' ? ['all'] : 
                          userInfo.role?.name === 'staff' ? ['tests', 'reports'] :
                          userInfo.role?.name === 'manager' ? ['users', 'reports', 'guides'] :
                          ['profile', 'tests']
            };

            // Lưu thông tin user và trạng thái đăng nhập
            setUser(appUser);
            localStorage.setItem('isAuthenticated', 'true');
            
            // Điều hướng theo role
            navigate(getRedirectPath(appUser.role));
          } else {
            // Nếu vẫn không tìm thấy sau khi retry, hiển thị lỗi chi tiết hơn
            console.error('User not found after retries. User UID:', user.uid);
            setLoginError('Không thể tải thông tin tài khoản. Vui lòng thử đăng xuất và đăng nhập lại.');
          }
        } catch (error) {
          console.error('Error processing user login:', error);
          setLoginError('Đã có lỗi xảy ra khi đăng nhập. Vui lòng thử lại.');
        }
      }
    };

    handleUserLogin();
  }, [user, loading, navigate, setUser]);

  // Hàm xử lý đăng nhập bằng Google
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setLoginError('');
      
      // Gọi hàm signInWithGoogle và đợi hoàn thành
      await signInWithGoogle();
      
      // Không cần xử lý gì thêm ở đây vì useEffect sẽ xử lý khi user state thay đổi
    } catch (error) {
      console.error('Google sign in error:', error);
      
      // Xử lý các loại lỗi khác nhau
      if (error.code === 'auth/popup-closed-by-user') {
        setLoginError('Đăng nhập đã bị hủy. Vui lòng thử lại.');
      } else if (error.code === 'auth/popup-blocked') {
        setLoginError('Popup đăng nhập bị chặn. Vui lòng cho phép popup và thử lại.');
      } else if (error.code === 'auth/network-request-failed') {
        setLoginError('Lỗi kết nối mạng. Vui lòng kiểm tra internet và thử lại.');
      } else {
        setLoginError('Đăng nhập Google thất bại. Vui lòng thử lại.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Cấu hình form với Formik và Yup
  const formik = useFormik({
    // Giá trị khởi tạo
    initialValues: {
      email: '',
      password: '',
    },
    // Xử lý submit form
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
    // Validation schema với Yup
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
            {/* HEADER - Logo và tiêu đề */}
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

            {/* CARD - Form đăng nhập */}
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
                {/* Thông báo lỗi */}
                {loginError && (
                  <Alert variant="danger" className="mb-4">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {loginError}
                  </Alert>
                )}

                {/* Form đăng nhập */}
                <Form onSubmit={formik.handleSubmit}>
                  {/* Input email */}
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
