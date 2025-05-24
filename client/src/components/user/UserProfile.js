import React, { useState } from 'react';
import { Row, Col, Card, Button, Form, Alert, Modal, Badge, Tab, Tabs } from 'react-bootstrap';

const UserProfile = ({ user }) => {
  const [activeTab, setActiveTab] = useState('personal');
  const [isEditing, setIsEditing] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  // User profile state
  const [profileData, setProfileData] = useState({
    // Personal Information
    fullName: user?.name || 'Nguyễn Văn A',
    email: user?.email || 'nguyenvana@example.com',
    phone: user?.phone || '0123456789',
    dateOfBirth: '1990-01-15',
    gender: 'male',
    idNumber: '001234567890',
    idIssueDate: '2015-01-10',
    idIssuePlace: 'Công an TP. Hà Nội',
    
    // Address Information
    address: '123 Đường ABC, Phường XYZ',
    ward: 'Phường Cầu Giấy',
    district: 'Quận Cầu Giấy',
    city: 'Hà Nội',
    postalCode: '100000',
    
    // Contact Information
    emergencyContact: 'Nguyễn Thị B',
    emergencyPhone: '0987654321',
    emergencyRelation: 'Vợ/Chồng',
    
    // Preferences
    language: 'vi',
    notifications: {
      email: true,
      sms: true,
      appointment: true,
      results: true,
      promotions: false
    },
    privacy: {
      shareData: false,
      marketing: false,
      analytics: true
    }
  });

  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Account statistics
  const accountStats = {
    memberSince: user?.memberSince || '2023-01-15',
    totalAppointments: user?.totalAppointments || 8,
    completedTests: user?.completedTests || 5,
    totalSpent: '28,500,000 VNĐ',
    loyaltyPoints: 2850,
    membershipLevel: 'Gold'
  };

  const handleInputChange = (section, field, value) => {
    if (section === 'notifications' || section === 'privacy') {
      setProfileData({
        ...profileData,
        [section]: {
          ...profileData[section],
          [field]: value
        }
      });
    } else {
      setProfileData({
        ...profileData,
        [field]: value
      });
    }
  };

  const handleSaveProfile = () => {
    // TODO: API call to save profile
    console.log('Saving profile:', profileData);
    setMessage({ type: 'success', content: 'Thông tin cá nhân đã được cập nhật thành công!' });
    setIsEditing(false);
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
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const getMembershipBadge = (level) => {
    switch (level) {
      case 'Gold':
        return <Badge bg="warning" text="dark">Gold Member</Badge>;
      case 'Silver':
        return <Badge bg="secondary">Silver Member</Badge>;
      case 'Bronze':
        return <Badge bg="warning">Bronze Member</Badge>;
      default:
        return <Badge bg="primary">Member</Badge>;
    }
  };

  return (
    <>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Hồ sơ cá nhân</h2>
              <p className="text-muted mb-0">Quản lý thông tin tài khoản và cài đặt</p>
            </div>
            <div>
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
          {message.content}
        </Alert>
      )}

      <Row>
        {/* Profile Summary Card */}
        <Col lg={4} className="mb-4">
          <Card className="shadow-sm">
            <Card.Header className="bg-primary text-white text-center py-4">
              <div className="mb-3">
                <div className="bg-white text-primary rounded-circle mx-auto d-flex align-items-center justify-content-center"
                     style={{ width: '100px', height: '100px' }}>
                  <i className="bi bi-person fs-1"></i>
                </div>
              </div>
              <h4 className="mb-1">{profileData.fullName}</h4>
              <p className="mb-2">{profileData.email}</p>
              {getMembershipBadge(accountStats.membershipLevel)}
            </Card.Header>
            <Card.Body>
              <div className="text-center mb-4">
                <h5 className="text-warning mb-0">{accountStats.loyaltyPoints}</h5>
                <small className="text-muted">Điểm tích lũy</small>
              </div>
              
              <div className="row text-center">
                <div className="col-4">
                  <div className="h6 mb-0 text-primary">{accountStats.totalAppointments}</div>
                  <small className="text-muted">Lịch hẹn</small>
                </div>
                <div className="col-4 border-start border-end">
                  <div className="h6 mb-0 text-success">{accountStats.completedTests}</div>
                  <small className="text-muted">Hoàn thành</small>
                </div>
                <div className="col-4">
                  <div className="h6 mb-0 text-info">5★</div>
                  <small className="text-muted">Đánh giá</small>
                </div>
              </div>
              
              <hr />
              
              <div className="small text-muted">
                <div className="mb-2">
                  <i className="bi bi-calendar me-2"></i>
                  Thành viên từ: {formatDate(accountStats.memberSince)}
                </div>
                <div className="mb-2">
                  <i className="bi bi-currency-dollar me-2"></i>
                  Tổng chi tiêu: {accountStats.totalSpent}
                </div>
                <div>
                  <i className="bi bi-phone me-2"></i>
                  {profileData.phone}
                </div>
              </div>
            </Card.Body>
            <Card.Footer className="bg-light">
              <div className="d-grid gap-2">
                <Button variant="outline-warning" size="sm">
                  <i className="bi bi-gift me-2"></i>
                  Đổi điểm thưởng
                </Button>
                <Button 
                  variant="outline-danger" 
                  size="sm"
                  onClick={() => setShowPasswordModal(true)}
                >
                  <i className="bi bi-key me-2"></i>
                  Đổi mật khẩu
                </Button>
              </div>
            </Card.Footer>
          </Card>
        </Col>

        {/* Main Profile Content */}
        <Col lg={8}>
          <Card className="shadow-sm">
            <Tabs
              activeKey={activeTab}
              onSelect={(k) => setActiveTab(k)}
              className="border-bottom"
            >
              {/* Personal Information Tab */}
              <Tab eventKey="personal" title={<><i className="bi bi-person me-2"></i>Thông tin cá nhân</>}>
                <Card.Body>
                  <Form>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label>Họ và tên *</Form.Label>
                        <Form.Control
                          type="text"
                          value={profileData.fullName}
                          onChange={(e) => handleInputChange('', 'fullName', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Email *</Form.Label>
                        <Form.Control
                          type="email"
                          value={profileData.email}
                          onChange={(e) => handleInputChange('', 'email', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label>Số điện thoại *</Form.Label>
                        <Form.Control
                          type="tel"
                          value={profileData.phone}
                          onChange={(e) => handleInputChange('', 'phone', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Ngày sinh</Form.Label>
                        <Form.Control
                          type="date"
                          value={profileData.dateOfBirth}
                          onChange={(e) => handleInputChange('', 'dateOfBirth', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label>Giới tính</Form.Label>
                        <Form.Select
                          value={profileData.gender}
                          onChange={(e) => handleInputChange('', 'gender', e.target.value)}
                          disabled={!isEditing}
                        >
                          <option value="male">Nam</option>
                          <option value="female">Nữ</option>
                          <option value="other">Khác</option>
                        </Form.Select>
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Số CCCD/CMND *</Form.Label>
                        <Form.Control
                          type="text"
                          value={profileData.idNumber}
                          onChange={(e) => handleInputChange('', 'idNumber', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label>Ngày cấp CCCD/CMND</Form.Label>
                        <Form.Control
                          type="date"
                          value={profileData.idIssueDate}
                          onChange={(e) => handleInputChange('', 'idIssueDate', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Nơi cấp</Form.Label>
                        <Form.Control
                          type="text"
                          value={profileData.idIssuePlace}
                          onChange={(e) => handleInputChange('', 'idIssuePlace', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Tab>

              {/* Address Information Tab */}
              <Tab eventKey="address" title={<><i className="bi bi-geo-alt me-2"></i>Địa chỉ liên hệ</>}>
                <Card.Body>
                  <Form>
                    <Form.Group className="mb-3">
                      <Form.Label>Địa chỉ chi tiết *</Form.Label>
                      <Form.Control
                        type="text"
                        placeholder="Số nhà, tên đường..."
                        value={profileData.address}
                        onChange={(e) => handleInputChange('', 'address', e.target.value)}
                        disabled={!isEditing}
                      />
                    </Form.Group>
                    
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label>Phường/Xã</Form.Label>
                        <Form.Control
                          type="text"
                          value={profileData.ward}
                          onChange={(e) => handleInputChange('', 'ward', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Quận/Huyện</Form.Label>
                        <Form.Control
                          type="text"
                          value={profileData.district}
                          onChange={(e) => handleInputChange('', 'district', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Col>
                    </Row>
                    
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label>Tỉnh/Thành phố</Form.Label>
                        <Form.Control
                          type="text"
                          value={profileData.city}
                          onChange={(e) => handleInputChange('', 'city', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Mã bưu điện</Form.Label>
                        <Form.Control
                          type="text"
                          value={profileData.postalCode}
                          onChange={(e) => handleInputChange('', 'postalCode', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Col>
                    </Row>
                    
                    <hr />
                    
                    <h6 className="mb-3">Liên hệ khẩn cấp</h6>
                    <Row>
                      <Col md={4} className="mb-3">
                        <Form.Label>Họ tên</Form.Label>
                        <Form.Control
                          type="text"
                          value={profileData.emergencyContact}
                          onChange={(e) => handleInputChange('', 'emergencyContact', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>Số điện thoại</Form.Label>
                        <Form.Control
                          type="tel"
                          value={profileData.emergencyPhone}
                          onChange={(e) => handleInputChange('', 'emergencyPhone', e.target.value)}
                          disabled={!isEditing}
                        />
                      </Col>
                      <Col md={4} className="mb-3">
                        <Form.Label>Mối quan hệ</Form.Label>
                        <Form.Select
                          value={profileData.emergencyRelation}
                          onChange={(e) => handleInputChange('', 'emergencyRelation', e.target.value)}
                          disabled={!isEditing}
                        >
                          <option value="Vợ/Chồng">Vợ/Chồng</option>
                          <option value="Cha/Mẹ">Cha/Mẹ</option>
                          <option value="Con">Con</option>
                          <option value="Anh/Chị/Em">Anh/Chị/Em</option>
                          <option value="Bạn bè">Bạn bè</option>
                          <option value="Khác">Khác</option>
                        </Form.Select>
                      </Col>
                    </Row>
                  </Form>
                </Card.Body>
              </Tab>

              {/* Preferences Tab */}
              <Tab eventKey="preferences" title={<><i className="bi bi-gear me-2"></i>Cài đặt</>}>
                <Card.Body>
                  <h6 className="mb-3">Thông báo</h6>
                  <div className="mb-4">
                    <Form.Check
                      type="switch"
                      id="notification-email"
                      label="Nhận thông báo qua Email"
                      checked={profileData.notifications.email}
                      onChange={(e) => handleInputChange('notifications', 'email', e.target.checked)}
                      disabled={!isEditing}
                      className="mb-2"
                    />
                    <Form.Check
                      type="switch"
                      id="notification-sms"
                      label="Nhận thông báo qua SMS"
                      checked={profileData.notifications.sms}
                      onChange={(e) => handleInputChange('notifications', 'sms', e.target.checked)}
                      disabled={!isEditing}
                      className="mb-2"
                    />
                    <Form.Check
                      type="switch"
                      id="notification-appointment"
                      label="Nhắc nhở lịch hẹn"
                      checked={profileData.notifications.appointment}
                      onChange={(e) => handleInputChange('notifications', 'appointment', e.target.checked)}
                      disabled={!isEditing}
                      className="mb-2"
                    />
                    <Form.Check
                      type="switch"
                      id="notification-results"
                      label="Thông báo kết quả xét nghiệm"
                      checked={profileData.notifications.results}
                      onChange={(e) => handleInputChange('notifications', 'results', e.target.checked)}
                      disabled={!isEditing}
                      className="mb-2"
                    />
                    <Form.Check
                      type="switch"
                      id="notification-promotions"
                      label="Nhận thông tin khuyến mại"
                      checked={profileData.notifications.promotions}
                      onChange={(e) => handleInputChange('notifications', 'promotions', e.target.checked)}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <hr />
                  
                  <h6 className="mb-3">Quyền riêng tư</h6>
                  <div className="mb-4">
                    <Form.Check
                      type="switch"
                      id="privacy-share"
                      label="Cho phép chia sẻ dữ liệu cho mục đích nghiên cứu"
                      checked={profileData.privacy.shareData}
                      onChange={(e) => handleInputChange('privacy', 'shareData', e.target.checked)}
                      disabled={!isEditing}
                      className="mb-2"
                    />
                    <Form.Check
                      type="switch"
                      id="privacy-marketing"
                      label="Cho phép sử dụng thông tin cho mục đích marketing"
                      checked={profileData.privacy.marketing}
                      onChange={(e) => handleInputChange('privacy', 'marketing', e.target.checked)}
                      disabled={!isEditing}
                      className="mb-2"
                    />
                    <Form.Check
                      type="switch"
                      id="privacy-analytics"
                      label="Cho phép thu thập dữ liệu phân tích"
                      checked={profileData.privacy.analytics}
                      onChange={(e) => handleInputChange('privacy', 'analytics', e.target.checked)}
                      disabled={!isEditing}
                    />
                  </div>
                  
                  <hr />
                  
                  <h6 className="mb-3">Ngôn ngữ</h6>
                  <Form.Select
                    value={profileData.language}
                    onChange={(e) => handleInputChange('', 'language', e.target.value)}
                    disabled={!isEditing}
                    className="mb-4"
                  >
                    <option value="vi">Tiếng Việt</option>
                    <option value="en">English</option>
                  </Form.Select>
                  
                  <hr />
                  
                  <h6 className="mb-3 text-danger">Vùng nguy hiểm</h6>
                  <Button 
                    variant="outline-danger"
                    onClick={() => setShowDeleteModal(true)}
                    disabled={!isEditing}
                  >
                    <i className="bi bi-trash me-2"></i>
                    Xóa tài khoản
                  </Button>
                </Card.Body>
              </Tab>
            </Tabs>
          </Card>
        </Col>
      </Row>

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
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
                placeholder="Nhập mật khẩu hiện tại"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                placeholder="Nhập mật khẩu mới (ít nhất 6 ký tự)"
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Xác nhận mật khẩu mới</Form.Label>
              <Form.Control
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
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

      {/* Delete Account Modal */}
      <Modal show={showDeleteModal} onHide={() => setShowDeleteModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title className="text-danger">Xóa tài khoản</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="danger">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <strong>Cảnh báo!</strong> Hành động này không thể hoàn tác.
          </Alert>
          <p>Khi xóa tài khoản, tất cả dữ liệu của bạn sẽ bị xóa vĩnh viễn bao gồm:</p>
          <ul>
            <li>Thông tin cá nhân</li>
            <li>Lịch sử đặt lịch</li>
            <li>Kết quả xét nghiệm</li>
            <li>Điểm tích lũy</li>
          </ul>
          <p>Bạn có chắc chắn muốn xóa tài khoản không?</p>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Hủy
          </Button>
          <Button variant="danger">
            Xác nhận xóa tài khoản
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserProfile;