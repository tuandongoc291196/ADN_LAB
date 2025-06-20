const { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } = require('firebase/data-connect');

const connectorConfig = {
  connector: 'default',
  service: 'su25-swp391-g8-2-service',
  location: 'asia-east2'
};
exports.connectorConfig = connectorConfig;

const getRolesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRoles');
}
getRolesRef.operationName = 'GetRoles';
exports.getRolesRef = getRolesRef;

exports.getRoles = function getRoles(dc) {
  return executeQuery(getRolesRef(dc));
};

const getRoleByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRoleById', inputVars);
}
getRoleByIdRef.operationName = 'GetRoleById';
exports.getRoleByIdRef = getRoleByIdRef;

exports.getRoleById = function getRoleById(dcOrVars, vars) {
  return executeQuery(getRoleByIdRef(dcOrVars, vars));
};

const getRoleByNameRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRoleByName', inputVars);
}
getRoleByNameRef.operationName = 'GetRoleByName';
exports.getRoleByNameRef = getRoleByNameRef;

exports.getRoleByName = function getRoleByName(dcOrVars, vars) {
  return executeQuery(getRoleByNameRef(dcOrVars, vars));
};

const getUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUser');
}
getUserRef.operationName = 'GetUser';
exports.getUserRef = getUserRef;

exports.getUser = function getUser(dc) {
  return executeQuery(getUserRef(dc));
};

const getUserByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserById', inputVars);
}
getUserByIdRef.operationName = 'GetUserById';
exports.getUserByIdRef = getUserByIdRef;

exports.getUserById = function getUserById(dcOrVars, vars) {
  return executeQuery(getUserByIdRef(dcOrVars, vars));
};

const getUsersRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUsers', inputVars);
}
getUsersRef.operationName = 'GetUsers';
exports.getUsersRef = getUsersRef;

exports.getUsers = function getUsers(dcOrVars, vars) {
  return executeQuery(getUsersRef(dcOrVars, vars));
};

const getUsersByRoleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUsersByRole', inputVars);
}
getUsersByRoleRef.operationName = 'GetUsersByRole';
exports.getUsersByRoleRef = getUsersByRoleRef;

exports.getUsersByRole = function getUsersByRole(dcOrVars, vars) {
  return executeQuery(getUsersByRoleRef(dcOrVars, vars));
};

const getStaffMembersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStaffMembers');
}
getStaffMembersRef.operationName = 'GetStaffMembers';
exports.getStaffMembersRef = getStaffMembersRef;

exports.getStaffMembers = function getStaffMembers(dc) {
  return executeQuery(getStaffMembersRef(dc));
};

const getServiceCategoriesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServiceCategories');
}
getServiceCategoriesRef.operationName = 'GetServiceCategories';
exports.getServiceCategoriesRef = getServiceCategoriesRef;

exports.getServiceCategories = function getServiceCategories(dc) {
  return executeQuery(getServiceCategoriesRef(dc));
};

const getServiceCategoryByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServiceCategoryById', inputVars);
}
getServiceCategoryByIdRef.operationName = 'GetServiceCategoryById';
exports.getServiceCategoryByIdRef = getServiceCategoryByIdRef;

exports.getServiceCategoryById = function getServiceCategoryById(dcOrVars, vars) {
  return executeQuery(getServiceCategoryByIdRef(dcOrVars, vars));
};

const getMethodsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMethods');
}
getMethodsRef.operationName = 'GetMethods';
exports.getMethodsRef = getMethodsRef;

exports.getMethods = function getMethods(dc) {
  return executeQuery(getMethodsRef(dc));
};

const getMethodByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMethodById', inputVars);
}
getMethodByIdRef.operationName = 'GetMethodById';
exports.getMethodByIdRef = getMethodByIdRef;

exports.getMethodById = function getMethodById(dcOrVars, vars) {
  return executeQuery(getMethodByIdRef(dcOrVars, vars));
};

const getServicesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServices');
}
getServicesRef.operationName = 'GetServices';
exports.getServicesRef = getServicesRef;

