import React from 'react';
import { chatUtils } from '../data/chatRooms';
import { useMessenger } from '../context/MessengerContext';

const UserAvatar = ({ 
  user, 
  size = 40, 
  className = '', 
  showOnlineIndicator = false 
}) => {
  const { userStatuses, subscribeToUserStatusUpdates, isUserOnline } = useMessenger();
  const avatarUrl = chatUtils.getUserAvatar(user);
  const userInitials = chatUtils.getUserInitials(user);
  const displayName = chatUtils.getUserDisplayName(user);
  
  // Get the correct user ID - standardized order
  const userId = user?.id || user?.user_id || user?.uid;
  const online = isUserOnline(userId);

  const [imageError, setImageError] = React.useState(false);
  const [imageLoaded, setImageLoaded] = React.useState(false);

  // Subscribe to user status updates
  React.useEffect(() => {
    if (userId && showOnlineIndicator) {
      const unsubscribe = subscribeToUserStatusUpdates(userId);
      return unsubscribe;
    }
  }, [userId, showOnlineIndicator, subscribeToUserStatusUpdates]);

  const avatarStyle = {
    width: `${size}px`,
    height: `${size}px`,
    borderRadius: '50%',
    objectFit: 'cover',
    backgroundColor: '#007bff',
    color: 'white',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: `${size * 0.4}px`,
    fontWeight: 'bold',
    border: '2px solid #e9ecef'
  };

  // Reset states when avatarUrl changes
  React.useEffect(() => {
    setImageError(false);
    setImageLoaded(false);
  }, [avatarUrl]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  const handleImageError = () => {
    setImageError(true);
  };

  // Show avatar image if URL exists, no error, and prioritize data avatar
  const showImage = avatarUrl && !imageError;
  // Show initials fallback if no avatar URL or image failed to load
  const showInitials = !avatarUrl || imageError;

  return (
    <div className="position-relative d-inline-block" key={`avatar-${userId}-${online}`}>
      {/* Avatar Image - only render if we have URL and no error */}
      {showImage && (
        <img
          src={avatarUrl}
          alt={displayName}
          className={`rounded-circle ${className}`}
          style={avatarStyle}
          onLoad={handleImageLoad}
          onError={handleImageError}
        />
      )}
      
      {/* Fallback avatar with initials - only show if no image or error */}
      {showInitials && (
        <div
          className={`rounded-circle d-flex align-items-center justify-content-center ${className}`}
          style={avatarStyle}
          title={displayName}
        >
          {userInitials}
        </div>
      )}

      {/* Online indicator - only show when actually online */}
      {showOnlineIndicator && online && (
        <div 
          className="position-absolute bottom-0 end-0 user-online-dot rounded-circle border border-2 border-white"
          style={{ 
            width: `${size * 0.3}px`, 
            height: `${size * 0.3}px`,
            minWidth: '10px',
            minHeight: '10px'
          }}
        ></div>
      )}
    </div>
  );
};

export default UserAvatar;
