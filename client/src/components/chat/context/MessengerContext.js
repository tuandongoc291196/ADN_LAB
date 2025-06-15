import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, setUserOnlineStatus, subscribeToUserStatus } from '../../config/firebase'; // Adjust the import path as necessary

const MessengerContext = createContext();

export const useMessenger = () => {
  const context = useContext(MessengerContext);
  if (!context) {
    throw new Error('useMessenger must be used within a MessengerProvider');
  }
  return context;
};

export const MessengerProvider = ({ children }) => {
  const [firebaseUser] = useAuthState(auth);
  const [user, setUser] = useState(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [unreadCount, setUnreadCount] = useState(0);
  const [notifications, setNotifications] = useState([]);
  const [userStatuses, setUserStatuses] = useState(new Map()); // Store user online statuses

  // Convert Firebase user to our expected user format
  useEffect(() => {
    if (firebaseUser) {
      // Try to get user data from localStorage first
      const storedUserData = localStorage.getItem('userData');
      if (storedUserData) {
        try {
          const userData = JSON.parse(storedUserData);
          setUser({
            uid: firebaseUser.uid,
            ...userData
          });
        } catch (error) {
          // Fallback to Firebase user data
          setUser({
            uid: firebaseUser.uid,
            email: firebaseUser.email,
            displayName: firebaseUser.displayName,
            photoURL: firebaseUser.photoURL,
            fullname: firebaseUser.displayName || 'User'
          });
        }
      } else {
        // Fallback to Firebase user data
        setUser({
          uid: firebaseUser.uid,
          email: firebaseUser.email,
          displayName: firebaseUser.displayName,
          photoURL: firebaseUser.photoURL,
          fullname: firebaseUser.displayName || 'User'
        });
      }
    } else {
      setUser(null);
    }
  }, [firebaseUser]);

  // Manage user online status in Firestore
  useEffect(() => {
    if (user?.uid && isOnline) {
      // Set user as online when authenticated and connected
      setUserOnlineStatus(user.uid, true);
      
      // Set user as offline when page is closed/refreshed
      const handleBeforeUnload = () => {
        setUserOnlineStatus(user.uid, false);
      };
      
      window.addEventListener('beforeunload', handleBeforeUnload);
      
      return () => {
        window.removeEventListener('beforeunload', handleBeforeUnload);
        // Set offline when component unmounts
        if (user?.uid) {
          setUserOnlineStatus(user.uid, false);
        }
      };
    }
  }, [user?.uid, isOnline]);

  // Track online status
  useEffect(() => {
    const handleOnline = () => {
      setIsOnline(true);
      // Update Firestore status when coming back online
      if (user?.uid) {
        setUserOnlineStatus(user.uid, true);
      }
    };
    const handleOffline = () => {
      setIsOnline(false);
      // Update Firestore status when going offline
      if (user?.uid) {
        setUserOnlineStatus(user.uid, false);
      }
    };

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, [user?.uid]);

  // Notification management
  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  }, []);

  const addNotification = useCallback((notification) => {
    const id = Date.now().toString();
    const newNotification = { ...notification, id, timestamp: new Date() };
    setNotifications(prev => [newNotification, ...prev.slice(0, 4)]); // Keep only 5 latest
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      removeNotification(id);
    }, 5000);
  }, [removeNotification]);

  // Typing indicators
  const [typingUsers, setTypingUsers] = useState(new Map());

  const setUserTyping = useCallback((userId, roomId, isTyping) => {
    setTypingUsers(prev => {
      const newMap = new Map(prev);
      if (isTyping) {
        newMap.set(userId, { roomId, timestamp: Date.now() });
      } else {
        newMap.delete(userId);
      }
      return newMap;
    });
  }, []);

  // Clean up old typing indicators
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now();
      setTypingUsers(prev => {
        const newMap = new Map();
        prev.forEach((value, key) => {
          if (now - value.timestamp < 3000) { // Remove after 3 seconds
            newMap.set(key, value);
          }
        });
        return newMap;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // User status management functions
  const subscribeToUserStatusUpdates = useCallback((userId) => {
    if (!userId || userStatuses.has(userId)) {
      return () => {};
    }
    
    const unsubscribe = subscribeToUserStatus(userId, (status) => {
      setUserStatuses(prev => new Map(prev.set(userId, status)));
    });
    
    return unsubscribe;
  }, []);

  const getUserStatus = useCallback((userId) => {
    const status = userStatuses.get(userId) || { id: userId, isOnline: false, lastSeen: null };
    return status;
  }, [userStatuses]);

  const isUserOnline = useCallback((userId) => {
    const status = getUserStatus(userId);
    const isOnline = status.isOnline === true;
    return isOnline;
  }, [getUserStatus]);

  const value = {
    user,
    isOnline,
    unreadCount,
    setUnreadCount,
    notifications,
    addNotification,
    removeNotification,
    typingUsers,
    setUserTyping,
    userStatuses,
    subscribeToUserStatusUpdates,
    getUserStatus,
    isUserOnline
  };

  return (
    <MessengerContext.Provider value={value}>
      {children}
    </MessengerContext.Provider>
  );
};
