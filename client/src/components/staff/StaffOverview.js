import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { getBookingByStaffId } from '../../services/api';

const StaffOverview = ({ user }) => {
  const [todayTasks, setTodayTasks] = useState([]);

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

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const bookings = await getBookingByStaffId(user.id);

        const tasks = bookings.map((booking, index) => {
          const methodName = booking.method?.name || '';
          const isHomeVisit = methodName === 'Lấy mẫu tại nhà';
          const taskType = isHomeVisit ? 'kit-preparation' : 'sample-collection';

          // Lấy history tương ứng
          const history = Array.isArray(booking.bookingHistories_on_booking) ? booking.bookingHistories_on_booking : [];

          // Tìm status mới nhất theo createdAt
          const sorted = [...history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          const latestStatus = sorted[0]?.status || 'unknown';
          const expectedDate = booking.timeSlotId?.split('_')[0]; // Lấy ngày từ slot ID
          const isOverdue = expectedDate && new Date(expectedDate) < new Date(); // 👈 Check quá hạn


          let taskStatus = 'pending';
          if (isOverdue && !['COLLECTED', 'KIT_RETURNED', 'EXPIRED', 'FAILED'].includes(latestStatus)) {
            taskStatus = 'overdue';
          } else {
            switch (latestStatus) {
              case 'BOOKED':
                taskStatus = 'pending';
                break;
              case 'KIT_PREPARED':
                taskStatus = 'in-progress';
                break;
              case 'KIT_SENT':
                taskStatus = 'in-progress';
                break;
              case 'KIT_RETURNED':
              case 'COLLECTED':
                taskStatus = 'collected';
                break;
              case 'CANCELLED':
                taskStatus = 'cancel';
                break;
              case 'FAILED':
              case 'EXPIRED':
                taskStatus = 'overdue';
                break;
              default:
                taskStatus = latestStatus.toLowerCase().replaceAll('_', '-');
                break;
            }
          }
          let deadline = '';
          try {
            const [date, startTime] = booking.timeSlot?.id?.split('_') || [];
            if (date && startTime) {
              const dateTimeStr = `${date}T${startTime}:00`;
              const timeObj = new Date(dateTimeStr);
              timeObj.setMinutes(timeObj.getMinutes() - 30);
              deadline = timeObj.toLocaleString('vi-VN', {
                weekday: 'long',
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
              });
            }
          } catch (e) {
            deadline = new Date(booking.createdAt).toLocaleString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            });
          }

          return {
            id: booking.id || `task-${index}`,
            type: taskType,
            title: `${isHomeVisit ? 'Chuẩn bị Kit' : 'Thu mẫu'} - ${booking.service?.title || 'Dịch vụ không xác định'}`,
            priority: 'high',
            deadline: deadline,
            address: booking?.informations_on_booking?.[0]?.address || '',
            orderIds: [booking.id],
            status: taskStatus
          };
        });

        setTodayTasks(tasks);
      } catch (err) {
        console.error('Lỗi khi lấy booking hoặc history:', err);
      }
    };

    fetchBookings();
  }, [user.id]);

  const getStatusBadge = (status) => {
    const variants = {
      pending: 'secondary',
      'in-progress': 'primary',
      collected: 'info',
      completed: 'success',
      cancel: 'warning',
      overdue: 'danger'
    };
    const labels = {
      pending: 'Chờ xử lý',
      'in-progress': 'Đang thực hiện',
      collected: 'Đã thu mẫu',
      completed: 'Hoàn thành',
      cancel: 'Đã hủy',
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
      </div>

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
                        {/* Đã bỏ getPriorityBadge */}
                      </div>
                      <div className="mb-2">
                        {getStatusBadge(task.status)}
                      </div>
                      {task.status !== 'overdue' && (
                        <Button
                          as={Link}
                          to={`${getTaskLink(task.type)}/${task.orderIds[0]}`}
                          size="sm"
                          variant="outline-primary"
                        >
                          Xử lý
                        </Button>
                      )}
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