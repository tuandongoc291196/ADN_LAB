import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Badge, Alert, ListGroup, ProgressBar } from 'react-bootstrap';

const StaffOverview = ({ user }) => {
  const [todayStats, setTodayStats] = useState({
    kitsToSend: 8,
    samplesCollected: 12,
    testsInProgress: 5,
    resultsToRelease: 3,
    completedTasks: 15
  });

  // Mock data cho các task cần làm hôm nay
  const todayTasks = [
    {
      id: 'task-001',
      type: 'kit-preparation',
      title: 'Chuẩn bị 3 kit ADN huyết thống',
      priority: 'high',
      deadline: '10:00',
      orderIds: ['ADN123461', 'ADN123462', 'ADN123463'],
      status: 'pending'
    },
    {
      id: 'task-002',
      type: 'sample-collection',
      title: 'Thu mẫu tại nhà - Quận 1',
      priority: 'urgent',
      deadline: '14:00',
      address: '123 Nguyễn Huệ, Q1, TP.HCM',
      orderIds: ['ADN123464'],
      status: 'in-progress'
    },
    {
      id: 'task-003',
      type: 'lab-testing',
      title: 'Hoàn thành phân tích 2 mẫu ADN',
      priority: 'medium',
      deadline: '16:00',
      orderIds: ['ADN123465', 'ADN123466'],
      status: 'pending'
    },
    {
      id: 'task-004',
      type: 'results',
      title: 'Phê duyệt và gửi 3 kết quả',
      priority: 'high',
      deadline: '17:00',
      orderIds: ['ADN123467', 'ADN123468', 'ADN123469'],
      status: 'pending'
    }
  ];

  // Mock data cho thống kê công việc tuần này
  const weeklyStats = {
    monday: { kits: 12, samples: 8, tests: 6, results: 4 },
    tuesday: { kits: 10, samples: 12, tests: 8, results: 6 },
    wednesday: { kits: 8, samples: 10, tests: 5, results: 8 },
    thursday: { kits: 15, samples: 6, tests: 9, results: 5 },
    friday: { kits: 8, samples: 12, tests: 5, results: 3 },
    saturday: { kits: 6, samples: 4, tests: 2, results: 2 },
    sunday: { kits: 4, samples: 2, tests: 1, results: 1 }
  };

  const getPriorityBadge = (priority) => {
    const variants = {
      urgent: 'danger',
      high: 'warning',
      medium: 'primary',
      low: 'secondary'
    };
    const labels = {
      urgent: 'Khẩn cấp',
      high: 'Cao',
      medium: 'Trung bình',
      low: 'Thấp'
    };
    return <Badge bg={variants[priority]}>{labels[priority]}</Badge>;
  };

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'secondary',
      'in-progress': 'warning',
      completed: 'success',
      overdue: 'danger'
    };
    const labels = {
      pending: 'Chờ xử lý',
      'in-progress': 'Đang thực hiện',
      completed: 'Hoàn thành',
      overdue: 'Quá hạn'
    };
    return <Badge bg={variants[status]}>{labels[status]}</Badge>;
  };

  const getTaskIcon = (type) => {
    const icons = {
      'kit-preparation': 'bi-box-seam',
      'sample-collection': 'bi-droplet',
      'lab-testing': 'bi-eye',
      'results': 'bi-file-earmark-check'
    };
    return icons[type] || 'bi-list-task';
  };

  const getTaskLink = (type) => {
    const links = {
      'kit-preparation': '/staff/kit-preparation',
      'sample-collection': '/staff/sample-collection',
      'lab-testing': '/staff/lab-testing',
      'results': '/staff/results'
    };
    return links[type] || '/staff';
  };

  const calculateCompletionRate = () => {
    const total = todayStats.kitsToSend + todayStats.samplesCollected + 
                  todayStats.testsInProgress + todayStats.resultsToRelease;
    return Math.round((todayStats.completedTasks / (total + todayStats.completedTasks)) * 100);
  };

  return (
    <div>
      {/* Welcome Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Chào mừng, {user.name}!</h2>
          <p className="text-muted mb-0">
            <i className="bi bi-clock me-1"></i>
            Hôm nay là {new Date().toLocaleDateString('vi-VN', { 
              weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' 
            })}
          </p>
        </div>
        <div className="text-end">
          <div className="h4 text-success mb-0">{calculateCompletionRate()}%</div>
          <small className="text-muted">Tiến độ hôm nay</small>
        </div>
      </div>

      {/* Quick Stats */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-start border-success border-4 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-box-seam fs-1 text-success"></i>
              </div>
              <div>
                <div className="h4 mb-0">{todayStats.kitsToSend}</div>
                <div className="text-muted small">Kit cần gửi</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-start border-warning border-4 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-droplet fs-1 text-warning"></i>
              </div>
              <div>
                <div className="h4 mb-0">{todayStats.samplesCollected}</div>
                <div className="text-muted small">Mẫu cần thu</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-start border-info border-4 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-eye fs-1 text-info"></i>
              </div>
              <div>
                <div className="h4 mb-0">{todayStats.testsInProgress}</div>
                <div className="text-muted small">Đang xét nghiệm</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-start border-danger border-4 shadow-sm">
            <Card.Body className="d-flex align-items-center">
              <div className="me-3">
                <i className="bi bi-file-earmark-check fs-1 text-danger"></i>
              </div>
              <div>
                <div className="h4 mb-0">{todayStats.resultsToRelease}</div>
                <div className="text-muted small">Kết quả cần trả</div>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <Row>
        {/* Tasks for Today */}
        <Col lg={8} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">
                  <i className="bi bi-list-task me-2"></i>
                  Công việc hôm nay
                </h5>
                <Badge bg="primary">{todayTasks.length} nhiệm vụ</Badge>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                {todayTasks.map((task, index) => (
                  <ListGroup.Item 
                    key={task.id} 
                    className="d-flex align-items-center justify-content-between py-3"
                  >
                    <div className="d-flex align-items-center flex-grow-1">
                      <div className="me-3">
                        <i className={`${getTaskIcon(task.type)} fs-4 text-primary`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold">{task.title}</div>
                        <div className="text-muted small">
                          <i className="bi bi-clock me-1"></i>
                          Deadline: {task.deadline}
                          {task.address && (
                            <>
                              <i className="bi bi-geo-alt ms-3 me-1"></i>
                              {task.address}
                            </>
                          )}
                        </div>
                        <div className="mt-1">
                          {task.orderIds.map(orderId => (
                            <Badge key={orderId} bg="light" text="dark" className="me-1">
                              {orderId}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>
                    <div className="text-end">
                      <div className="mb-2">
                        {getPriorityBadge(task.priority)}
                      </div>
                      <div className="mb-2">
                        {getStatusBadge(task.status)}
                      </div>
                      <Button 
                        as={Link} 
                        to={getTaskLink(task.type)}
                        size="sm" 
                        variant="outline-primary"
                      >
                        Xử lý
                      </Button>
                    </div>
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>

        {/* Weekly Progress */}
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <h5 className="mb-0">
                <i className="bi bi-graph-up me-2"></i>
                Tiến độ tuần này
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <div className="d-flex justify-content-between align-items-center mb-1">
                  <small>Hoàn thành hôm nay</small>
                  <small>{calculateCompletionRate()}%</small>
                </div>
                <ProgressBar now={calculateCompletionRate()} variant="success" />
              </div>

              <div className="border-top pt-3">
                <h6 className="text-muted mb-3">Thống kê theo ngày</h6>
                {Object.entries(weeklyStats).map(([day, stats]) => (
                  <div key={day} className="d-flex justify-content-between align-items-center mb-2">
                    <small className="text-capitalize">
                      {day === 'monday' ? 'Thứ 2' :
                       day === 'tuesday' ? 'Thứ 3' :
                       day === 'wednesday' ? 'Thứ 4' :
                       day === 'thursday' ? 'Thứ 5' :
                       day === 'friday' ? 'Thứ 6' :
                       day === 'saturday' ? 'Thứ 7' :
                       'Chủ nhật'}
                    </small>
                    <div className="text-end">
                      <Badge bg="success" className="me-1">{stats.kits}</Badge>
                      <Badge bg="warning" className="me-1">{stats.samples}</Badge>
                      <Badge bg="info" className="me-1">{stats.tests}</Badge>
                      <Badge bg="danger">{stats.results}</Badge>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-top pt-3 mt-3">
                <small className="text-muted">
                  <Badge bg="success" className="me-1">Kit</Badge>
                  <Badge bg="warning" className="me-1">Mẫu</Badge>
                  <Badge bg="info" className="me-1">Test</Badge>
                  <Badge bg="danger">KQ</Badge>
                </small>
              </div>
            </Card.Body>
          </Card>

          {/* Quick Actions */}
          <Card className="shadow-sm mt-3">
            <Card.Header className="bg-light">
              <h6 className="mb-0">
                <i className="bi bi-lightning me-2"></i>
                Thao tác nhanh
              </h6>
            </Card.Header>
            <Card.Body>
              <div className="d-grid gap-2">
                <Button as={Link} to="/staff/kit-preparation" variant="success" size="sm">
                  <i className="bi bi-box-seam me-2"></i>
                  Chuẩn bị Kit
                </Button>
                <Button as={Link} to="/staff/sample-collection" variant="warning" size="sm">
                  <i className="bi bi-droplet me-2"></i>
                  Thu mẫu
                </Button>
                <Button as={Link} to="/staff/lab-testing" variant="info" size="sm">
                  <i className="bi bi-eye me-2"></i>
                  Xét nghiệm
                </Button>
                <Button as={Link} to="/staff/results" variant="danger" size="sm">
                  <i className="bi bi-file-earmark-check me-2"></i>
                  Trả kết quả
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </div>
  );
};

export default StaffOverview;