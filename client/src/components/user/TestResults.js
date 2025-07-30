import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Badge, Alert, Modal, Form } from 'react-bootstrap';
import { getTestResultByUserId, getSamplesByBookingId } from '../../services/api';

// Hàm mapping dữ liệu từ API getTestResultByUserId sang format frontend
export function mapTestResultToUserResult(testResult, participants = []) {
  // Lấy bookingId từ nhiều nguồn khác nhau
  let bookingId = testResult.bookingId;
  if (!bookingId && testResult.booking?.id) {
    bookingId = testResult.booking.id;
  }
  if (!bookingId && testResult.id) {
    bookingId = testResult.id.replace('_RESULT', '');
  }
  // Nếu vẫn không có, thử lấy từ participants
  if (!bookingId && participants.length > 0 && participants[0].bookingId) {
    bookingId = participants[0].bookingId;
  }
  
  console.log('mapTestResultToUserResult - bookingId:', bookingId, 'from testResult:', testResult.id);
  
  // Xác định serviceType dựa trên category
  let serviceType = 'civil'; // default
  
  console.log('=== DEBUG SERVICE TYPE ===');
  console.log('testResult.booking?.service:', testResult.booking?.service);
  console.log('testResult.booking?.service?.category:', testResult.booking?.service?.category);
  console.log('testResult.booking?.service?.category?.hasLegalValue:', testResult.booking?.service?.category?.hasLegalValue);
  console.log('testResult.booking?.service?.category?.name:', testResult.booking?.service?.category?.name);
  
  if (testResult.booking?.service?.category) {
    const hasLegalValue = testResult.booking.service.category.hasLegalValue;
    const catName = testResult.booking.service.category.name || '';
    
    console.log('hasLegalValue:', hasLegalValue, 'type:', typeof hasLegalValue);
    console.log('catName:', catName);
    
    // Kiểm tra hasLegalValue trước
    if (hasLegalValue === true || hasLegalValue === 'true' || hasLegalValue === 1 || hasLegalValue === '1') {
      serviceType = 'administrative';
      console.log('Set to administrative based on hasLegalValue');
    } else if (hasLegalValue === false || hasLegalValue === 'false' || hasLegalValue === 0 || hasLegalValue === '0') {
      serviceType = 'civil';
      console.log('Set to civil based on hasLegalValue');
    } else {
      // Fallback: check category name
      if (catName.toLowerCase().includes('hành chính') || catName.toLowerCase().includes('administrative')) {
        serviceType = 'administrative';
        console.log('Set to administrative based on category name');
      } else if (catName.toLowerCase().includes('dân sự') || catName.toLowerCase().includes('civil')) {
        serviceType = 'civil';
        console.log('Set to civil based on category name');
      } else {
        // Fallback: check service name
        const serviceName = testResult.booking?.service?.title || '';
        if (serviceName.toLowerCase().includes('hành chính') || serviceName.toLowerCase().includes('giấy khai sinh')) {
          serviceType = 'administrative';
          console.log('Set to administrative based on service name');
        } else {
          serviceType = 'civil';
          console.log('Set to civil as default');
        }
      }
    }
  } else {
    // Fallback: check service name (for backward compatibility)
    const serviceName = testResult.booking?.service?.title || '';
    if (serviceName.toLowerCase().includes('hành chính') || serviceName.toLowerCase().includes('giấy khai sinh')) {
      serviceType = 'administrative';
      console.log('Set to administrative based on service name (no category)');
    } else {
      serviceType = 'civil';
      console.log('Set to civil as default (no category)');
    }
  }
  
  console.log('Final serviceType:', serviceType);
  console.log('=== END DEBUG ===');

  return {
    id: testResult.id,
    bookingId: bookingId || 'N/A', // Mã booking để hiển thị trong danh sách
    service: testResult.booking?.service?.title || '',
    serviceType: serviceType,
    categoryName: testResult.booking?.service?.category?.name || '', // Thêm tên category
    appointmentDate: testResult.testDate,
    completionDate: testResult.reportDate,
    participants: participants,
    result: {
      conclusion: testResult.positive === true
        ? 'POSITIVE'
        : testResult.positive === false
          ? 'NEGATIVE'
          : 'INCONCLUSIVE',
      confidence: testResult.accuracy,
      method: testResult.testMethod,
      summary: testResult.resultNotes || (
        testResult.positive === true
          ? 'Xác nhận quan hệ huyết thống'
          : testResult.positive === false
            ? 'Loại trừ quan hệ huyết thống'
            : 'Không kết luận được'
      ),
      details: testResult.resultNotes || '',
      technician: testResult.staff?.user?.fullname || '', // Kỹ thuật viên
      doctor: testResult.manager?.user?.fullname || '',   // Bác sĩ (manager)
      hasLegalValue: testResult.booking?.service?.category?.hasLegalValue || false
    }
  }
}

