import { initializeApp } from "firebase/app";
import {
  GoogleAuthProvider,
  getAuth,
  signInWithPopup,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  sendPasswordResetEmail,
  signOut,
} from "firebase/auth";
import { 
  getFirestore,
  addDoc,
  collection,
  onSnapshot,
  orderBy,
  query,
  serverTimestamp,
  doc,
  setDoc,
  getDoc,
  getDocs,
  where,
  updateDoc,
  increment,
  arrayUnion,
  deleteDoc
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDataConnect, connectDataConnectEmulator } from "firebase/data-connect";

import {
  createOrUpdateUser,
  updateUserProfile,
  getUser,
  getUsers,
  updateUserRole as updateUserRoleAPI,
  updateUserAccountStatus as updateAccountStatusAPI
} from "../../lib/dataconnect";

const firebaseConfig = {
  apiKey: "AIzaSyCW-imcNnBVVVs50ORbBIbUxKSGYxHfF2w",
  authDomain: "su25-swp391-g8.firebaseapp.com",
  projectId: "su25-swp391-g8",
  storageBucket: "su25-swp391-g8.firebasestorage.app",
  messagingSenderId: "175488792367",
  appId: "1:175488792367:web:1de7c05fa73a3fe65993da",
  measurementId: "G-93VVG3XR2N"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

const dataConnect = getDataConnect(app, {
  connector: "default",
  service: "su25-swp391-g8-service",
  location: "asia-east2"
});

const googleProvider = new GoogleAuthProvider();

// User cache to optimize getUserById calls
const userCache = new Map();
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 minutes
let lastUsersFetch = 0;
let allUsersCache = null;

// Admin email lists (for reference)
const adminEmails = [
  'admin@adnlab.vn',
  'admin@gmail.com',
  'test.admin@adnlab.vn',
  'adnlab.admin@gmail.com',
  'hieuntse184626@fpt.edu.vn'
];

const staffEmails = [
  'staff@adnlab.vn',
  'staff@gmail.com',
  'lab@adnlab.vn'
];

const managerEmails = [
  'manager@adnlab.vn',
  'manager@gmail.com'
];

// Helper function to determine role based on email
const getRoleFromEmail = (email) => {
  if (adminEmails.includes(email)) {
    return "3";
  } else if (staffEmails.includes(email)) {
    return "1";
  } else if (managerEmails.includes(email)) {
    return "2";
  } else {
    return "0";
  }
};

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    try {
      const { data: userData } = await getUser(dataConnect);
      console.log("Checking if user exists in database:", userData);
      if (userData?.user) {
        console.log("User found in database, updating localStorage");
        localStorage.setItem("user_id", user.uid);
        localStorage.setItem("userData", JSON.stringify(userData.user));
        return { uid: user.uid, displayName: user.displayName };
      }
    } catch (getUserError) {
      console.log("User not found in database, creating new record");
    }
    await createOrUpdateUser(dataConnect, {
      fullname: user.displayName || "",
      email: user.email,
      authProvider: "google",
      gender: "",
      avatar: user.photoURL || "",
      phone: "",
      shippingAddress: "",
      roleId: getRoleFromEmail(user.email) 
    });
    
    const { data: userData } = await getUser(dataConnect);
    
    localStorage.setItem("user_id", user.uid);
    localStorage.setItem("userData", JSON.stringify(userData.user));
    
    return { uid: user.uid, displayName: user.displayName };
  } catch (err) {
    console.error(err);
    alert(err.message);
    throw err;
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;

    const { data: userData } = await getUser(dataConnect);
    
    localStorage.setItem("user_id", user.uid);
    localStorage.setItem("userData", JSON.stringify(userData.user));
    
    return res;
  } catch (err) {
    console.error(err);
    alert(err.message);
    throw err;
  }
};

const registerWithEmailAndPassword = async (name, phone, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    
    // Create user in Data Connect with role based on email
    const roleInfo = getRoleFromEmail(email);
    
    await createOrUpdateUser(dataConnect, {
      fullname: name,
      email: email,
      authProvider: "email",
      gender: "",
      avatar: "",
      phone: phone,
      shippingAddress: "",
      roleId: "0"
    });
    
    // Get user data and store in localStorage
    const { data: userData } = await getUser(dataConnect);
    
    localStorage.setItem("user_id", user.uid);
    localStorage.setItem("userData", JSON.stringify(userData.user));
    
    return res;
  } catch (err) {
    console.error(err);
    alert(err.message);
    throw err;
  }
};

const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = () => {
  localStorage.removeItem("user_id");
  localStorage.removeItem("userData");
  localStorage.removeItem("isAuthenticated");
  
  // Clear user cache on logout
  clearUserCache();
  
  signOut(auth);
};

