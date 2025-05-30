import React, { useState } from 'react';
import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Badge, Form, Modal, Alert, Tab, Nav } from 'react-bootstrap';

const BlogManagement = ({ user }) => {
  const navigate = useNavigate();
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [message, setMessage] = useState({ type: '', content: '' });

  // Mock blog posts data
  const [blogPosts, setBlogPosts] = useState([
    {
      id: 1,
      title: 'Những điều cần biết về xét nghiệm ADN trước sinh',
      slug: 'xet-nghiem-adn-truoc-sinh',
      excerpt: 'Xét nghiệm ADN trước sinh là phương pháp hiện đại, an toàn để xác định quan hệ huyết thống khi thai nhi còn trong bụng mẹ...',
      content: 'Nội dung chi tiết về xét nghiệm ADN trước sinh...',
      featuredImage: 'https://via.placeholder.com/300x200/007bff/ffffff?text=ADN+Prenatal',
      category: 'Xét nghiệm ADN',
      tags: ['ADN trước sinh', 'Thai nhi', 'An toàn'],
      status: 'published',
      author: 'TS. Nguyễn Văn Minh',
      publishDate: '2024-01-20',
      views: 1250,
      comments: 8,
      featured: true,
      seoTitle: 'Xét nghiệm ADN trước sinh - An toàn và chính xác',
      seoDescription: 'Tìm hiểu về xét nghiệm ADN trước sinh, phương pháp hiện đại giúp xác định quan hệ huyết thống an toàn cho mẹ và bé.',
      seoKeywords: 'xét nghiệm ADN trước sinh, ADN thai nhi, xét nghiệm an toàn'
    },
    {
      id: 2,
      title: 'Quy trình xét nghiệm ADN hành chính tại ADN LAB',
      slug: 'quy-trinh-xet-nghiem-adn-hanh-chinh',
      excerpt: 'Hướng dẫn chi tiết quy trình thực hiện xét nghiệm ADN có giá trị pháp lý tại ADN LAB...',
      content: 'Nội dung về quy trình xét nghiệm ADN hành chính...',
      featuredImage: 'https://via.placeholder.com/300x200/28a745/ffffff?text=ADN+Legal',
      category: 'Hướng dẫn',
      tags: ['ADN hành chính', 'Pháp lý', 'Quy trình'],
      status: 'published',
      author: 'ThS. Trần Thị Lan',
      publishDate: '2024-01-18',
      views: 890,
      comments: 12,
      featured: false,
      seoTitle: 'Quy trình xét nghiệm ADN hành chính chi tiết',
      seoDescription: 'Hướng dẫn quy trình xét nghiệm ADN có giá trị pháp lý, các bước thực hiện và giấy tờ cần thiết.',
      seoKeywords: 'xét nghiệm ADN hành chính, ADN pháp lý, quy trình ADN'
    },
    {
      id: 3,
      title: 'Công nghệ STR Analysis trong xét nghiệm ADN',
      slug: 'cong-nghe-str-analysis-adn',
      excerpt: 'Tìm hiểu về công nghệ STR Analysis - phương pháp hiện đại nhất trong xét nghiệm ADN hiện nay...',
      content: 'Nội dung về công nghệ STR Analysis...',
      featuredImage: 'https://via.placeholder.com/300x200/ffc107/000000?text=STR+Tech',
      category: 'Công nghệ',
      tags: ['STR Analysis', 'Công nghệ ADN', 'Khoa học'],
      status: 'draft',
      author: 'TS. Lê Văn Đức',
      publishDate: '',
      views: 0,
      comments: 0,
      featured: false,
      seoTitle: 'Công nghệ STR Analysis trong xét nghiệm ADN',
      seoDescription: 'Khám phá công nghệ STR Analysis, phương pháp tiên tiến nhất trong phân tích ADN với độ chính xác cao.',
      seoKeywords: 'STR Analysis, công nghệ ADN, phân tích gen'
    }
  ]);

  const categories = ['Tất cả', 'Xét nghiệm ADN', 'Hướng dẫn', 'Công nghệ', 'Tin tức'];
  const statuses = ['Tất cả', 'published', 'draft', 'pending'];

  const filteredPosts = blogPosts.filter(post => {
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'published' && post.status === 'published') ||
                      (selectedTab === 'draft' && post.status === 'draft') ||
                      (selectedTab === 'featured' && post.featured);
    
    return matchesSearch && matchesTab;
  });

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <Badge bg="success">Đã xuất bản</Badge>;
      case 'draft':
        return <Badge bg="secondary">Bản nháp</Badge>;
      case 'pending':
        return <Badge bg="warning">Chờ duyệt</Badge>;
      default:
        return <Badge bg="light" text="dark">Không xác định</Badge>;
    }
  };

  const handleDeletePost = (post) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  const confirmDelete = () => {
    setBlogPosts(blogPosts.filter(post => post.id !== selectedPost.id));
    setShowDeleteModal(false);
    setSelectedPost(null);
    setMessage({ type: 'success', content: 'Đã xóa bài viết thành công!' });
    setTimeout(() => setMessage({ type: '', content: '' }), 3000);
  };

  const handleToggleFeatured = (postId) => {
    setBlogPosts(blogPosts.map(post => 
      post.id === postId ? { ...post, featured: !post.featured } : post
    ));
  };

  const handleStatusChange = (postId, newStatus) => {
    setBlogPosts(blogPosts.map(post => 
      post.id === postId ? { ...post, status: newStatus } : post
    ));
    setMessage({ type: 'success', content: 'Đã cập nhật trạng thái bài viết!' });
    setTimeout(() => setMessage({ type: '', content: '' }), 3000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa xuất bản';
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Quản lý Blog</h2>
              <p className="text-muted mb-0">Tạo và quản lý bài viết blog về ADN</p>
            </div>
            <div>
              <Button variant="success" as={Link} to="/admin/blog/create">
                <i className="bi bi-plus-circle me-2"></i>
                Tạo bài viết mới
              </Button>
            </div>
          </div>
        </Col>
      </Row>

      {/* Message Alert */}
      {message.content && (
        <Alert variant={message.type} className="mb-4" dismissible onClose={() => setMessage({ type: '', content: '' })}>
          {message.content}
        </Alert>
      )}

      {/* Statistics */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body className="text-center">
              <i className="bi bi-newspaper fs-1 mb-2 d-block"></i>
              <div className="h4 mb-0">{blogPosts.length}</div>
              <small>Tổng bài viết</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm bg-success text-white">
            <Card.Body className="text-center">
              <i className="bi bi-check-circle fs-1 mb-2 d-block"></i>
              <div className="h4 mb-0">{blogPosts.filter(p => p.status === 'published').length}</div>
              <small>Đã xuất bản</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm bg-warning text-dark">
            <Card.Body className="text-center">
              <i className="bi bi-star fs-1 mb-2 d-block"></i>
              <div className="h4 mb-0">{blogPosts.filter(p => p.featured).length}</div>
              <small>Nổi bật</small>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm bg-info text-white">
            <Card.Body className="text-center">
              <i className="bi bi-eye fs-1 mb-2 d-block"></i>
              <div className="h4 mb-0">{blogPosts.reduce((sum, p) => sum + p.views, 0).toLocaleString()}</div>
              <small>Tổng lượt xem</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Search and Filter */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col lg={6} className="mb-3">
              <Form.Control
                type="text"
                placeholder="Tìm kiếm bài viết..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
            <Col lg={6} className="text-lg-end">
              <Button variant="outline-primary" className="me-2">
                <i className="bi bi-funnel me-1"></i>
                Lọc theo danh mục
              </Button>
              <Button variant="outline-secondary">
                <i className="bi bi-download me-1"></i>
                Xuất danh sách
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Blog Posts List */}
      <Card className="shadow-sm">
        <Tab.Container activeKey={selectedTab} onSelect={setSelectedTab}>
          <Card.Header className="bg-white border-bottom">
            <Nav variant="tabs" className="border-0">
              <Nav.Item>
                <Nav.Link eventKey="all">
                  Tất cả ({blogPosts.length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="published">
                  Đã xuất bản ({blogPosts.filter(p => p.status === 'published').length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="draft">
                  Bản nháp ({blogPosts.filter(p => p.status === 'draft').length})
                </Nav.Link>
              </Nav.Item>
              <Nav.Item>
                <Nav.Link eventKey="featured">
                  Nổi bật ({blogPosts.filter(p => p.featured).length})
                </Nav.Link>
              </Nav.Item>
            </Nav>
          </Card.Header>

          <Card.Body className="p-0">
            {filteredPosts.length > 0 ? (
              <Table className="mb-0" hover responsive>
                <thead className="bg-light">
                  <tr>
                    <th style={{ width: '40%' }}>Bài viết</th>
                    <th style={{ width: '15%' }}>Danh mục</th>
                    <th style={{ width: '15%' }}>Trạng thái</th>
                    <th style={{ width: '15%' }}>Ngày xuất bản</th>
                    <th style={{ width: '10%' }}>Lượt xem</th>
                    <th style={{ width: '5%' }}>Hành động</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.map(post => (
                    <tr key={post.id}>
                      <td>
                        <div className="d-flex align-items-start">
                          <img 
                            src={post.featuredImage} 
                            alt={post.title}
                            className="rounded me-3"
                            style={{ width: '60px', height: '40px', objectFit: 'cover' }}
                          />
                          <div>
                            <div className="fw-bold mb-1">
                              {post.title}
                              {post.featured && (
                                <Badge bg="warning" text="dark" className="ms-2">
                                  <i className="bi bi-star-fill me-1"></i>
                                  Nổi bật
                                </Badge>
                              )}
                            </div>
                            <div className="text-muted small">{post.excerpt.substring(0, 80)}...</div>
                            <div className="small text-muted">
                              Tác giả: {post.author} • {post.comments} bình luận
                            </div>
                          </div>
                        </div>
                      </td>
                      <td>
                        <Badge bg="light" text="dark">{post.category}</Badge>
                      </td>
                      <td>
                        {getStatusBadge(post.status)}
                      </td>
                      <td>
                        <div className="small">
                          {formatDate(post.publishDate)}
                        </div>
                      </td>
                      <td>
                        <div className="small">
                          <i className="bi bi-eye me-1"></i>
                          {post.views.toLocaleString()}
                        </div>
                      </td>
                      <td>
                        <div className="dropdown">
                          <Button 
                            variant="outline-secondary" 
                            size="sm"
                            data-bs-toggle="dropdown"
                          >
                            <i className="bi bi-three-dots"></i>
                          </Button>
                          <ul className="dropdown-menu">
                            <li>
                              <Link 
                                className="dropdown-item" 
                                to={`/admin/blog/edit/${post.id}`}
                              >
                                <i className="bi bi-pencil me-2"></i>
                                Chỉnh sửa
                              </Link>
                            </li>
                            <li>
                              <Link 
                                className="dropdown-item" 
                                to={`/blog/${post.slug}`}
                                target="_blank"
                              >
                                <i className="bi bi-eye me-2"></i>
                                Xem trước
                              </Link>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item"
                                onClick={() => handleToggleFeatured(post.id)}
                              >
                                <i className={`bi bi-star${post.featured ? '-fill' : ''} me-2`}></i>
                                {post.featured ? 'Bỏ nổi bật' : 'Đặt nổi bật'}
                              </button>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button 
                                className="dropdown-item text-success"
                                onClick={() => handleStatusChange(post.id, 'published')}
                                disabled={post.status === 'published'}
                              >
                                <i className="bi bi-check-circle me-2"></i>
                                Xuất bản
                              </button>
                            </li>
                            <li>
                              <button 
                                className="dropdown-item text-warning"
                                onClick={() => handleStatusChange(post.id, 'draft')}
                                disabled={post.status === 'draft'}
                              >
                                <i className="bi bi-file-earmark me-2"></i>
                                Chuyển về nháp
                              </button>
                            </li>
                            <li><hr className="dropdown-divider" /></li>
                            <li>
                              <button 
                                className="dropdown-item text-danger"
                                onClick={() => handleDeletePost(post)}
                              >
                                <i className="bi bi-trash me-2"></i>
                                Xóa
                              </button>
                            </li>
                          </ul>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            ) : (
              <div className="text-center py-5">
                <i className="bi bi-newspaper text-muted" style={{ fontSize: '4rem' }}></i>
                <h5 className="text-muted mt-3">
                  {searchTerm ? 'Không tìm thấy bài viết nào' : 'Chưa có bài viết nào'}
                </h5>
                <p className="text-muted">
                  {searchTerm 
                    ? 'Thử thay đổi từ khóa tìm kiếm'
                    : 'Bắt đầu tạo bài viết đầu tiên của bạn'
                  }
                </p>
                {!searchTerm && (
                  <Button variant="success" as={Link} to="/admin/blog/create">
                    <i className="bi bi-plus-circle me-2"></i>
                    Tạo bài viết mới
                  </Button>
                )}
              </div>
            )}
          </Card.Body>
        </Tab.Container>
      </Card>

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Xác nhận xóa bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedPost && (
            <>
              <Alert variant="danger">
                <i className="bi bi-exclamation-triangle me-2"></i>
                <strong>Cảnh báo!</strong> Hành động này không thể hoàn tác.
              </Alert>
              <p>Bạn có chắc chắn muốn xóa bài viết:</p>
              <div className="p-3 bg-light rounded">
                <strong>"{selectedPost.title}"</strong>
                <div className="text-muted small mt-1">
                  Tác giả: {selectedPost.author} • {selectedPost.views} lượt xem
                </div>
              </div>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            <i className="bi bi-trash me-2"></i>
            Xóa bài viết
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BlogManagement;