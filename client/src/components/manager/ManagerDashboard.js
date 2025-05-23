import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const ManagerDashboard = () => {
  return (
    <Container className="py-5">
      <h1>Trang quản lý</h1>
      <p>Chào mừng đến với trang quản lý. Nội dung đang được phát triển.</p>
      
      <Row className="mt-4">
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Quản lý dịch vụ</Card.Title>
              <Card.Text>
                Công cụ quản lý dịch vụ xét nghiệm ADN.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Quản lý nhân viên</Card.Title>
              <Card.Text>
                Công cụ quản lý thông tin nhân viên.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={4} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Báo cáo</Card.Title>
              <Card.Text>
                Xem báo cáo và thống kê.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default ManagerDashboard; 