import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import DownloadIcon from '@mui/icons-material/Download';
import './ImageViewer.css';

function ImageViewer({ imageUrl, isOpen, onClose, caption }) {
    if (!isOpen) return null;

    const handleDownload = () => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `chat-image-${Date.now()}.jpg`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const handleBackdropClick = (e) => {
        if (e.target === e.currentTarget) {
            onClose();
        }
    };

    return (
        <div className="image-viewer-overlay" onClick={handleBackdropClick}>
            <div className="image-viewer-container">
                <div className="image-viewer-header">
                    <div className="image-viewer-actions">
                        <button 
                            className="image-viewer-button"
                            onClick={handleDownload}
                            title="Download image"
                        >
                            <DownloadIcon />
                        </button>
                        <button 
                            className="image-viewer-button close-button"
                            onClick={onClose}
                            title="Close"
                        >
                            <CloseIcon />
                        </button>
                    </div>
                </div>
                <div className="image-viewer-content">
                    <img 
                        src={imageUrl} 
                        alt="Chat image" 
                        className="image-viewer-image"
                    />
                    {caption && (
                        <div className="image-viewer-caption">
                            {caption}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

export default ImageViewer;
