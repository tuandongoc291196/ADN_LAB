import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Form, InputGroup, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import { Search } from 'react-bootstrap-icons';
import { getAllServices } from '../../services/api';
import './ServiceList.css';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');

  useEffect(() => {
    const fetchServices = async () => {
      try {
        setLoading(true);
        const data = await getAllServices();
        setServices(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  const categories = useMemo(() => {
    if (services.length === 0) return [];
    const uniqueCategories = [
      ...new Set(
        services.map(s =>
          typeof s.category === 'object'
            ? s.category.id || s.category.name || JSON.stringify(s.category)
            : s.category
        )
      ),
    ];
    return ['all', ...uniqueCategories];
  }, [services]);

  const filteredServices = useMemo(() => {
    return services.filter(service => {
      const catValue =
        typeof service.category === 'object'
          ? service.category.id || service.category.name || JSON.stringify(service.category)
          : service.category;
      const matchesCategory = selectedCategory === 'all' || catValue === selectedCategory;
      const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [services, searchTerm, selectedCategory]);

  if (loading) {
    return (
      <Container className="text-center py-5">
        <Spinner animation="border" variant="primary" />
        <p className="mt-2">Đang tải danh sách dịch vụ...</p>
      </Container>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <Alert.Heading>Đã xảy ra lỗi</Alert.Heading>
          <p>Không thể tải dữ liệu dịch vụ. Vui lòng thử lại sau.</p>
          <hr />
          <p className="mb-0">Chi tiết lỗi: {error}</p>
        </Alert>
      </Container>
    );
  }

  return (
    <div className="service-list-page">
      <header className="page-header text-center text-white py-5">
        <Container>
          <h1 className="display-4 fw-bold">Dịch vụ của chúng tôi</h1>
          <p className="lead">Khám phá các dịch vụ xét nghiệm ADN chính xác và đáng tin cậy</p>
        </Container>
      </header>

      <Container className="py-5">
        <Card className="shadow-sm mb-4 filter-card">
          <Card.Body>
            <Row className="align-items-end">
              <Col md={6} lg={8} className="mb-3 mb-md-0">
                <Form.Label htmlFor="search-input">Tìm kiếm dịch vụ</Form.Label>
                <InputGroup>
                  <InputGroup.Text><Search /></InputGroup.Text>
                  <Form.Control
                    id="search-input"
                    placeholder="Nhập tên dịch vụ..."
                    value={searchTerm}
                    onChange={e => setSearchTerm(e.target.value)}
                  />
                </InputGroup>
              </Col>
              <Col md={6} lg={4}>
                <Form.Label htmlFor="category-select">Lọc theo danh mục</Form.Label>
                <Form.Select
                  id="category-select"
                  value={selectedCategory}
                  onChange={e => setSelectedCategory(e.target.value)}
                >
                  {categories.map(category => (
                    <option key={category} value={category}>
                      {category === 'all' ? 'Tất cả danh mục' : category}
                    </option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
          </Card.Body>
        </Card>

        <div className="mb-4">
          <h5>
            <Badge bg="primary" pill>
              {filteredServices.length}
            </Badge>
            {' '}Kết quả
          </h5>
        </div>

        {filteredServices.length > 0 ? (
          <Row xs={1} md={2} lg={3} className="g-4">
            {filteredServices.map(service => (
              <Col key={String(service.id)}>
                <Card className="h-100 service-card shadow-sm border-0">
                  <Link to={`/services/${service.id}`} className="card-link">
                    <Card.Img variant="top" src={service.imageUrl || 'https://via.placeholder.com/400x250'} className="service-card-img" />
                    <Card.Body className="d-flex flex-column">
                      <Card.Title className="h5">{service.title}</Card.Title>
                      {service.category && <Badge bg="secondary" className="mb-2 align-self-start">{typeof service.category === 'object' ? service.category.name : service.category}</Badge>}
                      <Card.Text className="text-muted flex-grow-1">{service.description}</Card.Text>
                      <div className="mt-auto">
                        <p className="h5 text-primary fw-bold mb-3">
                          {service.price.toLocaleString('vi-VN')} VNĐ
                        </p>
                        <Button variant="primary" className="w-100">Xem chi tiết</Button>
                      </div>
                    </Card.Body>
                  </Link>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <Alert variant="info" className="text-center py-5">
            <h4 className="alert-heading">Không tìm thấy dịch vụ</h4>
            <p>Không có dịch vụ nào phù hợp với tiêu chí tìm kiếm của bạn. Vui lòng thử lại.</p>
          </Alert>
        )}
      </Container>
    </div>
  );
};

export default ServiceList;