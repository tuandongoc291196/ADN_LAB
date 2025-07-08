import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Badge, Alert, Modal, Form } from 'react-bootstrap';

const TestResults = ({ user, results = [] }) => {
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  const getResultBadge = (conclusion) => {
    switch (conclusion) {
      case 'POSITIVE':
        return <Badge bg="success" className="fs-6">XÁC NHẬN QUAN HỆ</Badge>;
      case 'NEGATIVE':
        return <Badge bg="danger" className="fs-6">LOẠI TRỪ QUAN HỆ</Badge>;
      case 'INCONCLUSIVE':
        return <Badge bg="warning" className="fs-6">KHÔNG KẾT LUẬN</Badge>;
      default:
        return <Badge bg="secondary" className="fs-6">CHƯA XÁC ĐỊNH</Badge>;
    }
  };

  const getServiceTypeBadge = (serviceType) => {
    return serviceType === 'administrative'
      ? <Badge bg="warning" text="dark">Có giá trị pháp lý</Badge>
      : <Badge bg="info">Dân sự</Badge>;
  };

  const handleViewResult = (appointment) => {
    setSelectedResult(appointment);
    setShowResultModal(true);
  };

  const handlePrintResult = () => {
    window.print();
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const filteredResults = results.filter(appointment =>
    appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Kết quả xét nghiệm</h2>
              <p className="text-muted mb-0">Xem và in kết quả xét nghiệm ADN của bạn</p>
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

      {/* Search */}
      <Row className="mb-4">
        <Col lg={6}>
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tên dịch vụ, mã xét nghiệm hoặc người tham gia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col lg={6} className="mt-3 mt-lg-0 text-lg-end">
          <small className="text-muted">
            <i className="bi bi-info-circle me-1"></i>
            Hiển thị {filteredResults.length} kết quả đã hoàn thành
          </small>
        </Col>
      </Row>

      {/* Results List */}
      <Card className="shadow-sm">
        <Card.Header className="bg-white border-bottom">
          <h5 className="mb-0">
            <i className="bi bi-file-earmark-check me-2 text-success"></i>
            Danh sách kết quả ({filteredResults.length})
          </h5>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredResults.length > 0 ? (
            <div className="list-group list-group-flush">
              {filteredResults.map((appointment) => (
                <div key={appointment.id} className="list-group-item p-4">
                  <Row>
                    <Col lg={8}>
                      {/* Result Header */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="mb-2">
                            {appointment.service}
                            <div className="mt-1">
                              {getServiceTypeBadge(appointment.serviceType)}
                            </div>
                          </h5>
                          <div className="d-flex align-items-center gap-3 text-muted mb-2">
                            <span>
                              <i className="bi bi-hash me-1"></i>
                              Mã: {appointment.id}
                            </span>
                            <span>
                              <i className="bi bi-calendar me-1"></i>
                              Xét nghiệm: {formatDate(appointment.appointmentDate)}
                            </span>
                            <span>
                              <i className="bi bi-check-circle me-1"></i>
                              Có kết quả: {formatDate(appointment.completionDate)}
                            </span>
                          </div>
                        </div>
                        <div className="text-end">
                          {getResultBadge(appointment.result.conclusion)}
                          <div className="text-muted small mt-1">
                            Độ chính xác: {appointment.result.confidence}
                          </div>
                        </div>
                      </div>

                      {/* Participants */}
                      <div className="mb-3">
                        <strong className="text-muted small">Người tham gia xét nghiệm:</strong>
                        <Row className="mt-2">
                          {appointment.participants.map((participant, idx) => (
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

                      {/* Result Summary */}
                      <Alert
                        variant={
                          appointment.result.conclusion === 'POSITIVE' ? 'success' :
                            appointment.result.conclusion === 'NEGATIVE' ? 'danger' : 'warning'
                        }
                        className="mb-3 py-2"
                      >
                        <i className="bi bi-clipboard-check me-2"></i>
                        <strong>Kết luận:</strong> {appointment.result.summary}
                      </Alert>

                      {/* Technical Info */}
                      <div className="text-muted small">
                        <Row>
                          <Col sm={6}>
                            <i className="bi bi-flask me-1"></i>
                            Mã lab: {appointment.result.labCode}
                          </Col>
                          <Col sm={6}>
                            <i className="bi bi-person-badge me-1"></i>
                            KTV: {appointment.result.technician}
                          </Col>
                        </Row>
                      </div>
                    </Col>

                    {/* Actions */}
                    <Col lg={4} className="mt-3 mt-lg-0">
                      <div className="d-grid gap-2">
                        <Button
                          variant="primary"
                          onClick={() => handleViewResult(appointment)}
                        >
                          <i className="bi bi-eye me-2"></i>
                          Xem kết quả chi tiết
                        </Button>

                        <Button
                          variant="success"
                          onClick={() => {
                            setSelectedResult(appointment);
                            setTimeout(() => window.print(), 500);
                          }}
                        >
                          <i className="bi bi-printer me-2"></i>
                          In kết quả
                        </Button>

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
                {searchTerm ? 'Không tìm thấy kết quả nào' : 'Chưa có kết quả xét nghiệm'}
              </h5>
              <p className="text-muted">
                {searchTerm
                  ? 'Thử thay đổi từ khóa tìm kiếm'
                  : 'Kết quả sẽ hiển thị ở đây sau khi xét nghiệm hoàn tất'
                }
              </p>
              {!searchTerm && (
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
      <Modal show={showResultModal} onHide={() => setShowResultModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-file-earmark-medical me-2"></i>
            Kết quả xét nghiệm chi tiết
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedResult && (
            <div className="result-report" id="printable-result">
              {/* Header */}
              <div className="text-center mb-4 border-bottom pb-3">
                <h3>TRUNG TÂM XÉT NGHIỆM ADN LAB</h3>
                <p className="text-muted mb-1">123 Đường ABC, Quận XYZ, Hà Nội</p>
                <p className="text-muted mb-1">Hotline: 1900 1234 | Email: info@adnlab.vn</p>
                <h4 className="text-primary mt-3 mb-0">KẾT QUẢ XÉT NGHIỆM ADN</h4>
                <p className="mb-0">Mã xét nghiệm: <strong>{selectedResult.id}</strong></p>
              </div>

              {/* Basic Info */}
              <Row className="mb-4">
                <Col md={6}>
                  <h6 className="text-primary mb-3">Thông tin chung</h6>
                  <table className="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <td><strong>Dịch vụ:</strong></td>
                        <td>{selectedResult.service}</td>
                      </tr>
                      <tr>
                        <td><strong>Loại xét nghiệm:</strong></td>
                        <td>{getServiceTypeBadge(selectedResult.serviceType)}</td>
                      </tr>
                      <tr>
                        <td><strong>Ngày lấy mẫu:</strong></td>
                        <td>{formatDate(selectedResult.appointmentDate)}</td>
                      </tr>
                      <tr>
                        <td><strong>Ngày có kết quả:</strong></td>
                        <td>{formatDate(selectedResult.completionDate)}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
                <Col md={6}>
                  <h6 className="text-primary mb-3">Thông tin kỹ thuật</h6>
                  <table className="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <td><strong>Phương pháp:</strong></td>
                        <td>{selectedResult.result.method}</td>
                      </tr>
                      <tr>
                        <td><strong>Loại mẫu:</strong></td>
                        <td>{selectedResult.result.sampleType}</td>
                      </tr>
                      <tr>
                        <td><strong>Mã phòng lab:</strong></td>
                        <td>{selectedResult.result.labCode}</td>
                      </tr>
                      <tr>
                        <td><strong>Kỹ thuật viên:</strong></td>
                        <td>{selectedResult.result.technician}</td>
                      </tr>
                      {selectedResult.result.gestationalAge && (
                        <tr>
                          <td><strong>Tuổi thai:</strong></td>
                          <td>{selectedResult.result.gestationalAge}</td>
                        </tr>
                      )}
                    </tbody>
                  </table>
                </Col>
              </Row>

              {/* Participants */}
              <div className="mb-4">
                <h6 className="text-primary mb-3">Thông tin người tham gia</h6>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Họ và tên</th>
                        <th>Vai trò</th>
                        <th>Mối quan hệ</th>
                        <th>Loại mẫu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedResult.participants.map((participant, index) => (
                        <tr key={index}>
                          <td><strong>{participant.name}</strong></td>
                          <td>{participant.role}</td>
                          <td>{participant.relationship}</td>
                          <td>{selectedResult.result.sampleType}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
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
              {selectedResult.result.hasLegalValue && (
                <Alert variant="warning" className="mb-4">
                  <i className="bi bi-shield-check me-2"></i>
                  <strong>Giá trị pháp lý:</strong> Kết quả này có đầy đủ giá trị pháp lý và được
                  công nhận bởi các cơ quan tòa án, cơ quan nhà nước trong các thủ tục hành chính.
                </Alert>
              )}

              {/* Footer */}
              <div className="mt-4 pt-3 border-top text-center">
                <small className="text-muted">
                  <strong>Địa chỉ phòng lab:</strong> 123 Đường ABC, Quận XYZ, Hà Nội
                  <br />
                  Kết quả được ký và xác nhận bởi: <strong>{selectedResult.result.technician}</strong>
                  <br />
                  <em>Ngày in: {new Date().toLocaleDateString('vi-VN')}</em>
                  <br />
                  <em>Mọi thắc mắc xin liên hệ hotline: 1900 1234</em>
                </small>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer className="d-print-none">
          <Button variant="secondary" onClick={() => setShowResultModal(false)}>
            Đóng
          </Button>
          <Button variant="success" onClick={handlePrintResult}>
            <i className="bi bi-printer me-2"></i>
            In kết quả
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .d-print-none {
            display: none !important;
          }
          
          .result-report {
            font-size: 12px;
            line-height: 1.4;
          }
          
          .result-report h3 {
            font-size: 18px;
          }
          
          .result-report h4 {
            font-size: 16px;
          }
          
          .result-report h5, .result-report h6 {
            font-size: 14px;
          }
          
          .table {
            font-size: 11px;
          }
          
          .alert {
            border: 1px solid #ccc !important;
            background-color: #f8f9fa !important;
          }
          
          .badge {
            border: 1px solid #000 !important;
            background-color: #fff !important;
            color: #000 !important;
          }
        }
      `}</style>
    </>
  );
};

export default TestResults;