// One-on-one chat functions
async function createOrGetChatRoom(userId1, userId2) {
  try {
    if (!userId1 || !userId2 || userId1 === userId2) {
      throw new Error(`Invalid user IDs: userId1=${userId1}, userId2=${userId2}`);
    }

    const roomId = [userId1, userId2].sort().join('_');
    const chatRoomRef = doc(db, "chat-rooms", roomId);
    const chatRoomDoc = await getDoc(chatRoomRef);
    console.log(chatRoomDoc);
    
    if (!chatRoomDoc.exists()) {
      const chatRoomData = {
        participants: [userId1, userId2],
        createdAt: serverTimestamp(),
        lastMessage: "",
        lastMessageTime: null,
        unreadCount: {
          [userId1]: 0,
          [userId2]: 0
        }
      };
      
      console.log('Creating chat room with data:', chatRoomData);
      await setDoc(chatRoomRef, chatRoomData);
    }
    
    return roomId;
  } catch (error) {
    console.error("Error creating/getting chat room:", error);
    throw error;
  }
}

async function sendMessage(roomId, user, text, recipientId) {
  try {
    // Add message to messages subcollection
    await addDoc(collection(db, "chat-rooms", roomId, "messages"), {
      senderId: user.uid,
      senderName: user.displayName || user.fullname,
      senderAvatar: user.photoURL || user.avatar,
      text: text.trim(),
      timestamp: serverTimestamp(),
      readBy: [user.uid] // Mark as read by sender
    });

    // Update chat room metadata
    const chatRoomRef = doc(db, "chat-rooms", roomId);
    await updateDoc(chatRoomRef, {
      lastMessage: text.trim(),
      lastMessageTime: serverTimestamp(),
      [`unreadCount.${recipientId}`]: increment(1)
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

function getMessages(roomId, callback) {
  return onSnapshot(
    query(
      collection(db, "chat-rooms", roomId, "messages"),
      orderBy("timestamp", "asc")
    ),
    (querySnapshot) => {
      const messages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      callback(messages);
    }
  );
}

async function getUserById(userId) {
  try {
    // Check if user is in cache and still valid
    const cachedUser = userCache.get(userId);
    if (cachedUser && (Date.now() - cachedUser.timestamp) < CACHE_EXPIRY_TIME) {
      return cachedUser.data;
    }

    // Check if we have recent all users cache
    const now = Date.now();
    if (!allUsersCache || (now - lastUsersFetch) > CACHE_EXPIRY_TIME) {
      const { data } = await getUsers(dataConnect);
      allUsersCache = data.users || [];
      lastUsersFetch = now;
      
      // Update individual user cache
      allUsersCache.forEach(user => {
        userCache.set(user.id, {
          data: {
            ...user,
            user_id: user.id
          },
          timestamp: now
        });
      });
    }
    
    const user = allUsersCache.find(u => u.id === userId);
    if (user) {
      const userData = {
        ...user,
        user_id: user.id // Add user_id field for compatibility
      };
      
      // Cache the user data
      userCache.set(userId, {
        data: userData,
        timestamp: now
      });
      
      return userData;
    }
    
    return null;
  } catch (error) {
    console.error("Error fetching user by ID:", error);
    return null;
  }
}

function getUserChatRooms(userId, callback) {
  return onSnapshot(
    query(
      collection(db, "chat-rooms"),
      where("participants", "array-contains", userId)
    ),
    async (querySnapshot) => {
      const chatRooms = [];
      const docsToDelete = [];
      const validChatRoomDocs = [];
      const now = new Date();
      const fiveMinutesAgo = new Date(now.getTime() - 5 * 60 * 1000);
      
      for (const doc of querySnapshot.docs) {
        const data = doc.data();

        if (!data.lastMessage || data.lastMessage === "") {
          const createdAt = data.createdAt?.toDate();
          
          if (createdAt && createdAt < fiveMinutesAgo) {
            docsToDelete.push(doc.ref);
            continue;
          } else {
          }
        }
        
        validChatRoomDocs.push({ doc, data });
      }
      
      // Batch delete old empty chat rooms (async, don't block the main flow)
      if (docsToDelete.length > 0) {
        Promise.all(
          docsToDelete.map(async (docRef) => {
            try {
              await deleteDoc(docRef);
              console.log("Successfully deleted old empty chat room:", docRef.id);
            } catch (error) {
              console.error("Error deleting chat room:", docRef.id, error);
            }
          })
        ).catch(error => {
          console.error("Error in batch delete:", error);
        });
      }
      
      // Collect all unique other user IDs needed
      const otherUserIds = validChatRoomDocs.map(({ data }) => 
        data.participants.find(id => id !== userId)
      ).filter(Boolean);
      const uniqueOtherUserIds = [...new Set(otherUserIds)];
      const usersMap = new Map();
      const uncachedUserIds = [];
      const cacheValidTime = Date.now() - CACHE_EXPIRY_TIME;
      
      for (const otherUserId of uniqueOtherUserIds) {
        const cachedUser = userCache.get(otherUserId);
        if (cachedUser && cachedUser.timestamp > cacheValidTime) {
          usersMap.set(otherUserId, cachedUser.data);
        } else {
          uncachedUserIds.push(otherUserId);
        }
      }
      
      // If we have uncached users, refresh the entire cache
      if (uncachedUserIds.length > 0 || !allUsersCache || (Date.now() - lastUsersFetch) > CACHE_EXPIRY_TIME) {
        try {
          const { data } = await getUsers(dataConnect);
          allUsersCache = data.users || [];
          lastUsersFetch = Date.now();
          
          // Update cache and usersMap for all users
          allUsersCache.forEach(user => {
            const userData = {
              ...user,
              user_id: user.id
            };
            
            userCache.set(user.id, {
              data: userData,
              timestamp: lastUsersFetch
            });
            
            // Add to current usersMap if needed
            if (uniqueOtherUserIds.includes(user.id)) {
              usersMap.set(user.id, userData);
            }
          });
        } catch (error) {
          console.error("Error fetching users for chat rooms:", error);
        }
      }
      
      // Build chat rooms with cached user data
      for (const { doc, data } of validChatRoomDocs) {
        const otherUserId = data.participants.find(id => id !== userId);
        const otherUser = usersMap.get(otherUserId) || {
          id: otherUserId,
          user_id: otherUserId,
          fullname: "Unknown User",
          email: "",
          avatar: ""
        };
        
        chatRooms.push({
          id: doc.id,
          ...data,
          otherUser
        });
      }
      
      callback(chatRooms);
    }
  );
}

async function markMessagesAsRead(roomId, userId) {
  try {
    const chatRoomRef = doc(db, "chat-rooms", roomId);
    await updateDoc(chatRoomRef, {
      [`unreadCount.${userId}`]: 0
    });
  } catch (error) {
    console.error("Error marking messages as read:", error);
  }
}

// Search users for starting new chats
async function searchUsersForChat(searchTerm) {
  try {
    // Use cached data if available and recent
    const now = Date.now();
    if (!allUsersCache || (now - lastUsersFetch) > CACHE_EXPIRY_TIME) {
      const { data } = await getUsers(dataConnect);
      allUsersCache = data.users || [];
      lastUsersFetch = now;
      
      // Update individual user cache
      allUsersCache.forEach(user => {
        userCache.set(user.id, {
          data: {
            ...user,
            user_id: user.id
          },
          timestamp: now
        });
      });
    }

    return allUsersCache
      .filter(user => 
        user.fullname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        user.email?.toLowerCase().includes(searchTerm.toLowerCase())
      )
      .map(user => ({
        ...user,
        user_id: user.id
      }));
  } catch (error) {
    console.error("Error searching users:", error);
    return [];
  }
}

// Cache management functions
function clearUserCache() {
  userCache.clear();
  allUsersCache = null;
  lastUsersFetch = 0;
}

function invalidateUserCache(userId) {
  if (userId) {
    userCache.delete(userId);
  }
  // Also invalidate the all users cache since it might contain outdated data
  allUsersCache = null;
  lastUsersFetch = 0;
}

// User profile management with Data Connect
async function updateProfile(profileData) {
  try {
    await updateUserProfile(dataConnect, profileData);
    
    // Get updated user data
    const { data: userData } = await getUser(dataConnect);
    localStorage.setItem("userData", JSON.stringify(userData.user));
    
    // Invalidate cache for the updated user
    const currentUserId = localStorage.getItem("user_id");
    if (currentUserId) {
      invalidateUserCache(currentUserId);
    }
    
    return userData.user;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

// Admin functions for user management
async function getAllUsers() {
  try {
    // Use cached data if available and recent
    const now = Date.now();
    if (!allUsersCache || (now - lastUsersFetch) > CACHE_EXPIRY_TIME) {
      const { data } = await getUsers(dataConnect);
      allUsersCache = data.users || [];
      lastUsersFetch = now;
      
      // Update individual user cache
      allUsersCache.forEach(user => {
        userCache.set(user.id, {
          data: {
            ...user,
            user_id: user.id
          },
          timestamp: now
        });
      });
    }
    
    return allUsersCache;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

async function updateUserRole(userId, roleId) {
  try {
    await updateUserRoleAPI(dataConnect, {
      userId,
      roleId
    });
    
    // Invalidate cache for the updated user
    invalidateUserCache(userId);
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
}

async function updateAccountStatus(userId, accountStatus) {
  try {
    await updateAccountStatusAPI(dataConnect, {
      userId,
      accountStatus
    });
    
    // Invalidate cache for the updated user
    invalidateUserCache(userId);
  } catch (error) {
    console.error("Error updating account status:", error);
    throw error;
  }
}

// Check if user is admin (based on userData from localStorage or DB)
const isAdmin = (userData) => {
  return userData?.roleString === 'admin';
};

// Check if user is staff or higher
const isStaff = (userData) => {
  return ['admin', 'staff', 'manager'].includes(userData?.roleString);
};

export {
  auth,
  db,
  dataConnect,
  storage,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getMessages,
  sendMessage,
  createOrGetChatRoom,
  getUserChatRooms,
  markMessagesAsRead,
  searchUsersForChat,
  updateProfile,
  getAllUsers,
  updateUserRole,
  updateAccountStatus,
  isAdmin,
  isStaff,
  adminEmails,
  staffEmails,
  managerEmails,
  clearUserCache,
  invalidateUserCache
};
