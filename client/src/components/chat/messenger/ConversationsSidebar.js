import React from 'react';
import { chatUtils } from '../data/chatRooms';
import UserAvatar from '../components/UserAvatar';

const ConversationsSidebar = ({
  user,
  chatRooms,
  selectedRoomId,
  onRoomSelect,
  searchQuery,
  onSearch,
  searchResults,
  searchLoading,
  showSearch,
  onStartChat,
  loading
}) => {
  const formatTime = (timestamp) => {
    if (!timestamp) return '';
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'now';
    if (diffMins < 60) return `${diffMins}m`;
    if (diffHours < 24) return `${diffHours}h`;
    if (diffDays < 7) return `${diffDays}d`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };
  return (
    <div className="conversations-sidebar">
      <div className="sidebar-header">
        <div className="d-flex align-items-center justify-content-between">
          <h4 className="mb-0 fw-bold">Chats</h4>
        </div>
      </div>

      <div className="sidebar-search">
        <div className="input-group">
          <span className="input-group-text">
            <i className="bi bi-search"></i>
          </span>
          <input
            type="text"
            className="form-control"
            placeholder="Search Messenger"
            value={searchQuery}
            onChange={(e) => onSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="sidebar-content">
        {showSearch ? (
          <div className="search-results">
            <div className="search-header">
              <small>SEARCH RESULTS</small>
            </div>
            {searchLoading ? (
              <div className="text-center py-3">
                <div className="spinner-border spinner-border-sm text-primary" role="status">
                  <span className="visually-hidden">Searching...</span>
                </div>
              </div>
            ) : searchResults.length === 0 ? (
              <div className="empty-search">
                <div className="text-center py-4">
                  <i className="bi bi-person-x fs-2 mb-2"></i>
                  <p className="mb-0">No people found</p>
                  <small>Try searching for someone else</small>
                </div>
              </div>
            ) : (
              <div className="search-results-list">
                {searchResults.map((searchUser) => (
                  <button
                    key={searchUser.user_id}
                    className="search-result-item"
                    onClick={() => onStartChat(searchUser)}
                  >
                    <div className="search-result-avatar">
                      <UserAvatar 
                        user={searchUser}
                        size={40}
                      />
                    </div>
                    <div className="search-result-content">
                      <div className="search-result-name">
                        {chatUtils.getUserDisplayName(searchUser)}
                      </div>
                      <div className="search-result-email">{searchUser.email}</div>
                    </div>
                    <div className="search-result-action">
                      <i className="bi bi-plus-circle"></i>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="conversations-list">
            {loading ? (
              <div className="text-center py-4">
                <div className="spinner-border text-primary" role="status">
                  <span className="visually-hidden">Loading conversations...</span>
                </div>
              </div>
            ) : chatRooms.length === 0 ? (
              <div className="empty-conversations">
                <div className="text-center py-5">
                  <i className="bi bi-chat-dots fs-1 text-muted mb-3"></i>
                  <h5>No conversations yet</h5>
                  <p className="text-muted">Start a conversation by searching for someone</p>
                </div>
              </div>
            ) : (
              <div>
                {chatRooms.map((room) => {
                  const unreadCount = room.unreadCount?.[user.uid] || 0;
                  return (
                    <button
                      key={room.id}
                      className={`conversation-item ${selectedRoomId === room.id ? 'active' : ''}`}
                      onClick={() => {
                        onRoomSelect(room.id);
                      }}
                    >
                      <div className="avatar-container">
                        <UserAvatar 
                          user={room.otherUser}
                          size={45}
                          showOnlineIndicator={true}
                        />
                      </div>
                      <div className="conversation-content">
                        <div className="conversation-header">
                          <h6 className="conversation-name">
                            {chatUtils.getUserDisplayName(room.otherUser)}
                          </h6>
                          <span className="conversation-time">
                            {formatTime(room.lastMessageTime)}
                          </span>
                        </div>
                        <p className={`conversation-preview ${unreadCount > 0 ? 'unread' : ''}`}>
                          {room.lastMessage || 'Start a conversation'}
                        </p>
                      </div>
                      {unreadCount > 0 && (
                        <span className="unread-badge">{unreadCount}</span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default ConversationsSidebar;
