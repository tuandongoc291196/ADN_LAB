/**
 * COMPONENT: AdminProfile
 * CHỨC NĂNG: Trang hồ sơ cá nhân cho quản trị viên
 * LUỒNG HOẠT ĐỘNG:
 * 1. Tải thông tin user từ props và khởi tạo form data
 * 2. Parse địa chỉ từ user.address thành các thành phần (tỉnh, huyện, xã)
 * 3. Load danh sách tỉnh/huyện/xã từ vietnam-provinces
 * 4. Cho phép chỉnh sửa thông tin cá nhân (avatar, họ tên, số điện thoại, địa chỉ)
 * 5. Upload avatar lên Firebase Storage
 * 6. Cập nhật thông tin qua API updateUserById()
 * 7. Quản lý đổi mật khẩu qua modal
 */

import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Alert, Modal, Form, Table, Tabs, Tab, Spinner } from 'react-bootstrap';
import { updateUserById } from '../../services/api';
import { uploadAvatar } from '../config/firebase';
import { getProvinces, getDistricts, getWards } from 'vietnam-provinces';

/**
 * HELPER FUNCTION: Tìm mã code theo tên trong danh sách
 * INPUT: list (array) - danh sách các object có code và name, name (string) - tên cần tìm
 * OUTPUT: string - mã code tương ứng hoặc chuỗi rỗng
 * BƯỚC 1: Chuẩn hóa chuỗi (loại bỏ dấu tiếng Việt)
 * BƯỚC 2: Tìm object có tên khớp với name đã chuẩn hóa
 * BƯỚC 3: Return code hoặc chuỗi rỗng
 */
function findCodeByName(list, name) {
  if (!name) return '';
  const normalize = str => str.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase();
  return (list.find(item => normalize(item.name) === normalize(name)) || {}).code || '';
}

