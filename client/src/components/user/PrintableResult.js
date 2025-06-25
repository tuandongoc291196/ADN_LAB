import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert, Table } from 'react-bootstrap';
import { getTestResult } from '../../services/api';

const PrintableResult = () => {
  const { resultId } = useParams();
  const navigate = useNavigate();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchResultData();
  }, [resultId]);

  const fetchResultData = async () => {
    try {
      setLoading(true);
      setError(null);

      // Mock data - trong thực tế sẽ gọi API
      const mockResult = {
        id: resultId || 'RES001',
        serviceName: 'Xét nghiệm ADN Cha - Con',
        serviceType: 'administrative',
        resultDate: new Date().toLocaleDateString('vi-VN'),
        status: 'completed',
        accuracy: '99.9999%',
        conclusion: 'Không loại trừ quan hệ cha con',
        participants: [
          {
            id: 'P001',
            name: 'Nguyễn Văn A',
            relationship: 'Cha nghi vấn',
            sampleType: 'Niêm mạc miệng',
            sampleDate: '2024-01-15'
          },
          {
            id: 'P002', 
            name: 'Nguyễn Văn B',
            relationship: 'Con',
            sampleType: 'Niêm mạc miệng',
            sampleDate: '2024-01-15'
          }
        ],
        laboratory: {
          name: 'Phòng thí nghiệm ADN LAB',
          address: '123 Đường ABC, Quận XYZ, Hà Nội',
          phone: '1900 1234',
          email: 'info@adnlab.vn',
          license: 'Số 123/GP-BYT'
        },
        analyst: {
          name: 'TS. Trần Thị C',
          position: 'Trưởng phòng xét nghiệm',
          signature: 'TS. Trần Thị C'
        },
        technicalDetails: {
          method: 'STR Analysis',
          markers: '16 loci',
          equipment: 'ABI 3500 Genetic Analyzer',
          software: 'GeneMapper ID-X v1.4'
        }
      };

      setResult(mockResult);
    } catch (err) {
      console.error('Error fetching result:', err);
      setError('Không thể tải kết quả xét nghiệm');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownloadPDF = () => {
    // TODO: Implement PDF download
    alert('Tính năng tải PDF sẽ được cập nhật sớm');
  };

  const getServiceTypeBadge = (serviceType) => {
    return serviceType === 'administrative' 
      ? <Badge bg="warning" text="dark" style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: '500' }}>ADN Hành chính</Badge>
      : <Badge bg="success" style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: '500' }}>ADN Dân sự</Badge>;
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      'completed': { bg: 'success', text: 'Hoàn thành' },
      'in-progress': { bg: 'warning', text: 'Đang xử lý' },
      'pending': { bg: 'secondary', text: 'Chờ xử lý' }
    };
    
    const config = statusConfig[status] || { bg: 'secondary', text: 'Không xác định' };
    return <Badge bg={config.bg} style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: '500' }}>{config.text}</Badge>;
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Đang tải kết quả xét nghiệm...</p>
      </div>
    );
  }

  if (error || !result) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error || 'Không tìm thấy kết quả xét nghiệm'}
        </Alert>
        <div className="text-center mt-4">
          <Button variant="primary" onClick={() => navigate('/user/results')}>
            <i className="bi bi-arrow-left me-2"></i>
            Quay lại danh sách kết quả
          </Button>
        </div>
      </Container>
    );
  }

  return (
    <>
      {/* Print Actions - Hidden when printing */}
      <div className="d-print-none bg-light py-3 border-bottom">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h4 className="mb-0">
                <i className="bi bi-printer me-2"></i>
                Kết quả xét nghiệm ADN
              </h4>
            </Col>
            <Col xs="auto">
              <div className="d-flex gap-2">
                <Button variant="outline-primary" onClick={handlePrint}>
                  <i className="bi bi-printer me-2"></i>
                  In kết quả
                </Button>
                <Button variant="outline-success" onClick={handleDownloadPDF}>
                  <i className="bi bi-download me-2"></i>
                  Tải PDF
                </Button>
                <Button variant="outline-secondary" onClick={() => navigate('/user/results')}>
                  <i className="bi bi-arrow-left me-2"></i>
                  Quay lại
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </div>

      {/* Printable Content */}
      <Container className="py-4">
        <div className="printable-content">
          {/* Header */}
          <Row className="mb-4">
            <Col md={8}>
              <div className="text-center text-md-start">
                <h2 className="fw-bold text-primary mb-2">PHÒNG THÍ NGHIỆM ADN LAB</h2>
                <p className="text-muted mb-1">{result.laboratory.address}</p>
                <p className="text-muted mb-1">Điện thoại: {result.laboratory.phone} | Email: {result.laboratory.email}</p>
                <p className="text-muted mb-0">Giấy phép: {result.laboratory.license}</p>
              </div>
            </Col>
            <Col md={4} className="text-center text-md-end">
              <div className="border border-dark p-3 d-inline-block">
                <h6 className="mb-1">SỐ KẾT QUẢ</h6>
                <h4 className="fw-bold text-primary mb-0">{result.id}</h4>
              </div>
            </Col>
          </Row>

          {/* Title */}
          <div className="text-center mb-4">
            <h1 className="fw-bold text-dark mb-2">KẾT QUẢ XÉT NGHIỆM ADN</h1>
            <div className="d-flex justify-content-center gap-3">
              {getServiceTypeBadge(result.serviceType)}
              {getStatusBadge(result.status)}
            </div>
          </div>

          {/* Service Information */}
          <Card className="mb-4 border-2">
            <Card.Header className="bg-light">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-info-circle me-2"></i>
                Thông tin dịch vụ
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Dịch vụ:</strong> {result.serviceName}</p>
                  <p><strong>Ngày xét nghiệm:</strong> {result.resultDate}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Độ chính xác:</strong> {result.accuracy}</p>
                  <p><strong>Kết luận:</strong> {result.conclusion}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Participants */}
          <Card className="mb-4 border-2">
            <Card.Header className="bg-light">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-people me-2"></i>
                Thông tin người tham gia
              </h5>
            </Card.Header>
            <Card.Body>
              <Table bordered responsive>
                <thead className="table-light">
                  <tr>
                    <th>STT</th>
                    <th>Họ và tên</th>
                    <th>Mối quan hệ</th>
                    <th>Loại mẫu</th>
                    <th>Ngày lấy mẫu</th>
                  </tr>
                </thead>
                <tbody>
                  {result.participants.map((participant, index) => (
                    <tr key={participant.id}>
                      <td>{index + 1}</td>
                      <td className="fw-bold">{participant.name}</td>
                      <td>{participant.relationship}</td>
                      <td>{participant.sampleType}</td>
                      <td>{participant.sampleDate}</td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </Card.Body>
          </Card>

          {/* Technical Details */}
          <Card className="mb-4 border-2">
            <Card.Header className="bg-light">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-gear me-2"></i>
                Thông tin kỹ thuật
              </h5>
            </Card.Header>
            <Card.Body>
              <Row>
                <Col md={6}>
                  <p><strong>Phương pháp:</strong> {result.technicalDetails.method}</p>
                  <p><strong>Số loci phân tích:</strong> {result.technicalDetails.markers}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Thiết bị:</strong> {result.technicalDetails.equipment}</p>
                  <p><strong>Phần mềm:</strong> {result.technicalDetails.software}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Conclusion */}
          <Card className="mb-4 border-2">
            <Card.Header className="bg-light">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-check-circle me-2"></i>
                Kết luận
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <h4 className="text-primary fw-bold mb-3">{result.conclusion}</h4>
                <p className="text-muted">
                  Kết quả này có độ chính xác {result.accuracy} và được thực hiện theo tiêu chuẩn quốc tế.
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* Footer */}
          <Row className="mt-5">
            <Col md={6} className="text-center">
              <div className="border-top border-dark pt-3">
                <p className="mb-1"><strong>Người phân tích</strong></p>
                <p className="mb-1">{result.analyst.name}</p>
                <p className="text-muted small">{result.analyst.position}</p>
                <div className="mt-3">
                  <p className="text-muted small">Chữ ký</p>
                  <div className="border-bottom border-dark" style={{width: '150px', height: '50px'}}></div>
                </div>
              </div>
            </Col>
            <Col md={6} className="text-center">
              <div className="border-top border-dark pt-3">
                <p className="mb-1"><strong>Ngày ký</strong></p>
                <p className="mb-1">{result.resultDate}</p>
                <div className="mt-3">
                  <p className="text-muted small">Dấu mộc</p>
                  <div className="border border-dark rounded-circle mx-auto" style={{width: '80px', height: '80px'}}></div>
                </div>
              </div>
            </Col>
          </Row>

          {/* Disclaimer */}
          <div className="mt-4 p-3 bg-light rounded">
            <h6 className="fw-bold mb-2">Lưu ý quan trọng:</h6>
            <ul className="small text-muted mb-0">
              <li>Kết quả này chỉ có giá trị khi được sử dụng đúng mục đích và trong thời gian hiệu lực</li>
              <li>Mọi thắc mắc về kết quả vui lòng liên hệ phòng thí nghiệm trong vòng 30 ngày</li>
              <li>Kết quả này được bảo mật theo quy định của pháp luật</li>
            </ul>
          </div>
        </div>
      </Container>

      {/* Print Styles */}
      <style jsx>{`
        @media print {
          .d-print-none {
            display: none !important;
          }
          .printable-content {
            margin: 0;
            padding: 20px;
          }
          .card {
            border: 1px solid #000 !important;
            break-inside: avoid;
          }
          .table {
            font-size: 12px;
          }
        }
      `}</style>
    </>
  );
};

export default PrintableResult; 