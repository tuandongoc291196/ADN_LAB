/**
 * COMPONENT: Reset
 * MỤC ĐÍCH: Form reset mật khẩu với Firebase Authentication
 * CHỨC NĂNG:
 * - Gửi email reset mật khẩu
 * - Validation email với Formik và Yup
 * - Hiển thị hướng dẫn chi tiết sau khi gửi email
 * - UX/UI thân thiện với 2 states: form input và success
 * - Cung cấp hỗ trợ khách hàng khi gặp vấn đề
 */

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert } from 'react-bootstrap';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { sendPasswordResetEmail } from 'firebase/auth';
import { auth } from '../config/firebase';

const Reset = () => {
  // STATE MANAGEMENT
  const [isLoading, setIsLoading] = useState(false);    // Trạng thái loading
  const [message, setMessage] = useState('');           // Thông báo thành công
  const [error, setError] = useState('');              // Thông báo lỗi
  const [emailSent, setEmailSent] = useState(false);   // Trạng thái đã gửi email

  // FORM CONFIGURATION
  const formik = useFormik({
    // Giá trị khởi tạo
    initialValues: {
      email: '',
    },
    // Xử lý submit form
    onSubmit: async (values) => {
      try {
        setIsLoading(true);
        setError('');
        setMessage('');
        
        // Gọi API Firebase gửi email reset
        await sendPasswordResetEmail(auth, values.email);
        
        // Cập nhật UI khi thành công
        setEmailSent(true);
        setMessage('Email khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra hộp thư của bạn.');
      } catch (error) {
        console.error('Password reset error:', error);
        // Xử lý các loại lỗi từ Firebase
        if (error.code === 'auth/user-not-found') {
          setError('Không tìm thấy tài khoản với địa chỉ email này.');
        } else if (error.code === 'auth/invalid-email') {
          setError('Địa chỉ email không hợp lệ.');
        } else {
          setError('Có lỗi xảy ra. Vui lòng thử lại sau.');
        }
      } finally {
        setIsLoading(false);
      }
    },
    // Validation schema với Yup
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required('Email là bắt buộc')
        .email('Email không hợp lệ'),
    }),
  });

  return (
    <div style={{ backgroundColor: '#f8f9fa', minHeight: '100vh', paddingTop: '3rem', paddingBottom: '3rem' }}>
      <Container>
        <Row className="justify-content-center">
          <Col lg={5} md={7} sm={9}>
            {/* HEADER - Logo và tiêu đề */}
            <div className="text-center mb-4">
              <div className="bg-warning rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                   style={{ width: '80px', height: '80px' }}>
                <i className="bi bi-arrow-clockwise text-white fs-1"></i>
              </div>
              <h2 className="text-warning fw-bold">Khôi phục mật khẩu</h2>
              <p className="text-muted">
                {/* Mô tả động dựa trên trạng thái */}
                {emailSent ? 
                  'Hướng dẫn đã được gửi đến email của bạn' : 
                  'Nhập email để nhận hướng dẫn đặt lại mật khẩu'
                }
              </p>
            </div>

            {/* CARD - Form reset password */}
            <Card className="shadow-lg border-0">
              {/* Card header */}
              <Card.Header className="bg-warning text-dark text-center py-4">
                <h4 className="mb-0 fw-bold">
                  <i className="bi bi-key me-2"></i>
                  {/* Tiêu đề động dựa trên trạng thái */}
                  {emailSent ? 'Email đã được gửi' : 'Quên mật khẩu'}
                </h4>
                <p className="mb-0 mt-2 opacity-75">
                  {/* Phụ đề động dựa trên trạng thái */}
                  {emailSent ? 
                    'Kiểm tra hộp thư của bạn' : 
                    'Chúng tôi sẽ gửi link khôi phục qua email'
                  }
                </p>
              </Card.Header>

              <Card.Body className="p-4">
                {/* Thông báo thành công */}
                {message && (
                  <Alert variant="success" className="mb-4">
                    <i className="bi bi-check-circle me-2"></i>
                    {message}
                  </Alert>
                )}

                {/* Thông báo lỗi */}
                {error && (
                  <Alert variant="danger" className="mb-4">
                    <i className="bi bi-exclamation-circle me-2"></i>
                    {error}
                  </Alert>
                )}

                {/* CONDITIONAL RENDERING - Hiển thị form hoặc trạng thái thành công */}
                {!emailSent ? (
                  <>
                    {/* Form nhập email */}
                    <Form onSubmit={formik.handleSubmit}>
                      <Form.Group className="mb-4">
                        <Form.Label className="fw-medium">
                          <i className="bi bi-envelope me-2"></i>
                          Địa chỉ email <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="email"
                          name="email"
                          placeholder="Nhập địa chỉ email đã đăng ký"
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
                          Nhập email bạn đã sử dụng để đăng ký tài khoản ADN LAB
                        </Form.Text>
                      </Form.Group>

                      {/* Button submit */}
                      <div className="d-grid gap-2 mb-4">
                        <Button
                          type="submit"
                          variant="warning" 
                          size="lg"
                          disabled={isLoading}
                          className="fw-medium"
                        >
                          {isLoading ? (
                            <>
                              <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                              Đang gửi email...
                            </>
                          ) : (
                            <>
                              <i className="bi bi-send me-2"></i>
                              Gửi email khôi phục
                            </>
                          )}
                        </Button>
                      </div>
                    </Form>
                  </>
                ) : (
                  <>
                    {/* SUCCESS STATE - Hiển thị sau khi gửi email thành công */}
                    <div className="text-center mb-4">
                      <div className="bg-success bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                           style={{ width: '80px', height: '80px' }}>
                        <i className="bi bi-envelope-check text-success fs-1"></i>
                      </div>
                      <h5 className="text-success mb-3">Email đã được gửi thành công!</h5>
                      <p className="text-muted mb-4">
                        Chúng tôi đã gửi hướng dẫn khôi phục mật khẩu đến địa chỉ email:{' '}
                        <strong>{formik.values.email}</strong>
                      </p>
                    </div>

                    {/* INSTRUCTIONS - Hướng dẫn các bước tiếp theo */}
                    <Alert variant="info" className="mb-4">
                      <i className="bi bi-info-circle me-2"></i>
                      <strong>Hướng dẫn tiếp theo:</strong>
                      <ol className="mb-0 mt-2">
                        <li>Kiểm tra hộp thư đến của bạn</li>
                        <li>Tìm email từ ADN LAB với tiêu đề "Khôi phục mật khẩu"</li>
                        <li>Click vào link trong email để đặt lại mật khẩu</li>
                        <li>Tạo mật khẩu mới và đăng nhập</li>
                      </ol>
                    </Alert>

                    {/* Button thử lại với email khác */}
                    <div className="d-grid gap-2 mb-3">
                      <Button
                        variant="outline-warning"
                        size="lg"
                        onClick={() => {
                          setEmailSent(false);
                          setMessage('');
                          setError('');
                          formik.resetForm();
                        }}
                      >
                        <i className="bi bi-arrow-left me-2"></i>
                        Gửi lại email khác
                      </Button>
                    </div>
                  </>
                )}

                {/* LINK QUAY LẠI ĐĂNG NHẬP */}
                <div className="text-center">
                  <p className="text-muted mb-0">
                    Nhớ mật khẩu rồi?{' '}
                    <Link to="/login" className="text-decoration-none fw-medium">
                      Đăng nhập ngay
                    </Link>
                  </p>
                </div>
              </Card.Body>
            </Card>

            {/* HELP SECTION - Hỗ trợ khách hàng */}
            <Card className="mt-4 border-info">
              <Card.Body className="p-4">
                <h6 className="text-info mb-3">
                  <i className="bi bi-question-circle me-2"></i>
                  Không nhận được email?
                </h6>
                <ul className="list-unstyled mb-3">
                  <li className="mb-2">
                    <i className="bi bi-check2 text-success me-2"></i>
                    Kiểm tra thư mục Spam/Junk Mail
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check2 text-success me-2"></i>
                    Đảm bảo địa chỉ email chính xác
                  </li>
                  <li className="mb-2">
                    <i className="bi bi-check2 text-success me-2"></i>
                    Chờ thêm vài phút (có thể chậm trễ)
                  </li>
                </ul>
                <div className="text-center">
                  <p className="text-muted mb-2">Vẫn gặp khó khăn?</p>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <Link to="/contact" className="btn btn-outline-info btn-sm">
                      <i className="bi bi-telephone me-1"></i>
                      Gọi 1900 1234
                    </Link>
                    <Button variant="outline-info" size="sm">
                      <i className="bi bi-chat-dots me-1"></i>
                      Chat hỗ trợ
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>

            {/* FOOTER SECURITY INFO */}
            <div className="text-center mt-4">
              <div className="mb-3">
                <small className="text-muted">
                  <i className="bi bi-shield-check me-1"></i>
                  Liên kết khôi phục mật khẩu có hiệu lực trong 24 giờ
                </small>
              </div>
              <div className="d-flex justify-content-center gap-4 flex-wrap">
                {/* Link tạo tài khoản mới */}
                <Link to="/register" className="text-decoration-none small text-muted">
                  <i className="bi bi-person-plus me-1"></i>
                  Tạo tài khoản mới
                </Link>
                {/* Link chính sách bảo mật */}
                <Link to="/privacy" className="text-decoration-none small text-muted">
                  <i className="bi bi-shield me-1"></i>
                  Chính sách bảo mật
                </Link>
              </div>
            </div>
          </Col>
        </Row>
      </Container>
    </div>
  );
};

export default Reset;