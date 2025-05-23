import React from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Carousel } from 'react-bootstrap';

const Home = () => {
  // Sample data - in real application, this would come from an API
  const services = [
    {
      id: 1,
      title: 'Xét nghiệm ADN huyết thống',
      description: 'Xét nghiệm ADN huyết thống giúp xác định mối quan hệ cha mẹ con, quan hệ huyết thống.',
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: 2,
      title: 'Xét nghiệm ADN khai sinh',
      description: 'Xét nghiệm ADN để phục vụ các thủ tục khai sinh và giấy tờ pháp lý.',
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: 3,
      title: 'Xét nghiệm ADN thai nhi',
      description: 'Xét nghiệm ADN cho thai nhi an toàn giúp xác định quan hệ huyết thống trước khi sinh.',
      image: 'https://via.placeholder.com/300x200'
    },
    {
      id: 4,
      title: 'Sàng lọc trước sinh NIPT',
      description: 'Xét nghiệm sàng lọc trước sinh không xâm lấn để phát hiện bất thường nhiễm sắc thể.',
      image: 'https://via.placeholder.com/300x200'
    }
  ];

  const experts = [
    {
      id: 1,
      name: 'TS. Nguyễn Văn A',
      title: 'Giám đốc Khoa học',
      bio: 'Tiến sĩ di truyền học với hơn 15 năm kinh nghiệm trong lĩnh vực phân tích ADN.',
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 2,
      name: 'ThS. Trần Thị B',
      title: 'Trưởng phòng xét nghiệm',
      bio: 'Thạc sĩ sinh học phân tử, chuyên gia về xét nghiệm ADN và sàng lọc di truyền.',
      image: 'https://via.placeholder.com/150'
    },
    {
      id: 3,
      name: 'BS. Lê Văn C',
      title: 'Cố vấn Y khoa',
      bio: 'Bác sĩ di truyền với chuyên môn cao về tư vấn di truyền và xét nghiệm tiền sản.',
      image: 'https://via.placeholder.com/150'
    }
  ];

  const articles = [
    {
      id: 1,
      title: 'Kỹ thuật FISH trong chẩn đoán di truyền',
      summary: 'Kỹ thuật FISH là một phương pháp hiện đại trong xét nghiệm nhiễm sắc thể...',
      image: 'https://via.placeholder.com/300x200',
      date: '15/05/2023'
    },
    {
      id: 2,
      title: 'Xét nghiệm điện di huyết sắc tố trong tầm soát Thalassemia',
      summary: 'Điện di huyết sắc tố là xét nghiệm quan trọng giúp phát hiện bệnh tan máu bẩm sinh...',
      image: 'https://via.placeholder.com/300x200',
      date: '10/04/2023'
    },
    {
      id: 3,
      title: 'Đưa thông tin ADN vào mã định danh công dân',
      summary: 'Xu hướng mới trong việc quản lý dữ liệu công dân và ứng dụng công nghệ ADN...',
      image: 'https://via.placeholder.com/300x200',
      date: '05/03/2023'
    }
  ];

  return (
    <>
      {/* Hero Section */}
      <section className="hero-section mb-5">
        <Carousel>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://via.placeholder.com/1200x400"
              alt="First slide"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
            <Carousel.Caption>
              <h2>Trung tâm Xét nghiệm ADN hàng đầu</h2>
              <p>Công nghệ tiên tiến - Kết quả chính xác - Bảo mật tuyệt đối</p>
              <Button variant="primary" as={Link} to="/services">Tìm hiểu các dịch vụ</Button>
            </Carousel.Caption>
          </Carousel.Item>
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://via.placeholder.com/1200x400"
              alt="Second slide"
              style={{ maxHeight: '500px', objectFit: 'cover' }}
            />
            <Carousel.Caption>
              <h2>Đội ngũ chuyên gia hàng đầu</h2>
              <p>Với đội ngũ bác sĩ, nhà khoa học và chuyên gia di truyền học giàu kinh nghiệm</p>
              <Button variant="primary" as={Link} to="/about">Về chúng tôi</Button>
            </Carousel.Caption>
          </Carousel.Item>
        </Carousel>
      </section>

      {/* Services Section */}
      <section className="services-section mb-5">
        <Container>
          <h2 className="text-center mb-4">Dịch vụ xét nghiệm ADN</h2>
          <Row>
            {services.map(service => (
              <Col key={service.id} md={3} sm={6} className="mb-4">
                <Card className="h-100">
                  <Card.Img variant="top" src={service.image} />
                  <Card.Body>
                    <Card.Title>{service.title}</Card.Title>
                    <Card.Text>{service.description}</Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white border-0">
                    <Button variant="outline-primary" as={Link} to={`/services/${service.id}`}>Chi tiết</Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-3">
            <Button variant="primary" as={Link} to="/services">Xem tất cả dịch vụ</Button>
          </div>
        </Container>
      </section>

      {/* Experts Section */}
      <section className="experts-section mb-5 bg-light py-5">
        <Container>
          <h2 className="text-center mb-4">Đội ngũ chuyên gia</h2>
          <Row>
            {experts.map(expert => (
              <Col key={expert.id} md={4} className="mb-4">
                <Card className="h-100 border-0 shadow-sm">
                  <Card.Body className="text-center">
                    <div className="mb-3">
                      <img 
                        src={expert.image} 
                        alt={expert.name} 
                        className="rounded-circle"
                        style={{ width: '150px', height: '150px', objectFit: 'cover' }}
                      />
                    </div>
                    <Card.Title>{expert.name}</Card.Title>
                    <Card.Subtitle className="mb-2 text-muted">{expert.title}</Card.Subtitle>
                    <Card.Text>{expert.bio}</Card.Text>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-3">
            <Button variant="outline-primary" as={Link} to="/about#experts">Xem thêm</Button>
          </div>
        </Container>
      </section>

      {/* Articles/News Section */}
      <section className="articles-section mb-5">
        <Container>
          <h2 className="text-center mb-4">Tin tức & Kiến thức</h2>
          <Row>
            {articles.map(article => (
              <Col key={article.id} md={4} className="mb-4">
                <Card className="h-100">
                  <Card.Img variant="top" src={article.image} />
                  <Card.Body>
                    <small className="text-muted">{article.date}</small>
                    <Card.Title>{article.title}</Card.Title>
                    <Card.Text>{article.summary}</Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white border-0">
                    <Button variant="link" className="p-0">Đọc tiếp</Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
          <div className="text-center mt-3">
            <Button variant="outline-primary" as={Link} to="/library">Xem thêm bài viết</Button>
          </div>
        </Container>
      </section>

      {/* Appointment Section */}
      <section className="appointment-section bg-primary text-white py-5 mb-5">
        <Container className="text-center">
          <h2 className="mb-3">Đặt lịch hẹn</h2>
          <p className="mb-4">Đặt lịch hẹn ngay để được tư vấn và sử dụng các dịch vụ xét nghiệm ADN</p>
          <Button variant="light" size="lg" as={Link} to="/appointment">Đặt lịch ngay</Button>
        </Container>
      </section>
    </>
  );
};

export default Home; 