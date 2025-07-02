/**
 * COMPONENT: UserManagement
 * MỤC ĐÍCH: Quản lý tất cả người dùng trong hệ thống
 * CHỨC NĂNG:
 * - Quản lý người dùng (customers) và nhân viên
 * - Phân quyền và thay đổi role
 * - Theo dõi hoạt động và lịch sử người dùng
 * - Quản lý trạng thái tài khoản (active/inactive/suspended)
 */

import React, { useState, useEffect } from 'react';
import {
  Card, Row, Col, Button, Table, Badge, Modal, Form,
  Alert, InputGroup, Dropdown, Pagination, Toast, ToastContainer,
  Tab, Tabs, ProgressBar
} from 'react-bootstrap';
import { getStaffListByRole, getAllRoles, getAllUsers, addUser } from '../../services/api';

const UserManagement = ({ user }) => {
  // State quản lý tabs và dữ liệu
  const [activeTab, setActiveTab] = useState('users'); // Tab hiện tại: users/staff/activities
  const [roles, setRoles] = useState([]); // Danh sách người dùng theo role
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [error, setError] = useState(null); // Lỗi khi fetch dữ liệu
  const [activities, setActivities] = useState([]); // Lịch sử hoạt động
  const [staffCount, setStaffCount] = useState(0); // Số lượng nhân viên
  
  // State quản lý modal
  const [showModal, setShowModal] = useState(false); // Hiển thị modal
  const [modalType, setModalType] = useState('edit'); // Loại modal: edit/create/view
  const [editingUser, setEditingUser] = useState(null); // User đang được chỉnh sửa
  
  // State quản lý filter và search
  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
  const [filterRole, setFilterRole] = useState('all'); // Lọc theo role
  const [filterStatus, setFilterStatus] = useState('all'); // Lọc theo trạng thái
  
  // State quản lý UI
  const [showToast, setShowToast] = useState(false); // Hiển thị thông báo
  const [toastMessage, setToastMessage] = useState(''); // Nội dung thông báo
  
  // State quản lý pagination
  const [currentPage, setCurrentPage] = useState(1); // Trang hiện tại
  const [itemsPerPage] = useState(10); // Số items mỗi trang

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

  // 1. State riêng cho users và staff
  const [usersList, setUsersList] = useState([]); // Danh sách người dùng (customer)
  const [staffList, setStaffList] = useState([]); // Danh sách nhân viên (staff, manager)
  const [filterDepartment, setFilterDepartment] = useState('all');
  const [showStaffModal, setShowStaffModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [loadingStaff, setLoadingStaff] = useState(false);
  const [loadingUsers, setLoadingUsers] = useState(false);

  // 1. State cho tổng tài khoản
  const [allUsers, setAllUsers] = useState([]); // Dùng cho count tổng tài khoản

  // State cho roles
  const [roleOptions, setRoleOptions] = useState([]);
  const [loadingRoles, setLoadingRoles] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const userRes = await getStaffListByRole([0]);
        setRoles(userRes || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // 2. Effect lấy users (customer) khi vào tab users
  useEffect(() => {
    if (activeTab === 'users') {
      const fetchUsers = async () => {
        setLoadingUsers(true);
        try {
          const allUsers = await getAllUsers();
          // Lọc ra chỉ khách hàng
          setUsersList(allUsers.filter(u => u.role?.name === 'customer'));
        } catch (err) {
          setError(err.message);
        } finally {
          setLoadingUsers(false);
        }
      };
      fetchUsers();
    }
  }, [activeTab]);

  // 3. Effect lấy staff/manager khi vào tab staff
  useEffect(() => {
    if (activeTab === 'staff') {
      const fetchStaff = async () => {
        setLoadingStaff(true);
        try {
          let staffList = await getStaffListByRole([1, 2]);
          setStaffList(staffList || []);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoadingStaff(false);
        }
      };
      fetchStaff();
    }
  }, [activeTab]);

  // 2. Effect lấy all users cho count tổng tài khoản
  useEffect(() => {
    const fetchAllUsers = async () => {
      try {
        const all = await getAllUsers();
        setAllUsers(all || []);
      } catch (err) {
        // Không ảnh hưởng UI chính
      }
    };
    fetchAllUsers();
  }, []);

  // Filter users
  const filteredUsers = usersList.filter(user => {
    const matchesSearch = (user.fullname || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.email || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
      (user.phone || '').includes(searchTerm);
    const matchesRole = filterRole === 'all' || (user.role?.name === filterRole);
    const matchesStatus = filterStatus === 'all' || user.accountStatus === filterStatus;
    return matchesSearch && matchesRole && matchesStatus;
  });

  // 5. Filter staff
  const filteredStaff = staffList.filter(member => {
    if (!member.role || (member.role.name !== 'staff' && member.role.name !== 'manager')) return false;
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
    const matchesSearch =
      (member.fullname?.toLowerCase() || member.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (member.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (member.phone || '').includes(searchTerm);
    return matchesDepartment && matchesSearch;
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

  const getRoleBadge = (roleName) => {
    switch (roleName) {
      case 'admin':
        return <Badge bg="danger">Quản trị viên</Badge>;
      case 'staff':
        return <Badge bg="info">Nhân viên</Badge>;
      case 'customer':
        return <Badge bg="primary">Khách hàng</Badge>;
      case 'manager':
        return <Badge bg="secondary">Quản lý</Badge>;
      default:
        return <Badge bg="light">Không xác định</Badge>;
    }
  };

  const handleShowModal = (type, userItem = null) => {
    setModalType(type);
    setEditingUser(userItem);
    if (type === 'create') {
      setLoadingRoles(true);
      getAllRoles().then((roles) => {
        setRoleOptions(roles);
      }).finally(() => setLoadingRoles(false));
    }
    if (userItem) {
      setFormData({
        name: userItem.fullname,
        email: userItem.email,
        phone: userItem.phone,
        role: userItem.role?.name,
        status: userItem.accountStatus,
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

  const handleSaveUser = async () => {
    if (editingUser) {
      // Update existing user
      setRoles(roles.map(u =>
        u.id === editingUser.id
          ? { ...u, ...formData }
          : u
      ));
      setToastMessage('Thông tin người dùng đã được cập nhật!');
    } else {
      // Tạo user mới qua API
      try {
        const selectedRole = roleOptions.find(r => r.name === formData.role);
        if (!selectedRole) throw new Error('Vui lòng chọn vai trò');
        if (!formData.password) throw new Error('Vui lòng nhập mật khẩu');
        await addUser({
          email: formData.email,
          password: formData.password,
          name: formData.name,
          roleId: selectedRole.id
        });
        setToastMessage('Người dùng mới đã được tạo thành công!');
        setShowModal(false);
        setShowToast(true);
        // Reload lại danh sách nếu cần
      } catch (err) {
        setToastMessage('Lỗi: ' + err.message);
        setShowToast(true);
      }
    }
  };

  const handleStatusChange = (id, newStatus) => {
    setRoles(roles.map(u =>
      u.id === id
        ? { ...u, accountStatus: newStatus }
        : u
    ));
    setToastMessage(`Trạng thái người dùng đã được cập nhật!`);
    setShowToast(true);
  };

  const handleDeleteUser = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      setRoles(roles.filter(u => u.id !== id));
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

  if (loading) return <div className="text-center py-5"><span>Đang tải dữ liệu người dùng...</span></div>;
  if (error) return <Alert variant="danger">Lỗi: {error}</Alert>;

  const getCurrentTabCount = () => {
    switch (activeTab) {
      case 'users':
        return filteredUsers.length;
      case 'staff':
        return staffCount;
      case 'activities':
        return activities.length;
      default:
        return roles.length;
    }
  };

  const getTabTitle = () => {
    switch (activeTab) {
      case 'users': return 'Tổng khách hàng';
      case 'staff': return 'Tổng nhân viên';
      case 'activities': return 'Tổng hoạt động';
      default: return 'Tổng người dùng';
    }
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
              <h3 className="mb-0">{allUsers.length}</h3>
              <small className="text-muted">Tổng tài khoản</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-person-check text-success fs-1 mb-2"></i>
              <h3 className="mb-0">{usersList.length}</h3>
              <small className="text-muted">Tổng khách hàng</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-person-badge text-danger fs-1 mb-2"></i>
              <h3 className="mb-0">{staffList.filter(u => u.role?.name === 'manager').length}</h3>
              <small className="text-muted">Quản lý</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm text-center">
            <Card.Body>
              <i className="bi bi-person-badge text-info fs-1 mb-2"></i>
              <h3 className="mb-0">{staffList.filter(u => u.role?.name === 'staff').length}</h3>
              <small className="text-muted">Nhân viên</small>
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
            <Tab eventKey="staff" title={
              <span>
                <i className="bi bi-person-badge me-2"></i>
                Danh sách nhân viên
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
              {loadingUsers ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
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
                                  {userItem.fullname.charAt(0).toUpperCase()}
                                </div>
                              )}
                            </div>
                            <div>
                              <div className="fw-medium">{userItem.fullname}</div>
                              <small className="text-muted">{userItem.email}</small>
                              <br />
                              <small className="text-muted">{userItem.phone}</small>
                            </div>
                          </div>
                        </td>
                        <td>{getRoleBadge(userItem.role?.name)}</td>
                        <td>{getStatusBadge(userItem.accountStatus)}</td>
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
                                onClick={() => handleStatusChange(userItem.id, userItem.accountStatus === 'active' ? 'suspended' : 'active')}
                              >
                                <i className="bi bi-person-x me-2"></i>
                                {userItem.accountStatus === 'active' ? 'Tạm khóa' : 'Kích hoạt'}
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
              )}

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
          {/* Staff Tab */}
          {activeTab === 'staff' && (
            <div>
              {/* Filters and Search */}
              <Row className="mb-3">
                <Col md={4} className="mb-2">
                  <InputGroup>
                    <InputGroup.Text>
                      <i className="bi bi-search"></i>
                    </InputGroup.Text>
                    <Form.Control
                      placeholder="Tìm kiếm nhân viên..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                    />
                  </InputGroup>
                </Col>
                <Col md={3} className="mb-2">
                  <Form.Select
                    value={filterDepartment}
                    onChange={(e) => setFilterDepartment(e.target.value)}
                  >
                    <option value="all">Tất cả phòng ban</option>
                    <option value="Phòng xét nghiệm">Phòng xét nghiệm</option>
                    <option value="Phòng lấy mẫu">Phòng lấy mẫu</option>
                  </Form.Select>
                </Col>
              </Row>

              {/* Staff Table */}
              {loadingStaff ? (
                <div className="text-center py-5">
                  <div className="spinner-border text-primary" role="status">
                    <span className="visually-hidden">Loading...</span>
                  </div>
                </div>
              ) : (
                <Table hover responsive>
                  <thead className="bg-light">
                    <tr>
                      <th>Nhân viên</th>
                      <th>Phòng ban</th>
                      <th>Vị trí</th>
                      <th>Ngày vào làm</th>
                      <th>Trạng thái</th>
                      <th>Hiệu suất</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStaff.map(member => (
                      <tr key={member.id}>
                        <td>
                          <div>{member.fullname || member.name}</div>
                          <small className="text-muted">{member.email}</small>
                        </td>
                        <td>{member.department || ''}</td>
                        <td>{getRoleBadge(member.role?.name)}</td>
                        <td>{member.createdAt ? new Date(member.createdAt).toLocaleDateString('vi-VN') : ''}</td>
                        <td>{getStatusBadge(member.accountStatus)}</td>
                        <td>
                          {member.performance ? (
                            <div className="d-flex gap-2">
                              <span className="badge bg-info">
                                {member.performance.completedTests} xét nghiệm
                              </span>
                              <span className="badge bg-success">
                                {member.performance.accuracy}% chính xác
                              </span>
                            </div>
                          ) : <span className="text-muted">N/A</span>}
                        </td>
                        <td>
                          <div className="btn-group">
                            <button
                              className="btn btn-sm btn-outline-primary"
                              onClick={() => { setSelectedStaff(member); setShowStaffModal(true); }}
                            >
                              <i className="bi bi-eye"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-success"
                              onClick={() => handleStatusChange(member.id, 'active')}
                            >
                              <i className="bi bi-check-circle"></i>
                            </button>
                            <button
                              className="btn btn-sm btn-outline-danger"
                              onClick={() => handleStatusChange(member.id, 'inactive')}
                            >
                              <i className="bi bi-x-circle"></i>
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              )}

              {/* Modal chi tiết nhân viên */}
              {showStaffModal && selectedStaff && (
                <div className="modal fade show" style={{ display: 'block' }}>
                  <div className="modal-dialog">
                    <div className="modal-content">
                      <div className="modal-header">
                        <h5 className="modal-title">Chi tiết nhân viên</h5>
                        <button
                          type="button"
                          className="btn-close"
                          onClick={() => setShowStaffModal(false)}
                        ></button>
                      </div>
                      <div className="modal-body">
                        <div className="mb-3">
                          <h6>Thông tin cá nhân</h6>
                          <p><strong>Tên:</strong> {selectedStaff.fullname || selectedStaff.name}</p>
                          <p><strong>Email:</strong> {selectedStaff.email}</p>
                          <p><strong>Số điện thoại:</strong> {selectedStaff.phone}</p>
                        </div>
                        <div className="mb-3">
                          <h6>Thông tin công việc</h6>
                          <p><strong>Phòng ban:</strong> {selectedStaff.department || ''}</p>
                          <p><strong>Vị trí:</strong> {selectedStaff.position || ''}</p>
                          <p><strong>Ngày vào làm:</strong> {selectedStaff.createdAt ? new Date(selectedStaff.createdAt).toLocaleDateString('vi-VN') : ''}</p>
                          <p><strong>Trạng thái:</strong> {getStatusBadge(selectedStaff.accountStatus)}</p>
                        </div>
                        <div className="mb-3">
                          <h6>Hiệu suất làm việc</h6>
                          {selectedStaff.performance && (
                            <>
                              <p><strong>Số xét nghiệm đã hoàn thành:</strong> {selectedStaff.performance.completedTests}</p>
                              <p><strong>Độ chính xác:</strong> {selectedStaff.performance.accuracy}%</p>
                              <p><strong>Đánh giá từ khách hàng:</strong> {selectedStaff.performance.customerRating}/5</p>
                            </>
                          )}
                        </div>
                      </div>
                      <div className="modal-footer">
                        <button
                          type="button"
                          className="btn btn-secondary"
                          onClick={() => setShowStaffModal(false)}
                        >
                          Đóng
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
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
                  <strong>Họ tên:</strong> {editingUser?.fullname}
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
                  <strong>Vai trò:</strong> {getRoleBadge(editingUser?.role?.name)}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={6}>
                  <strong>Trạng thái:</strong> {getStatusBadge(editingUser?.accountStatus)}
                </Col>
                <Col md={6}>
                  <strong>Xác thực:</strong> {editingUser?.verified ? 'Đã xác thực' : 'Chưa xác thực'}
                </Col>
              </Row>
              <hr />
              <Row>
                <Col md={6}>
                  <strong>Ngày tham gia:</strong> {new Date(editingUser?.createdAt).toLocaleDateString('vi-VN')}
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
              {modalType === 'create' ? (
                <>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Nhập email..."
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Mật khẩu</Form.Label>
                      <Form.Control
                        type="password"
                        placeholder="Nhập mật khẩu..."
                        value={formData.password || ''}
                        onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                        required
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>Họ tên</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập họ tên..."
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Vai trò</Form.Label>
                      <Form.Select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                        disabled={loadingRoles}
                        required
                      >
                        <option value="">Chọn vai trò</option>
                        {roleOptions
                          .filter(role => role.name === 'manager' || role.name === 'staff')
                          .map(role => (
                            <option key={role.id} value={role.name}>
                              {role.name === 'manager' ? 'Quản lý' : role.name === 'staff' ? 'Nhân viên' : role.name}
                            </option>
                          ))}
                      </Form.Select>
                    </Col>
                  </Row>
                </>
              ) : (
                <>
                  <Row>
                    <Col md={6} className="mb-3">
                      <Form.Label>Họ tên</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập họ tên..."
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Email</Form.Label>
                      <Form.Control
                        type="email"
                        placeholder="Nhập email..."
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      />
                    </Col>
                    <Col md={6} className="mb-3">
                      <Form.Label>Địa chỉ</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Nhập địa chỉ..."
                        value={formData.location}
                        onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col md={4} className="mb-3">
                      <Form.Label>Vai trò</Form.Label>
                      <Form.Select
                        value={formData.role}
                        onChange={(e) => setFormData({ ...formData, role: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, department: e.target.value })}
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
                        onChange={(e) => setFormData({ ...formData, verified: e.target.checked })}
                      />
                    </Col>
                  </Row>
                </>
              )}
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