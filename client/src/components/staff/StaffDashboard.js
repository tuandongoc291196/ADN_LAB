import React from 'react';
import { Container, Row, Col, Card, ListGroup } from 'react-bootstrap';

const StaffDashboard = () => {
  return (
    <Container className="py-5">
      <h1>Trang nhân viên</h1>
      <p>Chào mừng đến với trang nhân viên. Nội dung đang được phát triển.</p>
      
      <Row className="mt-4">
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Lịch hẹn hôm nay</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>09:00 - Nguyễn Văn A - Xét nghiệm ADN huyết thống</ListGroup.Item>
                <ListGroup.Item>10:30 - Trần Thị B - Xét nghiệm ADN thai nhi</ListGroup.Item>
                <ListGroup.Item>14:00 - Lê Văn C - Xét nghiệm ADN khai sinh</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Nhiệm vụ</Card.Title>
              <ListGroup variant="flush">
                <ListGroup.Item>Thu thập mẫu xét nghiệm - 3 mẫu</ListGroup.Item>
                <ListGroup.Item>Xử lý mẫu - 5 mẫu</ListGroup.Item>
                <ListGroup.Item>Tư vấn khách hàng - 2 cuộc hẹn</ListGroup.Item>
              </ListGroup>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default StaffDashboard; 