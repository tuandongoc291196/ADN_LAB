import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Badge, Alert, Modal, Form, Table } from 'react-bootstrap';

const TestResults = ({ user }) => {
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');

  // Improved mock test results data - focused on displaying results
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
        { name: 'Nguyễn Văn E', role: 'Cha', idNumber: '001234567890' },
        { name: 'Nguyễn Thị F', role: 'Con', idNumber: '001234567891' }
      ],
      conclusion: 'Kết quả xét nghiệm xác nhận mối quan hệ huyết thống cha-con giữa hai đương sự với độ chính xác 99.999%.',
      labCode: 'LAB-ADN-2024-0120-001',
      technician: 'TS. Nguyễn Văn X',
      labAddress: 'Phòng Lab ADN - 123 Đường ABC, Quận XYZ, Hà Nội',
      hasLegalValue: true,
      reportNumber: 'RPT-2024-001',
      analysisMethod: 'STR Analysis với 21 locis',
      sampleType: 'Tế bào má (Buccal Swab)',
      files: [
        { name: 'Báo cáo chính thức.pdf', size: '1.8 MB', type: 'official' },
        { name: 'Kết quả chi tiết.pdf', size: '600 KB', type: 'detailed' },
        { name: 'Chứng nhận pháp lý.pdf', size: '400 KB', type: 'certificate' }
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
        { name: 'Nguyễn Thị C', role: 'Mẹ mang thai', idNumber: '001234567892' },
        { name: 'Nguyễn Văn D', role: 'Cha nghi ngờ', idNumber: '001234567893' }
      ],
      conclusion: 'Kết quả xét nghiệm ADN trước sinh xác nhận mối quan hệ huyết thống cha-con với độ chính xác 99.99%. Xét nghiệm được thực hiện an toàn, không ảnh hưởng đến thai nhi.',
      labCode: 'LAB-ADN-2024-0118-002',
      technician: 'ThS. Trần Thị Y',
      labAddress: 'Phòng Lab ADN - 123 Đường ABC, Quận XYZ, Hà Nội',
      hasLegalValue: false,
      reportNumber: 'RPT-2024-002',
      analysisMethod: 'NIPT (Non-Invasive Prenatal Testing)',
      sampleType: 'Máu tĩnh mạch mẹ',
      gestationalAge: '8 tuần',
      files: [
        { name: 'Báo cáo xét nghiệm.pdf', size: '1.5 MB', type: 'standard' },
        { name: 'Hướng dẫn chăm sóc.pdf', size: '300 KB', type: 'guide' }
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
        { name: 'Nguyễn Văn A', role: 'Cha nghi ngờ', idNumber: '001234567894' },
        { name: 'Nguyễn Văn B', role: 'Con', idNumber: '001234567895' }
      ],
      conclusion: 'Kết quả xét nghiệm loại trừ mối quan hệ huyết thống cha-con giữa hai đương sự với độ chính xác 99.999%. Nguyễn Văn A không phải là cha sinh học của Nguyễn Văn B.',
      labCode: 'LAB-ADN-2024-0110-003',
      technician: 'TS. Lê Văn Z',
      labAddress: 'Phòng Lab ADN - 123 Đường ABC, Quận XYZ, Hà Nội',
      hasLegalValue: false,
      reportNumber: 'RPT-2024-003',
      analysisMethod: 'STR Analysis với 21 locis',
      sampleType: 'Tế bào má (Buccal Swab)',
      files: [
        { name: 'Báo cáo xét nghiệm.pdf', size: '1.4 MB', type: 'standard' },
        { name: 'Giải thích kết quả.pdf', size: '200 KB', type: 'explanation' }
      ]
    },
    {
      id: 'ADN123459',
      service: 'Xét nghiệm ADN anh chị em',
      serviceType: 'civil',
      testDate: '2024-01-25',
      resultDate: '2024-01-28',
      status: 'completed',
      result: 'positive',
      confidence: '99.9%',
      participants: [
        { name: 'Nguyễn Văn G', role: 'Anh/Em trai', idNumber: '001234567896' },
        { name: 'Nguyễn Văn H', role: 'Anh/Em trai', idNumber: '001234567897' }
      ],
      conclusion: 'Kết quả xét nghiệm xác nhận mối quan hệ anh em ruột giữa hai đương sự với độ chính xác 99.9%. Hai người có chung cha mẹ sinh học.',
      labCode: 'LAB-ADN-2024-0125-004',
      technician: 'TS. Phạm Thị K',
      labAddress: 'Phòng Lab ADN - 123 Đường ABC, Quận XYZ, Hà Nội',
      hasLegalValue: false,
      reportNumber: 'RPT-2024-004',
      analysisMethod: 'STR Analysis với hệ thống mở rộng',
      sampleType: 'Tế bào má (Buccal Swab)',
      files: [
        { name: 'Báo cáo xét nghiệm.pdf', size: '1.6 MB', type: 'standard' }
      ]
    }
  ];

  // Mock in-progress tests - simplified
  const inProgressTests = [
    {
      id: 'ADN123460',
      service: 'Xét nghiệm ADN huyết thống cha-con',
      testDate: '2024-01-29',
      expectedDate: '2024-02-01',
      status: 'in-progress',
      progress: 75,
      currentStep: 'Đang phân tích mẫu tại phòng lab'
    },
    {
      id: 'ADN123461',
      service: 'Xét nghiệm ADN nguồn gốc',
      testDate: '2024-01-30',
      expectedDate: '2024-02-05',
      status: 'in-progress',
      progress: 45,
      currentStep: 'Đang chuẩn bị mẫu cho phân tích'
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
    console.log('Downloading result:', result.id, 'Type:', fileType);
    alert(`Đang tải xuống kết quả ${result.id} - ${fileType}...`);
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
              {filteredResults.map((result) => (
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

                      {/* Conclusion Summary */}
                      <Alert 
                        variant={result.result === 'positive' ? 'success' : result.result === 'negative' ? 'danger' : 'warning'}
                        className="mb-3 py-2"
                      >
                        <i className="bi bi-clipboard-check me-2"></i>
                        <strong>Kết luận:</strong> {result.conclusion.substring(0, 100)}...
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
                          <i className="bi bi-files me-1"></i>
                          Số file: {result.files.length} • Báo cáo số: {result.reportNumber}
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
                          Xem báo cáo chi tiết
                        </Button>

                        <Button 
                          variant="success"
                          onClick={() => handleDownload(result)}
                        >
                          <i className="bi bi-download me-2"></i>
                          Tải tất cả file
                        </Button>

                        {result.files.length > 1 && (
                          <div className="btn-group" role="group">
                            <Button 
                              variant="outline-success" 
                              onClick={() => handleDownload(result, 'official')}
                              className="flex-fill small"
                            >
                              Báo cáo chính
                            </Button>
                            <Button 
                              variant="outline-info"
                              onClick={() => handleDownload(result, 'detailed')}
                              className="flex-fill small"
                            >
                              Chi tiết
                            </Button>
                          </div>
                        )}

                        <Button variant="outline-primary" as={Link} to="/user/support">
                          <i className="bi bi-question-circle me-2"></i>
                          Tư vấn kết quả
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

      {/* Result Detail Modal - Invoice Style */}
      <Modal show={showResultModal} onHide={() => setShowResultModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-file-earmark-medical me-2"></i>
            Báo cáo kết quả xét nghiệm
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedResult && (
            <div className="result-report">
              {/* Header - Company Info */}
              <div className="text-center mb-4">
                <h4>TRUNG TÂM XÉT NGHIỆM ADN LAB</h4>
                <p className="text-muted">123 Đường ABC, Quận XYZ, Hà Nội</p>
                <p className="text-muted">Hotline: 1900 1234 | Email: info@adnlab.vn</p>
                <hr />
                <h5>BÁO CÁO KẾT QUẢ XÉT NGHIỆM ADN</h5>
                <p>Số báo cáo: <strong>{selectedResult.reportNumber}</strong></p>
              </div>

              {/* Customer & Test Info */}
              <Table borderless className="mb-4">
                <tbody>
                  <tr>
                    <td><strong>Mã xét nghiệm:</strong></td>
                    <td>{selectedResult.id}</td>
                    <td><strong>Dịch vụ:</strong></td>
                    <td>{selectedResult.service}</td>
                  </tr>
                  <tr>
                    <td><strong>Ngày lấy mẫu:</strong></td>
                    <td>{formatDate(selectedResult.testDate)}</td>
                    <td><strong>Ngày có kết quả:</strong></td>
                    <td>{formatDate(selectedResult.resultDate)}</td>
                  </tr>
                  <tr>
                    <td><strong>Mã phòng lab:</strong></td>
                    <td>{selectedResult.labCode}</td>
                    <td><strong>Kỹ thuật viên:</strong></td>
                    <td>{selectedResult.technician}</td>
                  </tr>
                  <tr>
                    <td><strong>Phương pháp phân tích:</strong></td>
                    <td colSpan="3">{selectedResult.analysisMethod}</td>
                  </tr>
                </tbody>
              </Table>

              <hr />

              {/* Participants Info */}
              <div className="mb-4">
                <h6 className="text-primary mb-3">Thông tin người tham gia</h6>
                <Table bordered>
                  <thead>
                    <tr>
                      <th>Họ và tên</th>
                      <th>Vai trò</th>
                      <th>CCCD/CMND</th>
                      <th>Loại mẫu</th>
                    </tr>
                  </thead>
                  <tbody>
                    {selectedResult.participants.map((participant, index) => (
                      <tr key={index}>
                        <td><strong>{participant.name}</strong></td>
                        <td>{participant.role}</td>
                        <td>{participant.idNumber}</td>
                        <td>{selectedResult.sampleType}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>

              <hr />

              {/* Test Results */}
              <div className="mb-4">
                <h6 className="text-primary mb-3">Kết quả xét nghiệm</h6>
                <Table bordered>
                  <tbody>
                    <tr>
                      <td><strong>Kết quả:</strong></td>
                      <td>
                        {getResultBadge(selectedResult.result)}
                      </td>
                    </tr>
                    <tr>
                      <td><strong>Độ chính xác:</strong></td>
                      <td><strong className="text-success">{selectedResult.confidence}</strong></td>
                    </tr>
                    <tr>
                      <td><strong>Phương pháp:</strong></td>
                      <td>{selectedResult.analysisMethod}</td>
                    </tr>
                    {selectedResult.gestationalAge && (
                      <tr>
                        <td><strong>Tuổi thai:</strong></td>
                        <td>{selectedResult.gestationalAge}</td>
                      </tr>
                    )}
                    <tr>
                      <td><strong>Giá trị pháp lý:</strong></td>
                      <td>
                        {selectedResult.hasLegalValue ? (
                          <Badge bg="success">Có giá trị pháp lý đầy đủ</Badge>
                        ) : (
                          <Badge bg="secondary">Chỉ mang tính tham khảo</Badge>
                        )}
                      </td>
                    </tr>
                  </tbody>
                </Table>
              </div>

              {/* Conclusion */}
              <Alert variant={selectedResult.result === 'positive' ? 'success' : selectedResult.result === 'negative' ? 'danger' : 'warning'}>
                <Alert.Heading>
                  <i className="bi bi-clipboard-check me-2"></i>
                  Kết luận chuyên môn:
                </Alert.Heading>
                <p className="mb-0">{selectedResult.conclusion}</p>
              </Alert>

              {/* Legal Notice */}
              {selectedResult.hasLegalValue && (
                <Alert variant="warning">
                  <i className="bi bi-shield-check me-2"></i>
                  <strong>Lưu ý:</strong> Báo cáo này có đầy đủ giá trị pháp lý và được công nhận bởi các cơ quan tòa án, 
                  cơ quan nhà nước trong các thủ tục hành chính.
                </Alert>
              )}

              {/* Available Files */}
              <div className="mb-4">
                <h6 className="text-primary mb-3">File báo cáo đính kèm</h6>
                {selectedResult.files.map((file, index) => (
                  <div key={index} className="d-flex justify-content-between align-items-center p-2 border rounded mb-2">
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

              {/* Lab Info */}
              <div className="mt-4 text-center">
                <small className="text-muted">
                  <strong>Địa chỉ phòng lab:</strong> {selectedResult.labAddress}
                  <br />
                  Báo cáo này được ký và xác nhận bởi kỹ thuật viên: <strong>{selectedResult.technician}</strong>
                  <br />
                  <em>Mọi thắc mắc xin liên hệ hotline: 1900 1234</em>
                </small>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowResultModal(false)}>
            Đóng
          </Button>
          <Button variant="info" onClick={() => handleDownload(selectedResult)}>
            <i className="bi bi-download me-2"></i>
            Tải báo cáo
          </Button>
          <Button variant="primary" onClick={() => window.print()}>
            <i className="bi bi-printer me-2"></i>
            In báo cáo
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default TestResults;