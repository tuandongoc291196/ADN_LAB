import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Button, Table, Badge, Modal, Form, 
  Alert, InputGroup, Dropdown, Pagination, Toast, ToastContainer 
} from 'react-bootstrap';

const GuideManagement = ({ user }) => {
  const [guides, setGuides] = useState([
    {
      id: 1,
      title: 'Hướng dẫn xét nghiệm ADN Y',
      category: 'ADN Y',
      status: 'published',
      views: 1250,
      lastUpdate: '2024-11-20',
      author: 'Dr. Nguyễn Văn A',
      description: 'Hướng dẫn chi tiết về quy trình xét nghiệm ADN Y để xác định dòng dõi nam giới',
      steps: 5,
      difficulty: 'Trung bình'
    },
    {
      id: 2,
      title: 'Chuẩn bị mẫu ADN ti thể',
      category: 'ADN Ti thể',
      status: 'draft',
      views: 856,
      lastUpdate: '2024-11-18',
      author: 'Dr. Trần Thị B',
      description: 'Quy trình chuẩn bị và bảo quản mẫu ADN ti thể',
      steps: 8,
      difficulty: 'Nâng cao'
    },
    {
      id: 3,
      title: 'Phân tích STR markers',
      category: 'STR',
      status: 'published',
      views: 2340,
      lastUpdate: '2024-11-15',
      author: 'Dr. Lê Văn C',
      description: 'Hướng dẫn phân tích và giải thích kết quả STR markers',
      steps: 6,
      difficulty: 'Cao'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [editingGuide, setEditingGuide] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const categories = ['ADN Y', 'ADN Ti thể', 'STR', 'SNP', 'Phả hệ', 'Khác'];
  const difficulties = ['Cơ bản', 'Trung bình', 'Nâng cao', 'Cao'];

  const [formData, setFormData] = useState({
    title: '',
    category: '',
    description: '',
    content: '',
    difficulty: 'Cơ bản',
    status: 'draft',
    steps: 1
  });

  // Filter guides
  const filteredGuides = guides.filter(guide => {
    const matchesSearch = guide.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         guide.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = filterCategory === 'all' || guide.category === filterCategory;
    const matchesStatus = filterStatus === 'all' || guide.status === filterStatus;
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  const handleShowModal = (guide = null) => {
    if (guide) {
      setEditingGuide(guide);
      setFormData({
        title: guide.title,
        category: guide.category,
        description: guide.description,
        content: guide.content || '',
        difficulty: guide.difficulty,
        status: guide.status,
        steps: guide.steps
      });
    } else {
      setEditingGuide(null);
      setFormData({
        title: '',
        category: '',
        description: '',
        content: '',
        difficulty: 'Cơ bản',
        status: 'draft',
        steps: 1
      });
    }
    setShowModal(true);
  };

  const handleSaveGuide = () => {
    if (editingGuide) {
      // Update existing guide
      setGuides(guides.map(guide => 
        guide.id === editingGuide.id 
          ? { ...guide, ...formData, lastUpdate: new Date().toISOString().split('T')[0] }
          : guide
      ));
      setToastMessage('Hướng dẫn đã được cập nhật thành công!');
    } else {
      // Create new guide
      const newGuide = {
        ...formData,
        id: Date.now(),
        views: 0,
        lastUpdate: new Date().toISOString().split('T')[0],
        author: user?.name || 'Admin'
      };
      setGuides([newGuide, ...guides]);
      setToastMessage('Hướng dẫn mới đã được tạo thành công!');
    }
    
    setShowModal(false);
    setShowToast(true);
  };

  const handleDeleteGuide = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa hướng dẫn này?')) {
      setGuides(guides.filter(guide => guide.id !== id));
      setToastMessage('Hướng dẫn đã được xóa thành công!');
      setShowToast(true);
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setGuides(guides.map(guide => 
      guide.id === id 
        ? { ...guide, status: newStatus, lastUpdate: new Date().toISOString().split('T')[0] }
        : guide
    ));
    setToastMessage(`Trạng thái hướng dẫn đã được cập nhật thành công!`);
    setShowToast(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'published':
        return <Badge bg="success">Đã xuất bản</Badge>;
      case 'draft':
        return <Badge bg="warning">Bản nháp</Badge>;
      case 'archived':
        return <Badge bg="secondary">Đã lưu trữ</Badge>;
      default:
        return <Badge bg="light">Không xác định</Badge>;
    }
  };

  const getDifficultyBadge = (difficulty) => {
    const colors = {
      'Cơ bản': 'primary',
      'Trung bình': 'info', 
      'Nâng cao': 'warning',
      'Cao': 'danger'
    };
    return <Badge bg={colors[difficulty] || 'light'}>{difficulty}</Badge>;
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-book text-info me-2"></i>
            Quản lý Hướng dẫn Xét nghiệm
          </h2>
          <p className="text-muted mb-0">Tạo và quản lý nội dung hướng dẫn cho khách hàng</p>
        </div>
        <Button variant="info" onClick={() => handleShowModal()}>
          <i className="bi bi-plus-circle me-2"></i>
          Tạo hướng dẫn mới
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-book-half text-info fs-1 mb-2"></i>
              <h3 className="mb-0">{guides.length}</h3>
              <small className="text-muted">Tổng hướng dẫn</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-check-circle text-success fs-1 mb-2"></i>
              <h3 className="mb-0">{guides.filter(g => g.status === 'published').length}</h3>
              <small className="text-muted">Đã xuất bản</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-pencil-square text-warning fs-1 mb-2"></i>
              <h3 className="mb-0">{guides.filter(g => g.status === 'draft').length}</h3>
              <small className="text-muted">Bản nháp</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-eye text-primary fs-1 mb-2"></i>
              <h3 className="mb-0">{guides.reduce((sum, g) => sum + g.views, 0).toLocaleString()}</h3>
              <small className="text-muted">Tổng lượt xem</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters and Search */}
      <Card className="border-0 shadow-sm mb-4">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={4} className="mb-2">
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Tìm kiếm hướng dẫn..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={3} className="mb-2">
              <Form.Select 
                value={filterCategory} 
                onChange={(e) => setFilterCategory(e.target.value)}
              >
                <option value="all">Tất cả danh mục</option>
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </Form.Select>
            </Col>
            <Col md={3} className="mb-2">
              <Form.Select 
                value={filterStatus} 
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="published">Đã xuất bản</option>
                <option value="draft">Bản nháp</option>
                <option value="archived">Đã lưu trữ</option>
              </Form.Select>
            </Col>
            <Col md={2} className="mb-2">
              <Button variant="outline-secondary" className="w-100">
                <i className="bi bi-funnel"></i> Lọc
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Guides Table */}
      <Card className="border-0 shadow-sm">
        <Card.Body className="p-0">
          <Table hover responsive>
            <thead className="bg-light">
              <tr>
                <th>Tiêu đề</th>
                <th>Danh mục</th>
                <th>Độ khó</th>
                <th>Trạng thái</th>
                <th>Lượt xem</th>
                <th>Cập nhật</th>
                <th>Tác giả</th>
                <th>Thao tác</th>
              </tr>
            </thead>
            <tbody>
              {filteredGuides.map(guide => (
                <tr key={guide.id}>
                  <td>
                    <div>
                      <div className="fw-medium">{guide.title}</div>
                      <small className="text-muted">{guide.description}</small>
                    </div>
                  </td>
                  <td>
                    <Badge bg="outline-info">{guide.category}</Badge>
                  </td>
                  <td>{getDifficultyBadge(guide.difficulty)}</td>
                  <td>{getStatusBadge(guide.status)}</td>
                  <td>
                    <i className="bi bi-eye me-1"></i>
                    {guide.views.toLocaleString()}
                  </td>
                  <td>{new Date(guide.lastUpdate).toLocaleDateString('vi-VN')}</td>
                  <td>{guide.author}</td>
                  <td>
                    <Dropdown>
                      <Dropdown.Toggle variant="outline-secondary" size="sm">
                        <i className="bi bi-three-dots"></i>
                      </Dropdown.Toggle>
                      <Dropdown.Menu>
                        <Dropdown.Item onClick={() => handleShowModal(guide)}>
                          <i className="bi bi-pencil me-2"></i>Chỉnh sửa
                        </Dropdown.Item>
                        <Dropdown.Item 
                          onClick={() => handleStatusChange(guide.id, guide.status === 'published' ? 'draft' : 'published')}
                        >
                          <i className="bi bi-arrow-repeat me-2"></i>
                          {guide.status === 'published' ? 'Chuyển về nháp' : 'Xuất bản'}
                        </Dropdown.Item>
                        <Dropdown.Item onClick={() => handleStatusChange(guide.id, 'archived')}>
                          <i className="bi bi-archive me-2"></i>Lưu trữ
                        </Dropdown.Item>
                        <Dropdown.Divider />
                        <Dropdown.Item 
                          className="text-danger"
                          onClick={() => handleDeleteGuide(guide.id)}
                        >
                          <i className="bi bi-trash me-2"></i>Xóa
                        </Dropdown.Item>
                      </Dropdown.Menu>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
          
          {filteredGuides.length === 0 && (
            <div className="text-center py-4">
              <i className="bi bi-search text-muted fs-1"></i>
              <p className="text-muted mt-2">Không tìm thấy hướng dẫn nào</p>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Create/Edit Guide Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingGuide ? 'Chỉnh sửa hướng dẫn' : 'Tạo hướng dẫn mới'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={8} className="mb-3">
                <Form.Label>Tiêu đề hướng dẫn</Form.Label>
                <Form.Control
                  type="text"
                  placeholder="Nhập tiêu đề hướng dẫn..."
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label>Danh mục</Form.Label>
                <Form.Select
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                >
                  <option value="">Chọn danh mục</option>
                  {categories.map(cat => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>

            <Row>
              <Col md={4} className="mb-3">
                <Form.Label>Độ khó</Form.Label>
                <Form.Select
                  value={formData.difficulty}
                  onChange={(e) => setFormData({...formData, difficulty: e.target.value})}
                >
                  {difficulties.map(diff => (
                    <option key={diff} value={diff}>{diff}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label>Số bước</Form.Label>
                <Form.Control
                  type="number"
                  min="1"
                  value={formData.steps}
                  onChange={(e) => setFormData({...formData, steps: parseInt(e.target.value)})}
                />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label>Trạng thái</Form.Label>
                <Form.Select
                  value={formData.status}
                  onChange={(e) => setFormData({...formData, status: e.target.value})}
                >
                  <option value="draft">Bản nháp</option>
                  <option value="published">Xuất bản</option>
                </Form.Select>
              </Col>
            </Row>

            <div className="mb-3">
              <Form.Label>Mô tả ngắn</Form.Label>
              <Form.Control
                as="textarea"
                rows={2}
                placeholder="Mô tả ngắn về nội dung hướng dẫn..."
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>

            <div className="mb-3">
              <Form.Label>Nội dung hướng dẫn</Form.Label>
              <Form.Control
                as="textarea"
                rows={8}
                placeholder="Nhập nội dung chi tiết của hướng dẫn..."
                value={formData.content}
                onChange={(e) => setFormData({...formData, content: e.target.value})}
              />
              <Form.Text className="text-muted">
                Hỗ trợ định dạng Markdown
              </Form.Text>
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="info" onClick={handleSaveGuide}>
            {editingGuide ? 'Cập nhật' : 'Tạo mới'}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Header>
            <i className="bi bi-check-circle text-success me-2"></i>
            <strong className="me-auto">Thành công</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default GuideManagement;