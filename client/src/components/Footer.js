import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col } from 'react-bootstrap';

// Component Footer: Hiển thị phần chân trang của website
// Chứa thông tin liên hệ, chi nhánh, liên kết nhanh, mạng xã hội và bản quyền
const Footer = () => {
  // Thông tin liên hệ trung tâm
  return (
    <footer className="bg-dark text-light py-5 mt-5">
      <Container>
        <Row>
          <Col lg={4} md={6} className="mb-4 mb-md-0 d-flex flex-column">
            <h5 className="text-uppercase mb-4">Trung tâm Xét nghiệm ADN</h5>
            <p>  
              Trung tâm xét nghiệm ADN cung cấp các dịch vụ xét nghiệm ADN với độ chính xác cao, 
              bảo mật thông tin và giá cả cạnh tranh. Chúng tôi cam kết mang đến những dịch vụ 
              chất lượng nhất cho khách hàng.
            </p>
            <div className="d-flex justify-content-center mt-4 mt-auto">
              <a href="https://facebook.com" className="text-light me-3" target="_blank" rel="noreferrer">
                <i className="bi bi-facebook fs-4"></i>
              </a>
              <a href="https://youtube.com" className="text-light me-3" target="_blank" rel="noreferrer">
                <i className="bi bi-youtube fs-4"></i>
              </a>
              <a href="https://tiktok.com" className="text-light me-3" target="_blank" rel="noreferrer">
                <i className="bi bi-tiktok fs-4"></i>
              </a>
            </div>
          </Col>
          
          <Col lg={4} md={6} className="mb-4 mb-md-0">
            <h5 className="text-uppercase mb-4">Hệ thống văn phòng</h5>
            
            <div className="mb-3">
              <h6 className="fw-bold">CN1: Chi nhánh Hà Nội</h6>
              <p className="mb-1 small">Tòa nhà ADN, Số 123 Đường ABC, Quận XYZ, Hà Nội</p>
              <p className="mb-0 small">
                <i className="bi bi-telephone me-2"></i>
                <a href="tel:0834243399" className="text-light text-decoration-none">083.424.3399</a>
              </p>
            </div>
            
            <div className="mb-3">
              <h6 className="fw-bold">CN2: Chi nhánh TP.HCM</h6>
              <p className="mb-1 small">Tòa nhà DEF, Số 456 Đường GHI, Quận JKL, TP. Hồ Chí Minh</p>
              <p className="mb-0 small">
                <i className="bi bi-telephone me-2"></i>
                <a href="tel:0888109486" className="text-light text-decoration-none">0888.109.486</a>
              </p>
            </div>
            
            <div>
              <h6 className="fw-bold">CN3: Chi nhánh Đà Nẵng</h6>
              <p className="mb-1 small">Tòa nhà MNO, Số 789 Đường PQR, Quận STU, Đà Nẵng</p>
              <p className="mb-0 small">
                <i className="bi bi-telephone me-2"></i>
                <a href="tel:09111855777" className="text-light text-decoration-none">0911.18.5577</a>
              </p>
            </div>
          </Col>
          
          <Col lg={4} md={12} className="mt-4 mt-lg-0">
            <h5 className="text-uppercase mb-4">Liên kết</h5>
            <Row>
              <Col xs={6}>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Link to="/" className="text-light text-decoration-none">Trang chủ</Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/about" className="text-light text-decoration-none">Giới thiệu</Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/services" className="text-light text-decoration-none">Dịch vụ</Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/prices" className="text-light text-decoration-none">Bảng giá</Link>
                  </li>
                </ul>
              </Col>
              <Col xs={6}>
                <ul className="list-unstyled">
                  <li className="mb-2">
                    <Link to="/terms" className="text-light text-decoration-none">Điều khoản dịch vụ</Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/privacy" className="text-light text-decoration-none">Chính sách bảo mật</Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/contact" className="text-light text-decoration-none">Liên hệ</Link>
                  </li>
                  <li className="mb-2">
                    <Link to="/faq" className="text-light text-decoration-none">FAQ</Link>
                  </li>
                </ul>
              </Col>
            </Row>
            
            <h5 className="text-uppercase mt-4 mb-3">Đăng ký nhận tin</h5>
            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="Nhập email của bạn"
                aria-label="Nhập email của bạn"
              />
              <button className="btn btn-primary" type="button">
                Đăng ký
              </button>
            </div>
          </Col>
        </Row>
        
        <hr className="my-4" />
        
        <Row>
          <Col className="text-center">
            <p className="mb-0">
              &copy; {new Date().getFullYear()} - Bản quyền thuộc về ADN LAB.
            </p>
          </Col>
        </Row>
      </Container>
    </footer>
  );
};

export default Footer; 