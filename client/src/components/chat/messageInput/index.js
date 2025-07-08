import { useState, useRef } from 'react';
import { useAuth } from '../../../components/hooks/useAuth';
import { sendMessage, sendImageMessage, auth } from '../../../components/config/firebase';
import SendIcon from '@mui/icons-material/Send';
import PhotoCameraIcon from '@mui/icons-material/PhotoCamera';
import { useAuthState } from "react-firebase-hooks/auth";
import ImagePreview from '../components/ImagePreview';
import './styles.css';

function MessageInput({ roomId }) {
    const [user] = useAuthState(auth);
    const [value, setValue] = useState('');
    const [isUploading, setIsUploading] = useState(false);
    const [selectedFile, setSelectedFile] = useState(null);
    const fileInputRef = useRef(null);

    const handleChange = (event) => {
        setValue(event.target.value);
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        if (!value.trim()) return;
        
        try {
            // Get recipient ID (other user in the chat room)
            const recipientId = roomId.split('_').find(id => id !== user.uid);
            await sendMessage(roomId, user, value.trim(), recipientId);
            setValue('');
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleImageUpload = async (event) => {
        const file = event.target.files[0];
        if (!file) return;

        // Validate file type
        if (!file.type.startsWith('image/')) {
            alert('Please select an image file');
            return;
        }

        // Validate file size (max 5MB)
        if (file.size > 5 * 1024 * 1024) {
            alert('Image size must be less than 5MB');
            return;
        }

        setSelectedFile(file);
        // Reset file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleSendImage = async (caption) => {
        if (!selectedFile) return;

        setIsUploading(true);
        try {
            // Get recipient ID (other user in the chat room)
            const recipientId = roomId.split('_').find(id => id !== user.uid);
            await sendImageMessage(roomId, user, selectedFile, recipientId, caption);
            setSelectedFile(null);
        } catch (error) {
            console.error('Error sending image:', error);
            alert('Failed to send image. Please try again.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleCancelImage = () => {
        setSelectedFile(null);
    };

    const handleImageButtonClick = () => {
        fileInputRef.current?.click();
    };

    return (
        <>
            <form onSubmit={handleSubmit} className="message-input-container">
                <input
                    type="text"
                    placeholder="Enter a message"
                    value={value}
                    onChange={handleChange}
                    className="message-input"
                    minLength={1}
                />
                <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    ref={fileInputRef}
                    style={{ display: 'none' }}
                />
                <button 
                    type="button" 
                    onClick={handleImageButtonClick}
                    disabled={isUploading}
                    className="image-upload-button"
                    title="Upload image"
                >
                    <PhotoCameraIcon />
                </button>
                <button 
                    type="submit" 
                    disabled={!value.trim() || isUploading} 
                    className="send-message"
                >
                    <SendIcon/>
                </button>
            </form>
            
            {selectedFile && (
                <ImagePreview
                    file={selectedFile}
                    onSend={handleSendImage}
                    onCancel={handleCancelImage}
                />
            )}
        </>
    );
}

export { MessageInput };
