import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Alert, Modal, Form, Table, InputGroup, ListGroup } from 'react-bootstrap';

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

  // Mock data cho các mẫu cần thu
  useEffect(() => {
    const mockSamples = [
      {
        id: 'ADN123474',
        customerName: 'Nguyễn Văn E',
        phone: '0901111111',
        service: 'Xét nghiệm ADN khai sinh',
        serviceType: 'administrative',
        collectionMethod: 'home-visit',
        address: '123 Nguyễn Trãi, Q1, TP.HCM',
        scheduledTime: '2024-01-29 14:00',
        participants: [
          { name: 'Nguyễn Văn E', role: 'Cha', age: 35, idCard: '001234567890' },
          { name: 'Nguyễn Thị F', role: 'Con', age: 8, idCard: '' }
        ],
        status: 'scheduled',
        priority: 'urgent',
        specialNotes: 'Cần giấy tờ pháp lý, có nhân chứng',
        contactPerson: 'Nguyễn Văn E',
        orderDate: '2024-01-27'
      },
      {
        id: 'ADN123475',
        customerName: 'Trần Thị G',
        phone: '0902222222',
        service: 'Xét nghiệm ADN huyết thống',
        serviceType: 'civil',
        collectionMethod: 'at-facility',
        address: 'Phòng lab ADN - 456 Lê Lợi, Q3',
        scheduledTime: '2024-01-29 10:30',
        participants: [
          { name: 'Trần Thị G', role: 'Mẹ', age: 32, idCard: '001234567891' },
          { name: 'Trần Văn H', role: 'Con', age: 15, idCard: '001234567892' }
        ],
        status: 'waiting-arrival',
        priority: 'high',
        specialNotes: 'Khách hàng đã đến, chờ thu mẫu',
        contactPerson: 'Trần Thị G',
        orderDate: '2024-01-28'
      },
      {
        id: 'ADN123476',
        customerName: 'Lê Văn I',
        phone: '0903333333',
        service: 'Xét nghiệm ADN bí mật',
        serviceType: 'civil',
        collectionMethod: 'self-sample',
        address: 'Kit đã gửi - 789 Hai Bà Trưng, Q1',
        scheduledTime: '2024-01-28 00:00',
        participants: [
          { name: 'Lê Văn I', role: 'Người yêu cầu', age: 28, idCard: '001234567893' },
          { name: 'Không rõ', role: 'Đối tượng', age: 0, idCard: '' }
        ],
        status: 'kit-returned',
        priority: 'medium',
        specialNotes: 'Kit đã được gửi về, cần kiểm tra mẫu',
        contactPerson: 'Lê Văn I',
        orderDate: '2024-01-25',
        returnedDate: '2024-01-28 16:30'
      },
      {
        id: 'ADN123477',
        customerName: 'Phạm Thị J',
        phone: '0904444444',
        service: 'Xét nghiệm ADN nhập tịch',
        serviceType: 'administrative',
        collectionMethod: 'home-visit',
        address: '321 Võ Văn Tần, Q3, TP.HCM',
        scheduledTime: '2024-01-29 16:00',
        participants: [
          { name: 'Phạm Thị J', role: 'Mẹ', age: 45, idCard: '001234567894' },
          { name: 'Phạm Văn K', role: 'Con', age: 20, idCard: '001234567895' },
          { name: 'Smith John', role: 'Cha (ở Mỹ)', age: 48, idCard: 'Passport: A12345678' }
        ],
        status: 'collected',
        priority: 'high',
        specialNotes: 'Đã thu mẫu hoàn tất, chờ vận chuyển về lab',
        contactPerson: 'Phạm Thị J',
        orderDate: '2024-01-26',
        collectedBy: 'Nguyễn Văn Staff',
        collectedDate: '2024-01-28 16:30'
      }
    ];
    setSamples(mockSamples);
    setFilteredSamples(mockSamples);
  }, []);

  // Filter samples based on search and status
  useEffect(() => {
    let filtered = samples;
    
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

  const getStatusBadge = (status) => {
    const statusConfig = {
      'scheduled': { bg: 'warning', text: 'Đã lên lịch' },
      'waiting-arrival': { bg: 'info', text: 'Chờ khách đến' },
      'kit-returned': { bg: 'primary', text: 'Kit đã về' },
      'collecting': { bg: 'secondary', text: 'Đang thu mẫu' },
      'collected': { bg: 'success', text: 'Đã thu mẫu' },
      'transferred': { bg: 'dark', text: 'Đã chuyển lab' }
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

  const getCollectionMethodBadge = (method) => {
    const methodConfig = {
      'home-visit': { bg: 'info', text: 'Thu tại nhà', icon: 'bi-house' },
      'at-facility': { bg: 'success', text: 'Thu tại lab', icon: 'bi-hospital' },
      'self-sample': { bg: 'warning', text: 'Tự thu mẫu', icon: 'bi-box' }
    };
    const config = methodConfig[method] || { bg: 'secondary', text: 'Không xác định', icon: 'bi-question' };
    return (
      <Badge bg={config.bg}>
        <i className={`${config.icon} me-1`}></i>
        {config.text}
      </Badge>
    );
  };

  const handleStartCollection = (sample) => {
    setSelectedSample(sample);
    setCollectionData({
      collectionTime: new Date().toISOString().slice(0, 16),
      collectorName: user.name,
      sampleQuality: 'good',
      participants: sample.participants.map(p => ({ ...p, sampleCollected: false, sampleQuality: 'good' })),
      notes: '',
      photos: []
    });
    setShowCollectionModal(true);
  };

  const handleCompleteCollection = () => {
    // Update sample status
    const updatedSamples = samples.map(sample => 
      sample.id === selectedSample.id 
        ? { 
            ...sample, 
            status: 'collected',
            collectedBy: user.name,
            collectedDate: new Date().toLocaleString('vi-VN'),
            collectionDetails: collectionData
          }
        : sample
    );
    setSamples(updatedSamples);
    setShowCollectionModal(false);
    setSelectedSample(null);
    
    setAlert({ 
      show: true, 
      message: `Thu mẫu cho đơn hàng ${selectedSample.id} đã hoàn tất thành công!`,
      type: 'success' 
    });
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
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
    setTimeout(() => setAlert({ show: false, message: '', type: '' }), 3000);
  };

  const formatDateTime = (dateTimeString) => {
    return new Date(dateTimeString).toLocaleString('vi-VN');
  };

  const updateParticipantSampleStatus = (index, field, value) => {
    const updatedParticipants = [...collectionData.participants];
    updatedParticipants[index] = { ...updatedParticipants[index], [field]: value };
    setCollectionData({ ...collectionData, participants: updatedParticipants });
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
              </Form.Select>
            </Col>
            <Col lg={3} className="mb-3 d-flex align-items-end">
              <div className="w-100">
                <Badge bg="warning" className="me-2">
                  Cần thu: {samples.filter(s => ['scheduled', 'waiting-arrival', 'kit-returned'].includes(s.status)).length}
                </Badge>
                <Badge bg="success">
                  Hoàn thành: {samples.filter(s => s.status === 'collected').length}
                </Badge>
              </div>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {/* Samples Table */}
      <Card className="shadow-sm">
        <Card.Header className="bg-light">
          <div className="d-flex justify-content-between align-items-center">
            <h5 className="mb-0">Danh sách mẫu cần thu ({filteredSamples.length})</h5>
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
                  <th>Ưu tiên</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {filteredSamples.map((sample) => (
                  <tr key={sample.id}>
                    <td>
                      <div className="fw-bold">{sample.id}</div>
                      <small className="text-muted">{sample.participants.length} người</small>
                    </td>
                    <td>
                      <div className="fw-bold">{sample.customerName}</div>
                      <small className="text-muted">{sample.phone}</small>
                    </td>
                    <td>
                      <div>{sample.service}</div>
                      <small className="text-muted">
                        {sample.serviceType === 'civil' ? 'Dân sự' : 'Hành chính'}
                      </small>
                    </td>
                    <td>{getCollectionMethodBadge(sample.collectionMethod)}</td>
                    <td>
                      <div>{formatDateTime(sample.scheduledTime)}</div>
                      {sample.returnedDate && (
                        <small className="text-success">Về: {formatDateTime(sample.returnedDate)}</small>
                      )}
                    </td>
                    <td>{getPriorityBadge(sample.priority)}</td>
                    <td>{getStatusBadge(sample.status)}</td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        {['scheduled', 'waiting-arrival', 'kit-returned'].includes(sample.status) && (
                          <Button 
                            size="sm" 
                            variant="success"
                            onClick={() => handleStartCollection(sample)}
                          >
                            <i className="bi bi-droplet me-1"></i>
                            Thu mẫu
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
                          onChange={(e) => setCollectionData({...collectionData, collectionTime: e.target.value})}
                        />
                      </Col>
                      <Col md={6} className="mb-3">
                        <Form.Label>Người thu mẫu</Form.Label>
                        <Form.Control 
                          value={collectionData.collectorName}
                          onChange={(e) => setCollectionData({...collectionData, collectorName: e.target.value})}
                        />
                      </Col>
                    </Row>
                  </Form>
                </Col>
              </Row>

              {/* Participants */}
              <div className="mb-4">
                <h6 className="text-primary mb-3">Danh sách người tham gia</h6>
                <div className="table-responsive">
                  <Table bordered>
                    <thead className="table-light">
                      <tr>
                        <th>Họ tên</th>
                        <th>Vai trò</th>
                        <th>Tuổi</th>
                        <th>CCCD/Passport</th>
                        <th>Thu mẫu</th>
                        <th>Chất lượng mẫu</th>
                      </tr>
                    </thead>
                    <tbody>
                      {collectionData.participants.map((participant, index) => (
                        <tr key={index}>
                          <td><strong>{participant.name}</strong></td>
                          <td>{participant.role}</td>
                          <td>{participant.age > 0 ? participant.age : 'N/A'}</td>
                          <td>{participant.idCard || 'Chưa có'}</td>
                          <td>
                            <Form.Check 
                              type="checkbox"
                              checked={participant.sampleCollected}
                              onChange={(e) => updateParticipantSampleStatus(index, 'sampleCollected', e.target.checked)}
                            />
                          </td>
                          <td>
                            <Form.Select 
                              size="sm"
                              value={participant.sampleQuality}
                              onChange={(e) => updateParticipantSampleStatus(index, 'sampleQuality', e.target.value)}
                            >
                              <option value="good">Tốt</option>
                              <option value="fair">Khá</option>
                              <option value="poor">Kém</option>
                            </Form.Select>
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
                  onChange={(e) => setCollectionData({...collectionData, notes: e.target.value})}
                />
              </div>

              {/* Quality Check */}
              <div className="mb-4">
                <h6 className="text-primary mb-3">Kiểm tra chất lượng tổng thể</h6>
                <Form.Select 
                  value={collectionData.sampleQuality}
                  onChange={(e) => setCollectionData({...collectionData, sampleQuality: e.target.value})}
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
            disabled={!collectionData.participants.every(p => p.sampleCollected)}
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