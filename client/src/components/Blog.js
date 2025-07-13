import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Alert } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { getAllBlogs } from '../services/api';

const Blog = () => {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setLoading(true);
        const fetchedBlogs = await getAllBlogs();
        // Chỉ lấy những blog có isActive = true
        const activeBlogs = fetchedBlogs.filter(blog => blog.isActive);
        setBlogs(activeBlogs || []);
        setError(null);
      } catch (err) {
        setError('Không thể tải danh sách bài viết. Vui lòng thử lại sau.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  const renderContent = () => {
    if (loading) {
      return (
        <Col className="text-center">
          <Spinner animation="border" variant="primary" />
          <p className="mt-2">Đang tải bài viết...</p>
        </Col>
      );
    }

    if (error) {
      return (
        <Col>
          <Alert variant="danger">{error}</Alert>
        </Col>
      );
    }

    if (blogs.length === 0) {
      return (
        <Col>
          <div className="text-center p-5 bg-white rounded shadow-sm">
            <p className="lead">Hiện tại chưa có bài viết nào.</p>
          </div>
        </Col>
      );
    }

    return blogs.map(blog => (
      <Col key={blog.id} md={6} lg={4} className="mb-4 d-flex align-items-stretch">
        <Card className="shadow-sm border-0 w-100">
          <Card.Img 
            variant="top" 
            src={blog.imageUrl || `https://via.placeholder.com/400x250/007bff/ffffff?text=ADN+LAB`}
            alt={blog.title}
            style={{ height: '200px', objectFit: 'cover' }}
          />
          <Card.Body className="d-flex flex-column">
            <Card.Title as="h5" className="fw-bold text-primary">{blog.title}</Card.Title>
            <Card.Text className="text-muted flex-grow-1">
              {/* Hiển thị nội dung rút gọn (150 ký tự đầu) */}
              {blog.content && blog.content.length > 150 
                ? blog.content.substring(0, 150) + '...' 
                : blog.content}
            </Card.Text>
            <div className="text-muted small mb-3">
              <span>
                <i className="bi bi-calendar-event me-2"></i>
                {new Date(blog.createdAt).toLocaleDateString('vi-VN')}
              </span>
              <span className="ms-3">
                <i className="bi bi-person me-2"></i>
                {blog.user?.fullname || 'Admin'}
              </span>
            </div>
            <Button as={Link} to={`/blog/${blog.id}`} variant="primary" className="mt-auto">
              Đọc thêm <i className="bi bi-arrow-right"></i>
            </Button>
          </Card.Body>
        </Card>
      </Col>
    ));
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <Container>
          <Row className="align-items-center">
            <Col lg={8}>
              <h1 className="display-4 fw-bold mb-4">Góc kiến thức ADN</h1>
              <p className="lead mb-4">
                Khám phá các bài viết chuyên sâu, tin tức và kiến thức hữu ích về lĩnh vực di truyền và xét nghiệm ADN từ các chuyên gia của chúng tôi.
              </p>
            </Col>
            <Col lg={4} className="text-center d-none d-lg-block">
              <i className="bi bi-newspaper" style={{fontSize: '10rem', color: 'rgba(255,255,255,0.5)'}}></i>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Blog List Section */}
      <section className="py-5 bg-light">
        <Container>
            <Row>
              {renderContent()}
            </Row>
        </Container>
      </section>
    </div>
  );
};

export default Blog; 