const TestResults = ({ user }) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showResultModal, setShowResultModal] = useState(false);
  const [selectedResult, setSelectedResult] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Đưa fetchResults ra ngoài useEffect
  const fetchResults = async () => {
    setLoading(true);
    setError(null);
    try {
      const apiResults = await getTestResultByUserId(user.id);
      console.log('API getTestResultByUserId:', apiResults);
      const resultsWithParticipants = await Promise.all(
        apiResults.map(async (testResult) => {
          console.log('Full testResult data:', testResult);
          
          // Thử nhiều cách để lấy bookingId
          const bookingId = testResult.bookingId || 
                           testResult.booking?.id || 
                           testResult.bookingId || 
                           testResult.id?.replace('_RESULT', '') || // Thử từ ID
                           testResult.bookingId;
          
          console.log('TestResult:', testResult.id, 'BookingId:', bookingId);
          
          let participants = [];
          if (bookingId) {
            try {
              console.log('Calling getSamplesByBookingId for bookingId:', bookingId);
              const sampleData = await getSamplesByBookingId(bookingId);
              console.log('API getSamplesByBookingId:', bookingId, sampleData);
              
              // Xử lý dữ liệu samples từ API
              let samples = [];
              if (Array.isArray(sampleData)) {
                samples = sampleData;
              } else if (sampleData && Array.isArray(sampleData.samples)) {
                samples = sampleData.samples;
              } else if (sampleData && sampleData.data && Array.isArray(sampleData.data)) {
                samples = sampleData.data;
              }
              
              console.log('Processed samples array:', samples);
              
                             // Map samples thành participants với format đúng
               participants = samples.map(sample => ({
                 name: sample.participant?.name || sample.name || sample.fullname || 'Không rõ tên',
                 role: sample.role || sample.participant?.role || sample.relationship || 'Không rõ vai trò',
                 relationship: sample.participant?.relationship || sample.relationship || sample.role || 'Không rõ mối quan hệ',
                 sampleType: sample.sampleType || sample.collectionType || 'Máu', // Thử lấy từ sampleType hoặc collectionType
                 sampleQuality: sample.sampleQuality || 'good',
                 sampleConcentration: sample.sampleConcentration || '',
                 bookingId: sample.bookingId || sample.booking?.id || '' // Thêm bookingId từ sample
               }));
              
              console.log('Mapped participants:', participants);
            } catch (e) {
              console.error('Error fetching samples for bookingId:', bookingId, e);
              console.error('Error details:', e.message, e.stack);
              participants = [];
            }
          } else {
            console.log('No bookingId found for testResult:', testResult.id);
            // Thử lấy participants từ testResult nếu có
            if (testResult.participants_on_booking) {
              participants = testResult.participants_on_booking.map(p => ({
                name: p.name || 'Không rõ tên',
                relationship: p.relationship || 'Không rõ mối quan hệ',
                sampleType: 'Máu',
                sampleQuality: 'good',
                sampleConcentration: ''
              }));
              console.log('Using participants from testResult:', participants);
            }
          }
          return mapTestResultToUserResult(testResult, participants);
        })
      );
      setResults(resultsWithParticipants);
    } catch (err) {
      console.error('Error fetching results:', err);
      setError('Không thể tải kết quả xét nghiệm.');
      setResults([]);
    }
    setLoading(false);
  };

  useEffect(() => {
    if (user?.id) fetchResults();
  }, [user]);

  const getResultBadge = (conclusion) => {
    switch (conclusion) {
      case 'POSITIVE':
         return <Badge bg="success" className="fs-6">DƯƠNG TÍNH</Badge>;
      case 'NEGATIVE':
         return <Badge bg="danger" className="fs-6">ÂM TÍNH</Badge>;
      case 'INCONCLUSIVE':
        return <Badge bg="warning" className="fs-6">KHÔNG KẾT LUẬN</Badge>;
      default:
        return <Badge bg="secondary" className="fs-6">CHƯA XÁC ĐỊNH</Badge>;
    }
  };

  const getServiceTypeBadge = (serviceType, categoryName) => {
    // Sử dụng tên category thực tế nếu có
    if (categoryName) {
      return serviceType === 'administrative'
        ? <Badge bg="warning" text="dark" style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: 500 }}>{categoryName}</Badge>
        : <Badge bg="success" style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: 500 }}>{categoryName}</Badge>;
    }
    
    // Fallback nếu không có category name
    return serviceType === 'administrative'
      ? <Badge bg="warning" text="dark" style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: 500 }}>ADN Hành Chính</Badge>
      : <Badge bg="success" style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: 500 }}>ADN Dân Sự</Badge>;
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
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-3">Đang tải kết quả xét nghiệm...</p>
            </div>
          ) : error ? (
            <div className="text-center py-5 text-danger">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <p>{error}</p>
              <Button variant="outline-danger" onClick={() => fetchResults()}>
                Thử lại
              </Button>
            </div>
          ) : filteredResults.length > 0 ? (
            <div className="list-group list-group-flush">
               {filteredResults.map((appointment) => {
                 console.log('Rendering appointment:', appointment.id, 'bookingId:', appointment.bookingId);
                 return (
                <div key={appointment.id} className="list-group-item p-4">
                  <Row>
                    <Col lg={8}>
                      {/* Result Header */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                                                             <h5 className="mb-2 d-flex align-items-center" style={{ gap: 8 }}>
                                 {getServiceTypeBadge(appointment.serviceType, appointment.categoryName)}
                                 <span style={{ fontWeight: 500, fontSize: 18 }}>{appointment.service}</span>
                               </h5>
                          <div className="d-flex align-items-center gap-3 text-muted mb-2">
                             <span className="text-muted small">
                              <i className="bi bi-hash me-1"></i>
                               {appointment.bookingId || 'N/A'}
                            </span>
                             <span className="text-muted small">
                              <i className="bi bi-calendar me-1"></i>
                              Xét nghiệm: {formatDate(appointment.appointmentDate)}
                            </span>
                             <span className="text-muted small">
                              <i className="bi bi-check-circle me-1"></i>
                              Có kết quả: {formatDate(appointment.completionDate)}
                            </span>
                          </div>
                        </div>
                        <div className="text-end">
                             <Badge bg="success" className="fs-6">HOÀN THÀNH</Badge>
                        </div>
                      </div>

                                                                     {/* Personnel Info */}
                      <div className="mb-3">
                           <strong className="text-muted small" style={{ textAlign: 'left', display: 'block' }}>Thực hiện xét nghiệm:</strong>
                           <div className="mt-1">
                             <table className="table table-bordered table-sm mt-2" style={{ maxWidth: 600 }}>
                               <thead>
                                 <tr className="text-muted small">
                                   <th>Vai trò</th>
                                   <th>Họ và tên</th>
                                 </tr>
                               </thead>
                               <tbody>
                                 <tr className="text-muted small">
                                   <td style={{ fontWeight: 500 }}>Kỹ thuật viên</td>
                                   <td>{appointment.result.technician}</td>
                                 </tr>
                                 <tr className="text-muted small">
                                   <td style={{ fontWeight: 500 }}>Bác sĩ</td>
                                   <td>{appointment.result.doctor}</td>
                                 </tr>
                               </tbody>
                             </table>
                                </div>
                      </div>

                      {/* Result Summary */}
                        <Alert variant="info" className="mb-3 py-2">
                          <i className="bi bi-info-circle me-2"></i>
                          <strong>Thông báo:</strong> Kết quả xét nghiệm đã sẵn sàng. Vui lòng xem chi tiết để biết thêm thông tin.
                      </Alert>
                    </Col>

                    {/* Actions */}
                    <Col lg={4} className="mt-3 mt-lg-0">
                      <div className="d-grid gap-2">
                        <Button
                          variant="primary"
                          onClick={() => handleViewResult(appointment)}
                        >
                          <i className="bi bi-eye me-2"></i>
                            Xem kết quả
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
               );
               })}
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
             Kết quả xét nghiệm chi tiết - {selectedResult?.bookingId}
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
                                  <p className="mb-0">Mã đặt lịch: <strong>{selectedResult.bookingId}</strong></p>
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
                         <td><strong>Loại dịch vụ:</strong></td>
                         <td>{selectedResult.categoryName || (selectedResult.serviceType === 'administrative' ? 'ADN Hành Chính' : 'ADN Dân Sự')}</td>
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
                         <td><strong>Kỹ thuật viên:</strong></td>
                         <td>{selectedResult.result.technician}</td>
                      </tr>
                      <tr>
                        <td><strong>Bác sĩ:</strong></td>
                        <td>{selectedResult.result.doctor}</td>
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
               {selectedResult.participants.length > 0 && (
              <div className="mb-4">
                <h6 className="text-primary mb-3">Thông tin người tham gia</h6>
                <div className="table-responsive">
                  <table className="table table-bordered">
                    <thead className="table-light">
                      <tr>
                        <th>Họ và tên</th>
                        <th>Mối quan hệ</th>
                        <th>Loại mẫu</th>
                            <th>Nồng độ</th>
                            <th>Chất lượng ADN</th>
                      </tr>
                    </thead>
                    <tbody>
                      {selectedResult.participants.map((participant, index) => (
                        <tr key={index}>
                          <td><strong>{participant.name}</strong></td>
                          <td>{participant.relationship}</td>
                              <td>{participant.sampleType}</td>
                              <td>{participant.sampleConcentration || 'N/A'}</td>
                                                             <td>
                                 {participant.sampleQuality === 'excellent' ? (
                                   'Xuất sắc'
                                 ) : participant.sampleQuality === 'good' ? (
                                   'Tốt'
                                 ) : participant.sampleQuality === 'fair' ? (
                                   'Khá'
                                 ) : participant.sampleQuality === 'poor' ? (
                                   'Kém'
                                 ) : (
                                   'Không xác định'
                                 )}
                               </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
               )}

                             {/* Main Result */}
               <div className="mb-4 p-4 border rounded bg-light">
                 <h5 className="text-center mb-3 text-primary fw-bold">
                   <i className="bi bi-clipboard-check me-2"></i>
                   KẾT QUẢ XÉT NGHIỆM
                 </h5>

                 <div className="text-center mb-4">
                   {getResultBadge(selectedResult.result.conclusion)}
                   <div className="h4 text-primary mt-2 fw-bold">
                     Độ chính xác: {selectedResult.result.confidence}%
                   </div>
                 </div>

                 <Alert
                   variant={
                     selectedResult.result.conclusion === 'POSITIVE' ? 'success' :
                       selectedResult.result.conclusion === 'NEGATIVE' ? 'danger' : 'warning'
                   }
                   className="text-center fw-bold"
                 >
                   <Alert.Heading className="fw-bold">Kết luận:</Alert.Heading>
                   <p className="mb-0 h6 fw-bold">{selectedResult.result.summary}</p>
                 </Alert>

                 
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
      <style>{`
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

// Ví dụ sử dụng:
// const apiResults = await getTestResultByUserId(userId);
// const mappedResults = apiResults.map(mapTestResultToUserResult);
// <TestResults user={user} results={mappedResults} />

export default TestResults;