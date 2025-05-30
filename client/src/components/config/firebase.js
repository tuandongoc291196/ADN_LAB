// Import the functions you need from the SDKs you need
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
  query,
  getDocs,
  collection,
  where,
  addDoc,
  doc,
  serverTimestamp,
  onSnapshot,
  orderBy,
  setDoc,
  getDoc,
  updateDoc,
} from "firebase/firestore";
import { 
  getStorage, 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll 
} from "firebase/storage";
import { getAnalytics } from "firebase/analytics";

// Your web app's Firebase configuration
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
const db = getFirestore(app);
const googleProvider = new GoogleAuthProvider();
const storage = getStorage(app);

// Admin email detection lists
const adminEmails = [
  'admin@adnlab.vn',
  'admin@gmail.com',
  'test.admin@adnlab.vn',
  'adnlab.admin@gmail.com'
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
const determineRole = (email) => {
  if (adminEmails.includes(email)) return 'admin';
  if (staffEmails.includes(email)) return 'staff';
  if (managerEmails.includes(email)) return 'manager';
  return 'customer';
};

// Helper function to convert role to boolean (for backward compatibility)
const getRoleBoolean = (roleString) => {
  // For backward compatibility: admin/staff/manager = true, customer = false
  return ['admin', 'staff', 'manager'].includes(roleString);
};

// EXISTING FUNCTIONS (Unchanged for backward compatibility)

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("user_id", "==", user.uid));
    const docs = await getDocs(q);
    
    // Determine role based on email
    const userRole = determineRole(user.email);
    
    if (docs.docs.length === 0) {
      const userData = doc(db, "users", user.uid);
      await setDoc(userData, {
        user_id: user.uid,
        fullname: user.displayName,
        gender: "",
        avatar: user.photoURL,
        email: user.email,
        account_status: "active",
        auth: "",
        authProvider: "google",
        phone: "",
        address_shipping: "",
        role: getRoleBoolean(userRole), // Keep backward compatibility
        role_string: userRole, // New field for detailed role
        created_at: new Date().toISOString(),
      });
    } else {
      // Update existing user with role info
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
        role_string: userRole,
        role: getRoleBoolean(userRole),
        last_login: new Date().toISOString(),
      });
    }
    
    localStorage.setItem("user_id", user.uid);
    const userDataRef = doc(db, "users", user.uid);
    const userDataSnap = await getDoc(userDataRef);
    const userDataDoc = userDataSnap.data();
    localStorage.setItem("userData", JSON.stringify(userDataDoc));
    
    return { uid: user.uid, displayName: user.displayName };
  } catch (err) {
    console.error(err);
    alert(err.message);
  }
};

const logInWithEmailAndPassword = async (email, password) => {
  try {
    const res = await signInWithEmailAndPassword(auth, email, password);
    const user = res.user;
    
    // Determine role and update user data
    const userRole = determineRole(user.email);
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      // Update existing user
      await updateDoc(userDocRef, {
        role_string: userRole,
        role: getRoleBoolean(userRole),
        last_login: new Date().toISOString(),
      });
    }
    
    // Store user data in localStorage
    localStorage.setItem("user_id", user.uid);
    const updatedUserDataSnap = await getDoc(userDocRef);
    const userDataDoc = updatedUserDataSnap.data();
    localStorage.setItem("userData", JSON.stringify(userDataDoc));
    
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
    
    // Determine role based on email
    const userRole = determineRole(user.email);
    
    const userData = doc(db, "users", user.uid);
    await setDoc(userData, {
      user_id: user.uid,
      fullname: name,
      gender: "",
      avatar: user.photoURL,
      email: user.email,
      account_status: "active",
      auth: "",
      authProvider: "email",
      phone: phone,
      address_shipping: "",
      role: getRoleBoolean(userRole), // Keep backward compatibility
      role_string: userRole, // New field for detailed role
      created_at: new Date().toISOString(),
    });
    
    localStorage.setItem("user_id", user.uid);
    const userDataRef = doc(db, "users", user.uid);
    const userDataSnap = await getDoc(userDataRef);
    const userDataDoc = userDataSnap.data();
    localStorage.setItem("userData", JSON.stringify(userDataDoc));
    
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
  // Clear localStorage
  localStorage.removeItem("user_id");
  localStorage.removeItem("userData");
  localStorage.removeItem("user");
  localStorage.removeItem("isAuthenticated");
  
  signOut(auth);
};

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

