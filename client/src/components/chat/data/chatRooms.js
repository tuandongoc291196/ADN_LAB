// Default chat rooms for landing page
const defaultChatRooms = [
    { id: 'support', title: 'Hỗ trợ khách hàng' },
];

// Chat utility functions
const chatUtils = {
    // For landing page compatibility - make it iterable
    ...defaultChatRooms,
    map: function(callback) {
        return defaultChatRooms.map(callback);
    },

    // Get user display name
    getUserDisplayName: (user) => {
        if (!user) return 'Unknown User';
        return user.displayName || user.fullname || user.name || user.email || 'Người dùng';
    },

    // Get user avatar URL
    getUserAvatar: (user) => {
        if (!user) return null;
        // Use only the avatar field from user data
        return user.avatar || null;
    },

    // Check if user is online (now uses real-time status)
    isUserOnline: (user, userStatuses) => {
        const userId = user?.uid || user?.user_id || user?.id;
        if (!userId || !userStatuses) return false;
        const status = userStatuses.get ? userStatuses.get(userId) : userStatuses[userId];
        return status?.isOnline === true;
    },

    // Format last message time
    formatLastMessageTime: (timestamp) => {
        if (!timestamp) return '';
        
        const now = new Date();
        const messageTime = new Date(timestamp);
        const diffInMinutes = Math.floor((now - messageTime) / (1000 * 60));
        
        if (diffInMinutes < 1) return 'Vừa xong';
        if (diffInMinutes < 60) return `${diffInMinutes} phút`;
        if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)} giờ`;
        return `${Math.floor(diffInMinutes / 1440)} ngày`;
    },

    // Get initials for avatar fallback
    getUserInitials: (user) => {
        if (!user) return 'U';
        const displayName = user.displayName || user.fullname || user.name || user.email || 'User';
        return displayName.charAt(0).toUpperCase();
    },

    // Format last seen time
    formatLastSeen: (lastSeenTimestamp) => {
        if (!lastSeenTimestamp) return '';
        
        const now = new Date();
        const lastSeen = lastSeenTimestamp.toDate ? lastSeenTimestamp.toDate() : new Date(lastSeenTimestamp);
        const diffInMs = now - lastSeen;
        const diffInMinutes = Math.floor(diffInMs / (1000 * 60));
        const diffInHours = Math.floor(diffInMs / (1000 * 60 * 60));
        const diffInDays = Math.floor(diffInMs / (1000 * 60 * 60 * 24));
        
        if (diffInMinutes < 1) return 'Active just now';
        if (diffInMinutes < 60) {
            return `Active ${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
        }
        if (diffInHours < 24) {
            return `Active ${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
        }
        if (diffInDays < 7) {
            return `Active ${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
        }
        return `Active ${Math.floor(diffInDays / 7)} week${Math.floor(diffInDays / 7) > 1 ? 's' : ''} ago`;
    }
};

export { chatUtils };

// Standalone function for UserAvatar component
export function isUserOnline(userId, userStatuses) {
    if (!userId || !userStatuses) return false;
    const status = userStatuses.get ? userStatuses.get(userId) : userStatuses[userId];
    return status?.isOnline === true;
}
