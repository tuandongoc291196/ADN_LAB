/**
 * COMPONENT: BookingConfirmation  
 * MỤC ĐÍCH: Hiển thị thông tin xác nhận đặt lịch và chuyển đến thanh toán
 * CHỨC NĂNG:
 * - Nhận booking data từ navigation state
 * - Hiển thị chi tiết dịch vụ, thời gian, phương thức thu mẫu
 * - Tính toán và hiển thị chi phí (service + method price)
 * - Button tiến hành thanh toán với state management
 * - Thông tin liên hệ hỗ trợ khách hàng
 * - Chức năng in/lưu thông tin đặt lịch
 * - Fallback handling nếu không có booking data
 */

import React, { useEffect, useState } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Badge } from 'react-bootstrap';

const BookingConfirmation = () => {
  // ROUTING & NAVIGATION
  const location = useLocation(); // Hook nhận state từ trang trước
  const navigate = useNavigate(); // Hook điều hướng

  // BOOKING DATA STATE
  const [bookingData, setBookingData] = useState(null); // Dữ liệu booking từ navigation state
  const [bookingId, setBookingId] = useState(''); // ID booking từ backend

  // EFFECTS & DATA HANDLING
  // Effect: Xử lý dữ liệu từ navigation state khi component mount
  useEffect(() => {
    if (location.state) {
      // Lấy booking data từ previous page
      if (location.state.bookingData) {
        setBookingData(location.state.bookingData);
        console.log('Booking data received:', location.state.bookingData);
        console.log('Selected service:', location.state.bookingData.selectedService);
        console.log('Selected method:', location.state.bookingData.selectedMethod);
      }

      // Lấy booking ID từ backend response hoặc generate fallback
      if (location.state.bookingId) {
        setBookingId(location.state.bookingId);
      } else {
        // Fallback: Generate booking ID nếu không có từ backend
        const id = 'ADN' + Date.now().toString().slice(-6);
        setBookingId(id);
      }
    }
  }, [location.state]); // Chạy khi location.state thay đổi

  // EVENT HANDLERS
  // Handler: Chuyển đến trang thanh toán với booking data
  const handleProceedToPayment = () => {
    navigate('/payment', {
      state: {
        bookingData: {
          ...bookingData,
          bookingId: bookingId // Kèm theo booking ID cho payment
        }
      }
    });
  };

  // ERROR HANDLING
  // Early return: Hiển thị error nếu không có booking data
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

  // HELPER FUNCTIONS
  // Format ngày theo chuẩn Việt Nam
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Hiển thị badge loại dịch vụ với logic ưu tiên
  const getServiceTypeBadge = (serviceType, category) => {
    // Ưu tiên lấy từ category nếu có (dữ liệu mới từ API)
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

  // Lấy tên phương thức thu mẫu với fallback
  const getCollectionMethodName = (methodId, methodInfo) => {
    // Ưu tiên lấy tên từ methodInfo nếu có (dữ liệu từ API)
    if (methodInfo && methodInfo.name) {
      return methodInfo.name;
    }

    // Fallback về mapping cũ cho ID cố định
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

  // Lấy màu badge cho phương thức thu mẫu
  const getMethodColor = (methodId) => {
    const methodColors = {
      'self-sample': 'success',  // Xanh lá - Tiện lợi
      'home-visit': 'warning',   // Vàng - Trung bình  
      'at-facility': 'primary',  // Xanh dương - Chính thức
      '0': 'success',
      '1': 'warning',
      '2': 'primary'
    };
    return methodColors[methodId] || 'secondary';
  };

  // UI RENDERING
  return (
    <Container className="py-5">
      {/* SUCCESS HEADER - Banner xác nhận thành công */}
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

      {/* BOOKING DETAILS CARD - Chi tiết thông tin đặt lịch */}
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
              {/* SECTION 1: Thông tin dịch vụ và thời gian hẹn */}
              <Row className="mb-4">
                <Col md={6} className="mb-4 border-end">
                  <h6 className="text-primary mb-3">
                    <i className="bi bi-gear me-2"></i>
                    Thông tin dịch vụ
                  </h6>
                  <div className="text-start">
                    <div className="mb-2">
                      <strong>Tên dịch vụ:</strong> {(() => {
                        const serviceTitle = bookingData?.selectedService?.title;
                        console.log('Rendering service title:', serviceTitle);
                        return serviceTitle || 'Không có thông tin';
                      })()}
                    </div>
                    <div className="mb-2">
                      <strong>Loại dịch vụ:</strong> {getServiceTypeBadge(bookingData.serviceType, bookingData?.selectedService?.category)}
                    </div>
                    <div className="mb-2">
                      <strong>Phương thức thu mẫu:</strong>
                      <Badge bg={getMethodColor(bookingData.collectionMethod)} className="ms-2">
                        {getCollectionMethodName(bookingData.collectionMethod, bookingData?.selectedMethod)}
                      </Badge>
                    </div>
                  </div>
                </Col>

                <Col md={6} className="mb-4">
                  <h6 className="text-primary mb-3">
                    <i className="bi bi-calendar me-2"></i>
                    Thời gian hẹn
                  </h6>
                  <div className="text-start">
                    {/* Conditional rendering dựa trên phương thức thu mẫu */}
                    {bookingData.collectionMethod === 'self-sample' ? (
                      <div>
                        <div className="mb-2">
                          <strong>Phương thức:</strong> Tự lấy mẫu tại nhà
                        </div>
                        <div className="mb-2">
                          <strong>Kit sẽ được gửi đến:</strong> {bookingData.customerInfo.address}
                        </div>
                      </div>
                    ) : (
                      <div>
                        <div className="mb-2">
                          <strong>Giờ hẹn:</strong> {bookingData.appointmentTime}
                        </div>
                        <div className="mb-2">
                          <strong>Ngày hẹn:</strong> {formatDate(bookingData.appointmentDate)}
                        </div>
                        <div className="mb-2">
                          <strong>Địa điểm:</strong> {
                            bookingData.collectionMethod === 'at-facility' ?
                              'Trung tâm xét nghiệm ADN - 123 Đường ABC, Quận XYZ' :
                              bookingData.customerInfo.address
                          }
                        </div>
                      </div>
                    )}
                  </div>
                </Col>
              </Row>

              <hr />

              {/* SECTION 2: Thông tin liên hệ và người tham gia */}
              <Row className="mb-4">
                <Col md={6} className="mb-4 border-end">
                  <h6 className="text-primary mb-3">
                    <i className="bi bi-person me-2"></i>
                    Thông tin liên hệ
                  </h6>
                  <div className="text-start">
                    <div className="mb-2">
                      <strong>Họ tên:</strong> {bookingData.customerInfo.fullName}
                    </div>
                    <div className="mb-2">
                      <strong>Điện thoại:</strong> {bookingData.customerInfo.phone}
                    </div>
                    <div className="mb-2">
                      <strong>Email:</strong> {bookingData.customerInfo.email || 'Không có'}
                    </div>
                  </div>
                </Col>

                <Col md={6} className="mb-4">
                  <h6 className="text-primary mb-3">
                    <i className="bi bi-people me-2"></i>
                    Người tham gia
                  </h6>
                  <div className="text-start">
                    {/* Conditional rendering danh sách participants */}
                    {bookingData.customerInfo.participants.length > 0 ? (
                      bookingData.customerInfo.participants.map((participant, index) => (
                        <div key={index} className="mb-2 p-2 bg-light rounded">
                          <div className="mb-1">
                            <strong>Họ tên:</strong> {participant.name}
                          </div>
                          <div>
                            <strong>CCCD:</strong> {participant.idNumber}
                          </div>
                          <div>
                            <strong>Tuổi:</strong> {participant.age}
                          </div>
                          <div>
                            <strong>Mối quan hệ:</strong> {participant.relation}
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted">
                        Thông tin sẽ được cập nhật khi thanh toán
                      </div>
                    )}
                  </div>
                </Col>
              </Row>

              <hr />

              {/* SECTION 3: Thông tin chi phí với breakdown chi tiết */}
              <Row className="mb-4">
                <Col>
                  <h6 className="text-primary mb-3">
                    <i className="bi bi-cash-coin me-2"></i>
                    Thông tin chi phí
                  </h6>
                  <div className="bg-light p-3 rounded">
                    {/* Chi phí dịch vụ chính */}
                    <div className="d-flex justify-content-between mb-2">
                      <span>Giá dịch vụ:</span>
                      <span className="text-muted">
                        {(() => {
                          const servicePrice = bookingData?.selectedService?.price;
                          if (servicePrice && servicePrice > 0) {
                            return `${new Intl.NumberFormat('vi-VN').format(servicePrice)} VNĐ`;
                          }
                          return 'Liên hệ để biết giá';
                        })()}
                      </span>
                    </div>
                    {/* Phí phương thức thu mẫu */}
                    <div className="d-flex justify-content-between mb-2">
                      <span>Phí dịch vụ (theo phương thức thu mẫu):</span>
                      <span className="text-muted">
                        {(() => {
                          const methodPrice = bookingData?.selectedMethod?.price;
                          if (methodPrice && methodPrice > 0) {
                            return `${new Intl.NumberFormat('vi-VN').format(methodPrice)} VNĐ`;
                          }
                          return 'Miễn phí';
                        })()}
                      </span>
                    </div>
                    <hr />
                    {/* Tổng cộng với highlight */}
                    <div className="d-flex justify-content-between align-items-center mb-3">
                      <h5 className="mb-0">Tổng cộng:</h5>
                      <h4 className="text-primary mb-0">
                        {(() => {
                          const servicePrice = bookingData?.selectedService?.price || 0;
                          const methodPrice = bookingData?.selectedMethod?.price || 0;
                          const totalAmount = servicePrice + methodPrice;

                          if (totalAmount > 0) {
                            return `${new Intl.NumberFormat('vi-VN').format(totalAmount)} VNĐ`;
                          }
                          return 'Liên hệ để biết giá';
                        })()}
                      </h4>
                    </div>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* PAYMENT CTA SECTION - Khu vực chính để tiến hành thanh toán */}
      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <Card className="border-warning bg-warning bg-opacity-10">
            <Card.Body className="text-center py-4">
              {/* Warning alert về thời hạn */}
              <Alert variant="warning" className="mb-4">
                <i className="bi bi-exclamation-triangle me-2"></i>
                <strong>Quan trọng:</strong> Vui lòng hoàn tất thanh toán trong vòng 30 phút để giữ lịch hẹn.
              </Alert>

              <h4 className="text-warning mb-3">
                <i className="bi bi-credit-card me-2"></i>
                Hoàn tất thanh toán
              </h4>
              <p className="mb-4">
                Tiến hành thanh toán để đặt lịch thành công và bắt đầu quy trình xét nghiệm ADN
              </p>

              {/* Hiển thị tổng tiền cần thanh toán nổi bật */}
              <div className="bg-white p-3 rounded mb-4">
                <div className="d-flex justify-content-between align-items-center">
                  <span className="fs-5">Tổng tiền cần thanh toán:</span>
                  <span className="fs-4 fw-bold text-primary">
                    {(() => {
                      const servicePrice = bookingData?.selectedService?.price || 0;
                      const methodPrice = bookingData?.selectedMethod?.price || 0;
                      const totalAmount = servicePrice + methodPrice;

                      if (totalAmount > 0) {
                        return `${new Intl.NumberFormat('vi-VN').format(totalAmount)} VNĐ`;
                      }
                      return 'Liên hệ để biết giá';
                    })()}
                  </span>
                </div>
              </div>

              {/* Button chính để chuyển đến trang thanh toán */}
              <div className="d-flex justify-content-center">
                <Button
                  variant="warning"
                  size="lg"
                  onClick={handleProceedToPayment}
                  className="px-4"
                >
                  Tiến hành thanh toán
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* SUPPORT SECTION - Thông tin liên hệ hỗ trợ khách hàng */}
      <Row className="mb-4">
        <Col lg={8} className="mx-auto">
          <Card className="border-primary">
            <Card.Header className="bg-primary text-white">
              <h5 className="mb-0">
                <i className="bi bi-telephone me-2"></i>
                Liên hệ hỗ trợ
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                {/* Hotline 24/7 */}
                <Col md={4} className="text-center mb-3">
                  <i className="bi bi-headset text-primary fs-1 mb-2 d-block"></i>
                  <h6>Hotline hỗ trợ</h6>
                  <p className="mb-0"><strong>1900 1234</strong></p>
                  <small className="text-muted">24/7</small>
                </Col>
                {/* Email support */}
                <Col md={4} className="text-center mb-3">
                  <i className="bi bi-envelope text-primary fs-1 mb-2 d-block"></i>
                  <h6>Email hỗ trợ</h6>
                  <p className="mb-0"><strong>support@adnlab.vn</strong></p>
                  <small className="text-muted">Phản hồi trong 2h</small>
                </Col>
                {/* Live chat */}
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
          <Button variant="outline-success" onClick={() => {
            // Tạo nội dung chỉ in phần Booking Details
            const printContent = `
              <div style="font-family: Arial, sans-serif; max-width: 800px; margin: 0 auto; padding: 20px;">
                <h2 style="text-align: center; color: #198754; margin-bottom: 20px;">
                  <i class="bi bi-clipboard-check"></i> Chi tiết đặt lịch
                </h2>
                <div style="background: #f8f9fa; padding: 15px; border-radius: 8px; margin-bottom: 20px;">
                  <strong>Mã đặt lịch:</strong> ${bookingId}
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                  <div>
                    <h4 style="color: #0d6efd; margin-bottom: 15px;">
                      <i class="bi bi-gear"></i> Thông tin dịch vụ
                    </h4>
                    <p><strong>Tên dịch vụ:</strong> ${bookingData?.selectedService?.title || 'Không có thông tin'}</p>
                    <p><strong>Loại dịch vụ:</strong> ${bookingData.serviceType === 'civil' ? 'ADN Dân sự' : 'ADN Hành chính'}</p>
                    <p><strong>Phương thức thu mẫu:</strong> ${getCollectionMethodName(bookingData.collectionMethod, bookingData?.selectedMethod)}</p>
                  </div>
                  
                  <div>
                    <h4 style="color: #0d6efd; margin-bottom: 15px;">
                      <i class="bi bi-calendar"></i> Thời gian hẹn
                    </h4>
                    ${bookingData.collectionMethod === 'self-sample' ? `
                      <p><strong>Phương thức:</strong> Tự lấy mẫu tại nhà</p>
                      <p><strong>Kit sẽ được gửi đến:</strong> ${bookingData.customerInfo.address}</p>
                    ` : `
                      <p><strong>Giờ hẹn:</strong> ${bookingData.appointmentTime}</p>
                      <p><strong>Ngày hẹn:</strong> ${formatDate(bookingData.appointmentDate)}</p>
                      <p><strong>Địa điểm:</strong> ${bookingData.collectionMethod === 'at-facility' ? 'Trung tâm xét nghiệm ADN - 123 Đường ABC, Quận XYZ' : bookingData.customerInfo.address}</p>
                    `}
                  </div>
                </div>
                
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 20px;">
                  <div>
                    <h4 style="color: #0d6efd; margin-bottom: 15px;">
                      <i class="bi bi-person"></i> Thông tin liên hệ
                    </h4>
                    <p><strong>Họ tên:</strong> ${bookingData.customerInfo.fullName}</p>
                    <p><strong>Điện thoại:</strong> ${bookingData.customerInfo.phone}</p>
                    <p><strong>Email:</strong> ${bookingData.customerInfo.email || 'Không có'}</p>
                  </div>
                  
                  <div>
                    <h4 style="color: #0d6efd; margin-bottom: 15px;">
                      <i class="bi bi-people"></i> Người tham gia
                    </h4>
                    ${bookingData.customerInfo.participants.length > 0 ?
                bookingData.customerInfo.participants.map((participant, index) => `
                        <div style="background: #f8f9fa; padding: 10px; border-radius: 5px; margin-bottom: 10px;">
                          <p><strong>Họ tên:</strong> ${participant.name}</p>
                          <p><strong>Điện thoại:</strong> ${participant.phone}</p>
                        </div>
                      `).join('') :
                '<p style="color: #6c757d;">Thông tin sẽ được cập nhật khi thanh toán</p>'
              }
                  </div>
                </div>
                
                <div>
                  <h4 style="color: #0d6efd; margin-bottom: 15px;">
                    <i class="bi bi-cash-coin"></i> Thông tin chi phí
                  </h4>
                  <div style="background: #f8f9fa; padding: 15px; border-radius: 8px;">
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                      <span>Giá dịch vụ:</span>
                      <span>${(() => {
                const servicePrice = bookingData?.selectedService?.price;
                if (servicePrice && servicePrice > 0) {
                  return `${new Intl.NumberFormat('vi-VN').format(servicePrice)} VNĐ`;
                }
                return 'Liên hệ để biết giá';
              })()}</span>
                    </div>
                    <div style="display: flex; justify-content: space-between; margin-bottom: 10px;">
                      <span>Phí dịch vụ (theo phương thức thu mẫu):</span>
                      <span>${(() => {
                const methodPrice = bookingData?.selectedMethod?.price;
                if (methodPrice && methodPrice > 0) {
                  return `${new Intl.NumberFormat('vi-VN').format(methodPrice)} VNĐ`;
                }
                return 'Miễn phí';
              })()}</span>
                    </div>
                    <hr style="margin: 15px 0;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                      <h5 style="margin: 0;">Tổng cộng:</h5>
                      <h4 style="color: #0d6efd; margin: 0;">
                        ${(() => {
                const servicePrice = bookingData?.selectedService?.price || 0;
                const methodPrice = bookingData?.selectedMethod?.price || 0;
                const totalAmount = servicePrice + methodPrice;

                if (totalAmount > 0) {
                  return `${new Intl.NumberFormat('vi-VN').format(totalAmount)} VNĐ`;
                }
                return 'Liên hệ để biết giá';
              })()}
                      </h4>
                    </div>
                  </div>
                </div>
              </div>
            `;

            // Tạo cửa sổ in mới
            const printWindow = window.open('', '_blank');
            printWindow.document.write(`
              <html>
                <head>
                  <title>Chi tiết đặt lịch - ${bookingId}</title>
                  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.7.2/font/bootstrap-icons.css">
                  <style>
                    @media print {
                      body { margin: 0; }
                      .no-print { display: none; }
                    }
                  </style>
                </head>
                <body>
                  ${printContent}
                </body>
              </html>
            `);
            printWindow.document.close();
            printWindow.focus();
            setTimeout(() => {
              printWindow.print();
              printWindow.close();
            }, 500);
          }}>
            <i className="bi bi-printer me-2"></i>
            In thông tin
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

export default BookingConfirmation;