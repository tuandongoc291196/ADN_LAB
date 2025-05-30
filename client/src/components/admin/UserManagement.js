import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Button, Table, Badge, Modal, Form, 
  Alert, InputGroup, Dropdown, Pagination, Toast, ToastContainer,
  Tab, Tabs, ProgressBar
} from 'react-bootstrap';

const UserManagement = ({ user }) => {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([
    {
      id: 1,
      name: 'Nguyễn Văn A',
      email: 'nguyenvana@email.com',
      phone: '0901234567',
      role: 'customer',
      status: 'active',
      joinDate: '2024-01-15',
      lastLogin: '2024-11-20T10:30:00',
      totalTests: 3,
      totalSpent: 2500000,
      location: 'TP. Hồ Chí Minh',
      avatar: null,
      verified: true
    },
    {
      id: 2,
      name: 'Trần Thị B',
      email: 'tranthib@email.com',
      phone: '0907654321',
      role: 'customer',
      status: 'active',
      joinDate: '2024-02-20',
      lastLogin: '2024-11-19T15:45:00',
      totalTests: 7,
      totalSpent: 5800000,
      location: 'Hà Nội',
      avatar: null,
      verified: true
    },
    {
      id: 3,
      name: 'Dr. Lê Văn C',
      email: 'levanc@adnlab.vn',
      phone: '0912345678',
      role: 'staff',
      status: 'active',
      joinDate: '2023-06-10',
      lastLogin: '2024-11-20T09:15:00',
      totalTests: 0,
      totalSpent: 0,
      location: 'TP. Hồ Chí Minh',
      avatar: null,
      verified: true,
      department: 'Lab Analysis'
    },
    {
      id: 4,
      name: 'Phạm Thị D',
      email: 'phamthid@email.com',
      phone: '0934567890',
      role: 'customer',
      status: 'suspended',
      joinDate: '2024-03-05',
      lastLogin: '2024-10-15T14:20:00',
      totalTests: 1,
      totalSpent: 850000,
      location: 'Đà Nẵng',
      avatar: null,
      verified: false
    }
  ]);

  const [activities, setActivities] = useState([
    {
      id: 1,
      userId: 1,
      userName: 'Nguyễn Văn A',
      action: 'Đăng nhập hệ thống',
      timestamp: '2024-11-20T10:30:00',
      ip: '192.168.1.100',
      device: 'Chrome on Windows'
    },
    {
      id: 2,
      userId: 2,
      userName: 'Trần Thị B',
      action: 'Đặt đơn xét nghiệm ADN Y',
      timestamp: '2024-11-19T15:45:00',
      ip: '192.168.1.101',
      device: 'Safari on iPhone'
    },
    {
      id: 3,
      userId: 3,
      userName: 'Dr. Lê Văn C',
      action: 'Cập nhật kết quả xét nghiệm',
      timestamp: '2024-11-19T09:15:00',
      ip: '192.168.1.102',
      device: 'Chrome on Windows'
    }
  ]);

  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('edit'); // 'edit', 'create', 'view'
  const [editingUser, setEditingUser] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(10);

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: 'customer',
    status: 'active',
    location: '',
    department: '',
    verified: false
  });

  // Filter users
  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.phone.includes(searchTerm);
    const matchesRole = filterRole === 'all' || user.role === filterRole;
    const matchesStatus = filterStatus === 'all' || user.status === filterStatus;
    
    return matchesSearch && matchesRole && matchesStatus;
  });

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentUsers = filteredUsers.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Hoạt động</Badge>;
      case 'inactive':
        return <Badge bg="secondary">Không hoạt động</Badge>;
      case 'suspended':
        return <Badge bg="danger">Tạm khóa</Badge>;
      case 'pending':
        return <Badge bg="warning">Chờ xác thực</Badge>;
      default:
        return <Badge bg="light">Không xác định</Badge>;
    }
  };

  const getRoleBadge = (role) => {
    switch (role) {
      case 'admin':
        return <Badge bg="danger">Quản trị viên</Badge>;
      case 'staff':
        return <Badge bg="info">Nhân viên</Badge>;
      case 'customer':
        return <Badge bg="primary">Khách hàng</Badge>;
      default:
        return <Badge bg="light">Không xác định</Badge>;
    }
  };

  const handleShowModal = (type, userItem = null) => {
    setModalType(type);
    setEditingUser(userItem);
    if (userItem) {
      setFormData({
        name: userItem.name,
        email: userItem.email,
        phone: userItem.phone,
        role: userItem.role,
        status: userItem.status,
        location: userItem.location,
        department: userItem.department || '',
        verified: userItem.verified
      });
    } else {
      setFormData({
        name: '',
        email: '',
        phone: '',
        role: 'customer',
        status: 'active',
        location: '',
        department: '',
        verified: false
      });
    }
    setShowModal(true);
  };

  const handleSaveUser = () => {
    if (editingUser) {
      // Update existing user
      setUsers(users.map(u => 
        u.id === editingUser.id 
          ? { ...u, ...formData }
          : u
      ));
      setToastMessage('Thông tin người dùng đã được cập nhật!');
    } else {
      // Create new user
      const newUser = {
        ...formData,
        id: Date.now(),
        joinDate: new Date().toISOString().split('T')[0],
        lastLogin: null,
        totalTests: 0,
        totalSpent: 0,
        avatar: null
      };
      setUsers([newUser, ...users]);
      setToastMessage('Người dùng mới đã được tạo thành công!');
    }
    
    setShowModal(false);
    setShowToast(true);
  };

  const handleStatusChange = (id, newStatus) => {
    setUsers(users.map(u => 
      u.id === id 
        ? { ...u, status: newStatus }
        : u
    ));
    setToastMessage(`Trạng thái người dùng đã được cập nhật!`);
    setShowToast(true);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      setUsers(users.filter(u => u.id !== id));
      setToastMessage('Người dùng đã được xóa thành công!');
      setShowToast(true);
    }
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatLastLogin = (timestamp) => {
    if (!timestamp) return 'Chưa đăng nhập';
    return new Date(timestamp).toLocaleString('vi-VN');
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-people text-purple me-2"></i>
            Quản lý Người dùng
          </h2>
          <p className="text-muted mb-0">Quản lý tài khoản và quyền hạn người dùng</p>
        </div>
        <Button variant="primary" onClick={() => handleShowModal('create')}>
          <i className="bi bi-person-plus me-2"></i>
          Thêm người dùng
        </Button>
      </div>

      {/* Stats Cards */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-people text-primary fs-1 mb-2"></i>
              <h3 className="mb-0">{users.length}</h3>
              <small className="text-muted">Tổng người dùng</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-person-check text-success fs-1 mb-2"></i>
              <h3 className="mb-0">{users.filter(u => u.status === 'active').length}</h3>
              <small className="text-muted">Đang hoạt động</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-person-badge text-info fs-1 mb-2"></i>
              <h3 className="mb-0">{users.filter(u => u.role === 'staff').length}</h3>
              <small className="text-muted">Nhân viên</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-shield-check text-warning fs-1 mb-2"></i>
              <h3 className="mb-0">{users.filter(u => u.verified).length}</h3>
              <small className="text-muted">Đã xác thực</small>
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
            <Tab eventKey="users" title={
              <span>
                <i className="bi bi-people me-2"></i>
                Danh sách người dùng
              </span>
            } />
            <Tab eventKey="activities" title={
              <span>
                <i className="bi bi-activity me-2"></i>
                Hoạt động gần đây
              </span>
            } />
          </Tabs>
        </Card.Header>

        <Card.Body>
          {/* Users Tab */}
          {activeTab === 'users' && (
            <div>
              {/* Filters and Search */}
              <Row className="mb-3">
                <Col md={4} className="mb-2">
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Tìm kiếm người dùng..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={3} className="mb-2">
                  <Form.Select 
                    value={filterRole} 
                    onChange={(e) => setFilterRole(e.target.value)}
                  >
                    <option value="all">Tất cả vai trò</option>
                    <option value="admin">Quản trị viên</option>
                    <option value="staff">Nhân viên</option>
                    <option value="customer">Khách hàng</option>
                  </Form.Select>
                </Col>
                <Col md={3} className="mb-2">
                  <Form.Select 
                    value={filterStatus} 
                    onChange={(e) => setFilterStatus(e.target.value)}
                  >
                    <option value="all">Tất cả trạng thái</option>
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="suspended">Tạm khóa</option>
                    <option value="pending">Chờ xác thực</option>
                  </Form.Select>
                </Col>
                <Col md={2} className="mb-2">
                  <Button variant="outline-secondary" className="w-100">
                    <i className="bi bi-funnel"></i> Lọc
                  </Button>
                </Col>
              </Row>

              {/* Users Table */}
              <Table hover responsive>
                <thead className="bg-light">
                  <tr>
                    <th>Người dùng</th>
                    <th>Vai trò</th>
                    <th>Trạng thái</th>
                    <th>Xác thực</th>
                    <th>Đăng nhập cuối</th>
                    <th>Xét nghiệm</th>
                    <th>Chi tiêu</th>
                    <th>Thao tác</th>
                  </tr>
                </thead>
                <tbody>
                  {currentUsers.map(userItem => (
                    <tr key={userItem.id}>
                      <td>
                        <div className="d-flex align-items-center">
                          <div className="me-3">
                            {userItem.avatar ? (
                              <img 
                                src={userItem.avatar} 
                                alt="Avatar"
                                className="rounded-circle"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                              />
                            ) : (
                              <div className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center"
                                   style={{ width: '40px', height: '40px' }}>
                                {userItem.name.charAt(0).toUpperCase()}
                              </div>
                            )}
                          </div>
                          <div>
                            <div className="fw-medium">{userItem.name}</div>
                            <small className="text-muted">{userItem.email}</small>
                            <br />
                            <small className="text-muted">{userItem.phone}</small>
                          </div>
                        </div>
                      </td>
                      <td>{getRoleBadge(userItem.role)}</td>
                      <td>{getStatusBadge(userItem.status)}</td>
                      <td>
                        {userItem.verified ? (
                          <Badge bg="success">
                            <i className="bi bi-check-circle me-1"></i>
                            Đã xác thực
                          </Badge>
                        ) : (
                          <Badge bg="warning">
                            <i className="bi bi-exclamation-triangle me-1"></i>
                            Chưa xác thực
                          </Badge>
                        )}
                      </td>
                      <td>
                        <small>{formatLastLogin(userItem.lastLogin)}</small>
                      </td>
                      <td>
                        <span className="fw-medium">{userItem.totalTests}</span>
                      </td>
                      <td>
                        <span className="fw-medium">{formatCurrency(userItem.totalSpent)}</span>
                      </td>
                      <td>
                        <Dropdown>
                          <Dropdown.Toggle variant="outline-secondary" size="sm">
                            <i className="bi bi-three-dots"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleShowModal('view', userItem)}>
                              <i className="bi bi-eye me-2"></i>Xem chi tiết
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleShowModal('edit', userItem)}>
                              <i className="bi bi-pencil me-2"></i>Chỉnh sửa
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item 
                              onClick={() => handleStatusChange(userItem.id, userItem.status === 'active' ? 'suspended' : 'active')}
                            >
                              <i className="bi bi-person-x me-2"></i>
                              {userItem.status === 'active' ? 'Tạm khóa' : 'Kích hoạt'}
                            </Dropdown.Item>
                            <Dropdown.Item 
                              className="text-danger"
                              onClick={() => handleDeleteUser(userItem.id)}
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

              {/* Pagination */}
              {totalPages > 1 && (
                <div className="d-flex justify-content-center mt-3">
                  <Pagination>
                    <Pagination.Prev 
                      disabled={currentPage === 1}
                      onClick={() => setCurrentPage(currentPage - 1)}
                    />
                    {[...Array(totalPages)].map((_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === currentPage}
                        onClick={() => setCurrentPage(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ))}
                    <Pagination.Next 
                      disabled={currentPage === totalPages}
                      onClick={() => setCurrentPage(currentPage + 1)}
                    />
                  </Pagination>
                </div>
              )}
            </div>
          )}

          {/* Activities Tab */}
          {activeTab === 'activities' && (
            <div>
              <Table hover responsive>
                <thead className="bg-light">
                  <tr>
                    <th>Người dùng</th>
                    <th>Hoạt động</th>
                    <th>Thời gian</th>
                    <th>IP Address</th>
                    <th>Thiết bị</th>
                  </tr>
                </thead>
                <tbody>
                  {activities.map(activity => (
                    <tr key={activity.id}>
                      <td className="fw-medium">{activity.userName}</td>
                      <td>{activity.action}</td>
                      <td>{new Date(activity.timestamp).toLocaleString('vi-VN')}</td>
                      <td><code>{activity.ip}</code></td>
                      <td>
                        <small className="text-muted">{activity.device}</small>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </Table>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Create/Edit User Modal */}
      <Modal show={showModal} onHide={() => setShowModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'create' ? 'Tạo người dùng mới' : 
             modalType === 'edit' ? 'Chỉnh sửa thông tin' : 'Thông tin chi tiết'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {modalType === 'view' ? (
            // View mode
            <div>
              <Row>
                <Col md={6}>
                  <strong>Họ tên:</strong> {editingUser?.name}
                </Col>
                <Col md={6}>
                  <strong>Email:</strong> {editingUser?.email}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={6}>
                  <strong>Số điện thoại:</strong> {editingUser?.phone}
                </Col>
                <Col md={6}>
                  <strong>Vai trò:</strong> {getRoleBadge(editingUser?.role)}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={6}>
                  <strong>Trạng thái:</strong> {getStatusBadge(editingUser?.status)}
                </Col>
                <Col md={6}>
                  <strong>Xác thực:</strong> {editingUser?.verified ? 'Đã xác thực' : 'Chưa xác thực'}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={6}>
                  <strong>Ngày tham gia:</strong> {new Date(editingUser?.joinDate).toLocaleDateString('vi-VN')}
                </Col>
                <Col md={6}>
                  <strong>Đăng nhập cuối:</strong> {formatLastLogin(editingUser?.lastLogin)}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={6}>
                  <strong>Tổng xét nghiệm:</strong> {editingUser?.totalTests}
                </Col>
                <Col md={6}>
                  <strong>Tổng chi tiêu:</strong> {formatCurrency(editingUser?.totalSpent)}
                </Col>
              </Row>
            </div>
          ) : (
            // Edit/Create mode
            <Form>
              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Họ tên</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập họ tên..."
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control
                    type="email"
                    placeholder="Nhập email..."
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={6} className="mb-3">
                  <Form.Label>Số điện thoại</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Nhập số điện thoại..."
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                  />
                </Col>
                <Col md={6} className="mb-3">
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập địa chỉ..."
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={4} className="mb-3">
                  <Form.Label>Vai trò</Form.Label>
                  <Form.Select
                    value={formData.role}
                    onChange={(e) => setFormData({...formData, role: e.target.value})}
                  >
                    <option value="customer">Khách hàng</option>
                    <option value="staff">Nhân viên</option>
                    <option value="admin">Quản trị viên</option>
                  </Form.Select>
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Label>Trạng thái</Form.Label>
                  <Form.Select
                    value={formData.status}
                    onChange={(e) => setFormData({...formData, status: e.target.value})}
                  >
                    <option value="active">Hoạt động</option>
                    <option value="inactive">Không hoạt động</option>
                    <option value="suspended">Tạm khóa</option>
                    <option value="pending">Chờ xác thực</option>
                  </Form.Select>
                </Col>
                <Col md={4} className="mb-3">
                  <Form.Label>Phòng ban</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Nhập phòng ban..."
                    value={formData.department}
                    onChange={(e) => setFormData({...formData, department: e.target.value})}
                    disabled={formData.role === 'customer'}
                  />
                </Col>
              </Row>

              <Row>
                <Col md={12} className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Đã xác thực email"
                    checked={formData.verified}
                    onChange={(e) => setFormData({...formData, verified: e.target.checked})}
                  />
                </Col>
              </Row>
            </Form>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            {modalType === 'view' ? 'Đóng' : 'Hủy'}
          </Button>
          {modalType !== 'view' && (
            <Button variant="primary" onClick={handleSaveUser}>
              {modalType === 'create' ? 'Tạo mới' : 'Cập nhật'}
            </Button>
          )}
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

export default UserManagement;