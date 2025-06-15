import React from 'react';

const TypingIndicator = ({ isVisible, userName = "Chuyên gia hỗ trợ", userAvatar }) => {
  if (!isVisible) return null;

  return (
    <div className="typing-indicator-container">
      <div className="message-group other">
        <img
          src={userAvatar || '/default-avatar.png'}
          alt={userName}
          className="message-avatar"
        />
        <div className="typing-bubble">
          <div className="typing-dots">
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
            <div className="typing-dot"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TypingIndicator;

