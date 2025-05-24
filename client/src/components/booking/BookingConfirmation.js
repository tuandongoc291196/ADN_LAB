import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';

const BookingConfirmation = () => {
  const location = useLocation();
  const [bookingData, setBookingData] = useState(null);
  const [bookingId, setBookingId] = useState('');

  useEffect(() => {
    if (location.state && location.state.bookingData) {
      setBookingData(location.state.bookingData);
      // Generate booking ID (in real app, this would come from server)
      const id = 'ADN' + Date.now().toString().slice(-6);
      setBookingId(id);
    }
  }, [location.state]);

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

  return (
    <Container className="py-5">
      {/* Success Header */}
      <Row className="mb-4">
        <Col className="text-center">
          <div className="mb-4">
            <i className="bi bi-check-circle-fill text-success" style={{ fontSize: '4rem' }}></i>
          </div>
          <h1 className="text-success mb-3">Đặt lịch thành công!</h1>
          <p className="lead text-muted">
            Cảm ơn bạn đã tin tưởng dịch vụ của chúng tôi. Lịch hẹn của bạn đã được xác nhận.
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
                    <strong>Dịch vụ:</strong>
                    <div className="text-muted">
                      {bookingData.serviceType === 'civil' ? 
                        services.civil.find(s => s.id === bookingData.serviceId)?.title :
                        services.administrative.find(s => s.id === bookingData.serviceId)?.title
                      }
                    </div>
                  </div>
                  <div className="mb-2">
                    <strong>Loại xét nghiệm:</strong>
                    <div>
                      <Badge bg={bookingData.serviceType === 'civil' ? 'success' : 'warning'}>
                        {bookingData.serviceType === 'civil' ? 'ADN Dân sự' : 'ADN Hành chính'}
                      </Badge>
                    </div>
                  </div>
                  <div className="mb-2">
                    <strong>Phương thức thu mẫu:</strong>
                    <div className="text-muted">
                      {bookingData.collectionMethod === 'self-sample' && 'Tự thu mẫu tại nhà'}
                      {bookingData.collectionMethod === 'home-visit' && 'Thu mẫu tại nhà'}
                      {bookingData.collectionMethod === 'at-facility' && 'Thu mẫu tại cơ sở'}
                    </div>
                  </div>
                </Col>

                <Col md={6} className="mb-4">
                  <h6 className="text-primary mb-3">
                    <i className="bi bi-calendar me-2"></i>
                    Thời gian hẹn
                  </h6>
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
                  {bookingData.customerInfo.participants.map((participant, index) => (
                    <div key={index} className="mb-2 p-2 bg-light rounded">
                      <div><strong>{participant.role}:</strong> {participant.name}</div>
                      <small className="text-muted">CCCD: {participant.idNumber}</small>
                    </div>
                  ))}
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
              {bookingData.collectionMethod === 'self-sample' && (
                <Alert variant="success" className="mb-3">
                  <h6><i className="bi bi-box me-2"></i>Nhận kit xét nghiệm</h6>
                  <ul className="mb-0">
                    <li>Kit sẽ được gửi đến địa chỉ của bạn trong <strong>1-2 ngày làm việc</strong></li>
                    <li>Kit bao gồm: Que lấy mẫu, hướng dẫn chi tiết, phong bì trả về</li>
                    <li>Thực hiện thu mẫu theo đúng hướng dẫn</li>
                    <li>Gửi mẫu về phòng lab trong vòng 3 ngày</li>
                  </ul>
                </Alert>
              )}

              {bookingData.collectionMethod === 'home-visit' && (
                <Alert variant="warning" className="mb-3">
                  <h6><i className="bi bi-truck me-2"></i>Nhân viên sẽ đến nhà</h6>
                  <ul className="mb-0">
                    <li>Nhân viên sẽ liên hệ trước <strong>30 phút</strong> trước giờ hẹn</li>
                    <li>Chuẩn bị CCCD/CMND của tất cả người tham gia</li>
                    <li>Quá trình thu mẫu mất khoảng <strong>15-20 phút</strong></li>
                    <li>Thanh toán trực tiếp cho nhân viên</li>
                  </ul>
                </Alert>
              )}

              {bookingData.collectionMethod === 'at-facility' && (
                <Alert variant="primary" className="mb-3">
                  <h6><i className="bi bi-hospital me-2"></i>Đến cơ sở y tế</h6>
                  <ul className="mb-0">
                    <li>Có mặt đúng giờ hẹn tại địa chỉ: <strong>123 Đường ABC, Quận XYZ</strong></li>
                    <li>Mang theo CCCD/CMND gốc của tất cả người tham gia</li>
                    <li>Tất cả đương sự phải có mặt đồng thời</li>
                    <li>Thanh toán tại quầy lễ tân</li>
                  </ul>
                </Alert>
              )}

              <div className="mt-3">
                <h6><i className="bi bi-clock-history me-2"></i>Thời gian có kết quả</h6>
                <p className="mb-0 text-muted">
                  Kết quả sẽ có trong <strong>
                  {bookingData.serviceType === 'civil' ? '5-7 ngày' : '3-5 ngày'} làm việc
                  </strong> kể từ khi nhận được mẫu. Bạn sẽ được thông báo qua SMS và email.
                </p>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Contact Information */}
      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <Card className="border-warning">
            <Card.Header className="bg-warning text-dark">
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

      {/* Action Buttons */}
      <Row>
        <Col className="text-center">
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button variant="primary" size="lg" as={Link} to="/user/appointments">
              <i className="bi bi-list-ul me-2"></i>
              Xem lịch hẹn của tôi
            </Button>
            <Button variant="outline-primary" size="lg" as={Link} to="/appointment">
              <i className="bi bi-plus-circle me-2"></i>
              Đặt lịch mới
            </Button>
            <Button variant="outline-secondary" size="lg" as={Link} to="/">
              <i className="bi bi-house me-2"></i>
              Về trang chủ
            </Button>
          </div>
        </Col>
      </Row>

      {/* Save/Print Options */}
      <Row className="mt-4">
        <Col className="text-center">
          <div className="d-flex justify-content-center gap-2 flex-wrap">
            <Button variant="outline-success" onClick={() => window.print()}>
              <i className="bi bi-printer me-2"></i>
              In thông tin
            </Button>
            <Button variant="outline-info" onClick={() => {
              const content = `Mã đặt lịch: ${bookingId}\nNgày hẹn: ${formatDate(bookingData.appointmentDate)}\nGiờ: ${bookingData.appointmentTime}`;
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

// Mock services data for display
const services = {
  civil: [
    {
      id: 'civil-1',
      title: 'Xét nghiệm ADN huyết thống cha-con',
      price: '3,500,000 VNĐ'
    },
    {
      id: 'civil-2',
      title: 'Xét nghiệm ADN thai nhi',
      price: '5,500,000 VNĐ'
    },
    {
      id: 'civil-3',
      title: 'Xét nghiệm ADN anh chị em',
      price: '4,200,000 VNĐ'
    }
  ],
  administrative: [
    {
      id: 'admin-1',
      title: 'Xét nghiệm ADN khai sinh',
      price: '4,200,000 VNĐ'
    },
    {
      id: 'admin-2',
      title: 'Xét nghiệm ADN di trú',
      price: '5,800,000 VNĐ'
    },
    {
      id: 'admin-3',
      title: 'Xét nghiệm ADN tòa án',
      price: '6,500,000 VNĐ'
    }
  ]
};

export default BookingConfirmation;