import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';

const BookingConfirmation = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    if (location.state) {
      if (location.state.bookingData) {
        setBookingData(location.state.bookingData);
        console.log('Booking data received:', location.state.bookingData);
        console.log('Selected service:', location.state.bookingData.selectedService);
        console.log('Selected method:', location.state.bookingData.selectedMethod);
      }
      if (location.state.bookingId) {
        setBookingId(location.state.bookingId);
      } else {
        // Fallback: Generate booking ID nếu không có từ backend
        const id = 'ADN' + Date.now().toString().slice(-6);
        setBookingId(id);
      }
    }
  }, [location.state]);

  const handleProceedToPayment = () => {
    navigate('/payment', { 
      state: { 
        bookingData: {
          ...bookingData,
          bookingId: bookingId
        }
      } 
    });
  };

  if (!bookingData) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Không tìm thấy thông tin đặt lịch. Vui lòng thử lại.
        </Alert>
        <div className="text-center">
          <Button as={Link} to="/appointment" variant="primary">
            Đặt lịch mới
          </Button>
        </div>
      </Container>
    );
  }

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const getServiceTypeBadge = (serviceType, category) => {
    // Ưu tiên lấy từ category nếu có
    if (category) {
      if (category.hasLegalValue) {
        return <Badge bg="warning" text="dark">ADN Hành chính</Badge>;
      } else {
        return <Badge bg="success">ADN Dân sự</Badge>;
      }
    }
    
    // Fallback về serviceType cũ
    return serviceType === 'administrative' 
      ? <Badge bg="warning" text="dark">ADN Hành chính</Badge>
      : <Badge bg="success">ADN Dân sự</Badge>;
  };

  const getCollectionMethodName = (methodId, methodInfo) => {
    // Ưu tiên lấy tên từ methodInfo nếu có
    if (methodInfo && methodInfo.name) {
      return methodInfo.name;
    }
    
    // Fallback về mapping cũ
    const methods = {
      '0': 'Tự lấy mẫu tại nhà',
      '1': 'Nhân viên tới nhà lấy mẫu',
      '2': 'Tới cơ sở lấy mẫu',
      'self-sample': 'Tự lấy mẫu tại nhà',
      'home-visit': 'Nhân viên tới nhà lấy mẫu',
      'at-facility': 'Tới cơ sở lấy mẫu'
    };
    return methods[methodId] || methodId;
  };

  return (
    <Container className="py-5">
      {/* Success Header */}
      <Row className="mb-4">
        <Col className="text-center">
          <div className="mb-4">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
          </div>
          <h1 className="text-success mb-3">Thông tin đặt lịch đã được xác nhận!</h1>
          <p className="lead text-muted">
            Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi. Vui lòng tiến hành thanh toán để hoàn tất đặt lịch.
          </p>
        </Col>
      </Row>

      {/* Booking Details */}
      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <Card className="shadow">
            <Card.Header className="bg-success text-white">
              <Row className="align-items-center">
                <Col>
                  <h5 className="mb-0">
                    <i className="bi bi-clipboard-check me-2"></i>
                    Chi tiết đặt lịch
                  </h5>
                </Col>
                <Col xs="auto">
                  <Badge bg="light" text="dark" className="fs-6">
                    Mã đặt lịch: <strong>{bookingId}</strong>
                  </Badge>
                </Col>
              </Row>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6} className="mb-4">
                  <h6 className="text-primary mb-3">
                    <i className="bi bi-gear me-2"></i>
                    Thông tin dịch vụ
                  </h6>
                  <div className="mb-2">
                    <strong>Tên dịch vụ:</strong>
                    <div className="text-muted">
                      {(() => {
                        const serviceTitle = bookingData?.selectedService?.title;
                        console.log('Rendering service title:', serviceTitle);
                        return serviceTitle || 'Không có thông tin';
                      })()}
                    </div>
                  </div>
                  <div className="mb-2">
                    <strong>Loại dịch vụ:</strong>
                    <div className="mt-1">
                      {getServiceTypeBadge(bookingData.serviceType, bookingData?.selectedService?.category)}
                    </div>
                  </div>
                  <div className="mb-2">
                    <strong>Phương thức thu mẫu:</strong>
                    <div className="text-muted">
                      {getCollectionMethodName(bookingData.collectionMethod, bookingData?.selectedMethod)}
                    </div>
                  </div>
                </Col>

                <Col md={6} className="mb-4">
                  <h6 className="text-primary mb-3">
                    <i className="bi bi-calendar me-2"></i>
                    Thời gian hẹn
                  </h6>
                  {bookingData.collectionMethod === 'self-sample' ? (
                    <div>
                      <div className="mb-2">
                        <strong>Phương thức:</strong>
                        <div className="text-muted">Tự lấy mẫu tại nhà</div>
                      </div>
                      <div className="mb-2">
                        <strong>Kit sẽ được gửi đến:</strong>
                        <div className="text-muted">{bookingData.customerInfo.address}</div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <div className="mb-2">
                        <strong>Ngày hẹn:</strong>
                        <div className="text-muted">{formatDate(bookingData.appointmentDate)}</div>
                      </div>
                      <div className="mb-2">
                        <strong>Giờ hẹn:</strong>
                        <div className="text-muted">{bookingData.appointmentTime}</div>
                      </div>
                      <div className="mb-2">
                        <strong>Địa điểm:</strong>
                        <div className="text-muted">
                          {bookingData.collectionMethod === 'at-facility' ? 
                            'Trung tâm xét nghiệm ADN - 123 Đường ABC, Quận XYZ' :
                            bookingData.customerInfo.address
                          }
                        </div>
                      </div>
                    </div>
                  )}
                </Col>
              </Row>

              <hr />

              <Row>
                <Col md={6} className="mb-4">
                  <h6 className="text-primary mb-3">
                    <i className="bi bi-person me-2"></i>
                    Thông tin liên hệ
                  </h6>
                  <div className="mb-2">
                    <strong>Họ tên:</strong>
                    <div className="text-muted">{bookingData.customerInfo.fullName}</div>
                  </div>
                  <div className="mb-2">
                    <strong>Điện thoại:</strong>
                    <div className="text-muted">{bookingData.customerInfo.phone}</div>
                  </div>
                  <div className="mb-2">
                    <strong>Email:</strong>
                    <div className="text-muted">{bookingData.customerInfo.email || 'Không có'}</div>
                  </div>
                </Col>

                <Col md={6} className="mb-4">
                  <h6 className="text-primary mb-3">
                    <i className="bi bi-people me-2"></i>
                    Người tham gia
                  </h6>
                  {bookingData.customerInfo.participants.length > 0 ? (
                    bookingData.customerInfo.participants.map((participant, index) => (
                      <div key={index} className="mb-2 p-2 bg-light rounded">
                        <div><strong>{participant.role}:</strong> {participant.name}</div>
                        <small className="text-muted">CCCD: {participant.idNumber}</small>
                      </div>
                    ))
                  ) : (
                    <div className="text-muted">
                      Thông tin sẽ được cập nhật khi thanh toán
                    </div>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Next Steps */}
      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <Card className="border-info">
            <Card.Header className="bg-info text-white">
              <h5 className="mb-0">
                <i className="bi bi-list-check me-2"></i>
                Các bước tiếp theo
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-4">
                <Alert variant="warning" className="mb-3">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Quan trọng:</strong> Vui lòng hoàn tất thanh toán trong vòng 30 phút để giữ lịch hẹn.
                </Alert>

                <div className="d-flex align-items-start mb-3">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-3" 
                       style={{ width: '40px', height: '40px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    1
                  </div>
                  <div>
                    <h6 className="mb-2">Thanh toán dịch vụ</h6>
                    <p className="text-muted mb-0">
                      Chọn phương thức thanh toán phù hợp và hoàn tất giao dịch
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-3">
                  <div className="bg-light text-muted rounded-circle d-flex align-items-center justify-content-center me-3" 
                       style={{ width: '40px', height: '40px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    2
                  </div>
                  <div>
                    <h6 className="mb-2">Nhận xác nhận</h6>
                    <p className="text-muted mb-0">
                      Bạn sẽ nhận email và SMS xác nhận sau khi thanh toán thành công
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start mb-3">
                  <div className="bg-light text-muted rounded-circle d-flex align-items-center justify-content-center me-3" 
                       style={{ width: '40px', height: '40px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    3
                  </div>
                  <div>
                    <h6 className="mb-2">
                      {bookingData.collectionMethod === 'self-sample' ? 'Nhận kit' : 'Chuẩn bị xét nghiệm'}
                    </h6>
                    <p className="text-muted mb-0">
                      {bookingData.collectionMethod === 'self-sample' ? 
                        'Kit sẽ được gửi đến địa chỉ của bạn trong 1-2 ngày làm việc' :
                        'Chuẩn bị giấy tờ và có mặt đúng giờ hẹn'
                      }
                    </p>
                  </div>
                </div>

                <div className="d-flex align-items-start">
                  <div className="bg-light text-muted rounded-circle d-flex align-items-center justify-content-center me-3" 
                       style={{ width: '40px', height: '40px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    4
                  </div>
                  <div>
                    <h6 className="mb-2">Nhận kết quả</h6>
                    <p className="text-muted mb-0">
                      Kết quả sẽ có trong <strong>
                      {bookingData.serviceType === 'civil' ? '5-7 ngày' : '3-5 ngày'} làm việc
                      </strong> kể từ khi nhận được mẫu
                    </p>
                  </div>
                </div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Payment CTA */}
      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <Card className="border-warning bg-warning bg-opacity-10">
            <Card.Body className="text-center py-4">
              <h4 className="text-warning mb-3">
                <i className="bi bi-credit-card me-2"></i>
                Hoàn tất thanh toán
              </h4>
              <p className="mb-4">
                Tiến hành thanh toán để xác nhận đặt lịch và bắt đầu quy trình xét nghiệm ADN
              </p>
              <div className="d-flex justify-content-center gap-3">
                <Button 
                  variant="warning" 
                  size="lg"
                  onClick={handleProceedToPayment}
                  className="px-4"
                >
                  <i className="bi bi-arrow-right me-2"></i>
                  Tiến hành thanh toán
                </Button>
                <Button 
                  variant="outline-secondary" 
                  size="lg"
                  as={Link}
                  to="/appointment"
                >
                  <i className="bi bi-arrow-left me-2"></i>
                  Quay lại chỉnh sửa
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Contact Information */}
      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <Card className="border-primary">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-telephone me-2"></i>
                Thông tin liên hệ
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={4} className="text-center mb-3">
                  <i className="bi bi-headset text-primary fs-1 mb-2 d-block"></i>
                  <h6>Hotline hỗ trợ</h6>
                  <p className="mb-0"><strong>1900 1234</strong></p>
                  <small className="text-muted">24/7</small>
                </Col>
                <Col md={4} className="text-center mb-3">
                  <i className="bi bi-envelope text-primary fs-1 mb-2 d-block"></i>
                  <h6>Email hỗ trợ</h6>
                  <p className="mb-0"><strong>support@adnlab.vn</strong></p>
                  <small className="text-muted">Phản hồi trong 2h</small>
                </Col>
                <Col md={4} className="text-center mb-3">
                  <i className="bi bi-chat-dots text-primary fs-1 mb-2 d-block"></i>
                  <h6>Live Chat</h6>
                  <Button variant="outline-primary" size="sm">
                    Chat ngay
                  </Button>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Save/Print Options */}
      <Row>
        <Col className="text-center">
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <Button variant="outline-success" onClick={() => window.print()}>
              <i className="bi bi-printer me-2"></i>
              In thông tin
            </Button>
            <Button variant="outline-info" onClick={() => {
              const content = `Mã đặt lịch: ${bookingId}\nDịch vụ: ${bookingData.serviceType === 'civil' ? 'ADN Dân sự' : 'ADN Hành chính'}\nKhách hàng: ${bookingData.customerInfo.fullName}`;
              navigator.clipboard.writeText(content);
              alert('Đã copy thông tin vào clipboard!');
            }}>
              <i className="bi bi-clipboard me-2"></i>
              Copy thông tin
            </Button>
          </div>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingConfirmation;