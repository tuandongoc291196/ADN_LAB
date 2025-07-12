/**
 * COMPONENT: BlogManagement
 * MỤC ĐÍCH: Trang quản lý danh sách bài viết blog
 * CHỨC NĂNG:
 * - Hiển thị danh sách tất cả bài viết với pagination
 * - Lọc bài viết theo trạng thái (active/inactive)
 * - Tìm kiếm bài viết theo tiêu đề, nội dung
 * - Thao tác CRUD (tạo, đọc, cập nhật, xóa) bài viết
 * - Bulk actions: chọn nhiều và thao tác hàng loạt
 * - Thống kê tổng quan về blog
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Badge, Form, Modal, Alert, Tab, Nav, ButtonGroup, Dropdown } from 'react-bootstrap';
import { getAllBlogs, deleteBlog, updateBlog } from '../../services/api';
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
  
  // Bulk actions state
  const [selectedItems, setSelectedItems] = useState([]);
  const [selectAll, setSelectAll] = useState(false);
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false);
  const [bulkAction, setBulkAction] = useState('');
  const [processingBulk, setProcessingBulk] = useState(false);

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

  // Tính toán thống kê
  const getStatistics = () => {
    const totalBlogs = blogPosts.length;
    const activeBlogs = blogPosts.filter(blog => blog.isActive).length;
    const inactiveBlogs = totalBlogs - activeBlogs;
    const activePercentage = totalBlogs > 0 ? Math.round((activeBlogs / totalBlogs) * 100) : 0;
    const inactivePercentage = totalBlogs > 0 ? Math.round((inactiveBlogs / totalBlogs) * 100) : 0;

    return {
      total: totalBlogs,
      active: activeBlogs,
      inactive: inactiveBlogs,
      activePercentage,
      inactivePercentage
    };
  };

  // Hàm lọc bài viết theo search term và tab được chọn
  const filteredPosts = blogPosts.filter(post => {
    // Tìm kiếm theo tiêu đề hoặc nội dung
    const matchesSearch = post.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.content?.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Lọc theo tab được chọn
    const matchesTab = selectedTab === 'all' || 
                      (selectedTab === 'active' && post.isActive) ||
                      (selectedTab === 'inactive' && !post.isActive);
    
    return matchesSearch && matchesTab;
  });

  // Bulk selection functions
  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedItems(filteredPosts.map(post => post.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (postId, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, postId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== postId));
    }
  };

  // Update select all state when items change
  useEffect(() => {
    const allSelected = filteredPosts.length > 0 && selectedItems.length === filteredPosts.length;
    setSelectAll(allSelected);
  }, [selectedItems, filteredPosts]);

  // Hàm tạo badge hiển thị trạng thái bài viết
  const getStatusBadge = (isActive) => {
    return isActive 
      ? <Badge bg="success">Đang hiển thị</Badge>
      : <Badge bg="secondary">Đã ẩn</Badge>;
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

  // Hàm thay đổi trạng thái hiển thị của bài viết (tối ưu)
  const handleToggleStatus = async (postId, currentStatus) => {
    try {
      // Optimistic update - cập nhật UI ngay lập tức
      setBlogPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, isActive: !currentStatus } : post
      ));

      await updateBlog({ 
        blogId: postId, 
        isActive: !currentStatus 
      });

      setMessage({ type: 'success', content: 'Đã cập nhật trạng thái bài viết!' });
    } catch (error) {
      // Revert nếu có lỗi
      setBlogPosts(prev => prev.map(post => 
        post.id === postId ? { ...post, isActive: currentStatus } : post
      ));
      setMessage({ type: 'danger', content: 'Lỗi khi cập nhật trạng thái: ' + error.message });
    }
    setTimeout(() => setMessage({ type: '', content: '' }), 3000);
  };

  // Bulk actions
  const handleBulkAction = async () => {
    if (selectedItems.length === 0) {
      setMessage({ type: 'warning', content: 'Vui lòng chọn ít nhất một bài viết!' });
      return;
    }

    setProcessingBulk(true);
    try {
      const promises = selectedItems.map(async (postId) => {
        const post = blogPosts.find(p => p.id === postId);
        if (!post) return;

        switch (bulkAction) {
          case 'activate':
            return updateBlog({ blogId: postId, isActive: true });
          case 'deactivate':
            return updateBlog({ blogId: postId, isActive: false });
          case 'delete':
            return deleteBlog(postId);
          default:
            return Promise.resolve();
        }
      });

      await Promise.all(promises);
      
      // Refresh data
      await fetchBlogs();
      
      // Clear selection
      setSelectedItems([]);
      setSelectAll(false);
      
      const actionText = {
        'activate': 'kích hoạt',
        'deactivate': 'ẩn',
        'delete': 'xóa'
      }[bulkAction];
      
      setMessage({ 
        type: 'success', 
        content: `Đã ${actionText} ${selectedItems.length} bài viết thành công!` 
      });
      
    } catch (error) {
      console.error('Bulk action error:', error);
      setMessage({ 
        type: 'danger', 
        content: `Lỗi khi thực hiện thao tác hàng loạt: ${error.message}` 
      });
    } finally {
      setProcessingBulk(false);
      setShowBulkDeleteModal(false);
      setBulkAction('');
    }
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

  const stats = getStatistics();

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
            <p>Đang tải danh sách bài viết...</p>
          </Card.Body>
        </Card>
      ) : (
        <>
          {/* Statistics Cards */}
          <Row className="mb-4">
            <Col lg={4} md={6} className="mb-3">
              <Card className="border-0 shadow-sm bg-primary text-white h-100">
                <Card.Body className="text-center">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <i className="bi bi-newspaper fs-1 me-3"></i>
                    <div>
                      <div className="h2 mb-0 fw-bold">{stats.total}</div>
                      <small>Tổng bài viết</small>
                    </div>
                  </div>
                  <div className="progress bg-white bg-opacity-25" style={{height: '4px'}}>
                    <div className="progress-bar bg-white" style={{width: '100%'}}></div>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} md={6} className="mb-3">
              <Card className="border-0 shadow-sm bg-success text-white h-100">
                <Card.Body className="text-center">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <i className="bi bi-eye fs-1 me-3"></i>
                    <div>
                      <div className="h2 mb-0 fw-bold">{stats.active}</div>
                      <small>Đang hiển thị</small>
                    </div>
                  </div>
                  <div className="progress bg-white bg-opacity-25" style={{height: '4px'}}>
                    <div className="progress-bar bg-white" style={{width: `${stats.activePercentage}%`}}></div>
                  </div>
                  <small className="text-white-50">{stats.activePercentage}%</small>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4} md={6} className="mb-3">
              <Card className="border-0 shadow-sm bg-secondary text-white h-100">
                <Card.Body className="text-center">
                  <div className="d-flex align-items-center justify-content-center mb-2">
                    <i className="bi bi-eye-slash fs-1 me-3"></i>
                    <div>
                      <div className="h2 mb-0 fw-bold">{stats.inactive}</div>
                      <small>Đã ẩn</small>
                    </div>
                  </div>
                  <div className="progress bg-white bg-opacity-25" style={{height: '4px'}}>
                    <div className="progress-bar bg-white" style={{width: `${stats.inactivePercentage}%`}}></div>
                  </div>
                  <small className="text-white-50">{stats.inactivePercentage}%</small>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Search and Filter */}
          <Card className="shadow-sm mb-4">
            <Card.Body>
              <Row>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Tìm kiếm</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Tìm theo tiêu đề hoặc nội dung..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label>Lọc theo trạng thái</Form.Label>
                    <Tab.Container activeKey={selectedTab} onSelect={setSelectedTab}>
                      <Nav variant="pills" className="flex-row">
                        <Nav.Item>
                          <Nav.Link eventKey="all">Tất cả ({blogPosts.length})</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="active">Đang hiển thị ({stats.active})</Nav.Link>
                        </Nav.Item>
                        <Nav.Item>
                          <Nav.Link eventKey="inactive">Đã ẩn ({stats.inactive})</Nav.Link>
                        </Nav.Item>
                      </Nav>
                    </Tab.Container>
                  </Form.Group>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Bulk Actions */}
          {selectedItems.length > 0 && (
            <Card className="shadow-sm mb-4 border-warning">
              <Card.Body className="py-2">
                <div className="d-flex justify-content-between align-items-center">
                  <div className="d-flex align-items-center">
                    <i className="bi bi-check-circle-fill text-warning me-2"></i>
                    <span className="fw-bold">
                      Đã chọn {selectedItems.length} bài viết
                    </span>
                  </div>
                  <div className="d-flex gap-2">
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-primary" size="sm">
                        <i className="bi bi-gear me-1"></i>
                        Thao tác hàng loạt
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => { setBulkAction('activate'); setShowBulkDeleteModal(true); }}>
                          <i className="bi bi-eye me-2"></i>Hiển thị tất cả
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => { setBulkAction('deactivate'); setShowBulkDeleteModal(true); }}>
                          <i className="bi bi-eye-slash me-2"></i>Ẩn tất cả
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item 
                          onClick={() => { setBulkAction('delete'); setShowBulkDeleteModal(true); }}
                          className="text-danger"
                        >
                          <i className="bi bi-trash me-2"></i>Xóa tất cả
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                    <Button 
                      variant="outline-secondary" 
                      size="sm"
                      onClick={() => { setSelectedItems([]); setSelectAll(false); }}
                    >
                      <i className="bi bi-x me-1"></i>Bỏ chọn
                    </Button>
                  </div>
                </div>
              </Card.Body>
            </Card>
          )}

          {/* Blog Posts Table */}
          <Card className="shadow-sm">
            <Card.Header>
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Danh sách bài viết ({filteredPosts.length})</h5>
              </div>
            </Card.Header>
            <Card.Body className="p-0">
              <Table responsive className="mb-0">
                <thead className="table-light">
                  <tr>
                    <th style={{width: '50px'}}>
                      <Form.Check
                        type="checkbox"
                        checked={selectAll}
                        onChange={(e) => handleSelectAll(e.target.checked)}
                      />
                    </th>
                    <th>Tiêu đề</th>
                    <th>Tác giả</th>
                    <th>Trạng thái</th>
                    <th>Ngày tạo</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPosts.length === 0 ? (
                    <tr>
                      <td colSpan="6" className="text-center py-4">
                        <p className="text-muted mb-0">Không tìm thấy bài viết nào.</p>
                      </td>
                    </tr>
                  ) : (
                    filteredPosts.map(post => (
                      <tr key={post.id}>
                        <td>
                          <Form.Check
                            type="checkbox"
                            checked={selectedItems.includes(post.id)}
                            onChange={(e) => handleSelectItem(post.id, e.target.checked)}
                          />
                        </td>
                        <td>
                          <div>
                            <strong>{post.title}</strong>
                            <br />
                            <small className="text-muted">
                              {post.content && post.content.length > 100 
                                ? post.content.substring(0, 100) + '...' 
                                : post.content}
                            </small>
                          </div>
                        </td>
                        <td>{post.user?.fullname || 'Admin'}</td>
                        <td>{getStatusBadge(post.isActive)}</td>
                        <td>{formatDate(post.createdAt)}</td>
                        <td>
                          <div className="btn-group" role="group">
                            <Button
                              size="sm"
                              variant="outline-primary"
                              onClick={() => handleEditPost(post)}
                            >
                              <i className="bi bi-pencil"></i>
                            </Button>
                            <Button
                              size="sm"
                              variant={post.isActive ? "outline-warning" : "outline-success"}
                              onClick={() => handleToggleStatus(post.id, post.isActive)}
                            >
                              <i className={`bi bi-${post.isActive ? 'eye-slash' : 'eye'}`}></i>
                            </Button>
                            <Button
                              size="sm"
                              variant="outline-danger"
                              onClick={() => handleDeletePost(post)}
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

      {/* Delete Confirmation Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa bài viết "<strong>{selectedPost?.title}</strong>"?</p>
          <p className="text-danger">Hành động này không thể hoàn tác!</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={confirmDelete}>
            Xóa
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Bulk Action Confirmation Modal */}
      <Modal show={showBulkDeleteModal} onHide={() => setShowBulkDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận thao tác hàng loạt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Bạn có chắc chắn muốn{' '}
            <strong>
              {bulkAction === 'activate' && 'kích hoạt'}
              {bulkAction === 'deactivate' && 'ẩn'}
              {bulkAction === 'delete' && 'xóa'}
            </strong>{' '}
            <strong>{selectedItems.length} bài viết</strong> đã chọn?
          </p>
          {bulkAction === 'delete' && (
            <Alert variant="danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Hành động xóa không thể hoàn tác!
            </Alert>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBulkDeleteModal(false)}>
            Hủy
          </Button>
          <Button 
            variant={bulkAction === 'delete' ? 'danger' : 'primary'}
            onClick={handleBulkAction}
            disabled={processingBulk}
          >
            {processingBulk ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                Đang xử lý...
              </>
            ) : (
              <>
                {bulkAction === 'activate' && 'Kích hoạt'}
                {bulkAction === 'deactivate' && 'Ẩn'}
                {bulkAction === 'delete' && 'Xóa'}
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default BlogManagement;