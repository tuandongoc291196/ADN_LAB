import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Form, Alert, Tab, Nav } from 'react-bootstrap';

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

  // Improved services data based on the analysis table
  const servicesData = {
    administrative: [
      {
        id: 'admin-birth-cert',
        title: 'ADN làm giấy khai sinh',
        description: 'Xác nhận quan hệ huyết thống để hoàn tất thủ tục giấy khai sinh (thường áp dụng khi cha mẹ không đăng ký kết hôn)',
        price: '4,200,000 VNĐ',
        duration: '3-5 ngày',
        icon: 'bi-file-earmark-text',
        allowedMethods: ['home-visit', 'at-facility'], // NO self-sample
        participants: ['Cha', 'Mẹ', 'Con'],
        requiredDocuments: ['CCCD/CMND gốc của tất cả người tham gia', 'Giấy khai sinh tạm thời (nếu có)', 'Giấy chứng nhận kết hôn (nếu có)'],
        featured: true
      },
      {
        id: 'admin-immigration',
        title: 'ADN nhập tịch, làm visa, hộ chiếu',
        description: 'Chứng minh quan hệ huyết thống trong các thủ tục nhập tịch, xin visa, làm hộ chiếu để đảm bảo quyền lợi gia định và công dân',
        price: '5,800,000 VNĐ',
        duration: '3-5 ngày',
        icon: 'bi-passport',
        allowedMethods: ['home-visit', 'at-facility'], // NO self-sample
        participants: ['Người bảo lãnh', 'Người được bảo lãnh'],
        requiredDocuments: ['CCCD/CMND gốc', 'Hộ chiếu', 'Giấy tờ liên quan đến thủ tục'],
        featured: true
      },
      {
        id: 'admin-inheritance',
        title: 'ADN xác nhận quyền thừa kế',
        description: 'Xác định người thừa kế hợp pháp trong tranh chấp tài sản hoặc chia tài sản thừa kế',
        price: '6,500,000 VNĐ',
        duration: '3-5 ngày',
        icon: 'bi-building',
        allowedMethods: ['home-visit', 'at-facility'], // NO self-sample
        participants: ['Người để lại tài sản (nếu còn sống)', 'Người thừa kế'],
        requiredDocuments: ['CCCD/CMND gốc', 'Giấy tờ tài sản', 'Giấy chứng tử (nếu có)']
      },
      {
        id: 'admin-child-support',
        title: 'ADN xác định trách nhiệm cấp dưỡng',
        description: 'Hỗ trợ xác định trách nhiệm cấp dưỡng của cha mẹ đối với con trong các vụ ly hôn hoặc tranh chấp gia đình',
        price: '4,800,000 VNĐ',
        duration: '3-5 ngày',
        icon: 'bi-people',
        allowedMethods: ['home-visit', 'at-facility'], // NO self-sample
        participants: ['Cha', 'Mẹ', 'Con'],
        requiredDocuments: ['CCCD/CMND gốc', 'Giấy khai sinh của con', 'Quyết định của tòa án (nếu có)']
      },
      {
        id: 'admin-missing-person',
        title: 'ADN nhận người thân',
        description: 'Xác minh và tìm kiếm mối quan hệ huyết thống với người thân bị thất lạc hoặc chưa được công nhận hợp pháp',
        price: '5,200,000 VNĐ',
        duration: '3-5 ngày',
        icon: 'bi-search-heart',
        allowedMethods: ['home-visit', 'at-facility'], // NO self-sample
        participants: ['Người tìm kiếm', 'Người được tìm kiếm'],
        requiredDocuments: ['CCCD/CMND gốc', 'Giấy tờ chứng minh mối quan hệ (nếu có)', 'Báo cáo mất tích (nếu có)']
      }
    ],
    civil: [
      {
        id: 'civil-paternity',
        title: 'ADN huyết thống',
        description: 'Kiểm tra mối quan hệ huyết thống (cha - con, mẹ - con, anh chị em, họ hàng,...) phục vụ cho mục đích cá nhân',
        price: '3,500,000 VNĐ',
        duration: '5-7 ngày',
        icon: 'bi-people',
        allowedMethods: ['self-sample', 'home-visit', 'at-facility'], // ALL methods allowed
        participants: ['Người cần xét nghiệm 1', 'Người cần xét nghiệm 2'],
        requiredDocuments: ['CCCD/CMND gốc hoặc bản sao'],
        featured: true
      },
      {
        id: 'civil-prenatal',
        title: 'ADN trước sinh',
        description: 'Xác định quan hệ huyết thống giữa thai nhi và người cha giả định; thường được tiến hành từ tuần 7-8 của thai kỳ bằng phương pháp không xâm lấn',
        price: '8,500,000 VNĐ',
        duration: '7-10 ngày',
        icon: 'bi-heart',
        allowedMethods: ['home-visit', 'at-facility'], // NO self-sample (medical procedure)
        participants: ['Mẹ bầu', 'Cha giả định'],
        requiredDocuments: ['CCCD/CMND gốc', 'Giấy khám thai', 'Kết quả siêu âm gần nhất'],
        featured: true
      },
      {
        id: 'civil-ancestry',
        title: 'ADN nguồn gốc tổ tiên',
        description: 'Phân tích nguồn gốc di truyền, giúp xác định tổ tiên và dòng họ cá nhân',
        price: '6,200,000 VNĐ',
        duration: '10-14 ngày',
        icon: 'bi-tree',
        allowedMethods: ['self-sample', 'home-visit', 'at-facility'], // ALL methods allowed
        participants: ['Người cần phân tích'],
        requiredDocuments: ['CCCD/CMND gốc hoặc bản sao']
      },
      {
        id: 'civil-personal',
        title: 'ADN cá nhân',
        description: 'Phân tích đặc điểm di truyền cá nhân như khả năng phản ứng với thuốc, nguy cơ mắc bệnh di truyền, hay các đặc tính sinh học khác',
        price: '4,800,000 VNĐ',
        duration: '7-10 ngày',
        icon: 'bi-person-badge',
        allowedMethods: ['self-sample', 'home-visit', 'at-facility'], // ALL methods allowed
        participants: ['Người cần phân tích'],
        requiredDocuments: ['CCCD/CMND gốc hoặc bản sao']
      },
      {
        id: 'civil-confidential',
        title: 'ADN bí mật',
        description: 'Thực hiện kiểm tra quan hệ huyết thống một cách ẩn danh, phù hợp khi cần bảo mật và riêng tư toàn diện thông tin xét nghiệm',
        price: '5,500,000 VNĐ',
        duration: '5-7 ngày',
        icon: 'bi-shield-lock',
        allowedMethods: ['self-sample', 'home-visit', 'at-facility'], // ALL methods allowed
        participants: ['Người cần xét nghiệm'],
        requiredDocuments: ['Không yêu cầu giấy tờ tùy thân']
      }
    ]
  };

  // Collection methods with updated logic
  const COLLECTION_METHODS = {
    'self-sample': {
      id: 'self-sample',
      title: 'Lấy mẫu tại nhà',
      description: 'Tự lấy mẫu tại nhà theo hướng dẫn chi tiết',
      icon: 'bi-house',
      color: 'success',
      process: [
        'Đặt hẹn và cung cấp địa chỉ nhận kit',
        'Nhận kit xét nghiệm qua bưu điện (1-2 ngày)',
        'Đọc kỹ hướng dẫn và lấy mẫu theo đúng quy trình',
        'Gửi mẫu về phòng lab bằng phong bì có sẵn',
        'Theo dõi quá trình xử lý và nhận kết quả'
      ],
      note: 'Chỉ áp dụng cho một số dịch vụ ADN dân sự. Tiện lợi, riêng tư nhưng không có giá trị pháp lý.'
    },
    'home-visit': {
      id: 'home-visit',
      title: 'Nhân viên tới nhà lấy mẫu',
      description: 'Nhân viên y tế đến tận nơi để thu mẫu',
      icon: 'bi-truck',
      color: 'warning',
      process: [
        'Đặt lịch hẹn và xác nhận địa chỉ',
        'Nhân viên liên hệ trước 30 phút',
        'Nhân viên đến đúng giờ hẹn với đầy đủ dụng cụ',
        'Thu mẫu tại nhà theo đúng quy trình y tế',
        'Vận chuyển mẫu về phòng lab ngay lập tức'
      ],
      note: 'Phù hợp khi không thể đến cơ sở y tế. Đảm bảo chất lượng mẫu và có thể có giá trị pháp lý.'
    },
    'at-facility': {
      id: 'at-facility',
      title: 'Tới cơ sở lấy mẫu',
      description: 'Đến trực tiếp cơ sở y tế để thu mẫu',
      icon: 'bi-hospital',
      color: 'primary',
      process: [
        'Đặt lịch hẹn và chọn cơ sở thuận tiện',
        'Đến đúng giờ hẹn với đầy đủ giấy tờ',
        'Làm thủ tục tại quầy lễ tân',
        'Thu mẫu tại phòng chuyên khoa',
        'Thanh toán và nhận biên lai'
      ],
      note: 'Đảm bảo cao nhất về chất lượng và tính pháp lý. Bắt buộc với các dịch vụ có giá trị pháp lý.'
    }
  };

  // Function to get available methods for a specific service
  const getAvailableMethodsForService = (serviceId) => {
    const allServices = [...servicesData.administrative, ...servicesData.civil];
    const service = allServices.find(s => s.id === serviceId);
    
    if (!service) return [];
    
    return service.allowedMethods.map(methodId => COLLECTION_METHODS[methodId]);
  };

  // Function to get service by ID
  const getServiceById = (serviceId) => {
    const allServices = [...servicesData.administrative, ...servicesData.civil];
    return allServices.find(s => s.id === serviceId);
  };

  // Load pre-selected service from navigation state
  useEffect(() => {
    if (location.state?.selectedService) {
      const service = getServiceById(location.state.selectedService);
      if (service) {
        setBookingData(prev => ({
          ...prev,
          serviceType: service.serviceType || (servicesData.administrative.find(s => s.id === service.id) ? 'administrative' : 'civil'),
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
                    <Badge bg="light" text="dark" className="fs-6">Không có giá trị pháp lý</Badge>
                  </Card.Header>
                  <Card.Body className="p-4">
                    <div className="mb-4">
                      <h5 className="text-success mb-3">Đặc điểm:</h5>
                      <ul className="list-unstyled">
                        <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Một số dịch vụ cho phép tự lấy mẫu</li>
                        <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Bảo mật và riêng tư cao</li>
                        <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Thuận tiện và linh hoạt</li>
                        <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Mục đích tham khảo cá nhân</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h6 className="text-success mb-3">Phù hợp cho:</h6>
                      <ul className="small text-muted">
                        <li>Tìm hiểu quan hệ huyết thống cá nhân</li>
                        <li>Xét nghiệm thai nhi an toàn</li>
                        <li>Phân tích nguồn gốc tổ tiên</li>
                        <li>Xét nghiệm riêng tư, bí mật</li>
                      </ul>
                    </div>

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
                        <li className="mb-2"><i className="bi bi-check-circle text-warning me-2"></i>Có giá trị pháp lý đầy đủ</li>
                        <li className="mb-2"><i className="bi bi-check-circle text-warning me-2"></i>Được tòa án công nhận</li>
                        <li className="mb-2"><i className="bi bi-x-circle text-danger me-2"></i>Không cho phép tự lấy mẫu</li>
                        <li className="mb-2"><i className="bi bi-check-circle text-warning me-2"></i>Thu mẫu có giám sát nghiêm ngặt</li>
                      </ul>
                    </div>
                    
                    <div className="mb-4">
                      <h6 className="text-warning mb-3">Phù hợp cho:</h6>
                      <ul className="small text-muted">
                        <li>Làm giấy khai sinh</li>
                        <li>Thủ tục nhập tịch, visa, hộ chiếu</li>
                        <li>Giải quyết tranh chấp thừa kế</li>
                        <li>Xác định trách nhiệm cấp dưỡng</li>
                      </ul>
                    </div>

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
                  {servicesData[bookingData.serviceType].map(service => (
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
                          service.serviceType === 'administrative' || bookingData.serviceType === 'administrative' 
                            ? 'bg-warning bg-opacity-10' : 'bg-success bg-opacity-10'
                        }`}>
                          <div className="d-flex align-items-center mb-2">
                            <div className={`rounded-circle p-2 me-3 ${
                              bookingData.serviceType === 'administrative' ? 'bg-warning' : 'bg-success'
                            }`}>
                              <i className={`${service.icon} text-white fs-5`}></i>
                            </div>
                            <div className="flex-grow-1">
                              {getServiceTypeBadge(bookingData.serviceType)}
                            </div>
                          </div>
                        </Card.Header>

                        <Card.Body className="d-flex flex-column">
                          <Card.Title className="h5 mb-3">{service.title}</Card.Title>
                          <Card.Text className="text-muted flex-grow-1 small">
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
                {getServiceTypeBadge(bookingData.serviceType)}
              </div>
            </div>

            {/* Important Notice for Administrative Services */}
            {bookingData.serviceType === 'administrative' && (
              <Alert variant="warning" className="mb-4">
                <div className="d-flex align-items-start">
                  <i className="bi bi-shield-check me-3 mt-1 fs-4"></i>
                  <div>
                    <h6 className="mb-2">Lưu ý quan trọng về dịch vụ có giá trị pháp lý:</h6>
                    <ul className="mb-0">
                      <li><strong>Không thể tự lấy mẫu tại nhà</strong> - Để đảm bảo tính chính xác và giá trị pháp lý</li>
                      <li>Bắt buộc phải có <strong>sự giám sát của nhân viên y tế</strong> trong quá trình thu mẫu</li>
                      <li>Tất cả đương sự phải <strong>có mặt đồng thời</strong> khi thu mẫu</li>
                      <li>Kết quả có thể sử dụng tại <strong>tòa án và các cơ quan nhà nước</strong></li>
                    </ul>
                  </div>
                </div>
              </Alert>
            )}

            {/* Special Notice for Prenatal Testing */}
            {selectedService.id === 'civil-prenatal' && (
              <Alert variant="info" className="mb-4">
                <div className="d-flex align-items-start">
                  <i className="bi bi-heart me-3 mt-1 fs-4"></i>
                  <div>
                    <h6 className="mb-2">Lưu ý đặc biệt về xét nghiệm ADN trước sinh:</h6>
                    <ul className="mb-0">
                      <li><strong>Không thể tự lấy mẫu</strong> - Đây là thủ thuật y tế chuyên khoa</li>
                      <li>Yêu cầu <strong>nhân viên y tế chuyên nghiệp</strong> thực hiện</li>
                      <li>Cần có <strong>kết quả siêu âm</strong> để xác định tuần thai phù hợp</li>
                      <li>Thực hiện từ <strong>tuần 7-8 của thai kỳ</strong> bằng phương pháp không xâm lấn</li>
                    </ul>
                  </div>
                </div>
              </Alert>
            )}

            <Row>
              {availableMethods.map(method => (
                <Col key={method.id} lg={4} md={6} className="mb-4">
                  <Card 
                    className={`h-100 cursor-pointer border-2 ${
                      bookingData.collectionMethod === method.id 
                        ? `border-${method.color} shadow-lg` 
                        : `border-${method.color} border-opacity-25`
                    }`}
                    style={{ cursor: 'pointer', transition: 'all 0.3s ease' }}
                    onClick={() => handleMethodSelect(method.id)}
                  >
                    <Card.Header className={`bg-${method.color} text-white text-center`}>
                      <div className="py-2">
                        <i className={`${method.icon} fs-1 mb-2 d-block`}></i>
                        <h5 className="mb-0">{method.title}</h5>
                      </div>
                    </Card.Header>
                    <Card.Body>
                      <Card.Text className="mb-3">{method.description}</Card.Text>
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
                    </Card.Body>
                  </Card>
                </Col>
              ))}
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

        {/* Continue with Steps 3 & 4 - keeping the existing implementation */}
        {/* ... Rest of the component remains the same ... */}
      </Container>
    </div>
  );
};

export default AppointmentBooking;