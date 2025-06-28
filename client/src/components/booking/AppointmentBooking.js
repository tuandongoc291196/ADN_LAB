import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Form, Alert, Tab, Nav } from 'react-bootstrap';
import { getAllServices, getAllMethods, getMethodsByServiceId, createBooking } from '../../services/api';
import { getServiceById, getServicesByType, canServiceUseSelfSample, isAdministrativeService, enrichMethodData, isMethodDisabled, getMethodRestrictionReason } from '../data/services-data';

const AppointmentBooking = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentStep, setCurrentStep] = useState(1);
  const [services, setServices] = useState([]);
  const [methods, setMethods] = useState([]);
  const [serviceMethods, setServiceMethods] = useState([]);
  const [enrichedMethods, setEnrichedMethods] = useState([]);
  const [loading, setLoading] = useState(true);
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
  const [idNumberErrors, setIdNumberErrors] = useState({});
  const [phoneErrors, setPhoneErrors] = useState({});
  const storedUserData = localStorage.getItem('userData');
  const userData = storedUserData ? JSON.parse(storedUserData) : null;
  const calculateEndTime = (startTime) => {
    const [hour, minute] = startTime.split(':').map(Number);
    const endHour = hour + 1;
    return `${endHour < 10 ? '0' : ''}${endHour}:${minute < 10 ? '0' : ''}${minute}`;
  };

  const [customerErrors, setCustomerErrors] = useState({
    fullName: '',
    phone: '',
    idNumber: '',
    address: ''
  });

  // Fetch services and methods from API
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [servicesData, methodsData] = await Promise.all([
          getAllServices(),
          getAllMethods()
        ]);

        console.log('=== SERVICES FROM API ===');
        console.log('Services data:', servicesData);
        console.log('Services type:', typeof servicesData);
        console.log('Services length:', servicesData?.length);
        if (servicesData && servicesData.length > 0) {
          console.log('First service structure:', servicesData[0]);
          console.log('First service ID:', servicesData[0].id);
          console.log('First service title:', servicesData[0].title);
        }

        console.log('=== METHODS FROM API ===');
        console.log('Methods data:', methodsData);
        console.log('Methods type:', typeof methodsData);
        console.log('Methods length:', methodsData?.length);

        setServices(servicesData || []);
        setMethods(methodsData || []);

        // Enrich methods with icon and color
        const enriched = enrichMethodData(methodsData || []);
        setEnrichedMethods(enriched);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  // Fetch service methods when service is selected
  useEffect(() => {
    const fetchServiceMethods = async () => {
      if (bookingData.serviceId) {
        try {
          const methodsData = await getMethodsByServiceId(bookingData.serviceId);
          setServiceMethods(methodsData || []);
        } catch (error) {
          console.error('Error fetching service methods:', error);
          setServiceMethods([]);
        }
      }
    };

    fetchServiceMethods();
  }, [bookingData.serviceId]);

  // Load pre-selected service from navigation state
  useEffect(() => {
    if (location.state?.selectedService && services.length > 0) {
      const service = getServiceById(services, location.state.selectedService);
      if (service) {
        setBookingData(prev => ({
          ...prev,
          serviceType: service.category?.hasLegalValue ? 'administrative' : 'civil',
          serviceId: service.id,
          customerInfo: {
            ...prev.customerInfo,
            participants: service.participants ? service.participants.map((role, index) => ({
              id: index,
              role: role,
              name: '',
              idNumber: '',
              phone: ''
            })) : []
          }
        }));
        setCurrentStep(2); // Skip service selection
      }
    }
  }, [location.state, services]);

  // Nếu có userData trong localStorage thì tự động điền thông tin người đặt lịch

  useEffect(() => {
    if (storedUserData) {
      const parsed = JSON.parse(storedUserData);
      setBookingData(prev => ({
        ...prev,
        customerInfo: {
          ...prev.customerInfo,
          fullName: parsed.fullname || parsed.fullName || '',
          phone: parsed.phone || '',
          email: parsed.email || '',
          idNumber: parsed.id_number || parsed.idNumber || '',
          address: parsed.address || '',
        }
      }));
    }
  }, [storedUserData]);

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
    const selectedService = getServiceById(services, serviceId);
    
    console.log('handleServiceSelect called with serviceId:', serviceId);
    console.log('Selected service object:', selectedService);
    console.log('Service ID from object:', selectedService?.id);
    console.log('Service title from object:', selectedService?.title);

    setBookingData({
      ...bookingData,
      serviceId: serviceId,
      collectionMethod: '',
      customerInfo: {
        ...bookingData.customerInfo,
        participants: selectedService ? (selectedService.participants ? selectedService.participants.map((role, index) => ({
          id: index,
          role: role,
          name: '',
          idNumber: '',
          phone: ''
        })) : []) : []
      }
    });
  };

  const handleMethodSelect = (method) => {
    setBookingData({
      ...bookingData,
      collectionMethod: method.id
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

  const handleBookingSubmit = async () => {
    // Lấy userId từ localStorage
    let userId = '';
    try {
      const userDataFromStorage = JSON.parse(localStorage.getItem('userData'));
      userId = userDataFromStorage?.uid || userDataFromStorage?.user_id || userDataFromStorage?.id || '';
    } catch (e) { 
      console.error('Error parsing userData:', e);
    }

    // Lấy service/method info
    const service = selectedService;
    const method = selectedMethod;

    // Validation trước khi submit
    if (!service) {
      alert('Vui lòng chọn dịch vụ!');
      return;
    }

    if (!bookingData.collectionMethod) {
      alert('Vui lòng chọn phương thức lấy mẫu!');
      return;
    }

    if (!bookingData.appointmentDate || !bookingData.appointmentTime) {
      alert('Vui lòng chọn ngày và giờ hẹn!');
      return;
    }

    if (!bookingData.customerInfo.fullName || !bookingData.customerInfo.phone) {
      alert('Vui lòng điền đầy đủ thông tin liên hệ!');
      return;
    }

    console.log('Selected service:', service);
    console.log('Service ID type:', typeof service.id);
    console.log('Service ID value:', service.id);

    // Tính toán startTime, endTime từ slot
    let startTime = bookingData.appointmentTime || '';
    let endTime = '';
    if (startTime) {
      const [h, m] = startTime.split(':');
      const start = new Date(0, 0, 0, parseInt(h), parseInt(m));
      start.setHours(start.getHours() + 1);
      endTime = start.toTimeString().slice(0, 5);
    }

    // Map participants
    const participants = (bookingData.customerInfo.participants || []).map((p) => ({
      name: p.name || '',
      age: p.age || null,
      identification: p.idNumber || '',
      gender: p.gender || '',
      relationship: p.relation || p.role || '',
    }));

    // Thông tin người đặt lịch
    const information = {
      name: bookingData.customerInfo.fullName,
      identification: bookingData.customerInfo.idNumber,
      address: bookingData.customerInfo.address,
      phone: bookingData.customerInfo.phone,
      email: bookingData.customerInfo.email
    };

    // Tổng tiền
    let totalAmount = 0;
    if (service && typeof service.price === 'number') totalAmount = service.price;

    // Chuẩn bị payload
    const payload = {
      userId: userId, // Sử dụng userId đã lấy từ localStorage
      slotDate: bookingData.appointmentDate,
      startTime: bookingData.appointmentTime,
      endTime: calculateEndTime(bookingData.appointmentTime),
      methodId: bookingData.collectionMethod,
      serviceId: service.id, // phải là ID từ backend
      totalAmount,
      information: {
        name: bookingData.customerInfo.fullName,
        identification: bookingData.customerInfo.idNumber,
        address: bookingData.customerInfo.address,
        phone: bookingData.customerInfo.phone,
        email: bookingData.customerInfo.email,
      },
      participants: bookingData.customerInfo.participants.map((p) => ({
        name: p.name,
        identification: p.idNumber,
        relationship: p.relation,
        age: p.age || 30, // gán mặc định nếu thiếu
        gender: p.gender || 'male' // hoặc female nếu có
      }))
    };

    // Kiểm tra nếu serviceId là title thay vì ID thực
    if (service.id === service.title) {
      console.warn('Service ID is same as title, this might be an issue with backend data structure');
      // Có thể cần điều chỉnh logic này tùy theo yêu cầu backend
    }

    console.log('Final payload before API call:', payload);

    try {
      console.log('Submitting booking with payload:', payload);
      const res = await createBooking(payload);
      console.log('Booking response:', res);
      
      // Kiểm tra response có hợp lệ không - handle cả booking_insert.id
      let bookingId = null;
      if (res) {
        bookingId = res.id || res.bookingId || res.data?.id || res.booking_insert?.id || res.data?.booking_insert?.id || null;
      }
      
      if (bookingId) {
        console.log('Success! Booking ID:', bookingId);
        console.log('Navigating to booking-confirmation with state:', { 
          bookingData: {
            ...bookingData,
            selectedService: service,
            selectedMethod: method
          }, 
          bookingId: bookingId
        });
        
        try {
          navigate('/booking-confirmation', { 
            state: { 
              bookingData: {
                ...bookingData,
                selectedService: service,
                selectedMethod: method
              }, 
              bookingId: bookingId
            } 
          });
          console.log('Navigation successful');
        } catch (navError) {
          console.error('Navigation error:', navError);
          // Fallback: redirect to confirmation page
          window.location.href = '/booking-confirmation';
        }
      } else {
        throw new Error('No booking ID returned from server');
      }
    } catch (err) {
      console.error('Booking error details:', err);
      
      // Hiển thị thông báo lỗi chi tiết hơn
      const errorMessage = err.message || 'Đặt lịch thất bại! Vui lòng thử lại hoặc liên hệ hỗ trợ.';
      alert(`Lỗi đặt lịch: ${errorMessage}`);
    }
  };


  const selectedService = bookingData.serviceId ? getServiceById(services, bookingData.serviceId) : null;
  const selectedMethod = bookingData.collectionMethod ? 
    (typeof bookingData.collectionMethod === 'string' 
      ? enrichedMethods.find(m => m.id === bookingData.collectionMethod)
      : bookingData.collectionMethod) 
    : null;

  // Helper: Render badge for service type
  const renderServiceTypeBadge = (serviceType, category) => {
    if (serviceType === 'administrative') {
      return <Badge bg="warning" text="dark">ADN Hành chính</Badge>;
    }
    return <Badge bg="success">ADN Dân sự</Badge>;
  };

  // Helper: Get collection method name
  const getCollectionMethodName = (methodId, methodInfo) => {
    // Ưu tiên lấy tên từ methodInfo nếu có
    if (methodInfo && methodInfo.name) {
      return methodInfo.name;
    }
    
    // Fallback về mapping cũ
    const methods = {
      '0': 'Tự lấy mẫu tại nhà',
      '1': 'Nhân viên tới nhà lấy mẫu',
      '2': 'Tới cơ sở lấy mẫu',
      'self-sample': 'Tự lấy mẫu tại nhà',
      'home-visit': 'Nhân viên tới nhà lấy mẫu',
      'at-facility': 'Tới cơ sở lấy mẫu'
    };
    return methods[methodId] || methodId;
  };

  // Helper: Get method color
  const getMethodColor = (methodId) => {
    const methodColors = {
      'self-sample': 'success',
      'home-visit': 'warning', 
      'at-facility': 'primary',
      '0': 'success',
      '1': 'warning',
      '2': 'primary'
    };
    return methodColors[methodId] || 'secondary';
  };

  // Helper: Generate next 30 days for date selection (excluding Sundays)
  const getDateOptions = () => {
    const dates = [];
    const today = new Date();
    for (let i = 1; i <= 30; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      if (date.getDay() !== 0) {
        dates.push(date.toISOString().split('T')[0]);
      }
    }
    return dates;
  };

  // Helper: Format date to Vietnamese
  const renderDate = (dateString) => {
    if (!dateString) return '';
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  // Time slots for booking (modern, 8 slots per day, 1 hour each)
  const timeSlots = [
    { label: '08:00 - 09:00', value: '08:00' },
    { label: '09:00 - 10:00', value: '09:00' },
    { label: '10:00 - 11:00', value: '10:00' },
    { label: '11:00 - 12:00', value: '11:00' },
    { label: '13:00 - 14:00', value: '13:00' },
    { label: '14:00 - 15:00', value: '14:00' },
    { label: '15:00 - 16:00', value: '15:00' },
    { label: '16:00 - 17:00', value: '16:00' }
  ];

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
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-primary" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="mt-3 text-muted">Đang tải thông tin dịch vụ...</p>
          </div>
        ) : (
          <>
            {/* Progress Bar */}
            <Row className="mb-5">
              <Col>
                <div className="d-flex justify-content-center align-items-center">
                  {[1, 2, 3, 4].map((step, index) => (
                    <React.Fragment key={step}>
                      <div className={`rounded-circle d-flex align-items-center justify-content-center border-2 ${currentStep >= step
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
              </Col>
            </Row>

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
                      className={`h-100 border-success cursor-pointer ${bookingData.serviceType === 'civil' ? 'border-3 shadow-lg' : 'border-2'
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
                      className={`h-100 border-warning cursor-pointer ${bookingData.serviceType === 'administrative' ? 'border-3 shadow-lg' : 'border-2'
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
                          {renderServiceTypeBadge(bookingData.serviceType, selectedService?.category)}
                        </span>
                      </h3>
                      <p className="text-muted">
                        Tất cả dịch vụ đều đảm bảo độ chính xác 99.999% với công nghệ hiện đại
                      </p>
                    </div>

                    <Row>
                      {getServicesByType(services, bookingData.serviceType).map(service => (
                        <Col key={service.id} lg={4} md={6} className="mb-4">
                          <Card
                            className={`h-100 border-0 shadow-sm ${bookingData.serviceId === service.id
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

                            <Card.Header className={`border-0 ${service.category?.hasLegalValue ? 'bg-warning bg-opacity-10' : 'bg-success bg-opacity-10'
                              }`}>
                              <div className="d-flex align-items-center mb-2">
                                <div className={`rounded-circle p-2 me-3 ${service.category?.hasLegalValue ? 'bg-warning' : 'bg-success'
                                  }`}>
                                  <i className={`${service.icon || 'bi-dna'} text-white fs-5`}></i>
                                </div>
                                <div className="flex-grow-1">
                                  {renderServiceTypeBadge(service.category?.hasLegalValue ? 'administrative' : 'civil', service.category)}
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
                                <div className="h5 text-primary mb-1">
                                  {typeof service.price === 'number'
                                    ? new Intl.NumberFormat('vi-VN').format(service.price) + ' VNĐ'
                                    : service.price || 'Liên hệ'
                                  }
                                </div>
                                <small className="text-muted">
                                  <i className="bi bi-clock me-1"></i>
                                  Thời gian: {service.duration}
                                </small>
                              </div>

                              {/* Collection Methods */}
                              <div className="mb-3">
                                <small className="text-muted d-block mb-2">Phương thức lấy mẫu:</small>
                                <div className="d-flex flex-wrap gap-1">
                                  {enrichedMethods.length > 0 ? (
                                    enrichedMethods.map(method => {
                                      const isDisabled = isMethodDisabled(method.id, service);
                                      return (
                                        <Badge
                                          key={method.id}
                                          bg={isDisabled ? 'secondary' : method.color || 'secondary'}
                                          className="me-1"
                                          style={{ opacity: isDisabled ? 0.5 : 1 }}
                                        >
                                          <i className={`${method.icon || 'bi-gear'} me-1`}></i>
                                          {getCollectionMethodName(method.id, method)}
                                        </Badge>
                                      );
                                    })
                                  ) : (
                                    <Badge bg="secondary">
                                      <i className="bi bi-gear me-1"></i>
                                      Đang cập nhật
                                    </Badge>
                                  )}
                                </div>
                              </div>

                              {/* Special restrictions */}
                              {service.category?.hasLegalValue && (
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
                    {renderServiceTypeBadge(selectedService.category?.hasLegalValue ? 'administrative' : 'civil', selectedService.category)}
                  </div>
                </div>

                {/* Restriction alerts */}
                {selectedService.category?.hasLegalValue && (
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
                  {enrichedMethods.length > 0 ? (
                    enrichedMethods.map(method => {
                      const isDisabled = isMethodDisabled(method.id, selectedService);
                      const restrictionReason = getMethodRestrictionReason(method.id, selectedService);

                      return (
                        <Col key={method.id} lg={4} md={6} className="mb-4">
                          <Card
                            className={`h-100 border-2 ${isDisabled
                              ? 'border-light bg-light opacity-50'
                              : bookingData.collectionMethod === method.id
                                ? `border-${method.color || 'primary'} shadow-lg`
                                : `border-${method.color || 'primary'} border-opacity-25 cursor-pointer`
                              }`}
                            style={{
                              cursor: isDisabled ? 'not-allowed' : 'pointer',
                              transition: 'all 0.3s ease'
                            }}
                            onClick={() => !isDisabled && handleMethodSelect(method)}
                          >
                            <Card.Header className={`${isDisabled
                              ? 'bg-light text-muted'
                              : `bg-${method.color || 'primary'} text-white`
                              } text-center`}>
                              <div className="py-2">
                                <i className={`${method.icon || 'bi-gear'} fs-1 mb-2 d-block`}></i>
                                <h5 className="mb-0">{getCollectionMethodName(method.id, method)}</h5>
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
                                  {method.price >= 0 && (
                                    <div className="mb-3">
                                      <strong>Phí dịch vụ:</strong>
                                      <div className="h5 text-primary">
                                        {new Intl.NumberFormat('vi-VN').format(method.price)} VNĐ
                                      </div>
                                    </div>
                                  )}

                                  {method.process && method.process.length > 0 && (
                                    <div className="mb-3">
                                      <strong>Quy trình thực hiện:</strong>
                                      <ol className="mt-2 small">
                                        {method.process.map((step, index) => (
                                          <li key={index} className="mb-1">{step}</li>
                                        ))}
                                      </ol>
                                    </div>
                                  )}

                                  {method.note && (
                                    <Alert variant={`${method.color === 'warning' ? 'warning' : 'info'}`} className="small mb-0">
                                      <i className="bi bi-info-circle me-2"></i>
                                      {method.note}
                                    </Alert>
                                  )}

                                  {bookingData.collectionMethod === method.id && (
                                    <div className="text-center mt-3">
                                      <Badge bg={method.color || 'primary'} className="px-3 py-2">
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
                    })
                  ) : (
                    <Col className="text-center">
                      <Alert variant="info">
                        <i className="bi bi-info-circle me-2"></i>
                        Đang tải thông tin phương thức lấy mẫu...
                      </Alert>
                    </Col>
                  )}
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
                                onChange={(e) => {
                                  const value = e.target.value;
                                  handleCustomerInfoChange('fullName', value);
                                  setCustomerErrors(prev => ({
                                    ...prev,
                                    fullName: value.trim() ? '' : 'Họ và tên không được để trống'
                                  }));
                                }}
                                isInvalid={!!customerErrors.fullName}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {customerErrors.fullName}
                              </Form.Control.Feedback>
                            </Col>

                            <Col md={6} className="mb-3">
                              <Form.Label>Số điện thoại <span className="text-danger">*</span></Form.Label>
                              <Form.Control
                                type="tel"
                                inputMode="numeric"
                                maxLength={10}
                                placeholder="Nhập số điện thoại"
                                value={bookingData.customerInfo.phone}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '');
                                  handleCustomerInfoChange('phone', value);
                                  const error =
                                    !value
                                      ? 'Số điện thoại không được để trống'
                                      : !/^0\d{9}$/.test(value)
                                        ? 'Số điện thoại phải bắt đầu bằng 0 và đủ 10 số'
                                        : '';
                                  setCustomerErrors(prev => ({ ...prev, phone: error }));
                                }}
                                isInvalid={!!customerErrors.phone}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {customerErrors.phone}
                              </Form.Control.Feedback>
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
                                inputMode="numeric"
                                maxLength={12}
                                placeholder="Nhập số CCCD/CMND"
                                value={bookingData.customerInfo.idNumber}
                                onChange={(e) => {
                                  const value = e.target.value.replace(/\D/g, '');
                                  if (value.length <= 12) {
                                    handleCustomerInfoChange('idNumber', value);
                                    const error =
                                      !value
                                        ? 'CCCD không được để trống'
                                        : value.length !== 12
                                          ? 'CCCD phải gồm đúng 12 chữ số'
                                          : '';
                                    setCustomerErrors(prev => ({ ...prev, idNumber: error }));
                                  }
                                }}
                                isInvalid={!!customerErrors.idNumber}
                                required
                              />
                              <Form.Control.Feedback type="invalid">
                                {customerErrors.idNumber}
                              </Form.Control.Feedback>
                            </Col>
                          </Row>

                          <Form.Group className="mb-3">
                            <Form.Label>Địa chỉ <span className="text-danger">*</span></Form.Label>
                            <Form.Control
                              as="textarea"
                              rows={2}
                              placeholder="Nhập địa chỉ đầy đủ"
                              value={bookingData.customerInfo.address}
                              onChange={(e) => {
                                const value = e.target.value;
                                handleCustomerInfoChange('address', value);
                                setCustomerErrors(prev => ({
                                  ...prev,
                                  address: value.trim() ? '' : 'Địa chỉ không được để trống'
                                }));
                              }}
                              isInvalid={!!customerErrors.address}
                              required
                            />
                            <Form.Control.Feedback type="invalid">
                              {customerErrors.address}
                            </Form.Control.Feedback>
                          </Form.Group>
                        </Form>
                      </Card.Body>
                    </Card>

                    {/* Participants Information - Modern Form for 2 people */}
                    <Card className="mt-4 shadow-sm">
                      <Card.Header className="bg-info text-white">
                        <h5 className="mb-0">
                          <i className="bi bi-people me-2"></i>
                          Thông tin người tham gia xét nghiệm
                        </h5>
                      </Card.Header>
                      <Card.Body className="p-4">
                        <Row>
                          <Col md={6} className="mb-3">
                            <Card className="border-light">
                              <Card.Header className="bg-light">
                                <h6 className="mb-0 text-success">Người tham gia 1</h6>
                              </Card.Header>
                              <Card.Body className="p-3">
                                {bookingData.customerInfo.participants[0] ? (
                                  <div className="d-flex flex-wrap align-items-center justify-content-center text-center">
                                    <span className="me-3 mb-1">
                                      <strong>Tên:</strong> {bookingData.customerInfo.participants[0].name}
                                    </span>
                                    <span className="me-3 mb-1">
                                      <strong>CCCD:</strong> {bookingData.customerInfo.participants[0].idNumber}
                                    </span>
                                    {bookingData.customerInfo.participants[0].phone && (
                                      <span className="me-3 mb-1">
                                        <strong>SĐT:</strong> {bookingData.customerInfo.participants[0].phone}
                                      </span>
                                    )}
                                    <span className="mb-1">
                                      <strong>Quan hệ:</strong> {bookingData.customerInfo.participants[0].relation || 'N/A'}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="text-muted text-center">Chưa có thông tin</div>
                                )}
                              </Card.Body>
                            </Card>
                          </Col>
                          <Col md={6} className="mb-3">
                            <Card className="border-light">
                              <Card.Header className="bg-light">
                                <h6 className="mb-0 text-success">Người tham gia 2</h6>
                              </Card.Header>
                              <Card.Body className="p-3">
                                {bookingData.customerInfo.participants[1] ? (
                                  <div className="d-flex flex-wrap align-items-center justify-content-center text-center">
                                    <span className="me-3 mb-1">
                                      <strong>Tên:</strong> {bookingData.customerInfo.participants[1].name}
                                    </span>
                                    <span className="me-3 mb-1">
                                      <strong>CCCD:</strong> {bookingData.customerInfo.participants[1].idNumber}
                                    </span>
                                    {bookingData.customerInfo.participants[1].phone && (
                                      <span className="me-3 mb-1">
                                        <strong>SĐT:</strong> {bookingData.customerInfo.participants[1].phone}
                                      </span>
                                    )}
                                    <span className="mb-1">
                                      <strong>Quan hệ:</strong> {bookingData.customerInfo.participants[1].relation || 'N/A'}
                                    </span>
                                  </div>
                                ) : (
                                  <div className="text-muted text-center">Chưa có thông tin</div>
                                )}
                              </Card.Body>
                            </Card>
                          </Col>
                        </Row>
                      </Card.Body>
                    </Card>
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
                            <Form.Label>
                              Ngày hẹn <span className="text-danger">*</span>
                            </Form.Label>
                            <Form.Control
                              type="date"
                              min={getDateOptions()[0]}
                              max={getDateOptions()[getDateOptions().length - 1]}
                              value={bookingData.appointmentDate}
                              onChange={(e) =>
                                setBookingData({ ...bookingData, appointmentDate: e.target.value })
                              }
                              required
                            />
                            <Form.Text className="text-muted">
                              <i className="bi bi-info-circle me-1"></i>
                              Không làm việc vào Chủ nhật
                            </Form.Text>
                          </Form.Group>

                          {bookingData.appointmentDate && (
                            <Form.Group className="mb-3">
                              <Form.Label>
                                Giờ hẹn <span className="text-danger">*</span>
                              </Form.Label>
                              <Row className="g-2">
                                {timeSlots.map((slot) => (
                                  <Col key={slot.value} xs={6} md={3}>
                                    <Button
                                      variant={
                                        bookingData.appointmentTime === slot.value
                                          ? 'warning'
                                          : 'outline-warning'
                                      }
                                      size="md"
                                      className="w-100 fw-bold py-2"
                                      style={{ borderRadius: 12, fontSize: 16 }}
                                      onClick={() =>
                                        setBookingData({
                                          ...bookingData,
                                          appointmentTime: slot.value,
                                        })
                                      }
                                    >
                                      {slot.label}
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
                    {/* <Card className="mb-4 shadow-sm">
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
                          onChange={(e) => setBookingData({ ...bookingData, specialRequests: e.target.value })}
                        />
                      </Card.Body>
                    </Card>

                    {/* Required Documents Reminder 
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
                            {selectedService?.requiredDocuments?.map((doc, index) => (
                              <li key={index} className="small mb-2">
                                <i className="bi bi-check text-info me-2"></i>
                                {doc}
                              </li>
                            ))}
                          </ul>
                        </Card.Body>
                      </Card>
                    )} */}
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
                          <Nav.Link eventKey="customer-appointment-info">
                            <i className="bi bi-person-calendar me-2"></i>
                            Thông tin khách hàng & lịch hẹn
                          </Nav.Link>
                        </Nav.Item>
                      </Nav>

                      <Tab.Content>
                        <Tab.Pane eventKey="service-info">
                          <Row>
                            <Col md={6} className="mb-4">
                              <h6 className="text-primary mb-3">
                                <i className="bi bi-gear me-2"></i>
                                Thông tin dịch vụ
                              </h6>
                              <div className="mb-2">
                                <strong>Tên dịch vụ:</strong>
                                <div className="text-muted">
                                  {selectedService.title || 'Không có thông tin'}
                                </div>
                              </div>
                              <div className="mb-2">
                                <strong>Mô tả dịch vụ:</strong>
                                <div className="text-muted">
                                  {selectedService.description || 'Không có mô tả'}
                                </div>
                              </div>
                              <Row className="mb-2">
                                <Col md={6}>
                                  <strong>Loại dịch vụ:</strong>
                                  <div className="mt-1">
                                    {renderServiceTypeBadge(selectedService.category?.hasLegalValue ? 'administrative' : 'civil', selectedService.category)}
                                  </div>
                                </Col>
                                <Col md={6}>
                                  <strong>Phương thức thu mẫu:</strong>
                                  <div className="mt-1">
                                    <Badge bg={getMethodColor(bookingData.collectionMethod)}>
                                      {getCollectionMethodName(bookingData.collectionMethod, selectedMethod)}
                                    </Badge>
                                  </div>
                                </Col>
                              </Row>
                            </Col>
                            <Col md={6} className="mb-4">
                              <h6 className="text-primary mb-3">
                                <i className="bi bi-cash-coin me-2"></i>
                                Thông tin chi phí
                              </h6>
                              <div className="bg-light p-3 rounded">
                                <div className="d-flex justify-content-between mb-2">
                                  <span>Giá dịch vụ:</span>
                                  <span className="text-muted">
                                    {selectedService.price && selectedService.price > 0 
                                      ? `${new Intl.NumberFormat('vi-VN').format(selectedService.price)} VNĐ`
                                      : 'Liên hệ để biết giá'
                                    }
                                  </span>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                  <span>Phí dịch vụ (theo phương thức thu mẫu):</span>
                                  <span className="text-muted">
                                    {(() => {
                                      const methodPrice = selectedMethod?.price || 0;
                                      if (methodPrice > 0) {
                                        return `${new Intl.NumberFormat('vi-VN').format(methodPrice)} VNĐ`;
                                      }
                                      return 'Miễn phí';
                                    })()}
                                  </span>
                                </div>
                                <hr />
                                <div className="d-flex justify-content-between align-items-center mb-3">
                                  <h5 className="mb-0">Tổng cộng:</h5>
                                  <h4 className="text-primary mb-0">
                                    {(() => {
                                      const servicePrice = selectedService.price || 0;
                                      const methodPrice = selectedMethod?.price || 0;
                                      const totalAmount = servicePrice + methodPrice;
                                      
                                      if (totalAmount > 0) {
                                        return `${new Intl.NumberFormat('vi-VN').format(totalAmount)} VNĐ`;
                                      }
                                      return 'Liên hệ để biết giá';
                                    })()}
                                  </h4>
                                </div>
                                <div className="d-flex justify-content-between mb-2">
                                  <span>Thời gian có kết quả:</span>
                                  <strong>{selectedService.duration || 'Liên hệ để biết thời gian'}</strong>
                                </div>
                                <small className="text-muted">
                                  <i className="bi bi-info-circle me-1"></i>
                                  Giá trên đã bao gồm thuế VAT và phí dịch vụ
                                </small>
                              </div>
                            </Col>
                          </Row>
                        </Tab.Pane>

                        <Tab.Pane eventKey="customer-appointment-info">
                          {/* Thông tin khách hàng */}
                          <div className="mb-4">
                            <h6 className="text-primary mb-3">
                              <i className="bi bi-person me-2"></i>
                              Thông tin khách hàng
                            </h6>
                            <Row>
                              <Col md={3} className="mb-2">
                                <strong>Họ tên:</strong> {bookingData.customerInfo.fullName}
                              </Col>
                              <Col md={3} className="mb-2">
                                <strong>Điện thoại:</strong> {bookingData.customerInfo.phone}
                              </Col>
                              <Col md={3} className="mb-2">
                                <strong>Email:</strong> {bookingData.customerInfo.email || 'Không có'}
                              </Col>
                              <Col md={3} className="mb-2">
                                <strong>CCCD/CMND:</strong> {bookingData.customerInfo.idNumber}
                              </Col>
                            </Row>
                          </div>

                          {/* Thông tin lịch hẹn */}
                          <div className="mb-4">
                            <h6 className="text-primary mb-3">
                              <i className="bi bi-calendar me-2"></i>
                              Thông tin lịch hẹn
                            </h6>
                            {bookingData.collectionMethod === 'self-sample' ? (
                              <div>
                                <Row className="mb-2">
                                  <Col md={4}>
                                    <strong>Phương thức:</strong> Tự lấy mẫu tại nhà
                                  </Col>
                                  <Col md={4}>
                                    <strong>Thời gian nhận kit:</strong> <span className="text-warning">1-2 ngày làm việc</span>
                                  </Col>
                                  <Col md={4}>
                                    <strong>Kit sẽ được gửi đến:</strong> {bookingData.customerInfo.address}
                                  </Col>
                                </Row>
                              </div>
                            ) : (
                              <div>
                                <Row className="mb-2">
                                  <Col md={3}>
                                    <strong>Giờ hẹn:</strong> {bookingData.appointmentTime}
                                  </Col>
                                  <Col md={4}>
                                    <strong>Ngày hẹn:</strong> {renderDate(bookingData.appointmentDate)}
                                  </Col>
                                  <Col md={5}>
                                    <strong>Địa điểm:</strong> {
                                      bookingData.collectionMethod === 'at-facility' ? 
                                        'Trung tâm xét nghiệm ADN - 123 Đường ABC, Quận XYZ' :
                                        bookingData.customerInfo.address
                                    }
                                  </Col>
                                </Row>
                              </div>
                            )}
                          </div>

                          {/* Người tham gia xét nghiệm */}
                          {bookingData.customerInfo.participants.length > 0 && (
                            <div className="mb-4">
                              <h6 className="text-primary mb-3">
                                <i className="bi bi-people me-2"></i>
                                Người tham gia xét nghiệm
                              </h6>
                              <Row>
                                <Col md={6} className="mb-3">
                                  <Card className="border-light">
                                    <Card.Header className="bg-light">
                                      <h6 className="mb-0 text-success">Người tham gia 1</h6>
                                    </Card.Header>
                                    <Card.Body className="p-3">
                                      {bookingData.customerInfo.participants[0] ? (
                                        <div className="d-flex flex-wrap align-items-center justify-content-center text-center">
                                          <span className="me-3 mb-1">
                                            <strong>Tên:</strong> {bookingData.customerInfo.participants[0].name}
                                          </span>
                                          <span className="me-3 mb-1">
                                            <strong>CCCD:</strong> {bookingData.customerInfo.participants[0].idNumber}
                                          </span>
                                          {bookingData.customerInfo.participants[0].phone && (
                                            <span className="me-3 mb-1">
                                              <strong>SĐT:</strong> {bookingData.customerInfo.participants[0].phone}
                                            </span>
                                          )}
                                          <span className="mb-1">
                                            <strong>Quan hệ:</strong> {bookingData.customerInfo.participants[0].relation || 'N/A'}
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="text-muted text-center">Chưa có thông tin</div>
                                      )}
                                    </Card.Body>
                                  </Card>
                                </Col>
                                <Col md={6} className="mb-3">
                                  <Card className="border-light">
                                    <Card.Header className="bg-light">
                                      <h6 className="mb-0 text-success">Người tham gia 2</h6>
                                    </Card.Header>
                                    <Card.Body className="p-3">
                                      {bookingData.customerInfo.participants[1] ? (
                                        <div className="d-flex flex-wrap align-items-center justify-content-center text-center">
                                          <span className="me-3 mb-1">
                                            <strong>Tên:</strong> {bookingData.customerInfo.participants[1].name}
                                          </span>
                                          <span className="me-3 mb-1">
                                            <strong>CCCD:</strong> {bookingData.customerInfo.participants[1].idNumber}
                                          </span>
                                          {bookingData.customerInfo.participants[1].phone && (
                                            <span className="me-3 mb-1">
                                              <strong>SĐT:</strong> {bookingData.customerInfo.participants[1].phone}
                                            </span>
                                          )}
                                          <span className="mb-1">
                                            <strong>Quan hệ:</strong> {bookingData.customerInfo.participants[1].relation || 'N/A'}
                                          </span>
                                        </div>
                                      ) : (
                                        <div className="text-muted text-center">Chưa có thông tin</div>
                                      )}
                                    </Card.Body>
                                  </Card>
                                </Col>
                              </Row>
                            </div>
                          )}
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
                            {selectedService.category?.hasLegalValue && (
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