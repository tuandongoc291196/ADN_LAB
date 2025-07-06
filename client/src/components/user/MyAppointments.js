import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Badge, Form, Alert, Modal, Tab, Tabs, ProgressBar, Spinner } from 'react-bootstrap';
import { getBookingByUserId, getServiceById } from '../../services/api';
import { METHOD_MAPPING } from '../data/services-data';

const MyAppointments = ({ user }) => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filterDate, setFilterDate] = useState('');
  const [showDatePicker, setShowDatePicker] = useState(false);

  // Fetch appointments from API
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        const data = await getBookingByUserId(user.id);
        setAppointments(data || []);
      } catch (err) {
        console.error('Error fetching appointments:', err);
        setError('Không thể tải danh sách lịch hẹn. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user?.id]);

  // Helper functions
  const getNextAction = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Chuẩn bị cho lịch hẹn';
      case 'in-progress':
        return 'Đang xử lý mẫu tại phòng lab';
      case 'completed':
        return 'Kết quả đã sẵn sàng';
      default:
        return 'Đang chờ xử lý';
    }
  };

  const getNotes = (status) => {
    switch (status) {
      case 'confirmed':
        return 'Lịch hẹn đã được xác nhận. Vui lòng chuẩn bị đầy đủ giấy tờ cần thiết.';
      case 'in-progress':
        return 'Mẫu đã được thu thập thành công. Đang trong quá trình phân tích.';
      case 'completed':
        return 'Xét nghiệm hoàn tất. Kết quả có thể tải về hoặc nhận tại cơ sở.';
      default:
        return 'Lịch hẹn đang được xử lý.';
    }
  };

  const getEstimatedCompletion = (date, status) => {
    if (status === 'completed') return null;
    
    // Validate date
    if (!date || date === '') return null;
    
    try {
      const appointmentDate = new Date(date);
      
      // Check if date is valid
      if (isNaN(appointmentDate.getTime())) {
        return null;
      }
      
      const estimatedDate = new Date(appointmentDate.getTime() + (7 * 24 * 60 * 60 * 1000));
      return estimatedDate.toISOString().split('T')[0];
    } catch (error) {
      console.error('Error calculating estimated completion:', error);
      return null;
    }
  };

  // Transform API data to match component structure
  const transformBookingData = async (booking) => {
    // Extract date and time from timeSlotId (format: "2025-07-13_09:00_10:00")
    const timeSlotId = booking.timeSlotId;
    let date = '';
    let time = '';
    
    if (timeSlotId) {
      try {
        // Parse timeSlotId format: "2025-07-13_09:00_10:00"
        const parts = timeSlotId.split('_');
        if (parts.length >= 2) {
          date = parts[0]; // "2025-07-13"
          time = parts[1]; // "09:00"
        } else {
          // Fallback to old format if needed
          const dateTime = new Date(timeSlotId);
          if (!isNaN(dateTime.getTime())) {
            date = dateTime.toISOString().split('T')[0];
            time = dateTime.toTimeString().split(' ')[0].substring(0, 5);
          }
        }
      } catch (e) {
        console.error('Error parsing timeSlotId:', e, timeSlotId);
      }
    }

    // Determine status based on booking data
    const createdAt = new Date(booking.createdAt);
    const now = new Date();
    
    let isUpcoming = false;
    if (timeSlotId) {
      try {
        // Parse date from timeSlotId format
        const parts = timeSlotId.split('_');
        if (parts.length >= 1) {
          const appointmentDate = new Date(parts[0]);
          isUpcoming = !isNaN(appointmentDate.getTime()) && appointmentDate > now;
        }
      } catch (e) {
        console.error('Error checking if appointment is upcoming:', e);
        isUpcoming = false;
      }
    }
    
    let status = 'confirmed';
    if (isUpcoming) {
      status = 'confirmed';
    } else if (createdAt.getTime() + (7 * 24 * 60 * 60 * 1000) < now.getTime()) {
      status = 'completed';
    } else {
      status = 'in-progress';
    }

    // Determine progress based on status
    let progress = 0;
    switch (status) {
      case 'confirmed':
        progress = 25;
        break;
      case 'in-progress':
        progress = 75;
        break;
      case 'completed':
        progress = 100;
        break;
      default:
        progress = 0;
    }

    // Get service information from nested data
    let serviceName = booking.service?.title || 'Dịch vụ xét nghiệm ADN';
    let serviceType = 'civil'; // default
    let categoryName = 'ADN Dân sự'; // default
    
    // Try to fetch service details if we have serviceId but no category
    if (booking.serviceId && !booking.service?.category) {
      try {
        const serviceDetails = await getServiceById(booking.serviceId);
        
        if (serviceDetails) {
          // Update service name if available
          if (serviceDetails.title) {
            serviceName = serviceDetails.title;
          }
          
          // Determine service type from category data
          // Check multiple possible locations for category data
          const categoryData = serviceDetails.category || serviceDetails.data?.category || serviceDetails.service?.category;
          
          if (categoryData) {
            // Handle both boolean and string values for hasLegalValue
            const hasLegalValue = categoryData.hasLegalValue;
            const isAdministrative = hasLegalValue === true || hasLegalValue === 'true' || hasLegalValue === 1 || hasLegalValue === '1';
            const isCivil = hasLegalValue === false || hasLegalValue === 'false' || hasLegalValue === 0 || hasLegalValue === '0';
            
            if (isAdministrative) {
              serviceType = 'administrative';
              categoryName = categoryData.name || 'ADN Hành chính';
            } else if (isCivil) {
              serviceType = 'civil';
              categoryName = categoryData.name || 'ADN Dân sự';
            } else {
              // Fallback: check category name
              const catName = categoryData.name || '';
              if (catName.toLowerCase().includes('hành chính')) {
                serviceType = 'administrative';
                categoryName = catName;
              } else if (catName.toLowerCase().includes('dân sự')) {
                serviceType = 'civil';
                categoryName = catName;
              }
            }
          }
        }
      } catch (error) {
        console.error('❌ Error fetching service details:', error);
        // Fallback to service name check
        serviceType = serviceName.toLowerCase().includes('hành chính') ? 'administrative' : 'civil';
        categoryName = serviceType === 'administrative' ? 'ADN Hành chính' : 'ADN Dân sự';
      }
    } else if (booking.service?.category) {
      // Use existing category data
      const hasLegalValue = booking.service.category.hasLegalValue;
      const isAdministrative = hasLegalValue === true || hasLegalValue === 'true' || hasLegalValue === 1 || hasLegalValue === '1';
      const isCivil = hasLegalValue === false || hasLegalValue === 'false' || hasLegalValue === 0 || hasLegalValue === '0';
      
      if (isAdministrative) {
        serviceType = 'administrative';
        categoryName = booking.service.category.name || 'ADN Hành chính';
      } else if (isCivil) {
        serviceType = 'civil';
        categoryName = booking.service.category.name || 'ADN Dân sự';
      } else {
        // Fallback: check category name
        const catName = booking.service.category.name || '';
        if (catName.toLowerCase().includes('hành chính')) {
          serviceType = 'administrative';
          categoryName = catName;
        } else if (catName.toLowerCase().includes('dân sự')) {
          serviceType = 'civil';
          categoryName = catName;
        }
      }
    } else {
      // Fallback: check service name
      serviceType = serviceName.toLowerCase().includes('hành chính') ? 'administrative' : 'civil';
      categoryName = serviceType === 'administrative' ? 'ADN Hành chính' : 'ADN Dân sự';
    }

    // Get method information from nested data
    const methodName = booking.method?.name || 'Phương thức lấy mẫu';
    const methodId = booking.methodId?.toString() || '';

    // Get staff information from nested data
    const staffName = booking.staff?.user?.fullname || `Nhân viên ${booking.staffId}`;

    // Get participants from nested data
    const participants = booking.participants_on_booking || [];



    return {
      id: booking.id,
      service: serviceName,
      serviceType: serviceType,
      categoryName: categoryName, // Add category name for display
      method: methodName,
      methodId: methodId,
      staff: staffName,
      date: date,
      time: time,
      price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalAmount),
      status: status,
      progress: progress,
      participants: participants,
      canCancel: status === 'confirmed',
      canReschedule: status === 'confirmed',
      nextAction: getNextAction(status),
      notes: getNotes(status),
      estimatedCompletion: getEstimatedCompletion(date, status)
    };
  };

  // Transform all appointments - handle async transformation
  const [transformedAppointments, setTransformedAppointments] = useState([]);
  
  useEffect(() => {
    const transformAllAppointments = async () => {
      if (appointments.length === 0) {
        setTransformedAppointments([]);
        return;
      }
      
      try {
        const transformed = await Promise.all(appointments.map(transformBookingData));
        setTransformedAppointments(transformed);
      } catch (error) {
        console.error('Error transforming appointments:', error);
        setTransformedAppointments([]);
      }
    };
    
    transformAllAppointments();
  }, [appointments]);

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



  const getMethodIcon = (methodId) => {
    return METHOD_MAPPING[String(methodId)]?.icon || 'bi-gear';
  };

  const filterAppointments = () => {
    let filtered = transformedAppointments;

    // Filter by tab
    if (selectedTab !== 'all') {
      filtered = filtered.filter(apt => apt.status === selectedTab);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (apt.participants && apt.participants.some(p => 
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.relationship && p.relationship.toLowerCase().includes(searchTerm.toLowerCase()) && p.relationship !== 'Chưa xác định')
        ))
      );
    }

    // Filter by date
    if (filterDate) {
      filtered = filtered.filter(apt => apt.date === filterDate);
    }

    // Sort by date with error handling
    return filtered.sort((a, b) => {
      try {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);
        
        // Handle invalid dates
        if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;
        
        return dateB - dateA;
      } catch (error) {
        console.error('Error sorting appointments:', error);
        return 0;
      }
    });
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
    if (!dateString || dateString === '') return 'Chưa xác định';
    
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Chưa xác định';
      }
      
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('vi-VN', options);
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'Chưa xác định';
    }
  };

  const isUpcoming = (dateString) => {
    if (!dateString || dateString === '') return false;
    
    try {
      const date = new Date(dateString);
      return !isNaN(date.getTime()) && date > new Date();
    } catch (error) {
      console.error('Error checking if date is upcoming:', error);
      return false;
    }
  };

  const filteredAppointments = filterAppointments();
  const tabCounts = {
    all: transformedAppointments.length,
    confirmed: transformedAppointments.filter(apt => apt.status === 'confirmed').length,
    'in-progress': transformedAppointments.filter(apt => apt.status === 'in-progress').length,
    completed: transformedAppointments.filter(apt => apt.status === 'completed').length,
    cancelled: transformedAppointments.filter(apt => apt.status === 'cancelled').length
  };

  return (
    <>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-1">
            <h2 className="mb-1" style={{textAlign: 'left'}}>
              Lịch hẹn của tôi
            </h2>
          </div>
          <p className="text-muted mb-0" style={{textAlign: 'left'}}>Quản lý và theo dõi tất cả lịch hẹn xét nghiệm</p>
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
            <div style={{ position: 'relative', display: 'inline-block' }}>
              <Button
                variant="outline-primary"
                className="me-2"
                onClick={() => setShowDatePicker(!showDatePicker)}
              >
                <i className="bi bi-filter me-1"></i>
                Lọc theo ngày
              </Button>
              {showDatePicker && (
                <input
                  type="date"
                  value={filterDate}
                  autoFocus
                  onChange={e => setFilterDate(e.target.value)}
                  onBlur={() => setShowDatePicker(false)}
                  style={{
                    position: 'absolute',
                    top: '100%',
                    left: 0,
                    zIndex: 10,
                    background: '#fff',
                    border: '1px solid #ccc',
                    borderRadius: 6,
                    padding: '4px 8px',
                    marginTop: 4,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
                  }}
                />
              )}
            </div>
            <Button variant="warning" as={Link} to="/appointment">
              <i className="bi bi-plus-circle me-2"></i>
              Đặt lịch mới
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
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : error ? (
            <div className="text-center py-5">
              <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '4rem' }}></i>
              <h5 className="text-danger mt-3">
                {error}
              </h5>
              <p className="text-muted">
                Vui lòng thử lại sau.
              </p>
            </div>
          ) : filteredAppointments.length > 0 ? (
            <div className="list-group list-group-flush">
              {filteredAppointments.map((appointment, index) => {
                const statusInfo = getStatusInfo(appointment.status);

                console.log('Participants:', appointment.participants);

                return (
                  <div key={appointment.id} className="list-group-item p-4">
                    <Row>
                      <Col lg={8}>
                        {/* Appointment Header */}
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h5 className="mb-2 d-flex align-items-center" style={{gap: 8}}>
                              <span className={`badge ${appointment.serviceType === 'administrative' ? 'bg-warning text-dark' : 'bg-success'}`} style={{borderRadius: '8px', padding: '6px 12px', fontWeight: 500}}>
                                {appointment.categoryName}
                              </span>
                              <span style={{fontWeight: 500, fontSize: 18}}>{appointment.service}</span>
                            </h5>
                            <div className="d-flex align-items-center gap-3 text-muted mb-2">
                              <span className="text-muted small">
                                <i className="bi bi-hash me-1"></i>
                                {appointment.id}
                              </span>
                              <span className="text-muted small">
                                <i className="bi bi-calendar me-1"></i>
                                {formatDate(appointment.date)} lúc {appointment.time}
                              </span>
                              <span className="text-muted small">
                                <i className={`${getMethodIcon(appointment.methodId) + ' me-1'}`}></i>
                                {appointment.method}
                              </span>
                              <span className="text-muted small">
                                <i className="bi bi-person-badge me-1"></i>
                                {appointment.staff}
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
                          <strong className="text-muted small" style={{textAlign: 'left', display: 'block'}}>Người tham gia:</strong>
                          <div className="mt-1">
                            {appointment.participants && appointment.participants.length > 0 ? (
                              <table className="table table-bordered table-sm mt-2" style={{maxWidth: 600}}>
                                <thead>
                                  <tr className="text-muted small">
                                    <th>Tên</th>
                                    <th>Tuổi</th>
                                    <th>Quan hệ nghi ngờ</th>
                                    <th>Giới tính</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {appointment.participants.map((participant, idx) => (
                                    <tr key={idx} className="text-muted small">
                                      <td style={{fontWeight: 500}}>{participant.name}</td>
                                      <td>{participant.age}</td>
                                      <td>{participant.relationship || 'Chưa xác định'}</td>
                                      <td>{participant.gender === 'male' ? 'Nam' : participant.gender === 'female' ? 'Nữ' : 'Khác'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <span className="text-muted small">
                                <i className="bi bi-info-circle me-1"></i>
                                Chưa có thông tin người tham gia
                              </span>
                            )}
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