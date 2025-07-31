import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Badge, ProgressBar, Spinner } from 'react-bootstrap';
import ResultsSummary from './ResultsSummary';
import { getBookingByUserId, getTestResultByUserId, getBookingById } from '../../services/api';

const DashboardOverview = ({ user }) => {
  const [appointments, setAppointments] = useState([]);
  const [testResults, setTestResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [counts, setCounts] = useState({ total: 0, completed: 0, inProgress: 0, totalAmount: 0 });



  useEffect(() => {
    const fetchData = async () => {
      if (!user?.id) {
        setLoading(false);
        return;
      }
      try {
        setLoading(true);
        setError(null);
        
        // Fetch appointments and test results in parallel
        const [appointmentsData, testResultsData] = await Promise.all([
          getBookingByUserId(user.id),
          getTestResultByUserId(user.id)
        ]);
        
        console.log('DashboardOverview - appointmentsData:', appointmentsData);
        console.log('DashboardOverview - testResultsData:', testResultsData);
        console.log('DashboardOverview - testResultsData length:', testResultsData?.length);
        
        // Fetch booking details for each test result to get accurate category information
        const testResultsWithBookingDetails = [];
        console.log('DashboardOverview - testResultsData before processing:', testResultsData);
        if (testResultsData && testResultsData.length > 0) {
                      for (const testResult of testResultsData) {
              console.log('DashboardOverview - processing testResult:', testResult.id);
              try {
                const bookingId = testResult.bookingId || testResult.booking?.id || testResult.id?.replace('_RESULT', '');
                console.log('DashboardOverview - extracted bookingId:', bookingId);
                if (bookingId) {
                  const bookingDetails = await getBookingById(bookingId);
                  console.log('DashboardOverview - fetched bookingDetails for', testResult.id, ':', bookingDetails);
                  testResultsWithBookingDetails.push({
                    ...testResult,
                    bookingDetails
                  });
                } else {
                  console.log('DashboardOverview - no bookingId found for testResult:', testResult.id);
                  testResultsWithBookingDetails.push(testResult);
                }
              } catch (error) {
                console.error('Error fetching booking details for test result:', testResult.id, error);
                testResultsWithBookingDetails.push(testResult);
              }
            }
        }
        
        // Transform appointments data using same logic as MyAppointments
        const transformedAppointments = (appointmentsData || []).map(b => {
          // Parse timeSlotId
          let date = '', time = '';
          if (b.timeSlotId) {
            const parts = b.timeSlotId.split('_');
            if (parts.length >= 2) {
              date = parts[0];
              time = parts[1];
            }
          }
          
          // Determine status based on booking history (same logic as MyAppointments)
          const history = b.bookingHistories_on_booking?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];
          const currentHistoryStatus = history.length > 0 ? history[0].status : null;
          
          let status = 'confirmed'; // default status
          let isUpcoming = false;
          
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
        
        console.log('DashboardOverview - testResultsWithBookingDetails:', testResultsWithBookingDetails);
        console.log('DashboardOverview - testResultsWithBookingDetails length:', testResultsWithBookingDetails?.length);
        
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
              console.log('DashboardOverview - adding amount for booking:', appointment.id, 'amount:', appointment.totalAmount, 'status:', currentHistoryStatus);
              totalAmount += parseFloat(appointment.totalAmount);
            }
          } else {
            console.log('DashboardOverview - skipping amount for cancelled booking:', appointment.id, 'status:', currentHistoryStatus, 'amount:', appointment.totalAmount);
          }
        });
        
        console.log('DashboardOverview - final counts:', { total: transformedAppointments.length, completed, inProgress, totalAmount });
        setCounts({ total: transformedAppointments.length, completed, inProgress, totalAmount });
      } catch (err) {
        console.error('Error fetching dashboard data:', err);
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

  // Process test results for ResultsSummary component
  const processTestResults = () => {
            console.log('processTestResults - testResults:', testResults);
        console.log('processTestResults - testResults length:', testResults?.length);
        if (!testResults || testResults.length === 0) {
          console.log('processTestResults - no test results found');
          return { recentResults: [], pendingResults: [] };
        }

    // Sort test results by completion date (newest first)
    const sortedResults = [...testResults].sort((a, b) => 
      new Date(b.reportDate || b.createdAt) - new Date(a.reportDate || a.createdAt)
    );

    // Get recent results (completed tests)
    const recentResults = sortedResults.slice(0, 5).map(result => {
      // Determine hasLegalValue based on booking details (same logic as TestResults.js)
      let hasLegalValue = false;
      const serviceName = result.booking?.service?.title || '';
      
      // Priority 1: Use booking details if available
      if (result.bookingDetails?.service?.category) {
        hasLegalValue = result.bookingDetails.service.category.hasLegalValue === true || 
                       result.bookingDetails.service.category.hasLegalValue === 'true' ||
                       result.bookingDetails.service.category.hasLegalValue === 1 ||
                       result.bookingDetails.service.category.hasLegalValue === '1';
      }
      // Priority 2: Use test result category if available
      else if (result.booking?.service?.category) {
        hasLegalValue = result.booking.service.category.hasLegalValue === true || 
                       result.booking.service.category.hasLegalValue === 'true' ||
                       result.booking.service.category.hasLegalValue === 1 ||
                       result.booking.service.category.hasLegalValue === '1';
      }
      // Priority 3: Fallback to service name check
      else {
        hasLegalValue = serviceName.toLowerCase().includes('hành chính') || 
                       serviceName.toLowerCase().includes('giấy khai sinh') ||
                       serviceName.toLowerCase().includes('administrative');
      }
      
      return {
        id: result.id,
        service: serviceName || 'Dịch vụ xét nghiệm ADN',
        completionDate: result.reportDate || result.createdAt,
        result: result.positive === true ? 'POSITIVE' : result.positive === false ? 'NEGATIVE' : 'INCONCLUSIVE',
        confidence: result.accuracy || 0,
        hasLegalValue: hasLegalValue,
        isNew: new Date(result.createdAt) > new Date(Date.now() - 7 * 24 * 60 * 60 * 1000) // New if created within 7 days
      };
    });

    // Get pending results (appointments that are in progress but not completed)
    const pendingResults = appointments
      .filter(appointment => {
        const history = appointment.bookingHistories_on_booking?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];
        const currentStatus = history.length > 0 ? history[0].status : null;
        return currentStatus && ['SAMPLE_COLLECTED', 'RESULT_PENDING', 'KIT_RETURNED', 'SAMPLE_RECEIVED'].includes(currentStatus);
      })
      .slice(0, 3)
      .map(appointment => {
        const history = appointment.bookingHistories_on_booking?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];
        const currentStatus = history.length > 0 ? history[0].status : null;
        
        // Calculate progress based on status
        let progress = 0;
        if (currentStatus === 'SAMPLE_COLLECTED') progress = 60;
        else if (currentStatus === 'RESULT_PENDING') progress = 80;
        else if (currentStatus === 'KIT_RETURNED' || currentStatus === 'SAMPLE_RECEIVED') progress = 70;
        else progress = 50;

        // Calculate expected date (7 days from appointment date)
        const appointmentDate = appointment.timeSlotId ? new Date(appointment.timeSlotId.split('_')[0]) : new Date(appointment.createdAt);
        const expectedDate = new Date(appointmentDate.getTime() + 7 * 24 * 60 * 60 * 1000);

        return {
          id: appointment.id,
          service: appointment.service?.title || 'Dịch vụ xét nghiệm ADN',
          status: currentStatus === 'SAMPLE_COLLECTED' ? 'Đang phân tích' :
                  currentStatus === 'RESULT_PENDING' ? 'Chuẩn bị kết quả' :
                  currentStatus === 'KIT_RETURNED' ? 'Đã nhận mẫu' :
                  currentStatus === 'SAMPLE_RECEIVED' ? 'Đang xử lý' : 'Đang thực hiện',
          progress,
          expectedDate: expectedDate.toISOString().split('T')[0]
        };
      });

                  console.log('processTestResults - recentResults:', recentResults);
        console.log('processTestResults - pendingResults:', pendingResults);
        console.log('processTestResults - recentResults length:', recentResults?.length);
        console.log('processTestResults - pendingResults length:', pendingResults?.length);
        return { recentResults, pendingResults };
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

      {/* Results Summary */}
      {(() => {
        const { recentResults, pendingResults } = processTestResults();
        console.log('DashboardOverview - passing to ResultsSummary:', { recentResults, pendingResults });
        console.log('DashboardOverview - recentResults length:', recentResults?.length);
        console.log('DashboardOverview - pendingResults length:', pendingResults?.length);
        return (
          <ResultsSummary 
            user={user} 
            recentResults={recentResults}
            pendingResults={pendingResults}
          />
        );
      })()}

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