/**
 * COMPONENT: StaffManagement
 * CHỨC NĂNG: Quản lý nhân viên phòng xét nghiệm - xem, sửa, kích hoạt/vô hiệu hóa tài khoản
 * LUỒNG HOẠT ĐỘNG:
 * 1. Tải danh sách staff từ API getStaffListByRole()
 * 2. Lấy chi tiết từng staff bằng getStaffById() để có thông tin position
 * 3. Hiển thị danh sách với filter và search
 * 4. Cho phép xem/sửa thông tin staff qua modal
 * 5. Kích hoạt/vô hiệu hóa tài khoản staff
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Badge from 'react-bootstrap/Badge';
import Table from 'react-bootstrap/Table';
import Dropdown from 'react-bootstrap/Dropdown';
import Modal from 'react-bootstrap/Modal';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Form from 'react-bootstrap/Form';
import Alert from 'react-bootstrap/Alert';
import Button from 'react-bootstrap/Button';
import { getStaffListByRole, updateUserAccountStatus, getUserById, getStaffById, updateUserById } from '../../services/api';

/**
 * COMPONENT: StaffManagement
 * CHỨC NĂNG: Quản lý toàn bộ nhân viên phòng xét nghiệm
 * STATE MANAGEMENT:
 * - staffList: Danh sách nhân viên từ API
 * - loading: Trạng thái tải dữ liệu
 * - showModal: Hiển thị modal xem/sửa
 * - formData: Dữ liệu form sửa thông tin
 * - searchTerm: Từ khóa tìm kiếm
 * - filterStatus: Lọc theo trạng thái tài khoản
 */
