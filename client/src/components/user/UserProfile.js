import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { getUserById, updateUserById } from '../../services/api';
import { Row, Col, Card, Button, Form, Alert, Modal, Badge } from 'react-bootstrap';
import { uploadAvatar } from '../config/firebase';
import { getProvinces, getDistricts, getWards } from 'vietnam-provinces';

const UserProfile = ({ user }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });
  const [loading, setLoading] = useState(true);
  const [profileData, setProfileData] = useState({
    fullname: '',
    email: '',
    phone: '',
    gender: '',
    avatar: '',
    accountStatus: '',
    role: { name: '', description: '' },
    createdAt: '',
    lastLogin: '',
    addressDetail: '',
    ward: '',
    district: '',
    city: '',
    address: ''
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Lấy userId từ props user hoặc localStorage
  const userId = user?.id || user?.user_id || user?.uid || JSON.parse(localStorage.getItem('userData'))?.user_id || '';

  // Fetch user info từ API và điền vào form
  useEffect(() => {
    const fetchUserData = async () => {
      if (userId) {
        try {
          setLoading(true);
          const data = await getUserById(userId);
          if (data) {
            // Xử lý địa chỉ an toàn
            let addressDetail = '', ward = '', district = '', city = '';
            if (data.address) {
              const parts = data.address.split(',').map(s => s.trim());
              if (parts.length === 4) {
                addressDetail = parts[0];
                // Không tự động map tên sang code, để user chọn lại
                ward = '';
                district = '';
                city = '';
              } else {
                // Địa chỉ không đúng chuẩn, chỉ điền vào chi tiết
                addressDetail = data.address;
                ward = '';
                district = '';
                city = '';
              }
            }
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
          setMessage({ type: 'danger', content: 'Không thể tải thông tin người dùng' });
        } finally {
          setLoading(false);
        }
      } else {
        setLoading(false);
      }
    };
    fetchUserData();
  }, [userId]);

  const handleInputChange = (field, value) => {
    setProfileData({
      ...profileData,
      [field]: value
    });
  };

  const handleSaveProfile = async () => {
    const address = [
      profileData.addressDetail,
      wards.find(w => w.code === profileData.ward)?.name || '',
      districts.find(d => d.code === profileData.district)?.name || '',
      provinces.find(p => p.code === profileData.city)?.name || ''
    ].filter(Boolean).join(', ');
    const updateData = {
      fullname: profileData.fullname || "",
      gender: profileData.gender || "",
      avatar: profileData.avatar || "",
      phone: profileData.phone || "",
      address
    };

    try {
      await updateUserById(userId, updateData);
      setMessage({ type: 'success', content: 'Thông tin cá nhân đã được cập nhật thành công!' });
      setIsEditing(false);
    } catch (error) {
      setMessage({ type: 'danger', content: 'Cập nhật thất bại: ' + error.message });
    }
    setTimeout(() => setMessage({ type: '', content: '' }), 5000);
  };

  const handleChangePassword = () => {
    // Validate passwords
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setMessage({ type: 'danger', content: 'Mật khẩu xác nhận không khớp!' });
      return;
    }

    if (passwordData.newPassword.length < 6) {
      setMessage({ type: 'danger', content: 'Mật khẩu mới phải có ít nhất 6 ký tự!' });
      return;
    }

    // TODO: API call to change password
    console.log('Changing password');
    setMessage({ type: 'success', content: 'Mật khẩu đã được thay đổi thành công!' });
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setMessage({ type: '', content: '' }), 5000);
  };

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có thông tin';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

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

  // Dropdown data
  const provinces = getProvinces();
  const districts = profileData.city ? getDistricts().filter(d => d.province_code === profileData.city) : [];
  const wards = profileData.district ? getWards().filter(w => w.district_code === profileData.district) : [];

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

  return (
    <>
      {/* Header */}
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

      {/* Message Alert */}
      {message.content && (
        <Alert variant={message.type} className="mb-4" dismissible onClose={() => setMessage({ type: '', content: '' })}>
          <i className={`bi bi-${message.type === 'success' ? 'check-circle' : 'exclamation-circle'} me-2`}></i>
          {message.content}
        </Alert>
      )}

      {/* Mobile Edit Buttons */}
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

      {/* Profile Content */}
      <Card className="shadow-sm">
        <Card.Body className="p-4">
          <Form>
            {/* Thông tin cơ bản */}
            <h5 className="mb-4 text-primary">
              <i className="bi bi-person-circle me-2"></i>
              Thông tin cơ bản
            </h5>
            
            {/* Avatar Section - Centered */}
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

            {/* Thông tin tài khoản */}
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

            {/* Nút đổi mật khẩu */}
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

      {/* Change Password Modal */}
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

export default UserProfile;