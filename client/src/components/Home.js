import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';
import { getAllServices, getServicesByCategory, getAllMethods, getMethodsByServiceId } from '../services/api';
import { enrichMethodData } from './data/services-data';
import Swal from 'sweetalert2';

const Home = () => {
  const [services, setServices] = useState([]);
  const [methods, setMethods] = useState([]);
  const [serviceMethods, setServiceMethods] = useState({}); // { serviceId: [methods] }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [hoveredService, setHoveredService] = useState(null);
  const navigate = useNavigate();
  const storedUserData = localStorage.getItem('userData');

  // Enhanced inline styles
  const styles = {
    heroSection: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      position: 'relative',
      overflow: 'hidden'
    },
    serviceCard: {
      transition: 'all 0.3s ease',
      border: '0',
      borderLeft: '4px solid transparent',
      cursor: 'pointer'
    },
    serviceCardHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 25px rgba(0,0,0,0.15)'
    },
    serviceCardAdmin: {
      transition: 'all 0.3s ease',
      border: '0',
      borderLeft: '4px solid #ffc107'
    },
    serviceCardCivil: {
      transition: 'all 0.3s ease',
      border: '0',
      borderLeft: '4px solid #198754'
    },
    serviceCardAdminHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 25px rgba(255, 193, 7, 0.2)',
      borderLeft: '4px solid #ffc107'
    },
    serviceCardCivilHover: {
      transform: 'translateY(-5px)',
      boxShadow: '0 10px 25px rgba(25, 135, 84, 0.2)',
      borderLeft: '4px solid #198754'
    },
    serviceIcon: {
      width: '60px',
      height: '60px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      transition: 'transform 0.3s ease'
    },
    featureIcon: {
      width: '80px',
      height: '80px',
      transition: 'all 0.3s ease'
    },
    stepNumber: {
      fontWeight: 'bold',
      fontSize: '1.1rem',
      minWidth: '40px',
      minHeight: '40px',
      boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
    },
    testimonialCard: {
      transition: 'all 0.3s ease',
      position: 'relative'
    },
    ctaSection: {
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)'
    },
    minVh75: {
      minHeight: '75vh'
    },
    quickBookingSection: {
      background: 'linear-gradient(45deg, #007bff 0%, #0056b3 100%)',
      position: 'relative'
    },
    workflowSection: {
      background: '#f8f9fa'
    }
  };

  useEffect(() => {
    fetchServices();
    fetchMethods();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await getAllServices();
      console.log('Home - Services API response:', response);
      
      if (response && Array.isArray(response)) {
        setServices(response);
        // Fetch methods for each service
        await fetchMethodsForServices(response);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Không thể tải danh sách dịch vụ');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchMethods = async () => {
    try {
      const response = await getAllMethods();
      console.log('Home - Methods API response:', response);
      
      if (response && Array.isArray(response)) {
        setMethods(response);
      } else {
        setMethods([]);
      }
    } catch (err) {
      console.error('Error fetching methods:', err);
      setMethods([]);
    }
  };

  const fetchMethodsForServices = async (servicesList) => {
    try {
      const methodsMap = {};
      
      // Fetch methods for each service
      for (const service of servicesList) {
        try {
          const serviceMethods = await getMethodsByServiceId(service.id);
          console.log(`Methods for service ${service.id}:`, serviceMethods);
          
          if (serviceMethods && Array.isArray(serviceMethods)) {
            methodsMap[service.id] = serviceMethods;
          } else {
            methodsMap[service.id] = [];
          }
        } catch (err) {
          console.error(`Error fetching methods for service ${service.id}:`, err);
          methodsMap[service.id] = [];
        }
      }
      
      console.log('Final serviceMethods map:', methodsMap);
      setServiceMethods(methodsMap);
    } catch (err) {
      console.error('Error fetching methods for services:', err);
      setServiceMethods({});
    }
  };

  // Helper function để xác định service type từ category
  const getServiceTypeFromCategory = (category) => {
    if (!category) return 'civil';
    return category.hasLegalValue ? 'administrative' : 'civil';
  };

  // Helper function để format price
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
    }
    return price || 'Liên hệ';
  };

  // Handler for booking button
  const handleBookingClick = (e, serviceId) => {
    if (!storedUserData) {
      e.preventDefault(); // chặn click chuyển trang
      Swal.fire({
        icon: 'info',
        title: 'Bạn chưa đăng nhập',
        text: 'Vui lòng đăng nhập để đặt lịch xét nghiệm',
        confirmButtonText: 'Đăng nhập ngay',
        confirmButtonColor: '#3085d6',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { state: { redirectTo: '/appointment' } });
        }
      });
    } else {
      // Nếu đã đăng nhập, chuyển đến trang appointment với serviceId
      navigate('/appointment', { state: { selectedService: serviceId } });
    }
  };

  // Get featured services from each category
  const featuredAdminServices = services
    .filter(service => {
      const serviceType = getServiceTypeFromCategory(service.category);
      const isFeatured = service.featured === true;
      // Chỉ log khi cần debug
      if (process.env.NODE_ENV === 'development') {
        console.log(`Service ${service.title}: featured=${service.featured}, type=${serviceType}, isFeatured=${isFeatured}`);
      }
      return serviceType === 'administrative' && isFeatured;
    })
    .slice(0, 2);
  
  const featuredCivilServices = services
    .filter(service => {
      const serviceType = getServiceTypeFromCategory(service.category);
      const isFeatured = service.featured === true;
      // Chỉ log khi cần debug
      if (process.env.NODE_ENV === 'development') {
        console.log(`Service ${service.title}: featured=${service.featured}, type=${serviceType}, isFeatured=${isFeatured}`);
      }
      return serviceType === 'civil' && isFeatured;
    })
    .slice(0, 2);

  // Debug information - chỉ log một lần
  if (process.env.NODE_ENV === 'development') {
    console.log('Featured Admin Services:', featuredAdminServices);
    console.log('Featured Civil Services:', featuredCivilServices);

    const totalServices = services.length;
    const featuredServices = services.filter(service => service.featured === true).length;
    const adminServices = services.filter(service => getServiceTypeFromCategory(service.category) === 'administrative').length;
    const civilServices = services.filter(service => getServiceTypeFromCategory(service.category) === 'civil').length;
    
    console.log(`Total services: ${totalServices}`);
    console.log(`Featured services: ${featuredServices}`);
    console.log(`Admin services: ${adminServices}`);
    console.log(`Civil services: ${civilServices}`);
  }

  // Process workflow data
  const workflows = {
    civilWorkflow: [
      { step: 1, title: 'Chọn dịch vụ ADN dân sự', description: 'Tìm hiểu huyết thống cho mục đích cá nhân', icon: 'bi-person-hearts' },
      { step: 2, title: 'Chọn phương thức lấy mẫu', description: 'Tự lấy mẫu tại nhà hoặc nhân viên hỗ trợ', icon: 'bi-house' },
      { step: 3, title: 'Thu thập mẫu ADN', description: 'Lấy mẫu theo hướng dẫn chi tiết', icon: 'bi-droplet' },
      { step: 4, title: 'Phân tích tại phòng lab', description: 'Sử dụng công nghệ hiện đại', icon: 'bi-eye' },
      { step: 5, title: 'Nhận kết quả online', description: 'Xem kết quả sau 5-7 ngày', icon: 'bi-file-earmark-check' }
    ],
    administrativeWorkflow: [
      { step: 1, title: 'Chọn dịch vụ ADN hành chính', description: 'Phục vụ thủ tục pháp lý', icon: 'bi-award' },
      { step: 2, title: 'Đặt lịch tại cơ sở', description: 'Bắt buộc thu mẫu có giám sát', icon: 'bi-calendar-check' },
      { step: 3, title: 'Thu mẫu có giám sát', description: 'Đảm bảo tính chính xác và pháp lý', icon: 'bi-shield-check' },
      { step: 4, title: 'Phân tích và công chứng', description: 'Theo tiêu chuẩn pháp lý', icon: 'bi-clipboard-check' },
      { step: 5, title: 'Nhận báo cáo có giá trị pháp lý', description: 'Sử dụng cho thủ tục hành chính', icon: 'bi-file-earmark-ruled' }
    ]
  };

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Chị Nguyễn Thị Lan',
      location: 'Hà Nội',
      rating: 5,
      comment: 'Dịch vụ xét nghiệm ADN khai sinh rất chuyên nghiệp. Kết quả chính xác và được cơ quan nhà nước công nhận.',
      service: 'ADN khai sinh',
      serviceType: 'administrative'
    },
    {
      id: 2,
      name: 'Anh Trần Văn Minh',
      location: 'TP.HCM',
      rating: 5,
      comment: 'Tự lấy mẫu tại nhà rất tiện lợi. Kit được hướng dẫn chi tiết, dễ thực hiện.',
      service: 'ADN huyết thống',
      serviceType: 'civil'
    },
    {
      id: 3,
      name: 'Chị Lê Thị Hoa',
      location: 'Đà Nẵng',
      rating: 5,
      comment: 'Xét nghiệm ADN trước sinh an toàn, không đau. Kết quả nhanh và chính xác.',
      service: 'ADN trước sinh',
      serviceType: 'civil'
    }
  ];

  // Why choose us data
  const whyChooseUs = [
    {
      icon: 'bi-shield-check',
      title: 'Độ chính xác cao',
      description: 'Công nghệ hiện đại với độ chính xác lên đến 99.999%'
    },
    {
      icon: 'bi-clock',
      title: 'Nhanh chóng',
      description: 'ADN dân sự: 5-7 ngày, ADN hành chính: 3-5 ngày'
    },
    {
      icon: 'bi-lock',
      title: 'Bảo mật tuyệt đối',
      description: 'Thông tin cá nhân và kết quả được bảo mật nghiêm ngặt'
    },
    {
      icon: 'bi-award',
      title: 'Giá trị pháp lý',
      description: 'ADN hành chính được công nhận bởi tòa án và cơ quan nhà nước'
    }
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <i
        key={index}
        className={`bi bi-star${index < rating ? '-fill' : ''} text-warning`}
      />
    ));
  };

  const getServiceTypeBadge = (serviceType) => {
    return serviceType === 'administrative' 
      ? <Badge bg="warning" text="dark" style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: '500' }}>ADN Hành chính</Badge>
      : <Badge bg="success" style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: '500' }}>ADN Dân sự</Badge>;
  };

  const getMethodBadges = (serviceId) => {
    const serviceMethodsList = serviceMethods[serviceId] || [];
    
    if (serviceMethodsList.length === 0) {
      return (
        <Badge bg="secondary" style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: '500' }}>
          <i className="bi bi-gear me-1"></i>
          Đang cập nhật
        </Badge>
      );
    }
    
    // Enrich methods với icon và color từ METHOD_MAPPING
    const enrichedMethods = enrichMethodData(serviceMethodsList);
    
    return enrichedMethods.map(method => (
      <Badge 
        key={method.id} 
        bg={method.color || 'secondary'} 
        className="me-2 mb-2"
        style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: '500' }}
      >
        <i className={`${method.icon || 'bi-gear'} me-1`}></i>
        {method.name}
      </Badge>
    ));
  };

  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Đang tải trang chủ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <div className="alert alert-danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </div>
      </Container>
    );
  }

  return (
    <>
      {/* Enhanced Hero Section */}
      <section className="position-relative overflow-hidden" style={styles.heroSection}>
        <Container className="position-relative">
          <Row className="align-items-center" style={styles.minVh75}>
            <Col lg={6} className="text-white">
              <Badge bg="success" className="mb-3 px-3 py-2">
                <i className="bi bi-shield-check me-2"></i>
                Đạt chuẩn ISO 15189
              </Badge>
              <h1 className="display-4 fw-bold mb-4">
                ADN LAB -  TRUNG TÂM XÉT NGHIỆM <span className="text-warning">ADN</span>
              </h1>
              <p className="lead mb-4">
                Công nghệ tiên tiến - Kết quả chính xác 99.999% - Bảo mật tuyệt đối
                <br />
                <strong>ADN Dân sự:</strong> Thuận tiện, riêng tư | <strong>ADN Hành chính:</strong> Có giá trị pháp lý
              </p>
              <Row className="g-3 mb-4">
                <Col sm={6}>
                  <Button size="lg" variant="warning" as={Link} to="/services" className="w-100">
                    <i className="bi bi-grid me-2"></i>
                    Xem tất cả dịch vụ
                  </Button>
                </Col>
                <Col sm={6}>
                  <Button size="lg" variant="outline-light" as={Link} to="/appointment" className="w-100">
                    <i className="bi bi-calendar-plus me-2"></i>
                    Đặt lịch ngay
                  </Button>
                </Col>
              </Row>
              <Row className="mt-4 text-center text-lg-start">
                <Col xs={4} className="mb-3">
                  <div className="h4 mb-1 text-warning fw-bold">10,000+</div>
                  <small className="d-block">Khách hàng tin tưởng</small>
                </Col>
                <Col xs={4} className="mb-3">
                  <div className="h4 mb-1 text-warning fw-bold">99.999%</div>
                  <small className="d-block">Độ chính xác</small>
                </Col>
                <Col xs={4} className="mb-3">
                  <div className="h4 mb-1 text-warning fw-bold">24/7</div>
                  <small className="d-block">Hỗ trợ khách hàng</small>
                </Col>
              </Row>
            </Col>
            <Col lg={6} className="text-center">
              <div className="hero-image">
                <img 
                  src="https://firebasestorage.googleapis.com/v0/b/su25-swp391-g8.firebasestorage.app/o/process-thumb.png?alt=media&token=4bcf6823-6ce1-44b6-8622-b265d7d32a12" 
                  alt="DNA Testing" 
                  className="img-fluid"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Quick Contact Section */}
      <section className="text-white py-4" style={styles.quickBookingSection}>
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h5 className="mb-0">
                <i className="bi bi-telephone me-2"></i>
                Cần tư vấn chọn dịch vụ phù hợp? Gọi ngay hotline: 
                <strong className="ms-2">1900 1234</strong>
              </h5>
            </Col>
            <Col md={4} className="text-md-end mt-3 mt-md-0">
              <Button variant="light" size="lg">
                <i className="bi bi-chat-dots me-2"></i>
                Chat với chuyên gia
              </Button>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Service Comparison Section */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold">So sánh loại hình xét nghiệm ADN</h2>
            <p className="lead text-muted">Chọn loại dịch vụ phù hợp với nhu cầu của bạn</p>
          </div>

          <Row className="mb-5">
            <Col lg={6} className="mb-4">
              <Card className="h-100 border-success shadow-sm">
                <Card.Header className="bg-success text-white text-center py-4">
                  <i className="bi bi-house fs-1 mb-3 d-block"></i>
                  <h3 className="mb-2">ADN Dân sự</h3>
                  <Badge bg="light" text="dark" className="fs-6">Mục đích cá nhân</Badge>
                </Card.Header>
                <Card.Body className="p-4">
                  <div className="mb-4">
                    <h5 className="text-success mb-3">Đặc điểm:</h5>
                    <ul className="list-unstyled">
                      <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Tự lấy mẫu tại nhà được</li>
                      <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Bảo mật và riêng tư cao</li>
                      <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Thuận tiện và nhanh chóng</li>
                      <li className="mb-2"><i className="bi bi-check-circle text-success me-2"></i>Giá thành hợp lý</li>
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h6 className="text-success mb-3">Phù hợp cho:</h6>
                    <ul className="small text-muted">
                      <li>Tìm hiểu quan hệ huyết thống cá nhân</li>
                      <li>Nghiên cứu nguồn gốc gia đình</li>
                      <li>Phân tích đặc điểm di truyền</li>
                      <li>Xét nghiệm riêng tư, kín đáo</li>
                    </ul>
                  </div>

                  <div className="text-center">
                    <Button variant="success" as={Link} to="/services?type=civil" className="me-2">
                      Xem dịch vụ dân sự
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6} className="mb-4">
              <Card className="h-100 border-warning shadow-sm">
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
                      <li className="mb-2"><i className="bi bi-check-circle text-warning me-2"></i>Thu mẫu có giám sát nghiêm ngặt</li>
                      <li className="mb-2"><i className="bi bi-check-circle text-warning me-2"></i>Tuân thủ tiêu chuẩn quốc tế</li>
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

                  <div className="text-center">
                    <Button variant="warning" as={Link} to="/services?type=administrative" className="me-2">
                      Xem dịch vụ hành chính
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Process Workflow Section */}
      <section className="py-5" style={styles.workflowSection}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold">Quy trình xét nghiệm</h2>
            <p className="lead text-muted">Hai quy trình khác nhau phù hợp với từng nhu cầu</p>
          </div>

          <Row>
            {/* Civil Workflow */}
            <Col lg={6} className="mb-5">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Header className="bg-success text-white text-center py-3">
                  <h4 className="mb-0">
                    <i className="bi bi-house me-2"></i>
                    Quy trình ADN Dân sự
                  </h4>
                  <small>Linh hoạt - Tiện lợi - Riêng tư</small>
                </Card.Header>
                <Card.Body>
                  {workflows.civilWorkflow.map((step, index) => (
                    <div key={step.step} className="d-flex align-items-start mb-3">
                      <div className="bg-success text-white rounded-circle d-flex align-items-center justify-content-center me-3" style={styles.stepNumber}>
                        {step.step}
                      </div>
                      <div>
                        <h6 className="mb-1">
                          <i className={`${step.icon} me-2 text-success`}></i>
                          {step.title}
                        </h6>
                        <p className="text-muted small mb-0">{step.description}</p>
                      </div>
                    </div>
                  ))}
                  <div className="text-center mt-4">
                    <Badge bg="success" className="px-3 py-2">
                      Thời gian: 5-7 ngày | Từ 3.5 triệu VNĐ
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* Administrative Workflow */}
            <Col lg={6} className="mb-5">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Header className="bg-warning text-dark text-center py-3">
                  <h4 className="mb-0">
                    <i className="bi bi-award me-2"></i>
                    Quy trình ADN Hành chính
                  </h4>
                  <small>Pháp lý - Chính xác - Uy tín</small>
                </Card.Header>
                <Card.Body>
                  {workflows.administrativeWorkflow.map((step, index) => (
                    <div key={step.step} className="d-flex align-items-start mb-3">
                      <div className="bg-warning text-dark rounded-circle d-flex align-items-center justify-content-center me-3" style={styles.stepNumber}>
                        {step.step}
                      </div>
                      <div>
                        <h6 className="mb-1">
                          <i className={`${step.icon} me-2 text-warning`}></i>
                          {step.title}
                        </h6>
                        <p className="text-muted small mb-0">{step.description}</p>
                      </div>
                    </div>
                  ))}
                  <div className="text-center mt-4">
                    <Badge bg="warning" text="dark" className="px-3 py-2">
                      Thời gian: 3-5 ngày | Từ 4.2 triệu VNĐ
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Featured Services Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold">Dịch vụ nổi bật</h2>
            <p className="lead text-muted">Các dịch vụ được khách hàng lựa chọn nhiều nhất</p>
          </div>

          {/* Administrative Services */}
          {featuredAdminServices.length > 0 && (
            <div className="mb-5">
              <h3 className="mb-4">
                <i className="bi bi-award text-warning me-2"></i>
                Dịch vụ ADN Hành chính
                <Badge bg="warning" text="dark" className="ms-2">Có giá trị pháp lý</Badge>
              </h3>
              <Row>
                {featuredAdminServices.map(service => (
                  <Col key={service.id} lg={6} className="mb-4">
                    <Card 
                      className="h-100 border-0 shadow-sm" 
                      style={{
                        ...styles.serviceCardAdmin,
                        ...(hoveredService === service.id ? styles.serviceCardAdminHover : {})
                      }}
                      onMouseEnter={() => setHoveredService(service.id)}
                      onMouseLeave={() => setHoveredService(null)}
                    >
                      <Card.Header className="bg-warning text-dark text-center py-3">
                        <h5 className="mb-0 fw-bold">{service.title}</h5>
                        <Badge bg="dark" className="mt-2">Có giá trị pháp lý</Badge>
                      </Card.Header>
                      <Card.Body>
                        <Card.Text className="mb-3">{service.description}</Card.Text>
                        <div className="text-center mb-3">
                          <div className="text-warning fw-bold h5">{formatPrice(service.price)}</div>
                        </div>
                        <div className="mb-3 text-center">
                          <Badge bg="light" text="dark">
                            <i className="bi bi-clock me-1"></i>{service.duration}
                          </Badge>
                        </div>
                        <div className="mb-3">
                          <small className="text-muted d-block mb-2">Phương thức lấy mẫu:</small>
                          <div className="d-flex flex-wrap gap-1 justify-content-center">
                            {getMethodBadges(service.id)}
                          </div>
                        </div>
                        <div className="d-grid gap-2">
                          <Button variant="outline-warning" as={Link} to={`/services/${encodeURIComponent(service.id)}`}>
                            Xem chi tiết
                          </Button>
                          <Button 
                            variant="warning" 
                            onClick={(e) => handleBookingClick(e, service.id)}
                          >
                            Đặt lịch ngay
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* Civil Services */}
          {featuredCivilServices.length > 0 && (
            <div>
              <h3 className="mb-4">
                <i className="bi bi-house text-success me-2"></i>
                Dịch vụ ADN Dân sự
                <Badge bg="success" className="ms-2">Linh hoạt - Riêng tư</Badge>
              </h3>
              <Row>
                {featuredCivilServices.map(service => (
                  <Col key={service.id} lg={6} className="mb-4">
                    <Card 
                      className="h-100 border-0 shadow-sm" 
                      style={{
                        ...styles.serviceCardCivil,
                        ...(hoveredService === service.id ? styles.serviceCardCivilHover : {})
                      }}
                      onMouseEnter={() => setHoveredService(service.id)}
                      onMouseLeave={() => setHoveredService(null)}
                    >
                      <Card.Header className="bg-success text-white text-center py-3">
                        <h5 className="mb-0 fw-bold">{service.title}</h5>
                        <Badge bg="light" text="dark" className="mt-2">Mục đích cá nhân</Badge>
                      </Card.Header>
                      <Card.Body>
                        <Card.Text className="mb-3">{service.description}</Card.Text>
                        <div className="text-center mb-3">
                          <div className="text-success fw-bold h5">{formatPrice(service.price)}</div>
                        </div>
                        <div className="mb-3 text-center">
                          <Badge bg="light" text="dark">
                            <i className="bi bi-clock me-1"></i>{service.duration}
                          </Badge>
                        </div>
                        <div className="mb-3">
                          <small className="text-muted d-block mb-2">Phương thức lấy mẫu:</small>
                          <div className="d-flex flex-wrap gap-1 justify-content-center">
                            {getMethodBadges(service.id)}
                          </div>
                        </div>
                        <div className="d-grid gap-2">
                          <Button variant="outline-success" as={Link} to={`/services/${encodeURIComponent(service.id)}`}>
                            Xem chi tiết
                          </Button>
                          <Button 
                            variant="success" 
                            onClick={(e) => handleBookingClick(e, service.id)}
                          >
                            Đặt lịch ngay
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>
          )}

          {/* No featured services message */}
          {featuredAdminServices.length === 0 && featuredCivilServices.length === 0 && (
            <div className="text-center py-5">
              <div className="alert alert-info">
                <i className="bi bi-info-circle fs-1 mb-3 d-block"></i>
                <h4>Chưa có dịch vụ nổi bật</h4>
                <p className="mb-3">Hãy xem tất cả dịch vụ của chúng tôi</p>
                <Button variant="primary" as={Link} to="/services">
                  <i className="bi bi-grid-3x3-gap me-2"></i>
                  Xem tất cả dịch vụ
                </Button>
              </div>
            </div>
          )}

          <div className="text-center mt-5">
            <Button size="lg" variant="primary" as={Link} to="/services">
              <i className="bi bi-grid-3x3-gap me-2"></i>
              Xem tất cả dịch vụ
            </Button>
          </div>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold">Tại sao chọn chúng tôi?</h2>
            <p className="lead text-muted">Những ưu điểm vượt trội của trung tâm</p>
          </div>

          <Row>
            {whyChooseUs.map((item, index) => (
              <Col key={index} lg={3} md={6} className="mb-4">
                <Card className="text-center border-0 h-100" style={styles.testimonialCard}>
                  <Card.Body>
                    <div className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center" style={styles.featureIcon}>
                      <i className={`${item.icon} text-primary fs-2`}></i>
                    </div>
                    <Card.Title>{item.title}</Card.Title>
                    <Card.Text className="text-muted">{item.description}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold">Khách hàng nói về chúng tôi</h2>
            <p className="lead text-muted">Phản hồi từ khách hàng đã sử dụng dịch vụ</p>
          </div>

          <Row>
            {testimonials.map(testimonial => (
              <Col key={testimonial.id} lg={4} md={6} className="mb-4">
                <Card className="border-0 shadow-sm h-100" style={styles.testimonialCard}>
                  <Card.Body>
                    <div className="mb-3">
                      {renderStars(testimonial.rating)}
                    </div>
                    <Card.Text className="fst-italic mb-3">
                      "{testimonial.comment}"
                    </Card.Text>
                    <div className="d-flex align-items-center">
                      <div className="bg-primary rounded-circle d-flex align-items-center justify-content-center me-3" style={{width: '50px', height: '50px'}}>
                        <i className="bi bi-person text-white fs-4"></i>
                      </div>
                      <div>
                        <div className="fw-bold">{testimonial.name}</div>
                        <small className="text-muted">{testimonial.location}</small>
                        <div className="small">
                          <span className="text-primary">{testimonial.service}</span>
                          <span className="ms-2">
                            {getServiceTypeBadge(testimonial.serviceType)}
                          </span>
                        </div>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="text-white py-5" style={styles.ctaSection}>
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h2 className="display-6 fw-bold mb-3">Sẵn sàng bắt đầu xét nghiệm ADN?</h2>
              <p className="lead mb-0">
                Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn 24/7
              </p>
            </Col>
            <Col lg={4} className="text-lg-end mt-4 mt-lg-0">
              <div className="d-grid gap-2">
                <Button size="lg" variant="light" as={Link} to="/appointment">
                  <i className="bi bi-calendar-plus me-2"></i>
                  Đặt lịch ngay
                </Button>
                <Button size="lg" variant="outline-light">
                  <i className="bi bi-telephone me-2"></i>
                  Gọi tư vấn: 1900 1234
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </>
  );
};

export default Home;