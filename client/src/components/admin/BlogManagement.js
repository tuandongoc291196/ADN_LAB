/**
 * COMPONENT: BlogManagement
 * MỤC ĐÍCH: Trang quản lý danh sách bài viết blog
 * CHỨC NĂNG:
 * - Hiển thị danh sách tất cả bài viết với pagination
 * - Lọc bài viết theo trạng thái (published/draft/featured)
 * - Tìm kiếm bài viết theo tiêu đề, nội dung, tags
 * - Thao tác CRUD (tạo, đọc, cập nhật, xóa) bài viết
 * - Thống kê tổng quan về blog
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Badge, Form, Modal, Alert, Tab, Nav } from 'react-bootstrap';
import { getAllBlogs, deleteBlog, updateBlogStatus, toggleBlogFeatured } from '../../services/api';
import { useAuth } from '../context/auth';

const BlogManagement = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // State management
  const [selectedTab, setSelectedTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [blogPosts, setBlogPosts] = useState([]);

  // Check user permissions
  useEffect(() => {
    if (!user?.role?.id || user.role.id !== '3') {
      navigate('/');
      return;
    }
    fetchBlogs();
  }, [user]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const blogs = await getAllBlogs();
      setBlogPosts(blogs || []);
      
      // Hiển thị thông báo khi không có bài viết
      if (blogs.length === 0) {
        setMessage({ 
          type: 'info', 
          content: 'Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!' 
        });
      } else {
        setMessage({ type: '', content: '' });
      }
    } catch (error) {
      console.error('Error fetching blogs:', error);
      setMessage({ 
        type: 'danger', 
        content: 'Lỗi khi tải danh sách blog: ' + error.message 
      });
    } finally {
      setLoading(false);
    }
  };

  // Handle create new blog
  const handleCreateNew = () => {
    if (!user?.role?.id || user.role.id !== '3') {
      setMessage({ type: 'danger', content: 'Bạn không có quyền tạo bài viết mới!' });
      return;
    }
    navigate('/admin/blog/create');
  };

  // Danh sách categories và statuses để lọc
  const categories = ['Tất cả', 'Xét nghiệm ADN', 'Hướng dẫn', 'Công nghệ', 'Tin tức'];
  const statuses = ['Tất cả', 'published', 'draft', 'pending'];

  // Hàm lọc bài viết theo search term và tab được chọn
  const filteredPosts = blogPosts.filter(post => {
    // Tìm kiếm theo tiêu đề, nội dung hoặc tags
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags?.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Lọc theo tab được chọn
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'published' && post.status === 'published') ||
                      (selectedTab === 'draft' && post.status === 'draft') ||
                      (selectedTab === 'featured' && post.featured);
    
    return matchesSearch && matchesTab;
  });

  // Hàm tạo badge hiển thị trạng thái bài viết
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

  // Handle delete blog
  const handleDeletePost = async (post) => {
    if (!user?.role?.id || user.role.id !== '3') {
      setMessage({ type: 'danger', content: 'Bạn không có quyền xóa bài viết!' });
      return;
    }
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  // Confirm delete
  const confirmDelete = async () => {
    try {
      await deleteBlog(selectedPost.id);
      await fetchBlogs();
      setShowDeleteModal(false);
      setSelectedPost(null);
      setMessage({ type: 'success', content: 'Đã xóa bài viết thành công!' });
    } catch (error) {
      console.error('Error deleting blog:', error);
      setMessage({ type: 'danger', content: 'Lỗi khi xóa bài viết: ' + error.message });
    }
  };

  // Handle edit blog
  const handleEditPost = (post) => {
    if (!user?.role?.id || user.role.id !== '3') {
      setMessage({ type: 'danger', content: 'Bạn không có quyền chỉnh sửa bài viết!' });
      return;
    }
    navigate(`/admin/blog/edit/${post.id}`);
  };

  // Hàm toggle trạng thái featured của bài viết
  const handleToggleFeatured = async (postId) => {
    try {
      const post = blogPosts.find(p => p.id === postId);
      await toggleBlogFeatured(postId, !post.featured);
      await fetchBlogs(); // Refresh list
      setMessage({ type: 'success', content: 'Đã cập nhật trạng thái nổi bật!' });
    } catch (error) {
      setMessage({ type: 'danger', content: 'Lỗi khi cập nhật trạng thái: ' + error.message });
    }
    setTimeout(() => setMessage({ type: '', content: '' }), 3000);
  };

  // Hàm thay đổi trạng thái xuất bản của bài viết
  const handleStatusChange = async (postId, newStatus) => {
    try {
      await updateBlogStatus(postId, newStatus);
      await fetchBlogs(); // Refresh list
      setMessage({ type: 'success', content: 'Đã cập nhật trạng thái bài viết!' });
    } catch (error) {
      setMessage({ type: 'danger', content: 'Lỗi khi cập nhật trạng thái: ' + error.message });
    }
    setTimeout(() => setMessage({ type: '', content: '' }), 3000);
  };

  // Hàm format ngày tháng theo định dạng Việt Nam
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có thông tin';
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit', 
      day: '2-digit'
    });
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
              <Button 
                variant="success" 
                onClick={handleCreateNew}
                disabled={!user?.id && !user?.user_id}
              >
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

      {/* Loading State */}
      {loading ? (
        <Card className="shadow-sm mb-4">
          <Card.Body className="text-center py-5">
            <div className="spinner-border text-primary mb-3" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <p className="text-muted">Đang tải danh sách bài viết...</p>
          </Card.Body>
        </Card>
      ) : (
        <>
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
                  <div className="h4 mb-0">
                    {blogPosts.filter(post => post.status === 'published').length}
                  </div>
                  <small>Đã xuất bản</small>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="border-0 shadow-sm bg-warning text-dark">
                <Card.Body className="text-center">
                  <i className="bi bi-pencil-square fs-1 mb-2 d-block"></i>
                  <div className="h4 mb-0">
                    {blogPosts.filter(post => post.status === 'draft').length}
                  </div>
                  <small>Bản nháp</small>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="border-0 shadow-sm bg-info text-white">
                <Card.Body className="text-center">
                  <i className="bi bi-star fs-1 mb-2 d-block"></i>
                  <div className="h4 mb-0">
                    {blogPosts.filter(post => post.featured).length}
                  </div>
                  <small>Nổi bật</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Empty State */}
          {blogPosts.length === 0 ? (
            <Card className="shadow-sm mb-4">
              <Card.Body className="text-center py-5">
                <i className="bi bi-journal-text text-muted fs-1 mb-3 d-block"></i>
                <h4 className="text-muted mb-2">Chưa có bài viết nào</h4>
                <p className="text-muted mb-4">Hãy bắt đầu tạo bài viết đầu tiên của bạn</p>
                <Button 
                  variant="primary" 
                  onClick={handleCreateNew}
                  disabled={!user?.id && !user?.user_id}
                >
                  <i className="bi bi-plus-circle me-2"></i>
                  Tạo bài viết mới
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <>
              {/* Filters */}
              <Card className="shadow-sm mb-4">
                <Card.Body>
                  <Row>
                    <Col md={6} lg={3}>
                      <Form.Group className="mb-3 mb-md-0">
                        <Form.Control
                          type="text"
                          placeholder="Tìm kiếm bài viết..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6} lg={3}>
                      <Form.Select
                        value={selectedTab}
                        onChange={(e) => setSelectedTab(e.target.value)}
                      >
                        <option value="all">Tất cả bài viết</option>
                        <option value="published">Đã xuất bản</option>
                        <option value="draft">Bản nháp</option>
                        <option value="featured">Nổi bật</option>
                      </Form.Select>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Blog Posts Table */}
              <Card className="shadow-sm">
                <Card.Body>
                  <Table responsive hover className="align-middle">
                    <thead>
                      <tr>
                        <th style={{ width: '40%' }}>Bài viết</th>
                        <th>Tác giả</th>
                        <th>Ngày tạo</th>
                        <th>Trạng thái</th>
                        <th>Thao tác</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredPosts.length === 0 ? (
                        <tr>
                          <td colSpan="5" className="text-center py-4">
                            <i className="bi bi-inbox fs-1 text-muted d-block mb-2"></i>
                            <p className="text-muted mb-0">Không tìm thấy bài viết nào</p>
                          </td>
                        </tr>
                      ) : (
                        filteredPosts.map(post => (
                          <tr key={post.id}>
                            <td>
                              <div className="d-flex align-items-center">
                                {post.featuredImage && (
                                  <img
                                    src={post.featuredImage}
                                    alt={post.title}
                                    style={{ width: '60px', height: '40px', objectFit: 'cover' }}
                                    className="me-3 rounded"
                                  />
                                )}
                                <div>
                                  <h6 className="mb-1">{post.title}</h6>
                                  <small className="text-muted d-block">
                                    {post.excerpt?.substring(0, 100)}...
                                  </small>
                                </div>
                              </div>
                            </td>
                            <td>{post.user?.fullname || 'Không rõ'}</td>
                            <td>{formatDate(post.createdAt)}</td>
                            <td>{getStatusBadge(post.status)}</td>
                            <td>
                              <div className="d-flex justify-content-center align-items-center gap-2">
                                <Button
                                  variant="outline-primary"
                                  size="sm"
                                  className="p-2 d-flex align-items-center justify-content-center"
                                  onClick={() => handleEditPost(post)}
                                  title="Chỉnh sửa"
                                >
                                  <i className="bi bi-pencil"></i>
                                </Button>
                                <Button
                                  variant={post.featured ? "warning" : "outline-warning"}
                                  size="sm"
                                  className="p-2 d-flex align-items-center justify-content-center"
                                  onClick={() => handleToggleFeatured(post.id)}
                                  title={post.featured ? "Bỏ nổi bật" : "Đánh dấu nổi bật"}
                                >
                                  <i className="bi bi-star-fill"></i>
                                </Button>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  className="p-2 d-flex align-items-center justify-content-center"
                                  onClick={() => handleDeletePost(post)}
                                  title="Xóa"
                                >
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </div>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </Table>
                </Card.Body>
              </Card>
            </>
          )}
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Bạn có chắc chắn muốn xóa bài viết "{selectedPost?.title}"?
          <br />
          Hành động này không thể hoàn tác.
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Xóa bài viết
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BlogManagement;