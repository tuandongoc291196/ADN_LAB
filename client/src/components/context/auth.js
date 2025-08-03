/**
 * Context xác thực người dùng cho toàn bộ ứng dụng
 * Quản lý trạng thái đăng nhập, đăng xuất và vai trò người dùng
 */
import React, { useEffect, useState } from "react";
import { getAuth } from "firebase/auth";
import { signInWithGoogle, auth as firebaseAuth, dataConnect, setUserOnlineStatus } from "../config/firebase";
import { useAuthState } from "react-firebase-hooks/auth";
import { getUser } from "../../lib/dataconnect";

// Tạo context để quản lý trạng thái xác thực
const AuthContext = React.createContext();

const auth = getAuth();

/**
 * Provider component cung cấp dữ liệu xác thực cho toàn bộ ứng dụng
 * Quản lý trạng thái đăng nhập và thông tin người dùng
 */
const AuthProvider = (props) => {
  // Sử dụng hook của react-firebase-hooks để theo dõi trạng thái đăng nhập
  const [user, loading, error] = useAuthState(auth);
  // State lưu thông tin người dùng đã được làm giàu với dữ liệu từ database
  const [authUser, setAuthUser] = useState(null);
  const [userDataLoading, setUserDataLoading] = useState(false);

  /**
   * Lấy thông tin người dùng từ Data Connect dựa vào UID
   * @param {string} uid - ID người dùng từ Firebase Auth
   * @returns {Object|null} - Thông tin người dùng hoặc null nếu không tìm thấy
   */
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

  // Effect chạy khi trạng thái đăng nhập thay đổi
  useEffect(() => {
    if (user) {
      setUserDataLoading(true);      
      // Lấy thông tin người dùng từ Data Connect
      fetchUserData(user.uid).then((userData) => {
        if (userData) {
          // ⚠️ KIỂM TRA TRẠNG THÁI TÀI KHOẢN
          if (userData.accountStatus === 'inactive') {
            console.log('🚫 Account is inactive in context:', userData.email);
            // Đăng xuất ngay lập tức
            logout();
            setUserDataLoading(false);
            return;
          }
          
          // Kết hợp thông tin từ Firebase Auth và Data Connect
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
          
          // Đặt trạng thái người dùng là online khi đăng nhập
          setUserOnlineStatus(user.uid, true);
        }
        setUserDataLoading(false);
      }).catch(() => {
        setUserDataLoading(false);
      });
    } else {
      // Đặt trạng thái người dùng là offline khi đăng xuất
      if (authUser?.user_id) {
        setUserOnlineStatus(authUser.user_id, false);
      }
      localStorage.removeItem("userData");
      localStorage.removeItem("user_id");
      setAuthUser(null);
      setUserDataLoading(false);
    }
  }, [user]);

  // Effect để kiểm tra trạng thái tài khoản định kỳ
  useEffect(() => {
    if (!user) return;
    
    const checkAccountStatus = async () => {
      try {
        const userData = await fetchUserData(user.uid);
        if (userData && userData.accountStatus === 'inactive') {
          console.log('🚫 Account became inactive during session, logging out...');
          logout();
        }
      } catch (error) {
        console.error('Error checking account status:', error);
      }
    };
    
    // Kiểm tra mỗi 30 giây
    const interval = setInterval(checkAccountStatus, 30000);
    
    return () => clearInterval(interval);
  }, [user]);

  /**
   * Hàm xử lý đăng nhập bằng Google
   * Tạo hoặc cập nhật thông tin người dùng trong Data Connect
   */
  const login = async () => {
    try {
      const result = await signInWithGoogle();
      localStorage.setItem("userChat", JSON.stringify(result));
      
      if (result.uid) {
        const userData = await fetchUserData(result.uid);
        if (userData) {
          // Kết hợp thông tin từ Firebase Auth và Data Connect
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
          
          // Đặt trạng thái người dùng là online sau khi đăng nhập thành công
          setUserOnlineStatus(result.user.uid, true);
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
    // Đặt trạng thái người dùng là offline trước khi đăng xuất
    if (authUser?.user_id) {
      setUserOnlineStatus(authUser.user_id, false);
    }
    
    auth.signOut();
    localStorage.removeItem("userData");
    localStorage.removeItem("user_id");
    localStorage.removeItem("userChat");
    setAuthUser(null);
  };

  /**
   * Kiểm tra người dùng có quyền admin không
   * @returns {boolean} true nếu người dùng có quyền admin
   */
  const isAdmin = () => {
    return authUser?.roleString === 'admin' || authUser?.role_string === 'admin';
  };

  /**
   * Kiểm tra người dùng có quyền nhân viên không (bao gồm admin, staff, manager)
   * @returns {boolean} true nếu người dùng có quyền nhân viên
   */
  const isStaff = () => {
    return ['admin', 'staff', 'manager'].includes(authUser?.roleString) || 
           ['admin', 'staff', 'manager'].includes(authUser?.role_string);
  };

  /**
   * Kiểm tra người dùng có quyền quản lý không
   * @returns {boolean} true nếu người dùng có quyền quản lý
   */
  const isManager = () => {
    return authUser?.roleString === 'manager' || authUser?.role_string === 'manager';
  };

  /**
   * Kiểm tra người dùng có quyền người dùng thông thường không
   * @returns {boolean} true nếu người dùng có quyền người dùng thông thường
   */
  const isUser = () => {
    return authUser?.roleString === 'user' || authUser?.role_string === 'user' || !authUser?.roleString;
  };

  /**
   * Cập nhật lại thông tin người dùng từ server
   * @returns {Object|null} Thông tin người dùng đã cập nhật hoặc null
   */
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

  // Giá trị được cung cấp cho context
  const value = { 
    user: authUser, 
    login, 
    logout,
    isAdmin,
    isStaff,
    isManager,
    isUser,
    refreshUserData,
    loading: loading || userDataLoading
  };

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
