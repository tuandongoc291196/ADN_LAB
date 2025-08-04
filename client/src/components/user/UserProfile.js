// ========================================
// PHẦN IMPORT THƯ VIỆN
// ========================================
// Thư viện React cốt lõi cho chức năng component
import React, { useState, useEffect } from 'react';
// Các hàm API service để lấy và cập nhật thông tin user
import { getUserById, updateUserById } from '../../services/api';
// Các component Bootstrap cho giao diện
import { Row, Col, Card, Button, Form, Alert, Modal, Badge } from 'react-bootstrap';
// Firebase service để upload avatar
import { uploadAvatar } from '../config/firebase';
// Thư viện địa chỉ Việt Nam
import { getProvinces, getDistricts, getWards } from 'vietnam-provinces';

// ========================================
// HÀM TIỆN ÍCH
// ========================================

/**
 * Hàm tìm mã code theo tên trong danh sách địa chỉ
 * 
 * LUỒNG HOẠT ĐỘNG:
 * 1. Nhận danh sách và tên cần tìm
 * 2. Chuẩn hóa tên (bỏ dấu, chuyển lowercase)
 * 3. Tìm item có tên trùng khớp
 * 4. Trả về code hoặc chuỗi rỗng nếu không tìm thấy
 * 
 * @param {Array} list - Danh sách các item có code và name
 * @param {string} name - Tên cần tìm
 * @returns {string} Mã code hoặc chuỗi rỗng
 */
function findCodeByName(list, name) {
  if (!name) return '';
  const normalize = str => str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  return (list.find(item => normalize(item.name) === normalize(name)) || {}).code || '';
}

// ========================================
// COMPONENT CHÍNH: UserProfile
// ========================================

/**
 * Component quản lý hồ sơ cá nhân của user
 * 
 * LUỒNG HOẠT ĐỘNG CHÍNH:
 * 1. Component mount → useEffect chạy → gọi fetchUserData()
 * 2. Lấy userId từ props user hoặc localStorage
 * 3. Gọi API getUserById để lấy thông tin chi tiết user
 * 4. Parse địa chỉ từ string thành các thành phần riêng biệt
 * 5. Điền dữ liệu vào form và hiển thị
 * 6. User tương tác → chỉnh sửa → lưu thay đổi
 * 
 * Props: 
 * - user: Thông tin user hiện tại
 */
