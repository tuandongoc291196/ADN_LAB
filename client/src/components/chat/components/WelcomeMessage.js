import React from 'react';
import { Card, Badge, Button } from 'react-bootstrap';

const WelcomeMessage = ({ roomTitle, onGetStarted }) => {
  const welcomeFeatures = [
    {
      icon: 'bi-clock',
      title: 'Phản hồi nhanh',
      description: 'Thời gian phản hồi trung bình 2-3 phút'
    },
    {
      icon: 'bi-shield-check',
      title: 'Bảo mật thông tin',
      description: 'Mọi cuộc trò chuyện được mã hóa an toàn'
    },
    {
      icon: 'bi-people',
      title: 'Chuyên gia 24/7',
      description: 'Đội ngũ hỗ trợ chuyên nghiệp luôn sẵn sàng'
    }
  ];

  return (
    <div className="text-center py-4">
      <div 
        className="bg-primary bg-opacity-10 rounded-circle mx-auto mb-4 d-flex align-items-center justify-content-center"
        style={{ width: "100px", height: "100px" }}
      >
        <i className="bi bi-chat-heart text-primary" style={{ fontSize: "3rem" }}></i>
      </div>
      
      <h4 className="text-primary mb-2">Chào mừng đến với {roomTitle}!</h4>
      <p className="text-muted mb-4">
        Chúng tôi sẵn sàng hỗ trợ bạn về tất cả các vấn đề liên quan đến dịch vụ xét nghiệm ADN.
      </p>

      <div className="row g-3 mb-4">
        {welcomeFeatures.map((feature, index) => (
          <div key={index} className="col-md-4">
            <Card className="border-0 bg-light h-100">
              <Card.Body className="text-center p-3">
                <i className={`${feature.icon} text-primary fs-3 mb-2 d-block`}></i>
                <h6 className="fw-bold mb-1">{feature.title}</h6>
                <small className="text-muted">{feature.description}</small>
              </Card.Body>
            </Card>
          </div>
        ))}
      </div>

      <div className="d-flex justify-content-center gap-2 flex-wrap">
        <Badge bg="primary" className="px-3 py-2">
          <i className="bi bi-headset me-1"></i>
          Hỗ trợ trực tuyến
        </Badge>
        <Badge bg="success" className="px-3 py-2">
          <i className="bi bi-shield-check me-1"></i>
          An toàn & Bảo mật
        </Badge>
        <Badge bg="info" className="px-3 py-2">
          <i className="bi bi-award me-1"></i>
          Chuyên nghiệp
        </Badge>
      </div>
      
      {onGetStarted && (
        <div className="mt-4">
          <Button 
            variant="primary" 
            onClick={onGetStarted}
            className="px-4"
          >
            <i className="bi bi-chat-dots me-2"></i>
            Bắt đầu trò chuyện
          </Button>
        </div>
      )}
    </div>
  );
};

export default WelcomeMessage;
