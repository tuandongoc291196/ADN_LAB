import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col, Badge, Spinner, Alert, InputGroup, Card } from 'react-bootstrap';
import { Plus, Pencil, Eye, EyeSlash, CheckCircle, XCircle, Star, StarFill, Search, SortDown, SortUp } from 'react-bootstrap-icons';

const mockServices = [
  {
    id: 'admin-birth-cert',
    title: 'Xét nghiệm ADN làm giấy khai sinh',
    description: 'Xét nghiệm ADN có giá trị pháp lý cho thủ tục làm giấy khai sinh.',
    fullDescription: 'Xét nghiệm ADN cha con hoặc mẹ con có giá trị pháp lý, được sử dụng trong thủ tục làm giấy khai sinh. Kết quả được công nhận bởi tòa án và các cơ quan nhà nước.',
    price: '4200000',
    duration: '3-5 ngày',
    category: 'administrative',
    serviceType: 'administrative',
    hasLegalValue: true,
    icon: 'bi-file-earmark-text',
    participants: JSON.stringify(['Cha', 'Con']),
    requiredDocuments: JSON.stringify(['CMND/CCCD', 'Giấy chứng sinh']),
    procedures: JSON.stringify(['Đặt lịch', 'Thu mẫu', 'Xét nghiệm', 'Nhận kết quả']),
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: null
  },
  {
    id: 'civil-paternity',
    title: 'Xét nghiệm ADN Cha Con',
    description: 'Xét nghiệm ADN xác định quan hệ huyết thống cha con.',
    fullDescription: 'Xét nghiệm ADN cha con sử dụng công nghệ hiện đại để xác định mối quan hệ huyết thống với độ chính xác cao. Kết quả chỉ mang tính tham khảo, không có giá trị pháp lý.',
    price: '2500000',
    duration: '3 ngày',
    category: 'civil',
    serviceType: 'civil',
    hasLegalValue: false,
    icon: 'bi-person-lines-fill',
    participants: JSON.stringify(['Cha', 'Con']),
    requiredDocuments: JSON.stringify(['CMND/CCCD']),
    procedures: JSON.stringify(['Đặt lịch', 'Thu mẫu', 'Xét nghiệm', 'Nhận kết quả']),
    featured: true,
    createdAt: new Date().toISOString(),
    updatedAt: null
  },
  {
    id: 'civil-relationship',
    title: 'Xét nghiệm ADN Họ Hàng',
    description: 'Xét nghiệm ADN xác định quan hệ huyết thống họ hàng.',
    fullDescription: 'Xét nghiệm ADN họ hàng giúp xác định mối quan hệ huyết thống giữa các thành viên trong gia đình. Kết quả chỉ mang tính tham khảo, không có giá trị pháp lý.',
    price: '3500000',
    duration: '5 ngày',
    category: 'civil',
    serviceType: 'civil',
    hasLegalValue: false,
    icon: 'bi-people',
    participants: JSON.stringify(['Người thân 1', 'Người thân 2']),
    requiredDocuments: JSON.stringify(['CMND/CCCD']),
    procedures: JSON.stringify(['Đặt lịch', 'Thu mẫu', 'Xét nghiệm', 'Nhận kết quả']),
    featured: false,
    createdAt: new Date().toISOString(),
    updatedAt: null
  }
];

