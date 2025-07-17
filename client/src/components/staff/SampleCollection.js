import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Alert, Modal, Form, Table, InputGroup, Tabs, Tab } from 'react-bootstrap';
import { getBookingByStaffId, addBookingHistory, getSamplesByBookingId, updateSample } from '../../services/api';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';

const SampleCollection = ({ user }) => {
  const [samples, setSamples] = useState([]);
  const [filteredSamples, setFilteredSamples] = useState([]);
  const [showCollectionModal, setShowCollectionModal] = useState(false);
  const [selectedSample, setSelectedSample] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });
  const [collectionData, setCollectionData] = useState({
    collectionTime: '',
    collectorName: '',
    sampleQuality: 'good',
    participants: [],
    notes: '',
    photos: []
  });
  const { bookingId } = useParams(); // Assuming you might need this for routing or fetching specific order details
  const [activeTab, setActiveTab] = useState('pending');
  const navigate = useNavigate();

  // Lấy danh sách mẫu cần thu từ API
  useEffect(() => {
    const fetchSamples = async () => {
      try {
        const bookings = await getBookingByStaffId(user.id);

        const mappedSamples = bookings
          .filter(b => {
            // Nếu là phương thức lấy mẫu tại nhà thì chỉ hiện nếu bookingHistories_on_booking có sample_received
            if (b.method?.name?.toLowerCase() === 'lấy mẫu tại nhà') {
              return Array.isArray(b.bookingHistories_on_booking)
                ? b.bookingHistories_on_booking.some(h => h.status?.toLowerCase() === 'sample_received')
                : false;
            }
            return true;
          })
          .map(b => {
            const histories = Array.isArray(b.bookingHistories_on_booking) ? b.bookingHistories_on_booking : [];
            const hasSampleReceived = histories.some(h => h.status?.toLowerCase() === 'sample_received');
            // Lấy status mới nhất
            const sorted = [...histories].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            const latestStatus = sorted[0]?.status?.toUpperCase() || '';
            let status = (() => {
              if (latestStatus === 'EXPIRED') return 'overdue';
              if (histories.some(h => h.status?.toUpperCase() === 'SAMPLE_COLLECTED')) return 'collected';
              if (histories.some(h => h.status?.toUpperCase() === 'SAMPLE_RECEIVED')) return 'kit-returned';
              const fallbackStatus = b.status?.toUpperCase() || 'SCHEDULED';
              return fallbackStatus.toLowerCase().replaceAll('_', '-');
            })();
            return {
              id: b.id,
              customerName: b.informations_on_booking?.[0]?.name || 'Không rõ',
              phone: b.informations_on_booking?.[0]?.phone || '',
              service: b.service?.title || 'Không rõ dịch vụ',
              serviceType: b.service?.category?.hasLegalValue ? 'civil' : 'administrative',
              address: b.informations_on_booking?.[0]?.address || '',
              scheduledTime: b.timeSlotId?.split('_')[0] || '',
              participants: b.participants_on_booking || [],
              status: status,
              orderDate: b.createdAt,
              returnedDate: b.returnedDate || '',
              collectedBy: b.collectedBy || '',
              collectedDate: b.collectedDate || '',
              methodName: b.method?.name || 'Không rõ',
              showSampleButton: hasSampleReceived
            };
          });

        setSamples(mappedSamples);
        setFilteredSamples(mappedSamples);
      } catch (error) {
        setAlert({ show: true, message: 'Không thể tải danh sách mẫu!', type: 'danger' });
      }
    };

    fetchSamples();
  }, [user.id]);

  useEffect(() => {
    if (bookingId && samples.length > 0) {
      // Optionally scroll to or highlight the sample row
      const el = document.getElementById(`sample-row-${bookingId}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.add('table-primary');
        setTimeout(() => el.classList.remove('table-primary'), 2000);
      }
    }
  }, [bookingId, samples]);

  // Filter samples based on search and status
  useEffect(() => {
    let filtered = samples;

    // Ẩn đơn quá hạn chỉ dựa vào status
    filtered = filtered.filter(sample => sample.status !== 'overdue');

    if (searchTerm) {
      filtered = filtered.filter(sample =>
        sample.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        sample.phone.includes(searchTerm)
      );
    }

    if (filterStatus !== 'all') {
      filtered = filtered.filter(sample => sample.status === filterStatus);
    }

    setFilteredSamples(filtered);
  }, [searchTerm, filterStatus, samples]);

  // Chia mẫu thành 2 nhóm
  const pendingSamples = filteredSamples.filter(s => s.status !== 'collected');
  const completedSamples = filteredSamples.filter(s => s.status === 'collected');

  const getStatusBadge = (status) => {
    const statusConfig = {
      'scheduled': { bg: 'warning', text: 'Đã lên lịch' },
      'waiting-arrival': { bg: 'info', text: 'Chờ khách đến' },
      'kit-returned': { bg: 'primary', text: 'Chờ thu mẫu' },
      'collecting': { bg: 'secondary', text: 'Đang thu mẫu' },
      'collected': { bg: 'success', text: 'Đã thu mẫu' },
      'transferred': { bg: 'dark', text: 'Đã chuyển lab' },
      'overdue': { bg: 'danger', text: 'Quá hạn' }
    };
    const config = statusConfig[status] || { bg: 'secondary', text: 'Không xác định' };
    return <Badge bg={config.bg}>{config.text}</Badge>;
  };

  const handleStartCollection = (sample) => {
    setSelectedSample(sample);
    getSamplesByBookingId(sample.id).then(samplesList => {
      setCollectionData({
        collectionTime: new Date().toISOString().slice(0, 16),
        collectorName: user.name || '',
        samples: samplesList.map(s => ({
          ...s,
          sampleQuality: s.sampleQuality || '',
          sampleConcentration: s.sampleConcentration || '',
          notes: s.notes || ''
        })),
        notes: '',
        photos: []
      });
      setShowCollectionModal(true);
    });
  };

  const handleCompleteCollection = () => {
    // Gọi updateSample cho từng mẫu và addBookingHistory cho booking
    Promise.all([
      Promise.all(
        (collectionData.samples || []).map(sample =>
          updateSample({
            sampleId: sample.id || sample.sampleId,
            sampleQuality: sample.sampleQuality,
            sampleConcentration: parseFloat(sample.sampleConcentration),
            notes: sample.notes
          })
        )
      ),
      addBookingHistory({
        bookingId: selectedSample.id,
        status: 'SAMPLE_COLLECTED',
        description: 'description'
      })
    ]).then(() => {
      const updatedSamples = samples.map(sample =>
        sample.id === selectedSample.id
          ? {
            ...sample,
            status: 'collected',
            collectedBy: user.name,
            collectedDate: new Date().toLocaleString('vi-VN'),
            collectionDetails: collectionData,
            showSampleButton: false // Ẩn nút thu mẫu sau khi đã thu
          }
          : sample
      );
      setSamples(updatedSamples);
      setShowCollectionModal(false);
      setSelectedSample(null);
      // Hiện swal, sau khi bấm OK mới chuyển tab và scroll
      Swal.fire({
        icon: 'success',
        title: 'Thành công!',
        text: `Thu mẫu cho đơn hàng ${selectedSample.id} đã hoàn tất thành công!`,
        confirmButtonText: 'OK',
        confirmButtonColor: '#198754'
      }).then(() => {
        setActiveTab('completed');
        setTimeout(() => {
          const el = document.getElementById(`sample-row-${selectedSample.id}`);
          if (el) {
            el.scrollIntoView({ behavior: 'smooth', block: 'center' });
            el.classList.add('table-primary');
            setTimeout(() => el.classList.remove('table-primary'), 2000);
          }
        }, 400);
      });
    }).catch(() => {
      setAlert({
        show: true,
        message: `Có lỗi khi cập nhật mẫu hoặc trạng thái booking!`,
        type: 'danger'
      });
      setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
    });
  };

  const handleTransferToLab = (sampleId) => {
    const updatedSamples = samples.map(sample =>
      sample.id === sampleId
        ? {
          ...sample,
          status: 'transferred',
          transferredDate: new Date().toLocaleString('vi-VN'),
          transferredBy: user.name
        }
        : sample
    );
    setSamples(updatedSamples);

    setAlert({
      show: true,
      message: `Mẫu ${sampleId} đã được chuyển về phòng lab thành công!`,
      type: 'success'
    });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 1000);
    navigate(`/staff/lab-testing/${sampleId}`);
  };

  const handleMarkSampleReceived = async (bookingId) => {
    try {
      await addBookingHistory({
        bookingId,
        status: 'SAMPLE_RECEIVED',
        description: 'Kit đã được nhận bởi nhân viên hoặc khách'
      });

      // Cập nhật lại danh sách samples
      const updated = samples.map(sample =>
        sample.id === bookingId
          ? { ...sample, status: 'kit-returned' }
          : sample
      );

      setSamples(updated);
      setAlert({
        show: true,
        message: `Đã xác nhận Kit đã nhận cho đơn hàng ${bookingId}`,
        type: 'success'
      });
      setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
    } catch (error) {
      setAlert({
        show: true,
        message: `Lỗi khi cập nhật trạng thái SAMPLE_RECEIVED`,
        type: 'danger'
      });
    }
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('vi-VN');
  };

  return (
    <div>
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="mb-1">
            <i className="bi bi-droplet me-2"></i>
            Thu mẫu và Cập nhật Trạng thái
          </h2>
          <p className="text-muted mb-0">Quản lý việc thu thập mẫu xét nghiệm từ khách hàng</p>
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
              <Form.Label>Tìm kiếm</Form.Label>
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
                <option value="scheduled">Đã lên lịch</option>
                <option value="waiting-arrival">Chờ khách đến</option>
                <option value="kit-returned">Kit đã về</option>
                <option value="collecting">Đang thu mẫu</option>
                <option value="collected">Đã thu mẫu</option>
                <option value="transferred">Đã chuyển lab</option>
                <option value="overdue">Quá hạn</option>
              </Form.Select>
            </Col>
            <Col lg={3} className="mb-3 d-flex align-items-end">
              <div className="w-100">
                <Badge bg="primary" className="me-2">
                  Cần thu: {samples.filter(s => ['scheduled', 'waiting-arrival', 'kit-returned'].includes(s.status)).length}
                </Badge>
                <Badge bg="success">
                  Đã thu mẫu: {samples.filter(s => s.status === 'collected').length}
                </Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Tabs */}
      <Tabs activeKey={activeTab} onSelect={setActiveTab} className="mb-3">
        <Tab eventKey="pending" title={<span><i className="bi bi-list-ol me-2"></i>Đang chờ</span>}>
          {/* Table cho mẫu chưa thu */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Danh sách mẫu cần thu ({pendingSamples.length})</h5>
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
                      <th>Phương thức</th>
                      <th>Thời gian</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {pendingSamples.map((sample) => (
                      <tr key={sample.id} id={`sample-row-${sample.id}`}>
                        <td>
                          <div className="">{sample.id}</div>
                          <small className="text-muted">{sample.participants.length} người</small>
                        </td>
                        <td>
                          <div className="">{sample.customerName}</div>
                          <small className="text-muted">{sample.phone}</small>
                        </td>
                        <td>
                          <div>{sample.service}</div>
                          <span
                            className={`badge rounded-pill ${sample.serviceType === 'civil' ? 'bg-warning text-dark' : 'bg-success text-white'}`}
                            style={{ fontSize: '12px', fontWeight: 500 }}
                          >
                            {sample.serviceType === 'civil' ? 'Hành chính' : 'Dân sự'}
                          </span>
                        </td>
                        <td>
                          {sample.methodName === 'Lấy mẫu tại lab' ? (
                            <span className="badge rounded-pill bg-primary" style={{ fontSize: '13px', fontWeight: 500 }}>
                              <i className="bi bi-buildings me-1"></i>Lấy mẫu tại lab
                            </span>
                          ) : sample.methodName === 'Lấy mẫu tại nhà' ? (
                            <span className="badge rounded-pill bg-success" style={{ fontSize: '13px', fontWeight: 500 }}>
                              <i className="bi bi-house-door me-1"></i>Lấy mẫu tại nhà
                            </span>
                          ) : sample.methodName === 'Nhân viên tới nhà lấy mẫu' ? (
                            <span className="badge rounded-pill bg-warning text-dark" style={{ fontSize: '13px', fontWeight: 500 }}>
                              <i className="bi bi-truck me-1"></i>Nhân viên tới nhà lấy mẫu
                            </span>
                          ) : (
                            <span className="badge rounded-pill bg-secondary" style={{ fontSize: '13px', fontWeight: 500 }}>
                              {sample.methodName || 'Không rõ'}
                            </span>
                          )}
                        </td>
                        <td>
                          <div>{formatDateTime(sample.scheduledTime)}</div>
                          {sample.returnedDate && (
                            <small className="text-success">Về: {formatDateTime(sample.returnedDate)}</small>
                          )}
                        </td>
                        <td>
                          {getStatusBadge(sample.status)}
                        </td>
                        <td>
                          <div className="d-flex flex-column gap-1">
                            {sample.status !== 'collected' && sample.status !== 'transferred' && sample.showSampleButton && sample.status !== 'overdue' && (
                              <Button
                                size="sm"
                                variant="success"
                                onClick={() => handleStartCollection(sample)}
                              >
                                <i className="bi bi-droplet me-1"></i>
                                Thu mẫu
                              </Button>
                            )}
                            {sample.status === 'scheduled' && sample.methodName !== 'Lấy mẫu tại nhà' && sample.status !== 'overdue' && (
                              <Button
                                size="sm"
                                variant="warning"
                                onClick={() => handleMarkSampleReceived(sample.id)}
                              >
                                <i className="bi bi-box-arrow-in-down me-1"></i>
                                Xác nhận
                              </Button>
                            )}
                            {sample.status === 'collected' && (
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleTransferToLab(sample.id)}
                              >
                                <i className="bi bi-arrow-right me-1"></i>
                                Chuyển lab
                              </Button>
                            )}
                            {sample.status === 'transferred' && (
                              <Badge bg="success" className="p-2">
                                <i className="bi bi-check-circle me-1"></i>
                                Hoàn tất
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
        </Tab>
        <Tab eventKey="completed" title={<span><i className="bi bi-check-circle me-2"></i>Đã Thu Mẫu</span>}>
          {/* Table cho mẫu đã thu */}
          <Card className="shadow-sm">
            <Card.Header className="bg-light">
              <div className="d-flex justify-content-between align-items-center">
                <h5 className="mb-0">Danh sách mẫu đã thu ({completedSamples.length})</h5>
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
                      <th>Phương thức</th>
                      <th>Thời gian</th>
                      <th>Trạng thái</th>
                      <th>Thao tác</th>
                    </tr>
                  </thead>
                  <tbody>
                    {completedSamples.map((sample) => (
                      <tr key={sample.id} id={`sample-row-${sample.id}`}>
                        <td>
                          <div className="">{sample.id}</div>
                          <small className="text-muted">{sample.participants.length} người</small>
                        </td>
                        <td>
                          <div className="">{sample.customerName}</div>
                          <small className="text-muted">{sample.phone}</small>
                        </td>
                        <td>
                          <div>{sample.service}</div>
                          <span
                            className={`badge rounded-pill ${sample.serviceType === 'civil' ? 'bg-warning text-dark' : 'bg-success text-white'}`}
                            style={{ fontSize: '12px', fontWeight: 500 }}
                          >
                            {sample.serviceType === 'civil' ? 'Hành chính' : 'Dân sự'}
                          </span>
                        </td>
                        <td>
                          {sample.methodName === 'Lấy mẫu tại lab' ? (
                            <span className="badge rounded-pill bg-primary" style={{ fontSize: '13px', fontWeight: 500 }}>
                              <i className="bi bi-buildings me-1"></i>Lấy mẫu tại lab
                            </span>
                          ) : sample.methodName === 'Lấy mẫu tại nhà' ? (
                            <span className="badge rounded-pill bg-success" style={{ fontSize: '13px', fontWeight: 500 }}>
                              <i className="bi bi-house-door me-1"></i>Lấy mẫu tại nhà
                            </span>
                          ) : sample.methodName === 'Nhân viên tới nhà lấy mẫu' ? (
                            <span className="badge rounded-pill bg-warning text-dark" style={{ fontSize: '13px', fontWeight: 500 }}>
                              <i className="bi bi-truck me-1"></i>Nhân viên tới nhà lấy mẫu
                            </span>
                          ) : (
                            <span className="badge rounded-pill bg-secondary" style={{ fontSize: '13px', fontWeight: 500 }}>
                              {sample.methodName || 'Không rõ'}
                            </span>
                          )}
                        </td>
                        <td>
                          <div>{formatDateTime(sample.scheduledTime)}</div>
                          {sample.returnedDate && (
                            <small className="text-success">Về: {formatDateTime(sample.returnedDate)}</small>
                          )}
                        </td>
                        <td>
                          {getStatusBadge(sample.status)}
                        </td>
                        <td>
                          <div className="d-flex flex-column gap-1">
                            {sample.status === 'collected' && (
                              <Button
                                size="sm"
                                variant="primary"
                                onClick={() => handleTransferToLab(sample.id)}
                              >
                                <i className="bi bi-arrow-right me-1"></i>
                                Chuyển lab
                              </Button>
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
        </Tab>
      </Tabs>

      {/* Sample Collection Modal */}
      <Modal show={showCollectionModal} onHide={() => setShowCollectionModal(false)} size="xl">
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-droplet me-2"></i>
            Thu mẫu xét nghiệm - {selectedSample?.id}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedSample && (
            <div>
              {/* Basic Info */}
              <Row className="mb-4">
                <Col md={6}>
                  <h6 className="text-primary mb-3">Thông tin đơn hàng</h6>
                  <table className="table table-borderless table-sm">
                    <tbody>
                      <tr>
                        <td><strong>Khách hàng:</strong></td>
                        <td>{selectedSample.customerName}</td>
                      </tr>
                      <tr>
                        <td><strong>Điện thoại:</strong></td>
                        <td>{selectedSample.phone}</td>
                      </tr>
                      <tr>
                        <td><strong>Dịch vụ:</strong></td>
                        <td>{selectedSample.service}</td>
                      </tr>
                      <tr>
                        <td><strong>Địa chỉ:</strong></td>
                        <td>{selectedSample.address}</td>
                      </tr>
                    </tbody>
                  </table>
                </Col>
                <Col md={6}>
                  <h6 className="text-primary mb-3">Thông tin thu mẫu</h6>
                  <Form>
                    <Row>
                      <Col md={6} className="mb-3">
                        <Form.Label>Thời gian thu mẫu</Form.Label>
                        <Form.Control
                          type="datetime-local"
                          value={collectionData.collectionTime}
                          onChange={(e) => setCollectionData({ ...collectionData, collectionTime: e.target.value })}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Người thu mẫu</Form.Label>
                        <Form.Control
                          value={collectionData.collectorName}
                          onChange={(e) => setCollectionData({ ...collectionData, collectorName: e.target.value })}
                        />
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>

              {/* Participants */}
              <div className="mb-4">
                <h6 className="text-primary mb-3">Danh sách mẫu</h6>
                <div className="table-responsive">
                  <Table bordered>
                    <thead className="table-light">
                      <tr>
                        <th>Mã mẫu</th>
                        <th>Tên người tham gia</th>
                        <th>Chất lượng mẫu</th>
                        <th>Nồng độ mẫu</th>
                        <th>Ghi chú</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collectionData.samples && collectionData.samples.map((sample, idx) => (
                        <tr key={sample.id || sample.sampleId || idx}>
                          <td>{sample.id || sample.sampleId}</td>
                          <td>{sample.participant?.name || sample.name || ''}</td>
                          <td>
                            <Form.Select
                              size="sm"
                              value={sample.sampleQuality}
                              onChange={e => {
                                const newSamples = [...collectionData.samples];
                                newSamples[idx].sampleQuality = e.target.value;
                                setCollectionData({ ...collectionData, samples: newSamples });
                              }}
                            >
                              <option value="">Chọn</option>
                              <option value="excellent">Xuất sắc</option>
                              <option value="good">Tốt</option>
                              <option value="fair">Khá</option>
                              <option value="poor">Kém</option>
                            </Form.Select>
                          </td>
                          <td>
                            <Form.Control
                              type="number"
                              min="0"
                              step="0.01"
                              value={sample.sampleConcentration}
                              onChange={e => {
                                const newSamples = [...collectionData.samples];
                                newSamples[idx].sampleConcentration = e.target.value;
                                setCollectionData({ ...collectionData, samples: newSamples });
                              }}
                            />
                          </td>
                          <td>
                            <Form.Control
                              type="text"
                              value={sample.notes}
                              onChange={e => {
                                const newSamples = [...collectionData.samples];
                                newSamples[idx].notes = e.target.value;
                                setCollectionData({ ...collectionData, samples: newSamples });
                              }}
                            />
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>
                </div>
              </div>

              {/* Special Notes */}
              {selectedSample.specialNotes && (
                <div className="mb-4">
                  <h6 className="text-primary mb-3">Ghi chú đặc biệt</h6>
                  <Alert variant="warning">
                    <i className="bi bi-exclamation-triangle me-2"></i>
                    {selectedSample.specialNotes}
                  </Alert>
                </div>
              )}

              {/* Collection Notes */}
              <div className="mb-4">
                <h6 className="text-primary mb-3">Ghi chú thu mẫu</h6>
                <Form.Control
                  as="textarea"
                  rows={3}
                  placeholder="Ghi chú về quá trình thu mẫu, tình trạng khách hàng, vấn đề gặp phải..."
                  value={collectionData.notes}
                  onChange={(e) => setCollectionData({ ...collectionData, notes: e.target.value })}
                />
              </div>

              {/* Quality Check */}
              <div className="mb-4">
                <h6 className="text-primary mb-3">Kiểm tra chất lượng tổng thể</h6>
                <Form.Select
                  value={collectionData.sampleQuality}
                  onChange={(e) => setCollectionData({ ...collectionData, sampleQuality: e.target.value })}
                >
                  <option value="excellent">Xuất sắc - Mẫu rất tốt, đủ lượng</option>
                  <option value="good">Tốt - Mẫu đạt yêu cầu</option>
                  <option value="fair">Khá - Mẫu có thể sử dụng được</option>
                  <option value="poor">Kém - Mẫu ít, có thể cần thu lại</option>
                </Form.Select>
              </div>
            </div>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowCollectionModal(false)}>
            Hủy
          </Button>
          <Button
            variant="success"
            onClick={handleCompleteCollection}
            disabled={!(collectionData.samples && collectionData.samples.length > 0 && collectionData.samples.every(s => s.sampleQuality && s.sampleConcentration !== undefined))}
          >
            <i className="bi bi-check-circle me-2"></i>
            Hoàn tất thu mẫu
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default SampleCollection;