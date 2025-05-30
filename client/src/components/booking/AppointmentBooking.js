import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Form, Alert, Tab, Nav } from 'react-bootstrap';
import { getServicesByType, getServiceById, getAvailableMethodsForService, COLLECTION_METHODS, canServiceUseSelfSample, isAdministrativeService } from '../data/services-data';

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    serviceType: '', // 'civil' or 'administrative'
    serviceId: '',
    collectionMethod: '',
    appointmentDate: '',
    appointmentTime: '',
    customerInfo: {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      idNumber: '',
      participants: []
    },
    specialRequests: ''
  });

  // Load pre-selected service from navigation state
  useEffect(() => {
    if (location.state?.selectedService) {
      const service = getServiceById(location.state.selectedService);
      if (service) {
        setBookingData(prev => ({
          ...prev,
          serviceType: service.serviceType,
          serviceId: service.id,
          customerInfo: {
            ...prev.customerInfo,
            participants: service.participants.map((role, index) => ({
              id: index,
              role: role,
              name: '',
              idNumber: '',
              phone: ''
            }))
          }
        }));
        setCurrentStep(2); // Skip service selection
      }
    }
  }, [location.state]);

  // Available time slots
  const timeSlots = [
    '08:00', '08:30', '09:00', '09:30', '10:00', '10:30',
    '11:00', '11:30', '13:30', '14:00', '14:30', '15:00',
    '15:30', '16:00', '16:30', '17:00'
  ];

  const handleServiceTypeChange = (type) => {
    setBookingData({
      ...bookingData,
      serviceType: type,
      serviceId: '',
      collectionMethod: '',
      customerInfo: {
        ...bookingData.customerInfo,
        participants: []
      }
    });
  };

  const handleServiceSelect = (serviceId) => {
    const selectedService = getServiceById(serviceId);
    
    setBookingData({
      ...bookingData,
      serviceId: serviceId,
      collectionMethod: '',
      customerInfo: {
        ...bookingData.customerInfo,
        participants: selectedService ? selectedService.participants.map((role, index) => ({
          id: index,
          role: role,
          name: '',
          idNumber: '',
          phone: ''
        })) : []
      }
    });
  };

  const handleMethodSelect = (method) => {
    setBookingData({
      ...bookingData,
      collectionMethod: method
    });
  };

  const handleCustomerInfoChange = (field, value) => {
    setBookingData({
      ...bookingData,
      customerInfo: {
        ...bookingData.customerInfo,
        [field]: value
      }
    });
  };

  const handleParticipantChange = (index, field, value) => {
    const updatedParticipants = [...bookingData.customerInfo.participants];
    updatedParticipants[index] = {
      ...updatedParticipants[index],
      [field]: value
    };
    setBookingData({
      ...bookingData,
      customerInfo: {
        ...bookingData.customerInfo,
        participants: updatedParticipants
      }
    });
  };

  const nextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    }
  };

  const prevStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleBookingSubmit = () => {
    // TODO: Submit booking data to API
    console.log('Booking data:', bookingData);
    // Navigate to confirmation page
    navigate('/booking-confirmation', { state: { bookingData } });
  };

  const selectedService = bookingData.serviceId ? getServiceById(bookingData.serviceId) : null;
  const availableMethods = bookingData.serviceId ? getAvailableMethodsForService(bookingData.serviceId) : [];
  const selectedMethod = bookingData.collectionMethod ? COLLECTION_METHODS[bookingData.collectionMethod] : null;

  // Generate next 30 days for date selection (excluding Sundays)
  const generateDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      // Skip Sundays
      if (date.getDay() !== 0) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const getServiceTypeBadge = (serviceType) => {
    return serviceType === 'administrative' 
      ? <Badge bg="warning" text="dark">Có giá trị pháp lý</Badge>
      : <Badge bg="success">Dân sự</Badge>;
  };

  const getMethodBadges = (allowedMethods) => {
    return allowedMethods.map(methodId => {
      const method = COLLECTION_METHODS[methodId];
      return (
        <Badge 
          key={methodId} 
          bg={method.color} 
          className="me-1"
          title={method.description}
        >
          <i className={`${method.icon} me-1`}></i>
          {method.title}
        </Badge>
      );
    });
  };

  // Check if a method is disabled for current service
  const isMethodDisabled = (methodId, service) => {
    if (!service) return true;
    
    // Administrative services cannot use self-sample
    if (methodId === 'self-sample' && service.serviceType === 'administrative') {
      return true;
    }
    
    // ADN trước sinh cannot use self-sample (even though it's civil)
    if (methodId === 'self-sample' && service.id === 'civil-prenatal') {
      return true;
    }
    
    return !service.allowedMethods.includes(methodId);
  };

  // Get restriction reason for disabled methods
  const getMethodRestrictionReason = (methodId, service) => {
    if (!service) return '';
    
    if (methodId === 'self-sample' && service.serviceType === 'administrative') {
      return 'ADN hành chính bắt buộc phải có giám sát để đảm bảo giá trị pháp lý';
    }
    
    if (methodId === 'self-sample' && service.id === 'civil-prenatal') {
      return 'ADN trước sinh cần chuyên gia y tế thực hiện để đảm bảo an toàn';
    }
    
    return 'Phương thức này không khả dụng cho dịch vụ đã chọn';
  };

  return (
    <div>
      {/* Header Section */}
      <section className="bg-primary text-white py-4">
        <Container>
          <Row className="align-items-center">
            <Col>
              <h1 className="h3 mb-2">
                <i className="bi bi-calendar-plus me-2"></i>
                Đặt lịch xét nghiệm ADN
              </h1>
              <p className="mb-0">
                Đặt lịch nhanh chóng và tiện lợi - Nhận kết quả chính xác 99.999%
              </p>
            </Col>
            <Col xs="auto">
              <div className="text-end">
                <div className="small">Hỗ trợ 24/7</div>
                <strong>1900 1234</strong>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        {/* Progress Indicator */}
        <Row className="mb-5">
          <Col>
            <div className="d-flex justify-content-center">
              <div className="d-flex align-items-center">
                {[1, 2, 3, 4].map((step, index) => (
                  <React.Fragment key={step}>
                    <div className={`rounded-circle d-flex align-items-center justify-content-center border-2 ${
                      currentStep >= step 
                        ? 'bg-primary text-white border-primary' 
                        : currentStep === step - 1 
                          ? 'bg-white text-primary border-primary'
                          : 'bg-light text-muted border-light'
                    }`} style={{ width: '50px', height: '50px', fontWeight: 'bold' }}>
                      {currentStep > step ? (
                        <i className="bi bi-check-lg"></i>
                      ) : (
                        step
                      )}
                    </div>
                    {index < 3 && (
                      <div className={`mx-3`} 
                           style={{ 
                             width: '60px', 
                             height: '3px', 
                             backgroundColor: currentStep > step ? '#0d6efd' : '#dee2e6' 
                           }}>
                      </div>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
            <Row className="mt-3">
              <Col className="text-center">
                <small className={`fw-medium ${currentStep >= 1 ? 'text-primary' : 'text-muted'}`}>
                  Chọn dịch vụ
                </small>
              </Col>
              <Col className="text-center">
                <small className={`fw-medium ${currentStep >= 2 ? 'text-primary' : 'text-muted'}`}>
                  Phương thức lấy mẫu
                </small>
              </Col>
              <Col className="text-center">
                <small className={`fw-medium ${currentStep >= 3 ? 'text-primary' : 'text-muted'}`}>
                  Thông tin & Lịch hẹn
                </small>
              </Col>
              <Col className="text-center">
                <small className={`fw-medium ${currentStep >= 4 ? 'text-primary' : 'text-muted'}`}>
                  Xác nhận đặt lịch
                </small>
              </Col>
            </Row>
          </Col>
        </Row>

        {/* Step 1: Service Selection */}
        {currentStep === 1 && (
          <>
            <div className="text-center mb-5">
              <h2 className="display-6 fw-bold">Chọn loại dịch vụ xét nghiệm</h2>
              <p className="lead text-muted">Lựa chọn dịch vụ phù hợp với nhu cầu của bạn</p>
            </div>

            {/* Service Type Comparison */}
            <Row className="mb-5">
              <Col md={6} className="mb-4">
                <Card 
                  className={`h-100 border-success cursor-pointer ${
                    bookingData.serviceType === 'civil' ? 'border-3 shadow-lg' : 'border-2'
                  }`}
                  onClick={() => handleServiceTypeChange('civil')}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                >
                  <Card.Header className="bg-success text-white text-center py-4">
                    <i className="bi bi-house fs-1 mb-3 d-block"></i>
                    <h3 className="mb-2">ADN Dân sự</h3>
                    <Badge bg="light" text="dark" className="fs-6">Mục đích cá nhân</Badge>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <div className="mb-4">
                      <h5 className="text-success mb-3">Đặc điểm:</h5>
                      <ul className="list-unstyled ps-3">
                        <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Hầu hết có thể tự lấy mẫu tại nhà</li>
                        <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Bảo mật và riêng tư cao</li>
                        <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Thuận tiện và nhanh chóng</li>
                        <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Giá thành hợp lý</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h6 className="text-success mb-3">Phù hợp cho:</h6>
                      <ul className="small text-muted ps-3">
                        <li>Tìm hiểu quan hệ huyết thống cá nhân</li>
                        <li>Nghiên cứu nguồn gốc gia đình</li>
                        <li>Phân tích đặc điểm di truyền</li>
                        <li>Xét nghiệm riêng tư, kín đáo</li>
                      </ul>
                    </div>

                    <Alert variant="info" className="small mb-3">
                      <i className="bi bi-info-circle me-2"></i>
                      <strong>Lưu ý:</strong> ADN trước sinh không thể tự lấy mẫu do yêu cầu kỹ thuật đặc biệt
                    </Alert>

                    {bookingData.serviceType === 'civil' && (
                      <div className="text-center">
                        <Badge bg="success" className="px-3 py-2">
                          <i className="bi bi-check-circle me-2"></i>
                          Đã chọn loại dịch vụ này
                        </Badge>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6} className="mb-4">
                <Card 
                  className={`h-100 border-warning cursor-pointer ${
                    bookingData.serviceType === 'administrative' ? 'border-3 shadow-lg' : 'border-2'
                  }`}
                  onClick={() => handleServiceTypeChange('administrative')}
                  style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                >
                  <Card.Header className="bg-warning text-dark text-center py-4">
                    <i className="bi bi-award fs-1 mb-3 d-block"></i>
                    <h3 className="mb-2">ADN Hành chính</h3>
                    <Badge bg="dark" className="fs-6">Có giá trị pháp lý</Badge>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <div className="mb-4">
                      <h5 className="text-warning mb-3">Đặc điểm:</h5>
                      <ul className="list-unstyled">
                        <li className="mb-2"><i className="bi bi-shield-check text-warning me-2"></i>Có giá trị pháp lý đầy đủ</li>
                        <li className="mb-2"><i className="bi bi-shield-check text-warning me-2"></i>Được tòa án công nhận</li>
                        <li className="mb-2"><i className="bi bi-shield-check text-warning me-2"></i>Thu mẫu có giám sát nghiêm ngặt</li>
                        <li className="mb-2"><i className="bi bi-shield-check text-warning me-2"></i>Tuân thủ tiêu chuẩn quốc tế</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h6 className="text-warning mb-3">Phù hợp cho:</h6>
                      <ul className="small text-muted">
                        <li>Làm giấy khai sinh</li>
                        <li>Thủ tục nhập tịch, visa</li>
                        <li>Giải quyết tranh chấp thừa kế</li>
                        <li>Xác định trách nhiệm cấp dưỡng</li>
                      </ul>
                    </div>

                    <Alert variant="warning" className="small mb-3">
                      <i className="bi bi-exclamation-triangle me-2"></i>
                      <strong>Bắt buộc:</strong> KHÔNG thể tự lấy mẫu tại nhà. Phải có nhân viên giám sát để đảm bảo giá trị pháp lý.
                    </Alert>

                    {bookingData.serviceType === 'administrative' && (
                      <div className="text-center">
                        <Badge bg="warning" text="dark" className="px-3 py-2">
                          <i className="bi bi-check-circle me-2"></i>
                          Đã chọn loại dịch vụ này
                        </Badge>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Specific Service Selection */}
            {bookingData.serviceType && (
              <>
                <div className="mb-4">
                  <h3 className="mb-3">
                    Chọn dịch vụ cụ thể
                    <span className="ms-3">
                      {getServiceTypeBadge(bookingData.serviceType)}
                    </span>
                  </h3>
                  <p className="text-muted">
                    Tất cả dịch vụ đều đảm bảo độ chính xác 99.999% với công nghệ hiện đại
                  </p>
                </div>

                <Row>
                  {getServicesByType(bookingData.serviceType).map(service => (
                    <Col key={service.id} lg={4} md={6} className="mb-4">
                      <Card 
                        className={`h-100 border-0 shadow-sm ${
                          bookingData.serviceId === service.id 
                            ? 'border-start border-4 border-primary shadow-lg' 
                            : ''
                        }`}
                        style={{ 
                          cursor: 'pointer', 
                          transition: 'all 0.3s ease',
                          transform: bookingData.serviceId === service.id ? 'translateY(-5px)' : 'none'
                        }}
                        onClick={() => handleServiceSelect(service.id)}
                      >
                        {service.featured && (
                          <div className="position-relative">
                            <Badge 
                              bg="primary" 
                              className="position-absolute top-0 end-0 m-2"
                              style={{ zIndex: 1 }}
                            >
                              Nổi bật
                            </Badge>
                          </div>
                        )}
                        
                        <Card.Header className={`border-0 ${
                          service.serviceType === 'administrative' ? 'bg-warning bg-opacity-10' : 'bg-success bg-opacity-10'
                        }`}>
                          <div className="d-flex align-items-center mb-2">
                            <div className={`rounded-circle p-2 me-3 ${
                              service.serviceType === 'administrative' ? 'bg-warning' : 'bg-success'
                            }`}>
                              <i className={`${service.icon} text-white fs-5`}></i>
                            </div>
                            <div className="flex-grow-1">
                              {getServiceTypeBadge(service.serviceType)}
                            </div>
                          </div>
                        </Card.Header>

                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="h5 mb-3">{service.title}</Card.Title>
                          <Card.Text className="text-muted flex-grow-1">
                            {service.description}
                          </Card.Text>
                          
                          {/* Price and Duration */}
                          <div className="mb-3">
                            <div className="h5 text-primary mb-1">{service.price}</div>
                            <small className="text-muted">
                              <i className="bi bi-clock me-1"></i>
                              Thời gian: {service.duration}
                            </small>
                          </div>
                          
                          {/* Collection Methods */}
                          <div className="mb-3">
                            <small className="text-muted d-block mb-2">Phương thức lấy mẫu:</small>
                            <div className="d-flex flex-wrap gap-1">
                              {getMethodBadges(service.allowedMethods)}
                            </div>
                          </div>

                          {/* Special restrictions */}
                          {service.serviceType === 'administrative' && (
                            <Alert variant="warning" className="small mb-3">
                              <i className="bi bi-shield-check me-2"></i>
                              Bắt buộc có giám sát khi lấy mẫu
                            </Alert>
                          )}

                          {service.id === 'civil-prenatal' && (
                            <Alert variant="info" className="small mb-3">
                              <i className="bi bi-heart-pulse me-2"></i>
                              Cần chuyên gia y tế thực hiện
                            </Alert>
                          )}

                          {bookingData.serviceId === service.id && (
                            <div className="text-center mt-2">
                              <Badge bg="primary" className="px-3 py-2">
                                <i className="bi bi-check-circle me-2"></i>
                                Đã chọn dịch vụ này
                              </Badge>
                            </div>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
              </>
            )}

            <Row className="mt-4">
              <Col className="text-end">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={nextStep} 
                  disabled={!bookingData.serviceId}
                >
                  Tiếp tục <i className="bi bi-arrow-right ms-2"></i>
                </Button>
              </Col>
            </Row>
          </>
        )}

        {/* Step 2: Collection Method Selection */}
        {currentStep === 2 && selectedService && (
          <>
            <div className="text-center mb-5">
              <h2 className="display-6 fw-bold">Chọn phương thức lấy mẫu</h2>
              <div className="mt-3">
                <h5>Dịch vụ đã chọn: <span className="text-primary">{selectedService.title}</span></h5>
                {getServiceTypeBadge(selectedService.serviceType)}
              </div>
            </div>

            {/* Restriction alerts */}
            {selectedService.serviceType === 'administrative' && (
              <Alert variant="warning" className="mb-4">
                <i className="bi bi-shield-check me-2"></i>
                <strong>Lưu ý quan trọng:</strong> Với dịch vụ có giá trị pháp lý, bắt buộc phải thu mẫu 
                có giám sát (tại cơ sở hoặc nhân viên đến nhà) để đảm bảo tính chính xác và giá trị pháp lý.
              </Alert>
            )}

            {selectedService.id === 'civil-prenatal' && (
              <Alert variant="info" className="mb-4">
                <i className="bi bi-heart-pulse me-2"></i>
                <strong>ADN trước sinh đặc biệt:</strong> Cần có chuyên gia y tế thực hiện do yêu cầu 
                kỹ thuật cao và để đảm bảo an toàn cho mẹ và bé.
              </Alert>
            )}

            <Row>
              {Object.values(COLLECTION_METHODS).map(method => {
                const isDisabled = isMethodDisabled(method.id, selectedService);
                const restrictionReason = getMethodRestrictionReason(method.id, selectedService);
                
                return (
                  <Col key={method.id} lg={4} md={6} className="mb-4">
                    <Card 
                      className={`h-100 border-2 ${
                        isDisabled 
                          ? 'border-light bg-light opacity-50' 
                          : bookingData.collectionMethod === method.id 
                            ? `border-${method.color} shadow-lg` 
                            : `border-${method.color} border-opacity-25 cursor-pointer`
                      }`}
                      style={{ 
                        cursor: isDisabled ? 'not-allowed' : 'pointer', 
                        transition: 'all 0.3s ease' 
                      }}
                      onClick={() => !isDisabled && handleMethodSelect(method.id)}
                    >
                      <Card.Header className={`${
                        isDisabled 
                          ? 'bg-light text-muted' 
                          : `bg-${method.color} text-white`
                      } text-center`}>
                        <div className="py-2">
                          <i className={`${method.icon} fs-1 mb-2 d-block`}></i>
                          <h5 className="mb-0">{method.title}</h5>
                          {isDisabled && (
                            <Badge bg="danger" className="mt-2">
                              Không khả dụng
                            </Badge>
                          )}
                        </div>
                      </Card.Header>
                      <Card.Body>
                        <Card.Text className="mb-3">{method.description}</Card.Text>
                        
                        {isDisabled ? (
                          <Alert variant="danger" className="small">
                            <i className="bi bi-x-circle me-2"></i>
                            {restrictionReason}
                          </Alert>
                        ) : (
                          <>
                            <div className="mb-3">
                              <strong>Quy trình thực hiện:</strong>
                              <ol className="mt-2 small">
                                {method.process.map((step, index) => (
                                  <li key={index} className="mb-1">{step}</li>
                                ))}
                              </ol>
                            </div>
                            {method.note && (
                              <Alert variant={`${method.color === 'warning' ? 'warning' : 'info'}`} className="small mb-0">
                                <i className="bi bi-info-circle me-2"></i>
                                {method.note}
                              </Alert>
                            )}

                            {bookingData.collectionMethod === method.id && (
                              <div className="text-center mt-3">
                                <Badge bg={method.color} className="px-3 py-2">
                                  <i className="bi bi-check-circle me-2"></i>
                                  Đã chọn phương thức này
                                </Badge>
                              </div>
                            )}
                          </>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                );
              })}
            </Row>

            <Row className="mt-4">
              <Col>
                <Button variant="outline-secondary" size="lg" onClick={prevStep}>
                  <i className="bi bi-arrow-left me-2"></i> Quay lại
                </Button>
              </Col>
              <Col className="text-end">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={nextStep} 
                  disabled={!bookingData.collectionMethod}
                >
                  Tiếp tục <i className="bi bi-arrow-right ms-2"></i>
                </Button>
              </Col>
            </Row>
          </>
        )}

        {/* Step 3: Customer Information & Appointment */}
        {currentStep === 3 && selectedMethod && (
          <>
            <div className="text-center mb-5">
              <h2 className="display-6 fw-bold">Thông tin đặt lịch</h2>
              <p className="lead text-muted">
                Vui lòng điền đầy đủ thông tin để hoàn tất việc đặt lịch
              </p>
            </div>
            
            <Row>
              {/* Customer Information */}
              <Col lg={6} className="mb-4">
                <Card className="shadow-sm">
                  <Card.Header className="bg-primary text-white">
                    <h5 className="mb-0">
                      <i className="bi bi-person me-2"></i>
                      Thông tin người đặt lịch
                    </h5>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <Form>
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Label>Họ và tên <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Nhập họ và tên đầy đủ"
                            value={bookingData.customerInfo.fullName}
                            onChange={(e) => handleCustomerInfoChange('fullName', e.target.value)}
                            required
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>Số điện thoại <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="tel"
                            placeholder="Nhập số điện thoại"
                            value={bookingData.customerInfo.phone}
                            onChange={(e) => handleCustomerInfoChange('phone', e.target.value)}
                            required
                          />
                        </Col>
                      </Row>
                      <Row>
                        <Col md={6} className="mb-3">
                          <Form.Label>Email</Form.Label>
                          <Form.Control
                            type="email"
                            placeholder="Nhập địa chỉ email"
                            value={bookingData.customerInfo.email}
                            onChange={(e) => handleCustomerInfoChange('email', e.target.value)}
                          />
                        </Col>
                        <Col md={6} className="mb-3">
                          <Form.Label>CCCD/CMND <span className="text-danger">*</span></Form.Label>
                          <Form.Control
                            type="text"
                            placeholder="Nhập số CCCD/CMND"
                            value={bookingData.customerInfo.idNumber}
                            onChange={(e) => handleCustomerInfoChange('idNumber', e.target.value)}
                            required
                          />
                        </Col>
                      </Row>
                      <Form.Group className="mb-3">
                        <Form.Label>Địa chỉ <span className="text-danger">*</span></Form.Label>
                        <Form.Control
                          as="textarea"
                          rows={2}
                          placeholder="Nhập địa chỉ đầy đủ"
                          value={bookingData.customerInfo.address}
                          onChange={(e) => handleCustomerInfoChange('address', e.target.value)}
                          required
                        />
                      </Form.Group>
                    </Form>
                  </Card.Body>
                </Card>

                {/* Participants Information */}
                {bookingData.customerInfo.participants.length > 0 && (
                  <Card className="mt-4 shadow-sm">
                    <Card.Header className="bg-info text-white">
                      <h5 className="mb-0">
                        <i className="bi bi-people me-2"></i>
                        Thông tin người tham gia xét nghiệm
                      </h5>
                    </Card.Header>
                    <Card.Body className="p-4">
                      {bookingData.customerInfo.participants.map((participant, index) => (
                        <div key={index} className="mb-4 p-3 border rounded bg-light">
                          <h6 className="text-primary mb-3">
                            <i className="bi bi-person-badge me-2"></i>
                            {participant.role}
                          </h6>
                          <Row>
                            <Col md={6} className="mb-2">
                              <Form.Label>Họ và tên <span className="text-danger">*</span></Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Nhập họ và tên"
                                value={participant.name}
                                onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                                required
                              />
                            </Col>
                            <Col md={6} className="mb-2">
                              <Form.Label>CCCD/CMND <span className="text-danger">*</span></Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Nhập số CCCD/CMND"
                                value={participant.idNumber}
                                onChange={(e) => handleParticipantChange(index, 'idNumber', e.target.value)}
                                required
                              />
                            </Col>
                          </Row>
                          <Form.Group>
                            <Form.Label>Số điện thoại</Form.Label>
                            <Form.Control
                              type="tel"
                              placeholder="Nhập số điện thoại"
                              value={participant.phone}
                              onChange={(e) => handleParticipantChange(index, 'phone', e.target.value)}
                            />
                          </Form.Group>
                        </div>
                      ))}
                    </Card.Body>
                  </Card>
                )}
              </Col>

              {/* Appointment Date & Time */}
              <Col lg={6}>
                {/* Only show date/time selection if not self-sample */}
                {bookingData.collectionMethod !== 'self-sample' && (
                  <Card className="mb-4 shadow-sm">
                    <Card.Header className="bg-warning text-dark">
                      <h5 className="mb-0">
                        <i className="bi bi-calendar me-2"></i>
                        Chọn ngày và giờ hẹn
                      </h5>
                    </Card.Header>
                    <Card.Body className="p-4">
                      <Form.Group className="mb-4">
                        <Form.Label>Ngày hẹn <span className="text-danger">*</span></Form.Label>
                        <Form.Select
                          value={bookingData.appointmentDate}
                          onChange={(e) => setBookingData({...bookingData, appointmentDate: e.target.value})}
                          required
                        >
                          <option value="">Chọn ngày hẹn</option>
                          {generateDateOptions().map(date => (
                            <option key={date} value={date}>
                              {formatDate(date)}
                            </option>
                          ))}
                        </Form.Select>
                        <Form.Text className="text-muted">
                          <i className="bi bi-info-circle me-1"></i>
                          Không làm việc vào Chủ nhật
                        </Form.Text>
                      </Form.Group>

                      {bookingData.appointmentDate && (
                        <Form.Group className="mb-3">
                          <Form.Label>Giờ hẹn <span className="text-danger">*</span></Form.Label>
                          <Row>
                            {timeSlots.map(time => (
                              <Col key={time} xs={4} className="mb-2">
                                <Button
                                  variant={bookingData.appointmentTime === time ? 'warning' : 'outline-warning'}
                                  size="sm"
                                  className="w-100"
                                  onClick={() => setBookingData({...bookingData, appointmentTime: time})}
                                >
                                  {time}
                                </Button>
                              </Col>
                            ))}
                          </Row>
                        </Form.Group>
                      )}
                    </Card.Body>
                  </Card>
                )}

                {/* Self-sample info */}
                {bookingData.collectionMethod === 'self-sample' && (
                  <Card className="mb-4 shadow-sm border-success">
                    <Card.Header className="bg-success text-white">
                      <h5 className="mb-0">
                        <i className="bi bi-box me-2"></i>
                        Thông tin gửi kit
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Alert variant="success" className="mb-3">
                        <i className="bi bi-check-circle me-2"></i>
                        Kit xét nghiệm sẽ được gửi đến địa chỉ của bạn trong <strong>1-2 ngày làm việc</strong>
                      </Alert>
                      <ul className="list-unstyled">
                        <li className="mb-2"><i className="bi bi-box me-2 text-success"></i>Kit bao gồm: Que lấy mẫu, hướng dẫn chi tiết, phong bì trả về</li>
                        <li className="mb-2"><i className="bi bi-clock me-2 text-warning"></i>Thực hiện thu mẫu trong vòng 3 ngày kể từ khi nhận kit</li>
                        <li className="mb-2"><i className="bi bi-send me-2 text-primary"></i>Gửi mẫu về phòng lab qua đường bưu điện</li>
                      </ul>
                    </Card.Body>
                  </Card>
                )}

                {/* Special Requests */}
                <Card className="mb-4 shadow-sm">
                  <Card.Header className="bg-success text-white">
                    <h5 className="mb-0">
                      <i className="bi bi-chat-text me-2"></i>
                      Yêu cầu đặc biệt
                    </h5>
                  </Card.Header>
                  <Card.Body>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      placeholder="Nhập yêu cầu đặc biệt (nếu có)..."
                      value={bookingData.specialRequests}
                      onChange={(e) => setBookingData({...bookingData, specialRequests: e.target.value})}
                    />
                  </Card.Body>
                </Card>

                {/* Required Documents Reminder */}
                {selectedService && (
                  <Card className="border-info shadow-sm">
                    <Card.Header className="bg-info text-white">
                      <h6 className="mb-0">
                        <i className="bi bi-file-text me-2"></i>
                        Giấy tờ cần chuẩn bị
                      </h6>
                    </Card.Header>
                    <Card.Body>
                      <ul className="list-unstyled mb-0">
                        {selectedService.requiredDocuments.map((doc, index) => (
                          <li key={index} className="small mb-2">
                            <i className="bi bi-check text-info me-2"></i>
                            {doc}
                          </li>
                        ))}
                      </ul>
                    </Card.Body>
                  </Card>
                )}
              </Col>
            </Row>

            <Row className="mt-4">
              <Col>
                <Button variant="outline-secondary" size="lg" onClick={prevStep}>
                  <i className="bi bi-arrow-left me-2"></i> Quay lại
                </Button>
              </Col>
              <Col className="text-end">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={nextStep}
                  disabled={
                    !bookingData.customerInfo.fullName || 
                    !bookingData.customerInfo.phone || 
                    !bookingData.customerInfo.address || 
                    (bookingData.collectionMethod !== 'self-sample' && (!bookingData.appointmentDate || !bookingData.appointmentTime))
                  }
                >
                  Tiếp tục <i className="bi bi-arrow-right ms-2"></i>
                </Button>
              </Col>
            </Row>
          </>
        )}

        {/* Step 4: Confirmation - Same as before but with updated logic */}
        {currentStep === 4 && (
          <>
            <div className="text-center mb-5">
              <h2 className="display-6 fw-bold">Xác nhận thông tin đặt lịch</h2>
              <p className="lead text-muted">
                Vui lòng kiểm tra lại thông tin trước khi xác nhận đặt lịch
              </p>
            </div>
            
            <Card className="shadow-lg">
              <Card.Header className="bg-primary text-white">
                <h5 className="mb-0">
                  <i className="bi bi-check-circle me-2"></i>
                  Chi tiết đặt lịch xét nghiệm ADN
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                <Tab.Container defaultActiveKey="service-info">
                  <Nav variant="tabs" className="mb-4">
                    <Nav.Item>
                      <Nav.Link eventKey="service-info">
                        <i className="bi bi-gear me-2"></i>
                        Thông tin dịch vụ
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="customer-info">
                        <i className="bi bi-person me-2"></i>
                        Thông tin khách hàng
                      </Nav.Link>
                    </Nav.Item>
                    <Nav.Item>
                      <Nav.Link eventKey="appointment-info">
                        <i className="bi bi-calendar me-2"></i>
                        Thông tin lịch hẹn
                      </Nav.Link>
                    </Nav.Item>
                  </Nav>

                  <Tab.Content>
                    <Tab.Pane eventKey="service-info">
                      <Row>
                        <Col md={6}>
                          <div className="d-flex align-items-center mb-4">
                            <div className={`rounded-circle p-3 me-3 ${
                              selectedService.serviceType === 'administrative' ? 'bg-warning' : 'bg-success'
                            }`}>
                              <i className={`${selectedService.icon} text-white fs-4`}></i>
                            </div>
                            <div>
                              <h5 className="mb-1">{selectedService.title}</h5>
                              {getServiceTypeBadge(selectedService.serviceType)}
                            </div>
                          </div>

                          <div className="mb-3">
                            <strong>Mô tả dịch vụ:</strong>
                            <p className="text-muted mt-1">{selectedService.description}</p>
                          </div>

                          <div className="mb-3">
                            <strong>Phương thức lấy mẫu:</strong>
                            <div className="mt-2">
                              <Badge bg={selectedMethod.color} className="me-2">
                                <i className={`${selectedMethod.icon} me-1`}></i>
                                {selectedMethod.title}
                              </Badge>
                              <p className="text-muted small mt-2">{selectedMethod.description}</p>
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="bg-light p-3 rounded">
                            <h6 className="text-primary mb-3">Chi phí & Thời gian</h6>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Giá dịch vụ:</span>
                              <strong className="text-success">{selectedService.price}</strong>
                            </div>
                            <div className="d-flex justify-content-between mb-2">
                              <span>Thời gian có kết quả:</span>
                              <strong>{selectedService.duration}</strong>
                            </div>
                            <div className="d-flex justify-content-between">
                              <span>Độ chính xác:</span>
                              <strong className="text-warning">99.999%</strong>
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </Tab.Pane>

                    <Tab.Pane eventKey="customer-info">
                      <Row>
                        <Col md={6}>
                          <h6 className="text-primary mb-3">Người đặt lịch</h6>
                          <div className="mb-2">
                            <strong>Họ tên:</strong> {bookingData.customerInfo.fullName}
                          </div>
                          <div className="mb-2">
                            <strong>Điện thoại:</strong> {bookingData.customerInfo.phone}
                          </div>
                          <div className="mb-2">
                            <strong>Email:</strong> {bookingData.customerInfo.email || 'Không có'}
                          </div>
                          <div className="mb-2">
                            <strong>CCCD/CMND:</strong> {bookingData.customerInfo.idNumber}
                          </div>
                          <div className="mb-2">
                            <strong>Địa chỉ:</strong> {bookingData.customerInfo.address}
                          </div>
                        </Col>
                        <Col md={6}>
                          {bookingData.customerInfo.participants.length > 0 && (
                            <>
                              <h6 className="text-primary mb-3">Người tham gia xét nghiệm</h6>
                              {bookingData.customerInfo.participants.map((participant, index) => (
                                <Card key={index} className="mb-2 border-light">
                                  <Card.Body className="p-3">
                                    <h6 className="text-success mb-2">{participant.role}</h6>
                                    <div className="small">
                                      <div><strong>Tên:</strong> {participant.name}</div>
                                      <div><strong>CCCD:</strong> {participant.idNumber}</div>
                                      {participant.phone && (
                                        <div><strong>SĐT:</strong> {participant.phone}</div>
                                      )}
                                    </div>
                                  </Card.Body>
                                </Card>
                              ))}
                            </>
                          )}
                        </Col>
                      </Row>
                    </Tab.Pane>

                    <Tab.Pane eventKey="appointment-info">
                      <Row>
                        <Col md={6}>
                          {bookingData.collectionMethod === 'self-sample' ? (
                            <div className="text-center">
                              <div className="bg-success bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                                   style={{ width: '80px', height: '80px' }}>
                                <i className="bi bi-box text-success fs-1"></i>
                              </div>
                              <h5 className="text-success mb-3">Tự lấy mẫu tại nhà</h5>
                              <div className="mb-3">
                                <strong>Kit sẽ được gửi đến:</strong>
                                <div className="text-muted mt-1">{bookingData.customerInfo.address}</div>
                              </div>
                              <div className="mb-3">
                                <strong>Thời gian nhận kit:</strong>
                                <div className="text-warning mt-1">1-2 ngày làm việc</div>
                              </div>
                            </div>
                          ) : (
                            <div className="text-center">
                              <div className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" 
                                   style={{ width: '80px', height: '80px' }}>
                                <i className="bi bi-calendar-event text-primary fs-1"></i>
                              </div>
                              <h5 className="text-primary mb-3">Thông tin lịch hẹn</h5>
                              <div className="mb-3">
                                <strong>Ngày hẹn:</strong>
                                <div className="h5 text-primary mt-1">{formatDate(bookingData.appointmentDate)}</div>
                              </div>
                              <div className="mb-3">
                                <strong>Giờ hẹn:</strong>
                                <div className="h5 text-warning mt-1">{bookingData.appointmentTime}</div>
                              </div>
                            </div>
                          )}
                        </Col>
                        <Col md={6}>
                          {bookingData.specialRequests && (
                            <div className="mb-4">
                              <h6 className="text-primary mb-3">Yêu cầu đặc biệt</h6>
                              <div className="p-3 bg-light rounded">
                                <p className="text-muted mb-0">{bookingData.specialRequests}</p>
                              </div>
                            </div>
                          )}

                          <div>
                            <h6 className="text-primary mb-3">Giấy tờ cần mang theo</h6>
                            <ul className="list-unstyled">
                              {selectedService.requiredDocuments.map((doc, index) => (
                                <li key={index} className="mb-2">
                                  <i className="bi bi-check-circle text-success me-2"></i>
                                  {doc}
                                </li>
                              ))}
                            </ul>
                          </div>
                        </Col>
                      </Row>
                    </Tab.Pane>
                  </Tab.Content>
                </Tab.Container>
                
                <hr />
                
                <Alert variant="info" className="mb-0">
                  <div className="d-flex align-items-start">
                    <i className="bi bi-info-circle me-3 mt-1"></i>
                    <div>
                      <strong>Lưu ý quan trọng:</strong>
                      <ul className="mb-0 mt-2">
                        {bookingData.collectionMethod !== 'self-sample' && (
                          <li>Vui lòng có mặt đúng giờ hẹn. Trễ hẹn quá 15 phút có thể bị hủy lịch.</li>
                        )}
                        <li>Mang theo CCCD/CMND gốc của tất cả người tham gia xét nghiệm.</li>
                        {selectedService.serviceType === 'administrative' && (
                          <li>Xét nghiệm hành chính yêu cầu có mặt đồng thời của tất cả đương sự.</li>
                        )}
                        {bookingData.collectionMethod === 'self-sample' && (
                          <li>Kit xét nghiệm sẽ được gửi đến địa chỉ của bạn trong 1-2 ngày làm việc.</li>
                        )}
                        <li>Kết quả sẽ được thông báo qua email và SMS khi có.</li>
                        <li>Tư vấn miễn phí 24/7 qua hotline: <strong>1900 1234</strong></li>
                      </ul>
                    </div>
                  </div>
                </Alert>
              </Card.Body>
            </Card>

            <Row className="mt-4">
              <Col>
                <Button variant="outline-secondary" size="lg" onClick={prevStep}>
                  <i className="bi bi-arrow-left me-2"></i> Quay lại chỉnh sửa
                </Button>
              </Col>
              <Col className="text-end">
                <Button variant="success" size="lg" onClick={handleBookingSubmit}>
                  <i className="bi bi-check-circle me-2"></i> Xác nhận đặt lịch
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Container>

      {/* Quick Contact Support */}
      <section className="bg-light py-4 mt-5">
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h5 className="mb-2">
                <i className="bi bi-headset me-2"></i>
                Cần hỗ trợ trong quá trình đặt lịch?
              </h5>
              <p className="text-muted mb-0">
                Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn 24/7
              </p>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <div className="d-flex gap-2 justify-content-md-end">
                <Button variant="primary">
                  <i className="bi bi-telephone me-2"></i>
                  1900 1234
                </Button>
                <Button variant="outline-primary">
                  <i className="bi bi-chat-dots me-2"></i>
                  Chat ngay
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default AppointmentBooking;