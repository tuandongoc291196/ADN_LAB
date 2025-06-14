import React, { useState, useRef, useEffect } from 'react';
import { sendMessage } from '../../config/firebase';
import { chatUtils } from '../data/chatRooms';
import UserAvatar from '../components/UserAvatar';
import './MessengerChat.css';  

const ChatArea = ({
  selectedRoom,
  messages,
  messagesLoading,
  currentUser,
  onBackToConversations,
  onShowUserProfile,
  isMobileView,
  isTyping
}) => {
  const [messageText, setMessageText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isUserTyping, setIsUserTyping] = useState(false);
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const textareaRef = useRef(null);
  const lastMessageCountRef = useRef(0);
  const isUserScrollingRef = useRef(false);
  const shouldAutoScrollRef = useRef(true);
  const scrollTimeoutRef = useRef(null);

  // Smart auto-scroll: only scroll when user is at bottom or on initial load
  useEffect(() => {
    if (messages.length > 0) {
      const isNewMessage = messages.length > lastMessageCountRef.current;
      const isInitialLoad = lastMessageCountRef.current === 0;
      
      if (isInitialLoad || (isNewMessage && shouldAutoScrollRef.current && !isUserScrollingRef.current)) {
        scrollToBottom();
      }
      
      lastMessageCountRef.current = messages.length;
    }
  }, [messages]);

  // Manage typing state without auto-resize
  useEffect(() => {
    // Set typing state based on message content
    setIsUserTyping(messageText.trim().length > 0);
  }, [messageText]);

  // Handle scroll events to detect user scrolling behavior
  useEffect(() => {
    const messagesContainer = messagesContainerRef.current;
    if (!messagesContainer) return;

    const handleScroll = () => {
      // Use refs instead of state to avoid re-renders during scrolling
      isUserScrollingRef.current = true;
      
      // Clear existing timeout
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      // Check if user is near the bottom (within 100px)
      const { scrollTop, scrollHeight, clientHeight } = messagesContainer;
      const isNearBottom = scrollHeight - scrollTop - clientHeight < 100;
      
      shouldAutoScrollRef.current = isNearBottom;

      // Reset scrolling state after user stops scrolling (reduced timeout)
      scrollTimeoutRef.current = setTimeout(() => {
        isUserScrollingRef.current = false;
      }, 500);
    };

    messagesContainer.addEventListener('scroll', handleScroll, { passive: true });

    return () => {
      messagesContainer.removeEventListener('scroll', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, []);

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      // Use smooth scrolling for better user experience
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!messageText.trim() || isSending || !selectedRoom) return;

    const textToSend = messageText.trim();
    setMessageText('');
    setIsSending(true);

    try {
      await sendMessage(
        selectedRoom.id,
        currentUser,
        textToSend,
        selectedRoom.otherUser.user_id
      );
      
      // Always scroll to bottom when user sends a message
      shouldAutoScrollRef.current = true;
      isUserScrollingRef.current = false;
      setTimeout(() => scrollToBottom(), 100);
      
    } catch (error) {
      console.error('Error sending message:', error);
      setMessageText(textToSend); // Restore message on error
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage(e);
    }
  };

  const formatMessageTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleTimeString('en-US', { 
      hour: '2-digit', 
      minute: '2-digit',
      hour12: false 
    });
  };

  const groupMessagesByTime = (messages) => {
    const groups = [];
    let currentGroup = null;
    
    messages.forEach((message) => {
      const isSameUser = currentGroup && currentGroup.senderId === message.senderId;
      const messageTime = message.timestamp?.toDate();
      const lastMessageTime = currentGroup?.messages[currentGroup.messages.length - 1]?.timestamp?.toDate();
      const timeDiff = messageTime && lastMessageTime ? messageTime - lastMessageTime : 0;
      const isWithinGroup = timeDiff < 60000; // 1 minute
      
      if (isSameUser && isWithinGroup) {
        currentGroup.messages.push(message);
      } else {
        currentGroup = {
          senderId: message.senderId,
          senderName: message.senderName,
          senderAvatar: message.senderAvatar,
          messages: [message]
        };
        groups.push(currentGroup);
      }
    });
    
    return groups;
  };

  if (!selectedRoom) {
    return (
      <div className="chat-area d-flex">
        <div className="empty-chat d-flex flex-column justify-content-center align-items-center h-100 w-100">
          <div className="empty-chat-icon mb-3">
            <i className="bi bi-headset" style={{ fontSize: '3rem', color: '#6c757d' }}></i>
          </div>
          <h3 className="text-center mb-3">Hỗ trợ khách hàng</h3>
          <p className="text-center text-muted">Chọn một cuộc trò chuyện để bắt đầu nhận hỗ trợ từ đội ngũ chuyên gia ADN LAB</p>
        </div>
      </div>
    );
  }

  const messageGroups = groupMessagesByTime(messages);

  return (
    <div className="chat-area d-flex flex-column h-100">
      {/* Chat Header */}
      <div className="chat-header">
        {isMobileView && (
          <button 
            className="chat-header-back"
            onClick={onBackToConversations}
            type="button"
          >
            <i className="bi bi-arrow-left"></i>
          </button>
        )}
        
        <div className="chat-header-info" onClick={onShowUserProfile}>
          <div className="d-flex align-items-center">
            <div className="avatar-container">
              <UserAvatar 
                user={selectedRoom.otherUser}
                size={40}
                showOnlineIndicator={true}
              />
            </div>
            <div>
              <h5 className="chat-header-name">
                {chatUtils.getUserDisplayName(selectedRoom.otherUser)}
              </h5>
              <p className="chat-header-status">Active now</p>
            </div>
          </div>
        </div>

        <div className="chat-header-actions">
          {/* Removed unfunctional buttons: voice call, video call, more options */}
        </div>
      </div>

      {/* Messages Container */}
      <div className="messages-container flex-grow-1 overflow-auto p-3" ref={messagesContainerRef}>
        {messagesLoading ? (
          <div className="messages-loading d-flex justify-content-center align-items-center h-100">
            <div className="text-center">
              <div className="spinner-border text-primary" role="status">
                <span className="visually-hidden">Loading messages...</span>
              </div>
              <p className="mt-2 text-muted">Loading messages...</p>
            </div>
          </div>
        ) : (
          <div className="messages-list">
            {messageGroups.map((group, groupIndex) => (
              <div 
                key={groupIndex}
                className={`message-group ${group.senderId === currentUser.uid ? 'own' : 'other'}`}
              >
                <div className="message-bubbles">
                  {group.messages.map((message, messageIndex) => {
                    // Determine if message needs special text handling
                    const messageLength = message.text.length;
                    const hasLineBreaks = message.text.includes('\n');
                    const isShortMessage = messageLength <= 50 && !hasLineBreaks;
                    
                    // Check if it's a long string without spaces (like "AAAAAAA")
                    const hasSpaces = message.text.includes(' ');
                    const isLongWordString = messageLength > 20 && !hasSpaces && !hasLineBreaks;
                    
                    // Determine CSS class based on message characteristics
                    let textClass = 'message-text';
                    if (isLongWordString) {
                      textClass += ' force-break';
                    } else if (!isShortMessage) {
                      textClass += ' long-message';
                    }
                    
                    return (
                      <div key={message.id} className="message-wrapper">
                        <div 
                          className={`message-bubble ${
                            message.senderId === currentUser.uid ? 'own' : 'other'
                          }`}
                        >
                          <div className="message-content-wrapper">
                            <p className={textClass}>
                              {message.text}
                            </p>
                          </div>
                        </div>
                        {messageIndex === group.messages.length - 1 && (
                          <div className="message-time">
                            {formatMessageTime(message.timestamp)}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            ))}
            
            {isTyping && (
              <div className="typing-indicator">
                <span>{selectedRoom.otherUser.fullname} is typing</span>
                <div className="typing-dots">
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                  <div className="typing-dot"></div>
                </div>
              </div>
            )}
            
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* Message Input */}
      <div className="message-input-container p-3 border-top bg-white" style={{ minHeight: '70px', position: 'sticky', bottom: 0, zIndex: 100, display: 'block !important' }}>
        <form onSubmit={handleSendMessage} className="w-100">
          <div className={`message-input-wrapper d-flex align-items-end gap-2 ${isUserTyping ? 'typing' : ''}`}>
            <div className="flex-grow-1 position-relative">
              <textarea
                ref={textareaRef}
                className="form-control message-input border-0 bg-light rounded-pill px-3 py-2"
                placeholder="Type a message..."
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                onKeyPress={handleKeyPress}
                disabled={isSending}
                rows="1"
                style={{ 
                  resize: 'none',
                  minHeight: '40px',
                  maxHeight: '120px',
                  overflowY: 'auto'
                }}
              />
            </div>
            
            <div className="input-actions">
              <button
                type="submit"
                className={`btn rounded-circle d-flex align-items-center justify-content-center ${messageText.trim() ? 'btn-primary' : 'btn-outline-secondary'}`}
                disabled={isSending || !messageText.trim()}
                title="Send message"
                style={{ 
                  width: '40px', 
                  height: '40px',
                  minWidth: '40px'
                }}
              >
                {isSending ? (
                  <div className="spinner-border spinner-border-sm" role="status" style={{ width: '16px', height: '16px' }}>
                    <span className="visually-hidden">Sending...</span>
                  </div>
                ) : (
                  <i className="bi bi-send-fill"></i>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatArea;
