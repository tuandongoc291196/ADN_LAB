// ========================================
// PHẦN IMPORT THƯ VIỆN
// ========================================
// Thư viện React cốt lõi cho chức năng component
import React, { useState, useEffect } from 'react';
// React Router để điều hướng giữa các trang
import { Link, useNavigate } from 'react-router-dom';
// Các component Bootstrap cho giao diện
import { Row, Col, Card, Button, Badge, Alert, Modal, Form } from 'react-bootstrap';
// Các hàm API service để lấy dữ liệu kết quả xét nghiệm
import { getTestResultByUserId, getSamplesByBookingId, getBookingById } from '../../services/api';

// ========================================
// HÀM MAPPING DỮ LIỆU
// ========================================
/**
 * Hàm mapping dữ liệu từ API getTestResultByUserId sang format frontend
 * 
 * LUỒNG HOẠT ĐỘNG:
 * 1. Nhận dữ liệu thô từ API (testResult, participants, bookingDetails)
 * 2. Trích xuất bookingId từ nhiều nguồn khác nhau
 * 3. Xác định loại dịch vụ (hành chính/dân sự) dựa trên hasLegalValue
 * 4. Chuyển đổi kết quả xét nghiệm thành format dễ hiểu
 * 5. Trả về object đã được format hoàn chỉnh
 * 
 * @param {Object} testResult - Dữ liệu kết quả xét nghiệm từ API
 * @param {Array} participants - Danh sách người tham gia xét nghiệm
 * @param {Object} bookingDetails - Chi tiết booking (bao gồm service.category)
 * @returns {Object} Dữ liệu đã được mapping cho frontend
 */
