import React, { useState, useEffect } from 'react';
import { Table, Button, Modal, Form, Row, Col, Badge, Spinner, Alert, InputGroup, Card } from 'react-bootstrap';
import { Plus, Pencil, Eye, EyeSlash, CheckCircle, XCircle, Star, StarFill, Search, SortDown, SortUp } from 'react-bootstrap-icons';
import { 
  getAllServices, 
  getAllMethods, 
  getMethodsByServiceId,
  addService,
  updateService,
  addMethodToService,
  removeMethodFromService
} from '../../services/api';
import { enrichMethodData } from '../data/services-data';

function ServiceManagement() {
  const [services, setServices] = useState([]);
  const [methods, setMethods] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('add'); // 'add' | 'edit' | 'view'
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({
    key: 'title',
    direction: 'ascending'
  });
  const [form, setForm] = useState({
    id: '',
    title: '',
    description: '',
    fullDescription: '',
    price: '',
    duration: '',
    categoryId: '',
    icon: '',
    featured: false,
    isActive: true,
    methodIds: []
  });
  const [alert, setAlert] = useState({ show: false, variant: '', message: '' });
  const [error, setError] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [showIconDropdown, setShowIconDropdown] = useState(false);

  // Danh sách icon thường sử dụng cho dịch vụ ADN
  const commonIcons = [
    'bi-dna', 'bi-people', 'bi-person-lines-fill', 'bi-person-heart', 'bi-people-fill',
    'bi-gender-male', 'bi-gender-female', 'bi-heart-pulse', 'bi-flask', 'bi-shield-check',
    'bi-award', 'bi-gear', 'bi-person', 'bi-person-badge', 'bi-person-circle',
    'bi-person-square', 'bi-person-vcard', 'bi-person-workspace', 'bi-person-video3',
    'bi-person-plus', 'bi-person-check', 'bi-person-x', 'bi-person-dash',
    'bi-person-bounding-box', 'bi-heart', 'bi-heart-fill', 'bi-heart-pulse-fill', 
    'bi-heart-half', 'bi-star', 'bi-star-fill', 'bi-star-half', 'bi-award-fill',
    'bi-shield', 'bi-shield-fill', 'bi-shield-lock', 'bi-shield-lock-fill', 
    'bi-shield-exclamation', 'bi-shield-x', 'bi-gear-fill', 'bi-gear-wide', 
    'bi-gear-wide-connected', 'bi-tools', 'bi-wrench', 'bi-wrench-adjustable', 
    'bi-wrench-adjustable-circle', 'bi-hammer', 'bi-screwdriver', 'bi-nut', 'bi-nut-fill',
    'bi-flask-fill', 'bi-beaker', 'bi-beaker-fill', 'bi-droplet', 'bi-droplet-fill', 
    'bi-droplet-half', 'bi-thermometer', 'bi-thermometer-half', 'bi-thermometer-high',
    'bi-thermometer-low', 'bi-thermometer-snow', 'bi-thermometer-sun',
    'bi-lightning', 'bi-lightning-fill', 'bi-lightning-charge',
    'bi-lightning-charge-fill', 'bi-zap', 'bi-zap-fill',
    'bi-activity', 'bi-graph-up', 'bi-graph-up-arrow', 'bi-graph-down',
    'bi-graph-down-arrow', 'bi-bar-chart', 'bi-bar-chart-fill',
    'bi-bar-chart-line', 'bi-bar-chart-line-fill', 'bi-pie-chart',
    'bi-pie-chart-fill', 'bi-diagram-3', 'bi-diagram-3-fill',
    'bi-diagram-2', 'bi-diagram-2-fill', 'bi-diagram-project',
    'bi-diagram-project-fill', 'bi-kanban', 'bi-kanban-fill',
    'bi-calendar', 'bi-calendar-check', 'bi-calendar-date',
    'bi-calendar-day', 'bi-calendar-event', 'bi-calendar-minus',
    'bi-calendar-plus', 'bi-calendar-range', 'bi-calendar-week',
    'bi-calendar-x', 'bi-calendar2', 'bi-calendar2-check',
    'bi-calendar2-date', 'bi-calendar2-day', 'bi-calendar2-event',
    'bi-calendar2-minus', 'bi-calendar2-plus', 'bi-calendar2-range',
    'bi-calendar2-week', 'bi-calendar2-x', 'bi-calendar3',
    'bi-calendar3-event', 'bi-calendar3-range', 'bi-calendar3-week',
    'bi-calendar4', 'bi-calendar4-event', 'bi-calendar4-range',
    'bi-calendar4-week', 'bi-calendar-month', 'bi-calendar-month-fill',
    'bi-clock', 'bi-clock-fill', 'bi-clock-history', 'bi-clock-split',
    'bi-stopwatch', 'bi-stopwatch-fill', 'bi-hourglass', 'bi-hourglass-split',
    'bi-hourglass-top', 'bi-hourglass-bottom', 'bi-timer', 'bi-timer-fill',
    'bi-alarm', 'bi-alarm-fill', 'bi-bell', 'bi-bell-fill',
    'bi-bell-slash', 'bi-bell-slash-fill', 'bi-exclamation-circle',
    'bi-exclamation-circle-fill', 'bi-exclamation-triangle',
    'bi-exclamation-triangle-fill', 'bi-exclamation-octagon',
    'bi-exclamation-octagon-fill', 'bi-exclamation-diamond',
    'bi-exclamation-diamond-fill', 'bi-question-circle',
    'bi-question-circle-fill', 'bi-question-octagon',
    'bi-question-octagon-fill', 'bi-question-diamond',
    'bi-question-diamond-fill', 'bi-info-circle', 'bi-info-circle-fill',
    'bi-info-octagon', 'bi-info-octagon-fill', 'bi-info-square',
    'bi-info-square-fill', 'bi-check-circle', 'bi-check-circle-fill',
    'bi-check-square', 'bi-check-square-fill', 'bi-check-octagon',
    'bi-check-octagon-fill', 'bi-check2-circle', 'bi-check2-square',
    'bi-check2-all', 'bi-x-circle', 'bi-x-circle-fill', 'bi-x-square',
    'bi-x-square-fill', 'bi-x-octagon', 'bi-x-octagon-fill',
    'bi-x-lg', 'bi-plus-circle', 'bi-plus-circle-fill', 'bi-plus-square',
    'bi-plus-square-fill', 'bi-plus-octagon', 'bi-plus-octagon-fill',
    'bi-dash-circle', 'bi-dash-circle-fill', 'bi-dash-square',
    'bi-dash-square-fill', 'bi-dash-octagon', 'bi-dash-octagon-fill',
    'bi-arrow-up', 'bi-arrow-up-circle', 'bi-arrow-up-circle-fill',
    'bi-arrow-up-square', 'bi-arrow-up-square-fill', 'bi-arrow-down',
    'bi-arrow-down-circle', 'bi-arrow-down-circle-fill', 'bi-arrow-down-square',
    'bi-arrow-down-square-fill', 'bi-arrow-left', 'bi-arrow-left-circle',
    'bi-arrow-left-circle-fill', 'bi-arrow-left-square', 'bi-arrow-left-square-fill',
    'bi-arrow-right', 'bi-arrow-right-circle', 'bi-arrow-right-circle-fill',
    'bi-arrow-right-square', 'bi-arrow-right-square-fill', 'bi-chevron-up',
    'bi-chevron-down', 'bi-chevron-left', 'bi-chevron-right',
    'bi-chevron-up-circle', 'bi-chevron-down-circle', 'bi-chevron-left-circle',
    'bi-chevron-right-circle', 'bi-chevron-up-square', 'bi-chevron-down-square',
    'bi-chevron-left-square', 'bi-chevron-right-square', 'bi-chevron-double-up',
    'bi-chevron-double-down', 'bi-chevron-double-left', 'bi-chevron-double-right',
    'bi-arrow-repeat', 'bi-arrow-clockwise', 'bi-arrow-counterclockwise',
    'bi-arrow-return-left', 'bi-arrow-return-right', 'bi-arrow-90deg-up',
    'bi-arrow-90deg-down', 'bi-arrow-90deg-left', 'bi-arrow-90deg-right',
    'bi-arrow-up-left', 'bi-arrow-up-right', 'bi-arrow-down-left',
    'bi-arrow-down-right', 'bi-arrow-up-left-circle', 'bi-arrow-up-right-circle',
    'bi-arrow-down-left-circle', 'bi-arrow-down-right-circle', 'bi-arrow-up-left-square',
    'bi-arrow-up-right-square', 'bi-arrow-down-left-square', 'bi-arrow-down-right-square'
  ];

  const fetchData = async () => {
      setLoading(true);
      try {
        const [servicesData, methodsData] = await Promise.all([
          getAllServices(),
          getAllMethods() 
        ]);

        console.log('Raw services data from API:', servicesData);
        console.log('Sample service object:', servicesData[0]);

      // Fetch methods for each service
      const servicesWithMethods = await Promise.all(
        servicesData.map(async (service) => {
          try {
            const serviceMethods = await getMethodsByServiceId(service.id);
            return {
              ...service,
              methods: serviceMethods
            };
          } catch (error) {
            console.error(`Error fetching methods for service ${service.id}:`, error);
          return {
            ...service,
              methods: []
            };
          }
        })
      );

        console.log('Processed services:', servicesWithMethods);
      console.log('Methods data:', methodsData);
      
        setServices(servicesWithMethods);
      setMethods(methodsData);
        setLoading(false);
      } catch (err) {
        console.error('Error:', err);
        setError(err.message);
        setLoading(false);
      }
    };

  useEffect(() => {
    fetchData();
  }, []);

  // Đóng dropdown khi click ra ngoài
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (showIconDropdown && !event.target.closest('.icon-dropdown-container')) {
        setShowIconDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [showIconDropdown]);

  // Lấy danh sách categories từ services
  const getCategoriesFromServices = () => {
    const categoriesMap = new Map();
    services.forEach(service => {
      if (service.category) {
        categoriesMap.set(service.category.id, service.category);
      }
    });
    return Array.from(categoriesMap.values());
  };

  const handleShowModal = (type, service = null) => {
    setModalType(type);
    if ((type === 'edit' || type === 'view') && service) {
      setForm({
        id: service.id || '',
        title: service.title || '',
        description: service.description || '',
        fullDescription: service.fullDescription || '',
        price: service.price || '',
        duration: service.duration || '',
        categoryId: service.categoryId || '',
        icon: service.icon || '',
        featured: service.featured || false,
        isActive: service.isActive !== false, // Default to true if not set
        methodIds: service.methods?.map(m => m.id) || []
      });
    } else {
      setForm({
        id: '',
        title: '',
        description: '',
        fullDescription: '',
        price: '',
        duration: '',
        categoryId: '',
        icon: '',
        featured: false,
        isActive: true,
        methodIds: []
      });
    }
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setAlert({ show: false, variant: '', message: '' });
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleMethodChange = (methodId) => {
    setForm(prev => ({
      ...prev,
      methodIds: prev.methodIds.includes(methodId)
        ? prev.methodIds.filter(id => id !== methodId)
        : [...prev.methodIds, methodId]
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!form.title || !form.description || !form.price || !form.duration || !form.categoryId) {
      setAlert({ show: true, variant: 'danger', message: 'Vui lòng điền đầy đủ thông tin bắt buộc!' });
      return;
    }

    if (form.methodIds.length === 0) {
      setAlert({ show: true, variant: 'danger', message: 'Vui lòng chọn ít nhất một phương thức lấy mẫu!' });
      return;
    }

    setSubmitting(true);
    try {
    const serviceData = {
      ...form,
        price: parseInt(form.price)
    };

    if (modalType === 'add') {
        // Gọi API thực tế để thêm dịch vụ với methods
        const serviceDataWithMethods = {
          ...serviceData,
          methods: form.methodIds // Backend yêu cầu methods array
        };
        
        const newService = await addService(serviceDataWithMethods);
        
        // Refresh lại danh sách dịch vụ
        await fetchData();
      setAlert({ show: true, variant: 'success', message: 'Thêm dịch vụ thành công!' });
      } else if (modalType === 'edit') {
        // Gọi API thực tế để cập nhật dịch vụ với methods
        const serviceDataWithMethods = {
          ...serviceData,
          methods: form.methodIds // Backend yêu cầu methods array
        };
        
        await updateService(form.id, serviceDataWithMethods);
        
        // Refresh lại danh sách dịch vụ
        await fetchData();
      setAlert({ show: true, variant: 'success', message: 'Cập nhật dịch vụ thành công!' });
    }
      
    handleCloseModal();
    } catch (error) {
      console.error('Submit error:', error);
      setAlert({ show: true, variant: 'danger', message: error.message });
    } finally {
      setSubmitting(false);
    }
  };

  const handleToggleFeatured = async (id) => {
    try {
      const service = services.find(s => s.id === id);
      const newFeaturedStatus = !service.featured;
      
      // Lấy methods hiện tại của service
      const currentMethodIds = service.methods?.map(m => m.id) || [];
      
      // Gọi API thực tế để cập nhật trạng thái featured với methods hiện tại
      await updateService(id, {
        featured: newFeaturedStatus,
        methods: currentMethodIds
      });
      
      // Refresh lại danh sách dịch vụ
      await fetchData();
      
      setAlert({ 
        show: true, 
        variant: 'success', 
        message: `Đã ${newFeaturedStatus ? 'đánh dấu' : 'bỏ đánh dấu'} nổi bật cho dịch vụ!` 
      });
    } catch (error) {
      console.error('Toggle featured error:', error);
      setAlert({ show: true, variant: 'danger', message: error.message });
    }
  };

  const handleToggleActive = async (id) => {
    try {
      const service = services.find(s => s.id === id);
      
      // Xử lý trường hợp service.isActive có thể là undefined (dịch vụ cũ)
      const currentActiveStatus = service.isActive !== false; // true nếu isActive là true hoặc undefined
      const newActiveStatus = !currentActiveStatus;
      
      // Lấy methods hiện tại của service
      const currentMethodIds = service.methods?.map(m => m.id) || [];
      
      const updateData = {
        isActive: newActiveStatus,
        methods: currentMethodIds
      };
      
      // Gọi API thực tế để cập nhật trạng thái active với methods hiện tại
      await updateService(id, updateData);
      
      // Refresh lại danh sách dịch vụ
      await fetchData();
      
    setAlert({ 
      show: true, 
      variant: 'success', 
        message: `Đã ${newActiveStatus ? 'hiển thị' : 'ẩn'} dịch vụ!` 
    });
    } catch (error) {
      console.error('Toggle active error:', error);
      setAlert({ show: true, variant: 'danger', message: error.message });
    }
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
        let aValue = a[sortConfig.key];
        let bValue = b[sortConfig.key];
        
        // Handle nested objects
        if (sortConfig.key === 'category') {
          aValue = a.category?.name || '';
          bValue = b.category?.name || '';
        }
        
        if (aValue < bValue) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortedServices;
  };

  const getFilteredServices = () => {
    return getSortedServices().filter(service => {
      // Filter by search term
      const searchMatch = service.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        service.description?.toLowerCase().includes(searchTerm.toLowerCase());
      
      return searchMatch;
    });
  };

  const renderSortIcon = (key) => {
    if (sortConfig.key === key) {
      return sortConfig.direction === 'ascending' ? <SortUp /> : <SortDown />;
    }
    return null;
  };

  const formatPrice = (price) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(price);
  };

  const getMethodDisplayInfo = (methodId) => {
    const methodDisplayInfo = {
      '0': { // Lấy mẫu tại nhà
        icon: 'bi-house',
        color: 'success',
        title: 'Lấy mẫu tại nhà',
        description: 'Tự thu mẫu theo hướng dẫn tại nhà',
        note: 'Chỉ áp dụng cho xét nghiệm ADN dân sự',
        process: ['Đặt hẹn', 'Nhận kit', 'Thu mẫu', 'Gửi lại', 'Nhận kết quả']
      },
      '1': { // Nhân viên tới nhà lấy mẫu
        icon: 'bi-truck',
        color: 'warning',
        title: 'Nhân viên tới nhà lấy mẫu',
        description: 'Nhân viên chuyên nghiệp đến tận nhà thu mẫu',
        note: 'Phí dịch vụ nhân viên: 400,000 VNĐ (trong nội thành)',
        process: ['Đặt hẹn', 'Nhân viên đến', 'Thu mẫu', 'Xét nghiệm', 'Nhận kết quả']
      },
      '2': { // Lấy mẫu tại lab
        icon: 'bi-hospital',
        color: 'primary',
        title: 'Tới cơ sở lấy mẫu',
        description: 'Đến trực tiếp cơ sở y tế để lấy mẫu',
        note: 'Đảm bảo tính chính xác và có giá trị pháp lý',
        process: ['Đặt hẹn', 'Đến cơ sở', 'Thu mẫu', 'Xét nghiệm', 'Nhận kết quả']
      }
    };

    return methodDisplayInfo[methodId] || {
      icon: 'bi-gear',
      color: 'secondary',
      title: 'Phương thức thu mẫu',
      description: 'Phương thức thu mẫu chuyên nghiệp',
      note: null,
      process: ['Đặt hẹn', 'Thu mẫu', 'Xét nghiệm', 'Nhận kết quả']
    };
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

  const categories = getCategoriesFromServices();

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
          <button 
            className="btn btn-primary btn-sm"
            onClick={() => handleShowModal('add')}
          >
            <i className="bi bi-plus-lg me-1"></i>
            Thêm dịch vụ
          </button>
        </div>
      </div>

      {/* Alert Messages */}
      {alert.show && (
        <Alert 
          variant={alert.variant} 
          onClose={() => setAlert({ show: false, variant: '', message: '' })}
          dismissible
          className="mb-3"
        >
          {alert.message}
        </Alert>
      )}

      <div className="card">
        <div className="card-body">
          <div className="table-responsive">
            <table className="table table-hover">
              <thead>
                <tr>
                  <th onClick={() => handleSort('title')} style={{ cursor: 'pointer' }}>
                    Tên dịch vụ {renderSortIcon('title')}
                  </th>
                  <th onClick={() => handleSort('category')} style={{ cursor: 'pointer' }}>
                    Danh mục {renderSortIcon('category')}
                  </th>
                  <th onClick={() => handleSort('price')} style={{ cursor: 'pointer' }}>
                    Giá {renderSortIcon('price')}
                  </th>
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
                      <span className={`badge bg-${service.category?.hasLegalValue ? 'warning' : 'success'}`}>
                        {service.category?.name || 'N/A'}
                      </span>
                    </td>
                    <td>{formatPrice(service.price)}</td>
                    <td>{service.duration}</td>
                    <td>
                      <div className="d-flex flex-column gap-1">
                        {service.methods?.map(method => {
                          const displayInfo = getMethodDisplayInfo(method.id);
                          return (
                          <div 
                            key={method.id}
                              className={`badge bg-${displayInfo.color} text-wrap`}
                            style={{ 
                              width: 'fit-content',
                              padding: '6px 10px',
                                marginBottom: '2px',
                                borderRadius: '8px',
                                fontWeight: '500'
                            }}
                            title={method.description}
                          >
                              <i className={`${displayInfo.icon} me-1`}></i>
                              {method.name}
                          </div>
                          );
                        })}
                        {(!service.methods || service.methods.length === 0) && (
                          <span className="text-muted small">Chưa có phương thức</span>
                        )}
                      </div>
                    </td>
                    <td>
                      {(() => {
                        console.log(`Service ${service.id} - Raw isActive value:`, service.isActive, 'Type:', typeof service.isActive);
                        const isActive = service.isActive !== false;
                        console.log(`Service ${service.id} - Processed isActive:`, isActive);
                        return (
                          <span className={`badge bg-${isActive ? 'success' : 'secondary'}`}>
                            {isActive ? 'Đang hiển thị' : 'Đã ẩn'}
                      </span>
                        );
                      })()}
                    </td>
                    <td>
                      <div className="btn-group">
                        <button
                          className="btn btn-sm btn-outline-info"
                          onClick={() => handleShowModal('view', service)}
                          title="Xem thông tin"
                        >
                          <i className="bi bi-info-circle"></i>
                        </button>
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
                          className={`btn btn-sm ${service.isActive !== false ? 'btn-outline-warning' : 'btn-outline-success'}`}
                          onClick={() => handleToggleActive(service.id)}
                          title={service.isActive !== false ? "Ẩn dịch vụ" : "Hiển thị dịch vụ"}
                        >
                          <i className={`bi bi-${service.isActive !== false ? 'eye-slash' : 'eye'}`}></i>
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
          <Modal.Title>{modalType === 'add' ? 'Thêm dịch vụ' : modalType === 'edit' ? 'Cập nhật dịch vụ' : 'Xem thông tin dịch vụ'}</Modal.Title>
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
                    disabled={modalType === 'view'}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Mô tả ngắn *</Form.Label>
                  <Form.Control
                    name="description"
                    value={form.description}
                    onChange={handleFormChange}
                    required
                    disabled={modalType === 'view'}
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
                    disabled={modalType === 'view'}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Giá (VND) *</Form.Label>
                  <Form.Control
                    name="price"
                    type="number"
                    value={form.price}
                    onChange={handleFormChange}
                    required
                    min={0}
                    disabled={modalType === 'view'}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Thời gian *</Form.Label>
                  <Form.Control
                    name="duration"
                    value={form.duration}
                    onChange={handleFormChange}
                    required
                    placeholder="VD: 7-10 ngày"
                    disabled={modalType === 'view'}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Danh mục *</Form.Label>
                  <Form.Select
                    name="categoryId"
                    value={form.categoryId}
                    onChange={handleFormChange}
                    required
                    disabled={modalType === 'view'}
                  >
                    <option value="">Chọn danh mục</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Icon</Form.Label>
                  <div className="position-relative icon-dropdown-container">
                    <div 
                      className={`form-control d-flex align-items-center justify-content-between ${modalType === 'view' ? 'bg-light' : ''}`}
                      style={{ cursor: modalType === 'view' ? 'default' : 'pointer' }}
                      onClick={() => modalType !== 'view' && setShowIconDropdown(!showIconDropdown)}
                    >
                      <div className="d-flex align-items-center">
                        {form.icon ? (
                          <>
                            <i className={`${form.icon} me-2`} style={{ fontSize: '1.2rem' }}></i>
                            <span>{form.icon}</span>
                          </>
                        ) : (
                          <span className="text-muted">Chọn icon cho dịch vụ...</span>
                        )}
                      </div>
                      {modalType !== 'view' && <i className="bi bi-chevron-down"></i>}
                    </div>
                    
                    {showIconDropdown && modalType !== 'view' && (
                      <div 
                        className="position-absolute w-100 bg-white border rounded shadow-sm"
                        style={{ 
                          top: '100%', 
                          zIndex: 1000, 
                          maxHeight: '400px', 
                          overflowY: 'auto' 
                        }}
                      >
                        <div className="p-2 border-bottom">
                          <input
                            type="text"
                            className="form-control form-control-sm"
                            placeholder="Tìm kiếm icon..."
                            onClick={(e) => e.stopPropagation()}
                          />
                        </div>
                        <div className="p-2">
                          <div className="row g-1">
                            {commonIcons.map(icon => (
                              <div
                                key={icon}
                                className={`col-2 text-center p-2 rounded ${form.icon === icon ? 'bg-primary text-white' : 'hover-bg-light'}`}
                                style={{ 
                                  cursor: 'pointer',
                                  fontSize: '1.2rem',
                                  minHeight: '50px',
                                  display: 'flex',
                                  alignItems: 'center',
                                  justifyContent: 'center'
                                }}
                                onClick={() => {
                                  setForm(prev => ({ ...prev, icon: icon }));
                                  setShowIconDropdown(false);
                                }}
                                title={icon}
                              >
                                <i className={icon}></i>
                              </div>
                            ))}
                          </div>
                        </div>
                        <div className="p-2 border-top">
                          <div className="d-flex align-items-center">
                            <input
                              type="text"
                              className="form-control form-control-sm me-2"
                              placeholder="Nhập tên icon tùy chỉnh..."
                              value={form.icon && !commonIcons.includes(form.icon) ? form.icon : ''}
                              onChange={(e) => {
                                const value = e.target.value;
                                if (value && !value.startsWith('bi-')) {
                                  setForm(prev => ({ ...prev, icon: `bi-${value}` }));
                                } else {
                                  setForm(prev => ({ ...prev, icon: value }));
                                }
                              }}
                              onClick={(e) => e.stopPropagation()}
                            />
                            <button
                              type="button"
                              className="btn btn-sm btn-outline-secondary"
                              onClick={() => setShowIconDropdown(false)}
                            >
                              Đóng
                            </button>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                  <Form.Text className="text-muted">
                    Chọn icon phù hợp với loại dịch vụ hoặc nhập tên icon tùy chỉnh
                  </Form.Text>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="featured"
                    label="Dịch vụ nổi bật"
                    checked={form.featured}
                    onChange={handleFormChange}
                    disabled={modalType === 'view'}
                  />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Check
                    type="checkbox"
                    name="isActive"
                    label="Hiển thị dịch vụ"
                    checked={form.isActive}
                    onChange={handleFormChange}
                    disabled={modalType === 'view'}
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={12}>
                <Form.Group className="mb-3">
                  <Form.Label>Phương thức lấy mẫu</Form.Label>
                  <div className="d-flex flex-wrap gap-3">
                    {methods.map(method => {
                      const displayInfo = getMethodDisplayInfo(method.id);
                      const isSelected = form.methodIds.includes(method.id);
                      
                      return (
                        <div key={method.id} className="d-flex align-items-center">
                          <Form.Check
                            type="checkbox"
                            id={`method-${method.id}`}
                            checked={isSelected}
                            onChange={() => handleMethodChange(method.id)}
                            className="me-2"
                            disabled={modalType === 'view'}
                          />
                          <label 
                            htmlFor={`method-${method.id}`}
                            className={`badge bg-${displayInfo.color} p-2`}
                            style={{ 
                              cursor: modalType === 'view' ? 'default' : 'pointer',
                              borderRadius: '8px',
                              fontWeight: '500',
                              opacity: isSelected ? 1 : 0.7
                            }}
                          >
                            <i className={`${displayInfo.icon} me-1`}></i>
                            {method.name}
                          </label>
                        </div>
                      );
                    })}
                  </div>
                </Form.Group>
              </Col>
            </Row>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleCloseModal} disabled={submitting}>
              {modalType === 'view' ? 'Đóng' : 'Hủy'}
            </Button>
            {modalType !== 'view' && (
              <Button variant="primary" type="submit" disabled={submitting}>
                {submitting ? (
                  <>
                    <Spinner animation="border" size="sm" className="me-2" />
                    Đang xử lý...
                  </>
                ) : (
                  modalType === 'add' ? 'Thêm' : 'Cập nhật'
                )}
            </Button>
            )}
          </Modal.Footer>
        </Form>
      </Modal>
    </div>
  );
}

export default ServiceManagement; 