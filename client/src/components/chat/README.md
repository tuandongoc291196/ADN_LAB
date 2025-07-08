# Chat Image Upload Feature

This feature allows users to send images in chat conversations with support for captions, full-screen viewing, and proper organization in Firebase Storage.

## Features

- **Image Upload**: Users can select and upload images from their device
- **Image Preview**: Preview images with optional captions before sending
- **Full-Screen Viewer**: Click on any image to view it full-screen with download option
- **Image Storage**: Images are stored in Firebase Storage organized by chat room
- **File Validation**: Automatic validation for file type and size (max 5MB)
- **Error Handling**: Proper error handling for upload failures and loading errors
- **Responsive Design**: Works well on both desktop and mobile devices

## File Structure

```
client/src/components/chat/
├── components/
│   ├── ImageViewer.js          # Full-screen image viewer
│   ├── ImageViewer.css         # Styles for image viewer
│   ├── ImagePreview.js         # Image preview before sending
│   └── ImagePreview.css        # Styles for image preview
├── messageInput/
│   ├── index.js                # Enhanced with image upload
│   └── styles.css              # Updated styles
├── messageList/
│   ├── index.js                # Enhanced to display images
│   └── styles.css              # Updated styles for images
└── config/
    └── firebase.js             # Image upload functions
```

## Firebase Storage Structure

Images are organized in Firebase Storage as follows:

```
chat/
├── {roomId}/
│   ├── {userId}_{timestamp}_{filename}
│   └── {userId}_{timestamp}_{filename}
└── {roomId}/
    ├── {userId}_{timestamp}_{filename}
    └── {userId}_{timestamp}_{filename}
```

## Components

### ImageViewer Component
- **Purpose**: Full-screen image viewing with download capability
- **Features**: 
  - Click outside to close
  - Download button
  - Caption display
  - Responsive design
  - Smooth animations

### ImagePreview Component
- **Purpose**: Preview images before sending with optional captions
- **Features**:
  - Image preview
  - Caption input (max 500 characters)
  - Send/Cancel actions
  - Keyboard shortcuts (Enter to send)
  - Mobile responsive

### Enhanced MessageInput Component
- **New Features**:
  - Image upload button
  - File validation
  - Upload progress feedback
  - Error handling
  - Integration with preview component

### Enhanced MessageList Component
- **New Features**:
  - Image message display
  - Click to open full-screen viewer
  - Caption support
  - Error handling for broken images
  - Proper message type detection

## Usage

### Sending Images

1. Click the camera icon in the message input
2. Select an image file (max 5MB)
3. Add an optional caption
4. Click "Send" to upload and send the image

### Viewing Images

1. Click on any image in the chat to open full-screen viewer
2. Use the download button to save the image
3. Click outside the image or the close button to close the viewer

## Technical Details

### Image Upload Function

```javascript
export const uploadChatImage = async (file, chatroomId, userId) => {
  if (!file || !chatroomId || !userId) throw new Error("Missing required parameters");
  const timestamp = Date.now();
  const storageRef = ref(storage, `chat/${chatroomId}/${userId}_${timestamp}_${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};
```

### Message Structure

Text messages:
```javascript
{
  senderId: "user_id",
  senderName: "User Name",
  senderAvatar: "avatar_url",
  text: "Message content",
  type: "text",
  timestamp: firestore_timestamp
}
```

Image messages:
```javascript
{
  senderId: "user_id",
  senderName: "User Name", 
  senderAvatar: "avatar_url",
  imageUrl: "firebase_storage_url",
  text: "Optional caption",
  type: "image",
  timestamp: firestore_timestamp
}
```

## Styling

The components use CSS custom properties for consistent theming:
- `--color-gray`: Background for inputs and messages
- `--color-blue`: Primary action color
- `--border-radius`: Consistent border radius

## Error Handling

- **File Type Validation**: Only image files are accepted
- **File Size Validation**: Maximum 5MB file size
- **Upload Error Handling**: User-friendly error messages
- **Image Loading Errors**: Fallback display for broken images
- **Network Error Handling**: Proper error messages for network issues

## Browser Support

- Modern browsers with ES6+ support
- File API support for image uploads
- Firebase SDK compatibility
- CSS Grid and Flexbox support

## Dependencies

- Firebase SDK v9+
- React 18+
- Material-UI Icons
- react-firebase-hooks

## Security Considerations

- File type validation on client side
- File size limits to prevent abuse
- Firebase Security Rules should be configured for the `chat/` storage path
- User authentication required for uploads
- Images are organized by chat room for access control

## Performance Optimizations

- Image compression could be added for large files
- Lazy loading for image messages
- Caching of frequently accessed images
- Cleanup of unused images (periodic maintenance)

## Future Enhancements

- Image compression before upload
- Multiple image selection
- Drag and drop support
- Image filters/editing
- GIF support
- Video message support
- Image thumbnails for faster loading
