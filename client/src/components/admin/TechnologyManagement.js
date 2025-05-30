import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Button, Table, Badge, Modal, Form, 
  Alert, InputGroup, Dropdown, Tab, Tabs, ProgressBar, Toast, ToastContainer 
} from 'react-bootstrap';

const TechnologyManagement = ({ user }) => {
  const [activeTab, setActiveTab] = useState('technologies');
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [modalType, setModalType] = useState('technology'); // 'technology', 'equipment', 'protocol'
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  // Technologies data
  const [technologies, setTechnologies] = useState([
    {
      id: 1,
      name: 'Next Generation Sequencing (NGS)',
      category: 'Giải trình tự',
      status: 'active',
      accuracy: 99.9,
      throughput: 'Cao',
      applications: ['Whole Genome', 'Exome', 'Panel genes'],
      description: 'Công nghệ giải trình tự thế hệ mới cho phép phân tích hàng triệu đoạn ADN cùng lúc',
      lastUpdate: '2024-11-20',
      version: '2.1'
    },
    {
      id: 2,
      name: 'STR Analysis',
      category: 'Phân tích ADN',
      status: 'active',
      accuracy: 99.95,
      throughput: 'Trung bình',
      applications: ['Định danh cá thể', 'Phát hiện tội phạm', 'Xác định quan hệ cha con'],
      description: 'Phân tích các đoạn lặp ngắn để định danh và so sánh ADN',
      lastUpdate: '2024-11-18',
      version: '1.8'
    },
    {
      id: 3,
      name: 'Mitochondrial DNA Sequencing',
      category: 'ADN Ti thể',
      status: 'active',
      accuracy: 99.8,
      throughput: 'Thấp',
      applications: ['Truy tìm dòng dõi mẹ', 'Nghiên cứu tiến hóa', 'Phân tích mẫu cổ'],
      description: 'Giải trình tự ADN ti thể để nghiên cứu di truyền mẹ',
      lastUpdate: '2024-11-15',
      version: '1.5'
    }
  ]);

  // Equipment data
  const [equipment, setEquipment] = useState([
    {
      id: 1,
      name: 'Illumina NovaSeq 6000',
      type: 'Máy giải trình tự',
      status: 'operational',
      location: 'Phòng lab A',
      lastMaintenance: '2024-11-10',
      nextMaintenance: '2024-12-10',
      utilization: 85,
      warrantyExpiry: '2025-06-15'
    },
    {
      id: 2,
      name: 'Applied Biosystems 3500xL',
      type: 'Máy điện di mao quản',
      status: 'maintenance',
      location: 'Phòng lab B',
      lastMaintenance: '2024-11-20',
      nextMaintenance: '2024-12-20',
      utilization: 0,
      warrantyExpiry: '2025-03-20'
    },
    {
      id: 3,
      name: 'Thermo Fisher QuantStudio',
      type: 'Máy PCR thời gian thực',
      status: 'operational',
      location: 'Phòng lab A',
      lastMaintenance: '2024-11-05',
      nextMaintenance: '2024-12-05',
      utilization: 92,
      warrantyExpiry: '2025-08-10'
    }
  ]);

  // Protocols data
  const [protocols, setProtocols] = useState([
    {
      id: 1,
      name: 'DNA Extraction Protocol v2.0',
      category: 'Tách chiết ADN',
      status: 'approved',
      version: '2.0',
      steps: 12,
      duration: '2-3 giờ',
      difficulty: 'Trung bình',
      lastUpdate: '2024-11-15',
      approvedBy: 'Dr. Nguyễn Văn A'
    },
    {
      id: 2,
      name: 'STR Amplification Protocol',
      category: 'Khuếch đại ADN',
      status: 'review',
      version: '1.3',
      steps: 8,
      duration: '4-5 giờ',
      difficulty: 'Cao',
      lastUpdate: '2024-11-18',
      approvedBy: null
    },
    {
      id: 3,
      name: 'Library Preparation for NGS',
      category: 'Chuẩn bị thư viện',
      status: 'approved',
      version: '3.1',
      steps: 15,
      duration: '1 ngày',
      difficulty: 'Cao',
      lastUpdate: '2024-11-12',
      approvedBy: 'Dr. Trần Thị B'
    }
  ]);

  const [formData, setFormData] = useState({
    name: '',
    category: '',
    status: 'active',
    description: '',
    applications: [],
    accuracy: 99,
    throughput: 'Trung bình',
    version: '1.0'
  });

  const getStatusBadge = (status, type = 'technology') => {
    const statusConfig = {
      technology: {
        'active': { bg: 'success', text: 'Đang sử dụng' },
        'inactive': { bg: 'secondary', text: 'Ngừng sử dụng' },
        'development': { bg: 'warning', text: 'Đang phát triển' }
      },
      equipment: {
        'operational': { bg: 'success', text: 'Hoạt động' },
        'maintenance': { bg: 'warning', text: 'Bảo trì' },
        'breakdown': { bg: 'danger', text: 'Hỏng hóc' },
        'retired': { bg: 'secondary', text: 'Ngừng sử dụng' }
      },
      protocol: {
        'approved': { bg: 'success', text: 'Đã duyệt' },
        'review': { bg: 'warning', text: 'Đang duyệt' },
        'draft': { bg: 'info', text: 'Bản nháp' },
        'rejected': { bg: 'danger', text: 'Từ chối' }
      }
    };

    const config = statusConfig[type][status];
    if (!config) return <Badge bg="light">Không xác định</Badge>;
    
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getThroughputBadge = (throughput) => {
    const colors = {
      'Cao': 'success',
      'Trung bình': 'warning', 
      'Thấp': 'danger'
    };
    return <Badge bg={colors[throughput] || 'light'}>{throughput}</Badge>;
  };

  const getDifficultyBadge = (difficulty) => {
    const colors = {
      'Cơ bản': 'primary',
      'Trung bình': 'info', 
      'Cao': 'danger'
    };
    return <Badge bg={colors[difficulty] || 'light'}>{difficulty}</Badge>;
  };

  const handleShowModal = (type, item = null) => {
    setModalType(type);
    setEditingItem(item);
    if (item) {
      setFormData(item);
    } else {
      setFormData({
        name: '',
        category: '',
        status: type === 'equipment' ? 'operational' : type === 'protocol' ? 'draft' : 'active',
        description: '',
        applications: [],
        accuracy: 99,
        throughput: 'Trung bình',
        version: '1.0'
      });
    }
    setShowModal(true);
  };

  const handleSave = () => {
    const newItem = {
      ...formData,
      id: editingItem ? editingItem.id : Date.now(),
      lastUpdate: new Date().toISOString().split('T')[0]
    };

    if (modalType === 'technology') {
      if (editingItem) {
        setTechnologies(technologies.map(t => t.id === editingItem.id ? newItem : t));
      } else {
        setTechnologies([newItem, ...technologies]);
      }
    } else if (modalType === 'equipment') {
      if (editingItem) {
        setEquipment(equipment.map(e => e.id === editingItem.id ? newItem : e));
      } else {
        setEquipment([newItem, ...equipment]);
      }
    } else if (modalType === 'protocol') {
      if (editingItem) {
        setProtocols(protocols.map(p => p.id === editingItem.id ? newItem : p));
      } else {
        setProtocols([newItem, ...protocols]);
      }
    }

    setShowModal(false);
    setToastMessage(`${editingItem ? 'Cập nhật' : 'Tạo mới'} thành công!`);
    setShowToast(true);
  };

  const handleDelete = (id, type) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa?')) {
      if (type === 'technology') {
        setTechnologies(technologies.filter(t => t.id !== id));
      } else if (type === 'equipment') {
        setEquipment(equipment.filter(e => e.id !== id));
      } else if (type === 'protocol') {
        setProtocols(protocols.filter(p => p.id !== id));
      }
      setToastMessage('Đã xóa thành công!');
      setShowToast(true);
    }
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-cpu text-warning me-2"></i>
            Quản lý Công nghệ ADN
          </h2>
          <p className="text-muted mb-0">Quản lý công nghệ, thiết bị và quy trình phân tích ADN</p>
        </div>
      </div>

      {/* Stats Overview */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-gear-wide-connected text-warning fs-1 mb-2"></i>
              <h3 className="mb-0">{technologies.length}</h3>
              <small className="text-muted">Công nghệ</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-tools text-info fs-1 mb-2"></i>
              <h3 className="mb-0">{equipment.length}</h3>
              <small className="text-muted">Thiết bị</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-clipboard-data text-success fs-1 mb-2"></i>
              <h3 className="mb-0">{protocols.length}</h3>
              <small className="text-muted">Quy trình</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-check-circle text-primary fs-1 mb-2"></i>
              <h3 className="mb-0">
                {Math.round(equipment.reduce((sum, e) => sum + (e.utilization || 0), 0) / equipment.length)}%
              </h3>
              <small className="text-muted">Sử dụng thiết bị</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Main Content Tabs */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <Tabs
            activeKey={activeTab}
            onSelect={(tab) => setActiveTab(tab)}
            className="border-0"
          >
            <Tab eventKey="technologies" title={
              <span>
                <i className="bi bi-gear-wide-connected me-2"></i>
                Công nghệ
              </span>
            } />
            <Tab eventKey="equipment" title={
              <span>
                <i className="bi bi-tools me-2"></i>
                Thiết bị
              </span>
            } />
            <Tab eventKey="protocols" title={
              <span>
                <i className="bi bi-clipboard-data me-2"></i>
                Quy trình
              </span>
            } />
          </Tabs>
        </Card.Header>

        <Card.Body className="p-0">
          {/* Technologies Tab */}
          {activeTab === 'technologies' && (
            <div>
              <div className="p-3 border-bottom">
                <Button variant="warning" onClick={() => handleShowModal('technology')}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Thêm công nghệ mới
                </Button>
              </div>
              <Table hover responsive>
                <thead className="bg-light">
                  <tr>
                    <th>Tên công nghệ</th>
                    <th>Danh mục</th>
                    <th>Trạng thái</th>
                    <th>Độ chính xác</th>
                    <th>Throughput</th>
                    <th>Phiên bản</th>
                    <th>Cập nhật</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {technologies.map(tech => (
                    <tr key={tech.id}>
                      <td>
                        <div>
                          <div className="fw-medium">{tech.name}</div>
                          <small className="text-muted">{tech.description}</small>
                        </div>
                      </td>
                      <td><Badge bg="outline-warning">{tech.category}</Badge></td>
                      <td>{getStatusBadge(tech.status, 'technology')}</td>
                      <td>
                        <span className="fw-medium">{tech.accuracy}%</span>
                        <ProgressBar 
                          now={tech.accuracy} 
                          variant="success" 
                          size="sm" 
                          className="mt-1"
                          style={{height: '4px'}}
                        />
                      </td>
                      <td>{getThroughputBadge(tech.throughput)}</td>
                      <td><Badge bg="info">v{tech.version}</Badge></td>
                      <td>{new Date(tech.lastUpdate).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" size="sm">
                            <i className="bi bi-three-dots"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleShowModal('technology', tech)}>
                              <i className="bi bi-pencil me-2"></i>Chỉnh sửa
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDelete(tech.id, 'technology')} className="text-danger">
                              <i className="bi bi-trash me-2"></i>Xóa
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* Equipment Tab */}
          {activeTab === 'equipment' && (
            <div>
              <div className="p-3 border-bottom">
                <Button variant="info" onClick={() => handleShowModal('equipment')}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Thêm thiết bị mới
                </Button>
              </div>
              <Table hover responsive>
                <thead className="bg-light">
                  <tr>
                    <th>Tên thiết bị</th>
                    <th>Loại</th>
                    <th>Trạng thái</th>
                    <th>Vị trí</th>
                    <th>Sử dụng</th>
                    <th>Bảo trì tiếp theo</th>
                    <th>Bảo hành</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {equipment.map(eq => (
                    <tr key={eq.id}>
                      <td className="fw-medium">{eq.name}</td>
                      <td><Badge bg="outline-info">{eq.type}</Badge></td>
                      <td>{getStatusBadge(eq.status, 'equipment')}</td>
                      <td>{eq.location}</td>
                      <td>
                        <span className="fw-medium">{eq.utilization}%</span>
                        <ProgressBar 
                          now={eq.utilization} 
                          variant={eq.utilization > 80 ? 'danger' : eq.utilization > 60 ? 'warning' : 'success'} 
                          size="sm" 
                          className="mt-1"
                          style={{height: '4px'}}
                        />
                      </td>
                      <td>{new Date(eq.nextMaintenance).toLocaleDateString('vi-VN')}</td>
                      <td>
                        <span className={new Date(eq.warrantyExpiry) < new Date() ? 'text-danger' : 'text-success'}>
                          {new Date(eq.warrantyExpiry).toLocaleDateString('vi-VN')}
                        </span>
                      </td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" size="sm">
                            <i className="bi bi-three-dots"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleShowModal('equipment', eq)}>
                              <i className="bi bi-pencil me-2"></i>Chỉnh sửa
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDelete(eq.id, 'equipment')} className="text-danger">
                              <i className="bi bi-trash me-2"></i>Xóa
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}

          {/* Protocols Tab */}
          {activeTab === 'protocols' && (
            <div>
              <div className="p-3 border-bottom">
                <Button variant="success" onClick={() => handleShowModal('protocol')}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Thêm quy trình mới
                </Button>
              </div>
              <Table hover responsive>
                <thead className="bg-light">
                  <tr>
                    <th>Tên quy trình</th>
                    <th>Danh mục</th>
                    <th>Trạng thái</th>
                    <th>Phiên bản</th>
                    <th>Độ khó</th>
                    <th>Thời gian</th>
                    <th>Số bước</th>
                    <th>Duyệt bởi</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {protocols.map(protocol => (
                    <tr key={protocol.id}>
                      <td className="fw-medium">{protocol.name}</td>
                      <td><Badge bg="outline-success">{protocol.category}</Badge></td>
                      <td>{getStatusBadge(protocol.status, 'protocol')}</td>
                      <td><Badge bg="info">v{protocol.version}</Badge></td>
                      <td>{getDifficultyBadge(protocol.difficulty)}</td>
                      <td>{protocol.duration}</td>
                      <td>
                        <Badge bg="light" text="dark">{protocol.steps} bước</Badge>
                      </td>
                      <td>{protocol.approvedBy || <em className="text-muted">Chưa duyệt</em>}</td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" size="sm">
                            <i className="bi bi-three-dots"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleShowModal('protocol', protocol)}>
                              <i className="bi bi-pencil me-2"></i>Chỉnh sửa
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleDelete(protocol.id, 'protocol')} className="text-danger">
                              <i className="bi bi-trash me-2"></i>Xóa
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Create/Edit Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {editingItem ? 'Chỉnh sửa' : 'Tạo mới'} {modalType === 'technology' ? 'công nghệ' : modalType === 'equipment' ? 'thiết bị' : 'quy trình'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={8} className="mb-3">
                <Form.Label>Tên</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({...formData, name: e.target.value})}
                />
              </Col>
              <Col md={4} className="mb-3">
                <Form.Label>Danh mục</Form.Label>
                <Form.Control
                  type="text"
                  value={formData.category}
                  onChange={(e) => setFormData({...formData, category: e.target.value})}
                />
              </Col>
            </Row>
            
            {modalType === 'technology' && (
              <Row>
                <Col md={4} className="mb-3">
                  <Form.Label>Độ chính xác (%)</Form.Label>
                  <Form.Control
                    type="number"
                    min="0"
                    max="100"
                    step="0.1"
                    value={formData.accuracy}
                    onChange={(e) => setFormData({...formData, accuracy: parseFloat(e.target.value)})}
                  />
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Label>Throughput</Form.Label>
                  <Form.Select
                    value={formData.throughput}
                    onChange={(e) => setFormData({...formData, throughput: e.target.value})}
                  >
                    <option value="Cao">Cao</option>
                    <option value="Trung bình">Trung bình</option>
                    <option value="Thấp">Thấp</option>
                  </Form.Select>
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Label>Phiên bản</Form.Label>
                  <Form.Control
                    type="text"
                    value={formData.version}
                    onChange={(e) => setFormData({...formData, version: e.target.value})}
                  />
                </Col>
              </Row>
            )}

            <div className="mb-3">
              <Form.Label>Mô tả</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
              />
            </div>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Hủy
          </Button>
          <Button variant="warning" onClick={handleSave}>
            {editingItem ? 'Cập nhật' : 'Tạo mới'}
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

export default TechnologyManagement;