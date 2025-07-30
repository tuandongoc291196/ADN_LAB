import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Badge, Form, Alert, Modal, Tab, Tabs, ProgressBar, Spinner } from 'react-bootstrap';
import { getBookingByUserId, addBookingHistory } from '../../services/api';
import { METHOD_MAPPING } from '../data/services-data';
import Swal from 'sweetalert2';

const MyAppointments = ({ user }) => {
  const [selectedTab, setSelectedTab] = useState('all');
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [showRescheduleModal, setShowRescheduleModal] = useState(false);
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState('all'); // all, 1week, 1month, 3months, 6months, 12months
  const [statusFilter, setStatusFilter] = useState('all'); // all, confirmed, in-progress, completed, cancelled
  const [showReceiveModal, setShowReceiveModal] = useState(false);
  const [selectedReceiveAppointmentId, setSelectedReceiveAppointmentId] = useState(null);
  const [showSelfCollectModal, setShowSelfCollectModal] = useState(false);
  const [selectedSelfCollectAppointmentId, setSelectedSelfCollectAppointmentId] = useState(null);
  const [showSendSampleModal, setShowSendSampleModal] = useState(false);
  const [selectedSendSampleAppointmentId, setSelectedSendSampleAppointmentId] = useState(null);
  const [description, setDescription] = useState('');
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
  const getNextAction = (status, latestHistoryStatus) => {
    if (latestHistoryStatus === 'COMPLETED') {
      return 'Kết quả đã sẵn sàng';
    }
    
    switch (latestHistoryStatus) {
      case 'KIT_SENT':
        return 'Kit đã được gửi - Vui lòng xác nhận khi nhận được';
      case 'KIT_RECEIVED':
        return 'Kit đã nhận - Vui lòng tự thu mẫu theo hướng dẫn';
      case 'SELF_COLLECTED':
        return 'Đã tự thu mẫu - Vui lòng gửi mẫu về phòng lab';
      case 'KIT_RETURNED':
        return 'Mẫu đã gửi về - Đang chờ phân tích';
      case 'SAMPLE_RECEIVED':
        return 'Mẫu đã nhận tại lab - Đang xử lý';
      case 'SAMPLE_COLLECTED':
        return 'Mẫu đã thu thập - Đang phân tích';
      case 'RESULT_PENDING':
        return 'Đang phân tích mẫu - Kết quả sắp có';
      default:
        return 'Chuẩn bị cho lịch hẹn';
    }
  };

  const getNotes = (status, latestHistoryStatus) => {
    if (latestHistoryStatus === 'COMPLETED') {
      return 'Xét nghiệm hoàn tất. Kết quả có thể tải về hoặc nhận tại cơ sở.';
    }
    
    switch (latestHistoryStatus) {
      case 'KIT_SENT':
        return 'Kit xét nghiệm đã được gửi đến địa chỉ của bạn. Vui lòng xác nhận khi nhận được.';
      case 'KIT_RECEIVED':
        return 'Bạn đã nhận kit xét nghiệm. Vui lòng tự thu mẫu theo hướng dẫn kèm theo.';
      case 'SELF_COLLECTED':
        return 'Bạn đã tự thu mẫu thành công. Vui lòng gửi mẫu về phòng lab theo hướng dẫn.';
      case 'KIT_RETURNED':
        return 'Mẫu đã được gửi về phòng lab. Chúng tôi sẽ tiến hành phân tích.';
      case 'SAMPLE_RECEIVED':
        return 'Mẫu đã được nhận tại phòng lab và đang được xử lý.';
      case 'SAMPLE_COLLECTED':
        return 'Mẫu đã được thu thập thành công. Đang trong quá trình phân tích.';
      case 'RESULT_PENDING':
        return 'Mẫu đang được phân tích tại phòng lab. Kết quả sẽ sớm có.';
      default:
        return 'Lịch hẹn đã được xác nhận. Vui lòng chuẩn bị đầy đủ giấy tờ cần thiết.';
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

  // Get timeline for method (same as OrderTracking.js)
  const getTimelineForMethod = (method) => {
    if (!method || !method.id) return ['CREATED', 'PENDING_PAYMENT', 'BOOKED', 'SAMPLE_COLLECTED', 'RESULT_PENDING', 'COMPLETED'];
    
    const methodId = method.id;
    const methodName = method.name?.toLowerCase() || '';
    
    // Self-sample method (tự thu mẫu tại nhà)
    if (methodId === '0' || methodName.includes('tự') || methodName.includes('self') || methodName.includes('kit')) {
      return [
        'CREATED',
        'PENDING_PAYMENT', 
        'BOOKED',
        'KIT_PREPARED',
        'KIT_SENT',
        'KIT_RECEIVED',
        'SELF_COLLECTED',
        'SAMPLE_RECEIVED',
        'SAMPLE_COLLECTED',
        'RESULT_PENDING',
        'COMPLETED'
      ];
    }
    
    // Home-visit method (nhân viên tới nhà)
    if (methodId === '1' || methodName.includes('tại nhà') || methodName.includes('home') || methodName.includes('visit')) {
      return [
        'CREATED',
        'PENDING_PAYMENT',
        'BOOKED',
        'STAFF_ASSIGNED',
        'SAMPLE_RECEIVED',
        'SAMPLE_COLLECTED',
        'RESULT_PENDING',
        'COMPLETED'
      ];
    }
    
    // Lab-visit method (lấy mẫu tại lab/cơ sở)
    if (methodId === '2' || methodName.includes('tại lab') || methodName.includes('cơ sở') || methodName.includes('lab') || methodName.includes('facility')) {
      return [
        'CREATED',
        'PENDING_PAYMENT',
        'BOOKED',
        'SAMPLE_RECEIVED',
        'SAMPLE_COLLECTED',
        'RESULT_PENDING',
        'COMPLETED'
      ];
    }
    
    // Default timeline if no match
    return ['CREATED', 'PENDING_PAYMENT', 'BOOKED', 'SAMPLE_COLLECTED', 'RESULT_PENDING', 'COMPLETED'];
  };

  // Calculate progress based on booking history and timeline
  const calculateProgress = (booking) => {
    if (!booking || !booking.method) return 0;

    const fullTimelineSteps = getTimelineForMethod(booking.method);
    const history = booking.bookingHistories_on_booking?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) || [];
    const completedStatuses = history.map(h => h.status);
    const currentStatus = history.length > 0 ? history.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))[0].status : null;
    
    // Calculate progress based on the current status
    let progress = 0;
    const currentStepIndex = fullTimelineSteps.indexOf(currentStatus);
    
    if (currentStepIndex !== -1) {
      progress = ((currentStepIndex + 1) / fullTimelineSteps.length) * 100;
    } else if (currentStatus) {
      // Find the nearest status in our timeline that comes after the current status
      const allStatuses = ['CREATED', 'PENDING_PAYMENT', 'BOOKED', 'KIT_PREPARED', 'KIT_SENT', 'KIT_RECEIVED', 'SELF_COLLECTED', 'STAFF_ASSIGNED', 'SAMPLE_RECEIVED', 'SAMPLE_COLLECTED', 'RESULT_PENDING', 'COMPLETED'];
      const currentStatusIndex = allStatuses.indexOf(currentStatus);
      
      // Find the next displayed status after the current one
      for (let i = 0; i < fullTimelineSteps.length; i++) {
        const timelineStatusIndex = allStatuses.indexOf(fullTimelineSteps[i]);
        if (timelineStatusIndex > currentStatusIndex) {
          progress = (i / fullTimelineSteps.length) * 100;
          break;
        }
      }
    }

    return Math.round(progress);
  };

  // Transform API data to match component structure
  const transformBookingData = (booking) => {
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

    // Determine status based on booking history
    const history = booking.bookingHistories_on_booking?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];
    const currentHistoryStatus = history.length > 0 ? history[0].status : null;
    
    let status = 'confirmed'; // default status
    let isUpcoming = false;
    
    if (timeSlotId) {
      try {
        // Parse date from timeSlotId format
        const parts = timeSlotId.split('_');
        if (parts.length >= 1) {
          const appointmentDate = new Date(parts[0]);
          isUpcoming = !isNaN(appointmentDate.getTime()) && appointmentDate > new Date();
        }
      } catch (e) {
        console.error('Error checking if appointment is upcoming:', e);
        isUpcoming = false;
      }
    }

    // Determine status based on current history status
    if (currentHistoryStatus) {
      if (currentHistoryStatus === 'COMPLETED') {
        status = 'completed';
      } else if (['SAMPLE_COLLECTED', 'SAMPLE_PROCESSING', 'RESULT_PENDING', 'KIT_RETURNED', 'SAMPLE_RECEIVED'].includes(currentHistoryStatus)) {
        status = 'in-progress';
      } else if (['CREATED', 'PENDING_PAYMENT', 'BOOKED', 'KIT_PREPARED', 'KIT_SENT', 'KIT_RECEIVED', 'SELF_COLLECTED', 'STAFF_ASSIGNED'].includes(currentHistoryStatus)) {
        status = 'confirmed';
      } else if (currentHistoryStatus === 'CANCELLED') {
        status = 'cancelled';
      }
    } else {
      // Fallback to time-based status if no history
      const createdAt = new Date(booking.createdAt);
      const now = new Date();
      
      if (isUpcoming) {
        status = 'confirmed';
      } else if (createdAt.getTime() + (7 * 24 * 60 * 60 * 1000) < now.getTime()) {
        status = 'completed';
      } else {
        status = 'in-progress';
      }
    }

    // Calculate progress based on booking history and timeline
    const progress = calculateProgress(booking);

    // Get service information from nested data (new API structure with category included)
    const serviceName = booking.service?.title || 'Dịch vụ xét nghiệm ADN';
    let serviceType = 'civil'; // default
    let categoryName = 'ADN Dân sự'; // default

    // Use category data directly from booking.service.category (new API structure)
    if (booking.service?.category) {
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
      // Fallback: check service name (for backward compatibility)
      serviceType = serviceName.toLowerCase().includes('hành chính') ? 'administrative' : 'civil';
      categoryName = serviceType === 'administrative' ? 'ADN Hành chính' : 'ADN Dân sự';
    }

    // Get method information from nested data
    const methodName = booking.method?.name || 'Phương thức lấy mẫu';
    const methodId = booking.methodId?.toString() || '';

    // Get staff information from nested data
    const staffName = booking.staff?.user?.fullname || `Nhân viên ${booking.staffId}`;
    const bookingHistories = Array.isArray(booking.bookingHistories_on_booking)
      ? booking.bookingHistories_on_booking
      : [];

    const sortedHistories = [...bookingHistories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const latestHistoryStatus = sortedHistories[0]?.status || '';

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
      nextAction: getNextAction(status, latestHistoryStatus),
      notes: getNotes(status, latestHistoryStatus),
      estimatedCompletion: getEstimatedCompletion(date, status),
      latestHistoryStatus: latestHistoryStatus
    };
  };

  const updateBookingStatusLocally = (bookingId, status, description) => {
    setAppointments(prev =>
      prev.map(booking =>
        booking.id === bookingId
          ? {
            ...booking,
            bookingHistories_on_booking: [
              ...booking.bookingHistories_on_booking,
              {
                status,
                description,
                createdAt: new Date().toISOString()
              }
            ]
          }
          : booking
      )
    );
  };
  // Transform all appointments - handle async transformation
  const [transformedAppointments, setTransformedAppointments] = useState([]);

  useEffect(() => {
    if (appointments.length === 0) {
      setTransformedAppointments([]);
      return;
    }

    try {
      const transformed = appointments.map(transformBookingData);
      setTransformedAppointments(transformed);
    } catch (error) {
      console.error('Error transforming appointments:', error);
      setTransformedAppointments([]);
    }
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

    // Filter by time range
    if (timeFilter !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();

      switch (timeFilter) {
        case '1week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case '1month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case '6months':
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case '12months':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }

      filtered = filtered.filter(apt => {
        try {
          const appointmentDate = new Date(apt.date);
          return !isNaN(appointmentDate.getTime()) && appointmentDate >= cutoffDate;
        } catch (error) {
          return false;
        }
      });
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
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
            <h2 className="mb-1" style={{ textAlign: 'left' }}>
              Lịch hẹn của tôi
            </h2>
          </div>
          <p className="text-muted mb-0" style={{ textAlign: 'left' }}>Quản lý và theo dõi tất cả lịch hẹn xét nghiệm</p>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-2">
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tên dịch vụ, mã đặt lịch hoặc người tham gia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        <Col lg={3} md={6} className="mb-2">
          <Form.Select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            style={{ height: '38px' }}
          >
            <option value="all">Tất cả thời gian</option>
            <option value="1week">1 tuần qua</option>
            <option value="1month">1 tháng qua</option>
            <option value="3months">3 tháng qua</option>
            <option value="6months">6 tháng qua</option>
            <option value="12months">12 tháng qua</option>
          </Form.Select>
        </Col>
        <Col lg={3} md={6} className="mb-2">
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ height: '38px' }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="in-progress">Đang thực hiện</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </Form.Select>
        </Col>
        <Col lg={3} md={6} className="mb-2">
          <div className="d-flex justify-content-end">
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
                            <h5 className="mb-2 d-flex align-items-center" style={{ gap: 8 }}>
                              <span className={`badge ${appointment.serviceType === 'administrative' ? 'bg-warning text-dark' : 'bg-success'}`} style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: 500 }}>
                                {appointment.categoryName}
                              </span>
                              <span style={{ fontWeight: 500, fontSize: 18 }}>{appointment.service}</span>
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
                          <strong className="text-muted small" style={{ textAlign: 'left', display: 'block' }}>Người tham gia:</strong>
                          <div className="mt-1">
                            {appointment.participants && appointment.participants.length > 0 ? (
                              <table className="table table-bordered table-sm mt-2" style={{ maxWidth: 600 }}>
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
                                      <td style={{ fontWeight: 500 }}>{participant.name}</td>
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
                              variant={appointment.progress === 100 ? 'success' : appointment.progress > 50 ? 'warning' : 'primary'}
                              style={{ height: '6px' }}
                            />
                            {appointment.progress === 0 && (
                              <small className="text-muted">
                                <i className="bi bi-info-circle me-1"></i>
                                Chưa bắt đầu xử lý
                              </small>
                            )}
                            {appointment.progress > 0 && appointment.progress < 100 && (
                              <small className="text-muted">
                                <i className="bi bi-clock me-1"></i>
                                Đang trong quá trình xử lý
                              </small>
                            )}
                            {appointment.progress === 100 && (
                              <small className="text-success">
                                <i className="bi bi-check-circle me-1"></i>
                                Hoàn thành
                              </small>
                            )}
                          </div>
                        )}

                        {/* Next Action */}
                        <Alert variant={
                          appointment.status === 'completed' ? 'success' : 
                          appointment.latestHistoryStatus === 'KIT_SENT' || appointment.latestHistoryStatus === 'KIT_RECEIVED' ? 'warning' :
                          appointment.latestHistoryStatus === 'SELF_COLLECTED' || appointment.latestHistoryStatus === 'KIT_RETURNED' ? 'primary' :
                          'info'
                        } className="mb-3 py-2">
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
                          {appointment.latestHistoryStatus === 'KIT_SENT' && (
                            <>
                              <Alert variant="info" className="py-2">
                                <i className="bi bi-truck me-2"></i>
                                <strong>Kit đã đến nơi!</strong>
                              </Alert>
                              <Button
                                variant="success"
                                onClick={() => {
                                  setSelectedReceiveAppointmentId(appointment.id);
                                  setShowReceiveModal(true);
                                }}
                              >
                                <i className="bi bi-box-arrow-in-down me-2"></i>
                                Đã nhận kit
                              </Button>

                            </>
                          )}
                          {appointment.latestHistoryStatus === 'KIT_RECEIVED' && (
                            <>
                              <Alert variant="success" className="py-2">
                                <i className="bi bi-box-arrow-in-down me-2"></i>
                                <strong>Đã nhận kit thành công!</strong>
                              </Alert>
                              <Button
                                variant="warning"
                                onClick={() => {
                                  setSelectedSelfCollectAppointmentId(appointment.id);
                                  setShowSelfCollectModal(true);
                                }}
                              >
                                <i className="bi bi-check2-circle me-2"></i>
                                Tự thu mẫu
                              </Button>
                            </>
                          )}
                          {appointment.latestHistoryStatus === 'SELF_COLLECTED' && (
                            <>
                              <Alert variant="info" className="py-2">
                                <i className="bi bi-hourglass-split me-2"></i>
                                <strong>Bạn đã tự thu mẫu</strong><br />
                                Vui lòng gửi mẫu về phòng lab theo hướng dẫn.
                              </Alert>
                              <Button
                                variant="primary"
                                onClick={() => {
                                  setSelectedSendSampleAppointmentId(appointment.id);
                                  setShowSendSampleModal(true);
                                }}
                              >
                                <i className="bi bi-send-check me-2"></i>
                                Gửi lại kit
                              </Button>
                            </>
                          )}
                          {appointment.latestHistoryStatus === 'KIT_RETURNED' && (
                            <Alert variant="info" className="py-2">
                              <i className="bi bi-activity me-2"></i>
                              <strong>Mẫu của bạn đang được phân tích</strong><br />
                              Chúng tôi đã nhận được mẫu xét nghiệm và đang tiến hành xử lý. Kết quả sẽ sớm có.
                            </Alert>
                          )}
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
      <Modal show={showReceiveModal} onHide={() => setShowReceiveModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận đã nhận kit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <i className="bi bi-truck me-2"></i>
            <strong>Kit đã được giao đến địa chỉ của bạn.</strong><br />
            Vui lòng xác nhận để chúng tôi có thể theo dõi tiến độ xét nghiệm chính xác hơn.
          </Alert>
          <Form.Group className="mt-3">
            <Form.Label>Mô tả thông tin(bắt buộc)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ví dụ: Đã nhận kit từ bưu tá Giao hàng nhanh lúc 9h sáng"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReceiveModal(false)}>Đóng</Button>
          <Button
            variant="success"
            disabled={!description.trim()}
            onClick={async () => {
              try {
                await addBookingHistory({
                  bookingId: selectedReceiveAppointmentId,
                  status: 'KIT_RECEIVED',
                  description
                });
                updateBookingStatusLocally(selectedReceiveAppointmentId, 'KIT_RECEIVED', description);
                Swal.fire({
                  icon: 'success',
                  title: 'Xác nhận thành công!',
                  text: 'Chúng tôi đã ghi nhận thông tin.',
                  confirmButtonColor: '#198754'
                });
                setShowReceiveModal(false);
                setDescription('');
              } catch (err) {
                Swal.fire({
                  icon: 'error',
                  title: 'Lỗi!',
                  text: 'Không thể xác nhận. Vui lòng thử lại.',
                  confirmButtonColor: '#d33'
                });
              }
            }}
          >
            <i className="bi bi-check-circle me-2"></i>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showSelfCollectModal}
        onHide={() => setShowSelfCollectModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận tự thu mẫu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <i className="bi bi-droplet me-2"></i>
            <strong>Bạn đã tự thu mẫu thành công?</strong><br />
            Vui lòng xác nhận để chúng tôi sắp xếp tiếp nhận và phân tích mẫu xét nghiệm.
          </Alert>
          <Form.Group className="mt-3">
            <Form.Label>Mô tả thông tin(bắt buộc)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ví dụ: Đã nhận kit từ bưu tá Giao hàng nhanh lúc 9h sáng"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSelfCollectModal(false)}>
            Đóng
          </Button>
          <Button
            variant="success"
            onClick={async () => {
              try {
                await addBookingHistory({
                  bookingId: selectedSelfCollectAppointmentId,
                  status: 'SELF_COLLECTED',
                  description
                });
                updateBookingStatusLocally(selectedSelfCollectAppointmentId, 'SELF_COLLECTED', description);
                Swal.fire({
                  icon: 'success',
                  title: 'Đã xác nhận tự thu mẫu!',
                  text: 'Hãy đảm bảo gửi mẫu về trung tâm đúng hướng dẫn.',
                  confirmButtonColor: '#198754'
                });
                setShowSelfCollectModal(false);
                setDescription('');
              } catch (error) {
                Swal.fire({
                  icon: 'error',
                  title: 'Lỗi',
                  text: 'Không thể xác nhận. Vui lòng thử lại.',
                  confirmButtonColor: '#d33'
                });
              }
            }}
          >
            <i className="bi bi-check-circle me-2"></i>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
      <Modal
        show={showSendSampleModal}
        onHide={() => setShowSendSampleModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận đã gửi mẫu về phòng lab</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="primary">
            <i className="bi bi-truck me-2"></i>
            <strong>Bạn đã gửi mẫu về trung tâm xét nghiệm?</strong><br />
            Vui lòng xác nhận để chúng tôi tiến hành tiếp nhận và phân tích mẫu.
          </Alert>
          <Form.Group className="mt-3">
            <Form.Label>Mô tả thông tin(bắt buộc)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ví dụ: Đã nhận kit từ bưu tá Giao hàng nhanh lúc 9h sáng"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSendSampleModal(false)}>
            Đóng
          </Button>
          <Button
            variant="success"
            onClick={async () => {
              try {
                await addBookingHistory({
                  bookingId: selectedSendSampleAppointmentId,
                  status: 'KIT_RETURNED',
                  description
                });
                updateBookingStatusLocally(selectedSendSampleAppointmentId, 'KIT_RETURNED', description);
                Swal.fire({
                  icon: 'success',
                  title: 'Đã xác nhận gửi mẫu!',
                  text: 'Chúng tôi sẽ tiến hành xét nghiệm.',
                  confirmButtonColor: '#198754'
                });
                setShowSendSampleModal(false);
                setDescription('');
              } catch (error) {
                Swal.fire({
                  icon: 'error',
                  title: 'Lỗi',
                  text: 'Không thể xác nhận. Vui lòng thử lại.',
                  confirmButtonColor: '#d33'
                });
              }
            }}
          >
            <i className="bi bi-check-circle me-2"></i>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default MyAppointments;