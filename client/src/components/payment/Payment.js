import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, Badge, Modal } from 'react-bootstrap';

const Payment = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [bookingData, setBookingData] = useState(null);
  const [bookingId, setBookingId] = useState('');
  const [paymentMethod, setPaymentMethod] = useState('');
  const [paymentData, setPaymentData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    bankTransferNote: ''
  });
  const [loading, setLoading] = useState(false);
  const [showBankModal, setShowBankModal] = useState(false);

  // Payment methods configuration
  const paymentMethods = [
    {
      id: 'vnpay',
      name: 'VNPay',
      description: 'Thanh toán qua cổng VNPay (Visa, Master, ATM)',
      icon: 'bi-credit-card',
      color: 'primary',
      type: 'online',
      fee: 0,
      note: 'Thanh toán ngay, an toàn và bảo mật'
    },
    {
      id: 'momo',
      name: 'Ví MoMo',
      description: 'Thanh toán qua ví điện tử MoMo',
      icon: 'bi-phone',
      color: 'danger',
      type: 'online',
      fee: 0,
      note: 'Nhanh chóng và tiện lợi'
    },
    {
      id: 'zalopay',
      name: 'ZaloPay',
      description: 'Thanh toán qua ví điện tử ZaloPay',
      icon: 'bi-wallet2',
      color: 'info',
      type: 'online',
      fee: 0,
      note: 'Ưu đãi và hoàn tiền hấp dẫn'
    },
    {
      id: 'bank-transfer',
      name: 'Chuyển khoản ngân hàng',
      description: 'Chuyển khoản trực tiếp vào tài khoản công ty',
      icon: 'bi-bank',
      color: 'success',
      type: 'manual',
      fee: 0,
      note: 'Xác nhận thanh toán trong 1-2 giờ'
    },
    {
      id: 'cash-on-service',
      name: 'Thanh toán khi nhận dịch vụ',
      description: 'Thanh toán bằng tiền mặt khi sử dụng dịch vụ',
      icon: 'bi-cash',
      color: 'warning',
      type: 'offline',
      fee: 0,
      note: 'Phù hợp với dịch vụ tại cơ sở hoặc nhân viên đến nhà'
    }
  ];

  // Bank account information
  const bankAccounts = [
    {
      bank: 'Vietcombank',
      accountNumber: '0123456789',
      accountName: 'CONG TY TNHH ADN LAB',
      branch: 'Chi nhánh Hà Nội'
    },
    {
      bank: 'VietinBank',
      accountNumber: '9876543210',
      accountName: 'CONG TY TNHH ADN LAB',
      branch: 'Chi nhánh TP.HCM'
    }
  ];

  useEffect(() => {
    if (location.state && location.state.bookingData) {
      setBookingData(location.state.bookingData);
      const id = 'ADN' + Date.now().toString().slice(-6);
      setBookingId(id);

      // Pre-fill customer info
      setPaymentData({
        customerName: location.state.bookingData.customerInfo.fullName,
        customerPhone: location.state.bookingData.customerInfo.phone,
        customerEmail: location.state.bookingData.customerInfo.email,
        bankTransferNote: `Thanh toan xet nghiem ADN ${id}`
      });
    } else {
      // Redirect if no booking data
      navigate('/appointment');
    }
  }, [location.state, navigate]);

  // Get service details
  const getServiceDetails = () => {
    if (!bookingData) return null;

    // Mock service details - in real app, fetch from services-data
    const servicePrices = {
      'admin-birth-cert': { price: 4200000, name: 'ADN làm giấy khai sinh' },
      'admin-immigration': { price: 5800000, name: 'ADN nhập tịch, làm visa' },
      'admin-inheritance': { price: 6500000, name: 'ADN xác nhận quyền thừa kế' },
      'admin-support': { price: 5200000, name: 'ADN xác định trách nhiệm cấp dưỡng' },
      'admin-missing-person': { price: 7200000, name: 'ADN nhận người thân' },
      'civil-paternity': { price: 3500000, name: 'ADN huyết thống' },
      'civil-prenatal': { price: 8500000, name: 'ADN trước sinh' },
      'civil-ancestry': { price: 4800000, name: 'ADN nguồn gốc tổ tiên' },
      'civil-genetic': { price: 6200000, name: 'ADN cá nhân' },
      'civil-confidential': { price: 4500000, name: 'ADN bí mật' }
    };

    return servicePrices[bookingData.serviceId] || { price: 3500000, name: 'ADN Service' };
  };

  const serviceDetails = getServiceDetails();
  const totalAmount = serviceDetails ? serviceDetails.price : 0;

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const getServiceTypeBadge = (serviceType) => {
    return serviceType === 'administrative'
      ? <Badge bg="warning" text="dark">Có giá trị pháp lý</Badge>
      : <Badge bg="success">Dân sự</Badge>;
  };

  const getCollectionMethodName = (method) => {
    const methods = {
      'self-sample': 'Tự lấy mẫu tại nhà',
      'home-visit': 'Nhân viên tới nhà lấy mẫu',
      'at-facility': 'Tới cơ sở lấy mẫu'
    };
    return methods[method] || method;
  };

  const handlePaymentMethodSelect = (methodId) => {
    setPaymentMethod(methodId);

    // Show bank modal if bank transfer is selected
    if (methodId === 'bank-transfer') {
      setShowBankModal(true);
    }
  };

  const handlePaymentSubmit = async () => {
    if (!paymentMethod) {
      alert('Vui lòng chọn phương thức thanh toán');
      return;
    }

    setLoading(true);

    try {
      // Gọi API thật
      const response = await fetch('https://app-bggwpxm32a-uc.a.run.app/payments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          totalAmount,
          paymentChoice: paymentMethod.toLocaleUpperCase() // Ví dụ: 'MOMO', 'VNPAY', 'ZALOPAY'
        }),
      });

      if (!response.ok) {
        throw new Error('Thanh toán thất bại');
      }

      const result = await response.json(); // kết quả trả về từ API

      const paymentResult = {
        bookingId,
        bookingData,
        paymentMethod,
        paymentData: result, // thông tin từ API trả về
        amount: totalAmount,
        status: 'success',
        timestamp: new Date().toISOString()
      };

      navigate('/payment-success', {
        state: {
          paymentResult,
          paymentMethodInfo: paymentMethods.find(m => m.id === paymentMethod)
        }
      });

    } catch (error) {
      console.error('Payment error:', error);
      alert('Có lỗi xảy ra trong quá trình thanh toán. Vui lòng thử lại.');
    } finally {
      setLoading(false);
    }
  };

  const selectedPaymentMethod = paymentMethods.find(m => m.id === paymentMethod);

  if (!bookingData) {
    return (
      <Container className="py-5">
        <Alert variant="warning" className="text-center">
          <i className="bi bi-exclamation-triangle me-2"></i>
          Không tìm thấy thông tin đặt lịch. Vui lòng thực hiện đặt lịch trước.
        </Alert>
      </Container>
    );
  }

  return (
    <div>
      {/* Header */}
      <section className="bg-success text-white py-4">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h1 className="h3 mb-2">
                <i className="bi bi-credit-card me-2"></i>
                Thanh toán dịch vụ
              </h1>
              <p className="mb-0">
                Hoàn tất thanh toán để xác nhận đặt lịch xét nghiệm ADN
              </p>
            </Col>
            <Col xs="auto">
              <div className="text-end">
                <div className="small">Mã đặt lịch</div>
                <strong>{bookingId}</strong>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        <Row>
          {/* Order Summary */}
          <Col lg={4} className="mb-4">
            <Card className="shadow-sm sticky-top">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <i className="bi bi-receipt me-2"></i>
                  Chi tiết đơn hàng
                </h5>
              </Card.Header>
              <Card.Body>
                <div className="mb-3">
                  <h6 className="text-primary mb-2">Dịch vụ</h6>
                  <div className="d-flex justify-content-between align-items-start">
                    <div>
                      <div className="fw-medium">{serviceDetails.name}</div>
                      <div className="small text-muted">
                        {getServiceTypeBadge(bookingData.serviceType)}
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="fw-bold">{formatCurrency(serviceDetails.price)}</div>
                    </div>
                  </div>
                </div>

                <div className="mb-3">
                  <h6 className="text-primary mb-2">Phương thức lấy mẫu</h6>
                  <div className="small">{getCollectionMethodName(bookingData.collectionMethod)}</div>
                </div>

                {bookingData.appointmentDate && (
                  <div className="mb-3">
                    <h6 className="text-primary mb-2">Lịch hẹn</h6>
                    <div className="small">
                      <div><strong>Ngày:</strong> {formatDate(bookingData.appointmentDate)}</div>
                      <div><strong>Giờ:</strong> {bookingData.appointmentTime}</div>
                    </div>
                  </div>
                )}

                <div className="mb-3">
                  <h6 className="text-primary mb-2">Khách hàng</h6>
                  <div className="small">
                    <div><strong>Tên:</strong> {bookingData.customerInfo.fullName}</div>
                    <div><strong>SĐT:</strong> {bookingData.customerInfo.phone}</div>
                  </div>
                </div>

                <hr />

                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Giá dịch vụ:</span>
                  <span>{formatCurrency(serviceDetails.price)}</span>
                </div>
                <div className="d-flex justify-content-between align-items-center mb-2">
                  <span>Phí thanh toán:</span>
                  <span className="text-success">Miễn phí</span>
                </div>
                <hr />
                <div className="d-flex justify-content-between align-items-center">
                  <strong>Tổng thanh toán:</strong>
                  <strong className="text-primary fs-5">{formatCurrency(totalAmount)}</strong>
                </div>
              </Card.Body>
            </Card>
          </Col>

          {/* Payment Methods */}
          <Col lg={8}>
            <Card className="shadow-sm">
              <Card.Header className="bg-warning text-dark">
                <h5 className="mb-0">
                  <i className="bi bi-wallet me-2"></i>
                  Chọn phương thức thanh toán
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                <Row>
                  {paymentMethods.map(method => (
                    <Col key={method.id} md={6} className="mb-3">
                      <Card
                        className={`h-100 border-2 cursor-pointer ${paymentMethod === method.id
                          ? `border-${method.color} shadow-sm`
                          : 'border-light'
                          }`}
                        style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                        onClick={() => handlePaymentMethodSelect(method.id)}
                      >
                        <Card.Body className="text-center p-3">
                          <div className={`bg-${method.color} bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center`}
                            style={{ width: '60px', height: '60px' }}>
                            <i className={`${method.icon} text-${method.color} fs-3`}></i>
                          </div>
                          <h6 className={`mb-2 ${paymentMethod === method.id ? `text-${method.color}` : ''}`}>
                            {method.name}
                          </h6>
                          <p className="small text-muted mb-2">{method.description}</p>
                          <div className="small text-muted">{method.note}</div>

                          {paymentMethod === method.id && (
                            <div className="mt-3">
                              <Badge bg={method.color} className="px-3 py-2">
                                <i className="bi bi-check-circle me-2"></i>
                                Đã chọn
                              </Badge>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>

                {/* Payment Details Form */}
                {paymentMethod && (
                  <Card className="mt-4 border-primary">
                    <Card.Header className="bg-primary text-white">
                      <h6 className="mb-0">
                        <i className="bi bi-info-circle me-2"></i>
                        Thông tin thanh toán - {selectedPaymentMethod.name}
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      {/* Online Payment Methods */}
                      {selectedPaymentMethod.type === 'online' && (
                        <Alert variant="info">
                          <i className="bi bi-shield-check me-2"></i>
                          <strong>Thanh toán trực tuyến an toàn</strong>
                          <p className="mb-0 mt-2">
                            Bạn sẽ được chuyển đến cổng thanh toán {selectedPaymentMethod.name} để hoàn tất giao dịch.
                            Thông tin thanh toán được mã hóa và bảo mật tuyệt đối.
                          </p>
                        </Alert>
                      )}

                      {/* Bank Transfer */}
                      {paymentMethod === 'bank-transfer' && (
                        <div>
                          <Alert variant="warning">
                            <i className="bi bi-info-circle me-2"></i>
                            <strong>Hướng dẫn chuyển khoản</strong>
                            <p className="mb-0 mt-2">
                              Vui lòng chuyển khoản theo thông tin bên dưới và giữ lại biên lai để xác nhận.
                              Đơn hàng sẽ được xử lý sau khi chúng tôi nhận được thanh toán (1-2 giờ).
                            </p>
                          </Alert>

                          <Row>
                            {bankAccounts.map((account, index) => (
                              <Col md={6} key={index} className="mb-3">
                                <Card className="border-success">
                                  <Card.Body>
                                    <h6 className="text-success mb-3">{account.bank}</h6>
                                    <div className="mb-2">
                                      <strong>Số tài khoản:</strong>
                                      <div className="font-monospace text-primary">{account.accountNumber}</div>
                                    </div>
                                    <div className="mb-2">
                                      <strong>Tên tài khoản:</strong>
                                      <div>{account.accountName}</div>
                                    </div>
                                    <div className="mb-2">
                                      <strong>Chi nhánh:</strong>
                                      <div>{account.branch}</div>
                                    </div>
                                    <div className="mt-3">
                                      <strong>Nội dung chuyển khoản:</strong>
                                      <div className="font-monospace bg-light p-2 rounded small">
                                        {paymentData.bankTransferNote}
                                      </div>
                                    </div>
                                  </Card.Body>
                                </Card>
                              </Col>
                            ))}
                          </Row>
                        </div>
                      )}

                      {/* Cash on Service */}
                      {paymentMethod === 'cash-on-service' && (
                        <Alert variant="warning">
                          <i className="bi bi-cash me-2"></i>
                          <strong>Thanh toán khi nhận dịch vụ</strong>
                          <p className="mb-0 mt-2">
                            Bạn sẽ thanh toán bằng tiền mặt khi sử dụng dịch vụ.
                            {bookingData.collectionMethod === 'at-facility' && ' Thanh toán tại quầy lễ tân trước khi xét nghiệm.'}
                            {bookingData.collectionMethod === 'home-visit' && ' Thanh toán trực tiếp cho nhân viên khi họ đến nhà.'}
                            {bookingData.collectionMethod === 'self-sample' && ' Không áp dụng với phương thức tự lấy mẫu.'}
                          </p>
                        </Alert>
                      )}

                      {/* Customer Information Confirmation */}
                      <div className="mt-4">
                        <h6 className="mb-3">Xác nhận thông tin thanh toán</h6>
                        <Row>
                          <Col md={6} className="mb-3">
                            <Form.Label>Họ và tên</Form.Label>
                            <Form.Control
                              type="text"
                              value={paymentData.customerName}
                              onChange={(e) => setPaymentData({ ...paymentData, customerName: e.target.value })}
                              placeholder="Nhập họ tên"
                            />
                          </Col>
                          <Col md={6} className="mb-3">
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                              type="tel"
                              value={paymentData.customerPhone}
                              onChange={(e) => setPaymentData({ ...paymentData, customerPhone: e.target.value })}
                              placeholder="Nhập số điện thoại"
                            />
                          </Col>
                        </Row>
                        <Form.Group className="mb-3">
                          <Form.Label>Email nhận thông báo</Form.Label>
                          <Form.Control
                            type="email"
                            value={paymentData.customerEmail}
                            onChange={(e) => setPaymentData({ ...paymentData, customerEmail: e.target.value })}
                            placeholder="Nhập email nhận hóa đơn"
                          />
                        </Form.Group>
                      </div>
                    </Card.Body>
                  </Card>
                )}

                {/* Terms and Conditions */}
                <div className="mt-4">
                  <Card className="border-info">
                    <Card.Body>
                      <Form.Check
                        type="checkbox"
                        id="terms-agreement"
                        label={
                          <span>
                            Tôi đồng ý với{' '}
                            <a href="/terms" target="_blank" className="text-primary">
                              Điều khoản sử dụng
                            </a>{' '}
                            và{' '}
                            <a href="/privacy" target="_blank" className="text-primary">
                              Chính sách bảo mật
                            </a>{' '}
                            của ADN LAB
                          </span>
                        }
                        className="mb-3"
                      />
                      <div className="small text-muted">
                        <i className="bi bi-shield-check me-2 text-success"></i>
                        Thông tin cá nhân và kết quả xét nghiệm được bảo mật tuyệt đối theo quy định pháp luật.
                      </div>
                    </Card.Body>
                  </Card>
                </div>

                {/* Submit Button */}
                <div className="text-center mt-4">
                  <Button
                    variant="success"
                    size="lg"
                    onClick={handlePaymentSubmit}
                    disabled={!paymentMethod || loading}
                    className="px-5"
                  >
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Đang xử lý...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-check-circle me-2"></i>
                        {selectedPaymentMethod?.type === 'online' ? 'Thanh toán ngay' : 'Xác nhận đặt lịch'}
                        <span className="ms-2">({formatCurrency(totalAmount)})</span>
                      </>
                    )}
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>

        {/* Support Section */}
        <Row className="mt-5">
          <Col>
            <Card className="border-warning">
              <Card.Body className="text-center py-4">
                <h5 className="mb-3">
                  <i className="bi bi-headset me-2"></i>
                  Cần hỗ trợ thanh toán?
                </h5>
                <p className="text-muted mb-3">
                  Đội ngũ chăm sóc khách hàng sẵn sàng hỗ trợ bạn 24/7
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

      {/* Bank Transfer Modal */}
      <Modal show={showBankModal} onHide={() => setShowBankModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-info-circle me-2"></i>
            Hướng dẫn chuyển khoản
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <strong>Lưu ý quan trọng:</strong>
            <ul className="mb-0 mt-2">
              <li>Chuyển khoản đúng số tiền: <strong>{formatCurrency(totalAmount)}</strong></li>
              <li>Ghi chính xác nội dung: <strong>{paymentData.bankTransferNote}</strong></li>
              <li>Giữ lại biên lai để xác nhận khi cần thiết</li>
              <li>Liên hệ hotline nếu sau 2 giờ chưa nhận được xác nhận</li>
            </ul>
          </Alert>
          <p>Chọn một trong các tài khoản bên dưới để chuyển khoản:</p>
          <Row>
            {bankAccounts.map((account, index) => (
              <Col md={6} key={index} className="mb-3">
                <Card className="border-primary">
                  <Card.Body>
                    <h6 className="text-primary">{account.bank}</h6>
                    <div><strong>STK:</strong> {account.accountNumber}</div>
                    <div><strong>Tên:</strong> {account.accountName}</div>
                    <div><strong>Chi nhánh:</strong> {account.branch}</div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBankModal(false)}>
            Đã hiểu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Payment;