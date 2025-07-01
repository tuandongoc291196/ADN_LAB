import React from 'react';
import { Container, Row, Col, Card, Button, Badge, Accordion, ProgressBar } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const About = () => {
  // Dữ liệu thống kê công ty (stats)
  const stats = [
    { icon: 'bi-award', number: '10,000+', label: 'Khách hàng tin tưởng', color: 'primary' },
    { icon: 'bi-calendar-check', number: '15+', label: 'Năm kinh nghiệm', color: 'success' },
    { icon: 'bi-shield-check', number: '99.999%', label: 'Độ chính xác', color: 'warning' },
    { icon: 'bi-building', number: '5+', label: 'Cơ sở toàn quốc', color: 'info' }
  ];

  // Dữ liệu đội ngũ lãnh đạo (leadership)
  const leadership = [
    {
      id: 1,
      name: 'TS. BS. Nguyễn Văn Minh',
      position: 'Giám đốc khoa học',
      image: 'https://via.placeholder.com/200x200/007bff/ffffff?text=GĐ',
      description: 'Tiến sĩ Y khoa với 20 năm kinh nghiệm trong lĩnh vực di truyền học',
      credentials: ['Tiến sĩ Y khoa - Đại học Y Hà Nội', 'Chứng chỉ di truyền học - Johns Hopkins', 'Thành viên Hội Di truyền học Việt Nam']
    },
    {
      id: 2,
      name: 'ThS. Trần Thị Lan',
      position: 'Trưởng phòng Lab',
      image: 'https://via.placeholder.com/200x200/28a745/ffffff?text=TP',
      description: 'Thạc sĩ Sinh học phân tử chuyên về công nghệ xét nghiệm ADN',
      credentials: ['Thạc sĩ Sinh học phân tử - ĐH Quốc gia HN', 'Chứng chỉ ISO 15189', '15 năm kinh nghiệm phân tích ADN']
    },
    {
      id: 3,
      name: 'ThS. Lê Văn Đức',
      position: 'Giám đốc vận hành',
      image: 'https://via.placeholder.com/200x200/ffc107/000000?text=GĐ',
      description: 'Thạc sĩ Quản trị kinh doanh với chuyên môn về dịch vụ y tế',
      credentials: ['Thạc sĩ Quản trị - ĐH Kinh tế Quốc dân', 'Chứng chỉ Quản lý chất lượng', '12 năm kinh nghiệm quản lý y tế']
    }
  ];

  // Dữ liệu chứng nhận, tiêu chuẩn (certifications)
  const certifications = [
    {
      name: 'ISO 15189:2012',
      description: 'Tiêu chuẩn quốc tế về phòng xét nghiệm y khoa',
      icon: 'bi-patch-check',
      color: 'success'
    },
    {
      name: 'Bộ Y tế',
      description: 'Giấy phép hoạt động xét nghiệm y khoa',
      icon: 'bi-shield-check',
      color: 'primary'
    },
    {
      name: 'AABB Standard',
      description: 'Tiêu chuẩn Mỹ về xét nghiệm quan hệ huyết thống',
      icon: 'bi-award',
      color: 'warning'
    },
    {
      name: 'CAP Accreditation',
      description: 'Chứng nhận từ Hiệp hội Bác sĩ Giải phẫu bệnh Mỹ',
      icon: 'bi-star',
      color: 'info'
    }
  ];

  // Dữ liệu công nghệ nổi bật (technologies)
  const technologies = [
    {
      name: 'STR Analysis',
      description: 'Phân tích chuỗi lặp ngắn, độ chính xác cao nhất hiện nay',
      progress: 100
    },
    {
      name: 'Real-time PCR',
      description: 'Công nghệ khuếch đại ADN thời gian thực',
      progress: 95
    },
    {
      name: 'Capillary Electrophoresis',
      description: 'Điện di mao quản phân tích fragment ADN',
      progress: 98
    },
    {
      name: 'Next-Gen Sequencing',
      description: 'Giải trình tự thế hệ mới cho phân tích sâu',
      progress: 90
    }
  ];

  // Dữ liệu các cột mốc phát triển (milestones)
  const milestones = [
    {
      year: '2008',
      title: 'Thành lập ADN LAB',
      description: 'Khởi đầu với đội ngũ 5 chuyên gia và phòng lab đầu tiên tại Hà Nội'
    },
    {
      year: '2012',
      title: 'Mở rộng dịch vụ',
      description: 'Bổ sung dịch vụ ADN trước sinh và ADN pháp lý có giá trị hành chính'
    },
    {
      year: '2015',
      title: 'Đạt chuẩn ISO 15189',
      description: 'Trở thành trung tâm đầu tiên tại VN đạt tiêu chuẩn quốc tế về xét nghiệm y khoa'
    },
    {
      year: '2018',
      title: 'Mở rộng toàn quốc',
      description: 'Khai trương chi nhánh TP.HCM và Đà Nẵng, phục vụ khách hàng cả nước'
    },
    {
      year: '2020',
      title: 'Công nghệ 4.0',
      description: 'Ứng dụng AI và automation trong quy trình phân tích, nâng cao độ chính xác'
    },
    {
      year: '2023',
      title: 'Dịch vụ online',
      description: 'Ra mắt nền tảng đặt lịch và tra cứu kết quả trực tuyến 24/7'
    }
  ];

  return (
    <div>
      {/* Hero Section: Tiêu đề, mô tả, CTA */}
      <section className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">
                Về ADN LAB
              </h1>
              <p className="lead mb-4">
                Trung tâm xét nghiệm ADN hàng đầu Việt Nam với 15 năm kinh nghiệm, 
                phục vụ hơn 10,000 khách hàng với độ chính xác 99.999% và 
                công nghệ tiên tiến nhất thế giới.
              </p>
              <div className="d-flex gap-3 flex-wrap">
                <Button variant="warning" size="lg" as={Link} to="/services">
                  <i className="bi bi-grid me-2"></i>
                  Xem dịch vụ
                </Button>
                <Button variant="outline-light" size="lg" as={Link} to="/appointment">
                  <i className="bi bi-calendar-plus me-2"></i>
                  Đặt lịch ngay
                </Button>
              </div>
            </Col>
            <Col lg={4} className="text-center">
              <img 
                src="https://firebasestorage.googleapis.com/v0/b/su25-swp391-g8.firebasestorage.app/o/logo_white.png?alt=media&token=44fdd000-d567-4b01-b3b0-590270b573e9" 
                alt="ADN LAB" 
                className="img-fluid"
              />
            </Col>
          </Row>
        </Container>
      </section>

      {/* Stats Section: Thống kê nổi bật */}
      <section className="py-5 bg-light">
        <Container>
          <Row>
            {stats.map((stat, index) => (
              <Col key={index} lg={3} md={6} className="mb-4">
                <Card className="text-center border-0 h-100 shadow-sm">
                  <Card.Body>
                    <div className={`bg-${stat.color} bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center`} 
                         style={{ width: '80px', height: '80px' }}>
                      <i className={`${stat.icon} text-${stat.color} fs-1`}></i>
                    </div>
                    <h3 className={`text-${stat.color} fw-bold`}>{stat.number}</h3>
                    <p className="text-muted mb-0">{stat.label}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Mission & Vision: Sứ mệnh, tầm nhìn */}
      <section className="py-5">
        <Container>
          <Row>
            <Col lg={6} className="mb-5">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-primary bg-opacity-10 rounded-circle p-3 me-3">
                      <i className="bi bi-bullseye text-primary fs-3"></i>
                    </div>
                    <h3 className="mb-0">Sứ mệnh</h3>
                  </div>
                  <p className="mb-3">
                    Cung cấp dịch vụ xét nghiệm ADN chính xác, tin cậy và có giá trị pháp lý, 
                    hỗ trợ mọi gia đình Việt Nam trong việc xác định quan hệ huyết thống và 
                    các thủ tục hành chính liên quan.
                  </p>
                  <p className="text-muted">
                    Chúng tôi cam kết mang đến sự an tâm và tin tưởng cho khách hàng thông qua 
                    công nghệ hiện đại, quy trình chuyên nghiệp và dịch vụ tận tâm.
                  </p>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={6} className="mb-5">
              <Card className="border-0 shadow-sm h-100">
                <Card.Body className="p-4">
                  <div className="d-flex align-items-center mb-3">
                    <div className="bg-success bg-opacity-10 rounded-circle p-3 me-3">
                      <i className="bi bi-eye text-success fs-3"></i>
                    </div>
                    <h3 className="mb-0">Tầm nhìn</h3>
                  </div>
                  <p className="mb-3">
                    Trở thành trung tâm xét nghiệm ADN hàng đầu Đông Nam Á, được công nhận 
                    về chất lượng dịch vụ, độ chính xác và ứng dụng công nghệ tiên tiến.
                  </p>
                  <p className="text-muted">
                    Đến năm 2030, ADN LAB sẽ là lựa chọn số 1 của người Việt cho các dịch vụ 
                    xét nghiệm di truyền và góp phần vào sự phát triển của y học cá nhân hóa.
                  </p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Leadership: Đội ngũ lãnh đạo */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3">Đội ngũ lãnh đạo</h2>
            <p className="lead text-muted">
              Các chuyên gia hàng đầu với nhiều năm kinh nghiệm trong lĩnh vực di truyền học
            </p>
          </div>
          <Row>
            {leadership.map(member => (
              <Col key={member.id} lg={4} className="mb-4">
                <Card className="border-0 shadow-sm h-100">
                  <Card.Body className="text-center p-4">
                    <img 
                      src={member.image} 
                      alt={member.name} 
                      className="rounded-circle mb-3"
                      style={{ width: '120px', height: '120px', objectFit: 'cover' }}
                    />
                    <h5 className="mb-1">{member.name}</h5>
                    <p className="text-primary fw-medium mb-3">{member.position}</p>
                    <p className="text-muted small mb-3">{member.description}</p>
                    <Accordion className="text-start">
                      <Accordion.Item eventKey="0" className="border-0">
                        <Accordion.Header className="py-2">
                          <small>Xem trình độ chuyên môn</small>
                        </Accordion.Header>
                        <Accordion.Body>
                          <ul className="list-unstyled small">
                            {member.credentials.map((cred, index) => (
                              <li key={index} className="mb-2">
                                <i className="bi bi-check-circle text-success me-2"></i>
                                {cred}
                              </li>
                            ))}
                          </ul>
                        </Accordion.Body>
                      </Accordion.Item>
                    </Accordion>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Certifications: Chứng nhận, tiêu chuẩn */}
      <section className="py-5 bg-light">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3">Chứng nhận & Tiêu chuẩn</h2>
            <p className="lead text-muted">
              Đạt các chứng nhận quốc tế và tuân thủ nghiêm ngặt các tiêu chuẩn chất lượng
            </p>
          </div>
          <Row>
            {certifications.map((cert, index) => (
              <Col key={index} lg={3} md={6} className="mb-4">
                <Card className={`border-${cert.color} border-2 h-100`}>
                  <Card.Body className="text-center">
                    <div className={`bg-${cert.color} bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center`} 
                         style={{ width: '70px', height: '70px' }}>
                      <i className={`${cert.icon} text-${cert.color} fs-2`}></i>
                    </div>
                    <h6 className={`text-${cert.color} fw-bold mb-2`}>{cert.name}</h6>
                    <p className="small text-muted">{cert.description}</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </Container>
      </section>

      {/* Technologies: Công nghệ nổi bật */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3">Công nghệ & Thiết bị</h2>
            <p className="lead text-muted">
              Sử dụng công nghệ hiện đại nhất để đảm bảo độ chính xác cao nhất
            </p>
          </div>
          <Row>
            <Col lg={8} className="mb-4">
              <div className="mb-4">
                {technologies.map((tech, index) => (
                  <div key={index} className="mb-4">
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <h6 className="mb-0">{tech.name}</h6>
                      <span className="small text-muted">{tech.progress}%</span>
                    </div>
                    <p className="small text-muted mb-2">{tech.description}</p>
                    <ProgressBar 
                      now={tech.progress} 
                      variant={tech.progress === 100 ? 'success' : 'primary'}
                      style={{ height: '8px' }}
                    />
                  </div>
                ))}
              </div>
            </Col>
            <Col lg={4}>
              <Card className="border-0 bg-primary text-white">
                <Card.Body className="p-4">
                  <h5 className="mb-3">
                    <i className="bi bi-gear me-2"></i>
                    Thiết bị chính
                  </h5>
                  <ul className="list-unstyled">
                    <li className="mb-2">
                      <i className="bi bi-check me-2"></i>
                      Applied Biosystems 3500xL
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check me-2"></i>
                      Illumina MiSeq System
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check me-2"></i>
                      Thermo Fisher QuantStudio
                    </li>
                    <li className="mb-2">
                      <i className="bi bi-check me-2"></i>
                      Hamilton STAR Workstation
                    </li>
                  </ul>
                  <div className="mt-4">
                    <small>
                      <i className="bi bi-info-circle me-2"></i>
                      Tất cả thiết bị được hiệu chuẩn định kỳ theo tiêu chuẩn quốc tế
                    </small>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Milestones: Lịch sử phát triển */}
      <section className="py-5">
        <Container>
          <div className="text-center mb-5">
            <h2 className="display-6 fw-bold mb-3">Lịch sử phát triển</h2>
            <p className="lead text-muted">
              Hành trình 15 năm phát triển và khẳng định vị thế
            </p>
          </div>
          <Row>
            <Col lg={8} className="mx-auto">
              {milestones.map((milestone, index) => (
                <div key={index} className="d-flex align-items-start mb-4">
                  <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center me-4" 
                       style={{ minWidth: '80px', height: '80px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                    {milestone.year}
                  </div>
                  <div className="flex-grow-1">
                    <h5 className="mb-2">{milestone.title}</h5>
                    <p className="text-muted mb-3">{milestone.description}</p>
                    {index < milestones.length - 1 && (
                      <div className="border-start border-2 border-light ms-5 ps-3" style={{ minHeight: '30px' }}></div>
                    )}
                  </div>
                </div>
              ))}
            </Col>
          </Row>
        </Container>
      </section>

      {/* Call to Action */}
      <section className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h2 className="display-6 fw-bold mb-3">
                Sẵn sàng trải nghiệm dịch vụ của chúng tôi?
              </h2>
              <p className="lead mb-0">
                Đội ngũ chuyên gia ADN LAB luôn sẵn sàng tư vấn và hỗ trợ bạn 24/7. 
                Hãy liên hệ với chúng tôi để được tư vấn miễn phí.
              </p>
            </Col>
            <Col lg={4} className="text-lg-end mt-4 mt-lg-0">
              <div className="d-grid gap-2">
                <Button size="lg" variant="warning" as={Link} to="/appointment">
                  <i className="bi bi-calendar-plus me-2"></i>
                  Đặt lịch xét nghiệm
                </Button>
                <Button size="lg" variant="outline-light" as={Link} to="/contact">
                  <i className="bi bi-telephone me-2"></i>
                  Liên hệ tư vấn
                </Button>
              </div>
            </Col>
          </Row>
        </Container>
      </section>
    </div>
  );
};

export default About;