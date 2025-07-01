/**
 * Component hiển thị trạng thái loading với nhiều tùy chọn
 * Hỗ trợ hiển thị dạng overlay (phủ toàn màn hình) hoặc inline
 */
import React from 'react';

/**
 * Component LoadingSpinner chính
 * @param {string} size - Kích thước spinner: 'small', 'medium', 'large'
 * @param {string} message - Thông điệp hiển thị bên dưới spinner
 * @param {boolean} overlay - Hiển thị dạng overlay phủ toàn màn hình hay không
 * @param {string} color - Màu sắc của spinner: 'primary', 'secondary', 'success', v.v.
 */
const LoadingSpinner = ({ 
  size = 'large', 
  message = 'Đang tải...', 
  overlay = true,
  color = 'primary' 
}) => {
  // Định nghĩa các lớp CSS cho kích thước khác nhau
  const sizeClass = {
    small: 'spinner-border-sm',
    medium: '',
    large: 'spinner-border-lg'
  };

  // Style cho overlay phủ toàn màn hình
  const overlayStyle = {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    zIndex: 9999,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  };

  // Nội dung spinner và thông báo
  const spinnerContent = (
    <div className="text-center">
      <div 
        className={`spinner-border text-${color} ${sizeClass[size]}`} 
        role="status"
        style={{ width: size === 'large' ? '3rem' : '2rem', height: size === 'large' ? '3rem' : '2rem' }}
      >
        <span className="visually-hidden">Loading...</span>
      </div>
      {message && (
        <div className={`mt-3 text-${color}`}>
          <small>{message}</small>
        </div>
      )}
    </div>
  );

  // Hiển thị dạng overlay nếu được yêu cầu
  if (overlay) {
    return (
      <div style={overlayStyle}>
        {spinnerContent}
      </div>
    );
  }

  // Hiển thị dạng inline nếu không dùng overlay
  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      {spinnerContent}
    </div>
  );
};

/**
 * Component hiển thị spinner nhỏ gọn trong dòng văn bản
 * @param {string} size - Kích thước spinner: 'small', 'medium', 'large'
 * @param {string} color - Màu sắc của spinner
 */
export const InlineSpinner = ({ size = 'small', color = 'primary' }) => {
  return (
    <div 
      className={`spinner-border spinner-border-${size} text-${color}`} 
      role="status"
    >
      <span className="visually-hidden">Loading...</span>
    </div>
  );
};

/**
 * Component hiển thị spinner trong nút bấm
 * Thường dùng khi nút đang trong trạng thái xử lý
 * @param {string} size - Kích thước spinner: 'sm', 'md', 'lg'
 */
export const ButtonSpinner = ({ size = 'sm' }) => {
  return (
    <span 
      className={`spinner-border spinner-border-${size}`} 
      role="status" 
      aria-hidden="true"
    ></span>
  );
};

export default LoadingSpinner;