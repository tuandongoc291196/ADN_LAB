import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Alert, Modal, Form, Table, InputGroup } from 'react-bootstrap';
import { getBookingByStaffId, addBookingHistory } from '../../services/api';
const KitPreparation = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showReturnConfirmModal, setShowReturnConfirmModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnLoading, setReturnLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // API cho các đơn hàng cần chuẩn bị kit
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const bookings = await getBookingByStaffId(user.id);

        const filtered = bookings
          .filter(b => b.method?.name === 'Lấy mẫu tại nhà')
          .map(b => {
            // Tìm status mới nhất từ history (nếu có)
            const history = Array.isArray(b.bookingHistories_on_booking) ? b.bookingHistories_on_booking : [];
            const sorted = [...history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const latestStatus = sorted[0]?.status || 'waiting-kit-prep';

            return {
              id: b.id,
              customerName: b.informations_on_booking?.[0]?.name || 'Không rõ',
              phone: b.informations_on_booking?.[0]?.phone || '',
              service: b.service?.title || 'Không rõ dịch vụ',
              serviceType: b.service?.category?.hasLegalValue ? 'civil' : 'administrative',
              status: latestStatus === 'BOOKED'
                ? 'waiting-kit-prep'
                : latestStatus.toLowerCase().replaceAll('_', '-'),
              orderDate: b.createdAt,
              expectedDate: b.timeSlotId?.split('_')[0], // Lấy ngày từ slot ID
              returnInfo: b.returnInfo || null,
              trackingNumber: b.trackingNumber || null,
              specialInstructions: b.specialInstructions || null
            };
          });

        setOrders(filtered);
      } catch (error) {
        console.error('Lỗi khi lấy đơn hàng cần chuẩn bị kit:', error);
      }
    };

    fetchOrders();
  }, [user.id]);

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
      'waiting-kit-prep': { bg: 'warning', text: 'Chờ chuẩn bị kit' },
      'kit-prepared': { bg: 'danger', text: 'Đã chuẩn bị kit' },
      'kit-sent': { bg: 'primary', text: 'Đã gửi kit' },
      'waiting-sample': { bg: 'secondary', text: 'Chờ nhận mẫu' },
      'sample-received': { bg: 'success', text: 'Đã nhận mẫu' }
    };

    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const handleSubmit = async (bookingId, status, description) => {
    try {
      const payload = {
        bookingId: bookingId,
        status: status,         // ví dụ: 'KIT_SENT', 'KIT_PREPARED', etc.
        description: description        // mô tả cụ thể như 'Đã gửi kit qua J&T'
      };

      const res = await addBookingHistory(payload);
      console.log('✅ Booking history added:', res);

      alert('Thêm lịch sử thành công!');
    } catch (err) {
      console.error('❌ Lỗi khi thêm booking history:', err);
      alert('Có lỗi xảy ra khi thêm trạng thái!');
    }
  };

  const handlePrepareKit = async (order) => {
    try {
      // 1. Cập nhật trạng thái UI
      const updatedOrders = orders.map(o =>
        o.id === order.id
          ? {
            ...o,
            status: 'kit-prepared',
            preparedBy: user.name,
            preparedDate: new Date().toLocaleString('vi-VN'),
            trackingNumber: 'VTP' + Date.now().toString().slice(-9)
          }
          : o
      );
      setOrders(updatedOrders);

      // 2. Gửi vào lịch sử backend
      await handleSubmit(order.id, 'KIT_PREPARED', 'Đã chuẩn bị kit');

      // 3. Thông báo
      setAlert({
        show: true,
        message: `Đã chuẩn bị kit cho đơn ${order.id}`,
        type: 'success'
      });

    } catch (err) {
      setAlert({
        show: true,
        message: `Có lỗi khi chuẩn bị kit cho đơn ${order.id}`,
        type: 'danger'
      });
    }
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
    handleSubmit(orderId, 'KIT_SENT', 'Đã gửi kit cho khách hàng');

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

  // Hàm xác nhận nhận kit
  const handleConfirmKitReturn = async (orderId) => {
    setReturnLoading(true);
    try {
      // Cập nhật trạng thái đơn hàng
      const updatedOrders = orders.map(order => {
        if (order.id === orderId) {
          return {
            ...order,
            status: 'ready-for-collection', // Chuyển sang trạng thái sẵn sàng thu mẫu
            receivedDate: new Date().toISOString(),
            receivedBy: 'NV001', // ID nhân viên thực tế
            kitReturnConfirmed: true,
            nextStep: 'sample-collection' // Bước tiếp theo
          };
        }
        return order;
      });
      setOrders(updatedOrders);
      handleSubmit(orderId, 'KIT_RETURNED', 'Đã nhận lại kit từ khách hàng');

      // Hiển thị thông báo thành công với hướng dẫn bước tiếp theo
      setAlert({
        show: true,
        type: 'success',
        message: `Đã xác nhận nhận kit thành công! Đơn hàng ${orderId} đã chuyển sang bước thu mẫu.`
      });
    } catch (error) {
      // Hiển thị thông báo lỗi
      setAlert({
        show: true,
        type: 'danger',
        message: 'Có lỗi xảy ra khi xác nhận nhận kit!'
      });
    } finally {
      setReturnLoading(false);
      setShowReturnConfirmModal(false);
    }
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
        <Alert variant={alert.type} onClose={() => setAlert({ show: false, message: '', type: '' })} dismissible>
          {alert.message}
        </Alert>
      )}

      {/* Search and Filter */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            <Col md={6}>
              <InputGroup>
                <InputGroup.Text>
                  <i className="bi bi-search"></i>
                </InputGroup.Text>
                <Form.Control
                  placeholder="Tìm kiếm theo mã đơn, tên khách hàng..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </InputGroup>
            </Col>
            <Col md={6}>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="waiting-kit-prep">Chờ chuẩn bị kit</option>
                <option value="kit-prepared">Đã chuẩn bị kit</option>
                <option value="kit-sent">Đã gửi kit</option>
                <option value="waiting-sample">Chờ nhận mẫu</option>
                <option value="sample-received">Đã nhận mẫu</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Orders Table */}
      <Table responsive hover className="align-middle">
        <thead>
          <tr>
            <th>Mã đơn</th>
            <th>Khách hàng</th>
            <th>Dịch vụ</th>
            <th>Trạng thái</th>
            <th>Ngày đặt</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map(order => (
            <tr key={order.id}>
              <td>{order.id}</td>
              <td>
                <div>{order.customerName}</div>
                <small className="text-muted">{order.phone}</small>
              </td>
              <td>
                <div>{order.service}</div>
                <div>
                  <span
                    className={`badge rounded-pill ${order.serviceType === 'civil'
                      ? 'bg-success text-white'
                      : 'bg-warning text-dark'
                      }`}
                  >
                    {order.serviceType === 'civil' ? 'Dân sự' : 'Hành chính'}
                  </span>
                </div>
              </td>
              <td>
                <div>{getStatusBadge(order.status)}</div>
              </td>
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
                  {order.status === 'kit-sent' && order.returnInfo && (
                    <Button
                      variant="info"
                      size="sm"
                      onClick={() => {
                        setSelectedOrder(order);
                        setShowReturnConfirmModal(true);
                      }}
                    >
                      <i className="bi bi-box-arrow-in-down me-1"></i>
                      Xác nhận nhận kit
                    </Button>
                  )}
                  {order.status === 'ready-for-collection' && (
                    <Button
                      variant="success"
                      size="sm"
                      onClick={() => {
                        setAlert({
                          show: true,
                          type: 'info',
                          message: `Đơn hàng ${order.id} đã sẵn sàng thu mẫu. Vui lòng chuyển sang module Thu mẫu để tiếp tục.`
                        });
                      }}
                    >
                      <i className="bi bi-arrow-right me-1"></i>
                      Chuyển thu mẫu
                    </Button>
                  )}
                  {order.status === 'kit-sent' && order.trackingNumber && (
                    <Badge bg="success" className="p-2">
                      <i className="bi bi-check-circle me-1"></i>
                      {order.trackingNumber}
                    </Badge>
                  )}
                </div>
                {order.status === 'kit-sent' && !order.returnInfo && (
                  <div className="mt-2">
                    <small className="text-muted">
                      <i className="bi bi-info-circle me-1"></i>
                      Đang chờ khách hàng gửi lại kit
                    </small>
                  </div>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </Table>

      {/* Kit Return Confirmation Modal */}
      <Modal show={showReturnConfirmModal} onHide={() => setShowReturnConfirmModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-box-arrow-in-down me-2"></i>
            Xác nhận nhận lại kit
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <p>Bạn có chắc chắn muốn xác nhận đã nhận lại kit từ đơn hàng <strong>{selectedOrder?.id}</strong>?</p>
          {selectedOrder?.returnInfo && (
            <div className="mt-3">
              <h6>Thông tin gửi lại kit:</h6>
              <ul className="list-unstyled">
                <li><strong>Mã vận chuyển:</strong> {selectedOrder.returnInfo.trackingNumber}</li>
                <li><strong>Đơn vị vận chuyển:</strong> {selectedOrder.returnInfo.carrier}</li>
                <li><strong>Ngày gửi:</strong> {new Date(selectedOrder.returnInfo.returnDate).toLocaleDateString('vi-VN')}</li>
                {selectedOrder.returnInfo.note && (
                  <li><strong>Ghi chú:</strong> {selectedOrder.returnInfo.note}</li>
                )}
              </ul>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowReturnConfirmModal(false)}>
            Hủy
          </Button>
          <Button
            variant="primary"
            onClick={() => handleConfirmKitReturn(selectedOrder.id)}
            disabled={returnLoading}
          >
            {returnLoading ? (
              <>
                <span className="spinner-border spinner-border-sm me-2" role="status"></span>
                Đang xử lý...
              </>
            ) : (
              <>
                <i className="bi bi-box-arrow-in-down me-2"></i>
                Xác nhận đã nhận kit
              </>
            )}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KitPreparation;