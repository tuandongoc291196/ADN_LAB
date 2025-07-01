/**
 * COMPONENT: StaffManagementByAdmin
 * MỤC ĐÍCH: Quản lý nhân viên từ góc độ admin
 * CHỨC NĂNG:
 * - Hiển thị danh sách tất cả nhân viên theo role
 * - Theo dõi hiệu suất làm việc của nhân viên
 * - Quản lý trạng thái tài khoản nhân viên
 * - Xem chi tiết thông tin cá nhân và công việc
 */

import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Badge from 'react-bootstrap/Badge';
import { getStaffListByRole } from '../../services/api';

const StaffManagementByAdmin = ({ onCountChange }) => {
  const navigate = useNavigate(); // Hook điều hướng
  
  // State quản lý dữ liệu nhân viên
  const [staff, setStaff] = useState([]); // Danh sách nhân viên
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [showModal, setShowModal] = useState(false); // Hiển thị modal chi tiết
  const [selectedStaff, setSelectedStaff] = useState(null); // Nhân viên được chọn
  
  // State quản lý filter và search
  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
  const [filterDepartment, setFilterDepartment] = useState('all'); // Lọc theo phòng ban

  // Effect để fetch danh sách nhân viên khi component mount
  useEffect(() => {
    const fetchStaff = async () => {
      setLoading(true);
      try {
        // Lấy danh sách nhân viên theo role 1 và 2 (staff và manager)
        const staffList = await getStaffListByRole([1, 2]);
        console.log(staffList);
        setStaff(staffList || []);
        // Callback để thông báo số lượng nhân viên cho component cha
        onCountChange && onCountChange(staffList.length);
      } catch (err) {
        // Xử lý lỗi - có thể hiển thị toast hoặc set error state
        console.error('Lỗi khi tải danh sách nhân viên:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStaff();
  }, []); // Chỉ chạy một lần khi component mount

  // Hàm thay đổi trạng thái nhân viên
  const handleStatusChange = (staffId, newStatus) => {
    // TODO: Triển khai API call để cập nhật trạng thái nhân viên
    toast.success('Cập nhật trạng thái thành công!');
  };

  // Hàm mở modal xem chi tiết nhân viên
  const handleViewDetails = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowModal(true);
  };

  // Hàm tạo badge hiển thị role của nhân viên
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

  // Hàm tạo badge hiển thị trạng thái tài khoản
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

  const filteredStaff = staff.filter(member => {
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
    const matchesSearch =
      (member.fullname?.toLowerCase() || member.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (member.email?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
      (member.phone || '').includes(searchTerm);
    return matchesDepartment && matchesSearch;
  });

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
            value={filterDepartment}
            onChange={(e) => setFilterDepartment(e.target.value)}
          >
            <option value="all">Tất cả phòng ban</option>
            <option value="Phòng xét nghiệm">Phòng xét nghiệm</option>
            <option value="Phòng lấy mẫu">Phòng lấy mẫu</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
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
                          onClick={() => handleViewDetails(member)}
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
            </table>
          </div>
        </div>
      </div>

      {/* Modal chi tiết nhân viên */}
      {showModal && selectedStaff && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chi tiết nhân viên</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
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
                  onClick={() => setShowModal(false)}
                >
                  Đóng
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default StaffManagementByAdmin; 