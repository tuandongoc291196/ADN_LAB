import React from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Badge, ProgressBar } from 'react-bootstrap';
import ResultsSummary from './ResultsSummary';

const DashboardOverview = ({ user }) => {
  // Mock data for recent activities and upcoming appointments
  const recentAppointments = [
    {
      id: 'ADN123460',
      service: 'Xét nghiệm ADN huyết thống cha-con',
      date: '2024-02-01',
      time: '09:00',
      status: 'confirmed',
      method: 'at-facility',
      progress: 20,
      nextAction: 'Chuẩn bị cho lịch hẹn'
    },
    {
      id: 'ADN123461',
      service: 'Xét nghiệm ADN anh chị em',
      date: '2024-01-29',
      time: '14:30',
      status: 'in-progress',
      method: 'home-visit',
      progress: 75,
      nextAction: 'Đang phân tích mẫu tại phòng lab'
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