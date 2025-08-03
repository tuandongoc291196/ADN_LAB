// PHẦN IMPORT THƯ VIỆN

// Thư viện React cốt lõi cho chức năng component
import React, { useState, useEffect } from 'react';
// React Router để điều hướng giữa các trang
import { Link } from 'react-router-dom';
// Các component Bootstrap cho giao diện
import { Row, Col, Card, Button, Badge, Form, Alert, Modal, Tab, Tabs, ProgressBar, Spinner } from 'react-bootstrap';
// Các hàm API service để lấy và cập nhật dữ liệu
import { getBookingByUserId, addBookingHistory } from '../../services/api';
// Hằng số cho mapping phương thức (icon, tên, v.v.)
import { METHOD_MAPPING } from '../data/services-data';
// SweetAlert2 để hiển thị thông báo đẹp hơn
import Swal from 'sweetalert2';


// COMPONENT CHÍNH: MyAppointments
// Component này hiển thị tất cả lịch hẹn cho người dùng đã đăng nhập
// Props: user - đối tượng người dùng hiện tại đã xác thực
const MyAppointments = ({ user }) => {
  // PHẦN QUẢN LÝ STATE
  
  // Quản lý Tab - Điều khiển tab nào đang được chọn
  const [selectedTab, setSelectedTab] = useState('all'); // 'all', 'confirmed', 'in-progress', 'completed', 'cancelled'
  
  // State Modal - Điều khiển hiển thị các modal khác nhau
  const [showCancelModal, setShowCancelModal] = useState(false); // Modal để hủy lịch hẹn
  const [showRescheduleModal, setShowRescheduleModal] = useState(false); // Modal để đổi lịch hẹn
  const [showReceiveModal, setShowReceiveModal] = useState(false); // Modal để xác nhận đã nhận kit
  const [showSelfCollectModal, setShowSelfCollectModal] = useState(false); // Modal để xác nhận tự thu mẫu
  const [showSendSampleModal, setShowSendSampleModal] = useState(false); // Modal để xác nhận đã gửi mẫu
  
  // State Item được chọn - Lưu trữ lịch hẹn hiện tại được chọn cho các thao tác modal
  const [selectedAppointment, setSelectedAppointment] = useState(null); // Lịch hẹn hiện tại được chọn để hủy/đổi
  const [selectedReceiveAppointmentId, setSelectedReceiveAppointmentId] = useState(null); // ID lịch hẹn để xác nhận đã nhận kit
  const [selectedSelfCollectAppointmentId, setSelectedSelfCollectAppointmentId] = useState(null); // ID lịch hẹn để xác nhận tự thu mẫu
  const [selectedSendSampleAppointmentId, setSelectedSendSampleAppointmentId] = useState(null); // ID lịch hẹn để xác nhận đã gửi mẫu
  
  // State Bộ lọc - Điều khiển lịch hẹn nào được hiển thị
  const [searchTerm, setSearchTerm] = useState(''); // Bộ lọc tìm kiếm theo text
  const [timeFilter, setTimeFilter] = useState('all'); // Bộ lọc khoảng thời gian: 'all', '1week', '1month', '3months', '6months', '12months'
  const [statusFilter, setStatusFilter] = useState('all'); // Bộ lọc trạng thái: 'all', 'confirmed', 'in-progress', 'completed', 'cancelled'
  
  // State Dữ liệu - Lưu trữ dữ liệu lịch hẹn thực tế
  const [appointments, setAppointments] = useState([]); // Dữ liệu lịch hẹn thô từ API
  const [transformedAppointments, setTransformedAppointments] = useState([]); // Dữ liệu lịch hẹn đã xử lý để hiển thị
  
  // State Giao diện - Điều khiển trạng thái loading và lỗi
  const [loading, setLoading] = useState(true); // Hiển thị spinner khi đang tải dữ liệu
  const [error, setError] = useState(null); // Lưu trữ thông báo lỗi nếu API call thất bại
  
  // State Form - Cho input trong modal
  const [description, setDescription] = useState(''); // Text mô tả cho việc cập nhật lịch sử booking

  // PHẦN LẤY DỮ LIỆU
  // useEffect hook để lấy lịch hẹn khi component mount hoặc user thay đổi
  useEffect(() => {
    // Định nghĩa hàm async để lấy lịch hẹn
    const fetchAppointments = async () => {
      // Kiểm tra xem user có tồn tại và có ID trước khi gọi API
      if (!user?.id) {
        setLoading(false);
        return;
      }

      try {
        // Đặt trạng thái loading để hiển thị spinner
        setLoading(true);
        // Xóa bất kỳ lỗi trước đó
        setError(null);
        
        // Gọi API để lấy tất cả lịch hẹn cho người dùng hiện tại
        const data = await getBookingByUserId(user.id);
        // Lưu dữ liệu lịch hẹn thô vào state
        setAppointments(data || []);
      } catch (err) {
        // Đặt thông báo lỗi người dùng
        setError('Không thể tải danh sách lịch hẹn. Vui lòng thử lại sau.');
      } finally {
        // Luôn dừng loading bất kể thành công hay thất bại
        setLoading(false);
      }
    };

    // Thực thi hàm fetch
    fetchAppointments();
  }, [user?.id]); // Chạy lại khi ID của user thay đổi

  // ========================================
  // HÀM TRỢ GIÚP
  // ========================================
  
  /**
   * Xác định tin nhắn hành động tiếp theo dựa trên trạng thái hiện tại
   * @param {string} status - Trạng thái hiện tại của lịch hẹn
   * @param {string} latestHistoryStatus - Trạng thái gần đây nhất từ lịch sử booking
   * @returns {string} Tin nhắn người dùng-friendly về việc làm gì tiếp theo
   */
  const getNextAction = (status, latestHistoryStatus) => {
    // Nếu lịch hẹn đã hoàn thành, hiển thị thông báo hoàn thành
    if (latestHistoryStatus === 'COMPLETED' || latestHistoryStatus === 'COMPLETE') {
      return 'Kết quả đã sẵn sàng';
    }
    
    // Ánh xạ mỗi trạng thái để có tin nhắn hành động tiếp theo phù hợp
    switch (latestHistoryStatus) {
      case 'KIT_SENT':
        return 'Kit đã được gửi - Vui lòng xác nhận khi nhận được';
      case 'KIT_RECEIVED':
        return 'Kit đã nhận - Vui lòng tự thu mẫu theo hướng dẫn';
      case 'SELF_COLLECTED':
        return 'Đã tự thu mẫu - Vui lòng gửi mẫu về phòng lab';
      case 'KIT_RETURNED':
        return 'Mẫu đã gửi về - Đang chờ phân tích';
      case 'SAMPLE_RECEIVED':
        return 'Mẫu đã nhận tại lab - Đang xử lý';
      case 'SAMPLE_COLLECTED':
        return 'Mẫu đã thu thập - Đang phân tích';
      case 'RESULT_PENDING':
        return 'Đang phân tích mẫu - Kết quả sắp có';
      case 'PAYMENT_CONFIRMED':
        return 'Thanh toán thành công - Đang chuẩn bị kit';
      case 'BOOKED':
        return 'Lịch hẹn đã xác nhận - Đang chuẩn bị';
      case 'KIT_PREPARED':
        return 'Kit đã chuẩn bị - Sắp gửi';
      default:
        return 'Chuẩn bị cho lịch hẹn';
    }
  };

  /**
   * Cung cấp ghi chú/hướng dẫn chi tiết dựa trên trạng thái hiện tại
   * @param {string} status - Trạng thái hiện tại của lịch hẹn
   * @param {string} latestHistoryStatus - Trạng thái gần đây nhất từ lịch sử booking
   * @returns {string} Hướng dẫn chi tiết cho bước hiện tại
   */
  const getNotes = (status, latestHistoryStatus) => {
    // Nếu lịch hẹn đã hoàn thành, hiển thị ghi chú hoàn thành
    if (latestHistoryStatus === 'COMPLETED' || latestHistoryStatus === 'COMPLETE') {
      return 'Xét nghiệm hoàn tất. Kết quả có thể tải về hoặc nhận tại cơ sở.';
    }
    
    // Ánh xạ mỗi trạng thái để có hướng dẫn chi tiết
    switch (latestHistoryStatus) {
      case 'KIT_SENT':
        return 'Kit xét nghiệm đã được gửi đến địa chỉ của bạn. Vui lòng xác nhận khi nhận được.';
      case 'KIT_RECEIVED':
        return 'Bạn đã nhận kit xét nghiệm. Vui lòng tự thu mẫu theo hướng dẫn kèm theo.';
      case 'SELF_COLLECTED':
        return 'Bạn đã tự thu mẫu thành công. Vui lòng gửi mẫu về phòng lab theo hướng dẫn.';
      case 'KIT_RETURNED':
        return 'Mẫu đã được gửi về phòng lab. Chúng tôi sẽ tiến hành phân tích.';
      case 'SAMPLE_RECEIVED':
        return 'Mẫu đã được nhận tại phòng lab và đang được xử lý.';
      case 'SAMPLE_COLLECTED':
        return 'Mẫu đã được thu thập thành công. Đang trong quá trình phân tích.';
      case 'RESULT_PENDING':
        return 'Mẫu đang được phân tích tại phòng lab. Kết quả sẽ sớm có.';
      case 'PAYMENT_CONFIRMED':
        return 'Thanh toán đã xác nhận. Chúng tôi đang chuẩn bị kit xét nghiệm.';
      case 'BOOKED':
        return 'Lịch hẹn đã được xác nhận. Vui lòng chuẩn bị đầy đủ giấy tờ cần thiết.';
      case 'KIT_PREPARED':
        return 'Kit xét nghiệm đã được chuẩn bị và sắp được gửi đến bạn.';
      default:
        return 'Lịch hẹn đã được xác nhận. Vui lòng chuẩn bị đầy đủ giấy tờ cần thiết.';
    }
  };

  /**
   * Tính toán ngày hoàn thành dự kiến dựa trên ngày lịch hẹn
   * @param {string} date - Ngày lịch hẹn
   * @param {string} status - Trạng thái hiện tại của lịch hẹn
   * @returns {string|null} Ngày hoàn thành dự kiến hoặc null nếu không áp dụng
   */
  const getEstimatedCompletion = (date, status) => {
    // Nếu lịch hẹn đã hoàn thành, không cần ước tính
    if (status === 'completed') return null;

    // Kiểm tra xem date có tồn tại và không rỗng
    if (!date || date === '') return null;

    try {
      // Phân tích ngày lịch hẹn
      const appointmentDate = new Date(date);

      // Kiểm tra xem ngày đã phân tích có hợp lệ không
      if (isNaN(appointmentDate.getTime())) {
        return null;
      }

      // Thêm 7 ngày vào ngày lịch hẹn để ước tính hoàn thành
      const estimatedDate = new Date(appointmentDate.getTime() + (7 * 24 * 60 * 60 * 1000));
      // Trả về ngày ở định dạng YYYY-MM-DD
      return estimatedDate.toISOString().split('T')[0];
    } catch (error) {
      return null;
    }
  };

  // ========================================
  // PHẦN MAPPING TIMELINE VÀ TRẠNG THÁI
  // ========================================
  
  /**
   * Lấy các bước timeline phù hợp dựa trên phương thức thử nghiệm
   * Các phương thức khác nhau có các luồng làm việc khác nhau (tự thu mẫu tại nhà vs thăm viện)
   * @param {Object} method - Đối tượng phương thức chứa id và tên
   * @returns {Array} Mảng các bước trạng thái theo thứ tự chỉ số
   */
  const getTimelineForMethod = (method) => {
    // Timeline mặc định nếu không có phương thức nào được cung cấp
    if (!method || !method.id) return ['CREATED', 'PENDING_PAYMENT', 'BOOKED', 'SAMPLE_COLLECTED', 'RESULT_PENDING', 'COMPLETE'];
    
    const methodId = method.id;
    const methodName = method.name?.toLowerCase() || '';
    
    // Phương thức tự thu mẫu (Method ID: 0) - Tự thu mẫu tại nhà
    // Timeline: CREATED → PENDING_PAYMENT → PAYMENT_CONFIRMED → BOOKED → KIT_PREPARED → KIT_SENT → KIT_RECEIVED → SELF_COLLECTED → KIT_RETURNED → SAMPLE_RECEIVED → SAMPLE_COLLECTED → RESULT_PENDING → COMPLETE
    if (methodId === '0' || methodName.includes('tự') || methodName.includes('self') || methodName.includes('kit')) {
      return [
        'CREATED',
        'PENDING_PAYMENT',
        'PAYMENT_CONFIRMED',
        'BOOKED',
        'KIT_PREPARED',
        'KIT_SENT',
        'KIT_RECEIVED',
        'SELF_COLLECTED',
        'KIT_RETURNED',
        'SAMPLE_RECEIVED',
        'SAMPLE_COLLECTED',
        'RESULT_PENDING',
        'COMPLETE'
      ];
    }
    
    // Phương thức thăm viện (Method ID: 1) - Nhân viên thăm nhà
    // Timeline: CREATED → PENDING_PAYMENT → BOOKED → STAFF_ASSIGNED → SAMPLE_RECEIVED → SAMPLE_COLLECTED → RESULT_PENDING → COMPLETE
    if (methodId === '1' || methodName.includes('tại nhà') || methodName.includes('home') || methodName.includes('visit')) {
      return [
        'CREATED',
        'PENDING_PAYMENT',
        'BOOKED',
        'STAFF_ASSIGNED',
        'SAMPLE_RECEIVED',
        'SAMPLE_COLLECTED',
        'RESULT_PENDING',
        'COMPLETE'
      ];
    }
    
    // Phương thức thăm viện (Method ID: 2) - Lấy mẫu tại viện/cơ sở
    // Timeline: CREATED → PENDING_PAYMENT → BOOKED → SAMPLE_RECEIVED → SAMPLE_COLLECTED → RESULT_PENDING → COMPLETE
    if (methodId === '2' || methodName.includes('tại lab') || methodName.includes('cơ sở') || methodName.includes('lab') || methodName.includes('facility')) {
      return [
        'CREATED',
        'PENDING_PAYMENT',
        'BOOKED',
        'SAMPLE_RECEIVED',
        'SAMPLE_COLLECTED',
        'RESULT_PENDING',
        'COMPLETE'
      ];
    }
    
    // Timeline mặc định nếu không có khớp nào được tìm thấy
    return ['CREATED', 'PENDING_PAYMENT', 'BOOKED', 'SAMPLE_COLLECTED', 'RESULT_PENDING', 'COMPLETE'];
  };

  /**
   * Ánh xạ trạng thái nội bộ sang trạng thái hiển thị cho UI
   * Chuyển đổi mã trạng thái kỹ thuật sang trạng thái hiển thị (đã xác nhận, đang thực hiện, hoàn thành, hủy)
   * @param {string} currentStatus - Trạng thái hiện tại từ lịch sử booking
   * @param {Object} method - Đối tượng phương thức để xác định luồng làm việc
   * @returns {string} Trạng thái UI: 'confirmed', 'in-progress', 'completed', or 'cancelled'
   */
  const mapTimelineStatusToUIStatus = (currentStatus, method) => {
    // Xử lý null/undefined trạng thái
    if (!currentStatus) return 'confirmed';
    
    // Xử lý các trạng thái đặc biệt trên logic phương thức
    if (currentStatus === 'COMPLETED' || currentStatus === 'COMPLETE') {
      return 'completed';
    }
    if (currentStatus === 'CANCELLED' || currentStatus === 'EXPIRED') {
      return 'cancelled';
    }
    
    // Trích xuất thông tin phương thức để ánh xạ trạng thái
    const methodId = method?.id;
    const methodName = method?.name?.toLowerCase() || '';
    
    // Phương thức tự thu mẫu (Method ID: 0) - Người dùng thu mẫu tại nhà
    if (methodId === '0' || methodName.includes('tự') || methodName.includes('self') || methodName.includes('kit')) {
      console.log('MyAppointments - processing self-sample method');
      
      // Trạng thái đã xác nhận: Các bước đầu tiên của quá trình
      if (['CREATED', 'PENDING_PAYMENT', 'PAYMENT_CONFIRMED', 'BOOKED'].includes(currentStatus)) {
        console.log('MyAppointments - self-sample returning confirmed for status:', currentStatus);
        return 'confirmed';
      }
      // Trạng thái đang thực hiện: Các bước xử lý hoạt động
      else if (['KIT_PREPARED', 'KIT_SENT', 'KIT_RECEIVED', 'SELF_COLLECTED', 'KIT_RETURNED', 'SAMPLE_RECEIVED', 'SAMPLE_COLLECTED', 'RESULT_PENDING'].includes(currentStatus)) {
        console.log('MyAppointments - self-sample returning in-progress for status:', currentStatus);
        return 'in-progress';
      }
      // Trạng thái hoàn thành: Bước cuối cùng
      else {
        console.log('MyAppointments - self-sample returning completed for status:', currentStatus);
        return 'completed';
      }
    }
    
    // Phương thức thăm viện (Method ID: 1) - Nhân viên thăm nhà
    else if (methodId === '1' || methodName.includes('tại nhà') || methodName.includes('home') || methodName.includes('visit')) {
      console.log('MyAppointments - processing home-visit method');
      
      // Trạng thái đã xác nhận: Các bước đầu tiên
      if (['CREATED', 'PENDING_PAYMENT', 'BOOKED'].includes(currentStatus)) {
        console.log('MyAppointments - home-visit returning confirmed for status:', currentStatus);
        return 'confirmed';
      }
      // Trạng thái đang thực hiện: Xử lý hoạt động
      else if (['STAFF_ASSIGNED', 'SAMPLE_RECEIVED', 'SAMPLE_COLLECTED', 'RESULT_PENDING'].includes(currentStatus)) {
        console.log('MyAppointments - home-visit returning in-progress for status:', currentStatus);
        return 'in-progress';
      }
      // Trạng thái hoàn thành: Bước cuối cùng
      else {
        console.log('MyAppointments - home-visit returning completed for status:', currentStatus);
        return 'completed';
      }
    }
    
    // Phương thức thăm viện (Method ID: 2) - Người dùng thăm viện cơ sở
    else if (methodId === '2' || methodName.includes('tại lab') || methodName.includes('cơ sở') || methodName.includes('lab') || methodName.includes('facility')) {
      console.log('MyAppointments - processing lab-visit method');
      
      // Trạng thái đã xác nhận: Các bước đầu tiên
      if (['CREATED', 'PENDING_PAYMENT', 'BOOKED'].includes(currentStatus)) {
        console.log('MyAppointments - lab-visit returning confirmed for status:', currentStatus);
        return 'confirmed';
      }
      // Trạng thái đang thực hiện: Xử lý hoạt động
      else if (['SAMPLE_RECEIVED', 'SAMPLE_COLLECTED', 'RESULT_PENDING'].includes(currentStatus)) {
        console.log('MyAppointments - lab-visit returning in-progress for status:', currentStatus);
        return 'in-progress';
      }
      // Trạng thái hoàn thành: Bước cuối cùng
      else {
        console.log('MyAppointments - lab-visit returning completed for status:', currentStatus);
        return 'completed';
      }
    }
    
    // Ánh xạ mặc định cho các phương thức không xác định
    else {
      console.log('MyAppointments - processing default method');
      if (['SAMPLE_COLLECTED', 'SAMPLE_PROCESSING', 'RESULT_PENDING', 'KIT_RETURNED', 'SAMPLE_RECEIVED', 'SELF_COLLECTED'].includes(currentStatus)) {
        console.log('MyAppointments - default returning in-progress for status:', currentStatus);
        return 'in-progress';
      } else if (['CREATED', 'PENDING_PAYMENT', 'PAYMENT_CONFIRMED', 'BOOKED', 'KIT_PREPARED', 'KIT_SENT', 'KIT_RECEIVED', 'STAFF_ASSIGNED'].includes(currentStatus)) {
        console.log('MyAppointments - default returning confirmed for status:', currentStatus);
        return 'confirmed';
      } else {
        console.log('MyAppointments - default returning completed for status:', currentStatus);
        return 'completed';
      }
    }
  };

  // ========================================
  // PHẦN TÍNH TOÁN TIẾN ĐỘ
  // ========================================
  
  /**
   * Tính toán phần trăm tiến độ dựa trên lịch sử booking và timeline
   * Tiến độ được tính bằng cách tìm bước hiện tại trong timeline và chuyển đổi thành phần trăm
   * @param {Object} booking - Đối tượng booking với dữ liệu phương thức và lịch sử
   * @returns {number} Phần trăm tiến độ (0-100)
   */
  const calculateProgress = (booking) => {
    // Trả về 0 nếu không có booking hoặc dữ liệu phương thức
    if (!booking || !booking.method) return 0;

    // Lấy timeline đầy đủ cho loại phương thức này
    const fullTimelineSteps = getTimelineForMethod(booking.method);
    
    // Sắp xếp lịch sử theo ngày tạo (cũ nhất trước)
    const history = booking.bookingHistories_on_booking?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt)) || [];
    
    // Lấy trạng thái gần đây nhất từ lịch sử (bản ghi gần nhất)
    const currentStatus = history.length > 0 ? history.sort((a,b) => new Date(b.createdAt) - new Date(a.createdAt))[0].status : null;
    
    console.log('calculateProgress - booking:', booking.id, 'currentStatus:', currentStatus, 'timeline:', fullTimelineSteps);
    
    // Khởi tạo biến tiến độ
    let progress = 0;
    
    // Xử lý các trường hợp đặc biệt
    if (currentStatus === 'COMPLETED' || currentStatus === 'COMPLETE') {
      // Nếu hoàn thành, tiến độ là 100%
      progress = 100;
    } else if (currentStatus === 'CANCELLED' || currentStatus === 'EXPIRED') {
      // Nếu hủy/hết hạn, tiến độ là 0%
      progress = 0;
    } else if (currentStatus) {
      // Tìm trạng thái hiện tại trong timeline của chúng ta
      const currentStepIndex = fullTimelineSteps.indexOf(currentStatus);
      
      if (currentStepIndex !== -1) {
        // Nếu trạng thái được tìm thấy trong timeline, tính toán tiến độ dựa trên vị trí
        progress = ((currentStepIndex + 1) / fullTimelineSteps.length) * 100;
      } else {
        // Nếu trạng thái không được tìm thấy trong timeline, tìm trạng thái gần nhất đứng sau trạng thái hiện tại
        const allStatuses = Object.keys({
          CREATED: 1, PENDING_PAYMENT: 1, PAYMENT_CONFIRMED: 1, BOOKED: 1, KIT_PREPARED: 1, KIT_SENT: 1, KIT_RECEIVED: 1, 
          SELF_COLLECTED: 1, KIT_RETURNED: 1, STAFF_ASSIGNED: 1, SAMPLE_RECEIVED: 1, SAMPLE_COLLECTED: 1, 
          RESULT_PENDING: 1, COMPLETE: 1
        });
        const currentStatusIndex = allStatuses.indexOf(currentStatus);
        
        // Tìm trạng thái hiển thị tiếp theo sau trạng thái hiện tại
        for (let i = 0; i < fullTimelineSteps.length; i++) {
          const timelineStatusIndex = allStatuses.indexOf(fullTimelineSteps[i]);
          if (timelineStatusIndex > currentStatusIndex) {
            progress = (i / fullTimelineSteps.length) * 100;
            break;
          }
        }
      }
    }
    
    console.log('calculateProgress - final progress:', progress);
    return Math.round(progress);
  };

  // ========================================
  // PHẦN BIẾN ĐỔI DỮ LIỆU
  // ========================================
  
  /**
   * Biến đổi dữ liệu lịch hẹn thô từ API sang định dạng hiển thị
   * Trích xuất và định dạng tất cả thông tin cần thiết cho UI
   * @param {Object} booking - Đối tượng booking thô từ API
   * @returns {Object} Đối tượng booking đã biến đổi với tất cả thuộc tính hiển thị
   */
  const transformBookingData = (booking) => {
    // ========================================
    // TRÍCH XUẤT NGÀY VÀ GIỜ
    // ========================================
    
    // Trích xuất ngày và giờ từ timeSlotId (định dạng: "2025-07-13_09:00_10:00")
    const timeSlotId = booking.timeSlotId;
    let date = '';
    let time = '';

    if (timeSlotId) {
      try {
        // Phân tích định dạng timeSlotId: "2025-07-13_09:00_10:00"
        const parts = timeSlotId.split('_');
        if (parts.length >= 2) {
          date = parts[0]; // "2025-07-13"
          time = parts[1]; // "09:00"
        } else {
          // Fallback cho định dạng cũ nếu cần
          const dateTime = new Date(timeSlotId);
          if (!isNaN(dateTime.getTime())) {
            date = dateTime.toISOString().split('T')[0];
            time = dateTime.toTimeString().split(' ')[0].substring(0, 5);
          }
        }
      } catch (e) {
        console.error('Lỗi khi phân tích timeSlotId:', e, timeSlotId);
      }
    }

    // ========================================
    // XÁC ĐỊNH TRẠNG THÁI
    // ========================================
    
    // Lấy trạng thái gần đây nhất từ lịch sử booking
    const history = booking.bookingHistories_on_booking?.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)) || [];
    const currentHistoryStatus = history.length > 0 ? history[0].status : null;
    
    console.log('MyAppointments - transformBookingData for booking:', booking.id);
    console.log('MyAppointments - currentHistoryStatus:', currentHistoryStatus);
    console.log('MyAppointments - history:', history);
    console.log('MyAppointments - method:', booking.method);
    
    // Khởi tạo biến trạng thái
    let status = 'confirmed'; // trạng thái mặc định
    let isUpcoming = false;
    
    // Kiểm tra xem lịch hẹn có phải là lịch hẹn tới không dựa trên ngày
    if (timeSlotId) {
      try {
        // Phân tích ngày từ định dạng timeSlotId
        const parts = timeSlotId.split('_');
        if (parts.length >= 1) {
          const appointmentDate = new Date(parts[0]);
          isUpcoming = !isNaN(appointmentDate.getTime()) && appointmentDate > new Date();
        }
      } catch (e) {
        console.error('Lỗi khi kiểm tra lịch hẹn có phải là lịch hẹn tới:', e);
        isUpcoming = false;
      }
    }

    // Ánh xạ trạng thái dựa trên lịch sử hoặc fallback về logic dựa trên thời gian
    if (currentHistoryStatus) {
      // Sử dụng hàm ánh xạ trạng thái để xác định trạng thái UI
      status = mapTimelineStatusToUIStatus(currentHistoryStatus, booking.method);
      console.log('MyAppointments - mapped status for', booking.id, ':', status, 'from', currentHistoryStatus);
    } else {
      // Fallback về trạng thái dựa trên thời gian nếu không có lịch sử
      const createdAt = new Date(booking.createdAt);
      const now = new Date();
      
      if (isUpcoming) {
        status = 'confirmed';
      } else if (createdAt.getTime() + (7 * 24 * 60 * 60 * 1000) < now.getTime()) {
        status = 'completed';
      } else {
        status = 'in-progress';
      }
      console.log('MyAppointments - fallback status for', booking.id, ':', status);
    }

    // Tính toán tiến độ dựa trên lịch sử booking và timeline
    const progress = calculateProgress(booking);

    // ========================================
    // THÔNG TIN DỊCH VỤ TRÍCH XUẤT
    // ========================================
    
    // Lấy thông tin dịch vụ từ dữ liệu lồng nhau (API cấu trúc mới với category được bao gồm)
    const serviceName = booking.service?.title || 'Dịch vụ xét nghiệm ADN';
    let serviceType = 'civil'; // mặc định
    let categoryName = 'ADN Dân sự'; // mặc định

    // Sử dụng dữ liệu category trực tiếp từ booking.service.category (API cấu trúc mới)
    if (booking.service?.category) {
      const hasLegalValue = booking.service.category.hasLegalValue;
      const isAdministrative = hasLegalValue === true || hasLegalValue === 'true' || hasLegalValue === 1 || hasLegalValue === '1';
      const isCivil = hasLegalValue === false || hasLegalValue === 'false' || hasLegalValue === 0 || hasLegalValue === '0';

      if (isAdministrative) {
        serviceType = 'administrative';
        categoryName = booking.service.category.name || 'ADN Hành chính';
      } else if (isCivil) {
        serviceType = 'civil';
        categoryName = booking.service.category.name || 'ADN Dân sự';
      } else {
        // Fallback: kiểm tra tên category
        const catName = booking.service.category.name || '';
        if (catName.toLowerCase().includes('hành chính')) {
          serviceType = 'administrative';
          categoryName = catName;
        } else if (catName.toLowerCase().includes('dân sự')) {
          serviceType = 'civil';
          categoryName = catName;
        }
      }
    } else {
      // Fallback: kiểm tra tên dịch vụ (cho tương thích ngược)
      serviceType = serviceName.toLowerCase().includes('hành chính') ? 'administrative' : 'civil';
      categoryName = serviceType === 'administrative' ? 'ADN Hành chính' : 'ADN Dân sự';
    }

    // ========================================
    // THÔNG TIN PHƯƠNG THỨC VÀ NHÂN VIÊN
    // ========================================
    
    // Lấy thông tin phương thức từ dữ liệu lồng nhau
    const methodName = booking.method?.name || 'Phương thức lấy mẫu';
    const methodId = booking.methodId?.toString() || '';

    // Lấy thông tin nhân viên từ dữ liệu lồng nhau
    const staffName = booking.staff?.user?.fullname || `Nhân viên ${booking.staffId}`;
    
    // ========================================
    // LỊCH SỬ VÀ NGƯỜI THAM GIA
    // ========================================
    
    // Lấy lịch sử booking và sắp xếp theo ngày
    const bookingHistories = Array.isArray(booking.bookingHistories_on_booking)
      ? booking.bookingHistories_on_booking
      : [];

    const sortedHistories = [...bookingHistories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    const latestHistoryStatus = sortedHistories[0]?.status || '';

    // Lấy người tham gia từ dữ liệu lồng nhau
    const participants = booking.participants_on_booking || [];

    // ========================================
    // TRẢ VỀ ĐỐI TƯỢNG ĐÃ BIẾN ĐỔI
    // ========================================
    
    // Trả về tất cả dữ liệu đã biến đổi trong một đối tượng duy nhất
    return {
      id: booking.id,
      service: serviceName,
      serviceType: serviceType,
      categoryName: categoryName, // Thêm tên category để hiển thị
      method: methodName,
      methodId: methodId,
      staff: staffName,
      date: date,
      time: time,
      price: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(booking.totalAmount),
      status: status,
      progress: progress,
      participants: participants,
      canCancel: status === 'confirmed',
      canReschedule: status === 'confirmed',
      nextAction: getNextAction(status, latestHistoryStatus),
      notes: getNotes(status, latestHistoryStatus),
      estimatedCompletion: getEstimatedCompletion(date, status),
      latestHistoryStatus: latestHistoryStatus
    };
  };

  // ========================================
  // EFFECT BIẾN ĐỔI DỮ LIỆU
  // ========================================
  
  /**
   * useEffect để biến đổi dữ liệu lịch hẹn thô sang định dạng hiển thị
   * Chạy khi dữ liệu lịch hẹn thô thay đổi
   */
  useEffect(() => {
    // Nếu không có lịch hẹn nào, xóa dữ liệu đã biến đổi
    if (appointments.length === 0) {
      setTransformedAppointments([]);
      return;
    }

    try {
      // Biến đổi mỗi lịch hẹn bằng hàm transformBookingData
      const transformed = appointments.map(transformBookingData);
      // Lưu dữ liệu đã biến đổi vào state
      setTransformedAppointments(transformed);
    } catch (error) {
      console.error('Lỗi khi biến đổi lịch hẹn:', error);
      // Xóa dữ liệu đã biến đổi trên lỗi
      setTransformedAppointments([]);
    }
  }, [appointments]); // Chạy lại khi dữ liệu lịch hẹn thay đổi

  // ========================================
  // HÀM TIỆN ÍCH
  // ========================================
  
  /**
   * Cập nhật trạng thái lịch hẹn tự động sau các hành động của người dùng
   * Thêm bản ghi lịch sử vào lịch hẹn mà không lấy lại từ API
   * @param {string} bookingId - ID của lịch hẹn để cập nhật
   * @param {string} status - Trạng thái mới để thêm
   * @param {string} description - Mô tả cho thay đổi trạng thái
   */
  const updateBookingStatusLocally = (bookingId, status, description) => {
    setAppointments(prev =>
      prev.map(booking =>
        booking.id === bookingId
          ? {
            ...booking,
            bookingHistories_on_booking: [
              ...booking.bookingHistories_on_booking,
              {
                status,
                description,
                createdAt: new Date().toISOString()
              }
            ]
          }
          : booking
      )
    );
  };

  /**
   * Lấy thông tin trạng thái để hiển thị trên UI (màu sắc, văn bản, icon)
   * @param {string} status - Trạng thái để lấy thông tin
   * @returns {Object} Đối tượng chứa variant, văn bản và icon
   */
  const getStatusInfo = (status) => {
    switch (status) {
      case 'confirmed':
        return { variant: 'primary', text: 'Đã xác nhận', icon: 'bi-check-circle' };
      case 'in-progress':
        return { variant: 'warning', text: 'Đang thực hiện', icon: 'bi-clock' };
      case 'completed':
        return { variant: 'success', text: 'Hoàn thành', icon: 'bi-check-circle-fill' };
      case 'cancelled':
        return { variant: 'danger', text: 'Đã hủy', icon: 'bi-x-circle' };
      default:
        return { variant: 'secondary', text: 'Không xác định', icon: 'bi-question-circle' };
    }
  };

  /**
   * Lấy icon phù hợp cho phương thức thử nghiệm
   * @param {string} methodId - ID phương thức để lấy icon
   * @returns {string} Tên lớp icon Bootstrap
   */
  const getMethodIcon = (methodId) => {
    return METHOD_MAPPING[String(methodId)]?.icon || 'bi-gear';
  };

  // ========================================
  // PHẦN LỌC VÀ SẮP XẾP
  // ========================================
  
  /**
   * Lọc và sắp xếp lịch hẹn dựa trên lựa chọn của người dùng
   * Áp dụng bộ lọc tìm kiếm, thời gian và trạng thái, sau đó sắp xếp theo ngày
   * @returns {Array} Lịch hẹn đã lọc và sắp xếp
   */
  const filterAppointments = () => {
    // Bắt đầu với tất cả lịch hẹn đã biến đổi
    let filtered = transformedAppointments;

    // ========================================
    // LỌC THEO TAB
    // ========================================
    
    // Lọc theo tab được chọn (tất cả, đã xác nhận, đang thực hiện, hoàn thành, đã hủy)
    if (selectedTab !== 'all') {
      filtered = filtered.filter(apt => apt.status === selectedTab);
    }

    // ========================================
    // LỌC THEO TỪ KHÓA TÌM KIẾM
    // ========================================
    
    // Lọc theo từ khóa tìm kiếm (tên dịch vụ, mã đặt lịch hoặc tên người tham gia)
    if (searchTerm) {
      filtered = filtered.filter(apt =>
        apt.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        apt.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (apt.participants && apt.participants.some(p =>
          p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (p.relationship && p.relationship.toLowerCase().includes(searchTerm.toLowerCase()) && p.relationship !== 'Chưa xác định')
        ))
      );
    }

    // ========================================
    // LỌC THEO KHOẢNG THỜI GIAN
    // ========================================
    
    // Lọc theo khoảng thời gian (1 tuần, 1 tháng, 3 tháng, v.v.)
    if (timeFilter !== 'all') {
      const now = new Date();
      const cutoffDate = new Date();

      // Tính ngày cắt ngày dựa trên khoảng thời gian được chọn
      switch (timeFilter) {
        case '1week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case '1month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case '3months':
          cutoffDate.setMonth(now.getMonth() - 3);
          break;
        case '6months':
          cutoffDate.setMonth(now.getMonth() - 6);
          break;
        case '12months':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }

      // Lọc các lịch hẹn nằm trong khoảng thời gian
      filtered = filtered.filter(apt => {
        try {
          const appointmentDate = new Date(apt.date);
          return !isNaN(appointmentDate.getTime()) && appointmentDate >= cutoffDate;
        } catch (error) {
          return false;
        }
      });
    }

    // ========================================
    // LỌC THEO TRẠNG THÁI
    // ========================================
    
    // Lọc theo trạng thái (đã xác nhận, đang thực hiện, hoàn thành, đã hủy)
    if (statusFilter !== 'all') {
      filtered = filtered.filter(apt => apt.status === statusFilter);
    }

    // ========================================
    // SẮP XẾP
    // ========================================
    
    // Sắp xếp theo ngày (mới nhất trước) với xử lý lỗi
    return filtered.sort((a, b) => {
      try {
        const dateA = new Date(a.date);
        const dateB = new Date(b.date);

        // Xử lý ngày không hợp lệ
        if (isNaN(dateA.getTime()) && isNaN(dateB.getTime())) return 0;
        if (isNaN(dateA.getTime())) return 1;
        if (isNaN(dateB.getTime())) return -1;

        return dateB - dateA; // Mới nhất trước
      } catch (error) {
        console.error('Lỗi khi sắp xếp lịch hẹn:', error);
        return 0;
      }
    });
  };

  // ========================================
  // HÀM XỬ LÝ SỰ KIỆN
  // ========================================
  
  /**
   * Mở modal hủy lịch hẹn
   * @param {Object} appointment - Lịch hẹn để hủy
   */
  const handleCancelAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowCancelModal(true);
  };

  /**
   * Mở modal đổi lịch hẹn
   * @param {Object} appointment - Lịch hẹn để đổi
   */
  const handleRescheduleAppointment = (appointment) => {
    setSelectedAppointment(appointment);
    setShowRescheduleModal(true);
  };

  /**
   * Xử lý xác nhận hủy lịch hẹn
   */
  const confirmCancel = () => {
    // TODO: Triển khai API thực tế để hủy lịch hẹn ở đây nếu backend đã sẵn sàng
    setShowCancelModal(false);
    setSelectedAppointment(null);
  };

  /**
   * Xử lý xác nhận đổi lịch hẹn
   */
  const confirmReschedule = () => {
    // TODO: Triển khai API thực tế để đổi lịch hẹn ở đây nếu backend đã sẵn sàng
    setShowRescheduleModal(false);
    setSelectedAppointment(null);
  };

  // ========================================
  // HÀM ĐỊNH DẠNG
  // ========================================
  
  /**
   * Định dạng chuỗi ngày thành định dạng người dùng Việt Nam
   * @param {string} dateString - Chuỗi ngày cần định dạng
   * @returns {string} Chuỗi ngày đã định dạng
   */
  const formatDate = (dateString) => {
    if (!dateString || dateString === '') return 'Chưa xác định';

    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) {
        return 'Chưa xác định';
      }

      // Định dạng ngày theo ngôn ngữ Việt Nam
      const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
      return date.toLocaleDateString('vi-VN', options);
    } catch (error) {
      console.error('Lỗi định dạng ngày:', error);
      return 'Chưa xác định';
    }
  };

  /**
   * Kiểm tra xem ngày có phải là ngày tới không (lịch hẹn tới)
   * @param {string} dateString - Chuỗi ngày cần kiểm tra
   * @returns {boolean} True nếu ngày là ngày tới
   */
  const isUpcoming = (dateString) => {
    if (!dateString || dateString === '') return false;

    try {
      const date = new Date(dateString);
      return !isNaN(date.getTime()) && date > new Date();
    } catch (error) {
      console.error('Lỗi khi kiểm tra ngày có phải là ngày tới:', error);
      return false;
    }
  };

  // ========================================
  // GIÁ TRỊ TÍNH TOÁN
  // ========================================
  
  // Áp dụng tất cả các bộ lọc và sắp xếp để lấy danh sách lịch hẹn cuối cùng
  const filteredAppointments = filterAppointments();
  
  // Tính toán số lượng cho mỗi tab để hiển thị trên badge tab
  const tabCounts = {
    all: transformedAppointments.length,
    confirmed: transformedAppointments.filter(apt => apt.status === 'confirmed').length,
    'in-progress': transformedAppointments.filter(apt => apt.status === 'in-progress').length,
    completed: transformedAppointments.filter(apt => apt.status === 'completed').length,
    cancelled: transformedAppointments.filter(apt => apt.status === 'cancelled').length
  };

  // ========================================
  // PHẦN HIỂN THỊ
  // ========================================
  
  return (
    <>
      {/* ========================================
          PHẦN HEADER
          ======================================== */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex align-items-center mb-1">
            <h2 className="mb-1" style={{ textAlign: 'left' }}>
              Lịch hẹn của tôi
            </h2>
          </div>
          <p className="text-muted mb-0" style={{ textAlign: 'left' }}>Quản lý và theo dõi tất cả lịch hẹn xét nghiệm</p>
        </Col>
      </Row>

      {/* ========================================
          PHẦN TÌM KIẾM VÀ LỌC
          ======================================== */}
      <Row className="mb-4">
        {/* Input Tìm kiếm */}
        <Col lg={3} md={6} className="mb-2">
          <Form.Control
            type="text"
            placeholder="Tìm kiếm theo tên dịch vụ, mã đặt lịch hoặc người tham gia..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Col>
        
        {/* Bộ lọc Thời gian */}
        <Col lg={3} md={6} className="mb-2">
          <Form.Select
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
            style={{ height: '38px' }}
          >
            <option value="all">Tất cả thời gian</option>
            <option value="1week">1 tuần qua</option>
            <option value="1month">1 tháng qua</option>
            <option value="3months">3 tháng qua</option>
            <option value="6months">6 tháng qua</option>
            <option value="12months">12 tháng qua</option>
          </Form.Select>
        </Col>
        
        {/* Bộ lọc Trạng thái */}
        <Col lg={3} md={6} className="mb-2">
          <Form.Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ height: '38px' }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="confirmed">Đã xác nhận</option>
            <option value="in-progress">Đang thực hiện</option>
            <option value="completed">Hoàn thành</option>
            <option value="cancelled">Đã hủy</option>
          </Form.Select>
        </Col>
        
        {/* Nút Đặt lịch mới */}
        <Col lg={3} md={6} className="mb-2">
          <div className="d-flex justify-content-end">
            <Button variant="warning" as={Link} to="/appointment">
              <i className="bi bi-plus-circle me-2"></i>
              Đặt lịch mới
            </Button>
          </div>
        </Col>
      </Row>

      {/* ========================================
          PHẦN NỘI DUNG CHÍNH
          ======================================== */}
      <Card className="shadow-sm">
        {/* Bảng điều hướng Tab */}
        <Tabs
          activeKey={selectedTab}
          onSelect={(k) => setSelectedTab(k)}
          className="border-bottom"
        >
          <Tab
            eventKey="all"
            title={
              <span>
                Tất cả
                <Badge bg="secondary" className="ms-1">{tabCounts.all}</Badge>
              </span>
            }
          />
          <Tab
            eventKey="confirmed"
            title={
              <span>
                Đã xác nhận
                <Badge bg="primary" className="ms-1">{tabCounts.confirmed}</Badge>
              </span>
            }
          />
          <Tab
            eventKey="in-progress"
            title={
              <span>
                Đang thực hiện
                <Badge bg="warning" className="ms-1">{tabCounts['in-progress']}</Badge>
              </span>
            }
          />
          <Tab
            eventKey="completed"
            title={
              <span>
                Hoàn thành
                <Badge bg="success" className="ms-1">{tabCounts.completed}</Badge>
              </span>
            }
          />
          <Tab
            eventKey="cancelled"
            title={
              <span>
                Đã hủy
                <Badge bg="danger" className="ms-1">{tabCounts.cancelled}</Badge>
              </span>
            }
          />
        </Tabs>

        {/* Danh sách lịch hẹn */}
        <Card.Body className="p-0">
          {/* Trạng thái Loading */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" role="status">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
            </div>
          ) : 
          /* Trạng thái Lỗi */
          error ? (
            <div className="text-center py-5">
              <i className="bi bi-exclamation-triangle text-danger" style={{ fontSize: '4rem' }}></i>
              <h5 className="text-danger mt-3">
                {error}
              </h5>
              <p className="text-muted">
                Vui lòng thử lại sau.
              </p>
            </div>
          ) : 
          /* Danh sách lịch hẹn */
          filteredAppointments.length > 0 ? (
            <div className="list-group list-group-flush">
              {filteredAppointments.map((appointment, index) => {
                const statusInfo = getStatusInfo(appointment.status);

                console.log('Người tham gia:', appointment.participants);

                return (
                  <div key={appointment.id} className="list-group-item p-4">
                    <Row>
                      {/* Cột trái - Chi tiết lịch hẹn */}
                      <Col lg={8}>
                        {/* Tiêu đề lịch hẹn */}
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div>
                            <h5 className="mb-2 d-flex align-items-center" style={{ gap: 8 }}>
                              <span className={`badge ${appointment.serviceType === 'administrative' ? 'bg-warning text-dark' : 'bg-success'}`} style={{ borderRadius: '8px', padding: '6px 12px', fontWeight: 500 }}>
                                {appointment.categoryName}
                              </span>
                              <span style={{ fontWeight: 500, fontSize: 18 }}>{appointment.service}</span>
                            </h5>
                            <div className="d-flex align-items-center gap-3 text-muted mb-2">
                              <span className="text-muted small">
                                <i className="bi bi-hash me-1"></i>
                                {appointment.id}
                              </span>
                              <span className="text-muted small">
                                <i className="bi bi-calendar me-1"></i>
                                {formatDate(appointment.date)} lúc {appointment.time}
                              </span>
                              <span className="text-muted small">
                                <i className={`${getMethodIcon(appointment.methodId) + ' me-1'}`}></i>
                                {appointment.method}
                              </span>
                              <span className="text-muted small">
                                <i className="bi bi-person-badge me-1"></i>
                                {appointment.staff}
                              </span>
                            </div>
                          </div>
                          <div className="text-end">
                            <Badge bg={statusInfo.variant} className="mb-2">
                              <i className={`${statusInfo.icon} me-1`}></i>
                              {statusInfo.text}
                            </Badge>
                            <div className="text-muted small">
                              {appointment.price}
                            </div>
                          </div>
                        </div>

                        {/* Bảng Người tham gia */}
                        <div className="mb-3">
                          <strong className="text-muted small" style={{ textAlign: 'left', display: 'block' }}>Người tham gia:</strong>
                          <div className="mt-1">
                            {appointment.participants && appointment.participants.length > 0 ? (
                              <table className="table table-bordered table-sm mt-2" style={{ maxWidth: 600 }}>
                                <thead>
                                  <tr className="text-muted small">
                                    <th>Tên</th>
                                    <th>Tuổi</th>
                                    <th>Quan hệ nghi ngờ</th>
                                    <th>Giới tính</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {appointment.participants.map((participant, idx) => (
                                    <tr key={idx} className="text-muted small">
                                      <td style={{ fontWeight: 500 }}>{participant.name}</td>
                                      <td>{participant.age}</td>
                                      <td>{participant.relationship || 'Chưa xác định'}</td>
                                      <td>{participant.gender === 'male' ? 'Nam' : participant.gender === 'female' ? 'Nữ' : 'Khác'}</td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            ) : (
                              <span className="text-muted small">
                                <i className="bi bi-info-circle me-1"></i>
                                Chưa có thông tin người tham gia
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Thanh tiến độ */}
                        {appointment.status !== 'cancelled' && (
                          <div className="mb-3">
                            <div className="d-flex justify-content-between align-items-center mb-1">
                              <span className="small text-muted">Tiến độ thực hiện</span>
                              <span className="small fw-bold">{appointment.progress}%</span>
                            </div>
                            <ProgressBar
                              now={appointment.progress}
                              variant={appointment.progress === 100 ? 'success' : appointment.progress > 50 ? 'warning' : 'primary'}
                              style={{ height: '6px' }}
                            />
                            {appointment.progress === 0 && (
                              <small className="text-muted">
                                <i className="bi bi-info-circle me-1"></i>
                                Chưa bắt đầu xử lý
                              </small>
                            )}
                            {appointment.progress > 0 && appointment.progress < 100 && (
                              <small className="text-muted">
                                <i className="bi bi-clock me-1"></i>
                                Đang trong quá trình xử lý
                              </small>
                            )}
                            {appointment.progress === 100 && (
                              <small className="text-success">
                                <i className="bi bi-check-circle me-1"></i>
                                Hoàn thành
                              </small>
                            )}
                          </div>
                        )}

                        {/* Thông báo hành động tiếp theo */}
                        <Alert variant={
                          appointment.status === 'completed' ? 'success' : 
                          appointment.latestHistoryStatus === 'KIT_SENT' || appointment.latestHistoryStatus === 'KIT_RECEIVED' ? 'warning' :
                          appointment.latestHistoryStatus === 'SELF_COLLECTED' || appointment.latestHistoryStatus === 'KIT_RETURNED' ? 'primary' :
                          'info'
                        } className="mb-3 py-2">
                          <i className="bi bi-info-circle me-2"></i>
                          <strong>Trạng thái hiện tại:</strong> {appointment.nextAction}
                        </Alert>

                        {/* Ghi chú */}
                        {appointment.notes && (
                          <div className="text-muted small">
                            <i className="bi bi-sticky me-1"></i>
                            {appointment.notes}
                          </div>
                        )}
                      </Col>

                      {/* Cột phải - Hành động */}
                      <Col lg={4} className="mt-3 mt-lg-0">
                        <div className="d-grid gap-2">
                          {/* Nút Xem chi tiết */}
                          <Button
                            variant="outline-primary"
                            as={Link}
                            to={`/tracking/${appointment.id}`}
                          >
                            <i className="bi bi-eye me-2"></i>
                            Xem chi tiết
                          </Button>

                          {/* Nút Tải kết quả (cho lịch hẹn hoàn thành) */}
                          {(appointment.status === 'completed' || appointment.latestHistoryStatus === 'COMPLETE') && (
                            <Button variant="success" as={Link} to="/user/results">
                              <i className="bi bi-download me-2"></i>
                              Tải kết quả
                            </Button>
                          )}

                          {/* Nút Hỗ trợ */}
                          <Button variant="outline-secondary">
                            <i className="bi bi-chat-dots me-2"></i>
                            Hỗ trợ
                          </Button>
                          
                          {/* Xác nhận nhận kit */}
                          {appointment.latestHistoryStatus === 'KIT_SENT' && (
                            <>
                              <Alert variant="info" className="py-2">
                                <i className="bi bi-truck me-2"></i>
                                <strong>Kit đã đến nơi!</strong>
                              </Alert>
                              <Button
                                variant="success"
                                onClick={() => {
                                  setSelectedReceiveAppointmentId(appointment.id);
                                  setShowReceiveModal(true);
                                }}
                              >
                                <i className="bi bi-box-arrow-in-down me-2"></i>
                                Đã nhận kit
                              </Button>
                            </>
                          )}
                          
                          {/* Xác nhận tự thu mẫu */}
                          {appointment.latestHistoryStatus === 'KIT_RECEIVED' && (
                            <>
                              <Alert variant="success" className="py-2">
                                <i className="bi bi-box-arrow-in-down me-2"></i>
                                <strong>Đã nhận kit thành công!</strong>
                              </Alert>
                              <Button
                                variant="warning"
                                onClick={() => {
                                  setSelectedSelfCollectAppointmentId(appointment.id);
                                  setShowSelfCollectModal(true);
                                }}
                              >
                                <i className="bi bi-check2-circle me-2"></i>
                                Tự thu mẫu
                              </Button>
                            </>
                          )}
                          
                          {/* Xác nhận gửi mẫu */}
                          {appointment.latestHistoryStatus === 'SELF_COLLECTED' && (
                            <>
                              <Alert variant="info" className="py-2">
                                <i className="bi bi-hourglass-split me-2"></i>
                                <strong>Bạn đã tự thu mẫu</strong><br />
                                Vui lòng gửi mẫu về phòng lab theo hướng dẫn.
                              </Alert>
                              <Button
                                variant="primary"
                                onClick={() => {
                                  setSelectedSendSampleAppointmentId(appointment.id);
                                  setShowSendSampleModal(true);
                                }}
                              >
                                <i className="bi bi-send-check me-2"></i>
                                Gửi lại kit
                              </Button>
                            </>
                          )}
                          
                          {/* Trạng thái xử lý mẫu */}
                          {appointment.latestHistoryStatus === 'KIT_RETURNED' && (
                            <Alert variant="info" className="py-2">
                              <i className="bi bi-activity me-2"></i>
                              <strong>Mẫu của bạn đang được phân tích</strong><br />
                              Chúng tôi đã nhận được mẫu xét nghiệm và đang tiến hành xử lý. Kết quả sẽ sớm có.
                            </Alert>
                          )}
                          
                          {/* Trạng thái hoàn thành */}
                          {appointment.latestHistoryStatus === 'COMPLETE' && (
                            <Alert variant="success" className="py-2">
                              <i className="bi bi-check-circle me-2"></i>
                              <strong>Xét nghiệm hoàn tất!</strong><br />
                              Kết quả đã sẵn sàng. Vui lòng xem chi tiết để tải kết quả.
                            </Alert>
                          )}
                        </div>
                      </Col>
                    </Row>
                  </div>
                );
              })}
            </div>
          ) : (
            /* Trạng thái Trống */
            <div className="text-center py-5">
              <i className="bi bi-calendar-x text-muted" style={{ fontSize: '4rem' }}></i>
              <h5 className="text-muted mt-3">
                {searchTerm ? 'Không tìm thấy lịch hẹn nào' : 'Chưa có lịch hẹn nào'}
              </h5>
              <p className="text-muted">
                {searchTerm
                  ? 'Thử thay đổi từ khóa tìm kiếm hoặc bộ lọc'
                  : 'Bắt đầu đặt lịch xét nghiệm đầu tiên của bạn'
                }
              </p>
              {!searchTerm && (
                <Button variant="warning" as={Link} to="/appointment">
                  <i className="bi bi-plus-circle me-2"></i>
                  Đặt lịch ngay
                </Button>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* ========================================
          PHẦN MODAL
          ======================================== */}
      
      {/* Modal Hủy lịch hẹn */}
      <Modal show={showCancelModal} onHide={() => setShowCancelModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận hủy lịch hẹn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <>
              <Alert variant="warning">
                <i className="bi bi-exclamation-triangle me-2"></i>
                Bạn có chắc chắn muốn hủy lịch hẹn này không?
              </Alert>
              <div className="mb-3">
                <strong>Dịch vụ:</strong> {selectedAppointment.service}
              </div>
              <div className="mb-3">
                <strong>Ngày giờ:</strong> {formatDate(selectedAppointment.date)} lúc {selectedAppointment.time}
              </div>
              <div className="mb-3">
                <strong>Mã đặt lịch:</strong> {selectedAppointment.id}
              </div>
              <Alert variant="info">
                <small>
                  <i className="bi bi-info-circle me-2"></i>
                  Lịch hẹn có thể được hủy miễn phí trước 24 giờ. Sau thời gian này có thể áp dụng phí hủy lịch.
                </small>
              </Alert>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCancelModal(false)}>
            Giữ lịch hẹn
          </Button>
          <Button variant="danger" onClick={confirmCancel}>
            Xác nhận hủy
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Đổi lịch hẹn */}
      <Modal show={showRescheduleModal} onHide={() => setShowRescheduleModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Đổi lịch hẹn</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedAppointment && (
            <>
              <Alert variant="info">
                <strong>Lịch hẹn hiện tại:</strong> {selectedAppointment.service}
                <br />
                {formatDate(selectedAppointment.date)} lúc {selectedAppointment.time}
              </Alert>

              <Form>
                <Row>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Ngày mới</Form.Label>
                      <Form.Control type="date" />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group className="mb-3">
                      <Form.Label>Giờ mới</Form.Label>
                      <Form.Select>
                        <option>Chọn giờ...</option>
                        <option value="08:00">08:00</option>
                        <option value="08:30">08:30</option>
                        <option value="09:00">09:00</option>
                        <option value="09:30">09:30</option>
                        <option value="10:00">10:00</option>
                        <option value="10:30">10:30</option>
                        <option value="11:00">11:00</option>
                        <option value="11:30">11:30</option>
                        <option value="13:30">13:30</option>
                        <option value="14:00">14:00</option>
                        <option value="14:30">14:30</option>
                        <option value="15:00">15:00</option>
                        <option value="15:30">15:30</option>
                        <option value="16:00">16:00</option>
                        <option value="16:30">16:30</option>
                        <option value="17:00">17:00</option>
                      </Form.Select>
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label>Lý do đổi lịch</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={3}
                    placeholder="Vui lòng cho biết lý do đổi lịch hẹn..."
                  />
                </Form.Group>
              </Form>
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowRescheduleModal(false)}>
            Hủy
          </Button>
          <Button variant="warning" onClick={confirmReschedule}>
            Xác nhận đổi lịch
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Xác nhận nhận kit */}
      <Modal show={showReceiveModal} onHide={() => setShowReceiveModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận đã nhận kit</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            <i className="bi bi-truck me-2"></i>
            <strong>Kit đã được giao đến địa chỉ của bạn.</strong><br />
            Vui lòng xác nhận để chúng tôi có thể theo dõi tiến độ xét nghiệm chính xác hơn.
          </Alert>
          <Form.Group className="mt-3">
            <Form.Label>Mô tả thông tin(bắt buộc)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ví dụ: Đã nhận kit từ bưu tá Giao hàng nhanh lúc 9h sáng"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReceiveModal(false)}>Đóng</Button>
          <Button
            variant="success"
            disabled={!description.trim()}
            onClick={async () => {
              try {
                // Cuộc gọi API để thêm lịch sử booking
                await addBookingHistory({
                  bookingId: selectedReceiveAppointmentId,
                  status: 'KIT_RECEIVED',
                  description
                });
                
                // Cập nhật trạng thái cục bộ ngay lập tức để cải thiện UX
                updateBookingStatusLocally(selectedReceiveAppointmentId, 'KIT_RECEIVED', description);
                
                // Hiển thị thông báo thành công
                Swal.fire({
                  icon: 'success',
                  title: 'Xác nhận thành công!',
                  text: 'Chúng tôi đã ghi nhận thông tin.',
                  confirmButtonColor: '#198754'
                });
                
                // Đóng modal và đặt lại form
                setShowReceiveModal(false);
                setDescription('');
              } catch (err) {
                // Hiển thị thông báo lỗi
                Swal.fire({
                  icon: 'error',
                  title: 'Lỗi!',
                  text: 'Không thể xác nhận. Vui lòng thử lại.',
                  confirmButtonColor: '#d33'
                });
              }
            }}
          >
            <i className="bi bi-check-circle me-2"></i>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Xác nhận tự thu mẫu */}
      <Modal
        show={showSelfCollectModal}
        onHide={() => setShowSelfCollectModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận tự thu mẫu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <i className="bi bi-droplet me-2"></i>
            <strong>Bạn đã tự thu mẫu thành công?</strong><br />
            Vui lòng xác nhận để chúng tôi sắp xếp tiếp nhận và phân tích mẫu xét nghiệm.
          </Alert>
          <Form.Group className="mt-3">
            <Form.Label>Mô tả thông tin(bắt buộc)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ví dụ: Đã nhận kit từ bưu tá Giao hàng nhanh lúc 9h sáng"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSelfCollectModal(false)}>
            Đóng
          </Button>
          <Button
            variant="success"
            onClick={async () => {
              try {
                // Cuộc gọi API để thêm lịch sử booking
                await addBookingHistory({
                  bookingId: selectedSelfCollectAppointmentId,
                  status: 'SELF_COLLECTED',
                  description
                });
                
                // Cập nhật trạng thái cục bộ
                updateBookingStatusLocally(selectedSelfCollectAppointmentId, 'SELF_COLLECTED', description);
                
                // Hiển thị thông báo thành công
                Swal.fire({
                  icon: 'success',
                  title: 'Đã xác nhận tự thu mẫu!',
                  text: 'Hãy đảm bảo gửi mẫu về trung tâm đúng hướng dẫn.',
                  confirmButtonColor: '#198754'
                });
                
                // Đóng modal và đặt lại form
                setShowSelfCollectModal(false);
                setDescription('');
              } catch (error) {
                // Hiển thị thông báo lỗi
                Swal.fire({
                  icon: 'error',
                  title: 'Lỗi',
                  text: 'Không thể xác nhận. Vui lòng thử lại.',
                  confirmButtonColor: '#d33'
                });
              }
            }}
          >
            <i className="bi bi-check-circle me-2"></i>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Modal Xác nhận gửi mẫu */}
      <Modal
        show={showSendSampleModal}
        onHide={() => setShowSendSampleModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận đã gửi mẫu về phòng lab</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="primary">
            <i className="bi bi-truck me-2"></i>
            <strong>Bạn đã gửi mẫu về trung tâm xét nghiệm?</strong><br />
            Vui lòng xác nhận để chúng tôi tiến hành tiếp nhận và phân tích mẫu.
          </Alert>
          <Form.Group className="mt-3">
            <Form.Label>Mô tả thông tin(bắt buộc)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ví dụ: Đã nhận kit từ bưu tá Giao hàng nhanh lúc 9h sáng"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSendSampleModal(false)}>
            Đóng
          </Button>
          <Button
            variant="success"
            onClick={async () => {
              try {
                // Cuộc gọi API để thêm lịch sử booking
                await addBookingHistory({
                  bookingId: selectedSendSampleAppointmentId,
                  status: 'KIT_RETURNED',
                  description
                });
                
                // Cập nhật trạng thái cục bộ
                updateBookingStatusLocally(selectedSendSampleAppointmentId, 'KIT_RETURNED', description);
                
                // Hiển thị thông báo thành công
                Swal.fire({
                  icon: 'success',
                  title: 'Đã xác nhận gửi mẫu!',
                  text: 'Chúng tôi sẽ tiến hành xét nghiệm.',
                  confirmButtonColor: '#198754'
                });
                
                // Đóng modal và đặt lại form
                setShowSendSampleModal(false);
                setDescription('');
              } catch (error) {
                // Hiển thị thông báo lỗi
                Swal.fire({
                  icon: 'error',
                  title: 'Lỗi',
                  text: 'Không thể xác nhận. Vui lòng thử lại.',
                  confirmButtonColor: '#d33'
                });
              }
            }}
          >
            <i className="bi bi-check-circle me-2"></i>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>

    </>
  );
};

export default MyAppointments;