import React, { useState } from 'react';
import { Row, Col, Card, Button, Form, Alert, Modal, Badge, Accordion, Tab, Tabs } from 'react-bootstrap';

const SupportCenter = ({ user }) => {
  const [activeTab, setActiveTab] = useState('contact');
  const [supportTickets, setSupportTickets] = useState([]);
  const [showNewTicketModal, setShowNewTicketModal] = useState(false);
  const [showFeedbackModal, setShowFeedbackModal] = useState(false);
  const [message, setMessage] = useState({ type: '', content: '' });

  const [newTicket, setNewTicket] = useState({
    category: '',
    subject: '',
    description: '',
    priority: 'medium',
    attachments: []
  });

  const [feedback, setFeedback] = useState({
    orderId: '',
    rating: 5,
    serviceQuality: 5,
    staffAttitude: 5,
    facilities: 5,
    overallSatisfaction: 5,
    comment: '',
    recommendation: true
  });

  // Mock support tickets
  const mockTickets = [
    {
      id: 'TK-001',
      subject: 'Không thể tải kết quả xét nghiệm',
      category: 'technical',
      status: 'resolved',
      priority: 'high',
      createdDate: '2024-01-20',
      lastUpdate: '2024-01-21',
      assignedTo: 'Nguyễn Văn X',
      messages: [
        {
          id: 1,
          sender: 'customer',
          content: 'Tôi không thể tải được file kết quả xét nghiệm ADN123457. Vui lòng hỗ trợ.',
          timestamp: '2024-01-20 09:00',
          attachments: []
        },
        {
          id: 2,
          sender: 'support',
          content: 'Xin chào, chúng tôi đã kiểm tra và thấy file kết quả đã sẵn sàng. Vui lòng thử xóa cache trình duyệt và thử lại.',
          timestamp: '2024-01-20 10:30',
          attachments: []
        },
        {
          id: 3,
          sender: 'customer',
          content: 'Đã thử theo hướng dẫn và tải thành công. Cảm ơn bạn!',
          timestamp: '2024-01-21 08:00',
          attachments: []
        }
      ]
    },
    {
      id: 'TK-002',
      subject: 'Thắc mắc về kết quả xét nghiệm',
      category: 'consultation',
      status: 'open',
      priority: 'medium',
      createdDate: '2024-01-22',
      lastUpdate: '2024-01-22',
      assignedTo: 'TS. Trần Thị Y',
      messages: [
        {
          id: 1,
          sender: 'customer',
          content: 'Tôi có một số thắc mắc về kết quả xét nghiệm ADN123458. Có thể tư vấn thêm không?',
          timestamp: '2024-01-22 14:00',
          attachments: []
        },
        {
          id: 2,
          sender: 'support',
          content: 'Chúng tôi đã chuyển yêu cầu đến chuyên gia tư vấn. Bạn sẽ nhận được phản hồi trong 24h.',
          timestamp: '2024-01-22 14:30',
          attachments: []
        }
      ]
    }
  ];

  // FAQ data
  const faqData = [
    {
      category: 'Đặt lịch & Thanh toán',
      questions: [
        {
          question: 'Làm thế nào để đặt lịch xét nghiệm ADN?',
          answer: 'Bạn có thể đặt lịch qua website bằng cách: 1) Chọn dịch vụ phù hợp 2) Chọn phương thức thu mẫu 3) Điền thông tin và chọn thời gian 4) Xác nhận đặt lịch'
        },
        {
          question: 'Có những phương thức thanh toán nào?',
          answer: 'Chúng tôi hỗ trợ: Chuyển khoản ngân hàng, Thẻ tín dụng/ghi nợ, Ví điện tử (MoMo, ZaloPay), Tiền mặt tại cơ sở'
        },
        {
          question: 'Có thể hủy hoặc đổi lịch hẹn không?',
          answer: 'Có thể hủy/đổi lịch miễn phí trước 24h. Sau thời gian này có thể áp dụng phí theo quy định.'
        }
      ]
    },
    {
      category: 'Xét nghiệm & Kết quả',
      questions: [
        {
          question: 'Thời gian có kết quả xét nghiệm là bao lâu?',
          answer: 'ADN dân sự: 5-7 ngày làm việc. ADN hành chính: 3-5 ngày làm việc. Có dịch vụ khẩn cấp 24-48h.'
        },
        {
          question: 'Độ chính xác của xét nghiệm ADN là bao nhiêu?',
          answer: 'Độ chính xác lên đến 99.999% khi xác nhận quan hệ huyết thống và 100% khi loại trừ quan hệ.'
        },
        {
          question: 'Làm thế nào để nhận kết quả?',
          answer: 'Kết quả sẽ được gửi qua email và SMS. Bạn cũng có thể tải về từ tài khoản cá nhân trên website.'
        }
      ]
    },
    {
      category: 'Thu mẫu & Quy trình',
      questions: [
        {
          question: 'Các phương thức thu mẫu có gì khác nhau?',
          answer: 'Tự thu mẫu: Tiện lợi, chỉ dành cho ADN dân sự. Thu tại nhà: Nhân viên đến thu mẫu. Thu tại cơ sở: Bắt buộc với ADN hành chính.'
        },
        {
          question: 'Cần chuẩn bị gì khi đi xét nghiệm?',
          answer: 'CCCD/CMND gốc của tất cả người tham gia. Với trẻ em dưới 14 tuổi cần giấy khai sinh và CCCD của người giám hộ.'
        }
      ]
    }
  ];

  const handleCreateTicket = () => {
    if (!newTicket.category || !newTicket.subject || !newTicket.description) {
      setMessage({ type: 'danger', content: 'Vui lòng điền đầy đủ thông tin!' });
      return;
    }

    // TODO: API call to create ticket
    console.log('Creating ticket:', newTicket);
    setMessage({ type: 'success', content: 'Yêu cầu hỗ trợ đã được gửi thành công!' });
    setShowNewTicketModal(false);
    setNewTicket({
      category: '',
      subject: '',
      description: '',
      priority: 'medium',
      attachments: []
    });
    setTimeout(() => setMessage({ type: '', content: '' }), 5000);
  };

  const handleSubmitFeedback = () => {
    if (!feedback.orderId) {
      setMessage({ type: 'danger', content: 'Vui lòng chọn đơn hàng để đánh giá!' });
      return;
    }

    // TODO: API call to submit feedback
    console.log('Submitting feedback:', feedback);
    setMessage({ type: 'success', content: 'Cảm ơn bạn đã gửi đánh giá!' });
    setShowFeedbackModal(false);
    setFeedback({
      orderId: '',
      rating: 5,
      serviceQuality: 5,
      staffAttitude: 5,
      facilities: 5,
      overallSatisfaction: 5,
      comment: '',
      recommendation: true
    });
    setTimeout(() => setMessage({ type: '', content: '' }), 5000);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'open':
        return <Badge bg="primary">Đang xử lý</Badge>;
      case 'resolved':
        return <Badge bg="success">Đã giải quyết</Badge>;
      case 'closed':
        return <Badge bg="secondary">Đã đóng</Badge>;
      case 'pending':
        return <Badge bg="warning">Chờ phản hồi</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <Badge bg="danger">Cao</Badge>;
      case 'medium':
        return <Badge bg="warning">Trung bình</Badge>;
      case 'low':
        return <Badge bg="success">Thấp</Badge>;
      default:
        return <Badge bg="secondary">Không xác định</Badge>;
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('vi-VN', options);
  };

  return (
    <>
      {/* Header */}
      <Row className="mb-4">
        <Col>
          <div className="d-flex justify-content-between align-items-center">
            <div>
              <h2 className="mb-1">Trung tâm hỗ trợ</h2>
              <p className="text-muted mb-0">Liên hệ hỗ trợ, câu hỏi thường gặp và phản hồi</p>
            </div>
          </div>
        </Col>
      </Row>

      {/* Message Alert */}
      {message.content && (
        <Alert variant={message.type} className="mb-4" dismissible onClose={() => setMessage({ type: '', content: '' })}>
          {message.content}
        </Alert>
      )}

      <Tabs
        activeKey={activeTab}
        onSelect={(k) => setActiveTab(k)}
        className="mb-4"
      >
        {/* Quick Contact Tab */}
        <Tab eventKey="contact" title={<><i className="bi bi-telephone me-2"></i>Liên hệ nhanh</>}>
          <Row>
            {/* Contact Methods */}
            <Col lg={8} className="mb-4">
              <Row>
                <Col md={6} className="mb-4">
                  <Card className="border-primary h-100">
                    <Card.Header className="bg-primary text-white text-center">
                      <i className="bi bi-telephone fs-1"></i>
                      <h5 className="mt-2 mb-0">Hotline 24/7</h5>
                    </Card.Header>
                    <Card.Body className="text-center">
                      <h4 className="text-primary mb-3">1900 1234</h4>
                      <p className="text-muted mb-3">Hỗ trợ khẩn cấp và tư vấn trực tiếp</p>
                      <Button variant="primary" className="w-100">
                        <i className="bi bi-telephone me-2"></i>
                        Gọi ngay
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6} className="mb-4">
                  <Card className="border-success h-100">
                    <Card.Header className="bg-success text-white text-center">
                      <i className="bi bi-chat-dots fs-1"></i>
                      <h5 className="mt-2 mb-0">Live Chat</h5>
                    </Card.Header>
                    <Card.Body className="text-center">
                      <h6 className="text-success mb-3">Trực tuyến</h6>
                      <p className="text-muted mb-3">Chat trực tiếp với chuyên viên hỗ trợ</p>
                      <Button variant="success" className="w-100">
                        <i className="bi bi-chat-dots me-2"></i>
                        Bắt đầu chat
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6} className="mb-4">
                  <Card className="border-info h-100">
                    <Card.Header className="bg-info text-white text-center">
                      <i className="bi bi-envelope fs-1"></i>
                      <h5 className="mt-2 mb-0">Email</h5>
                    </Card.Header>
                    <Card.Body className="text-center">
                      <h6 className="text-info mb-3">support@adnlab.vn</h6>
                      <p className="text-muted mb-3">Phản hồi trong vòng 2 giờ</p>
                      <Button variant="info" className="w-100">
                        <i className="bi bi-envelope me-2"></i>
                        Gửi email
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>

                <Col md={6} className="mb-4">
                  <Card className="border-warning h-100">
                    <Card.Header className="bg-warning text-dark text-center">
                      <i className="bi bi-ticket-detailed fs-1"></i>
                      <h5 className="mt-2 mb-0">Tạo ticket hỗ trợ</h5>
                    </Card.Header>
                    <Card.Body className="text-center">
                      <h6 className="text-warning mb-3">Hỗ trợ chuyên sâu</h6>
                      <p className="text-muted mb-3">Để lại thông tin chi tiết, chúng tôi sẽ liên hệ</p>
                      <Button 
                        variant="warning" 
                        className="w-100"
                        onClick={() => setShowNewTicketModal(true)}
                      >
                        <i className="bi bi-plus-circle me-2"></i>
                        Tạo ticket mới
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Col>

            {/* Office Information */}
            <Col lg={4}>
              <Card className="shadow-sm">
                <Card.Header className="bg-dark text-white">
                  <h5 className="mb-0">
                    <i className="bi bi-building me-2"></i>
                    Thông tin cơ sở
                  </h5>
                </Card.Header>
                <Card.Body>
                  <div className="mb-3">
                    <h6 className="text-primary">Trụ sở Hà Nội</h6>
                    <p className="small mb-1">123 Đường ABC, Quận XYZ, Hà Nội</p>
                    <p className="small mb-1">
                      <i className="bi bi-telephone me-1"></i>
                      083.424.3399
                    </p>
                    <p className="small">
                      <i className="bi bi-clock me-1"></i>
                      Thứ 2-7: 7:00-18:00, CN: 8:00-17:00
                    </p>
                  </div>
                  
                  <div className="mb-3">
                    <h6 className="text-primary">Chi nhánh TP.HCM</h6>
                    <p className="small mb-1">456 Đường DEF, Quận GHI, TP.HCM</p>
                    <p className="small mb-1">
                      <i className="bi bi-telephone me-1"></i>
                      0888.109.486
                    </p>
                    <p className="small">
                      <i className="bi bi-clock me-1"></i>
                      Thứ 2-7: 7:00-18:00, CN: 8:00-17:00
                    </p>
                  </div>

                  <div>
                    <h6 className="text-primary">Chi nhánh Đà Nẵng</h6>
                    <p className="small mb-1">789 Đường JKL, Quận MNO, Đà Nẵng</p>
                    <p className="small mb-1">
                      <i className="bi bi-telephone me-1"></i>
                      0911.18.5577
                    </p>
                    <p className="small">
                      <i className="bi bi-clock me-1"></i>
                      Thứ 2-7: 7:00-18:00, CN: 8:00-17:00
                    </p>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Support Tickets Tab */}
        <Tab eventKey="tickets" title={<><i className="bi bi-ticket-detailed me-2"></i>Yêu cầu hỗ trợ ({mockTickets.length})</>}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <h5 className="mb-0">Lịch sử yêu cầu hỗ trợ</h5>
            <Button variant="primary" onClick={() => setShowNewTicketModal(true)}>
              <i className="bi bi-plus-circle me-2"></i>
              Tạo yêu cầu mới
            </Button>
          </div>

          {mockTickets.length > 0 ? (
            <div className="list-group">
              {mockTickets.map(ticket => (
                <div key={ticket.id} className="list-group-item">
                  <div className="d-flex justify-content-between align-items-start mb-2">
                    <div>
                      <h6 className="mb-1">{ticket.subject}</h6>
                      <p className="text-muted small mb-1">Mã: {ticket.id}</p>
                    </div>
                    <div className="text-end">
                      {getStatusBadge(ticket.status)}
                      <div className="mt-1">
                        {getPriorityBadge(ticket.priority)}
                      </div>
                    </div>
                  </div>
                  
                  <div className="row small text-muted mb-2">
                    <div className="col-sm-6">
                      <i className="bi bi-calendar me-1"></i>
                      Tạo: {formatDate(ticket.createdDate)}
                    </div>
                    <div className="col-sm-6">
                      <i className="bi bi-clock me-1"></i>
                      Cập nhật: {formatDate(ticket.lastUpdate)}
                    </div>
                  </div>
                  
                  <div className="small text-muted mb-3">
                    <i className="bi bi-person me-1"></i>
                    Được xử lý bởi: {ticket.assignedTo}
                  </div>

                  <Accordion>
                    <Accordion.Item eventKey={ticket.id}>
                      <Accordion.Header>
                        Xem hội thoại ({ticket.messages.length} tin nhắn)
                      </Accordion.Header>
                      <Accordion.Body>
                        {ticket.messages.map(msg => (
                          <div key={msg.id} className={`mb-3 ${msg.sender === 'customer' ? 'text-end' : ''}`}>
                            <div className={`d-inline-block p-3 rounded ${
                              msg.sender === 'customer' 
                                ? 'bg-primary text-white' 
                                : 'bg-light'
                            }`} style={{ maxWidth: '70%' }}>
                              <div className="small mb-1">
                                <strong>
                                  {msg.sender === 'customer' ? 'Bạn' : 'Hỗ trợ viên'}
                                </strong>
                                <span className="ms-2 opacity-75">
                                  {formatDate(msg.timestamp)}
                                </span>
                              </div>
                              <div>{msg.content}</div>
                            </div>
                          </div>
                        ))}
                        
                        {ticket.status === 'open' && (
                          <div className="mt-3">
                            <Form>
                              <Form.Group className="mb-2">
                                <Form.Control
                                  as="textarea"
                                  rows={2}
                                  placeholder="Nhập phản hồi..."
                                />
                              </Form.Group>
                              <Button variant="primary" size="sm">
                                <i className="bi bi-send me-1"></i>
                                Gửi phản hồi
                              </Button>
                            </Form>
                          </div>
                        )}
                      </Accordion.Body>
                    </Accordion.Item>
                  </Accordion>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-5">
              <i className="bi bi-ticket text-muted" style={{ fontSize: '4rem' }}></i>
              <h5 className="text-muted mt-3">Chưa có yêu cầu hỗ trợ nào</h5>
              <p className="text-muted">Tạo yêu cầu hỗ trợ đầu tiên của bạn</p>
              <Button variant="primary" onClick={() => setShowNewTicketModal(true)}>
                <i className="bi bi-plus-circle me-2"></i>
                Tạo yêu cầu mới
              </Button>
            </div>
          )}
        </Tab>

        {/* FAQ Tab */}
        <Tab eventKey="faq" title={<><i className="bi bi-question-circle me-2"></i>Câu hỏi thường gặp</>}>
          <Row>
            <Col lg={8}>
              {faqData.map((category, categoryIndex) => (
                <Card key={categoryIndex} className="mb-4 shadow-sm">
                  <Card.Header className="bg-light">
                    <h5 className="mb-0 text-primary">{category.category}</h5>
                  </Card.Header>
                  <Card.Body>
                    <Accordion>
                      {category.questions.map((item, qIndex) => (
                        <Accordion.Item key={qIndex} eventKey={`${categoryIndex}-${qIndex}`}>
                          <Accordion.Header>{item.question}</Accordion.Header>
                          <Accordion.Body>{item.answer}</Accordion.Body>
                        </Accordion.Item>
                      ))}
                    </Accordion>
                  </Card.Body>
                </Card>
              ))}
            </Col>

            <Col lg={4}>
              <Card className="shadow-sm sticky-top">
                <Card.Header className="bg-info text-white">
                  <h5 className="mb-0">Không tìm thấy câu trả lời?</h5>
                </Card.Header>
                <Card.Body>
                  <p className="mb-3">Liên hệ với đội ngũ hỗ trợ chuyên nghiệp của chúng tôi</p>
                  <div className="d-grid gap-2">
                    <Button variant="primary">
                      <i className="bi bi-telephone me-2"></i>
                      Gọi hotline
                    </Button>
                    <Button variant="outline-primary">
                      <i className="bi bi-chat-dots me-2"></i>
                      Live chat
                    </Button>
                    <Button 
                      variant="outline-info"
                      onClick={() => setShowNewTicketModal(true)}
                    >
                      <i className="bi bi-ticket me-2"></i>
                      Tạo ticket
                    </Button>
                  </div>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>

        {/* Feedback Tab */}
        <Tab eventKey="feedback" title={<><i className="bi bi-star me-2"></i>Đánh giá dịch vụ</>}>
          <Row>
            <Col lg={8}>
              <Card className="shadow-sm">
                <Card.Header className="bg-warning text-dark">
                  <h5 className="mb-0">
                    <i className="bi bi-star me-2"></i>
                    Đánh giá dịch vụ
                  </h5>
                </Card.Header>
                <Card.Body>
                  <p className="text-muted">
                    Ý kiến của bạn rất quan trọng với chúng tôi. Hãy chia sẻ trải nghiệm để chúng tôi có thể cải thiện dịch vụ tốt hơn.
                  </p>
                  <Button 
                    variant="warning" 
                    size="lg"
                    onClick={() => setShowFeedbackModal(true)}
                  >
                    <i className="bi bi-star me-2"></i>
                    Gửi đánh giá ngay
                  </Button>
                </Card.Body>
              </Card>

              {/* Previous Feedback */}
              <Card className="shadow-sm mt-4">
                <Card.Header>
                  <h5 className="mb-0">Đánh giá trước đây</h5>
                </Card.Header>
                <Card.Body>
                  <div className="text-center py-4">
                    <i className="bi bi-chat-heart text-muted" style={{ fontSize: '3rem' }}></i>
                    <h6 className="text-muted mt-3">Chưa có đánh giá nào</h6>
                    <p className="text-muted">Đánh giá của bạn sẽ hiển thị ở đây</p>
                  </div>
                </Card.Body>
              </Card>
            </Col>

            <Col lg={4}>
              <Card className="shadow-sm">
                <Card.Header className="bg-success text-white">
                  <h6 className="mb-0">Đánh giá trung bình của bạn</h6>
                </Card.Header>
                <Card.Body className="text-center">
                  <div className="h1 text-warning mb-2">
                    {Array.from({length: 5}, (_, i) => (
                      <i key={i} className="bi bi-star-fill"></i>
                    ))}
                  </div>
                  <h4 className="text-success mb-1">5.0/5</h4>
                  <p className="text-muted small">Dựa trên 3 đánh giá</p>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Tab>
      </Tabs>

      {/* New Ticket Modal */}
      <Modal show={showNewTicketModal} onHide={() => setShowNewTicketModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Tạo yêu cầu hỗ trợ mới</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Row>
              <Col md={6} className="mb-3">
                <Form.Label>Danh mục *</Form.Label>
                <Form.Select
                  value={newTicket.category}
                  onChange={(e) => setNewTicket({...newTicket, category: e.target.value})}
                >
                  <option value="">Chọn danh mục</option>
                  <option value="technical">Vấn đề kỹ thuật</option>
                  <option value="consultation">Tư vấn chuyên môn</option>
                  <option value="appointment">Vấn đề lịch hẹn</option>
                  <option value="payment">Thanh toán</option>
                  <option value="results">Kết quả xét nghiệm</option>
                  <option value="complaint">Khiếu nại</option>
                  <option value="other">Khác</option>
                </Form.Select>
              </Col>
              <Col md={6} className="mb-3">
                <Form.Label>Mức độ ưu tiên</Form.Label>
                <Form.Select
                  value={newTicket.priority}
                  onChange={(e) => setNewTicket({...newTicket, priority: e.target.value})}
                >
                  <option value="low">Thấp</option>
                  <option value="medium">Trung bình</option>
                  <option value="high">Cao</option>
                </Form.Select>
              </Col>
            </Row>
            
            <Form.Group className="mb-3">
              <Form.Label>Tiêu đề *</Form.Label>
              <Form.Control
                type="text"
                placeholder="Mô tả ngắn gọn vấn đề..."
                value={newTicket.subject}
                onChange={(e) => setNewTicket({...newTicket, subject: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Mô tả chi tiết *</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Mô tả chi tiết vấn đề bạn gặp phải..."
                value={newTicket.description}
                onChange={(e) => setNewTicket({...newTicket, description: e.target.value})}
              />
            </Form.Group>
            
            <Form.Group className="mb-3">
              <Form.Label>Đính kèm file (nếu có)</Form.Label>
              <Form.Control type="file" multiple />
              <Form.Text className="text-muted">
                Hỗ trợ: JPG, PNG, PDF. Tối đa 10MB/file.
              </Form.Text>
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowNewTicketModal(false)}>
            Hủy
          </Button>
          <Button variant="primary" onClick={handleCreateTicket}>
            <i className="bi bi-send me-2"></i>
            Gửi yêu cầu
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Feedback Modal */}
      <Modal show={showFeedbackModal} onHide={() => setShowFeedbackModal(false)} size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Đánh giá dịch vụ</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-4">
              <Form.Label>Chọn đơn hàng để đánh giá *</Form.Label>
              <Form.Select
                value={feedback.orderId}
                onChange={(e) => setFeedback({...feedback, orderId: e.target.value})}
              >
                <option value="">Chọn đơn hàng</option>
                <option value="ADN123458">ADN123458 - Xét nghiệm ADN khai sinh</option>
                <option value="ADN123457">ADN123457 - Xét nghiệm ADN thai nhi</option>
                <option value="ADN123455">ADN123455 - Xét nghiệm ADN huyết thống</option>
              </Form.Select>
            </Form.Group>

            <div className="mb-4">
              <h6>Đánh giá các tiêu chí</h6>
              
              {[
                { key: 'serviceQuality', label: 'Chất lượng dịch vụ' },
                { key: 'staffAttitude', label: 'Thái độ nhân viên' },
                { key: 'facilities', label: 'Cơ sở vật chất' },
                { key: 'overallSatisfaction', label: 'Hài lòng tổng thể' }
              ].map(item => (
                <div key={item.key} className="mb-3">
                  <Form.Label>{item.label}</Form.Label>
                  <div className="d-flex align-items-center">
                    {Array.from({length: 5}, (_, i) => (
                      <Button
                        key={i}
                        variant="link"
                        className="p-1 text-warning"
                        onClick={() => setFeedback({...feedback, [item.key]: i + 1})}
                      >
                        <i className={`bi bi-star${i < feedback[item.key] ? '-fill' : ''} fs-4`}></i>
                      </Button>
                    ))}
                    <span className="ms-2">({feedback[item.key]}/5)</span>
                  </div>
                </div>
              ))}
            </div>

            <Form.Group className="mb-3">
              <Form.Label>Nhận xét chi tiết</Form.Label>
              <Form.Control
                as="textarea"
                rows={4}
                placeholder="Chia sẻ trải nghiệm của bạn..."
                value={feedback.comment}
                onChange={(e) => setFeedback({...feedback, comment: e.target.value})}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="Tôi sẽ giới thiệu dịch vụ này cho bạn bè, người thân"
                checked={feedback.recommendation}
                onChange={(e) => setFeedback({...feedback, recommendation: e.target.checked})}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowFeedbackModal(false)}>
            Hủy
          </Button>
          <Button variant="warning" onClick={handleSubmitFeedback}>
            <i className="bi bi-star me-2"></i>
            Gửi đánh giá
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default SupportCenter;