export function mapTestResultToUserResult(testResult, participants = [], bookingDetails = null) {
  // ========================================
  // BƯỚC 1: TRÍCH XUẤT THÔNG TIN CƠ BẢN
  // ========================================
  
  // Lấy bookingId từ testResult (có thể từ nhiều nguồn khác nhau)
  // Ưu tiên: testResult.bookingId → testResult.booking.id → testResult.id (loại bỏ _RESULT)
  const bookingId = testResult.bookingId || testResult.booking?.id || testResult.id?.replace('_RESULT', '');

  // ========================================
  // BƯỚC 2: XÁC ĐỊNH LOẠI DỊCH VỤ VÀ CATEGORY
  // ========================================
  
  // Khởi tạo giá trị mặc định
  let serviceType = 'civil'; // mặc định là dân sự
  let categoryName = '';

  // LUỒNG XÁC ĐỊNH LOẠI DỊCH VỤ:
  // 1. Ưu tiên sử dụng booking details nếu có (dữ liệu đầy đủ nhất)
  // 2. Fallback: sử dụng category từ testResult nếu có
  // 3. Fallback cuối: kiểm tra tên dịch vụ (cho tương thích ngược)
  
  // BƯỚC 2.1: Kiểm tra booking details (dữ liệu đầy đủ nhất)
  if (bookingDetails?.service?.category) {
    const hasLegalValue = bookingDetails.service.category.hasLegalValue;
    const catName = bookingDetails.service.category.name || '';
    categoryName = catName;

    // Kiểm tra hasLegalValue trước (giá trị pháp lý)
    if (hasLegalValue === true || hasLegalValue === 'true' || hasLegalValue === 1 || hasLegalValue === '1') {
      serviceType = 'administrative';
    } else if (hasLegalValue === false || hasLegalValue === 'false' || hasLegalValue === 0 || hasLegalValue === '0') {
      serviceType = 'civil';
    } else {
      // Fallback: kiểm tra tên category
      if (catName.toLowerCase().includes('hành chính') || catName.toLowerCase().includes('administrative')) {
        serviceType = 'administrative';
      } else if (catName.toLowerCase().includes('dân sự') || catName.toLowerCase().includes('civil')) {
        serviceType = 'civil';
      } else {
        // Fallback: kiểm tra tên dịch vụ
        const serviceName = bookingDetails.service?.title || testResult.booking?.service?.title || '';
        if (serviceName.toLowerCase().includes('hành chính') || serviceName.toLowerCase().includes('giấy khai sinh')) {
          serviceType = 'administrative';
        } else {
          serviceType = 'civil';
        }
      }
    }
  } 
  // BƯỚC 2.2: Fallback - sử dụng category từ testResult nếu có
  else if (testResult.booking?.service?.category) {
    const hasLegalValue = testResult.booking.service.category.hasLegalValue;
    const catName = testResult.booking.service.category.name || '';
    categoryName = catName;

    // Kiểm tra hasLegalValue trước
    if (hasLegalValue === true || hasLegalValue === 'true' || hasLegalValue === 1 || hasLegalValue === '1') {
      serviceType = 'administrative';
    } else if (hasLegalValue === false || hasLegalValue === 'false' || hasLegalValue === 0 || hasLegalValue === '0') {
      serviceType = 'civil';
    } else {
      // Fallback: kiểm tra tên category
      if (catName.toLowerCase().includes('hành chính') || catName.toLowerCase().includes('administrative')) {
        serviceType = 'administrative';
      } else if (catName.toLowerCase().includes('dân sự') || catName.toLowerCase().includes('civil')) {
        serviceType = 'civil';
      } else {
        // Fallback: kiểm tra tên dịch vụ
        const serviceName = testResult.booking?.service?.title || '';
        if (serviceName.toLowerCase().includes('hành chính') || serviceName.toLowerCase().includes('giấy khai sinh')) {
          serviceType = 'administrative';
        } else {
          serviceType = 'civil';
        }
      }
    }
  } 
  // BƯỚC 2.3: Fallback cuối - kiểm tra tên dịch vụ (cho tương thích ngược)
  else {
    const serviceName = testResult.booking?.service?.title || '';
    if (serviceName.toLowerCase().includes('hành chính') || serviceName.toLowerCase().includes('giấy khai sinh')) {
      serviceType = 'administrative';
      categoryName = 'ADN HÀNH CHÍNH';
    } else {
      serviceType = 'civil';
      categoryName = 'ADN DÂN SỰ';
    }
  }

  // ========================================
  // BƯỚC 3: TRẢ VỀ DỮ LIỆU ĐÃ MAPPING
  // ========================================
  
  // Chuyển đổi dữ liệu thô thành format dễ sử dụng cho UI
  return {
    id: testResult.id,
    bookingId: bookingId || 'N/A', // Mã booking để hiển thị trong danh sách
    service: testResult.booking?.service?.title || '',
    serviceType: serviceType,
    categoryName: categoryName, // Sử dụng categoryName đã xác định
    appointmentDate: testResult.testDate,
    completionDate: testResult.reportDate,
    participants: participants,
    result: {
      // Chuyển đổi kết quả boolean thành text dễ hiểu
      conclusion: testResult.positive === true
        ? 'POSITIVE'
        : testResult.positive === false
          ? 'NEGATIVE'
          : 'INCONCLUSIVE',
      confidence: testResult.accuracy,
      method: testResult.testMethod,
      // Tạo summary dựa trên kết quả
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

// ========================================
// COMPONENT CHÍNH: TestResults
// ========================================
/**
 * Component hiển thị tất cả kết quả xét nghiệm cho người dùng đã đăng nhập
 * 
 * LUỒNG HOẠT ĐỘNG CHÍNH:
 * 1. Component mount → useEffect chạy → gọi fetchResults()
 * 2. fetchResults() gọi API chính → lấy danh sách kết quả
 * 3. Với mỗi kết quả → gọi thêm 2 API để lấy thông tin chi tiết
 * 4. Mapping dữ liệu → lưu vào state → hiển thị UI
 * 5. User tương tác → filter/search → render lại
 * 
 * Props: user - đối tượng người dùng hiện tại đã xác thực
 */
const TestResults = ({ user }) => {
  // ========================================
  // PHẦN QUẢN LÝ STATE
  // ========================================
  
  // Hook điều hướng từ React Router
  const navigate = useNavigate();
  
  // State Dữ liệu - Lưu trữ dữ liệu kết quả xét nghiệm
  const [results, setResults] = useState([]); // Danh sách kết quả xét nghiệm
  
  // State Giao diện - Điều khiển trạng thái loading và lỗi
  const [loading, setLoading] = useState(true); // Hiển thị spinner khi đang tải dữ liệu
  const [error, setError] = useState(null); // Lưu trữ thông báo lỗi nếu API call thất bại
  
  // State Modal - Điều khiển hiển thị modal chi tiết kết quả
  const [showResultModal, setShowResultModal] = useState(false); // Modal để xem chi tiết kết quả
  const [selectedResult, setSelectedResult] = useState(null); // Kết quả được chọn để xem chi tiết
  
  // State Bộ lọc - Điều khiển tìm kiếm kết quả
  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm

  // ========================================
  // PHẦN LẤY DỮ LIỆU
  // ========================================
  
  /**
   * Hàm lấy dữ liệu kết quả xét nghiệm từ API
   * 
   * LUỒNG LẤY DỮ LIỆU:
   * 1. Gọi API chính getTestResultByUserId(user.id) → lấy danh sách kết quả cơ bản
   * 2. Với mỗi kết quả → trích xuất bookingId
   * 3. Sử dụng bookingId để gọi 2 API bổ sung:
   *    - getBookingById(bookingId) → lấy chi tiết booking (bao gồm service.category)
   *    - getSamplesByBookingId(bookingId) → lấy danh sách người tham gia
   * 4. Mapping tất cả dữ liệu → lưu vào state results
   * 
   * LÝ DO GỌI NHIỀU API:
   * - API getTestResultByUserId chỉ trả về thông tin cơ bản
   * - Cần thông tin chi tiết booking để xác định loại dịch vụ (hành chính/dân sự)
   * - Cần thông tin participants để hiển thị người tham gia xét nghiệm
   */
  const fetchResults = async () => {
    // BƯỚC 1: Khởi tạo trạng thái loading và xóa lỗi trước đó
    setLoading(true);
    setError(null);
    
    try {
      // BƯỚC 2: Gọi API chính để lấy tất cả kết quả xét nghiệm của user
      const apiResults = await getTestResultByUserId(user.id);
      console.log('API getTestResultByUserId:', apiResults);

      // Hiển thị tất cả kết quả vì API không trả về thông tin booking đầy đủ
      console.log('All test results:', apiResults);

      // BƯỚC 3: Xử lý từng kết quả để lấy thông tin chi tiết
      // Sử dụng Promise.all để gọi song song nhiều API, tăng tốc độ
      const resultsWithParticipants = await Promise.all(
        apiResults.map(async (testResult) => {
          console.log('Processing testResult:', testResult.id);

          // ========================================
          // BƯỚC 3.1: TRÍCH XUẤT BOOKING ID
          // ========================================
          
          // Lấy bookingId từ testResult (có thể từ nhiều nguồn khác nhau)
          // Ưu tiên: testResult.bookingId → testResult.booking.id → testResult.id (loại bỏ _RESULT)
          const bookingId = testResult.bookingId || testResult.booking?.id || testResult.id?.replace('_RESULT', '');
          console.log('BookingId:', bookingId);

          // Khởi tạo biến cho dữ liệu người tham gia và chi tiết booking
          let participants = [];
          let bookingDetails = null;

          // ========================================
          // BƯỚC 3.2: LẤY THÔNG TIN CHI TIẾT NẾU CÓ BOOKING ID
          // ========================================
          
          if (bookingId) {
            try {
              // BƯỚC 3.2.1: Gọi API getBookingById để lấy thông tin chi tiết booking
              // API này trả về thông tin đầy đủ bao gồm service.category để xác định loại dịch vụ
              bookingDetails = await getBookingById(bookingId);

              // BƯỚC 3.2.2: Gọi API getSamplesByBookingId để lấy participants
              // API này trả về danh sách người tham gia xét nghiệm
              const sampleData = await getSamplesByBookingId(bookingId);

              // ========================================
              // BƯỚC 3.3: XỬ LÝ DỮ LIỆU SAMPLES
              // ========================================
              
              // Xử lý dữ liệu samples (có thể có nhiều format khác nhau từ API)
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

              // ========================================
              // BƯỚC 3.4: MAPPING SAMPLES THÀNH PARTICIPANTS
              // ========================================
              
              // Chuyển đổi samples thành format participants thống nhất
              // Xử lý các trường hợp dữ liệu có thể thiếu hoặc khác nhau
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
              // Không dừng toàn bộ quá trình, chỉ bỏ qua kết quả này
              participants = [];
              bookingDetails = null;
            }
          }

          // BƯỚC 3.5: Trả về kết quả đã được mapping
          // Gọi hàm mapTestResultToUserResult để chuyển đổi dữ liệu
          return mapTestResultToUserResult(testResult, participants, bookingDetails);
        })
      );
      
      // BƯỚC 4: Lưu kết quả vào state để hiển thị
      setResults(resultsWithParticipants);
    } catch (err) {
      // Xử lý lỗi chung khi không thể lấy dữ liệu
      setError('Không thể tải kết quả xét nghiệm.');
      setResults([]);
    }
    
    // BƯỚC 5: Luôn dừng loading bất kể thành công hay thất bại
    setLoading(false);
  };

  // ========================================
  // EFFECT LẤY DỮ LIỆU
  // ========================================
  
  /**
   * useEffect để lấy dữ liệu khi component mount hoặc user thay đổi
   * 
   * LUỒNG HOẠT ĐỘNG:
   * 1. Component mount → useEffect chạy
   * 2. Kiểm tra user?.id có tồn tại không
   * 3. Nếu có → gọi fetchResults() để lấy dữ liệu
   * 4. Nếu user thay đổi → useEffect chạy lại → lấy dữ liệu mới
   */
  useEffect(() => {
    if (user?.id) fetchResults();
  }, [user]);

  // ========================================
  // HÀM TIỆN ÍCH
  // ========================================
  
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

  // ========================================
  // HÀM XỬ LÝ SỰ KIỆN
  // ========================================
  
  /**
   * Mở modal xem chi tiết kết quả
   * 
   * LUỒNG HOẠT ĐỘNG:
   * 1. Nhận appointment object từ user click
   * 2. Set selectedResult = appointment
   * 3. Set showResultModal = true
   * 4. Modal hiển thị với dữ liệu chi tiết
   * 
   * @param {Object} appointment - Kết quả xét nghiệm để xem chi tiết
   */
  const handleViewResult = (appointment) => {
    setSelectedResult(appointment);
    setShowResultModal(true);
  };

  /**
   * In kết quả xét nghiệm
   * 
   * LUỒNG HOẠT ĐỘNG:
   * 1. Gọi window.print() để mở dialog in của browser
   * 2. CSS @media print sẽ ẩn các phần tử không cần thiết
   * 3. Chỉ in phần nội dung báo cáo
   */
  const handlePrintResult = () => {
    window.print();
  };

  /**
   * Hàm điều hướng đến trang in chuyên nghiệp
   * 
   * LUỒNG HOẠT ĐỘNG:
   * 1. Kiểm tra selectedResult có tồn tại không
   * 2. Đóng modal hiện tại
   * 3. Điều hướng đến trang PrintableResult với resultId
   * 4. Trang PrintableResult sẽ hiển thị báo cáo in chuyên nghiệp
   */
  const handleOpenPrintableResult = () => {
    if (selectedResult) {
      setShowResultModal(false); // Đóng modal hiện tại
      navigate(`/user/print-result/${selectedResult.id}`); // Điều hướng đến trang in chuyên nghiệp trong user dashboard
    }
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
  // PHẦN LỌC DỮ LIỆU
  // ========================================
  
  /**
   * Lọc kết quả xét nghiệm theo từ khóa tìm kiếm
   * 
   * LUỒNG HOẠT ĐỘNG:
   * 1. Nhận searchTerm từ input của user
   * 2. Filter results array theo 3 tiêu chí:
   *    - Tên dịch vụ (appointment.service)
   *    - Mã xét nghiệm (appointment.id)
   *    - Tên người tham gia (appointment.participants)
   * 3. Trả về array đã được lọc
   * 
   * LƯU Ý: Tìm kiếm không phân biệt hoa thường (toLowerCase())
   */
  const filteredResults = results.filter(appointment =>
    appointment.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    appointment.participants.some(p => p.name.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // ========================================
  // PHẦN HIỂN THỊ
  // ========================================
  
  /**
   * Render component UI
   * 
   * LUỒNG HIỂN THỊ:
   * 1. Header section - Tiêu đề và nút điều hướng
   * 2. Search section - Ô tìm kiếm và thống kê
   * 3. Results list section - Danh sách kết quả với 3 trạng thái:
   *    - Loading: Hiển thị spinner
   *    - Error: Hiển thị thông báo lỗi và nút thử lại
   *    - Success: Hiển thị danh sách kết quả hoặc trạng thái trống
   * 4. Modal section - Chi tiết kết quả có thể in
   * 5. Print styles - CSS cho việc in ấn
   */
  return (
    <>
      {/* ========================================
          PHẦN HEADER
          ======================================== */}
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

      {/* ========================================
          PHẦN TÌM KIẾM
          ======================================== */}
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

      {/* ========================================
          PHẦN DANH SÁCH KẾT QUẢ
          ======================================== */}
      <Card className="shadow-sm">
        {/* Header của card */}
        <Card.Header className="bg-white border-bottom">
          <h5 className="mb-0">
            <i className="bi bi-file-earmark-check me-2 text-success"></i>
            Danh sách kết quả ({filteredResults.length})
          </h5>
        </Card.Header>
        
        {/* Body của card */}
        <Card.Body className="p-0">
          {/* ========================================
              TRẠNG THÁI LOADING
              ======================================== */}
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="text-muted mt-3">Đang tải kết quả xét nghiệm...</p>
            </div>
          ) : 
          /* ========================================
              TRẠNG THÁI LỖI
              ======================================== */
          error ? (
            <div className="text-center py-5 text-danger">
              <i className="bi bi-exclamation-triangle-fill me-2"></i>
              <p>{error}</p>
              <Button variant="outline-danger" onClick={() => fetchResults()}>
                Thử lại
              </Button>
            </div>
          ) : 
          /* ========================================
              DANH SÁCH KẾT QUẢ
              ======================================== */
          filteredResults.length > 0 ? (
            <div className="list-group list-group-flush">
              {filteredResults.map((appointment) => {
                console.log('Rendering appointment:', appointment.id, 'bookingId:', appointment.bookingId);
                return (
                  <div key={appointment.id} className="list-group-item p-4">
                    <Row>
                      {/* ========================================
                          CỘT TRÁI - CHI TIẾT KẾT QUẢ
                          ======================================== */}
                      <Col lg={8}>
                        {/* Tiêu đề kết quả */}
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

                        {/* Thông tin nhân viên thực hiện */}
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

                        {/* Thông báo kết quả */}
                        <Alert variant="info" className="mb-3 py-2">
                          <i className="bi bi-info-circle me-2"></i>
                          <strong>Thông báo:</strong> Kết quả xét nghiệm đã sẵn sàng. Vui lòng xem chi tiết để biết thêm thông tin.
                        </Alert>
                      </Col>

                      {/* ========================================
                          CỘT PHẢI - HÀNH ĐỘNG
                          ======================================== */}
                      <Col lg={4} className="mt-3 mt-lg-0">
                        <div className="d-grid gap-2">
                          {/* Nút Xem kết quả */}
                          <Button
                            variant="primary"
                            onClick={() => handleViewResult(appointment)}
                          >
                            <i className="bi bi-eye me-2"></i>
                            Xem kết quả
                          </Button>

                          {/* Nút In kết quả */}
                          <Button
                            variant="success"
                            onClick={() => handleViewResult(appointment)}
                          >
                            <i className="bi bi-printer me-2"></i>
                            In kết quả
                          </Button>

                          {/* Nút Tư vấn kết quả */}
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
            /* ========================================
                TRẠNG THÁI TRỐNG
                ======================================== */
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

      {/* ========================================
          PHẦN MODAL CHI TIẾT KẾT QUẢ
          ======================================== */}
      
      {/* Modal Chi tiết kết quả xét nghiệm */}
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
              {/* ========================================
                  PHẦN HEADER BÁO CÁO
                  ======================================== */}
              <div className="text-center mb-4 border-bottom pb-3">
                <h3>TRUNG TÂM XÉT NGHIỆM ADN LAB</h3>
                <p className="text-muted mb-1">123 Đường ABC, Quận XYZ, Hà Nội</p>
                <p className="text-muted mb-1">Hotline: 1900 1234 | Email: info@adnlab.vn</p>
                <h4 className="text-primary mt-3 mb-0">KẾT QUẢ XÉT NGHIỆM ADN</h4>
                <p className="mb-0">Mã đặt lịch: <strong>{selectedResult.bookingId}</strong></p>
                <p className="mb-0">Mã xét nghiệm: <strong>{selectedResult.id}</strong></p>
              </div>

              {/* ========================================
                  PHẦN THÔNG TIN CƠ BẢN
                  ======================================== */}
              <Row className="mb-4">
                {/* Cột trái - Thông tin chung */}
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
                
                {/* Cột phải - Thông tin kỹ thuật */}
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

              {/* ========================================
                  PHẦN THÔNG TIN NGƯỜI THAM GIA
                  ======================================== */}
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
                            <td>{participant.sampleConcentration || 'N/A'}</td>
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
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* ========================================
                  PHẦN KẾT QUẢ CHÍNH
                  ======================================== */}
              <div className="mb-4 p-4 border rounded bg-light">
                <h5 className="text-center mb-3 text-primary fw-bold">
                  <i className="bi bi-clipboard-check me-2"></i>
                  KẾT QUẢ XÉT NGHIỆM
                </h5>

                {/* Hiển thị kết quả và độ chính xác */}
                <div className="text-center mb-4">
                  {getResultBadge(selectedResult.result.conclusion)}
                  <div className="h4 text-primary mt-2 fw-bold">
                    Độ chính xác: {selectedResult.result.confidence}%
                  </div>
                </div>

                {/* Thông báo kết luận */}
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

              {/* ========================================
                  PHẦN THÔNG BÁO PHÁP LÝ
                  ======================================== */}
              {selectedResult.result.hasLegalValue && (
                <Alert variant="warning" className="mb-4">
                  <i className="bi bi-shield-check me-2"></i>
                  <strong>Giá trị pháp lý:</strong> Kết quả này có đầy đủ giá trị pháp lý và được
                  công nhận bởi các cơ quan tòa án, cơ quan nhà nước trong các thủ tục hành chính.
                </Alert>
              )}

              {/* ========================================
                  PHẦN FOOTER BÁO CÁO
                  ======================================== */}
              <div className="mt-4 pt-3 border-top text-center">
                <small className="text-muted">
                  <strong>Địa chỉ phòng lab:</strong> 123 Đường ABC, Quận XYZ, Hà Nội
                  <br />
                  Kết quả được ký và xác nhận bởi: <strong>{selectedResult.result.doctor}</strong>
                  <br />
                  <em>Ngày in: {new Date().toLocaleDateString('vi-VN')}</em>
                  <br />
                  <em>Mọi thắc mắc xin liên hệ hotline: 1900 1234</em>
                </small>
              </div>
            </div>
          )}
        </Modal.Body>
        
        {/* Footer của modal */}
        <Modal.Footer className="d-print-none">
          <Button variant="secondary" onClick={() => setShowResultModal(false)}>
            Đóng
          </Button>
          <Button variant="outline-primary" onClick={handlePrintResult}>
            <i className="bi bi-printer me-2"></i>
            In nhanh
          </Button>
          <Button variant="success" onClick={handleOpenPrintableResult}>
            <i className="bi bi-file-earmark-text me-2"></i>
            Báo cáo chuyên nghiệp
          </Button>
        </Modal.Footer>
      </Modal>

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
          .result-report {
            font-size: 12px;
            line-height: 1.4;
          }
          
          /* Điều chỉnh kích thước tiêu đề */
          .result-report h3 {
            font-size: 18px;
          }
          
          .result-report h4 {
            font-size: 16px;
          }
          
          .result-report h5, .result-report h6 {
            font-size: 14px;
          }
          
          /* Điều chỉnh bảng */
          .table {
            font-size: 11px;
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
// PHẦN EXPORT VÀ VÍ DỤ SỬ DỤNG
// ========================================
// Ví dụ sử dụng:
// const apiResults = await getTestResultByUserId(userId);
// const mappedResults = apiResults.map(mapTestResultToUserResult);
// <TestResults user={user} results={mappedResults} />

export default TestResults;