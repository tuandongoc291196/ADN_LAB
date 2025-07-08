/**
 * Cấu hình và kết nối Firebase cho ứng dụng
 * Cung cấp các hàm xử lý xác thực, lưu trữ dữ liệu và quản lý chat
 */
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
import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
import { getDataConnect, connectDataConnectEmulator } from "firebase/data-connect";

import {
  createOrUpdateUser,
  updateUserProfile,
  getUser,
  getUsers,
  updateUserRole as updateUserRoleAPI,
} from "../../lib/dataconnect";

/**
 * Cấu hình kết nối Firebase
 * Chứa các khóa API và thông tin cần thiết để kết nối đến Firebase project
 */
const firebaseConfig = {
  apiKey: "AIzaSyCW-imcNnBVVVs50ORbBIbUxKSGYxHfF2w",
  authDomain: "su25-swp391-g8.firebaseapp.com",
  projectId: "su25-swp391-g8",
  storageBucket: "su25-swp391-g8.firebasestorage.app",
  messagingSenderId: "175488792367",
  appId: "1:175488792367:web:1de7c05fa73a3fe65993da",
  measurementId: "G-93VVG3XR2N"
};

// Khởi tạo Firebase app và các dịch vụ
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const storage = getStorage(app);
const db = getFirestore(app);

/**
 * Khởi tạo Data Connect để tương tác với backend
 * Sử dụng để truy vấn và cập nhật dữ liệu người dùng
 */
const dataConnect = getDataConnect(app, {
  connector: "default",
  service: "su25-swp391-g8-2-service",
  location: "asia-east2"
});

// Provider xác thực Google
const googleProvider = new GoogleAuthProvider();

/**
 * Cache lưu trữ thông tin người dùng để tối ưu hiệu suất
 * Giảm số lượng truy vấn đến server khi cần thông tin người dùng
 */
const userCache = new Map();
const CACHE_EXPIRY_TIME = 5 * 60 * 1000; // 5 phút
let lastUsersFetch = 0;
let allUsersCache = null;

/**
 * Danh sách email có quyền admin (tham khảo)
 * Dùng để xác định vai trò người dùng khi đăng ký
 */
const adminEmails = [
  'admin@adnlab.vn',
  'admin@gmail.com',
  'test.admin@adnlab.vn',
  'adnlab.admin@gmail.com'
];

/**
 * Danh sách email có quyền nhân viên (tham khảo)
 */
const staffEmails = [
  'staff@adnlab.vn',
  'staff@gmail.com',
  'lab@adnlab.vn'
];

/**
 * Danh sách email có quyền quản lý (tham khảo)
 */
const managerEmails = [
  'manager@adnlab.vn',
  'manager@gmail.com'
];

/**
 * Xác định vai trò người dùng dựa trên email
 * @param {string} email - Email người dùng
 * @returns {string} - Mã vai trò: "0" (user), "1" (staff), "2" (manager), "3" (admin)
 */
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

/**
 * Xử lý đăng nhập bằng Google
 * Tạo hoặc cập nhật thông tin người dùng trong Data Connect
 * @returns {Object} Thông tin người dùng đã đăng nhập
 */
const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    try {
      const { data: userData } = await getUser(dataConnect, { userId: user.uid });
      console.log("Checking if user exists in database:", userData);
      if (userData?.user) {
        console.log("User found in database");
      } else {
        console.log("User not found in database, creating new record");
        // Tạo người dùng mới trong Data Connect nếu chưa tồn tại
        await createOrUpdateUser(dataConnect, {
          id : user.uid,
          fullname: user.displayName || "",
          email: user.email,
          authProvider: "google",
          gender: "",
          avatar: user.photoURL || "",
          phone: "",
          address: "",
          roleId: "0"          
        });
      }
    } catch (getUserError) {
      console.log("User error");
    }
    await setUserOnlineStatus(user.uid, true);    
    const { data: userData } = await getUser(dataConnect, { userId: user.uid });
    localStorage.setItem("user_id", user.uid);
    localStorage.setItem("userData", JSON.stringify(userData.user));
    return { uid: user.uid, displayName: user.displayName };
  } catch (err) {
    console.error(err);
    alert(err.message);
    throw err;
  }
};

