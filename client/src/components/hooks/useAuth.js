/**
 * Hook tùy chỉnh để sử dụng AuthContext
 * Cung cấp cách truy cập dễ dàng đến thông tin xác thực người dùng
 */
import React from 'react';
import { AuthContext } from '../context/auth';

/**
 * Hook useAuth cho phép các component truy cập vào context xác thực
 * @returns {Object} Giá trị từ AuthContext bao gồm thông tin người dùng và các hàm xác thực
 * @throws {Error} Nếu được sử dụng bên ngoài AuthProvider
 */
function useAuth() {
    const value = React.useContext(AuthContext);
    if (!value) {
        throw new Error("AuthContext's value is undefined.");
    }

    return value;
}

export { useAuth };
