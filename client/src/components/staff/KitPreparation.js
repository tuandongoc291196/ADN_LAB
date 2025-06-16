import React, { useState, useEffect } from 'react';
import { Row, Col, Card, Button, Badge, Alert, Modal, Form, Table, InputGroup } from 'react-bootstrap';

const KitPreparation = ({ user }) => {
  const [orders, setOrders] = useState([
    {
      id: "ORD001",
      customerName: "Nguyễn Văn A",
      phone: "0123456789",
      service: "Xét nghiệm ADN cha con",
      serviceType: "civil",
      kitType: "standard",
      status: "waiting-kit-prep",
      priority: "normal",
      orderDate: "2024-03-15",
      expectedDate: "2024-03-20",
      participants: 2
    },
    {
      id: "ORD002",
      customerName: "Trần Thị B",
      phone: "0987654321",
      service: "Xét nghiệm ADN huyết thống",
      serviceType: "civil",
      kitType: "extended",
      status: "kit-prepared",
      priority: "high",
      orderDate: "2024-03-16",
      expectedDate: "2024-03-21",
      participants: 3,
      preparedBy: "NV001",
      preparedDate: "2024-03-17"
    },
    {
      id: "ORD003",
      customerName: "Lê Văn C",
      phone: "0369852147",
      service: "Xét nghiệm ADN hành chính",
      serviceType: "administrative",
      kitType: "standard",
      status: "kit-sent",
      priority: "normal",
      orderDate: "2024-03-14",
      expectedDate: "2024-03-19",
      participants: 2,
      preparedBy: "NV002",
      preparedDate: "2024-03-15",
      sentDate: "2024-03-16",
      trackingNumber: "GHN123456789",
      estimatedDelivery: "2024-03-18"
    },
    {
      id: "ORD004",
      customerName: "Phạm Thị D",
      phone: "0589632147",
      service: "Xét nghiệm ADN cha con",
      serviceType: "civil",
      kitType: "prenatal",
      status: "kit-sent",
      priority: "high",
      orderDate: "2024-03-13",
      expectedDate: "2024-03-18",
      participants: 2,
      preparedBy: "NV001",
      preparedDate: "2024-03-14",
      sentDate: "2024-03-15",
      trackingNumber: "GHN987654321",
      estimatedDelivery: "2024-03-17",
      returnInfo: {
        trackingNumber: "GHN987654321",
        carrier: "Giao hàng nhanh",
        returnDate: "2024-03-20",
        note: "Khách hàng đã gửi lại kit qua Giao hàng nhanh"
      }
    },
    {
      id: "ORD005",
      customerName: "Hoàng Văn E",
      phone: "0741258963",
      service: "Xét nghiệm ADN huyết thống",
      serviceType: "civil",
      kitType: "discreet",
      status: "sample-received",
      priority: "normal",
      orderDate: "2024-03-12",
      expectedDate: "2024-03-17",
      participants: 3,
      preparedBy: "NV002",
      preparedDate: "2024-03-13",
      sentDate: "2024-03-14",
      trackingNumber: "GHN456789123",
      estimatedDelivery: "2024-03-16",
      returnInfo: {
        trackingNumber: "GHN456789123",
        carrier: "Viettel Post",
        returnDate: "2024-03-19",
        note: "Khách hàng đã gửi lại kit qua Viettel Post"
      },
      receivedDate: "2024-03-20"
    }
  ]);
  const [filteredOrders, setFilteredOrders] = useState([]);
  const [showPrepModal, setShowPrepModal] = useState(false);
  const [showReturnConfirmModal, setShowReturnConfirmModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [returnLoading, setReturnLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [alert, setAlert] = useState({ show: false, message: '', type: '' });

  // Thêm state cho thông tin kit theo từng loại dịch vụ
  const [kitDetails] = useState({
    // Kit cho dịch vụ hành chính (có giá trị pháp lý)
    administrative: {
      'admin-birth-cert': {
        name: 'Kit ADN khai sinh',
        items: 'Que tăm bông chuyên dụng, túi bảo quản có mã, form pháp lý, hướng dẫn chi tiết',
        instructions: 'Bắt buộc có nhân viên giám sát. Que tăm bông quệt vào má trong 30 giây, bảo quản trong túi có mã định danh',
        specialRequirements: ['Giấy tờ tùy thân', 'Nhân chứng (nếu cần)', 'Giấy ủy quyền (nếu có)'],
        legalNote: 'Kit này có giá trị pháp lý, cần tuân thủ nghiêm ngặt quy trình'
      },
      'admin-immigration': {
        name: 'Kit ADN nhập tịch/visa',
        items: 'Que tăm bông quốc tế, túi bảo quản đặc biệt, form song ngữ, hướng dẫn quốc tế',
        instructions: 'Tuân thủ tiêu chuẩn quốc tế. Thu mẫu có giám sát, bảo quản theo chuẩn ISO',
        specialRequirements: ['Hộ chiếu', 'Visa (nếu có)', 'Giấy tờ nhập tịch'],
        legalNote: 'Kit đáp ứng tiêu chuẩn quốc tế cho thủ tục ngoại giao'
      },
      'admin-inheritance': {
        name: 'Kit ADN thừa kế',
        items: 'Que tăm bông pháp lý, túi bảo quản có niêm phong, biên bản thu mẫu, hướng dẫn tòa án',
        instructions: 'Thu mẫu có nhân chứng, niêm phong theo quy định pháp luật',
        specialRequirements: ['CCCD/CMND', 'Giấy chứng tử', 'Giấy tờ tài sản'],
        legalNote: 'Kit phục vụ thủ tục tòa án, cần có biên bản thu mẫu'
      },
      'admin-child-support': {
        name: 'Kit ADN cấp dưỡng',
        items: 'Que tăm bông tòa án, túi bảo quản có mã, form tòa án, hướng dẫn pháp lý',
        instructions: 'Thu mẫu theo yêu cầu tòa án, có sự giám sát của nhân viên',
        specialRequirements: ['CCCD/CMND', 'Giấy khai sinh con', 'Giấy tòa án'],
        legalNote: 'Kit phục vụ quyết định tòa án về trách nhiệm cấp dưỡng'
      },
      'admin-missing-person': {
        name: 'Kit ADN nhận người thân',
        items: 'Que tăm bông đặc biệt, túi bảo quản mở rộng, form nhận dạng, hướng dẫn tìm kiếm',
        instructions: 'Thu mẫu từ nhiều nguồn, bảo quản cẩn thận cho phân tích mở rộng',
        specialRequirements: ['CCCD/CMND', 'Giấy báo mất tích', 'Ảnh người thân'],
        legalNote: 'Kit hỗ trợ tìm kiếm người thân, có giá trị nhân đạo và pháp lý'
      }
    },
    // Kit cho dịch vụ dân sự (không có giá trị pháp lý)
    civil: {
      'civil-paternity': {
        name: 'Kit ADN huyết thống',
        items: 'Que tăm bông tiêu chuẩn, túi đựng mẫu, hướng dẫn tự thu mẫu',
        instructions: 'Có thể tự thu mẫu tại nhà. Que tăm bông quệt vào má trong 30 giây',
        specialRequirements: ['CCCD/CMND để xác minh'],
        legalNote: 'Kết quả chỉ mang tính tham khảo, không có giá trị pháp lý'
      },
      'civil-prenatal': {
        name: 'Kit ADN trước sinh',
        items: 'Ống lấy máu chuyên dụng, que tăm bông cho cha, túi bảo quản lạnh, hướng dẫn đặc biệt',
        instructions: 'Bắt buộc có nhân viên y tế. Lấy máu mẹ 10ml, mẫu ADN cha',
        specialRequirements: ['Sổ khám thai', 'Siêu âm tuần tuổi thai', 'CCCD/CMND'],
        legalNote: 'Thực hiện từ tuần 7-8, an toàn cho mẹ và bé'
      },
      'civil-ancestry': {
        name: 'Kit ADN nguồn gốc',
        items: 'Que tăm bông phân tích gen, túi bảo quản đặc biệt, form thông tin gia đình',
        instructions: 'Thu mẫu đơn giản, có thể tự thực hiện tại nhà',
        specialRequirements: ['CCCD/CMND', 'Thông tin gia đình (nếu có)'],
        legalNote: 'Phân tích nguồn gốc tổ tiên, mang tính tham khảo'
      },
      'civil-personal': {
        name: 'Kit ADN cá nhân',
        items: 'Que tăm bông genome, túi bảo quản chuyên dụng, form sức khỏe, hướng dẫn chi tiết',
        instructions: 'Thu mẫu cẩn thận để phân tích toàn bộ genome',
        specialRequirements: ['CCCD/CMND', 'Thông tin sức khỏe cá nhân'],
        legalNote: 'Phân tích gen cá nhân, tư vấn sức khỏe'
      },
      'civil-discreet': {
        name: 'Kit ADN bí mật',
        items: 'Que tăm bông không nhãn, túi bảo quản ẩn danh, hướng dẫn bảo mật',
        instructions: 'Thu mẫu kín đáo, bảo mật tuyệt đối danh tính',
        specialRequirements: ['Chỉ cần CCCD người yêu cầu'],
        legalNote: 'Bảo mật hoàn toàn, kết quả chỉ cung cấp cho người yêu cầu'
      }
    }
  });

  // Thêm state cho theo dõi trạng thái gửi kit
  const [kitTracking] = useState({
    'VTP123456789': {
      status: 'delivered',
      history: [
        { date: '2024-01-28 15:00', status: 'sent', location: 'Trung tâm xét nghiệm ADN' },
        { date: '2024-01-28 18:30', status: 'in_transit', location: 'Trung tâm phân phối ViettelPost' },
        { date: '2024-01-29 09:15', status: 'delivered', location: 'Nhà khách hàng' }
      ]
    },
    'VTP987654321': {
      status: 'in_transit',
      history: [
        { date: '2024-01-28 09:00', status: 'sent', location: 'Trung tâm xét nghiệm ADN' },
        { date: '2024-01-28 12:30', status: 'in_transit', location: 'Trung tâm phân phối ViettelPost' }
      ]
    }
  });

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
        status: 'kit-prepared',
        priority: 'urgent',
        kitType: 'prenatal',
        preparedBy: 'Nguyễn Văn Staff',
        preparedDate: '2024-01-28 14:30',
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
        status: 'kit-sent',
        priority: 'medium',
        kitType: 'extended',
        preparedBy: 'Nguyễn Văn Staff',
        preparedDate: '2024-01-28 14:30',
        sentDate: '2024-01-29 09:00',
        trackingNumber: 'VTP123456789',
        estimatedDelivery: '2024-01-30'
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
        estimatedDelivery: '2024-01-29',
        returnInfo: {
          trackingNumber: 'VTP987654321',
          carrier: 'Viettel Post',
          returnDate: '2024-01-30',
          note: 'Khách hàng đã gửi lại kit qua Viettel Post'
        }
      },
      {
        id: 'ADN123474',
        customerName: 'Hoàng Văn E',
        phone: '0987654321',
        email: 'hoangvane@email.com',
        service: 'Xét nghiệm ADN cha con',
        serviceType: 'civil',
        orderDate: '2024-01-26',
        expectedDate: '2024-02-02',
        collectionMethod: 'self-sample',
        address: '567 Nguyễn Đình Chiểu, Q3, TP.HCM',
        participants: 2,
        status: 'sample-received',
        priority: 'normal',
        kitType: 'standard',
        preparedBy: 'Nguyễn Văn Staff',
        preparedDate: '2024-01-26 15:00',
        sentDate: '2024-01-27 09:00',
        trackingNumber: 'VTP456789123',
        estimatedDelivery: '2024-01-28',
        returnInfo: {
          trackingNumber: 'VTP456789123',
          carrier: 'Giao hàng nhanh',
          returnDate: '2024-01-29',
          note: 'Khách hàng đã gửi lại kit qua Giao hàng nhanh'
        },
        receivedDate: '2024-01-30'
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
      'waiting-kit-prep': { bg: 'warning', text: 'Chờ chuẩn bị kit' },
      'kit-prepared': { bg: 'info', text: 'Đã chuẩn bị kit' },
      'kit-sent': { bg: 'primary', text: 'Đã gửi kit' },
      'waiting-sample': { bg: 'secondary', text: 'Chờ nhận mẫu' },
      'ready-for-collection': { bg: 'success', text: 'Sẵn sàng thu mẫu' },
      'sample-received': { bg: 'success', text: 'Đã nhận mẫu' }
    };
    
    const config = statusConfig[status] || { bg: 'secondary', text: status };
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

  // Hàm lấy thông tin kit theo dịch vụ
  const getKitInfoByService = (serviceId, serviceType) => {
    if (serviceType === 'administrative') {
      return kitDetails.administrative[serviceId] || kitDetails.administrative['admin-birth-cert'];
    } else {
      return kitDetails.civil[serviceId] || kitDetails.civil['civil-paternity'];
    }
  };

  // Hàm render chi tiết kit theo dịch vụ
  const renderServiceSpecificKitDetails = (order) => {
    const kitInfo = getKitInfoByService(order.serviceId, order.serviceType);
    
    return (
      <div>
        <h6 className="text-primary mb-3">Chi tiết kit {kitInfo.name}</h6>
        
        {/* Thành phần kit */}
        <div className="mb-3">
          <strong>Thành phần kit:</strong>
          <p className="text-muted mt-1">{kitInfo.items}</p>
        </div>

        {/* Hướng dẫn sử dụng */}
        <div className="mb-3">
          <strong>Hướng dẫn sử dụng:</strong>
          <p className="text-muted mt-1">{kitInfo.instructions}</p>
        </div>

        {/* Yêu cầu đặc biệt */}
        <div className="mb-3">
          <strong>Giấy tờ cần thiết:</strong>
          <ul className="mt-1">
            {kitInfo.specialRequirements.map((req, index) => (
              <li key={index} className="text-muted">{req}</li>
            ))}
          </ul>
        </div>

        {/* Lưu ý pháp lý */}
        <Alert variant={order.serviceType === 'administrative' ? 'warning' : 'info'} className="mt-3">
          <i className={`bi ${order.serviceType === 'administrative' ? 'bi-shield-check' : 'bi-info-circle'} me-2`}></i>
          <strong>Lưu ý:</strong> {kitInfo.legalNote}
        </Alert>

        {/* Quy trình đặc biệt cho dịch vụ hành chính */}
        {order.serviceType === 'administrative' && (
          <Alert variant="danger" className="mt-3">
            <i className="bi bi-exclamation-triangle me-2"></i>
            <strong>Quan trọng:</strong> Dịch vụ có giá trị pháp lý - Bắt buộc phải có sự giám sát của nhân viên khi thu mẫu.
            Không được phép tự thu mẫu tại nhà.
          </Alert>
        )}

        {/* Phương thức thu mẫu được phép */}
        <div className="mt-3">
          <strong>Phương thức thu mẫu được phép:</strong>
          <div className="mt-2">
            {order.serviceType === 'administrative' ? (
              <>
                <Badge bg="warning" className="me-2">
                  <i className="bi bi-hospital me-1"></i>
                  Tại cơ sở
                </Badge>
                <Badge bg="info">
                  <i className="bi bi-truck me-1"></i>
                  Nhân viên tới nhà
                </Badge>
              </>
            ) : (
              <>
                <Badge bg="success" className="me-2">
                  <i className="bi bi-house me-1"></i>
                  Tự thu tại nhà
                </Badge>
                <Badge bg="warning" className="me-2">
                  <i className="bi bi-truck me-1"></i>
                  Nhân viên tới nhà
                </Badge>
                <Badge bg="primary">
                  <i className="bi bi-hospital me-1"></i>
                  Tại cơ sở
                </Badge>
              </>
            )}
          </div>
        </div>
      </div>
    );
  };

  // Thêm hàm hiển thị thông tin chi tiết kit
  const renderKitDetails = (kitType) => {
    const details = kitDetails[kitType];
    if (!details) return null;

    return (
      <div className="mt-3">
        <h6 className="text-primary">Thông tin kit:</h6>
        <ul className="list-unstyled">
          <li><strong>Tên kit:</strong> {details.name}</li>
          <li><strong>Thành phần:</strong> {details.items}</li>
          <li><strong>Hướng dẫn:</strong> {details.instructions}</li>
        </ul>
      </div>
    );
  };

  // Thêm hàm hiển thị lịch sử theo dõi kit
  const renderKitTracking = (trackingNumber) => {
    const tracking = kitTracking[trackingNumber];
    if (!tracking) return null;

    return (
      <div className="mt-3">
        <h6 className="text-primary">Theo dõi trạng thái:</h6>
        <div className="timeline">
          {tracking.history.map((item, index) => (
            <div key={index} className="d-flex mb-2">
              <div className="me-3">
                <i className={`bi bi-circle-fill text-${getTrackingStatusColor(item.status)}`}></i>
              </div>
              <div>
                <div className="small text-muted">{new Date(item.date).toLocaleString('vi-VN')}</div>
                <div>{item.location}</div>
                <div className="small text-muted">{getTrackingStatusText(item.status)}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  };

  const getTrackingStatusColor = (status) => {
    const colors = {
      sent: 'primary',
      in_transit: 'warning',
      delivered: 'success',
      returned: 'danger'
    };
    return colors[status] || 'secondary';
  };

  const getTrackingStatusText = (status) => {
    const texts = {
      sent: 'Đã gửi',
      in_transit: 'Đang vận chuyển',
      delivered: 'Đã giao',
      returned: 'Đã trả về'
    };
    return texts[status] || status;
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
            <th>Loại kit</th>
            <th>Trạng thái</th>
            <th>Ưu tiên</th>
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
                <small className="text-muted">
                  {order.serviceType === 'civil' ? 'Dân sự' : 'Hành chính'}
                </small>
              </td>
              <td>
                <div>{getKitTypeInfo(order.kitType).name}</div>
                <small className="text-muted">{getKitTypeInfo(order.kitType).items}</small>
              </td>
              <td>{getStatusBadge(order.status)}</td>
              <td>{getPriorityBadge(order.priority)}</td>
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
                        // Chuyển đến trang thu mẫu hoặc hiển thị thông báo
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

      {/* Kit Preparation Modal */}
      <Modal show={showPrepModal} onHide={() => setShowPrepModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            <i className="bi bi-box-seam me-2"></i>
            Chi tiết kit xét nghiệm
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {selectedOrder && (
            <>
              {renderServiceSpecificKitDetails(selectedOrder)}
              
              {selectedOrder.specialInstructions && (
                <div className="mt-3">
                  <h6 className="text-warning">Lưu ý đặc biệt:</h6>
                  <p className="text-muted">{selectedOrder.specialInstructions}</p>
                </div>
              )}
            </>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowPrepModal(false)}>
            Đóng
          </Button>
          {selectedOrder?.status === 'waiting-kit-prep' && (
            <Button 
              variant="success" 
              onClick={handleConfirmPreparation}
            >
              <i className="bi bi-check-circle me-2"></i>
              Xác nhận chuẩn bị
            </Button>
          )}
        </Modal.Footer>
      </Modal>

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