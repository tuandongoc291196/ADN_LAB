import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Alert, Badge, ProgressBar } from 'react-bootstrap';

const DashboardOverview = ({ user }) => {
  // Mock data for recent activities and upcoming appointments
  const recentAppointments = [
    {
      id: 'ADN123456',
      service: 'Xét nghiệm ADN huyết thống cha-con',
      date: '2024-01-20',
      time: '09:00',
      status: 'confirmed',
      method: 'self-sample',
      progress: 60
    },
    {
      id: 'ADN123457',
      service: 'Xét nghiệm ADN thai nhi',
      date: '2024-01-18',
      time: '14:30',
      status: 'completed',
      method: 'at-facility',
      progress: 100
    },
    {
      id: 'ADN123458',
      service: 'Xét nghiệm ADN khai sinh',
      date: '2024-01-15',
      time: '10:00',
      status: 'in-progress',
      method: 'at-facility',
      progress: 80
    }
  ];

  const notifications = [
    {
      id: 1,
      type: 'success',
      title: 'Kết quả đã sẵn sàng',
      message: 'Kết quả xét nghiệm ADN123457 đã có thể tải về',
      time: '2 giờ trước',
      action: 'Xem kết quả'
    },
    {
      id: 2,
      type: 'warning',
      title: 'Nhắc nhở thu mẫu',
      message: 'Vui lòng thu mẫu cho đơn ADN123456 và gửi về trong 2 ngày',
      time: '1 ngày trước',
      action: 'Xem hướng dẫn'
    },
    {
      id: 3,
      type: 'info',
      title: 'Lịch hẹn sắp tới',
      message: 'Bạn có lịch hẹn vào ngày mai lúc 09:00',
      time: '1 ngày trước',
      action: 'Xem chi tiết'
    }
  ];

  const quickStats = [
    {
      title: 'Lịch hẹn tổng',
      value: user.totalAppointments,
      icon: 'bi-calendar-event',
      color: 'primary',
      trend: '+2 tháng này'
    },
    {
      title: 'Đã hoàn thành',
      value: user.completedTests,
      icon: 'bi-check-circle',
      color: 'success',
      trend: '+1 tuần này'
    },
    {
      title: 'Chờ kết quả',
      value: user.pendingResults,
      icon: 'bi-clock-history',
      color: 'warning',
      trend: 'Dự kiến 2-3 ngày'
    },
    {
      title: 'Đánh giá',
      value: '4.8/5',
      icon: 'bi-star-fill',
      color: 'info',
      trend: 'Dựa trên 5 đánh giá'
    }
  ];

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
              <h2 className="mb-1">Chào mừng trở lại, {user.name.split(' ').pop()}! 👋</h2>
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

      <Row>
        {/* Recent Appointments */}
        <Col className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-white border-bottom">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-calendar-event me-2 text-primary"></i>
                  Lịch hẹn gần đây
                </h5>
                <Button variant="outline-primary" size="sm" as={Link} to="/user/appointments">
                  Xem tất cả
                </Button>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              {recentAppointments.length > 0 ? (
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
                              <small className="text-muted">Tiến độ thực hiện</small>
                              <small className="fw-bold">{appointment.progress}%</small>
                            </div>
                            <ProgressBar
                              now={appointment.progress}
                              variant={appointment.progress === 100 ? 'success' : 'primary'}
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
                  <h6 className="text-muted mt-3">Chưa có lịch hẹn nào</h6>
                  <Button variant="primary" as={Link} to="/appointment">
                    Đặt lịch đầu tiên
                  </Button>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Notifications */}
        {/* <Col lg={4}>
          <Card className="shadow-sm mb-4">
            <Card.Header className="bg-white border-bottom">
              <h5 className="mb-0">
                <i className="bi bi-bell me-2 text-warning"></i>
                Thông báo
              </h5>
            </Card.Header>
            <Card.Body className="p-0">
              {notifications.length > 0 ? (
                <div className="list-group list-group-flush">
                  {notifications.slice(0, 3).map(notification => (
                    <div key={notification.id} className="list-group-item px-3 py-3">
                      <div className="d-flex align-items-start">
                        <div className={`bg-${notification.type} bg-opacity-10 rounded-circle p-2 me-3 mt-1`}>
                          <i className={`bi ${notification.type === 'success' ? 'bi-check-circle' :
                              notification.type === 'warning' ? 'bi-exclamation-triangle' :
                                'bi-info-circle'
                            } text-${notification.type}`}></i>
                        </div>
                        <div className="flex-grow-1">
                          <h6 className="mb-1">{notification.title}</h6>
                          <p className="mb-2 small text-muted">{notification.message}</p>
                          <div className="d-flex justify-content-between align-items-center">
                            <small className="text-muted">{notification.time}</small>
                            <Button variant={`outline-${notification.type}`} size="sm">
                              {notification.action}
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-4">
                  <i className="bi bi-bell-slash text-muted fs-1"></i>
                  <p className="text-muted mt-2 mb-0">Không có thông báo mới</p>
                </div>
              )}
            </Card.Body>
          </Card>
        </Col> */}
      </Row>
    </>
  );
};

export default DashboardOverview;