/**
 * ProtectedRoute Component
 * Kiểm tra trạng thái tài khoản người dùng trước khi cho phép truy cập
 */
import React, { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuthState } from 'react-firebase-hooks/auth';
import { auth, dataConnect } from '../config/firebase';
import { getUser } from '../../lib/dataconnect';
import { signOut } from 'firebase/auth';
import LoadingSpinner from './LoadingSpinner';

const ProtectedRoute = ({ children, allowedRoles = [] }) => {
  const [user, loading] = useAuthState(auth);
  const [accountStatus, setAccountStatus] = useState(null);
  const [userRole, setUserRole] = useState(null);
  const [checking, setChecking] = useState(true);

  useEffect(() => {
    const checkUserStatus = async () => {
      if (!user) {
        setChecking(false);
        return;
      }

      try {
        console.log('🔒 ProtectedRoute: Checking account status for', user.email);
        const { data: userData } = await getUser(dataConnect, { userId: user.uid });
        
        if (userData?.user) {
          setAccountStatus(userData.user.accountStatus);
          setUserRole(userData.user.role?.name);
          
          // Nếu tài khoản bị vô hiệu hóa
          if (userData.user.accountStatus === 'inactive') {
            console.log('🚫 ProtectedRoute: Account is inactive, logging out');
            await signOut(auth);
            return;
          }
          
          console.log('✅ ProtectedRoute: Account status check passed');
        }
      } catch (error) {
        console.error('❌ ProtectedRoute: Error checking user status:', error);
      } finally {
        setChecking(false);
      }
    };

    checkUserStatus();
  }, [user]);

  // Đang kiểm tra authentication
  if (loading || checking) {
    return <LoadingSpinner />;
  }

  // Chưa đăng nhập
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // Tài khoản bị vô hiệu hóa
  if (accountStatus === 'inactive') {
    return <Navigate to="/login" replace />;
  }

  // Kiểm tra quyền truy cập theo role
  if (allowedRoles.length > 0 && !allowedRoles.includes(userRole)) {
    // Chuyển hướng về dashboard phù hợp với role
    const redirectPath = userRole === 'admin' ? '/admin' : 
                        userRole === 'staff' ? '/staff' : 
                        userRole === 'manager' ? '/manager' : '/user';
    return <Navigate to={redirectPath} replace />;
  }

  return children;
};

export default ProtectedRoute; 