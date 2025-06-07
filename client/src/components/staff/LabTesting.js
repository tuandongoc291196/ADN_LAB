import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Alert, Modal, Form, Table, InputGroup, ProgressBar, Tabs, Tab } from 'react-bootstrap';

const LabTesting = ({ user }) => {
  const [tests, setTests] = useState([]);
  const [filteredTests, setFilteredTests] = useState([]);
  const [showTestModal, setShowTestModal] = useState(false);
  const [selectedTest, setSelectedTest] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState('queue');
  const [testResults, setTestResults] = useState({
    conclusion: '',
    confidence: '',
    method: 'STR Analysis (Short Tandem Repeat)',
    analysisDate: '',
    technician: '',
    labCode: '',
    markers: [],
    qualityScore: '',
    notes: ''
  });

  // Mock data cho các xét nghiệm cần thực hiện
  useEffect(() => {
    const mockTests = [
      {
        id: 'ADN123478',
        customerName: 'Nguyễn Văn L',
        service: 'Xét nghiệm ADN huyết thống cha-con',
        serviceType: 'civil',
        participants: [
          { name: 'Nguyễn Văn L', role: 'Cha nghi ngờ', sampleId: 'S001' },
          { name: 'Nguyễn Thị M', role: 'Con', sampleId: 'S002' }
        ],
        sampleReceivedDate: '2024-01-28 10:30',
        priority: 'high',
        status: 'sample-received',
        labCode: 'LAB-ADN-2024-0128-008',
        expectedCompletionDate: '2024-02-01',
        sampleQuality: 'good',
        orderDate: '2024-01-25'
      },
      {
        id: 'ADN123479',
        customerName: 'Trần Thị N',
        service: 'Xét nghiệm ADN khai sinh',
        serviceType: 'administrative',
        participants: [
          { name: 'Trần Văn O', role: 'Cha', sampleId: 'S003' },
          { name: 'Trần Thị N', role: 'Mẹ', sampleId: 'S004' },
          { name: 'Trần Văn P', role: 'Con', sampleId: 'S005' }
        ],
        sampleReceivedDate: '2024-01-27 14:15',
        priority: 'urgent',
        status: 'in-analysis',
        labCode: 'LAB-ADN-2024-0127-009',
        expectedCompletionDate: '2024-01-30',
        sampleQuality: 'excellent',
        orderDate: '2024-01-24',
        startedBy: 'Dr. Nguyễn Văn X',
        startedDate: '2024-01-28 09:00',
        progress: 65
      },
      {
        id: 'ADN123480',
        customerName: 'Lê Văn Q',
        service: 'Xét nghiệm ADN trước sinh',
        serviceType: 'civil',
        participants: [
          { name: 'Lê Thị R', role: 'Mẹ mang thai', sampleId: 'S006' },
          { name: 'Lê Văn Q', role: 'Cha nghi ngờ', sampleId: 'S007' }
        ],
        sampleReceivedDate: '2024-01-26 16:45',
        priority: 'high',
        status: 'quality-check',
        labCode: 'LAB-ADN-2024-0126-010',
        expectedCompletionDate: '2024-01-31',
        sampleQuality: 'fair',
        orderDate: '2024-01-23',
        startedBy: 'Dr. Trần Thị Y',
        startedDate: '2024-01-27 10:30',
        progress: 85,
        gestationalAge: '12 tuần'
      },
      {
        id: 'ADN123481',
        customerName: 'Phạm Văn S',
        service: 'Xét nghiệm ADN anh chị em',
        serviceType: 'civil',
        participants: [
          { name: 'Phạm Văn S', role: 'Anh', sampleId: 'S008' },
          { name: 'Phạm Thị T', role: 'Em', sampleId: 'S009' }
        ],
        sampleReceivedDate: '2024-01-25 11:20',
        priority: 'medium',
        status: 'analysis-complete',
        labCode: 'LAB-ADN-2024-0125-011',
        expectedCompletionDate: '2024-01-30',
        sampleQuality: 'good',
        orderDate: '2024-01-22',
        startedBy: 'Dr. Lê Văn Z',
        startedDate: '2024-01-26 14:00',
        completedDate: '2024-01-28 16:30',
        progress: 100,
        result: {
          conclusion: 'POSITIVE',
          confidence: '99.95%',
          siblingIndex: '2.89'
        }
      }
    ];
    setTests(mockTests);
    setFilteredTests(mockTests);
  }, []);

  // Filter tests based on search and status
  useEffect(() => {
    let filtered = tests;
    
    if (searchTerm) {
      filtered = filtered.filter(test => 
        test.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.labCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(test => test.status === filterStatus);
    }
    
    setFilteredTests(filtered);
  }, [searchTerm, filterStatus, tests]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'sample-received': { bg: 'warning', text: 'Chờ xét nghiệm' },
      'in-analysis': { bg: 'info', text: 'Đang phân tích' },
      'quality-check': { bg: 'primary', text: 'Kiểm tra chất lượng' },
      'analysis-complete': { bg: 'success', text: 'Hoàn thành' },
      'need-retest': { bg: 'danger', text: 'Cần xét lại' }
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

  const getSampleQualityBadge = (quality) => {
    const qualityConfig = {
      'excellent': { bg: 'success', text: 'Xuất sắc' },
      'good': { bg: 'primary', text: 'Tốt' },
      'fair': { bg: 'warning', text: 'Khá' },
      'poor': { bg: 'danger', text: 'Kém' }
    };
    const config = qualityConfig[quality] || { bg: 'secondary', text: 'Không xác định' };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const handleStartAnalysis = (test) => {
    const updatedTests = tests.map(t => 
      t.id === test.id 
        ? { 
            ...t, 
            status: 'in-analysis',
            startedBy: user.name,
            startedDate: new Date().toLocaleString('vi-VN'),
            progress: 10
          }
        : t
    );
    setTests(updatedTests);
    
    setAlert({ 
      show: true, 
      message: `Đã bắt đầu phân tích mẫu ${test.id}`,
      type: 'success' 
    });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handleOpenTestModal = (test) => {
    setSelectedTest(test);
    setTestResults({
      conclusion: test.result?.conclusion || '',
      confidence: test.result?.confidence || '',
      method: 'STR Analysis (Short Tandem Repeat)',
      analysisDate: new Date().toISOString().slice(0, 16),
      technician: user.name,
      labCode: test.labCode,
      markers: [],
      qualityScore: test.sampleQuality,
      notes: ''
    });
    setShowTestModal(true);
  };

  const handleCompleteAnalysis = () => {
    const updatedTests = tests.map(test => 
      test.id === selectedTest.id 
        ? { 
            ...test, 
            status: 'analysis-complete',
            completedDate: new Date().toLocaleString('vi-VN'),
            progress: 100,
            result: testResults
          }
        : test
    );
    setTests(updatedTests);
    setShowTestModal(false);
    setSelectedTest(null);
    
    setAlert({ 
      show: true, 
      message: `Xét nghiệm ${selectedTest.id} đã hoàn thành và ghi nhận kết quả!`,
      type: 'success' 
    });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('vi-VN');
  };

  const calculateDaysInLab = (receivedDate) => {
    const received = new Date(receivedDate);
    const now = new Date();
    const diffTime = Math.abs(now - received);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-eye me-2"></i>
            Phòng Xét nghiệm ADN
          </h2>
          <p className="text-muted mb-0">Thực hiện phân tích ADN và ghi nhận kết quả xét nghiệm</p>
        </div>
      </div>

      {/* Alert */}
      {alert.show && (
        <Alert variant={alert.type} className="mb-4">
          <i className="bi bi-check-circle me-2"></i>
          {alert.message}
        </Alert>
      )}

      {/* Lab Statistics */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-start border-warning border-4 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-hourglass-split fs-1 text-warning"></i>
              </div>
              <div>
                <div className="h4 mb-0">{tests.filter(t => t.status === 'sample-received').length}</div>
                <div className="text-muted small">Chờ xét nghiệm</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-start border-info border-4 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-arrow-repeat fs-1 text-info"></i>
              </div>
              <div>
                <div className="h4 mb-0">{tests.filter(t => ['in-analysis', 'quality-check'].includes(t.status)).length}</div>
                <div className="text-muted small">Đang phân tích</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-start border-success border-4 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-check-circle fs-1 text-success"></i>
              </div>
              <div>
                <div className="h4 mb-0">{tests.filter(t => t.status === 'analysis-complete').length}</div>
                <div className="text-muted small">Hoàn thành</div>
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
                <div className="h4 mb-0">{tests.filter(t => t.priority === 'urgent').length}</div>
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
                  placeholder="Mã đơn, tên khách hàng, mã lab..."
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
                <option value="sample-received">Chờ xét nghiệm</option>
                <option value="in-analysis">Đang phân tích</option>
                <option value="quality-check">Kiểm tra chất lượng</option>
                <option value="analysis-complete">Hoàn thành</option>
                <option value="need-retest">Cần xét lại</option>
              </Form.Select>
            </Col>
            <Col lg={3} className="mb-3 d-flex align-items-end">
              <div className="w-100">
                <Badge bg="info" className="me-2">
                  Đang xử lý: {tests.filter(t => ['in-analysis', 'quality-check'].includes(t.status)).length}
                </Badge>
                <Badge bg="success">
                  Hoàn thành: {tests.filter(t => t.status === 'analysis-complete').length}
                </Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tests Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="queue" title={
          <span>
            <i className="bi bi-list-ol me-2"></i>
            Hàng đợi ({tests.filter(t => t.status === 'sample-received').length})
          </span>
        }>
          {/* Queue Table */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Mẫu chờ xét nghiệm</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Mã đơn</th>
                      <th>Khách hàng</th>
                      <th>Dịch vụ</th>
                      <th>Ngày nhận mẫu</th>
                      <th>Thời gian chờ</th>
                      <th>Ưu tiên</th>
                      <th>Chất lượng mẫu</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTests.filter(t => t.status === 'sample-received').map((test) => (
                      <tr key={test.id}>
                        <td>
                          <div className="fw-bold">{test.id}</div>
                          <small className="text-muted">{test.labCode}</small>
                        </td>
                        <td>
                          <div className="fw-bold">{test.customerName}</div>
                          <small className="text-muted">{test.participants.length} người</small>
                        </td>
                        <td>
                          <div>{test.service}</div>
                          <small className="text-muted">
                            {test.serviceType === 'civil' ? 'Dân sự' : 'Hành chính'}
                          </small>
                        </td>
                        <td>{formatDateTime(test.sampleReceivedDate)}</td>
                        <td>
                          <Badge bg="info">{calculateDaysInLab(test.sampleReceivedDate)} ngày</Badge>
                        </td>
                        <td>{getPriorityBadge(test.priority)}</td>
                        <td>{getSampleQualityBadge(test.sampleQuality)}</td>
                        <td>
                          <Button 
                            size="sm" 
                            variant="success"
                            onClick={() => handleStartAnalysis(test)}
                          >
                            <i className="bi bi-play me-1"></i>
                            Bắt đầu
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

        <Tab eventKey="progress" title={
          <span>
            <i className="bi bi-arrow-repeat me-2"></i>
            Đang xử lý ({tests.filter(t => ['in-analysis', 'quality-check'].includes(t.status)).length})
          </span>
        }>
          {/* In Progress Table */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Mẫu đang phân tích</h5>
            </Card.Header>
            <Card.Body className="p-0">
              <div className="table-responsive">
                <Table hover className="mb-0">
                  <thead className="table-light">
                    <tr>
                      <th>Mã đơn</th>
                      <th>Khách hàng</th>
                      <th>Dịch vụ</th>
                      <th>Người thực hiện</th>
                      <th>Tiến độ</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTests.filter(t => ['in-analysis', 'quality-check'].includes(t.status)).map((test) => (
                      <tr key={test.id}>
                        <td>
                          <div className="fw-bold">{test.id}</div>
                          <small className="text-muted">{test.labCode}</small>
                        </td>
                        <td>{test.customerName}</td>
                        <td>
                          <div>{test.service}</div>
                          {test.gestationalAge && (
                            <small className="text-muted">Thai kỳ: {test.gestationalAge}</small>
                          )}
                        </td>
                        <td>
                          <div>{test.startedBy}</div>
                          <small className="text-muted">Bắt đầu: {formatDateTime(test.startedDate)}</small>
                        </td>
                        <td>
                          <div className="mb-1">
                            <ProgressBar now={test.progress} variant="info" style={{ height: '6px' }} />
                          </div>
                          <small>{test.progress}%</small>
                        </td>
                        <td>{getStatusBadge(test.status)}</td>
                        <td>
                          {test.status === 'quality-check' && (
                            <Button 
                              size="sm" 
                              variant="primary"
                              onClick={() => handleOpenTestModal(test)}
                            >
                              <i className="bi bi-clipboard-check me-1"></i>
                              Nhập kết quả
                            </Button>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        <Tab eventKey="completed" title={
          <span>
            <i className="bi bi-check-circle me-2"></i>
            Hoàn thành ({tests.filter(t => t.status === 'analysis-complete').length})
          </span>
        }>
          {/* Completed Table */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">Xét nghiệm hoàn thành</h5>
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
                      <th>Người thực hiện</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTests.filter(t => t.status === 'analysis-complete').map((test) => (
                      <tr key={test.id}>
                        <td>
                          <div className="fw-bold">{test.id}</div>
                          <small className="text-muted">{test.labCode}</small>
                        </td>
                        <td>{test.customerName}</td>
                        <td>{test.service}</td>
                        <td>
                          {test.result && (
                            <div>
                              <Badge bg={test.result.conclusion === 'POSITIVE' ? 'success' : 'danger'}>
                                {test.result.conclusion}
                              </Badge>
                              <div className="small text-muted">
                                Độ tin cậy: {test.result.confidence}
                              </div>
                            </div>
                          )}
                        </td>
                        <td>{formatDateTime(test.completedDate)}</td>
                        <td>{test.startedBy}</td>
                        <td>
                          <Button 
                            size="sm" 
                            variant="outline-primary"
                            onClick={() => handleOpenTestModal(test)}
                          >
                            <i className="bi bi-eye me-1"></i>
                            Xem chi tiết
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

      {/* Test Results Modal */}
      <Modal show={showTestModal} onHide={() => setShowTestModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-clipboard-check me-2"></i>
            Kết quả xét nghiệm - {selectedTest?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedTest && (
            <div>
              {/* Test Info */}
              <Row className="mb-4">
                <Col md={6}>
                  <h6 className="text-primary mb-3">Thông tin xét nghiệm</h6>
                  <table className="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <td><strong>Mã đơn:</strong></td>
                        <td>{selectedTest.id}</td>
                      </tr>
                      <tr>
                        <td><strong>Mã lab:</strong></td>
                        <td>{selectedTest.labCode}</td>
                      </tr>
                      <tr>
                        <td><strong>Khách hàng:</strong></td>
                        <td>{selectedTest.customerName}</td>
                      </tr>
                      <tr>
                        <td><strong>Dịch vụ:</strong></td>
                        <td>{selectedTest.service}</td>
                      </tr>
                      <tr>
                        <td><strong>Loại:</strong></td>
                        <td>{selectedTest.serviceType === 'civil' ? 'Dân sự' : 'Hành chính'}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
                <Col md={6}>
                  <h6 className="text-primary mb-3">Thông tin kỹ thuật</h6>
                  <Form>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label>Ngày phân tích</Form.Label>
                        <Form.Control 
                          type="datetime-local" 
                          value={testResults.analysisDate}
                          onChange={(e) => setTestResults({...testResults, analysisDate: e.target.value})}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Kỹ thuật viên</Form.Label>
                        <Form.Control 
                          value={testResults.technician}
                          onChange={(e) => setTestResults({...testResults, technician: e.target.value})}
                        />
                      </Col>
                      <Col md={12} className="mb-3">
                        <Form.Label>Phương pháp xét nghiệm</Form.Label>
                        <Form.Select 
                          value={testResults.method}
                          onChange={(e) => setTestResults({...testResults, method: e.target.value})}
                        >
                          <option value="STR Analysis (Short Tandem Repeat)">STR Analysis (Short Tandem Repeat)</option>
                          <option value="NIPT (Non-Invasive Prenatal Testing)">NIPT (Non-Invasive Prenatal Testing)</option>
                          <option value="SNP Analysis">SNP Analysis</option>
                          <option value="CODIS Analysis">CODIS Analysis</option>
                        </Form.Select>
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>

              {/* Participants */}
              <div className="mb-4">
                <h6 className="text-primary mb-3">Danh sách mẫu phân tích</h6>
                <div className="table-responsive">
                  <Table bordered size="sm">
                    <thead className="table-light">
                      <tr>
                        <th>Mã mẫu</th>
                        <th>Họ tên</th>
                        <th>Vai trò</th>
                        <th>Chất lượng ADN</th>
                        <th>Nồng độ (ng/μL)</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedTest.participants.map((participant, index) => (
                        <tr key={index}>
                          <td><strong>{participant.sampleId}</strong></td>
                          <td>{participant.name}</td>
                          <td>{participant.role}</td>
                          <td>
                            <Badge bg="success">Tốt</Badge>
                          </td>
                          <td>
                            <Form.Control 
                              size="sm" 
                              placeholder="50.2"
                              style={{ width: '80px', display: 'inline-block' }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>

              {/* Test Results */}
              <div className="mb-4">
                <h6 className="text-primary mb-3">Kết quả xét nghiệm</h6>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Kết luận</Form.Label>
                    <Form.Select 
                      value={testResults.conclusion}
                      onChange={(e) => setTestResults({...testResults, conclusion: e.target.value})}
                    >
                      <option value="">-- Chọn kết luận --</option>
                      <option value="POSITIVE">POSITIVE - Xác nhận quan hệ huyết thống</option>
                      <option value="NEGATIVE">NEGATIVE - Loại trừ quan hệ huyết thống</option>
                      <option value="INCONCLUSIVE">INCONCLUSIVE - Không kết luận được</option>
                    </Form.Select>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Độ tin cậy (%)</Form.Label>
                    <Form.Control 
                      value={testResults.confidence}
                      onChange={(e) => setTestResults({...testResults, confidence: e.target.value})}
                      placeholder="99.999"
                    />
                  </Col>
                  <Col md={12} className="mb-3">
                    <Form.Label>Điểm chất lượng mẫu</Form.Label>
                    <Form.Select 
                      value={testResults.qualityScore}
                      onChange={(e) => setTestResults({...testResults, qualityScore: e.target.value})}
                    >
                      <option value="excellent">Xuất sắc (A)</option>
                      <option value="good">Tốt (B)</option>
                      <option value="fair">Khá (C)</option>
                      <option value="poor">Kém (D)</option>
                    </Form.Select>
                  </Col>
                </Row>
              </div>

              {/* Additional Notes */}
              <div className="mb-4">
                <h6 className="text-primary mb-3">Ghi chú kỹ thuật</h6>
                <Form.Control 
                  as="textarea" 
                  rows={3}
                  placeholder="Ghi chú về quá trình phân tích, vấn đề kỹ thuật, nhận xét về mẫu..."
                  value={testResults.notes}
                  onChange={(e) => setTestResults({...testResults, notes: e.target.value})}
                />
              </div>

              {/* Preview Result */}
              {testResults.conclusion && (
                <div className="mb-4">
                  <h6 className="text-primary mb-3">Xem trước kết quả</h6>
                  <Alert 
                    variant={
                      testResults.conclusion === 'POSITIVE' ? 'success' : 
                      testResults.conclusion === 'NEGATIVE' ? 'danger' : 'warning'
                    }
                  >
                    <Alert.Heading>
                      Kết quả: {testResults.conclusion}
                    </Alert.Heading>
                    <p className="mb-0">
                      Độ tin cậy: {testResults.confidence}% | 
                      Phương pháp: {testResults.method} | 
                      Kỹ thuật viên: {testResults.technician}
                    </p>
                  </Alert>
                </div>
              )}
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowTestModal(false)}>
            Đóng
          </Button>
          {selectedTest?.status !== 'analysis-complete' && (
            <Button 
              variant="success" 
              onClick={handleCompleteAnalysis}
              disabled={!testResults.conclusion || !testResults.confidence}
            >
              <i className="bi bi-check-circle me-2"></i>
              Hoàn tất xét nghiệm
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default LabTesting;