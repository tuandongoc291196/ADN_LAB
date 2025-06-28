import React, { useState, useEffect } from 'react';
import { 
  Card, Row, Col, Button, Form, Alert, 
  Tab, Tabs, Badge, Table, Modal, Toast, ToastContainer,
  ProgressBar, InputGroup
} from 'react-bootstrap';

const SystemSettings = ({ user }) => {
  const [activeTab, setActiveTab] = useState('frontend');
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [toastVariant, setToastVariant] = useState('success');
  const [showConfirmModal, setShowConfirmModal] = useState(false);
  const [confirmAction, setConfirmAction] = useState(null);
  const [isLoading, setIsLoading] = useState(false);

  // Frontend Settings - Có thể lưu vào localStorage
  const [frontendSettings, setFrontendSettings] = useState({
    theme: 'light',
    autoRefresh: false,
    notifications: true,
    compactMode: false
  });

  // System Status - Thông tin thực tế từ browser
  const [systemStatus, setSystemStatus] = useState({
    browserInfo: '',
    localStorageSize: '0 KB',
    sessionStorageSize: '0 KB',
    cacheSize: '0 KB',
    memoryUsage: '0 MB',
    userAgent: ''
  });

  // Load settings từ localStorage khi component mount
  useEffect(() => {
    loadFrontendSettings();
    updateSystemStatus();
    applyTheme();
  }, []);

  // Apply theme changes
  useEffect(() => {
    applyTheme();
  }, [frontendSettings.theme]);

  // Apply compact mode
  useEffect(() => {
    applyCompactMode();
  }, [frontendSettings.compactMode]);

  const loadFrontendSettings = () => {
    try {
      const savedSettings = localStorage.getItem('adnlab_frontend_settings');
      if (savedSettings) {
        const parsedSettings = JSON.parse(savedSettings);
        setFrontendSettings(parsedSettings);
      } else {
        // Set default settings if none exist
        const defaultSettings = {
          theme: 'light',
          autoRefresh: false,
          notifications: false,
          compactMode: false
        };
        setFrontendSettings(defaultSettings);
        localStorage.setItem('adnlab_frontend_settings', JSON.stringify(defaultSettings));
      }
    } catch (error) {
      console.error('Error loading frontend settings:', error);
      // Set default settings on error
      const defaultSettings = {
        theme: 'light',
        autoRefresh: false,
        notifications: false,
        compactMode: false
      };
      setFrontendSettings(defaultSettings);
    }
  };

  const saveFrontendSettings = (newSettings) => {
    try {
      localStorage.setItem('adnlab_frontend_settings', JSON.stringify(newSettings));
      setFrontendSettings(newSettings);
      showToastMessage('Cài đặt frontend đã được lưu thành công!', 'success');
    } catch (error) {
      console.error('Error saving frontend settings:', error);
      showToastMessage('Lỗi khi lưu cài đặt!', 'danger');
    }
  };

  // Apply theme to the application
  const applyTheme = () => {
    const root = document.documentElement;
    const body = document.body;
    
    // Remove existing theme classes
    body.classList.remove('theme-light', 'theme-dark');
    root.classList.remove('theme-light', 'theme-dark');
    
    // Apply new theme
    if (frontendSettings.theme === 'dark') {
      body.classList.add('theme-dark');
      root.classList.add('theme-dark');
      // Add dark theme styles
      const darkStyles = `
        .theme-dark {
          background-color: #1a1a1a !important;
          color: #ffffff !important;
        }
        .theme-dark .card {
          background-color: #2d2d2d !important;
          border-color: #404040 !important;
        }
        .theme-dark .navbar {
          background-color: #2d2d2d !important;
        }
        .theme-dark .btn-outline-primary {
          color: #007bff !important;
          border-color: #007bff !important;
        }
        .theme-dark .btn-outline-primary:hover {
          background-color: #007bff !important;
          color: #ffffff !important;
        }
        .theme-dark .text-muted {
          color: #b0b0b0 !important;
        }
        .theme-dark .bg-white {
          background-color: #2d2d2d !important;
        }
        .theme-dark .border-0 {
          border-color: #404040 !important;
        }
      `;
      
      // Remove existing dark theme styles
      const existingStyle = document.getElementById('dark-theme-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      // Add new dark theme styles
      const styleElement = document.createElement('style');
      styleElement.id = 'dark-theme-styles';
      styleElement.textContent = darkStyles;
      document.head.appendChild(styleElement);
      
    } else if (frontendSettings.theme === 'light') {
      body.classList.add('theme-light');
      root.classList.add('theme-light');
      // Remove dark theme styles
      const existingStyle = document.getElementById('dark-theme-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    } else if (frontendSettings.theme === 'auto') {
      // Auto theme based on system preference
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      if (prefersDark) {
        body.classList.add('theme-dark');
        root.classList.add('theme-dark');
        // Apply dark styles (same as above)
        const darkStyles = `
          .theme-dark {
            background-color: #1a1a1a !important;
            color: #ffffff !important;
          }
          .theme-dark .card {
            background-color: #2d2d2d !important;
            border-color: #404040 !important;
          }
          .theme-dark .navbar {
            background-color: #2d2d2d !important;
          }
          .theme-dark .btn-outline-primary {
            color: #007bff !important;
            border-color: #007bff !important;
          }
          .theme-dark .btn-outline-primary:hover {
            background-color: #007bff !important;
            color: #ffffff !important;
          }
          .theme-dark .text-muted {
            color: #b0b0b0 !important;
          }
          .theme-dark .bg-white {
            background-color: #2d2d2d !important;
          }
          .theme-dark .border-0 {
            border-color: #404040 !important;
          }
        `;
        
        const existingStyle = document.getElementById('dark-theme-styles');
        if (existingStyle) {
          existingStyle.remove();
        }
        
        const styleElement = document.createElement('style');
        styleElement.id = 'dark-theme-styles';
        styleElement.textContent = darkStyles;
        document.head.appendChild(styleElement);
      } else {
        body.classList.add('theme-light');
        root.classList.add('theme-light');
        const existingStyle = document.getElementById('dark-theme-styles');
        if (existingStyle) {
          existingStyle.remove();
        }
      }
    }
  };

  // Apply compact mode
  const applyCompactMode = () => {
    const body = document.body;
    
    if (frontendSettings.compactMode) {
      body.classList.add('compact-mode');
      // Add compact mode styles
      const compactStyles = `
        .compact-mode .card-body {
          padding: 0.75rem !important;
        }
        .compact-mode .btn {
          padding: 0.25rem 0.5rem !important;
          font-size: 0.875rem !important;
        }
        .compact-mode .form-control {
          padding: 0.25rem 0.5rem !important;
          font-size: 0.875rem !important;
        }
        .compact-mode .table td, .compact-mode .table th {
          padding: 0.5rem !important;
        }
        .compact-mode .mb-3 {
          margin-bottom: 0.75rem !important;
        }
        .compact-mode .mb-4 {
          margin-bottom: 1rem !important;
        }
        .compact-mode .p-3 {
          padding: 0.75rem !important;
        }
        .compact-mode .p-4 {
          padding: 1rem !important;
        }
      `;
      
      const existingStyle = document.getElementById('compact-mode-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
      
      const styleElement = document.createElement('style');
      styleElement.id = 'compact-mode-styles';
      styleElement.textContent = compactStyles;
      document.head.appendChild(styleElement);
    } else {
      body.classList.remove('compact-mode');
      const existingStyle = document.getElementById('compact-mode-styles');
      if (existingStyle) {
        existingStyle.remove();
      }
    }
  };

  // Apply auto refresh
  const applyAutoRefresh = (enabled) => {
    if (enabled) {
      // Set up auto refresh every 30 seconds
      const refreshInterval = setInterval(() => {
        updateSystemStatus();
      }, 30000);
      
      // Store interval ID for cleanup
      localStorage.setItem('adnlab_refresh_interval', refreshInterval);
      showToastMessage('Tự động làm mới đã được bật (30 giây)', 'info');
    } else {
      // Clear auto refresh
      const intervalId = localStorage.getItem('adnlab_refresh_interval');
      if (intervalId) {
        clearInterval(parseInt(intervalId));
        localStorage.removeItem('adnlab_refresh_interval');
      }
      showToastMessage('Tự động làm mới đã được tắt', 'info');
    }
  };

  // Apply notifications
  const applyNotifications = (enabled) => {
    if (enabled) {
      // Request notification permission
      if ('Notification' in window) {
        Notification.requestPermission().then(permission => {
          if (permission === 'granted') {
            showToastMessage('Thông báo đã được bật', 'success');
          } else {
            showToastMessage('Cần cấp quyền thông báo trong trình duyệt', 'warning');
          }
        });
      } else {
        showToastMessage('Trình duyệt không hỗ trợ thông báo', 'warning');
      }
    } else {
      showToastMessage('Thông báo đã được tắt', 'info');
    }
  };

  const updateSystemStatus = () => {
    try {
      // Tính toán dung lượng localStorage
      let localStorageSize = 0;
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key)) {
          localStorageSize += localStorage[key].length;
        }
      }

      // Tính toán dung lượng sessionStorage
      let sessionStorageSize = 0;
      for (let key in sessionStorage) {
        if (sessionStorage.hasOwnProperty(key)) {
          sessionStorageSize += sessionStorage[key].length;
        }
      }

      // Lấy thông tin browser
      const browserInfo = getBrowserInfo();
      const memoryUsage = performance.memory ? 
        `${Math.round(performance.memory.usedJSHeapSize / 1024 / 1024)} MB` : 'Không hỗ trợ';

      setSystemStatus({
        browserInfo,
        localStorageSize: `${Math.round(localStorageSize / 1024)} KB`,
        sessionStorageSize: `${Math.round(sessionStorageSize / 1024)} KB`,
        cacheSize: 'Đang tính...',
        memoryUsage,
        userAgent: navigator.userAgent
      });

      // Tính toán cache size (async)
      calculateCacheSize();
    } catch (error) {
      console.error('Error updating system status:', error);
    }
  };

  const getBrowserInfo = () => {
    const userAgent = navigator.userAgent;
    let browserName = 'Unknown';
    
    if (userAgent.includes('Chrome')) browserName = 'Chrome';
    else if (userAgent.includes('Firefox')) browserName = 'Firefox';
    else if (userAgent.includes('Safari')) browserName = 'Safari';
    else if (userAgent.includes('Edge')) browserName = 'Edge';
    
    return `${browserName} ${navigator.appVersion.split(' ').pop()}`;
  };

  const calculateCacheSize = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        let totalSize = 0;
        
        for (const cacheName of cacheNames) {
          const cache = await caches.open(cacheName);
          const requests = await cache.keys();
          
          for (const request of requests) {
            const response = await cache.match(request);
            if (response) {
              const blob = await response.blob();
              totalSize += blob.size;
            }
          }
        }
        
        setSystemStatus(prev => ({
          ...prev,
          cacheSize: `${Math.round(totalSize / 1024)} KB`
        }));
      } else {
        setSystemStatus(prev => ({
          ...prev,
          cacheSize: 'Không hỗ trợ'
        }));
      }
    } catch (error) {
      console.error('Error calculating cache size:', error);
      setSystemStatus(prev => ({
        ...prev,
        cacheSize: 'Lỗi tính toán'
      }));
    }
  };

  const clearFrontendCache = async () => {
    setIsLoading(true);
    try {
      // Clear localStorage (giữ lại settings quan trọng)
      const importantKeys = ['userData', 'user_id', 'isAuthenticated', 'adnlab_frontend_settings'];
      const keysToRemove = [];
      
      for (let key in localStorage) {
        if (localStorage.hasOwnProperty(key) && !importantKeys.includes(key)) {
          keysToRemove.push(key);
        }
      }
      
      keysToRemove.forEach(key => localStorage.removeItem(key));

      // Clear sessionStorage
      sessionStorage.clear();

      // Clear browser cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Clear user cache (nếu có function này)
      if (typeof window.clearUserCache === 'function') {
        window.clearUserCache();
      }

      // Cập nhật system status
      updateSystemStatus();
      
      showToastMessage('Cache frontend đã được xóa thành công!', 'success');
    } catch (error) {
      console.error('Error clearing frontend cache:', error);
      showToastMessage('Lỗi khi xóa cache!', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const clearApplicationData = async () => {
    setIsLoading(true);
    try {
      // Clear tất cả localStorage (bao gồm cả user data)
      localStorage.clear();
      
      // Clear sessionStorage
      sessionStorage.clear();

      // Clear browser cache
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map(name => caches.delete(name)));
      }

      // Reload page để reset hoàn toàn
      window.location.reload();
    } catch (error) {
      console.error('Error clearing application data:', error);
      showToastMessage('Lỗi khi xóa dữ liệu ứng dụng!', 'danger');
      setIsLoading(false);
    }
  };

  const handleSystemAction = (action) => {
    setConfirmAction(action);
    setShowConfirmModal(true);
  };

  const executeSystemAction = async () => {
    setShowConfirmModal(false);
    setIsLoading(true);
    
    try {
      switch (confirmAction) {
        case 'frontend-cache':
          await clearFrontendCache();
          break;
        case 'app-data':
          await clearApplicationData();
          break;
        case 'refresh-status':
          updateSystemStatus();
          showToastMessage('Thông tin hệ thống đã được cập nhật!', 'info');
          break;
        default:
          showToastMessage('Thao tác không được hỗ trợ!', 'warning');
      }
    } catch (error) {
      console.error('Error executing system action:', error);
      showToastMessage('Lỗi khi thực hiện thao tác!', 'danger');
    } finally {
      setIsLoading(false);
    }
  };

  const showToastMessage = (message, variant = 'success') => {
    setToastMessage(message);
    setToastVariant(variant);
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

  // Handle settings changes with immediate application
  const handleThemeChange = (theme) => {
    const newSettings = { ...frontendSettings, theme };
    saveFrontendSettings(newSettings);
    applyTheme();
  };

  const handleAutoRefreshChange = (autoRefresh) => {
    const newSettings = { ...frontendSettings, autoRefresh };
    saveFrontendSettings(newSettings);
    applyAutoRefresh(autoRefresh);
  };

  const handleNotificationsChange = (notifications) => {
    const newSettings = { ...frontendSettings, notifications };
    saveFrontendSettings(newSettings);
    applyNotifications(notifications);
  };

  const handleCompactModeChange = (compactMode) => {
    const newSettings = { ...frontendSettings, compactMode };
    saveFrontendSettings(newSettings);
    applyCompactMode();
  };

  return (
    <div>
      {/* Page Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-gear text-dark me-2"></i>
            Cài đặt Frontend
          </h2>
          <p className="text-muted mb-0">Quản lý cấu hình và cache của ứng dụng</p>
        </div>
        <div className="d-flex gap-2">
          <Button 
            variant="outline-info" 
            onClick={() => handleSystemAction('refresh-status')}
            disabled={isLoading}
          >
            <i className="bi bi-arrow-clockwise me-2"></i>
            Cập nhật thông tin
          </Button>
        </div>
      </div>

      {/* System Status Overview */}
      <Row className="mb-4">
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-hdd text-primary fs-1 mb-2"></i>
              <h5>LocalStorage</h5>
              <h4 className="text-primary">{systemStatus.localStorageSize}</h4>
              <small>Dung lượng đã sử dụng</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-memory text-success fs-1 mb-2"></i>
              <h5>SessionStorage</h5>
              <h4 className="text-success">{systemStatus.sessionStorageSize}</h4>
              <small>Dung lượng phiên làm việc</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-cloud text-warning fs-1 mb-2"></i>
              <h5>Browser Cache</h5>
              <h4 className="text-warning">{systemStatus.cacheSize}</h4>
              <small>Cache trình duyệt</small>
            </Card.Body>
          </Card>
        </Col>
        <Col md={3} className="mb-3">
          <Card className="border-0 shadow-sm">
            <Card.Body className="text-center">
              <i className="bi bi-cpu text-info fs-1 mb-2"></i>
              <h5>Memory Usage</h5>
              <h4 className="text-info">{systemStatus.memoryUsage}</h4>
              <small>Bộ nhớ JavaScript</small>
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
            <Tab eventKey="frontend" title={
              <span>
                <i className="bi bi-gear me-2"></i>
                Cài đặt Frontend
              </span>
            } />
            <Tab eventKey="maintenance" title={
              <span>
                <i className="bi bi-tools me-2"></i>
                Bảo trì
              </span>
            } />
            <Tab eventKey="info" title={
              <span>
                <i className="bi bi-info-circle me-2"></i>
                Thông tin Hệ thống
              </span>
            } />
          </Tabs>
        </Card.Header>

        <Card.Body>
          {/* Frontend Settings Tab */}
          {activeTab === 'frontend' && (
            <div>
              <Form>
                <Row>
                  <Col md={6} className="mb-3">
                    <Form.Label>Giao diện</Form.Label>
                    <Form.Select
                      value={frontendSettings.theme}
                      onChange={(e) => handleThemeChange(e.target.value)}
                    >
                      <option value="light">Sáng</option>
                      <option value="dark">Tối</option>
                      <option value="auto">Tự động</option>
                    </Form.Select>
                    <Form.Text className="text-muted">
                      Thay đổi giao diện sáng/tối ngay lập tức
                    </Form.Text>
                  </Col>
                </Row>

                <Row className="mb-3">
                  <Col md={4}>
                    <Form.Check
                      type="checkbox"
                      label="Tự động làm mới"
                      checked={frontendSettings.autoRefresh}
                      onChange={(e) => handleAutoRefreshChange(e.target.checked)}
                    />
                    <Form.Text className="text-muted">
                      Tự động cập nhật thông tin hệ thống
                    </Form.Text>
                  </Col>
                  <Col md={4}>
                    <Form.Check
                      type="checkbox"
                      label="Thông báo"
                      checked={frontendSettings.notifications}
                      onChange={(e) => handleNotificationsChange(e.target.checked)}
                    />
                    <Form.Text className="text-muted">
                      Bật thông báo trình duyệt
                    </Form.Text>
                  </Col>
                  <Col md={4}>
                    <Form.Check
                      type="checkbox"
                      label="Chế độ compact"
                      checked={frontendSettings.compactMode}
                      onChange={(e) => handleCompactModeChange(e.target.checked)}
                    />
                    <Form.Text className="text-muted">
                      Giảm khoảng cách các phần tử
                    </Form.Text>
                  </Col>
                </Row>

                <Alert variant="info">
                  <i className="bi bi-info-circle me-2"></i>
                  <strong>Lưu ý:</strong> Các cài đặt này được áp dụng ngay lập tức và lưu trong trình duyệt.
                </Alert>
              </Form>
            </div>
          )}

          {/* Maintenance Tab */}
          {activeTab === 'maintenance' && (
            <div>
              <Row>
                <Col md={6}>
                  <h5 className="mb-3">Thao tác Cache</h5>
                  <div className="d-grid gap-2">
                    <Button 
                      variant="outline-primary" 
                      onClick={() => handleSystemAction('frontend-cache')}
                      disabled={isLoading}
                    >
                      <i className="bi bi-arrow-clockwise me-2"></i>
                      Xóa cache ứng dụng
                    </Button>
                    <Button 
                      variant="outline-warning" 
                      onClick={() => handleSystemAction('app-data')}
                      disabled={isLoading}
                    >
                      <i className="bi bi-trash me-2"></i>
                      Xóa tất cả dữ liệu
                    </Button>
                  </div>
                  
                  <Alert variant="warning" className="mt-3">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    <strong>Cảnh báo:</strong> 
                    <ul className="mb-0 mt-2">
                      <li>"Xóa cache ứng dụng" sẽ xóa cache nhưng giữ lại thông tin đăng nhập</li>
                      <li>"Xóa tất cả dữ liệu" sẽ xóa hoàn toàn và yêu cầu đăng nhập lại</li>
                    </ul>
                  </Alert>
                </Col>
                <Col md={6}>
                  <h5 className="mb-3">Thông tin Cache</h5>
                  <Table size="sm">
                    <tbody>
                      <tr>
                        <td><strong>LocalStorage:</strong></td>
                        <td>{systemStatus.localStorageSize}</td>
                      </tr>
                      <tr>
                        <td><strong>SessionStorage:</strong></td>
                        <td>{systemStatus.sessionStorageSize}</td>
                      </tr>
                      <tr>
                        <td><strong>Browser Cache:</strong></td>
                        <td>{systemStatus.cacheSize}</td>
                      </tr>
                      <tr>
                        <td><strong>Memory Usage:</strong></td>
                        <td>{systemStatus.memoryUsage}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
              </Row>
            </div>
          )}

          {/* System Info Tab */}
          {activeTab === 'info' && (
            <div>
              <Row>
                <Col md={6}>
                  <h5 className="mb-3">Thông tin Trình duyệt</h5>
                  <Table size="sm">
                    <tbody>
                      <tr>
                        <td><strong>Trình duyệt:</strong></td>
                        <td>{systemStatus.browserInfo}</td>
                      </tr>
                      <tr>
                        <td><strong>User Agent:</strong></td>
                        <td>
                          <small className="text-muted">
                            {systemStatus.userAgent.substring(0, 100)}...
                          </small>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Cookies:</strong></td>
                        <td>{navigator.cookieEnabled ? 'Bật' : 'Tắt'}</td>
                      </tr>
                      <tr>
                        <td><strong>JavaScript:</strong></td>
                        <td>Bật</td>
                      </tr>
                      <tr>
                        <td><strong>Online:</strong></td>
                        <td>{navigator.onLine ? 'Có kết nối' : 'Ngoại tuyến'}</td>
                      </tr>
                    </tbody>
                  </Table>
                </Col>
                <Col md={6}>
                  <h5 className="mb-3">Thông tin Ứng dụng</h5>
                  <Table size="sm">
                    <tbody>
                      <tr>
                        <td><strong>Phiên bản React:</strong></td>
                        <td>{React.version}</td>
                      </tr>
                      <tr>
                        <td><strong>URL hiện tại:</strong></td>
                        <td>
                          <small className="text-muted">
                            {window.location.href}
                          </small>
                        </td>
                      </tr>
                      <tr>
                        <td><strong>Màn hình:</strong></td>
                        <td>{window.screen.width} x {window.screen.height}</td>
                      </tr>
                      <tr>
                        <td><strong>Viewport:</strong></td>
                        <td>{window.innerWidth} x {window.innerHeight}</td>
                      </tr>
                      <tr>
                        <td><strong>Thời gian tải:</strong></td>
                        <td>{performance.timing ? 
                          `${Math.round(performance.timing.loadEventEnd - performance.timing.navigationStart)}ms` : 
                          'Không hỗ trợ'
                        }</td>
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
            {confirmAction === 'app-data' ? 
              'Bạn có chắc chắn muốn xóa TẤT CẢ dữ liệu ứng dụng? Hành động này sẽ đăng xuất bạn và xóa mọi cài đặt.' :
              'Bạn có chắc chắn muốn thực hiện thao tác này?'
            }
          </Alert>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirmModal(false)}>
            Hủy
          </Button>
          <Button 
            variant={confirmAction === 'app-data' ? 'danger' : 'primary'} 
            onClick={executeSystemAction}
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Đang xử lý...
              </>
            ) : (
              'Xác nhận'
            )}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Toast Notification */}
      <ToastContainer position="top-end" className="p-3">
        <Toast show={showToast} onClose={() => setShowToast(false)} delay={3000} autohide>
          <Toast.Header>
            <i className={`bi bi-${toastVariant === 'success' ? 'check-circle text-success' : 
                           toastVariant === 'danger' ? 'x-circle text-danger' : 
                           toastVariant === 'warning' ? 'exclamation-triangle text-warning' : 
                           'info-circle text-info'} me-2`}></i>
            <strong className="me-auto">
              {toastVariant === 'success' ? 'Thành công' : 
               toastVariant === 'danger' ? 'Lỗi' : 
               toastVariant === 'warning' ? 'Cảnh báo' : 'Thông tin'}
            </strong>
          </Toast.Header>
          <Toast.Body>{toastMessage}</Toast.Body>
        </Toast>
      </ToastContainer>
    </div>
  );
};

export default SystemSettings;