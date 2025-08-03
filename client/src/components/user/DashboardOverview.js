// ========================================
// PHẦN IMPORT THƯ VIỆN
// ========================================
// Thư viện React cốt lõi cho chức năng component
import React, { useEffect, useState } from 'react';
// React Router để điều hướng
import { Link } from 'react-router-dom';
// Các component Bootstrap cho giao diện
import { Row, Col, Card, Button, Badge, ProgressBar, Spinner } from 'react-bootstrap';
// Các hàm API service để lấy dữ liệu booking và test results
import { getBookingByUserId, getTestResultByUserId, getBookingById } from '../../services/api';

// ========================================
// COMPONENT CHÍNH: DashboardOverview
// ========================================

/**
 * Component hiển thị tổng quan dashboard của user
 * 
 * LUỒNG HOẠT ĐỘNG CHÍNH:
 * 1. Component mount → useEffect chạy → gọi fetchData()
 * 2. Lấy userId từ props user
 * 3. Gọi API song song để lấy appointments và test results
 * 4. Fetch booking details cho từng test result để lấy thông tin category chính xác
 * 5. Transform dữ liệu appointments và test results
 * 6. Tính toán statistics và counts
 * 7. Render dashboard với thông tin tổng quan
 * 
 * Props: 
 * - user: Thông tin user hiện tại
 */
