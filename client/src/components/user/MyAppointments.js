import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Badge, Form, Alert, Modal, Tab, Tabs, ProgressBar } from 'react-bootstrap';

const MyAppointments = ({ user }) => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');

  // Mock appointments data
  const appointments = [
    {
      id: 'ADN123456',
      service: 'Xét nghiệm ADN huyết thống cha-con',
      serviceType: 'civil',
      date: '2024-02-05',
      time: '09:00',
      status: 'confirmed',
      method: 'self-sample',
      progress: 40,
      price: '3,500,000 VNĐ',
      participants: ['Nguyễn Văn A', 'Nguyễn Văn B'],
      nextAction: 'Kit sẽ được gửi trong 1-2 ngày',
      canCancel: true,
      canReschedule: true,
      notes: 'Lịch hẹn đã được xác nhận. Kit sẽ được gửi đến địa chỉ của bạn.',
      estimatedCompletion: '2024-02-12'
    },
    {
      id: 'ADN123457',
      service: 'Xét nghiệm ADN thai nhi',
      serviceType: 'civil',
      date: '2024-02-03',
      time: '14:30',
      status: 'in-progress',
      method: 'at-facility',
      progress: 75,
      price: '5,500,000 VNĐ',
      participants: ['Nguyễn Thị C', 'Nguyễn Văn D'],
      nextAction: 'Đang phân tích mẫu tại phòng lab',
      canCancel: false,
      canReschedule: false,
      notes: 'Mẫu đã được thu thập thành công. Kết quả dự kiến trong 2-3 ngày.',
      estimatedCompletion: '2024-02-06'
    },
    {
      id: 'ADN123458',
      service: 'Xét nghiệm ADN khai sinh',
      serviceType: 'administrative',
      date: '2024-01-20',
      time: '10:00',
      status: 'completed',
      method: 'at-facility',
      progress: 100,
      price: '4,200,000 VNĐ',
      participants: ['Nguyễn Văn E', 'Nguyễn Thị F'],
      nextAction: 'Kết quả đã sẵn sàng để tải về',
      canCancel: false,
      canReschedule: false,
      notes: 'Xét nghiệm hoàn tất. Kết quả có giá trị pháp lý đầy đủ.',
      estimatedCompletion: '2024-01-23'
    },
    {
      id: 'ADN123459',
      service: 'Xét nghiệm ADN anh chị em',
      serviceType: 'civil',
      date: '2024-01-15',
      time: '11:30',
      status: 'cancelled',
      method: 'home-visit',
      progress: 0,
      price: '4,200,000 VNĐ',
      participants: ['Nguyễn Văn G', 'Nguyễn Văn H'],
      nextAction: 'Đã hủy theo yêu cầu',
      canCancel: false,
      canReschedule: false,
      notes: 'Lịch hẹn đã được hủy theo yêu cầu của khách hàng.',
      estimatedCompletion: null
    },
    {
      id: 'ADN123460',
      service: 'Xét nghiệm ADN di trú',
      serviceType: 'administrative',
      date: '2024-02-08',
      time: '08:30',
      status: 'confirmed',
      method: 'at-facility',
      progress: 0,
      price: '5,800,000 VNĐ',
      participants: ['Nguyễn Văn I', 'Nguyễn Thị J'],
      nextAction: 'Chuẩn bị cho lịch hẹn - Mang theo CCCD gốc',
      canCancel: true,
      canReschedule: true,
      notes: 'Vui lòng mang theo CCCD gốc của tất cả người tham gia.',
      estimatedCompletion: '2024-02-13'
    }
  ];

  const getStatusInfo = (status) => {
    switch (status) {
      case 'confirmed':
        return { variant: 'primary', text: 'Đã xác nhận', icon: 'bi-check-circle' };
      case 'in-progress':
        return { variant: 'warning', text: 'Đang thực hiện', icon: 'bi-clock' };
      case 'completed':
        return { variant: 'success', text: 'Hoàn thành', icon: 'bi-check-circle-fill' };
      case 'cancelled':
        return { variant: 'danger', text: 'Đã hủy', icon: 'bi-x-circle' };
      default:
        return { variant: 'secondary', text: 'Không xác định', icon: 'bi-question-circle' };
    }
  };

  const getMethodText = (method) => {
    switch (method) {
      case 'self-sample':
        return { text: 'Tự thu mẫu tại nhà', icon: 'bi-house', color: 'success' };
      case 'home-visit':
        return { text: 'Thu mẫu tại nhà', icon: 'bi-truck', color: 'warning' };
      case 'at-facility':
        return { text: 'Thu mẫu tại cơ sở', icon: 'bi-hospital', color: 'primary' };
      default:
        return { text: method, icon: 'bi-question', color: 'secondary' };
    }
  };

  const filterAppointments = () => {
    let filtered = appointments;

    // Filter by tab
    if (selectedTab !== 'all') {
      filtered = filtered.filter(apt => apt.status === selectedTab);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered.sort((a, b) => new Date(b.date) - new Date(a.date));
  };

  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  const handleRescheduleAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  const confirmCancel = () => {
    // TODO: API call to cancel appointment
    console.log('Cancelling appointment:', selectedAppointment.id);
    setShowCancelModal(false);
    setSelectedAppointment(null);
  };

  const confirmReschedule = () => {
    // TODO: API call to reschedule appointment
    console.log('Rescheduling appointment:', selectedAppointment.id);
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const isUpcoming = (dateString) => {
    return new Date(dateString) > new Date();
  };

  const filteredAppointments = filterAppointments();
  const tabCounts = {
    all: appointments.length,
    confirmed: appointments.filter(apt => apt.status === 'confirmed').length,
    'in-progress': appointments.filter(apt => apt.status === 'in-progress').length,
    completed: appointments.filter(apt => apt.status === 'completed').length,
    cancelled: appointments.filter(apt => apt.status === 'cancelled').length
  };

  return (
    <>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Lịch hẹn của tôi</h2>
              <p className="text-muted mb-0">Quản lý và theo dõi tất cả lịch hẹn xét nghiệm</p>
            </div>
            <div className="d-none d-md-block">
              <Button variant="warning" as={Link} to="/appointment">
                <i className="bi bi-plus-circle me-2"></i>
                Đặt lịch mới
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
            placeholder="Tìm kiếm theo tên dịch vụ, mã đặt lịch hoặc người tham gia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="me-3"
          />
        </Col>
        <Col lg={6} className="mt-3 mt-lg-0">
          <div className="d-flex justify-content-end">
            <Button variant="outline-primary" className="me-2">
              <i className="bi bi-filter me-1"></i>
              Lọc theo ngày
            </Button>
            <Button variant="outline-secondary">
              <i className="bi bi-download me-1"></i>
              Xuất danh sách
            </Button>
          </div>
        </Col>
      </Row>

      {/* Tabs */}
      <Card className="shadow-sm">
        <Tabs
          activeKey={selectedTab}
          onSelect={(k) => setSelectedTab(k)}
          className="border-bottom"
        >
          <Tab
            eventKey="all"
            title={
              <span>
                Tất cả
                <Badge bg="secondary" className="ms-1">{tabCounts.all}</Badge>
              </span>
            }
          />
          <Tab
            eventKey="confirmed"
            title={
              <span>
                Đã xác nhận
                <Badge bg="primary" className="ms-1">{tabCounts.confirmed}</Badge>
              </span>
            }
          />
          <Tab
            eventKey="in-progress"
            title={
              <span>
                Đang thực hiện
                <Badge bg="warning" className="ms-1">{tabCounts['in-progress']}</Badge>
              </span>
            }
          />
          <Tab
            eventKey="completed"
            title={
              <span>
                Hoàn thành
                <Badge bg="success" className="ms-1">{tabCounts.completed}</Badge>
              </span>
            }
          />
          <Tab
            eventKey="cancelled"
            title={
              <span>
                Đã hủy
                <Badge bg="danger" className="ms-1">{tabCounts.cancelled}</Badge>
              </span>
            }
          />
        </Tabs>

        <Card.Body className="p-0">
          {filteredAppointments.length > 0 ? (
            <div className="list-group list-group-flush">
              {filteredAppointments.map((appointment, index) => {
                const statusInfo = getStatusInfo(appointment.status);
                const methodInfo = getMethodText(appointment.method);

                return (
                  <div key={appointment.id} className="list-group-item p-4">
                    <Row>
                      <Col lg={8}>
                        {/* Appointment Header */}
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h5 className="mb-2">
                              {appointment.service}
                              {isUpcoming(appointment.date) && (
                                <Badge bg="info" className="ms-2">Sắp tới</Badge>
                              )}
                            </h5>
                            <div className="d-flex align-items-center gap-3 text-muted mb-2">
                              <span>
                                <i className="bi bi-hash me-1"></i>
                                {appointment.id}
                              </span>
                              <span>
                                <i className="bi bi-calendar me-1"></i>
                                {formatDate(appointment.date)} lúc {appointment.time}
                              </span>
                              <span>
                                <i className={`${methodInfo.icon} me-1`}></i>
                                {methodInfo.text}
                              </span>
                            </div>
                          </div>
                          <div className="text-end">
                            <Badge bg={statusInfo.variant} className="mb-2">
                              <i className={`${statusInfo.icon} me-1`}></i>
                              {statusInfo.text}
                            </Badge>
                            <div className="text-muted small">
                              {appointment.price}
                            </div>
                          </div>
                        </div>

                        {/* Participants */}
                        <div className="mb-3">
                          <strong className="text-muted small">Người tham gia:</strong>
                          <div className="mt-1">
                            {appointment.participants.map((participant, idx) => (
                              <Badge key={idx} bg="light" text="dark" className="me-2">
                                <i className="bi bi-person me-1"></i>
                                {participant}
                              </Badge>
                            ))}
                          </div>
                        </div>

                        {/* Progress */}
                        {appointment.status !== 'cancelled' && (
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="small text-muted">Tiến độ thực hiện</span>
                              <span className="small fw-bold">{appointment.progress}%</span>
                            </div>
                            <ProgressBar
                              now={appointment.progress}
                              variant={appointment.progress === 100 ? 'success' : 'primary'}
                              style={{ height: '6px' }}
                            />
                          </div>
                        )}

                        {/* Next Action */}
                        <Alert variant={appointment.status === 'completed' ? 'success' : 'info'} className="mb-3 py-2">
                          <i className="bi bi-info-circle me-2"></i>
                          <strong>Trạng thái hiện tại:</strong> {appointment.nextAction}
                        </Alert>

                        {/* Notes */}
                        {appointment.notes && (
                          <div className="text-muted small">
                            <i className="bi bi-sticky me-1"></i>
                            {appointment.notes}
                          </div>
                        )}
                      </Col>

                      {/* Actions */}
                      <Col lg={4} className="mt-3 mt-lg-0">
                        <div className="d-grid gap-2">
                          <Button
                            variant="outline-primary"
                            as={Link}
                            to={`/tracking/${appointment.id}`}
                          >
                            <i className="bi bi-eye me-2"></i>
                            Xem chi tiết
                          </Button>

                          {appointment.status === 'completed' && (
                            <Button variant="success" as={Link} to="/user/results">
                              <i className="bi bi-download me-2"></i>
                              Tải kết quả
                            </Button>
                          )}

                          {appointment.canReschedule && (
                            <Button
                              variant="outline-warning"
                              onClick={() => handleRescheduleAppointment(appointment)}
                            >
                              <i className="bi bi-calendar-event me-2"></i>
                              Đổi lịch hẹn
                            </Button>
                          )}

                          {appointment.canCancel && (
                            <Button
                              variant="outline-danger"
                              onClick={() => handleCancelAppointment(appointment)}
                            >
                              <i className="bi bi-x-circle me-2"></i>
                              Hủy lịch hẹn
                            </Button>
                          )}

                          <Button variant="outline-secondary">
                            <i className="bi bi-chat-dots me-2"></i>
                            Hỗ trợ
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
              <i className="bi bi-calendar-x text-muted" style={{ fontSize: '4rem' }}></i>
              <h5 className="text-muted mt-3">
                {searchTerm ? 'Không tìm thấy lịch hẹn nào' : 'Chưa có lịch hẹn nào'}
              </h5>
              <p className="text-muted">
                {searchTerm
                  ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                  : 'Bắt đầu đặt lịch xét nghiệm đầu tiên của bạn'
                }
              </p>
              {!searchTerm && (
                <Button variant="warning" as={Link} to="/appointment">
                  <i className="bi bi-plus-circle me-2"></i>
                  Đặt lịch ngay
                </Button>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Cancel Appointment Modal */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận hủy lịch hẹn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <>
              <Alert variant="warning">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Bạn có chắc chắn muốn hủy lịch hẹn này không?
              </Alert>
              <div className="mb-3">
                <strong>Dịch vụ:</strong> {selectedAppointment.service}
              </div>
              <div className="mb-3">
                <strong>Ngày giờ:</strong> {formatDate(selectedAppointment.date)} lúc {selectedAppointment.time}
              </div>
              <div className="mb-3">
                <strong>Mã đặt lịch:</strong> {selectedAppointment.id}
              </div>
              <Alert variant="info">
                <small>
                  <i className="bi bi-info-circle me-2"></i>
                  Lịch hẹn có thể được hủy miễn phí trước 24 giờ. Sau thời gian này có thể áp dụng phí hủy lịch.
                </small>
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Giữ lịch hẹn
          </Button>
          <Button variant="danger" onClick={confirmCancel}>
            Xác nhận hủy
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Reschedule Modal */}
      <Modal show={showRescheduleModal} onHide={() => setShowRescheduleModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Đổi lịch hẹn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <>
              <Alert variant="info">
                <strong>Lịch hẹn hiện tại:</strong> {selectedAppointment.service}
                <br />
                {formatDate(selectedAppointment.date)} lúc {selectedAppointment.time}
              </Alert>

              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ngày mới</Form.Label>
                      <Form.Control type="date" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Giờ mới</Form.Label>
                      <Form.Select>
                        <option>Chọn giờ...</option>
                        <option value="08:00">08:00</option>
                        <option value="08:30">08:30</option>
                        <option value="09:00">09:00</option>
                        <option value="09:30">09:30</option>
                        <option value="10:00">10:00</option>
                        <option value="10:30">10:30</option>
                        <option value="11:00">11:00</option>
                        <option value="11:30">11:30</option>
                        <option value="13:30">13:30</option>
                        <option value="14:00">14:00</option>
                        <option value="14:30">14:30</option>
                        <option value="15:00">15:00</option>
                        <option value="15:30">15:30</option>
                        <option value="16:00">16:00</option>
                        <option value="16:30">16:30</option>
                        <option value="17:00">17:00</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Lý do đổi lịch</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Vui lòng cho biết lý do đổi lịch hẹn..."
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRescheduleModal(false)}>
            Hủy
          </Button>
          <Button variant="warning" onClick={confirmReschedule}>
            Xác nhận đổi lịch
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default MyAppointments;