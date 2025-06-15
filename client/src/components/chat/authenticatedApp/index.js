import { Routes, Route } from 'react-router-dom';
import { Landing as ChatLanding } from '../landing';
import { ChatRoom } from '../chatRoom';

function AuthenticatedApp() {
  return (
    <Routes>
      <Route path="/" element={<ChatLanding />} />
      <Route path="/chat/:roomId" element={<ChatRoom />} />
    </Routes>
  );
}

export { AuthenticatedApp };