exports.getServices = function getServices(dc) {
  return executeQuery(getServicesRef(dc));
};

const getServiceByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServiceById', inputVars);
}
getServiceByIdRef.operationName = 'GetServiceById';
exports.getServiceByIdRef = getServiceByIdRef;

exports.getServiceById = function getServiceById(dcOrVars, vars) {
  return executeQuery(getServiceByIdRef(dcOrVars, vars));
};

const getServicesByCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServicesByCategory', inputVars);
}
getServicesByCategoryRef.operationName = 'GetServicesByCategory';
exports.getServicesByCategoryRef = getServicesByCategoryRef;

exports.getServicesByCategory = function getServicesByCategory(dcOrVars, vars) {
  return executeQuery(getServicesByCategoryRef(dcOrVars, vars));
};

const getFeaturedServicesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetFeaturedServices');
}
getFeaturedServicesRef.operationName = 'GetFeaturedServices';
exports.getFeaturedServicesRef = getFeaturedServicesRef;

exports.getFeaturedServices = function getFeaturedServices(dc) {
  return executeQuery(getFeaturedServicesRef(dc));
};

const getServiceMethodsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServiceMethods', inputVars);
}
getServiceMethodsRef.operationName = 'GetServiceMethods';
exports.getServiceMethodsRef = getServiceMethodsRef;

exports.getServiceMethods = function getServiceMethods(dcOrVars, vars) {
  return executeQuery(getServiceMethodsRef(dcOrVars, vars));
};

const getMethodsForServiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMethodsForService', inputVars);
}
getMethodsForServiceRef.operationName = 'GetMethodsForService';
exports.getMethodsForServiceRef = getMethodsForServiceRef;

exports.getMethodsForService = function getMethodsForService(dcOrVars, vars) {
  return executeQuery(getMethodsForServiceRef(dcOrVars, vars));
};

const getServicesForMethodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServicesForMethod', inputVars);
}
getServicesForMethodRef.operationName = 'GetServicesForMethod';
exports.getServicesForMethodRef = getServicesForMethodRef;

exports.getServicesForMethod = function getServicesForMethod(dcOrVars, vars) {
  return executeQuery(getServicesForMethodRef(dcOrVars, vars));
};

const getServiceWithMethodsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServiceWithMethods', inputVars);
}
getServiceWithMethodsRef.operationName = 'GetServiceWithMethods';
exports.getServiceWithMethodsRef = getServiceWithMethodsRef;

exports.getServiceWithMethods = function getServiceWithMethods(dcOrVars, vars) {
  return executeQuery(getServiceWithMethodsRef(dcOrVars, vars));
};

const getTimeSlotsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTimeSlots', inputVars);
}
getTimeSlotsRef.operationName = 'GetTimeSlots';
exports.getTimeSlotsRef = getTimeSlotsRef;

exports.getTimeSlots = function getTimeSlots(dcOrVars, vars) {
  return executeQuery(getTimeSlotsRef(dcOrVars, vars));
};

const getTimeSlotByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTimeSlotById', inputVars);
}
getTimeSlotByIdRef.operationName = 'GetTimeSlotById';
exports.getTimeSlotByIdRef = getTimeSlotByIdRef;

exports.getTimeSlotById = function getTimeSlotById(dcOrVars, vars) {
  return executeQuery(getTimeSlotByIdRef(dcOrVars, vars));
};

const getTimeSlotsInRangeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTimeSlotsInRange', inputVars);
}
getTimeSlotsInRangeRef.operationName = 'GetTimeSlotsInRange';
exports.getTimeSlotsInRangeRef = getTimeSlotsInRangeRef;

exports.getTimeSlotsInRange = function getTimeSlotsInRange(dcOrVars, vars) {
  return executeQuery(getTimeSlotsInRangeRef(dcOrVars, vars));
};

const getUserBookingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserBookings', inputVars);
}
getUserBookingsRef.operationName = 'GetUserBookings';
exports.getUserBookingsRef = getUserBookingsRef;

