import React from 'react';

const LoadingSpinner = ({ 
  size = 'large', 
  message = 'Đang tải...', 
  overlay = true,
  color = 'primary' 
}) => {
  const sizeClass = {
    small: 'spinner-border-sm',
    medium: '',
    large: 'spinner-border-lg'
  };

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

  if (overlay) {
    return (
      <div style={overlayStyle}>
        {spinnerContent}
      </div>
    );
  }

  return (
    <div className="d-flex justify-content-center align-items-center py-5">
      {spinnerContent}
    </div>
  );
};

// Component for inline loading
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

// Component for button loading state
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