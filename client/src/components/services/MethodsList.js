import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Badge, Alert, Spinner } from 'react-bootstrap';
import { getAllMethods } from '../../services/api';
import './MethodsList.css';

const MethodsList = () => {
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  const getMethodDisplayInfo = (methodId) => {
    const methodDisplayInfo = {
      'self-sample': {
        icon: 'bi-house',
        color: 'success',
        title: 'Lấy mẫu tại nhà',
        description: 'Tự thu mẫu theo hướng dẫn tại nhà',
        note: 'Chỉ áp dụng cho xét nghiệm ADN dân sự',
        process: ['Đặt hẹn', 'Nhận kit', 'Thu mẫu', 'Gửi lại', 'Nhận kết quả']
      },
      'home-visit': {
        icon: 'bi-truck',
        color: 'warning',
        title: 'Nhân viên tới nhà lấy mẫu',
        description: 'Nhân viên chuyên nghiệp đến tận nhà thu mẫu',
        note: 'Phí dịch vụ nhân viên: 400,000 VNĐ (trong nội thành)',
        process: ['Đặt hẹn', 'Nhân viên đến', 'Thu mẫu', 'Xét nghiệm', 'Nhận kết quả']
      },
      'at-facility': {
        icon: 'bi-hospital',
        color: 'primary',
        title: 'Tới cơ sở lấy mẫu',
        description: 'Đến trực tiếp cơ sở y tế để lấy mẫu',
        note: 'Đảm bảo tính chính xác và có giá trị pháp lý',
        process: ['Đặt hẹn', 'Đến cơ sở', 'Thu mẫu', 'Xét nghiệm', 'Nhận kết quả']
      }
    };

    return methodDisplayInfo[methodId] || {
      icon: 'bi-gear',
      color: 'secondary',
      title: 'Phương thức thu mẫu',
      description: 'Phương thức thu mẫu chuyên nghiệp',
      note: null,
      process: ['Đặt hẹn', 'Thu mẫu', 'Xét nghiệm', 'Nhận kết quả']
    };
  };

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Đang tải danh sách phương thức lấy mẫu...</p>
      </Container>
    );
  }

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

  return (
    <div className="methods-list-page">
      <header className="page-header text-center text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold">Phương thức lấy mẫu</h1>
          <p className="lead">Các phương thức thu mẫu ADN chuyên nghiệp và đáng tin cậy</p>
        </Container>
      </header>

      <Container className="py-5">
        <Row xs={1} md={2} lg={3} className="g-4">
          {methods.map(method => {
            const displayInfo = getMethodDisplayInfo(method.id);
            
            return (
              <Col key={method.id}>
                <Card className="h-100 method-card shadow-sm border-0">
                  <Card.Body className="d-flex flex-column">
                    <div className="text-center mb-3">
                      <div className={`rounded-circle p-3 mx-auto mb-3 bg-${displayInfo.color}`} style={{ width: '80px', height: '80px' }}>
                        <i className={`${displayInfo.icon} text-white fa-2x`}></i>
                      </div>
                      <h5 className="card-title">{displayInfo.title}</h5>
                    </div>
                    
                    <p className="text-muted flex-grow-1">{displayInfo.description}</p>
                    
                    {displayInfo.note && (
                      <Alert variant={displayInfo.color} className="small mb-3">
                        <i className="bi bi-info-circle me-1"></i>
                        {displayInfo.note}
                      </Alert>
                    )}
                    
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