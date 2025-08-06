import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Alert, Modal, Form, Table, InputGroup, Tabs, Tab } from 'react-bootstrap';
import { getBookingByStaffId, addBookingHistory, getSamplesByBookingId, updateSample } from '../../services/api';
import { useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

/**
 * COMPONENT: SampleCollection
 * CHỨC NĂNG: Quản lý thu thập mẫu xét nghiệm từ khách hàng
 * LUỒNG HOẠT ĐỘNG:
 * 1. Tải danh sách booking có status SAMPLE_RECEIVED từ API getBookingByStaffId()
 * 2. Lọc và map booking thành sample với status tương ứng
 * 3. Hiển thị danh sách sample theo tabs: Đang chờ / Đã thu mẫu
 * 4. Cho phép staff thu mẫu qua modal với thông tin chi tiết
 * 5. Cập nhật sample qua API updateSample() và booking status qua addBookingHistory()
 */
const SampleCollection = ({ user }) => {
  // ROUTER HOOKS
  const { bookingId } = useParams(); // Lấy bookingId từ URL nếu có

  // STATE QUẢN LÝ DỮ LIỆU
  const [samples, setSamples] = useState([]); // Danh sách mẫu
  const [filteredSamples, setFilteredSamples] = useState([]); // Danh sách đã lọc
  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
  const [filterStatus, setFilterStatus] = useState('all'); // Filter theo status

  // STATE QUẢN LÝ UI
  const [alert, setAlert] = useState({ show: false, message: '', type: '' }); // Alert thông báo
  const [showCollectionModal, setShowCollectionModal] = useState(false); // Hiển thị modal thu mẫu
  const [selectedSample, setSelectedSample] = useState(null); // Mẫu được chọn
  const [activeTab, setActiveTab] = useState('pending'); // Tab hiện tại
  // Modal xác nhận đã tới nhà
  const [showArrivedModal, setShowArrivedModal] = useState(false);
  const [arrivedSample, setArrivedSample] = useState(null);
  const [arrivedDescription, setArrivedDescription] = useState('Đã tới nhà khách hàng, chuẩn bị thu mẫu');
  // Modal xác nhận thanh toán
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentSample, setPaymentSample] = useState(null);
  const [paymentDescription, setPaymentDescription] = useState('Khách hàng đã thanh toán đủ chi phí');
  // Hàm xác nhận thanh toán, gọi addBookingHistory đổi status thành PAYMENT_CONFIRMED
  const handleConfirmPayment = async () => {
    if (!paymentSample) return;
    try {
      await addBookingHistory({
        bookingId: paymentSample.id,
        status: 'PAYMENT_CONFIRMED',
        description: paymentDescription
      });
      setAlert({ show: true, message: `Đã xác nhận thanh toán cho đơn ${paymentSample.id}`, type: 'success' });
      // Cập nhật lại danh sách
      setSamples(samples => samples.map(s => s.id === paymentSample.id ? { ...s, status: 'payment-confirmed' } : s));
      setShowPaymentModal(false);
      setPaymentSample(null);
      setPaymentDescription('Khách hàng đã thanh toán đủ chi phí');
    } catch (e) {
      setAlert({ show: true, message: 'Có lỗi khi xác nhận thanh toán!', type: 'danger' });
    }
  };
  // Hàm xác nhận đã tới nhà, gọi addBookingHistory đổi status thành SAMPLE_RECEIVED
  const handleConfirmArrived = async () => {
    if (!arrivedSample) return;
    try {
      await addBookingHistory({
        bookingId: arrivedSample.id,
        status: 'SAMPLE_RECEIVED',
        description: arrivedDescription
      });
      setAlert({ show: true, message: `Đã xác nhận tới nhà cho đơn ${arrivedSample.id}`, type: 'success' });
      // Cập nhật lại danh sách
      setSamples(samples => samples.map(s => s.id === arrivedSample.id ? { ...s, status: 'sample-received', showSampleButton: true } : s));
      setShowArrivedModal(false);
      setArrivedSample(null);
      setArrivedDescription('Đã tới nhà khách hàng, chuẩn bị thu mẫu');
    } catch (e) {
      setAlert({ show: true, message: 'Có lỗi khi xác nhận!', type: 'danger' });
    }
  };

  // STATE QUẢN LÝ THU MẪU
  const [collectionData, setCollectionData] = useState({
    collectionTime: '', // Thời gian thu mẫu
    collectorName: '', // Tên người thu mẫu
    sampleQuality: 'good', // Chất lượng mẫu tổng thể
    participants: [], // Danh sách người tham gia
    notes: '', // Ghi chú
    photos: [] // Ảnh (nếu có)
  });

  /**
   * EFFECT 1: Tự động chuyển tab dựa trên bookingId
   * BƯỚC 1: Kiểm tra nếu có bookingId từ URL
   * BƯỚC 2: Tìm sample tương ứng và xác định tab phù hợp
   */
  useEffect(() => {
    if (bookingId && samples.length > 0) {
      const targetSample = samples.find(s => s.id === bookingId);
      if (targetSample) {
        // Nếu status là 'collected' thì chuyển đến tab completed
        if (targetSample.status === 'collected') {
          setActiveTab('completed');
        } else {
          setActiveTab('pending');
        }
      }
    }
  }, [bookingId, samples]);

  /**
   * EFFECT 2: Tải dữ liệu booking khi component mount hoặc user.id thay đổi
   * BƯỚC 1: Gọi API getBookingByStaffId() để lấy danh sách booking
   * BƯỚC 2: Lọc các booking có status SAMPLE_RECEIVED
   * BƯỚC 3: Map booking thành sample với thông tin chi tiết
   * BƯỚC 4: Cập nhật state samples
   */
  useEffect(() => {
    const fetchSamples = async () => {
      try {
        // BƯỚC 1: Lấy danh sách booking từ API
        const bookings = await getBookingByStaffId(user.id);

        // BƯỚC 2: Lọc và map booking thành sample
        // Hiển thị các booking có SAMPLE_RECEIVED, READY_FOR_SAMPLE hoặc PREPARED
        const mappedSamples = bookings
          .filter(b => {
            const histories = Array.isArray(b.bookingHistories_on_booking) ? b.bookingHistories_on_booking : [];
            return histories.some(h => {
              const s = (h.status || '').toUpperCase();
              return s === 'SAMPLE_RECEIVED' || s === 'STAFF_ASSIGNED' || s === 'PREPARED';
            });
          })
          .map(b => {
            const histories = Array.isArray(b.bookingHistories_on_booking) ? b.bookingHistories_on_booking : [];
            const hasSampleReceived = histories.some(h => h.status?.toLowerCase() === 'sample_received');

            // BƯỚC 2.1: Lấy status mới nhất và xác định status hiển thị
            const sorted = [...histories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const latestStatus = sorted[0]?.status?.toUpperCase() || '';

            let status = (() => {
              if (latestStatus === 'EXPIRED') return 'overdue';
              if (histories.some(h => h.status?.toUpperCase() === 'SAMPLE_COLLECTED')) return 'collected';
              if (histories.some(h => h.status?.toUpperCase() === 'SAMPLE_RECEIVED')) return 'sample-received';
              if (histories.some(h => h.status?.toUpperCase() === 'PAYMENT_CONFIRMED')) return 'payment-confirmed';
              if (histories.some(h => h.status?.toUpperCase() === 'STAFF_ASSIGNED')) return 'ready';
              if (histories.some(h => h.status?.toUpperCase() === 'PREPARED')) return 'prepared';
              const fallbackStatus = b.status?.toUpperCase() || 'SCHEDULED';
              return fallbackStatus.toLowerCase().replaceAll('_', '-');
            })();

            // BƯỚC 2.2: Tạo object sample với đầy đủ thông tin
            return {
              id: b.id,
              customerName: b.informations_on_booking?.[0]?.name || 'Không rõ',
              phone: b.informations_on_booking?.[0]?.phone || '',
              service: b.service?.title || 'Không rõ dịch vụ',
              serviceType: b.service?.category?.hasLegalValue ? 'civil' : 'administrative',
              address: b.informations_on_booking?.[0]?.address || '',
              scheduledTime: b.timeSlotId?.split('_')[0] || '',
              participants: b.participants_on_booking || [],
              status: status,
              orderDate: b.createdAt,
              returnedDate: b.returnedDate || '',
              collectedBy: b.collectedBy || '',
              collectedDate: b.collectedDate || '',
              methodName: b.method?.name || 'Không rõ',
              showSampleButton: hasSampleReceived
            };
          });

        // BƯỚC 3: Cập nhật state
        setSamples(mappedSamples);
        setFilteredSamples(mappedSamples);
      } catch (error) {
        setAlert({ show: true, message: 'Không thể tải danh sách mẫu!', type: 'danger' });
      }
    };

    fetchSamples();
  }, [user.id]);

  /**
   * EFFECT 3: Highlight sample được chọn từ URL
   * BƯỚC 1: Kiểm tra nếu có bookingId từ URL
   * BƯỚC 2: Tìm và highlight row tương ứng
   */
  useEffect(() => {
    if (bookingId && samples.length > 0) {
      const el = document.getElementById(`sample-row-${bookingId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('table-primary');
        setTimeout(() => el.classList.remove('table-primary'), 3000);
      }
    }
  }, [bookingId, samples]);

  /**
   * EFFECT 4: Lọc danh sách sample theo search term và filter status
   * BƯỚC 1: Lọc bỏ các sample quá hạn
   * BƯỚC 2: Lọc theo từ khóa tìm kiếm
   * BƯỚC 3: Lọc theo status được chọn
   * BƯỚC 4: Cập nhật filteredSamples
   */
  useEffect(() => {
    let filtered = samples;

    // BƯỚC 1: Ẩn sample quá hạn
    filtered = filtered.filter(sample => sample.status !== 'overdue');

    // BƯỚC 2: Lọc theo search term
    if (searchTerm) {
      filtered = filtered.filter(sample =>
        sample.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.phone.includes(searchTerm)
      );
    }

    // BƯỚC 3: Lọc theo status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(sample => sample.status === filterStatus);
    }

    // BƯỚC 4: Cập nhật state
    setFilteredSamples(filtered);
  }, [searchTerm, filterStatus, samples]);

  // BƯỚC 5: Chia sample thành 2 nhóm để hiển thị theo tabs
  // Hiển thị cả sample-received, ready, prepared, payment-confirm (pending)
  const pendingSamples = filteredSamples.filter(s => !['collected', 'transferred'].includes(s.status));
  const completedSamples = filteredSamples.filter(s => s.status === 'collected');

  /**
   * HELPER FUNCTION: Tạo badge hiển thị status với màu sắc và label tương ứng
   * INPUT: status (string) - trạng thái sample
   * OUTPUT: JSX Badge component với màu và text phù hợp
   */
  const getStatusBadge = (status) => {
    const statusConfig = {
      'ready': { bg: 'warning', text: 'Chuẩn bị thu mẫu' },
      'prepared': { bg: 'info', text: 'Đã chuẩn bị dụng cụ' },
      'sample-received': { bg: 'primary', text: 'Chờ thu mẫu' },
      'payment-confirmed': { bg: 'warning', text: 'Khách đã tới' },
      'collected': { bg: 'success', text: 'Đã thu mẫu' },
      'transferred': { bg: 'dark', text: 'Đã chuyển lab' },
      'overdue': { bg: 'danger', text: 'Quá hạn' }
    };
    const config = statusConfig[status] || { bg: 'secondary', text: 'Không xác định' };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  /**
   * EVENT HANDLER: Bắt đầu thu mẫu
   * BƯỚC 1: Set selectedSample và mở modal
   * BƯỚC 2: Gọi API getSamplesByBookingId() để lấy danh sách mẫu chi tiết
   * BƯỚC 3: Khởi tạo collectionData với thông tin mặc định
   */
  const handleStartCollection = (sample) => {
    setSelectedSample(sample);
    getSamplesByBookingId(sample.id).then(samplesList => {
      setCollectionData({
        collectionTime: new Date().toISOString().slice(0, 16),
        collectorName: user.name || '',
        samples: samplesList.map(s => ({
          ...s,
          sampleQuality: s.sampleQuality || '',
          sampleConcentration: s.sampleConcentration || '',
          notes: s.notes || ''
        })),
        notes: '',
        photos: []
      });
      setShowCollectionModal(true);
    });
  };

  /**
   * EVENT HANDLER: Hoàn tất thu mẫu
   * BƯỚC 1: Gọi API updateSample() cho từng mẫu
   * BƯỚC 2: Nếu tất cả thành công, gọi addBookingHistory() để cập nhật booking status
   * BƯỚC 3: Cập nhật state và hiển thị thông báo
   * BƯỚC 4: Chuyển tab và highlight sample đã thu
   */
  const handleCompleteCollection = () => {
    // BƯỚC 1: Gọi updateSample cho từng mẫu
    Promise.all(
      (collectionData.samples || []).map(sample =>
        updateSample({
          sampleId: sample.id || sample.sampleId,
          sampleQuality: sample.sampleQuality,
          sampleConcentration: parseFloat(sample.sampleConcentration),
          sampleType: sample.sampleType,
          notes: sample.notes
        })
      )
    ).then(results => {
      // BƯỚC 2: Nếu tất cả updateSample thành công
      if (results.every(res => res && !res.error)) {
        addBookingHistory({
          bookingId: selectedSample.id,
          status: 'SAMPLE_COLLECTED',
          description: 'Đã thu mẫu thành công'
        }).then(() => {
          // BƯỚC 3: Cập nhật state
          const updatedSamples = samples.map(sample =>
            sample.id === selectedSample.id
              ? {
                ...sample,
                status: 'collected',
                collectedBy: user.name,
                collectedDate: new Date().toLocaleString('vi-VN'),
                collectionDetails: collectionData,
                showSampleButton: false // Ẩn nút thu mẫu sau khi đã thu
              }
              : sample
          );
          setSamples(updatedSamples);
          setShowCollectionModal(false);
          setSelectedSample(null);
          console.log('Updating samples:', collectionData.samples);

          // BƯỚC 4: Hiển thị thông báo thành công và chuyển tab
          Swal.fire({
            icon: 'success',
            title: 'Thành công!',
            text: `Thu mẫu cho đơn hàng ${selectedSample.id} đã hoàn tất thành công!`,
            confirmButtonText: 'OK',
            confirmButtonColor: '#198754'
          }).then(() => {
            setActiveTab('completed');
            setTimeout(() => {
              const el = document.getElementById(`sample-row-${selectedSample.id}`);
              if (el) {
                el.scrollIntoView({ behavior: 'smooth', block: 'center' });
                el.classList.add('table-primary');
                setTimeout(() => el.classList.remove('table-primary'), 2000);
              }
            }, 400);
          });
        }).catch(() => {
          setAlert({
            show: true,
            message: `Có lỗi khi cập nhật trạng thái booking!`,
            type: 'danger'
          });
          setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
        });
      } else {
        setAlert({
          show: true,
          message: `Có lỗi khi cập nhật mẫu!`,
          type: 'danger'
        });
        setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
      }
    }).catch(() => {
      setAlert({
        show: true,
        message: `Có lỗi khi cập nhật mẫu!`,
        type: 'danger'
      });
      setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
    });
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
            <i className="bi bi-droplet me-2"></i>
            Thu mẫu và Cập nhật Trạng thái
          </h2>
          <p className="text-muted mb-0">Quản lý việc thu thập mẫu xét nghiệm từ khách hàng</p>
        </div>
      </div>

      {/* ALERT: Thông báo lỗi/thành công */}
      {alert.show && (
        <Alert variant={alert.type} className="mb-4">
          <i className="bi bi-check-circle me-2"></i>
          {alert.message}
        </Alert>
      )}

      {/* FILTERS: Tìm kiếm và lọc mẫu */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row>
            {/* Search input */}
            <Col lg={6} md={8} className="mb-3">
              <Form.Label>Tìm kiếm</Form.Label>
              <InputGroup>
                <Form.Control
                  placeholder="Mã đơn, tên khách hàng, số điện thoại..."
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
                <option value="sample-received">Chuẩn bị thu mẫu</option>
                <option value="collected">Đã thu mẫu</option>
              </Form.Select>
            </Col>

            {/* Statistics badges */}
            <Col lg={3} className="mb-3 d-flex align-items-end">
              <div className="w-100">
                <Badge bg="primary" className="me-2">
                  Cần thu: {samples.filter(s => ['sample-received'].includes(s.status)).length}
                </Badge>
                <Badge bg="success">
                  Đã thu mẫu: {samples.filter(s => s.status === 'collected').length}
                </Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* TABS: Chia thành 2 tab chính */}
      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
        {/* TAB 1: Đang chờ thu mẫu */}
        <Tab eventKey="pending" title={<span><i className="bi bi-list-ol me-2"></i>Đang chờ</span>}>
          {/* Table cho mẫu chưa thu */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Danh sách mẫu cần thu ({pendingSamples.length})</h5>
              </div>
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
                      <th>Thời gian</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingSamples.map((sample) => (
                      <tr key={sample.id} id={`sample-row-${sample.id}`}>
                        {/* Mã đơn hàng */}
                        <td>
                          <div className="">{sample.id}</div>
                          <small className="text-muted">{sample.participants.length} người</small>
                        </td>

                        {/* Thông tin khách hàng */}
                        <td>
                          <div className="">{sample.customerName}</div>
                          <small className="text-muted">{sample.phone}</small>
                        </td>

                        {/* Thông tin dịch vụ */}
                        <td>
                          <div>{sample.service}</div>
                          <span
                            className={`badge rounded-pill ${sample.serviceType === 'civil' ? 'bg-warning text-dark' : 'bg-success text-white'}`}
                            style={{ fontSize: '12px', fontWeight: 500 }}
                          >
                            {sample.serviceType === 'civil' ? 'Hành chính' : 'Dân sự'}
                          </span>
                        </td>

                        {/* Phương thức lấy mẫu */}
                        <td>
                          {sample.methodName === 'Lấy mẫu tại lab' ? (
                            <span className="badge rounded-pill bg-primary" style={{ fontSize: '13px', fontWeight: 500 }}>
                              <i className="bi bi-buildings me-1"></i>Lấy mẫu tại lab
                            </span>
                          ) : sample.methodName === 'Lấy mẫu tại nhà' ? (
                            <span className="badge rounded-pill bg-success" style={{ fontSize: '13px', fontWeight: 500 }}>
                              <i className="bi bi-house-door me-1"></i>Lấy mẫu tại nhà
                            </span>
                          ) : sample.methodName === 'Nhân viên tới nhà lấy mẫu' ? (
                            <span className="badge rounded-pill bg-warning text-dark" style={{ fontSize: '13px', fontWeight: 500 }}>
                              <i className="bi bi-truck me-1"></i>Nhân viên tới nhà lấy mẫu
                            </span>
                          ) : (
                            <span className="badge rounded-pill bg-secondary" style={{ fontSize: '13px', fontWeight: 500 }}>
                              {sample.methodName || 'Không rõ'}
                            </span>
                          )}
                        </td>

                        {/* Thời gian */}
                        <td>
                          <div>{formatDateTime(sample.scheduledTime)}</div>
                          {sample.returnedDate && (
                            <small className="text-success">Về: {formatDateTime(sample.returnedDate)}</small>
                          )}
                        </td>

                        {/* Trạng thái */}
                        <td>
                          {getStatusBadge(sample.status)}
                        </td>

                        {/* Các nút thao tác */}
                        <td>
                          <div className="d-flex flex-column gap-1">
                            {/* Nút Đã tới nhà cho trạng thái ready */}
                            {sample.status === 'ready' && (
                              <Button
                                size="sm"
                                variant="info"
                                onClick={() => {
                                  setArrivedSample(sample);
                                  setShowArrivedModal(true);
                                }}
                              >
                                <i className="bi bi-house-door me-1"></i>
                                Đã tới nhà
                              </Button>
                            )}
                            {/* Nút xác nhận thanh toán cho trạng thái prepared */}
                            {sample.status === 'prepared' && (
                              <Button
                                size="sm"
                                variant="info"
                                onClick={() => {
                                  setPaymentSample(sample);
                                  setShowPaymentModal(true);
                                  setPaymentDescription('Khách hàng đã đến phòng lab');
                                }}
                              >
                                <i className="bi bi-person-check me-1"></i>
                                Khách hàng đã tới
                              </Button>
                            )}
                            {/* Nút xác nhận thanh toán cho trạng thái payment-confirmed */}
                            {sample.status === 'payment-confirmed' && (
                              <Button
                                size="sm"
                                variant="warning"
                                onClick={() => {
                                  setArrivedSample(sample);
                                  setShowArrivedModal(true);
                                  setArrivedDescription('Khách hàng đã thanh toán đủ, chờ thu mẫu');
                                }}
                              >
                                <i className="bi bi-cash-coin me-1"></i>
                                Xác nhận thanh toán
                              </Button>
                            )}
                            {/* Nút thu mẫu */}
                            {sample.status !== 'collected' && sample.status !== 'transferred' && sample.showSampleButton && sample.status !== 'overdue' && (
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => handleStartCollection(sample)}
                              >
                                <i className="bi bi-droplet me-1"></i>
                                Thu mẫu
                              </Button>
                            )}
                            {/* MODAL: Xác nhận thanh toán */}
                            <Modal show={showPaymentModal} onHide={() => setShowPaymentModal(false)}>
                              <Modal.Header closeButton>
                                <Modal.Title>Xác nhận khách đã đến phòng lab</Modal.Title>
                              </Modal.Header>
                              <Modal.Body>
                                <p>Bạn xác nhận khách hàng đã có đơn hàng <b>{paymentSample?.id}</b> đã đến phòng lab</p>
                                <Form>
                                  <Form.Check
                                    type="radio"
                                    id="payment-default"
                                    name="payment-description"
                                    label="Khách hàng đã đến phòng lab"
                                    value="Khách hàng đã đến phòng lab"
                                    checked={paymentDescription === 'Khách hàng đã đến phòng lab'}
                                    onChange={e => setPaymentDescription(e.target.value)}
                                    className="mb-2"
                                  />
                                </Form>
                              </Modal.Body>
                              <Modal.Footer>
                                <Button variant="secondary" onClick={() => setShowPaymentModal(false)}>
                                  Hủy
                                </Button>
                                <Button variant="info" onClick={handleConfirmPayment} disabled={!paymentDescription || !paymentDescription.trim()}>
                                  Xác nhận
                                </Button>
                              </Modal.Footer>
                            </Modal>
                            {/* Nút chuyển lab */}
                            {sample.status === 'collected' && (
                              <Button
                                as={Link}
                                to={`/staff/lab-testing/${sample.id}`}
                                variant="primary"
                                size="sm"
                              >
                                <i className="bi bi-arrow-right me-1"></i>
                                Chuyển lab
                              </Button>
                            )}
                            {/* Badge hoàn tất */}
                            {sample.status === 'transferred' && (
                              <Badge bg="success" className="p-2">
                                <i className="bi bi-check-circle me-1"></i>
                                Hoàn tất
                              </Badge>
                            )}
                          </div>
                          {/* MODAL: Xác nhận đã tới nhà hoặc xác nhận thanh toán cho trạng thái payment-confirm */}
                          <Modal show={showArrivedModal} onHide={() => setShowArrivedModal(false)}>
                            <Modal.Header closeButton>
                              <Modal.Title>
                                {arrivedSample?.status === 'payment-confirmed'
                                  ? 'Xác nhận khách đã thanh toán và chuyển sang chờ thu mẫu'
                                  : 'Xác nhận đã tới nhà khách hàng'}
                              </Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                              {arrivedSample?.status === 'payment-confirmed' ? (
                                <>
                                  <p>Bạn xác nhận khách hàng đã thanh toán cho đơn <b>{arrivedSample?.id}</b> và chuyển sang chờ thu mẫu?</p>
                                  <Form>
                                    <Form.Check
                                      type="radio"
                                      id="arrived-default"
                                      name="arrived-description"
                                      label="Khách hàng đã thanh toán đủ, chờ thu mẫu"
                                      value="Khách hàng đã thanh toán đủ, chờ thu mẫu"
                                      checked={arrivedDescription === 'Khách hàng đã thanh toán đủ, chờ thu mẫu'}
                                      onChange={e => setArrivedDescription(e.target.value)}
                                      className="mb-2"
                                    />

                                  </Form>
                                </>
                              ) : (
                                <>
                                  <p>Bạn xác nhận đã tới nhà khách hàng để thu mẫu cho đơn <b>{arrivedSample?.id}</b>?</p>
                                  <Form>
                                    <Form.Check
                                      type="radio"
                                      id="arrived-default"
                                      name="arrived-description"
                                      label="Đã tới nhà khách hàng, chuẩn bị thu mẫu"
                                      value="Đã tới nhà khách hàng, chuẩn bị thu mẫu"
                                      checked={arrivedDescription === 'Đã tới nhà khách hàng, chuẩn bị thu mẫu'}
                                      onChange={e => setArrivedDescription(e.target.value)}
                                      className="mb-2"
                                    />
                                    <Form.Check
                                      type="radio"
                                      id="arrived-other"
                                      name="arrived-description"
                                      label="Khác:"
                                      value={arrivedDescription.startsWith('Khác:') ? arrivedDescription : ''}
                                      checked={arrivedDescription.startsWith('Khác:')}
                                      onChange={() => setArrivedDescription('Khác: ')}
                                      className="mb-2"
                                    />
                                    {arrivedDescription.startsWith('Khác:') && (
                                      <Form.Control
                                        type="text"
                                        placeholder="Nhập mô tả khác..."
                                        value={arrivedDescription.replace('Khác: ', '')}
                                        onChange={e => setArrivedDescription('Khác: ' + e.target.value)}
                                        className="mt-2"
                                      />
                                    )}
                                  </Form>
                                </>
                              )}
                            </Modal.Body>
                            <Modal.Footer>
                              <Button variant="secondary" onClick={() => setShowArrivedModal(false)}>
                                Hủy
                              </Button>
                              <Button variant="info" onClick={() => {
                                if (arrivedSample?.status === 'payment-confirmed') {
                                  // Xác nhận thanh toán, chuyển sang SAMPLE_RECEIVED
                                  addBookingHistory({
                                    bookingId: arrivedSample.id,
                                    status: 'SAMPLE_RECEIVED',
                                    description: arrivedDescription
                                  }).then(() => {
                                    setAlert({ show: true, message: `Đã xác nhận thanh toán và chuyển sang chờ thu mẫu cho đơn ${arrivedSample.id}`, type: 'success' });
                                    setSamples(samples => samples.map(s => s.id === arrivedSample.id ? { ...s, status: 'sample-received', showSampleButton: true } : s));
                                    setShowArrivedModal(false);
                                    setArrivedSample(null);
                                    setArrivedDescription('Khách hàng đã thanh toán đủ, chờ thu mẫu');
                                  }).catch(() => {
                                    setAlert({ show: true, message: 'Có lỗi khi xác nhận!', type: 'danger' });
                                  });
                                } else {
                                  handleConfirmArrived();
                                }
                              }}>
                                Xác nhận
                              </Button>
                            </Modal.Footer>
                          </Modal>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </div>
            </Card.Body>
          </Card>
        </Tab>

        {/* TAB 2: Đã thu mẫu */}
        <Tab eventKey="completed" title={<span><i className="bi bi-check-circle me-2"></i>Đã Thu Mẫu</span>}>
          {/* Table cho mẫu đã thu */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Danh sách mẫu đã thu ({completedSamples.length})</h5>
              </div>
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
                      <th>Thời gian</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedSamples.map((sample) => (
                      <tr key={sample.id} id={`sample-row-${sample.id}`}>
                        {/* Mã đơn hàng */}
                        <td>
                          <div className="">{sample.id}</div>
                          <small className="text-muted">{sample.participants.length} người</small>
                        </td>

                        {/* Thông tin khách hàng */}
                        <td>
                          <div className="">{sample.customerName}</div>
                          <small className="text-muted">{sample.phone}</small>
                        </td>

                        {/* Thông tin dịch vụ */}
                        <td>
                          <div>{sample.service}</div>
                          <span
                            className={`badge rounded-pill ${sample.serviceType === 'civil' ? 'bg-warning text-dark' : 'bg-success text-white'}`}
                            style={{ fontSize: '12px', fontWeight: 500 }}
                          >
                            {sample.serviceType === 'civil' ? 'Hành chính' : 'Dân sự'}
                          </span>
                        </td>

                        {/* Phương thức lấy mẫu */}
                        <td>
                          {sample.methodName === 'Lấy mẫu tại lab' ? (
                            <span className="badge rounded-pill bg-primary" style={{ fontSize: '13px', fontWeight: 500 }}>
                              <i className="bi bi-buildings me-1"></i>Lấy mẫu tại lab
                            </span>
                          ) : sample.methodName === 'Lấy mẫu tại nhà' ? (
                            <span className="badge rounded-pill bg-success" style={{ fontSize: '13px', fontWeight: 500 }}>
                              <i className="bi bi-house-door me-1"></i>Lấy mẫu tại nhà
                            </span>
                          ) : sample.methodName === 'Nhân viên tới nhà lấy mẫu' ? (
                            <span className="badge rounded-pill bg-warning text-dark" style={{ fontSize: '13px', fontWeight: 500 }}>
                              <i className="bi bi-truck me-1"></i>Nhân viên tới nhà lấy mẫu
                            </span>
                          ) : (
                            <span className="badge rounded-pill bg-secondary" style={{ fontSize: '13px', fontWeight: 500 }}>
                              {sample.methodName || 'Không rõ'}
                            </span>
                          )}
                        </td>

                        {/* Thời gian */}
                        <td>
                          <div>{formatDateTime(sample.scheduledTime)}</div>
                          {sample.returnedDate && (
                            <small className="text-success">Về: {formatDateTime(sample.returnedDate)}</small>
                          )}
                        </td>

                        {/* Trạng thái */}
                        <td>
                          {getStatusBadge(sample.status)}
                        </td>

                        {/* Các nút thao tác */}
                        <td>
                          <div className="d-flex flex-column gap-1">
                            {/* Nút chuyển lab */}
                            {sample.status === 'collected' && (
                              <Button
                                as={Link}
                                to={`/staff/lab-testing/${sample.id}`}
                                variant="primary"
                                size="sm"
                              >
                                <i className="bi bi-arrow-right me-1"></i>
                                Chuyển lab
                              </Button>
                            )}
                          </div>
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

      {/* MODAL: Thu mẫu chi tiết */}
      <Modal show={showCollectionModal} onHide={() => setShowCollectionModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-droplet me-2"></i>
            Thu mẫu xét nghiệm - {selectedSample?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSample && (
            <div>
              {/* BASIC INFO: Thông tin đơn hàng và thu mẫu */}
              <Row className="mb-4">
                {/* Thông tin đơn hàng */}
                <Col md={6}>
                  <h6 className="text-primary mb-3">Thông tin đơn hàng</h6>
                  <table className="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <td><strong>Khách hàng:</strong></td>
                        <td>{selectedSample.customerName}</td>
                      </tr>
                      <tr>
                        <td><strong>Điện thoại:</strong></td>
                        <td>{selectedSample.phone}</td>
                      </tr>
                      <tr>
                        <td><strong>Dịch vụ:</strong></td>
                        <td>{selectedSample.service}</td>
                      </tr>
                      <tr>
                        <td><strong>Địa chỉ:</strong></td>
                        <td>{selectedSample.address}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>

                {/* Thông tin thu mẫu */}
                <Col md={6}>
                  <h6 className="text-primary mb-3">Thông tin thu mẫu</h6>
                  <Form>
                    <Row>
                      {/* Thời gian thu mẫu */}
                      <Col md={6} className="mb-3">
                        <Form.Label>Thời gian thu mẫu</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={collectionData.collectionTime}
                          onChange={(e) => setCollectionData({ ...collectionData, collectionTime: e.target.value })}
                        />
                      </Col>

                      {/* Người thu mẫu */}
                      <Col md={6} className="mb-3">
                        <Form.Label>Người thu mẫu</Form.Label>
                        <Form.Control
                          value={collectionData.collectorName}
                          readOnly
                          className="bg-light"
                        />
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>

              {/* PARTICIPANTS: Danh sách mẫu chi tiết */}
              <div className="mb-4">
                <h6 className="text-primary mb-3">Danh sách mẫu</h6>
                <div className="table-responsive">
                  <Table bordered>
                    <thead className="table-light">
                      <tr>
                        <th>Mã mẫu</th>
                        <th>Tên người tham gia</th>
                        <th>Loại mẫu</th>
                        <th>Chất lượng mẫu</th>
                        <th>Nồng độ mẫu</th>
                        <th>Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collectionData.samples && collectionData.samples.map((sample, idx) => (
                        <tr key={sample.id || sample.sampleId || idx}>
                          {/* Mã mẫu */}
                          <td>{sample.id || sample.sampleId}</td>

                          {/* Tên người tham gia */}
                          <td>{sample.participant?.name || sample.name || ''}</td>

                          {/* Loại mẫu */}
                          <td>
                            <Form.Select
                              size="sm"
                              value={sample.sampleType || ''}
                              onChange={e => {
                                const newSamples = [...collectionData.samples];
                                newSamples[idx].sampleType = e.target.value;
                                setCollectionData({ ...collectionData, samples: newSamples });
                              }}
                            >
                              <option value="">Chọn loại mẫu</option>
                              <option value="blood">Máu</option>
                              <option value="buccal-swab">Tăm bông miệng</option>
                              <option value="hair-root">Tóc có chân tóc</option>
                              <option value="nail">Móng tay</option>
                              <option value="saliva">Nước bọt</option>
                              <option value="other">Khác</option>
                            </Form.Select>
                          </td>

                          {/* Chất lượng mẫu */}
                          <td>
                            <Form.Select
                              size="sm"
                              value={sample.sampleQuality}
                              onChange={e => {
                                const newSamples = [...collectionData.samples];
                                newSamples[idx].sampleQuality = e.target.value;
                                setCollectionData({ ...collectionData, samples: newSamples });
                              }}
                            >
                              <option value="">Chọn</option>
                              <option value="excellent">Xuất sắc</option>
                              <option value="good">Tốt</option>
                              <option value="fair">Khá</option>
                              <option value="poor">Kém</option>
                            </Form.Select>
                          </td>

                          {/* Nồng độ mẫu */}
                          <td>
                            <Form.Control
                              type="number"
                              min="0.01"
                              max="100"
                              step="0.01"
                              value={sample.sampleConcentration}
                              onChange={e => {
                                const value = parseFloat(e.target.value);
                                if (value > 100 || value < 0.01) {
                                  Swal.fire({
                                    icon: 'warning',
                                    title: 'Cảnh báo!',
                                    text: 'Nồng độ mẫu không được nhỏ hơn 0.01 và vượt quá 100',
                                    confirmButtonColor: '#ffc107'
                                  });
                                  return;
                                }
                                const newSamples = [...collectionData.samples];
                                newSamples[idx].sampleConcentration = e.target.value;
                                setCollectionData({ ...collectionData, samples: newSamples });
                              }}
                            />
                          </td>

                          {/* Ghi chú */}
                          <td>
                            <Form.Control
                              type="text"
                              value={sample.notes}
                              onChange={e => {
                                const newSamples = [...collectionData.samples];
                                newSamples[idx].notes = e.target.value;
                                setCollectionData({ ...collectionData, samples: newSamples });
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCollectionModal(false)}>
            Hủy
          </Button>
          <Button
            variant="success"
            onClick={handleCompleteCollection}
            disabled={!(collectionData.samples && collectionData.samples.length > 0 && collectionData.samples.every(s => s.sampleQuality && s.sampleConcentration !== undefined && s.notes && s.notes.trim()))}
          >
            <i className="bi bi-check-circle me-2"></i>
            Hoàn tất thu mẫu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SampleCollection;