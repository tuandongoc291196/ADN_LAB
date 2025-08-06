/**
 * COMPONENT: OrderTracking
 * CHỨC NĂNG: Tra cứu và theo dõi trạng thái đặt lịch xét nghiệm ADN
 * LUỒNG HOẠT ĐỘNG:
 * 1. Lấy bookingId từ URL params hoặc nhập từ form search
 * 2. Tải thông tin booking từ API getBookingById()
 * 3. Xác định timeline dựa trên phương thức thu mẫu (self-sample, home-visit, lab-visit)
 * 4. Hiển thị timeline với progress bar và các action buttons
 * 5. Cho phép user/staff cập nhật trạng thái qua modal
 * 6. Tính toán progress dựa trên trạng thái hiện tại
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Badge, Form, InputGroup, ProgressBar, Modal } from 'react-bootstrap';
import { getBookingById } from '../../services/api';
import { useAuth } from '../context/auth';
import { addBookingHistory } from '../../services/api';

const OrderTracking = () => {
    // ROUTER HOOKS
    const { bookingId: urlBookingId } = useParams(); // Lấy bookingId từ URL params
    const navigate = useNavigate(); // Hook điều hướng

    // AUTH CONTEXT
    const { user, isUser, isStaff, loading: authLoading } = useAuth(); // Context authentication

    // STATE QUẢN LÝ DỮ LIỆU
    const [searchId, setSearchId] = useState(urlBookingId || ''); // ID để tìm kiếm
    const [booking, setBooking] = useState(null); // Thông tin booking
    const [loading, setLoading] = useState(false); // Loading state
    const [error, setError] = useState(''); // Error message

    // STATE QUẢN LÝ UI
    const [showModal, setShowModal] = useState(false); // Hiển thị modal xác nhận
    const [modalAction, setModalAction] = useState({ type: '', description: '' }); // Thông tin action trong modal

    /**
     * CONSTANT DATA: Định nghĩa chi tiết cho từng trạng thái
     * Mỗi status có title, description và icon tương ứng
     */
    const statusDetails = {
        // Common statuses - Trạng thái chung
        CREATED: { title: 'Đặt hẹn thành công', description: 'Lịch hẹn đã được tạo', icon: 'bi-check-circle' },
        PENDING_PAYMENT: { title: 'Chờ thanh toán', description: 'Vui lòng hoàn tất thanh toán', icon: 'bi-credit-card' },
        PAYMENT_FAILED: { title: 'Thanh toán thất bại', description: 'Thanh toán không thành công', icon: 'bi-x-circle-fill' },
        PAYMENT_CONFIRMED: { title: 'Đã thanh toán', description: 'Thanh toán đã được xác nhận', icon: 'bi-check-circle-fill' },
        BOOKED: { title: 'Đã xác nhận lịch hẹn', description: 'Lịch hẹn đã được xác nhận và chuẩn bị cho khách hàng', icon: 'bi-calendar-check' },
        PREPARED: { title: 'Đã xác nhận lịch hẹn', description: 'Lịch hẹn đã được xác nhận và chuẩn bị cho khách hàng', icon: 'bi-box-seam' },
        SAMPLE_RECEIVED: { title: 'Đã thu và nhận mẫu', description: 'Mẫu đã được thu và nhận tại phòng lab', icon: 'bi-box-arrow-in-down' },
        SAMPLE_COLLECTED: { title: 'Phân tích mẫu và chuẩn bị xét nghiệm', description: 'Mẫu đã được thu thập và phân tích sơ bộ thành công', icon: 'bi-droplet-fill' },
        RESULT_PENDING: { title: 'Đang tiến hành xét nghiệm và chờ kết quả', description: 'Đang tiến hành xét nghiệm và chờ kết quả xét nghiệm', icon: 'bi-clock-history' },
        COMPLETE: { title: 'Xét nghiệm xong và đã trả kết quả trên app', description: 'Kết quả đã sẵn sàng', icon: 'bi-file-earmark-check' },
        SENT_RESULT: { title: 'Đã giao kết quả', description: 'Kết quả đã được giao cho khách hàng', icon: 'bi-send-check' },
        CANCELLED: { title: 'Đã hủy', description: 'Đơn hàng đã bị hủy', icon: 'bi-x-circle' },
        EXPIRED: { title: 'Đã hết hạn', description: 'Đơn hàng đã hết hạn', icon: 'bi-clock-history' },
        
        // Self-sample specific statuses - Trạng thái cho phương thức tự thu mẫu
        KIT_PREPARED: { title: 'Đã chuẩn bị kit', description: 'Kit xét nghiệm đã được chuẩn bị', icon: 'bi-box-seam' },
        KIT_SENT: { title: 'Đã gửi kit', description: 'Kit đã được gửi đến địa chỉ của bạn', icon: 'bi-truck' },
        KIT_RECEIVED: { title: 'Đã nhận kit', description: 'Khách hàng đã nhận được kit xét nghiệm', icon: 'bi-box-arrow-in-down' },
        KIT_RETURNED: { title: 'Đã gửi mẫu về', description: 'Khách hàng đã gửi mẫu về phòng lab', icon: 'bi-send' },
        
        // Home-visit specific statuses - Trạng thái cho phương thức nhân viên tới nhà
        STAFF_ASSIGNED: { title: 'Đã chỉ định nhân viên', description: 'Nhân viên sẽ đến thu mẫu theo lịch hẹn', icon: 'bi-person-check' },
    };

    /**
     * HELPER FUNCTION: Xác định timeline dựa trên phương thức thu mẫu
     * INPUT: method (object) - thông tin phương thức thu mẫu
     * OUTPUT: array - danh sách các trạng thái theo thứ tự timeline
     * BƯỚC 1: Kiểm tra nếu không có method thì trả về timeline mặc định
     * BƯỚC 2: Xác định methodId và methodName
     * BƯỚC 3: Trả về timeline tương ứng cho từng loại phương thức
     */
    const getTimelineForMethod = (method) => {
        if (!method || !method.id) return ['CREATED', 'PENDING_PAYMENT', 'BOOKED', 'SAMPLE_COLLECTED', 'RESULT_PENDING', 'COMPLETE', 'SENT_RESULT'];
        
        const methodId = method.id;
        const methodName = method.name?.toLowerCase() || '';
        
        // BƯỚC 3.1: Self-sample method (tự thu mẫu tại nhà)
        if (methodId === '0' || methodName.includes('tự') || methodName.includes('self') || methodName.includes('kit')) {
            return [
                'CREATED',
                'PENDING_PAYMENT',
                'PAYMENT_FAILED',
                'BOOKED',
                'KIT_PREPARED',
                'KIT_SENT',
                'KIT_RECEIVED',
                'KIT_RETURNED',
                'SAMPLE_RECEIVED',
                'SAMPLE_COLLECTED',
                'RESULT_PENDING',
                'COMPLETE',
                'SENT_RESULT',
                'CANCELLED',
                'EXPIRED'
            ];
        }
        
        // BƯỚC 3.2: Home-visit method (nhân viên tới nhà)
        if (methodId === '1' || methodName.includes('tại nhà') || methodName.includes('home') || methodName.includes('visit')) {
            return [
                'CREATED',
                'PENDING_PAYMENT',
                'PAYMENT_FAILED',
                'BOOKED',
                'STAFF_ASSIGNED',
                'SAMPLE_RECEIVED',
                'SAMPLE_COLLECTED',
                'RESULT_PENDING',
                'COMPLETE',
                'SENT_RESULT',
                'CANCELLED',
                'EXPIRED'
            ];
        }
        
        // BƯỚC 3.3: Lab-visit method (lấy mẫu tại lab/cơ sở)
        if (methodId === '2' || methodName.includes('tại lab') || methodName.includes('cơ sở') || methodName.includes('lab') || methodName.includes('facility')) {
            // Kiểm tra xem đã thanh toán chưa dựa vào trạng thái hiện tại
            const currentStatus = booking?.bookingHistories_on_booking?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))[0]?.status;
            const hasPayment = currentStatus === 'BOOKED'; // BOOKED = đã thanh toán, PREPARED = chưa thanh toán
            
            if (hasPayment) {
                // Lab-visit (đã thanh toán) - timeline: BOOKED → SAMPLE_RECEIVED → ...
                return [
                    'CREATED',
                    'PENDING_PAYMENT',
                    'PAYMENT_FAILED',
                    'BOOKED',
                    'SAMPLE_RECEIVED',
                    'SAMPLE_COLLECTED',
                    'RESULT_PENDING',
                    'COMPLETE',
                    'SENT_RESULT',
                    'CANCELLED',
                    'EXPIRED'
                ];
            } else {
                // Lab-visit (chưa thanh toán) - timeline: PREPARED → PAYMENT_CONFIRMED → ...
                return [
                    'CREATED',
                    'PENDING_PAYMENT',
                    'PAYMENT_FAILED',
                    'PREPARED',
                    'PAYMENT_CONFIRMED',
                    'SAMPLE_RECEIVED',
                    'SAMPLE_COLLECTED',
                    'RESULT_PENDING',
                    'COMPLETE',
                    'SENT_RESULT',
                    'CANCELLED',
                    'EXPIRED'
                ];
            }
        }
        
        // BƯỚC 3.4: Default timeline nếu không khớp
        return ['CREATED', 'PENDING_PAYMENT', 'PAYMENT_FAILED', 'BOOKED', 'SAMPLE_COLLECTED', 'RESULT_PENDING', 'COMPLETE', 'SENT_RESULT', 'CANCELLED', 'EXPIRED'];
    };
    
    /**
     * API CALL: Tải dữ liệu booking theo ID
     * INPUT: id (string) - ID của booking
     * BƯỚC 1: Kiểm tra nếu có id
     * BƯỚC 2: Set loading state và reset error
     * BƯỚC 3: Gọi API getBookingById()
     * BƯỚC 4: Kiểm tra quyền truy cập (user chỉ xem được booking của mình)
     * BƯỚC 5: Cập nhật state booking hoặc error
     * BƯỚC 6: Set loading state thành false
     */
    const fetchBookingData = async (id) => {
        if (!id) return;
        setLoading(true);
        setError('');
        try {
            const data = await getBookingById(id);
            if (!data || typeof data !== 'object' || !data.id) {
                setBooking(null);
                setError('Không tìm thấy thông tin đặt lịch. Vui lòng kiểm tra lại mã đặt lịch.');
                return; 
            }
            // BƯỚC 4: Kiểm tra quyền truy cập
            if (isUser() && user && data.userId !== user.id) {
                 setError('Bạn không có quyền xem đơn hàng này.');
                 setBooking(null);
            } else {
                 setBooking(data);
                 setError('');
            }
        } catch (err) {
            setBooking(null);
            setError('Không tìm thấy thông tin đặt lịch. Vui lòng kiểm tra lại mã đặt lịch.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * EFFECT: Tải dữ liệu khi URL params thay đổi
     * BƯỚC 1: Kiểm tra nếu có urlBookingId và auth đã load xong
     * BƯỚC 2: Gọi fetchBookingData() với urlBookingId
     */
    useEffect(() => {
        if (urlBookingId && !authLoading) {
            fetchBookingData(urlBookingId);
        }
    }, [urlBookingId, authLoading]);

    /**
     * EVENT HANDLER: Xử lý tìm kiếm booking
     * BƯỚC 1: Kiểm tra nếu searchId không rỗng
     * BƯỚC 2: Navigate đến trang tracking với searchId
     */
    const handleSearch = () => {
        if (!searchId.trim()) {
            setError('Vui lòng nhập mã đặt lịch');
            return;
        }
        navigate(`/tracking/${searchId.trim()}`);
    };

    /**
     * EVENT HANDLER: Xử lý click action button
     * INPUT: type (string) - loại action
     * BƯỚC 1: Set modalAction với type và description rỗng
     * BƯỚC 2: Hiển thị modal
     */
    const handleActionClick = (type) => {
        setModalAction({ type, description: '' });
        setShowModal(true);
    };

    /**
     * EVENT HANDLER: Xác nhận thực hiện action
     * BƯỚC 1: Set loading state
     * BƯỚC 2: Gọi API addBookingHistory() để cập nhật trạng thái
     * BƯỚC 3: Đóng modal và reset modalAction
     * BƯỚC 4: Refetch dữ liệu để hiển thị trạng thái mới nhất
     * BƯỚC 5: Xử lý lỗi nếu có
     * BƯỚC 6: Set loading state thành false
     */
    const handleConfirmAction = async () => {
        setLoading(true);
        try {
            await addBookingHistory({
                bookingId: booking.id,
                status: modalAction.type,
                description: modalAction.description || `Cập nhật trạng thái: ${statusDetails[modalAction.type]?.title || modalAction.type}`
            });
            setShowModal(false);
            setModalAction({ type: '', description: ''});
            // BƯỚC 4: Refetch dữ liệu để hiển thị trạng thái mới nhất
            await fetchBookingData(booking.id); 
        } catch (err) {
            setError('Cập nhật trạng thái thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    /**
     * HELPER FUNCTION: Tạo action button cho từng trạng thái
     * INPUT: statusKey (string) - trạng thái hiện tại, currentStatus (string) - trạng thái hiện tại
     * OUTPUT: JSX Button component hoặc null
     */
    const getActionButtonForStatus = (statusKey, currentStatus) => {
        if (!booking || !booking.method) return null;
        
        const methodId = booking.method.id;
        const methodName = booking.method.name?.toLowerCase() || '';
        
        // Action buttons cho khách hàng với self-collection method
        if (isUser() && (methodId === '0' || methodName.includes('tự') || methodName.includes('self'))) {
            if (statusKey === 'KIT_SENT' && currentStatus === 'KIT_SENT') {
                return <Button variant="success" size="sm" onClick={() => handleActionClick('KIT_RECEIVED')} className="mt-2 w-100"><i className="bi bi-box-arrow-in-down me-2"></i>Xác nhận đã nhận Kit</Button>;
            }
            if (statusKey === 'KIT_RECEIVED' && currentStatus === 'KIT_RECEIVED') {
                return <Button variant="primary" size="sm" onClick={() => handleActionClick('KIT_RETURNED')} className="mt-2 w-100"><i className="bi bi-send me-2"></i>Xác nhận đã gửi lại Kit</Button>;
            }
        }
        
        return null;
    };

    /**
     * HELPER FUNCTION: Render timeline với progress bar và action buttons
     * OUTPUT: JSX - timeline component
     * BƯỚC 1: Kiểm tra nếu có booking và method
     * BƯỚC 2: Lấy timeline dựa trên method
     * BƯỚC 3: Sắp xếp history theo thời gian
     * BƯỚC 4: Lọc các trạng thái đã xảy ra
     * BƯỚC 5: Tính toán progress dựa trên trạng thái hiện tại
     * BƯỚC 6: Render timeline với progress bar và action buttons
     */
    const renderTimeline = () => {
        if (!booking || !booking.method) return null;
        
        // BƯỚC 2: Lấy timeline dựa trên method
        const fullTimelineSteps = getTimelineForMethod(booking.method);
        
        // BƯỚC 3: Sắp xếp history theo thời gian
        const history = booking.bookingHistories_on_booking?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) || [];
        const completedStatuses = history.map(h => h.status);
        const currentStatus = history.length > 0 ? history.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))[0].status : null;
        
        // BƯỚC 4: Lọc các trạng thái đã xảy ra
        const occurredStatuses = [];
        let foundCurrent = false;
        
        for (const status of fullTimelineSteps) {
            if (completedStatuses.includes(status) || status === currentStatus) {
                occurredStatuses.push(status);
                if (status === currentStatus) {
                    foundCurrent = true;
                }
            } else if (foundCurrent) {
                // Dừng thêm status sau khi đã tìm thấy status hiện tại
                break;
            }
        }
        
        // Thêm CANCELLED, EXPIRED, PAYMENT_FAILED, hoặc SENT_RESULT nếu là trạng thái hiện tại
        if (currentStatus === 'CANCELLED' || currentStatus === 'EXPIRED' || currentStatus === 'PAYMENT_FAILED' || currentStatus === 'SENT_RESULT') {
            if (!occurredStatuses.includes(currentStatus)) {
                occurredStatuses.push(currentStatus);
            }
        }
        
        // BƯỚC 5: Tính toán progress dựa trên trạng thái hiện tại
        let progress = 0;
        const currentStepIndex = fullTimelineSteps.indexOf(currentStatus);
        
        if (currentStatus === 'CANCELLED' || currentStatus === 'EXPIRED' || currentStatus === 'PAYMENT_FAILED') {
            progress = 0; // 0% cho cancelled/expired/payment failed
        } else if (currentStatus === 'SENT_RESULT') {
            progress = 100; // 100% cho sent result (trạng thái cuối)
        } else if (currentStepIndex !== -1) {
            progress = ((currentStepIndex + 1) / fullTimelineSteps.length) * 100;
        } else if (currentStatus) {
            // Tìm status gần nhất trong timeline sau status hiện tại
            const allStatuses = Object.keys(statusDetails);
            const currentStatusIndex = allStatuses.indexOf(currentStatus);
            
            // Tìm status tiếp theo được hiển thị sau status hiện tại
            for (let i = 0; i < fullTimelineSteps.length; i++) {
                const timelineStatusIndex = allStatuses.indexOf(fullTimelineSteps[i]);
                if (timelineStatusIndex > currentStatusIndex) {
                    progress = (i / fullTimelineSteps.length) * 100;
                    break;
                }
            }
        }

        return (
            <>
                {/* PROGRESS BAR: Hiển thị tiến độ thực hiện */}
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="text-primary mb-0">Tiến độ thực hiện</h6>
                    <span className="fw-bold">{Math.round(progress)}%</span>
                </div>
                <ProgressBar now={progress} variant={progress === 100 ? 'success' : currentStatus === 'CANCELLED' || currentStatus === 'EXPIRED' || currentStatus === 'PAYMENT_FAILED' ? 'danger' : 'primary'} style={{ height: '10px' }} />

                <hr />

                {/* TIMELINE: Hiển thị các bước thực hiện */}
                <div className="timeline">
                    {occurredStatuses.map((statusKey, index) => {
                        const statusInfo = statusDetails[statusKey] || { title: statusKey, description: '', icon: 'bi-question-circle' };
                        const isCompleted = completedStatuses.includes(statusKey) && statusKey !== currentStatus;
                        const isCurrent = statusKey === currentStatus;
                        
                        /**
                         * HELPER FUNCTION: Lấy màu cho status
                         * OUTPUT: string - tên màu Bootstrap
                         */
                        const getStatusColor = () => {
                            if (statusKey === 'CANCELLED' || statusKey === 'EXPIRED' || statusKey === 'PAYMENT_FAILED') return 'danger';
                            if (statusKey === 'SENT_RESULT') return 'success'; // Xử lý SENT_RESULT như trạng thái hoàn thành
                            if (isCurrent) return 'primary';
                            if (isCompleted) return 'success';
                            return 'light';
                        }
                        
                        /**
                         * HELPER FUNCTION: Lấy icon cho status
                         * OUTPUT: string - tên icon Bootstrap
                         */
                        const getStatusIcon = () => {
                            if (statusKey === 'CANCELLED' || statusKey === 'EXPIRED' || statusKey === 'PAYMENT_FAILED') return 'bi-x-circle-fill';
                            if (statusKey === 'SENT_RESULT') return 'bi-send-check'; // Icon cho SENT_RESULT
                            if (isCurrent) return statusInfo.icon;
                            if (isCompleted) return 'bi-check-circle-fill';
                            return statusInfo.icon;
                        }
                        
                        // Lấy action button cho status này
                        const actionButton = getActionButtonForStatus(statusKey, currentStatus);
                        
                        return (
                            <div key={index} className="d-flex align-items-start mb-4">
                                {/* STATUS ICON: Icon và đường kết nối */}
                                <div className="me-3 text-center" style={{ minWidth: '60px' }}>
                                    <div className={`rounded-circle d-flex align-items-center justify-content-center mb-2 bg-${getStatusColor()} text-white`} style={{ width: '50px', height: '50px' }}>
                                        <i className={`${getStatusIcon()} fs-5`}></i>
                                    </div>
                                    {index < occurredStatuses.length - 1 && (
                                        <div className={`mx-auto ${isCompleted ? 'bg-success' : statusKey === 'CANCELLED' || statusKey === 'EXPIRED' || statusKey === 'PAYMENT_FAILED' ? 'bg-danger' : statusKey === 'SENT_RESULT' ? 'bg-success' : 'bg-primary'}`} style={{ width: '2px', height: '40px' }}></div>
                                    )}
                                </div>
                                
                                {/* STATUS CARD: Thông tin chi tiết status */}
                                <div className="flex-grow-1">
                                    <Card className={`border-${getStatusColor()} ${isCurrent ? 'bg-primary bg-opacity-10' : statusKey === 'CANCELLED' || statusKey === 'EXPIRED' || statusKey === 'PAYMENT_FAILED' ? 'bg-danger bg-opacity-10' : statusKey === 'SENT_RESULT' ? 'bg-success bg-opacity-10' : ''}`}>
                                        <Card.Body className="py-3">
                                            <div className="d-flex justify-content-start align-items-start">
                                                <div className="flex-grow-1">
                                                    <h6 className={`mb-1 ${isCurrent ? 'text-primary fw-bold' : statusKey === 'CANCELLED' || statusKey === 'EXPIRED' || statusKey === 'PAYMENT_FAILED' ? 'text-danger fw-bold' : statusKey === 'SENT_RESULT' ? 'text-success fw-bold' : ''}`}>
                                                        <i className={`${statusInfo.icon} me-2`}></i>{statusInfo.title}
                                                    </h6>
                                                    <p className="mb-1 text-muted small">{statusInfo.description}</p>
                                                    {(() => {
                                                        const historyEntry = history.find(h => h.status === statusKey);
                                                        if (historyEntry) {
                                                            return <p className="mb-0 text-muted" style={{ fontSize: '0.75rem' }}>
                                                                <i className="bi bi-clock me-1"></i>
                                                                {new Date(historyEntry.createdAt).toLocaleString('vi-VN')}
                                                            </p>
                                                        }
                                                        return null;
                                                    })()}
                                                </div>
                                                <Badge bg={getStatusColor()} className="ms-3 text-capitalize">
                                                    {statusKey === 'CANCELLED' || statusKey === 'EXPIRED' || statusKey === 'PAYMENT_FAILED' ? "Kết thúc" : statusKey === 'SENT_RESULT' ? "Hoàn thành" : isCurrent ? "Hiện tại" : isCompleted ? "Hoàn thành" : "Đã thực hiện"}
                                                </Badge>
                                            </div>
                                            {actionButton}
                                        </Card.Body>
                                    </Card>
                                </div>
                            </div>
                        );
                    })}
                </div>
            </>
        );
    };

    return (
        <Container className="py-5">
            {/* SEARCH SECTION: Form tìm kiếm booking */}
            <Row className="justify-content-center mb-5">
                <Col lg={8}>
                    <Card className="shadow-sm">
                        <Card.Header className="bg-primary text-white text-center">
                            <h4 className="mb-0"><i className="bi bi-search me-2"></i>Tra cứu trạng thái đặt lịch</h4>
                        </Card.Header>
                        <Card.Body>
                            <Form onSubmit={(e) => { e.preventDefault(); handleSearch(); }}>
                                <InputGroup size="lg">
                                    <Form.Control
                                        type="text"
                                        placeholder="Nhập mã đặt lịch (VD: ADN123456)"
                                        value={searchId}
                                        onChange={(e) => setSearchId(e.target.value)}
                                        disabled={loading}
                                    />
                                    <Button variant="primary" onClick={handleSearch} disabled={loading}>
                                        {loading ? <><span className="spinner-border spinner-border-sm me-2" role="status"></span>Đang tìm...</> : <><i className="bi bi-search me-2"></i>Tra cứu</>}
                                    </Button>
                                </InputGroup>
                            </Form>
                            {error && <Alert variant="danger" className="mt-3 mb-0"><i className="bi bi-exclamation-circle me-2"></i>{error}</Alert>}
                        </Card.Body>
                    </Card>
                </Col>
            </Row>

            {/* BOOKING DETAILS: Thông tin chi tiết booking */}
            {booking && (
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Card className="shadow mb-4">
                            <Card.Header className="bg-primary text-white">
                                <h5 className="mb-0"><i className="bi bi-clipboard-data me-2"></i>Thông tin đặt lịch #{booking.id}</h5>
                            </Card.Header>
                            <Card.Body>
                                 <Row>
                                     <Col md={6} className="text-center">
                                         <p className="mb-1 text-start"><strong>Dịch vụ:</strong> {booking.service?.title}</p>
                                         <p className="mb-1 text-start"><strong>Phương thức:</strong> {booking.method?.name}</p>
                                         <p className="mb-1 text-start"><strong>Loại dịch vụ:</strong> {booking.service?.category?.hasLegalValue ? 'ADN HÀNH CHÍNH' : 'ADN DÂN SỰ'}</p>
                                     </Col>
                                      <Col md={6} className="text-center">
                                         <p className="mb-1 text-start"><strong>Khách hàng:</strong> {booking.informations_on_booking?.[0]?.name}</p>
                                         <p className="mb-1 text-start"><strong>Ngày đặt lịch:</strong> {new Date(booking.createdAt).toLocaleDateString('vi-VN')}</p>
                                         <p className="mb-1 text-start"><strong>Kỹ thuật viên:</strong> {booking.staff?.user?.fullname || 'Chưa phân công'}</p>
                                     </Col>
                                 </Row>
                                <hr/>
                                {renderTimeline()}
                            </Card.Body>
                        </Card>
                        
                        {/* SUPPORT SECTION: Thông tin hỗ trợ */}
                        <Card className="shadow-sm">
                            <Card.Header className="bg-warning text-dark">
                                <h6 className="mb-0"><i className="bi bi-headset me-2"></i>Cần hỗ trợ?</h6>
                            </Card.Header>
                            <Card.Body className="d-grid gap-2">
                                <Button variant="outline-warning" size="sm"><i className="bi bi-telephone me-2"></i>Gọi hotline: 1900 1234</Button>
                                <Button variant="outline-dark" size="sm" as={Link} to="/contact"><i className="bi bi-chat-dots me-2"></i>Chat trực tuyến</Button>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            )}
            
            {/* EMPTY STATE: Hiển thị khi chưa có booking */}
            {!booking && !error && !loading && (
                 <Row>
                    <Col lg={8} className="mx-auto text-center">
                        <div className="py-5">
                            <i className="bi bi-search text-muted" style={{ fontSize: '4rem' }}></i>
                            <h4 className="text-muted mt-3">Tra cứu trạng thái đặt lịch</h4>
                            <p className="text-muted">Nhập mã đặt lịch để xem thông tin chi tiết và trạng thái hiện tại</p>
                        </div>
                    </Col>
                </Row>
            )}

            {/* CONFIRMATION MODAL: Modal xác nhận action */}
            <Modal show={showModal} onHide={() => setShowModal(false)} centered>
                <Modal.Header closeButton>
                    <Modal.Title>Xác nhận hành động</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <p>Bạn có chắc chắn muốn thực hiện hành động: <strong>{statusDetails[modalAction.type]?.title}</strong>?</p>
                    <Form.Group>
                        <Form.Label>Ghi chú (tùy chọn)</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={3}
                            value={modalAction.description}
                            onChange={(e) => setModalAction({...modalAction, description: e.target.value})}
                            placeholder="Thêm mô tả cho hành động này..."
                        />
                    </Form.Group>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
                    <Button variant="primary" onClick={handleConfirmAction} disabled={loading}>
                        {loading ? "Đang xử lý..." : "Xác nhận"}
                    </Button>
                </Modal.Footer>
            </Modal>
        </Container>
    );
};

export default OrderTracking;
