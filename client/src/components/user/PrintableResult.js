// ========================================
// PHẦN IMPORT THƯ VIỆN
// ========================================
// Thư viện React cốt lõi cho chức năng component
import React, { useState, useEffect } from 'react';
// React Router để điều hướng và lấy tham số từ URL
import { useParams, useNavigate } from 'react-router-dom';
// Các component Bootstrap cho giao diện
import { Container, Row, Col, Card, Button, Badge, Alert, Table } from 'react-bootstrap';
// Các hàm API service để lấy dữ liệu kết quả xét nghiệm
import { getTestResultByUserId, getSamplesByBookingId, getBookingById } from '../../services/api';
// Import hàm mapping từ TestResults.js để đảm bảo tính nhất quán
import { mapTestResultToUserResult } from './TestResults';

// ========================================
// LÝ DO GIỮ LẠI PrintableResult.js
// ========================================
/**
 * TẠI SAO KHÔNG XÓA PrintableResult.js:
 * 
 * 1. CHỨC NĂNG KHÁC BIỆT:
 *    - TestResults.js: Hiển thị danh sách kết quả và modal chi tiết
 *    - PrintableResult.js: Hiển thị báo cáo in chuyên nghiệp với layout tối ưu
 * 
 * 2. LAYOUT CHUYÊN NGHIỆP:
 *    - Header công ty với thông tin đầy đủ
 *    - Footer với chữ ký kỹ thuật viên và bác sĩ
 *    - CSS @media print tối ưu cho in ấn
 *    - Thông tin pháp lý và lưu ý quan trọng
 * 
 * 3. TRẢI NGHIỆM NGƯỜI DÙNG:
 *    - Cung cấp 2 tùy chọn in: "In nhanh" (window.print) và "Báo cáo chuyên nghiệp"
 *    - URL riêng có thể bookmark và chia sẻ
 *    - Layout đầy đủ thông tin hơn so với modal
 * 
 * 4. TÍNH NHẤT QUÁN:
 *    - Sử dụng cùng API và logic xử lý dữ liệu
 *    - Import hàm mapping từ TestResults.js để đảm bảo đồng bộ
 *    - Cùng format dữ liệu và hiển thị
 */

// ========================================
// COMPONENT CHÍNH: PrintableResult
// ========================================
/**
 * Component hiển thị trang in kết quả xét nghiệm chi tiết
 * 
 * LUỒNG HOẠT ĐỘNG CHÍNH:
 * 1. Component mount → useEffect chạy → gọi fetchResultData()
 * 2. Lấy resultId từ URL params
 * 3. Gọi API để lấy dữ liệu kết quả chi tiết
 * 4. Mapping dữ liệu → hiển thị báo cáo in
 * 5. User tương tác → in ấn hoặc tải PDF
 * 
 * Props: 
 * - user: Thông tin user hiện tại
 */