const DashboardOverview = ({ user }) => {
  // ========================================
  // PHẦN QUẢN LÝ STATE
  // ========================================
  
  // State Dữ liệu - Lưu trữ dữ liệu appointments và test results
  const [appointments, setAppointments] = useState([]); // Danh sách appointments của user
  const [testResults, setTestResults] = useState([]); // Danh sách test results của user
  
  // State Giao diện - Điều khiển trạng thái loading và lỗi
  const [loading, setLoading] = useState(true); // Hiển thị spinner khi đang tải dữ liệu
  const [error, setError] = useState(null); // Lưu trữ thông báo lỗi
  
  // State Statistics - Thống kê cho dashboard
  const [counts, setCounts] = useState({ 
    total: 0, // Tổng số appointments
    completed: 0, // Số appointments đã hoàn thành
    inProgress: 0, // Số appointments đang trong quá trình
    totalAmount: 0 // Tổng số tiền
  });



  // ========================================
  // PHẦN EFFECT LẤY DỮ LIỆU
  // ========================================
  
  /**
   * useEffect để lấy dữ liệu khi component mount hoặc user thay đổi
   * 
   * LUỒNG LẤY DỮ LIỆU:
   * 1. Kiểm tra user.id có tồn tại không
   * 2. Gọi API song song để lấy appointments và test results
   * 3. Fetch booking details cho từng test result để lấy thông tin category chính xác
   * 4. Transform dữ liệu appointments và test results
   * 5. Tính toán statistics và counts
   * 6. Cập nhật state với dữ liệu đã xử lý
   */
  useEffect(() => {
    const fetchData = async () => {
      // BƯỚC 1: Kiểm tra user.id có tồn tại không
      if (!user?.id) {
        setLoading(false);
        return;
      }
      
      try {
        // BƯỚC 2: Bắt đầu loading và xóa lỗi trước đó
        setLoading(true);
        setError(null);
        
        // BƯỚC 3: Gọi API song song để lấy appointments và test results
        const [appointmentsData, testResultsData] = await Promise.all([
          getBookingByUserId(user.id),
          getTestResultByUserId(user.id)
        ]);
        
        // BƯỚC 4: Fetch booking details cho từng test result để lấy thông tin category chính xác
        const testResultsWithBookingDetails = [];
        
        if (testResultsData && testResultsData.length > 0) {
          for (const testResult of testResultsData) {
            try {
              // Lấy bookingId từ test result
              const bookingId = testResult.bookingId || testResult.booking?.id || testResult.id?.replace('_RESULT', '');
              
              if (bookingId) {
                // Gọi API để lấy booking details
                const bookingDetails = await getBookingById(bookingId);
                testResultsWithBookingDetails.push({
                  ...testResult,
                  bookingDetails
                });
              } else {
                testResultsWithBookingDetails.push(testResult);
              }
            } catch (error) {
              testResultsWithBookingDetails.push(testResult);
            }
          }
        }
        
        // BƯỚC 5: Transform appointments data sử dụng cùng logic với MyAppointments
        const transformedAppointments = (appointmentsData || []).map(b => {
          // Parse timeSlotId để lấy date và time
          let date = '', time = '';
          if (b.timeSlotId) {
            const parts = b.timeSlotId.split('_');
            if (parts.length >= 2) {
              date = parts[0];
              time = parts[1];
            }
          }
          
          // Xác định status dựa trên booking history (cùng logic với MyAppointments)
          const history = b.bookingHistories_on_booking?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];
          const currentHistoryStatus = history.length > 0 ? history[0].status : null;
          
          let status = 'confirmed'; // default status
          let isUpcoming = false;
          
          // Kiểm tra xem appointment có phải là upcoming không
          if (b.timeSlotId) {
            try {
              const parts = b.timeSlotId.split('_');
              if (parts.length >= 1) {
                const appointmentDate = new Date(parts[0]);
                isUpcoming = !isNaN(appointmentDate.getTime()) && appointmentDate > new Date();
              }
            } catch (e) {
              console.error('Error checking if appointment is upcoming:', e);
              isUpcoming = false;
            }
          }

          // Improved status mapping based on timeline and method (same as MyAppointments)
          if (currentHistoryStatus) {
            if (currentHistoryStatus === 'COMPLETED' || currentHistoryStatus === 'COMPLETE') {
              status = 'completed';
            } else if (currentHistoryStatus === 'CANCELLED' || currentHistoryStatus === 'EXPIRED') {
              status = 'cancelled';
            } else {
              // Use same mapping logic as MyAppointments
              const methodId = b.method?.id;
              const methodName = b.method?.name?.toLowerCase() || '';
              
              // Self-sample method (Method ID: 0)
              if (methodId === '0' || methodName.includes('tự') || methodName.includes('self') || methodName.includes('kit')) {
                if (['CREATED', 'PENDING_PAYMENT', 'BOOKED', 'KIT_PREPARED', 'KIT_SENT', 'KIT_RECEIVED'].includes(currentHistoryStatus)) {
                  status = 'confirmed';
                } else if (['SELF_COLLECTED', 'KIT_RETURNED', 'SAMPLE_RECEIVED', 'SAMPLE_COLLECTED', 'RESULT_PENDING'].includes(currentHistoryStatus)) {
                  status = 'in-progress';
                } else {
                  status = 'completed';
                }
              }
              // Home-visit method (Method ID: 1)
              else if (methodId === '1' || methodName.includes('tại nhà') || methodName.includes('home') || methodName.includes('visit')) {
                if (['CREATED', 'PENDING_PAYMENT', 'BOOKED', 'STAFF_ASSIGNED'].includes(currentHistoryStatus)) {
                  status = 'confirmed';
                } else if (['SAMPLE_RECEIVED', 'SAMPLE_COLLECTED', 'RESULT_PENDING'].includes(currentHistoryStatus)) {
                  status = 'in-progress';
                } else {
                  status = 'completed';
                }
              }
              // Lab-visit method (Method ID: 2)
              else if (methodId === '2' || methodName.includes('tại lab') || methodName.includes('cơ sở') || methodName.includes('lab') || methodName.includes('facility')) {
                if (['CREATED', 'PENDING_PAYMENT', 'BOOKED'].includes(currentHistoryStatus)) {
                  status = 'confirmed';
                } else if (['SAMPLE_RECEIVED', 'SAMPLE_COLLECTED', 'RESULT_PENDING'].includes(currentHistoryStatus)) {
                  status = 'in-progress';
                } else {
                  status = 'completed';
                }
              }
              // Default mapping
              else {
                if (['SAMPLE_COLLECTED', 'SAMPLE_PROCESSING', 'RESULT_PENDING', 'KIT_RETURNED', 'SAMPLE_RECEIVED'].includes(currentHistoryStatus)) {
                  status = 'in-progress';
                } else if (['CREATED', 'PENDING_PAYMENT', 'BOOKED', 'KIT_PREPARED', 'KIT_SENT', 'KIT_RECEIVED', 'SELF_COLLECTED', 'STAFF_ASSIGNED'].includes(currentHistoryStatus)) {
                  status = 'confirmed';
                } else {
                  status = 'confirmed'; // fallback
                }
              }
            }
          } else {
            // Fallback to time-based status if no history
            const createdAt = new Date(b.createdAt);
            const now = new Date();
            
            if (isUpcoming) {
              status = 'confirmed';
            } else if (createdAt.getTime() + (7 * 24 * 60 * 60 * 1000) < now.getTime()) {
              status = 'completed';
            } else {
              status = 'in-progress';
            }
          }
          
          // Progress calculation based on status
          let progress = 0;
          switch (status) {
            case 'confirmed': progress = 25; break;
            case 'in-progress': progress = 75; break;
            case 'completed': progress = 100; break;
            default: progress = 0;
          }
          
          // Next action based on status
          let nextAction = 'Đang chờ xử lý';
          if (status === 'confirmed') nextAction = 'Chuẩn bị cho lịch hẹn';
          if (status === 'in-progress') nextAction = 'Đang xử lý mẫu tại phòng lab';
          if (status === 'completed') nextAction = 'Kết quả đã sẵn sàng';
          
          // Sử dụng dữ liệu từ nested query
          const serviceName = b.service?.title || 'Dịch vụ xét nghiệm ADN';
          const methodName = b.method?.name || 'Phương thức lấy mẫu';
          
          return {
            ...b,
            id: b.id,
            service: serviceName,
            date,
            time,
            status,
            method: methodName,
            progress,
            nextAction
          };
        });
        
        setAppointments(transformedAppointments);
        setTestResults(testResultsWithBookingDetails || []);
        
        // Count status and calculate total amount using transformed data
        let completed = 0, inProgress = 0, totalAmount = 0;
        transformedAppointments.forEach(appointment => {
          // Count based on status
          if (appointment.status === 'completed') {
            completed++;
          } else if (appointment.status === 'in-progress') {
            inProgress++;
          }
          
          // Calculate total amount only for paid bookings (check payment status)
          const history = appointment.bookingHistories_on_booking?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];
          const currentHistoryStatus = history.length > 0 ? history[0].status : null;
          
          // Count amount for all bookings except cancelled ones
          if (currentHistoryStatus && 
              !['CANCELLED', 'EXPIRED'].includes(currentHistoryStatus)) {
            if (appointment.totalAmount && !isNaN(parseFloat(appointment.totalAmount))) {
              totalAmount += parseFloat(appointment.totalAmount);
            }
          }
        });
        
        setCounts({ total: transformedAppointments.length, completed, inProgress, totalAmount });
      } catch (err) {
        setError('Không thể tải dữ liệu. Vui lòng thử lại sau.');
        setCounts({ total: 0, completed: 0, inProgress: 0, totalAmount: 0 });
        // Set empty arrays to prevent undefined errors
        setAppointments([]);
        setTestResults([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [user?.id]);

  // Lấy 2 lịch hẹn gần nhất (theo createdAt mới nhất)
  const sortedAppointments = [...appointments].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const recentAppointments = sortedAppointments.slice(0, 2);

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
              <h2 className="mb-1">Chào mừng trở lại, {(user && (user.fullname || user.name || user.displayName) && typeof (user.fullname || user.name || user.displayName) === 'string') ? (user.fullname || user.name || user.displayName) : 'Người dùng'}! 👋</h2>
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
        <Col md={3} className="mb-2">
          <Card className="text-center shadow-sm bg-primary text-white">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="bi bi-calendar-check fs-4 me-2"></i>
                <h6 className="mb-0">Tổng lịch hẹn</h6>
              </div>
              <h3 className="fw-bold mb-0">{loading ? <Spinner size="sm" /> : counts.total}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-2">
          <Card className="text-center shadow-sm bg-success text-white">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="bi bi-check-circle fs-4 me-2"></i>
                <h6 className="mb-0">Đã hoàn thành</h6>
              </div>
              <h3 className="fw-bold mb-0">{loading ? <Spinner size="sm" /> : counts.completed}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-2">
          <Card className="text-center shadow-sm bg-warning text-white">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="bi bi-clock fs-4 me-2"></i>
                <h6 className="mb-0">Chờ kết quả</h6>
              </div>
              <h3 className="fw-bold mb-0">{loading ? <Spinner size="sm" /> : counts.inProgress}</h3>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-2">
          <Card className="text-center shadow-sm bg-info text-white">
            <Card.Body className="py-3">
              <div className="d-flex align-items-center justify-content-center mb-2">
                <i className="bi bi-currency-dollar fs-4 me-2"></i>
                <h6 className="mb-0">Tổng chi phí</h6>
              </div>
              <h3 className="fw-bold mb-0">
                {loading ? <Spinner size="sm" /> : (
                  <span>
                    {(counts.totalAmount || 0).toLocaleString('vi-VN')} <small>VNĐ</small>
                  </span>
                )}
              </h3>
            </Card.Body>
          </Card>
        </Col>
      </Row>



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