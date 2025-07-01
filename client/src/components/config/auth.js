/**
 * File cấu hình và quản lý xác thực người dùng
 * Cung cấp context và các hàm xử lý đăng nhập/đăng xuất
 */
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { signInWithGoogle, auth as firebaseAuth, dataConnect } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getUser } from "../../lib/dataconnect";

// Tạo context để quản lý trạng thái đăng nhập xuyên suốt ứng dụng
const AuthContext = React.createContext();

const auth = getAuth();

/**
 * Provider component cung cấp dữ liệu xác thực cho toàn bộ ứng dụng
 * Quản lý trạng thái đăng nhập và thông tin người dùng
 */
const AuthProvider = (props) => {
  // Sử dụng hook của react-firebase-hooks để theo dõi trạng thái đăng nhập
  const [user] = useAuthState(auth);
  // State lưu thông tin người dùng đã được làm giàu với dữ liệu từ database
  const [authUser, setAuthUser] = useState(null);

  /**
   * Lấy thông tin người dùng từ Data Connect dựa vào UID
   * @param {string} uid - ID người dùng từ Firebase Auth
   * @returns {Object|null} - Thông tin người dùng hoặc null nếu không tìm thấy
   */
  const fetchUserData = async (uid) => {
    try {
      // Lưu ID người dùng vào localStorage để sử dụng cho các truy vấn Data Connect
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

  // Effect chạy khi trạng thái đăng nhập thay đổi
  useEffect(() => {
    if (user) {
      console.log(user.uid); // user ID
      console.log(user.email); // user email
      console.log(user.displayName); // user display name
      console.log(user.photoURL); // user photo URL
      
      // Lấy thông tin người dùng từ Data Connect
      fetchUserData(user.uid).then((userData) => {
        if (userData) {
          // Kết hợp thông tin từ Firebase Auth và Data Connect
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
          // Lưu thông tin người dùng vào localStorage
          localStorage.setItem("userData", JSON.stringify(userWithRole));
          setAuthUser(userWithRole);
        }
      });
    } else {
      // Xóa thông tin người dùng khi đăng xuất
      localStorage.removeItem("userData");
      localStorage.removeItem("user_id");
      setAuthUser(null);
    }
  }, [user]);

  /**
   * Hàm xử lý đăng nhập bằng Google
   * Tạo hoặc cập nhật thông tin người dùng trong Data Connect
   */
  const login = async () => {
    try {
      const result = await signInWithGoogle();
      localStorage.setItem("userChat", JSON.stringify(result));
      
      // Hàm signInWithGoogle từ firebase.js đã xử lý việc tạo người dùng và lưu vào localStorage
      // Chỉ cần lấy thông tin người dùng đã cập nhật
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

  /**
   * Hàm xử lý đăng xuất
   * Xóa thông tin người dùng khỏi localStorage và state
   */
  const logout = () => {
    auth.signOut();
    localStorage.removeItem("userData");
    localStorage.removeItem("user_id");
    localStorage.removeItem("userChat");
    setAuthUser(null);
  };

  // Giá trị được cung cấp cho context
  const value = { user: authUser, login, logout };

  return <AuthContext.Provider value={value} {...props} />;
};

/**
 * Hook tùy chỉnh để sử dụng AuthContext
 * Giúp các component dễ dàng truy cập vào thông tin xác thực
 * @throws {Error} Nếu được sử dụng bên ngoài AuthProvider
 */
const useAuth = () => {
  const context = React.useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export { AuthContext, AuthProvider, useAuth };