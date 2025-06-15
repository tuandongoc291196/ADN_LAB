import React, { useState, useEffect } from 'react';
import { Modal } from 'react-bootstrap';
import MessengerChat from './MessengerChat';
import { useAuth } from '../../hooks/useAuth';
import './FloatingMessenger.css';

const FloatingMessenger = ({ show, onHide }) => {
  const { user } = useAuth();
  const [isMinimized, setIsMinimized] = useState(false);

  useEffect(() => {
    // Add body class when messenger is open to prevent scrolling
    if (show) {
      document.body.classList.add('messenger-open');
    } else {
      document.body.classList.remove('messenger-open');
    }

    return () => {
      document.body.classList.remove('messenger-open');
    };
  }, [show]);

  if (!user) {
    return (
      <Modal
        show={show}
        onHide={onHide}
        size="lg"
        centered
        className="floating-messenger-modal"
      >
        <Modal.Header closeButton className="border-0 pb-0">
          <Modal.Title className="text-primary">
            <i className="bi bi-messenger me-2"></i>
            Messenger
          </Modal.Title>
        </Modal.Header>
        <Modal.Body className="text-center py-5">
          <div className="mb-4">
            <i className="bi bi-chat-heart text-muted" style={{ fontSize: '4rem' }}></i>
          </div>
          <h4 className="mb-3">Đăng nhập để sử dụng Messenger</h4>
          <p className="text-muted mb-4">
            Kết nối với chuyên gia ADN Lab và nhận tư vấn trực tiếp
          </p>
          <div className="d-flex gap-2 justify-content-center">
            <button 
              className="btn btn-primary"
              onClick={() => window.location.href = '/login'}
            >
              <i className="bi bi-box-arrow-in-right me-2"></i>
              Đăng nhập
            </button>
            <button 
              className="btn btn-outline-secondary"
              onClick={() => window.location.href = '/register'}
            >
              <i className="bi bi-person-plus me-2"></i>
              Đăng ký
            </button>
          </div>
        </Modal.Body>
      </Modal>
    );
  }

  return (
    <Modal
      show={show}
      onHide={onHide}
      size="xl"
      centered
      className={`floating-messenger-modal ${isMinimized ? 'minimized' : ''}`}
      backdrop={false}
    >
      <Modal.Header className="border-0 pb-0 floating-messenger-header">
        <Modal.Title className="text-white d-flex align-items-center">
          <i className="bi bi-messenger me-2"></i>
          Messenger - ADN Lab
        </Modal.Title>
        <div className="d-flex gap-2">
          <button
            type="button"
            className="btn-minimize"
            onClick={() => setIsMinimized(!isMinimized)}
            title={isMinimized ? 'Mở rộng' : 'Thu nhỏ'}
          >
            <i className={`bi ${isMinimized ? 'bi-window-fullscreen' : 'bi-dash-lg'}`}></i>
          </button>
          <button
            type="button"
            className="btn-close btn-close-white"
            onClick={onHide}
            aria-label="Close"
          ></button>
        </div>
      </Modal.Header>
      {!isMinimized && (
        <Modal.Body className="p-0">
          <div style={{ height: '70vh' }}>
            <MessengerChat />
          </div>
        </Modal.Body>
      )}
    </Modal>
  );
};

export default FloatingMessenger;
