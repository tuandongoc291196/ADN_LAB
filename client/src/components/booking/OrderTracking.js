import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Alert, Badge, Form, InputGroup, ProgressBar, Modal } from 'react-bootstrap';
import { getBookingById } from '../../services/api';
import { useAuth } from '../context/auth';
import { addBookingHistory } from '../../services/api';

const OrderTracking = () => {
    const { bookingId: urlBookingId } = useParams();
    const navigate = useNavigate();
    const { user, isUser, isStaff } = useAuth();

    const [searchId, setSearchId] = useState(urlBookingId || '');
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');
    
    const [showModal, setShowModal] = useState(false);
    const [modalAction, setModalAction] = useState({ type: '', description: '' });

    const statusDetails = {
        // Common
        CREATED: { title: 'Đặt hẹn thành công', description: 'Lịch hẹn đã được tạo', icon: 'bi-check-circle' },
        PENDING: { title: 'Chờ xử lý', description: 'Đơn hàng đang chờ được xử lý', icon: 'bi-clock' },
        PENDING_PAYMENT: { title: 'Chờ thanh toán', description: 'Vui lòng hoàn tất thanh toán', icon: 'bi-credit-card' },
        PAYMENT_CONFIRMED: { title: 'Đã thanh toán', description: 'Thanh toán đã được xác nhận', icon: 'bi-check-circle-fill' },
        BOOKED: { title: 'Đã xác nhận lịch hẹn', description: 'Lịch hẹn đã được xác nhận', icon: 'bi-calendar-check' },
        SAMPLE_COLLECTED: { title: 'Thu mẫu thành công', description: 'Mẫu đã được thu thập thành công', icon: 'bi-droplet-fill' },
        SAMPLE_PROCESSING: { title: 'Đang phân tích mẫu', description: 'Đang tiến hành phân tích ADN tại phòng lab', icon: 'bi-eye' },
        RESULT_AVAILABLE: { title: 'Có kết quả', description: 'Kết quả đã sẵn sàng', icon: 'bi-file-earmark-check' },
        CANCELLED: { title: 'Đã hủy', description: 'Đơn hàng đã bị hủy', icon: 'bi-x-circle' },
        EXPIRED: { title: 'Đã hết hạn', description: 'Đơn hàng đã hết hạn', icon: 'bi-clock-history' },
        
        // Self-sample
        KIT_PREPARING: { title: 'Chuẩn bị kit xét nghiệm', description: 'Đang chuẩn bị kit gửi đến bạn', icon: 'bi-box' },
        KIT_PREPARED: { title: 'Đã chuẩn bị kit xét nghiệm', description: 'Kit đã được chuẩn bị xong', icon: 'bi-box-seam' },
        KIT_SENT: { title: 'Đã gửi kit xét nghiệm', description: 'Kit đã được gửi đến địa chỉ của bạn', icon: 'bi-truck' },
        KIT_RECEIVED: { title: 'Đã nhận kit', description: 'Khách hàng đã nhận được kit xét nghiệm', icon: 'bi-box-arrow-in-down' },
        SAMPLE_RECEIVED: { title: 'Đã nhận mẫu', description: 'Mẫu đã được nhận', icon: 'bi-box-arrow-in-down' },
        SELF_COLLECTED: { title: 'Đã tự thu mẫu', description: 'Khách hàng đã tự thu mẫu', icon: 'bi-droplet' },
        KIT_RETURNED: { title: 'Đã gửi mẫu về', description: 'Khách hàng đã gửi mẫu về phòng lab', icon: 'bi-send' },
        SAMPLE_SENT: { title: 'Đã gửi mẫu', description: 'Mẫu đã được gửi về phòng lab', icon: 'bi-send' },

        // Home-visit
        STAFF_ASSIGNED: { title: 'Đã chỉ định nhân viên', description: 'Nhân viên sẽ đến thu mẫu theo lịch hẹn', icon: 'bi-person-check' },
        STAFF_CONFIRMED: { title: 'Nhân viên xác nhận', description: 'Nhân viên xác nhận sẽ đến đúng hẹn', icon: 'bi-person-video2' },
    };

    const getTimelineForMethod = (method) => {
        if (!method || !method.id) return ['CREATED', 'PAYMENT_CONFIRMED', 'BOOKED', 'SAMPLE_PROCESSING', 'RESULT_AVAILABLE'];
        
        const methodId = method.id;
        const methodName = method.name?.toLowerCase() || '';
        
        // Self-sample method (tự lấy mẫu tại nhà)
        if (methodId === '0' || methodName.includes('tự') || methodName.includes('self') || methodName.includes('kit')) {
            return [
                'CREATED', 
                'PENDING_PAYMENT',
                'PAYMENT_CONFIRMED', 
                'BOOKED',

                'PENDING',
                'KIT_PREPARED', 
                'KIT_SENT',
                'KIT_RECEIVED', 
                'SELF_COLLECTED',
                'KIT_RETURNED', 

                'RESULT_PENDING', 
                'COMPLETED'
            ];
        }
        
        // Home-visit method (nhân viên đến nhà)
        if (methodId === '1' || methodName.includes('tại nhà') || methodName.includes('home') || methodName.includes('visit')) {
            return [
                'CREATED', 
                'PENDING_PAYMENT',
                'PAYMENT_CONFIRMED', 
                'BOOKED',
                'KIT_PREPARED',
                'KIT_SENT',
                'KIT_RECEIVED',
                'SELF_COLLECTED',
                'KIT_RETURNED',

                'PENDING',  
                'STAFF_ASSIGNED', 
                'SAMPLE_COLLECTED', 
                'SAMPLE_PROCESSING', 
                'RESULT_AVAILABLE'
            ];
        }
        
        // Lab-visit method (đến lab/cơ sở)
        if (methodId === '2' || methodName.includes('tại lab') || methodName.includes('cơ sở') || methodName.includes('lab') || methodName.includes('facility')) {
            return [
                'CREATED', 
                'PENDING_PAYMENT',
                'PAYMENT_CONFIRMED', 
                'BOOKED',
                'KIT_PREPARED',
                'KIT_SENT',
                'KIT_RECEIVED',
                'SELF_COLLECTED',
                'KIT_RETURNED',

                'PENDING',
                'SAMPLE_COLLECTED', 
                'SAMPLE_PROCESSING', 
                'RESULT_AVAILABLE'
            ];
        }
        
        // Default timeline if no match
        console.warn('Method ID not recognized, using default timeline:', method.id);
        return ['CREATED', 'PAYMENT_CONFIRMED', 'BOOKED', 'SAMPLE_PROCESSING', 'RESULT_AVAILABLE'];
    };
    
    const fetchBookingData = async (id) => {
        if (!id) return;
        setLoading(true);
        setError('');
        try {
            const data = await getBookingById(id);
            if (!data) {
                setBooking(null);
                setError('Không tìm thấy thông tin đặt lịch. Vui lòng kiểm tra lại mã đặt lịch.');
                return; 
            }
            if (isUser() && data.userId !== user.id) {
                 setError('Bạn không có quyền xem đơn hàng này.');
                 setBooking(null);
            } else {
                 setBooking(data);
            }
        } catch (err) {
            setBooking(null);
            setError('Không tìm thấy thông tin đặt lịch. Vui lòng kiểm tra lại mã đặt lịch.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (urlBookingId) {
            fetchBookingData(urlBookingId);
        }
        
        // Set up polling to refetch data every 15 seconds
        const intervalId = setInterval(() => {
            if (urlBookingId) {
                console.log("Polling for booking updates...");
                fetchBookingData(urlBookingId);
            }
        }, 15000); // Poll every 15 seconds

        // Cleanup function to clear the interval when the component unmounts
        return () => clearInterval(intervalId);
        
    }, [urlBookingId, isUser, user]);

    const handleSearch = () => {
        if (!searchId.trim()) {
            setError('Vui lòng nhập mã đặt lịch');
            return;
        }
        navigate(`/tracking/${searchId.trim()}`);
    };

    const handleActionClick = (type) => {
        setModalAction({ type, description: '' });
        setShowModal(true);
    };

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
            // Refetch data to show the latest status
            await fetchBookingData(booking.id); 
        } catch (err) {
            setError('Cập nhật trạng thái thất bại. Vui lòng thử lại.');
        } finally {
            setLoading(false);
        }
    };

    const getActionButtonForStatus = (statusKey, currentStatus) => {
        if (!booking || !booking.method) return null;
        
        const methodId = booking.method.id;
        const methodName = booking.method.name?.toLowerCase() || '';
        
        // User actions for self-collection method
        if (isUser() && (methodId === '0' || methodName.includes('tự') || methodName.includes('self'))) {
            if (statusKey === 'KIT_SENT' && currentStatus === 'KIT_SENT') {
                return <Button variant="success" size="sm" onClick={() => handleActionClick('KIT_RECEIVED')} className="mt-2 w-100"><i className="bi bi-box-arrow-in-down me-2"></i>Xác nhận đã nhận Kit</Button>;
            }
            if (statusKey === 'KIT_RECEIVED' && currentStatus === 'KIT_RECEIVED') {
                return <Button variant="primary" size="sm" onClick={() => handleActionClick('SELF_COLLECTED')} className="mt-2 w-100"><i className="bi bi-droplet me-2"></i>Xác nhận đã thu mẫu</Button>;
            }
            if (statusKey === 'SELF_COLLECTED' && currentStatus === 'SELF_COLLECTED') {
                return <Button variant="primary" size="sm" onClick={() => handleActionClick('KIT_RETURNED')} className="mt-2 w-100"><i className="bi bi-send me-2"></i>Xác nhận đã gửi mẫu về</Button>;
            }
        }
        
        // Staff actions
        if (isStaff()) {
            // Self-sample method staff actions
            if (methodId === '0' || methodName.includes('tự') || methodName.includes('self')) {
                if (statusKey === 'PAYMENT_CONFIRMED' && ['CREATED', 'PENDING', 'PENDING_PAYMENT', 'PAYMENT_CONFIRMED', 'BOOKED'].includes(currentStatus)) {
                    return (
                        <div className="d-grid gap-2 mt-2">
                            <Button variant="outline-primary" size="sm" onClick={() => handleActionClick('KIT_PREPARED')}>Xác nhận đã chuẩn bị kit</Button>
                        </div>
                    );
                }
                
                if (statusKey === 'KIT_PREPARED' && currentStatus === 'KIT_PREPARED') {
                    return (
                        <div className="d-grid gap-2 mt-2">
                            <Button variant="outline-primary" size="sm" onClick={() => handleActionClick('KIT_SENT')}>Xác nhận đã gửi kit</Button>
                        </div>
                    );
                }
                
                if (statusKey === 'KIT_RETURNED' && ['KIT_RETURNED', 'SAMPLE_RECEIVED'].includes(currentStatus)) {
                    return (
                        <div className="d-grid gap-2 mt-2">
                            <Button variant="outline-primary" size="sm" onClick={() => handleActionClick('SAMPLE_PROCESSING')}>Bắt đầu xử lý mẫu</Button>
                        </div>
                    );
                }
                
                if (statusKey === 'SAMPLE_PROCESSING' && currentStatus === 'SAMPLE_PROCESSING') {
                    return (
                        <div className="d-grid gap-2 mt-2">
                            <Button variant="outline-success" size="sm" onClick={() => handleActionClick('RESULT_AVAILABLE')}>Công bố kết quả</Button>
                        </div>
                    );
                }
            } else if (methodId === '1' || methodName.includes('tại nhà')) {
                // Home visit method staff actions
                if (statusKey === 'PAYMENT_CONFIRMED' && ['CREATED', 'PENDING', 'PENDING_PAYMENT', 'PAYMENT_CONFIRMED', 'BOOKED'].includes(currentStatus)) {
                    return (
                        <div className="d-grid gap-2 mt-2">
                            <Button variant="outline-primary" size="sm" onClick={() => handleActionClick('STAFF_ASSIGNED')}>Chỉ định nhân viên</Button>
                        </div>
                    );
                }
                
                if (statusKey === 'STAFF_ASSIGNED' && currentStatus === 'STAFF_ASSIGNED') {
                    return (
                        <div className="d-grid gap-2 mt-2">
                            <Button variant="outline-primary" size="sm" onClick={() => handleActionClick('SAMPLE_COLLECTED')}>Xác nhận đã thu mẫu</Button>
                        </div>
                    );
                }
                
                if (statusKey === 'SAMPLE_COLLECTED' && currentStatus === 'SAMPLE_COLLECTED') {
                    return (
                        <div className="d-grid gap-2 mt-2">
                            <Button variant="outline-primary" size="sm" onClick={() => handleActionClick('SAMPLE_PROCESSING')}>Bắt đầu xử lý mẫu</Button>
                        </div>
                    );
                }
                
                if (statusKey === 'SAMPLE_PROCESSING' && currentStatus === 'SAMPLE_PROCESSING') {
                    return (
                        <div className="d-grid gap-2 mt-2">
                            <Button variant="outline-success" size="sm" onClick={() => handleActionClick('RESULT_AVAILABLE')}>Công bố kết quả</Button>
                        </div>
                    );
                }
            } else {
                // Lab visit method staff actions
                if (statusKey === 'PAYMENT_CONFIRMED' && ['CREATED', 'PENDING', 'PENDING_PAYMENT', 'PAYMENT_CONFIRMED', 'BOOKED'].includes(currentStatus)) {
                    return (
                        <div className="d-grid gap-2 mt-2">
                            <Button variant="outline-primary" size="sm" onClick={() => handleActionClick('SAMPLE_COLLECTED')}>Xác nhận đã thu mẫu</Button>
                        </div>
                    );
                }
                
                if (statusKey === 'SAMPLE_COLLECTED' && currentStatus === 'SAMPLE_COLLECTED') {
                    return (
                        <div className="d-grid gap-2 mt-2">
                            <Button variant="outline-primary" size="sm" onClick={() => handleActionClick('SAMPLE_PROCESSING')}>Bắt đầu xử lý mẫu</Button>
                        </div>
                    );
                }
                
                if (statusKey === 'SAMPLE_PROCESSING' && currentStatus === 'SAMPLE_PROCESSING') {
                    return (
                        <div className="d-grid gap-2 mt-2">
                            <Button variant="outline-success" size="sm" onClick={() => handleActionClick('RESULT_AVAILABLE')}>Công bố kết quả</Button>
                        </div>
                    );
                }
            }
        }

        return null;
    };

    const renderTimeline = () => {
        if (!booking || !booking.method) return null;
        
        // Get the full timeline based on method
        const fullTimelineSteps = getTimelineForMethod(booking.method);
        
        // Filter out pending/waiting/intermediate statuses to make timeline shorter
        const skippableStatuses = ['PENDING', 'PENDING_PAYMENT', 'STAFF_CONFIRMED'];
        const timelineSteps = fullTimelineSteps.filter(status => !skippableStatuses.includes(status));
        
        const history = booking.bookingHistories_on_booking?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) || [];
        const completedStatuses = history.map(h => h.status);
        const currentStatus = history.length > 0 ? history.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))[0].status : null;
        
        // Calculate progress based on the current status in the filtered timeline
        let progress = 0;
        const currentStepIndex = timelineSteps.indexOf(currentStatus);
        
        // If current status is not in our filtered timeline, find the nearest previous status
        if (currentStepIndex !== -1) {
            progress = ((currentStepIndex + 1) / timelineSteps.length) * 100;
        } else if (currentStatus) {
            // Find the nearest status in our timeline that comes after the current status
            const allStatuses = Object.keys(statusDetails);
            const currentStatusIndex = allStatuses.indexOf(currentStatus);
            
            // Find the next displayed status after the current one
            for (let i = 0; i < timelineSteps.length; i++) {
                const timelineStatusIndex = allStatuses.indexOf(timelineSteps[i]);
                if (timelineStatusIndex > currentStatusIndex) {
                    progress = (i / timelineSteps.length) * 100;
                    break;
                }
            }
        }

        return (
            <>
                <div className="d-flex justify-content-between align-items-center mb-2">
                    <h6 className="text-primary mb-0">Tiến độ thực hiện</h6>
                    <span className="fw-bold">{Math.round(progress)}%</span>
                </div>
                <ProgressBar now={progress} variant={progress === 100 ? 'success' : 'primary'} style={{ height: '10px' }} />

                <hr />

                <div className="timeline">
                    {timelineSteps.map((statusKey, index) => {
                        const statusInfo = statusDetails[statusKey] || { title: statusKey, description: '', icon: 'bi-question-circle' };
                        const isCompleted = completedStatuses.includes(statusKey);
                        const isCurrent = statusKey === currentStatus;
                        
                        // Consider a status "completed" if any later status in the full timeline is completed
                        const isEffectivelyCompleted = isCompleted || fullTimelineSteps.some((step, stepIndex) => {
                            const stepPosition = fullTimelineSteps.indexOf(step);
                            const statusPosition = fullTimelineSteps.indexOf(statusKey);
                            return stepIndex > statusPosition && completedStatuses.includes(step);
                        });
                        
                        const getStatusColor = () => {
                            if (isCurrent) return 'primary';
                            if (isEffectivelyCompleted) return 'success';
                            return 'light';
                        }
                        
                        const getStatusIcon = () => {
                            if (isCurrent) return 'bi-arrow-right-circle-fill';
                            if (isEffectivelyCompleted) return 'bi-check-circle-fill';
                            return 'bi-circle';
                        }
                        
                        // Get action button for this status
                        const actionButton = getActionButtonForStatus(statusKey, currentStatus);
                        
                        return (
                            <div key={index} className="d-flex align-items-start mb-4">
                                <div className="me-3 text-center" style={{ minWidth: '60px' }}>
                                    <div className={`rounded-circle d-flex align-items-center justify-content-center mb-2 bg-${getStatusColor()} text-white`} style={{ width: '50px', height: '50px' }}>
                                        <i className={`${getStatusIcon()} fs-5`}></i>
                                    </div>
                                    {index < timelineSteps.length - 1 && (
                                        <div className={`mx-auto ${isEffectivelyCompleted ? 'bg-success' : 'bg-light'}`} style={{ width: '2px', height: '40px' }}></div>
                                    )}
                                </div>
                                <div className="flex-grow-1">
                                    <Card className={`border-${getStatusColor()} ${isCurrent ? 'bg-primary bg-opacity-10' : ''}`}>
                                        <Card.Body className="py-3">
                                            <div className="d-flex justify-content-between align-items-start">
                                                <div>
                                                    <h6 className={`mb-1 ${isCurrent ? 'text-primary fw-bold' : ''}`}>
                                                        <i className={`${statusInfo.icon} me-2`}></i>{statusInfo.title}
                                                    </h6>
                                                    <p className="mb-0 text-muted small">{statusInfo.description}</p>
                                                </div>
                                                <Badge bg={getStatusColor()} className="ms-3 text-capitalize">
                                                    {isCurrent ? "Hiện tại" : isEffectivelyCompleted ? "Hoàn thành" : "Chờ"}
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

            {booking && (
                <Row className="justify-content-center">
                    <Col lg={8}>
                        <Card className="shadow mb-4">
                            <Card.Header className="bg-primary text-white">
                                <h5 className="mb-0"><i className="bi bi-clipboard-data me-2"></i>Thông tin đặt lịch #{booking.id}</h5>
                            </Card.Header>
                            <Card.Body>
                                 <Row>
                                    <Col md={6}>
                                        <p className="mb-1"><strong>Dịch vụ:</strong> {booking.service?.title}</p>
                                        <p className="mb-1"><strong>Phương thức:</strong> {booking.method?.name}</p>
                                        <p className="mb-1"><strong>Loại:</strong> <Badge bg={booking.service?.category?.hasLegalValue ? 'warning' : 'success'}>{booking.service?.category?.hasLegalValue ? 'Hành chính' : 'Dân sự'}</Badge></p>
                                    </Col>
                                     <Col md={6}>
                                        <p className="mb-1"><strong>Khách hàng:</strong> {booking.informations_on_booking?.[0]?.name}</p>
                                        <p className="mb-1"><strong>Ngày đặt:</strong> {new Date(booking.createdAt).toLocaleDateString('vi-VN')}</p>
                                    </Col>
                                </Row>
                                <hr/>
                                {renderTimeline()}
                            </Card.Body>
                        </Card>
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