const StaffManagement = () => {
  const navigate = useNavigate();
  
  // ===== DATA STATES - QUẢN LÝ DỮ LIỆU =====
  // Danh sách nhân viên từ API
  const [staffList, setStaffList] = useState([]);
  // Trạng thái tải dữ liệu
  const [loading, setLoading] = useState(true);
  // Lỗi khi tải dữ liệu
  const [error, setError] = useState(null);
  
  // ===== MODAL STATES - QUẢN LÝ MODAL =====
  // Hiển thị modal
  const [showModal, setShowModal] = useState(false);
  // Loại modal (view/edit)
  const [modalType, setModalType] = useState('view'); // 'view' | 'edit'
  // Nhân viên được chọn để xem/sửa
  const [selectedStaff, setSelectedStaff] = useState(null);
  // Loading khi tải chi tiết user
  const [loadingUserDetail, setLoadingUserDetail] = useState(false);
  
  // ===== FORM STATES - QUẢN LÝ FORM =====
  // Dữ liệu form sửa thông tin nhân viên
  const [formData, setFormData] = useState({
    fullname: '',
    phone: '',
    gender: '',
    address: ''
  });
  
  // ===== FILTER STATES - QUẢN LÝ BỘ LỌC =====
  // Từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');
  // Lọc theo trạng thái tài khoản
  const [filterStatus, setFilterStatus] = useState('all'); // Changed from filterPosition

  // ===== PAGINATION STATES - QUẢN LÝ PHÂN TRANG =====
  // Trang hiện tại
  const [currentPage, setCurrentPage] = useState(1);
  // Số item trên mỗi trang
  const [itemsPerPage] = useState(10);

  // ===== DATA FETCHING - LẤY DỮ LIỆU TỪ API =====
  /**
   * useEffect: Tải dữ liệu nhân viên khi component mount
   * BƯỚC 1: Gọi API getStaffListByRole() để lấy danh sách staff cơ bản
   * BƯỚC 2: Lọc chỉ lấy những user có role 'staff'
   * BƯỚC 3: Với mỗi staff, gọi API getStaffById() để lấy thông tin chi tiết
   * BƯỚC 4: Kết hợp thông tin user và staff
   * BƯỚC 5: Cập nhật staffList state
   */
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        // BƯỚC 1: Lấy danh sách staff cơ bản từ getStaffListByRole
        const basicStaffList = await getStaffListByRole([1, 2]); // Lấy cả staff và manager
        const filteredBasicStaff = basicStaffList.filter(s => s.role?.name === 'staff') || [];
        
        // BƯỚC 2 & 3: Lấy chi tiết từng staff bằng getStaffById để có thông tin position
        const detailedStaffList = await Promise.all(
          filteredBasicStaff.map(async (staff) => {
            try {
              // Lấy staffId từ staff_on_user hoặc từ id của user
              const staffId = staff.staff_on_user?.[0]?.id || staff.id;
              if (staffId) {
                const detailedStaff = await getStaffById(staffId);
                // BƯỚC 4: Kết hợp thông tin user và staff
                return {
                  ...staff,
                  position: detailedStaff.position,
                  hireDate: detailedStaff.hireDate,
                  specification: detailedStaff.specification,
                  certifications: detailedStaff.certifications
                };
              }
              return staff;
            } catch (error) {
              console.error(`Error fetching details for staff ${staff.id}:`, error);
              return staff;
            }
          })
        );
        
        // BƯỚC 5: Cập nhật state
        setStaffList(detailedStaffList);
      } catch (err) {
        setError(err.message);
        toast.error('Lỗi khi tải danh sách nhân viên');
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []);

  // ===== FILTER LOGIC - BỘ LỌC DỮ LIỆU =====
  /**
   * filteredStaff: Lọc danh sách nhân viên theo search term và status
   * BƯỚC 1: Kiểm tra staff có tồn tại và có role 'staff'
   * BƯỚC 2: Lọc theo trạng thái tài khoản (active/inactive)
   * BƯỚC 3: Lọc theo từ khóa tìm kiếm (tên, email)
   */
  const filteredStaff = Array.isArray(staffList)
    ? staffList.filter(member => {
        if (!member) return false;
        if (!member.role || member.role.name !== 'staff') return false;
        
        const matchesStatus = filterStatus === 'all' || member.accountStatus === filterStatus;
        const matchesSearch =
          (member.fullname?.toLowerCase() || member.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (member.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
          (member.phone || '').includes(searchTerm);
        
        return matchesStatus && matchesSearch;
      })
    : [];

  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaff = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);

  // Format hire date
  const formatHireDate = (dateString) => {
    if (!dateString) return 'N/A';
    const date = new Date(dateString);
    return date.toLocaleDateString('vi-VN');
  };

  // Handle show modal
  const handleShowModal = async (type, staffItem = null) => {
    setModalType(type);
    setShowModal(true);
    
    if (staffItem && (type === 'view' || type === 'edit')) {
      setLoadingUserDetail(true);
      try {
        // Load chi tiết từ API
        const user = await getUserById(staffItem.id);
        if (user) {
          setSelectedStaff(user);
          
          // Populate form data cho edit mode
          if (type === 'edit') {
            setFormData({
              fullname: user.fullname || '',
              phone: user.phone || '',
              gender: user.gender || '',
              address: user.address || ''
            });
          }
        }
      } catch (error) {
        console.error('Error fetching user details:', error);
        toast.error('Lỗi khi tải thông tin chi tiết');
      } finally {
        setLoadingUserDetail(false);
      }
    }
  };

  // Handle status change
  const handleStatusChange = async (staffId, newStatus) => {
    try {
      await updateUserAccountStatus(staffId, newStatus);
      toast.success('Cập nhật trạng thái thành công!');
      
      // Update local state
      setStaffList(prev => 
        prev.map(staff => 
          staff.id === staffId 
            ? { ...staff, accountStatus: newStatus }
            : staff
        )
      );
    } catch (error) {
      toast.error('Lỗi khi cập nhật trạng thái');
    }
  };

  // Handle edit staff
  const handleEditStaff = (staffMember) => {
    // Navigate to edit page or open edit modal
    navigate(`/manager/staff/edit/${staffMember.id}`);
  };

  // Handle save staff information
  const handleSaveStaff = async () => {
    try {
      if (!selectedStaff) {
        toast.error('Không có thông tin nhân viên để cập nhật');
        return;
      }

      // Validate required fields
      if (!formData.fullname.trim()) {
        toast.error('Họ và tên không được để trống');
        return;
      }

      // Prepare update data
      const updateData = {
        fullname: formData.fullname,
        phone: formData.phone,
        gender: formData.gender,
        address: formData.address
      };

      // Call API to update user
      await updateUserById(selectedStaff.id, updateData);
      
      // Update local state
      setStaffList(prev => 
        prev.map(staff => 
          staff.id === selectedStaff.id 
            ? { 
                ...staff, 
                fullname: formData.fullname,
                phone: formData.phone,
                gender: formData.gender,
                address: formData.address
              }
            : staff
        )
      );

      // Update selectedStaff state
      setSelectedStaff(prev => ({
        ...prev,
        fullname: formData.fullname,
        phone: formData.phone,
        gender: formData.gender,
        address: formData.address
      }));

      toast.success('Cập nhật thông tin nhân viên thành công!');
      setShowModal(false);
    } catch (error) {
      console.error('Error updating staff:', error);
      toast.error('Lỗi khi cập nhật thông tin nhân viên');
    }
  };

  // Get role badge
  const getRoleBadge = (roleName) => {
    switch (roleName) {
      case 'staff':
        return <Badge bg="info">Nhân viên</Badge>;
      case 'manager':
        return <Badge bg="danger">Quản lý</Badge>;
      default:
        return <Badge bg="light">Không xác định</Badge>;
    }
  };

  // Get status badge
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Hoạt động</Badge>;
      case 'inactive':
        return <Badge bg="secondary">Không hoạt động</Badge>;
    }
  };

  // Format last login
  const formatLastLogin = (timestamp) => {
    if (!timestamp) return 'Chưa đăng nhập';
    const date = new Date(timestamp);
    const now = new Date();
    const diffInHours = Math.floor((now - date) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Vừa xong';
    if (diffInHours < 24) return `${diffInHours} giờ trước`;
    if (diffInHours < 168) return `${Math.floor(diffInHours / 24)} ngày trước`;
    return date.toLocaleDateString('vi-VN');
  };

  // Loading state
  if (loading) {
    return (
      <div className="container py-5">
        <div className="text-center">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      </div>
    );
  }

  // Error state
  if (error) {
    return (
      <div className="container py-5">
        <div className="alert alert-danger" role="alert">
          Lỗi: {error}
        </div>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Quản lý nhân viên</h2>
        <div className="d-flex gap-2">
          <input
            type="text"
            className="form-control"
            placeholder="Tìm kiếm..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <select
            className="form-select"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Hoạt động</option>
            <option value="inactive">Không hoạt động</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <Table hover responsive className="align-middle table-striped">
              <thead className="bg-light">
                <tr>
                  <th className="text-center fw-bold" style={{ width: '30%' }}>Nhân viên</th>
                  <th className="text-center fw-bold" style={{ width: '30%' }}>Vị trí</th>
                  <th className="text-center fw-bold" style={{ width: '15%' }}>Ngày vào làm</th>
                  <th className="text-center fw-bold" style={{ width: '15%' }}>Trạng thái</th>
                  <th className="text-center fw-bold" style={{ width: '10%' }}>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {currentStaff.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center">
                      Không có dữ liệu nhân viên
                    </td>
                  </tr>
                ) : (
                  currentStaff.map((staffItem, index) => (
                    <tr key={staffItem.id || index}>
                      <td className="text-start">
                        <div className="d-flex align-items-center">
                          <div className="me-3 flex-shrink-0">
                            {staffItem.avatar ? (
                              <img
                                src={staffItem.avatar}
                                alt="Avatar"
                                className="rounded-circle"
                                style={{ width: '40px', height: '40px', objectFit: 'cover' }}
                                onError={(e) => {
                                  e.target.onerror = null;
                                  e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(staffItem.fullname || staffItem.name || 'S')}&background=17a2b8&color=fff&size=40`;
                                }}
                              />
                            ) : (
                              <div 
                                className="bg-info text-white rounded-circle d-flex align-items-center justify-content-center"
                                style={{ width: '40px', height: '40px', fontSize: '18px' }}
                              >
                                {staffItem.fullname?.charAt(0)?.toUpperCase() || staffItem.name?.charAt(0)?.toUpperCase() || 'S'}
                              </div>
                            )}
                          </div>
                          <div className="flex-grow-1 min-width-0">
                            <div className="fw-medium text-truncate">{staffItem.fullname || staffItem.name || 'Chưa cập nhật tên'}</div>
                            <small className="text-muted text-truncate d-block">{staffItem.email || 'N/A'}</small>
                            {staffItem.phone && (
                              <small className="text-muted text-truncate d-block">{staffItem.phone}</small>
                            )}
                          </div>
                        </div>
                      </td>
                      <td className="text-center">{staffItem.position?.name || 'N/A'}</td>
                      <td className="text-center">{formatHireDate(staffItem.createdAt)}</td>
                      <td className="text-center">{getStatusBadge(staffItem.accountStatus)}</td>
                      <td className="text-center">
                        <Dropdown className="position-static" drop={index === currentStaff.length - 1 ? 'up' : 'down'} align="end">
                          <Dropdown.Toggle variant="outline-secondary" size="sm">
                            <i className="bi bi-three-dots"></i>
                          </Dropdown.Toggle>
                          <Dropdown.Menu>
                            <Dropdown.Item onClick={() => handleShowModal('view', staffItem)}>
                              <i className="bi bi-eye me-2"></i>Xem chi tiết
                            </Dropdown.Item>
                            <Dropdown.Item onClick={() => handleShowModal('edit', staffItem)}>
                              <i className="bi bi-pencil me-2"></i>Chỉnh sửa
                            </Dropdown.Item>
                            <Dropdown.Divider />
                            <Dropdown.Item
                              onClick={() => handleStatusChange(staffItem.id, staffItem.accountStatus === 'active' ? 'inactive' : 'active')}
                              className={staffItem.accountStatus === 'active' ? "text-danger" : "text-success"}
                            >
                              <i className={`bi ${staffItem.accountStatus === 'active' ? "bi-x-circle" : "bi-check-circle"} me-2`}></i>
                              {staffItem.accountStatus === 'active' ? 'Vô hiệu hóa' : 'Kích hoạt'}
                            </Dropdown.Item>
                          </Dropdown.Menu>
                        </Dropdown>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </Table>
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-3">
              <nav>
                <ul className="pagination">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(currentPage - 1)}
                      disabled={currentPage === 1}
                    >
                      Trước
                    </button>
                  </li>
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                    <li key={page} className={`page-item ${currentPage === page ? 'active' : ''}`}>
                      <button 
                        className="page-link" 
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </button>
                    </li>
                  ))}
                  <li className={`page-item ${currentPage === totalPages ? 'disabled' : ''}`}>
                    <button 
                      className="page-link" 
                      onClick={() => setCurrentPage(currentPage + 1)}
                      disabled={currentPage === totalPages}
                    >
                      Sau
                    </button>
                  </li>
                </ul>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Modal chi tiết nhân viên */}
      <Modal 
        show={showModal} 
        onHide={() => setShowModal(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>
            {modalType === 'edit' ? (
              <><i className="bi bi-pencil-square me-2 text-primary"></i>Chỉnh sửa thông tin nhân viên</>
            ) : (
              <><i className="bi bi-person-lines-fill me-2 text-primary"></i>Chi tiết nhân viên</>
            )}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loadingUserDetail ? (
            <div className="text-center p-5">
              <div className="spinner-border text-primary" role="status" style={{ width: '3rem', height: '3rem' }}>
                <span className="visually-hidden">Đang tải...</span>
              </div>
              <p className="mt-3 text-muted">Đang tải thông tin chi tiết...</p>
            </div>
          ) : modalType === 'view' ? (
            <div>
              {/* View mode content */}
              {selectedStaff && (
                <div className="user-details">
                  <Row className="mb-4 align-items-center">
                    <Col md={3} className="text-center">
                      {selectedStaff.avatar ? (
                        <img
                          src={selectedStaff.avatar}
                          alt="Avatar"
                          className="rounded-circle img-thumbnail shadow"
                          style={{ width: '140px', height: '140px', objectFit: 'cover' }}
                        />
                      ) : (
                        <div 
                          className="bg-primary text-white rounded-circle d-flex align-items-center justify-content-center mx-auto shadow"
                          style={{ width: '140px', height: '140px', fontSize: '3rem' }}
                        >
                          {selectedStaff.fullname?.charAt(0)?.toUpperCase() || 'S'}
                        </div>
                      )}
                    </Col>
                    <Col md={9}>
                      <h3 className="fw-bold text-primary mb-2">{selectedStaff.fullname || 'N/A'}</h3>
                      <div className="mb-2">
                        {getRoleBadge(selectedStaff.role?.name)} {getStatusBadge(selectedStaff.accountStatus)}
                      </div>
                      <p className="text-muted mb-2 d-flex align-items-center">
                        <i className="bi bi-envelope-fill me-2 text-primary"></i>
                        <span>{selectedStaff.email || 'N/A'}</span>
                      </p>
                      <p className="text-muted d-flex align-items-center">
                        <i className="bi bi-telephone-fill me-2 text-primary"></i>
                        <span>{selectedStaff.phone || 'N/A'}</span>
                      </p>
                    </Col>
                  </Row>

                  <hr className="my-4" />

                  <Row className="mb-4">
                    <Col md={6}>
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white py-3">
                          <h5 className="card-title mb-0 text-primary">
                            <i className="bi bi-person-lines-fill me-2"></i>
                            Thông tin cá nhân
                          </h5>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <div className="d-flex">
                              <div style={{ width: '120px' }} className="text-muted">Giới tính:</div>
                              <div className="fw-medium">
                                {selectedStaff.gender === 'male' ? 
                                  <><i className="bi bi-gender-male text-primary me-1"></i> Nam</> : 
                                 selectedStaff.gender === 'female' ? 
                                  <><i className="bi bi-gender-female text-danger me-1"></i> Nữ</> : 
                                  'Không xác định'}
                              </div>
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="d-flex">
                              <div style={{ width: '120px' }} className="text-muted">Vị trí:</div>
                              <div className="fw-medium">
                                {selectedStaff.position?.name || 
                                  <span className="fst-italic text-muted">Chưa cập nhật</span>}
                              </div>
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="d-flex">
                              <div style={{ width: '120px' }} className="text-muted">Ngày vào làm:</div>
                              <div className="fw-medium">
                                {formatHireDate(selectedStaff.hireDate)}
                              </div>
                            </div>
                          </div>
                          <div className="mb-0">
                            <div className="d-flex">
                              <div style={{ width: '120px' }} className="text-muted">Địa chỉ:</div>
                              <div className="fw-medium">
                                {selectedStaff.address || 
                                  <span className="fst-italic text-muted">Chưa cập nhật</span>}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                    <Col md={6}>
                      <div className="card border-0 shadow-sm h-100">
                        <div className="card-header bg-white py-3">
                          <h5 className="card-title mb-0 text-primary">
                            <i className="bi bi-shield-lock-fill me-2"></i>
                            Thông tin tài khoản
                          </h5>
                        </div>
                        <div className="card-body">
                          <div className="mb-3">
                            <div className="d-flex">
                              <div style={{ width: '180px' }} className="text-muted">Phương thức đăng nhập:</div>
                              <div className="fw-medium">
                                {selectedStaff.authProvider === 'google' ? 
                                  <><i className="bi bi-google text-danger me-1"></i> Google</> : 
                                 selectedStaff.authProvider === 'facebook' ? 
                                  <><i className="bi bi-facebook text-primary me-1"></i> Facebook</> : 
                                  <><i className="bi bi-envelope-fill text-success me-1"></i> Email/Password</>}
                              </div>
                            </div>
                          </div>
                          <div className="mb-3">
                            <div className="d-flex">
                              <div style={{ width: '180px' }} className="text-muted">Đăng nhập cuối:</div>
                              <div className="fw-medium">
                                {formatLastLogin(selectedStaff.lastLogin)}
                              </div>
                            </div>
                          </div>
                          <div className="mb-0">
                            <div className="d-flex">
                              <div style={{ width: '180px' }} className="text-muted">Ngày tạo:</div>
                              <div className="fw-medium">
                                {selectedStaff.createdAt ? 
                                  new Date(selectedStaff.createdAt).toLocaleDateString('vi-VN') : 
                                  'N/A'}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Col>
                  </Row>

                  {/* Thống kê hiệu suất làm việc */}
                  <div className="card border-0 shadow-sm">
                    <div className="card-header bg-white py-3">
                      <h5 className="card-title mb-0 text-primary">
                        <i className="bi bi-graph-up me-2"></i>
                        Hiệu suất làm việc
                      </h5>
                    </div>
                    <div className="card-body">
                      <Row>
                        <Col md={6}>
                          <div className="d-flex align-items-center mb-3">
                            <div className="rounded-circle bg-info bg-opacity-10 p-3 me-3">
                              <i className="bi bi-clipboard2-pulse fs-4 text-info"></i>
                            </div>
                            <div>
                              <h6 className="mb-0 text-muted">Xét nghiệm đã hoàn thành</h6>
                              <h3 className="mb-0">{selectedStaff.performance?.completedTests || 0}</h3>
                            </div>
                          </div>
                        </Col>
                        <Col md={6}>
                          <div className="d-flex align-items-center mb-3">
                            <div className="rounded-circle bg-success bg-opacity-10 p-3 me-3">
                              <i className="bi bi-award fs-4 text-success"></i>
                            </div>
                            <div>
                              <h6 className="mb-0 text-muted">Độ chính xác</h6>
                              <h3 className="mb-0">{selectedStaff.performance?.accuracy || 0}%</h3>
                            </div>
                          </div>
                        </Col>
                      </Row>
                      {selectedStaff.performance?.customerRating && (
                        <Row>
                          <Col md={6}>
                            <div className="d-flex align-items-center">
                              <div className="rounded-circle bg-warning bg-opacity-10 p-3 me-3">
                                <i className="bi bi-star-fill fs-4 text-warning"></i>
                              </div>
                              <div>
                                <h6 className="mb-0 text-muted">Đánh giá từ khách hàng</h6>
                                <h3 className="mb-0">{selectedStaff.performance.customerRating}/5</h3>
                              </div>
                            </div>
                          </Col>
                        </Row>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>
          ) : modalType === 'edit' ? (
            <div>
              {/* Edit mode content */}
              {selectedStaff && (
                <Form>
                  <Alert variant="info" className="mb-4">
                    <i className="bi bi-info-circle me-2"></i>
                    <strong>Lưu ý:</strong> Email và vai trò không thể thay đổi. Chỉ có thể cập nhật thông tin cá nhân.
                  </Alert>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">
                          <i className="bi bi-person-fill text-primary me-2"></i>
                          Họ và tên <span className="text-danger">*</span>
                        </Form.Label>
                        <Form.Control
                          type="text"
                          value={formData.fullname}
                          onChange={(e) => setFormData({ ...formData, fullname: e.target.value })}
                          required
                          className="border-0 shadow-sm"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">
                          <i className="bi bi-envelope-fill text-primary me-2"></i>
                          Email
                        </Form.Label>
                        <Form.Control
                          type="email"
                          value={selectedStaff.email || ''}
                          readOnly
                          className="border-0 shadow-sm bg-light"
                        />
                        <Form.Text className="text-muted">
                          <i className="bi bi-info-circle me-1"></i>
                          Email không thể thay đổi sau khi tạo tài khoản
                        </Form.Text>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Row className="mb-3">
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">
                          <i className="bi bi-telephone-fill text-primary me-2"></i>
                          Số điện thoại
                        </Form.Label>
                        <Form.Control
                          type="tel"
                          value={formData.phone}
                          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                          className="border-0 shadow-sm"
                        />
                      </Form.Group>
                    </Col>
                    <Col md={6}>
                      <Form.Group className="mb-3">
                        <Form.Label className="fw-medium">
                          <i className="bi bi-gender-ambiguous text-primary me-2"></i>
                          Giới tính
                        </Form.Label>
                        <Form.Select
                          value={formData.gender}
                          onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                          className="border-0 shadow-sm"
                        >
                          <option value="">Chọn giới tính</option>
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                          <option value="other">Khác</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Form.Group className="mb-3">
                    <Form.Label className="fw-medium">
                      <i className="bi bi-geo-alt-fill text-primary me-2"></i>
                      Địa chỉ
                    </Form.Label>
                    <Form.Control
                      as="textarea"
                      rows={3}
                      value={formData.address}
                      onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                      className="border-0 shadow-sm"
                      placeholder="Nhập địa chỉ đầy đủ..."
                    />
                  </Form.Group>
                </Form>
              )}
            </div>
          ) : null}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="outline-secondary" onClick={() => setShowModal(false)} className="px-4">
            <i className="bi bi-x-circle me-2"></i>Đóng
          </Button>
          {modalType === 'edit' && (
            <Button variant="primary" onClick={handleSaveStaff} className="px-4">
              <i className="bi bi-check-circle me-2"></i>Lưu thay đổi
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StaffManagement; 