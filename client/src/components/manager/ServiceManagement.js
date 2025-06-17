import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col, Badge, Spinner, Alert, InputGroup, Card } from 'react-bootstrap';
import { Plus, Pencil, Eye, EyeSlash, CheckCircle, XCircle, Star, StarFill, Search, SortDown, SortUp } from 'react-bootstrap-icons';
import { getAllServicesAndMethods } from '../../services/api';
import { COLLECTION_METHODS } from '../data/services-data';

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
    isHidden: false,
    collectionMethods: []
  });
  const [participantInput, setParticipantInput] = useState('');
  const [documentInput, setDocumentInput] = useState('');
  const [procedureInput, setProcedureInput] = useState('');
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  const [error, setError] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('all');

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const data = await getAllServicesAndMethods();
        const { dnaServices, serviceCollectionMethods } = data;
        
        // Map services với methods
        const servicesWithMethods = dnaServices.map(service => {
          // Lấy các methods của service này
          const serviceMethods = serviceCollectionMethods.filter(
            method => method.serviceId === service.id
          );

          return {
            ...service,
            // Parse các trường JSON string thành array
            participants: typeof service.participants === 'string' 
              ? service.participants.split(',').map(p => p.trim())
              : service.participants,
            requiredDocuments: typeof service.requiredDocuments === 'string'
              ? service.requiredDocuments.split(',').map(d => d.trim())
              : service.requiredDocuments,
            procedures: typeof service.procedures === 'string'
              ? service.procedures.split('→').map(p => p.trim())
              : service.procedures,
            // Thêm thông tin methods
            collectionMethods: serviceMethods.map(method => ({
              id: method.methodId,
              title: method.methodTitle,
              description: method.methodDescription,
              icon: method.methodIcon,
              color: method.methodColor,
              note: method.methodNote,
              process: method.methodProcess
            }))
          };
        });

        console.log('Processed services:', servicesWithMethods);
        setServices(servicesWithMethods);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

    fetchServices();
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
        procedures: JSON.parse(service.procedures || '[]'),
        collectionMethods: service.collectionMethods || []
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
        isHidden: false,
        collectionMethods: []
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

  const handleCollectionMethodChange = (methodId) => {
    setForm((prev) => {
      const exists = prev.collectionMethods.includes(methodId);
      return {
        ...prev,
        collectionMethods: exists
          ? prev.collectionMethods.filter((id) => id !== methodId)
          : [...prev.collectionMethods, methodId]
      };
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.title || !form.price) {
      setAlert({ show: true, variant: 'danger', message: 'Vui lòng nhập đầy đủ tên và giá dịch vụ.' });
      return;
    }
    if (!form.collectionMethods || form.collectionMethods.length === 0) {
      setAlert({ show: true, variant: 'danger', message: 'Vui lòng chọn ít nhất một phương thức lấy mẫu.' });
      return;
    }
    const serviceData = {
      ...form,
      participants: JSON.stringify(form.participants),
      requiredDocuments: JSON.stringify(form.requiredDocuments),
      procedures: JSON.stringify(form.procedures),
      collectionMethods: form.collectionMethods
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
    return services.filter(service => {
      // Filter by search term
      const searchMatch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      // Filter by status
      const statusMatch = 
        selectedStatus === 'all' ? true :
        selectedStatus === 'active' ? !service.isHidden :
        selectedStatus === 'hidden' ? service.isHidden : true;
      
      return searchMatch && statusMatch;
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <SortUp /> : <SortDown />;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="text-center p-5">
        <Spinner animation="border" role="status">
          <span className="visually-hidden">Đang tải...</span>
        </Spinner>
        <p className="mt-2">Đang tải danh sách dịch vụ...</p>
      </div>
    );
  }

  if (error) {
    return (
      <Alert variant="danger" className="m-4">
        <Alert.Heading>Đã xảy ra lỗi!</Alert.Heading>
        <p>{error}</p>
      </Alert>
    );
  }

  return (
    <div className="container py-5">
      {/* Header with Title and Controls */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2 style={{ fontSize: '2rem', margin: 0 }}>Quản lý dịch vụ</h2>
        <div className="d-flex align-items-center gap-3">
          <input
            type="text"
            className="form-control form-control-sm"
            placeholder="Tìm kiếm dịch vụ..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{ width: '200px' }}
          />
          <select
            className="form-select form-select-sm"
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            style={{ width: '150px' }}
          >
            <option value="all">Tất cả trạng thái</option>
            <option value="active">Đang hiển thị</option>
            <option value="hidden">Đang ẩn</option>
          </select>
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => handleShowModal('add')}
          >
            <i className="bi bi-plus-lg me-1"></i>
            Thêm dịch vụ
          </button>
        </div>
      </div>

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th>Tên dịch vụ</th>
                  <th>Loại</th>
                  <th>Giá</th>
                  <th>Thời gian</th>
                  <th style={{ width: '25%' }}>Phương thức lấy mẫu</th>
                  <th>Trạng thái</th>
                  <th>Thao tác</th>
                </tr>
              </thead>
              <tbody>
                {getFilteredServices().map((service) => (
                  <tr key={service.id}>
                    <td>
                      <div className="d-flex align-items-center">
                        {service.featured && (
                          <i className="bi bi-star-fill text-warning me-2"></i>
                        )}
                        {service.title}
                      </div>
                    </td>
                    <td>
                      <span className={`badge bg-${service.serviceType === 'administrative' ? 'warning' : 'success'}`}>
                        {service.serviceType === 'administrative' ? 'Hành chính' : 'Dân sự'}
                      </span>
                    </td>
                    <td>{service.price}</td>
                    <td>{service.duration}</td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        {service.collectionMethods.map(method => (
                          <div 
                            key={method.id}
                            className={`badge bg-${method.color} text-wrap`}
                            style={{ 
                              width: 'fit-content',
                              padding: '6px 10px',
                              marginBottom: '2px'
                            }}
                            title={method.description}
                          >
                            <i className={`${method.icon} me-2`}></i>
                            {method.title}
                          </div>
                        ))}
                      </div>
                    </td>
                    <td>
                      <span className={`badge bg-${service.isHidden ? 'secondary' : 'success'}`}>
                        {service.isHidden ? 'Đang ẩn' : 'Đang hiển thị'}
                      </span>
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-primary"
                          onClick={() => handleShowModal('edit', service)}
                          title="Chỉnh sửa"
                        >
                          <i className="bi bi-pencil"></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-success"
                          onClick={() => handleToggleFeatured(service.id)}
                          title={service.featured ? "Bỏ nổi bật" : "Đánh dấu nổi bật"}
                        >
                          <i className={`bi bi-star${service.featured ? '-fill' : ''}`}></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-warning"
                          onClick={() => handleToggleHidden(service.id)}
                          title={service.isHidden ? "Hiển thị" : "Ẩn"}
                        >
                          <i className={`bi bi-eye${service.isHidden ? '-slash' : ''}`}></i>
                        </button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(service.id)}
                          title="Xóa"
                        >
                          <i className="bi bi-trash"></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

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

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Phương thức lấy mẫu *</Form.Label>
                  <div className="d-flex flex-wrap gap-3">
                    {Object.values(COLLECTION_METHODS)
                      .filter(method => method.allowedFor.includes(form.category))
                      .map(method => (
                        <Form.Check
                          key={method.id}
                          type="checkbox"
                          id={`collection-method-${method.id}`}
                          label={method.title}
                          checked={form.collectionMethods.includes(method.id)}
                          onChange={() => handleCollectionMethodChange(method.id)}
                          className="me-3"
                        />
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
    </div>
  );
}

export default ServiceManagement; 