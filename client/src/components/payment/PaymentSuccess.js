import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Badge, Modal } from 'react-bootstrap';
import { getBookingById } from '../../services/api';

const PaymentSuccess = () => {
  const location = useLocation();
  const [paymentResult, setPaymentResult] = useState(null);
  const [paymentMethodInfo, setPaymentMethodInfo] = useState(null);
  const [bookingDetail, setBookingDetail] = useState(null);
  const [showReceiptModal, setShowReceiptModal] = useState(false);

  useEffect(() => {
    const query = new URLSearchParams(location.search);

    const orderId = query.get('orderId');
    const resultCode = query.get('resultCode');
    const amount = query.get('amount');
    const partnerCode = query.get('partnerCode');
    const message = query.get('message');

    if (orderId && resultCode === '0' && partnerCode === 'MOMO') {
      // Extract bookingId from orderId format: MOMO_ADNLAB712881_1751536064022
      const matches = orderId.match(/MOMO_(ADNLAB\d+)_/);
      const bookingId = matches ? matches[1] : null;

      if (!bookingId) {
        console.error('Could not extract bookingId from orderId:', orderId);
        return;
      }

      // Create payment result from URL parameters
      setPaymentResult({
        bookingId: bookingId,
        orderId: orderId,
        amount: parseInt(amount) || 0,
        timestamp: new Date().toISOString(),
        resultCode: resultCode,
        message: message,
        paymentData: {
          customerName: 'Khách hàng', // Default values since we don't have API data
          customerPhone: 'N/A',
          customerEmail: 'N/A'
        },
        bookingData: {
          serviceType: 'unknown',
          collectionMethod: 'unknown',
          appointmentDate: 'N/A',
          appointmentTime: 'N/A'
        }
      });

      setPaymentMethodInfo({
        id: 'momo',
        name: 'Ví MoMo',
        type: 'online'
      });
    } else if (resultCode && resultCode !== '0') {
      // Payment failed
      console.error('Payment failed with resultCode:', resultCode);
    } else {
      console.log('No payment callback detected');
    }
  }, [location]);

  // Lấy thông tin booking chi tiết từ API nếu có bookingId
  useEffect(() => {
    if (paymentResult?.bookingId) {
      getBookingById(paymentResult.bookingId)
        .then((booking) => {
          setBookingDetail(booking);
          setPaymentResult(prev => ({
            ...prev,
            paymentData: {
              customerName: booking.informations_on_booking?.[0]?.name || booking.user?.fullname || 'Khách hàng',
              customerPhone: booking.informations_on_booking?.[0]?.phone || booking.user?.phone || 'N/A',
              customerEmail: booking.informations_on_booking?.[0]?.email || booking.user?.email || 'N/A',
            },
            bookingData: {
              serviceType: booking.service?.category?.hasLegalValue ? 'ADN Hành chính' : 'ADN Dân sự',
              collectionMethod: booking.method?.name || 'Không xác định', // Sửa ở đây để lấy tên phương thức
              appointmentDate: booking.timeSlot?.slotDate || 'N/A',
              appointmentTime: booking.timeSlot ? `${booking.timeSlot.startTime} - ${booking.timeSlot.endTime}` : 'N/A',
            }
          }));
        })
        .catch((err) => {
          console.warn('Không thể lấy thông tin booking chi tiết:', err);
        });
    }
  }, [paymentResult?.bookingId]);

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const getStatusColor = (method) => {
    if (method?.type === 'online') return 'success';
    if (method?.id === 'bank-transfer') return 'warning';
    if (method?.id === 'cash-on-service') return 'info';
    return 'success';
  };

  const getStatusMessage = (method) => {
    if (method?.type === 'online') {
      return 'Thanh toán đã được hoàn tất thành công';
    }
    if (method?.id === 'bank-transfer') {
      return 'Đang chờ xác nhận chuyển khoản';
    }
    if (method?.id === 'cash-on-service') {
      return 'Đặt lịch thành công - Thanh toán khi nhận dịch vụ';
    }
    return 'Đặt lịch thành công';
  };

  const getNextSteps = (method, bookingData) => {
    if (method?.type === 'online') {
      return [
        'Bạn sẽ nhận email xác nhận trong vài phút',
        'Kiểm tra SMS để nhận thông tin chi tiết',
        bookingData?.collectionMethod === 'self-sample'
          ? 'Kit xét nghiệm sẽ được gửi trong 1-2 ngày'
          : 'Nhân viên sẽ liên hệ xác nhận lịch hẹn',
        'Kết quả sẽ có trong 5-7 ngày làm việc'
      ];
    }

    if (method?.id === 'bank-transfer') {
      return [
        'Thực hiện chuyển khoản theo thông tin đã cung cấp',
        'Chúng tôi sẽ xác nhận thanh toán trong 1-2 giờ',
        'Bạn sẽ nhận thông báo qua SMS và email',
        'Dịch vụ sẽ được kích hoạt ngay sau khi xác nhận thanh toán'
      ];
    }

    if (method?.id === 'cash-on-service') {
      return [
        'Chuẩn bị đầy đủ giấy tờ cần thiết',
        bookingData?.collectionMethod === 'at-facility'
          ? 'Có mặt đúng giờ tại cơ sở để thanh toán và xét nghiệm'
          : 'Chuẩn bị tiền mặt để thanh toán cho nhân viên',
        'Nhận biên lai và giữ lại để theo dõi',
        'Kết quả sẽ có trong 5-7 ngày làv việc'
      ];
    }

    return ['Đặt lịch đã được xác nhận thành công'];
  };

  const handlePrintReceipt = () => {
    window.print();
  };

  const handleDownloadReceipt = () => {
    // In real app, generate PDF receipt
    const receiptData = {
      bookingId: paymentResult.bookingId,
      customerName: paymentResult.paymentData.customerName,
      amount: paymentResult.amount,
      paymentMethod: paymentMethodInfo.name,
      timestamp: paymentResult.timestamp
    };

    const dataStr = JSON.stringify(receiptData, null, 2);
    const dataBlob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(dataBlob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `receipt-${paymentResult.bookingId}.json`;
    link.click();
  };
  
  // Hàm tách ngày và giờ từ timeSlot.id
  function parseTimeSlotId(timeSlotId) {
    if (!timeSlotId) return { date: 'N/A', time: 'N/A' };
    const [date, start, end] = timeSlotId.split('_');
    return {
      date: date || 'N/A',
      time: start && end ? `${start} - ${end}` : 'N/A'
    };
  }

  if (!paymentResult) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Không tìm thấy thông tin thanh toán.
        </Alert>
      </Container>
    );
  }

  const statusColor = getStatusColor(paymentMethodInfo);
  const statusMessage = getStatusMessage(paymentMethodInfo);
  const nextSteps = getNextSteps(paymentMethodInfo, paymentResult.bookingData);

  const { date: slotDate, time: slotTime } = parseTimeSlotId(bookingDetail?.timeSlot?.id);

  return (
    <div>
      {/* Success Header */}
      <section className={`bg-${statusColor} text-white py-5`}>
        <Container>
          <Row className="align-items-center text-center">
            <Col>
              <div className="mb-4">
                <i className="bi bi-check-circle-fill" style={{ fontSize: '4rem' }}></i>
              </div>
              <h1 className="display-5 fw-bold mb-3">
                {paymentMethodInfo?.type === 'online' ? 'Thanh toán thành công!' : 'Đặt lịch thành công!'}
              </h1>
              <p className="lead mb-4">{statusMessage}</p>
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Badge bg="light" text="dark" className="fs-6 px-3 py-2">
                  Mã đặt lịch: <strong>{paymentResult.bookingId}</strong>
                </Badge>
                <Badge bg="light" text="dark" className="fs-6 px-3 py-2">
                  Tổng tiền: <strong>{formatCurrency(paymentResult.amount)}</strong>
                </Badge>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        {/* Payment Status Alert */}
        {paymentMethodInfo?.type === 'online' && (
          <Alert variant="success" className="mb-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-check-circle-fill fs-4 me-3"></i>
              <div className="flex-grow-1">
                <h6 className="mb-1">Giao dịch hoàn tất</h6>
                <div>Thanh toán qua <strong>{paymentMethodInfo.name}</strong> đã được xử lý thành công</div>
                <div className="small text-muted">
                  Thời gian: {formatDate(paymentResult.timestamp)}
                </div>
              </div>
            </div>
          </Alert>
        )}

        {paymentMethodInfo?.id === 'bank-transfer' && (
          <Alert variant="warning" className="mb-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-clock-fill fs-4 me-3"></i>
              <div className="flex-grow-1">
                <h6 className="mb-1">Chờ xác nhận chuyển khoản</h6>
                <div>Vui lòng thực hiện chuyển khoản theo thông tin đã cung cấp</div>
                <div className="small text-muted">
                  Chúng tôi sẽ xác nhận thanh toán trong vòng 1-2 giờ làm việc
                </div>
              </div>
            </div>
          </Alert>
        )}

        {paymentMethodInfo?.id === 'cash-on-service' && (
          <Alert variant="info" className="mb-4">
            <div className="d-flex align-items-center">
              <i className="bi bi-cash fs-4 me-3"></i>
              <div className="flex-grow-1">
                <h6 className="mb-1">Thanh toán khi nhận dịch vụ</h6>
                <div>Đặt lịch đã được xác nhận - Bạn sẽ thanh toán khi sử dụng dịch vụ</div>
                <div className="small text-muted">
                  Chuẩn bị tiền mặt: <strong>{formatCurrency(paymentResult.amount)}</strong>
                </div>
              </div>
            </div>
          </Alert>
        )}

        <Row>
          {/* Order Details */}
          <Col lg={8} className="mb-4">
            <Card className="mb-4">
              <Card.Header className="bg-success text-white text-center fs-5 fw-bold">
                Chi tiết đơn hàng
              </Card.Header>
              <Card.Body>
                <Row>
                  {/* Cột trái: Thông tin dịch vụ & lịch hẹn */}
                  <Col md={6} className="mb-3">
                    <div className="p-3 border rounded bg-light h-100 text-start">
                      <h6 className="text-primary mb-3">Thông tin dịch vụ</h6>
                      <div className="mb-2"><strong>Mã đặt lịch:</strong> {paymentResult.bookingId}</div>
                      <div className="mb-2"><strong>Tên dịch vụ:</strong> {bookingDetail?.service?.title || 'N/A'}</div>
                      <div className="mb-2"><strong>Loại dịch vụ:</strong> {bookingDetail?.service?.category?.name || 'N/A'}</div>
                      <div className="mb-2"><strong>Phương thức lấy mẫu:</strong> {bookingDetail?.method?.name || 'N/A'}</div>
                      <div className="mb-2"><strong>Ngày hẹn:</strong> {bookingDetail?.timeSlot?.slotDate || slotDate}</div>
                      <div className="mb-2"><strong>Giờ:</strong> {bookingDetail?.timeSlot?.startTime && bookingDetail?.timeSlot?.endTime ? `${bookingDetail.timeSlot.startTime} - ${bookingDetail.timeSlot.endTime}` : slotTime}</div>
                    </div>
                  </Col>
                  {/* Cột phải: Thông tin thanh toán & khách hàng */}
                  <Col md={6} className="mb-3">
                    <div className="p-3 border rounded bg-light h-100 text-start">
                      <h6 className="text-primary mb-3">Thông tin thanh toán</h6>
                      <div className="mb-2"><strong>Phương thức:</strong> {paymentMethodInfo?.name || 'N/A'}</div>
                      <div className="mb-2"><strong>Tổng tiền:</strong> <span className="text-success fw-bold">{formatCurrency(paymentResult.amount)}</span></div>
                      <div className="mb-2"><strong>Trạng thái:</strong> <Badge bg="success">Đã thanh toán</Badge></div>
                      <div className="mb-2"><strong>Thời gian:</strong> {formatDate(paymentResult.timestamp)}</div>
                      <hr className="my-3" />
                      <h6 className="text-primary mb-2">Khách hàng</h6>
                      <div className="mb-2"><strong>Họ tên:</strong> {paymentResult.paymentData.customerName}</div>
                      <div className="mb-2"><strong>Điện thoại:</strong> {paymentResult.paymentData.customerPhone}</div>
                      <div className="mb-2"><strong>Email:</strong> {paymentResult.paymentData.customerEmail}</div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>
          </Col>

          {/* Next Steps */}
          <Col lg={4} className="mb-4">
            <Card className="shadow-sm">
              <Card.Header className="bg-info text-white">
                <h5 className="mb-0">
                  <i className="bi bi-list-check me-2"></i>
                  Các bước tiếp theo
                </h5>
              </Card.Header>
              <Card.Body>
                <ol className="list-unstyled">
                  {nextSteps.map((step, index) => (
                    <li key={index} className="mb-3 d-flex align-items-start">
                      <div className="bg-info bg-opacity-10 rounded-circle p-2 me-3 mt-1"
                        style={{ minWidth: '30px', height: '30px', fontSize: '0.8rem', fontWeight: 'bold' }}>
                        {index + 1}
                      </div>
                      <div className="small">{step}</div>
                    </li>
                  ))}
                </ol>
              </Card.Body>
            </Card>

            {/* Quick Actions */}
            <Card className="shadow-sm mt-3">
              <Card.Header className="bg-secondary text-white">
                <h6 className="mb-0">
                  <i className="bi bi-lightning me-2"></i>
                  Hành động nhanh
                </h6>
              </Card.Header>
              <Card.Body>
                <div className="d-grid gap-2">
                  <Button variant="outline-primary" size="sm" onClick={() => setShowReceiptModal(true)}>
                    <i className="bi bi-receipt me-2"></i>
                    Xem hóa đơn
                  </Button>
                  <Button variant="outline-secondary" size="sm" onClick={handlePrintReceipt}>
                    <i className="bi bi-printer me-2"></i>
                    In biên lai
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Action Buttons */}
        <Row className="mt-4">
          <Col className="text-center">
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Button variant="primary" size="lg" as={Link} to="/user/appointments">
                <i className="bi bi-list-ul me-2"></i>
                Quản lý lịch hẹn
              </Button>
              <Button variant="outline-primary" size="lg" as={Link} to={`/tracking/${paymentResult.bookingId}`}>
                <i className="bi bi-search me-2"></i>
                Theo dõi tiến độ
              </Button>
              <Button variant="outline-secondary" size="lg" as={Link} to="/appointment">
                <i className="bi bi-plus-circle me-2"></i>
                Đặt lịch mới
              </Button>
            </div>
          </Col>
        </Row>

        {/* Contact Support */}
        <Row className="mt-5">
          <Col>
            <Card className="border-warning">
              <Card.Body className="text-center py-4">
                <h5 className="mb-3">
                  <i className="bi bi-headset me-2"></i>
                  Cần hỗ trợ thêm?
                </h5>
                <p className="text-muted mb-3">
                  Liên hệ với chúng tôi nếu bạn có bất kỳ câu hỏi nào về đơn hàng hoặc dịch vụ
                </p>
                <div className="d-flex justify-content-center gap-3 flex-wrap">
                  <Button variant="warning">
                    <i className="bi bi-telephone me-2"></i>
                    Hotline: 1900 1234
                  </Button>
                  <Button variant="outline-warning">
                    <i className="bi bi-chat-dots me-2"></i>
                    Chat trực tuyến
                  </Button>
                  <Button variant="outline-secondary">
                    <i className="bi bi-envelope me-2"></i>
                    Email: support@adnlab.vn
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>

      {/* Receipt Modal */}
      <Modal show={showReceiptModal} onHide={() => setShowReceiptModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-receipt me-2"></i> Hóa đơn thanh toán
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="text-center mb-4">
            <h4>TRUNG TÂM XÉT NGHIỆM ADN LAB</h4>
            <div className="text-muted">123 Đường ABC, Quận XYZ, Hà Nội</div>
            <div className="text-muted">Hotline: 1900 1234 | Email: info@adnlab.vn</div>
            <hr />
            <h5>HÓA ĐƠN DỊCH VỤ</h5>
          </div>
          <Row>
            <Col md={6}>
              <strong>Mã đơn hàng:</strong> {paymentResult.bookingId}
              <br />
              <strong>Ngày tạo:</strong> {formatDate(paymentResult.timestamp)}
              <br />
              <strong>Phương thức thanh toán:</strong> {paymentMethodInfo.name}
            </Col>
            <Col md={6}>
              <strong>Khách hàng:</strong> {paymentResult.paymentData.customerName}
              <br />
              <strong>Điện thoại:</strong> {paymentResult.paymentData.customerPhone}
              <br />
              <strong>Email:</strong> {paymentResult.paymentData.customerEmail}
            </Col>
          </Row>
          <hr />
          <table className="table">
            <thead>
              <tr>
                <th>Dịch vụ</th>
                <th>Số lượng</th>
                <th className="text-end">Đơn giá</th>
                <th className="text-end">Thành tiền</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>
                  Xét nghiệm ADN {paymentResult.bookingData.serviceType === 'civil' ? 'Dân sự' : 'Hành chính'}
                  <br />
                  <small className="text-muted">
                    Phương thức: {bookingDetail?.method?.name || 'Không xác định'}
                  </small>
                </td>
                <td>1</td>
                <td className="text-end">{formatCurrency(paymentResult.amount)}</td>
                <td className="text-end">{formatCurrency(paymentResult.amount)}</td>
              </tr>
            </tbody>
            <tfoot>
              <tr>
                <th colSpan="3">Tổng cộng:</th>
                <th className="text-end">{formatCurrency(paymentResult.amount)}</th>
              </tr>
            </tfoot>
          </table>
          <div className="mt-4 text-center">
            <div className="text-muted small">
              Cảm ơn bạn đã tin tưởng dịch vụ của ADN LAB!
              <br />
              Mọi thắc mắc xin liên hệ hotline: 1900 1234
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReceiptModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={handlePrintReceipt}>
            <i className="bi bi-printer me-2"></i> In biên lai
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default PaymentSuccess;