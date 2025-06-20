import React from 'react';
import { Container, Row, Col, Card, Accordion, Badge } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const Guides = () => {

  const processSteps = [
    {
      title: "Bước 1: Chọn dịch vụ & Đặt lịch",
      description: "Truy cập trang Dịch vụ, chọn loại xét nghiệm ADN bạn cần (Hành chính hoặc Dân sự) và điền thông tin vào form đặt lịch hẹn. Bạn cũng có thể gọi hotline 1900 1234 để được tư vấn và đặt lịch trực tiếp.",
      icon: "bi-calendar-check",
      color: "primary"
    },
    {
      title: "Bước 2: Thu mẫu xét nghiệm",
      description: "Bạn có thể đến trung tâm ADN LAB gần nhất để được nhân viên y tế thu mẫu chuyên nghiệp. Hoặc, bạn có thể tự thu mẫu tại nhà theo hướng dẫn chi tiết của chúng tôi và gửi đến trung tâm.",
      icon: "bi-droplet-half",
      color: "info"
    },
    {
      title: "Bước 3: Phân tích tại phòng Lab",
      description: "Mẫu của bạn sẽ được mã hóa để đảm bảo bảo mật. Các chuyên gia của chúng tôi sẽ tiến hành phân tích bằng công nghệ hiện đại nhất trong phòng lab đạt chuẩn ISO 15189:2012.",
      icon: "bi-clipboard2-data",
      color: "warning"
    },
    {
      title: "Bước 4: Nhận kết quả",
      description: "Kết quả sẽ có sau 2-5 ngày làm việc. Bạn có thể tra cứu kết quả online trên website, nhận bản cứng qua đường bưu điện, hoặc nhận trực tiếp tại trung tâm. Kết quả có giá trị pháp lý sẽ được trả theo quy định.",
      icon: "bi-file-earmark-check",
      color: "success"
    }
  ];

  const sampleTypes = [
    { 
      name: "Mẫu máu", 
      details: "Độ chính xác cao nhất. Cần được thu bởi nhân viên y tế.",
      icon: "bi-bandaid",
      badge: "Phổ biến nhất"
    },
    { 
      name: "Niêm mạc miệng", 
      details: "Dễ dàng tự thu tại nhà, không đau, phù hợp cho trẻ em.",
      icon: "bi-person-vcard",
      badge: "Dễ thực hiện"
    },
    { 
      name: "Tóc (có chân tóc)", 
      details: "Cần nhổ 5-7 sợi tóc có dính chân tóc (nang tóc).",
      icon: "bi-scissors",
      badge: ""
    },
    { 
      name: "Móng tay/chân", 
      details: "Cần cắt ít nhất 5-7 mẩu móng sạch, không dính đất.",
      icon: "bi-hand-index-thumb",
      badge: ""
    },
    { 
      name: "Cuống rốn", 
      details: "Mẫu đặc biệt dùng cho trẻ sơ sinh.",
      icon: "bi-bookmark-heart",
      badge: "Trẻ sơ sinh"
    },
    {
      name: "Bàn chải đánh răng",
      details: "Bàn chải đã sử dụng ít nhất 1 tháng. Gửi nguyên bàn chải đến trung tâm.",
      icon: "bi-brush",
      badge: "Mẫu đặc biệt"
    }
  ];

  const faqs = [
    {
      question: "Xét nghiệm ADN mất bao lâu?",
      answer: "Thời gian trả kết quả thông thường từ 2-5 ngày làm việc, tùy thuộc vào loại dịch vụ và mẫu xét nghiệm. Các trường hợp làm thủ tục hành chính có thể cần thời gian lâu hơn để đảm bảo tính pháp lý."
    },
    {
      question: "Xét nghiệm ADN có chính xác không?",
      answer: "ADN LAB sử dụng bộ kit 24 loci gen theo tiêu chuẩn quốc tế, cùng hệ thống máy giải trình tự gen hiện đại, đảm bảo độ chính xác lên đến 99.9999%."
    },
    {
      question: "Chi phí xét nghiệm ADN là bao nhiêu?",
      answer: "Chi phí phụ thuộc vào loại xét nghiệm (dân sự hay hành chính), loại mẫu và thời gian trả kết quả. Vui lòng tham khảo trang Bảng giá hoặc liên hệ hotline để được tư vấn chi tiết."
    },
    {
        question: "Tôi có thể tự thu mẫu tại nhà không?",
        answer: "Có, bạn hoàn toàn có thể tự thu mẫu tại nhà đối với các loại mẫu thông thường như niêm mạc miệng, tóc có chân, móng tay. Chúng tôi sẽ cung cấp bộ kit và hướng dẫn chi tiết. Tuy nhiên, đối với xét nghiệm pháp lý, việc thu mẫu phải do nhân viên của chúng tôi hoặc đơn vị được ủy quyền thực hiện."
    },
    {
        question: "Thông tin của tôi có được bảo mật không?",
        answer: "Chúng tôi cam kết bảo mật 100% thông tin khách hàng. Tất cả mẫu và hồ sơ đều được mã hóa và chỉ có khách hàng mới có quyền truy cập kết quả."
    }
  ]

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-info text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">
                Hướng dẫn Xét nghiệm ADN
              </h1>
              <p className="lead mb-4">
                Quy trình xét nghiệm tại ADN LAB được thiết kế để đơn giản, nhanh chóng và bảo mật, đảm bảo trải nghiệm tốt nhất cho khách hàng.
              </p>
              <Link to="/appointment" className="btn btn-warning btn-lg">
                <i className="bi bi-calendar-plus me-2"></i>
                Đặt lịch hẹn ngay
              </Link>
            </Col>
            <Col lg={4} className="text-center d-none d-lg-block">
                <i className="bi bi-journal-text" style={{fontSize: '12rem', color: 'rgba(255, 255, 255, 0.5)'}}></i>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Process Section */}
      <section className="py-5 bg-light">
        <Container>
            <div className="text-center mb-5">
                <h2 className="display-6 fw-bold">Quy trình 4 bước đơn giản</h2>
                <p className="lead text-muted">Từ lúc tư vấn đến khi nhận kết quả.</p>
            </div>
            <Row>
                {processSteps.map((step, index) => (
                    <Col key={index} md={6} lg={3} className="mb-4 d-flex align-items-stretch">
                        <Card className="text-center border-0 shadow-sm w-100">
                            <Card.Body className="p-4">
                                <div className={`bg-${step.color} bg-opacity-10 rounded-circle mx-auto mb-3 d-flex align-items-center justify-content-center`} style={{ width: '80px', height: '80px' }}>
                                    <i className={`${step.icon} text-${step.color} fs-1`}></i>
                                </div>
                                <h5 className="fw-bold">{step.title}</h5>
                                <p className="text-muted small">{step.description}</p>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
        </Container>
      </section>

      {/* Sample Types Section */}
      <section className="py-5">
        <Container>
            <div className="text-center mb-5">
                <h2 className="display-6 fw-bold">Các loại mẫu xét nghiệm phổ biến</h2>
                <p className="lead text-muted">Chúng tôi có thể phân tích ADN từ nhiều loại mẫu khác nhau.</p>
            </div>
            <Row>
                {sampleTypes.map((sample, index) => (
                    <Col md={6} lg={4} key={index} className="mb-4 d-flex align-items-stretch">
                        <Card className="border-0 shadow-sm w-100">
                            <Card.Body className="p-4">
                                <div className="d-flex align-items-start">
                                    <i className={`${sample.icon} fs-2 text-primary me-4`}></i>
                                    <div>
                                        <h5 className="fw-bold">{sample.name} {sample.badge && <Badge bg="secondary" className="ms-2">{sample.badge}</Badge>}</h5>
                                        <p className="text-muted mb-0">{sample.details}</p>
                                    </div>
                                </div>
                            </Card.Body>
                        </Card>
                    </Col>
                ))}
            </Row>
            <div className="text-center mt-3">
                <p className="text-muted">Và nhiều loại mẫu khác như: bàn chải, kẹo cao su, đầu lọc thuốc lá... <Link to="/contact">Liên hệ</Link> để được tư vấn.</p>
            </div>
        </Container>
      </section>

      {/* FAQ Section */}
      <section className="py-5 bg-light">
        <Container>
            <div className="text-center mb-5">
                <h2 className="display-6 fw-bold">Câu hỏi thường gặp (FAQ)</h2>
                <p className="lead text-muted">Giải đáp các thắc mắc phổ biến của khách hàng.</p>
            </div>
            <Row className="justify-content-center">
                <Col lg={8}>
                    <Accordion defaultActiveKey="0">
                        {faqs.map((faq, index) => (
                             <Accordion.Item eventKey={String(index)} key={index} className="mb-2">
                                <Accordion.Header>{faq.question}</Accordion.Header>
                                <Accordion.Body>
                                    {faq.answer}
                                </Accordion.Body>
                            </Accordion.Item>
                        ))}
                    </Accordion>
                </Col>
            </Row>
        </Container>
      </section>
    </div>
  );
};

export default Guides; 