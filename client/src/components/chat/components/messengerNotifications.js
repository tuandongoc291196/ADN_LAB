import React from 'react';
import { useMessenger } from '../context/MessengerContext';

const MessengerNotifications = () => {
  const { notifications, removeNotification } = useMessenger();

  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <div className="messenger-notifications-container">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`messenger-notification alert alert-${notification.type || 'info'} alert-dismissible fade show`}
          role="alert"
          style={{
            position: 'fixed',
            top: `${20 + (notifications.indexOf(notification) * 70)}px`,
            right: '20px',
            zIndex: 9999,
            minWidth: '300px',
            maxWidth: '400px',
            boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            borderRadius: '8px',
            border: 'none'
          }}
        >
          <div className="d-flex align-items-start">
            {notification.type === 'success' && (
              <i className="bi bi-check-circle-fill text-success me-2 mt-1"></i>
            )}
            {notification.type === 'error' && (
              <i className="bi bi-exclamation-triangle-fill text-danger me-2 mt-1"></i>
            )}
            {notification.type === 'warning' && (
              <i className="bi bi-exclamation-triangle-fill text-warning me-2 mt-1"></i>
            )}
            {(!notification.type || notification.type === 'info') && (
              <i className="bi bi-info-circle-fill text-info me-2 mt-1"></i>
            )}
            
            <div className="flex-grow-1">
              {notification.title && (
                <h6 className="alert-heading mb-1">{notification.title}</h6>
              )}
              <div className="mb-0">{notification.message}</div>
            </div>
          </div>
          
          <button
            type="button"
            className="btn-close"
            aria-label="Close"
            onClick={() => removeNotification(notification.id)}
            style={{
              position: 'absolute',
              top: '8px',
              right: '8px'
            }}
          ></button>
        </div>
      ))}
    </div>
  );
};

export default MessengerNotifications;
