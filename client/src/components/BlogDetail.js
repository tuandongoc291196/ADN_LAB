import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Alert, Image, Breadcrumb, ListGroup, Spinner } from 'react-bootstrap';
import { useParams, Link } from 'react-router-dom';
import { getBlogById, getAllBlogs } from '../services/api';

const BlogDetail = () => {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [otherBlogs, setOtherBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Sanitize HTML content to remove unwanted tags and styles
  const sanitizeContent = (content) => {
    if (!content) return '';
    
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    
    // Remove potentially dangerous tags
    const dangerousTags = ['script', 'style', 'iframe', 'object', 'embed', 'form', 'input', 'button'];
    dangerousTags.forEach(tag => {
      const elements = tempDiv.getElementsByTagName(tag);
      while (elements.length > 0) {
        elements[0].parentNode.removeChild(elements[0]);
      }
    });
    
    // Remove all style attributes
    const allElements = tempDiv.getElementsByTagName('*');
    for (let i = 0; i < allElements.length; i++) {
      allElements[i].removeAttribute('style');
      allElements[i].removeAttribute('class');
    }
    
    return tempDiv.innerHTML;
  };

  useEffect(() => {
    const fetchBlogData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Fetch the main blog post
        const foundBlog = await getBlogById(id);
        if (foundBlog && foundBlog.isActive) {
          setBlog(foundBlog);
        } else {
          throw new Error('Không thể tìm thấy bài viết hoặc bài viết đã bị ẩn.');
        }

        // Fetch all blogs for the "other blogs" list
        const allBlogs = await getAllBlogs();
        // Chỉ lấy những blog active và khác với blog hiện tại
        const activeOtherBlogs = allBlogs
          .filter(b => b.id !== id && b.isActive)
          .slice(0, 5); // Show 5 other blogs
        setOtherBlogs(activeOtherBlogs);

      } catch (err) {
        setError(err.message || 'Đã xảy ra lỗi khi tải dữ liệu. Vui lòng thử lại.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogData();
  }, [id]);

  if (loading) {
    return (
        <Container className="py-5 text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3">Đang tải bài viết...</p>
        </Container>
    );
  }

  if (error) {
    return (
        <Container className="py-5">
            <Alert variant="danger">{error}</Alert>
            <Link to="/blog" className="btn btn-primary">Quay lại danh sách</Link>
        </Container>
    );
  }

  if (!blog) {
      return null; // Should not happen if error is handled properly
  }

  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary text-white py-5">
        <Container>
           <Breadcrumb listProps={{ className: 'mb-4' }}>
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/" }} className="text-white-50">Trang chủ</Breadcrumb.Item>
              <Breadcrumb.Item linkAs={Link} linkProps={{ to: "/blog" }} className="text-white-50">Blog</Breadcrumb.Item>
              <Breadcrumb.Item active className="text-white">{blog.title}</Breadcrumb.Item>
          </Breadcrumb>
          <h1 className="display-5 fw-bold">{blog.title}</h1>
          <div className="text-white-50 mt-3">
            <span>
              <i className="bi bi-calendar-event me-2"></i>
              Đăng ngày: {new Date(blog.createdAt).toLocaleDateString('vi-VN')} 
            </span>
            <span className="ms-4">           
              <i className="bi bi-person me-2"></i>
              Tác giả: {blog.user?.fullname || 'Admin'}
            </span>
          </div>
        </Container>
      </section>
      
      {/* Main Content Section */}
      <section className="py-5 bg-light">
        <Container>
            <Row>
                {/* Blog Content */}
                <Col lg={8} className="mb-4 mb-lg-0">
                    <Card className="p-4 shadow-sm border-0 h-100">
                        {blog.imageUrl && (
                            <Image 
                            src={blog.imageUrl} 
                            alt={blog.title} 
                            fluid 
                            rounded 
                            className="mb-4"
                            style={{ maxHeight: '400px', objectFit: 'cover', width: '100%' }}
                            />
                        )}
                        {/* Hiển thị nội dung blog với định dạng HTML đẹp */}
                        <div 
                          className="blog-content" 
                          style={{ 
                            textAlign: 'left',
                            fontSize: '1.1rem',
                            lineHeight: '1.8',
                            color: '#333',
                            padding: '24px',
                            background: '#fff',
                            borderRadius: '10px',
                            boxShadow: '0 2px 8px rgba(0,0,0,0.04)',
                            marginBottom: '2rem',
                            wordBreak: 'break-word'
                          }}
                          dangerouslySetInnerHTML={{ __html: sanitizeContent(blog.content) }}
                        />

                        <hr className="my-4" />

                        <div className="text-center">
                            <Link to="/blog" className="btn btn-outline-primary">
                                <i className="bi bi-arrow-left me-2"></i>
                                Quay lại danh sách Blog
                            </Link>
                        </div>
                    </Card>
                </Col>

                {/* Sidebar */}
                <Col lg={4}>
                    <div className="position-sticky" style={{top: '2rem'}}>
                        <Card className="shadow-sm border-0">
                            <Card.Header as="h5" className="fw-bold bg-white border-bottom p-3">
                                <i className="bi bi-newspaper me-2"></i>
                                Các bài viết khác
                            </Card.Header>
                            <ListGroup variant="flush">
                                {otherBlogs.length > 0 ? otherBlogs.map(other => (
                                    <ListGroup.Item action as={Link} to={`/blog/${other.id}`} key={other.id} className="py-3">
                                        <div className="fw-bold mb-1">{other.title}</div>
                                        <small className="text-muted">
                                            {new Date(other.createdAt).toLocaleDateString('vi-VN')}
                                        </small>
                                    </ListGroup.Item>
                                )) : <ListGroup.Item>Không có bài viết nào khác.</ListGroup.Item>}
                            </ListGroup>
                        </Card>
                    </div>
                </Col>
            </Row>
        </Container>
      </section>
    </>
  );
};

export default BlogDetail; 