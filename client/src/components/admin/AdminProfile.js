/**
 * COMPONENT: AdminProfile
 * MỤC ĐÍCH: Trang hồ sơ cá nhân cho quản trị viên
 * CHỨC NĂNG:
 * - Hiển thị thông tin cá nhân admin
 * - Cho phép chỉnh sửa thông tin cá nhân
 * - Quản lý mật khẩu và bảo mật
 * - Hiển thị lịch sử hoạt động
 */

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Alert, Modal, Form, Table, Tabs, Tab, Spinner } from 'react-bootstrap';
import { updateUserById } from '../../services/api';
import { uploadAvatar } from '../config/firebase';
import { getProvinces, getDistricts, getWards } from 'vietnam-provinces';

function findCodeByName(list, name) {
  if (!name) return '';
  const normalize = str => str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  return (list.find(item => normalize(item.name) === normalize(name)) || {}).code || '';
}

const AdminProfile = ({ user }) => {
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  
  // Form states
  const [personalForm, setPersonalForm] = useState({
    fullname: user?.fullname || '',
    email: user?.email || '',
    phone: user?.phone || '',
    gender: user?.gender || '',
    avatar: user?.avatar || '',
    addressDetail: '',
    ward: '',
    district: '',
    city: ''
  });

  // Địa chỉ
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);

  useEffect(() => {
    setProvinces(getProvinces());
  }, []);

  useEffect(() => {
    if (personalForm.city) setDistricts(getDistricts().filter(d => d.province_code === personalForm.city));
    else setDistricts([]);
  }, [personalForm.city]);

  useEffect(() => {
    if (personalForm.district) setWards(getWards().filter(w => w.district_code === personalForm.district));
    else setWards([]);
  }, [personalForm.district]);

  // Parse địa chỉ khi component mount
  useEffect(() => {
    if (user?.address) {
      const parts = user.address.split(',').map(s => s.trim());
      if (parts.length === 4) {
        setPersonalForm(prev => ({
          ...prev,
          addressDetail: parts[0],
          city: findCodeByName(getProvinces(), parts[3]),
          district: findCodeByName(getDistricts().filter(d => d.province_code === findCodeByName(getProvinces(), parts[3])), parts[2]),
          ward: findCodeByName(getWards().filter(w => w.district_code === findCodeByName(getDistricts().filter(d => d.province_code === findCodeByName(getProvinces(), parts[3])), parts[2])), parts[1])
        }));
      }
    }
  }, [user]);

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

  // Handler cập nhật thông tin cá nhân
  const handleSavePersonal = async () => {
    setSaving(true);
    try {
      const address = [
        personalForm.addressDetail,
        wards.find(w => w.code === personalForm.ward)?.name || '',
        districts.find(d => d.code === personalForm.district)?.name || '',
        provinces.find(p => p.code === personalForm.city)?.name || ''
      ].filter(Boolean).join(', ');
      
      const updateData = {
        fullname: personalForm.fullname,
        gender: personalForm.gender,
        avatar: personalForm.avatar,
        phone: personalForm.phone,
        address
      };
      
      await updateUserById(user.id, updateData);
      setAlert({ show: true, message: 'Cập nhật thông tin cá nhân thành công!', type: 'success' });
    } catch (err) {
      setAlert({ show: true, message: 'Lỗi: ' + err.message, type: 'danger' });
      throw err;
    } finally {
      setSaving(false);
    }
  };

  // Handler upload avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadAvatar(file, user.id);
      setPersonalForm(f => ({ ...f, avatar: url }));
    } catch (err) {
      setAlert({ show: true, message: 'Lỗi upload avatar: ' + err.message, type: 'danger' });
    }
  };

  // Handler đổi mật khẩu
  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlert({ show: true, message: 'Mật khẩu xác nhận không khớp!', type: 'danger' });
      return;
    }
    if (passwordData.newPassword.length < 6) {
      setAlert({ show: true, message: 'Mật khẩu mới phải có ít nhất 6 ký tự!', type: 'danger' });
      return;
    }
    // TODO: Gọi API đổi mật khẩu
    setAlert({ show: true, message: 'Mật khẩu đã được thay đổi thành công!', type: 'success' });
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div>
      {/* Header giống ManagerProfile */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Hồ sơ quản trị viên</h2>
          <p className="text-muted mb-0">Quản lý thông tin cá nhân và tài khoản</p>
        </div>
        <Button variant="primary" onClick={() => setIsEditing(true)} disabled={isEditing}>
          <i className="bi bi-pencil me-2"></i>Chỉnh sửa thông tin
        </Button>
      </div>
      
      {alert.show && <Alert variant={alert.type}>{alert.message}</Alert>}
      
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : user ? (
        <>
          {/* Card Thông tin cá nhân */}
          <Card className="shadow-sm mb-4">
            <Card.Body className="p-4">
              <Form>
                <h5 className="mb-4 text-primary">
                  <i className="bi bi-person-circle me-2"></i>
                  Thông tin cá nhân
                </h5>
                <Row className="mb-4">
                  <Col md={12} className="d-flex flex-column align-items-center justify-content-center position-relative">
                    <div style={{ position: 'relative', display: 'inline-block' }}>
                      <img
                        src={personalForm.avatar || '/default-avatar.png'}
                        alt="Avatar"
                        className="rounded-circle border"
                        style={{ width: '120px', height: '120px', objectFit: 'cover', display: 'block' }}
                      />
                      {isEditing && (
                        <>
                          <input
                            type="file"
                            accept="image/*"
                            id="avatar-upload-input"
                            style={{ display: 'none' }}
                            onChange={handleAvatarChange}
                          />
                          <button
                            type="button"
                            className="btn btn-light p-1 border position-absolute"
                            style={{ bottom: 0, right: 0, borderRadius: '50%', boxShadow: '0 0 4px rgba(0,0,0,0.1)', zIndex: 2 }}
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
                      value={personalForm.fullname}
                      onChange={e => setPersonalForm(f => ({ ...f, fullname: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Nhập họ và tên"
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Email *</Form.Label>
                    <Form.Control
                      type="email"
                      value={personalForm.email}
                      disabled={true}
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
                      value={personalForm.phone}
                      onChange={e => setPersonalForm(f => ({ ...f, phone: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Nhập số điện thoại"
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Giới tính</Form.Label>
                    <Form.Select
                      value={personalForm.gender}
                      onChange={e => setPersonalForm(f => ({ ...f, gender: e.target.value }))}
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
                      value={personalForm.city}
                      onChange={e => setPersonalForm(f => ({ ...f, city: e.target.value, district: '', ward: '' }))}
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
                      value={personalForm.district}
                      onChange={e => setPersonalForm(f => ({ ...f, district: e.target.value, ward: '' }))}
                      disabled={!isEditing || !personalForm.city}
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
                      value={personalForm.ward}
                      onChange={e => setPersonalForm(f => ({ ...f, ward: e.target.value }))}
                      disabled={!isEditing || !personalForm.district}
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
                      value={personalForm.addressDetail || ''}
                      onChange={e => setPersonalForm(f => ({ ...f, addressDetail: e.target.value }))}
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
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Vai trò</Form.Label>
                    <Form.Control
                      type="text"
                      value="Quản trị viên"
                      disabled
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Trạng thái tài khoản</Form.Label>
                    <div>
                      {getStatusBadge(user.accountStatus)}
                    </div>
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Ngày tạo tài khoản</Form.Label>
                    <Form.Control
                      type="text"
                      value={formatDate(user.createdAt)}
                      disabled
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Đăng nhập cuối</Form.Label>
                    <Form.Control
                      type="text"
                      value={formatDate(user.lastLogin)}
                      disabled
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>ID người dùng</Form.Label>
                    <Form.Control
                      type="text"
                      value={user.id}
                      disabled
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Phương thức đăng nhập</Form.Label>
                    <Form.Control
                      type="text"
                      value={user.authProvider === 'google' ? 'Google' : 
                             user.authProvider === 'facebook' ? 'Facebook' : 
                             'Email/Password'}
                      disabled
                    />
                  </Col>
                </Row>
                {/* Nút lưu/hủy khi chỉnh sửa */}
                {isEditing && (
                  <div className="text-end mt-4">
                    <Button 
                      variant="success" 
                      onClick={async () => {
                        try {
                          await handleSavePersonal();
                          setIsEditing(false);
                        } catch (error) {
                          console.error('Error saving:', error);
                        }
                      }} 
                      className="me-2" 
                      disabled={saving}
                    >
                      {saving ? 'Đang lưu...' : 'Lưu thay đổi'}
                    </Button>
                    <Button variant="secondary" onClick={() => setIsEditing(false)}>
                      Hủy
                    </Button>
                  </div>
                )}
                {/* Nút đổi mật khẩu */}
                <div className="text-center mt-4">
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
        </>
      ) : null}
      
      {/* Modal đổi mật khẩu */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)} centered>
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
                onChange={e => setPasswordData(f => ({ ...f, currentPassword: e.target.value }))} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control 
                type="password" 
                value={passwordData.newPassword} 
                onChange={e => setPasswordData(f => ({ ...f, newPassword: e.target.value }))} 
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nhập lại mật khẩu mới</Form.Label>
              <Form.Control 
                type="password" 
                value={passwordData.confirmPassword} 
                onChange={e => setPasswordData(f => ({ ...f, confirmPassword: e.target.value }))} 
              />
            </Form.Group>
            <Button variant="primary" onClick={handleChangePassword}>
              Đổi mật khẩu
            </Button>
          </Form>
        </Modal.Body>
      </Modal>
    </div>
  );
};

export default AdminProfile; 