const PrintableResult = ({ user }) => {
  // ========================================
  // PHẦN LẤY THAM SỐ VÀ QUẢN LÝ STATE
  // ========================================
  
  // Lấy tham số từ URL
  const { resultId } = useParams(); // resultId từ URL: /user/print-result/:resultId
  const navigate = useNavigate(); // Để điều hướng
  
  // State Dữ liệu - Lưu trữ dữ liệu kết quả xét nghiệm
  const [result, setResult] = useState(null); // Dữ liệu kết quả xét nghiệm chi tiết
  
  // State Giao diện - Điều khiển trạng thái loading và lỗi
  const [loading, setLoading] = useState(true); // Hiển thị spinner khi đang tải dữ liệu
  const [error, setError] = useState(null); // Lưu trữ thông báo lỗi nếu API call thất bại

  // ========================================
  // PHẦN LẤY DỮ LIỆU
  // ========================================
  
  /**
   * Hàm lấy dữ liệu kết quả xét nghiệm chi tiết từ API
   * 
   * LUỒNG LẤY DỮ LIỆU:
   * 1. Lấy resultId từ URL params
   * 2. Gọi API để lấy tất cả kết quả của user
   * 3. Tìm kết quả có id trùng với resultId
   * 4. Nếu tìm thấy → lấy thông tin chi tiết (booking, participants)
   * 5. Mapping dữ liệu → lưu vào state result
   * 
   * LÝ DO CÁCH TIẾP CẬN NÀY:
   * - API getTestResultByUserId trả về tất cả kết quả của user
   * - Cần tìm kết quả cụ thể dựa trên resultId
   * - Sau đó lấy thông tin chi tiết như trong TestResults.js
   */
  const fetchResultData = async () => {
    try {
      // BƯỚC 1: Khởi tạo trạng thái loading và xóa lỗi trước đó
      setLoading(true);
      setError(null);

      // BƯỚC 2: Gọi API để lấy tất cả kết quả xét nghiệm
      // Lấy userId từ props user hoặc localStorage
      const userId = user?.id || user?.user_id || user?.uid ||
        JSON.parse(localStorage.getItem('userData'))?.user_id ||
        localStorage.getItem('user_id');

      if (!userId) {
        throw new Error('Không tìm thấy thông tin người dùng. Vui lòng đăng nhập lại.');
      }

      const apiResults = await getTestResultByUserId(userId);

      // BƯỚC 3: Tìm kết quả có id trùng với resultId
      const targetResult = apiResults.find(testResult => testResult.id === resultId);
      
      if (!targetResult) {
        throw new Error('Không tìm thấy kết quả xét nghiệm với ID: ' + resultId);
      }

      // BƯỚC 4: Lấy thông tin chi tiết cho kết quả này
      const bookingId = targetResult.bookingId || targetResult.booking?.id || targetResult.id?.replace('_RESULT', '');

      let participants = [];
      let bookingDetails = null;

              if (bookingId) {
          try {
            // BƯỚC 4.1: Gọi API getBookingById để lấy thông tin chi tiết booking
            bookingDetails = await getBookingById(bookingId);

            // BƯỚC 4.2: Gọi API getSamplesByBookingId để lấy participants
            const sampleData = await getSamplesByBookingId(bookingId);

          // BƯỚC 4.3: Xử lý dữ liệu samples
          let samples = [];
          if (Array.isArray(sampleData)) {
            // Format 1: API trả về trực tiếp array
            samples = sampleData;
          } else if (sampleData && Array.isArray(sampleData.samples)) {
            // Format 2: API trả về object có property samples
            samples = sampleData.samples;
          } else if (sampleData && sampleData.data && Array.isArray(sampleData.data)) {
            // Format 3: API trả về object có property data chứa array
            samples = sampleData.data;
          }

          // BƯỚC 4.4: Mapping samples thành participants
          participants = samples.map(sample => ({
            name: sample.participant?.name || sample.name || sample.fullname || 'Không rõ tên',
            role: sample.role || sample.participant?.role || sample.relationship || 'Không rõ vai trò',
            relationship: sample.participant?.relationship || sample.relationship || sample.role || 'Không rõ mối quan hệ',
            sampleType: sample.sampleType || sample.collectionType || 'Máu',
            sampleQuality: sample.sampleQuality || 'good',
            sampleConcentration: sample.sampleConcentration || '',
            bookingId: sample.bookingId || sample.booking?.id || ''
          }));

                    } catch (e) {
            // Xử lý lỗi khi không thể lấy dữ liệu chi tiết
            participants = [];
            bookingDetails = null;
          }
        }

      // BƯỚC 5: Mapping dữ liệu và lưu vào state
      const mappedResult = mapTestResultToUserResult(targetResult, participants, bookingDetails);
      setResult(mappedResult);
      
    } catch (err) {
      // Xử lý lỗi chung khi không thể lấy dữ liệu
      setError(err.message || 'Không thể tải kết quả xét nghiệm');
    } finally {
      // BƯỚC 6: Luôn dừng loading bất kể thành công hay thất bại
      setLoading(false);
    }
  };

  // ========================================
  // EFFECT LẤY DỮ LIỆU
  // ========================================
  
  /**
   * useEffect để lấy dữ liệu khi component mount hoặc resultId thay đổi
   * 
   * LUỒNG HOẠT ĐỘNG:
   * 1. Component mount → useEffect chạy
   * 2. Kiểm tra resultId có tồn tại không
   * 3. Nếu có → gọi fetchResultData() để lấy dữ liệu
   * 4. Nếu resultId thay đổi → useEffect chạy lại → lấy dữ liệu mới
   */
  useEffect(() => {
    if (resultId) {
      fetchResultData();
    } else {
      setError('Không có ID kết quả xét nghiệm');
      setLoading(false);
    }
  }, [resultId]);

  // ========================================
  // HÀM TIỆN ÍCH
  // ========================================
  
  /**
   * Tạo badge cho loại dịch vụ (hành chính/dân sự)
   * 
   * LUỒNG HOẠT ĐỘNG:
   * 1. Nhận serviceType và categoryName từ dữ liệu
   * 2. Ưu tiên sử dụng categoryName nếu có (tên thực tế)
   * 3. Fallback về tên mặc định nếu không có categoryName
   * 4. Trả về Badge với màu sắc phù hợp (warning cho hành chính, success cho dân sự)
   * 
   * @param {string} serviceType - Loại dịch vụ
   * @param {string} categoryName - Tên category
   * @returns {JSX.Element} Badge component với màu sắc và text phù hợp
   */
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

  /**
   * Tạo badge cho kết quả xét nghiệm (dương tính, âm tính, không kết luận)
   * 
   * LUỒNG HOẠT ĐỘNG:
   * 1. Nhận conclusion từ dữ liệu kết quả
   * 2. Map conclusion thành badge với màu sắc và text phù hợp
   * 3. Trả về JSX Badge component
   * 
   * @param {string} conclusion - Kết luận xét nghiệm
   * @returns {JSX.Element} Badge component với màu sắc và text phù hợp
   */
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

  // ========================================
  // HÀM XỬ LÝ SỰ KIỆN
  // ========================================
  
  /**
   * In kết quả xét nghiệm
   * 
   * LUỒNG HOẠT ĐỘNG:
   * 1. Gọi window.print() để mở dialog in của browser
   * 2. CSS @media print sẽ ẩn các phần tử không cần thiết
   * 3. Chỉ in phần nội dung báo cáo
   */
  const handlePrint = () => {
    window.print();
  };

  /**
   * Xử lý tải file PDF (chưa triển khai)
   */
  const handleDownloadPDF = () => {
    // Chức năng này sẽ được bổ sung nếu cần thiết
    // Hiện tại chỉ để placeholder, không thực hiện gì
  };

  // ========================================
  // HÀM ĐỊNH DẠNG
  // ========================================
  
  /**
   * Định dạng ngày tháng theo tiếng Việt
   * 
   * LUỒNG HOẠT ĐỘNG:
   * 1. Nhận dateString từ dữ liệu
   * 2. Tạo Date object từ string
   * 3. Sử dụng toLocaleDateString với locale 'vi-VN'
   * 4. Trả về ngày đã định dạng theo tiếng Việt
   * 
   * @param {string} dateString - Chuỗi ngày cần định dạng
   * @returns {string} Ngày đã định dạng theo tiếng Việt
   */
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // ========================================
  // PHẦN HIỂN THỊ
  // ========================================
  
  /**
   * Render component UI
   * 
   * LUỒNG HIỂN THỊ:
   * 1. Loading state - Hiển thị spinner khi đang tải dữ liệu
   * 2. Error state - Hiển thị thông báo lỗi và nút quay lại
   * 3. Success state - Hiển thị báo cáo in với đầy đủ thông tin
   * 4. Print actions - Các nút in, tải PDF, quay lại (ẩn khi in)
   * 5. Printable content - Nội dung báo cáo chi tiết
   */
  
  // ========================================
  // TRẠNG THÁI LOADING
  // ========================================
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

  // ========================================
  // TRẠNG THÁI LỖI
  // ========================================
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

  // ========================================
  // TRẠNG THÁI THÀNH CÔNG - RENDER BÁO CÁO
  // ========================================
  return (
    <>
      {/* ========================================
          PHẦN ACTIONS IN ẤN - ẨN KHI IN
          ======================================== */}
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

      {/* ========================================
          PHẦN NỘI DUNG IN ẤN
          ======================================== */}
      <Container className="py-4">
        <div className="printable-content">
          {/* ========================================
              PHẦN HEADER BÁO CÁO
              ======================================== */}
          <Row className="mb-4">
            <Col md={8}>
              <div className="text-center text-md-start">
                <h2 className="fw-bold text-primary mb-2">PHÒNG THÍ NGHIỆM ADN LAB</h2>
                <p className="text-muted mb-1">123 Đường ABC, Quận XYZ, Hà Nội</p>
                <p className="text-muted mb-1">Điện thoại: 1900 1234 | Email: info@adnlab.vn</p>
                <p className="text-muted mb-0">Giấy phép: Số 123/GP-BYT</p>
              </div>
            </Col>
            <Col md={4} className="text-center text-md-end">
              <div className="border border-dark p-3 d-inline-block">
                <h6 className="mb-1">SỐ KẾT QUẢ</h6>
                <h4 className="fw-bold text-primary mb-0">{result.id}</h4>
              </div>
            </Col>
          </Row>

          {/* ========================================
              PHẦN TIÊU ĐỀ
              ======================================== */}
          <div className="text-center mb-4">
            <h1 className="fw-bold text-dark mb-2">KẾT QUẢ XÉT NGHIỆM ADN</h1>
          </div>

          {/* ========================================
              PHẦN THÔNG TIN DỊCH VỤ
              ======================================== */}
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
                  <p><strong>Dịch vụ:</strong> {result.service}</p>
                  <p><strong>Ngày xét nghiệm:</strong> {formatDate(result.appointmentDate)}</p>
                  <p><strong>Ngày có kết quả:</strong> {formatDate(result.completionDate)}</p>
                  <p><strong>Loại dịch vụ:</strong> {getServiceTypeBadge(result.serviceType, result.categoryName)}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Độ chính xác:</strong> {result.result.confidence}%</p>
                  <p><strong>Kết luận:</strong> {result.result.summary}</p>
                  <p><strong>Mã booking:</strong> {result.bookingId}</p>
                  <p><strong>Kết quả:</strong> {getResultBadge(result.result.conclusion)}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* ========================================
              PHẦN THÔNG TIN NGƯỜI THAM GIA
              ======================================== */}
          {result.participants.length > 0 && (
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
                      <th>Chất lượng ADN</th>
                      <th>Nồng độ</th>
                    </tr>
                  </thead>
                  <tbody>
                    {result.participants.map((participant, index) => (
                      <tr key={index}>
                        <td>{index + 1}</td>
                        <td className="fw-bold">{participant.name}</td>
                        <td>{participant.relationship}</td>
                        <td>
                          {/* Hiển thị loại mẫu với badge màu sắc */}
                          {participant.sampleType === 'blood' ? (
                            <Badge bg="danger">Máu</Badge>
                          ) : participant.sampleType === 'buccal-swab' ? (
                            <Badge bg="warning">Tăm bông miệng</Badge>
                          ) : participant.sampleType === 'saliva' ? (
                            <Badge bg="info">Nước bọt</Badge>
                          ) : participant.sampleType === 'hair-root' ? (
                            <Badge bg="primary">Tóc</Badge>
                          ) : participant.sampleType === 'nail' ? (
                            <Badge bg="success">Móng</Badge>
                          ) : participant.sampleType === 'other' ? (
                            <Badge bg="dark">Khác</Badge>
                          ) : (
                            <Badge bg="secondary">Không xác định</Badge>
                          )}
                        </td>
                        <td>
                          {/* Hiển thị chất lượng ADN */}
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
                        <td>{participant.sampleConcentration || 'N/A'}</td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </Card.Body>
            </Card>
          )}

          {/* ========================================
              PHẦN THÔNG TIN KỸ THUẬT
              ======================================== */}
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
                  <p><strong>Phương pháp:</strong> {result.result.method}</p>
                  <p><strong>Kỹ thuật viên:</strong> {result.result.technician}</p>
                </Col>
                <Col md={6}>
                  <p><strong>Bác sĩ:</strong> {result.result.doctor}</p>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* ========================================
              PHẦN KẾT LUẬN
              ======================================== */}
          <Card className="mb-4 border-2">
            <Card.Header className="bg-light">
              <h5 className="mb-0 fw-bold">
                <i className="bi bi-check-circle me-2"></i>
                Kết luận
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="text-center">
                <h4 className="text-primary fw-bold mb-3">{result.result.summary}</h4>
                <p className="text-muted">
                  Kết quả này có độ chính xác {result.result.confidence}% và được thực hiện theo tiêu chuẩn quốc tế.
                </p>
              </div>
            </Card.Body>
          </Card>

          {/* ========================================
              PHẦN THÔNG BÁO PHÁP LÝ
              ======================================== */}
          {result.result.hasLegalValue && (
            <Card className="mb-4 border-2">
              <Card.Header className="bg-warning">
                <h5 className="mb-0 fw-bold">
                  <i className="bi bi-shield-check me-2"></i>
                  Giá trị pháp lý
                </h5>
              </Card.Header>
              <Card.Body>
                <Alert variant="warning" className="mb-0">
                  <i className="bi bi-shield-check me-2"></i>
                  <strong>Giá trị pháp lý:</strong> Kết quả này có đầy đủ giá trị pháp lý và được
                  công nhận bởi các cơ quan tòa án, cơ quan nhà nước trong các thủ tục hành chính.
                </Alert>
              </Card.Body>
            </Card>
          )}

          {/* ========================================
              PHẦN FOOTER BÁO CÁO
              ======================================== */}
          <Row className="mt-5">
            <Col md={6} className="text-center">
              <div className="border-top border-dark pt-3">
                <p className="mb-1"><strong>Người phân tích</strong></p>
                <p className="mb-1">{result.result.technician}</p>
                <p className="text-muted small">Kỹ thuật viên</p>
                <div className="mt-3">
                  <p className="text-muted small">Chữ ký</p>
                  <div className="border-bottom border-dark" style={{width: '150px', height: '50px'}}></div>
                </div>
              </div>
            </Col>
            <Col md={6} className="text-center">
              <div className="border-top border-dark pt-3">
                <p className="mb-1"><strong>Bác sĩ phụ trách</strong></p>
                <p className="mb-1">{result.result.doctor}</p>
                <p className="text-muted small">Bác sĩ</p>
                <div className="mt-3">
                  <p className="text-muted small">Chữ ký</p>
                  <div className="border-bottom border-dark" style={{width: '150px', height: '50px'}}></div>
                </div>
              </div>
            </Col>
          </Row>

          {/* ========================================
              PHẦN LƯU Ý QUAN TRỌNG
              ======================================== */}
          <div className="mt-4 p-3 bg-light rounded">
            <h6 className="fw-bold mb-2">Lưu ý quan trọng:</h6>
            <ul className="small text-muted mb-0">
              <li>Kết quả này chỉ có giá trị khi được sử dụng đúng mục đích và trong thời gian hiệu lực</li>
              <li>Mọi thắc mắc về kết quả vui lòng liên hệ phòng thí nghiệm trong vòng 30 ngày</li>
              <li>Kết quả này được bảo mật theo quy định của pháp luật</li>
              <li>Ngày in: {new Date().toLocaleDateString('vi-VN')}</li>
            </ul>
          </div>
        </div>
      </Container>

      {/* ========================================
          PHẦN STYLE IN ẤN
          ======================================== */}
      <style>{`
        @media print {
          /* Ẩn các phần tử không cần thiết khi in */
          .d-print-none {
            display: none !important;
          }
          
          /* Điều chỉnh font size cho báo cáo in */
          .printable-content {
            margin: 0;
            padding: 20px;
            font-size: 12px;
            line-height: 1.4;
          }
          
          /* Điều chỉnh kích thước tiêu đề */
          .printable-content h1 {
            font-size: 18px;
          }
          
          .printable-content h2 {
            font-size: 16px;
          }
          
          .printable-content h4, .printable-content h5, .printable-content h6 {
            font-size: 14px;
          }
          
          /* Điều chỉnh bảng */
          .table {
            font-size: 11px;
          }
          
          /* Điều chỉnh card cho in ấn */
          .card {
            border: 1px solid #000 !important;
            break-inside: avoid;
          }
          
          /* Điều chỉnh alert và badge cho in ấn */
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

// ========================================
// PHẦN EXPORT
// ========================================
export default PrintableResult; 