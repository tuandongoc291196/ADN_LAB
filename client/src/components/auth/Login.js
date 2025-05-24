import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Form, Button, Alert } from 'react-bootstrap';
import axios from 'axios';

const Login = ({ setUser }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when user starts typing again
    if (error) setError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      // In a real application, this would be an API call to your backend
      // const response = await axios.post('/api/auth/login', formData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock response
      const mockUser = {
        id: 1,
        name: 'Nguyễn Văn A',
        email: formData.email,
        role: 'user'
      };
      
      // Store user data and token
      localStorage.setItem('token', 'mock-jwt-token');
      localStorage.setItem('user', JSON.stringify(mockUser));
      
      // Update user state in App component
      setUser(mockUser);
      
      // Redirect to appropriate dashboard based on role
      if (mockUser.role === 'admin') {
        navigate('/admin');
      } else if (mockUser.role === 'manager') {
        navigate('/manager');
      } else if (mockUser.role === 'staff') {
        navigate('/staff');
      } else {
        navigate('/user');
      }
    } catch (err) {
      setError('Email hoặc mật khẩu không chính xác. Vui lòng thử lại.');
      console.error('Login error:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className="py-5">
      <Row className="justify-content-center">
        <Col md={6}>
          <Card className="shadow-sm">
            <Card.Body className="p-4">
              <div className="text-center mb-4">
                <h2 className="fw-bold">Đăng nhập</h2>
                <p className="text-muted">Đăng nhập để truy cập vào tài khoản của bạn</p>
              </div>
              
              {error && <Alert variant="danger">{error}</Alert>}
              
              <Form onSubmit={handleSubmit}>
                <Form.Group className="mb-3" controlId="email">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Nhập địa chỉ email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <Form.Group className="mb-4" controlId="password">
                  <Form.Label>Mật khẩu</Form.Label>
                  <Form.Control
                    type="password"
                    name="password"
                    placeholder="Nhập mật khẩu"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                </Form.Group>
                
                <div className="d-grid">
                  <Button 
                    variant="primary" 
                    type="submit" 
                    size="lg" 
                    disabled={loading}
                  >
                    {loading ? 'Đang xử lý...' : 'Đăng nhập'}
                  </Button>
                </div>
              </Form>
              
              <div className="mt-4 text-center">
                <p>
                  <Link to="/forgot-password" className="text-decoration-none">
                    Quên mật khẩu?
                  </Link>
                </p>
                
                <p className="mb-0">
                  Chưa có tài khoản?{' '}
                  <Link to="/register" className="text-decoration-none">
                    Đăng ký ngay
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

export default Login; 