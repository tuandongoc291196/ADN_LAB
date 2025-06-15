import React from 'react';
import { Modal, Button } from 'react-bootstrap';
import { chatUtils } from '../data/chatRooms';
import UserAvatar from '../components/UserAvatar';

const UserProfileModal = ({ user, show, onHide }) => {
  if (!user) return null;

  return (
    <Modal show={show} onHide={onHide} centered size="sm">
      <Modal.Header closeButton className="border-0 pb-0">
        <Modal.Title className="fw-bold">Profile</Modal.Title>
      </Modal.Header>
      
      <Modal.Body className="text-center pt-0">
        <div className="mb-4">
          <UserAvatar 
            user={user}
            size={100}
            className="mb-3"
          />
          <h4 className="mb-1 fw-bold">{chatUtils.getUserDisplayName(user)}</h4>
          <p className="text-muted mb-0">{user.email}</p>
        </div>

        <div className="d-grid gap-2">
          <Button variant="primary" className="rounded-pill">
            <i className="bi bi-telephone me-2"></i>
            Voice Call
          </Button>
          <Button variant="outline-primary" className="rounded-pill">
            <i className="bi bi-camera-video me-2"></i>
            Video Call
          </Button>
          <Button variant="outline-secondary" className="rounded-pill">
            <i className="bi bi-person-circle me-2"></i>
            View Profile
          </Button>
        </div>
      </Modal.Body>
    </Modal>
  );
};

export default UserProfileModal;
