import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Alert, Modal, Form, Table, InputGroup, Tabs, Tab } from 'react-bootstrap';

const ResultsManagement = ({ user }) => {
  const [results, setResults] = useState([]);
  const [filteredResults, setFilteredResults] = useState([]);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showDeliveryModal, setShowDeliveryModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState('ready');
  const [deliveryMethod, setDeliveryMethod] = useState('email');
  const [deliveryDetails, setDeliveryDetails] = useState({
    email: '',
    phone: '',
    address: '',
    recipientName: '',
    notes: ''
  });

  // Mock data cho các kết quả xét nghiệm
  useEffect(() => {
    const mockResults = [
      {
        id: 'ADN123482',
        customerName: 'Nguyễn Văn U',
        phone: '0905555555',
        email: 'nguyenvanu@email.com',
        service: 'Xét nghiệm ADN huyết thống cha-con',
        serviceType: 'civil',
        labCode: 'LAB-ADN-2024-0129-012',
        completedDate: '2024-01-29 16:30',
        technician: 'Dr. Nguyễn Văn X',
        status: 'ready-to-release',
        priority: 'high',
        hasLegalValue: false,
        result: {
          conclusion: 'POSITIVE',
          confidence: '99.999%',
          method: 'STR Analysis',
          summary: 'Kết quả xét nghiệm xác nhận mối quan hệ huyết thống cha-con.',
          details: 'Dựa trên phân tích 21 locus STR, kết quả cho thấy Nguyễn Văn U là cha sinh học với độ chính xác 99.999%.'
        },
        participants: [
          { name: 'Nguyễn Văn U', role: 'Cha nghi ngờ' },
          { name: 'Nguyễn Thị V', role: 'Con' }
        ],
        orderDate: '2024-01-25'
      },
      {
        id: 'ADN123483',
        customerName: 'Trần Thị W',
        phone: '0906666666',
        email: 'tranthiw@email.com',
        service: 'Xét nghiệm ADN khai sinh',
        serviceType: 'administrative',
        labCode: 'LAB-ADN-2024-0128-013',
        completedDate: '2024-01-28 14:15',
        technician: 'Dr. Trần Thị Y',
        status: 'delivered',
        priority: 'urgent',
        hasLegalValue: true,
        result: {
          conclusion: 'POSITIVE',
          confidence: '99.999%',
          method: 'STR Analysis',
          summary: 'Kết quả xác nhận quan hệ huyết thống cha-con phục vụ làm giấy khai sinh.',
          details: 'Xét nghiệm được thực hiện theo tiêu chuẩn pháp lý, có đầy đủ giá trị làm thủ tục hành chính.'
        },
        participants: [
          { name: 'Trần Văn X', role: 'Cha' },
          { name: 'Trần Thị W', role: 'Mẹ' },
          { name: 'Trần Văn Y', role: 'Con' }
        ],
        deliveredDate: '2024-01-29 10:30',
        deliveredBy: user.name,
        deliveryMethod: 'email-and-post',
        orderDate: '2024-01-24'
      },
      {
        id: 'ADN123484',
        customerName: 'Lê Văn Z',
        phone: '0907777777',
        email: 'levanz@email.com',
        service: 'Xét nghiệm ADN trước sinh',
        serviceType: 'civil',
        labCode: 'LAB-ADN-2024-0127-014',
        completedDate: '2024-01-27 11:45',
        technician: 'Dr. Lê Văn A',
        status: 'reviewed',
        priority: 'high',
        hasLegalValue: false,
        result: {
          conclusion: 'NEGATIVE',
          confidence: '99.999%',
          method: 'NIPT',
          summary: 'Kết quả xét nghiệm loại trừ quan hệ huyết thống cha-con.',
          details: 'Xét nghiệm ADN trước sinh không xâm lấn qua mẫu máu mẹ. Kết quả loại trừ mối quan hệ cha-con với độ chính xác 99.999%.'
        },
        participants: [
          { name: 'Lê Thị B', role: 'Mẹ mang thai' },
          { name: 'Lê Văn Z', role: 'Cha nghi ngờ' }
        ],
        reviewedDate: '2024-01-28 09:30',
        reviewedBy: 'Dr. Trưởng phòng',
        gestationalAge: '10 tuần',
        orderDate: '2024-01-23'
      },
      {
        id: 'ADN123485',
        customerName: 'Phạm Thị C',
        phone: '0908888888',
        email: 'phamthic@email.com',
        service: 'Xét nghiệm ADN anh chị em',
        serviceType: 'civil',
        labCode: 'LAB-ADN-2024-0126-015',
        completedDate: '2024-01-26 16:20',
        technician: 'Dr. Phạm Văn B',
        status: 'quality-review',
        priority: 'medium',
        hasLegalValue: false,
        result: {
          conclusion: 'POSITIVE',
          confidence: '99.85%',
          method: 'STR Analysis',
          summary: 'Kết quả xét nghiệm hỗ trợ mối quan hệ anh chị em ruột.',
          details: 'Chỉ số Sibling Index = 2.89, hỗ trợ mạnh giả thuyết hai người có quan hệ anh chị em ruột.'
        },
        participants: [
          { name: 'Phạm Văn D', role: 'Anh' },
          { name: 'Phạm Thị C', role: 'Em' }
        ],
        orderDate: '2024-01-22'
      }
    ];
    setResults(mockResults);
    setFilteredResults(mockResults);
  }, []);

  // Filter results based on search and status
  useEffect(() => {
    let filtered = results;
    
    if (searchTerm) {
      filtered = filtered.filter(result => 
        result.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        result.phone.includes(searchTerm) ||
        result.labCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(result => result.status === filterStatus);
    }
    
    setFilteredResults(filtered);
  }, [searchTerm, filterStatus, results]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'ready-to-release': { bg: 'warning', text: 'Sẵn sàng trả' },
      'quality-review': { bg: 'info', text: 'Đang kiểm duyệt' },
      'reviewed': { bg: 'primary', text: 'Đã duyệt' },
      'delivered': { bg: 'success', text: 'Đã giao' },
      'need-revision': { bg: 'danger', text: 'Cần sửa đổi' }
    };
    const config = statusConfig[status] || { bg: 'secondary', text: 'Không xác định' };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'urgent': { bg: 'danger', text: 'Khẩn cấp' },
      'high': { bg: 'warning', text: 'Cao' },
      'medium': { bg: 'primary', text: 'Trung bình' },
      'low': { bg: 'secondary', text: 'Thấp' }
    };
    const config = priorityConfig[priority] || { bg: 'secondary', text: 'Không xác định' };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getResultBadge = (conclusion) => {
    const resultConfig = {
      'POSITIVE': { bg: 'success', text: 'DƯƠNG TÍNH', icon: 'bi-check-circle' },
      'NEGATIVE': { bg: 'danger', text: 'ÂM TÍNH', icon: 'bi-x-circle' },
      'INCONCLUSIVE': { bg: 'warning', text: 'KHÔNG KẾT LUẬN', icon: 'bi-question-circle' }
    };
    const config = resultConfig[conclusion] || { bg: 'secondary', text: 'CHƯA XÁC ĐỊNH', icon: 'bi-circle' };
    return (
      <Badge bg={config.bg} className="p-2">
        <i className={`${config.icon} me-1`}></i>
        {config.text}
      </Badge>
    );
  };

  const handleViewResult = (result) => {
    setSelectedResult(result);
    setShowResultModal(true);
  };

  const handlePrepareDelivery = (result) => {
    setSelectedResult(result);
    setDeliveryDetails({
      email: result.email,
      phone: result.phone,
      address: '',
      recipientName: result.customerName,
      notes: ''
    });
    setShowDeliveryModal(true);
  };

  const handleDeliverResult = () => {
    const updatedResults = results.map(result => 
      result.id === selectedResult.id 
        ? { 
            ...result, 
            status: 'delivered',
            deliveredDate: new Date().toLocaleString('vi-VN'),
            deliveredBy: user.name,
            deliveryMethod: deliveryMethod,
            deliveryDetails: deliveryDetails
          }
        : result
    );
    setResults(updatedResults);
    setShowDeliveryModal(false);
    setSelectedResult(null);
    
    setAlert({ 
      show: true, 
      message: `Kết quả ${selectedResult.id} đã được giao thành công!`,
      type: 'success' 
    });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handleApproveResult = (resultId) => {
    const updatedResults = results.map(result => 
      result.id === resultId 
        ? { 
            ...result, 
            status: 'reviewed',
            reviewedDate: new Date().toLocaleString('vi-VN'),
            reviewedBy: user.name
          }
        : result
    );
    setResults(updatedResults);
    
    setAlert({ 
      show: true, 
      message: `Kết quả ${resultId} đã được phê duyệt!`,
      type: 'success' 
    });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('vi-VN');
  };

  const calculateDaysSinceCompletion = (completedDate) => {
    const completed = new Date(completedDate);
    const now = new Date();
    const diffTime = Math.abs(now - completed);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-file-earmark-check me-2"></i>
            Quản lý và Trả Kết quả
          </h2>
          <p className="text-muted mb-0">Quản lý việc kiểm duyệt và giao kết quả xét nghiệm cho khách hàng</p>
        </div>
      </div>

      {/* Alert */}
      {alert.show && (
        <Alert variant={alert.type} className="mb-4">
          <i className="bi bi-check-circle me-2"></i>
          {alert.message}
        </Alert>
      )}

      {/* Results Statistics */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-start border-warning border-4 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-clock-history fs-1 text-warning"></i>
              </div>
              <div>
                <div className="h4 mb-0">{results.filter(r => ['ready-to-release', 'quality-review'].includes(r.status)).length}</div>
                <div className="text-muted small">Chờ xử lý</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-start border-primary border-4 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-check-circle fs-1 text-primary"></i>
              </div>
              <div>
                <div className="h4 mb-0">{results.filter(r => r.status === 'reviewed').length}</div>
                <div className="text-muted small">Đã duyệt</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-start border-success border-4 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-send fs-1 text-success"></i>
              </div>
              <div>
                <div className="h4 mb-0">{results.filter(r => r.status === 'delivered').length}</div>
                <div className="text-muted small">Đã giao</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-start border-danger border-4 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-exclamation-triangle fs-1 text-danger"></i>
              </div>
              <div>
                <div className="h4 mb-0">{results.filter(r => r.priority === 'urgent').length}</div>
                <div className="text-muted small">Khẩn cấp</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col lg={6} md={8} className="mb-3">
              <Form.Label>Tìm kiếm</Form.Label>
              <InputGroup>
                <Form.Control
                  placeholder="Mã đơn, tên khách hàng, mã lab, số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-secondary">
                  <i className="bi bi-search"></i>
                </Button>
              </InputGroup>
            </Col>
            <Col lg={3} md={4} className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">Tất cả trạng thái</option>
                <option value="ready-to-release">Sẵn sàng trả</option>
                <option value="quality-review">Đang kiểm duyệt</option>
                <option value="reviewed">Đã duyệt</option>
                <option value="delivered">Đã giao</option>
                <option value="need-revision">Cần sửa đổi</option>
              </Form.Select>
            </Col>
            <Col lg={3} className="mb-3 d-flex align-items-end">
              <div className="w-100">
                <Badge bg="warning" className="me-2">
                  Cần xử lý: {results.filter(r => ['ready-to-release', 'quality-review'].includes(r.status)).length}
                </Badge>
                <Badge bg="success">
                  Hoàn thành: {results.filter(r => r.status === 'delivered').length}
                </Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Results Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="ready" title={
          <span>
            <i className="bi bi-clock-history me-2"></i>
            Sẵn sàng trả ({results.filter(r => r.status === 'ready-to-release').length})
          </span>
        }>
          {/* Ready to Release Table */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Kết quả sẵn sàng giao</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Mã đơn</th>
                      <th>Khách hàng</th>
                      <th>Dịch vụ</th>
                      <th>Kết quả</th>
                      <th>Ngày hoàn thành</th>
                      <th>Thời gian chờ</th>
                      <th>Ưu tiên</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.filter(r => r.status === 'ready-to-release').map((result) => (
                      <tr key={result.id}>
                        <td>
                          <div className="fw-bold">{result.id}</div>
                          <small className="text-muted">{result.labCode}</small>
                        </td>
                        <td>
                          <div className="fw-bold">{result.customerName}</div>
                          <small className="text-muted">{result.phone}</small>
                        </td>
                        <td>
                          <div>{result.service}</div>
                          <div className="mt-1">
                            {result.hasLegalValue ? (
                              <Badge bg="warning" text="dark">Có giá trị pháp lý</Badge>
                            ) : (
                              <Badge bg="info">Dân sự</Badge>
                            )}
                          </div>
                        </td>
                        <td>{getResultBadge(result.result.conclusion)}</td>
                        <td>{formatDateTime(result.completedDate)}</td>
                        <td>
                          <Badge bg="info">{calculateDaysSinceCompletion(result.completedDate)} ngày</Badge>
                        </td>
                        <td>{getPriorityBadge(result.priority)}</td>
                        <td>
                          <div className="d-flex flex-column gap-1">
                            <Button 
                              size="sm" 
                              variant="outline-primary"
                              onClick={() => handleViewResult(result)}
                            >
                              <i className="bi bi-eye me-1"></i>
                              Xem
                            </Button>
                            <Button 
                              size="sm" 
                              variant="success"
                              onClick={() => handlePrepareDelivery(result)}
                            >
                              <i className="bi bi-send me-1"></i>
                              Giao KQ
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="review" title={
          <span>
            <i className="bi bi-shield-check me-2"></i>
            Kiểm duyệt ({results.filter(r => r.status === 'quality-review').length})
          </span>
        }>
          {/* Quality Review Table */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Kết quả đang kiểm duyệt</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Mã đơn</th>
                      <th>Khách hàng</th>
                      <th>Dịch vụ</th>
                      <th>Kết quả</th>
                      <th>Kỹ thuật viên</th>
                      <th>Ngày hoàn thành</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.filter(r => r.status === 'quality-review').map((result) => (
                      <tr key={result.id}>
                        <td>
                          <div className="fw-bold">{result.id}</div>
                          <small className="text-muted">{result.labCode}</small>
                        </td>
                        <td>{result.customerName}</td>
                        <td>{result.service}</td>
                        <td>{getResultBadge(result.result.conclusion)}</td>
                        <td>{result.technician}</td>
                        <td>{formatDateTime(result.completedDate)}</td>
                        <td>
                          <div className="d-flex flex-column gap-1">
                            <Button 
                              size="sm" 
                              variant="outline-primary"
                              onClick={() => handleViewResult(result)}
                            >
                              <i className="bi bi-eye me-1"></i>
                              Xem chi tiết
                            </Button>
                            <Button 
                              size="sm" 
                              variant="success"
                              onClick={() => handleApproveResult(result.id)}
                            >
                              <i className="bi bi-check-circle me-1"></i>
                              Phê duyệt
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="delivered" title={
          <span>
            <i className="bi bi-check-circle me-2"></i>
            Đã giao ({results.filter(r => r.status === 'delivered').length})
          </span>
        }>
          {/* Delivered Results Table */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Kết quả đã giao</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Mã đơn</th>
                      <th>Khách hàng</th>
                      <th>Dịch vụ</th>
                      <th>Kết quả</th>
                      <th>Ngày giao</th>
                      <th>Người giao</th>
                      <th>Phương thức</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredResults.filter(r => r.status === 'delivered').map((result) => (
                      <tr key={result.id}>
                        <td>
                          <div className="fw-bold">{result.id}</div>
                          <small className="text-muted">{result.labCode}</small>
                        </td>
                        <td>{result.customerName}</td>
                        <td>{result.service}</td>
                        <td>{getResultBadge(result.result.conclusion)}</td>
                        <td>{formatDateTime(result.deliveredDate)}</td>
                        <td>{result.deliveredBy}</td>
                        <td>
                          <Badge bg="success">
                            {result.deliveryMethod === 'email' ? 'Email' :
                             result.deliveryMethod === 'phone' ? 'Điện thoại' :
                             result.deliveryMethod === 'post' ? 'Bưu điện' :
                             'Email + Bưu điện'}
                          </Badge>
                        </td>
                        <td>
                          <Button 
                            size="sm" 
                            variant="outline-primary"
                            onClick={() => handleViewResult(result)}
                          >
                            <i className="bi bi-eye me-1"></i>
                            Xem
                          </Button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>
      </Tabs>

      {/* Result Detail Modal */}
      <Modal show={showResultModal} onHide={() => setShowResultModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-file-earmark-text me-2"></i>
            Chi tiết kết quả - {selectedResult?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedResult && (
            <div>
              {/* Basic Info */}
              <Row className="mb-4">
                <Col md={6}>
                  <h6 className="text-primary mb-3">Thông tin đơn hàng</h6>
                  <table className="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <td><strong>Mã đơn:</strong></td>
                        <td>{selectedResult.id}</td>
                      </tr>
                      <tr>
                        <td><strong>Mã lab:</strong></td>
                        <td>{selectedResult.labCode}</td>
                      </tr>
                      <tr>
                        <td><strong>Khách hàng:</strong></td>
                        <td>{selectedResult.customerName}</td>
                      </tr>
                      <tr>
                        <td><strong>Email:</strong></td>
                        <td>{selectedResult.email}</td>
                      </tr>
                      <tr>
                        <td><strong>Điện thoại:</strong></td>
                        <td>{selectedResult.phone}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
                <Col md={6}>
                  <h6 className="text-primary mb-3">Thông tin kỹ thuật</h6>
                  <table className="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <td><strong>Dịch vụ:</strong></td>
                        <td>{selectedResult.service}</td>
                      </tr>
                      <tr>
                        <td><strong>Loại xét nghiệm:</strong></td>
                        <td>
                          {selectedResult.hasLegalValue ? (
                            <Badge bg="warning" text="dark">Có giá trị pháp lý</Badge>
                          ) : (
                            <Badge bg="info">Dân sự</Badge>
                          )}
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Phương pháp:</strong></td>
                        <td>{selectedResult.result.method}</td>
                      </tr>
                      <tr>
                        <td><strong>Kỹ thuật viên:</strong></td>
                        <td>{selectedResult.technician}</td>
                      </tr>
                      <tr>
                        <td><strong>Ngày hoàn thành:</strong></td>
                        <td>{formatDateTime(selectedResult.completedDate)}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>

              {/* Participants */}
              <div className="mb-4">
                <h6 className="text-primary mb-3">Người tham gia xét nghiệm</h6>
                <div className="table-responsive">
                  <Table bordered size="sm">
                    <thead className="table-light">
                      <tr>
                        <th>Họ tên</th>
                        <th>Vai trò</th>
                        <th>Mối quan hệ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedResult.participants.map((participant, index) => (
                        <tr key={index}>
                          <td><strong>{participant.name}</strong></td>
                          <td>{participant.role}</td>
                          <td>{index === 0 ? 'Người yêu cầu' : 'Đối tượng xét nghiệm'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>

              {/* Main Result */}
              <div className="mb-4 p-4 border rounded">
                <h5 className="text-center mb-3">
                  <i className="bi bi-clipboard-check me-2"></i>
                  KẾT QUẢ XÉT NGHIỆM
                </h5>
                
                <div className="text-center mb-4">
                  {getResultBadge(selectedResult.result.conclusion)}
                  <div className="h4 text-primary mt-2">
                    Độ chính xác: {selectedResult.result.confidence}
                  </div>
                </div>

                <Alert 
                  variant={
                    selectedResult.result.conclusion === 'POSITIVE' ? 'success' : 
                    selectedResult.result.conclusion === 'NEGATIVE' ? 'danger' : 'warning'
                  }
                  className="text-center"
                >
                  <Alert.Heading>Kết luận:</Alert.Heading>
                  <p className="mb-0 h6">{selectedResult.result.summary}</p>
                </Alert>

                <div className="mt-3">
                  <h6>Chi tiết kết quả:</h6>
                  <p className="mb-0">{selectedResult.result.details}</p>
                </div>
              </div>

              {/* Legal Notice */}
              {selectedResult.hasLegalValue && (
                <Alert variant="warning" className="mb-4">
                  <i className="bi bi-shield-check me-2"></i>
                  <strong>Giá trị pháp lý:</strong> Kết quả này có đầy đủ giá trị pháp lý và được 
                  công nhận bởi các cơ quan tòa án, cơ quan nhà nước trong các thủ tục hành chính.
                </Alert>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResultModal(false)}>
            Đóng
          </Button>
          {selectedResult?.status === 'ready-to-release' && (
            <Button 
              variant="success" 
              onClick={() => {
                setShowResultModal(false);
                handlePrepareDelivery(selectedResult);
              }}
            >
              <i className="bi bi-send me-2"></i>
              Giao kết quả
            </Button>
          )}
        </Modal.Footer>
      </Modal>

      {/* Delivery Modal */}
      <Modal show={showDeliveryModal} onHide={() => setShowDeliveryModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-send me-2"></i>
            Giao kết quả xét nghiệm
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedResult && (
            <div>
              {/* Result Summary */}
              <div className="mb-4 p-3 bg-light rounded">
                <Row>
                  <Col md={6}>
                    <strong>Mã đơn:</strong> {selectedResult.id}<br />
                    <strong>Khách hàng:</strong> {selectedResult.customerName}<br />
                    <strong>Dịch vụ:</strong> {selectedResult.service}
                  </Col>
                  <Col md={6}>
                    <strong>Kết quả:</strong> {getResultBadge(selectedResult.result.conclusion)}<br />
                    <strong>Độ tin cậy:</strong> {selectedResult.result.confidence}
                  </Col>
                </Row>
              </div>

              {/* Delivery Method */}
              <div className="mb-4">
                <h6 className="text-primary mb-3">Phương thức giao kết quả</h6>
                <Form>
                  <div className="mb-3">
                    <Form.Check 
                      type="radio"
                      id="email"
                      name="deliveryMethod"
                      value="email"
                      checked={deliveryMethod === 'email'}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      label="Gửi qua Email (Nhanh, tiện lợi)"
                    />
                    <Form.Check 
                      type="radio"
                      id="phone"
                      name="deliveryMethod"
                      value="phone"
                      checked={deliveryMethod === 'phone'}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      label="Thông báo qua điện thoại (Bảo mật cao)"
                    />
                    <Form.Check 
                      type="radio"
                      id="post"
                      name="deliveryMethod"
                      value="post"
                      checked={deliveryMethod === 'post'}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      label="Gửi bưu điện (Giấy tờ gốc)"
                    />
                    <Form.Check 
                      type="radio"
                      id="email-and-post"
                      name="deliveryMethod"
                      value="email-and-post"
                      checked={deliveryMethod === 'email-and-post'}
                      onChange={(e) => setDeliveryMethod(e.target.value)}
                      label="Email + Bưu điện (Đầy đủ nhất)"
                    />
                  </div>
                </Form>
              </div>

              {/* Delivery Details */}
              <div className="mb-4">
                <h6 className="text-primary mb-3">Thông tin giao hàng</h6>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Tên người nhận</Form.Label>
                    <Form.Control 
                      value={deliveryDetails.recipientName}
                      onChange={(e) => setDeliveryDetails({...deliveryDetails, recipientName: e.target.value})}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Email</Form.Label>
                    <Form.Control 
                      type="email"
                      value={deliveryDetails.email}
                      onChange={(e) => setDeliveryDetails({...deliveryDetails, email: e.target.value})}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control 
                      value={deliveryDetails.phone}
                      onChange={(e) => setDeliveryDetails({...deliveryDetails, phone: e.target.value})}
                    />
                  </Col>
                  {(deliveryMethod === 'post' || deliveryMethod === 'email-and-post') && (
                    <Col md={6} className="mb-3">
                      <Form.Label>Địa chỉ gửi bưu điện</Form.Label>
                      <Form.Control 
                        as="textarea"
                        rows={2}
                        value={deliveryDetails.address}
                        onChange={(e) => setDeliveryDetails({...deliveryDetails, address: e.target.value})}
                        placeholder="Nhập địa chỉ đầy đủ..."
                      />
                    </Col>
                  )}
                  <Col md={12} className="mb-3">
                    <Form.Label>Ghi chú giao hàng</Form.Label>
                    <Form.Control 
                      as="textarea"
                      rows={2}
                      value={deliveryDetails.notes}
                      onChange={(e) => setDeliveryDetails({...deliveryDetails, notes: e.target.value})}
                      placeholder="Ghi chú đặc biệt về việc giao kết quả..."
                    />
                  </Col>
                </Row>
              </div>

              {/* Security Notice */}
              <Alert variant="info">
                <i className="bi bi-shield-lock me-2"></i>
                <strong>Lưu ý bảo mật:</strong> Kết quả xét nghiệm chứa thông tin y tế nhạy cảm. 
                Vui lòng đảm bảo giao cho đúng người và giữ bí mật thông tin.
              </Alert>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeliveryModal(false)}>
            Hủy
          </Button>
          <Button 
            variant="success" 
            onClick={handleDeliverResult}
            disabled={!deliveryDetails.recipientName || !deliveryDetails.email}
          >
            <i className="bi bi-send me-2"></i>
            Xác nhận giao kết quả
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default ResultsManagement;