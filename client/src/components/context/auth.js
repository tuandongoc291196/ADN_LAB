import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { signInWithGoogle, auth as firebaseAuth, dataConnect, setUserOnlineStatus } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getUser } from "../../lib/dataconnect";

const AuthContext = React.createContext();

const auth = getAuth();

const AuthProvider = (props) => {
  const [user] = useAuthState(auth);
  const [authUser, setAuthUser] = useState(null);

  const fetchUserData = async (uid) => {
    try {
      localStorage.setItem("user_id", uid);      
      const { data: userData } = await getUser(dataConnect, { userId: uid });
      
      if (userData?.user) {
        return userData.user;
      } else {
        console.log("No user data found in Data Connect!");
        return null;
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      return null;
    }
  };

  useEffect(() => {
    if (user) {      
      fetchUserData(user.uid).then((userData) => {
        if (userData) {
          const userWithRole = {
            user_id: user.uid,
            id: userData.id || user.uid,
            email: user.email || userData.email,
            fullname: userData.fullname || user.displayName,
            displayName: userData.displayName || user.displayName || userData.fullname,
            avatar: userData.avatar || user.photoURL,
            photoURL: userData.photoURL || user.photoURL || userData.avatar,
            phone: userData.phone || "",
            roleId: userData.roleId,
            role: userData.role,
            roleString: userData.role_string || userData.roleString,
            role_string: userData.role_string || userData.roleString,
            accountStatus: userData.accountStatus,
            shippingAddress: userData.shippingAddress || "",
            authProvider: userData.authProvider,
            createdAt: userData.createdAt,
            lastLogin: userData.lastLogin,
            maxDailySlots: userData.maxDailySlots,
            dailySlotCount: userData.dailySlotCount,
            gender: userData.gender || ""
          };
          localStorage.setItem("userData", JSON.stringify(userWithRole));
          setAuthUser(userWithRole);
          
          // Set user as online when logged in
          setUserOnlineStatus(user.uid, true);
        }
      });
    } else {
      // Set user as offline when logged out
      if (authUser?.user_id) {
        setUserOnlineStatus(authUser.user_id, false);
      }
      localStorage.removeItem("userData");
      localStorage.removeItem("user_id");
      setAuthUser(null);
    }
  }, [user]);

  const login = async () => {
    try {
      const result = await signInWithGoogle();
      localStorage.setItem("userChat", JSON.stringify(result));
      
      if (result.uid) {
        const userData = await fetchUserData(result.uid);
        if (userData) {
          const userWithRole = {
            user_id: result.uid,
            id: userData.id || result.uid,
            email: userData.email || result.email,
            fullname: userData.fullname || result.displayName,
            displayName: userData.displayName || result.displayName || userData.fullname,
            avatar: userData.avatar || result.photoURL,
            photoURL: userData.photoURL || result.photoURL || userData.avatar,
            phone: userData.phone || "",
            roleId: userData.roleId,
            role: userData.role,
            roleString: userData.role_string || userData.roleString,
            role_string: userData.role_string || userData.roleString,
            accountStatus: userData.accountStatus,
            shippingAddress: userData.shippingAddress || "",
            authProvider: userData.authProvider,
            createdAt: userData.createdAt,
            lastLogin: userData.lastLogin,
            maxDailySlots: userData.maxDailySlots,
            dailySlotCount: userData.dailySlotCount,
            gender: userData.gender || ""
          };
          localStorage.setItem("userData", JSON.stringify(userWithRole));
          setAuthUser(userWithRole);
          
          // Set user as online after successful login
          setUserOnlineStatus(result.user.uid, true);
        }
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    // Set user as offline before logout
    if (authUser?.user_id) {
      setUserOnlineStatus(authUser.user_id, false);
    }
    
    auth.signOut();
    localStorage.removeItem("userData");
    localStorage.removeItem("user_id");
    localStorage.removeItem("userChat");
    setAuthUser(null);
  };

  // Helper methods for role checking
  const isAdmin = () => {
    return authUser?.roleString === 'admin' || authUser?.role_string === 'admin';
  };

  const isStaff = () => {
    return ['admin', 'staff', 'manager'].includes(authUser?.roleString) || 
           ['admin', 'staff', 'manager'].includes(authUser?.role_string);
  };

  const isManager = () => {
    return authUser?.roleString === 'manager' || authUser?.role_string === 'manager';
  };

  const isUser = () => {
    return authUser?.roleString === 'user' || authUser?.role_string === 'user' || !authUser?.roleString;
  };

  // Helper to refresh user data
  const refreshUserData = async () => {
    if (user?.uid) {
      const userData = await fetchUserData(user.uid);
      if (userData) {
        const userWithRole = {
          user_id: user.uid,
          id: userData.id || user.uid,
          email: user.email || userData.email,
          fullname: userData.fullname || user.displayName,
          displayName: userData.displayName || user.displayName || userData.fullname,
          avatar: userData.avatar || user.photoURL,
          photoURL: userData.photoURL || user.photoURL || userData.avatar,
          phone: userData.phone || "",
          roleId: userData.roleId,
          role: userData.role,
          roleString: userData.role_string || userData.roleString,
          role_string: userData.role_string || userData.roleString,
          accountStatus: userData.accountStatus,
          shippingAddress: userData.shippingAddress || "",
          authProvider: userData.authProvider,
          createdAt: userData.createdAt,
          lastLogin: userData.lastLogin,
          maxDailySlots: userData.maxDailySlots,
          dailySlotCount: userData.dailySlotCount,
          gender: userData.gender || ""
        };
        localStorage.setItem("userData", JSON.stringify(userWithRole));
        setAuthUser(userWithRole);
        return userWithRole;
      }
    }
    return null;
  };

  const value = { 
    user: authUser, 
    login, 
    logout,
    isAdmin,
    isStaff,
    isManager,
    isUser,
    refreshUserData,
    loading: !user && !authUser // Loading state when Firebase auth is still initializing
  };

  return <AuthContext.Provider value={value} {...props} />;
};

// Custom hook to use the auth context
const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };
