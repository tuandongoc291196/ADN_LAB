import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Alert, Modal, Form, Table, InputGroup } from 'react-bootstrap';
import { getBookingByStaffId, addBookingHistory } from '../../services/api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';
const KitPreparation = ({ user }) => {
  const [orders, setOrders] = useState([]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null); // 'prepare', 'send', 'confirm'
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [description, setDescription] = useState('');
  const navigate = useNavigate();
  const { bookingId } = useParams(); // Assuming you might need this for routing or fetching specific order details

  // API cho các đơn hàng cần chuẩn bị kit
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const bookings = await getBookingByStaffId(user.id);

        const filtered = bookings

          .map(b => {
            // Tìm status mới nhất từ history (nếu có)
            const history = Array.isArray(b.bookingHistories_on_booking) ? b.bookingHistories_on_booking : [];
            const sorted = [...history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const latestStatus = sorted[0]?.status?.toUpperCase() || '';
            let mappedStatus = '';
            if (latestStatus === 'EXPIRED') {
              mappedStatus = 'expired';
            } else if (latestStatus === 'BOOKED') {
              mappedStatus = 'waiting-kit-prep';
            } else if (latestStatus === 'PENDING_PAYMENT') {
              mappedStatus = 'pending-payment';
            } else if (latestStatus) {
              mappedStatus = latestStatus.toLowerCase().replaceAll('_', '-');
            } else {
              mappedStatus = 'sample-received'; // Mặc định nếu không xác định
            }
            // Nếu mappedStatus rỗng hoặc không nằm trong statusConfig thì cũng gán 'sample-received'
            const validStatuses = ['waiting-kit-prep', 'kit-prepared', 'kit-sent', 'waiting-sample', 'sample-received', 'expired', 'kit-returned', 'pending-payment'];
            if (!validStatuses.includes(mappedStatus)) mappedStatus = 'sample-received';
            return {
              id: b.id,
              customerName: b.informations_on_booking?.[0]?.name || 'Không rõ',
              phone: b.informations_on_booking?.[0]?.phone || '',
              service: b.service?.title || 'Không rõ dịch vụ',
              serviceType: b.service?.category?.hasLegalValue ? 'civil' : 'administrative',
              methodName: b.method?.name || 'Không rõ',
              status: mappedStatus,
              orderDate: b.createdAt,
              expectedDate: b.timeSlotId?.split('_')[0],
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

  useEffect(() => {
    if (bookingId && orders.length > 0) {
      // Optionally scroll to or highlight the order row
      const el = document.getElementById(`order-row-${bookingId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('table-primary');
        setTimeout(() => el.classList.remove('table-primary'), 2000);
      }
    }
  }, [bookingId, orders]);

  // Filter orders based on search and status
  useEffect(() => {
    let filtered = orders;

    // Ẩn đơn quá hạn
    filtered = filtered.filter(order => order.status !== 'expired');

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
      'sample-received': { bg: 'success', text: 'Đã nhận mẫu' },
      expired: { bg: 'danger', text: 'Đã quá hạn' },
      'kit-returned': { bg: 'info', text: 'Đã nhận lại kit' },
      'pending-payment': { bg: 'dark', text: 'Chờ thanh toán' },
    };

    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const openActionModal = (action, order) => {
    setSelectedOrder(order);
    setModalAction(action);
    setDescription('');
    setShowModal(true);
  };

  const handleConfirmAction = async () => {
    if (!selectedOrder || !modalAction || !description.trim()) return;
    let status = '';
    let updatedOrders = [];

    try {
      if (modalAction === 'prepare') {
        status = 'KIT_PREPARED';
        updatedOrders = orders.map(o =>
          o.id === selectedOrder.id
            ? {
              ...o,
              status: 'kit-prepared',
              preparedBy: user.name,
              preparedDate: new Date().toLocaleString('vi-VN'),
              trackingNumber: 'VTP' + Date.now().toString().slice(-9)
            }
            : o
        );
      } else if (modalAction === 'send') {
        status = 'KIT_SENT';
        updatedOrders = orders.map(o =>
          o.id === selectedOrder.id
            ? {
              ...o,
              status: 'kit-sent',
              sentDate: new Date().toLocaleString('vi-VN'),
              estimatedDelivery: new Date(Date.now() + 24 * 60 * 60 * 1000).toLocaleDateString('vi-VN')
            }
            : o
        );
      } else if (modalAction === 'confirm') {
        status = 'SAMPLE_RECEIVED';
        updatedOrders = orders.map(o =>
          o.id === selectedOrder.id
            ? {
              ...o,
              status: 'sample-received'
            }
            : o
        );
      } else if (modalAction === 'confirm-payment') {
        status = 'PAID'; // hoặc status bạn dùng cho đã thanh toán
        updatedOrders = orders.map(o =>
          o.id === selectedOrder.id
            ? {
              ...o,
              status: 'paid'
            }
            : o
        );
      }

      await handleSubmit(selectedOrder.id, status, description);
      setOrders(updatedOrders);

      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: `Đã cập nhật đơn hàng ${selectedOrder.id}`,
        confirmButtonColor: '#198754'
      });
    } catch (err) {
      console.error('Lỗi khi xử lý hành động:', err);
      Swal.fire({
        icon: 'error',
        title: 'Lỗi!',
        text: 'Không thể cập nhật đơn hàng. Vui lòng thử lại.',
        confirmButtonColor: '#d33'
      });
    } finally {
      setShowModal(false);
    }
  };
  const handleSubmit = async (bookingId, status, description) => {
    try {
      const payload = {
        bookingId: bookingId,
        status: status,         // ví dụ: 'KIT_SENT', 'KIT_PREPARED', etc.
        description: description        // mô tả cụ thể như 'Đã gửi kit qua J&T'
      };

      const res = await addBookingHistory(payload);
      console.log('Booking history added:', res);


    } catch (err) {
      console.error('Lỗi khi thêm booking history:', err);

    }
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
                <option value="waiting-kit">Chờ nhận lại kit</option>
                <option value="kit-received">Đã nhận mẫu</option>
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
            <th>Phương thức</th>
            <th>Trạng thái</th>
            <th>Ngày đặt</th>
            <th>Thao tác</th>
          </tr>
        </thead>
        <tbody>
          {filteredOrders.map((order) => (
            <tr key={order.id} id={`order-row-${order.id}`}>
              <td>{order.id}</td>
              <td>
                <div>{order.customerName}</div>
                <small className="text-muted">{order.phone}</small>
              </td>
              <td>
                <div>{order.service}</div>
                <div>
                  <span
                    className={`badge rounded-pill ${order.serviceType === 'administrative'
                      ? 'bg-success text-white'
                      : 'bg-warning text-dark'
                      }`}
                  >
                    {order.serviceType === 'administrative' ? 'Dân sự' : 'Hành chính'}
                  </span>
                </div>
              </td>
              <td>
                {order.methodName === 'Lấy mẫu tại lab' ? (
                  <span className="badge rounded-pill bg-primary" style={{ fontSize: '13px', fontWeight: 500 }}>
                    <i className="bi bi-buildings me-1"></i>Lấy mẫu tại lab
                  </span>
                ) : order.methodName === 'Lấy mẫu tại nhà' ? (
                  <span className="badge rounded-pill bg-success" style={{ fontSize: '13px', fontWeight: 500 }}>
                    <i className="bi bi-house-door me-1"></i>Lấy mẫu tại nhà
                  </span>
                ) : order.methodName === 'Nhân viên tới nhà lấy mẫu' ? (
                  <span className="badge rounded-pill bg-warning text-dark" style={{ fontSize: '13px', fontWeight: 500 }}>
                    <i className="bi bi-truck me-1"></i>Nhân viên tới nhà lấy mẫu
                  </span>
                ) : (
                  <span className="badge rounded-pill bg-secondary" style={{ fontSize: '13px', fontWeight: 500 }}>
                    {order.methodName || 'Không rõ'}
                  </span>
                )}
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
                      onClick={() => openActionModal('prepare', order)}
                    >
                      <i className="bi bi-box me-1"></i>
                      Chuẩn bị
                    </Button>
                  )}
                  {order.status === 'kit-prepared' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => openActionModal('send', order)}
                    >
                      <i className="bi bi-truck me-1"></i>
                      Gửi Kit
                    </Button>
                  )}
                  {order.status === 'kit-returned' && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => openActionModal('confirm', order)}
                    >
                      <i className="bi bi-check-circle me-1"></i>
                      Đã nhận kit
                    </Button>
                  )}
                  {order.status === 'pending-payment' && (
                    <Button
                      size="sm"
                      variant="success"
                      onClick={() => openActionModal('confirm-payment', order)}
                    >
                      <i className="bi bi-cash-coin me-1"></i>
                      Xác nhận đã thanh toán
                    </Button>
                  )}

                  {order.status === 'sample-received' && (
                    <Button
                      as={Link}
                      to={`/staff/sample-collection/${order.id}`}
                      variant="info"
                      size="sm"
                    >
                      <i className="bi bi-arrow-right me-1"></i>
                      Đến thu mẫu
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
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận hành động</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            Vui lòng nhập mô tả cho hành động với đơn hàng <strong>{selectedOrder?.id}</strong>
          </Alert>
          <Form.Group className="mt-3">
            <Form.Label>Mô tả (bắt buộc)</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              placeholder="Ví dụ: Đã chuẩn bị kit và kiểm tra mã vận đơn"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="success" disabled={!description.trim()} onClick={handleConfirmAction}>
            <i className="bi bi-check-circle me-2"></i>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KitPreparation;