/**
 * COMPONENT: ServiceList
 * MỤC ĐÍCH: Hiển thị danh sách dịch vụ xét nghiệm ADN với các tính năng lọc và sắp xếp
 * CHỨC NĂNG:
 * - Hiển thị dịch vụ dưới dạng grid cards
 * - Filter theo loại dịch vụ (dân sự/hành chính)
 * - Filter theo phương thức thu mẫu
 * - Sắp xếp theo tên/giá/thời gian
 * - Hiển thị badges cho loại dịch vụ và phương thức
 * - Tích hợp với API để lấy dữ liệu services và methods
 * - URL params sync cho filters
 * - Responsive UI cho mobile và desktop
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Alert } from 'react-bootstrap';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getAllServices, getAllMethods} from '../../services/api';
import { enrichMethodData } from '../data/services-data';
import Swal from 'sweetalert2';

const ServiceList = () => {
  // ROUTING & NAVIGATION
  const [searchParams, setSearchParams] = useSearchParams(); // URL params cho filters
  const navigate = useNavigate(); // Hook điều hướng

  // COMPONENT STATE
  const [services, setServices] = useState([]); // Danh sách dịch vụ từ API
  const [methods, setMethods] = useState([]); // Danh sách phương thức từ API
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error message
  const [expanded, setExpanded] = useState(false); // Trạng thái mở rộng card

  // FILTER & SORT STATE
  const [filterType, setFilterType] = useState(searchParams.get('type') || ''); // Filter theo loại dịch vụ
  const [filterMethod, setFilterMethod] = useState(''); // Filter theo phương thức
  const [sortBy, setSortBy] = useState('name'); // Sắp xếp theo tiêu chí

  // USER DATA
  const storedUserData = localStorage.getItem('userData'); // Thông tin user từ localStorage

  // EFFECTS & DATA FETCHING
  // Effect: Fetch dữ liệu khi component mount
  useEffect(() => {
    fetchServices();
    fetchMethods();
  }, []);

  // Effect: Sync URL params với filterType
  useEffect(() => {
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl !== filterType) {
      setFilterType(typeFromUrl || '');
    }
  }, [searchParams]);

  // API CALLS
  // Fetch danh sách dịch vụ từ API
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await getAllServices();
      console.log('Services API response:', response);

      if (response && Array.isArray(response)) {
        setServices(response);
      } else {
        setServices([]);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
      setError('Không thể tải danh sách dịch vụ');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch danh sách phương thức từ API
  const fetchMethods = async () => {
    try {
      const response = await getAllMethods();
      console.log('Methods API response:', response);

      if (response && Array.isArray(response)) {
        setMethods(response);
      } else {
        setMethods([]);
      }
    } catch (err) {
      console.error('Error fetching methods:', err);
      setMethods([]);
    }
  };

  // HELPER FUNCTIONS
  // Xác định loại dịch vụ từ category
  const getServiceTypeFromCategory = (category) => {
    if (!category) return 'civil';
    return category.hasLegalValue ? 'administrative' : 'civil';
  };

  // Format giá tiền theo định dạng VNĐ
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
    }
    return price || 'Liên hệ';
  };

  // Tạo badge cho loại dịch vụ
  const getServiceTypeBadge = (serviceType) => {
    return serviceType === 'administrative'
      ? <Badge bg="warning" text="dark" style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: '500' }}>ADN Hành chính</Badge>
      : <Badge bg="success" style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: '500' }}>ADN Dân sự</Badge>;
  };

  // Tạo badges cho các phương thức thu mẫu
  const getMethodBadges = (service) => {
    // Get methods directly from service data
    const serviceMethodsList = service.methods_via_ServiceMethod || [];

    if (serviceMethodsList.length === 0) {
      return (
        <Badge bg="secondary" style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: '500' }}>
          <i className="bi bi-gear me-1"></i>
          Đang cập nhật
        </Badge>
      );
    }

    // Làm giàu methods với icon và color từ METHOD_MAPPING
    const enrichedMethods = enrichMethodData(serviceMethodsList);

    return enrichedMethods.map(method => (
      <Badge
        key={method.id}
        bg={method.color || 'secondary'}
        className="me-2 mb-2"
        style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: '500' }}
      >
        <i className={`${method.icon || 'bi-gear'} me-1`}></i>
        {method.name}
      </Badge>
    ));
  };

  // FILTERING & SORTING
  // Filter services theo category và method
  const filteredServices = services.filter(service => {
    // Chỉ hiển thị dịch vụ đang active
    if (service.isActive === false) {
      return false;
    }

    const serviceType = getServiceTypeFromCategory(service.category);
    const matchesType = !filterType || serviceType === filterType;

    // Filter theo method nếu có
    const matchesMethod = !filterMethod ||
      (service.methods_via_ServiceMethod &&
        service.methods_via_ServiceMethod.some(method => method.id === filterMethod));

    return matchesType && matchesMethod;
  });

  // Sắp xếp services theo tiêu chí đã chọn
  const sortedServices = [...filteredServices].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return a.title.localeCompare(b.title);
      case 'price-low':
        return (a.price || 0) - (b.price || 0);
      case 'price-high':
        return (b.price || 0) - (a.price || 0);
      case 'duration':
        return a.duration.localeCompare(b.duration);
      default:
        return 0;
    }
  });

  // EVENT HANDLERS
  // Xử lý thay đổi filter
  const handleFilterChange = (type, value) => {
    if (type === 'serviceType') {
      setFilterType(value);
      setFilterMethod(''); // Reset method filter khi đổi service type
      // Cập nhật URL params
      if (value) {
        setSearchParams({ type: value });
      } else {
        setSearchParams({});
      }
    } else if (type === 'method') {
      setFilterMethod(value);
    }
  };

  // LOADING STATE
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Đang tải danh sách dịch vụ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error}
        </Alert>
      </Container>
    );
  }

  const handleNavClick = () => {
    setExpanded(false);
  };
  // Kiểm tra xem người dùng đã đăng nhập chưa
  const handleBookingClick = (e) => {
    if (!storedUserData) {
      e.preventDefault(); // chặn click chuyển trang
      Swal.fire({
        icon: 'info',
        title: 'Bạn chưa đăng nhập',
        text: 'Vui lòng đăng nhập để đặt lịch xét nghiệm',
        confirmButtonText: 'Đăng nhập ngay',
        confirmButtonColor: '#3085d6',
      }).then((result) => {
        if (result.isConfirmed) {
          navigate('/login', { state: { redirectTo: '/appointment' } });
        }
      });
    } else {
      handleNavClick(); // vẫn xử lý bình thường nếu đã login
    }
  };

  return (
    <>
      {/* Hero Section - Style giống ServiceDetail */}
      <section className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">
                Danh sách dịch vụ xét nghiệm ADN
              </h1>
              <p className="lead mb-4">
                Chọn dịch vụ phù hợp với nhu cầu của bạn - Độ chính xác 99.9999% với công nghệ hiện đại
              </p>

            </Col>
            <Col lg={4} className="text-end d-none d-lg-block">
              <i className="bi bi-grid-3x3" style={{
                fontSize: '10rem',
                color: 'rgb(255, 255, 255)'
              }}></i>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        {/* Filter Section */}
        {/* Filters - All in one row */}
        <Row className="mb-4">
          <Col lg={3} md={6} className="mb-3">
            <Form.Control
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              className="border-2 h-100"
              style={{ borderRadius: '12px', padding: '12px 16px', fontWeight: '500' }}
            />
          </Col>

          <Col lg={2} md={6} className="mb-3">
            <Form.Select
              value={filterType}
              onChange={(e) => handleFilterChange('serviceType', e.target.value)}
              className="border-2 h-100"
              style={{ borderRadius: '12px', padding: '12px 16px', fontWeight: '500' }}
            >
              <option value="">Tất cả loại dịch vụ</option>
              <option value="civil">ADN Dân sự</option>
              <option value="administrative">ADN Hành chính</option>
            </Form.Select>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <Form.Select
              value={filterMethod}
              onChange={(e) => handleFilterChange('method', e.target.value)}
              className="border-2 h-100"
              style={{ borderRadius: '12px', padding: '12px 16px', fontWeight: '500' }}
            >
              <option value="">Tất cả phương thức lấy mẫu</option>
              {methods.map(method => (
                <option key={method.id} value={method.id}>
                  {method.name}
                </option>
              ))}
            </Form.Select>
          </Col>

          <Col lg={3} md={6} className="mb-3">
            <Form.Select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              className="border-2 h-100"
              style={{ borderRadius: '12px', padding: '12px 16px', fontWeight: '500' }}
            >
              <option value="name">Sắp xếp theo tên</option>
              <option value="price-low">Giá thấp → cao</option>
              <option value="price-high">Giá cao → thấp</option>
              <option value="duration">Thời gian</option>
            </Form.Select>
          </Col>

          <Col lg={1} md={6} className="mb-3">
            <Button
              variant="outline-secondary"
              onClick={() => {
                setFilterType('');
                setFilterMethod('');
                setSortBy('name');
              }}
              className="w-100 h-100"
              style={{ borderRadius: '12px', padding: '12px 16px', fontWeight: '600' }}
              title="Đặt lại bộ lọc"
            >
              <i className="bi bi-arrow-clockwise"></i>
            </Button>
          </Col>
        </Row>

        {/* Results count */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between">
            <p className="text-muted mb-0">
              Hiển thị <strong>{sortedServices.length}</strong> dịch vụ
              {filterType && ` (${filterType === 'civil' ? 'Dân sự' : 'Hành chính'})`}
              {filterMethod && ` - Phương thức: ${methods.find(m => m.id === filterMethod)?.name}`}
            </p>
          </div>
        </div>

        {/* Services Grid */}
        {sortedServices.length === 0 ? (
          <Alert variant="info" className="text-center py-5">
            <i className="bi bi-info-circle fs-1 mb-3 d-block"></i>
            <h4>Không tìm thấy dịch vụ phù hợp</h4>
            <p className="mb-3">Hãy thử thay đổi bộ lọc hoặc liên hệ với chúng tôi để được tư vấn</p>
            <Button
              variant="primary"
              onClick={() => {
                setFilterType('');
                setFilterMethod('');
                setSortBy('name');
              }}
              style={{ borderRadius: '12px', padding: '12px 24px', fontWeight: '600' }}
            >
              <i className="bi bi-arrow-clockwise me-2"></i>
              Xem tất cả dịch vụ
            </Button>
          </Alert>
        ) : (
          <Row>
            {sortedServices.map(service => {
              const serviceType = getServiceTypeFromCategory(service.category);
              return (
                <Col key={service.id} lg={4} md={6} className="mb-4">
                  <Card
                    className="h-100 border-0 shadow-sm"
                    style={{
                      borderRadius: '16px',
                      boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
                      transition: 'all 0.3s ease',
                      cursor: 'pointer'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.transform = 'translateY(-5px)';
                      e.currentTarget.style.boxShadow = '0 8px 30px rgba(0,0,0,0.15)';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.transform = '';
                      e.currentTarget.style.boxShadow = '0 4px 20px rgba(0,0,0,0.08)';
                    }}
                  >
                    <Card.Header className={`border-0 ${serviceType === 'administrative' ? 'bg-warning bg-opacity-10' : 'bg-success bg-opacity-10'
                      }`}>
                      {/* Service Type - Căn giữa */}
                      <div className="text-center mb-3">
                        {getServiceTypeBadge(serviceType)}
                      </div>

                      {/* Service Name và Featured - Cùng hàng */}
                      <div className="d-flex align-items-center">
                        <i className={`bi ${service.featured ? 'bi-star-fill' : 'bi-star'} text-danger me-2`}
                          title={service.featured ? 'Dịch vụ nổi bật' : 'Dịch vụ thường'}></i>
                        <h6 className="mb-0 fw-bold text-dark flex-grow-1">{service.title}</h6>
                      </div>
                    </Card.Header>

                    <Card.Body className="d-flex flex-column">
                      {/* Description - Fixed height */}
                      <div className="mb-3" style={{ minHeight: '60px' }}>
                        <Card.Text className="text-muted mb-0">
                          {service.description}
                        </Card.Text>
                      </div>

                      {/* Price and Duration - Fixed height */}
                      <div className="mb-3 text-center" style={{ minHeight: '50px' }}>
                        <div className="h5 text-primary mb-1">{formatPrice(service.price)}</div>
                        <small className="text-muted">
                          <i className="bi bi-clock me-1"></i>
                          Thời gian: {service.duration}
                        </small>
                      </div>

                      {/* Collection Methods - Fixed height */}
                      <div className="mb-3" style={{ minHeight: '80px' }}>
                        <small className="text-muted d-block mb-2">Phương thức lấy mẫu:</small>
                        <div className="d-flex flex-wrap gap-1">
                          {getMethodBadges(service)}
                        </div>
                      </div>

                      {/* Buttons - Fixed at bottom */}
                      <div className="d-grid gap-2 mt-auto">
                        <Button
                          variant="outline-primary"
                          as={Link}
                          to={`/services/${encodeURIComponent(service.id)}`}
                          className="fw-bold"
                          style={{ borderRadius: '12px', padding: '12px 24px', fontWeight: '600' }}
                        >
                          <i className="bi bi-eye me-2"></i>
                          Xem chi tiết
                        </Button>
                        <Button
                          variant="primary"
                          as={Link}
                          to="/appointment"
                          onClick={handleBookingClick}
                          state={{ selectedService: service.id }}
                          className="fw-bold"
                          style={{ borderRadius: '12px', padding: '12px 24px', fontWeight: '600' }}
                        >
                          <i className="bi bi-calendar-plus me-2"></i>
                          Đặt lịch ngay
                        </Button>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              );
            })}
          </Row>
        )}

        {/* CTA Section */}
        <div className="text-center mt-5 pt-5">
          <div className="bg-light rounded-4 p-5" style={{ borderRadius: '24px' }}>
            <h3 className="mb-3 fw-bold">Cần tư vấn chọn dịch vụ phù hợp?</h3>
            <p className="lead text-muted mb-4">
              Đội ngũ chuyên gia của chúng tôi sẵn sàng tư vấn và hỗ trợ bạn 24/7
            </p>
            <div className="d-flex justify-content-center gap-3 flex-wrap">
              <Button
                variant="primary"
                size="lg"
                as={Link}
                to="/appointment"
                className="fw-bold"
                style={{ borderRadius: '12px', padding: '12px 24px', fontWeight: '600' }}
              >
                <i className="bi bi-calendar-plus me-2"></i>
                Đặt lịch ngay
              </Button>
              <Button
                variant="outline-primary"
                size="lg"
                className="fw-bold"
                style={{ borderRadius: '12px', padding: '12px 24px', fontWeight: '600' }}
              >
                <i className="bi bi-telephone me-2"></i>
                Gọi tư vấn: 1900 1234
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </>
  );
};

export default ServiceList;