import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Badge, Alert } from 'react-bootstrap';

const ResultsSummary = ({ user }) => {
  // Mock data cho kết quả mới nhất
  const recentResults = [
    {
      id: 'ADN123458',
      service: 'Xét nghiệm ADN khai sinh',
      completionDate: '2024-01-23',
      result: 'POSITIVE',
      confidence: '99.999%',
      hasLegalValue: true,
      isNew: true
    },
    {
      id: 'ADN123457',
      service: 'Xét nghiệm ADN thai nhi',
      completionDate: '2024-01-21',
      result: 'POSITIVE',
      confidence: '99.99%',
      hasLegalValue: false,
      isNew: false
    },
    {
      id: 'ADN123455',
      service: 'Xét nghiệm ADN huyết thống cha-con',
      completionDate: '2024-01-13',
      result: 'NEGATIVE',
      confidence: '99.999%',
      hasLegalValue: false,
      isNew: false
    }
  ];

  // Kết quả đang chờ (đã hoàn thành nhưng chưa xem)
  const pendingResults = [
    {
      id: 'ADN123462',
      service: 'Xét nghiệm ADN anh chị em',
      expectedDate: '2024-02-01',
      status: 'Đang phân tích mẫu tại phòng lab',
      progress: 85
    }
  ];

  const getResultBadge = (result) => {
    switch (result) {
      case 'POSITIVE':
        return <Badge bg="success" className="small">Xác nhận</Badge>;
      case 'NEGATIVE':
        return <Badge bg="danger" className="small">Loại trừ</Badge>;
      default:
        return <Badge bg="secondary" className="small">N/A</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const options = { month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const newResultsCount = recentResults.filter(r => r.isNew).length;

  return (
    <>
      {/* New Results Alert */}
      {newResultsCount > 0 && (
        <Alert variant="success" className="mb-4">
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <i className="bi bi-check-circle me-2"></i>
              <strong>Có {newResultsCount} kết quả mới!</strong> Vui lòng xem chi tiết.
            </div>
            <Button variant="success" size="sm" as={Link} to="/user/results">
              Xem ngay
            </Button>
          </div>
        </Alert>
      )}

      <Row>
        {/* Recent Results */}
        <Col lg={8} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-file-earmark-check me-2 text-success"></i>
                  Kết quả gần đây
                  {newResultsCount > 0 && (
                    <Badge bg="danger" className="ms-2">{newResultsCount}</Badge>
                  )}
                </h5>
                <Button variant="outline-primary" size="sm" as={Link} to="/user/results">
                  Xem tất cả
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {recentResults.length > 0 ? (
                <div className="list-group list-group-flush">
                  {recentResults.slice(0, 3).map((result) => (
                    <div key={result.id} className="list-group-item px-4 py-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-2">
                            <h6 className="mb-0 me-3">{result.service}</h6>
                            {result.isNew && (
                              <Badge bg="primary" className="me-2">Mới</Badge>
                            )}
                            {getResultBadge(result.result)}
                            {result.hasLegalValue && (
                              <Badge bg="warning" text="dark" className="ms-2 small">
                                Pháp lý
                              </Badge>
                            )}
                          </div>
                          <div className="text-muted small mb-1">
                            <i className="bi bi-calendar me-1"></i>
                            Có kết quả: {formatDate(result.completionDate)}
                            <span className="mx-2">•</span>
                            <i className="bi bi-percent me-1"></i>
                            Độ chính xác: {result.confidence}
                          </div>
                          <div className="text-muted small">
                            <i className="bi bi-hash me-1"></i>
                            Mã: {result.id}
                          </div>
                        </div>

                        <div className="ms-3">
                          <Button
                            variant={result.isNew ? "primary" : "outline-primary"}
                            size="sm"
                            as={Link}
                            to="/user/results"
                          >
                            <i className="bi bi-eye me-1"></i>
                            {result.isNew ? 'Xem mới' : 'Xem'}
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-file-earmark-x text-muted" style={{ fontSize: '3rem' }}></i>
                  <h6 className="text-muted mt-3">Chưa có kết quả nào</h6>
                  <p className="text-muted small">Kết quả sẽ hiển thị sau khi xét nghiệm hoàn tất</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Pending Results */}
        <Col lg={4}>
          <Card className="shadow-sm">
            <Card.Header className="bg-warning text-dark">
              <h6 className="mb-0">
                <i className="bi bi-clock me-2"></i>
                Đang chờ kết quả ({pendingResults.length})
              </h6>
            </Card.Header>
            <Card.Body>
              {pendingResults.length > 0 ? (
                <>
                  {pendingResults.map(pending => (
                    <div key={pending.id} className="mb-3">
                      <div className="d-flex justify-content-between align-items-start mb-2">
                        <div>
                          <h6 className="mb-1 small">{pending.service}</h6>
                          <p className="text-muted small mb-1">
                            Mã: {pending.id}
                          </p>
                        </div>
                      </div>
                      
                      <div className="mb-2">
                        <div className="d-flex justify-content-between align-items-center mb-1">
                          <small className="text-muted">{pending.status}</small>
                          <small className="fw-bold">{pending.progress}%</small>
                        </div>
                        <div className="progress" style={{ height: '6px' }}>
                          <div 
                            className="progress-bar bg-warning"
                            style={{ width: `${pending.progress}%` }}
                          ></div>
                        </div>
                      </div>
                      
                      <small className="text-success">
                        <i className="bi bi-calendar-check me-1"></i>
                        Dự kiến: {formatDate(pending.expectedDate)}
                      </small>
                    </div>
                  ))}
                  
                  <div className="d-grid mt-3">
                    <Button variant="outline-warning" size="sm" as={Link} to="/user/appointments">
                      <i className="bi bi-list-ul me-1"></i>
                      Xem tất cả lịch hẹn
                    </Button>
                  </div>
                </>
              ) : (
                <div className="text-center py-3">
                  <i className="bi bi-check-all text-muted fs-1"></i>
                  <p className="text-muted small mt-2 mb-0">
                    Không có xét nghiệm nào đang chờ kết quả
                  </p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default ResultsSummary;