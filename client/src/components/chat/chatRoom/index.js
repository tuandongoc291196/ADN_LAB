import React, { useState, useEffect, useContext } from 'react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../context/auth';
import { 
  getMessages, 
  markMessagesAsRead,
  getUserChatRooms 
} from '../../config/firebase';
import { chatUtils } from '../data/chatRooms';
import UserAvatar from '../components/UserAvatar';
import { MessageInput } from '../messageInput/index.js';
import { MessageList } from '../messageList/index.js';
import { Container, Card, Button, Spinner } from 'react-bootstrap';

function ChatRoom() {
  const params = useParams();
  const navigate = useNavigate();
  const { user } = useContext(AuthContext);
  const [messages, setMessages] = useState([]);
  const [otherUser, setOtherUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [inputValue, setInputValue] = useState('');

  const roomId = params.roomId;

  useEffect(() => {
    if (!user?.uid || !roomId) return;

    // Get room information and other user details
    const unsubscribeRooms = getUserChatRooms(user.uid, (rooms) => {
      const currentRoom = rooms.find(room => room.id === roomId);
      if (currentRoom) {
        setOtherUser(currentRoom.otherUser);
        setLoading(false);
        
        // Mark messages as read
        markMessagesAsRead(roomId, user.uid);
      } else {
        // Room not found
        setLoading(false);
      }
    });

    // Subscribe to messages
    const unsubscribeMessages = getMessages(roomId, (newMessages) => {
      setMessages(newMessages);
      // Mark as read when new messages arrive
      markMessagesAsRead(roomId, user.uid);
    });

    return () => {
      unsubscribeRooms();
      unsubscribeMessages();
    };
  }, [user?.uid, roomId]);

  if (loading) {
    return (
      <Container className="py-4" style={{ maxWidth: "800px" }}>
        <div className="d-flex justify-content-center align-items-center" style={{ height: "400px" }}>
          <div className="text-center">
            <Spinner animation="border" variant="primary" />
            <p className="mt-3 text-muted">Loading conversation...</p>
          </div>
        </div>
      </Container>
    );
  }

  if (!otherUser) {
    return (
      <Container className="py-4" style={{ maxWidth: "600px" }}>
        <Card className="border-0 shadow-sm text-center">
          <Card.Body className="py-5">
            <i className="bi bi-exclamation-triangle text-warning fs-1 mb-3"></i>
            <h4>Conversation not found</h4>
            <p className="text-muted mb-4">This conversation doesn't exist or you don't have access to it.</p>
            <Button as={Link} to="/chat" variant="primary">
              <i className="bi bi-arrow-left me-2"></i>
              Back to Messages
            </Button>
          </Card.Body>
        </Card>
      </Container>
    );
  }

  return (
    <Container className="py-4" style={{ maxWidth: "800px" }}>
      <Card className="border-0 shadow-sm" style={{ maxHeight: "85vh" }}>
        {/* Chat Header */}
        <Card.Header 
          className="d-flex align-items-center justify-content-between py-3"
          style={{ 
            background: "linear-gradient(135deg, #007bff 0%, #0056b3 100%)",
            color: "white"
          }}
        >
          <div className="d-flex align-items-center">
            <Button
              as={Link}
              to="/chat"
              variant="link"
              className="text-white p-0 me-3"
              style={{ textDecoration: "none" }}
              title="Back to Messages"
            >
              <i className="bi bi-arrow-left fs-5"></i>
            </Button>
            <div className="d-flex align-items-center">
              <div className="position-relative me-3">
                <UserAvatar 
                  user={otherUser}
                  size={45}
                  showOnlineIndicator={true}
                />
              </div>
              <div>
                <h5 className="mb-1 fw-bold">{chatUtils.getUserDisplayName(otherUser)}</h5>
                <small className="text-white opacity-90">{otherUser.email}</small>
              </div>
            </div>
          </div>
          <div className="d-flex align-items-center">
            <Button 
              variant="outline-light" 
              size="sm"
              title="User Profile"
              onClick={() => {
                // Could open user profile modal
                console.log('Show user profile:', otherUser);
              }}
            >
              <i className="bi bi-person-circle"></i>
            </Button>
          </div>
        </Card.Header>

        {/* Messages Container */}
        <Card.Body 
          className="p-0 d-flex flex-column"
          style={{ 
            height: "550px",
            backgroundColor: "#f8f9fa"
          }}
        >
          <div className="flex-grow-1 overflow-hidden">
            <MessageList 
              roomId={roomId}
              messages={messages}
              currentUser={user}
              otherUser={otherUser}
              onQuickAction={setInputValue}
            />
          </div>
          
          <div className="border-top bg-white p-3" style={{ borderColor: "#dee2e6" }}>
            <MessageInput 
              roomId={roomId}
              currentUser={user}
              otherUser={otherUser}
              value={inputValue} 
              onValueChange={setInputValue}
              placeholder={`Message ${chatUtils.getUserDisplayName(otherUser)}...`}
            />
          </div>
        </Card.Body>
      </Card>
    </Container>
  );
}

export { ChatRoom };
