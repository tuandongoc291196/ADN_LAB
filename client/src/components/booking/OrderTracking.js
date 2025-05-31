import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Badge, Form, InputGroup, ProgressBar } from 'react-bootstrap';

const OrderTracking = () => {
  const { trackingId } = useParams();
  const [searchId, setSearchId] = useState(trackingId || '');
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Mock order statuses
  const orderStatuses = {
    'self-sample': [
      { step: 1, title: 'Đặt hẹn thành công', description: 'Lịch hẹn đã được xác nhận', icon: 'bi-check-circle', status: 'completed' },
      { step: 2, title: 'Chuẩn bị kit xét nghiệm', description: 'Đang chuẩn bị kit gửi đến bạn', icon: 'bi-box', status: 'completed' },
      { step: 3, title: 'Gửi kit xét nghiệm', description: 'Kit đã được gửi đến địa chỉ của bạn', icon: 'bi-truck', status: 'completed' },
      { step: 4, title: 'Chờ nhận mẫu', description: 'Vui lòng thu mẫu và gửi về phòng lab', icon: 'bi-droplet', status: 'current' },
      { step: 5, title: 'Phân tích mẫu', description: 'Đang tiến hành phân tích ADN', icon: 'bi-eye', status: 'pending' },
      { step: 6, title: 'Có kết quả', description: 'Kết quả đã sẵn sàng', icon: 'bi-file-earmark-check', status: 'pending' }
    ],
    'at-facility': [
      { step: 1, title: 'Đặt hẹn thành công', description: 'Lịch hẹn đã được xác nhận', icon: 'bi-check-circle', status: 'completed' },
      { step: 2, title: 'Xác nhận tham gia', description: 'Đã có mặt và thu mẫu thành công', icon: 'bi-hospital', status: 'completed' },
      { step: 3, title: 'Phân tích mẫu', description: 'Đang tiến hành phân tích ADN tại phòng lab', icon: 'bi-eye', status: 'current' },
      { step: 4, title: 'Kiểm tra chất lượng', description: 'Đang kiểm tra và đối soát kết quả', icon: 'bi-shield-check', status: 'pending' },
      { step: 5, title: 'Có kết quả', description: 'Kết quả đã sẵn sàng', icon: 'bi-file-earmark-check', status: 'pending' }
    ],
    'home-visit': [
      { step: 1, title: 'Đặt hẹn thành công', description: 'Lịch hẹn đã được xác nhận', icon: 'bi-check-circle', status: 'completed' },
      { step: 2, title: 'Nhân viên đến thu mẫu', description: 'Nhân viên đã đến và thu mẫu thành công', icon: 'bi-truck', status: 'completed' },
      { step: 3, title: 'Vận chuyển mẫu', description: 'Mẫu đang được vận chuyển về phòng lab', icon: 'bi-arrow-right-circle', status: 'completed' },
      { step: 4, title: 'Phân tích mẫu', description: 'Đang tiến hành phân tích ADN', icon: 'bi-eye', status: 'current' },
      { step: 5, title: 'Có kết quả', description: 'Kết quả đã sẵn sàng', icon: 'bi-file-earmark-check', status: 'pending' }
    ]
  };

  // Mock order data
  const mockOrderData = {
    'ADN123456': {
      id: 'ADN123456',
      serviceTitle: 'Xét nghiệm ADN huyết thống cha-con',
      serviceType: 'civil',
      collectionMethod: 'self-sample',
      customerName: 'Nguyễn Văn A',
      orderDate: '2024-01-15',
      expectedDate: '2024-01-22',
      currentStatus: 'Chờ nhận mẫu',
      progress: 60,
      statusHistory: orderStatuses['self-sample'],
      kitTrackingNumber: 'VTP123456789',
      labCode: 'LAB-ADN-2024-0115-001'
    },
    'ADN123457': {
      id: 'ADN123457',
      serviceTitle: 'Xét nghiệm ADN khai sinh',
      serviceType: 'administrative',
      collectionMethod: 'at-facility',
      customerName: 'Trần Thị B',
      orderDate: '2024-01-16',
      expectedDate: '2024-01-21',
      currentStatus: 'Đang phân tích mẫu',
      progress: 75,
      statusHistory: orderStatuses['at-facility'],
      labCode: 'LAB-ADN-2024-0116-002'
    },
    'ADN123458': {
    id: 'ADN123458',
    serviceTitle: 'Xét nghiệm ADN nhập tịch',
    serviceType: 'administrative',
    collectionMethod: 'home-visit',
    customerName: 'Lê Văn C',
    orderDate: '2024-01-18',
    expectedDate: '2024-01-23',
    currentStatus: 'Đang phân tích mẫu',
    progress: 80,
    statusHistory: orderStatuses['home-visit'],
    labCode: 'LAB-ADN-2024-0118-003'
  },

  // Additional diverse orders
  'ADN123459': {
    id: 'ADN123459',
    serviceTitle: 'Xét nghiệm ADN trước sinh',
    serviceType: 'civil',
    collectionMethod: 'at-facility',
    customerName: 'Phạm Thị D',
    orderDate: '2024-01-20',
    expectedDate: '2024-01-27',
    currentStatus: 'Đã có mặt và thu mẫu thành công',
    progress: 50,
    statusHistory: orderStatuses['at-facility'],
    labCode: 'LAB-ADN-2024-0120-004'
  },

  'ADN123460': {
    id: 'ADN123460',
    serviceTitle: 'Xét nghiệm ADN bí mật',
    serviceType: 'civil',
    collectionMethod: 'self-sample',
    customerName: 'Hoàng Văn E',
    orderDate: '2024-01-22',
    expectedDate: '2024-01-29',
    currentStatus: 'Kit đã được gửi đến địa chỉ của bạn',
    progress: 40,
    statusHistory: orderStatuses['self-sample'],
    kitTrackingNumber: 'VTP987654321',
    labCode: 'LAB-ADN-2024-0122-005'
  },

  'ADN123461': {
    id: 'ADN123461',
    serviceTitle: 'Xét nghiệm ADN anh chị em',
    serviceType: 'civil',
    collectionMethod: 'home-visit',
    customerName: 'Vũ Thị F',
    orderDate: '2024-01-25',
    expectedDate: '2024-02-01',
    currentStatus: 'Nhân viên đã đến và thu mẫu thành công',
    progress: 60,
    statusHistory: orderStatuses['home-visit'],
    labCode: 'LAB-ADN-2024-0125-006'
  }
  };

  const handleSearch = async () => {
    if (!searchId.trim()) {
      setError('Vui lòng nhập mã đặt lịch');
      return;
    }

    setLoading(true);
    setError('');

    // Simulate API call
    setTimeout(() => {
      const data = mockOrderData[searchId.toUpperCase()];
      if (data) {
        setOrderData(data);
        setError('');
      } else {
        setOrderData(null);
        setError('Không tìm thấy thông tin đặt lịch. Vui lòng kiểm tra lại mã đặt lịch.');
      }
      setLoading(false);
    }, 1000);
  };

  useEffect(() => {
    if (trackingId) {
      handleSearch();
    }
  }, [trackingId]);

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed': return 'success';
      case 'current': return 'primary';
      case 'pending': return 'light';
      default: return 'light';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed': return 'bi-check-circle-fill';
      case 'current': return 'bi-arrow-right-circle-fill';
      case 'pending': return 'bi-circle';
      default: return 'bi-circle';
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <Container className="py-5">
      {/* Search Section */}
      <Row className="mb-5">
        <Col lg={8} className="mx-auto">
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white text-center">
              <h4 className="mb-0">
                <i className="bi bi-search me-2"></i>
                Tra cứu trạng thái đặt lịch
              </h4>
            </Card.Header>
            <Card.Body>
              <Form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                <InputGroup size="lg">
                  <Form.Control
                    type="text"
                    placeholder="Nhập mã đặt lịch (VD: ADN123456)"
                    value={searchId}
                    onChange={(e) => setSearchId(e.target.value)}
                    disabled={loading}
                  />
                  <Button variant="primary" onClick={handleSearch} disabled={loading}>
                    {loading ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                        Đang tìm...
                      </>
                    ) : (
                      <>
                        <i className="bi bi-search me-2"></i>
                        Tra cứu
                      </>
                    )}
                  </Button>
                </InputGroup>
              </Form>

              {error && (
                <Alert variant="danger" className="mt-3 mb-0">
                  <i className="bi bi-exclamation-circle me-2"></i>
                  {error}
                </Alert>
              )}

              <div className="mt-3 text-center">
                <small className="text-muted">
                  Mã đặt lịch được gửi qua SMS và email sau khi đặt lịch thành công
                  <br />
                  <strong>Demo:</strong> Thử với mã ADN123456 hoặc ADN123457
                </small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Order Details */}
      {orderData && (
        <>
          {/* Order Summary */}
          <Row className="mb-4">
            <Col lg={10} className="mx-auto">
              <Card className="shadow">
                <Card.Header className="bg-success text-white">
                  <Row className="align-items-center">
                    <Col>
                      <h5 className="mb-0">
                        <i className="bi bi-clipboard-data me-2"></i>
                        Thông tin đặt lịch #{orderData.id}
                      </h5>
                    </Col>
                    <Col xs="auto">
                      <Badge bg="light" text="dark" className="fs-6">
                        {orderData.currentStatus}
                      </Badge>
                    </Col>
                  </Row>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={4} className="mb-3">
                      <h6 className="text-primary mb-2">Dịch vụ</h6>
                      <p className="mb-1">{orderData.serviceTitle}</p>
                      <Badge bg={orderData.serviceType === 'civil' ? 'success' : 'warning'}>
                        {orderData.serviceType === 'civil' ? 'ADN Dân sự' : 'ADN Hành chính'}
                      </Badge>
                    </Col>
                    <Col md={4} className="mb-3">
                      <h6 className="text-primary mb-2">Thời gian</h6>
                      <p className="mb-1"><strong>Ngày đặt:</strong> {formatDate(orderData.orderDate)}</p>
                      <p className="mb-1"><strong>Dự kiến có KQ:</strong> {formatDate(orderData.expectedDate)}</p>
                    </Col>
                    <Col md={4} className="mb-3">
                      <h6 className="text-primary mb-2">Khách hàng</h6>
                      <p className="mb-1">{orderData.customerName}</p>
                      <p className="mb-1">
                        <strong>Phương thức:</strong> 
                        {orderData.collectionMethod === 'self-sample' && ' Tự thu mẫu'}
                        {orderData.collectionMethod === 'home-visit' && ' Thu mẫu tại nhà'}
                        {orderData.collectionMethod === 'at-facility' && ' Thu mẫu tại cơ sở'}
                      </p>
                    </Col>
                  </Row>

                  {/* Progress Bar */}
                  <div className="mt-3">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="text-primary mb-0">Tiến độ thực hiện</h6>
                      <span className="fw-bold">{orderData.progress}%</span>
                    </div>
                    <ProgressBar 
                      now={orderData.progress} 
                      variant={orderData.progress === 100 ? 'success' : 'primary'}
                      style={{ height: '10px' }}
                    />
                  </div>

                  {/* Additional Info */}
                  <Row className="mt-3">
                    {orderData.kitTrackingNumber && (
                      <Col md={6}>
                        <Alert variant="info" className="mb-0">
                          <i className="bi bi-box me-2"></i>
                          <strong>Mã vận đơn kit:</strong> {orderData.kitTrackingNumber}
                          <br />
                          <small>Theo dõi tại website Viettel Post</small>
                        </Alert>
                      </Col>
                    )}
                    <Col md={6}>
                      <Alert variant="secondary" className="mb-0">
                        <i className="bi bi-flask me-2"></i>
                        <strong>Mã phòng lab:</strong> {orderData.labCode}
                        <br />
                        <small>Dùng để tra cứu kết quả</small>
                      </Alert>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Status Timeline */}
          <Row className="mb-4">
            <Col lg={10} className="mx-auto">
              <Card className="shadow">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-clock-history me-2"></i>
                    Trạng thái chi tiết
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="timeline">
                    {orderData.statusHistory.map((status, index) => (
                      <div key={status.step} className="d-flex align-items-start mb-4">
                        {/* Step Number & Icon */}
                        <div className="me-3 text-center" style={{ minWidth: '60px' }}>
                          <div className={`rounded-circle d-flex align-items-center justify-content-center mb-2 ${
                            status.status === 'completed' ? 'bg-success text-white' :
                            status.status === 'current' ? 'bg-primary text-white' :
                            'bg-light text-muted'
                          }`} style={{ width: '50px', height: '50px' }}>
                            <i className={`${getStatusIcon(status.status)} fs-5`}></i>
                          </div>
                          
                          {/* Connecting Line */}
                          {index < orderData.statusHistory.length - 1 && (
                            <div 
                              className={`mx-auto ${
                                status.status === 'completed' ? 'bg-success' : 'bg-light'
                              }`}
                              style={{ width: '2px', height: '40px' }}
                            ></div>
                          )}
                        </div>

                        {/* Status Content */}
                        <div className="flex-grow-1">
                          <Card className={`border-${getStatusColor(status.status)} ${
                            status.status === 'current' ? 'bg-primary bg-opacity-10' : ''
                          }`}>
                            <Card.Body className="py-3">
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h6 className={`mb-1 ${
                                    status.status === 'current' ? 'text-primary fw-bold' : ''
                                  }`}>
                                    <i className={`${status.icon} me-2`}></i>
                                    {status.title}
                                  </h6>
                                  <p className="mb-0 text-muted small">{status.description}</p>
                                  
                                  {/* Current step additional info */}
                                  {status.status === 'current' && orderData.collectionMethod === 'self-sample' && (
                                    <Alert variant="warning" className="mt-2 mb-0 small">
                                      <i className="bi bi-exclamation-triangle me-2"></i>
                                      <strong>Hành động cần thiết:</strong> Vui lòng thu mẫu theo hướng dẫn trong kit và gửi về phòng lab trong vòng 3 ngày.
                                    </Alert>
                                  )}
                                </div>
                                
                                <Badge bg={getStatusColor(status.status)} className="ms-3">
                                  {status.status === 'completed' && 'Hoàn thành'}
                                  {status.status === 'current' && 'Đang thực hiện'}
                                  {status.status === 'pending' && 'Chờ xử lý'}
                                </Badge>
                              </div>
                            </Card.Body>
                          </Card>
                        </div>
                      </div>
                    ))}
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Actions & Support */}
          <Row className="mb-4">
            <Col lg={10} className="mx-auto">
              <Row>
                {/* Quick Actions */}
                <Col md={6} className="mb-3">
                  <Card className="border-info h-100">
                    <Card.Header className="bg-info text-white">
                      <h6 className="mb-0">
                        <i className="bi bi-lightning me-2"></i>
                        Hành động nhanh
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <div className="d-grid gap-2">
                        {orderData.progress === 100 && (
                          <Button variant="success" size="sm">
                            <i className="bi bi-download me-2"></i>
                            Tải kết quả xét nghiệm
                          </Button>
                        )}
                        
                        {orderData.collectionMethod === 'self-sample' && orderData.progress < 80 && (
                          <Button variant="outline-primary" size="sm">
                            <i className="bi bi-file-text me-2"></i>
                            Hướng dẫn thu mẫu
                          </Button>
                        )}
                        
                        <Button variant="outline-secondary" size="sm">
                          <i className="bi bi-printer me-2"></i>
                          In thông tin đặt lịch
                        </Button>
                        
                        <Button variant="outline-info" size="sm">
                          <i className="bi bi-share me-2"></i>
                          Chia sẻ trạng thái
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>

                {/* Support */}
                <Col md={6} className="mb-3">
                  <Card className="border-warning h-100">
                    <Card.Header className="bg-warning text-dark">
                      <h6 className="mb-0">
                        <i className="bi bi-headset me-2"></i>
                        Cần hỗ trợ?
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <p className="small text-muted mb-3">
                        Đội ngũ chăm sóc khách hàng sẵn sàng hỗ trợ bạn 24/7
                      </p>
                      <div className="d-grid gap-2">
                        <Button variant="warning" size="sm">
                          <i className="bi bi-telephone me-2"></i>
                          Gọi hotline: 1900 1234
                        </Button>
                        <Button variant="outline-warning" size="sm">
                          <i className="bi bi-chat-dots me-2"></i>
                          Chat trực tuyến
                        </Button>
                        <Button variant="outline-secondary" size="sm">
                          <i className="bi bi-envelope me-2"></i>
                          Gửi email hỗ trợ
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>
          </Row>

          {/* Related Actions */}
          <Row>
            <Col className="text-center">
              <div className="d-flex justify-content-center gap-3 flex-wrap">
                <Button variant="primary" as={Link} to="/user/appointments">
                  <i className="bi bi-list-ul me-2"></i>
                  Tất cả lịch hẹn
                </Button>
                <Button variant="outline-primary" as={Link} to="/appointment">
                  <i className="bi bi-plus-circle me-2"></i>
                  Đặt lịch mới
                </Button>
                <Button variant="outline-secondary" as={Link} to="/">
                  <i className="bi bi-house me-2"></i>
                  Về trang chủ
                </Button>
              </div>
            </Col>
          </Row>
        </>
      )}

      {/* No Data State */}
      {!orderData && !error && !loading && (
        <Row>
          <Col lg={8} className="mx-auto text-center">
            <div className="py-5">
              <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
              <h4 className="text-muted mt-3">Tra cứu trạng thái đặt lịch</h4>
              <p className="text-muted">
                Nhập mã đặt lịch để xem thông tin chi tiết và trạng thái hiện tại
              </p>
            </div>
          </Col>
        </Row>
      )}
    </Container>
  );
};

export default OrderTracking;