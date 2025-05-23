import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const Register = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeTerms: false
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'checkbox' ? checked : value
    });
    
    // Clear error when user starts typing again
    if (error) setError(null);
  };

  const validateForm = () => {
    // Password should be at least 6 characters
    if (formData.password.length < 6) {
      setError('Mật khẩu phải có ít nhất 6 ký tự');
      return false;
    }
    
    // Passwords should match
    if (formData.password !== formData.confirmPassword) {
      setError('Mật khẩu xác nhận không khớp');
      return false;
    }
    
    // Terms should be accepted
    if (!formData.agreeTerms) {
      setError('Vui lòng chấp nhận điều khoản dịch vụ');
      return false;
    }
    
    // Phone number validation (simple example)
    const phoneRegex = /^[0-9]{10,11}$/;
    if (!phoneRegex.test(formData.phone)) {
      setError('Số điện thoại không hợp lệ');
      return false;
    }
    
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form before submission
    if (!validateForm()) {
      return;
    }
    
    setLoading(true);
    setError(null);

    try {
      // In a real application, this would be an API call to your backend
      // const response = await axios.post('/api/auth/register', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Show success message
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
      
      // Redirect to login page after a delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      if (err.response && err.response.data && err.response.data.message) {
        setError(err.response.data.message);
      } else {
        setError('Đã xảy ra lỗi. Vui lòng thử lại sau.');
      }
      console.error('Registration error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={8}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Đăng ký tài khoản</h2>
                <p className="text-muted">Tạo tài khoản để sử dụng dịch vụ xét nghiệm ADN</p>
              </div>
              
              {error && <Alert variant="danger">{error}</Alert>}
              {success && (
                <Alert variant="success">
                  Đăng ký tài khoản thành công! Vui lòng chờ trong giây lát, hệ thống sẽ chuyển đến trang đăng nhập.
                </Alert>
              )}
              
              <Form onSubmit={handleSubmit}>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="fullName">
                      <Form.Label>Họ và tên</Form.Label>
                      <Form.Control
                        type="text"
                        name="fullName"
                        placeholder="Nhập họ và tên đầy đủ"
                        value={formData.fullName}
                        onChange={handleChange}
                        required
                        disabled={loading || success}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="phone">
                      <Form.Label>Số điện thoại</Form.Label>
                      <Form.Control
                        type="tel"
                        name="phone"
                        placeholder="Nhập số điện thoại"
                        value={formData.phone}
                        onChange={handleChange}
                        required
                        disabled={loading || success}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Nhập địa chỉ email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    disabled={loading || success}
                  />
                </Form.Group>
                
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="password">
                      <Form.Label>Mật khẩu</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        placeholder="Nhập mật khẩu (ít nhất 6 ký tự)"
                        value={formData.password}
                        onChange={handleChange}
                        required
                        disabled={loading || success}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3" controlId="confirmPassword">
                      <Form.Label>Xác nhận mật khẩu</Form.Label>
                      <Form.Control
                        type="password"
                        name="confirmPassword"
                        placeholder="Nhập lại mật khẩu"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        required
                        disabled={loading || success}
                      />
                    </Form.Group>
                  </Col>
                </Row>
                
                <Form.Group className="mb-4" controlId="agreeTerms">
                  <Form.Check
                    type="checkbox"
                    name="agreeTerms"
                    label={
                      <span>
                        Tôi đồng ý với{' '}
                        <Link to="/terms" target="_blank">
                          Điều khoản dịch vụ
                        </Link>{' '}
                        và{' '}
                        <Link to="/privacy" target="_blank">
                          Chính sách bảo mật
                        </Link>
                      </span>
                    }
                    checked={formData.agreeTerms}
                    onChange={handleChange}
                    required
                    disabled={loading || success}
                  />
                </Form.Group>
                
                <div className="d-grid">
                  <Button
                    variant="primary"
                    type="submit"
                    size="lg"
                    disabled={loading || success}
                  >
                    {loading ? 'Đang xử lý...' : 'Đăng ký'}
                  </Button>
                </div>
              </Form>
              
              <div className="mt-4 text-center">
                <p className="mb-0">
                  Đã có tài khoản?{' '}
                  <Link to="/login" className="text-decoration-none">
                    Đăng nhập
                  </Link>
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Register; 