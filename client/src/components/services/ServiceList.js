/**
 * COMPONENT: ServiceList
 * CHỨC NĂNG: Hiển thị danh sách dịch vụ xét nghiệm ADN với các tính năng lọc và sắp xếp
 * LUỒNG HOẠT ĐỘNG:
 * 1. Tải danh sách services và methods từ API getAllServices() và getAllMethods()
 * 2. Lọc services theo loại (dân sự/hành chính) và phương thức thu mẫu
 * 3. Sắp xếp services theo tên, giá, thời gian
 * 4. Hiển thị dưới dạng grid cards với thông tin chi tiết
 * 5. Tích hợp với URL params để lưu trạng thái filter
 * 6. Xử lý authentication khi user click đặt lịch
 */

import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Form, Alert } from 'react-bootstrap';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { getAllServices, getAllMethods} from '../../services/api';
import { enrichMethodData } from '../data/services-data';
import Swal from 'sweetalert2';

const ServiceList = () => {
  // ROUTER HOOKS
  const [searchParams, setSearchParams] = useSearchParams(); // URL params cho filters
  const navigate = useNavigate(); // Hook điều hướng

  // STATE QUẢN LÝ DỮ LIỆU
  const [services, setServices] = useState([]); // Danh sách dịch vụ từ API
  const [methods, setMethods] = useState([]); // Danh sách phương thức từ API
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error message

  // STATE QUẢN LÝ UI
  const [expanded, setExpanded] = useState(false); // Trạng thái mở rộng card

  // STATE QUẢN LÝ FILTER & SORT
  const [filterType, setFilterType] = useState(searchParams.get('type') || ''); // Filter theo loại dịch vụ
  const [filterMethod, setFilterMethod] = useState(''); // Filter theo phương thức
  const [sortBy, setSortBy] = useState('name'); // Sắp xếp theo tiêu chí

  // STATE QUẢN LÝ USER
  const storedUserData = localStorage.getItem('userData'); // Thông tin user từ localStorage

  /**
   * EFFECT 1: Tải dữ liệu khi component mount
   * BƯỚC 1: Gọi fetchServices() để lấy danh sách services
   * BƯỚC 2: Gọi fetchMethods() để lấy danh sách methods
   */
  useEffect(() => {
    fetchServices();
    fetchMethods();
  }, []);

  /**
   * EFFECT 2: Đồng bộ URL params với filterType
   * BƯỚC 1: Lấy type từ URL params
   * BƯỚC 2: Cập nhật filterType nếu khác với giá trị hiện tại
   */
  useEffect(() => {
    const typeFromUrl = searchParams.get('type');
    if (typeFromUrl !== filterType) {
      setFilterType(typeFromUrl || '');
    }
  }, [searchParams]);

  /**
   * API CALL: Lấy danh sách dịch vụ từ API
   * BƯỚC 1: Set loading state thành true
   * BƯỚC 2: Gọi API getAllServices()
   * BƯỚC 3: Kiểm tra response và cập nhật state services
   * BƯỚC 4: Xử lý lỗi nếu có
   * BƯỚC 5: Set loading state thành false
   */
  const fetchServices = async () => {
    try {
      setLoading(true);
      const response = await getAllServices();

      if (response && Array.isArray(response)) {
        setServices(response);
      } else {
        setServices([]);
      }
    } catch (err) {
      setError('Không thể tải danh sách dịch vụ');
      setServices([]);
    } finally {
      setLoading(false);
    }
  };

  /**
   * API CALL: Lấy danh sách phương thức từ API
   * BƯỚC 1: Gọi API getAllMethods()
   * BƯỚC 2: Kiểm tra response và cập nhật state methods
   * BƯỚC 3: Xử lý lỗi nếu có
   */
  const fetchMethods = async () => {
    try {
      const response = await getAllMethods();

      if (response && Array.isArray(response)) {
        setMethods(response);
      } else {
        setMethods([]);
      }
    } catch (err) {
      setMethods([]);
    }
  };

  /**
   * HELPER FUNCTION: Xác định loại dịch vụ từ category
   * INPUT: category (object) - thông tin category của service
   * OUTPUT: string - 'administrative' hoặc 'civil'
   * BƯỚC 1: Kiểm tra nếu category tồn tại
   * BƯỚC 2: Trả về 'administrative' nếu hasLegalValue = true, ngược lại trả về 'civil'
   */
  const getServiceTypeFromCategory = (category) => {
    if (!category) return 'civil';
    return category.hasLegalValue ? 'administrative' : 'civil';
  };

  /**
   * HELPER FUNCTION: Format giá tiền theo định dạng VNĐ
   * INPUT: price (number/string) - giá tiền
   * OUTPUT: string - giá tiền định dạng VNĐ
   * BƯỚC 1: Kiểm tra nếu price là number
   * BƯỚC 2: Format theo định dạng Việt Nam
   * BƯỚC 3: Trả về "Liên hệ" nếu không có giá
   */
  const formatPrice = (price) => {
    if (typeof price === 'number') {
      return new Intl.NumberFormat('vi-VN').format(price) + ' VNĐ';
    }
    return price || 'Liên hệ';
  };

  /**
   * HELPER FUNCTION: Tạo badge cho loại dịch vụ
   * INPUT: serviceType (string) - loại dịch vụ
   * OUTPUT: JSX Badge component với màu và text phù hợp
   */
  const getServiceTypeBadge = (serviceType) => {
    return serviceType === 'administrative'
      ? <Badge bg="warning" text="dark" style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: '500' }}>ADN Hành chính</Badge>
      : <Badge bg="success" style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: '500' }}>ADN Dân sự</Badge>;
  };

  /**
   * HELPER FUNCTION: Tạo badges cho các phương thức thu mẫu
   * INPUT: service (object) - thông tin service
   * OUTPUT: JSX array các Badge components
   * BƯỚC 1: Lấy danh sách methods từ service.methods_via_ServiceMethod
   * BƯỚC 2: Kiểm tra nếu không có methods thì hiển thị "Đang cập nhật"
   * BƯỚC 3: Làm giàu methods với icon và color từ METHOD_MAPPING
   * BƯỚC 4: Tạo badges cho từng method
   */
  const getMethodBadges = (service) => {
    // BƯỚC 1: Lấy methods trực tiếp từ service data
    const serviceMethodsList = service.methods_via_ServiceMethod || [];

    // BƯỚC 2: Kiểm tra nếu không có methods
    if (serviceMethodsList.length === 0) {
      return (
        <Badge bg="secondary" style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: '500' }}>
          <i className="bi bi-gear me-1"></i>
          Đang cập nhật
        </Badge>
      );
    }

    // BƯỚC 3: Làm giàu methods với icon và color từ METHOD_MAPPING
    const enrichedMethods = enrichMethodData(serviceMethodsList);

    // BƯỚC 4: Tạo badges cho từng method
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

  /**
   * DATA PROCESSING: Filter services theo category và method
   * BƯỚC 1: Lọc bỏ các service không active
   * BƯỚC 2: Lọc theo loại dịch vụ (dân sự/hành chính)
   * BƯỚC 3: Lọc theo phương thức thu mẫu
   * BƯỚC 4: Trả về danh sách đã lọc
   */
  const filteredServices = services.filter(service => {
    // BƯỚC 1: Chỉ hiển thị dịch vụ đang active
    if (service.isActive === false) {
      return false;
    }

    const serviceType = getServiceTypeFromCategory(service.category);
    // BƯỚC 2: Lọc theo loại dịch vụ
    const matchesType = !filterType || serviceType === filterType;

    // BƯỚC 3: Lọc theo method nếu có
    const matchesMethod = !filterMethod ||
      (service.methods_via_ServiceMethod &&
        service.methods_via_ServiceMethod.some(method => method.id === filterMethod));

    // BƯỚC 4: Trả về kết quả
    return matchesType && matchesMethod;
  });

  /**
   * DATA PROCESSING: Sắp xếp services theo tiêu chí đã chọn
   * BƯỚC 1: Tạo copy của filteredServices
   * BƯỚC 2: Sắp xếp theo sortBy (name, price-low, price-high, duration)
   * BƯỚC 3: Trả về danh sách đã sắp xếp
   */
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

  /**
   * EVENT HANDLER: Xử lý thay đổi filter
   * INPUT: type (string) - loại filter, value (string) - giá trị mới
   * BƯỚC 1: Nếu type là 'serviceType' thì cập nhật filterType và reset filterMethod
   * BƯỚC 2: Cập nhật URL params nếu có giá trị
   * BƯỚC 3: Nếu type là 'method' thì cập nhật filterMethod
   */
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

  /**
   * EVENT HANDLER: Xử lý click navigation
   * BƯỚC 1: Đóng expanded state
   */
  const handleNavClick = () => {
    setExpanded(false);
  };

  /**
   * EVENT HANDLER: Xử lý click đặt lịch
   * INPUT: e (event) - event object
   * BƯỚC 1: Kiểm tra nếu user chưa đăng nhập
   * BƯỚC 2: Hiển thị thông báo yêu cầu đăng nhập
   * BƯỚC 3: Chuyển hướng đến trang login nếu user confirm
   * BƯỚC 4: Nếu đã đăng nhập thì xử lý bình thường
   */
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

  // LOADING STATE: Hiển thị spinner khi đang tải dữ liệu
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

  // ERROR STATE: Hiển thị thông báo lỗi nếu có
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

  return (
    <>
      {/* HERO SECTION: Tiêu đề và mô tả trang */}
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
        {/* FILTER SECTION: Bộ lọc và sắp xếp */}
        <Row className="mb-4">
          {/* Search input */}
          <Col lg={3} md={6} className="mb-3">
            <Form.Control
              type="text"
              placeholder="Tìm kiếm dịch vụ..."
              className="border-2 h-100"
              style={{ borderRadius: '12px', padding: '12px 16px', fontWeight: '500' }}
            />
          </Col>

          {/* Service type filter */}
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

          {/* Method filter */}
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

          {/* Sort options */}
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

          {/* Reset filter button */}
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

        {/* RESULTS COUNT: Hiển thị số lượng kết quả */}
        <div className="mb-4">
          <div className="d-flex align-items-center justify-content-between">
            <p className="text-muted mb-0">
              Hiển thị <strong>{sortedServices.length}</strong> dịch vụ
              {filterType && ` (${filterType === 'civil' ? 'Dân sự' : 'Hành chính'})`}
              {filterMethod && ` - Phương thức: ${methods.find(m => m.id === filterMethod)?.name}`}
            </p>
          </div>
        </div>

        {/* SERVICES GRID: Hiển thị danh sách dịch vụ */}
        {sortedServices.length === 0 ? (
          // EMPTY STATE: Hiển thị khi không có kết quả
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
          // SERVICES CARDS: Grid hiển thị các service cards
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
                    {/* CARD HEADER: Loại dịch vụ và tên */}
                    <Card.Header className={`border-0 ${serviceType === 'administrative' ? 'bg-warning bg-opacity-10' : 'bg-success bg-opacity-10'}`}>
                      {/* Service Type Badge */}
                      <div className="text-center mb-3">
                        {getServiceTypeBadge(serviceType)}
                      </div>

                      {/* Service Name và Featured Icon */}
                      <div className="d-flex align-items-center">
                        <i className={`bi ${service.featured ? 'bi-star-fill' : 'bi-star'} text-danger me-2`}
                          title={service.featured ? 'Dịch vụ nổi bật' : 'Dịch vụ thường'}></i>
                        <h6 className="mb-0 fw-bold text-dark flex-grow-1">{service.title}</h6>
                      </div>
                    </Card.Header>

                    {/* CARD BODY: Thông tin chi tiết dịch vụ */}
                    <Card.Body className="d-flex flex-column">
                      {/* Description */}
                      <div className="mb-3" style={{ minHeight: '60px' }}>
                        <Card.Text className="text-muted mb-0">
                          {service.description}
                        </Card.Text>
                      </div>

                      {/* Price and Duration */}
                      <div className="mb-3 text-center" style={{ minHeight: '50px' }}>
                        <div className="h5 text-primary mb-1">{formatPrice(service.price)}</div>
                        <small className="text-muted">
                          <i className="bi bi-clock me-1"></i>
                          Thời gian: {service.duration}
                        </small>
                      </div>

                      {/* Collection Methods */}
                      <div className="mb-3" style={{ minHeight: '80px' }}>
                        <small className="text-muted d-block mb-2">Phương thức lấy mẫu:</small>
                        <div className="d-flex flex-wrap gap-1">
                          {getMethodBadges(service)}
                        </div>
                      </div>

                      {/* Action Buttons */}
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

        {/* CTA SECTION: Call to action */}
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