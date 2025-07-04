import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Badge, ProgressBar, Spinner } from 'react-bootstrap';
import ResultsSummary from './ResultsSummary';
import { getBookingByUserId } from '../../services/api';

const DashboardOverview = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({ total: 0, completed: 0, inProgress: 0 });

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
        // Count status
        let completed = 0, inProgress = 0;
        (data || []).forEach(b => {
          // Logic phân loại status giống MyAppointments
          const createdAt = new Date(b.createdAt);
          const now = new Date();
          let isUpcoming = false;
          if (b.timeSlotId) {
            const parts = b.timeSlotId.split('_');
            if (parts.length >= 1) {
              const appointmentDate = new Date(parts[0]);
              isUpcoming = !isNaN(appointmentDate.getTime()) && appointmentDate > now;
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
          if (status === 'completed') completed++;
          if (status === 'in-progress') inProgress++;
        });
        setCounts({ total: (data || []).length, completed, inProgress });
      } catch (err) {
        setError('Không thể tải danh sách lịch hẹn. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };
    fetchAppointments();
  }, [user?.id]);

  // Lấy 2 lịch hẹn gần nhất (theo createdAt mới nhất)
  const sortedAppointments = [...appointments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recentAppointments = sortedAppointments.slice(0, 2).map(b => {
    // Parse timeSlotId
    let date = '', time = '';
    if (b.timeSlotId) {
      const parts = b.timeSlotId.split('_');
      if (parts.length >= 2) {
        date = parts[0];
        time = parts[1];
      }
    }
    // Status logic
    const createdAt = new Date(b.createdAt);
    const now = new Date();
    let isUpcoming = false;
    if (b.timeSlotId) {
      const parts = b.timeSlotId.split('_');
      if (parts.length >= 1) {
        const appointmentDate = new Date(parts[0]);
        isUpcoming = !isNaN(appointmentDate.getTime()) && appointmentDate > now;
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
    // Progress
    let progress = 0;
    switch (status) {
      case 'confirmed': progress = 25; break;
      case 'in-progress': progress = 75; break;
      case 'completed': progress = 100; break;
      default: progress = 0;
    }
    // Next action
    let nextAction = 'Đang chờ xử lý';
    if (status === 'confirmed') nextAction = 'Chuẩn bị cho lịch hẹn';
    if (status === 'in-progress') nextAction = 'Đang xử lý mẫu tại phòng lab';
    if (status === 'completed') nextAction = 'Kết quả đã sẵn sàng';
    return {
      id: b.id,
      service: b.serviceId || 'Dịch vụ',
      date,
      time,
      status,
      method: b.methodId,
      progress,
      nextAction
    };
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'confirmed':
        return <Badge bg="primary">Đã xác nhận</Badge>;
      case 'completed':
        return <Badge bg="success">Hoàn thành</Badge>;
      case 'in-progress':
        return <Badge bg="warning">Đang thực hiện</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  const getMethodText = (method) => {
    switch (method) {
      case 'self-sample':
        return 'Tự thu mẫu';
      case 'home-visit':
        return 'Thu mẫu tại nhà';
      case 'at-facility':
        return 'Thu mẫu tại cơ sở';
      default:
        return method;
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'short', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <>
      {/* Welcome Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Chào mừng trở lại, {(user && user.name && typeof user.name === 'string') ? user.name.split(' ').pop() : ''}! 👋</h2>
              <p className="text-muted mb-0">Đây là tổng quan về các hoạt động xét nghiệm của bạn</p>
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

      {/* Tổng quan số lượng lịch hẹn */}
      <Row className="mb-3">
        <Col md={4} className="mb-2">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Tổng lịch hẹn</h6>
              <h3 className="fw-bold mb-0">{loading ? <Spinner size="sm" /> : counts.total}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-2">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Đã hoàn thành</h6>
              <h3 className="fw-bold mb-0">{loading ? <Spinner size="sm" /> : counts.completed}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-2">
          <Card className="text-center shadow-sm">
            <Card.Body>
              <h6 className="text-muted">Chờ kết quả</h6>
              <h3 className="fw-bold mb-0">{loading ? <Spinner size="sm" /> : counts.inProgress}</h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Results Summary */}
      <ResultsSummary user={user} />

      {/* Recent Appointments */}
      <Row className="mt-4">
        <Col lg={8} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-calendar-event me-2 text-primary"></i>
                  Lịch hẹn sắp tới
                </h5>
                <Button variant="outline-primary" size="sm" as={Link} to="/user/appointments">
                  Xem tất cả
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {loading ? (
                <div className="text-center py-5"><Spinner /></div>
              ) : recentAppointments.length > 0 ? (
                <div className="list-group list-group-flush">
                  {recentAppointments.map((appointment, index) => (
                    <div key={appointment.id} className="list-group-item px-4 py-3">
                      <div className="d-flex justify-content-between align-items-start">
                        <div className="flex-grow-1">
                          <div className="d-flex align-items-center mb-2">
                            <h6 className="mb-0 me-3">{appointment.service}</h6>
                            {getStatusBadge(appointment.status)}
                          </div>
                          <div className="text-muted small mb-2">
                            <i className="bi bi-calendar me-1"></i>
                            {formatDate(appointment.date)} lúc {appointment.time}
                            <span className="mx-2">•</span>
                            <i className="bi bi-geo-alt me-1"></i>
                            {getMethodText(appointment.method)}
                          </div>
                          {/* Progress Bar */}
                          <div className="mb-2">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <small className="text-muted">{appointment.nextAction}</small>
                              <small className="fw-bold">{appointment.progress}%</small>
                            </div>
                            <ProgressBar
                              now={appointment.progress}
                              variant={appointment.progress === 100 ? 'success' : appointment.progress > 50 ? 'warning' : 'primary'}
                              style={{ height: '6px' }}
                            />
                          </div>
                        </div>
                        <div className="ms-3">
                          <Button
                            variant="outline-primary"
                            size="sm"
                            as={Link}
                            to={`/tracking/${appointment.id}`}
                          >
                            <i className="bi bi-eye me-1"></i>
                            Chi tiết
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-5">
                  <i className="bi bi-calendar-x text-muted" style={{ fontSize: '3rem' }}></i>
                  <h6 className="text-muted mt-3">Không có lịch hẹn sắp tới</h6>
                  <Button variant="primary" as={Link} to="/appointment">
                    Đặt lịch đầu tiên
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Quick Actions */}
      <Row>
        <Col>
          <Card className="border-0 shadow-sm bg-light">
            <Card.Body className="py-3">
              <Row className="align-items-center">
                <Col md={8}>
                  <h6 className="mb-1">Cần hỗ trợ hoặc có thắc mắc?</h6>
                  <p className="text-muted small mb-0">
                    Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn 24/7
                  </p>
                </Col>
                <Col md={4} className="text-md-end mt-3 mt-md-0">
                  <div className="d-flex gap-2 justify-content-md-end">
                    <Button variant="primary" size="sm">
                      <i className="bi bi-telephone me-1"></i>
                      1900 1234
                    </Button>
                    <Button variant="outline-primary" size="sm" as={Link} to="/user/support">
                      <i className="bi bi-headset me-1"></i>
                      Hỗ trợ
                    </Button>
                  </div>
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </>
  );
};

export default DashboardOverview;