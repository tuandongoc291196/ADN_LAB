import React, { useState } from 'react';
import SendIcon from '@mui/icons-material/Send';
import CloseIcon from '@mui/icons-material/Close';
import './ImagePreview.css';

function ImagePreview({ file, onSend, onCancel }) {
    const [caption, setCaption] = useState('');
    const [imageUrl, setImageUrl] = useState(null);

    React.useEffect(() => {
        if (file) {
            const url = URL.createObjectURL(file);
            setImageUrl(url);
            return () => URL.revokeObjectURL(url);
        }
    }, [file]);

    const handleSend = () => {
        onSend(caption.trim());
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    };

    if (!file || !imageUrl) return null;

    return (
        <div className="image-preview-overlay">
            <div className="image-preview-container">
                <div className="image-preview-header">
                    <h3>Send Image</h3>
                    <button 
                        className="image-preview-close"
                        onClick={onCancel}
                        title="Cancel"
                    >
                        <CloseIcon />
                    </button>
                </div>
                
                <div className="image-preview-content">
                    <div className="image-preview-image-container">
                        <img 
                            src={imageUrl} 
                            alt="Preview" 
                            className="image-preview-image"
                        />
                    </div>
                    
                    <div className="image-preview-caption-container">
                        <textarea
                            value={caption}
                            onChange={(e) => setCaption(e.target.value)}
                            onKeyPress={handleKeyPress}
                            placeholder="Add a caption (optional)..."
                            className="image-preview-caption"
                            maxLength={500}
                        />
                        <div className="image-preview-actions">
                            <button 
                                className="image-preview-button cancel-button"
                                onClick={onCancel}
                            >
                                Cancel
                            </button>
                            <button 
                                className="image-preview-button send-button"
                                onClick={handleSend}
                            >
                                <SendIcon />
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default ImagePreview;