exports.getUserBookings = function getUserBookings(dcOrVars, vars) {
  return executeQuery(getUserBookingsRef(dcOrVars, vars));
};

const getMyBookingsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyBookings');
}
getMyBookingsRef.operationName = 'GetMyBookings';
exports.getMyBookingsRef = getMyBookingsRef;

exports.getMyBookings = function getMyBookings(dc) {
  return executeQuery(getMyBookingsRef(dc));
};

const getBookingByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookingById', inputVars);
}
getBookingByIdRef.operationName = 'GetBookingById';
exports.getBookingByIdRef = getBookingByIdRef;

exports.getBookingById = function getBookingById(dcOrVars, vars) {
  return executeQuery(getBookingByIdRef(dcOrVars, vars));
};

const getBookingHistoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookingHistory', inputVars);
}
getBookingHistoryRef.operationName = 'GetBookingHistory';
exports.getBookingHistoryRef = getBookingHistoryRef;

exports.getBookingHistory = function getBookingHistory(dcOrVars, vars) {
  return executeQuery(getBookingHistoryRef(dcOrVars, vars));
};

const getStaffBookingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStaffBookings', inputVars);
}
getStaffBookingsRef.operationName = 'GetStaffBookings';
exports.getStaffBookingsRef = getStaffBookingsRef;

exports.getStaffBookings = function getStaffBookings(dcOrVars, vars) {
  return executeQuery(getStaffBookingsRef(dcOrVars, vars));
};

const getBookingSamplesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookingSamples', inputVars);
}
getBookingSamplesRef.operationName = 'GetBookingSamples';
exports.getBookingSamplesRef = getBookingSamplesRef;

exports.getBookingSamples = function getBookingSamples(dcOrVars, vars) {
  return executeQuery(getBookingSamplesRef(dcOrVars, vars));
};

const getSamplesByStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSamplesByStatus', inputVars);
}
getSamplesByStatusRef.operationName = 'GetSamplesByStatus';
exports.getSamplesByStatusRef = getSamplesByStatusRef;

exports.getSamplesByStatus = function getSamplesByStatus(dcOrVars, vars) {
  return executeQuery(getSamplesByStatusRef(dcOrVars, vars));
};

const getSampleByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSampleById', inputVars);
}
getSampleByIdRef.operationName = 'GetSampleById';
exports.getSampleByIdRef = getSampleByIdRef;

exports.getSampleById = function getSampleById(dcOrVars, vars) {
  return executeQuery(getSampleByIdRef(dcOrVars, vars));
};

const getStaffSamplesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStaffSamples', inputVars);
}
getStaffSamplesRef.operationName = 'GetStaffSamples';
exports.getStaffSamplesRef = getStaffSamplesRef;

exports.getStaffSamples = function getStaffSamples(dcOrVars, vars) {
  return executeQuery(getStaffSamplesRef(dcOrVars, vars));
};

const getBookingTestResultsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookingTestResults', inputVars);
}
getBookingTestResultsRef.operationName = 'GetBookingTestResults';
exports.getBookingTestResultsRef = getBookingTestResultsRef;

exports.getBookingTestResults = function getBookingTestResults(dcOrVars, vars) {
  return executeQuery(getBookingTestResultsRef(dcOrVars, vars));
};

const getTestResultByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTestResultById', inputVars);
}
getTestResultByIdRef.operationName = 'GetTestResultById';
exports.getTestResultByIdRef = getTestResultByIdRef;

exports.getTestResultById = function getTestResultById(dcOrVars, vars) {
  return executeQuery(getTestResultByIdRef(dcOrVars, vars));
};

const getTestResultsByStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTestResultsByStatus', inputVars);
}
getTestResultsByStatusRef.operationName = 'GetTestResultsByStatus';
exports.getTestResultsByStatusRef = getTestResultsByStatusRef;

exports.getTestResultsByStatus = function getTestResultsByStatus(dcOrVars, vars) {
  return executeQuery(getTestResultsByStatusRef(dcOrVars, vars));
};

const getUserTestResultsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserTestResults', inputVars);
}
getUserTestResultsRef.operationName = 'GetUserTestResults';
exports.getUserTestResultsRef = getUserTestResultsRef;

exports.getUserTestResults = function getUserTestResults(dcOrVars, vars) {
  return executeQuery(getUserTestResultsRef(dcOrVars, vars));
};

const getBookingPaymentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookingPayment', inputVars);
}
getBookingPaymentRef.operationName = 'GetBookingPayment';
exports.getBookingPaymentRef = getBookingPaymentRef;

exports.getBookingPayment = function getBookingPayment(dcOrVars, vars) {
  return executeQuery(getBookingPaymentRef(dcOrVars, vars));
};

const getPaymentByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPaymentById', inputVars);
}
getPaymentByIdRef.operationName = 'GetPaymentById';
exports.getPaymentByIdRef = getPaymentByIdRef;

exports.getPaymentById = function getPaymentById(dcOrVars, vars) {
  return executeQuery(getPaymentByIdRef(dcOrVars, vars));
};

const getPaymentsByStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPaymentsByStatus', inputVars);
}
getPaymentsByStatusRef.operationName = 'GetPaymentsByStatus';
exports.getPaymentsByStatusRef = getPaymentsByStatusRef;

exports.getPaymentsByStatus = function getPaymentsByStatus(dcOrVars, vars) {
  return executeQuery(getPaymentsByStatusRef(dcOrVars, vars));
};

const getUserPaymentsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserPayments', inputVars);
}
getUserPaymentsRef.operationName = 'GetUserPayments';
exports.getUserPaymentsRef = getUserPaymentsRef;

exports.getUserPayments = function getUserPayments(dcOrVars, vars) {
  return executeQuery(getUserPaymentsRef(dcOrVars, vars));
};

const getBookingFeedbackRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookingFeedback', inputVars);
}
getBookingFeedbackRef.operationName = 'GetBookingFeedback';
exports.getBookingFeedbackRef = getBookingFeedbackRef;

exports.getBookingFeedback = function getBookingFeedback(dcOrVars, vars) {
  return executeQuery(getBookingFeedbackRef(dcOrVars, vars));
};

const getAllFeedbackRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAllFeedback', inputVars);
}
getAllFeedbackRef.operationName = 'GetAllFeedback';
exports.getAllFeedbackRef = getAllFeedbackRef;

exports.getAllFeedback = function getAllFeedback(dcOrVars, vars) {
  return executeQuery(getAllFeedbackRef(dcOrVars, vars));
};

const getFeedbackByRatingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetFeedbackByRating', inputVars);
}
getFeedbackByRatingRef.operationName = 'GetFeedbackByRating';
exports.getFeedbackByRatingRef = getFeedbackByRatingRef;

exports.getFeedbackByRating = function getFeedbackByRating(dcOrVars, vars) {
  return executeQuery(getFeedbackByRatingRef(dcOrVars, vars));
};

const getBlogsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBlogs', inputVars);
}
getBlogsRef.operationName = 'GetBlogs';
exports.getBlogsRef = getBlogsRef;

exports.getBlogs = function getBlogs(dcOrVars, vars) {
  return executeQuery(getBlogsRef(dcOrVars, vars));
};

const getBlogByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBlogById', inputVars);
}
getBlogByIdRef.operationName = 'GetBlogById';
exports.getBlogByIdRef = getBlogByIdRef;

exports.getBlogById = function getBlogById(dcOrVars, vars) {
  return executeQuery(getBlogByIdRef(dcOrVars, vars));
};

const getBlogsByUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBlogsByUser', inputVars);
}
getBlogsByUserRef.operationName = 'GetBlogsByUser';
exports.getBlogsByUserRef = getBlogsByUserRef;

exports.getBlogsByUser = function getBlogsByUser(dcOrVars, vars) {
  return executeQuery(getBlogsByUserRef(dcOrVars, vars));
};

const getMyBlogsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyBlogs');
}
getMyBlogsRef.operationName = 'GetMyBlogs';
exports.getMyBlogsRef = getMyBlogsRef;

