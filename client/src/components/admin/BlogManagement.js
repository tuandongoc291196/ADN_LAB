/**
 * COMPONENT: BlogManagement
 * CHỨC NĂNG: Trang quản lý danh sách bài viết blog
 * LUỒNG HOẠT ĐỘNG:
 * 1. Kiểm tra quyền admin từ user context
 * 2. Tải danh sách blog từ API getAllBlogs()
 * 3. Hiển thị danh sách với pagination và filtering
 * 4. Cho phép tìm kiếm theo tiêu đề, nội dung
 * 5. Thực hiện CRUD operations: tạo, xem, sửa, xóa bài viết
 * 6. Bulk actions: chọn nhiều và thao tác hàng loạt
 * 7. Toggle trạng thái active/inactive cho bài viết
 * 8. Hiển thị thống kê tổng quan về blog
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Row, Col, Card, Button, Table, Badge, Form, Modal, Alert, Tab, Nav, ButtonGroup, Dropdown } from 'react-bootstrap';
import { getAllBlogs, deleteBlog, updateBlog } from '../../services/api';
import { useAuth } from '../context/auth';

const BlogManagement = () => {
  // ROUTER HOOKS
  const navigate = useNavigate(); // Hook điều hướng
  
  // AUTH CONTEXT
  const { user } = useAuth(); // Context authentication
  
  // STATE QUẢN LÝ UI
  const [selectedTab, setSelectedTab] = useState('all'); // Tab đang chọn (all/active/inactive)
  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
  const [showDeleteModal, setShowDeleteModal] = useState(false); // Hiển thị modal xóa
  const [selectedPost, setSelectedPost] = useState(null); // Bài viết được chọn để xóa
  const [message, setMessage] = useState({ type: '', content: '' }); // Thông báo
  const [loading, setLoading] = useState(true); // Loading state
  const [blogPosts, setBlogPosts] = useState([]); // Danh sách bài viết
  
  // STATE QUẢN LÝ BULK ACTIONS
  const [selectedItems, setSelectedItems] = useState([]); // Danh sách item được chọn
  const [selectAll, setSelectAll] = useState(false); // Trạng thái chọn tất cả
  const [showBulkDeleteModal, setShowBulkDeleteModal] = useState(false); // Modal xóa hàng loạt
  const [bulkAction, setBulkAction] = useState(''); // Hành động bulk đang thực hiện
  const [processingBulk, setProcessingBulk] = useState(false); // Loading state cho bulk action
  
  // STATE QUẢN LÝ MODAL CHI TIẾT
  const [showDetailModal, setShowDetailModal] = useState(false); // Hiển thị modal xem chi tiết
  const [viewingBlog, setViewingBlog] = useState(null); // Blog đang xem chi tiết

  /**
   * EFFECT: Kiểm tra quyền admin và tải dữ liệu blog
   * BƯỚC 1: Kiểm tra nếu user có role admin (role.id === '3')
   * BƯỚC 2: Nếu không có quyền, redirect về trang chủ
   * BƯỚC 3: Nếu có quyền, gọi fetchBlogs() để tải dữ liệu
   */
  useEffect(() => {
    if (!user?.role?.id || user.role.id !== '3') {
      navigate('/');
      return;
    }
    fetchBlogs();
  }, [user]);

  /**
   * API CALL: Tải danh sách blog từ API
   * BƯỚC 1: Set loading state thành true
   * BƯỚC 2: Gọi API getAllBlogs()
   * BƯỚC 3: Cập nhật state blogPosts với dữ liệu nhận được
   * BƯỚC 4: Hiển thị thông báo nếu không có bài viết
   * BƯỚC 5: Xử lý lỗi nếu có
   * BƯỚC 6: Set loading state thành false
   */
  const fetchBlogs = async () => {
    try {
      setLoading(true);
      // BƯỚC 2: Gọi API getAllBlogs()
      const blogs = await getAllBlogs();
      // BƯỚC 3: Cập nhật state blogPosts với dữ liệu nhận được
      setBlogPosts(blogs || []);
      
      // BƯỚC 4: Hiển thị thông báo nếu không có bài viết
      if (blogs.length === 0) {
        setMessage({ 
          type: 'info', 
          content: 'Chưa có bài viết nào. Hãy tạo bài viết đầu tiên!' 
        });
      } else {
        setMessage({ type: '', content: '' });
      }
    } catch (error) {
      // BƯỚC 5: Xử lý lỗi nếu có
      setMessage({ 
        type: 'danger', 
        content: 'Lỗi khi tải danh sách blog: ' + error.message 
      });
    } finally {
      // BƯỚC 6: Set loading state thành false
      setLoading(false);
    }
  };

  /**
   * EVENT HANDLER: Tạo bài viết mới
   * BƯỚC 1: Kiểm tra quyền admin
   * BƯỚC 2: Nếu không có quyền, hiển thị thông báo lỗi
   * BƯỚC 3: Nếu có quyền, navigate đến trang tạo bài viết
   */
  const handleCreateNew = () => {
    if (!user?.role?.id || user.role.id !== '3') {
      setMessage({ type: 'danger', content: 'Bạn không có quyền tạo bài viết mới!' });
      return;
    }
    navigate('/admin/blog/create');
  };

  /**
   * HELPER FUNCTION: Tính toán thống kê blog
   * OUTPUT: object - thống kê tổng quan về blog
   * BƯỚC 1: Tính tổng số bài viết
   * BƯỚC 2: Tính số bài viết active/inactive
   * BƯỚC 3: Tính phần trăm active/inactive
   * BƯỚC 4: Return object thống kê
   */
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

  /**
   * EVENT HANDLER: Chọn/bỏ chọn tất cả bài viết
   * INPUT: checked (boolean) - trạng thái checkbox
   * BƯỚC 1: Cập nhật state selectAll
   * BƯỚC 2: Nếu checked = true, thêm tất cả blog ID vào selectedItems
   * BƯỚC 3: Nếu checked = false, xóa tất cả khỏi selectedItems
   */
  const handleSelectAll = (checked) => {
    setSelectAll(checked);
    if (checked) {
      setSelectedItems(blogPosts.map(blog => blog.id));
    } else {
      setSelectedItems([]);
    }
  };

  /**
   * EVENT HANDLER: Chọn/bỏ chọn một bài viết
   * INPUT: postId (string) - ID bài viết, checked (boolean) - trạng thái checkbox
   * BƯỚC 1: Nếu checked = true, thêm postId vào selectedItems
   * BƯỚC 2: Nếu checked = false, xóa postId khỏi selectedItems
   * BƯỚC 3: Cập nhật selectAll dựa trên số lượng item được chọn
   */
  const handleSelectItem = (postId, checked) => {
    if (checked) {
      setSelectedItems(prev => [...prev, postId]);
    } else {
      setSelectedItems(prev => prev.filter(id => id !== postId));
    }
    
    // Cập nhật selectAll
    const filteredBlogs = getFilteredBlogs();
    const newSelectedItems = checked 
      ? [...selectedItems, postId]
      : selectedItems.filter(id => id !== postId);
    
    setSelectAll(newSelectedItems.length === filteredBlogs.length && filteredBlogs.length > 0);
  };

  /**
   * HELPER FUNCTION: Tạo badge cho trạng thái bài viết
   * INPUT: isActive (boolean) - trạng thái active của bài viết
   * OUTPUT: JSX Badge component
   * BƯỚC 1: Kiểm tra isActive và return badge tương ứng
   * BƯỚC 2: Màu sắc khác nhau cho active/inactive
   */
  const getStatusBadge = (isActive) => {
    return isActive ? 
      <Badge bg="success">Đang hoạt động</Badge> : 
      <Badge bg="secondary">Không hoạt động</Badge>;
  };

  /**
   * EVENT HANDLER: Xóa một bài viết
   * INPUT: post (object) - thông tin bài viết cần xóa
   * BƯỚC 1: Set selectedPost với bài viết cần xóa
   * BƯỚC 2: Hiển thị modal xác nhận xóa
   */
  const handleDeletePost = async (post) => {
    setSelectedPost(post);
    setShowDeleteModal(true);
  };

  /**
   * EVENT HANDLER: Xác nhận xóa bài viết
   * BƯỚC 1: Kiểm tra nếu có selectedPost
   * BƯỚC 2: Gọi API deleteBlog() với ID bài viết
   * BƯỚC 3: Hiển thị thông báo thành công
   * BƯỚC 4: Đóng modal và refetch dữ liệu
   * BƯỚC 5: Xử lý lỗi nếu có
   */
  const confirmDelete = async () => {
    if (!selectedPost) return;
    
    try {
      await deleteBlog(selectedPost.id);
      setMessage({ type: 'success', content: 'Xóa bài viết thành công!' });
      setShowDeleteModal(false);
      setSelectedPost(null);
      fetchBlogs(); // Refetch dữ liệu
    } catch (error) {
      setMessage({ type: 'danger', content: 'Lỗi khi xóa bài viết: ' + error.message });
    }
  };

  /**
   * HELPER FUNCTION: Làm sạch nội dung HTML
   * INPUT: content (string) - nội dung HTML
   * OUTPUT: string - nội dung đã làm sạch
   * BƯỚC 1: Tạo temporary div element
   * BƯỚC 2: Set innerHTML với content
   * BƯỚC 3: Lấy textContent để loại bỏ HTML tags
   * BƯỚC 4: Cắt ngắn nếu quá dài (200 ký tự)
   */
  const sanitizeContent = (content) => {
    if (!content) return '';
    
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = content;
    const textContent = tempDiv.textContent || tempDiv.innerText || '';
    
    return textContent.length > 200 
      ? textContent.substring(0, 200) + '...' 
      : textContent;
  };

  /**
   * EVENT HANDLER: Xem chi tiết bài viết
   * INPUT: post (object) - thông tin bài viết
   * BƯỚC 1: Set viewingBlog với bài viết cần xem
   * BƯỚC 2: Hiển thị modal chi tiết
   */
  const handleViewPost = (post) => {
    setViewingBlog(post);
    setShowDetailModal(true);
  };

  /**
   * EVENT HANDLER: Sửa bài viết
   * INPUT: post (object) - thông tin bài viết
   * BƯỚC 1: Navigate đến trang edit với ID bài viết
   */
  const handleEditPost = (post) => {
    navigate(`/admin/blog/edit/${post.id}`);
  };

  /**
   * EVENT HANDLER: Toggle trạng thái active/inactive
   * INPUT: postId (string) - ID bài viết, currentStatus (boolean) - trạng thái hiện tại
   * BƯỚC 1: Gọi API updateBlog() với trạng thái mới
   * BƯỚC 2: Hiển thị thông báo thành công
   * BƯỚC 3: Refetch dữ liệu để cập nhật UI
   * BƯỚC 4: Xử lý lỗi nếu có
   */
  const handleToggleStatus = async (postId, currentStatus) => {
    try {
      await updateBlog(postId, { isActive: !currentStatus });
      setMessage({ 
        type: 'success', 
        content: `Bài viết đã được ${!currentStatus ? 'kích hoạt' : 'vô hiệu hóa'}!` 
      });
      fetchBlogs(); // Refetch dữ liệu
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        content: 'Lỗi khi cập nhật trạng thái: ' + error.message 
      });
    }
  };

  /**
   * EVENT HANDLER: Thực hiện bulk action
   * BƯỚC 1: Kiểm tra nếu có selectedItems
   * BƯỚC 2: Set processingBulk thành true
   * BƯỚC 3: Thực hiện action tương ứng (activate/deactivate/delete)
   * BƯỚC 4: Hiển thị thông báo thành công
   * BƯỚC 5: Reset selectedItems và refetch dữ liệu
   * BƯỚC 6: Xử lý lỗi nếu có
   * BƯỚC 7: Set processingBulk thành false
   */
  const handleBulkAction = async () => {
    if (selectedItems.length === 0) return;
    
    setProcessingBulk(true);
    try {
      if (bulkAction === 'activate') {
        // Kích hoạt tất cả bài viết được chọn
        await Promise.all(selectedItems.map(id => updateBlog(id, { isActive: true })));
        setMessage({ type: 'success', content: `Đã kích hoạt ${selectedItems.length} bài viết!` });
      } else if (bulkAction === 'deactivate') {
        // Vô hiệu hóa tất cả bài viết được chọn
        await Promise.all(selectedItems.map(id => updateBlog(id, { isActive: false })));
        setMessage({ type: 'success', content: `Đã vô hiệu hóa ${selectedItems.length} bài viết!` });
      } else if (bulkAction === 'delete') {
        // Xóa tất cả bài viết được chọn
        await Promise.all(selectedItems.map(id => deleteBlog(id)));
        setMessage({ type: 'success', content: `Đã xóa ${selectedItems.length} bài viết!` });
      }
      
      setSelectedItems([]);
      setSelectAll(false);
      setShowBulkDeleteModal(false);
      fetchBlogs(); // Refetch dữ liệu
    } catch (error) {
      setMessage({ 
        type: 'danger', 
        content: 'Lỗi khi thực hiện hành động hàng loạt: ' + error.message 
      });
    } finally {
      setProcessingBulk(false);
    }
  };

  /**
   * HELPER FUNCTION: Format ngày tháng theo định dạng Việt Nam
   * INPUT: dateString (string) - chuỗi ngày tháng
   * OUTPUT: string - ngày tháng đã format
   * BƯỚC 1: Tạo Date object từ dateString
   * BƯỚC 2: Format theo định dạng Việt Nam
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      year: 'numeric',
      month: '2-digit',
      day: '2-digit',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  /**
   * HELPER FUNCTION: Lọc bài viết theo tab và search term
   * OUTPUT: array - danh sách bài viết đã lọc
   * BƯỚC 1: Lọc theo selectedTab (all/active/inactive)
   * BƯỚC 2: Lọc theo searchTerm (tiêu đề hoặc nội dung)
   * BƯỚC 3: Return danh sách đã lọc
   */
  const getFilteredBlogs = () => {
    let filtered = blogPosts;
    
    // Lọc theo tab
    if (selectedTab === 'active') {
      filtered = filtered.filter(blog => blog.isActive);
    } else if (selectedTab === 'inactive') {
      filtered = filtered.filter(blog => !blog.isActive);
    }
    
    // Lọc theo search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(blog => 
        blog.title?.toLowerCase().includes(term) ||
        blog.content?.toLowerCase().includes(term)
      );
    }
    
    return filtered;
  };

  // COMPUTED VALUES
  const stats = getStatistics();
  const filteredBlogs = getFilteredBlogs();

  return (
    <div>
      {/* HEADER: Tiêu đề và nút tạo mới */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Quản lý Blog</h2>
          <p className="text-muted mb-0">Quản lý tất cả bài viết blog trong hệ thống</p>
        </div>
        <Button variant="success" onClick={handleCreateNew}>
          <i className="bi bi-plus-circle me-2"></i>Tạo bài viết mới
        </Button>
      </div>

      {/* ALERT: Hiển thị thông báo */}
      {message.content && (
        <Alert variant={message.type} onClose={() => setMessage({ type: '', content: '' })} dismissible>
          {message.content}
        </Alert>
      )}

      {/* STATISTICS CARDS: Thống kê tổng quan */}
      <Row className="mb-4">
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-primary">{stats.total}</h3>
              <p className="mb-0 text-muted">Tổng bài viết</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-success">{stats.active}</h3>
              <p className="mb-0 text-muted">Đang hoạt động</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-secondary">{stats.inactive}</h3>
              <p className="mb-0 text-muted">Không hoạt động</p>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3}>
          <Card className="text-center">
            <Card.Body>
              <h3 className="text-info">{stats.activePercentage}%</h3>
              <p className="mb-0 text-muted">Tỷ lệ hoạt động</p>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* FILTERS AND SEARCH: Bộ lọc và tìm kiếm */}
      <Card className="mb-4">
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
                <Nav variant="tabs" activeKey={selectedTab} onSelect={(k) => setSelectedTab(k)}>
                  <Nav.Item>
                    <Nav.Link eventKey="all">Tất cả ({stats.total})</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="active">Đang hoạt động ({stats.active})</Nav.Link>
                  </Nav.Item>
                  <Nav.Item>
                    <Nav.Link eventKey="inactive">Không hoạt động ({stats.inactive})</Nav.Link>
                  </Nav.Item>
                </Nav>
              </Form.Group>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* BULK ACTIONS: Hành động hàng loạt */}
      {selectedItems.length > 0 && (
        <Card className="mb-4 border-warning">
          <Card.Body>
            <div className="d-flex justify-content-between align-items-center">
              <span className="text-warning">
                <i className="bi bi-check-circle me-2"></i>
                Đã chọn {selectedItems.length} bài viết
              </span>
              <ButtonGroup>
                <Button 
                  variant="outline-success" 
                  size="sm"
                  onClick={() => {
                    setBulkAction('activate');
                    setShowBulkDeleteModal(true);
                  }}
                >
                  <i className="bi bi-check-circle me-1"></i>Kích hoạt
                </Button>
                <Button 
                  variant="outline-warning" 
                  size="sm"
                  onClick={() => {
                    setBulkAction('deactivate');
                    setShowBulkDeleteModal(true);
                  }}
                >
                  <i className="bi bi-pause-circle me-1"></i>Vô hiệu hóa
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => {
                    setBulkAction('delete');
                    setShowBulkDeleteModal(true);
                  }}
                >
                  <i className="bi bi-trash me-1"></i>Xóa
                </Button>
              </ButtonGroup>
            </div>
          </Card.Body>
        </Card>
      )}

      {/* BLOG TABLE: Bảng danh sách bài viết */}
      <Card>
        <Card.Body className="p-0">
          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
              <p className="mt-2 text-muted">Đang tải danh sách bài viết...</p>
            </div>
          ) : (
            <Table responsive hover className="mb-0">
              <thead className="bg-light">
                <tr>
                  <th>
                    <Form.Check
                      type="checkbox"
                      checked={selectAll}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                    />
                  </th>
                  <th>Tiêu đề</th>
                  <th>Trạng thái</th>
                  <th>Ngày tạo</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredBlogs.map((blog) => (
                  <tr key={blog.id}>
                    <td>
                      <Form.Check
                        type="checkbox"
                        checked={selectedItems.includes(blog.id)}
                        onChange={(e) => handleSelectItem(blog.id, e.target.checked)}
                      />
                    </td>
                    <td>
                      <div>
                        <strong>{blog.title}</strong>
                        <br />
                        <small className="text-muted">
                          {sanitizeContent(blog.content)}
                        </small>
                      </div>
                    </td>
                    <td>{getStatusBadge(blog.isActive)}</td>
                    <td>{formatDate(blog.createdAt)}</td>
                    <td>
                      <ButtonGroup size="sm">
                        <Button 
                          variant="outline-info" 
                          onClick={() => handleViewPost(blog)}
                          title="Xem chi tiết"
                        >
                          <i className="bi bi-eye"></i>
                        </Button>
                        <Button 
                          variant="outline-warning" 
                          onClick={() => handleEditPost(blog)}
                          title="Chỉnh sửa"
                        >
                          <i className="bi bi-pencil"></i>
                        </Button>
                        <Button 
                          variant="outline-secondary" 
                          onClick={() => handleToggleStatus(blog.id, blog.isActive)}
                          title={blog.isActive ? 'Vô hiệu hóa' : 'Kích hoạt'}
                        >
                          <i className={`bi ${blog.isActive ? 'bi-pause' : 'bi-play'}`}></i>
                        </Button>
                        <Button 
                          variant="outline-danger" 
                          onClick={() => handleDeletePost(blog)}
                          title="Xóa"
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </ButtonGroup>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          )}
          
          {/* EMPTY STATE: Hiển thị khi không có bài viết */}
          {!loading && filteredBlogs.length === 0 && (
            <div className="text-center py-5">
              <i className="bi bi-newspaper text-muted fs-1"></i>
              <h5 className="text-muted mt-3">Không tìm thấy bài viết nào</h5>
              <p className="text-muted">Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* DELETE MODAL: Modal xác nhận xóa một bài viết */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận xóa</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xóa bài viết "<strong>{selectedPost?.title}</strong>"?</p>
          <p className="text-muted">Hành động này không thể hoàn tác.</p>
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

      {/* BULK DELETE MODAL: Modal xác nhận bulk action */}
      <Modal show={showBulkDeleteModal} onHide={() => setShowBulkDeleteModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận hành động hàng loạt</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>
            Bạn có chắc chắn muốn {bulkAction === 'activate' ? 'kích hoạt' : 
                                   bulkAction === 'deactivate' ? 'vô hiệu hóa' : 
                                   'xóa'} {selectedItems.length} bài viết đã chọn?
          </p>
          {bulkAction === 'delete' && (
            <p className="text-danger">
              <i className="bi bi-exclamation-triangle me-2"></i>
              Hành động này không thể hoàn tác.
            </p>
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
            {processingBulk ? 'Đang xử lý...' : 'Xác nhận'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* DETAIL MODAL: Modal xem chi tiết bài viết */}
      <Modal show={showDetailModal} onHide={() => setShowDetailModal(false)} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>Chi tiết bài viết</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {viewingBlog && (
            <div>
              <h4>{viewingBlog.title}</h4>
              <div className="mb-3">
                <Badge bg={viewingBlog.isActive ? 'success' : 'secondary'} className="me-2">
                  {viewingBlog.isActive ? 'Đang hoạt động' : 'Không hoạt động'}
                </Badge>
                <small className="text-muted">
                  Tạo lúc: {formatDate(viewingBlog.createdAt)}
                </small>
              </div>
              <div dangerouslySetInnerHTML={{ __html: viewingBlog.content }} />
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDetailModal(false)}>
            Đóng
          </Button>
          {viewingBlog && (
            <Button variant="warning" onClick={() => handleEditPost(viewingBlog)}>
              <i className="bi bi-pencil me-2"></i>Chỉnh sửa
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default BlogManagement;