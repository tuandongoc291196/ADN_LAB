const { onDocumentWritten } = require('firebase-functions/v2/firestore');
const { admin } = require('../config/firebase');

const onUserChange = onDocumentWritten('users/{userId}', async (event) => {
  const userId = event.params.userId;
  const before = event.data.before?.exists ? event.data.before.data() : null;
  const after = event.data.after?.exists ? event.data.after.data() : null;
  
  try {
    const db = admin.firestore();
    
    if (!before && after) {
      // User created
      const userName = after.fullname || after.email || 'Unknown User';
      const userRole = after.role_string || 'customer';
      const authProvider = after.authProvider || 'email';
      
      console.log(`🆕 User Created:`, {
        userId: userId,
        name: userName,
        email: after.email,
        role: userRole,
        authProvider: authProvider,
        accountStatus: after.account_status,
        createdAt: after.created_at
      });
      
      // Add real-time notification (no DB storage)
      const notification = {
        id: `notification_${Date.now()}`,
        type: 'success',
        title: 'Người dùng mới',
        message: `${userName} đã tham gia hệ thống qua ${authProvider}`,
        timestamp: new Date().toISOString(),
        targetAudience: 'all',
        relatedUserId: userId,
        action: 'view_users',
        metadata: {
          userRole: userRole,
          authProvider: authProvider
        }
      };
      
    } else if (before && after) {
      // User updated
      const userName = after.fullname || after.email || 'Unknown User';
      const changes = [];
      
      // Check what changed
      if (before.fullname !== after.fullname) {
        changes.push(`Name: ${before.fullname} → ${after.fullname}`);
      }
      if (before.email !== after.email) {
        changes.push(`Email: ${before.email} → ${after.email}`);
      }
      if (before.role_string !== after.role_string) {
        changes.push(`Role: ${before.role_string} → ${after.role_string}`);
      }
      if (before.account_status !== after.account_status) {
        changes.push(`Status: ${before.account_status} → ${after.account_status}`);
      }
      if (before.phone !== after.phone) {
        changes.push(`Phone: ${before.phone || 'empty'} → ${after.phone || 'empty'}`);
      }
      if (before.address_shipping !== after.address_shipping) {
        changes.push(`Address updated`);
      }
      
      console.log(`📝 User Updated:`, {
        userId: userId,
        name: userName,
        email: after.email,
        changes: changes.length > 0 ? changes : ['Profile data updated'],
        lastLogin: after.last_login
      });
      
      // Broadcast real-time notification for important updates
      if (changes.length > 0) {
        const changeText = changes.join(', ');
        const notification = {
          id: `notification_${Date.now()}`,
          type: 'info',
          title: 'Cập nhật người dùng',
          message: `${userName} đã cập nhật: ${changeText}`,
          timestamp: new Date().toISOString(),
          targetAudience: 'admin',
          relatedUserId: userId,
          action: 'view_users',
          metadata: {
            changes: changes
          }
        };
        
        console.log('📢 Broadcasting notification:', notification);
      }
      
    } else if (before && !after) {
      // User deleted
      const userName = before.fullname || before.email || 'Unknown User';
      
      console.log(`🗑️ User Deleted:`, {
        userId: userId,
        name: userName,
        email: before.email,
        role: before.role_string,
        wasActive: before.account_status === 'active'
      });
      
      // Broadcast real-time notification for user deletion
      const notification = {
        id: `notification_${Date.now()}`,
        type: 'warning',
        title: 'Người dùng bị xóa',
        message: `${userName} đã bị xóa khỏi hệ thống`,
        timestamp: new Date().toISOString(),
        targetAudience: 'admin',
        relatedUserId: userId,
        action: 'view_users',
        metadata: {
          deletedUserRole: before.role_string,
          wasActive: before.account_status === 'active'
        }
      };
      
      console.log('📢 Broadcasting notification:', notification);
    }
    
  } catch (error) {
    console.error('❌ Error in user trigger:', error);
  }
});

module.exports = { onUserChange };
