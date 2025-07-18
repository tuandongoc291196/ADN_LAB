/**
 * COMPONENT: MethodsList
 * MỤC ĐÍCH: Hiển thị danh sách các phương thức thu mẫu xét nghiệm ADN
 * CHỨC NĂNG:
 * - Hiển thị các phương thức dưới dạng grid cards
 * - Mỗi card hiển thị: icon, tên, mô tả, ghi chú, quy trình, phí
 * - Tích hợp API để lấy dữ liệu methods
 * - Fallback UI cho loading và error states
 * - Mapping thông tin hiển thị cho từng loại phương thức
 * - Responsive UI cho mobile và desktop
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Alert, Spinner } from 'react-bootstrap';
import { getAllMethods } from '../../services/api';
import './MethodsList.css';

const MethodsList = () => {
  // COMPONENT STATE
  const [methods, setMethods] = useState([]); // Danh sách phương thức từ API
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error message

  // EFFECTS & DATA FETCHING
  // Effect: Fetch dữ liệu khi component mount
  useEffect(() => {
    const fetchMethods = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getAllMethods();
        setMethods(data || []);
      } catch (err) {
        console.error('Error fetching methods:', err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchMethods();
  }, []);

  // HELPER FUNCTIONS
  // Lấy thông tin hiển thị cho từng phương thức
  const getMethodDisplayInfo = (methodId) => {
    // Mapping thông tin hiển thị cho các phương thức chuẩn
    const methodDisplayInfo = {
      // Phương thức tự lấy mẫu tại nhà
      'self-sample': {
        icon: 'bi-house',
        color: 'success',
        title: 'Lấy mẫu tại nhà',
        description: 'Tự thu mẫu theo hướng dẫn tại nhà',
        note: 'Chỉ áp dụng cho xét nghiệm ADN dân sự',
        process: ['Đặt hẹn', 'Nhận kit', 'Thu mẫu', 'Gửi lại', 'Nhận kết quả']
      },
      
      // Phương thức nhân viên đến nhà lấy mẫu
      'home-visit': {
        icon: 'bi-truck',
        color: 'warning',
        title: 'Nhân viên tới nhà lấy mẫu',
        description: 'Nhân viên chuyên nghiệp đến tận nhà thu mẫu',
        note: 'Phí dịch vụ nhân viên: 400,000 VNĐ (trong nội thành)',
        process: ['Đặt hẹn', 'Nhân viên đến', 'Thu mẫu', 'Xét nghiệm', 'Nhận kết quả']
      },
      
      // Phương thức đến cơ sở lấy mẫu
      'at-facility': {
        icon: 'bi-hospital',
        color: 'primary',
        title: 'Tới cơ sở lấy mẫu',
        description: 'Đến trực tiếp cơ sở y tế để lấy mẫu',
        note: 'Đảm bảo tính chính xác và có giá trị pháp lý',
        process: ['Đặt hẹn', 'Đến cơ sở', 'Thu mẫu', 'Xét nghiệm', 'Nhận kết quả']
      }
    };

    // Fallback cho phương thức không có trong mapping
    return methodDisplayInfo[methodId] || {
      icon: 'bi-gear',
      color: 'secondary',
      title: 'Phương thức thu mẫu',
      description: 'Phương thức thu mẫu chuyên nghiệp',
      note: null,
      process: ['Đặt hẹn', 'Thu mẫu', 'Xét nghiệm', 'Nhận kết quả']
    };
  };

  // LOADING STATE
  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Đang tải danh sách phương thức lấy mẫu...</p>
      </Container>
    );
  }

  // ERROR STATE
  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Đã xảy ra lỗi</Alert.Heading>
          <p>Không thể tải dữ liệu phương thức lấy mẫu. Vui lòng thử lại sau.</p>
          <hr />
          <p className="mb-0">Chi tiết lỗi: {error}</p>
        </Alert>
      </Container>
    );
  }

  // UI RENDERING
  return (
    <div className="methods-list-page">
      {/* HEADER - Tiêu đề trang */}
      <header className="page-header text-center text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold">Phương thức lấy mẫu</h1>
          <p className="lead">Các phương thức thu mẫu ADN chuyên nghiệp và đáng tin cậy</p>
        </Container>
      </header>

      {/* METHODS GRID - Danh sách phương thức */}
      <Container className="py-5">
        <Row xs={1} md={2} lg={3} className="g-4">
          {methods.map(method => {
            const displayInfo = getMethodDisplayInfo(method.id);
            
            return (
              <Col key={method.id}>
                <Card className="h-100 method-card shadow-sm border-0">
                  <Card.Body className="d-flex flex-column">
                    {/* METHOD ICON & TITLE */}
                    <div className="text-center mb-3">
                      <div className={`rounded-circle p-3 mx-auto mb-3 bg-${displayInfo.color}`} style={{ width: '80px', height: '80px' }}>
                        <i className={`${displayInfo.icon} text-white fa-2x`}></i>
                      </div>
                      <h5 className="card-title">{displayInfo.title}</h5>
                    </div>
                    
                    {/* METHOD DESCRIPTION */}
                    <p className="text-muted flex-grow-1">{displayInfo.description}</p>
                    
                    {/* METHOD NOTE - Nếu có */}
                    {displayInfo.note && (
                      <Alert variant={displayInfo.color} className="small mb-3">
                        <i className="bi bi-info-circle me-1"></i>
                        {displayInfo.note}
                      </Alert>
                    )}
                    
                    {/* METHOD PROCESS - Quy trình các bước */}
                    <div className="mb-3">
                      <h6 className="mb-2">Quy trình:</h6>
                      <div className="process-steps">
                        {displayInfo.process.map((step, index) => (
                          <Badge 
                            key={index} 
                            bg="light" 
                            text="dark" 
                            className="me-1 mb-1"
                          >
                            {index + 1}. {step}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    {/* METHOD PRICE - Phí dịch vụ */}
                    <div className="mt-auto">
                      {method.price && method.price > 0 ? (
                        <p className="h6 text-primary fw-bold mb-0">
                          Phí dịch vụ: {method.price.toLocaleString('vi-VN')} VNĐ
                        </p>
                      ) : (
                        <p className="h6 text-success fw-bold mb-0">
                          <i className="bi bi-check-circle me-1"></i>
                          Miễn phí
                        </p>
                      )}
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            );
          })}
        </Row>
        
        {/* EMPTY STATE - Khi không có phương thức nào */}
        {methods.length === 0 && (
          <Alert variant="info" className="text-center py-5">
            <h4 className="alert-heading">Chưa có phương thức lấy mẫu</h4>
            <p>Hiện tại chưa có phương thức lấy mẫu nào được cấu hình trong hệ thống.</p>
          </Alert>
        )}
      </Container>
    </div>
  );
};

export default MethodsList; 