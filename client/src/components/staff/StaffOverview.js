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

          // Lấy history tương ứng
          const history = Array.isArray(booking.bookingHistories_on_booking) ? booking.bookingHistories_on_booking : [];

          // Tìm status mới nhất theo createdAt
          const sorted = [...history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          const latestStatus = sorted[0]?.status || 'unknown';
          // Kiểm tra quá hạn
          let taskStatus = '';
          switch (latestStatus) {
            case 'BOOKED':
              taskStatus = isHomeVisit ? 'waiting-kit-prep' : 'waiting-sample';
              break;
            case 'KIT_PREPARED':
              taskStatus = 'kit-prepared';
              break;
            case 'KIT_SENT':
              taskStatus = 'kit-sent';
              break;
            case 'SAMPLE_RECEIVED':
              taskStatus = isHomeVisit ? 'kit-returned' : 'sample-received';
              break;
            case 'SAMPLE_COLLECTED':
              taskStatus = 'sample-collected';
              break;
            case 'RESULT_PENDING':
              taskStatus = 'result-pending';
              break;
            case 'PENDING_PAYMENT':
              taskStatus = 'pending-payment';
              break;
            case 'FAILED':
            case 'EXPIRED':
              taskStatus = 'overdue';
              break;
            default:
              taskStatus = latestStatus.toLowerCase().replaceAll('_', '-');
              break;
          }

          // Xác định task type dựa trên status
          let taskType = 'kit-preparation';
          if (['sample-collected', 'result-pending'].includes(taskStatus)) {
            taskType = 'lab-testing';
          } else if (['collected', 'transferred'].includes(taskStatus)) {
            taskType = 'sample-collection';
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
            information: booking?.informations_on_booking?.[0]?.note || booking?.informations_on_booking?.[0]?.name || '',
            methodName: booking?.method?.name || '',
            categoryName: booking?.service?.category?.name || '',
            orderIds: [booking.id],
            status: taskStatus,
            isHomeVisit: isHomeVisit,
            serviceTitle: booking.service?.title || '',
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
      // KitPreparation statuses
      'waiting-kit-prep': 'secondary',
      'kit-prepared': 'warning',
      'kit-sent': 'primary',
      'kit-returned': 'info',
      'pending-payment': 'dark',
      'expired': 'danger',
      'sample-received': 'info',

      // SampleCollection statuses
      'collected': 'success',
      'transferred': 'success',
      'overdue': 'danger',

      // LabTesting statuses
      'sample-collected': 'success',
      'result-pending': 'success'
    };
    const labels = {
      // KitPreparation labels
      'waiting-kit-prep': 'Chờ chuẩn bị kit',
      'kit-prepared': 'Đã chuẩn bị kit',
      'kit-sent': 'Đã gửi kit',
      'kit-returned': 'Đã nhận kit',
      'pending-payment': 'Chờ thanh toán',
      'expired': 'Quá hạn',
      'sample-received': 'Đã nhận mẫu',

      // SampleCollection labels
      'collected': 'Đã thu mẫu',
      'transferred': 'Đã chuyển lab',
      'overdue': 'Quá hạn',

      // LabTesting labels
      'sample-collected': 'Đã thu mẫu',
      'result-pending': 'Chờ kết quả'
    };
    return <Badge bg={variants[status] || 'secondary'}>{labels[status] || status}</Badge>;
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

  const getTaskLink = (type, status, isHomeVisit) => {
    // Nếu là lấy mẫu tại nhà và đã nhận kit thì chuyển sang thu mẫu
    if (isHomeVisit && (status === 'sample-received')) {
      return '/staff/sample-collection';
    }
    const links = {
      'kit-preparation': '/staff/kit-preparation',
      'sample-collection': '/staff/sample-collection',
      'lab-testing': '/staff/lab-testing',
      'results': '/staff/results'
    };
    return links[type] || '/staff';
  };

  // Sắp xếp tasks: các đơn overdue/cancelled xuống cuối
  const sortedTasks = [
    ...todayTasks.filter(task => !['overdue', 'cancelled'].includes(task.status)),
    ...todayTasks.filter(task => ['overdue', 'cancelled'].includes(task.status))
  ];
  // Đếm số lượng
  const normalCount = todayTasks.filter(task => !['overdue', 'cancelled'].includes(task.status)).length;
  const specialCount = todayTasks.filter(task => ['overdue', 'cancelled'].includes(task.status)).length;

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
                <div>
                  <Badge bg="primary" className="me-2">{normalCount} cần xử lý</Badge>
                  <Badge bg="danger">{specialCount} quá hạn/đã hủy</Badge>
                </div>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                {sortedTasks.map((task, index) => (
                  <ListGroup.Item
                    key={task.id}
                    className="d-flex align-items-center justify-content-between py-3"
                  >
                    <div className="d-flex align-items-center flex-grow-1">
                      <div className="me-3">
                        <i className={`${getTaskIcon(task.type)} fs-4 text-primary`}></i>
                      </div>
                      <div className="flex-grow-1">
                        <div className="fw-bold" style={{ fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' }}>{task.serviceTitle || task.title.replace(/^(Chuẩn bị Kit|Thu mẫu) - /, '')}</div>
                        <div className="d-flex justify-content-center align-items-center mb-1 mt-1">
                          {task.categoryName && (
                            <span className={`badge rounded-pill ${task.categoryName === 'ADN DÂN SỰ' ? 'bg-success text-white' : 'bg-warning text-dark'}`}
                              style={{ fontSize: '0.6em' }}>
                              {`${task.categoryName}`}
                            </span>
                          )}
                        </div>
                        {task.methodName && (
                          <div className="d-flex justify-content-center align-items-center mb-1">
                            <span className={`badge rounded-pill ${task.methodName.includes('tại nhà') ? 'bg-success text-white' : task.methodName.includes('lab') ? 'bg-primary text-white' : 'bg-warning text-dark'}`}
                              style={{ fontSize: '0.6em', display: 'flex', alignItems: 'center', gap: '0.3em' }}>
                              {task.methodName.includes('tại nhà') && <i className="bi bi-house-door-fill me-1"></i>}
                              {task.methodName.includes('nhân viên') && <i className="bi bi-truck me-1"></i>}
                              {task.methodName.includes('lab') && <i className="bi bi-building me-1"></i>}
                              {task.methodName}
                            </span>
                          </div>
                        )}
                        {task.information && (
                          <div className="fw-bold text-dark mb-1" style={{ fontSize: '1em' }}>
                            <i className="bi bi-info-circle me-1"></i>{task.information}
                          </div>
                        )}
                        <div className="text-muted small mb-1" style={{ fontSize: '0.9em' }}>
                          <i className="bi bi-clock me-1"></i>
                          Deadline: {task.deadline}
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
                      {!['overdue', 'cancelled', 'collected', 'analysis-complete', 'reviewed', 'delivered', 'result-pending'].includes(task.status) && (
                        <Button
                          as={Link}
                          to={`${getTaskLink(task.type, task.status, task.isHomeVisit)}/${task.orderIds[0]}`}
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
        </Col>
      </Row>
    </div>
  );
};

export default StaffOverview;