function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' | 'edit'
  const [selectedService, setSelectedService] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'title',
    direction: 'ascending'
  });
  const [form, setForm] = useState({
    title: '',
    description: '',
    fullDescription: '',
    price: '',
    duration: '',
    category: 'civil',
    serviceType: 'civil',
    hasLegalValue: false,
    icon: '',
    participants: [],
    requiredDocuments: [],
    procedures: [],
    featured: false,
    isHidden: false
  });
  const [participantInput, setParticipantInput] = useState('');
  const [documentInput, setDocumentInput] = useState('');
  const [procedureInput, setProcedureInput] = useState('');
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });

  useEffect(() => {
    setTimeout(() => {
      setServices(mockServices);
      setLoading(false);
    }, 600);
  }, []);

  const handleShowModal = (type, service = null) => {
    setModalType(type);
    setShowModal(true);
    if (type === 'edit' && service) {
      setSelectedService(service);
      setForm({
        ...service,
        participants: JSON.parse(service.participants || '[]'),
        requiredDocuments: JSON.parse(service.requiredDocuments || '[]'),
        procedures: JSON.parse(service.procedures || '[]')
      });
    } else {
      setSelectedService(null);
      setForm({
        title: '',
        description: '',
        fullDescription: '',
        price: '',
        duration: '',
        category: 'civil',
        serviceType: 'civil',
        hasLegalValue: false,
        icon: '',
        participants: [],
        requiredDocuments: [],
        procedures: [],
        featured: false,
        isHidden: false
      });
    }
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedService(null);
    setParticipantInput('');
    setDocumentInput('');
    setProcedureInput('');
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleAddParticipant = () => {
    if (participantInput.trim()) {
      setForm((prev) => ({
        ...prev,
        participants: [...prev.participants, participantInput.trim()]
      }));
      setParticipantInput('');
    }
  };

  const handleRemoveParticipant = (idx) => {
    setForm((prev) => ({
      ...prev,
      participants: prev.participants.filter((_, i) => i !== idx)
    }));
  };

  const handleAddDocument = () => {
    if (documentInput.trim()) {
      setForm((prev) => ({
        ...prev,
        requiredDocuments: [...prev.requiredDocuments, documentInput.trim()]
      }));
      setDocumentInput('');
    }
  };

  const handleRemoveDocument = (idx) => {
    setForm((prev) => ({
      ...prev,
      requiredDocuments: prev.requiredDocuments.filter((_, i) => i !== idx)
    }));
  };

  const handleAddProcedure = () => {
    if (procedureInput.trim()) {
      setForm((prev) => ({
        ...prev,
        procedures: [...prev.procedures, procedureInput.trim()]
      }));
      setProcedureInput('');
    }
  };

  const handleRemoveProcedure = (idx) => {
    setForm((prev) => ({
      ...prev,
      procedures: prev.procedures.filter((_, i) => i !== idx)
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.price) {
      setAlert({ show: true, variant: 'danger', message: 'Vui lòng nhập đầy đủ tên và giá dịch vụ.' });
      return;
    }

    const serviceData = {
      ...form,
      participants: JSON.stringify(form.participants),
      requiredDocuments: JSON.stringify(form.requiredDocuments),
      procedures: JSON.stringify(form.procedures)
    };

    if (modalType === 'add') {
      setServices((prev) => [
        ...prev,
        { ...serviceData, id: `service-${Date.now()}`, createdAt: new Date().toISOString() }
      ]);
      setAlert({ show: true, variant: 'success', message: 'Thêm dịch vụ thành công!' });
    } else if (modalType === 'edit' && selectedService) {
      setServices((prev) =>
        prev.map((s) =>
          s.id === selectedService.id
            ? { ...serviceData, id: s.id, createdAt: s.createdAt, updatedAt: new Date().toISOString() }
            : s
        )
      );
      setAlert({ show: true, variant: 'success', message: 'Cập nhật dịch vụ thành công!' });
    }
    handleCloseModal();
  };

  const handleDelete = (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa dịch vụ này?')) {
      setServices((prev) => prev.filter((s) => s.id !== id));
      setAlert({ show: true, variant: 'success', message: 'Xóa dịch vụ thành công!' });
    }
  };

  const handleToggleFeatured = (id) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, featured: !s.featured, updatedAt: new Date().toISOString() } : s
      )
    );
  };

  const handleToggleHidden = (id) => {
    setServices((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, isHidden: !s.isHidden, updatedAt: new Date().toISOString() } : s
      )
    );
    setAlert({ 
      show: true, 
      variant: 'success', 
      message: 'Cập nhật trạng thái dịch vụ thành công!' 
    });
  };

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  const getSortedServices = () => {
    let sortedServices = [...services];
    if (sortConfig.key) {
      sortedServices.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedServices;
  };

  const getFilteredServices = () => {
    const sortedServices = getSortedServices();
    if (!searchTerm) return sortedServices;

    return sortedServices.filter(service => 
      service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      service.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key !== key) return null;
    return sortConfig.direction === 'ascending' ? <SortUp /> : <SortDown />;
  };

  return (
    <>
      <Card className="mb-3 border-0">
        <Card.Body>
          <Row className="align-items-center">
            <Col md={3}>
              <h2 className="mb-0">Quản lý dịch vụ</h2>
            </Col>
            <Col md={3}>
                <input
                type="text"
                className="form-control"
                placeholder="Tìm kiếm..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                />
            </Col>
            <Col md={3}>
              <Form.Select
                value={sortConfig.key}
                onChange={(e) => handleSort(e.target.value)}
              >
                <option value="title">Sắp xếp theo tên</option>
                <option value="price">Sắp xếp theo giá</option>
                <option value="duration">Sắp xếp theo thời gian</option>
                <option value="category">Sắp xếp theo loại</option>
              </Form.Select>
            </Col>
            <Col md={3} className="text-end">
              <Button variant="primary" onClick={() => handleShowModal('add')}>
                <Plus className="me-1" /> Thêm dịch vụ
              </Button>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {alert.show && (
        <Alert variant={alert.variant} onClose={() => setAlert({ ...alert, show: false })} dismissible>
          {alert.message}
        </Alert>
      )}

      {loading ? (
        <div className="text-center py-5">
          <Spinner animation="border" variant="primary" />
        </div>
      ) : (
        <Card>
          <Card.Body>
            <Table responsive hover>
              <thead>
                <tr>
                  <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                    Tên dịch vụ {renderSortIcon('title')}
                  </th>
                  <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>
                    Loại {renderSortIcon('category')}
                  </th>
                  <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                    Giá {renderSortIcon('price')}
                  </th>
                  <th onClick={() => handleSort('duration')} style={{ cursor: 'pointer' }}>
                    Thời gian {renderSortIcon('duration')}
                  </th>
                  <th onClick={() => handleSort('isHidden')} style={{ cursor: 'pointer' }}>
                    Trạng thái {renderSortIcon('isHidden')}
                  </th>
                  <th onClick={() => handleSort('featured')} style={{ cursor: 'pointer' }}>
                    Nổi bật {renderSortIcon('featured')}
                  </th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredServices().map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="fw-bold">{service.title}</div>
                      <small className="text-muted">{service.description}</small>
                    </td>
                    <td>
                      <Badge bg={service.category === 'administrative' ? 'danger' : 'success'}>
                        {service.category === 'administrative' ? 'Hành chính' : 'Dân sự'}
                      </Badge>
                      {service.hasLegalValue && (
                        <Badge bg="warning" text="dark" className="ms-1">
                          Có giá trị pháp lý
                        </Badge>
                      )}
                    </td>
                    <td>{parseInt(service.price).toLocaleString('vi-VN')} VNĐ</td>
                    <td>{service.duration}</td>
                    <td>
                      <Badge bg={service.isHidden ? 'secondary' : 'success'}>
                        {service.isHidden ? 'Đã ẩn' : 'Đang hiển thị'}
                      </Badge>
                    </td>
                    <td>
                      <Button
                        variant="link"
                        className="p-0 text-warning"
                        onClick={() => handleToggleFeatured(service.id)}
                      >
                        {service.featured ? <StarFill /> : <Star />}
                      </Button>
                    </td>
                    <td>
                      <div className="d-flex gap-2">
                        <Button
                          size="sm"
                          variant="outline-primary"
                          onClick={() => handleShowModal('edit', service)}
                        >
                          <Pencil className="me-1" /> Sửa
                        </Button>
                        <Button
                          size="sm"
                          variant={service.isHidden ? "outline-success" : "outline-secondary"}
                          onClick={() => handleToggleHidden(service.id)}
                        >
                          {service.isHidden ? (
                            <>
                              <Eye className="me-1" /> Hiện
                            </>
                          ) : (
                            <>
                              <EyeSlash className="me-1" /> Ẩn
                            </>
                          )}
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
          </Card.Body>
        </Card>
      )}

      {/* Modal thêm/sửa dịch vụ */}
      <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
        <Modal.Header closeButton>
          <Modal.Title>{modalType === 'add' ? 'Thêm dịch vụ' : 'Cập nhật dịch vụ'}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Tên dịch vụ *</Form.Label>
                  <Form.Control
                    name="title"
                    value={form.title}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mô tả ngắn *</Form.Label>
                  <Form.Control
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mô tả chi tiết</Form.Label>
                  <Form.Control
                    name="fullDescription"
                    as="textarea"
                    rows={3}
                    value={form.fullDescription}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá *</Form.Label>
                  <Form.Control
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleFormChange}
                    required
                    min={0}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Thời gian *</Form.Label>
                  <Form.Control
                    name="duration"
                    value={form.duration}
                    onChange={handleFormChange}
                    required
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Loại dịch vụ *</Form.Label>
                  <Form.Select
                    name="category"
                    value={form.category}
                    onChange={handleFormChange}
                    required
                  >
                    <option value="civil">Dân sự</option>
                    <option value="administrative">Hành chính</option>
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="hasLegalValue"
                    label="Có giá trị pháp lý"
                    checked={form.hasLegalValue}
                    onChange={handleFormChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="featured"
                    label="Dịch vụ nổi bật"
                    checked={form.featured}
                    onChange={handleFormChange}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="isHidden"
                    label="Ẩn dịch vụ"
                    checked={form.isHidden}
                    onChange={handleFormChange}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Người tham gia</Form.Label>
                  <InputGroup className="mb-2">
                    <Form.Control
                      value={participantInput}
                      onChange={(e) => setParticipantInput(e.target.value)}
                      placeholder="Nhập người tham gia"
                    />
                    <Button variant="outline-secondary" onClick={handleAddParticipant}>
                      <Plus />
                    </Button>
                  </InputGroup>
                  <div className="d-flex flex-wrap gap-1">
                    {form.participants.map((p, i) => (
                      <Badge key={i} bg="info" className="d-flex align-items-center">
                        {p}
                        <Button
                          variant="link"
                          className="text-white p-0 ms-1"
                          onClick={() => handleRemoveParticipant(i)}
                        >
                          <XCircle size={14} />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Yêu cầu</Form.Label>
                  <InputGroup className="mb-2">
                    <Form.Control
                      value={documentInput}
                      onChange={(e) => setDocumentInput(e.target.value)}
                      placeholder="Nhập yêu cầu"
                    />
                    <Button variant="outline-secondary" onClick={handleAddDocument}>
                      <Plus />
                    </Button>
                  </InputGroup>
                  <div className="d-flex flex-wrap gap-1">
                    {form.requiredDocuments.map((d, i) => (
                      <Badge key={i} bg="secondary" className="d-flex align-items-center">
                        {d}
                        <Button
                          variant="link"
                          className="text-white p-0 ms-1"
                          onClick={() => handleRemoveDocument(i)}
                        >
                          <XCircle size={14} />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Quy trình</Form.Label>
                  <InputGroup className="mb-2">
                    <Form.Control
                      value={procedureInput}
                      onChange={(e) => setProcedureInput(e.target.value)}
                      placeholder="Nhập bước thực hiện"
                    />
                    <Button variant="outline-secondary" onClick={handleAddProcedure}>
                      <Plus />
                    </Button>
                  </InputGroup>
                  <div className="d-flex flex-wrap gap-1">
                    {form.procedures.map((p, i) => (
                      <Badge key={i} bg="primary" className="d-flex align-items-center">
                        {p}
                        <Button
                          variant="link"
                          className="text-white p-0 ms-1"
                          onClick={() => handleRemoveProcedure(i)}
                        >
                          <XCircle size={14} />
                        </Button>
                      </Badge>
                    ))}
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal}>
              Hủy
            </Button>
            <Button variant="primary" type="submit">
              {modalType === 'add' ? 'Thêm' : 'Cập nhật'}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}

export default ServiceManagement; 