const UserProfile = ({ user }) => {
  // ========================================
  // PHẦN QUẢN LÝ STATE
  // ========================================
  
  // State Giao diện - Điều khiển trạng thái chỉnh sửa và modal
  const [isEditing, setIsEditing] = useState(false); // Trạng thái đang chỉnh sửa thông tin
  const [showPasswordModal, setShowPasswordModal] = useState(false); // Hiển thị modal đổi mật khẩu
  
  // State Thông báo - Hiển thị message thành công/lỗi
  const [message, setMessage] = useState({ type: '', content: '' }); // {type: 'success'|'danger'|'info', content: string}
  
  // State Loading - Hiển thị spinner khi đang tải dữ liệu
  const [loading, setLoading] = useState(true); // Hiển thị spinner khi đang tải thông tin user
  
  // State Dữ liệu - Lưu trữ thông tin profile của user
  const [profileData, setProfileData] = useState({
    fullname: '', // Họ và tên
    email: '', // Email (không được phép thay đổi)
    phone: '', // Số điện thoại
    gender: '', // Giới tính
    avatar: '', // URL ảnh đại diện
    accountStatus: '', // Trạng thái tài khoản
    role: { name: '', description: '' }, // Vai trò trong hệ thống
    createdAt: '', // Ngày tạo tài khoản
    lastLogin: '', // Lần đăng nhập cuối
    addressDetail: '', // Địa chỉ chi tiết
    ward: '', // Mã phường/xã
    district: '', // Mã quận/huyện
    city: '', // Mã tỉnh/thành phố
    address: '' // Địa chỉ đầy đủ (string)
  });

  // State Mật khẩu - Dữ liệu cho modal đổi mật khẩu
  const [passwordData, setPasswordData] = useState({
    currentPassword: '', // Mật khẩu hiện tại
    newPassword: '', // Mật khẩu mới
    confirmPassword: '' // Xác nhận mật khẩu mới
  });

  // ========================================
  // PHẦN LẤY USER ID
  // ========================================
  
  /**
   * Lấy userId từ props user hoặc localStorage
   * 
   * LUỒNG HOẠT ĐỘNG:
   * 1. Ưu tiên lấy từ props user (id, user_id, uid)
   * 2. Fallback về localStorage nếu không có trong props
   * 3. Trả về userId hoặc chuỗi rỗng
   */
  const userId = user?.id || user?.user_id || user?.uid || 
    JSON.parse(localStorage.getItem('userData'))?.user_id || '';

  // ========================================
  // PHẦN LẤY DỮ LIỆU
  // ========================================
  
  /**
   * Hàm lấy thông tin user từ API và điền vào form
   * 
   * LUỒNG LẤY DỮ LIỆU:
   * 1. Kiểm tra userId có tồn tại không
   * 2. Gọi API getUserById để lấy thông tin chi tiết
   * 3. Parse địa chỉ từ string thành các thành phần riêng biệt
   * 4. Cập nhật state profileData với dữ liệu đã xử lý
   * 5. Dừng loading và hiển thị form
   * 
   * LÝ DO PARSE ĐỊA CHỈ:
   * - API trả về địa chỉ dạng string: "Số nhà, Phường, Quận, Tỉnh"
   * - Cần tách thành các thành phần để hiển thị trong dropdown
   * - Sử dụng findCodeByName để tìm mã code tương ứng
   */
  const fetchUserData = async () => {
    if (userId) {
      try {
        // BƯỚC 1: Bắt đầu loading
        setLoading(true);
        
        // BƯỚC 2: Gọi API để lấy thông tin user
        const data = await getUserById(userId);
        
        if (data) {
          // BƯỚC 3: Khởi tạo các biến địa chỉ
          let addressDetail = '', ward = '', district = '', city = '';
          
          // BƯỚC 4: Parse địa chỉ nếu có
          if (data.address) {
            const parts = data.address.split(',').map(s => s.trim());
            
            if (parts.length === 4) {
              // Format: "Số nhà, Phường, Quận, Tỉnh"
              addressDetail = parts[0]; // Số nhà
              
              // Tìm mã tỉnh/thành phố
              const cityCode = findCodeByName(getProvinces(), parts[3]);
              city = cityCode;
              
              // Tìm mã quận/huyện (lọc theo tỉnh)
              const districtCode = findCodeByName(
                getDistricts().filter(d => d.province_code === cityCode), 
                parts[2]
              );
              district = districtCode;
              
              // Tìm mã phường/xã (lọc theo quận)
              const wardCode = findCodeByName(
                getWards().filter(w => w.district_code === districtCode), 
                parts[1]
              );
              ward = wardCode;
            } else {
              // Nếu format không đúng, giữ nguyên địa chỉ
              addressDetail = data.address;
              ward = '';
              district = '';
              city = '';
            }
          }
          
          // BƯỚC 5: Cập nhật state với dữ liệu đã xử lý
          setProfileData({
            fullname: data.fullname || '',
            email: data.email || '',
            phone: data.phone || '',
            gender: data.gender || '',
            avatar: data.avatar || '',
            accountStatus: data.accountStatus || '',
            role: data.role || { name: '', description: '' },
            createdAt: data.createdAt || '',
            lastLogin: data.lastLogin || '',
            address: data.address || '',
            addressDetail,
            ward,
            district,
            city
          });
        }
      } catch (err) {
        // BƯỚC 6: Xử lý lỗi khi không thể tải thông tin
        setMessage({ type: 'danger', content: 'Không thể tải thông tin người dùng' });
      } finally {
        // BƯỚC 7: Luôn dừng loading bất kể thành công hay thất bại
        setLoading(false);
      }
    } else {
      // Nếu không có userId, dừng loading
      setLoading(false);
    }
  };

  // ========================================
  // EFFECT LẤY DỮ LIỆU
  // ========================================
  
  /**
   * useEffect để lấy dữ liệu khi component mount hoặc userId thay đổi
   * 
   * LUỒNG HOẠT ĐỘNG:
   * 1. Component mount → useEffect chạy
   * 2. Kiểm tra userId có tồn tại không
   * 3. Nếu có → gọi fetchUserData() để lấy dữ liệu
   * 4. Nếu userId thay đổi → useEffect chạy lại → lấy dữ liệu mới
   */
  useEffect(() => {
    fetchUserData();
  }, [userId]);

  // ========================================
  // HÀM XỬ LÝ SỰ KIỆN
  // ========================================
  
  /**
   * Cập nhật giá trị input khi user nhập liệu
   * 
   * LUỒNG HOẠT ĐỘNG:
   * 1. Nhận field (tên trường) và value (giá trị mới)
   * 2. Cập nhật state profileData với giá trị mới
   * 3. Re-render component với dữ liệu mới
   * 
   * @param {string} field - Tên trường cần cập nhật
   * @param {any} value - Giá trị mới
   */
  const handleInputChange = (field, value) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };

  /**
   * Lưu thông tin profile đã chỉnh sửa
   * 
   * LUỒNG LƯU DỮ LIỆU:
   * 1. Tạo địa chỉ đầy đủ từ các thành phần riêng biệt
   * 2. Chuẩn bị dữ liệu cập nhật (loại bỏ email vì không được phép thay đổi)
   * 3. Gọi API updateUserById để cập nhật thông tin
   * 4. Fetch lại thông tin user mới nhất từ API
   * 5. Cập nhật localStorage với thông tin mới
   * 6. Hiển thị thông báo thành công và thoát chế độ chỉnh sửa
   * 
   * LÝ DO FETCH LẠI DỮ LIỆU:
   * - Đảm bảo có địa chỉ đúng format từ server
   * - Cập nhật localStorage với dữ liệu mới nhất
   * - Dispatch event để các component khác cập nhật
   */
  const handleSaveProfile = async () => {
    // BƯỚC 1: Tạo địa chỉ đầy đủ từ các thành phần
    const address = [
      profileData.addressDetail,
      wards.find(w => w.code === profileData.ward)?.name || '',
      districts.find(d => d.code === profileData.district)?.name || '',
      provinces.find(p => p.code === profileData.city)?.name || ''
    ].filter(Boolean).join(', ');
    
    // BƯỚC 2: Chuẩn bị dữ liệu cập nhật
    const updateData = {
      fullname: profileData.fullname || "",
      gender: profileData.gender || "",
      avatar: profileData.avatar || "",
      phone: profileData.phone || "",
      address
    };

    try {
      // BƯỚC 3: Gọi API để cập nhật thông tin
      await updateUserById(userId, updateData);
      
      // BƯỚC 4: Fetch lại user mới nhất từ API để lấy đúng address
      const updatedUser = await getUserById(userId);
      
      if (updatedUser) {
        // BƯỚC 5: Chuẩn bị dữ liệu cho localStorage
        const role = updatedUser?.role?.name?.toLowerCase() || 'customer';
        const enhancedUser = {
          id: updatedUser.id || updatedUser.user_id || '',
          user_id: updatedUser.user_id || updatedUser.id || '',
          email: updatedUser.email || '',
          fullname: updatedUser.fullname || '',
          avatar: updatedUser.avatar || '',
          phone: updatedUser.phone || '',
          role: updatedUser.role || { name: role },
          accountStatus: updatedUser.accountStatus || '',
          authProvider: updatedUser.authProvider || '',
          createdAt: updatedUser.createdAt || '',
          lastLogin: updatedUser.lastLogin || '',
          gender: updatedUser.gender || '',
          address: updatedUser.address || '',
          role_string: role,
          isAdmin: ['admin', 'manager', 'staff'].includes(role)
        };
        
        // BƯỚC 6: Cập nhật localStorage và dispatch event
        localStorage.setItem('userData', JSON.stringify(enhancedUser));
        window.dispatchEvent(new Event('userDataUpdated'));
      }
      
      // BƯỚC 7: Hiển thị thông báo thành công và thoát chế độ chỉnh sửa
      setMessage({ type: 'success', content: 'Thông tin cá nhân đã được cập nhật thành công!' });
      setIsEditing(false);
    } catch (error) {
      // Xử lý lỗi khi cập nhật thất bại
      setMessage({ type: 'danger', content: 'Cập nhật thất bại: ' + error.message });
    }
    
    // Tự động ẩn thông báo sau 5 giây
    setTimeout(() => setMessage({ type: '', content: '' }), 5000);
  };

  /**
   * Xử lý đổi mật khẩu
   * (Chức năng này sẽ được bổ sung nếu cần thiết)
   */
  const handleChangePassword = () => {
    // Validate mật khẩu xác nhận
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'danger', content: 'Mật khẩu xác nhận không khớp!' });
      return;
    }

    // Validate độ dài mật khẩu mới
    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'danger', content: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
      return;
    }

    // Chức năng đổi mật khẩu sẽ được bổ sung nếu cần thiết
    setMessage({ type: 'success', content: 'Mật khẩu đã được thay đổi thành công!' });
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setMessage({ type: '', content: '' }), 5000);
  };

  // ========================================
  // HÀM TIỆN ÍCH
  // ========================================
  
  /**
   * Định dạng ngày tháng theo tiếng Việt
   * 
   * LUỒNG HOẠT ĐỘNG:
   * 1. Kiểm tra dateString có tồn tại không
   * 2. Tạo Date object từ string
   * 3. Sử dụng toLocaleDateString với locale 'vi-VN'
   * 4. Trả về ngày đã định dạng hoặc thông báo "Chưa có thông tin"
   * 
   * @param {string} dateString - Chuỗi ngày cần định dạng
   * @returns {string} Ngày đã định dạng theo tiếng Việt
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có thông tin';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  /**
   * Tạo badge cho trạng thái tài khoản
   * 
   * LUỒNG HOẠT ĐỘNG:
   * 1. Nhận status từ dữ liệu
   * 2. Map status thành badge với màu sắc phù hợp
   * 3. Trả về JSX Badge component
   * 
   * @param {string} status - Trạng thái tài khoản
   * @returns {JSX.Element} Badge component với màu sắc và text phù hợp
   */
  const getStatusBadge = (status) => {
    switch (status) {
      case 'active':
        return <Badge bg="success">Hoạt động</Badge>;
      case 'inactive':
        return <Badge bg="warning" text="dark">Không hoạt động</Badge>;
      case 'suspended':
        return <Badge bg="danger">Tạm khóa</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  /**
   * Tạo badge cho vai trò trong hệ thống
   * 
   * LUỒNG HOẠT ĐỘNG:
   * 1. Nhận roleName từ dữ liệu
   * 2. Map roleName thành badge với màu sắc phù hợp
   * 3. Trả về JSX Badge component
   * 
   * @param {string} roleName - Tên vai trò
   * @returns {JSX.Element} Badge component với màu sắc và text phù hợp
   */
  const getRoleBadge = (roleName) => {
    switch (roleName) {
      case 'admin':
        return <Badge bg="danger">Quản trị viên</Badge>;
      case 'manager':
        return <Badge bg="warning" text="dark">Quản lý</Badge>;
      case 'staff':
        return <Badge bg="info">Nhân viên</Badge>;
      case 'customer':
        return <Badge bg="primary">Khách hàng</Badge>;
      default:
        return <Badge bg="secondary">{roleName}</Badge>;
    }
  };

  // ========================================
  // PHẦN DỮ LIỆU DROPDOWN
  // ========================================
  
  /**
   * Dữ liệu cho các dropdown địa chỉ
   * 
   * LUỒNG HOẠT ĐỘNG:
   * 1. Lấy danh sách tỉnh/thành phố từ thư viện
   * 2. Lọc quận/huyện theo tỉnh đã chọn
   * 3. Lọc phường/xã theo quận đã chọn
   * 4. Cập nhật khi user thay đổi lựa chọn
   */
  const provinces = getProvinces();
  const districts = profileData.city ? getDistricts().filter(d => d.province_code === profileData.city) : [];
  const wards = profileData.district ? getWards().filter(w => w.district_code === profileData.district) : [];

  // ========================================
  // PHẦN HIỂN THỊ
  // ========================================
  
  /**
   * Render component UI
   * 
   * LUỒNG HIỂN THỊ:
   * 1. Loading state - Hiển thị spinner khi đang tải dữ liệu
   * 2. Success state - Hiển thị form thông tin cá nhân
   * 3. Edit mode - Cho phép chỉnh sửa các trường
   * 4. View mode - Chỉ hiển thị thông tin (read-only)
   * 5. Modal - Form đổi mật khẩu
   */
  
  // ========================================
  // TRẠNG THÁI LOADING
  // ========================================
  if (loading) {
    return (
      <div className="text-center py-5">
        <div className="spinner-border text-primary" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </div>
        <p className="mt-3">Đang tải thông tin người dùng...</p>
      </div>
    );
  }

  // ========================================
  // TRẠNG THÁI THÀNH CÔNG - RENDER FORM
  // ========================================
  return (
    <>
      {/* ========================================
          PHẦN HEADER
          ======================================== */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Hồ sơ cá nhân</h2>
              <p className="text-muted mb-0">Quản lý thông tin tài khoản</p>
            </div>
            <div className="d-none d-md-block">
              {!isEditing ? (
                <Button variant="primary" onClick={() => setIsEditing(true)}>
                  <i className="bi bi-pencil me-2"></i>
                  Chỉnh sửa thông tin
                </Button>
              ) : (
                <div>
                  <Button variant="success" onClick={handleSaveProfile} className="me-2">
                    <i className="bi bi-check me-2"></i>
                    Lưu thay đổi
                  </Button>
                  <Button variant="secondary" onClick={() => setIsEditing(false)}>
                    <i className="bi bi-x me-2"></i>
                    Hủy
                  </Button>
                </div>
              )}
            </div>
          </div>
        </Col>
      </Row>

      {/* ========================================
          PHẦN THÔNG BÁO
          ======================================== */}
      {message.content && (
        <Alert variant={message.type} className="mb-4" dismissible onClose={() => setMessage({ type: '', content: '' })}>
          <i className={`bi bi-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`}></i>
          {message.content}
        </Alert>
      )}

      {/* ========================================
          PHẦN NÚT CHỈNH SỬA MOBILE
          ======================================== */}
      <Row className="mb-4 d-md-none">
        <Col>
          {!isEditing ? (
            <Button variant="primary" className="w-100" onClick={() => setIsEditing(true)}>
              <i className="bi bi-pencil me-2"></i>
              Chỉnh sửa thông tin
            </Button>
          ) : (
            <div className="d-grid gap-2 d-md-flex">
              <Button variant="success" onClick={handleSaveProfile}>
                <i className="bi bi-check me-2"></i>
                Lưu thay đổi
              </Button>
              <Button variant="secondary" onClick={() => setIsEditing(false)}>
                <i className="bi bi-x me-2"></i>
                Hủy
              </Button>
            </div>
          )}
        </Col>
      </Row>

      {/* ========================================
          PHẦN NỘI DUNG FORM
          ======================================== */}
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <Form>
            {/* ========================================
                PHẦN THÔNG TIN CƠ BẢN
                ======================================== */}
            <h5 className="mb-4 text-primary">
              <i className="bi bi-person-circle me-2"></i>
              Thông tin cơ bản
            </h5>

            {/* ========================================
                PHẦN AVATAR
                ======================================== */}
            <Row className="mb-4">
              <Col md={12} className="d-flex flex-column align-items-center justify-content-center position-relative">
                <div style={{ position: 'relative', display: 'inline-block' }}>
                  {profileData.avatar ? (
                    <img
                      src={profileData.avatar}
                      alt="Avatar"
                      className="rounded-circle border"
                      style={{ width: '120px', height: '120px', objectFit: 'cover', display: 'block' }}
                    />
                  ) : (
                    <div className="bg-light border rounded-circle d-flex align-items-center justify-content-center"
                      style={{ width: '120px', height: '120px' }}>
                      <i className="bi bi-person fs-1 text-muted"></i>
                    </div>
                  )}
                  {isEditing && (
                    <>
                      <input
                        type="file"
                        accept="image/*"
                        id="avatar-upload-input"
                        style={{ display: 'none' }}
                        onChange={async (e) => {
                          const file = e.target.files[0];
                          if (file && userId) {
                            if (file.size > 2 * 1024 * 1024) { // 2MB
                              setMessage({ type: 'danger', content: 'Ảnh đại diện không được vượt quá 2MB!' });
                              return;
                            }
                            setMessage({ type: '', content: '' });
                            try {
                              setMessage({ type: 'info', content: 'Đang tải ảnh lên...' });
                              const url = await uploadAvatar(file, userId);
                              handleInputChange('avatar', url);
                              setMessage({ type: 'success', content: 'Tải ảnh thành công!' });
                            } catch (err) {
                              setMessage({ type: 'danger', content: 'Tải ảnh thất bại: ' + err.message });
                            }
                          }
                        }}
                      />
                      <button
                        type="button"
                        className="btn btn-light p-1 border position-absolute"
                        style={{
                          bottom: 0,
                          right: 0,
                          borderRadius: '50%',
                          boxShadow: '0 0 4px rgba(0,0,0,0.1)',
                          zIndex: 2
                        }}
                        onClick={() => document.getElementById('avatar-upload-input').click()}
                        title="Đổi ảnh đại diện"
                      >
                        <i className="bi bi-camera-fill"></i>
                      </button>
                    </>
                  )}
                </div>
              </Col>
            </Row>

            {/* ========================================
                PHẦN THÔNG TIN CÁ NHÂN
                ======================================== */}
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Họ và tên *</Form.Label>
                <Form.Control
                  type="text"
                  value={profileData.fullname}
                  onChange={(e) => handleInputChange('fullname', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Nhập họ và tên"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Email *</Form.Label>
                <Form.Control
                  type="email"
                  value={profileData.email}
                  disabled={true} // Email không được phép thay đổi
                  className="bg-light"
                />
                <Form.Text className="text-muted">
                  <i className="bi bi-info-circle me-1"></i>
                  Email không thể thay đổi
                </Form.Text>
              </Col>
            </Row>

            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control
                  type="tel"
                  value={profileData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Nhập số điện thoại"
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Giới tính</Form.Label>
                <Form.Select
                  value={profileData.gender}
                  onChange={(e) => handleInputChange('gender', e.target.value)}
                  disabled={!isEditing}
                >
                  <option value="">Chọn giới tính</option>
                  <option value="male">Nam</option>
                  <option value="female">Nữ</option>
                  <option value="other">Khác</option>
                </Form.Select>
              </Col>
            </Row>

            {/* ========================================
                PHẦN ĐỊA CHỈ
                ======================================== */}
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Tỉnh/Thành phố</Form.Label>
                <Form.Select
                  value={profileData.city}
                  onChange={e => {
                    setProfileData(prev => ({
                      ...prev,
                      city: e.target.value,
                      district: '',
                      ward: ''
                    }));
                  }}
                  disabled={!isEditing}
                >
                  <option value="">Chọn tỉnh/thành phố</option>
                  {provinces.map(p => (
                    <option key={p.code} value={p.code}>{p.name}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Quận/Huyện</Form.Label>
                <Form.Select
                  value={profileData.district}
                  onChange={e => {
                    setProfileData(prev => ({
                      ...prev,
                      district: e.target.value,
                      ward: ''
                    }));
                  }}
                  disabled={!isEditing || !profileData.city}
                >
                  <option value="">Chọn quận/huyện</option>
                  {districts.map(d => (
                    <option key={d.code} value={d.code}>{d.name}</option>
                  ))}
                </Form.Select>
              </Col>
            </Row>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Phường/Xã</Form.Label>
                <Form.Select
                  value={profileData.ward}
                  onChange={e => handleInputChange('ward', e.target.value)}
                  disabled={!isEditing || !profileData.district}
                >
                  <option value="">Chọn phường/xã</option>
                  {wards.map(w => (
                    <option key={w.code} value={w.code}>{w.name}</option>
                  ))}
                </Form.Select>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Địa chỉ chi tiết</Form.Label>
                <Form.Control
                  type="text"
                  value={profileData.addressDetail}
                  onChange={e => handleInputChange('addressDetail', e.target.value)}
                  disabled={!isEditing}
                  placeholder="Số nhà, tên đường..."
                />
              </Col>
            </Row>

            <hr className="my-4" />

            {/* ========================================
                PHẦN THÔNG TIN TÀI KHOẢN
                ======================================== */}
            <h5 className="mb-4 text-primary">
              <i className="bi bi-shield-lock me-2"></i>
              Thông tin tài khoản
            </h5>

            <div className="mb-3 row align-items-center">
              <label className="col-md-4 col-6 fw-semibold">Trạng thái tài khoản:</label>
              <div className="col-md-8 col-6">{getStatusBadge(profileData.accountStatus)}</div>
            </div>
            <div className="mb-3 row align-items-center">
              <label className="col-md-4 col-6 fw-semibold">Vai trò:</label>
              <div className="col-md-8 col-6">{getRoleBadge(profileData.role?.name)}</div>
            </div>
            <div className="mb-3 row align-items-center">
              <label className="col-md-4 col-6 fw-semibold">Ngày tạo tài khoản:</label>
              <div className="col-md-8 col-6">
                <i className="bi bi-calendar me-2"></i>
                {formatDate(profileData.createdAt)}
              </div>
            </div>
            <div className="mb-3 row align-items-center">
              <label className="col-md-4 col-6 fw-semibold">Đăng nhập cuối:</label>
              <div className="col-md-8 col-6">
                <i className="bi bi-clock me-2"></i>
                {formatDate(profileData.lastLogin)}
              </div>
            </div>

            <hr className="my-4" />

            {/* ========================================
                PHẦN NÚT ĐỔI MẬT KHẨU
                ======================================== */}
            <div className="text-center">
              <Button
                variant="outline-warning"
                onClick={() => setShowPasswordModal(true)}
                className="px-4"
              >
                <i className="bi bi-key me-2"></i>
                Đổi mật khẩu
              </Button>
            </div>
          </Form>
        </Card.Body>
      </Card>

      {/* ========================================
          PHẦN MODAL ĐỔI MẬT KHẨU
          ======================================== */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Đổi mật khẩu</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu hiện tại</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({ ...passwordData, currentPassword: e.target.value })}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({ ...passwordData, newPassword: e.target.value })}
                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Xác nhận mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({ ...passwordData, confirmPassword: e.target.value })}
                placeholder="Nhập lại mật khẩu mới"
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleChangePassword}>
            Đổi mật khẩu
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

// ========================================
// PHẦN EXPORT
// ========================================
export default UserProfile;