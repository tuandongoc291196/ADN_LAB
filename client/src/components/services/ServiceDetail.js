/**
 * COMPONENT: ServiceDetail
 * CHỨC NĂNG: Hiển thị chi tiết một dịch vụ xét nghiệm ADN cụ thể
 * LUỒNG HOẠT ĐỘNG:
 * 1. Lấy ID dịch vụ từ URL params và decode
 * 2. Tải thông tin dịch vụ từ API getAllServices() và tìm service theo ID
 * 3. Tải danh sách methods từ API getAllMethods() và getMethodsByServiceId()
 * 4. Hiển thị thông tin chi tiết dịch vụ với tabs: Quy trình → Yêu cầu → FAQ
 * 5. Xử lý authentication khi user click đặt lịch
 * 6. Hiển thị các phương thức thu mẫu có sẵn cho dịch vụ
 */

import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert, ListGroup, Nav, Tab } from 'react-bootstrap';
import { getAllServices, getAllMethods, getMethodsByServiceId } from '../../services/api';
import { enrichMethodData } from '../data/services-data';
import Swal from 'sweetalert2';

const ServiceDetail = () => {
  // ROUTER HOOKS
  const { id } = useParams(); // ID dịch vụ từ URL params
  const navigate = useNavigate(); // Hook điều hướng

  // STATE QUẢN LÝ DỮ LIỆU
  const [service, setService] = useState(null); // Thông tin dịch vụ
  const [methods, setMethods] = useState([]); // Danh sách tất cả phương thức
  const [serviceMethods, setServiceMethods] = useState([]); // Phương thức của dịch vụ này
  const [loading, setLoading] = useState(true); // Loading state
  const [error, setError] = useState(null); // Error message

  // STATE QUẢN LÝ UI
  const [expanded, setExpanded] = useState(false); // Trạng thái mở rộng mô tả
  const [activeTab, setActiveTab] = useState('process'); // Tab đang active
  const [openFaq, setOpenFaq] = useState(null); // FAQ đang mở

  // STATE QUẢN LÝ USER
  const storedUserData = JSON.parse(localStorage.getItem('userData')); // Thông tin user

  /**
   * EFFECT: Tải dữ liệu khi ID thay đổi
   * BƯỚC 1: Gọi fetchServiceData() khi component mount hoặc id thay đổi
   */
  useEffect(() => {
    fetchServiceData();
  }, [id]);

  /**
   * API CALL: Tải dữ liệu dịch vụ và phương thức
   * BƯỚC 1: Set loading state và reset error
   * BƯỚC 2: Gọi API getAllServices() để lấy danh sách services
   * BƯỚC 3: Tìm service theo ID với nhiều cách khớp khác nhau
   * BƯỚC 4: Kiểm tra trạng thái active của service
   * BƯỚC 5: Gọi fetchServiceMethods() để lấy methods cho service
   * BƯỚC 6: Gọi API getAllMethods() để lấy tất cả methods
   * BƯỚC 7: Xử lý lỗi và set loading state
   */
  const fetchServiceData = async () => {
    try {
      setLoading(true);
      setError(null);

      // BƯỚC 2: Fetch danh sách dịch vụ
      const servicesResponse = await getAllServices();

      if (servicesResponse && Array.isArray(servicesResponse)) {
        const decodedId = decodeURIComponent(id);

        // BƯỚC 3: Tìm dịch vụ theo ID - thử các cách khớp khác nhau
        let foundService = servicesResponse.find(s => s.id === decodedId); // Khớp chính xác

        if (!foundService) { // Khớp không phân biệt hoa thường
          foundService = servicesResponse.find(s =>
            s.id.toLowerCase() === decodedId.toLowerCase()
          );
        }

        if (!foundService) { // Khớp một phần
          foundService = servicesResponse.find(s =>
            s.id.includes(decodedId) || decodedId.includes(s.id)
          );
        }

        if (foundService) {
          // BƯỚC 4: Kiểm tra trạng thái active của dịch vụ
          if (foundService.isActive === false) {
            setError('Dịch vụ này hiện không khả dụng');
            return;
          }
          
          setService(foundService);
          // BƯỚC 5: Fetch phương thức cho dịch vụ này
          await fetchServiceMethods(foundService.id);
        } else {
          setError('Không tìm thấy dịch vụ');
        }
      } else {
        setError('Không thể tải thông tin dịch vụ');
      }

      // BƯỚC 6: Fetch tất cả phương thức để tham chiếu
      const methodsResponse = await getAllMethods();

      if (methodsResponse && Array.isArray(methodsResponse)) {
        setMethods(methodsResponse);
      }
    } catch (err) {
      setError('Có lỗi xảy ra khi tải thông tin dịch vụ');
    } finally {
      setLoading(false);
    }
  };

  /**
   * API CALL: Tải phương thức cho dịch vụ cụ thể
   * BƯỚC 1: Gọi API getMethodsByServiceId() với serviceId
   * BƯỚC 2: Kiểm tra response và cập nhật state serviceMethods
   * BƯỚC 3: Xử lý lỗi nếu có
   */
  const fetchServiceMethods = async (serviceId) => {
    try {
      const response = await getMethodsByServiceId(serviceId);

      if (response && Array.isArray(response)) {
        setServiceMethods(response);
      } else {
        setServiceMethods([]);
      }
    } catch (err) {
      setServiceMethods([]);
    }
  };

  /**
   * HELPER FUNCTION: Lấy icon cho dịch vụ với fallback
   * INPUT: service (object) - thông tin service
   * OUTPUT: string - tên icon Bootstrap
   * BƯỚC 1: Kiểm tra nếu service có icon
   * BƯỚC 2: Map các icon đặc biệt từ BE sang Bootstrap Icons
   * BƯỚC 3: Kiểm tra trong mapping và trả về icon tương ứng
   * BƯỚC 4: Thêm prefix bi- nếu chưa có
   * BƯỚC 5: Trả về icon mặc định nếu không có
   */
  const getServiceIcon = (service) => {
    if (service.icon) {
      // BƯỚC 2: Map các icon đặc biệt từ BE sang Bootstrap Icons
      const iconMapping = {
        'siblings-icon': 'bi-people-fill',      // Icon anh chị em
        'parent-child-icon': 'bi-person-heart', // Icon cha mẹ - con
        'paternity-icon': 'bi-person-check',    // Icon huyết thống cha
        'maternity-icon': 'bi-person-heart-fill', // Icon huyết thống mẹ
        'grandparent-icon': 'bi-people',        // Icon ông bà
        'twin-icon': 'bi-person-badge',         // Icon sinh đôi
        'ancestry-icon': 'bi-diagram-3',        // Icon phả hệ
        'health-icon': 'bi-heart-pulse',        // Icon sức khỏe
        'forensic-icon': 'bi-shield-check',     // Icon pháp y
        'immigration-icon': 'bi-passport'       // Icon nhập tịch
      };

      // BƯỚC 3: Kiểm tra trong mapping
      if (iconMapping[service.icon]) {
        return iconMapping[service.icon];
      }

      // Giữ nguyên nếu đã có prefix bi-
      if (service.icon.startsWith('bi-')) {
        return service.icon;
      }

      // BƯỚC 4: Thêm prefix bi- nếu chưa có
      const iconWithPrefix = `bi-${service.icon}`;
      return iconWithPrefix;
    }

    // BƯỚC 5: Icon mặc định cho dịch vụ ADN
    return 'bi-dna';
  };

  /**
   * HELPER FUNCTION: Xác định loại dịch vụ từ category
   * INPUT: category (object) - thông tin category của service
   * OUTPUT: string - 'administrative' hoặc 'civil'
   */
  const getServiceTypeFromCategory = (category) => {
    if (!category) return 'civil';
    return category.hasLegalValue ? 'administrative' : 'civil';
  };

  /**
   * HELPER FUNCTION: Format giá tiền theo định dạng VNĐ
   * INPUT: price (number/string) - giá tiền
   * OUTPUT: string - giá tiền định dạng VNĐ
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
   * OUTPUT: JSX array các Badge components
   * BƯỚC 1: Kiểm tra nếu không có serviceMethods thì hiển thị "Đang cập nhật"
   * BƯỚC 2: Làm giàu methods với icon và color từ METHOD_MAPPING
   * BƯỚC 3: Tạo badges cho từng method
   */
  const getMethodBadges = () => {
    if (serviceMethods.length === 0) {
      return (
        <Badge bg="secondary" style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: '500' }}>
          <i className="bi bi-gear me-1"></i>
          Đang cập nhật
        </Badge>
      );
    }

    // BƯỚC 2: Làm giàu methods với icon và color
    const enrichedMethods = enrichMethodData(serviceMethods);

    // BƯỚC 3: Tạo badges cho từng method
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
   * HELPER FUNCTION: Lấy chi tiết của một phương thức
   * INPUT: methodId (string) - ID của method
   * OUTPUT: object - thông tin method hoặc undefined
   */
  const getMethodDetails = (methodId) => {
    return methods.find(m => m.id === methodId);
  };

  /**
   * EVENT HANDLER: Toggle FAQ item
   * INPUT: faqId (string) - ID của FAQ item
   * BƯỚC 1: Nếu faqId đang mở thì đóng, ngược lại thì mở
   */
  const toggleFaq = (faqId) => {
    setOpenFaq(openFaq === faqId ? null : faqId);
  };

  // LOADING STATE: Hiển thị spinner khi đang tải dữ liệu
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
        <p className="mt-3 text-muted">Đang tải thông tin dịch vụ...</p>
      </div>
    );
  }

  // ERROR STATE: Hiển thị thông báo lỗi nếu có
  if (error || !service) {
    return (
      <Container className="py-5">
        <Alert variant="danger">
          <i className="bi bi-exclamation-triangle me-2"></i>
          {error || 'Không tìm thấy dịch vụ'}
        </Alert>

        {/* DEBUG INFORMATION: Thông tin debug */}
        <div className="mt-4 p-3 bg-light rounded">
          <h6>Debug Information:</h6>
          <p><strong>ID from URL:</strong> {id}</p>
          <p><strong>Decoded ID:</strong> {id ? decodeURIComponent(id) : 'undefined'}</p>
          <p><strong>Current URL:</strong> {window.location.href}</p>
          <p><strong>Error:</strong> {error}</p>
          <Button
            variant="outline-info"
            size="sm"
            onClick={() => {
              fetchServiceData();
            }}
            className="me-2"
          >
            Debug - Retry Fetch
          </Button>
          <Button
            variant="outline-warning"
            size="sm"
            onClick={() => {
              navigate('/services');
            }}
            className="me-2"
          >
            Test - Go to Services
          </Button>
        </div>

        <div className="text-center mt-4">
          <Button
            variant="primary"
            as={Link}
            to="/services"
            style={{ borderRadius: '12px', padding: '12px 24px', fontWeight: '600' }}
          >
            <i className="bi bi-arrow-left me-2"></i>
            Quay lại danh sách dịch vụ
          </Button>
        </div>
      </Container>
    );
  }

  const serviceType = getServiceTypeFromCategory(service.category);

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

  return (
    <>
      {/* Hero Section - Style giống Blog.js */}
      <section className={`py-5 ${serviceType === 'administrative' ? 'bg-warning text-dark' : 'bg-success text-white'
        }`}>
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">{service.title}</h1>
              <p className="lead mb-4">
                {service.description}
              </p>
            </Col>
            <Col lg={4} className="text-end d-none d-lg-block">
              <i className={getServiceIcon(service)} style={{
                fontSize: '10rem',
                color: 'rgba(255,255,255,0.5)'
              }}></i>
            </Col>
          </Row>
        </Container>
      </section>

      <Container className="py-5">
        <Row>
          {/* Main Content */}
          <Col lg={8}>
            {/* Mô tả chi tiết dịch vụ */}
            <Card className="mb-4 border-0 shadow-sm" style={{ borderRadius: '16px' }}>
              <Card.Header className="border-0 bg-light">
                <h4 className="mb-0">
                  <i className="bi bi-info-circle text-primary me-2"></i>
                  Chi tiết dịch vụ
                </h4>
              </Card.Header>
              <Card.Body>
                <p className="lead">{service.fullDescription}</p>
                {service.detailedDescription && (
                  <p className="text-muted">{service.detailedDescription}</p>
                )}
              </Card.Body>
            </Card>

            {/* Thông tin loại dịch vụ */}
            <Card className="mb-4 border-0 shadow-sm" style={{ borderRadius: '16px' }}>
              <Card.Header className="border-0 bg-light">
                <h4 className="mb-0">
                  <i className="bi bi-tag text-primary me-2"></i>
                  Thông tin loại dịch vụ
                </h4>
              </Card.Header>
              <Card.Body>
                <Row>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>Loại dịch vụ:</strong>
                      <div className="mt-2">{getServiceTypeBadge(serviceType)}</div>
                    </div>
                    <div className="mb-3">
                      <strong>Thời gian thực hiện:</strong>
                      <div className="mt-2">
                        <i className="bi bi-clock me-2"></i>
                        {service.duration}
                      </div>
                    </div>
                  </Col>
                  <Col md={6}>
                    <div className="mb-3">
                      <strong>Giá dịch vụ:</strong>
                      <div className="mt-2 h5 text-primary">{formatPrice(service.price)}</div>
                    </div>
                    <div className="mb-3">
                      <strong>Phương thức lấy mẫu:</strong>
                      <div className="mt-2">
                        {getMethodBadges()}
                      </div>
                    </div>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Tab System */}
            <Card className="border-0 shadow-sm" style={{ borderRadius: '16px' }}>
              <Card.Header className="border-0 bg-light">
                <Nav variant="tabs" className="border-0">
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === 'process'}
                      onClick={() => setActiveTab('process')}
                      className="border-0"
                      style={{
                        borderRadius: '8px 8px 0 0',
                        fontWeight: activeTab === 'process' ? '600' : '400',
                        color: activeTab === 'process' ? '#0d6efd' : '#6c757d',
                        backgroundColor: activeTab === 'process' ? 'white' : 'transparent'
                      }}
                    >
                      <i className="bi bi-list-check me-2"></i>
                      Quy trình thực hiện
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === 'faq'}
                      onClick={() => setActiveTab('faq')}
                      className="border-0"
                      style={{
                        borderRadius: '8px 8px 0 0',
                        fontWeight: activeTab === 'faq' ? '600' : '400',
                        color: activeTab === 'faq' ? '#0d6efd' : '#6c757d',
                        backgroundColor: activeTab === 'faq' ? 'white' : 'transparent'
                      }}
                    >
                      <i className="bi bi-question-circle me-2"></i>
                      Câu hỏi thường gặp
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === 'features'}
                      onClick={() => setActiveTab('features')}
                      className="border-0"
                      style={{
                        borderRadius: '8px 8px 0 0',
                        fontWeight: activeTab === 'features' ? '600' : '400',
                        color: activeTab === 'features' ? '#0d6efd' : '#6c757d',
                        backgroundColor: activeTab === 'features' ? 'white' : 'transparent'
                      }}
                    >
                      <i className="bi bi-star me-2"></i>
                      Đặc điểm nổi bật
                    </Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link
                      active={activeTab === 'contact'}
                      onClick={() => setActiveTab('contact')}
                      className="border-0"
                      style={{
                        borderRadius: '8px 8px 0 0',
                        fontWeight: activeTab === 'contact' ? '600' : '400',
                        color: activeTab === 'contact' ? '#0d6efd' : '#6c757d',
                        backgroundColor: activeTab === 'contact' ? 'white' : 'transparent'
                      }}
                    >
                      <i className="bi bi-headset me-2"></i>
                      Liên hệ tư vấn
                    </Nav.Link>
                  </Nav.Item>
                </Nav>
              </Card.Header>
              <Card.Body style={{ backgroundColor: 'white' }}>
                <Tab.Content>
                  <Tab.Pane active={activeTab === 'process'}>
                    <h5>Quy trình thực hiện</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="d-flex align-items-start mb-3">
                          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                            <span className="fw-bold">1</span>
                          </div>
                          <div>
                            <h6>Đăng ký và tư vấn</h6>
                            <p className="text-muted small">Liên hệ với chúng tôi để được tư vấn và đăng ký dịch vụ</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-start mb-3">
                          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                            <span className="fw-bold">2</span>
                          </div>
                          <div>
                            <h6>Thu thập mẫu</h6>
                            <p className="text-muted small">Thực hiện thu thập mẫu theo phương thức phù hợp</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-start mb-3">
                          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                            <span className="fw-bold">3</span>
                          </div>
                          <div>
                            <h6>Phân tích trong phòng thí nghiệm</h6>
                            <p className="text-muted small">Mẫu được phân tích bằng công nghệ hiện đại</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-start mb-3">
                          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                            <span className="fw-bold">4</span>
                          </div>
                          <div>
                            <h6>Trả kết quả</h6>
                            <p className="text-muted small">Kết quả được trả trong thời gian cam kết</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>

                  <Tab.Pane active={activeTab === 'faq'}>
                    <h5>Câu hỏi thường gặp</h5>
                    <div className="accordion" id="faqAccordion">
                      {/* Câu hỏi 1 */}
                      <div className="accordion-item border-0 mb-3 shadow-sm" style={{ borderRadius: '12px' }}>
                        <h2 className="accordion-header" id="faq1">
                          <button
                            className={`accordion-button ${openFaq !== 'faq1' ? 'collapsed' : ''} border-0`}
                            type="button"
                            onClick={() => toggleFaq('faq1')}
                            style={{
                              borderRadius: '12px',
                              backgroundColor: openFaq === 'faq1' ? '#f8f9fa' : 'white',
                              fontWeight: '600'
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                                <span className="fw-bold small">1</span>
                              </div>
                              <span>Xét nghiệm ADN có chính xác không?</span>
                            </div>
                          </button>
                        </h2>
                        <div
                          id="collapse1"
                          className={`accordion-collapse collapse ${openFaq === 'faq1' ? 'show' : ''}`}
                          data-bs-parent="#faqAccordion"
                        >
                          <div className="accordion-body pt-0">
                            <p className="text-muted mb-2">Xét nghiệm ADN huyết thống có độ chính xác lên đến 99.9999%. Chúng tôi sử dụng công nghệ hiện đại và quy trình nghiêm ngặt để đảm bảo kết quả chính xác tuyệt đối.</p>
                            <small className="text-info">
                              <i className="bi bi-info-circle me-1"></i>
                              Độ chính xác: 99.9999%
                            </small>
                          </div>
                        </div>
                      </div>

                      {/* Câu hỏi 2 */}
                      <div className="accordion-item border-0 mb-3 shadow-sm" style={{ borderRadius: '12px' }}>
                        <h2 className="accordion-header" id="faq2">
                          <button
                            className={`accordion-button ${openFaq !== 'faq2' ? 'collapsed' : ''} border-0`}
                            type="button"
                            onClick={() => toggleFaq('faq2')}
                            style={{
                              borderRadius: '12px',
                              backgroundColor: openFaq === 'faq2' ? '#f8f9fa' : 'white',
                              fontWeight: '600'
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                                <span className="fw-bold small">2</span>
                              </div>
                              <span>Cần bao nhiêu mẫu để xét nghiệm?</span>
                            </div>
                          </button>
                        </h2>
                        <div
                          id="collapse2"
                          className={`accordion-collapse collapse ${openFaq === 'faq2' ? 'show' : ''}`}
                          data-bs-parent="#faqAccordion"
                        >
                          <div className="accordion-body pt-0">
                            <p className="text-muted mb-2">Chỉ cần 2-3 giọt máu hoặc mẫu niêm mạc miệng từ mỗi người tham gia. Mẫu được thu thập đơn giản, không đau và an toàn tuyệt đối.</p>
                            <small className="text-info">
                              <i className="bi bi-info-circle me-1"></i>
                              Mẫu: Máu hoặc niêm mạc miệng
                            </small>
                          </div>
                        </div>
                      </div>

                      {/* Câu hỏi 3 */}
                      <div className="accordion-item border-0 mb-3 shadow-sm" style={{ borderRadius: '12px' }}>
                        <h2 className="accordion-header" id="faq3">
                          <button
                            className={`accordion-button ${openFaq !== 'faq3' ? 'collapsed' : ''} border-0`}
                            type="button"
                            onClick={() => toggleFaq('faq3')}
                            style={{
                              borderRadius: '12px',
                              backgroundColor: openFaq === 'faq3' ? '#f8f9fa' : 'white',
                              fontWeight: '600'
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                                <span className="fw-bold small">3</span>
                              </div>
                              <span>Thời gian có kết quả là bao lâu?</span>
                            </div>
                          </button>
                        </h2>
                        <div
                          id="collapse3"
                          className={`accordion-collapse collapse ${openFaq === 'faq3' ? 'show' : ''}`}
                          data-bs-parent="#faqAccordion"
                        >
                          <div className="accordion-body pt-0">
                            <p className="text-muted mb-2">Thời gian trả kết quả từ 3-7 ngày làm việc tùy theo loại dịch vụ. Kết quả sẽ được gửi qua email và có thể in tại nhà hoặc nhận bản cứng tại trung tâm.</p>
                            <small className="text-info">
                              <i className="bi bi-info-circle me-1"></i>
                              Thời gian: 3-7 ngày làm việc
                            </small>
                          </div>
                        </div>
                      </div>

                      {/* Câu hỏi 4 */}
                      <div className="accordion-item border-0 mb-3 shadow-sm" style={{ borderRadius: '12px' }}>
                        <h2 className="accordion-header" id="faq4">
                          <button
                            className={`accordion-button ${openFaq !== 'faq4' ? 'collapsed' : ''} border-0`}
                            type="button"
                            onClick={() => toggleFaq('faq4')}
                            style={{
                              borderRadius: '12px',
                              backgroundColor: openFaq === 'faq4' ? '#f8f9fa' : 'white',
                              fontWeight: '600'
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                                <span className="fw-bold small">4</span>
                              </div>
                              <span>Xét nghiệm ADN có bảo mật không?</span>
                            </div>
                          </button>
                        </h2>
                        <div
                          id="collapse4"
                          className={`accordion-collapse collapse ${openFaq === 'faq4' ? 'show' : ''}`}
                          data-bs-parent="#faqAccordion"
                        >
                          <div className="accordion-body pt-0">
                            <p className="text-muted mb-2">Thông tin và kết quả xét nghiệm được bảo mật tuyệt đối. Chỉ người được ủy quyền mới có thể truy cập thông tin. Mọi dữ liệu được mã hóa và lưu trữ an toàn.</p>
                            <small className="text-info">
                              <i className="bi bi-info-circle me-1"></i>
                              Bảo mật: 100% tuyệt đối
                            </small>
                          </div>
                        </div>
                      </div>

                      {/* Câu hỏi 5 */}
                      <div className="accordion-item border-0 mb-3 shadow-sm" style={{ borderRadius: '12px' }}>
                        <h2 className="accordion-header" id="faq5">
                          <button
                            className={`accordion-button ${openFaq !== 'faq5' ? 'collapsed' : ''} border-0`}
                            type="button"
                            onClick={() => toggleFaq('faq5')}
                            style={{
                              borderRadius: '12px',
                              backgroundColor: openFaq === 'faq5' ? '#f8f9fa' : 'white',
                              fontWeight: '600'
                            }}
                          >
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '32px', height: '32px', minWidth: '32px' }}>
                                <span className="fw-bold small">5</span>
                              </div>
                              <span>Sự khác biệt giữa ADN dân sự và hành chính?</span>
                            </div>
                          </button>
                        </h2>
                        <div
                          id="collapse5"
                          className={`accordion-collapse collapse ${openFaq === 'faq5' ? 'show' : ''}`}
                          data-bs-parent="#faqAccordion"
                        >
                          <div className="accordion-body pt-0">
                            <p className="text-muted mb-2">ADN dân sự: Mục đích cá nhân, không có giá trị pháp lý. ADN hành chính: Có giá trị pháp lý, được sử dụng trong các thủ tục hành chính, tòa án, làm giấy tờ.</p>
                            <small className="text-info">
                              <i className="bi bi-info-circle me-1"></i>
                              Hành chính: Có giá trị pháp lý
                            </small>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>

                  <Tab.Pane active={activeTab === 'features'}>
                    <h5>Đặc điểm nổi bật</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="d-flex align-items-start mb-3">
                          <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                            <i className="bi bi-check-lg"></i>
                          </div>
                          <div>
                            <h6>Độ chính xác cao</h6>
                            <p className="text-muted small">Kết quả có độ chính xác lên đến 99.9999%</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-start mb-3">
                          <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                            <i className="bi bi-check-lg"></i>
                          </div>
                          <div>
                            <h6>Bảo mật tuyệt đối</h6>
                            <p className="text-muted small">Thông tin và kết quả được bảo mật nghiêm ngặt</p>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-start mb-3">
                          <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                            <i className="bi bi-check-lg"></i>
                          </div>
                          <div>
                            <h6>Thời gian nhanh chóng</h6>
                            <p className="text-muted small">Kết quả được trả trong thời gian cam kết</p>
                          </div>
                        </div>
                        <div className="d-flex align-items-start mb-3">
                          <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-3" style={{ width: '40px', height: '40px', minWidth: '40px' }}>
                            <i className="bi bi-check-lg"></i>
                          </div>
                          <div>
                            <h6>Hỗ trợ 24/7</h6>
                            <p className="text-muted small">Đội ngũ chuyên gia sẵn sàng hỗ trợ mọi lúc</p>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Tab.Pane>

                  <Tab.Pane active={activeTab === 'contact'}>
                    <h5>Liên hệ tư vấn</h5>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="d-flex align-items-start mb-4">
                          <div className="rounded-circle bg-primary text-white d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', minWidth: '50px' }}>
                            <i className="bi bi-telephone fs-4"></i>
                          </div>
                          <div>
                            <h6 className="mb-2">Hotline tư vấn</h6>
                            <p className="text-muted small mb-1">Gọi ngay để được tư vấn miễn phí</p>
                            <div className="h5 text-primary mb-1">1900 1234</div>
                            <small className="text-muted">Hỗ trợ 24/7</small>
                          </div>
                        </div>
                        <div className="d-flex align-items-start mb-4">
                          <div className="rounded-circle bg-info text-white d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', minWidth: '50px' }}>
                            <i className="bi bi-envelope fs-4"></i>
                          </div>
                          <div>
                            <h6 className="mb-2">Email tư vấn</h6>
                            <p className="text-muted small mb-1">Gửi email để được tư vấn chi tiết</p>
                            <div className="h6 text-info mb-1">support@adnlab.vn</div>
                            <small className="text-muted">Phản hồi trong 2h</small>
                          </div>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="d-flex align-items-start mb-4">
                          <div className="rounded-circle bg-success text-white d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', minWidth: '50px' }}>
                            <i className="bi bi-chat-dots fs-4"></i>
                          </div>
                          <div>
                            <h6 className="mb-2">Tư vấn trực tuyến</h6>
                            <p className="text-muted small mb-1">Chat với chuyên gia ngay</p>
                            <Button
                              variant="outline-success"
                              size="sm"
                              style={{ borderRadius: '8px', padding: '8px 16px', fontWeight: '600' }}
                            >
                              <i className="bi bi-chat-dots me-2"></i>
                              Bắt đầu chat
                            </Button>
                          </div>
                        </div>
                        <div className="d-flex align-items-start mb-4">
                          <div className="rounded-circle bg-warning text-white d-flex align-items-center justify-content-center me-3" style={{ width: '50px', height: '50px', minWidth: '50px' }}>
                            <i className="bi bi-geo-alt fs-4"></i>
                          </div>
                          <div>
                            <h6 className="mb-2">Địa chỉ trung tâm</h6>
                            <p className="text-muted small mb-1">Đến trực tiếp để được tư vấn</p>
                            <div className="h6 text-warning mb-1">123 Đường ABC, Quận XYZ, Hà Nội</div>
                            <small className="text-muted">Giờ làm việc: 8h-18h</small>
                          </div>
                        </div>
                      </div>
                    </div>

                    <div className="mt-4 p-3 bg-light rounded">
                      <h6 className="mb-3">
                        <i className="bi bi-info-circle text-primary me-2"></i>
                        Lưu ý khi liên hệ
                      </h6>
                      <ul className="text-muted small mb-0">
                        <li>Chuẩn bị thông tin cơ bản về dịch vụ bạn quan tâm</li>
                        <li>Nêu rõ mục đích sử dụng (cá nhân/pháp lý)</li>
                        <li>Thông tin liên hệ sẽ được bảo mật tuyệt đối</li>
                        <li>Tư vấn miễn phí, không ràng buộc sử dụng dịch vụ</li>
                      </ul>
                    </div>
                  </Tab.Pane>
                </Tab.Content>
              </Card.Body>
            </Card>
          </Col>

          {/* Sidebar */}
          <Col lg={4}>
            {/* Booking Card */}
            <Card className="mb-4 border-0 shadow-sm sticky-top" style={{ top: '20px', borderRadius: '16px', boxShadow: '0 4px 20px rgba(0,0,0,0.08)' }}>
              <Card.Header className="bg-primary text-white text-center py-3">
                <h5 className="mb-0">
                  <i className="bi bi-calendar-plus me-2"></i>
                  Đặt lịch xét nghiệm
                </h5>
              </Card.Header>
              <Card.Body className="p-4">
                <div className="text-center mb-4">
                  {service.featured && (
                    <Badge bg="danger" className="mb-3">
                      <i className="bi bi-star me-2"></i>
                      Dịch vụ nổi bật
                    </Badge>
                  )}
                  <div className="h3 text-black mb-3">{service.title}</div>
                  <div className="h3 text-primary mb-2">{formatPrice(service.price)}</div>
                  <div className="text-muted mb-3">
                    <i className="bi bi-clock me-1"></i>
                    Thời gian: {service.duration}
                  </div>

                </div>

                <div className="d-grid gap-2">
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
                  <Button
                    variant="outline-primary"
                    as={Link}
                    to="/services"
                    className="fw-bold"
                    style={{ borderRadius: '12px', padding: '12px 24px', fontWeight: '600' }}
                  >
                    <i className="bi bi-arrow-left me-2"></i>
                    Xem dịch vụ khác
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        </Row>
      </Container>
    </>
  );
};

export default ServiceDetail;