exports.getMyBlogs = function getMyBlogs(dc) {
  return executeQuery(getMyBlogsRef(dc));
};

const getUserNotificationsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserNotifications', inputVars);
}
getUserNotificationsRef.operationName = 'GetUserNotifications';
exports.getUserNotificationsRef = getUserNotificationsRef;

exports.getUserNotifications = function getUserNotifications(dcOrVars, vars) {
  return executeQuery(getUserNotificationsRef(dcOrVars, vars));
};

const getMyNotificationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyNotifications');
}
getMyNotificationsRef.operationName = 'GetMyNotifications';
exports.getMyNotificationsRef = getMyNotificationsRef;

exports.getMyNotifications = function getMyNotifications(dc) {
  return executeQuery(getMyNotificationsRef(dc));
};

const getUnreadNotificationsCountRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUnreadNotificationsCount', inputVars);
}
getUnreadNotificationsCountRef.operationName = 'GetUnreadNotificationsCount';
exports.getUnreadNotificationsCountRef = getUnreadNotificationsCountRef;

exports.getUnreadNotificationsCount = function getUnreadNotificationsCount(dcOrVars, vars) {
  return executeQuery(getUnreadNotificationsCountRef(dcOrVars, vars));
};

const getNotificationByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetNotificationById', inputVars);
}
getNotificationByIdRef.operationName = 'GetNotificationById';
exports.getNotificationByIdRef = getNotificationByIdRef;

exports.getNotificationById = function getNotificationById(dcOrVars, vars) {
  return executeQuery(getNotificationByIdRef(dcOrVars, vars));
};

const getBookingStatsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookingStats');
}
getBookingStatsRef.operationName = 'GetBookingStats';
exports.getBookingStatsRef = getBookingStatsRef;

exports.getBookingStats = function getBookingStats(dc) {
  return executeQuery(getBookingStatsRef(dc));
};

const getServicePopularityRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServicePopularity');
}
getServicePopularityRef.operationName = 'GetServicePopularity';
exports.getServicePopularityRef = getServicePopularityRef;

exports.getServicePopularity = function getServicePopularity(dc) {
  return executeQuery(getServicePopularityRef(dc));
};

const getMonthlyRevenueRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMonthlyRevenue', inputVars);
}
getMonthlyRevenueRef.operationName = 'GetMonthlyRevenue';
exports.getMonthlyRevenueRef = getMonthlyRevenueRef;

exports.getMonthlyRevenue = function getMonthlyRevenue(dcOrVars, vars) {
  return executeQuery(getMonthlyRevenueRef(dcOrVars, vars));
};

const createRoleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateRole', inputVars);
}
createRoleRef.operationName = 'CreateRole';
exports.createRoleRef = createRoleRef;

exports.createRole = function createRole(dcOrVars, vars) {
  return executeMutation(createRoleRef(dcOrVars, vars));
};

const updateRoleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateRole', inputVars);
}
updateRoleRef.operationName = 'UpdateRole';
exports.updateRoleRef = updateRoleRef;

exports.updateRole = function updateRole(dcOrVars, vars) {
  return executeMutation(updateRoleRef(dcOrVars, vars));
};

const deleteRoleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteRole', inputVars);
}
deleteRoleRef.operationName = 'DeleteRole';
exports.deleteRoleRef = deleteRoleRef;

exports.deleteRole = function deleteRole(dcOrVars, vars) {
  return executeMutation(deleteRoleRef(dcOrVars, vars));
};

const createOrUpdateUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateOrUpdateUser', inputVars);
}
createOrUpdateUserRef.operationName = 'CreateOrUpdateUser';
exports.createOrUpdateUserRef = createOrUpdateUserRef;

exports.createOrUpdateUser = function createOrUpdateUser(dcOrVars, vars) {
  return executeMutation(createOrUpdateUserRef(dcOrVars, vars));
};

const updateUserProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserProfile', inputVars);
}
updateUserProfileRef.operationName = 'UpdateUserProfile';
exports.updateUserProfileRef = updateUserProfileRef;

