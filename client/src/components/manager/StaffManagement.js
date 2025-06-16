import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const StaffManagement = () => {
  const navigate = useNavigate();
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('all');

  // Mock data for staff
  const mockStaff = [
    {
      id: 1,
      name: 'Trần Thị B',
      email: 'tranthib@email.com',
      phone: '0123456789',
      department: 'Phòng xét nghiệm',
      position: 'Kỹ thuật viên',
      status: 'active',
      joinDate: '2023-01-15',
      performance: {
        completedTests: 150,
        accuracy: 99.5,
        customerRating: 4.8
      }
    },
    {
      id: 2,
      name: 'Nguyễn Văn E',
      email: 'nguyenvane@email.com',
      phone: '0987654321',
      department: 'Phòng lấy mẫu',
      position: 'Nhân viên lấy mẫu',
      status: 'active',
      joinDate: '2023-03-20',
      performance: {
        completedTests: 200,
        accuracy: 98.9,
        customerRating: 4.7
      }
    },
    {
      id: 3,
      name: 'Lê Văn F',
      email: 'levanf@email.com',
      phone: '0369852147',
      department: 'Phòng xét nghiệm',
      position: 'Kỹ thuật viên',
      status: 'inactive',
      joinDate: '2023-06-10',
      performance: {
        completedTests: 80,
        accuracy: 99.2,
        customerRating: 4.6
      }
    }
  ];

  useEffect(() => {
    // Simulate API call
    setStaff(mockStaff);
    setLoading(false);
  }, []);

  const handleStatusChange = (staffId, newStatus) => {
    // TODO: Implement API call to update staff status
    toast.success('Cập nhật trạng thái thành công!');
  };

  const handleViewDetails = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowModal(true);
  };

  const getStatusBadge = (status) => {
    return (
      <span className={`badge bg-${status === 'active' ? 'success' : 'danger'}`}>
        {status === 'active' ? 'Đang làm việc' : 'Nghỉ việc'}
      </span>
    );
  };

  const filteredStaff = staff.filter(member => {
    const matchesDepartment = filterDepartment === 'all' || member.department === filterDepartment;
    const matchesSearch = 
      member.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      member.phone.includes(searchTerm);
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
                      <div>{member.name}</div>
                      <small className="text-muted">{member.email}</small>
                    </td>
                    <td>{member.department}</td>
                    <td>{member.position}</td>
                    <td>{member.joinDate}</td>
                    <td>{getStatusBadge(member.status)}</td>
                    <td>
                      <div className="d-flex gap-2">
                        <span className="badge bg-info">
                          {member.performance.completedTests} xét nghiệm
                        </span>
                        <span className="badge bg-success">
                          {member.performance.accuracy}% chính xác
                        </span>
                      </div>
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
                  <p><strong>Tên:</strong> {selectedStaff.name}</p>
                  <p><strong>Email:</strong> {selectedStaff.email}</p>
                  <p><strong>Số điện thoại:</strong> {selectedStaff.phone}</p>
                </div>
                <div className="mb-3">
                  <h6>Thông tin công việc</h6>
                  <p><strong>Phòng ban:</strong> {selectedStaff.department}</p>
                  <p><strong>Vị trí:</strong> {selectedStaff.position}</p>
                  <p><strong>Ngày vào làm:</strong> {selectedStaff.joinDate}</p>
                  <p><strong>Trạng thái:</strong> {getStatusBadge(selectedStaff.status)}</p>
                </div>
                <div className="mb-3">
                  <h6>Hiệu suất làm việc</h6>
                  <p><strong>Số xét nghiệm đã hoàn thành:</strong> {selectedStaff.performance.completedTests}</p>
                  <p><strong>Độ chính xác:</strong> {selectedStaff.performance.accuracy}%</p>
                  <p><strong>Đánh giá từ khách hàng:</strong> {selectedStaff.performance.customerRating}/5</p>
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

export default StaffManagement; 