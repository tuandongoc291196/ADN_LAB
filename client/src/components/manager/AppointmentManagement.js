/**
 * COMPONENT: AppointmentManagement
 * CHỨC NĂNG: Quản lý lịch hẹn xét nghiệm - xem, xác nhận, phân công nhân viên
 * LUỒNG HOẠT ĐỘNG:
 * 1. Tải danh sách appointments từ API (hiện tại dùng mock data)
 * 2. Hiển thị danh sách với filter và search
 * 3. Cho phép xem chi tiết appointment qua modal
 * 4. Cập nhật trạng thái và phân công nhân viên
 * 5. TODO: Tích hợp với API thực tế
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * COMPONENT: AppointmentManagement
 * CHỨC NĂNG: Quản lý toàn bộ lịch hẹn xét nghiệm
 * STATE MANAGEMENT:
 * - appointments: Danh sách lịch hẹn từ API
 * - loading: Trạng thái tải dữ liệu
 * - showModal: Hiển thị modal chi tiết
 * - selectedAppointment: Lịch hẹn được chọn để xem
 * - filterStatus: Lọc theo trạng thái
 * - searchTerm: Từ khóa tìm kiếm
 */
const AppointmentManagement = () => {
  const navigate = useNavigate();
  
  // ===== DATA STATES - QUẢN LÝ DỮ LIỆU =====
  // Danh sách lịch hẹn từ API
  const [appointments, setAppointments] = useState([]);
  // Trạng thái tải dữ liệu
  const [loading, setLoading] = useState(true);
  
  // ===== MODAL STATES - QUẢN LÝ MODAL =====
  // Hiển thị modal chi tiết
  const [showModal, setShowModal] = useState(false);
  // Lịch hẹn được chọn để xem chi tiết
  const [selectedAppointment, setSelectedAppointment] = useState(null);
  
  // ===== FILTER STATES - QUẢN LÝ BỘ LỌC =====
  // Lọc theo trạng thái lịch hẹn
  const [filterStatus, setFilterStatus] = useState('all');
  // Từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // ===== MOCK DATA - DỮ LIỆU MẪU =====
  // TODO: Thay thế bằng API thực tế
  // Mock data cho appointments - sẽ được thay thế bằng API getAllBookings()
  const mockAppointments = [
    {
      id: 1,
      customerName: 'Nguyễn Văn A',
      phone: '0123456789',
      email: 'nguyenvana@email.com',
      service: 'Xét nghiệm ADN Cha Con',
      appointmentDate: '2024-03-20',
      appointmentTime: '09:00',
      status: 'confirmed',
      staffAssigned: 'Trần Thị B',
      notes: 'Khách hàng yêu cầu lấy mẫu tại nhà',
      createdAt: '2024-03-15'
    },
    {
      id: 2,
      customerName: 'Lê Văn C',
      phone: '0987654321',
      email: 'levanc@email.com',
      service: 'Xét nghiệm ADN Mẹ Con',
      appointmentDate: '2024-03-21',
      appointmentTime: '14:00',
      status: 'pending',
      staffAssigned: null,
      notes: '',
      createdAt: '2024-03-16'
    },
    {
      id: 3,
      customerName: 'Phạm Thị D',
      phone: '0369852147',
      email: 'phamthid@email.com',
      service: 'Xét nghiệm ADN Họ Hàng',
      appointmentDate: '2024-03-22',
      appointmentTime: '10:30',
      status: 'completed',
      staffAssigned: 'Nguyễn Văn E',
      notes: 'Đã hoàn thành xét nghiệm',
      createdAt: '2024-03-17'
    }
  ];

  // ===== DATA FETCHING - LẤY DỮ LIỆU TỪ API =====
  /**
   * useEffect: Tải dữ liệu appointments khi component mount
   * BƯỚC 1: Hiện tại dùng mock data
   * BƯỚC 2: TODO: Thay thế bằng API getAllBookings()
   * BƯỚC 3: Cập nhật appointments state
   * BƯỚC 4: Set loading = false
   */
  useEffect(() => {
    // TODO: Thay thế bằng API thực tế
    // const fetchAppointments = async () => {
    //   try {
    //     const data = await getAllBookings();
    //     setAppointments(data);
    //   } catch (error) {
    //     console.error('Error fetching appointments:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchAppointments();
    
    // Hiện tại dùng mock data
    setAppointments(mockAppointments);
    setLoading(false);
  }, []);

  // ===== EVENT HANDLERS - XỬ LÝ SỰ KIỆN =====
  /**
   * handleStatusChange: Cập nhật trạng thái lịch hẹn
   * BƯỚC 1: TODO: Gọi API để cập nhật trạng thái
   * BƯỚC 2: Cập nhật local state
   * BƯỚC 3: Hiển thị thông báo thành công
   */
  const handleStatusChange = (appointmentId, newStatus) => {
    // TODO: Implement API call to update appointment status
    // const updateAppointmentStatus = async () => {
    //   try {
    //     await updateBookingStatus(appointmentId, newStatus);
    //     // Cập nhật local state
    //     setAppointments(prev => prev.map(apt => 
    //       apt.id === appointmentId ? { ...apt, status: newStatus } : apt
    //     ));
    //     toast.success('Cập nhật trạng thái thành công!');
    //   } catch (error) {
    //     toast.error('Có lỗi khi cập nhật trạng thái!');
    //   }
    // };
    // updateAppointmentStatus();
    
    // Hiện tại chỉ hiển thị thông báo
    toast.success('Cập nhật trạng thái thành công!');
  };

  /**
   * handleAssignStaff: Phân công nhân viên cho lịch hẹn
   * BƯỚC 1: TODO: Gọi API để phân công nhân viên
   * BƯỚC 2: Cập nhật local state
   * BƯỚC 3: Hiển thị thông báo thành công
   */
  const handleAssignStaff = (appointmentId, staffId) => {
    // TODO: Implement API call to assign staff
    // const assignStaffToAppointment = async () => {
    //   try {
    //     await assignStaffToBooking(appointmentId, staffId);
    //     // Cập nhật local state
    //     setAppointments(prev => prev.map(apt => 
    //       apt.id === appointmentId ? { ...apt, staffAssigned: staffId } : apt
    //     ));
    //     toast.success('Phân công nhân viên thành công!');
    //   } catch (error) {
    //     toast.error('Có lỗi khi phân công nhân viên!');
    //   }
    // };
    // assignStaffToAppointment();
    
    // Hiện tại chỉ hiển thị thông báo
    toast.success('Phân công nhân viên thành công!');
  };

  /**
   * handleViewDetails: Xem chi tiết lịch hẹn
   * BƯỚC 1: Cập nhật selectedAppointment
   * BƯỚC 2: Mở modal hiển thị chi tiết
   */
  const handleViewDetails = (appointment) => {
    setSelectedAppointment(appointment);
    setShowModal(true);
  };

  // ===== HELPER FUNCTIONS - CÁC HÀM TIỆN ÍCH =====
  /**
   * getStatusBadge: Tạo badge hiển thị trạng thái lịch hẹn
   * INPUT: status (pending, confirmed, completed, cancelled)
   * OUTPUT: JSX Badge component với màu sắc và text tương ứng
   */
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'warning', text: 'Chờ xác nhận' },
      confirmed: { bg: 'info', text: 'Đã xác nhận' },
      completed: { bg: 'success', text: 'Hoàn thành' },
      cancelled: { bg: 'danger', text: 'Đã hủy' }
    };

    const config = statusConfig[status] || { bg: 'secondary', text: 'Không xác định' };
    return (
      <span className={`badge bg-${config.bg}`}>
        {config.text}
      </span>
    );
  };

  // ===== FILTER LOGIC - BỘ LỌC DỮ LIỆU =====
  /**
   * filteredAppointments: Lọc danh sách lịch hẹn theo status và search term
   * BƯỚC 1: Lọc theo trạng thái (pending, confirmed, completed, cancelled)
   * BƯỚC 2: Lọc theo từ khóa tìm kiếm (tên khách, số điện thoại, email)
   * BƯỚC 3: Trả về danh sách đã lọc
   */
  const filteredAppointments = appointments.filter(appointment => {
    const matchesStatus = filterStatus === 'all' || appointment.status === filterStatus;
    const matchesSearch = 
      appointment.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      appointment.phone.includes(searchTerm) ||
      appointment.email.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesStatus && matchesSearch;
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
        <h2>Quản lý lịch hẹn</h2>
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
            <option value="pending">Chờ xác nhận</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </select>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Khách hàng</th>
                  <th>Dịch vụ</th>
                  <th>Ngày hẹn</th>
                  <th>Giờ hẹn</th>
                  <th>Nhân viên</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredAppointments.map(appointment => (
                  <tr key={appointment.id}>
                    <td>
                      <div>{appointment.customerName}</div>
                      <small className="text-muted">{appointment.phone}</small>
                    </td>
                    <td>{appointment.service}</td>
                    <td>{appointment.appointmentDate}</td>
                    <td>{appointment.appointmentTime}</td>
                    <td>
                      {appointment.staffAssigned || (
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleAssignStaff(appointment.id)}
                        >
                          Phân công
                        </button>
                      )}
                    </td>
                    <td>{getStatusBadge(appointment.status)}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleViewDetails(appointment)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleStatusChange(appointment.id, 'completed')}
                        >
                          <i className="bi bi-check-circle"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleStatusChange(appointment.id, 'cancelled')}
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

      {/* Modal chi tiết lịch hẹn */}
      {showModal && selectedAppointment && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chi tiết lịch hẹn</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <h6>Thông tin khách hàng</h6>
                  <p><strong>Tên:</strong> {selectedAppointment.customerName}</p>
                  <p><strong>Số điện thoại:</strong> {selectedAppointment.phone}</p>
                  <p><strong>Email:</strong> {selectedAppointment.email}</p>
                </div>
                <div className="mb-3">
                  <h6>Thông tin lịch hẹn</h6>
                  <p><strong>Dịch vụ:</strong> {selectedAppointment.service}</p>
                  <p><strong>Ngày hẹn:</strong> {selectedAppointment.appointmentDate}</p>
                  <p><strong>Giờ hẹn:</strong> {selectedAppointment.appointmentTime}</p>
                  <p><strong>Trạng thái:</strong> {getStatusBadge(selectedAppointment.status)}</p>
                  <p><strong>Nhân viên phụ trách:</strong> {selectedAppointment.staffAssigned || 'Chưa phân công'}</p>
                </div>
                {selectedAppointment.notes && (
                  <div className="mb-3">
                    <h6>Ghi chú</h6>
                    <p>{selectedAppointment.notes}</p>
                  </div>
                )}
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

export default AppointmentManagement; 