import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Form, InputGroup, Badge, Alert } from 'react-bootstrap';
import { getAllServicesAndMethods } from '../../services/api';

const ServiceList = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [selectedMethod, setSelectedMethod] = useState('all');
  const [collectionMethods, setCollectionMethods] = useState([]);

  // Categories for filtering
  const serviceTypes = [
    { id: 'all', name: 'Tất cả dịch vụ', count: 0 },
    { id: 'administrative', name: 'ADN Hành chính (Có giá trị pháp lý)', count: 0 },
    { id: 'civil', name: 'ADN Dân sự (Không có giá trị pháp lý)', count: 0 }
  ];

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const data = await getAllServicesAndMethods();
        const { dnaServices, serviceCollectionMethods } = data;
        
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

        // Gắn thông tin methods vào services
        const servicesWithMethods = dnaServices.map(service => ({
          ...service,
          methodDetails: serviceCollectionMethods
            .filter(method => method.serviceId === service.id)
            .map(method => methodsMap[method.methodId])
        }));
        
        setServices(servicesWithMethods);
        
        // Cập nhật danh sách phương thức lấy mẫu cho filter
        const uniqueMethods = [...new Set(serviceCollectionMethods.map(m => m.methodId))];
        setCollectionMethods([
          { id: 'all', name: 'Tất cả phương thức' },
          ...uniqueMethods.map(id => ({
            id: id,
            name: methodsMap[id].title
          }))
        ]);
        
        // Update counts
        serviceTypes[0].count = servicesWithMethods.length;
        serviceTypes[1].count = servicesWithMethods.filter(s => s.serviceType === 'administrative').length;
        serviceTypes[2].count = servicesWithMethods.filter(s => s.serviceType === 'civil').length;
        
        setLoading(false);
      } catch (err) {
        setError('Không thể tải danh sách dịch vụ');
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  // Filter services based on criteria
  const filteredServices = services.filter(service => {
    const matchesSearch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
      service.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesType = selectedType === 'all' || service.serviceType === selectedType;
    
    const matchesMethod = selectedMethod === 'all' || 
      service.methodDetails.some(method => method.id === selectedMethod);
    
    return matchesSearch && matchesType && matchesMethod;
  });

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleTypeChange = (e) => {
    setSelectedType(e.target.value);
  };

  const handleMethodChange = (e) => {
    setSelectedMethod(e.target.value);
  };

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
        <Alert variant="danger" className="my-5">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      </Container>
    );
  }

  return (
    <Container className="py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 className="display-5 fw-bold mb-3">Dịch vụ xét nghiệm ADN</h1>
        <p className="lead text-muted">
          Cung cấp đầy đủ các dịch vụ xét nghiệm ADN với độ chính xác cao
        </p>
      </div>
      
      {/* Service Type Info */}
      <Row className="mb-4">
        <Col md={6}>
          <Card className="border-warning h-100">
            <Card.Header className="bg-warning text-dark">
              <h5 className="mb-0">
                <i className="bi bi-award me-2"></i>
                ADN Hành chính
              </h5>
            </Card.Header>
            <Card.Body>
              <p className="mb-2"><strong>Có giá trị pháp lý</strong> - Được các cơ quan nhà nước công nhận</p>
              <p className="small text-muted mb-3">
                Phục vụ: Khai sinh, nhập tịch, visa, thừa kế, cấp dưỡng...
              </p>
              <p className="small">
                <i className="bi bi-info-circle text-warning me-1"></i>
                Bắt buộc thu mẫu tại cơ sở hoặc có nhân viên giám sát
              </p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mt-3 mt-md-0">
          <Card className="border-success h-100">
            <Card.Header className="bg-success text-white">
              <h5 className="mb-0">
                <i className="bi bi-house me-2"></i>
                ADN Dân sự
              </h5>
            </Card.Header>
            <Card.Body>
              <p className="mb-2"><strong>Mục đích cá nhân</strong> - Chỉ mang tính tham khảo</p>
              <p className="small text-muted mb-3">
                Phục vụ: Tìm hiểu huyết thống, nguồn gốc, sức khỏe cá nhân...
              </p>
              <p className="small">
                <i className="bi bi-check-circle text-success me-1"></i>
                Có thể tự lấy mẫu tại nhà, thuận tiện và riêng tư
              </p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filter and Search */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col lg={4} md={6} className="mb-3">
              <Form.Label>Loại dịch vụ</Form.Label>
              <Form.Select value={selectedType} onChange={handleTypeChange}>
                {serviceTypes.map(type => (
                  <option key={type.id} value={type.id}>
                    {type.name} {type.count > 0 && `(${type.count})`}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col lg={4} md={6} className="mb-3">
              <Form.Label>Phương thức lấy mẫu</Form.Label>
              <Form.Select value={selectedMethod} onChange={handleMethodChange}>
                {collectionMethods.map(method => (
                  <option key={method.id} value={method.id}>
                    {method.name}
                  </option>
                ))}
              </Form.Select>
            </Col>
            <Col lg={4} className="mb-3">
              <Form.Label>Tìm kiếm dịch vụ</Form.Label>
              <InputGroup>
                <Form.Control
                  placeholder="Nhập từ khóa tìm kiếm..."
                  value={searchTerm}
                  onChange={handleSearchChange}
                />
                <Button variant="outline-secondary">
                  <i className="bi bi-search"></i>
                </Button>
              </InputGroup>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Results Summary */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h4 className="mb-0">
          {filteredServices.length > 0 ? (
            <>Tìm thấy {filteredServices.length} dịch vụ</>
          ) : (
            <>Không tìm thấy dịch vụ nào</>
          )}
        </h4>
        {filteredServices.length > 0 && (
          <div>
            <Badge bg="warning" text="dark" className="me-2">
              {filteredServices.filter(s => s.serviceType === 'administrative').length} Hành chính
            </Badge>
            <Badge bg="success">
              {filteredServices.filter(s => s.serviceType === 'civil').length} Dân sự
            </Badge>
          </div>
        )}
      </div>

      {/* Services Grid */}
      {filteredServices.length === 0 ? (
        <Alert variant="info" className="text-center py-5">
          <i className="bi bi-search" style={{ fontSize: '3rem' }}></i>
          <h5 className="mt-3">Không tìm thấy dịch vụ phù hợp</h5>
          <p className="text-muted">
            Thử thay đổi tiêu chí tìm kiếm hoặc bộ lọc để xem thêm dịch vụ
          </p>
          <Button 
            variant="primary" 
            onClick={() => {
              setSearchTerm('');
              setSelectedType('all');
              setSelectedMethod('all');
            }}
          >
            Xem tất cả dịch vụ
          </Button>
        </Alert>
      ) : (
        <Row>
          {filteredServices.map(service => (
            <Col key={service.id} lg={4} md={6} className="mb-4">
              <Card 
                className={`h-100 shadow-sm border-0 ${
                  service.featured ? 'border-start border-4 border-primary' : ''
                }`}
                style={{ transition: 'transform 0.2s ease' }}
                onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
                onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
              >
                {service.featured && (
                  <div className="position-relative">
                    <Badge 
                      bg="primary" 
                      className="position-absolute top-0 end-0 m-2"
                      style={{ zIndex: 1 }}
                    >
                      Nổi bật
                    </Badge>
                  </div>
                )}
                
                <Card.Header className={`border-0 ${
                  service.serviceType === 'administrative' ? 'bg-warning bg-opacity-10' : 'bg-success bg-opacity-10'
                }`}>
                  <div className="d-flex align-items-center mb-2">
                    <div className={`rounded-circle p-2 me-3 ${
                      service.serviceType === 'administrative' ? 'bg-warning' : 'bg-success'
                    }`}>
                      <i className={`${service.icon} text-white fs-5`}></i>
                    </div>
                    <div className="flex-grow-1">
                      {getServiceTypeBadge(service.serviceType)}
                    </div>
                  </div>
                </Card.Header>

                <Card.Body className="d-flex flex-column">
                  <Card.Title className="h5 mb-3">{service.title}</Card.Title>
                  <Card.Text className="text-muted flex-grow-1">
                    {service.description}
                  </Card.Text>
                  
                  {/* Price and Duration */}
                  <div className="mb-3">
                    <div className="h5 text-primary mb-1">{service.price}</div>
                    <small className="text-muted">
                      <i className="bi bi-clock me-1"></i>
                      Thời gian: {service.duration}
                    </small>
                  </div>
                  
                  {/* Collection Methods */}
                  <div className="mb-3">
                    <small className="text-muted d-block mb-2">Phương thức lấy mẫu:</small>
                    <div className="d-flex flex-wrap gap-1">
                      {getMethodBadges(service.methodDetails)}
                    </div>
                  </div>
                </Card.Body>

                <Card.Footer className="bg-white border-0">
                  <div className="d-grid gap-2">
                    <Button 
                      variant="primary" 
                      as={Link} 
                      to={`/services/${service.id}`}
                    >
                      <i className="bi bi-eye me-2"></i>
                      Xem chi tiết
                    </Button>
                    <Button 
                      variant="outline-warning" 
                      as={Link} 
                      to="/appointment"
                      state={{ selectedService: service.id }}
                    >
                      <i className="bi bi-calendar-plus me-2"></i>
                      Đặt lịch ngay
                    </Button>
                  </div>
                </Card.Footer>
              </Card>
            </Col>
          ))}
        </Row>
      )}

      {/* Call to Action */}
      <Card className="mt-5 bg-primary text-white">
        <Card.Body className="text-center py-5">
          <h3 className="mb-3">Cần tư vấn để chọn dịch vụ phù hợp?</h3>
          <p className="lead mb-4">
            Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn miễn phí 24/7
          </p>
          <div className="d-flex justify-content-center gap-3 flex-wrap">
            <Button variant="warning" size="lg">
              <i className="bi bi-telephone me-2"></i>
              Gọi hotline: 1900 1234
            </Button>
            <Button variant="outline-light" size="lg">
              <i className="bi bi-chat-dots me-2"></i>
              Chat trực tuyến
            </Button>
            <Button variant="light" size="lg" as={Link} to="/appointment">
              <i className="bi bi-calendar-plus me-2"></i>
              Đặt lịch tư vấn
            </Button>
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
};

export default ServiceList;