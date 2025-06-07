import React, { useState } from 'react';
import { Row, Col, Card, Button, Badge, Alert, Modal, Form, Table, Tabs, Tab } from 'react-bootstrap';

const StaffProfile = ({ user }) => {
  const [showEditModal, setShowEditModal] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [activeTab, setActiveTab] = useState('info');
  const [editData, setEditData] = useState({
    fullname: user.name,
    phone: user.phone,
    email: user.email,
    address: '',
    emergencyContact: '',
    emergencyPhone: ''
  });
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Mock extended user data
  const staffInfo = {
    ...user,
    fullAddress: '123 Nguyễn Huệ, P. Bến Nghé, Q.1, TP.HCM',
    startDate: '2023-03-15',
    contractType: 'Toàn thời gian',
    supervisor: 'Dr. Trưởng phòng Lab',
    emergencyContact: 'Nguyễn Thị Mẹ',
    emergencyPhone: '0987654321',
    bankAccount: '1234567890 - Vietcombank',
    socialInsurance: 'BHXH123456789',
    healthInsurance: 'BHYT987654321',
    specializations: ['Xét nghiệm ADN', 'Phân tích STR', 'Kiểm tra chất lượng mẫu'],
    languages: ['Tiếng Việt', 'Tiếng Anh'],
    education: [
      {
        degree: 'Cử nhân Sinh học Phân tử',
        school: 'Đại học Khoa học Tự nhiên TP.HCM',
        year: '2018-2022',
        gpa: '3.8/4.0'
      },
      {
        degree: 'Chứng chỉ Xét nghiệm ADN',
        school: 'Viện Pháp y Quốc gia',
        year: '2022',
        gpa: 'Xuất sắc'
      }
    ],
    workHistory: [
      {
        position: 'Kỹ thuật viên Lab ADN',
        company: 'ADN Lab Center',
        period: '03/2023 - Hiện tại',
        description: 'Thực hiện xét nghiệm ADN, phân tích kết quả, quản lý mẫu'
      },
      {
        position: 'Thực tập sinh',
        company: 'Bệnh viện Đại học Y Dược',
        period: '06/2022 - 02/2023',
        description: 'Hỗ trợ xét nghiệm, học tập quy trình lab'
      }
    ],
    performance: {
      totalSamplesProcessed: 1246,
      accuracyRate: '99.8%',
      completionRate: '98.5%',
      customerSatisfaction: '4.9/5.0',
      punctualityScore: '99.2%',
      currentMonth: {
        samplesProcessed: 89,
        testsCompleted: 156,
        resultsDelivered: 134,
        errorRate: '0.1%'
      }
    },
    schedule: {
      currentShift: 'Ca sáng (07:00 - 15:00)',
      workDays: ['Thứ 2', 'Thứ 3', 'Thứ 4', 'Thứ 5', 'Thứ 6'],
      overtimeThisMonth: '8 giờ',
      leaveBalance: '12 ngày',
      sickLeaveUsed: '2 ngày'
    }
  };

  const handleUpdateProfile = () => {
    // TODO: API call to update profile
    setShowEditModal(false);
    setAlert({
      show: true,
      message: 'Thông tin cá nhân đã được cập nhật thành công!',
      type: 'success'
    });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handleChangePassword = () => {
    if (passwordData.newPassword !== passwordData.confirmPassword) {
      setAlert({
        show: true,
        message: 'Mật khẩu xác nhận không khớp!',
        type: 'danger'
      });
      return;
    }
    
    // TODO: API call to change password
    setShowPasswordModal(false);
    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setAlert({
      show: true,
      message: 'Mật khẩu đã được thay đổi thành công!',
      type: 'success'
    });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  const calculateWorkDuration = (startDate) => {
    const start = new Date(startDate);
    const now = new Date();
    const diffTime = Math.abs(now - start);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    const years = Math.floor(diffDays / 365);
    const months = Math.floor((diffDays % 365) / 30);
    return `${years} năm ${months} tháng`;
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-person me-2"></i>
            Hồ sơ cá nhân
          </h2>
          <p className="text-muted mb-0">Quản lý thông tin cá nhân và hiệu suất công việc</p>
        </div>
        <div>
          <Button variant="outline-primary" className="me-2" onClick={() => setShowEditModal(true)}>
            <i className="bi bi-pencil me-1"></i>
            Chỉnh sửa
          </Button>
          <Button variant="outline-secondary" onClick={() => setShowPasswordModal(true)}>
            <i className="bi bi-key me-1"></i>
            Đổi mật khẩu
          </Button>
        </div>
      </div>

      {/* Alert */}
      {alert.show && (
        <Alert variant={alert.type} className="mb-4">
          <i className="bi bi-check-circle me-2"></i>
          {alert.message}
        </Alert>
      )}

      {/* Profile Tabs */}
      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        <Tab eventKey="info" title={
          <span>
            <i className="bi bi-person-circle me-2"></i>
            Thông tin cá nhân
          </span>
        }>
          <Row>
            {/* Basic Info */}
            <Col lg={4} className="mb-4">
              <Card className="shadow-sm">
                <Card.Header className="bg-info text-white text-center py-4">
                  <div className="mb-3">
                    {staffInfo.avatar ? (
                      <img 
                        src={staffInfo.avatar} 
                        alt="Avatar" 
                        className="rounded-circle"
                        width="80"
                        height="80"
                      />
                    ) : (
                      <div className="bg-white bg-opacity-20 rounded-circle d-inline-flex align-items-center justify-content-center" 
                           style={{ width: '80px', height: '80px' }}>
                        <i className="bi bi-person-badge fs-1 text-white"></i>
                      </div>
                    )}
                  </div>
                  <h5 className="mb-1">{staffInfo.name}</h5>
                  <p className="mb-1 small opacity-75">{staffInfo.position}</p>
                  <Badge bg="light" text="dark">ID: {staffInfo.employeeId}</Badge>
                </Card.Header>
                <Card.Body>
                  <div className="text-center mb-3">
                    <Badge bg="success" className="me-2">
                      <i className="bi bi-check-circle me-1"></i>
                      Đang làm việc
                    </Badge>
                    <Badge bg="primary">
                      {calculateWorkDuration(staffInfo.startDate)}
                    </Badge>
                  </div>
                  <table className="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <td><strong>Email:</strong></td>
                        <td>{staffInfo.email}</td>
                      </tr>
                      <tr>
                        <td><strong>Điện thoại:</strong></td>
                        <td>{staffInfo.phone}</td>
                      </tr>
                      <tr>
                        <td><strong>Phòng ban:</strong></td>
                        <td>{staffInfo.department}</td>
                      </tr>
                      <tr>
                        <td><strong>Ngày vào làm:</strong></td>
                        <td>{formatDate(staffInfo.startDate)}</td>
                      </tr>
                      <tr>
                        <td><strong>Giám sát:</strong></td>
                        <td>{staffInfo.supervisor}</td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>

            {/* Detailed Info */}
            <Col lg={8} className="mb-4">
              <Card className="shadow-sm mb-3">
                <Card.Header>
                  <h6 className="mb-0">
                    <i className="bi bi-info-circle me-2"></i>
                    Thông tin chi tiết
                  </h6>
                </Card.Header>
                <Card.Body>
                  <Row>
                    <Col md={6}>
                      <table className="table table-borderless table-sm">
                        <tbody>
                          <tr>
                            <td><strong>Địa chỉ:</strong></td>
                            <td>{staffInfo.fullAddress}</td>
                          </tr>
                          <tr>
                            <td><strong>Loại hợp đồng:</strong></td>
                            <td>{staffInfo.contractType}</td>
                          </tr>
                          <tr>
                            <td><strong>Liên hệ khẩn cấp:</strong></td>
                            <td>{staffInfo.emergencyContact}</td>
                          </tr>
                          <tr>
                            <td><strong>SĐT khẩn cấp:</strong></td>
                            <td>{staffInfo.emergencyPhone}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                    <Col md={6}>
                      <table className="table table-borderless table-sm">
                        <tbody>
                          <tr>
                            <td><strong>Tài khoản ngân hàng:</strong></td>
                            <td>{staffInfo.bankAccount}</td>
                          </tr>
                          <tr>
                            <td><strong>BHXH:</strong></td>
                            <td>{staffInfo.socialInsurance}</td>
                          </tr>
                          <tr>
                            <td><strong>BHYT:</strong></td>
                            <td>{staffInfo.healthInsurance}</td>
                          </tr>
                          <tr>
                            <td><strong>Ngôn ngữ:</strong></td>
                            <td>{staffInfo.languages.join(', ')}</td>
                          </tr>
                        </tbody>
                      </table>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>

              {/* Specializations */}
              <Card className="shadow-sm">
                <Card.Header>
                  <h6 className="mb-0">
                    <i className="bi bi-star me-2"></i>
                    Chuyên môn & Chứng chỉ
                  </h6>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <strong>Lĩnh vực chuyên môn:</strong>
                    <div className="mt-2">
                      {staffInfo.specializations.map((spec, index) => (
                        <Badge key={index} bg="primary" className="me-2 mb-2">
                          {spec}
                        </Badge>
                      ))}
                    </div>
                  </div>
                  <div>
                    <strong>Chứng chỉ:</strong>
                    <div className="mt-2">
                      {staffInfo.certifications.map((cert, index) => (
                        <Badge key={index} bg="success" className="me-2 mb-2">
                          <i className="bi bi-award me-1"></i>
                          {cert}
                        </Badge>
                      ))}
                    </div>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="education" title={
          <span>
            <i className="bi bi-mortarboard me-2"></i>
            Học vấn & Kinh nghiệm
          </span>
        }>
          <Row>
            {/* Education */}
            <Col lg={6} className="mb-4">
              <Card className="shadow-sm">
                <Card.Header>
                  <h6 className="mb-0">
                    <i className="bi bi-mortarboard me-2"></i>
                    Trình độ học vấn
                  </h6>
                </Card.Header>
                <Card.Body>
                  {staffInfo.education.map((edu, index) => (
                    <div key={index} className="mb-3 pb-3 border-bottom">
                      <h6 className="text-primary mb-1">{edu.degree}</h6>
                      <div className="text-muted small mb-1">{edu.school}</div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="small">{edu.year}</span>
                        <Badge bg="success">GPA: {edu.gpa}</Badge>
                      </div>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>

            {/* Work History */}
            <Col lg={6} className="mb-4">
              <Card className="shadow-sm">
                <Card.Header>
                  <h6 className="mb-0">
                    <i className="bi bi-briefcase me-2"></i>
                    Kinh nghiệm làm việc
                  </h6>
                </Card.Header>
                <Card.Body>
                  {staffInfo.workHistory.map((work, index) => (
                    <div key={index} className="mb-3 pb-3 border-bottom">
                      <h6 className="text-primary mb-1">{work.position}</h6>
                      <div className="text-muted small mb-1">{work.company}</div>
                      <div className="small mb-2">{work.period}</div>
                      <p className="small mb-0">{work.description}</p>
                    </div>
                  ))}
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="performance" title={
          <span>
            <i className="bi bi-graph-up me-2"></i>
            Hiệu suất công việc
          </span>
        }>
          <Row>
            {/* Performance Summary */}
            <Col lg={3} md={6} className="mb-3">
              <Card className="border-start border-success border-4 shadow-sm">
                <Card.Body className="text-center">
                  <div className="h4 text-success mb-1">{staffInfo.performance.totalSamplesProcessed}</div>
                  <div className="text-muted small">Tổng mẫu xử lý</div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="border-start border-primary border-4 shadow-sm">
                <Card.Body className="text-center">
                  <div className="h4 text-primary mb-1">{staffInfo.performance.accuracyRate}</div>
                  <div className="text-muted small">Độ chính xác</div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="border-start border-warning border-4 shadow-sm">
                <Card.Body className="text-center">
                  <div className="h4 text-warning mb-1">{staffInfo.performance.completionRate}</div>
                  <div className="text-muted small">Tỷ lệ hoàn thành</div>
                </Card.Body>
              </Card>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Card className="border-start border-info border-4 shadow-sm">
                <Card.Body className="text-center">
                  <div className="h4 text-info mb-1">{staffInfo.performance.customerSatisfaction}</div>
                  <div className="text-muted small">Hài lòng KH</div>
                </Card.Body>
              </Card>
            </Col>
          </Row>

          {/* Detailed Performance */}
          <Row>
            <Col lg={6} className="mb-4">
              <Card className="shadow-sm">
                <Card.Header>
                  <h6 className="mb-0">
                    <i className="bi bi-calendar-month me-2"></i>
                    Thành tích tháng này
                  </h6>
                </Card.Header>
                <Card.Body>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><strong>Mẫu đã xử lý:</strong></td>
                        <td>
                          <Badge bg="success">{staffInfo.performance.currentMonth.samplesProcessed}</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Xét nghiệm hoàn thành:</strong></td>
                        <td>
                          <Badge bg="primary">{staffInfo.performance.currentMonth.testsCompleted}</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Kết quả đã giao:</strong></td>
                        <td>
                          <Badge bg="info">{staffInfo.performance.currentMonth.resultsDelivered}</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Tỷ lệ lỗi:</strong></td>
                        <td>
                          <Badge bg="success">{staffInfo.performance.currentMonth.errorRate}</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6} className="mb-4">
              <Card className="shadow-sm">
                <Card.Header>
                  <h6 className="mb-0">
                    <i className="bi bi-trophy me-2"></i>
                    Đánh giá tổng thể
                  </h6>
                </Card.Header>
                <Card.Body>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><strong>Độ chính xác:</strong></td>
                        <td>
                          <Badge bg="success">{staffInfo.performance.accuracyRate}</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Tỷ lệ hoàn thành:</strong></td>
                        <td>
                          <Badge bg="primary">{staffInfo.performance.completionRate}</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Đúng giờ:</strong></td>
                        <td>
                          <Badge bg="info">{staffInfo.performance.punctualityScore}</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Hài lòng khách hàng:</strong></td>
                        <td>
                          <Badge bg="warning">{staffInfo.performance.customerSatisfaction}</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        <Tab eventKey="schedule" title={
          <span>
            <i className="bi bi-calendar-week me-2"></i>
            Lịch làm việc
          </span>
        }>
          <Row>
            <Col lg={6} className="mb-4">
              <Card className="shadow-sm">
                <Card.Header>
                  <h6 className="mb-0">
                    <i className="bi bi-clock me-2"></i>
                    Ca làm việc hiện tại
                  </h6>
                </Card.Header>
                <Card.Body>
                  <div className="text-center mb-3">
                    <h5 className="text-info">{staffInfo.schedule.currentShift}</h5>
                    <Badge bg="success">Đang hoạt động</Badge>
                  </div>
                  <table className="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <td><strong>Ngày làm việc:</strong></td>
                        <td>{staffInfo.schedule.workDays.join(', ')}</td>
                      </tr>
                      <tr>
                        <td><strong>Tăng ca tháng này:</strong></td>
                        <td>
                          <Badge bg="warning">{staffInfo.schedule.overtimeThisMonth}</Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={6} className="mb-4">
              <Card className="shadow-sm">
                <Card.Header>
                  <h6 className="mb-0">
                    <i className="bi bi-calendar-x me-2"></i>
                    Nghỉ phép & Vắng mặt
                  </h6>
                </Card.Header>
                <Card.Body>
                  <table className="table table-borderless">
                    <tbody>
                      <tr>
                        <td><strong>Số ngày phép còn lại:</strong></td>
                        <td>
                          <Badge bg="success">{staffInfo.schedule.leaveBalance}</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Nghỉ ốm đã sử dụng:</strong></td>
                        <td>
                          <Badge bg="info">{staffInfo.schedule.sickLeaveUsed}</Badge>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Trạng thái hiện tại:</strong></td>
                        <td>
                          <Badge bg="success">
                            <i className="bi bi-check-circle me-1"></i>
                            Đang làm việc
                          </Badge>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  <div className="text-center mt-3">
                    <Button variant="outline-primary" size="sm" className="me-2">
                      <i className="bi bi-calendar-plus me-1"></i>
                      Đăng ký nghỉ phép
                    </Button>
                    <Button variant="outline-secondary" size="sm">
                      <i className="bi bi-clock-history me-1"></i>
                      Lịch sử chấm công
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>

      {/* Edit Profile Modal */}
      <Modal show={showEditModal} onHide={() => setShowEditModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-pencil me-2"></i>
            Chỉnh sửa thông tin cá nhân
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Họ và tên</Form.Label>
                <Form.Control 
                  value={editData.fullname}
                  onChange={(e) => setEditData({...editData, fullname: e.target.value})}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Email</Form.Label>
                <Form.Control 
                  type="email"
                  value={editData.email}
                  onChange={(e) => setEditData({...editData, email: e.target.value})}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Số điện thoại</Form.Label>
                <Form.Control 
                  value={editData.phone}
                  onChange={(e) => setEditData({...editData, phone: e.target.value})}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Địa chỉ</Form.Label>
                <Form.Control 
                  value={editData.address}
                  onChange={(e) => setEditData({...editData, address: e.target.value})}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Liên hệ khẩn cấp</Form.Label>
                <Form.Control 
                  value={editData.emergencyContact}
                  onChange={(e) => setEditData({...editData, emergencyContact: e.target.value})}
                />
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>SĐT khẩn cấp</Form.Label>
                <Form.Control 
                  value={editData.emergencyPhone}
                  onChange={(e) => setEditData({...editData, emergencyPhone: e.target.value})}
                />
              </Col>
            </Row>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowEditModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleUpdateProfile}>
            <i className="bi bi-check-circle me-2"></i>
            Cập nhật
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Change Password Modal */}
      <Modal show={showPasswordModal} onHide={() => setShowPasswordModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-key me-2"></i>
            Thay đổi mật khẩu
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu hiện tại</Form.Label>
              <Form.Control 
                type="password"
                value={passwordData.currentPassword}
                onChange={(e) => setPasswordData({...passwordData, currentPassword: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Mật khẩu mới</Form.Label>
              <Form.Control 
                type="password"
                value={passwordData.newPassword}
                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Xác nhận mật khẩu mới</Form.Label>
              <Form.Control 
                type="password"
                value={passwordData.confirmPassword}
                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPasswordModal(false)}>
            Hủy
          </Button>
          <Button 
            variant="primary" 
            onClick={handleChangePassword}
            disabled={!passwordData.currentPassword || !passwordData.newPassword || !passwordData.confirmPassword}
          >
            <i className="bi bi-check-circle me-2"></i>
            Thay đổi mật khẩu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default StaffProfile;