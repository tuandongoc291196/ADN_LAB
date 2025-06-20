import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert, Accordion, Tab, Nav } from 'react-bootstrap';
import { getServiceAndMethodsById } from '../../services/api';

const ServiceDetail = () => {
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { id } = useParams();

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const data = await getServiceAndMethodsById(id);
        const { dnaService, serviceCollectionMethods } = data;
        
        if (dnaService) {
          // Tạo map của collection methods để dễ truy cập
          const methodsMap = {};
          serviceCollectionMethods.forEach(method => {
            if (!methodsMap[method.methodId]) {
              methodsMap[method.methodId] = {
                id: method.methodId,
                title: method.methodTitle,
                description: method.methodDescription,
                icon: method.methodIcon,
                color: method.methodColor,
                note: method.methodNote,
                process: method.methodProcess
              };
            }
          });

          // Gắn thông tin methods vào service
          const serviceWithMethods = {
            ...dnaService,
            methodDetails: serviceCollectionMethods
              .filter(method => method.serviceId === dnaService.id)
              .map(method => methodsMap[method.methodId])
          };

          setService(serviceWithMethods);
        } else {
          setError('Không tìm thấy thông tin dịch vụ');
        }
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchService();
  }, [id]);

  const getServiceTypeBadge = (serviceType) => {
    return serviceType === 'administrative' 
      ? <Badge bg="warning" text="dark">Có giá trị pháp lý</Badge>
      : <Badge bg="success">Dân sự</Badge>;
  };

  const getMethodBadges = (methodDetails) => {
    return methodDetails.map(method => (
      <Badge 
        key={method.id} 
        bg={method.color} 
        className="me-1"
        title={method.description}
      >
        <i className={`${method.icon} me-1`}></i>
        {method.title}
      </Badge>
    ));
  };

  const getMethodCard = (method) => (
    <Card key={method.id} className="mb-3 border-0 bg-light">
      <Card.Body>
        <div className="d-flex align-items-center mb-2">
          <div className={`rounded-circle p-2 me-3 bg-${method.color}`}>
            <i className={`${method.icon} text-white`}></i>
          </div>
          <h6 className="mb-0">{method.title}</h6>
        </div>
        <p className="small text-muted mb-2">{method.description}</p>
        {method.note && (
          <Alert variant={method.color} className="small mb-0">
            <i className="bi bi-info-circle me-1"></i>
            {method.note}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );

  const getFAQs = (service) => {
    return [
      {
        question: 'Thời gian có kết quả là bao lâu?',
        answer: `Kết quả sẽ có sau ${service.duration}. Chúng tôi sẽ thông báo ngay khi có kết quả.`
      },
      {
        question: 'Độ chính xác của xét nghiệm là bao nhiêu?',
        answer: 'Xét nghiệm ADN có độ chính xác 99.999% trong việc xác định mối quan hệ huyết thống.'
      },
      {
        question: 'Tôi có thể tự lấy mẫu tại nhà không?',
        answer: service.serviceType === 'administrative' 
          ? 'Với xét nghiệm có giá trị pháp lý, bạn cần đến cơ sở của chúng tôi để được nhân viên y tế lấy mẫu và giám sát quá trình.'
          : 'Có, bạn có thể tự lấy mẫu tại nhà theo hướng dẫn. Tuy nhiên, để đảm bảo độ chính xác, chúng tôi khuyến nghị đến cơ sở của chúng tôi.'
      }
    ];
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2">Đang tải thông tin dịch vụ...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <Alert variant="danger" className="my-5">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      </Container>
    );
  }

  if (!service) {
    return (
      <Container>
        <Alert variant="warning" className="my-5">
          <i className="bi bi-exclamation-circle me-2"></i>
          Không tìm thấy thông tin dịch vụ
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Breadcrumb */}
      <nav aria-label="breadcrumb" className="mb-4">
        <ol className="breadcrumb">
          <li className="breadcrumb-item">
            <Link to="/">Trang chủ</Link>
          </li>
          <li className="breadcrumb-item">
            <Link to="/services">Dịch vụ</Link>
          </li>
          <li className="breadcrumb-item active" aria-current="page">
            {service.title}
          </li>
        </ol>
      </nav>
      
      {/* Service Header */}
      <Row className="mb-5">
        <Col lg={8}>
          <div className="d-flex align-items-center mb-3">
            <div className={`rounded-circle p-3 me-3 ${
              service.serviceType === 'administrative' ? 'bg-warning' : 'bg-success'
            }`}>
              <i className={`${service.icon} text-white fs-2`}></i>
            </div>
            <div>
              <h1 className="mb-2">{service.title}</h1>
              {getServiceTypeBadge(service.serviceType)}
              {service.featured && (
                <Badge bg="primary" className="ms-2">Dịch vụ nổi bật</Badge>
              )}
            </div>
          </div>
          
          <p className="lead mb-4">{service.description}</p>
          
          {/* Key Information */}
          <Row className="mb-4">
            <Col sm={6} className="mb-3">
              <Card className="border-0 bg-light h-100">
                <Card.Body className="text-center">
                  <i className="bi bi-currency-dollar text-primary fs-1 mb-2 d-block"></i>
                  <h5 className="text-primary mb-1">{service.price}</h5>
                  <small className="text-muted">Giá dịch vụ</small>
                </Card.Body>
              </Card>
            </Col>
            <Col sm={6} className="mb-3">
              <Card className="border-0 bg-light h-100">
                <Card.Body className="text-center">
                  <i className="bi bi-clock text-info fs-1 mb-2 d-block"></i>
                  <h5 className="text-info mb-1">{service.duration}</h5>
                  <small className="text-muted">Thời gian có kết quả</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Participants */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Đối tượng tham gia</h5>
            </Card.Header>
            <Card.Body>
              <p className="mb-0">{service.participants}</p>
            </Card.Body>
          </Card>

          {/* Required Documents */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Yêu cầu</h5>
            </Card.Header>
            <Card.Body>
              <p className="mb-0">{service.requiredDocuments}</p>
            </Card.Body>
          </Card>

          {/* Procedures */}
          <Card className="mb-4">
            <Card.Header>
              <h5 className="mb-0">Quy trình</h5>
            </Card.Header>
            <Card.Body>
              <ol className="mb-0">
                {service.procedures.split(' → ').map((step, index) => (
                  <li key={index}>{step}</li>
                ))}
              </ol>
            </Card.Body>
          </Card>
        </Col>

        {/* Quick Action Sidebar */}
        <Col lg={4}>
          <Card className="shadow-sm sticky-top">
            <Card.Header className={`${
              service.serviceType === 'administrative' ? 'bg-warning text-dark' : 'bg-success text-white'
            }`}>
              <h5 className="mb-0">
                <i className="bi bi-calendar-plus me-2"></i>
                Đặt lịch xét nghiệm
              </h5>
            </Card.Header>
            <Card.Body>
              <div className="mb-3">
                <strong>Người tham gia:</strong>
                <p className="mb-0">{service.participants}</p>
              </div>
              <div className="mb-4">
                <strong>Yêu cầu:</strong>
                <p className="mb-0">{service.requiredDocuments}</p>
              </div>

              <div className="d-grid gap-2">
                <Button 
                  variant={service.serviceType === 'administrative' ? 'warning' : 'success'}
                  size="lg" 
                  as={Link} 
                  to="/appointment"
                  state={{ selectedService: service.id }}
                >
                  <i className="bi bi-calendar-plus me-2"></i>
                  Đặt lịch ngay
                </Button>
                <Button variant="outline-primary" size="lg">
                  <i className="bi bi-telephone me-2"></i>
                  Tư vấn: 1900 1234
                </Button>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Detailed Information Tabs */}
      <Tab.Container id="service-details-tabs" defaultActiveKey="description">
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="description">
              <i className="bi bi-info-circle me-2"></i>
              Chi tiết dịch vụ
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="methods">
              <i className="bi bi-collection me-2"></i>
              Phương thức lấy mẫu
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="procedure">
              <i className="bi bi-list-ol me-2"></i>
              Quy trình thực hiện
            </Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="faq">
              <i className="bi bi-question-circle me-2"></i>
              Câu hỏi thường gặp
            </Nav.Link>
          </Nav.Item>
        </Nav>
        
        <Tab.Content>
          {/* Service Description */}
          <Tab.Pane eventKey="description">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <div className="prose">
                  {service.fullDescription.split('\n').map((paragraph, index) => (
                    paragraph.trim() && <p key={index} className="mb-3">{paragraph.trim()}</p>
                  ))}
                </div>
                
                {service.serviceType === 'administrative' && (
                  <Alert variant="warning" className="mt-4">
                    <i className="bi bi-shield-check me-2"></i>
                    <strong>Lưu ý quan trọng:</strong> Đây là dịch vụ có giá trị pháp lý. 
                    Kết quả được công chứng và có thể sử dụng trong các thủ tục hành chính, 
                    tòa án và cơ quan nhà nước.
                  </Alert>
                )}
                
                {service.serviceType === 'civil' && (
                  <Alert variant="info" className="mt-4">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Lưu ý:</strong> Đây là dịch vụ dân sự chỉ mang tính tham khảo cá nhân. 
                    Kết quả không có giá trị pháp lý.
                  </Alert>
                )}
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* Collection Methods */}
          <Tab.Pane eventKey="methods">
            <div>
              <div className="mb-4">
                <h4>Các phương thức lấy mẫu có sẵn</h4>
                <p className="text-muted">
                  Dựa vào loại dịch vụ và yêu cầu pháp lý, bạn có thể chọn phương thức lấy mẫu phù hợp
                </p>
              </div>
              
              {service.methodDetails.map(method => getMethodCard(method))}
              
              {service.serviceType === 'administrative' && (
                <Alert variant="warning">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  <strong>Đặc biệt quan trọng:</strong> Với xét nghiệm có giá trị pháp lý, 
                  không thể tự lấy mẫu tại nhà. Bắt buộc phải có sự giám sát của nhân viên 
                  y tế để đảm bảo tính chính xác và giá trị pháp lý của kết quả.
                </Alert>
              )}
            </div>
          </Tab.Pane>

          {/* Procedure */}
          <Tab.Pane eventKey="procedure">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h4 className="mb-4">Quy trình thực hiện xét nghiệm</h4>
                <div className="row">
                  <div className="col-lg-8">
                    {service.procedures.split(' → ').map((step, index) => (
                      <div key={index} className="d-flex align-items-start mb-4">
                        <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${
                          service.serviceType === 'administrative' ? 'bg-warning' : 'bg-success'
                        } text-white`} style={{ width: '40px', height: '40px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                          {index + 1}
                        </div>
                        <div>
                          <h6 className="mb-2">{step}</h6>
                          {index < service.procedures.split(' → ').length - 1 && (
                            <div className="border-start border-2 border-light ms-3 ps-3" style={{ minHeight: '20px' }}></div>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="col-lg-4">
                    <Card className="bg-light border-0">
                      <Card.Body>
                        <h6 className="mb-3">
                          <i className="bi bi-clock me-2"></i>
                          Thời gian dự kiến
                        </h6>
                        <p className="mb-3"><strong>{service.duration}</strong></p>
                        
                        <h6 className="mb-3">
                          <i className="bi bi-shield-check me-2"></i>
                          Độ chính xác
                        </h6>
                        <p className="mb-3"><strong>99.999%</strong></p>
                        
                        <h6 className="mb-3">
                          <i className="bi bi-award me-2"></i>
                          Chứng nhận
                        </h6>
                        <p className="mb-0">
                          {service.hasLegalValue ? 
                            'Có giá trị pháp lý đầy đủ' : 
                            'Chỉ mang tính tham khảo'
                          }
                        </p>
                      </Card.Body>
                    </Card>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Tab.Pane>

          {/* FAQ */}
          <Tab.Pane eventKey="faq">
            <Card className="border-0 shadow-sm">
              <Card.Body className="p-4">
                <h4 className="mb-4">Câu hỏi thường gặp</h4>
                <Accordion>
                  {getFAQs(service).map((faq, index) => (
                    <Accordion.Item key={index} eventKey={index.toString()}>
                      <Accordion.Header>{faq.question}</Accordion.Header>
                      <Accordion.Body>{faq.answer}</Accordion.Body>
                    </Accordion.Item>
                  ))}
                </Accordion>
                
                <div className="mt-4 text-center">
                  <p className="text-muted mb-3">Không tìm thấy câu trả lời bạn cần?</p>
                  <div className="d-flex justify-content-center gap-3 flex-wrap">
                    <Button variant="primary">
                      <i className="bi bi-telephone me-2"></i>
                      Gọi hotline: 1900 1234
                    </Button>
                    <Button variant="outline-primary">
                      <i className="bi bi-chat-dots me-2"></i>
                      Chat trực tuyến
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      
      {/* Related Services */}
      <section className="mt-5">
        <h3 className="mb-4">Dịch vụ liên quan</h3>
        <p className="text-muted mb-4">Các dịch vụ khác bạn có thể quan tâm</p>
        <div className="text-center">
          <Button variant="outline-primary" as={Link} to="/services">
            <i className="bi bi-grid me-2"></i>
            Xem tất cả dịch vụ
          </Button>
        </div>
      </section>
    </Container>
  );
};

export default ServiceDetail;