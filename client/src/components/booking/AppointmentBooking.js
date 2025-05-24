import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Form, Alert } from 'react-bootstrap';

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [bookingData, setBookingData] = useState({
    serviceType: '', // 'civil' or 'administrative'
    serviceId: '',
    collectionMethod: '', // 'self-sample', 'home-visit', 'at-facility'
    appointmentDate: '',
    appointmentTime: '',
    customerInfo: {
      fullName: '',
      phone: '',
      email: '',
      address: '',
      idNumber: '',
      relationship: '', // for DNA testing
      participants: [] // people involved in DNA test
    },
    specialRequests: ''
  });

  // Available services data
  const services = {
    civil: [
      {
        id: 'civil-1',
        title: 'Xét nghiệm ADN huyết thống cha-con',
        price: '3,500,000 VNĐ',
        duration: '5-7 ngày',
        description: 'Xác định mối quan hệ huyết thống với độ chính xác 99.999%',
        methods: ['self-sample', 'home-visit'],
        icon: 'bi-people',
        participants: ['Cha', 'Con']
      },
      {
        id: 'civil-2',
        title: 'Xét nghiệm ADN thai nhi',
        price: '5,500,000 VNĐ',
        duration: '7-10 ngày',
        description: 'Phương pháp an toàn cho mẹ và bé từ tuần thứ 8',
        methods: ['at-facility'],
        icon: 'bi-heart',
        participants: ['Mẹ mang thai', 'Cha nghi ngờ']
      },
      {
        id: 'civil-3',
        title: 'Xét nghiệm ADN anh chị em',
        price: '4,200,000 VNĐ',
        duration: '5-7 ngày',
        description: 'Xác định mối quan hệ anh chị em ruột',
        methods: ['self-sample', 'home-visit'],
        icon: 'bi-people-fill',
        participants: ['Người thứ nhất', 'Người thứ hai']
      }
    ],
    administrative: [
      {
        id: 'admin-1',
        title: 'Xét nghiệm ADN khai sinh',
        price: '4,200,000 VNĐ',
        duration: '3-5 ngày',
        description: 'Phục vụ thủ tục hành chính, có giá trị pháp lý',
        methods: ['at-facility'],
        icon: 'bi-file-earmark-text',
        participants: ['Cha', 'Con', 'Mẹ (nếu có)']
      },
      {
        id: 'admin-2',
        title: 'Xét nghiệm ADN di trú',
        price: '5,800,000 VNĐ',
        duration: '3-5 ngày',
        description: 'Phục vụ thủ tục bảo lãnh, nhập quốc tịch',
        methods: ['at-facility'],
        icon: 'bi-globe',
        participants: ['Người bảo lãnh', 'Người được bảo lãnh']
      },
      {
        id: 'admin-3',
        title: 'Xét nghiệm ADN tòa án',
        price: '6,500,000 VNĐ',
        duration: '3-5 ngày',
        description: 'Phục vụ các vụ kiện tại tòa án',
        methods: ['at-facility'],
        icon: 'bi-building',
        participants: ['Đương sự 1', 'Đương sự 2']
      }
    ]
  };

  // Collection methods info
  const collectionMethods = {
    'self-sample': {
      title: 'Tự thu mẫu tại nhà',
      description: 'Nhận kit và tự thu mẫu theo hướng dẫn',
      icon: 'bi-house',
      color: 'success',
      process: ['Đặt hẹn', 'Nhận kit', 'Thu mẫu', 'Gửi lại', 'Nhận kết quả'],
      note: 'Chỉ áp dụng cho xét nghiệm ADN dân sự'
    },
    'home-visit': {
      title: 'Thu mẫu tại nhà',
      description: 'Nhân viên đến tận nhà thu mẫu',
      icon: 'bi-truck',
      color: 'warning',
      process: ['Đặt hẹn', 'Nhân viên đến', 'Thu mẫu', 'Xét nghiệm', 'Nhận kết quả'],
      note: 'Phí di chuyển: 200,000 VNĐ (trong nội thành)'
    },
    'at-facility': {
      title: 'Thu mẫu tại cơ sở',
      description: 'Đến trực tiếp cơ sở y tế',
      icon: 'bi-hospital',
      color: 'primary',
      process: ['Đặt hẹn', 'Đến cơ sở', 'Thu mẫu', 'Xét nghiệm', 'Nhận kết quả'],
      note: 'Bắt buộc với xét nghiệm có giá trị pháp lý'
    }
  };

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
      collectionMethod: ''
    });
  };

  const handleServiceSelect = (serviceId) => {
    const selectedService = [...services.civil, ...services.administrative]
      .find(s => s.id === serviceId);
    
    setBookingData({
      ...bookingData,
      serviceId: serviceId,
      collectionMethod: '',
      customerInfo: {
        ...bookingData.customerInfo,
        participants: selectedService ? selectedService.participants.map(p => ({ name: '', role: p, idNumber: '', phone: '' })) : []
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

  const selectedService = bookingData.serviceId ? 
    [...services.civil, ...services.administrative].find(s => s.id === bookingData.serviceId) : null;

  const selectedMethod = bookingData.collectionMethod ? 
    collectionMethods[bookingData.collectionMethod] : null;

  // Generate next 30 days for date selection
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

  return (
    <Container className="py-5">
      {/* Progress Indicator */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-center">
            <div className="d-flex align-items-center">
              {[1, 2, 3, 4].map((step, index) => (
                <React.Fragment key={step}>
                  <div className={`rounded-circle d-flex align-items-center justify-content-center ${
                    currentStep >= step ? 'bg-primary text-white' : 'bg-light text-muted'
                  }`} style={{ width: '40px', height: '40px', fontWeight: 'bold' }}>
                    {step}
                  </div>
                  {index < 3 && (
                    <div className={`mx-3 ${currentStep > step ? 'text-primary' : 'text-muted'}`} 
                         style={{ width: '50px', height: '2px', backgroundColor: currentStep > step ? '#0d6efd' : '#dee2e6' }}>
                    </div>
                  )}
                </React.Fragment>
              ))}
            </div>
          </div>
          <Row className="mt-2">
            <Col className="text-center">
              <small className={currentStep >= 1 ? 'text-primary fw-bold' : 'text-muted'}>Chọn dịch vụ</small>
            </Col>
            <Col className="text-center">
              <small className={currentStep >= 2 ? 'text-primary fw-bold' : 'text-muted'}>Phương thức</small>
            </Col>
            <Col className="text-center">
              <small className={currentStep >= 3 ? 'text-primary fw-bold' : 'text-muted'}>Thông tin</small>
            </Col>
            <Col className="text-center">
              <small className={currentStep >= 4 ? 'text-primary fw-bold' : 'text-muted'}>Xác nhận</small>
            </Col>
          </Row>
        </Col>
      </Row>

      {/* Step 1: Service Selection */}
      {currentStep === 1 && (
        <>
          <Row className="mb-4">
            <Col>
              <h2 className="text-center mb-4">Chọn loại dịch vụ xét nghiệm</h2>
              
              {/* Service Type Selection */}
              <Row className="mb-4">
                <Col md={6} className="mb-3">
                  <Card className={`h-100 cursor-pointer ${bookingData.serviceType === 'civil' ? 'border-success shadow' : ''}`}
                        onClick={() => handleServiceTypeChange('civil')}>
                    <Card.Header className="bg-success text-white text-center">
                      <h5 className="mb-0">
                        <i className="bi bi-house me-2"></i>
                        Xét nghiệm ADN Dân sự
                      </h5>
                    </Card.Header>
                    <Card.Body className="text-center">
                      <p>Phục vụ mục đích cá nhân, gia đình</p>
                      <Badge bg="success">Tự thu mẫu được</Badge>
                      <Badge bg="light" text="dark" className="ms-2">Không có giá trị pháp lý</Badge>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6} className="mb-3">
                  <Card className={`h-100 cursor-pointer ${bookingData.serviceType === 'administrative' ? 'border-warning shadow' : ''}`}
                        onClick={() => handleServiceTypeChange('administrative')}>
                    <Card.Header className="bg-warning text-dark text-center">
                      <h5 className="mb-0">
                        <i className="bi bi-building me-2"></i>
                        Xét nghiệm ADN Hành chính
                      </h5>
                    </Card.Header>
                    <Card.Body className="text-center">
                      <p>Phục vụ thủ tục pháp lý, hành chính</p>
                      <Badge bg="warning" text="dark">Có giá trị pháp lý</Badge>
                      <Badge bg="light" text="dark" className="ms-2">Bắt buộc tại cơ sở</Badge>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Specific Service Selection */}
              {bookingData.serviceType && (
                <>
                  <h4 className="mb-3">Chọn dịch vụ cụ thể</h4>
                  <Row>
                    {services[bookingData.serviceType].map(service => (
                      <Col key={service.id} md={4} className="mb-3">
                        <Card className={`h-100 cursor-pointer ${bookingData.serviceId === service.id ? 'border-primary shadow' : ''}`}
                              onClick={() => handleServiceSelect(service.id)}>
                          <Card.Body>
                            <div className="text-center mb-3">
                              <i className={`${service.icon} fs-1 text-primary`}></i>
                            </div>
                            <Card.Title className="text-center">{service.title}</Card.Title>
                            <Card.Text className="text-center text-muted small">
                              {service.description}
                            </Card.Text>
                            <div className="text-center">
                              <div className="h5 text-primary mb-1">{service.price}</div>
                              <small className="text-muted">Thời gian: {service.duration}</small>
                            </div>
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                </>
              )}
            </Col>
          </Row>

          <Row>
            <Col className="text-end">
              <Button variant="primary" onClick={nextStep} disabled={!bookingData.serviceId}>
                Tiếp tục <i className="bi bi-arrow-right ms-2"></i>
              </Button>
            </Col>
          </Row>
        </>
      )}

      {/* Step 2: Collection Method Selection */}
      {currentStep === 2 && selectedService && (
        <>
          <Row className="mb-4">
            <Col>
              <h2 className="text-center mb-4">Chọn phương thức thu mẫu</h2>
              <div className="text-center mb-4">
                <h5>Dịch vụ đã chọn: <span className="text-primary">{selectedService.title}</span></h5>
              </div>

              <Row>
                {selectedService.methods.map(methodKey => {
                  const method = collectionMethods[methodKey];
                  return (
                    <Col key={methodKey} md={4} className="mb-3">
                      <Card className={`h-100 cursor-pointer ${bookingData.collectionMethod === methodKey ? `border-${method.color} shadow` : ''}`}
                            onClick={() => handleMethodSelect(methodKey)}>
                        <Card.Header className={`bg-${method.color} text-white text-center`}>
                          <h5 className="mb-0">
                            <i className={`${method.icon} me-2`}></i>
                            {method.title}
                          </h5>
                        </Card.Header>
                        <Card.Body>
                          <Card.Text>{method.description}</Card.Text>
                          <div className="mb-3">
                            <strong>Quy trình:</strong>
                            <ol className="mt-2">
                              {method.process.map((step, index) => (
                                <li key={index}><small>{step}</small></li>
                              ))}
                            </ol>
                          </div>
                          {method.note && (
                            <Alert variant={`${method.color === 'warning' ? 'warning' : 'info'}`} className="small mb-0">
                              <i className="bi bi-info-circle me-2"></i>
                              {method.note}
                            </Alert>
                          )}
                        </Card.Body>
                      </Card>
                    </Col>
                  );
                })}
              </Row>
            </Col>
          </Row>

          <Row>
            <Col>
              <Button variant="outline-secondary" onClick={prevStep}>
                <i className="bi bi-arrow-left me-2"></i> Quay lại
              </Button>
            </Col>
            <Col className="text-end">
              <Button variant="primary" onClick={nextStep} disabled={!bookingData.collectionMethod}>
                Tiếp tục <i className="bi bi-arrow-right ms-2"></i>
              </Button>
            </Col>
          </Row>
        </>
      )}

      {/* Step 3: Customer Information & Appointment */}
      {currentStep === 3 && selectedMethod && (
        <>
          <Row className="mb-4">
            <Col>
              <h2 className="text-center mb-4">Thông tin đặt lịch</h2>
              
              <Row>
                {/* Customer Information */}
                <Col lg={6} className="mb-4">
                  <Card>
                    <Card.Header>
                      <h5 className="mb-0">
                        <i className="bi bi-person me-2"></i>
                        Thông tin người đặt lịch
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Form>
                        <Row>
                          <Col md={6} className="mb-3">
                            <Form.Label>Họ và tên *</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Nhập họ và tên đầy đủ"
                              value={bookingData.customerInfo.fullName}
                              onChange={(e) => handleCustomerInfoChange('fullName', e.target.value)}
                              required
                            />
                          </Col>
                          <Col md={6} className="mb-3">
                            <Form.Label>Số điện thoại *</Form.Label>
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
                            <Form.Label>CCCD/CMND *</Form.Label>
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
                          <Form.Label>Địa chỉ *</Form.Label>
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
                    <Card className="mt-3">
                      <Card.Header>
                        <h5 className="mb-0">
                          <i className="bi bi-people me-2"></i>
                          Thông tin người tham gia xét nghiệm
                        </h5>
                      </Card.Header>
                      <Card.Body>
                        {bookingData.customerInfo.participants.map((participant, index) => (
                          <div key={index} className="mb-3 p-3 border rounded">
                            <h6 className="text-primary mb-3">{participant.role}</h6>
                            <Row>
                              <Col md={6} className="mb-2">
                                <Form.Label>Họ và tên *</Form.Label>
                                <Form.Control
                                  type="text"
                                  placeholder="Nhập họ và tên"
                                  value={participant.name}
                                  onChange={(e) => handleParticipantChange(index, 'name', e.target.value)}
                                  required
                                />
                              </Col>
                              <Col md={6} className="mb-2">
                                <Form.Label>Số điện thoại</Form.Label>
                                <Form.Control
                                  type="tel"
                                  placeholder="Nhập số điện thoại"
                                  value={participant.phone}
                                  onChange={(e) => handleParticipantChange(index, 'phone', e.target.value)}
                                />
                              </Col>
                            </Row>
                            <Form.Group>
                              <Form.Label>CCCD/CMND *</Form.Label>
                              <Form.Control
                                type="text"
                                placeholder="Nhập số CCCD/CMND"
                                value={participant.idNumber}
                                onChange={(e) => handleParticipantChange(index, 'idNumber', e.target.value)}
                                required
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
                  <Card className="mb-3">
                    <Card.Header>
                      <h5 className="mb-0">
                        <i className="bi bi-calendar me-2"></i>
                        Chọn ngày và giờ hẹn
                      </h5>
                    </Card.Header>
                    <Card.Body>
                      <Form.Group className="mb-3">
                        <Form.Label>Ngày hẹn *</Form.Label>
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
                      </Form.Group>

                      {bookingData.appointmentDate && (
                        <Form.Group className="mb-3">
                          <Form.Label>Giờ hẹn *</Form.Label>
                          <Row>
                            {timeSlots.map(time => (
                              <Col key={time} xs={4} className="mb-2">
                                <Button
                                  variant={bookingData.appointmentTime === time ? 'primary' : 'outline-primary'}
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

                  {/* Special Requests */}
                  <Card>
                    <Card.Header>
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
                </Col>
              </Row>
            </Col>
          </Row>

          <Row>
            <Col>
              <Button variant="outline-secondary" onClick={prevStep}>
                <i className="bi bi-arrow-left me-2"></i> Quay lại
              </Button>
            </Col>
            <Col className="text-end">
              <Button 
                variant="primary" 
                onClick={nextStep}
                disabled={!bookingData.customerInfo.fullName || !bookingData.customerInfo.phone || 
                         !bookingData.customerInfo.address || !bookingData.appointmentDate || 
                         !bookingData.appointmentTime}
              >
                Tiếp tục <i className="bi bi-arrow-right ms-2"></i>
              </Button>
            </Col>
          </Row>
        </>
      )}

      {/* Step 4: Confirmation */}
      {currentStep === 4 && (
        <>
          <Row className="mb-4">
            <Col>
              <h2 className="text-center mb-4">Xác nhận thông tin đặt lịch</h2>
              
              <Card className="shadow">
                <Card.Header className="bg-primary text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-check-circle me-2"></i>
                    Chi tiết đặt lịch xét nghiệm
                  </h5>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <h6 className="text-primary mb-3">Thông tin dịch vụ</h6>
                      <p><strong>Dịch vụ:</strong> {selectedService.title}</p>
                      <p><strong>Loại:</strong> {bookingData.serviceType === 'civil' ? 'ADN Dân sự' : 'ADN Hành chính'}</p>
                      <p><strong>Phương thức:</strong> {selectedMethod.title}</p>
                      <p><strong>Giá:</strong> <span className="text-success fw-bold">{selectedService.price}</span></p>
                      <p><strong>Thời gian có kết quả:</strong> {selectedService.duration}</p>
                      
                      <h6 className="text-primary mb-3 mt-4">Thông tin lịch hẹn</h6>
                      <p><strong>Ngày:</strong> {formatDate(bookingData.appointmentDate)}</p>
                      <p><strong>Giờ:</strong> {bookingData.appointmentTime}</p>
                    </Col>
                    <Col md={6}>
                      <h6 className="text-primary mb-3">Thông tin khách hàng</h6>
                      <p><strong>Họ tên:</strong> {bookingData.customerInfo.fullName}</p>
                      <p><strong>Điện thoại:</strong> {bookingData.customerInfo.phone}</p>
                      <p><strong>Email:</strong> {bookingData.customerInfo.email || 'Không có'}</p>
                      <p><strong>CCCD/CMND:</strong> {bookingData.customerInfo.idNumber}</p>
                      <p><strong>Địa chỉ:</strong> {bookingData.customerInfo.address}</p>
                      
                      {bookingData.customerInfo.participants.length > 0 && (
                        <>
                          <h6 className="text-primary mb-3 mt-4">Người tham gia xét nghiệm</h6>
                          {bookingData.customerInfo.participants.map((participant, index) => (
                            <div key={index} className="mb-2 p-2 bg-light rounded">
                              <p className="mb-1"><strong>{participant.role}:</strong> {participant.name}</p>
                              <p className="mb-0 small text-muted">CCCD: {participant.idNumber}</p>
                            </div>
                          ))}
                        </>
                      )}
                      
                      {bookingData.specialRequests && (
                        <>
                          <h6 className="text-primary mb-3 mt-4">Yêu cầu đặc biệt</h6>
                          <p className="text-muted">{bookingData.specialRequests}</p>
                        </>
                      )}
                    </Col>
                  </Row>
                  
                  <hr />
                  
                  <Alert variant="info">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Lưu ý quan trọng:</strong>
                    <ul className="mb-0 mt-2">
                      <li>Vui lòng có mặt đúng giờ hẹn. Trễ hẹn quá 15 phút có thể bị hủy lịch.</li>
                      <li>Mang theo CCCD/CMND gốc của tất cả người tham gia.</li>
                      {bookingData.serviceType === 'administrative' && (
                        <li>Xét nghiệm hành chính yêu cầu có mặt đồng thời của tất cả đương sự.</li>
                      )}
                      {bookingData.collectionMethod === 'self-sample' && (
                        <li>Kit xét nghiệm sẽ được gửi đến địa chỉ của bạn trong 1-2 ngày làm việc.</li>
                      )}
                      <li>Kết quả sẽ được thông báo qua email và SMS khi có.</li>
                    </ul>
                  </Alert>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          <Row>
            <Col>
              <Button variant="outline-secondary" onClick={prevStep}>
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
  );
};

export default AppointmentBooking;