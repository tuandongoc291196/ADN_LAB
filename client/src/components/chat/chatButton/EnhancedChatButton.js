import React from 'react';
import { Button } from 'react-bootstrap';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth } from '../../config/firebase';

const EnhancedChatButton = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [user, loading] = useAuthState(auth);
  
  // Hide the button when user is already on messenger pages
  const isOnMessengerPage = location.pathname.startsWith('/messenger') || 
                           location.pathname.startsWith('/chat');
  
  // Don't render anything if on messenger pages
  if (isOnMessengerPage) {
    return null;
  }

  const handleChatClick = (e) => {
    if (loading) return; // Wait for auth check to complete
    
    if (!user) {
      // User is not authenticated, redirect to login
      e.preventDefault();
      navigate('/login');
    }
    // If user is authenticated, the Link will handle navigation to /messenger
  };

  return (
    <Button
      as={user ? Link : 'button'}
      to={user ? "/messenger" : undefined}
      onClick={!user ? handleChatClick : undefined}
      variant="primary"
      className="position-fixed rounded-circle shadow-lg d-flex align-items-center justify-content-center enhanced-chat-btn"
      style={{
        bottom: "20px",
        right: "20px",
        width: "60px",
        height: "60px",
        fontSize: "14px",
        fontWeight: "600",
        zIndex: 1050,
        background: "linear-gradient(135deg, #1877f2 0%, #166fe5 100%)",
        border: "none",
        transition: "all 0.3s ease",
        textDecoration: "none"
      }}
      title={user ? "Messenger - Chat với chuyên gia" : "Đăng nhập để chat với chuyên gia"}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = "scale(1.1)";
        e.currentTarget.style.boxShadow = "0 8px 25px rgba(24, 119, 242, 0.4)";
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = "scale(1)";
        e.currentTarget.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.2)";
      }}
    >
      <i className="bi bi-messenger fs-5"></i>
    </Button>
  );
};

export default EnhancedChatButton;
