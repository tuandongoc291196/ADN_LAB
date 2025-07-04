import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Alert, Modal, Form, Table, Tabs, Tab, Spinner } from 'react-bootstrap';
import { getStaffById, updateStaff, updateUserById } from '../../services/api';
import { uploadAvatar } from '../config/firebase';
import { getProvinces, getDistricts, getWards } from 'vietnam-provinces';

function findCodeByName(list, name) {
  if (!name) return '';
  const normalize = str => str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  return (list.find(item => normalize(item.name) === normalize(name)) || {}).code || '';
}

const StaffProfile = ({ user }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [activeEditTab, setActiveEditTab] = useState('personal');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [staffInfo, setStaffInfo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  // Form states
  const [personalForm, setPersonalForm] = useState({});
  const [workForm, setWorkForm] = useState({ specification: '', certifications: '' });
  const [savingPersonal, setSavingPersonal] = useState(false);
  const [savingWork, setSavingWork] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' });
  // Địa chỉ
  const [provinces, setProvinces] = useState([]);
  const [districts, setDistricts] = useState([]);
  const [wards, setWards] = useState([]);
  const [isEditing, setIsEditing] = useState(false);

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

  const fetchStaff = async () => {
    setLoading(true);
    try {
      const staffId = user?.staffId || user?.id;
      if (!staffId) {
        setError('Không tìm thấy staffId.');
        setLoading(false);
        return;
      }
      const data = await getStaffById(staffId);
      setStaffInfo(data);
      // Địa chỉ tách nhỏ giống UserProfile
      let addressDetail = '', ward = '', district = '', city = '';
      if (data.user?.address) {
        const parts = data.user.address.split(',').map(s => s.trim());
        if (parts.length === 4) {
          addressDetail = parts[0];
          const cityCode = findCodeByName(getProvinces(), parts[3]);
          const districtCode = findCodeByName(getDistricts().filter(d => d.province_code === cityCode), parts[2]);
          const wardCode = findCodeByName(getWards().filter(w => w.district_code === districtCode), parts[1]);
          city = cityCode;
          district = districtCode;
          ward = wardCode;
        } else {
          addressDetail = data.user.address;
          ward = '';
          district = '';
          city = '';
        }
      }
      setPersonalForm({
        fullname: data.user?.fullname || '',
        email: data.user?.email || '',
        phone: data.user?.phone || '',
        gender: data.user?.gender || '',
        avatar: data.user?.avatar || '',
        addressDetail,
        ward,
        district,
        city
      });
      setWorkForm({
        specification: Array.isArray(data.specification) ? data.specification.join(', ') : (data.specification || ''),
        certifications: Array.isArray(data.certifications) ? data.certifications.join(', ') : (data.certifications || ''),
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, [user]);

  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có thông tin';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const userInfo = staffInfo?.user || {};

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
    setSavingPersonal(true);
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
        address,
        birthday: personalForm.birthday
      };
      await updateUserById(userInfo.id, updateData);
      setAlert({ show: true, message: 'Cập nhật thông tin cá nhân thành công!', type: 'success' });
      setIsEditing(false);
      await fetchStaff();
    } catch (err) {
      setAlert({ show: true, message: 'Lỗi: ' + err.message, type: 'danger' });
    } finally {
      setSavingPersonal(false);
    }
  };

  // Handler cập nhật thông tin công việc
  const handleSaveWork = async () => {
    setSavingWork(true);
    try {
      const staffId = staffInfo.id;
      const specificationArr = workForm.specification
        ? workForm.specification.split(',').map(s => s.trim()).filter(Boolean)
        : [];
      const certificationsArr = workForm.certifications
        ? workForm.certifications.split(',').map(c => c.trim()).filter(Boolean)
        : [];
      await updateStaff({
        staffId,
        specification: specificationArr,
        certifications: certificationsArr,
      });
      setAlert({ show: true, message: 'Cập nhật thông tin công việc thành công!', type: 'success' });
      setIsEditing(false);
      await fetchStaff();
    } catch (err) {
      setAlert({ show: true, message: 'Lỗi: ' + err.message, type: 'danger' });
    } finally {
      setSavingWork(false);
    }
  };

  // Handler upload avatar
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      const url = await uploadAvatar(file, userInfo.id);
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
      {/* Header giống các menu Staff */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Hồ sơ nhân viên</h2>
          <p className="text-muted mb-0">Quản lý thông tin cá nhân và công việc</p>
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
      ) : staffInfo ? (
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
                {/* Thông tin công việc */}
                <h5 className="mb-4 text-primary">
                  <i className="bi bi-briefcase me-2"></i>
                  Thông tin công việc
                </h5>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Vị trí</Form.Label>
                    <Form.Control
                      type="text"
                      value={staffInfo.position?.name || ''}
                      disabled
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Ngày vào làm</Form.Label>
                    <Form.Control
                      type="text"
                      value={formatDate(staffInfo.hireDate)}
                      disabled
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Chuyên môn</Form.Label>
                    <Form.Control
                      type="text"
                      value={workForm.specification}
                      onChange={e => setWorkForm(f => ({ ...f, specification: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Nhập các chuyên môn, cách nhau bởi dấu phẩy"
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Chứng chỉ</Form.Label>
                    <Form.Control
                      type="text"
                      value={workForm.certifications}
                      onChange={e => setWorkForm(f => ({ ...f, certifications: e.target.value }))}
                      disabled={!isEditing}
                      placeholder="Nhập các chứng chỉ, cách nhau bởi dấu phẩy"
                    />
                  </Col>
                </Row>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Ngày tạo bản ghi</Form.Label>
                    <Form.Control
                      type="text"
                      value={formatDate(staffInfo.createdAt)}
                      disabled
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Ngày cập nhật</Form.Label>
                    <Form.Control
                      type="text"
                      value={formatDate(staffInfo.updatedAt)}
                      disabled
                    />
                  </Col>
                </Row>
                {/* Nút lưu/hủy khi chỉnh sửa */}
                {isEditing && (
                  <div className="text-end mt-4">
                    <Button variant="success" onClick={handleSavePersonal} className="me-2" disabled={savingPersonal}>
                      {savingPersonal ? 'Đang lưu...' : 'Lưu thay đổi'}
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
              <Form.Control type="password" value={passwordData.currentPassword} onChange={e => setPasswordData(f => ({ ...f, currentPassword: e.target.value }))} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control type="password" value={passwordData.newPassword} onChange={e => setPasswordData(f => ({ ...f, newPassword: e.target.value }))} />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Nhập lại mật khẩu mới</Form.Label>
              <Form.Control type="password" value={passwordData.confirmPassword} onChange={e => setPasswordData(f => ({ ...f, confirmPassword: e.target.value }))} />
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

export default StaffProfile;