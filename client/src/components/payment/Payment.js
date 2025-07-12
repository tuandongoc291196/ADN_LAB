import React, { useState, useEffect, useMemo } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, Alert, Badge, Modal } from 'react-bootstrap';
import { getBookingById, createPayment, getServiceById } from '../../services/api';

const Payment = () => {
    const location = useLocation();
    const navigate = useNavigate();
    const [bookingData, setBookingData] = useState(null);
    const [bookingId, setBookingId] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('');
    const [paymentData, setPaymentData] = useState({
        customerName: '',
        customerPhone: '',
        customerEmail: '',
        bankTransferNote: ''
    });
    const [loading, setLoading] = useState(false);
    const [showBankModal, setShowBankModal] = useState(false);
    const [agreedToTerms, setAgreedToTerms] = useState(false);

    // Payment methods configuration
    const paymentMethods = [
        {
            id: 'momo',
            name: 'Ví MoMo',
            description: 'Thanh toán qua ví điện tử MoMo',
            icon: 'bi-phone',
            color: 'danger',
            type: 'online',
            fee: 0,
            note: 'Nhanh chóng và tiện lợi'
        },
        {
            id: 'zalopay',
            name: 'ZaloPay',
            description: 'Thanh toán qua ví điện tử ZaloPay',
            icon: 'bi-wallet2',
            color: 'info',
            type: 'online',
            fee: 0,
            note: 'Ưu đãi và hoàn tiền hấp dẫn'
        },
        {
            id: 'cash-on-service',
            name: 'Thanh toán khi sử dụng dịch vụ',
            description: 'Thanh toán bằng tiền mặt khi sử dụng dịch vụ',
            icon: 'bi-cash',
            color: 'warning',
            type: 'offline',
            fee: 0,
            note: 'Phù hợp với dịch vụ lấy mẫu trực tiếp tại cơ sở'
        }
    ];

    const getCollectionMethodName = (method) => {
        const methods = {
            'self-sample': 'Tự lấy mẫu tại nhà',
            'home-visit': 'Nhân viên tới nhà lấy mẫu',
            'at-facility': 'Tới cơ sở lấy mẫu',
            '0': 'Tự lấy mẫu tại nhà',
            '1': 'Nhân viên tới nhà lấy mẫu',
            '2': 'Tới cơ sở lấy mẫu'
        };
        return methods[method] || method;
    };

    useEffect(() => {
        let id = '';
        if (location.state && location.state.bookingData) {
            id = location.state.bookingData.id || location.state.bookingData.bookingId || '';
            setBookingId(id);
            // Nếu bookingData đã có information thì set luôn, và lấy info từ information[0]
            if (location.state.bookingData.information) {
                setBookingData(location.state.bookingData);
                const customerInfo = location.state.bookingData.information[0] || {};
                setPaymentData({
                    customerName: customerInfo.name || '',
                    customerPhone: customerInfo.phone || '',
                    customerEmail: customerInfo.email || '',
                    bankTransferNote: `Thanh toan xet nghiem ADN ${id}`
                });
            } else {
                setBookingData(location.state.bookingData);
                // Nếu không có information, để paymentData rỗng, sẽ được cập nhật khi fetch API
            }
        } else if (location.state && location.state.bookingId) {
            id = location.state.bookingId;
            setBookingId(id);
            // Luôn fetch lại thông tin booking khi chỉ có bookingId
            getBookingById(id)
                .then((data) => {
                    setBookingData(data); // data là object booking chi tiết
                    const customerInfo = data.information?.[0] || {};
                    setPaymentData({
                        customerName: customerInfo.name || '',
                        customerPhone: customerInfo.phone || '',
                        customerEmail: customerInfo.email || '',
                        bankTransferNote: `Thanh toan xet nghiem ADN ${id}`
                    });
                })
                .catch(() => {
                    navigate('/appointment');
                });
        } else {
            navigate('/appointment');
        }

        if (id && !bookingData) {
            getBookingById(id)
                .then((data) => {
                    // Đảm bảo bookingData là object booking, không phải wrapper
                    const booking = data.booking || data;
                    //setBookingData(booking);
                    // Lấy info từ information[0] (chuẩn backend)
                    const customerInfo = booking.information?.[0] || {};
                    setPaymentData({
                        customerName: customerInfo.name || '',
                        customerPhone: customerInfo.phone || '',
                        customerEmail: customerInfo.email || '',
                        bankTransferNote: `Thanh toan xet nghiem ADN ${id}`
                    });
                })
                .catch(() => {
                    navigate('/appointment');
                });
        }
    }, [location.state, navigate]);

    useEffect(() => {
        if (
            bookingData?.serviceId &&
            !bookingData?.service?.category?.name
        ) {
            getServiceById(bookingData.serviceId)
                .then((service) => {
                    setBookingData((prev) => ({
                        ...prev,
                        service: {
                            ...(prev.service || {}),
                            ...service
                        }
                    }));
                })
                .catch((error) => {
                    console.error('❌ Không lấy được category từ serviceId:', error.message);
                });
        }
    }, [bookingData?.serviceId]);
    console.log('📦 Fetched bookingData:', bookingData);

    // Helper: Map bookingData to display info for order summary (API trả về dạng mới hoặc từ form)
    const getOrderSummary = () => {
        if (!bookingData) return null;
        // Dạng bookingData trước khi lưu (từ form, có selectedService, selectedMethod, ...)
        if (bookingData.selectedService && bookingData.selectedMethod) {
            const info = bookingData.customerInfo || {};
            // Ưu tiên lấy category name từ selectedService.category
            let category = '';
            if (bookingData.selectedService.category) {
                category = bookingData.selectedService.category.name || bookingData.selectedService.category;
            } else if (bookingData.serviceType) {
                category = bookingData.serviceType;
            }
            return {
                serviceName: bookingData.selectedService.id || bookingData.selectedService.name || '',
                methodName: bookingData.selectedMethod.name || getCollectionMethodName(bookingData.selectedMethod.id || bookingData.collectionMethod),
                customerName: info.fullName || '',
                customerPhone: info.phone || '',
                customerEmail: info.email || '',
                customerAddress: info.address || '',
                appointmentDate: bookingData.appointmentDate || '',
                appointmentTime: bookingData.appointmentTime || '',
                price: bookingData.selectedMethod.price || bookingData.selectedService.price || 0,
                serviceFee: 0,
                total: (bookingData.selectedMethod.price + bookingData.selectedService.price || 0),
                category,
            };
        }
    };
    const orderSummary = useMemo(() => getOrderSummary(), [bookingData]);

    const totalAmount = orderSummary?.total || 0;

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('vi-VN', {
            style: 'currency',
            currency: 'VND'
        }).format(amount);
    };

    const handlePaymentMethodSelect = (methodId) => {
        setPaymentMethod(methodId);

        // Show bank modal if bank transfer is selected
        if (methodId === 'bank-transfer') {
            setShowBankModal(true);
        }
    };

    const handlePaymentSubmit = async () => {
        if (!paymentMethod) {
            alert('Vui lòng chọn phương thức thanh toán');
            return;
        }

        setLoading(true);

        try {
            // Map payment method ID to API format
            let method;
            switch (paymentMethod) {
                case 'momo':
                    method = 'MOMO';
                    break;
                case 'zalopay':
                    method = 'ZALOPAY';
                    break;
                case 'cash-on-service':
                    method = 'CASH';
                    break;
                default:
                    method = paymentMethod.toUpperCase();
            }
            
            const today = new Date().toISOString().split('T')[0];

            const payload = {
                bookingId,
                amount: totalAmount,
                paymentMethod: method,
                paymentDate: today
            };

            console.log('📤 Payload gửi lên:', payload);

            const response = await fetch('https://app-bggwpxm32a-uc.a.run.app/payments/add', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const result = await response.json();
            console.log('✅ Payment result:', result);

            if (!response.ok) {
                throw new Error(result.message || 'Thanh toán thất bại');
            }

            // 🔁 Redirect nếu có link thanh toán
            if (result.data && typeof result.data === 'string' && result.data.startsWith('http')) {
                window.location.href = result.data;
                return;
            }

            // ✅ Trường hợp không cần redirect
            if (paymentMethod === 'cash-on-service') {
                // Thanh toán tiền mặt
                alert('Đặt lịch thành công! Vui lòng thanh toán khi sử dụng dịch vụ.');
                navigate('/user/appointments', { state: { bookingId } });
            } else {
                // Thanh toán online
            alert('Thanh toán thành công!');
            navigate('/payment-success', { state: { bookingId } });
            }

        } catch (error) {
            console.error('❌ Payment error:', error);
            alert(`Thanh toán thất bại: ${error.message}`);
        } finally {
            setLoading(false);
        }
    };


    const selectedPaymentMethod = paymentMethods.find(m => m.id === paymentMethod);

    const getCategoryClass = (categoryName) => {
        switch (categoryName?.toLowerCase()) {
            case 'adn dân sự':
                return 'bg-success text-white px-2 py-1 rounded d-inline-block';
            case 'adn hành chính':
                return 'bg-warning text-black px-2 py-1 rounded d-inline-block';
            default:
                return 'bg-light text-dark px-2 py-1 rounded d-inline-block';
        }
    };

    return (
        <div>
            {/* Header */}
            <section className="bg-success text-white py-4">
                <Container>
                    <Row className="align-items-center">
                        <Col>
                            <h1 className="h3 mb-2">
                                <i className="bi bi-credit-card me-2"></i>
                                Thanh toán dịch vụ
                            </h1>
                            <p className="mb-0">
                                Hoàn tất thanh toán để xác nhận đặt lịch xét nghiệm ADN
                            </p>
                        </Col>
                        <Col xs="auto">
                            <div className="text-end">
                                <div className="small">Mã đặt lịch</div>
                                <strong>{bookingId}</strong>
                            </div>
                        </Col>
                    </Row>
                </Container>
            </section>

            <Container className="py-5">
                <Row>
                    {/* Order Summary */}
                    <Col lg={4} className="mb-4">
                        <Card className="shadow-sm">
                            <Card.Header className="bg-primary text-white">
                                <h5 className="mb-0">
                                    <i className="bi bi-receipt me-2"></i>
                                    Chi tiết đơn hàng
                                </h5>
                            </Card.Header>
                            <Card.Body>
                                <div className="mb-3">
                                    <h6 className="text-primary mb-2">Dịch vụ</h6>
                                    <div className="small">
                                        <div className={getCategoryClass(orderSummary?.category)}>
                                            {orderSummary?.category || ''}
                                        </div>
                                        <div className="fw-medium mt-1">{orderSummary?.serviceName}</div>
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <h6 className="text-primary mb-2">Phương thức lấy mẫu</h6>
                                    <div className="small">{orderSummary?.methodName}</div>
                                </div>

                                {orderSummary?.appointmentDate && (
                                    <div className="mb-3">
                                        <h6 className="text-primary mb-2">Lịch hẹn</h6>
                                        <div className="small">
                                            <div><strong>Ngày:</strong> {orderSummary.appointmentDate}</div>
                                            <div><strong>Giờ:</strong> {orderSummary.appointmentTime}</div>
                                        </div>
                                    </div>
                                )}

                                <div className="mb-3">
                                    <h6 className="text-primary mb-2">Khách hàng</h6>
                                    <div className="small">
                                        <div><strong>Tên:</strong> {orderSummary?.customerName}</div>
                                        <div><strong>SĐT:</strong> {orderSummary?.customerPhone}</div>
                                        <div><strong>Email:</strong> {orderSummary?.customerEmail}</div>
                                        <div><strong>Địa chỉ:</strong> {orderSummary?.customerAddress}</div>
                                    </div>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span><strong>Giá dịch vụ:</strong></span>
                                    <span className="text-primary mb-2">{bookingData?.selectedService?.price ? formatCurrency(bookingData.selectedService.price) : '—'}</span>
                                </div>

                                <div className="d-flex justify-content-between align-items-center mb-2">
                                    <span><strong>Phí dịch vụ:</strong></span>
                                    <span className="text-primary mb-2">{bookingData?.selectedMethod?.price ? formatCurrency(bookingData.selectedMethod.price) : 'Miễn phí'}</span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between align-items-center">
                                    <strong>Tổng thanh toán:</strong>
                                    <strong className="text-primary fs-5">{formatCurrency(orderSummary?.total || 0)}</strong>
                                </div>
                                <hr />
                            </Card.Body>
                        </Card>
                    </Col>
                    {/* Payment Methods */}
                    <Col lg={8}>
                        <Card className="shadow-sm">
                            <Card.Header className="bg-warning text-dark">
                                <h5 className="mb-0">
                                    <i className="bi bi-wallet me-2"></i>
                                    Chọn phương thức thanh toán
                                </h5>
                            </Card.Header>
                            <Card.Body className="p-4">
                                <Row>
                                    {paymentMethods.map(method => {
                                        const isCashMethod = method.id === 'cash-on-service';
                                        const methodName = orderSummary?.methodName?.toLowerCase() || '';

                                        // Các phương thức không được thanh toán tiền mặt
                                        // Chỉ cho phép thanh toán tiền mặt khi "tới cơ sở lấy mẫu"
                                        // "Nhân viên tới nhà" phải thanh toán trước để tránh spam
                                        // "Tự lấy mẫu" không có nhân viên thu tiền
                                        const disallowedCashMethods = ['tự lấy mẫu tại nhà', 'nhân viên tới nhà lấy mẫu'];

                                        // Convert về lowercase để so sánh chính xác
                                        const normalizedMethod = methodName.toLowerCase().trim();
                                        const isDisabledCash = isCashMethod && disallowedCashMethods.includes(normalizedMethod);
                                        return (
                                            <Col key={method.id} md={6} className="mb-3">
                                                <Card
                                                    className={`h-100 border-2 ${isDisabledCash ? 'opacity-50' : 'cursor-pointer'} ${paymentMethod === method.id
                                                        ? `border-${method.color} shadow-sm`
                                                        : 'border-light'
                                                        }`}
                                                    style={{ transition: 'all 0.3s ease' }}
                                                    onClick={() => !isDisabledCash && handlePaymentMethodSelect(method.id)}
                                                >
                                                    <Card.Body className="text-center p-3">
                                                        <div className={`bg-${method.color} bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center`}
                                                            style={{ width: '60px', height: '60px' }}>
                                                            <i className={`${method.icon} text-${method.color} fs-3`}></i>
                                                        </div>
                                                        <h6 className={`mb-2 ${paymentMethod === method.id ? `text-${method.color}` : ''}`}>
                                                            {method.name}
                                                        </h6>
                                                        <p className="small text-muted mb-2">{method.description}</p>
                                                        <div className="small text-muted">{method.note}</div>
                                                        {isDisabledCash && (
                                                            <div className="mt-2 text-danger small">
                                                                {methodName.includes('nhân viên tới nhà') 
                                                                    ? 'Không áp dụng cho phương thức thu mẫu hiện tại'
                                                                    : 'Không áp dụng cho phương thức thu mẫu hiện tại'
                                                                }
                                                            </div>
                                                        )}
                                                        {paymentMethod === method.id && !isDisabledCash && (
                                                            <div className="mt-3">
                                                                <Badge bg={method.color} className="px-3 py-2">
                                                                    <i className="bi bi-check-circle me-2"></i>
                                                                    Đã chọn
                                                                </Badge>
                                                            </div>
                                                        )}
                                                    </Card.Body>
                                                </Card>
                                            </Col>
                                        );
                                    })}
                                </Row>

                                {/* Payment Details Form */}
                                {paymentMethod && (
                                    <Card className="mt-4 border-primary">
                                        <Card.Header className="bg-primary text-white">
                                            <h6 className="mb-0">
                                                <i className="bi bi-info-circle me-2"></i>
                                                Thông tin thanh toán - {selectedPaymentMethod?.name}
                                            </h6>
                                        </Card.Header>
                                        <Card.Body>
                                            {/* Online Payment Methods */}
                                            {selectedPaymentMethod?.type === 'online' && (
                                                <Alert variant="info">
                                                    <i className="bi bi-shield-check me-2"></i>
                                                    <strong>Thanh toán trực tuyến an toàn</strong>
                                                    <p className="mb-0 mt-2">
                                                        Bạn sẽ được chuyển đến cổng thanh toán {selectedPaymentMethod?.name} để hoàn tất giao dịch.
                                                        Thông tin thanh toán được mã hóa và bảo mật tuyệt đối.
                                                    </p>
                                                </Alert>
                                            )}

                                            {/* Bank Transfer */}
                                            {paymentMethod === 'bank-transfer' && (
                                                <div>
                                                    <Alert variant="warning">
                                                        <i className="bi bi-info-circle me-2"></i>
                                                        <strong>Hướng dẫn chuyển khoản</strong>
                                                        <p className="mb-0 mt-2">
                                                            Vui lòng chuyển khoản theo thông tin bên dưới và giữ lại biên lai để xác nhận.
                                                            Đơn hàng sẽ được xử lý sau khi chúng tôi nhận được thanh toán (1-2 giờ).
                                                        </p>
                                                    </Alert>
                                                </div>
                                            )}

                                            {/* Cash on Service */}
                                            {paymentMethod === 'cash-on-service' && (
                                                <Alert variant="warning">
                                                    <i className="bi bi-cash me-2"></i>
                                                    <strong>Thanh toán khi nhận dịch vụ</strong>
                                                    <p className="mb-0 mt-2">
                                                        Bạn sẽ thanh toán bằng tiền mặt khi sử dụng dịch vụ.
                                                        {(bookingData.collectionMethod === 'at-facility' || bookingData.collectionMethod === '2') && ' Thanh toán tại quầy lễ tân trước khi xét nghiệm.'}
                                                        {(bookingData.collectionMethod === 'home-visit' || bookingData.collectionMethod === '1') && ' Không áp dụng với phương thức nhân viên tới nhà lấy mẫu.'}
                                                        {(bookingData.collectionMethod === 'self-sample' || bookingData.collectionMethod === '0') && ' Không áp dụng với phương thức tự lấy mẫu tại nhà.'}
                                                    </p>
                                                </Alert>
                                            )}

                                            {/* Customer Information Confirmation */}

                                        </Card.Body>
                                    </Card>
                                )}

                                {/* Terms and Conditions */}
                                <div className="mt-4">
                                    <Card className="border-info">
                                        <Card.Body>
                                            <Form.Check
                                                type="checkbox"
                                                id="terms-agreement"
                                                checked={agreedToTerms}
                                                onChange={(e) => setAgreedToTerms(e.target.checked)}
                                                label={
                                                    <span>
                                                        Tôi đồng ý với{' '}
                                                        <a href="/terms" target="_blank" className="text-primary">Điều khoản sử dụng</a>{' '}
                                                        và{' '}
                                                        <a href="/privacy" target="_blank" className="text-primary">Chính sách bảo mật</a>{' '}
                                                        của ADN LAB
                                                    </span>
                                                }
                                                className="mb-3"
                                            />
                                            <div className="small text-muted">
                                                <i className="bi bi-shield-check me-2 text-success"></i>
                                                Thông tin cá nhân và kết quả xét nghiệm được bảo mật tuyệt đối theo quy định pháp luật.
                                            </div>
                                        </Card.Body>
                                    </Card>
                                </div>

                                {/* Submit Button */}
                                <div className="text-center mt-4">
                                    <Button
                                        variant="success"
                                        size="lg"
                                        onClick={handlePaymentSubmit}
                                        disabled={!paymentMethod || loading || !agreedToTerms}
                                        className="px-5"
                                    >
                                        {loading ? (
                                            <>
                                                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                                                Đang xử lý...
                                            </>
                                        ) : (
                                            <>
                                                <i className="bi bi-check-circle me-2"></i>
                                                {selectedPaymentMethod?.type === 'online' ? 'Thanh toán ngay' : 'Xác nhận đặt lịch'}
                                                <span className="ms-2">({formatCurrency(totalAmount)})</span>
                                            </>
                                        )}
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>

                {/* Support Section */}
                <Row className="mt-5">
                    <Col>
                        <Card className="border-warning">
                            <Card.Body className="text-center py-4">
                                <h5 className="mb-3">
                                    <i className="bi bi-headset me-2"></i>
                                    Cần hỗ trợ thanh toán?
                                </h5>
                                <p className="text-muted mb-3">
                                    Đội ngũ chăm sóc khách hàng sẵn sàng hỗ trợ bạn 24/7
                                </p>
                                <div className="d-flex justify-content-center gap-3 flex-wrap">
                                    <Button variant="warning">
                                        <i className="bi bi-telephone me-2"></i>
                                        Hotline: 1900 1234
                                    </Button>
                                    <Button variant="outline-warning">
                                        <i className="bi bi-chat-dots me-2"></i>
                                        Chat trực tuyến
                                    </Button>
                                    <Button variant="outline-secondary">
                                        <i className="bi bi-envelope me-2"></i>
                                        Email: support@adnlab.vn
                                    </Button>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                </Row>
            </Container>

            {/* Bank Transfer Modal */}
            <Modal show={showBankModal} onHide={() => setShowBankModal(false)} size="lg">
                <Modal.Header closeButton>
                    <Modal.Title>
                        <i className="bi bi-info-circle me-2"></i>
                        Hướng dẫn chuyển khoản
                    </Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    <Alert variant="info">
                        <strong>Lưu ý quan trọng:</strong>
                        <ul className="mb-0 mt-2">
                            <li>Chuyển khoản đúng số tiền: <strong>{formatCurrency(totalAmount)}</strong></li>
                            <li>Ghi chính xác nội dung: <strong>{paymentData.bankTransferNote}</strong></li>
                            <li>Giữ lại biên lai để xác nhận khi cần thiết</li>
                            <li>Liên hệ hotline nếu sau 2 giờ chưa nhận được xác nhận</li>
                        </ul>
                    </Alert>
                    <p>Chọn một trong các tài khoản bên dưới để chuyển khoản:</p>
                </Modal.Body>
                <Modal.Footer>
                    <Button variant="secondary" onClick={() => setShowBankModal(false)}>
                        Đã hiểu
                    </Button>
                </Modal.Footer>
            </Modal>
        </div>
    );
};

export default Payment;