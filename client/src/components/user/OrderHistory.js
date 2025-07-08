import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Row, Col, Card, Button, Badge, Form, Alert, Modal, Table } from 'react-bootstrap';

const OrderHistory = ({ user, orders = [] }) => {
  const [selectedPeriod, setSelectedPeriod] = useState('all');
  const [selectedStatus, setSelectedStatus] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return <Badge bg="success">Hoàn thành</Badge>;
      case 'in-progress':
        return <Badge bg="warning">Đang thực hiện</Badge>;
      case 'confirmed':
        return <Badge bg="primary">Đã xác nhận</Badge>;
      case 'cancelled':
        return <Badge bg="danger">Đã hủy</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  const getPaymentStatusBadge = (status) => {
    switch (status) {
      case 'paid':
        return <Badge bg="success">Đã thanh toán</Badge>;
      case 'pending':
        return <Badge bg="warning">Chờ thanh toán</Badge>;
      case 'refunded':
        return <Badge bg="info">Đã hoàn tiền</Badge>;
      case 'failed':
        return <Badge bg="danger">Thanh toán thất bại</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  const getPaymentMethodText = (method) => {
    switch (method) {
      case 'credit_card':
        return 'Thẻ tín dụng';
      case 'bank_transfer':
        return 'Chuyển khoản';
      case 'cash':
        return 'Tiền mặt';
      case 'e_wallet':
        return 'Ví điện tử';
      default:
        return method;
    }
  };

  const filterOrders = () => {
    let filtered = orders;

    // Filter by period
    if (selectedPeriod !== 'all') {
      const now = new Date();
      const filterDate = new Date();

      switch (selectedPeriod) {
        case 'last_month':
          filterDate.setMonth(now.getMonth() - 1);
          break;
        case 'last_3months':
          filterDate.setMonth(now.getMonth() - 3);
          break;
        case 'last_6months':
          filterDate.setMonth(now.getMonth() - 6);
          break;
        case 'last_year':
          filterDate.setFullYear(now.getFullYear() - 1);
          break;
        default:
          break;
      }

      filtered = filtered.filter(order => new Date(order.orderDate) >= filterDate);
    }

    // Filter by status
    if (selectedStatus !== 'all') {
      filtered = filtered.filter(order => order.status === selectedStatus);
    }

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.service.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.participants.some(p => p.toLowerCase().includes(searchTerm.toLowerCase()))
      );
    }

    return filtered.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
  };

  const handleViewInvoice = (order) => {
    setSelectedOrder(order);
    setShowInvoiceModal(true);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(amount);
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  const calculateTotalSpent = () => {
    return orders
      .filter(order => order.status === 'completed')
      .reduce((total, order) => total + order.finalAmount, 0);
  };

  const filteredOrders = filterOrders();
  const totalSpent = calculateTotalSpent();
  const completedOrders = orders.filter(order => order.status === 'completed').length;

  return (
    <>
      {/* Header with Statistics */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Lịch sử đặt hẹn</h2>
              <p className="text-muted mb-0">Xem lại tất cả các đơn hàng và giao dịch</p>
            </div>
            <div className="text-end d-none d-md-block">
              <div className="h4 mb-0 text-success">{formatCurrency(totalSpent)}</div>
              <small className="text-muted">Tổng chi tiêu từ {completedOrders} đơn hàng</small>
            </div>
          </div>
        </Col>
      </Row>

      {/* Statistics Cards */}
      <Row className="mb-4">
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm bg-primary text-white">
            <Card.Body className="d-flex align-items-center">
              <i className="bi bi-cart-check fs-1 me-3"></i>
              <div>
                <div className="h4 mb-0">{orders.length}</div>
                <small>Tổng đơn hàng</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm bg-success text-white">
            <Card.Body className="d-flex align-items-center">
              <i className="bi bi-check-circle fs-1 me-3"></i>
              <div>
                <div className="h4 mb-0">{completedOrders}</div>
                <small>Đã hoàn thành</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm bg-warning text-dark">
            <Card.Body className="d-flex align-items-center">
              <i className="bi bi-clock fs-1 me-3"></i>
              <div>
                <div className="h4 mb-0">{orders.filter(o => o.status === 'in-progress').length}</div>
                <small>Đang thực hiện</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
        <Col lg={3} md={6} className="mb-3">
          <Card className="border-0 shadow-sm bg-info text-white">
            <Card.Body className="d-flex align-items-center">
              <i className="bi bi-currency-dollar fs-1 me-3"></i>
              <div>
                <div className="h5 mb-0">{formatCurrency(totalSpent / completedOrders || 0)}</div>
                <small>Trung bình/đơn</small>
              </div>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Filters */}
      <Card className="shadow-sm mb-4">
        <Card.Body>
          <Row>
            <Col lg={3} md={6} className="mb-3">
              <Form.Label>Thời gian</Form.Label>
              <Form.Select
                value={selectedPeriod}
                onChange={(e) => setSelectedPeriod(e.target.value)}
              >
                <option value="all">Tất cả thời gian</option>
                <option value="last_month">Tháng trước</option>
                <option value="last_3months">3 tháng trước</option>
                <option value="last_6months">6 tháng trước</option>
                <option value="last_year">Năm trước</option>
              </Form.Select>
            </Col>
            <Col lg={3} md={6} className="mb-3">
              <Form.Label>Trạng thái</Form.Label>
              <Form.Select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="completed">Hoàn thành</option>
                <option value="in-progress">Đang thực hiện</option>
                <option value="confirmed">Đã xác nhận</option>
                <option value="cancelled">Đã hủy</option>
              </Form.Select>
            </Col>
            <Col lg={6} className="mb-3">
              <Form.Label>Tìm kiếm</Form.Label>
              <Form.Control
                type="text"
                placeholder="Tìm kiếm theo tên dịch vụ, mã đơn hàng hoặc người tham gia..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Order List */}
      <Card className="shadow-sm">
        <Card.Header className="bg-white border-bottom">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">
              <i className="bi bi-list-ul me-2"></i>
              Danh sách đơn hàng ({filteredOrders.length})
            </h5>
            <Button variant="outline-primary" size="sm">
              <i className="bi bi-download me-1"></i>
              Xuất báo cáo
            </Button>
          </div>
        </Card.Header>
        <Card.Body className="p-0">
          {filteredOrders.length > 0 ? (
            <div className="list-group list-group-flush">
              {filteredOrders.map((order, index) => (
                <div key={order.id} className="list-group-item p-4">
                  <Row>
                    <Col lg={8}>
                      {/* Order Header */}
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="mb-2">
                            {order.service}
                            {order.serviceType === 'administrative' && (
                              <Badge bg="warning" text="dark" className="ms-2">Hành chính</Badge>
                            )}
                          </h5>
                          <div className="d-flex align-items-center gap-3 text-muted mb-2">
                            <span>
                              <i className="bi bi-hash me-1"></i>
                              {order.id}
                            </span>
                            <span>
                              <i className="bi bi-calendar me-1"></i>
                              {formatDate(order.orderDate)}
                            </span>
                            {order.completionDate && (
                              <span>
                                <i className="bi bi-check-circle me-1"></i>
                                Hoàn thành: {formatDate(order.completionDate)}
                              </span>
                            )}
                          </div>
                        </div>
                        <div className="text-end">
                          {getStatusBadge(order.status)}
                          <div className="mt-1">
                            {getPaymentStatusBadge(order.paymentStatus)}
                          </div>
                        </div>
                      </div>

                      {/* Order Details */}
                      <Row className="mb-3">
                        <Col sm={6}>
                          <div className="mb-2">
                            <strong className="text-muted small">Người tham gia:</strong>
                            <div className="mt-1">
                              {order.participants.map((participant, idx) => (
                                <Badge key={idx} bg="light" text="dark" className="me-1">
                                  {participant}
                                </Badge>
                              ))}
                            </div>
                          </div>
                        </Col>
                        <Col sm={6}>
                          <div className="mb-2">
                            <strong className="text-muted small">Phương thức thanh toán:</strong>
                            <div className="text-muted">{getPaymentMethodText(order.paymentMethod)}</div>
                          </div>
                        </Col>
                      </Row>

                      {/* Pricing */}
                      <div className="mb-3">
                        <Row>
                          <Col sm={6}>
                            <div className="small">
                              <div className="d-flex justify-content-between">
                                <span>Giá dịch vụ:</span>
                                <span>{formatCurrency(order.amount)}</span>
                              </div>
                              {order.discount > 0 && (
                                <div className="d-flex justify-content-between text-success">
                                  <span>Giảm giá:</span>
                                  <span>-{formatCurrency(order.discount)}</span>
                                </div>
                              )}
                              <hr className="my-1" />
                              <div className="d-flex justify-content-between fw-bold">
                                <span>Tổng thanh toán:</span>
                                <span>{formatCurrency(order.finalAmount)}</span>
                              </div>
                            </div>
                          </Col>
                          <Col sm={6}>
                            {order.rating && (
                              <div className="small">
                                <strong className="text-muted">Đánh giá:</strong>
                                <div className="mt-1">
                                  {Array.from({ length: 5 }, (_, i) => (
                                    <i key={i} className={`bi bi-star${i < order.rating ? '-fill' : ''} text-warning`}></i>
                                  ))}
                                  <span className="ms-1">({order.rating}/5)</span>
                                </div>
                                {order.feedback && (
                                  <div className="text-muted mt-1" style={{ fontSize: '0.8em' }}>
                                    "{order.feedback}"
                                  </div>
                                )}
                              </div>
                            )}
                          </Col>
                        </Row>
                      </div>

                      {/* Notes */}
                      {order.notes && (
                        <Alert variant="info" className="mb-0 py-2">
                          <i className="bi bi-info-circle me-2"></i>
                          <small>{order.notes}</small>
                        </Alert>
                      )}
                    </Col>

                    {/* Actions */}
                    <Col lg={4} className="mt-3 mt-lg-0">
                      <div className="d-grid gap-2">
                        <Button
                          variant="outline-primary"
                          as={Link}
                          to={`/tracking/${order.id}`}
                        >
                          <i className="bi bi-eye me-2"></i>
                          Xem chi tiết
                        </Button>

                        {order.status === 'completed' && (
                          <Button variant="success" as={Link} to="/user/results">
                            <i className="bi bi-download me-2"></i>
                            Tải kết quả
                          </Button>
                        )}

                        {order.invoice && (
                          <Button
                            variant="outline-info"
                            onClick={() => handleViewInvoice(order)}
                          >
                            <i className="bi bi-receipt me-2"></i>
                            Xem hóa đơn
                          </Button>
                        )}

                        {order.status === 'completed' && !order.rating && (
                          <Button variant="outline-warning">
                            <i className="bi bi-star me-2"></i>
                            Đánh giá dịch vụ
                          </Button>
                        )}

                        <Button variant="outline-secondary">
                          <i className="bi bi-arrow-clockwise me-2"></i>
                          Đặt lại dịch vụ này
                        </Button>
                      </div>
                    </Col>
                  </Row>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-inbox text-muted" style={{ fontSize: '4rem' }}></i>
              <h5 className="text-muted mt-3">
                {searchTerm || selectedStatus !== 'all' || selectedPeriod !== 'all'
                  ? 'Không tìm thấy đơn hàng nào'
                  : 'Chưa có đơn hàng nào'
                }
              </h5>
              <p className="text-muted">
                {searchTerm || selectedStatus !== 'all' || selectedPeriod !== 'all'
                  ? 'Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm'
                  : 'Lịch sử đặt hẹn sẽ hiển thị ở đây'
                }
              </p>
              {!searchTerm && selectedStatus === 'all' && selectedPeriod === 'all' && (
                <Button variant="warning" as={Link} to="/appointment">
                  <i className="bi bi-plus-circle me-2"></i>
                  Đặt lịch ngay
                </Button>
              )}
            </div>
          )}
        </Card.Body>
      </Card>

      {/* Invoice Modal */}
      <Modal show={showInvoiceModal} onHide={() => setShowInvoiceModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Hóa đơn điện tử</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <div className="invoice">
              <div className="text-center mb-4">
                <h4>TRUNG TÂM XÉT NGHIỆM ADN</h4>
                <p className="text-muted">123 Đường ABC, Quận XYZ, Hà Nội</p>
                <p className="text-muted">Hotline: 1900 1234 | Email: info@adnlab.vn</p>
                <hr />
                <h5>HÓA ĐƠN DỊCH VỤ</h5>
                <p>Số hóa đơn: <strong>{selectedOrder.invoice}</strong></p>
              </div>

              <Table borderless>
                <tbody>
                  <tr>
                    <td><strong>Khách hàng:</strong></td>
                    <td>{user?.name || 'Nguyễn Văn A'}</td>
                  </tr>
                  <tr>
                    <td><strong>Số điện thoại:</strong></td>
                    <td>{user?.phone || '0123456789'}</td>
                  </tr>
                  <tr>
                    <td><strong>Email:</strong></td>
                    <td>{user?.email || 'nguyenvana@example.com'}</td>
                  </tr>
                  <tr>
                    <td><strong>Ngày đặt hàng:</strong></td>
                    <td>{formatDate(selectedOrder.orderDate)}</td>
                  </tr>
                  <tr>
                    <td><strong>Mã đặt lịch:</strong></td>
                    <td>{selectedOrder.id}</td>
                  </tr>
                </tbody>
              </Table>

              <hr />

              <Table bordered>
                <thead>
                  <tr>
                    <th>Dịch vụ</th>
                    <th>Số lượng</th>
                    <th>Đơn giá</th>
                    <th>Thành tiền</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>{selectedOrder.service}</td>
                    <td>1</td>
                    <td>{formatCurrency(selectedOrder.amount)}</td>
                    <td>{formatCurrency(selectedOrder.amount)}</td>
                  </tr>
                  {selectedOrder.discount > 0 && (
                    <tr>
                      <td colSpan="3" className="text-end"><strong>Giảm giá:</strong></td>
                      <td className="text-success"><strong>-{formatCurrency(selectedOrder.discount)}</strong></td>
                    </tr>
                  )}
                  <tr>
                    <td colSpan="3" className="text-end"><strong>Tổng cộng:</strong></td>
                    <td><strong>{formatCurrency(selectedOrder.finalAmount)}</strong></td>
                  </tr>
                </tbody>
              </Table>

              <div className="mt-4">
                <p><strong>Phương thức thanh toán:</strong> {getPaymentMethodText(selectedOrder.paymentMethod)}</p>
                <p><strong>Trạng thái thanh toán:</strong> {getPaymentStatusBadge(selectedOrder.paymentStatus)}</p>
              </div>

              <div className="text-center mt-4">
                <small className="text-muted">
                  Cảm ơn bạn đã sử dụng dịch vụ của chúng tôi!
                </small>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowInvoiceModal(false)}>
            Đóng
          </Button>
          <Button variant="primary" onClick={() => window.print()}>
            <i className="bi bi-printer me-2"></i>
            In hóa đơn
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default OrderHistory;