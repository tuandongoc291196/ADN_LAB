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

    // Check if user is online (placeholder - would need real implementation)
    isUserOnline: (user) => {
        // This would typically check against a real-time status system
        // For now, return false as a safe default
        return false;
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
    }
};

export { chatUtils };
