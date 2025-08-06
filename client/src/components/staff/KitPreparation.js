import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Alert, Modal, Form, Table, InputGroup } from 'react-bootstrap';
import { getBookingByStaffId, addBookingHistory } from '../../services/api';
import { useNavigate, useParams, Link } from 'react-router-dom';
import Swal from 'sweetalert2';

/**
 * COMPONENT: KitPreparation
 * CHỨC NĂNG: Quản lý chuẩn bị và gửi kit xét nghiệm cho khách hàng
 * LUỒNG HOẠT ĐỘNG:
 * 1. Tải danh sách booking được phân công cho staff từ API getBookingByStaffId()
 * 2. Lọc và map booking thành order với status tương ứng
 * 3. Hiển thị danh sách order với filter và search
 * 4. Cho phép staff thực hiện các hành động: chuẩn bị kit, gửi kit, xác nhận thanh toán
 * 5. Cập nhật status qua API addBookingHistory() và hiển thị thông báo
 */
const KitPreparation = ({ user }) => {
  // ROUTER HOOKS
  const navigate = useNavigate();
  const { bookingId } = useParams(); // Lấy bookingId từ URL nếu có

  // STATE QUẢN LÝ DỮ LIỆU
  const [orders, setOrders] = useState([]); // Danh sách đơn hàng
  const [filteredOrders, setFilteredOrders] = useState([]); // Danh sách đã lọc
  const [searchTerm, setSearchTerm] = useState(''); // Từ khóa tìm kiếm
  const [filterStatus, setFilterStatus] = useState('all'); // Filter theo status

  // STATE QUẢN LÝ UI
  const [alert, setAlert] = useState({ show: false, message: '', type: '' }); // Alert thông báo
  const [showModal, setShowModal] = useState(false); // Hiển thị modal
  const [modalAction, setModalAction] = useState(null); // Loại hành động: 'prepare', 'send', 'confirm'
  const [selectedOrder, setSelectedOrder] = useState(null); // Đơn hàng được chọn
  const [description, setDescription] = useState(''); // Mô tả hành động

  /**
   * EFFECT 1: Tải dữ liệu booking khi component mount hoặc user.id thay đổi
   * BƯỚC 1: Gọi API getBookingByStaffId() để lấy danh sách booking
   * BƯỚC 2: Lọc và map booking thành order với status tương ứng
   * BƯỚC 3: Cập nhật state orders
   */
  useEffect(() => {
    const fetchOrders = async () => {
      try {
        // BƯỚC 1: Lấy danh sách booking từ API
        const bookings = await getBookingByStaffId(user.id);

        // BƯỚC 2: Lọc và map booking thành order
        const filtered = bookings.map(b => {
          // Lấy history và status mới nhất
          const history = Array.isArray(b.bookingHistories_on_booking) ? b.bookingHistories_on_booking : [];
          const sorted = [...history].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

          // BƯỚC 2.1: Xác định status dựa trên history
          let mappedStatus = '';
          const idxSampleReceived = sorted.findIndex(h => h.status === 'SAMPLE_RECEIVED');

          if (idxSampleReceived !== -1 && idxSampleReceived > 0) {
            // Có status SAMPLE_RECEIVED và sau đó còn status khác
            mappedStatus = 'collected';
          } else {
            const latestStatus = sorted[0]?.status?.toUpperCase() || '';

            // BƯỚC 2.2: Map status từ API sang status hiển thị
            if (latestStatus === 'EXPIRED') {
              mappedStatus = 'expired';
            } else if (latestStatus === 'BOOKED') {
              mappedStatus = 'waiting-kit-prep';
            } else if (latestStatus === 'PENDING_PAYMENT') {
              mappedStatus = 'pending-payment';
            } else if (latestStatus === 'CANCELLED') {
              mappedStatus = 'cancelled';
            } else if (latestStatus) {
              mappedStatus = latestStatus.toLowerCase().replaceAll('_', '-');
            } else {
              mappedStatus = 'sample-received'; // Mặc định nếu không xác định
            }

            // BƯỚC 2.3: Validate status hợp lệ
            const validStatuses = ['waiting-kit-prep', 'kit-prepared', 'kit-sent', 'waiting-sample', 'sample-received', 'expired', 'kit-returned', 'pending-payment', 'cancelled'];
            if (!validStatuses.includes(mappedStatus)) mappedStatus = 'sample-received';
          }

          // BƯỚC 2.4: Tạo object order với đầy đủ thông tin
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

        // BƯỚC 3: Cập nhật state
        setOrders(filtered);
      } catch (error) {
        console.error('Lỗi khi lấy đơn hàng cần chuẩn bị kit:', error);
      }
    };

    fetchOrders();
  }, [user.id]);

  /**
   * EFFECT 2: Highlight đơn hàng được chọn từ URL
   * BƯỚC 1: Kiểm tra nếu có bookingId từ URL
   * BƯỚC 2: Tìm và highlight row tương ứng
   */
  useEffect(() => {
    if (bookingId && orders.length > 0) {
      const el = document.getElementById(`order-row-${bookingId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('table-primary');
        setTimeout(() => el.classList.remove('table-primary'), 3000);
      }
    }
  }, [bookingId, orders]);

  /**
   * EFFECT 3: Lọc danh sách order theo search term và filter status
   * BƯỚC 1: Lọc bỏ các đơn quá hạn/đã hủy
   * BƯỚC 2: Lọc theo từ khóa tìm kiếm
   * BƯỚC 3: Lọc theo status được chọn
   * BƯỚC 4: Cập nhật filteredOrders
   */
  useEffect(() => {
    let filtered = orders;

    // BƯỚC 1: Ẩn đơn quá hạn
    filtered = filtered.filter(order => order.status !== 'expired' && order.status !== 'cancelled');

    // BƯỚC 2: Lọc theo search term
    if (searchTerm) {
      filtered = filtered.filter(order =>
        order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        order.phone.includes(searchTerm)
      );
    }

    // BƯỚC 3: Lọc theo status
    if (filterStatus !== 'all') {
      filtered = filtered.filter(order => order.status === filterStatus);
    }

    // BƯỚC 4: Cập nhật state
    setFilteredOrders(filtered);
  }, [searchTerm, filterStatus, orders]);

  /**
   * HELPER FUNCTION: Tạo badge hiển thị status với màu sắc và label tương ứng
   * INPUT: status (string) - trạng thái order
   * OUTPUT: JSX Badge component với màu và text phù hợp
   */
  const getStatusBadge = (status) => {
    if (status === 'collected') {
      return <Badge bg="success">Đã thu mẫu</Badge>;
    }

    // Định nghĩa mapping màu sắc và label cho từng status
    const statusConfig = {
      'waiting-kit-prep': { bg: 'warning', text: 'Chờ chuẩn bị kit' },
      'kit-prepared': { bg: 'danger', text: 'Đã chuẩn bị kit' },
      'kit-sent': { bg: 'primary', text: 'Đã gửi kit' },
      'waiting-sample': { bg: 'secondary', text: 'Chờ nhận mẫu' },
      'sample-received': { bg: 'warning', text: 'Sẵn sàng thu mẫu' },
      expired: { bg: 'danger', text: 'Đã quá hạn' },
      'kit-returned': { bg: 'info', text: 'Đã nhận lại kit' },
      'pending-payment': { bg: 'dark', text: 'Chờ thanh toán' },
      'cancelled': { bg: 'secondary', text: 'Đã hủy' },
    };

    const config = statusConfig[status] || { bg: 'secondary', text: status };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  /**
   * EVENT HANDLER: Mở modal để thực hiện hành động
   * INPUT: action (string) - loại hành động, order (object) - đơn hàng được chọn
   */
  const openActionModal = (action, order) => {
    setSelectedOrder(order);
    setModalAction(action);
    setDescription('');
    setShowModal(true);
  };

  /**
   * EVENT HANDLER: Xác nhận thực hiện hành động
   * BƯỚC 1: Validate dữ liệu đầu vào
   * BƯỚC 2: Xác định status và cập nhật order tương ứng
   * BƯỚC 3: Gọi API addBookingHistory() để cập nhật database
   * BƯỚC 4: Cập nhật state và hiển thị thông báo
   */
  const handleConfirmAction = async () => {
    if (!selectedOrder || !modalAction || !description.trim()) return;

    let status = '';
    let updatedOrders = [];

    try {
      // BƯỚC 1: Xác định status và cập nhật order theo loại hành động
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
      } else if (modalAction === 'prepare-direct') {
        status = 'READY_FOR_SAMPLE';
        updatedOrders = orders.map(o =>
          o.id === selectedOrder.id
            ? {
              ...o,
              status: 'sample-received'
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
      } else if (modalAction === 'prepare-direct1') {
        status = 'PREPARED';
        updatedOrders = orders.map(o =>
          o.id === selectedOrder.id
            ? {
              ...o,
              status: 'sample-received',
            }
            : o
        );
      }

      // BƯỚC 2: Gọi API để cập nhật database
      await handleSubmit(selectedOrder.id, status, description);

      // BƯỚC 3: Cập nhật state
      setOrders(updatedOrders);

      // BƯỚC 4: Hiển thị thông báo thành công
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

  /**
   * HELPER FUNCTION: Gọi API để thêm booking history
   * INPUT: bookingId (string), status (string), description (string)
   * OUTPUT: Promise từ API call
   */
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

  /**
   * HELPER FUNCTION: Format date sang định dạng Việt Nam
   * INPUT: dateString (string) - chuỗi ngày tháng
   * OUTPUT: string - ngày tháng định dạng Việt Nam
   */
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('vi-VN');
  };

  return (
    <div>
      {/* HEADER: Tiêu đề trang */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-box-seam me-2"></i>
            Chuẩn bị và Gửi Kit Test
          </h2>
          <p className="text-muted mb-0">Quản lý việc chuẩn bị và gửi kit xét nghiệm cho khách hàng</p>
        </div>
      </div>

      {/* ALERT: Thông báo lỗi/thành công */}
      {alert.show && (
        <Alert variant={alert.type} onClose={() => setAlert({ show: false, message: '', type: '' })} dismissible>
          {alert.message}
        </Alert>
      )}

      {/* SEARCH AND FILTER: Tìm kiếm và lọc đơn hàng */}
      <Card className="mb-4">
        <Card.Body>
          <Row>
            {/* Search input */}
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

            {/* Status filter */}
            <Col md={6}>
              <Form.Select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="all">Tất cả trạng thái</option>
                <option value="waiting-kit-prep">Chờ chuẩn bị kit</option>
                <option value="kit-prepared">Đã chuẩn bị kit</option>
                <option value="kit-sent">Đã gửi kit</option>
                <option value="kit-return">Đã nhận lại kit</option>
                <option value="sample-received">Sẵn sàng thu mẫu</option>
                <option value="pending-payment">Chờ thanh toán</option>
              </Form.Select>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* ORDERS TABLE: Bảng danh sách đơn hàng */}
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
              {/* Mã đơn hàng */}
              <td>{order.id}</td>

              {/* Thông tin khách hàng */}
              <td>
                <div>{order.customerName}</div>
                <small className="text-muted">{order.phone}</small>
              </td>

              {/* Thông tin dịch vụ */}
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

              {/* Phương thức lấy mẫu */}
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

              {/* Trạng thái */}
              <td>
                <div>{getStatusBadge(order.status)}</div>
              </td>

              {/* Ngày đặt */}
              <td>
                <div>{formatDate(order.orderDate)}</div>
                <small className="text-muted">DK: {formatDate(order.expectedDate)}</small>
              </td>

              {/* Các nút thao tác */}
              <td>
                <div className="d-flex flex-column gap-1">
                  {/* Nút cho trạng thái waiting-kit-prep */}
                  {/* Gom nút chuẩn bị kit cho các trường hợp đặc biệt */}
                  {(
                    (order.status === 'waiting-kit-prep' && order.methodName === 'Nhân viên tới nhà lấy mẫu') ||
                    order.status === 'pending-payment'
                  ) && (
                      <Button
                        size="sm"
                        variant="info"
                        onClick={() => openActionModal('prepare-direct1', order)}
                      >
                        <i className="bi bi-box me-1"></i>
                        Chuẩn bị kit
                      </Button>
                    )}
                  {/* Các trường hợp còn lại giữ nguyên */}
                  {order.status === 'waiting-kit-prep' && order.methodName === 'Lấy mẫu tại nhà' && (
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => openActionModal('prepare', order)}
                    >
                      <i className="bi bi-box me-1"></i>
                      Chuẩn bị kit
                    </Button>
                  )}
                  {order.status === 'waiting-kit-prep' && order.methodName === 'Lấy mẫu tại lab' && (
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => openActionModal('prepare-direct', order)}
                    >
                      <i className="bi bi-box me-1"></i>
                      Chuẩn bị kit
                    </Button>
                  )}

                  {/* Nút cho trạng thái kit-prepared */}
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

                  {/* Nút cho trạng thái kit-returned */}
                  {order.status === 'kit-returned' && (
                    <Button
                      size="sm"
                      variant="primary"
                      onClick={() => openActionModal('confirm', order)}
                    >
                      <i className="bi bi-check-circle me-1"></i>
                      Đã nhận kit
                    </Button>
                  )}

                  {/* Nút cho trạng thái pending-payment */}
                  {/* {order.status === 'pending-payment' && (
                    <Button
                      size="sm"
                      variant="info"
                      onClick={() => openActionModal('prepare-direct1', order)}
                    >
                      <i className="bi bi-box me-1"></i>
                      // {/* <i className="bi bi-cash-coin me-1"></i> */}

                  {/* </Button>
                  )} */}

                  {/* Nút chuyển đến thu mẫu */}
                  {order.status === 'sample-received' && (
                    <Button
                      as={Link}
                      to={`/staff/sample-collection/${order.id}`}
                      variant="warning"
                      size="sm"
                    >
                      <i className="bi bi-arrow-right me-1"></i>
                      Đến thu mẫu
                    </Button>
                  )}

                  {/* Nút bước tiếp theo */}
                  {order.status === 'collected' && (
                    <Button
                      as={Link}
                      to={`/staff/sample-collection/${order.id}`}
                      variant="success"
                      size="sm"
                    >
                      <i className="bi bi-arrow-right me-1"></i>
                      Bước tiếp theo
                    </Button>
                  )}

                  {/* Hiển thị tracking number nếu đã gửi kit */}
                  {order.status === 'kit-sent' && order.trackingNumber && (
                    <Badge bg="success" className="p-2">
                      <i className="bi bi-check-circle me-1"></i>
                      {order.trackingNumber}
                    </Badge>
                  )}
                </div>

                {/* Thông báo chờ khách hàng gửi lại kit */}
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

      {/* MODAL: Xác nhận hành động */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton>
          <Modal.Title>Xác nhận hành động</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Alert variant="info">
            Vui lòng chọn mô tả cho hành động với đơn hàng <strong>{selectedOrder?.id}</strong>
          </Alert>
          <Form.Group className="mt-3">
            <Form.Label>Chọn mô tả (bắt buộc)</Form.Label>
            <div className="mt-2">
              {/* Radio buttons cho từng loại hành động */}
              {modalAction === 'prepare-direct1' ? (
                <>
                  <Form.Check
                    type="radio"
                    id="payment-cash"
                    name="description"
                    label="Đã chuẩn bị kit"
                    value="Đã chuẩn bị kit"
                    checked={description === "Đã chuẩn bị kit"}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mb-2"
                  />
                </>
              ) : modalAction === 'prepare' ? (
                <>
                  <Form.Check
                    type="radio"
                    id="prepare-pack"
                    name="description"
                    label="Đã chuẩn bị kit và đóng gói cẩn thận"
                    value="Đã chuẩn bị kit và đóng gói cẩn thận"
                    checked={description === "Đã chuẩn bị kit và đóng gói cẩn thận"}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mb-2"
                  />
                </>
              ) : modalAction === 'send' ? (
                <>
                  <Form.Check
                    type="radio"
                    id="send-jt"
                    name="description"
                    label="Đã gửi kit cho khách hàng"
                    value="Đã gửi kit cho khách hàng"
                    checked={description === "Đã gửi kit cho khách hàng"}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mb-2"
                  />
                </>
              ) : modalAction === 'prepare-direct' ? (
                <>
                  <Form.Check
                    type="radio"
                    id="direct-check"
                    name="description"
                    label="Đã chuẩn bị kit"
                    value="Đã chuẩn bị kit"
                    checked={description === "Đã chuẩn bị kit"}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mb-2"
                  />
                </>
              ) : (
                <>
                  <Form.Check
                    type="radio"
                    id="receive-kit"
                    name="description"
                    label="Đã nhận kit từ khách hàng"
                    value="Đã nhận kit từ khách hàng"
                    checked={description === "Đã nhận kit từ khách hàng"}
                    onChange={(e) => setDescription(e.target.value)}
                    className="mb-2"
                  />
                </>
              )}
            </div>
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>Hủy</Button>
          <Button variant="success" disabled={!description} onClick={handleConfirmAction}>
            <i className="bi bi-check-circle me-2"></i>
            Xác nhận
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default KitPreparation;