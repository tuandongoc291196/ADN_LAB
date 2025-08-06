/**
 * COMPONENT: FeedbackManagement
 * CHỨC NĂNG: Quản lý phản hồi từ khách hàng - xem, phản hồi, lưu trữ feedback
 * LUỒNG HOẠT ĐỘNG:
 * 1. Tải danh sách feedback từ API (hiện tại dùng mock data)
 * 2. Hiển thị danh sách với filter theo rating và search
 * 3. Cho phép xem chi tiết feedback qua modal
 * 4. Phản hồi feedback và cập nhật trạng thái
 * 5. TODO: Tích hợp với API thực tế
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

/**
 * COMPONENT: FeedbackManagement
 * CHỨC NĂNG: Quản lý toàn bộ phản hồi từ khách hàng
 * STATE MANAGEMENT:
 * - feedback: Danh sách feedback từ API
 * - loading: Trạng thái tải dữ liệu
 * - showModal: Hiển thị modal chi tiết
 * - selectedFeedback: Feedback được chọn để xem
 * - filterRating: Lọc theo rating (1-5 sao)
 * - searchTerm: Từ khóa tìm kiếm
 */
const FeedbackManagement = () => {
  const navigate = useNavigate();
  
  // ===== DATA STATES - QUẢN LÝ DỮ LIỆU =====
  // Danh sách feedback từ API
  const [feedback, setFeedback] = useState([]);
  // Trạng thái tải dữ liệu
  const [loading, setLoading] = useState(true);
  
  // ===== MODAL STATES - QUẢN LÝ MODAL =====
  // Hiển thị modal chi tiết
  const [showModal, setShowModal] = useState(false);
  // Feedback được chọn để xem chi tiết
  const [selectedFeedback, setSelectedFeedback] = useState(null);
  
  // ===== FILTER STATES - QUẢN LÝ BỘ LỌC =====
  // Lọc theo rating (1-5 sao)
  const [filterRating, setFilterRating] = useState('all');
  // Từ khóa tìm kiếm
  const [searchTerm, setSearchTerm] = useState('');

  // ===== MOCK DATA - DỮ LIỆU MẪU =====
  // TODO: Thay thế bằng API thực tế
  // Mock data cho feedback - sẽ được thay thế bằng API getFeedbacks()
  const mockFeedback = [
    {
      id: 1,
      customerName: 'Nguyễn Văn A',
      service: 'Xét nghiệm ADN Cha Con',
      rating: 5,
      comment: 'Dịch vụ rất tốt, nhân viên nhiệt tình và chuyên nghiệp.',
      date: '2024-03-15',
      status: 'pending',
      response: ''
    },
    {
      id: 2,
      customerName: 'Lê Văn C',
      service: 'Xét nghiệm ADN Mẹ Con',
      rating: 4,
      comment: 'Kết quả nhanh chóng, nhưng giá hơi cao.',
      date: '2024-03-16',
      status: 'responded',
      response: 'Cảm ơn phản hồi của quý khách. Chúng tôi sẽ cải thiện dịch vụ.'
    },
    {
      id: 3,
      customerName: 'Phạm Thị D',
      service: 'Xét nghiệm ADN Họ Hàng',
      rating: 3,
      comment: 'Thời gian chờ kết quả hơi lâu.',
      date: '2024-03-17',
      status: 'pending',
      response: ''
    }
  ];

  // ===== DATA FETCHING - LẤY DỮ LIỆU TỪ API =====
  /**
   * useEffect: Tải dữ liệu feedback khi component mount
   * BƯỚC 1: Hiện tại dùng mock data
   * BƯỚC 2: TODO: Thay thế bằng API getFeedbacks()
   * BƯỚC 3: Cập nhật feedback state
   * BƯỚC 4: Set loading = false
   */
  useEffect(() => {
    // TODO: Thay thế bằng API thực tế
    // const fetchFeedback = async () => {
    //   try {
    //     const data = await getFeedbacks();
    //     setFeedback(data);
    //   } catch (error) {
    //     console.error('Error fetching feedback:', error);
    //   } finally {
    //     setLoading(false);
    //   }
    // };
    // fetchFeedback();
    
    // Hiện tại dùng mock data
    setFeedback(mockFeedback);
    setLoading(false);
  }, []);

  // ===== EVENT HANDLERS - XỬ LÝ SỰ KIỆN =====
  /**
   * handleStatusChange: Cập nhật trạng thái feedback
   * BƯỚC 1: TODO: Gọi API để cập nhật trạng thái
   * BƯỚC 2: Cập nhật local state
   * BƯỚC 3: Hiển thị thông báo thành công
   */
  const handleStatusChange = (feedbackId, newStatus) => {
    // TODO: Implement API call to update feedback status
    // const updateFeedbackStatus = async () => {
    //   try {
    //     await updateFeedbackStatus(feedbackId, newStatus);
    //     // Cập nhật local state
    //     setFeedback(prev => prev.map(fb => 
    //       fb.id === feedbackId ? { ...fb, status: newStatus } : fb
    //     ));
    //     toast.success('Cập nhật trạng thái thành công!');
    //   } catch (error) {
    //     toast.error('Có lỗi khi cập nhật trạng thái!');
    //   }
    // };
    // updateFeedbackStatus();
    
    // Hiện tại chỉ hiển thị thông báo
    toast.success('Cập nhật trạng thái thành công!');
  };

  /**
   * handleViewDetails: Xem chi tiết feedback
   * BƯỚC 1: Cập nhật selectedFeedback
   * BƯỚC 2: Mở modal hiển thị chi tiết
   */
  const handleViewDetails = (feedbackItem) => {
    setSelectedFeedback(feedbackItem);
    setShowModal(true);
  };

  /**
   * handleRespond: Phản hồi feedback
   * BƯỚC 1: TODO: Gọi API để gửi phản hồi
   * BƯỚC 2: Cập nhật local state
   * BƯỚC 3: Hiển thị thông báo thành công
   */
  const handleRespond = (feedbackId, response) => {
    // TODO: Implement API call to respond to feedback
    // const respondToFeedback = async () => {
    //   try {
    //     await addFeedbackResponse(feedbackId, response);
    //     // Cập nhật local state
    //     setFeedback(prev => prev.map(fb => 
    //       fb.id === feedbackId ? { ...fb, response, status: 'responded' } : fb
    //     ));
    //     toast.success('Đã gửi phản hồi thành công!');
    //   } catch (error) {
    //     toast.error('Có lỗi khi gửi phản hồi!');
    //   }
    // };
    // respondToFeedback();
    
    // Hiện tại chỉ hiển thị thông báo
    toast.success('Đã gửi phản hồi thành công!');
  };

  // ===== HELPER FUNCTIONS - CÁC HÀM TIỆN ÍCH =====
  /**
   * getRatingStars: Tạo hiển thị sao đánh giá
   * INPUT: rating (1-5)
   * OUTPUT: JSX với 5 ngôi sao (filled/empty)
   */
  const getRatingStars = (rating) => {
    return (
      <div className="text-warning">
        {[...Array(5)].map((_, index) => (
          <i
            key={index}
            className={`bi bi-star${index < rating ? '-fill' : ''}`}
          ></i>
        ))}
      </div>
    );
  };

  /**
   * getStatusBadge: Tạo badge hiển thị trạng thái feedback
   * INPUT: status (pending, responded, archived)
   * OUTPUT: JSX Badge component với màu sắc và text tương ứng
   */
  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { bg: 'warning', text: 'Chờ phản hồi' },
      responded: { bg: 'success', text: 'Đã phản hồi' },
      archived: { bg: 'secondary', text: 'Đã lưu trữ' }
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
   * filteredFeedback: Lọc danh sách feedback theo rating và search term
   * BƯỚC 1: Lọc theo rating (1-5 sao)
   * BƯỚC 2: Lọc theo từ khóa tìm kiếm (tên khách, dịch vụ, comment)
   * BƯỚC 3: Trả về danh sách đã lọc
   */
  const filteredFeedback = feedback.filter(item => {
    const matchesRating = filterRating === 'all' || item.rating === parseInt(filterRating);
    const matchesSearch = 
      item.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.comment.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesRating && matchesSearch;
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
        <h2>Quản lý phản hồi</h2>
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
            value={filterRating}
            onChange={(e) => setFilterRating(e.target.value)}
          >
            <option value="all">Tất cả đánh giá</option>
            <option value="5">5 sao</option>
            <option value="4">4 sao</option>
            <option value="3">3 sao</option>
            <option value="2">2 sao</option>
            <option value="1">1 sao</option>
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
                  <th>Đánh giá</th>
                  <th>Ngày</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredFeedback.map(item => (
                  <tr key={item.id}>
                    <td>{item.customerName}</td>
                    <td>{item.service}</td>
                    <td>{getRatingStars(item.rating)}</td>
                    <td>{item.date}</td>
                    <td>{getStatusBadge(item.status)}</td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleViewDetails(item)}
                        >
                          <i className="bi bi-eye"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleStatusChange(item.id, 'responded')}
                        >
                          <i className="bi bi-check-circle"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-secondary"
                          onClick={() => handleStatusChange(item.id, 'archived')}
                        >
                          <i className="bi bi-archive"></i>
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

      {/* Modal chi tiết phản hồi */}
      {showModal && selectedFeedback && (
        <div className="modal fade show" style={{ display: 'block' }}>
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Chi tiết phản hồi</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                <div className="mb-3">
                  <h6>Thông tin khách hàng</h6>
                  <p><strong>Tên:</strong> {selectedFeedback.customerName}</p>
                  <p><strong>Dịch vụ:</strong> {selectedFeedback.service}</p>
                  <p><strong>Ngày:</strong> {selectedFeedback.date}</p>
                  <p><strong>Đánh giá:</strong> {getRatingStars(selectedFeedback.rating)}</p>
                </div>
                <div className="mb-3">
                  <h6>Nội dung phản hồi</h6>
                  <p>{selectedFeedback.comment}</p>
                </div>
                {selectedFeedback.response && (
                  <div className="mb-3">
                    <h6>Phản hồi của chúng tôi</h6>
                    <p>{selectedFeedback.response}</p>
                  </div>
                )}
                {selectedFeedback.status === 'pending' && (
                  <div className="mb-3">
                    <h6>Gửi phản hồi</h6>
                    <textarea
                      className="form-control"
                      rows="3"
                      placeholder="Nhập phản hồi của bạn..."
                      value={selectedFeedback.response}
                      onChange={(e) => handleRespond(selectedFeedback.id, e.target.value)}
                    ></textarea>
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
                {selectedFeedback.status === 'pending' && (
                  <button
                    type="button"
                    className="btn btn-primary"
                    onClick={() => handleRespond(selectedFeedback.id, selectedFeedback.response)}
                  >
                    Gửi phản hồi
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default FeedbackManagement; 