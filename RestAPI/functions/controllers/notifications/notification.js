const { dataConnect } = require("../../config/firebase.js");
const { v4: uuidv4 } = require('uuid');

// ================== UTILITY FUNCTIONS ==================

const checkNotificationExists = async (notificationId) => {
  try {
    const CHECK_NOTIFICATION_EXISTS_QUERY = `
      query GetNotificationById($notificationId: String!) @auth(level: USER) {
        notification(key: { id: $notificationId }) {
          id
          userId
          staffId
          title
          message
          isRead
          type
          createdAt
        }
      }
    `;

    const variables = { notificationId };
    
    const response = await dataConnect.executeGraphql(CHECK_NOTIFICATION_EXISTS_QUERY, { 
      variables 
    });
    
    return response.data.notification ? true : false;
  } catch (error) {
    console.error("Error checking notification existence:", error);
    throw error;
  }
};

const checkUserExists = async (userId) => {
  try {
    const CHECK_USER_EXISTS_QUERY = `
      query GetUserById($userId: String!) @auth(level: USER) {
        user(key: { id: $userId }) {
          id
        }
      }
    `;

    const variables = { userId };
    const response = await dataConnect.executeGraphql(CHECK_USER_EXISTS_QUERY, { 
      variables 
    });
    
    return response.data.user ? true : false;
  } catch (error) {
    console.error("Error checking user existence:", error);
    throw error;
  }
};

const checkStaffExists = async (staffId) => {
  try {
    const CHECK_STAFF_EXISTS_QUERY = `
      query GetStaffById($staffId: String!) @auth(level: USER) {
        staff(key: { id: $staffId }) {
          id
        }
      }
    `;

    const variables = { staffId };
    const response = await dataConnect.executeGraphql(CHECK_STAFF_EXISTS_QUERY, { 
      variables 
    });
    
    return response.data.staff ? true : false;
  } catch (error) {
    console.error("Error checking staff existence:", error);
    throw error;
  }
};

const validateNotificationData = (notificationData) => {
  const { title, message, type } = notificationData;
  
  if (!title || typeof title !== 'string' || title.trim().length === 0) {
    return { isValid: false, message: "Title is required and must be a non-empty string" };
  }
  
  if (!message || typeof message !== 'string' || message.trim().length === 0) {
    return { isValid: false, message: "Message is required and must be a non-empty string" };
  }
  
  const validTypes = ['general', 'booking', 'appointment', 'result', 'system'];
  if (type && !validTypes.includes(type)) {
    return { isValid: false, message: `Type must be one of: ${validTypes.join(', ')}` };
  }
  
  return { isValid: true };
};

const getNotificationsByUserId = async (userId) => {
  try {
    const GET_USER_NOTIFICATIONS_QUERY = `
      query GetUserNotifications($userId: String!) @auth(level: USER) {
        notifications(where: { userId: { eq: $userId } }, orderBy: { createdAt: DESC }) {
          id
          userId
          staffId
          title
          message
          isRead
          type
          createdAt
          user {
            fullname
            email
          }
        }
      }
    `;

    const variables = { userId };
    
    const response = await dataConnect.executeGraphql(GET_USER_NOTIFICATIONS_QUERY, { 
      variables 
    });
    
    return response.data.notifications || [];
  } catch (error) {
    console.error("Error getting notifications by user ID:", error);
    throw error;
  }
};

const getNotificationsByStaffId = async (staffId) => {
  try {
    const GET_STAFF_NOTIFICATIONS_QUERY = `
      query GetStaffNotifications($staffId: String!) @auth(level: USER) {
        notifications(where: { staffId: { eq: $staffId } }, orderBy: { createdAt: DESC }) {
          id
          userId
          staffId
          title
          message
          isRead
          type
          createdAt
          staff {
            user {
              fullname
              email
            }
            position {
              name
            }
          }
        }
      }
    `;

    const variables = { staffId };
    
    const response = await dataConnect.executeGraphql(GET_STAFF_NOTIFICATIONS_QUERY, { 
      variables 
    });
    
    return response.data.notifications || [];
  } catch (error) {
    console.error("Error getting notifications by staff ID:", error);
    throw error;
  }
};

// ================== API ENDPOINTS ==================

const addNotification = async (req, res) => {
  try {
    const {
      userId,
      staffId,
      title,
      message,
      type = "general"
    } = req.body;

    // Validate required fields
    const validation = validateNotificationData({ title, message, type });
    if (!validation.isValid) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: validation.message,
      });
    }

    // Must have either userId or staffId
    if (!userId && !staffId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "Either userId or staffId is required",
      });
    }

    // Check if user or staff exists
    if (userId && !(await checkUserExists(userId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "User not found",
      });
    }

    if (staffId && !(await checkStaffExists(staffId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Staff not found",
      });
    }

    const notificationId = uuidv4();

    const CREATE_NOTIFICATION_MUTATION = `
      mutation CreateNotification($id: String!, $userId: String, $staffId: String, $title: String!, $message: String!, $type: String!) @auth(level: USER) {
        notification_insert(data: {
          id: $id,
          userId: $userId,
          staffId: $staffId,
          title: $title,
          message: $message,
          type: $type
        })
      }
    `;

    const variables = {
      id: notificationId,
      userId: userId || null,
      staffId: staffId || null,
      title,
      message,
      type
    };

    const response = await dataConnect.executeGraphql(CREATE_NOTIFICATION_MUTATION, {
      variables,
    });

    return res.status(201).json({
      statusCode: 201,
      status: "success",
      message: "Notification created successfully",
      data: {
        notificationId,
        ...variables
      },
    });

  } catch (error) {
    console.error("Error creating notification:", error);
    
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to create notification",
      error: error.message,
    });
  }
};

const getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.body;

    if (!userId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "userId is required",
      });
    }

    const notifications = await getNotificationsByUserId(userId);

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "User notifications retrieved successfully",
      data: notifications,
      count: notifications.length,
    });

  } catch (error) {
    console.error("Error getting user notifications:", error);
    
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to get user notifications",
      error: error.message,
    });
  }
};

const getNotificationsByStaff = async (req, res) => {
  try {
    const { staffId } = req.body;

    if (!staffId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "staffId is required",
      });
    }

    const notifications = await getNotificationsByStaffId(staffId);

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Staff notifications retrieved successfully",
      data: notifications,
      count: notifications.length,
    });

  } catch (error) {
    console.error("Error getting staff notifications:", error);
    
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to get staff notifications",
      error: error.message,
    });
  }
};

const getOneNotification = async (req, res) => {
  try {
    const { notificationId } = req.body;

    if (!notificationId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "notificationId is required",
      });
    }

    const GET_NOTIFICATION_QUERY = `
      query GetNotification($notificationId: String!) @auth(level: USER) {
        notification(key: { id: $notificationId }) {
          id
          userId
          staffId
          title
          message
          isRead
          type
          createdAt
          user {
            fullname
            email
          }
          staff {
            user {
              fullname
              email
            }
            position {
              name
            }
          }
        }
      }
    `;

    const variables = { notificationId };

    const response = await dataConnect.executeGraphql(GET_NOTIFICATION_QUERY, {
      variables,
    });

    const notification = response.data.notification;

    if (!notification) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Notification not found",
      });
    }

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Notification retrieved successfully",
      data: notification,
    });

  } catch (error) {
    console.error("Error getting notification:", error);
    
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to get notification",
      error: error.message,
    });
  }
};

const markNotificationAsRead = async (req, res) => {
  try {
    const { notificationId } = req.body;

    if (!notificationId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "notificationId is required",
      });
    }

    if (!(await checkNotificationExists(notificationId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Notification not found",
      });
    }

    const MARK_READ_MUTATION = `
      mutation MarkNotificationAsRead($notificationId: String!) @auth(level: USER) {
        notification_update(key: { id: $notificationId }, data: { isRead: true })
      }
    `;

    const variables = { notificationId };

    const response = await dataConnect.executeGraphql(MARK_READ_MUTATION, {
      variables,
    });

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Notification marked as read",
      data: {
        notificationId,
        isRead: true
      },
    });

  } catch (error) {
    console.error("Error marking notification as read:", error);
    
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to mark notification as read",
      error: error.message,
    });
  }
};

const getAllNotifications = async (req, res) => {
  try {
    const GET_ALL_NOTIFICATIONS_QUERY = `
      query GetAllNotifications @auth(level: USER) {
        notifications(orderBy: { createdAt: DESC }) {
          id
          userId
          staffId
          title
          message
          isRead
          type
          createdAt
          user {
            fullname
            email
          }
          staff {
            user {
              fullname
              email
            }
            position {
              name
            }
          }
        }
      }
    `;

    const response = await dataConnect.executeGraphql(GET_ALL_NOTIFICATIONS_QUERY);
    const notifications = response.data.notifications || [];

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "All notifications retrieved successfully",
      data: notifications,
      count: notifications.length,
    });

  } catch (error) {
    console.error("Error getting all notifications:", error);
    
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to get all notifications",
      error: error.message,
    });
  }
};

const deleteNotification = async (req, res) => {
  try {
    const { notificationId } = req.body;

    if (!notificationId) {
      return res.status(400).json({
        statusCode: 400,
        status: "error",
        message: "notificationId is required",
      });
    }

    if (!(await checkNotificationExists(notificationId))) {
      return res.status(404).json({
        statusCode: 404,
        status: "error",
        message: "Notification not found",
      });
    }

    const DELETE_NOTIFICATION_MUTATION = `
      mutation DeleteNotification($notificationId: String!) @auth(level: USER) {
        notification_delete(key: { id: $notificationId })
      }
    `;

    const variables = { notificationId };

    const response = await dataConnect.executeGraphql(DELETE_NOTIFICATION_MUTATION, {
      variables,
    });

    return res.status(200).json({
      statusCode: 200,
      status: "success",
      message: "Notification deleted successfully",
      data: {
        notificationId,
        deletedAt: new Date().toISOString()
      },
    });

  } catch (error) {
    console.error("Error deleting notification:", error);
    
    res.status(500).json({
      statusCode: 500,
      status: "error",
      message: "Failed to delete notification",
      error: error.message,
    });
  }
};

module.exports = {
  // Utility functions
  checkNotificationExists,
  validateNotificationData,
  getNotificationsByUserId,
  getNotificationsByStaffId,
  checkUserExists,
  checkStaffExists,
  
  // API endpoints
  addNotification,
  getNotificationsByUser,
  getNotificationsByStaff,
  getOneNotification,
  markNotificationAsRead,
  getAllNotifications,
  deleteNotification,
}; 