import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Tab, Nav, Accordion, ListGroup, Badge } from 'react-bootstrap';
import axios from 'axios';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    // Simulate API call to get service details
    const fetchServiceDetail = () => {
      setLoading(true);
      
      // In real application, use actual API call
      // axios.get(`/api/services/${id}`)
      //   .then(response => {
      //     setService(response.data);
      //     setLoading(false);
      //   })
      //   .catch(err => {
      //     setError('Failed to load service details');
      //     setLoading(false);
      //   });
      
      // Mock data
      setTimeout(() => {
        // Find the service by ID
        const mockServices = {
          '1': {
            id: 1,
            title: 'Xét nghiệm ADN xác định huyết thống cha-con',
            description: 'Phương pháp khoa học chính xác nhất để xác định mối quan hệ cha con bằng cách so sánh ADN.',
            fullDescription: `
              Xét nghiệm ADN huyết thống cha-con là phương pháp khoa học hiện đại nhất hiện nay để xác định mối quan hệ huyết thống giữa cha và con. 
              Phương pháp này có độ chính xác lên tới 99,999% đối với xác nhận quan hệ cha con và 100% đối với loại trừ quan hệ cha con.
              
              Xét nghiệm ADN cha con được thực hiện bằng cách phân tích và so sánh các marker di truyền trên ADN của bố và con. 
              Theo quy luật di truyền học, con sẽ thừa hưởng một nửa gen từ bố và một nửa gen từ mẹ. 
              Vì vậy, khi so sánh ADN của bố và con, nếu đúng là quan hệ cha con, các marker di truyền sẽ có sự trùng khớp ở một nửa bộ gen.
            `,
            price: '3.500.000 VNĐ',
            category: 'dna-testing',
            image: 'https://via.placeholder.com/600x400',
            featured: true,
            procedures: [
              'Đặt lịch hẹn và tư vấn trước xét nghiệm',
              'Thu thập mẫu ADN (tế bào má, tóc, máu...)',
              'Phân tích mẫu ADN tại phòng thí nghiệm',
              'Phân tích kết quả và xuất báo cáo',
              'Tư vấn và giải thích kết quả'
            ],
            faqs: [
              {
                question: 'Độ chính xác của xét nghiệm ADN cha con là bao nhiêu?',
                answer: 'Xét nghiệm ADN cha con có độ chính xác lên đến 99,999% đối với xác nhận quan hệ cha con và 100% đối với loại trừ quan hệ cha con.'
              },
              {
                question: 'Phương pháp lấy mẫu ADN như thế nào?',
                answer: 'Phương pháp phổ biến nhất là lấy tế bào niêm mạc má bằng tăm bông, đây là phương pháp không đau, không xâm lấn và vô cùng đơn giản. Ngoài ra còn có thể sử dụng mẫu máu, tóc, móng tay, v.v.'
              },
              {
                question: 'Có cần sự đồng ý của tất cả các bên khi làm xét nghiệm không?',
                answer: 'Đối với xét nghiệm ADN dùng cho mục đích cá nhân, chỉ cần sự đồng thuận của người cung cấp mẫu. Tuy nhiên, với xét nghiệm ADN có giá trị pháp lý, yêu cầu phải có sự đồng ý và có mặt của tất cả các bên liên quan.'
              },
              {
                question: 'Xét nghiệm ADN mất bao lâu có kết quả?',
                answer: 'Thời gian nhận kết quả thông thường từ 3-5 ngày làm việc. Trong trường hợp khẩn cấp, chúng tôi có dịch vụ lấy kết quả nhanh trong 24-48 giờ.'
              }
            ],
            relatedServices: [2, 7, 8]
          },
          '2': {
            id: 2,
            title: 'Xét nghiệm ADN khai sinh',
            description: 'Phục vụ các thủ tục hành chính về khai sinh, xác định quan hệ huyết thống.',
            fullDescription: `
              Xét nghiệm ADN khai sinh là dịch vụ xét nghiệm ADN có giá trị pháp lý, được sử dụng trong các thủ tục hành chính như đăng ký khai sinh, bổ sung thông tin trong giấy khai sinh, hoặc để chứng minh quan hệ huyết thống trong các thủ tục pháp lý khác.
              
              Kết quả xét nghiệm ADN khai sinh được công chứng và có giá trị pháp lý để nộp cho cơ quan hành chính nhà nước hoặc tòa án khi cần thiết. Đây là giải pháp hiệu quả khi các giấy tờ chứng minh quan hệ huyết thống bị thiếu hoặc mất.
            `,
            price: '4.200.000 VNĐ',
            category: 'birth-cert',
            image: 'https://via.placeholder.com/600x400',
            featured: true,
            procedures: [
              'Tư vấn yêu cầu pháp lý và thủ tục',
              'Thu thập mẫu ADN có sự giám sát của nhân viên y tế',
              'Phân tích ADN và lập báo cáo',
              'Công chứng kết quả xét nghiệm',
              'Hỗ trợ thủ tục pháp lý (nếu cần)'
            ],
            faqs: [
              {
                question: 'Kết quả xét nghiệm ADN khai sinh có giá trị pháp lý không?',
                answer: 'Có, kết quả xét nghiệm ADN khai sinh được thực hiện đúng quy trình và được công chứng sẽ có đầy đủ giá trị pháp lý để sử dụng trong các thủ tục hành chính.'
              },
              {
                question: 'Cần chuẩn bị những giấy tờ gì khi làm xét nghiệm ADN khai sinh?',
                answer: 'Người tham gia xét nghiệm cần mang theo CCCD/CMND, giấy khai sinh (nếu có), và các giấy tờ liên quan đến thủ tục đang thực hiện.'
              },
              {
                question: 'Có thể làm xét nghiệm ADN khai sinh khi đương sự đang ở nước ngoài không?',
                answer: 'Có thể thực hiện xét nghiệm ADN khi đương sự đang ở nước ngoài thông qua sự phối hợp với các phòng xét nghiệm đối tác tại nước sở tại.'
              }
            ],
            relatedServices: [1, 8]
          },
          '3': {
            id: 3,
            title: 'Xét nghiệm ADN thai nhi qua máu mẹ',
            description: 'Phương pháp không xâm lấn xác định huyết thống cho thai nhi từ tuần thứ 8.',
            fullDescription: `
              Xét nghiệm ADN thai nhi qua máu mẹ là phương pháp xét nghiệm ADN hiện đại, không xâm lấn, an toàn tuyệt đối cho cả mẹ và thai nhi. Xét nghiệm này có thể thực hiện từ tuần thứ 8 của thai kỳ.
              
              Trong quá trình mang thai, ADN của thai nhi sẽ lưu thông trong máu mẹ. Bằng cách phân tích mẫu máu của người mẹ, các chuyên gia có thể tách chiết ADN của thai nhi và so sánh với ADN của người cha để xác định mối quan hệ huyết thống.
              
              Đây là giải pháp lý tưởng cho các trường hợp cần xác định quan hệ huyết thống trước khi em bé chào đời, đặc biệt là trong trường hợp cần xác minh quan hệ cha con mà không muốn chờ đợi đến khi sinh.
            `,
            price: '5.500.000 VNĐ',
            category: 'fetal-dna',
            image: 'https://via.placeholder.com/600x400',
            featured: false,
            procedures: [
              'Tư vấn và kiểm tra điều kiện thực hiện xét nghiệm',
              'Lấy mẫu máu mẹ (10ml) và mẫu ADN của cha',
              'Tách chiết ADN thai nhi từ máu mẹ',
              'Phân tích và so sánh với ADN của cha',
              'Cung cấp kết quả và tư vấn'
            ],
            faqs: [
              {
                question: 'Thời điểm nào có thể thực hiện xét nghiệm ADN thai nhi qua máu mẹ?',
                answer: 'Xét nghiệm ADN thai nhi qua máu mẹ có thể thực hiện từ tuần thứ 8 của thai kỳ.'
              },
              {
                question: 'Xét nghiệm ADN thai nhi qua máu mẹ có an toàn không?',
                answer: 'Hoàn toàn an toàn vì chỉ cần lấy mẫu máu của mẹ, không can thiệp vào thai nhi nên không có nguy cơ gây sảy thai hay bất kỳ tác động nào đến thai nhi.'
              },
              {
                question: 'Độ chính xác của xét nghiệm ADN thai nhi qua máu mẹ là bao nhiêu?',
                answer: 'Độ chính xác có thể đạt trên 99% nếu mẫu máu của mẹ đủ điều kiện để tách chiết đủ ADN của thai nhi.'
              }
            ],
            relatedServices: [4]
          }
          // More service details would be defined here
        };
        
        if (mockServices[id]) {
          setService(mockServices[id]);
          setLoading(false);
        } else {
          setError('Service not found');
          setLoading(false);
        }
      }, 500);
    };
    
    fetchServiceDetail();
  }, [id]);
  
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
        <div className="alert alert-danger my-5" role="alert">
          {error || 'Không tìm thấy thông tin dịch vụ'}
        </div>
        <Button as={Link} to="/services" variant="primary">
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
      
      <Row className="mb-5">
        <Col md={6}>
          <img 
            src={service.image} 
            alt={service.title}
            className="img-fluid rounded shadow"
            style={{ width: '100%', height: 'auto' }}
          />
        </Col>
        <Col md={6}>
          <h1 className="mb-3">{service.title}</h1>
          {service.featured && (
            <Badge bg="warning" text="dark" className="mb-3">Dịch vụ nổi bật</Badge>
          )}
          
          <p className="lead mb-4">{service.description}</p>
          
          <Card className="mb-4 border-primary">
            <Card.Body>
              <Card.Title as="h3" className="text-primary">Giá dịch vụ</Card.Title>
              <Card.Text className="fs-4 fw-bold">{service.price}</Card.Text>
              <Card.Text>
                <small className="text-muted">
                  Đã bao gồm các chi phí thu mẫu, phân tích và báo cáo kết quả
                </small>
              </Card.Text>
            </Card.Body>
          </Card>
          
          <div className="d-grid gap-2">
            <Button as={Link} to="/appointment" variant="primary" size="lg">
              Đặt lịch hẹn
            </Button>
            <Button variant="outline-primary" size="lg">
              Liên hệ tư vấn
            </Button>
          </div>
        </Col>
      </Row>
      
      <Tab.Container id="service-details-tabs" defaultActiveKey="description">
        <Nav variant="tabs" className="mb-4">
          <Nav.Item>
            <Nav.Link eventKey="description">Chi tiết dịch vụ</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="procedure">Quy trình thực hiện</Nav.Link>
          </Nav.Item>
          <Nav.Item>
            <Nav.Link eventKey="faq">Câu hỏi thường gặp</Nav.Link>
          </Nav.Item>
        </Nav>
        <Tab.Content>
          <Tab.Pane eventKey="description">
            <div className="p-4 bg-light rounded">
              {service.fullDescription.split('\n').map((paragraph, index) => (
                <p key={index}>{paragraph}</p>
              ))}
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="procedure">
            <div className="p-4 bg-light rounded">
              <h4 className="mb-4">Quy trình thực hiện xét nghiệm</h4>
              <ListGroup numbered>
                {service.procedures.map((step, index) => (
                  <ListGroup.Item key={index} className="border-0 bg-transparent">
                    {step}
                  </ListGroup.Item>
                ))}
              </ListGroup>
            </div>
          </Tab.Pane>
          <Tab.Pane eventKey="faq">
            <div className="p-4 bg-light rounded">
              <h4 className="mb-4">Câu hỏi thường gặp</h4>
              <Accordion defaultActiveKey="0">
                {service.faqs.map((faq, index) => (
                  <Accordion.Item key={index} eventKey={index.toString()}>
                    <Accordion.Header>{faq.question}</Accordion.Header>
                    <Accordion.Body>{faq.answer}</Accordion.Body>
                  </Accordion.Item>
                ))}
              </Accordion>
            </div>
          </Tab.Pane>
        </Tab.Content>
      </Tab.Container>
      
      {/* Related Services */}
      {service.relatedServices && service.relatedServices.length > 0 && (
        <section className="mt-5">
          <h3 className="mb-4">Dịch vụ liên quan</h3>
          <Row>
            {/* In a real application, you would fetch related services data */}
            {[1, 2, 3].map((_, index) => (
              <Col md={4} key={index} className="mb-4">
                <Card className="h-100">
                  <Card.Img 
                    variant="top" 
                    src="https://via.placeholder.com/300x200" 
                    alt="Related service"
                  />
                  <Card.Body>
                    <Card.Title>Dịch vụ xét nghiệm ADN liên quan</Card.Title>
                    <Card.Text>Mô tả ngắn gọn về dịch vụ liên quan.</Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white border-0">
                    <Button variant="outline-primary" className="w-100">Xem chi tiết</Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </section>
      )}
    </Container>
  );
};

export default ServiceDetail; 