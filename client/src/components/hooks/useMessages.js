/**
 * Hook tùy chỉnh để lấy tin nhắn từ một phòng chat
 * Tự động cập nhật khi có tin nhắn mới
 */
import React from 'react';
import { getMessages } from '../config/firebase';

/**
 * Hook useMessages theo dõi và cập nhật tin nhắn trong phòng chat
 * @param {string} roomId - ID của phòng chat cần lấy tin nhắn
 * @returns {Array} Danh sách tin nhắn trong phòng chat
 */
function useMessages(roomId) {
    const [messages, setMessages] = React.useState([]);

    React.useEffect(() => {
        // Đăng ký lắng nghe sự thay đổi tin nhắn và trả về hàm hủy đăng ký
        const unsubscribe = getMessages(roomId, setMessages);

        return unsubscribe;
    }, [roomId]);

    return messages;
}

export { useMessages };