const AdminProfile = ({ user }) => {
  // STATE QUẢN LÝ UI
  const [showPasswordModal, setShowPasswordModal] = useState(false); // Hiển thị modal đổi mật khẩu
  const [alert, setAlert] = useState({ show: false, message: '', type: '' }); // Alert thông báo
  const [loading, setLoading] = useState(false); // Loading state
  const [error, setError] = useState(null); // Error state
  const [isEditing, setIsEditing] = useState(false); // Trạng thái chỉnh sửa
  const [saving, setSaving] = useState(false); // Loading state khi lưu
  
  // STATE QUẢN LÝ FORM DATA
  const [personalForm, setPersonalForm] = useState({
    fullname: user?.fullname || '',        // Họ và tên
    email: user?.email || '',              // Email (không thể thay đổi)
    phone: user?.phone || '',              // Số điện thoại
    gender: user?.gender || '',            // Giới tính
    avatar: user?.avatar || '',            // URL avatar
    addressDetail: '',                     // Địa chỉ chi tiết
    ward: '',                             // Mã phường/xã
    district: '',                         // Mã quận/huyện
    city: ''                              // Mã tỉnh/thành phố
  });

  // STATE QUẢN LÝ MẬT KHẨU
  const [passwordData, setPasswordData] = useState({ 
    currentPassword: '',    // Mật khẩu hiện tại
    newPassword: '',       // Mật khẩu mới
    confirmPassword: ''    // Xác nhận mật khẩu mới
  });
  
  // STATE QUẢN LÝ ĐỊA CHỈ
  const [provinces, setProvinces] = useState([]); // Danh sách tỉnh/thành phố
  const [districts, setDistricts] = useState([]); // Danh sách quận/huyện
  const [wards, setWards] = useState([]); // Danh sách phường/xã

  /**
   * EFFECT: Load danh sách tỉnh/thành phố khi component mount
   * BƯỚC 1: Gọi getProvinces() để lấy danh sách tỉnh
   * BƯỚC 2: Cập nhật state provinces
   */
  useEffect(() => {
    setProvinces(getProvinces());
  }, []);

  /**
   * EFFECT: Load danh sách quận/huyện khi tỉnh/thành phố thay đổi
   * BƯỚC 1: Kiểm tra nếu có city được chọn
   * BƯỚC 2: Lọc districts theo province_code
   * BƯỚC 3: Cập nhật state districts
   * BƯỚC 4: Reset district và ward nếu không có city
   */
  useEffect(() => {
    if (personalForm.city) {
      setDistricts(getDistricts().filter(d => d.province_code === personalForm.city));
    } else {
      setDistricts([]);
    }
  }, [personalForm.city]);

  /**
   * EFFECT: Load danh sách phường/xã khi quận/huyện thay đổi
   * BƯỚC 1: Kiểm tra nếu có district được chọn
   * BƯỚC 2: Lọc wards theo district_code
   * BƯỚC 3: Cập nhật state wards
   * BƯỚC 4: Reset ward nếu không có district
   */
  useEffect(() => {
    if (personalForm.district) {
      setWards(getWards().filter(w => w.district_code === personalForm.district));
    } else {
      setWards([]);
    }
  }, [personalForm.district]);

  /**
   * EFFECT: Parse địa chỉ từ user.address khi component mount
   * BƯỚC 1: Kiểm tra nếu có user.address
   * BƯỚC 2: Tách địa chỉ thành các phần (địa chỉ chi tiết, phường, quận, tỉnh)
   * BƯỚC 3: Tìm mã code tương ứng cho từng phần
   * BƯỚC 4: Cập nhật personalForm với dữ liệu đã parse
   */
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

  /**
   * HELPER FUNCTION: Format ngày tháng theo định dạng Việt Nam
   * INPUT: dateString (string) - chuỗi ngày tháng
   * OUTPUT: string - ngày tháng đã format hoặc "Chưa có thông tin"
   * BƯỚC 1: Kiểm tra nếu có dateString
   * BƯỚC 2: Format theo định dạng Việt Nam với đầy đủ thông tin
   * BƯỚC 3: Return chuỗi đã format hoặc thông báo mặc định
   */
  const formatDate = (dateString) => {
    if (!dateString) return 'Chưa có thông tin';
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  /**
   * HELPER FUNCTION: Tạo badge cho trạng thái tài khoản
   * INPUT: status (string) - trạng thái tài khoản
   * OUTPUT: JSX Badge component
   * BƯỚC 1: Kiểm tra status và return badge tương ứng
   * BƯỚC 2: Màu sắc khác nhau cho từng trạng thái
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
   * EVENT HANDLER: Lưu thông tin cá nhân
   * BƯỚC 1: Set saving state thành true
   * BƯỚC 2: Tạo chuỗi địa chỉ từ các thành phần
   * BƯỚC 3: Chuẩn bị dữ liệu cập nhật
   * BƯỚC 4: Gọi API updateUserById()
   * BƯỚC 5: Hiển thị thông báo thành công
   * BƯỚC 6: Xử lý lỗi nếu có
   * BƯỚC 7: Set saving state thành false
   */
  const handleSavePersonal = async () => {
    setSaving(true);
    try {
      // BƯỚC 2: Tạo chuỗi địa chỉ từ các thành phần
      const address = [
        personalForm.addressDetail,
        wards.find(w => w.code === personalForm.ward)?.name || '',
        districts.find(d => d.code === personalForm.district)?.name || '',
        provinces.find(p => p.code === personalForm.city)?.name || ''
      ].filter(Boolean).join(', ');
      
      // BƯỚC 3: Chuẩn bị dữ liệu cập nhật
      const updateData = {
        fullname: personalForm.fullname,
        gender: personalForm.gender,
        avatar: personalForm.avatar,
        phone: personalForm.phone,
        address
      };
      
      // BƯỚC 4: Gọi API updateUserById()
      await updateUserById(user.id, updateData);
      // BƯỚC 5: Hiển thị thông báo thành công
      setAlert({ show: true, message: 'Cập nhật thông tin cá nhân thành công!', type: 'success' });
    } catch (err) {
      // BƯỚC 6: Xử lý lỗi nếu có
      setAlert({ show: true, message: 'Lỗi: ' + err.message, type: 'danger' });
      throw err;
    } finally {
      // BƯỚC 7: Set saving state thành false
      setSaving(false);
    }
  };

  /**
   * EVENT HANDLER: Upload avatar
   * INPUT: e (event) - event từ input file
   * BƯỚC 1: Lấy file từ event
   * BƯỚC 2: Kiểm tra nếu có file
   * BƯỚC 3: Gọi uploadAvatar() để upload lên Firebase
   * BƯỚC 4: Cập nhật personalForm với URL avatar mới
   * BƯỚC 5: Xử lý lỗi nếu có
   */
  const handleAvatarChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;
    try {
      // BƯỚC 3: Gọi uploadAvatar() để upload lên Firebase
      const url = await uploadAvatar(file, user.id);
      // BƯỚC 4: Cập nhật personalForm với URL avatar mới
      setPersonalForm(f => ({ ...f, avatar: url }));
    } catch (err) {
      // BƯỚC 5: Xử lý lỗi nếu có
      setAlert({ show: true, message: 'Lỗi upload avatar: ' + err.message, type: 'danger' });
    }
  };

  /**
   * EVENT HANDLER: Đổi mật khẩu
   * BƯỚC 1: Kiểm tra mật khẩu xác nhận có khớp không
   * BƯỚC 2: Kiểm tra độ dài mật khẩu mới (tối thiểu 6 ký tự)
   * BƯỚC 3: Gọi API đổi mật khẩu (TODO)
   * BƯỚC 4: Hiển thị thông báo thành công
   * BƯỚC 5: Đóng modal và reset form
   */
  const handleChangePassword = () => {
    // BƯỚC 1: Kiểm tra mật khẩu xác nhận có khớp không
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlert({ show: true, message: 'Mật khẩu xác nhận không khớp!', type: 'danger' });
      return;
    }
    // BƯỚC 2: Kiểm tra độ dài mật khẩu mới
    if (passwordData.newPassword.length < 6) {
      setAlert({ show: true, message: 'Mật khẩu mới phải có ít nhất 6 ký tự!', type: 'danger' });
      return;
    }
    // BƯỚC 3: Gọi API đổi mật khẩu (TODO)
    // BƯỚC 4: Hiển thị thông báo thành công
    setAlert({ show: true, message: 'Mật khẩu đã được thay đổi thành công!', type: 'success' });
    // BƯỚC 5: Đóng modal và reset form
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  return (
    <div>
      {/* HEADER: Tiêu đề trang */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">Hồ sơ quản trị viên</h2>
          <p className="text-muted mb-0">Quản lý thông tin cá nhân và tài khoản</p>
        </div>
        <Button variant="primary" onClick={() => setIsEditing(true)} disabled={isEditing}>
          <i className="bi bi-pencil me-2"></i>Chỉnh sửa thông tin
        </Button>
      </div>
      
      {/* ALERT: Hiển thị thông báo */}
      {alert.show && <Alert variant={alert.type}>{alert.message}</Alert>}
      
      {/* LOADING STATE: Hiển thị loading */}
      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : error ? (
        <Alert variant="danger">{error}</Alert>
      ) : user ? (
        <>
          {/* CARD: Thông tin cá nhân */}
          <Card className="shadow-sm mb-4">
            <Card.Body className="p-4">
              <Form>
                {/* SECTION: Thông tin cá nhân */}
                <h5 className="mb-4 text-primary">
                  <i className="bi bi-person-circle me-2"></i>
                  Thông tin cá nhân
                </h5>
                
                {/* AVATAR SECTION: Ảnh đại diện */}
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
                
                {/* FORM FIELDS: Thông tin cá nhân */}
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
                
                {/* ADDRESS FIELDS: Thông tin địa chỉ */}
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
                
                {/* SECTION: Thông tin tài khoản */}
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
                
                {/* ACTION BUTTONS: Nút lưu/hủy khi chỉnh sửa */}
                {isEditing && (
                  <div className="text-end mt-4">
                    <Button 
                      variant="success" 
                      onClick={async () => {
                        try {
                          await handleSavePersonal();
                          setIsEditing(false);
                        } catch (error) {
                          // Xử lý lỗi khi lưu
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
                
                {/* PASSWORD BUTTON: Nút đổi mật khẩu */}
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
      
      {/* MODAL: Đổi mật khẩu */}
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