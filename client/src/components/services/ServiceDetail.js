import React, { useState, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Container, Row, Col, Card, Button, Badge, Alert, Accordion, Tab, Nav } from 'react-bootstrap';
import { getAllServices } from '../../services/api';
import './ServiceDetail.css';

const ServiceDetail = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchService = async () => {
      try {
        setLoading(true);
        const data = await getAllServices();
        // data.dnaServices là mảng, filter lấy đúng id
        const found = (data.dnaServices || []).find(s => s.id === id);
        setService(found);
        // Lấy các phương thức liên quan
        setMethods((data.serviceCollectionMethods || []).filter(m => m.serviceId === id));
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    if (id) {
      fetchService();
    }
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
    return <div className="loading-container">Đang tải chi tiết dịch vụ...</div>;
  }

  if (error) {
    return <div className="error-container">Lỗi: {error}</div>;
  }

  if (!service) {
    return <div className="container">Không tìm thấy dịch vụ.</div>;
  }

  return (
    <div className="service-detail-container">
      <div className="service-header text-center py-4 bg-light">
        {service.icon && <i className={`${service.icon} fa-4x text-primary mb-3`}></i>}
        <h1 className="fw-bold">{service.title}</h1>
        {service.featured && <Badge bg="warning" className="ms-2">Nổi bật</Badge>}
        {service.category && <Badge bg="secondary" className="ms-2">{service.category.name}</Badge>}
      </div>
      <div className="service-content container py-4">
        <p className="h4 text-primary fw-bold">{service.price.toLocaleString('vi-VN')} VNĐ</p>
        <p><strong>Thời gian:</strong> {service.duration}</p>
        <div className="description mb-4">
          <h3>Mô tả chi tiết</h3>
          <p>{service.fullDescription || service.description}</p>
        </div>
        <div className="methods-section">
          <h3>Các phương pháp lấy mẫu</h3>
          <Row>
            {methods.map(method => (
              <Col md={6} key={method.methodId || method.id}>
                <Card className="mb-3">
                  <Card.Body>
                    <div className="d-flex align-items-center mb-2">
                      {method.methodIcon && <i className={`${method.methodIcon} fa-2x me-2`}></i>}
                      <h5 className="mb-0">{method.methodTitle || method.name}</h5>
                    </div>
                    <p className="mb-1">{method.methodDescription || method.description}</p>
                    {method.methodNote && <Alert variant="info" className="py-1 px-2">{method.methodNote}</Alert>}
                    <p className="mb-0"><strong>Giá:</strong> {method.methodPrice ? method.methodPrice.toLocaleString('vi-VN') : ''} VNĐ</p>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        </div>
      </div>
    </div>
  );
};

export default ServiceDetail;