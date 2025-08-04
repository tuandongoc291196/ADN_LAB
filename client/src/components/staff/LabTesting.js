import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Alert, Modal, Form, Table, InputGroup, Tabs, Tab } from 'react-bootstrap';
import { getBookingByStaffId, addBookingHistory } from '../../services/api';
import { useParams } from 'react-router-dom';
import Swal from 'sweetalert2';

/**
 * COMPONENT: LabTesting
 * CHỨC NĂNG: Quản lý phòng xét nghiệm ADN - thực hiện phân tích và ghi nhận kết quả
 * LUỒNG HOẠT ĐỘNG:
 * 1. Tải danh sách booking có status SAMPLE_COLLECTED, RESULT_PENDING, ANALYSIS_COMPLETE từ API
 * 2. Lọc và map booking thành test với status tương ứng
 * 3. Hiển thị danh sách test theo tabs: Cần xử lý / Hoàn thành
 * 4. Cho phép staff bắt đầu xét nghiệm và cập nhật status
 * 5. Hiển thị thống kê và thông báo kết quả
 */
const LabTesting = ({ user }) => {
  // ROUTER HOOKS
  const { bookingId } = useParams(); // Lấy bookingId từ URL nếu có

  // STATE QUẢN LÝ DỮ LIỆU
  const [tests, setTests] = useState([]); // Danh sách test
  const [filteredTests, setFilteredTests] = useState([]); // Danh sách đã lọc
  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
  const [filterStatus, setFilterStatus] = useState('all'); // Filter theo status

  // STATE QUẢN LÝ UI
  const [alert, setAlert] = useState({ show: false, message: '', type: '' }); // Alert thông báo
  const [showTestModal, setShowTestModal] = useState(false); // Hiển thị modal test
  const [selectedTest, setSelectedTest] = useState(null); // Test được chọn
  const [activeTab, setActiveTab] = useState('queue'); // Tab hiện tại

  // STATE QUẢN LÝ KẾT QUẢ TEST
  const [testResults, setTestResults] = useState({
    conclusion: '', // Kết luận
    confidence: '', // Độ tin cậy
    method: 'STR Analysis (Short Tandem Repeat)', // Phương pháp
    analysisDate: '', // Ngày phân tích
    technician: '', // Kỹ thuật viên
    labCode: '', // Mã lab
    markers: [], // Các marker
    qualityScore: '', // Điểm chất lượng
    notes: '' // Ghi chú
  });

  /**
   * EFFECT 1: Tự động chuyển tab và highlight dựa trên bookingId
   * BƯỚC 1: Kiểm tra nếu có bookingId từ URL
   * BƯỚC 2: Tìm test tương ứng và xác định tab phù hợp
   * BƯỚC 3: Scroll và highlight row tương ứng
   */
  useEffect(() => {
    if (bookingId && tests.length > 0) {
      const targetTest = tests.find(t => t.id === bookingId);
      if (targetTest) {
        // Nếu status là 'result-pending' thì chuyển đến tab completed
        if (targetTest.status === 'result-pending') {
          setActiveTab('completed');
        } else {
          setActiveTab('queue');
        }

        // Scroll đến row và highlight
        setTimeout(() => {
          const el = document.getElementById(`test-row-${bookingId}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('table-primary');
            setTimeout(() => el.classList.remove('table-primary'), 3000);
          }
        }, 500);
      }
    }
  }, [bookingId, tests]);

  /**
   * EFFECT 2: Tải dữ liệu booking khi component mount hoặc user.id thay đổi
   * BƯỚC 1: Gọi API getBookingByStaffId() để lấy danh sách booking
   * BƯỚC 2: Lọc các booking có status phù hợp cho lab testing
   * BƯỚC 3: Map booking thành test với thông tin chi tiết
   * BƯỚC 4: Cập nhật state tests
   */
  useEffect(() => {
    const fetchTests = async () => {
      try {
        // BƯỚC 1: Lấy danh sách booking từ API
        const bookings = await getBookingByStaffId(user.id);
        
        // BƯỚC 2: Lọc và map booking thành test
        const tests = bookings
          .filter(b => {
            const history = Array.isArray(b.bookingHistories_on_booking) ? b.bookingHistories_on_booking : [];
            const sorted = [...history].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            const latestStatus = sorted[sorted.length - 1]?.status;
            // Chỉ lấy các booking có status phù hợp cho lab testing
            return ['SAMPLE_COLLECTED', 'RESULT_PENDING', 'ANALYSIS_COMPLETE'].includes(latestStatus);
          })
          .map(b => {
            const history = Array.isArray(b.bookingHistories_on_booking) ? b.bookingHistories_on_booking : [];
            const sorted = [...history].sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            const latestStatus = sorted[sorted.length - 1]?.status?.toLowerCase().replaceAll('_', '-') || '';

            // BƯỚC 2.1: Tạo object test với đầy đủ thông tin
            return {
              id: b.id,
              status: latestStatus,
              createdAt: b.createdAt,
              labCode: b.labCode || '',
              participants: b.participants_on_booking || [],
              serviceName: b.service?.title || 'Không rõ',
              serviceType: b.service?.category?.hasLegalValue ? 'civil' : 'admin',
              service: b.service || null,
              methodName: b.method?.name || 'Không rõ',
              customerName: b.informations_on_booking?.[0]?.name || 'Không rõ',
              phone: b.informations_on_booking?.[0]?.phone || ''
            };
          });

        // BƯỚC 3: Cập nhật state
        setTests(tests);
      } catch (err) {
        // Xử lý lỗi
      }
    };
    fetchTests();
  }, [user.id]);

  /**
   * EFFECT 3: Lọc danh sách test theo search term và filter status
   * BƯỚC 1: Lọc theo từ khóa tìm kiếm
   * BƯỚC 2: Lọc theo status được chọn
   * BƯỚC 3: Cập nhật filteredTests
   */
  useEffect(() => {
    let filtered = tests;

    // BƯỚC 1: Lọc theo search term
    if (searchTerm) {
      filtered = filtered.filter(test =>
        test.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        test.labCode.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    // BƯỚC 2: Lọc theo status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(test => test.status === filterStatus);
    }

    // BƯỚC 3: Cập nhật state
    setFilteredTests(filtered);
  }, [searchTerm, filterStatus, tests]);

  /**
   * HELPER FUNCTION: Tạo badge hiển thị status với màu sắc và label tương ứng
   * INPUT: status (string) - trạng thái test
   * OUTPUT: JSX Badge component với màu và text phù hợp
   */
  const getStatusBadge = (status) => {
    const statusConfig = {
      'sample-received': { bg: 'warning', text: 'Chờ xét nghiệm' },
      'in-analysis': { bg: 'info', text: 'Đang phân tích' },
      'quality-check': { bg: 'primary', text: 'Kiểm tra chất lượng' },
      'analysis-complete': { bg: 'success', text: 'Hoàn thành' },
      'need-retest': { bg: 'danger', text: 'Cần xét lại' },
      'sample-collected': { bg: 'warning', text: 'Chờ xét nghiệm' },
      'testing-started': { bg: 'info', text: 'Đang xét nghiệm' },
      'result-pending': { bg: 'info', text: 'Đã xét nghiệm' }
    };
    const config = statusConfig[status] || { bg: 'secondary', text: 'Không xác định' };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  /**
   * EVENT HANDLER: Bắt đầu xét nghiệm
   * BƯỚC 1: Gọi API addBookingHistory() để cập nhật status thành RESULT_PENDING
   * BƯỚC 2: Hiển thị loading animation
   * BƯỚC 3: Hiển thị thông báo hoàn tất
   * BƯỚC 4: Cập nhật UI
   */
  const handleStartAnalysis = async (test) => {
    try {
      // BƯỚC 1: Gọi API để cập nhật status
      const payload = {
        bookingId: test.id,
        status: 'RESULT_PENDING',
        description: 'Description'
      };
      const res = await addBookingHistory(payload);
      console.log('Booking history added:', res);
      
      // BƯỚC 2: Hiển thị loading animation
      Swal.fire({
        title: 'Đang tiến hành xét nghiệm...',
        html: '<b>Vui lòng chờ trong giây lát</b>',
        timer: 5000,
        timerProgressBar: true,
        allowOutsideClick: false,
        allowEscapeKey: false,
        didOpen: () => {
          Swal.showLoading();
        },
      }).then(() => {
        // BƯỚC 3: Hiển thị thông báo hoàn tất
        Swal.fire({
          icon: 'success',
          title: 'Quá trình xét nghiệm đã hoàn tất',
          text: `Mẫu ${test.id} đã chuyển sang trạng thái chờ kết quả!`,
          confirmButtonText: 'OK',
          confirmButtonColor: '#198754'
        });
        
        // BƯỚC 4: Cập nhật status trên UI
        setTests(prevTests => prevTests.map(t =>
          t.id === test.id
            ? { ...t, status: 'result-pending' }
            : t
        ));
      });
    } catch (err) {
      setAlert({
        show: true,
        message: `Lỗi khi bắt đầu xét nghiệm mẫu ${test.id}`,
        type: 'danger'
      });
      setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
    }
  };

  /**
   * EVENT HANDLER: Mở modal để xem chi tiết test
   * BƯỚC 1: Set selectedTest và mở modal
   * BƯỚC 2: Khởi tạo testResults với thông tin mặc định
   */
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

  /**
   * HELPER FUNCTION: Format date time sang định dạng Việt Nam
   * INPUT: dateTimeString (string) - chuỗi ngày giờ
   * OUTPUT: string - ngày giờ định dạng Việt Nam
   */
  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('vi-VN');
  };

  return (
    <div>
      {/* HEADER: Tiêu đề trang */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-eye me-2"></i>
            Phòng Xét nghiệm ADN
          </h2>
          <p className="text-muted mb-0">Thực hiện phân tích ADN và ghi nhận kết quả xét nghiệm</p>
        </div>
      </div>

      {/* ALERT: Thông báo lỗi/thành công */}
      {alert.show && (
        <Alert variant={alert.type} className="mb-4">
          <i className="bi bi-check-circle me-2"></i>
          {alert.message}
        </Alert>
      )}

      {/* LAB STATISTICS: Thống kê phòng lab */}
      <Row className="mb-4">
        {/* Card chờ xét nghiệm */}
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-start border-warning border-4 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-hourglass-split fs-1 text-warning"></i>
              </div>
              <div>
                <div className="h4 mb-0">{tests.filter(t => t.status === 'sample-collected').length}</div>
                <div className="text-muted small">Chờ xét nghiệm</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        
        {/* Card hoàn thành */}
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-start border-success border-4 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-check-circle fs-1 text-success"></i>
              </div>
              <div>
                <div className="h4 mb-0">{tests.filter(t => t.status === 'result-pending').length}</div>
                <div className="text-muted small">Hoàn thành</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* FILTERS: Tìm kiếm và lọc test */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row>
            {/* Search input */}
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
            
            {/* Status filter */}
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
            
            {/* Statistics badges */}
            <Col lg={3} className="mb-3 d-flex align-items-end">
              <div className="w-100">
                <Badge bg="warning" className="me-2">
                  Đang xử lý: {tests.filter(t => ['sample-collected'].includes(t.status)).length}
                </Badge>
                <Badge bg="info">
                  Hoàn thành: {tests.filter(t => t.status === 'result-pending').length}
                </Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* TESTS TABS: Chia thành 2 tab chính */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        {/* TAB 1: Cần xử lý */}
        <Tab eventKey="queue" title={
          <span>
            <i className="bi bi-list-ol me-2"></i>
            Cần xử lý ({tests.filter(t => t.status === 'sample-collected').length})
          </span>
        }>
          {/* Queue Table: Bảng mẫu chờ xét nghiệm */}
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
                      <th>Phương thức</th>
                      <th>Ngày tạo</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTests.filter(t => t.status === 'sample-collected').map((test) => (
                      <tr key={test.id} id={`test-row-${test.id}`}>
                        {/* Mã đơn hàng */}
                        <td>
                          <div>{test.id}</div>
                          <small className="text-muted">{test.participants?.length || 0} người</small>
                        </td>
                        
                        {/* Thông tin khách hàng */}
                        <td>
                          <div>{test.customerName}</div>
                          <small className="text-muted">{test.phone}</small>
                        </td>
                        
                        {/* Thông tin dịch vụ */}
                        <td>
                          <div>{test.service?.title || 'Không rõ'}</div>
                          <span
                            className={`badge rounded-pill ${test.service?.category?.hasLegalValue
                              ? 'bg-warning text-dark'
                              : 'bg-success text-white'
                              }`}
                            style={{ fontSize: '12px', fontWeight: 500 }}
                          >
                            {test.service?.category?.hasLegalValue ? 'Hành chính' : 'Dân sự'}
                          </span>
                        </td>
                        
                        {/* Phương thức lấy mẫu */}
                        <td>
                          {test.methodName === 'Lấy mẫu tại lab' ? (
                            <span className="badge rounded-pill bg-primary" style={{ fontSize: '13px', fontWeight: 500 }}>
                              <i className="bi bi-buildings me-1"></i>Lấy mẫu tại lab
                            </span>
                          ) : test.methodName === 'Lấy mẫu tại nhà' ? (
                            <span className="badge rounded-pill bg-success" style={{ fontSize: '13px', fontWeight: 500 }}>
                              <i className="bi bi-house-door me-1"></i>Lấy mẫu tại nhà
                            </span>
                          ) : test.methodName === 'Nhân viên tới nhà lấy mẫu' ? (
                            <span className="badge rounded-pill bg-warning text-dark" style={{ fontSize: '13px', fontWeight: 500 }}>
                              <i className="bi bi-truck me-1"></i>Nhân viên tới nhà lấy mẫu
                            </span>
                          ) : (
                            <span className="badge rounded-pill bg-secondary" style={{ fontSize: '13px', fontWeight: 500 }}>
                              {test.methodName || 'Không rõ'}
                            </span>
                          )}
                        </td>
                        
                        {/* Ngày tạo */}
                        <td>{formatDateTime(test.createdAt)}</td>
                        
                        {/* Trạng thái */}
                        <td>{getStatusBadge(test.status)}</td>
                        
                        {/* Các nút thao tác */}
                        <td>
                          {test.status === 'sample-collected' && (
                            <Button
                              size="sm"
                              variant="warning"
                              onClick={() => handleStartAnalysis(test)}
                            >
                              <i className="bi bi-play-circle me-1"></i>
                              Xét nghiệm
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

        {/* TAB 2: Hoàn thành */}
        <Tab eventKey="completed" title={
          <span>
            <i className="bi bi-check-circle me-2"></i>
            Hoàn thành ({tests.filter(t => t.status === 'result-pending').length})
          </span>
        }>
          {/* Completed Table: Bảng xét nghiệm hoàn thành */}
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
                      <th>Phương thức</th>
                      <th>Ngày hoàn thành</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredTests.filter(t => t.status === 'result-pending').map((test) => (
                      <tr key={test.id} id={`test-row-${test.id}`}>
                        {/* Mã đơn hàng */}
                        <td>
                          <div>{test.id}</div>
                          <small className="text-muted">{test.participants?.length || 0} người</small>
                        </td>
                        
                        {/* Thông tin khách hàng */}
                        <td>
                          <div>{test.customerName}</div>
                          <small className="text-muted">{test.phone}</small>
                        </td>
                        
                        {/* Thông tin dịch vụ */}
                        <td>
                          <div>{test.service?.title || 'Không rõ'}</div>
                          <span
                            className={`badge rounded-pill ${test.service?.category?.hasLegalValue
                              ? 'bg-warning text-dark'
                              : 'bg-success text-white'
                              }`}
                            style={{ fontSize: '12px', fontWeight: 500 }}
                          >
                            {test.service?.category?.hasLegalValue ? 'Hành chính' : 'Dân sự'}
                          </span>
                        </td>
                        
                        {/* Phương thức lấy mẫu */}
                        <td>
                          {test.methodName === 'Lấy mẫu tại lab' ? (
                            <span className="badge rounded-pill bg-primary" style={{ fontSize: '13px', fontWeight: 500 }}>
                              <i className="bi bi-buildings me-1"></i>Lấy mẫu tại lab
                            </span>
                          ) : test.methodName === 'Lấy mẫu tại nhà' ? (
                            <span className="badge rounded-pill bg-success" style={{ fontSize: '13px', fontWeight: 500 }}>
                              <i className="bi bi-house-door me-1"></i>Lấy mẫu tại nhà
                            </span>
                          ) : test.methodName === 'Nhân viên tới nhà lấy mẫu' ? (
                            <span className="badge rounded-pill bg-warning text-dark" style={{ fontSize: '13px', fontWeight: 500 }}>
                              <i className="bi bi-truck me-1"></i>Nhân viên tới nhà lấy mẫu
                            </span>
                          ) : (
                            <span className="badge rounded-pill bg-secondary" style={{ fontSize: '13px', fontWeight: 500 }}>
                              {test.methodName || 'Không rõ'}
                            </span>
                          )}
                        </td>
                        
                        {/* Ngày hoàn thành */}
                        <td>{formatDateTime(test.createdAt)}</td>
                        
                        {/* Trạng thái */}
                        <td>{getStatusBadge(test.status)}</td>
                        
                        {/* Badge hoàn thành */}
                        <td>
                          {test.status === 'result-pending' && (
                            <span className="badge bg-success p-2">
                              <i className="bi bi-check-circle me-1"></i>
                              Hoàn thành
                            </span>
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
      </Tabs>
    </div>
  );
};

export default LabTesting;