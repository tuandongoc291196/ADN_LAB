/**
 * COMPONENT: Register
 * MỤC ĐÍCH: Form đăng ký tài khoản mới với Firebase Authentication
 * CHỨC NĂNG:
 * - Đăng ký tài khoản bằng email/password hoặc Google
 * - Validation form đầy đủ (email, phone, password strength)
 * - Tích hợp Firebase Authentication
 * - Hiển thị benefits khi đăng ký tài khoản
 * - UX/UI thân thiện với feedback rõ ràng
 */

import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, InputGroup } from 'react-bootstrap';
import { 
  auth, 
  registerWithEmailAndPassword, 
  signInWithGoogle 
} from '../config/firebase'; // Firebase configuration
import { useAuthState } from 'react-firebase-hooks/auth'; // Hook theo dõi auth state

const Register = ({ setUser }) => {
  // HOOKS & STATE MANAGEMENT
  // Hook theo dõi trạng thái authentication của Firebase
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate(); // Hook điều hướng React Router
  
  // State quản lý dữ liệu form đăng ký
  const [formData, setFormData] = useState({
    fullName: '',         // Họ và tên đầy đủ
    email: '',            // Địa chỉ email
    phone: '',            // Số điện thoại
    password: '',         // Mật khẩu
    confirmPassword: '',  // Xác nhận mật khẩu
    agreeTerms: false     // Đồng ý điều khoản
  });
  
  // State quản lý UI và trạng thái
  const [showPassword, setShowPassword] = useState(false);           // Hiện/ẩn mật khẩu
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // Hiện/ẩn confirm password
  const [error, setError] = useState('');                           // Thông báo lỗi
  const [isLoading, setIsLoading] = useState(false);                // Trạng thái đang xử lý
  const [success, setSuccess] = useState(false);                    // Trạng thái đăng ký thành công

  // EFFECTS & LIFECYCLE
  // Effect xử lý sau khi đăng ký thành công
  useEffect(() => {
    if (loading) return; // Đợi Firebase Auth hoàn tất
    
    if (user) {
      // Cập nhật thông tin user cho app
      if (setUser) {
        setUser({
          id: user.uid,
          name: user.displayName || user.email?.split('@')[0] || 'User',
          email: user.email,
          role: 'user' // Role mặc định cho user mới
        });
      }
      navigate('/user'); // Chuyển đến trang user dashboard
    }
  }, [user, loading, navigate, setUser]);

  // EVENT HANDLERS
  // Xử lý thay đổi input form
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value // Xử lý riêng cho checkbox
    });
    
    // Reset error khi user nhập lại
    if (error) setError('');
  };

  // Xử lý đăng ký bằng Google
  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError('');
      await signInWithGoogle();
    } catch (error) {
      setError('Đăng ký Google thất bại. Vui lòng thử lại.');
      console.error('Google sign in error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // VALIDATION
  // Kiểm tra hợp lệ của form trước khi submit
  const validateForm = () => {
    // Kiểm tra họ và tên
    if (!formData.fullName || formData.fullName.length < 2) {
      setError('Họ và tên phải có ít nhất 2 ký tự');
      return false;
    }

    // Kiểm tra email với regex
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError('Email không hợp lệ');
      return false;
    }

    // Kiểm tra số điện thoại (10-11 số)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Số điện thoại không hợp lệ');
      return false;
    }
    
    // Kiểm tra độ dài mật khẩu
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }

    // Kiểm tra độ mạnh mật khẩu
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/;
    if (!passwordRegex.test(formData.password)) {
      setError('Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số');
      return false;
    }
    
    // Kiểm tra khớp mật khẩu
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    
    // Kiểm tra đồng ý điều khoản
    if (!formData.agreeTerms) {
      setError('Bạn phải đồng ý với điều khoản sử dụng');
      return false;
    }
    
    return true;
  };

  // FORM SUBMISSION
  // Xử lý submit form đăng ký
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form trước khi submit
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    setError('');

    try {
      // Gọi API đăng ký Firebase
      await registerWithEmailAndPassword(
        formData.fullName,
        formData.phone,
        formData.email,
        formData.password
      );
      
      // Xử lý thành công
      setSuccess(true);
      
      // Reset form
      setFormData({
        fullName: '',
        email: '',
        phone: '',
        password: '',
        confirmPassword: '',
        agreeTerms: false
      });
      
    } catch (err) {
      // Xử lý các loại lỗi từ Firebase
      let errorMessage = 'Đăng ký thất bại. Email có thể đã được sử dụng.';
      
      if (err.code) {
        switch (err.code) {
          case 'auth/email-already-in-use':
            errorMessage = 'Email này đã được sử dụng. Vui lòng chọn email khác.';
            break;
          case 'auth/invalid-email':
            errorMessage = 'Định dạng email không hợp lệ.';
            break;
          case 'auth/weak-password':
            errorMessage = 'Mật khẩu quá yếu. Vui lòng chọn mật khẩu mạnh hơn.';
            break;
          case 'auth/network-request-failed':
            errorMessage = 'Lỗi kết nối mạng. Vui lòng kiểm tra kết nối internet.';
            break;
          default:
            errorMessage = err.message || 'Đã xảy ra lỗi. Vui lòng thử lại sau.';
        }
      }
      
      setError(errorMessage);
      console.error('Registration error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '2rem', paddingBottom: '2rem' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={6} md={8} sm={10}>
            {/* HEADER - Tiêu đề và mô tả */}
            <div className="text-center mb-4">
              <div className="bg-success rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-person-plus text-white fs-1"></i>
              </div>
              <h2 className="text-success fw-bold">Tạo tài khoản mới</h2>
              <p className="text-muted">Đăng ký để trải nghiệm dịch vụ ADN LAB</p>
            </div>

            <Card className="shadow-lg border-0">
              {/* CARD HEADER */}
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
                {/* ALERT LỖI */}
                {error && (
                  <Alert variant="danger" className="mb-4">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </Alert>
                )}

                {/* ALERT THÀNH CÔNG */}
                {success && (
                  <Alert variant="success" className="mb-4">
                    <i className="bi bi-check-circle me-2"></i>
                    Đăng ký tài khoản thành công! Vui lòng chờ trong giây lát, hệ thống sẽ chuyển đến trang đăng nhập.
                  </Alert>
                )}

                {/* FORM ĐĂNG KÝ */}
                <Form onSubmit={handleSubmit}>
                  {/* Input Họ và tên */}
                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">
                      <i className="bi bi-person me-2"></i>
                      Họ và tên <span className="text-danger">*</span>
                    </Form.Label>
                    <Form.Control
                      type="text"
                      name="fullName"
                      placeholder="Nhập họ và tên đầy đủ"
                      value={formData.fullName}
                      onChange={handleChange}
                      required
                      disabled={isLoading || success}
                      size="lg"
                    />
                  </Form.Group>

                  <Row>
                    <Col md={6}>
                      {/* Input Email */}
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">
                          <i className="bi bi-envelope me-2"></i>
                          Email <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Nhập địa chỉ email"
                          value={formData.email}
                          onChange={handleChange}
                          required
                          disabled={isLoading || success}
                          size="lg"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      {/* Input Số điện thoại */}
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">
                          <i className="bi bi-telephone me-2"></i>
                          Số điện thoại <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          name="phone"
                          placeholder="Nhập số điện thoại"
                          value={formData.phone}
                          onChange={handleChange}
                          required
                          disabled={isLoading || success}
                          size="lg"
                        />
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row>
                    <Col md={6}>
                      {/* Input Mật khẩu với toggle hiện/ẩn */}
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
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={isLoading || success}
                          />
                          {/* Button toggle hiện/ẩn mật khẩu */}
                          <Button 
                            variant="outline-secondary"
                            onClick={() => setShowPassword(!showPassword)}
                            style={{ borderLeft: 'none' }}
                            disabled={isLoading || success}
                          >
                            <i className={`bi bi-eye${showPassword ? '-slash' : ''}`}></i>
                          </Button>
                        </InputGroup>
                        <Form.Text className="text-muted small">
                          Mật khẩu phải chứa ít nhất 1 chữ hoa, 1 chữ thường và 1 số
                        </Form.Text>
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      {/* Input Xác nhận mật khẩu */}
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
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={isLoading || success}
                          />
                          {/* Button toggle hiện/ẩn confirm password */}
                          <Button 
                            variant="outline-secondary"
                            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                            style={{ borderLeft: 'none' }}
                            disabled={isLoading || success}
                          >
                            <i className={`bi bi-eye${showConfirmPassword ? '-slash' : ''}`}></i>
                          </Button>
                        </InputGroup>
                      </Form.Group>
                    </Col>
                  </Row>

                  {/* Checkbox đồng ý điều khoản */}
                  <Form.Group className="mb-4">
                    <Form.Check 
                      type="checkbox"
                      id="agreeTerms"
                      name="agreeTerms"
                      checked={formData.agreeTerms}
                      onChange={handleChange}
                      required
                      disabled={isLoading || success}
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
                  </Form.Group>

                  {/* Button submit đăng ký */}
                  <div className="d-grid gap-2 mb-4">
                    <Button
                      type="submit"
                      variant="success" 
                      size="lg"
                      disabled={isLoading || loading || success}
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

                {/* DIVIDER - Phân cách giữa form đăng ký và Google Sign Up */}
                <div className="text-center mb-4">
                  <div className="position-relative">
                    <hr />
                    <span className="position-absolute top-50 start-50 translate-middle bg-white px-3 text-muted small">
                      Hoặc đăng ký với
                    </span>
                  </div>
                </div>

                {/* GOOGLE SIGN UP - Đăng ký bằng tài khoản Google */}
                <div className="d-grid gap-2 mb-4">
                  <Button
                    variant="outline-danger"
                    size="lg"
                    onClick={handleGoogleSignIn}
                    disabled={isLoading || loading || success}
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

                {/* LINK ĐĂNG NHẬP - Chuyển đến trang đăng nhập */}
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

            {/* FOOTER INFO - Thông tin liên hệ và bảo mật */}
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

        {/* BENEFITS SECTION - Lợi ích khi đăng ký tài khoản */}
        <Row className="justify-content-center mt-5">
          <Col lg={10}>
            <Card className="border-0 bg-light">
              <Card.Body className="p-4">
                <h5 className="text-center mb-4 text-success">
                  <i className="bi bi-star me-2"></i>
                  Tại sao nên tạo tài khoản ADN LAB?
                </h5>
                <Row>
                  {/* Benefit 1: Đặt lịch nhanh */}
                  <Col md={3} className="text-center mb-3">
                    <i className="bi bi-speedometer2 text-primary fs-1 mb-2 d-block"></i>
                    <h6>Đặt lịch nhanh chóng</h6>
                    <small className="text-muted">
                      Đặt lịch xét nghiệm chỉ trong 2 phút
                    </small>
                  </Col>
                  {/* Benefit 2: Quản lý lịch hẹn */}
                  <Col md={3} className="text-center mb-3">
                    <i className="bi bi-calendar-check text-success fs-1 mb-2 d-block"></i>
                    <h6>Quản lý lịch hẹn</h6>
                    <small className="text-muted">
                      Theo dõi tất cả lịch hẹn của bạn
                    </small>
                  </Col>
                  {/* Benefit 3: Nhận kết quả online */}
                  <Col md={3} className="text-center mb-3">
                    <i className="bi bi-file-earmark-check text-info fs-1 mb-2 d-block"></i>
                    <h6>Nhận kết quả trực tuyến</h6>
                    <small className="text-muted">
                      Xem và tải kết quả ngay khi có
                    </small>
                  </Col>
                  {/* Benefit 4: Ưu đãi độc quyền */}
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