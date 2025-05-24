import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Badge, Alert, Modal, Form, Table } from 'react-bootstrap';

const TestResults = ({ user }) => {
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Mock test results data
  const testResults = [
    {
      id: 'ADN123458',
      service: 'Xét nghiệm ADN khai sinh',
      serviceType: 'administrative',
      testDate: '2024-01-20',
      resultDate: '2024-01-23',
      status: 'completed',
      result: 'positive',
      confidence: '99.999%',
      participants: [
        { name: 'Nguyễn Văn E', role: 'Cha', relationship: 'Biological Father' },
        { name: 'Nguyễn Thị F', role: 'Con', relationship: 'Child' }
      ],
      conclusion: 'Kết quả xét nghiệm xác nhận mối quan hệ huyết thống cha-con giữa hai đương sự.',
      labCode: 'LAB-ADN-2024-0120-001',
      technician: 'TS. Nguyễn Văn X',
      hasLegalValue: true,
      downloadCount: 3,
      fileSize: '2.4 MB',
      files: [
        { name: 'Báo cáo chính thức.pdf', size: '1.8 MB', type: 'official' },
        { name: 'Kết quả chi tiết.pdf', size: '600 KB', type: 'detailed' }
      ]
    },
    {
      id: 'ADN123457',
      service: 'Xét nghiệm ADN thai nhi',
      serviceType: 'civil',
      testDate: '2024-01-18',
      resultDate: '2024-01-21',
      status: 'completed',
      result: 'positive',
      confidence: '99.99%',
      participants: [
        { name: 'Nguyễn Thị C', role: 'Mẹ mang thai', relationship: 'Mother' },
        { name: 'Nguyễn Văn D', role: 'Cha nghi ngờ', relationship: 'Alleged Father' }
      ],
      conclusion: 'Kết quả xét nghiệm xác nhận mối quan hệ huyết thống cha-con.',
      labCode: 'LAB-ADN-2024-0118-002',
      technician: 'ThS. Trần Thị Y',
      hasLegalValue: false,
      downloadCount: 1,
      fileSize: '1.9 MB',
      files: [
        { name: 'Báo cáo xét nghiệm.pdf', size: '1.9 MB', type: 'standard' }
      ]
    },
    {
      id: 'ADN123455',
      service: 'Xét nghiệm ADN huyết thống cha-con',
      serviceType: 'civil',
      testDate: '2024-01-10',
      resultDate: '2024-01-13',
      status: 'completed',
      result: 'negative',
      confidence: '99.999%',
      participants: [
        { name: 'Nguyễn Văn A', role: 'Cha nghi ngờ', relationship: 'Alleged Father' },
        { name: 'Nguyễn Văn B', role: 'Con', relationship: 'Child' }
      ],
      conclusion: 'Kết quả xét nghiệm loại trừ mối quan hệ huyết thống cha-con giữa hai đương sự.',
      labCode: 'LAB-ADN-2024-0110-003',
      technician: 'TS. Lê Văn Z',
      hasLegalValue: false,
      downloadCount: 5,
      fileSize: '1.7 MB',
      files: [
        { name: 'Báo cáo xét nghiệm.pdf', size: '1.7 MB', type: 'standard' }
      ]
    }
  ];

  // Mock in-progress tests
  const inProgressTests = [
    {
      id: 'ADN123456',
      service: 'Xét nghiệm ADN huyết thống cha-con',
      testDate: '2024-01-22',
      expectedDate: '2024-01-25',
      status: 'in-progress',
      progress: 75,
      currentStep: 'Đang phân tích mẫu tại phòng lab'
    }
  ];

  const getResultBadge = (result) => {
    switch (result) {
      case 'positive':
        return <Badge bg="success">Xác nhận quan hệ</Badge>;
      case 'negative':
        return <Badge bg="danger">Loại trừ quan hệ</Badge>;
      case 'inconclusive':
        return <Badge bg="warning">Không kết luận</Badge>;
      default:
        return <Badge bg="secondary">Chưa có kết quả</Badge>;
    }
  };

  const handleViewResult = (result) => {
    setSelectedResult(result);
    setShowResultModal(true);
  };

  const handleDownload = (result, fileType = 'all') => {
    // TODO: Implement download functionality
    console.log('Downloading result:', result.id, 'Type:', fileType);
    // Simulate download
    alert(`Đang tải xuống kết quả ${result.id}...`);
  };

  const filteredResults = testResults.filter(result => {
    const matchesSearch = result.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         result.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesFilter = filterStatus === 'all' || result.result === filterStatus;
    
    return matchesSearch && matchesFilter;
  });

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Kết quả xét nghiệm</h2>
              <p className="text-muted mb-0">Xem và tải xuống kết quả xét nghiệm ADN</p>
            </div>
            <div className="d-none d-md-block">
              <Button variant="outline-primary" as={Link} to="/user/appointments">
                <i className="bi bi-calendar-event me-2"></i>
                Xem lịch hẹn
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Row className="mb-4">
        <Col lg={6}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tên dịch vụ, mã xét nghiệm hoặc người tham gia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col lg={6} className="mt-3 mt-lg-0">
          <Row>
            <Col>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả kết quả</option>
                <option value="positive">Xác nhận quan hệ</option>
                <option value="negative">Loại trừ quan hệ</option>
                <option value="inconclusive">Không kết luận</option>
              </Form.Select>
            </Col>
            <Col xs="auto">
              <Button variant="outline-secondary">
                <i className="bi bi-download me-1"></i>
                Tải tất cả
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* In-Progress Tests */}
      {inProgressTests.length > 0 && (
        <Card className="shadow-sm mb-4">
          <Card.Header className="bg-warning text-dark">
            <h5 className="mb-0">
              <i className="bi bi-clock me-2"></i>
              Đang chờ kết quả ({inProgressTests.length})
            </h5>
          </Card.Header>
          <Card.Body>
            {inProgressTests.map(test => (
              <div key={test.id} className="d-flex justify-content-between align-items-center p-3 bg-light rounded mb-2">
                <div>
                  <h6 className="mb-1">{test.service}</h6>
                  <p className="text-muted small mb-2">
                    Mã: {test.id} • Ngày xét nghiệm: {formatDate(test.testDate)}
                  </p>
                  <div className="mb-2">
                    <div className="d-flex justify-content-between align-items-center mb-1">
                      <small className="text-muted">{test.currentStep}</small>
                      <small className="fw-bold">{test.progress}%</small>
                    </div>
                    <div className="progress" style={{ height: '6px' }}>
                      <div 
                        className="progress-bar bg-warning"
                        style={{ width: `${test.progress}%` }}
                      ></div>
                    </div>
                  </div>
                  <small className="text-success">
                    <i className="bi bi-calendar-check me-1"></i>
                    Dự kiến có kết quả: {formatDate(test.expectedDate)}
                  </small>
                </div>
                <Button variant="outline-primary" as={Link} to={`/tracking/${test.id}`}>
                  Theo dõi
                </Button>
              </div>
            ))}
          </Card.Body>
        </Card>
      )}

      {/* Completed Results */}
      <Card className="shadow-sm">
        <Card.Header className="bg-white border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-file-earmark-check me-2 text-success"></i>
              Kết quả đã có ({filteredResults.length})
            </h5>
            <div>
              <Badge bg="primary" className="me-2">{testResults.filter(r => r.hasLegalValue).length} có giá trị pháp lý</Badge>
              <Badge bg="secondary">{testResults.filter(r => !r.hasLegalValue).length} dân sự</Badge>
            </div>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredResults.length > 0 ? (
            <div className="list-group list-group-flush">
              {filteredResults.map((result, index) => (
                <div key={result.id} className="list-group-item p-4">
                  <Row>
                    <Col lg={8}>
                      {/* Result Header */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="mb-2">
                            {result.service}
                            {result.hasLegalValue && (
                              <Badge bg="warning" text="dark" className="ms-2">Có giá trị pháp lý</Badge>
                            )}
                          </h5>
                          <div className="d-flex align-items-center gap-3 text-muted mb-2">
                            <span>
                              <i className="bi bi-hash me-1"></i>
                              {result.id}
                            </span>
                            <span>
                              <i className="bi bi-calendar me-1"></i>
                              Ngày xét nghiệm: {formatDate(result.testDate)}
                            </span>
                            <span>
                              <i className="bi bi-check-circle me-1"></i>
                              Ngày có KQ: {formatDate(result.resultDate)}
                            </span>
                          </div>
                        </div>
                        <div className="text-end">
                          {getResultBadge(result.result)}
                          <div className="text-muted small mt-1">
                            Độ chính xác: {result.confidence}
                          </div>
                        </div>
                      </div>

                      {/* Participants */}
                      <div className="mb-3">
                        <strong className="text-muted small">Người tham gia xét nghiệm:</strong>
                        <Row className="mt-2">
                          {result.participants.map((participant, idx) => (
                            <Col key={idx} sm={6} className="mb-2">
                              <div className="d-flex align-items-center p-2 bg-light rounded">
                                <i className="bi bi-person me-2 text-primary"></i>
                                <div>
                                  <div className="fw-bold small">{participant.name}</div>
                                  <div className="text-muted small">{participant.role}</div>
                                </div>
                              </div>
                            </Col>
                          ))}
                        </Row>
                      </div>

                      {/* Conclusion */}
                      <Alert 
                        variant={result.result === 'positive' ? 'success' : result.result === 'negative' ? 'danger' : 'warning'}
                        className="mb-3 py-2"
                      >
                        <i className="bi bi-clipboard-check me-2"></i>
                        <strong>Kết luận:</strong> {result.conclusion}
                      </Alert>

                      {/* Technical Info */}
                      <div className="text-muted small">
                        <Row>
                          <Col sm={6}>
                            <i className="bi bi-flask me-1"></i>
                            Mã phòng lab: {result.labCode}
                          </Col>
                          <Col sm={6}>
                            <i className="bi bi-person-badge me-1"></i>
                            Kỹ thuật viên: {result.technician}
                          </Col>
                        </Row>
                        <div className="mt-1">
                          <i className="bi bi-download me-1"></i>
                          Đã tải: {result.downloadCount} lần • Kích thước: {result.fileSize}
                        </div>
                      </div>
                    </Col>

                    {/* Actions */}
                    <Col lg={4} className="mt-3 mt-lg-0">
                      <div className="d-grid gap-2">
                        <Button 
                          variant="primary"
                          onClick={() => handleViewResult(result)}
                        >
                          <i className="bi bi-eye me-2"></i>
                          Xem chi tiết
                        </Button>

                        <Button 
                          variant="success"
                          onClick={() => handleDownload(result)}
                        >
                          <i className="bi bi-download me-2"></i>
                          Tải kết quả
                        </Button>

                        {result.files.length > 1 && (
                          <div className="btn-group" role="group">
                            <Button 
                              variant="outline-success" 
                              onClick={() => handleDownload(result, 'official')}
                              className="flex-fill"
                            >
                              Báo cáo chính thức
                            </Button>
                            <Button 
                              variant="outline-info"
                              onClick={() => handleDownload(result, 'detailed')}
                              className="flex-fill"
                            >
                              Báo cáo chi tiết
                            </Button>
                          </div>
                        )}

                        <Button variant="outline-primary" as={Link} to="/user/support">
                          <i className="bi bi-question-circle me-2"></i>
                          Tư vấn kết quả
                        </Button>

                        <Button variant="outline-secondary">
                          <i className="bi bi-share me-2"></i>
                          Chia sẻ kết quả
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-file-earmark-x text-muted" style={{ fontSize: '4rem' }}></i>
              <h5 className="text-muted mt-3">
                {searchTerm || filterStatus !== 'all' ? 'Không tìm thấy kết quả nào' : 'Chưa có kết quả xét nghiệm'}
              </h5>
              <p className="text-muted">
                {searchTerm || filterStatus !== 'all' 
                  ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                  : 'Kết quả sẽ hiển thị ở đây sau khi xét nghiệm hoàn tất'
                }
              </p>
              {!searchTerm && filterStatus === 'all' && (
                <Button variant="warning" as={Link} to="/appointment">
                  <i className="bi bi-plus-circle me-2"></i>
                  Đặt lịch xét nghiệm
                </Button>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Result Detail Modal */}
      <Modal show={showResultModal} onHide={() => setShowResultModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết kết quả xét nghiệm</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedResult && (
            <>
              <div className="text-center mb-4">
                <h4>{selectedResult.service}</h4>
                <p className="text-muted">Mã xét nghiệm: {selectedResult.id}</p>
                {getResultBadge(selectedResult.result)}
              </div>

              <Table striped bordered>
                <tbody>
                  <tr>
                    <td><strong>Ngày xét nghiệm</strong></td>
                    <td>{formatDate(selectedResult.testDate)}</td>
                  </tr>
                  <tr>
                    <td><strong>Ngày có kết quả</strong></td>
                    <td>{formatDate(selectedResult.resultDate)}</td>
                  </tr>
                  <tr>
                    <td><strong>Độ chính xác</strong></td>
                    <td>{selectedResult.confidence}</td>
                  </tr>
                  <tr>
                    <td><strong>Mã phòng lab</strong></td>
                    <td>{selectedResult.labCode}</td>
                  </tr>
                  <tr>
                    <td><strong>Kỹ thuật viên</strong></td>
                    <td>{selectedResult.technician}</td>
                  </tr>
                  <tr>
                    <td><strong>Giá trị pháp lý</strong></td>
                    <td>
                      {selectedResult.hasLegalValue ? (
                        <Badge bg="success">Có giá trị pháp lý</Badge>
                      ) : (
                        <Badge bg="secondary">Chỉ mang tính tham khảo</Badge>
                      )}
                    </td>
                  </tr>
                </tbody>
              </Table>

              <div className="mb-3">
                <h6>Người tham gia xét nghiệm:</h6>
                {selectedResult.participants.map((participant, idx) => (
                  <div key={idx} className="mb-2 p-2 bg-light rounded">
                    <strong>{participant.name}</strong> - {participant.role}
                  </div>
                ))}
              </div>

              <Alert variant={selectedResult.result === 'positive' ? 'success' : 'danger'}>
                <h6>Kết luận:</h6>
                <p className="mb-0">{selectedResult.conclusion}</p>
              </Alert>

              <div className="mt-3">
                <h6>Các file có thể tải:</h6>
                {selectedResult.files.map((file, idx) => (
                  <div key={idx} className="d-flex justify-content-between align-items-center p-2 border rounded mb-2">
                    <div>
                      <i className="bi bi-file-earmark-pdf text-danger me-2"></i>
                      <strong>{file.name}</strong>
                      <span className="text-muted ms-2">({file.size})</span>
                    </div>
                    <Button size="sm" variant="outline-primary">
                      <i className="bi bi-download"></i>
                    </Button>
                  </div>
                ))}
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResultModal(false)}>
            Đóng
          </Button>
          <Button variant="success" onClick={() => handleDownload(selectedResult)}>
            <i className="bi bi-download me-2"></i>
            Tải kết quả
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TestResults;