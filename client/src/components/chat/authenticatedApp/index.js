import { Routes, Route } from 'react-router-dom';
import { Landing } from '../landing';
import { ChatRoom } from '../chatRoom';

function AuthenticatedApp() {
  return (
    <Routes>
      <Route path="/" element={<Landing />} />
      <Route path="/room/:id" element={<ChatRoom />} />
    </Routes>
  );
}

export { AuthenticatedApp };