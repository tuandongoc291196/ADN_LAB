import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Badge, ListGroup } from 'react-bootstrap';
import { getBookingByStaffId } from '../../services/api';

/**
 * COMPONENT: StaffOverview
 * CHỨC NĂNG: Trang tổng quan cho nhân viên - hiển thị danh sách công việc cần xử lý hôm nay
 * LUỒNG HOẠT ĐỘNG:
 * 1. Tải danh sách booking được phân công cho staff từ API getBookingByStaffId()
 * 2. Chuyển đổi booking thành task với status và deadline tương ứng
 * 3. Phân loại task theo loại: kit-preparation, sample-collection, lab-testing
 * 4. Hiển thị danh sách task với thông tin chi tiết và nút xử lý
 * 5. Sắp xếp task: ưu tiên các task cần xử lý, đưa task quá hạn/đã hủy xuống cuối
 */
const StaffOverview = ({ user }) => {
  // STATE QUẢN LÝ DỮ LIỆU
  const [todayTasks, setTodayTasks] = useState([]); // Danh sách công việc hôm nay

  /**
   * EFFECT: Tải dữ liệu booking khi component mount hoặc user.id thay đổi
   * BƯỚC 1: Gọi API getBookingByStaffId() để lấy danh sách booking được phân công
   * BƯỚC 2: Chuyển đổi booking thành task với thông tin chi tiết
   * BƯỚC 3: Cập nhật state todayTasks
   */
  useEffect(() => {
    const fetchBookings = async () => {
      try {
        // BƯỚC 1: Lấy danh sách booking từ API
        const bookings = await getBookingByStaffId(user.id);

        // BƯỚC 2: Chuyển đổi booking thành task
        const tasks = bookings.map((booking, index) => {
          // Xác định loại phương thức lấy mẫu
          const methodName = booking.method?.name || '';
          const isHomeVisit = methodName === 'Lấy mẫu tại nhà';

          // BƯỚC 2.1: Lấy history và status mới nhất
          const history = Array.isArray(booking.bookingHistories_on_booking) ? booking.bookingHistories_on_booking : [];
          const sorted = [...history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
          const latestStatus = sorted[0]?.status || 'unknown';

          // BƯỚC 2.2: Map status từ API sang task status
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
            case 'COMPLETE':
              taskStatus = 'complete';
              break;
            case 'REFUNDED':
              taskStatus = 'refunded';
              break;
            case 'CANCELLED':
              taskStatus = 'cancelled';
            default:
              taskStatus = latestStatus.toLowerCase().replaceAll('_', '-');
              break;
          }

          // BƯỚC 2.3: Xác định loại task dựa trên status
          let taskType = 'kit-preparation';
          if (['sample-collected', 'result-pending'].includes(taskStatus)) {
            taskType = 'lab-testing';
          } else if (['collected', 'transferred'].includes(taskStatus)) {
            taskType = 'sample-collection';
          }

          // BƯỚC 2.4: Tính toán deadline từ timeSlot hoặc createdAt
          let deadline = '';
          try {
            const [date, startTime] = booking.timeSlot?.id?.split('_') || [];
            if (date && startTime) {
              const dateTimeStr = `${date}T${startTime}:00`;
              const timeObj = new Date(dateTimeStr);
              timeObj.setMinutes(timeObj.getMinutes() - 30); // Trừ 30 phút để có thời gian chuẩn bị
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
            // Fallback: sử dụng createdAt nếu không có timeSlot
            deadline = new Date(booking.createdAt).toLocaleString('vi-VN', {
              weekday: 'long',
              year: 'numeric',
              month: '2-digit',
              day: '2-digit',
              hour: '2-digit',
              minute: '2-digit'
            });
          }

          // BƯỚC 2.5: Tạo object task với đầy đủ thông tin
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

        // BƯỚC 3: Cập nhật state
        setTodayTasks(tasks);
      } catch (err) {
        console.error('Lỗi khi lấy booking hoặc history:', err);
      }
    };

    fetchBookings();
  }, [user.id]);

  /**
   * HELPER FUNCTION: Tạo badge hiển thị status với màu sắc và label tương ứng
   * INPUT: status (string) - trạng thái task
   * OUTPUT: JSX Badge component với màu và text phù hợp
   */
  const getStatusBadge = (status) => {
    // Định nghĩa mapping màu sắc cho từng status
    const variants = {
      // KitPreparation statuses
      'waiting-kit-prep': 'secondary',
      'kit-prepared': 'warning',
      'kit-sent': 'primary',
      'kit-returned': 'dark',
      'pending-payment': 'dark',
      'expired': 'danger',
      'sample-received': 'info',
      'complete': 'primary',
      'refunded': 'warning',

      // SampleCollection statuses
      'collected': 'success',
      'transferred': 'success',
      'overdue': 'danger',
      'cancelled': 'secondary',

      // LabTesting statuses
      'sample-collected': 'success',
      'result-pending': 'success'
    };

    // Định nghĩa label tiếng Việt cho từng status
    const labels = {
      // KitPreparation labels
      'waiting-kit-prep': 'Chờ chuẩn bị kit',
      'kit-prepared': 'Đã chuẩn bị kit',
      'kit-sent': 'Đã gửi kit',
      'kit-returned': 'Đã nhận kit',
      'pending-payment': 'Chờ thanh toán',
      'expired': 'Quá hạn',
      'sample-received': 'Sẵn sàng thu mẫu',
      'complete': 'Hoàn thành',
      'refunded': 'Đã hoàn tiền',

      // SampleCollection labels
      'collected': 'Đã thu mẫu',
      'transferred': 'Đã chuyển lab',
      'overdue': 'Quá hạn',
      'cancelled': 'Đã hủy',

      // LabTesting labels
      'sample-collected': 'Đã thu mẫu',
      'result-pending': 'Chờ kết quả'
    };

    return <Badge bg={variants[status] || 'secondary'}>{labels[status] || status}</Badge>;
  };

  /**
   * HELPER FUNCTION: Lấy icon tương ứng với loại task
   * INPUT: type (string) - loại task
   * OUTPUT: className của icon Bootstrap
   */
  const getTaskIcon = (type) => {
    const icons = {
      'kit-preparation': 'bi-box-seam',
      'sample-collection': 'bi-droplet',
      'lab-testing': 'bi-eye',
      'results': 'bi-file-earmark-check'
    };
    return icons[type] || 'bi-list-task';
  };

  /**
   * HELPER FUNCTION: Tạo link điều hướng cho task
   * INPUT: type (string), status (string), isHomeVisit (boolean)
   * OUTPUT: URL string để điều hướng
   */
  const getTaskLink = (type, status, isHomeVisit) => {
    // Logic đặc biệt: nếu là lấy mẫu tại nhà và đã nhận kit thì chuyển sang thu mẫu
    if (isHomeVisit && (status === 'sample-received')) {
      return '/staff/sample-collection';
    }
    
    // Mapping loại task với URL tương ứng
    const links = {
      'kit-preparation': '/staff/kit-preparation',
      'sample-collection': '/staff/sample-collection',
      'lab-testing': '/staff/lab-testing',
      'results': '/staff/results'
    };
    return links[type] || '/staff';
  };

  // BƯỚC 4: Sắp xếp tasks - ưu tiên các task cần xử lý, đưa task quá hạn/đã hủy xuống cuối
  const sortedTasks = [
    ...todayTasks.filter(task => !['overdue', 'cancelled'].includes(task.status)),
    ...todayTasks.filter(task => ['overdue', 'cancelled'].includes(task.status))
  ];

  // BƯỚC 5: Đếm số lượng task để hiển thị badge
  const normalCount = todayTasks.filter(task => !['overdue', 'cancelled'].includes(task.status)).length;
  const specialCount = todayTasks.filter(task => ['overdue', 'cancelled'].includes(task.status)).length;

  return (
    <div>
      {/* HEADER: Chào mừng và ngày hiện tại */}
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
        {/* MAIN CONTENT: Danh sách công việc hôm nay */}
        <Col lg={8} className="mb-4">
          <Card className="shadow-sm">
            {/* CARD HEADER: Tiêu đề và thống kê */}
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

            {/* CARD BODY: Danh sách task */}
            <Card.Body className="p-0">
              <ListGroup variant="flush">
                {sortedTasks.map((task, index) => (
                  <ListGroup.Item
                    key={task.id}
                    className="d-flex align-items-center justify-content-between py-3"
                  >
                    {/* LEFT SIDE: Thông tin task */}
                    <div className="d-flex align-items-center flex-grow-1">
                      {/* Icon loại task */}
                      <div className="me-3">
                        <i className={`${getTaskIcon(task.type)} fs-4 text-primary`}></i>
                      </div>

                      {/* Thông tin chi tiết task */}
                      <div className="flex-grow-1">
                        {/* Tên dịch vụ */}
                        <div className="fw-bold" style={{ fontWeight: 700, fontSize: '1.1rem', textAlign: 'center' }}>
                          {task.serviceTitle || task.title.replace(/^(Chuẩn bị Kit|Thu mẫu) - /, '')}
                        </div>

                        {/* Badge loại dịch vụ (ADN DÂN SỰ/HÀNH CHÍNH) */}
                        <div className="d-flex justify-content-center align-items-center mb-1 mt-1">
                          {task.categoryName && (
                            <span className={`badge rounded-pill ${task.categoryName === 'ADN DÂN SỰ' ? 'bg-success text-white' : 'bg-warning text-dark'}`}
                              style={{ fontSize: '0.6em' }}>
                              {`${task.categoryName}`}
                            </span>
                          )}
                        </div>

                        {/* Badge phương thức lấy mẫu */}
                        {task.methodName && (
                          <div className="d-flex justify-content-center align-items-center mb-1">
                            <span className={`badge rounded-pill ${task.methodName.includes('tại nhà') ? 'bg-success text-white' : task.methodName.includes('lab') ? 'bg-primary text-white' : 'bg-warning text-dark'}`}
                              style={{ fontSize: '0.6em', display: 'flex', alignItems: 'center', gap: '0.3em' }}>
                              {task.methodName.includes('tại nhà') && <i className="bi bi-house-door-fill me-1"></i>}
                              {task.methodName.includes('Nhân viên') && <i className="bi bi-truck me-1"></i>}
                              {task.methodName.includes('lab') && <i className="bi bi-building me-1"></i>}
                              {task.methodName}
                            </span>
                          </div>
                        )}

                        {/* Thông tin bổ sung */}
                        {task.information && (
                          <div className="fw-bold text-dark mb-1" style={{ fontSize: '1em' }}>
                            <i className="bi bi-info-circle me-1"></i>{task.information}
                          </div>
                        )}

                        {/* Deadline */}
                        <div className="text-muted small mb-1" style={{ fontSize: '0.9em' }}>
                          <i className="bi bi-clock me-1"></i>
                          Deadline: {task.deadline}
                        </div>

                        {/* Order ID */}
                        <div className="mt-1">
                          {task.orderIds.map(orderId => (
                            <Badge key={orderId} bg="light" text="dark" className="me-1">
                              {orderId}
                            </Badge>
                          ))}
                        </div>
                      </div>
                    </div>

                    {/* RIGHT SIDE: Status và nút xử lý */}
                    <div className="text-end">
                      {/* Status badge */}
                      <div className="mb-2">
                        {getStatusBadge(task.status)}
                      </div>

                      {/* Nút xử lý - chỉ hiển thị cho các task chưa hoàn thành */}
                      {!['overdue', 'cancelled', 'collected', 'analysis-complete', 'reviewed', 'delivered', 'result-pending', 'complete', 'refunded'].includes(task.status) && (
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
      </Row>
    </div>
  );
};

export default StaffOverview;