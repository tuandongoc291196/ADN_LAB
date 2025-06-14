import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { signInWithGoogle, auth as firebaseAuth, dataConnect } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getUser } from "../../lib/dataconnect";

const AuthContext = React.createContext();

const auth = getAuth();

const AuthProvider = (props) => {
  const [user] = useAuthState(auth);
  const [authUser, setAuthUser] = useState(null);

  const fetchUserData = async (uid) => {
    try {
      // Set the user ID in localStorage for Data Connect queries
      localStorage.setItem("user_id", uid);
      
      const { data: userData } = await getUser(dataConnect);
      
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
      console.log(user.uid); // user ID
      console.log(user.email); // user email
      console.log(user.displayName); // user display name
      console.log(user.photoURL); // user photo URL
      
      fetchUserData(user.uid).then((userData) => {
        if (userData) {
          const userWithRole = {
            user_id: user.uid,
            email: user.email,
            fullname: user.displayName || userData.fullname,
            avatar: user.photoURL || userData.avatar,
            phone: userData.phone,
            roleId: userData.roleId,
            roleString: userData.roleString,
            accountStatus: userData.accountStatus,
            shippingAddress: userData.shippingAddress,
          };
          localStorage.setItem("userData", JSON.stringify(userWithRole));
          setAuthUser(userWithRole);
        }
      });
    } else {
      localStorage.removeItem("userData");
      localStorage.removeItem("user_id");
      setAuthUser(null);
    }
  }, [user]);

    const login = async () => {
    try {
      const result = await signInWithGoogle();
      localStorage.setItem("userChat", JSON.stringify(result));
      
      // The signInWithGoogle function from firebase.js already handles user creation and localStorage
      // We just need to fetch the updated user data
      if (result.uid) {
        const userData = await fetchUserData(result.uid);
        if (userData) {
          const userWithRole = {
            user_id: result.uid,
            email: userData.email,
            fullname: result.displayName || userData.fullname,
            avatar: userData.avatar,
            phone: userData.phone,
            roleId: userData.roleId,
            roleString: userData.roleString,
            accountStatus: userData.accountStatus,
            shippingAddress: userData.shippingAddress,
          };
          localStorage.setItem("userData", JSON.stringify(userWithRole));
          setAuthUser(userWithRole);
        }
      }
    } catch (error) {
      console.error("Login failed", error);
    }
  };

  const logout = () => {
    auth.signOut();
    localStorage.removeItem("userData");
    localStorage.removeItem("user_id");
    localStorage.removeItem("userChat");
    setAuthUser(null);
  };

  const value = { user: authUser, login, logout };

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