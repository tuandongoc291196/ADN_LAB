import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, InputGroup } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { 
  auth, 
  registerWithEmailAndPassword, 
  signInWithGoogle 
} from '../config/firebase';
import { useAuthState } from 'react-firebase-hooks/auth';

const Register = ({ setUser }) => {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [registerError, setRegisterError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (loading) return;
    if (user) {
      // Set the user in the parent component
      setUser({
        id: user.uid,
        name: user.displayName || user.email?.split('@')[0] || 'User',
        email: user.email,
        role: 'user'
      });
      navigate('/user');
    }
  }, [user, loading, navigate, setUser]);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setRegisterError('');
      await signInWithGoogle();
    } catch (error) {
      setRegisterError('Đăng ký Google thất bại. Vui lòng thử lại.');
      console.error('Google sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const formik = useFormik({
    initialValues: {
      fullName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      agreeTerms: false,
    },
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setRegisterError('');
        const { fullName, email, password } = values;
        await registerWithEmailAndPassword(fullName, email, password);
      } catch (error) {
        setRegisterError('Đăng ký thất bại. Email có thể đã được sử dụng.');
        console.error('Register error:', error);
      } finally {
        setIsLoading(false);
      }
    },
    validationSchema: Yup.object().shape({
      fullName: Yup.string()
        .required('Họ và tên là bắt buộc')
        .min(2, 'Họ và tên phải có ít nhất 2 ký tự'),
      email: Yup.string()
        .required('Email là bắt buộc')
        .email('Email không hợp lệ'),
      phone: Yup.string()
        .required('Số điện thoại là bắt buộc')
        .matches(/^[0-9]{10,11}$/, 'Số điện thoại không hợp lệ'),
      password: Yup.string()
        .required('Mật khẩu là bắt buộc')
        .min(6, 'Mật khẩu phải có ít nhất 6 ký tự')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/, 'Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số'),
      confirmPassword: Yup.string()
        .required('Xác nhận mật khẩu là bắt buộc')
        .oneOf([Yup.ref('password')], 'Mật khẩu xác nhận không khớp'),
      agreeTerms: Yup.boolean()
        .oneOf([true], 'Bạn phải đồng ý với điều khoản sử dụng'),
    }),
  });

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={6} md={8} sm={10}>
            {/* Header */}
            <div className="text-center mb-4">
              <div className="bg-success rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-person-plus text-white fs-1"></i>
              </div>
              <h2 className="text-success fw-bold">Tạo tài khoản mới</h2>
              <p className="text-muted">Đăng ký để trải nghiệm dịch vụ ADN LAB</p>
            </div>

            <Card className="shadow-lg border-0">
              <Card.Header className="bg-success text-white text-center py-4">
                <h4 className="mb-0 fw-bold">
                  <i className="bi bi-person-plus me-2"></i>
                  Đăng ký tài khoản
                </h4>
                <p className="mb-0 mt-2 opacity-75">
                  Hoàn toàn miễn phí và nhanh chóng
                </p>
              </Card.Header>

              <Card.Body className="p-4">
                {/* Error Alert */}
                {registerError && (
                  <Alert variant="danger" className="mb-4">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {registerError}
                  </Alert>
                )}

                {/* Register Form */}
                <Form onSubmit={formik.handleSubmit}>
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">
                      <i className="bi bi-person me-2"></i>
                      Họ và tên <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      placeholder="Nhập họ và tên đầy đủ"
                      value={formik.values.fullName}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      isInvalid={formik.touched.fullName && formik.errors.fullName}
                      size="lg"
                    />
                    <Form.Control.Feedback type="invalid">
                      {formik.errors.fullName}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <Row>
                    <Col md={6}>
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
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">
                          <i className="bi bi-telephone me-2"></i>
                          Số điện thoại <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          placeholder="Nhập số điện thoại"
                          value={formik.values.phone}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isInvalid={formik.touched.phone && formik.errors.phone}
                          size="lg"
                        />
                        <Form.Control.Feedback type="invalid">
                          {formik.errors.phone}
                        </Form.Control.Feedback>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
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
                        <Form.Text className="text-muted small">
                          Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">
                          <i className="bi bi-lock-fill me-2"></i>
                          Xác nhận mật khẩu <span className="text-danger">*</span>
                        </Form.Label>
                        <InputGroup size="lg">
                          <Form.Control
                            type={showConfirmPassword ? 'text' : 'password'}
                            name="confirmPassword"
                            placeholder="Nhập lại mật khẩu"
                            value={formik.values.confirmPassword}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isInvalid={formik.touched.confirmPassword && formik.errors.confirmPassword}
                          />
                          <Button 
                            variant="outline-secondary"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{ borderLeft: 'none' }}
                          >
                            <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                          </Button>
                          <Form.Control.Feedback type="invalid">
                            {formik.errors.confirmPassword}
                          </Form.Control.Feedback>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-4">
                    <Form.Check 
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formik.values.agreeTerms}
                      onChange={formik.handleChange}
                      isInvalid={formik.touched.agreeTerms && formik.errors.agreeTerms}
                      label={
                        <span>
                          Tôi đồng ý với{' '}
                          <Link to="/terms" target="_blank" className="text-decoration-none">
                            Điều khoản sử dụng
                          </Link>{' '}
                          và{' '}
                          <Link to="/privacy" target="_blank" className="text-decoration-none">
                            Chính sách bảo mật
                          </Link>{' '}
                          của ADN LAB <span className="text-danger">*</span>
                        </span>
                      }
                    />
                    <Form.Control.Feedback type="invalid" style={{ display: formik.touched.agreeTerms && formik.errors.agreeTerms ? 'block' : 'none' }}>
                      {formik.errors.agreeTerms}
                    </Form.Control.Feedback>
                  </Form.Group>

                  <div className="d-grid gap-2 mb-4">
                    <Button
                      type="submit"
                      variant="success" 
                      size="lg"
                      disabled={isLoading || loading}
                      className="fw-medium"
                    >
                      {isLoading || loading ? (
                        <>
                          <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                          Đang tạo tài khoản...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-person-plus me-2"></i>
                          Tạo tài khoản
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
                      Hoặc đăng ký với
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
                        Đăng ký với Google
                      </>
                    )}
                  </Button>
                </div>

                {/* Login Link */}
                <div className="text-center">
                  <p className="text-muted mb-0">
                    Đã có tài khoản?{' '}
                    <Link to="/login" className="text-decoration-none fw-medium">
                      Đăng nhập ngay
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>

            {/* Footer Info */}
            <div className="text-center mt-4">
              <div className="mb-3">
                <small className="text-muted">
                  <i className="bi bi-shield-check me-1"></i>
                  Thông tin cá nhân được bảo mật tuyệt đối theo tiêu chuẩn quốc tế
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

        {/* Why Register Section */}
        <Row className="justify-content-center mt-5">
          <Col lg={10}>
            <Card className="border-0 bg-light">
              <Card.Body className="p-4">
                <h5 className="text-center mb-4 text-success">
                  <i className="bi bi-star me-2"></i>
                  Tại sao nên tạo tài khoản ADN LAB?
                </h5>
                <Row>
                  <Col md={3} className="text-center mb-3">
                    <i className="bi bi-speedometer2 text-primary fs-1 mb-2 d-block"></i>
                    <h6>Đặt lịch nhanh chóng</h6>
                    <small className="text-muted">
                      Đặt lịch xét nghiệm chỉ trong 2 phút
                    </small>
                  </Col>
                  <Col md={3} className="text-center mb-3">
                    <i className="bi bi-calendar-check text-success fs-1 mb-2 d-block"></i>
                    <h6>Quản lý lịch hẹn</h6>
                    <small className="text-muted">
                      Theo dõi tất cả lịch hẹn của bạn
                    </small>
                  </Col>
                  <Col md={3} className="text-center mb-3">
                    <i className="bi bi-file-earmark-check text-info fs-1 mb-2 d-block"></i>
                    <h6>Nhận kết quả trực tuyến</h6>
                    <small className="text-muted">
                      Xem và tải kết quả ngay khi có
                    </small>
                  </Col>
                  <Col md={3} className="text-center mb-3">
                    <i className="bi bi-percent text-warning fs-1 mb-2 d-block"></i>
                    <h6>Ưu đãi độc quyền</h6>
                    <small className="text-muted">
                      Nhận thông báo khuyến mãi đặc biệt
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

export default Register;