/**
 * Xử lý đăng nhập bằng email và mật khẩu
 * @param {string} email - Email người dùng
 * @param {string} password - Mật khẩu
 * @returns {Object} Kết quả đăng nhập từ Firebase Auth
 */
const logInWithEmailAndPassword = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;

    // Lấy thông tin người dùng từ Data Connect
    const { data: userData } = await getUser(dataConnect, { userId: user.uid });
    await setUserOnlineStatus(user.uid, true);  
    localStorage.setItem("user_id", user.uid);
    localStorage.setItem("userData", JSON.stringify(userData.user));
    return res;
  } catch (err) {
    console.error(err);
    alert(err.message);
    throw err;
  }
};

/**
 * Xử lý đăng ký tài khoản mới bằng email và mật khẩu
 * @param {string} name - Tên người dùng
 * @param {string} phone - Số điện thoại
 * @param {string} email - Email
 * @param {string} password - Mật khẩu
 * @returns {Object} Kết quả đăng ký từ Firebase Auth
 */
const registerWithEmailAndPassword = async (name, phone, email, password) => {
  try {
    const res = await createUserWithEmailAndPassword(auth, email, password);
    const user = res.user;
    
    // Xác định vai trò dựa trên email
    const roleInfo = getRoleFromEmail(email);
    
    // Tạo người dùng mới trong Data Connect
    await createOrUpdateUser(dataConnect, {
      id : user.uid,
      fullname: name,
      email: email,
      authProvider: "email",
      gender: "",
      avatar: "",
      phone: phone,
      address: "",
      roleId: "0"
    });
    
    // Lấy thông tin người dùng và lưu vào localStorage
    const { data: userData } = await getUser(dataConnect, { userId: user.uid });
    
    localStorage.setItem("user_id", user.uid);
    localStorage.setItem("userData", JSON.stringify(userData.user));
    return res;
  } catch (err) {
    console.error(err);
    alert(err.message);
    throw err;
  }
};

/**
 * Gửi email đặt lại mật khẩu
 * @param {string} email - Email người dùng cần đặt lại mật khẩu
 */
