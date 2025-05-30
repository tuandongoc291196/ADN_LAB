import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Button, Form, Alert, 
  Tab, Tabs, Badge, Table, Modal, Toast, ToastContainer,
  ProgressBar, InputGroup
} from 'react-bootstrap';

const SystemSettings = ({ user }) => {
  const [activeTab, setActiveTab] = useState('general');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);

  // General Settings
  const [generalSettings, setGeneralSettings] = useState({
    siteName: 'ADN LAB',
    siteDescription: 'Trung tâm xét nghiệm ADN hàng đầu Việt Nam',
    contactEmail: 'contact@adnlab.vn',
    supportEmail: 'support@adnlab.vn',
    phone: '1900-1234',
    address: '123 Đường ABC, Quận 1, TP.HCM',
    timezone: 'Asia/Ho_Chi_Minh',
    language: 'vi',
    currency: 'VND',
    maintenanceMode: false
  });

  // Security Settings
  const [securitySettings, setSecuritySettings] = useState({
    passwordMinLength: 8,
    passwordRequireSpecial: true,
    passwordRequireNumbers: true,
    passwordRequireUppercase: true,
    sessionTimeout: 30,
    maxLoginAttempts: 5,
    lockoutDuration: 15,
    twoFactorAuth: true,
    ipWhitelist: '',
    sslRequired: true
  });

  // Email Settings
  const [emailSettings, setEmailSettings] = useState({
    smtpHost: 'smtp.gmail.com',
    smtpPort: 587,
    smtpUsername: 'noreply@adnlab.vn',
    smtpPassword: '••••••••',
    smtpEncryption: 'TLS',
    fromName: 'ADN LAB',
    fromEmail: 'noreply@adnlab.vn',
    enableNotifications: true,
    emailVerification: true
  });

  // Payment Settings
  const [paymentSettings, setPaymentSettings] = useState({
    enableCreditCard: true,
    enableBankTransfer: true,
    enableMomo: true,
    enableZaloPay: true,
    defaultCurrency: 'VND',
    taxRate: 10,
    invoicePrefix: 'ADN',
    paymentTerms: 30
  });

  // Backup Settings
  const [backupSettings, setBackupSettings] = useState({
    autoBackup: true,
    backupFrequency: 'daily',
    backupTime: '02:00',
    retentionDays: 30,
    backupLocation: 'cloud',
    lastBackup: '2024-11-20T02:00:00',
    backupSize: '2.5 GB'
  });

  // API Settings
  const [apiSettings, setApiSettings] = useState({
    rateLimit: 1000,
    rateLimitWindow: 3600,
    apiVersion: 'v1',
    enableCors: true,
    corsOrigins: '*',
    requireApiKey: true,
    enableLogging: true,
    logLevel: 'info'
  });

  // System Status
  const [systemStatus, setSystemStatus] = useState({
    cpuUsage: 45,
    memoryUsage: 68,
    diskUsage: 32,
    networkLatency: 15,
    uptime: '15 ngày 6 giờ',
    activeUsers: 24,
    queuedJobs: 3,
    errorRate: 0.01
  });

  const handleSaveSettings = (settingsType) => {
    // Simulate API call
    setTimeout(() => {
      setToastMessage(`Cài đặt ${settingsType} đã được lưu thành công!`);
      setShowToast(true);
    }, 500);
  };

  const handleSystemAction = (action) => {
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  const executeSystemAction = () => {
    setShowConfirmModal(false);
    
    switch (confirmAction) {
      case 'restart':
        setToastMessage('Hệ thống đang khởi động lại...');
        break;
      case 'backup':
        setToastMessage('Đang tạo backup hệ thống...');
        break;
      case 'cache':
        setToastMessage('Cache đã được xóa thành công!');
        break;
      case 'logs':
        setToastMessage('Logs đã được xóa thành công!');
        break;
      default:
        setToastMessage('Thao tác đã được thực hiện!');
    }
    
    setShowToast(true);
  };

  const getStatusColor = (value, type = 'percentage') => {
    if (type === 'percentage') {
      if (value < 50) return 'success';
      if (value < 80) return 'warning';
      return 'danger';
    }
    return 'info';
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-gear text-dark me-2"></i>
            Cài đặt Hệ thống
          </h2>
          <p className="text-muted mb-0">Quản lý cấu hình và tùy chỉnh hệ thống</p>
        </div>
        <div className="d-flex gap-2">
          <Button variant="outline-warning" onClick={() => handleSystemAction('backup')}>
            <i className="bi bi-download me-2"></i>
            Backup ngay
          </Button>
          <Button variant="outline-danger" onClick={() => handleSystemAction('restart')}>
            <i className="bi bi-arrow-clockwise me-2"></i>
            Khởi động lại
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-cpu text-primary fs-1 mb-2"></i>
              <h5>CPU Usage</h5>
              <ProgressBar 
                now={systemStatus.cpuUsage} 
                variant={getStatusColor(systemStatus.cpuUsage)}
                className="mb-2"
              />
              <small>{systemStatus.cpuUsage}%</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-memory text-success fs-1 mb-2"></i>
              <h5>Memory</h5>
              <ProgressBar 
                now={systemStatus.memoryUsage} 
                variant={getStatusColor(systemStatus.memoryUsage)}
                className="mb-2"
              />
              <small>{systemStatus.memoryUsage}%</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-hdd text-warning fs-1 mb-2"></i>
              <h5>Disk Usage</h5>
              <ProgressBar 
                now={systemStatus.diskUsage} 
                variant={getStatusColor(systemStatus.diskUsage)}
                className="mb-2"
              />
              <small>{systemStatus.diskUsage}%</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-wifi text-info fs-1 mb-2"></i>
              <h5>Network</h5>
              <h4 className="text-info">{systemStatus.networkLatency}ms</h4>
              <small>Latency</small>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Settings Tabs */}
      <Card className="border-0 shadow-sm">
        <Card.Header className="bg-white">
          <Tabs
            activeKey={activeTab}
            onSelect={(tab) => setActiveTab(tab)}
            className="border-0"
          >
            <Tab eventKey="general" title={
              <span>
                <i className="bi bi-gear me-2"></i>
                Chung
              </span>
            } />
            <Tab eventKey="security" title={
              <span>
                <i className="bi bi-shield-lock me-2"></i>
                Bảo mật
              </span>
            } />
            <Tab eventKey="email" title={
              <span>
                <i className="bi bi-envelope me-2"></i>
                Email
              </span>
            } />
            <Tab eventKey="payment" title={
              <span>
                <i className="bi bi-credit-card me-2"></i>
                Thanh toán
              </span>
            } />
            <Tab eventKey="backup" title={
              <span>
                <i className="bi bi-cloud-download me-2"></i>
                Backup
              </span>
            } />
            <Tab eventKey="api" title={
              <span>
                <i className="bi bi-code-slash me-2"></i>
                API
              </span>
            } />
            <Tab eventKey="maintenance" title={
              <span>
                <i className="bi bi-tools me-2"></i>
                Bảo trì
              </span>
            } />
          </Tabs>
        </Card.Header>

        <Card.Body>
          {/* General Settings Tab */}
          {activeTab === 'general' && (
            <div>
              <Form>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Tên website</Form.Label>
                    <Form.Control
                      type="text"
                      value={generalSettings.siteName}
                      onChange={(e) => setGeneralSettings({...generalSettings, siteName: e.target.value})}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Ngôn ngữ</Form.Label>
                    <Form.Select
                      value={generalSettings.language}
                      onChange={(e) => setGeneralSettings({...generalSettings, language: e.target.value})}
                    >
                      <option value="vi">Tiếng Việt</option>
                      <option value="en">English</option>
                    </Form.Select>
                  </Col>
                </Row>

                <div className="mb-3">
                  <Form.Label>Mô tả website</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows={2}
                    value={generalSettings.siteDescription}
                    onChange={(e) => setGeneralSettings({...generalSettings, siteDescription: e.target.value})}
                  />
                </div>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Email liên hệ</Form.Label>
                    <Form.Control
                      type="email"
                      value={generalSettings.contactEmail}
                      onChange={(e) => setGeneralSettings({...generalSettings, contactEmail: e.target.value})}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Số điện thoại</Form.Label>
                    <Form.Control
                      type="tel"
                      value={generalSettings.phone}
                      onChange={(e) => setGeneralSettings({...generalSettings, phone: e.target.value})}
                    />
                  </Col>
                </Row>

                <div className="mb-3">
                  <Form.Label>Địa chỉ</Form.Label>
                  <Form.Control
                    type="text"
                    value={generalSettings.address}
                    onChange={(e) => setGeneralSettings({...generalSettings, address: e.target.value})}
                  />
                </div>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Múi giờ</Form.Label>
                    <Form.Select
                      value={generalSettings.timezone}
                      onChange={(e) => setGeneralSettings({...generalSettings, timezone: e.target.value})}
                    >
                      <option value="Asia/Ho_Chi_Minh">Asia/Ho_Chi_Minh</option>
                      <option value="UTC">UTC</option>
                    </Form.Select>
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Đơn vị tiền tệ</Form.Label>
                    <Form.Select
                      value={generalSettings.currency}
                      onChange={(e) => setGeneralSettings({...generalSettings, currency: e.target.value})}
                    >
                      <option value="VND">VNĐ</option>
                      <option value="USD">USD</option>
                    </Form.Select>
                  </Col>
                </Row>

                <div className="mb-3">
                  <Form.Check
                    type="checkbox"
                    label="Chế độ bảo trì"
                    checked={generalSettings.maintenanceMode}
                    onChange={(e) => setGeneralSettings({...generalSettings, maintenanceMode: e.target.checked})}
                  />
                  <Form.Text className="text-muted">
                    Khi bật, website sẽ hiển thị trang bảo trì cho người dùng
                  </Form.Text>
                </div>

                <Button variant="primary" onClick={() => handleSaveSettings('chung')}>
                  <i className="bi bi-check-circle me-2"></i>
                  Lưu cài đặt
                </Button>
              </Form>
            </div>
          )}

          {/* Security Settings Tab */}
          {activeTab === 'security' && (
            <div>
              <Form>
                <h5 className="mb-3">Cài đặt mật khẩu</h5>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Độ dài tối thiểu</Form.Label>
                    <Form.Control
                      type="number"
                      min="6"
                      max="20"
                      value={securitySettings.passwordMinLength}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordMinLength: parseInt(e.target.value)})}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Thời gian session (phút)</Form.Label>
                    <Form.Control
                      type="number"
                      min="5"
                      max="120"
                      value={securitySettings.sessionTimeout}
                      onChange={(e) => setSecuritySettings({...securitySettings, sessionTimeout: parseInt(e.target.value)})}
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Check
                      type="checkbox"
                      label="Yêu cầu ký tự đặc biệt"
                      checked={securitySettings.passwordRequireSpecial}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireSpecial: e.target.checked})}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Check
                      type="checkbox"
                      label="Yêu cầu số"
                      checked={securitySettings.passwordRequireNumbers}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireNumbers: e.target.checked})}
                    />
                  </Col>
                  <Col md={4}>
                    <Form.Check
                      type="checkbox"
                      label="Yêu cầu chữ hoa"
                      checked={securitySettings.passwordRequireUppercase}
                      onChange={(e) => setSecuritySettings({...securitySettings, passwordRequireUppercase: e.target.checked})}
                    />
                  </Col>
                </Row>

                <hr />
                <h5 className="mb-3">Bảo mật đăng nhập</h5>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Số lần đăng nhập sai tối đa</Form.Label>
                    <Form.Control
                      type="number"
                      min="3"
                      max="10"
                      value={securitySettings.maxLoginAttempts}
                      onChange={(e) => setSecuritySettings({...securitySettings, maxLoginAttempts: parseInt(e.target.value)})}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Thời gian khóa (phút)</Form.Label>
                    <Form.Control
                      type="number"
                      min="5"
                      max="60"
                      value={securitySettings.lockoutDuration}
                      onChange={(e) => setSecuritySettings({...securitySettings, lockoutDuration: parseInt(e.target.value)})}
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Check
                      type="checkbox"
                      label="Bật xác thực 2 yếu tố"
                      checked={securitySettings.twoFactorAuth}
                      onChange={(e) => setSecuritySettings({...securitySettings, twoFactorAuth: e.target.checked})}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Check
                      type="checkbox"
                      label="Yêu cầu SSL"
                      checked={securitySettings.sslRequired}
                      onChange={(e) => setSecuritySettings({...securitySettings, sslRequired: e.target.checked})}
                    />
                  </Col>
                </Row>

                <Button variant="warning" onClick={() => handleSaveSettings('bảo mật')}>
                  <i className="bi bi-shield-check me-2"></i>
                  Lưu cài đặt bảo mật
                </Button>
              </Form>
            </div>
          )}

          {/* Email Settings Tab */}
          {activeTab === 'email' && (
            <div>
              <Form>
                <h5 className="mb-3">Cấu hình SMTP</h5>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>SMTP Host</Form.Label>
                    <Form.Control
                      type="text"
                      value={emailSettings.smtpHost}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpHost: e.target.value})}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>SMTP Port</Form.Label>
                    <Form.Control
                      type="number"
                      value={emailSettings.smtpPort}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPort: parseInt(e.target.value)})}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Username</Form.Label>
                    <Form.Control
                      type="text"
                      value={emailSettings.smtpUsername}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpUsername: e.target.value})}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      value={emailSettings.smtpPassword}
                      onChange={(e) => setEmailSettings({...emailSettings, smtpPassword: e.target.value})}
                    />
                  </Col>
                </Row>

                <hr />
                <h5 className="mb-3">Cài đặt email</h5>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Tên người gửi</Form.Label>
                    <Form.Control
                      type="text"
                      value={emailSettings.fromName}
                      onChange={(e) => setEmailSettings({...emailSettings, fromName: e.target.value})}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Email người gửi</Form.Label>
                    <Form.Control
                      type="email"
                      value={emailSettings.fromEmail}
                      onChange={(e) => setEmailSettings({...emailSettings, fromEmail: e.target.value})}
                    />
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Check
                      type="checkbox"
                      label="Bật thông báo email"
                      checked={emailSettings.enableNotifications}
                      onChange={(e) => setEmailSettings({...emailSettings, enableNotifications: e.target.checked})}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Check
                      type="checkbox"
                      label="Xác thực email bắt buộc"
                      checked={emailSettings.emailVerification}
                      onChange={(e) => setEmailSettings({...emailSettings, emailVerification: e.target.checked})}
                    />
                  </Col>
                </Row>

                <Button variant="info" onClick={() => handleSaveSettings('email')}>
                  <i className="bi bi-envelope-check me-2"></i>
                  Lưu cài đặt email
                </Button>
              </Form>
            </div>
          )}

          {/* Payment Settings Tab */}
          {activeTab === 'payment' && (
            <div>
              <Form>
                <h5 className="mb-3">Phương thức thanh toán</h5>
                <Row className="mb-3">
                  <Col md={3}>
                    <Form.Check
                      type="checkbox"
                      label="Thẻ tín dụng"
                      checked={paymentSettings.enableCreditCard}
                      onChange={(e) => setPaymentSettings({...paymentSettings, enableCreditCard: e.target.checked})}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Check
                      type="checkbox"
                      label="Chuyển khoản"
                      checked={paymentSettings.enableBankTransfer}
                      onChange={(e) => setPaymentSettings({...paymentSettings, enableBankTransfer: e.target.checked})}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Check
                      type="checkbox"
                      label="MoMo"
                      checked={paymentSettings.enableMomo}
                      onChange={(e) => setPaymentSettings({...paymentSettings, enableMomo: e.target.checked})}
                    />
                  </Col>
                  <Col md={3}>
                    <Form.Check
                      type="checkbox"
                      label="ZaloPay"
                      checked={paymentSettings.enableZaloPay}
                      onChange={(e) => setPaymentSettings({...paymentSettings, enableZaloPay: e.target.checked})}
                    />
                  </Col>
                </Row>

                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Thuế VAT (%)</Form.Label>
                    <Form.Control
                      type="number"
                      min="0"
                      max="50"
                      value={paymentSettings.taxRate}
                      onChange={(e) => setPaymentSettings({...paymentSettings, taxRate: parseFloat(e.target.value)})}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>Prefix hóa đơn</Form.Label>
                    <Form.Control
                      type="text"
                      value={paymentSettings.invoicePrefix}
                      onChange={(e) => setPaymentSettings({...paymentSettings, invoicePrefix: e.target.value})}
                    />
                  </Col>
                </Row>

                <Button variant="success" onClick={() => handleSaveSettings('thanh toán')}>
                  <i className="bi bi-credit-card me-2"></i>
                  Lưu cài đặt thanh toán
                </Button>
              </Form>
            </div>
          )}

          {/* Backup Settings Tab */}
          {activeTab === 'backup' && (
            <div>
              <Form>
                <Row>
                  <Col md={8}>
                    <h5 className="mb-3">Cài đặt backup tự động</h5>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Check
                          type="checkbox"
                          label="Bật backup tự động"
                          checked={backupSettings.autoBackup}
                          onChange={(e) => setBackupSettings({...backupSettings, autoBackup: e.target.checked})}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Tần suất</Form.Label>
                        <Form.Select
                          value={backupSettings.backupFrequency}
                          onChange={(e) => setBackupSettings({...backupSettings, backupFrequency: e.target.value})}
                        >
                          <option value="daily">Hàng ngày</option>
                          <option value="weekly">Hàng tuần</option>
                          <option value="monthly">Hàng tháng</option>
                        </Form.Select>
                      </Col>
                    </Row>

                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label>Thời gian backup</Form.Label>
                        <Form.Control
                          type="time"
                          value={backupSettings.backupTime}
                          onChange={(e) => setBackupSettings({...backupSettings, backupTime: e.target.value})}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Lưu trữ (ngày)</Form.Label>
                        <Form.Control
                          type="number"
                          min="1"
                          max="365"
                          value={backupSettings.retentionDays}
                          onChange={(e) => setBackupSettings({...backupSettings, retentionDays: parseInt(e.target.value)})}
                        />
                      </Col>
                    </Row>
                  </Col>
                  <Col md={4}>
                    <Card className="bg-light">
                      <Card.Body>
                        <h6>Thông tin backup</h6>
                        <p className="mb-1">
                          <strong>Backup cuối:</strong><br />
                          {new Date(backupSettings.lastBackup).toLocaleString('vi-VN')}
                        </p>
                        <p className="mb-1">
                          <strong>Dung lượng:</strong><br />
                          {backupSettings.backupSize}
                        </p>
                        <Button 
                          variant="outline-primary" 
                          size="sm"
                          onClick={() => handleSystemAction('backup')}
                        >
                          <i className="bi bi-download me-1"></i>
                          Backup ngay
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

                <Button variant="warning" onClick={() => handleSaveSettings('backup')}>
                  <i className="bi bi-cloud-download me-2"></i>
                  Lưu cài đặt backup
                </Button>
              </Form>
            </div>
          )}

          {/* API Settings Tab */}
          {activeTab === 'api' && (
            <div>
              <Form>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Rate limit (requests/hour)</Form.Label>
                    <Form.Control
                      type="number"
                      min="100"
                      max="10000"
                      value={apiSettings.rateLimit}
                      onChange={(e) => setApiSettings({...apiSettings, rateLimit: parseInt(e.target.value)})}
                    />
                  </Col>
                  <Col md={6} className="mb-3">
                    <Form.Label>API Version</Form.Label>
                    <Form.Select
                      value={apiSettings.apiVersion}
                      onChange={(e) => setApiSettings({...apiSettings, apiVersion: e.target.value})}
                    >
                      <option value="v1">v1</option>
                      <option value="v2">v2</option>
                    </Form.Select>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={6}>
                    <Form.Check
                      type="checkbox"
                      label="Bật CORS"
                      checked={apiSettings.enableCors}
                      onChange={(e) => setApiSettings({...apiSettings, enableCors: e.target.checked})}
                    />
                  </Col>
                  <Col md={6}>
                    <Form.Check
                      type="checkbox"
                      label="Yêu cầu API Key"
                      checked={apiSettings.requireApiKey}
                      onChange={(e) => setApiSettings({...apiSettings, requireApiKey: e.target.checked})}
                    />
                  </Col>
                </Row>

                <Button variant="info" onClick={() => handleSaveSettings('API')}>
                  <i className="bi bi-code-slash me-2"></i>
                  Lưu cài đặt API
                </Button>
              </Form>
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <div>
              <Row>
                <Col md={6}>
                  <h5 className="mb-3">Thao tác hệ thống</h5>
                  <div className="d-grid gap-2">
                    <Button 
                      variant="outline-primary" 
                      onClick={() => handleSystemAction('cache')}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Xóa cache
                    </Button>
                    <Button 
                      variant="outline-warning" 
                      onClick={() => handleSystemAction('logs')}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Xóa logs cũ
                    </Button>
                    <Button 
                      variant="outline-info" 
                      onClick={() => handleSystemAction('backup')}
                    >
                      <i className="bi bi-download me-2"></i>
                      Tạo backup
                    </Button>
                    <Button 
                      variant="outline-danger" 
                      onClick={() => handleSystemAction('restart')}
                    >
                      <i className="bi bi-power me-2"></i>
                      Khởi động lại hệ thống
                    </Button>
                  </div>
                </Col>
                <Col md={6}>
                  <h5 className="mb-3">Thông tin hệ thống</h5>
                  <Table size="sm">
                    <tbody>
                      <tr>
                        <td><strong>Uptime:</strong></td>
                        <td>{systemStatus.uptime}</td>
                      </tr>
                      <tr>
                        <td><strong>Người dùng hoạt động:</strong></td>
                        <td>{systemStatus.activeUsers}</td>
                      </tr>
                      <tr>
                        <td><strong>Jobs trong queue:</strong></td>
                        <td>{systemStatus.queuedJobs}</td>
                      </tr>
                      <tr>
                        <td><strong>Tỷ lệ lỗi:</strong></td>
                        <td>{systemStatus.errorRate}%</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Confirmation Modal */}
      <Modal show={showConfirmModal} onHide={() => setShowConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận thao tác</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="warning">
            <i className="bi bi-exclamation-triangle me-2"></i>
            Bạn có chắc chắn muốn thực hiện thao tác này? Hành động này có thể ảnh hưởng đến hoạt động của hệ thống.
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Hủy
          </Button>
          <Button variant="danger" onClick={executeSystemAction}>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Header>
            <i className="bi bi-check-circle text-success me-2"></i>
            <strong className="me-auto">Thành công</strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default SystemSettings;