exports.updateUserProfile = function updateUserProfile(dcOrVars, vars) {
  return executeMutation(updateUserProfileRef(dcOrVars, vars));
};

const updateUserRoleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserRole', inputVars);
}
updateUserRoleRef.operationName = 'UpdateUserRole';
exports.updateUserRoleRef = updateUserRoleRef;

exports.updateUserRole = function updateUserRole(dcOrVars, vars) {
  return executeMutation(updateUserRoleRef(dcOrVars, vars));
};

const updateUserAccountStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserAccountStatus', inputVars);
}
updateUserAccountStatusRef.operationName = 'UpdateUserAccountStatus';
exports.updateUserAccountStatusRef = updateUserAccountStatusRef;

exports.updateUserAccountStatus = function updateUserAccountStatus(dcOrVars, vars) {
  return executeMutation(updateUserAccountStatusRef(dcOrVars, vars));
};

const createServiceCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateServiceCategory', inputVars);
}
createServiceCategoryRef.operationName = 'CreateServiceCategory';
exports.createServiceCategoryRef = createServiceCategoryRef;

exports.createServiceCategory = function createServiceCategory(dcOrVars, vars) {
  return executeMutation(createServiceCategoryRef(dcOrVars, vars));
};

const updateServiceCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateServiceCategory', inputVars);
}
updateServiceCategoryRef.operationName = 'UpdateServiceCategory';
exports.updateServiceCategoryRef = updateServiceCategoryRef;

exports.updateServiceCategory = function updateServiceCategory(dcOrVars, vars) {
  return executeMutation(updateServiceCategoryRef(dcOrVars, vars));
};

const createMethodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateMethod', inputVars);
}
createMethodRef.operationName = 'CreateMethod';
exports.createMethodRef = createMethodRef;

exports.createMethod = function createMethod(dcOrVars, vars) {
  return executeMutation(createMethodRef(dcOrVars, vars));
};

const updateMethodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMethod', inputVars);
}
updateMethodRef.operationName = 'UpdateMethod';
exports.updateMethodRef = updateMethodRef;

exports.updateMethod = function updateMethod(dcOrVars, vars) {
  return executeMutation(updateMethodRef(dcOrVars, vars));
};

const createServiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateService', inputVars);
}
createServiceRef.operationName = 'CreateService';
exports.createServiceRef = createServiceRef;

exports.createService = function createService(dcOrVars, vars) {
  return executeMutation(createServiceRef(dcOrVars, vars));
};

const updateServiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateService', inputVars);
}
updateServiceRef.operationName = 'UpdateService';
exports.updateServiceRef = updateServiceRef;

exports.updateService = function updateService(dcOrVars, vars) {
  return executeMutation(updateServiceRef(dcOrVars, vars));
};

const createServiceMethodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateServiceMethod', inputVars);
}
createServiceMethodRef.operationName = 'CreateServiceMethod';
exports.createServiceMethodRef = createServiceMethodRef;

exports.createServiceMethod = function createServiceMethod(dcOrVars, vars) {
  return executeMutation(createServiceMethodRef(dcOrVars, vars));
};

const deleteServiceMethodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteServiceMethod', inputVars);
}
deleteServiceMethodRef.operationName = 'DeleteServiceMethod';
exports.deleteServiceMethodRef = deleteServiceMethodRef;

exports.deleteServiceMethod = function deleteServiceMethod(dcOrVars, vars) {
  return executeMutation(deleteServiceMethodRef(dcOrVars, vars));
};

const createTimeSlotRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTimeSlot', inputVars);
}
createTimeSlotRef.operationName = 'CreateTimeSlot';
exports.createTimeSlotRef = createTimeSlotRef;

exports.createTimeSlot = function createTimeSlot(dcOrVars, vars) {
  return executeMutation(createTimeSlotRef(dcOrVars, vars));
};

const updateTimeSlotRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTimeSlot', inputVars);
}
updateTimeSlotRef.operationName = 'UpdateTimeSlot';
exports.updateTimeSlotRef = updateTimeSlotRef;