// NEW FUNCTIONS for Admin Dashboard Integration

// Get user role from Firestore
const getUserRole = async (uid) => {
  try {
    const userRef = doc(db, 'users', uid);
    const userSnap = await getDoc(userRef);
    
    if (userSnap.exists()) {
      const userData = userSnap.data();
      // Check new role_string field first, fallback to email-based detection
      return userData.role_string || determineRole(userData.email);
    }
    return 'customer';
  } catch (error) {
    console.error('Error getting user role:', error);
    return 'customer';
  }
};

// Update user role
const updateUserRole = async (uid, newRole) => {
  try {
    const userRef = doc(db, 'users', uid);
    await updateDoc(userRef, {
      role_string: newRole,
      role: getRoleBoolean(newRole),
      updated_at: new Date().toISOString()
    });
    console.log('User role updated:', uid, newRole);
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

// Get all users for admin dashboard
const getAllUsers = async () => {
  try {
    const usersCollection = collection(db, 'users');
    const usersSnapshot = await getDocs(usersCollection);
    const usersList = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return usersList;
  } catch (error) {
    console.error('Error getting users:', error);
    throw error;
  }
};

// Get users by role
const getUsersByRole = async (role) => {
  try {
    const usersCollection = collection(db, 'users');
    const q = query(usersCollection, where('role_string', '==', role));
    const usersSnapshot = await getDocs(q);
    const usersList = usersSnapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data()
    }));
    return usersList;
  } catch (error) {
    console.error('Error getting users by role:', error);
    throw error;
  }
};

// Create app user object from Firebase user (for Login component)
const createAppUserObject = async (firebaseUser) => {
  try {
    const userRole = determineRole(firebaseUser.email);
    
    // Get additional data from Firestore if exists
    const userDocRef = doc(db, 'users', firebaseUser.uid);
    const userDocSnap = await getDoc(userDocRef);
    const firestoreData = userDocSnap.exists() ? userDocSnap.data() : {};
    
    const appUser = {
      id: firebaseUser.uid,
      name: firebaseUser.displayName || firestoreData.fullname || firebaseUser.email.split('@')[0],
      email: firebaseUser.email,
      role: userRole,
      avatar: firebaseUser.photoURL || firestoreData.avatar,
      verified: firebaseUser.emailVerified,
      phone: firestoreData.phone || '',
      department: userRole === 'admin' ? 'Administration' : 
                 userRole === 'staff' ? 'Laboratory' :
                 userRole === 'manager' ? 'Management' : null,
      permissions: userRole === 'admin' ? ['all'] : 
                  userRole === 'staff' ? ['tests', 'reports'] :
                  userRole === 'manager' ? ['users', 'reports', 'guides'] :
                  ['profile', 'tests'],
      // Include original Firestore data for backward compatibility
      ...firestoreData
    };
    
    return appUser;
  } catch (error) {
    console.error('Error creating app user object:', error);
    throw error;
  }
};

// Check if user is admin (multiple ways for flexibility)
const isAdmin = (user) => {
  // Check by role_string field
  if (user.role_string === 'admin') return true;
  
  // Check by email
  if (adminEmails.includes(user.email)) return true;
  
  // Check by legacy role field (if it's true and email matches)
  if (user.role === true && adminEmails.includes(user.email)) return true;
  
  return false;
};

// Export everything (keeping all existing exports + new ones)
export {
  auth,
  db,
  storage,
  signInWithGoogle,
  logInWithEmailAndPassword,
  registerWithEmailAndPassword,
  sendPasswordReset,
  logout,
  getMessages,
  sendMessage,
  // New exports for admin functionality
  getUserRole,
  updateUserRole,
  getAllUsers,
  getUsersByRole,
  createAppUserObject,
  isAdmin,
  determineRole,
  adminEmails,
  staffEmails,
  managerEmails
};