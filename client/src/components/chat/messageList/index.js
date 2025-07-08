import { useLayoutEffect, useRef, useState } from 'react';
import { useAuth } from '../../../components/hooks/useAuth';
import { useMessages } from '../../../components/hooks/useMessages';
import { auth } from '../../../components/config/firebase';
import { useAuthState } from "react-firebase-hooks/auth";
import ImageViewer from '../components/ImageViewer';
import './styles.css';

function MessageList({ roomId }) {
    const containerRef = useRef(null);
    const [user] = useAuthState(auth);
    const messages = useMessages(roomId);
    const [selectedImage, setSelectedImage] = useState(null);

    useLayoutEffect(() => {
        if (containerRef.current) {
            containerRef.current.scrollTop = containerRef.current.scrollHeight;
        }
    });

    const handleImageClick = (imageUrl, caption) => {
        setSelectedImage({ imageUrl, caption });
    };

    const handleCloseImageViewer = () => {
        setSelectedImage(null);
    };

    return (
        <>
            <div className="message-list-container" ref={containerRef}>
                <ul className="message-list">
                    {messages.map((x) => (
                        <Message
                            key={x.id}
                            message={x}
                            isOwnMessage={x.senderId === user.uid}
                            onImageClick={handleImageClick}
                        />
                    ))}
                </ul>
            </div>
            
            {selectedImage && (
                <ImageViewer
                    imageUrl={selectedImage.imageUrl}
                    caption={selectedImage.caption}
                    isOpen={!!selectedImage}
                    onClose={handleCloseImageViewer}
                />
            )}
        </>
    );
}

function Message({ message, isOwnMessage, onImageClick }) {
    const { senderName, text, imageUrl, type } = message;

    const handleImageClick = () => {
        if (imageUrl) {
            onImageClick(imageUrl, text);
        }
    };

    return (
        <li className={['message', isOwnMessage && 'own-message'].join(' ')}>
            <h4 className="sender">{isOwnMessage ? 'You' : senderName}</h4>
            {type === 'image' ? (
                <div className="image-message">
                    <img 
                        src={imageUrl} 
                        alt="Sent image" 
                        className="chat-image"
                        onClick={handleImageClick}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'block';
                        }}
                    />
                    <div className="image-error" style={{ display: 'none' }}>
                        Failed to load image
                    </div>
                    {text && <div className="image-caption">{text}</div>}
                </div>
            ) : (
                <div className="text-message">{text}</div>
            )}
        </li>
    );
}

export { MessageList };