// Firebase Data Connect Configuration for ADN Lab - Users Only
// Chat functionality remains in Firestore
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
  serverTimestamp
} from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getDataConnect, connectDataConnectEmulator } from "firebase/data-connect";

// Import generated Data Connect operations for users only
// Note: These will be available after running: firebase dataconnect:sdk:generate
import {
  upsertUser,
  updateLastLogin,
  updateUserProfile,
  getUser,
  userExists,
  listUsers,
  updateUserRole as updateUserRoleAPI,
  updateAccountStatus as updateAccountStatusAPI
} from "../../lib/dataconnect";

// Firebase configuration
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
const db = getFirestore(app); // Keep Firestore for chat

// Initialize Data Connect for production (deployed service)
const dataConnect = getDataConnect(app, {
  connector: "default",
  service: "server",
  location: "asia-east2"
});

// Ensure we're not using emulator for Data Connect in production
// This prevents connection to localhost:9399

const googleProvider = new GoogleAuthProvider();

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
    return { role: true, roleString: "admin" };
  } else if (staffEmails.includes(email)) {
    return { role: true, roleString: "staff" };
  } else if (managerEmails.includes(email)) {
    return { role: true, roleString: "manager" };
  } else {
    return { role: false, roleString: "customer" };
  }
};

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    
    // Check if user exists in Data Connect
    try {
      const { data: existingUser } = await userExists(dataConnect);
      
      if (!existingUser?.user) {
        // Create new user with role based on email
        const roleInfo = getRoleFromEmail(user.email);
        
        await upsertUser(dataConnect, {
          fullname: user.displayName || "",
          email: user.email,
          authProvider: "google",
          gender: "",
          avatar: user.photoURL || "",
          phone: "",
          addressShipping: "",
          role: roleInfo.role,
          roleString: roleInfo.roleString
        });
      } else {
        // Update last login
        await updateLastLogin(dataConnect);
      }
    } catch (error) {
      console.error("Error handling user data:", error);
      // If user doesn't exist, create them
      const roleInfo = getRoleFromEmail(user.email);
      
      await upsertUser(dataConnect, {
        fullname: user.displayName || "",
        email: user.email,
        authProvider: "google",
        gender: "",
        avatar: user.photoURL || "",
        phone: "",
        addressShipping: "",
        role: roleInfo.role,
        roleString: roleInfo.roleString
      });
    }
    
    // Get user data and store in localStorage
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
    
    // Update last login time
    await updateLastLogin(dataConnect);
    
    // Get updated user data
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
    
    await upsertUser(dataConnect, {
      fullname: name,
      email: email,
      authProvider: "email",
      gender: "",
      avatar: "",
      phone: phone,
      addressShipping: "",
      role: roleInfo.role,
      roleString: roleInfo.roleString
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
  signOut(auth);
};

// Chat functions using Firestore (not Data Connect)
async function sendMessage(roomId, user, text) {
  try {
    await addDoc(collection(db, "chat-rooms", roomId, "messages"), {
      uid: user.uid,
      displayName: user.displayName,
      text: text.trim(),
      timestamp: serverTimestamp(),
    });
  } catch (error) {
    console.error(error);
  }
}

function getMessages(roomId, callback) {
  return onSnapshot(
    query(
      collection(db, "chat-rooms", roomId, "messages"),
      orderBy("timestamp", "asc")
    ),
    (querySnapshot) => {
      const messages = querySnapshot.docs.map((x) => ({
        id: x.id,
        ...x.data(),
      }));

      callback(messages);
    }
  );
}

// User profile management with Data Connect
async function updateProfile(profileData) {
  try {
    await updateUserProfile(dataConnect, profileData);
    
    // Get updated user data
    const { data: userData } = await getUser(dataConnect);
    localStorage.setItem("userData", JSON.stringify(userData.user));
    
    return userData.user;
  } catch (error) {
    console.error("Error updating profile:", error);
    throw error;
  }
}

// Admin functions for user management
async function getAllUsers() {
  try {
    const { data } = await listUsers(dataConnect);
    return data.users;
  } catch (error) {
    console.error("Error fetching users:", error);
    throw error;
  }
}

async function updateUserRole(userId, roleString, role) {
  try {
    await updateUserRoleAPI(dataConnect, {
      userId,
      roleString: roleString,
      role
    });
  } catch (error) {
    console.error("Error updating user role:", error);
    throw error;
  }
}

async function updateAccountStatus(userId, accountStatus) {
  try {
    await updateAccountStatusAPI(dataConnect, {
      userId,
      accountStatus: accountStatus
    });
  } catch (error) {
    console.error("Error updating account status:", error);
    throw error;
  }
}

// Check if user is admin (based on userData from localStorage or DB)
const isAdmin = (userData) => {
  return userData?.role_string === 'admin';
};

// Check if user is staff or higher
const isStaff = (userData) => {
  return ['admin', 'staff', 'manager'].includes(userData?.role_string);
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
  updateProfile,
  getAllUsers,
  updateUserRole,
  updateAccountStatus,
  isAdmin,
  isStaff,
  adminEmails,
  staffEmails,
  managerEmails
};
