import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Alert, Modal, Form, Table, InputGroup } from 'react-bootstrap';

const KitPreparation = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showPrepModal, setShowPrepModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // Mock data cho các đơn hàng cần chuẩn bị kit
  useEffect(() => {
    const mockOrders = [
      {
        id: 'ADN123470',
        customerName: 'Nguyễn Văn A',
        phone: '0901234567',
        email: 'nguyenvana@email.com',
        service: 'Xét nghiệm ADN huyết thống cha-con',
        serviceType: 'civil',
        orderDate: '2024-01-28',
        expectedDate: '2024-02-04',
        collectionMethod: 'self-sample',
        address: '123 Nguyễn Huệ, Q1, TP.HCM',
        participants: 2,
        status: 'waiting-kit-prep',
        priority: 'high',
        kitType: 'standard',
        specialInstructions: 'Khách yêu cầu hướng dẫn chi tiết qua video call'
      },
      {
        id: 'ADN123471',
        customerName: 'Trần Thị B',
        phone: '0907654321',
        email: 'tranthib@email.com',
        service: 'Xét nghiệm ADN trước sinh',
        serviceType: 'civil',
        orderDate: '2024-01-28',
        expectedDate: '2024-02-04',
        collectionMethod: 'self-sample',
        address: '456 Lê Lợi, Q3, TP.HCM',
        participants: 3,
        status: 'waiting-kit-prep',
        priority: 'urgent',
        kitType: 'prenatal',
        specialInstructions: 'Bà bầu 10 tuần, cần kit chuyên dụng'
      },
      {
        id: 'ADN123472',
        customerName: 'Lê Văn C',
        phone: '0912345678',
        email: 'levanc@email.com',
        service: 'Xét nghiệm ADN anh chị em',
        serviceType: 'civil',
        orderDate: '2024-01-28',
        expectedDate: '2024-02-04',
        collectionMethod: 'self-sample',
        address: '789 Hai Bà Trưng, Q1, TP.HCM',
        participants: 4,
        status: 'kit-prepared',
        priority: 'medium',
        kitType: 'extended',
        preparedBy: 'Nguyễn Văn Staff',
        preparedDate: '2024-01-28 14:30',
        trackingNumber: 'VTP123456789'
      },
      {
        id: 'ADN123473',
        customerName: 'Phạm Thị D',
        phone: '0898765432',
        email: 'phamthid@email.com',
        service: 'Xét nghiệm ADN bí mật',
        serviceType: 'civil',
        orderDate: '2024-01-27',
        expectedDate: '2024-02-03',
        collectionMethod: 'self-sample',
        address: '321 Võ Văn Tần, Q3, TP.HCM',
        participants: 2,
        status: 'kit-sent',
        priority: 'high',
        kitType: 'discreet',
        preparedBy: 'Nguyễn Văn Staff',
        preparedDate: '2024-01-27 16:00',
        sentDate: '2024-01-28 09:00',
        trackingNumber: 'VTP987654321',
        estimatedDelivery: '2024-01-29'
      }
    ];
    setOrders(mockOrders);
    setFilteredOrders(mockOrders);
  }, []);

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders;
    
    if (searchTerm) {
      filtered = filtered.filter(order => 
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm)
      );
    }
    
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }
    
    setFilteredOrders(filtered);
  }, [searchTerm, filterStatus, orders]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      'waiting-kit-prep': { bg: 'warning', text: 'Chờ chuẩn bị' },
      'kit-prepared': { bg: 'info', text: 'Đã chuẩn bị' },
      'kit-sent': { bg: 'success', text: 'Đã gửi' },
      'delivered': { bg: 'primary', text: 'Đã giao' }
    };
    const config = statusConfig[status] || { bg: 'secondary', text: 'Không xác định' };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getPriorityBadge = (priority) => {
    const priorityConfig = {
      'urgent': { bg: 'danger', text: 'Khẩn cấp' },
      'high': { bg: 'warning', text: 'Cao' },
      'medium': { bg: 'primary', text: 'Trung bình' },
      'low': { bg: 'secondary', text: 'Thấp' }
    };
    const config = priorityConfig[priority] || { bg: 'secondary', text: 'Không xác định' };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const getKitTypeInfo = (kitType) => {
    const kitTypes = {
      'standard': { name: 'Kit tiêu chuẩn', items: 'Ống cotton swab x2, Hướng dẫn, Phong bì trả' },
      'prenatal': { name: 'Kit trước sinh', items: 'Ống máu x1, Cotton swab x2, Hướng dẫn đặc biệt' },
      'extended': { name: 'Kit mở rộng', items: 'Ống cotton swab x4, Hướng dẫn, Phong bì trả' },
      'discreet': { name: 'Kit bí mật', items: 'Cotton swab x2, Hướng dẫn rút gọn, Phong bì ẩn danh' }
    };
    return kitTypes[kitType] || { name: 'Không xác định', items: '' };
  };

  const handlePrepareKit = (order) => {
    setSelectedOrder(order);
    setShowPrepModal(true);
  };

  const handleConfirmPreparation = () => {
    // Update order status
    const updatedOrders = orders.map(order => 
      order.id === selectedOrder.id 
        ? { 
            ...order, 
            status: 'kit-prepared',
            preparedBy: user.name,
            preparedDate: new Date().toLocaleString('vi-VN'),
            trackingNumber: 'VTP' + Date.now().toString().slice(-9)
          }
        : order
    );
    setOrders(updatedOrders);
    setShowPrepModal(false);
    setSelectedOrder(null);
    
    setAlert({ 
      show: true, 
      message: `Kit cho đơn hàng ${selectedOrder.id} đã được chuẩn bị thành công!`,
      type: 'success' 
    });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const handleSendKit = (orderId) => {
    const updatedOrders = orders.map(order => 
      order.id === orderId 
        ? { 
            ...order, 
            status: 'kit-sent',
            sentDate: new Date().toLocaleString('vi-VN'),
            estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')
          }
        : order
    );
    setOrders(updatedOrders);
    
    setAlert({ 
      show: true, 
      message: `Kit cho đơn hàng ${orderId} đã được gửi thành công!`,
      type: 'success' 
    });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-box-seam me-2"></i>
            Chuẩn bị và Gửi Kit Test
          </h2>
          <p className="text-muted mb-0">Quản lý việc chuẩn bị và gửi kit xét nghiệm cho khách hàng</p>
        </div>
      </div>

      {/* Alert */}
      {alert.show && (
        <Alert variant={alert.type} className="mb-4">
          <i className="bi bi-check-circle me-2"></i>
          {alert.message}
        </Alert>
      )}

      {/* Filters */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col lg={6} md={8} className="mb-3">
              <Form.Label>Tìm kiếm đơn hàng</Form.Label>
              <InputGroup>
                <Form.Control
                  placeholder="Mã đơn, tên khách hàng, số điện thoại..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
                <Button variant="outline-secondary">
                  <i className="bi bi-search"></i>
                </Button>
              </InputGroup>
            </Col>
            <Col lg={3} md={4} className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select value={filterStatus} onChange={(e) => setFilterStatus(e.target.value)}>
                <option value="all">Tất cả trạng thái</option>
                <option value="waiting-kit-prep">Chờ chuẩn bị</option>
                <option value="kit-prepared">Đã chuẩn bị</option>
                <option value="kit-sent">Đã gửi</option>
                <option value="delivered">Đã giao</option>
              </Form.Select>
            </Col>
            <Col lg={3} className="mb-3 d-flex align-items-end">
              <div className="w-100">
                <Badge bg="warning" className="me-2">
                  Chờ chuẩn bị: {orders.filter(o => o.status === 'waiting-kit-prep').length}
                </Badge>
                <Badge bg="info">
                  Đã chuẩn bị: {orders.filter(o => o.status === 'kit-prepared').length}
                </Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Orders Table */}
      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Danh sách đơn hàng ({filteredOrders.length})</h5>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          <div className="table-responsive">
            <Table hover className="mb-0">
              <thead className="table-light">
                <tr>
                  <th>Mã đơn</th>
                  <th>Khách hàng</th>
                  <th>Dịch vụ</th>
                  <th>Loại Kit</th>
                  <th>Ưu tiên</th>
                  <th>Trạng thái</th>
                  <th>Ngày đặt</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredOrders.map((order) => (
                  <tr key={order.id}>
                    <td>
                      <div className="fw-bold">{order.id}</div>
                      <small className="text-muted">{order.participants} người tham gia</small>
                    </td>
                    <td>
                      <div className="fw-bold">{order.customerName}</div>
                      <small className="text-muted">{order.phone}</small>
                    </td>
                    <td>
                      <div>{order.service}</div>
                      <small className="text-muted">
                        {order.serviceType === 'civil' ? 'Dân sự' : 'Hành chính'}
                      </small>
                    </td>
                    <td>
                      <div className="fw-bold">{getKitTypeInfo(order.kitType).name}</div>
                      <small className="text-muted">{getKitTypeInfo(order.kitType).items}</small>
                    </td>
                    <td>{getPriorityBadge(order.priority)}</td>
                    <td>{getStatusBadge(order.status)}</td>
                    <td>
                      <div>{formatDate(order.orderDate)}</div>
                      <small className="text-muted">DK: {formatDate(order.expectedDate)}</small>
                    </td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        {order.status === 'waiting-kit-prep' && (
                          <Button 
                            size="sm" 
                            variant="success"
                            onClick={() => handlePrepareKit(order)}
                          >
                            <i className="bi bi-box me-1"></i>
                            Chuẩn bị
                          </Button>
                        )}
                        {order.status === 'kit-prepared' && (
                          <Button 
                            size="sm" 
                            variant="primary"
                            onClick={() => handleSendKit(order.id)}
                          >
                            <i className="bi bi-truck me-1"></i>
                            Gửi Kit
                          </Button>
                        )}
                        {order.status === 'kit-sent' && order.trackingNumber && (
                          <Badge bg="success" className="p-2">
                            <i className="bi bi-check-circle me-1"></i>
                            {order.trackingNumber}
                          </Badge>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </div>
        </Card.Body>
      </Card>

      {/* Kit Preparation Modal */}
      <Modal show={showPrepModal} onHide={() => setShowPrepModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-box-seam me-2"></i>
            Chuẩn bị Kit Test
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div>
              {/* Order Info */}
              <Row className="mb-4">
                <Col md={6}>
                  <h6 className="text-primary mb-3">Thông tin đơn hàng</h6>
                  <table className="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <td><strong>Mã đơn:</strong></td>
                        <td>{selectedOrder.id}</td>
                      </tr>
                      <tr>
                        <td><strong>Khách hàng:</strong></td>
                        <td>{selectedOrder.customerName}</td>
                      </tr>
                      <tr>
                        <td><strong>Điện thoại:</strong></td>
                        <td>{selectedOrder.phone}</td>
                      </tr>
                      <tr>
                        <td><strong>Dịch vụ:</strong></td>
                        <td>{selectedOrder.service}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
                <Col md={6}>
                  <h6 className="text-primary mb-3">Chi tiết kit</h6>
                  <table className="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <td><strong>Loại kit:</strong></td>
                        <td>{getKitTypeInfo(selectedOrder.kitType).name}</td>
                      </tr>
                      <tr>
                        <td><strong>Số người:</strong></td>
                        <td>{selectedOrder.participants}</td>
                      </tr>
                      <tr>
                        <td><strong>Địa chỉ gửi:</strong></td>
                        <td>{selectedOrder.address}</td>
                      </tr>
                      <tr>
                        <td><strong>Ưu tiên:</strong></td>
                        <td>{getPriorityBadge(selectedOrder.priority)}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
              </Row>

              {/* Kit Contents */}
              <div className="mb-4">
                <h6 className="text-primary mb-3">Nội dung kit</h6>
                <div className="bg-light p-3 rounded">
                  <div className="fw-bold mb-2">{getKitTypeInfo(selectedOrder.kitType).name}</div>
                  <div>{getKitTypeInfo(selectedOrder.kitType).items}</div>
                </div>
              </div>

              {/* Special Instructions */}
              {selectedOrder.specialInstructions && (
                <div className="mb-4">
                  <h6 className="text-primary mb-3">Ghi chú đặc biệt</h6>
                  <Alert variant="warning">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {selectedOrder.specialInstructions}
                  </Alert>
                </div>
              )}

              {/* Checklist */}
              <div className="mb-4">
                <h6 className="text-primary mb-3">Checklist chuẩn bị</h6>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" id="check1" />
                  <label className="form-check-label" htmlFor="check1">
                    Kiểm tra số lượng cotton swab theo số người tham gia
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" id="check2" />
                  <label className="form-check-label" htmlFor="check2">
                    In hướng dẫn chi tiết theo loại kit
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" id="check3" />
                  <label className="form-check-label" htmlFor="check3">
                    Chuẩn bị phong bì trả có ghi địa chỉ lab
                  </label>
                </div>
                <div className="form-check mb-2">
                  <input className="form-check-input" type="checkbox" id="check4" />
                  <label className="form-check-label" htmlFor="check4">
                    Dán nhãn mã đơn hàng lên tất cả vật dụng
                  </label>
                </div>
                <div className="form-check">
                  <input className="form-check-input" type="checkbox" id="check5" />
                  <label className="form-check-label" htmlFor="check5">
                    Đóng gói kit trong hộp chống ẩm
                  </label>
                </div>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPrepModal(false)}>
            Hủy
          </Button>
          <Button variant="success" onClick={handleConfirmPreparation}>
            <i className="bi bi-check-circle me-2"></i>
            Xác nhận đã chuẩn bị
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KitPreparation;