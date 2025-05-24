import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, InputGroup } from 'react-bootstrap';
import axios from 'axios';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');

  // Sample categories
  const categories = [
    { id: 'all', name: 'Tất cả dịch vụ' },
    { id: 'dna-testing', name: 'ADN huyết thống' },
    { id: 'birth-cert', name: 'ADN khai sinh' },
    { id: 'fetal-dna', name: 'ADN thai nhi' },
    { id: 'prenatal', name: 'Sàng lọc trước sinh' },
    { id: 'paternal', name: 'ADN họ hàng dòng cha' },
    { id: 'maternal', name: 'ADN họ hàng dòng mẹ' }
  ];

  // Mock data - replace with actual API call
  useEffect(() => {
    // Simulate API call
    const fetchServices = () => {
      setLoading(true);
      // In real application, replace with actual API call
      // axios.get('/api/services')
      //   .then(response => {
      //     setServices(response.data);
      //     setLoading(false);
      //   })
      //   .catch(err => {
      //     setError('Failed to load services');
      //     setLoading(false);
      //   });
      
      // Mock data
      setTimeout(() => {
        const mockServices = [
          {
            id: 1,
            title: 'Xét nghiệm ADN xác định huyết thống cha-con',
            description: 'Phương pháp khoa học chính xác nhất để xác định mối quan hệ cha con bằng cách so sánh ADN.',
            price: '3.500.000 VNĐ',
            category: 'dna-testing',
            image: 'https://via.placeholder.com/300x200',
            featured: true
          },
          {
            id: 2,
            title: 'Xét nghiệm ADN khai sinh',
            description: 'Phục vụ các thủ tục hành chính về khai sinh, xác định quan hệ huyết thống.',
            price: '4.200.000 VNĐ',
            category: 'birth-cert',
            image: 'https://via.placeholder.com/300x200',
            featured: true
          },
          {
            id: 3,
            title: 'Xét nghiệm ADN thai nhi qua máu mẹ',
            description: 'Phương pháp không xâm lấn xác định huyết thống cho thai nhi từ tuần thứ 8.',
            price: '5.500.000 VNĐ',
            category: 'fetal-dna',
            image: 'https://via.placeholder.com/300x200',
            featured: false
          },
          {
            id: 4,
            title: 'Sàng lọc trước sinh NIPT',
            description: 'Phát hiện sớm các bất thường nhiễm sắc thể của thai nhi qua máu mẹ.',
            price: '6.300.000 VNĐ',
            category: 'prenatal',
            image: 'https://via.placeholder.com/300x200',
            featured: true
          },
          {
            id: 5,
            title: 'Xét nghiệm ADN họ hàng dòng cha',
            description: 'Xác định quan hệ huyết thống giữa các thành viên trong gia đình dòng cha.',
            price: '7.500.000 VNĐ',
            category: 'paternal',
            image: 'https://via.placeholder.com/300x200',
            featured: false
          },
          {
            id: 6,
            title: 'Xét nghiệm ADN họ hàng dòng mẹ (ADN ty thể)',
            description: 'Xác định quan hệ huyết thống của các thành viên trong dòng họ bên mẹ.',
            price: '7.200.000 VNĐ',
            category: 'maternal',
            image: 'https://via.placeholder.com/300x200',
            featured: false
          },
          {
            id: 7,
            title: 'Xét nghiệm ADN hài cốt',
            description: 'Phân tích ADN từ hài cốt để xác định danh tính hoặc quan hệ huyết thống.',
            price: '12.500.000 VNĐ',
            category: 'dna-testing',
            image: 'https://via.placeholder.com/300x200',
            featured: false
          },
          {
            id: 8,
            title: 'Xét nghiệm ADN di trú và nhập quốc tịch',
            description: 'Xét nghiệm ADN phục vụ các thủ tục bảo lãnh, di dân và nhập quốc tịch.',
            price: '5.800.000 VNĐ',
            category: 'birth-cert',
            image: 'https://via.placeholder.com/300x200',
            featured: true
          }
        ];
        
        setServices(mockServices);
        setLoading(false);
      }, 500);
    };
    
    fetchServices();
  }, []);

  // Filter services based on search term and category
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesCategory = selectedCategory === '' || selectedCategory === 'all' || 
      service.category === selectedCategory;
    
    return matchesSearch && matchesCategory;
  });

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  // Handle category selection
  const handleCategoryChange = (e) => {
    setSelectedCategory(e.target.value);
  };

  if (loading) {
    return (
      <Container>
        <div className="text-center my-5">
          <div className="spinner-border" role="status">
            <span className="visually-hidden">Đang tải...</span>
          </div>
          <p className="mt-2">Đang tải dịch vụ...</p>
        </div>
      </Container>
    );
  }

  if (error) {
    return (
      <Container>
        <div className="alert alert-danger my-5" role="alert">
          {error}
        </div>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      <h1 className="text-center mb-5">Dịch vụ xét nghiệm ADN</h1>
      
      {/* Filter and Search */}
      <Row className="mb-4">
        <Col md={4}>
          <Form.Group>
            <Form.Label>Danh mục dịch vụ</Form.Label>
            <Form.Select 
              value={selectedCategory}
              onChange={handleCategoryChange}
            >
              {categories.map(category => (
                <option key={category.id} value={category.id}>
                  {category.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
        </Col>
        <Col md={8}>
          <Form.Group>
            <Form.Label>Tìm kiếm dịch vụ</Form.Label>
            <InputGroup>
              <Form.Control
                placeholder="Nhập từ khóa tìm kiếm..."
                value={searchTerm}
                onChange={handleSearchChange}
              />
              <Button variant="outline-secondary">
                <i className="bi bi-search"></i> Tìm kiếm
              </Button>
            </InputGroup>
          </Form.Group>
        </Col>
      </Row>

      {/* Featured Services */}
      {selectedCategory === '' && searchTerm === '' && (
        <div className="mb-5">
          <h3 className="mb-4">Dịch vụ nổi bật</h3>
          <Row>
            {services.filter(service => service.featured).map(service => (
              <Col key={service.id} md={3} sm={6} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <div className="position-relative">
                    <Card.Img variant="top" src={service.image} />
                    <span className="position-absolute top-0 end-0 bg-warning text-dark px-2 py-1 m-2 rounded-pill">
                      Nổi bật
                    </span>
                  </div>
                  <Card.Body>
                    <Card.Title>{service.title}</Card.Title>
                    <Card.Text>{service.description}</Card.Text>
                    <Card.Text className="text-primary fw-bold">
                      {service.price}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white border-0">
                    <Button 
                      variant="primary" 
                      as={Link} 
                      to={`/services/${service.id}`}
                      className="w-100"
                    >
                      Chi tiết dịch vụ
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      )}

      {/* All Services */}
      <div>
        <h3 className="mb-4">{selectedCategory !== '' || searchTerm !== '' ? 'Kết quả tìm kiếm' : 'Tất cả dịch vụ'}</h3>
        
        {filteredServices.length === 0 ? (
          <div className="alert alert-info">
            Không tìm thấy dịch vụ phù hợp với tiêu chí tìm kiếm.
          </div>
        ) : (
          <Row>
            {filteredServices.map(service => (
              <Col key={service.id} md={3} sm={6} className="mb-4">
                <Card className="h-100 shadow-sm">
                  <Card.Img variant="top" src={service.image} />
                  <Card.Body>
                    <Card.Title>{service.title}</Card.Title>
                    <Card.Text>{service.description}</Card.Text>
                    <Card.Text className="text-primary fw-bold">
                      {service.price}
                    </Card.Text>
                  </Card.Body>
                  <Card.Footer className="bg-white border-0">
                    <Button 
                      variant="outline-primary" 
                      as={Link} 
                      to={`/services/${service.id}`}
                      className="w-100"
                    >
                      Chi tiết dịch vụ
                    </Button>
                  </Card.Footer>
                </Card>
              </Col>
            ))}
          </Row>
        )}
      </div>
    </Container>
  );
};

export default ServiceList; 