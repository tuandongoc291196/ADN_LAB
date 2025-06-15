import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  getUserChatRooms, 
  searchUsersForChat, 
  createOrGetChatRoom,
  getMessages, 
  markMessagesAsRead
} from '../../config/firebase';
import { chatUtils } from '../data/chatRooms';
import ConversationsSidebar from './ConversationsSidebar';
import ChatArea from './ChatArea';
import UserProfileModal from './UserProfileModal';
import { MessengerProvider, useMessenger } from '../context/MessengerContext';
import './MessengerChat.css';

const MessengerChatContent = () => {
  const navigate = useNavigate();
  const params = useParams();
  const { user, addNotification } = useMessenger();
  
  // State management
  const [chatRooms, setChatRooms] = useState([]);
  const [selectedRoomId, setSelectedRoomId] = useState(params.roomId || null);
  const [selectedRoom, setSelectedRoom] = useState(null);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);
  const [showSidebar, setShowSidebar] = useState(true);
  const [showUserProfile, setShowUserProfile] = useState(false);
  const [isTyping, setIsTyping] = useState(false);

  // Search functionality
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [searchLoading, setSearchLoading] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Responsive design
  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobileView(mobile);
      if (mobile && selectedRoomId) {
        setShowSidebar(false);
      } else if (!mobile) {
        setShowSidebar(true);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [selectedRoomId]);

  // Load chat rooms
  useEffect(() => {
    if (!user?.uid) return;

    const unsubscribe = getUserChatRooms(user.uid, (rooms) => {
      const sortedRooms = rooms.sort((a, b) => {
        const aTime = a.lastMessageTime?.toDate() || new Date(0);
        const bTime = b.lastMessageTime?.toDate() || new Date(0);
        return bTime - aTime;
      });
      setChatRooms(sortedRooms);
      setLoading(false);

      // Show notification for new messages
      const currentTime = Date.now();
      rooms.forEach(room => {
        const unreadCount = room.unreadCount?.[user.uid] || 0;
        if (unreadCount > 0 && room.lastMessageTime) {
          const messageTime = room.lastMessageTime.toDate().getTime();
          const timeDiff = currentTime - messageTime;
          
          // Only show notification for very recent messages (within 30 seconds)
          if (timeDiff < 30000) {
            addNotification({
              title: chatUtils.getUserDisplayName(room.otherUser),
              message: room.lastMessage || 'Sent a message',
              avatar: chatUtils.getUserAvatar(room.otherUser),
              type: 'message'
            });
          }
        }
      });
    });

    return () => unsubscribe();
  }, [user?.uid, addNotification]);

  // Load messages for selected room
  useEffect(() => {
    if (!selectedRoomId || !user?.uid) {
      setMessages([]);
      setSelectedRoom(null);
      return;
    }

    setMessagesLoading(true);

    // Subscribe to messages
    const unsubscribeMessages = getMessages(selectedRoomId, (newMessages) => {
      setMessages(newMessages);
      setMessagesLoading(false);
      // Mark as read
      markMessagesAsRead(selectedRoomId, user.uid);
    });

    return () => unsubscribeMessages();
  }, [selectedRoomId, user?.uid]);

  // Update selected room when chatRooms or selectedRoomId changes
  useEffect(() => {
    if (selectedRoomId && chatRooms.length > 0) {
      const room = chatRooms.find(r => r.id === selectedRoomId);
      setSelectedRoom(room);
    } else {
      setSelectedRoom(null);
    }
  }, [selectedRoomId, chatRooms]);

  // Handle room selection
  const handleRoomSelect = (roomId) => {
    setSelectedRoomId(roomId);
    navigate(`/messenger/${roomId}`);
    if (isMobileView) {
      setShowSidebar(false);
    }
  };

  // Handle back to conversations (mobile)
  const handleBackToConversations = () => {
    setSelectedRoomId(null);
    setShowSidebar(true);
    navigate('/messenger');
  };

  // Search functionality
  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (!query.trim()) {
      setSearchResults([]);
      setShowSearch(false);
      return;
    }

    setShowSearch(true);
    setSearchLoading(true);
    try {
      const users = await searchUsersForChat(query);
      const filteredUsers = users.filter(u => u.user_id !== user.uid);
      setSearchResults(filteredUsers);
    } catch (error) {
      console.error('Error searching users:', error);
      setSearchResults([]);
    } finally {
      setSearchLoading(false);
    }
  };

  // Start new chat
  const handleStartChat = async (otherUser) => {
    try {
      if (!user?.uid) {
        throw new Error('Current user not found or not authenticated');
      }
      
      // Handle different user ID field names
      const otherUserId = otherUser?.user_id || otherUser?.id;
      if (!otherUserId) {
        throw new Error('Other user ID not found');
      }
      
      const roomId = await createOrGetChatRoom(user.uid, otherUserId);
      setSearchQuery('');
      setSearchResults([]);
      setShowSearch(false);
      handleRoomSelect(roomId);
    } catch (error) {
      addNotification({
        title: 'Error',
        message: 'Could not start chat. Please try again.',
        type: 'error'
      });
    }
  };

  if (loading && !user) {
    return (
      <div className="messenger-container">
        <div className="messenger-loading">
          <div className="spinner-border text-primary" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
          <p className="mt-3 text-muted">Loading Messenger...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="messenger-container">
      {/* Chat Header */}
      <div className="messenger-header">
        <div className="messenger-header-content">
          <div className="d-flex align-items-center">
            <button 
              className="btn btn-link text-muted me-3 d-flex align-items-center"
              onClick={() => navigate('/')}
              title="Về trang chủ"
            >
              <i className="bi bi-arrow-left"></i>
            </button>
            <div className="d-flex align-items-center">
              <span className="header-title">Hỗ trợ trực tuyến</span>
              <span className="header-subtitle">ADN LAB</span>
            </div>
          </div>
          <div className="d-flex align-items-center gap-2">
            <span className="online-status">
              <i className="bi bi-circle-fill me-1"></i>
              Đang hoạt động
            </span>
          </div>
        </div>
      </div>

      <div className="messenger-layout">
        {/* Conversations Sidebar */}
        <div className={`messenger-sidebar ${showSidebar ? 'show' : 'hide'}`}>
          <ConversationsSidebar
            user={user}
            chatRooms={chatRooms}
            selectedRoomId={selectedRoomId}
            onRoomSelect={handleRoomSelect}
            searchQuery={searchQuery}
            onSearch={handleSearch}
            searchResults={searchResults}
            searchLoading={searchLoading}
            showSearch={showSearch}
            onStartChat={handleStartChat}
            loading={loading}
          />
        </div>

        {/* Main Chat Area */}
        <div className={`messenger-main ${!showSidebar ? 'full-width' : ''}`}>
          <ChatArea
            selectedRoom={selectedRoom}
            messages={messages}
            messagesLoading={messagesLoading}
            currentUser={user}
            onBackToConversations={handleBackToConversations}
            onShowUserProfile={() => setShowUserProfile(true)}
            isMobileView={isMobileView}
            isTyping={isTyping}
          />
        </div>
      </div>

      {/* User Profile Modal */}
      {showUserProfile && selectedRoom && (
        <UserProfileModal
          user={selectedRoom.otherUser}
          show={showUserProfile}
          onHide={() => setShowUserProfile(false)}
        />
      )}
    </div>
  );
};

const MessengerChat = () => {
  return (
    <MessengerProvider>
      <MessengerChatContent />
    </MessengerProvider>
  );
};

export default MessengerChat;
