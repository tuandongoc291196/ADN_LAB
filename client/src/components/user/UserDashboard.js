import React from 'react';
import { Container, Row, Col, Card } from 'react-bootstrap';

const UserDashboard = ({ user }) => {
  return (
    <Container className="py-5">
      <h1>Trang cá nhân</h1>
      <p>Chào mừng đến với trang cá nhân của bạn. Nội dung đang được phát triển.</p>
      
      <Row className="mt-4">
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Thông tin cá nhân</Card.Title>
              <Card.Text>
                Thông tin cá nhân của bạn sẽ hiển thị tại đây.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
        <Col md={6} className="mb-4">
          <Card>
            <Card.Body>
              <Card.Title>Lịch hẹn</Card.Title>
              <Card.Text>
                Danh sách các lịch hẹn của bạn sẽ hiển thị tại đây.
              </Card.Text>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default UserDashboard; 