const sendPasswordReset = async (email) => {
  try {
    await sendPasswordResetEmail(auth, email);
    alert("Password reset link sent!");
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logout = async () => {
  const userId = localStorage.getItem("user_id");  
  
  // Cleanup user online status
  await cleanupUserStatus(userId);
  
  localStorage.removeItem("user_id");
  localStorage.removeItem("userData");
  localStorage.removeItem("isAuthenticated");
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

async function sendMessage(roomId, user, text, recipientId, imageUrl = null) {
  try {
    // Prepare message data
    const messageData = {
      senderId: user.uid,
      senderName: user.displayName || user.fullname,
      senderAvatar: user.photoURL || user.avatar,
      timestamp: serverTimestamp(),
      readBy: [user.uid] // Mark as read by sender
    };

    // Add text or image based on message type
    if (imageUrl) {
      messageData.imageUrl = imageUrl;
      messageData.text = text || ""; // Optional caption
      messageData.type = "image";
    } else {
      messageData.text = text.trim();
      messageData.type = "text";
    }

    // Add message to messages subcollection
    await addDoc(collection(db, "chat-rooms", roomId, "messages"), messageData);

    // Update chat room metadata
    const chatRoomRef = doc(db, "chat-rooms", roomId);
    const lastMessageText = imageUrl ? "📷 Đã gửi ảnh" : text.trim();
    await updateDoc(chatRoomRef, {
      lastMessage: lastMessageText,
      lastMessageTime: serverTimestamp(),
      [`unreadCount.${recipientId}`]: increment(1)
    });
  } catch (error) {
    console.error("Error sending message:", error);
    throw error;
  }
}

async function sendImageMessage(roomId, user, file, recipientId, caption = "") {
  try {
    // Upload image to Firebase Storage
    const imageUrl = await uploadChatImage(file, roomId, user.uid);
    
    // Send message with image URL
    await sendMessage(roomId, user, caption, recipientId, imageUrl);
    
    return imageUrl;
  } catch (error) {
    console.error("Error sending image message:", error);
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
    const currentUserId = localStorage.getItem("user_id");
    await updateUserProfile(dataConnect, profileData);
    
    // Get updated user data
    const { data: userData } = await getUser(dataConnect, { userId: currentUserId });
    localStorage.setItem("userData", JSON.stringify(userData.user));
    
    // Invalidate cache for the updated user
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

// User online status management
const USER_STATUS_COLLECTION = "userStatus";

// Set user online status
async function setUserOnlineStatus(userId, isOnline) {
  try {
    if (!userId) return;
    
    const statusRef = doc(db, USER_STATUS_COLLECTION, userId);
    const statusData = {
      userId,
      isOnline,
      lastSeen: serverTimestamp(),
      updatedAt: serverTimestamp()
    };
    await setDoc(statusRef, statusData, { merge: true });
  } catch (error) {
    console.error("Error updating user online status:", error);
  }
}

// Get user online status (single user)
async function getUserOnlineStatus(userId) {
  try {
    if (!userId) return { isOnline: false, lastSeen: null };
    
    const statusRef = doc(db, USER_STATUS_COLLECTION, userId);
    const statusDoc = await getDoc(statusRef);
    
    if (statusDoc.exists()) {
      return statusDoc.data();
    }
    
    return { isOnline: false, lastSeen: null };
  } catch (error) {
    console.error("Error fetching user online status:", error);
    return { isOnline: false, lastSeen: null };
  }
}

// Subscribe to user online status changes (real-time)
function subscribeToUserStatus(userId, callback) {
  if (!userId) return () => {};
  
  const statusRef = doc(db, USER_STATUS_COLLECTION, userId);
  return onSnapshot(statusRef, (doc) => {
    if (doc.exists()) {
      const data = doc.data();
      callback(data);
    } else {
      callback({ isOnline: false, lastSeen: null });
    }
  }, (error) => {
    console.error("Error listening to user status:", error);
    callback({ isOnline: false, lastSeen: null });
  });
}

// Subscribe to multiple users' online status (for chat rooms)
function subscribeToMultipleUsersStatus(userIds, callback) {
  if (!userIds || userIds.length === 0) return () => {};
  
  const unsubscribeCallbacks = [];
  const statusMap = new Map();
  
  const updateCallback = () => {
    callback(new Map(statusMap));
  };
  
  userIds.forEach(userId => {
    const unsubscribe = subscribeToUserStatus(userId, (status) => {
      statusMap.set(userId, status);
      updateCallback();
    });
    unsubscribeCallbacks.push(unsubscribe);
  });
  
  return () => {
    unsubscribeCallbacks.forEach(unsubscribe => unsubscribe());
  };
}

// Cleanup user status on logout
async function cleanupUserStatus(userId) {
  try {
    if (!userId) return;
    
    await setUserOnlineStatus(userId, false);
  } catch (error) {
    console.error("Error cleaning up user status:", error);
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

export const uploadAvatar = async (file, userId) => {
  if (!file || !userId) throw new Error("Thiếu file hoặc userId");
  const storageRef = ref(storage, `avatars/${userId}_${Date.now()}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
};

export const uploadChatImage = async (file, chatroomId, userId) => {
  if (!file || !chatroomId || !userId) throw new Error("Thiếu file, chatroomId hoặc userId");
  const timestamp = Date.now();
  const storageRef = ref(storage, `chat/${chatroomId}/${userId}_${timestamp}_${file.name}`);
  await uploadBytes(storageRef, file);
  const url = await getDownloadURL(storageRef);
  return url;
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
  sendImageMessage,
  createOrGetChatRoom,
  getUserChatRooms,
  markMessagesAsRead,
  searchUsersForChat,
  updateProfile,
  getAllUsers,
  updateUserRole,
  isAdmin,
  isStaff,
  adminEmails,
  staffEmails,
  managerEmails,
  setUserOnlineStatus,
  getUserOnlineStatus,
  subscribeToUserStatus,
  subscribeToMultipleUsersStatus,
  cleanupUserStatus
};