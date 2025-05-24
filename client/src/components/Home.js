import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge } from 'react-bootstrap';

const Home = () => {
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
      borderLeft: '4px solid transparent'
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

  // Enhanced services data with categories
  const services = {
    civilDNA: [
      {
        id: 1,
        title: 'Xét nghiệm ADN huyết thống cha-con',
        description: 'Xác định mối quan hệ huyết thống với độ chính xác 99.999%',
        price: '3.500.000 VNĐ',
        image: 'https://via.placeholder.com/300x200',
        selfSample: true,
        icon: 'bi-people'
      },
      {
        id: 3,
        title: 'Xét nghiệm ADN thai nhi',
        description: 'Phương pháp an toàn cho mẹ và bé từ tuần thứ 8',
        price: '5.500.000 VNĐ',
        image: 'https://via.placeholder.com/300x200',
        selfSample: false,
        icon: 'bi-heart'
      }
    ],
    administrativeDNA: [
      {
        id: 2,
        title: 'Xét nghiệm ADN khai sinh',
        description: 'Phục vụ thủ tục hành chính, có giá trị pháp lý',
        price: '4.200.000 VNĐ',
        image: 'https://via.placeholder.com/300x200',
        selfSample: false,
        icon: 'bi-file-earmark-text'
      },
      {
        id: 8,
        title: 'Xét nghiệm ADN di trú',
        description: 'Phục vụ thủ tục bảo lãnh, nhập quốc tịch',
        price: '5.800.000 VNĐ',
        image: 'https://via.placeholder.com/300x200',
        selfSample: false,
        icon: 'bi-globe'
      }
    ]
  };

  // Process workflow data
  const workflows = {
    selfSample: [
      { step: 1, title: 'Đặt hẹn online', description: 'Chọn dịch vụ và đặt lịch hẹn', icon: 'bi-calendar-check' },
      { step: 2, title: 'Nhận bộ kit', description: 'Nhận kit xét nghiệm tại nhà', icon: 'bi-box' },
      { step: 3, title: 'Thu thập mẫu', description: 'Tự thu mẫu theo hướng dẫn', icon: 'bi-droplet' },
      { step: 4, title: 'Gửi mẫu', description: 'Chuyển mẫu đến phòng lab', icon: 'bi-send' },
      { step: 5, title: 'Nhận kết quả', description: 'Xem kết quả online sau 3-5 ngày', icon: 'bi-file-earmark-check' }
    ],
    atFacility: [
      { step: 1, title: 'Đặt hẹn online', description: 'Chọn dịch vụ và thời gian phù hợp', icon: 'bi-calendar-check' },
      { step: 2, title: 'Đến cơ sở y tế', description: 'Nhân viên thu mẫu chuyên nghiệp', icon: 'bi-hospital' },
      { step: 3, title: 'Xét nghiệm', description: 'Phân tích mẫu tại phòng lab', icon: 'bi-eye' },
      { step: 4, title: 'Nhận kết quả', description: 'Kết quả có giá trị pháp lý', icon: 'bi-award' }
    ]
  };

  // Testimonials data
  const testimonials = [
    {
      id: 1,
      name: 'Chị Nguyễn Thị Lan',
      location: 'Hà Nội',
      rating: 5,
      comment: 'Dịch vụ chuyên nghiệp, kết quả chính xác. Nhân viên tư vấn rất nhiệt tình.',
      service: 'Xét nghiệm ADN huyết thống'
    },
    {
      id: 2,
      name: 'Anh Trần Văn Minh',
      location: 'TP.HCM',
      rating: 5,
      comment: 'Quy trình nhanh gọn, bảo mật tốt. Rất hài lòng với dịch vụ.',
      service: 'Xét nghiệm ADN khai sinh'
    },
    {
      id: 3,
      name: 'Chị Lê Thị Hoa',
      location: 'Đà Nẵng',
      rating: 5,
      comment: 'Kit tự lấy mẫu rất tiện lợi, hướng dẫn chi tiết, dễ thực hiện.',
      service: 'Xét nghiệm ADN thai nhi'
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
      description: 'Kết quả trong 3-5 ngày làm việc, có dịch vụ khẩn cấp 24h'
    },
    {
      icon: 'bi-lock',
      title: 'Bảo mật tuyệt đối',
      description: 'Thông tin cá nhân và kết quả được bảo mật nghiêm ngặt'
    },
    {
      icon: 'bi-award',
      title: 'Giá trị pháp lý',
      description: 'Kết quả được công nhận và có giá trị pháp lý đầy đủ'
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
                Trung tâm Xét nghiệm <span className="text-warning">ADN</span> Hàng đầu
              </h1>
              <p className="lead mb-4">
                Công nghệ tiên tiến - Kết quả chính xác 99.999% - Bảo mật tuyệt đối
                <br />
                Phục vụ cả xét nghiệm dân sự và hành chính
              </p>
              <Row className="g-3 mb-4">
                <Col sm={6}>
                  <Button size="lg" variant="warning" as={Link} to="/services" className="w-100">
                    <i className="bi bi-calendar-plus me-2"></i>
                    Đặt lịch xét nghiệm
                  </Button>
                </Col>
                <Col sm={6}>
                  <Button size="lg" variant="outline-light" as={Link} to="/about" className="w-100">
                    <i className="bi bi-play-circle me-2"></i>
                    Tìm hiểu thêm
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
                  src="https://via.placeholder.com/500x400/ffffff/667eea?text=DNA+Testing" 
                  alt="DNA Testing" 
                  className="img-fluid rounded-4 shadow-lg"
                />
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Quick Booking Section */}
      <section className="text-white py-4" style={styles.quickBookingSection}>
        <Container>
          <Row className="align-items-center">
            <Col md={8}>
              <h5 className="mb-0">
                <i className="bi bi-telephone me-2"></i>
                Cần tư vấn khẩn cấp? Gọi ngay hotline: 
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

      {/* Process Workflow Section */}
      <section className="py-5" style={styles.workflowSection}>
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold">Quy trình xét nghiệm</h2>
            <p className="lead text-muted">Chúng tôi cung cấp 2 hình thức xét nghiệm linh hoạt</p>
          </div>

          <Row>
            {/* Self Sample Workflow */}
            <Col lg={6} className="mb-5">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Header className="bg-success text-white text-center py-3">
                  <h4 className="mb-0">
                    <i className="bi bi-house me-2"></i>
                    Xét nghiệm ADN Dân sự - Tự thu mẫu
                  </h4>
                  <small>Tiện lợi, bảo mật, phù hợp xét nghiệm cá nhân</small>
                </Card.Header>
                <Card.Body>
                  {workflows.selfSample.map((step, index) => (
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
                      Thời gian: 5-7 ngày | Giá: Từ 3.5 triệu VNĐ
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            {/* At Facility Workflow */}
            <Col lg={6} className="mb-5">
              <Card className="h-100 border-0 shadow-sm">
                <Card.Header className="bg-warning text-dark text-center py-3">
                  <h4 className="mb-0">
                    <i className="bi bi-hospital me-2"></i>
                    Xét nghiệm ADN Hành chính - Tại cơ sở
                  </h4>
                  <small>Có giá trị pháp lý, phục vụ thủ tục hành chính</small>
                </Card.Header>
                <Card.Body>
                  {workflows.atFacility.map((step, index) => (
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
                      Thời gian: 3-5 ngày | Giá: Từ 4.2 triệu VNĐ
                    </Badge>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Enhanced Services Section */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold">Dịch vụ xét nghiệm ADN</h2>
            <p className="lead text-muted">Đa dạng dịch vụ phù hợp với mọi nhu cầu</p>
          </div>

          {/* Civil DNA Services */}
          <div className="mb-5">
            <h3 className="mb-4">
              <i className="bi bi-house text-success me-2"></i>
              Xét nghiệm ADN Dân sự
              <Badge bg="success" className="ms-2">Tự thu mẫu</Badge>
            </h3>
            <Row>
              {services.civilDNA.map(service => (
                <Col key={service.id} md={6} className="mb-4">
                  <Card className="h-100 border-0 shadow-sm" style={styles.serviceCard}>
                    <Card.Body>
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3" style={styles.serviceIcon}>
                          <i className={`${service.icon} text-success fs-4`}></i>
                        </div>
                        <div>
                          <Card.Title className="mb-1">{service.title}</Card.Title>
                          <div className="text-success fw-bold">{service.price}</div>
                        </div>
                      </div>
                      <Card.Text>{service.description}</Card.Text>
                      <div className="mb-3">
                        <Badge bg="success" className="me-2">
                          <i className="bi bi-house me-1"></i>Tự thu mẫu tại nhà
                        </Badge>
                      </div>
                      <Button variant="outline-success" as={Link} to={`/services/${service.id}`} className="w-100">
                        Đặt lịch ngay
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          {/* Administrative DNA Services */}
          <div>
            <h3 className="mb-4">
              <i className="bi bi-hospital text-warning me-2"></i>
              Xét nghiệm ADN Hành chính
              <Badge bg="warning" text="dark" className="ms-2">Có giá trị pháp lý</Badge>
            </h3>
            <Row>
              {services.administrativeDNA.map(service => (
                <Col key={service.id} md={6} className="mb-4">
                  <Card className="h-100 border-0 shadow-sm" style={styles.serviceCard}>
                    <Card.Body>
                      <div className="d-flex align-items-center mb-3">
                        <div className="bg-warning bg-opacity-10 rounded-circle p-3 me-3" style={styles.serviceIcon}>
                          <i className={`${service.icon} text-warning fs-4`}></i>
                        </div>
                        <div>
                          <Card.Title className="mb-1">{service.title}</Card.Title>
                          <div className="text-warning fw-bold">{service.price}</div>
                        </div>
                      </div>
                      <Card.Text>{service.description}</Card.Text>
                      <div className="mb-3">
                        <Badge bg="warning" text="dark" className="me-2">
                          <i className="bi bi-award me-1"></i>Giá trị pháp lý
                        </Badge>
                      </div>
                      <Button variant="outline-warning" as={Link} to={`/services/${service.id}`} className="w-100">
                        Đặt lịch ngay
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
          </div>

          <div className="text-center mt-5">
            <Button size="lg" variant="primary" as={Link} to="/services">
              <i className="bi bi-grid-3x3-gap me-2"></i>
              Xem tất cả dịch vụ
            </Button>
          </div>
        </Container>
      </section>

      {/* Why Choose Us Section */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold">Tại sao chọn chúng tôi?</h2>
            <p className="lead text-muted">Những ưu điểm vượt trội của trung tâm</p>
          </div>

          <Row>
            {whyChooseUs.map((item, index) => (
              <Col key={index} md={3} sm={6} className="mb-4">
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
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold">Khách hàng nói về chúng tôi</h2>
            <p className="lead text-muted">Hơn 10,000 khách hàng đã tin tưởng sử dụng dịch vụ</p>
          </div>

          <Row>
            {testimonials.map(testimonial => (
              <Col key={testimonial.id} md={4} className="mb-4">
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
                        <div className="small text-primary">{testimonial.service}</div>
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