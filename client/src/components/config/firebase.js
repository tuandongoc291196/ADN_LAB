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

// Admin email detection lists (kept for display purposes only)
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

// Helper function to determine role based on email (removed)
// Role is now determined from database userData.role_string field

// Helper function to convert role to boolean (removed)
// Not needed anymore since roles come from database

// EXISTING FUNCTIONS (Unchanged for backward compatibility)

const signInWithGoogle = async () => {
  try {
    const res = await signInWithPopup(auth, googleProvider);
    const user = res.user;
    const q = query(collection(db, "users"), where("user_id", "==", user.uid));
    const docs = await getDocs(q);
    
    if (docs.docs.length === 0) {
      // Create new user with default customer role
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
        role: false, // Default customer role
        role_string: "customer",
        created_at: new Date().toISOString(),
      });
    } else {
      // Update existing user login time
      const userDocRef = doc(db, "users", user.uid);
      await updateDoc(userDocRef, {
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
    
    // Update last login time only
    const userDocRef = doc(db, "users", user.uid);
    const userDocSnap = await getDoc(userDocRef);
    
    if (userDocSnap.exists()) {
      await updateDoc(userDocRef, {
        last_login: new Date().toISOString(),
      });
    }

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
    
    // Default role for new registrations is customer
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
      role: false, // Customer role
      role_string: "customer", 
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
  localStorage.removeItem("user_id");
  localStorage.removeItem("userData");
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

// Check if user is admin (based on userData from DB)
const isAdmin = (userData) => {
  return userData.role_string === 'admin';
};

// Export everything
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
  isAdmin,
  adminEmails,
  staffEmails,
  managerEmails
};