exports.updateTimeSlot = function updateTimeSlot(dcOrVars, vars) {
  return executeMutation(updateTimeSlotRef(dcOrVars, vars));
};

const updateTimeSlotBookingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTimeSlotBookings', inputVars);
}
updateTimeSlotBookingsRef.operationName = 'UpdateTimeSlotBookings';
exports.updateTimeSlotBookingsRef = updateTimeSlotBookingsRef;

exports.updateTimeSlotBookings = function updateTimeSlotBookings(dcOrVars, vars) {
  return executeMutation(updateTimeSlotBookingsRef(dcOrVars, vars));
};

const createBookingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBooking', inputVars);
}
createBookingRef.operationName = 'CreateBooking';
exports.createBookingRef = createBookingRef;

exports.createBooking = function createBooking(dcOrVars, vars) {
  return executeMutation(createBookingRef(dcOrVars, vars));
};

const updateBookingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateBooking', inputVars);
}
updateBookingRef.operationName = 'UpdateBooking';
exports.updateBookingRef = updateBookingRef;

exports.updateBooking = function updateBooking(dcOrVars, vars) {
  return executeMutation(updateBookingRef(dcOrVars, vars));
};

const assignBookingStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AssignBookingStaff', inputVars);
}
assignBookingStaffRef.operationName = 'AssignBookingStaff';
exports.assignBookingStaffRef = assignBookingStaffRef;

exports.assignBookingStaff = function assignBookingStaff(dcOrVars, vars) {
  return executeMutation(assignBookingStaffRef(dcOrVars, vars));
};

const createBookingHistoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBookingHistory', inputVars);
}
createBookingHistoryRef.operationName = 'CreateBookingHistory';
exports.createBookingHistoryRef = createBookingHistoryRef;

exports.createBookingHistory = function createBookingHistory(dcOrVars, vars) {
  return executeMutation(createBookingHistoryRef(dcOrVars, vars));
};

const updateBookingHistoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateBookingHistory', inputVars);
}
updateBookingHistoryRef.operationName = 'UpdateBookingHistory';
exports.updateBookingHistoryRef = updateBookingHistoryRef;

exports.updateBookingHistory = function updateBookingHistory(dcOrVars, vars) {
  return executeMutation(updateBookingHistoryRef(dcOrVars, vars));
};

const createSampleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSample', inputVars);
}
createSampleRef.operationName = 'CreateSample';
exports.createSampleRef = createSampleRef;

exports.createSample = function createSample(dcOrVars, vars) {
  return executeMutation(createSampleRef(dcOrVars, vars));
};

const updateSampleStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateSampleStatus', inputVars);
}
updateSampleStatusRef.operationName = 'UpdateSampleStatus';
exports.updateSampleStatusRef = updateSampleStatusRef;

exports.updateSampleStatus = function updateSampleStatus(dcOrVars, vars) {
  return executeMutation(updateSampleStatusRef(dcOrVars, vars));
};

const createTestResultRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTestResult', inputVars);
}
createTestResultRef.operationName = 'CreateTestResult';
exports.createTestResultRef = createTestResultRef;

exports.createTestResult = function createTestResult(dcOrVars, vars) {
  return executeMutation(createTestResultRef(dcOrVars, vars));
};

const updateTestResultRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTestResult', inputVars);
}
updateTestResultRef.operationName = 'UpdateTestResult';
exports.updateTestResultRef = updateTestResultRef;

exports.updateTestResult = function updateTestResult(dcOrVars, vars) {
  return executeMutation(updateTestResultRef(dcOrVars, vars));
};

const assignTestResultStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AssignTestResultStaff', inputVars);
}
assignTestResultStaffRef.operationName = 'AssignTestResultStaff';
exports.assignTestResultStaffRef = assignTestResultStaffRef;

exports.assignTestResultStaff = function assignTestResultStaff(dcOrVars, vars) {
  return executeMutation(assignTestResultStaffRef(dcOrVars, vars));
};

const createPaymentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePayment', inputVars);
}
createPaymentRef.operationName = 'CreatePayment';
exports.createPaymentRef = createPaymentRef;

exports.createPayment = function createPayment(dcOrVars, vars) {
  return executeMutation(createPaymentRef(dcOrVars, vars));
};

const updatePaymentStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePaymentStatus', inputVars);
}
updatePaymentStatusRef.operationName = 'UpdatePaymentStatus';
exports.updatePaymentStatusRef = updatePaymentStatusRef;

exports.updatePaymentStatus = function updatePaymentStatus(dcOrVars, vars) {
  return executeMutation(updatePaymentStatusRef(dcOrVars, vars));
};

const addRefundDetailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddRefundDetail', inputVars);
}
addRefundDetailRef.operationName = 'AddRefundDetail';
exports.addRefundDetailRef = addRefundDetailRef;

exports.addRefundDetail = function addRefundDetail(dcOrVars, vars) {
  return executeMutation(addRefundDetailRef(dcOrVars, vars));
};

const createFeedbackRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateFeedback', inputVars);
}
createFeedbackRef.operationName = 'CreateFeedback';
exports.createFeedbackRef = createFeedbackRef;

exports.createFeedback = function createFeedback(dcOrVars, vars) {
  return executeMutation(createFeedbackRef(dcOrVars, vars));
};

const updateFeedbackRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateFeedback', inputVars);
}
updateFeedbackRef.operationName = 'UpdateFeedback';
exports.updateFeedbackRef = updateFeedbackRef;

exports.updateFeedback = function updateFeedback(dcOrVars, vars) {
  return executeMutation(updateFeedbackRef(dcOrVars, vars));
};

const createBlogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBlog', inputVars);
}
createBlogRef.operationName = 'CreateBlog';
exports.createBlogRef = createBlogRef;

exports.createBlog = function createBlog(dcOrVars, vars) {
  return executeMutation(createBlogRef(dcOrVars, vars));
};

const updateBlogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateBlog', inputVars);
}
updateBlogRef.operationName = 'UpdateBlog';
exports.updateBlogRef = updateBlogRef;

exports.updateBlog = function updateBlog(dcOrVars, vars) {
  return executeMutation(updateBlogRef(dcOrVars, vars));
};

const deleteBlogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteBlog', inputVars);
}
deleteBlogRef.operationName = 'DeleteBlog';
exports.deleteBlogRef = deleteBlogRef;

exports.deleteBlog = function deleteBlog(dcOrVars, vars) {
  return executeMutation(deleteBlogRef(dcOrVars, vars));
};

const createNotificationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNotification', inputVars);
}
createNotificationRef.operationName = 'CreateNotification';
exports.createNotificationRef = createNotificationRef;

exports.createNotification = function createNotification(dcOrVars, vars) {
  return executeMutation(createNotificationRef(dcOrVars, vars));
};

const markNotificationReadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkNotificationRead', inputVars);
}
markNotificationReadRef.operationName = 'MarkNotificationRead';
exports.markNotificationReadRef = markNotificationReadRef;

exports.markNotificationRead = function markNotificationRead(dcOrVars, vars) {
  return executeMutation(markNotificationReadRef(dcOrVars, vars));
};

const markAllNotificationsReadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkAllNotificationsRead', inputVars);
}
markAllNotificationsReadRef.operationName = 'MarkAllNotificationsRead';
exports.markAllNotificationsReadRef = markAllNotificationsReadRef;

exports.markAllNotificationsRead = function markAllNotificationsRead(dcOrVars, vars) {
  return executeMutation(markAllNotificationsReadRef(dcOrVars, vars));
};

const deleteNotificationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteNotification', inputVars);
}
deleteNotificationRef.operationName = 'DeleteNotification';
exports.deleteNotificationRef = deleteNotificationRef;

exports.deleteNotification = function deleteNotification(dcOrVars, vars) {
  return executeMutation(deleteNotificationRef(dcOrVars, vars));
};
