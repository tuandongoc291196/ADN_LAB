import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Tab, Nav, Accordion, ListGroup, Badge, Alert } from 'react-bootstrap';
import { getServiceById, getAvailableMethodsForService, COLLECTION_METHODS } from '../data/services-data';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [availableMethods, setAvailableMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    setLoading(true);
    
    try {
      const serviceData = getServiceById(id);
      if (serviceData) {
        setService(serviceData);
        setAvailableMethods(getAvailableMethodsForService(id));
        setLoading(false);
      } else {
        setError('Không tìm thấy thông tin dịch vụ');
        setLoading(false);
      }
    } catch (err) {
      setError('Lỗi khi tải thông tin dịch vụ');
      setLoading(false);
    }
  }, [id]);

  const getServiceTypeBadge = (serviceType) => {
    return serviceType === 'administrative' 
      ? <Badge bg="warning" text="dark" className="fs-6">Có giá trị pháp lý</Badge>
      : <Badge bg="success" className="fs-6">Dân sự - Tham khảo</Badge>;
  };

  const getMethodCard = (method) => (
    <Card key={method.id} className={`mb-3 border-${method.color}`}>
      <Card.Header className={`bg-${method.color} bg-opacity-10`}>
        <div className="d-flex align-items-center">
          <i className={`${method.icon} fs-4 text-${method.color} me-3`}></i>
          <div>
            <h6 className="mb-0">{method.title}</h6>
            <small className="text-muted">{method.description}</small>
          </div>
        </div>
      </Card.Header>
      <Card.Body>
        <div className="mb-3">
          <strong>Quy trình:</strong>
          <ol className="mt-2 mb-0">
            {method.process.map((step, index) => (
              <li key={index} className="small">{step}</li>
            ))}
          </ol>
        </div>
        {method.note && (
          <Alert variant={method.color} className="small mb-0">
            <i className="bi bi-info-circle me-2"></i>
            {method.note}
          </Alert>
        )}
      </Card.Body>
    </Card>
  );

  // Enhanced FAQ data based on service type
  const getFAQs = (service) => {
    const commonFAQs = [
      {
        question: `Độ chính xác của ${service.title} là bao nhiêu?`,
        answer: 'Độ chính xác lên đến 99.999% khi xác nhận quan hệ huyết thống và 100% khi loại trừ quan hệ.'
      },
      {
        question: `Thời gian có kết quả ${service.title} là bao lâu?`,
        answer: `Thời gian nhận kết quả thông thường là ${service.duration}. Chúng tôi cũng có dịch vụ khẩn cấp với phụ phí.`
      },
      {
        question: 'Cần chuẩn bị những gì khi đi xét nghiệm?',
        answer: `Cần mang theo: ${service.requiredDocuments.join(', ')}. Với trẻ em dưới 14 tuổi cần có người giám hộ.`
      }
    ];

    const serviceSpecificFAQs = service.serviceType === 'administrative' ? [
      {
        question: 'Kết quả có giá trị pháp lý như thế nào?',
        answer: 'Kết quả được công chứng và có đầy đủ giá trị pháp lý để sử dụng trong các thủ tục hành chính, tòa án và cơ quan nhà nước.'
      },
      {
        question: 'Có thể tự lấy mẫu tại nhà không?',
        answer: 'Không thể. Xét nghiệm có giá trị pháp lý bắt buộc phải thu mẫu tại cơ sở hoặc có nhân viên giám sát để đảm bảo tính chính xác và pháp lý.'
      }
    ] : [
      {
        question: 'Tự lấy mẫu tại nhà có chính xác không?',
        answer: 'Hoàn toàn chính xác nếu thực hiện đúng hướng dẫn. Kit lấy mẫu được thiết kế đơn giản và kèm hướng dẫn chi tiết.'
      },
      {
        question: 'Kết quả có thể sử dụng làm bằng chứng pháp lý không?',
        answer: 'Không. Xét nghiệm dân sự chỉ mang tính tham khảo cá nhân. Nếu cần giá trị pháp lý, vui lòng chọn xét nghiệm hành chính.'
      }
    ];

    return [...commonFAQs, ...serviceSpecificFAQs];
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
  
  if (error || !service) {
    return (
      <Container>
        <Alert variant="danger" className="my-5">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error || 'Không tìm thấy thông tin dịch vụ'}
        </Alert>
        <Button as={Link} to="/services" variant="primary">
          <i className="bi bi-arrow-left me-2"></i>
          Quay lại danh sách dịch vụ
        </Button>
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
                <ul className="list-unstyled mt-2">
                  {service.participants.map((participant, index) => (
                    <li key={index} className="small">
                      <i className="bi bi-person me-2 text-muted"></i>
                      {participant}
                    </li>
                  ))}
                </ul>
              </div>
              
              <div className="mb-4">
                <strong>Giấy tờ cần thiết:</strong>
                <ul className="list-unstyled mt-2">
                  {service.requiredDocuments.map((doc, index) => (
                    <li key={index} className="small">
                      <i className="bi bi-file-text me-2 text-muted"></i>
                      {doc}
                    </li>
                  ))}
                </ul>
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
              
              {availableMethods.map(method => getMethodCard(method))}
              
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
                    {service.procedures.map((step, index) => (
                      <div key={index} className="d-flex align-items-start mb-4">
                        <div className={`rounded-circle d-flex align-items-center justify-content-center me-3 ${
                          service.serviceType === 'administrative' ? 'bg-warning' : 'bg-success'
                        } text-white`} style={{ width: '40px', height: '40px', fontSize: '1.1rem', fontWeight: 'bold' }}>
                          {index + 1}
                        </div>
                        <div>
                          <h6 className="mb-2">{step}</h6>
                          {index < service.procedures.length - 1 && (
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