import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'default',
  service: 'su25-swp391-g8-2-service',
  location: 'asia-east2'
};

export const getRolesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRoles');
}
getRolesRef.operationName = 'GetRoles';

export function getRoles(dc) {
  return executeQuery(getRolesRef(dc));
}

export const getRoleByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRoleById', inputVars);
}
getRoleByIdRef.operationName = 'GetRoleById';

export function getRoleById(dcOrVars, vars) {
  return executeQuery(getRoleByIdRef(dcOrVars, vars));
}

export const getRoleByNameRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRoleByName', inputVars);
}
getRoleByNameRef.operationName = 'GetRoleByName';

export function getRoleByName(dcOrVars, vars) {
  return executeQuery(getRoleByNameRef(dcOrVars, vars));
}

export const getUserRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUser');
}
getUserRef.operationName = 'GetUser';

export function getUser(dc) {
  return executeQuery(getUserRef(dc));
}

export const getUserByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserById', inputVars);
}
getUserByIdRef.operationName = 'GetUserById';

export function getUserById(dcOrVars, vars) {
  return executeQuery(getUserByIdRef(dcOrVars, vars));
}

export const getUsersRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUsers', inputVars);
}
getUsersRef.operationName = 'GetUsers';

export function getUsers(dcOrVars, vars) {
  return executeQuery(getUsersRef(dcOrVars, vars));
}

export const getUsersByRoleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUsersByRole', inputVars);
}
getUsersByRoleRef.operationName = 'GetUsersByRole';

export function getUsersByRole(dcOrVars, vars) {
  return executeQuery(getUsersByRoleRef(dcOrVars, vars));
}

export const getStaffMembersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStaffMembers');
}
getStaffMembersRef.operationName = 'GetStaffMembers';

export function getStaffMembers(dc) {
  return executeQuery(getStaffMembersRef(dc));
}

export const getServiceCategoriesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServiceCategories');
}
getServiceCategoriesRef.operationName = 'GetServiceCategories';

export function getServiceCategories(dc) {
  return executeQuery(getServiceCategoriesRef(dc));
}

export const getServiceCategoryByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServiceCategoryById', inputVars);
}
getServiceCategoryByIdRef.operationName = 'GetServiceCategoryById';

export function getServiceCategoryById(dcOrVars, vars) {
  return executeQuery(getServiceCategoryByIdRef(dcOrVars, vars));
}

export const getMethodsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMethods');
}
getMethodsRef.operationName = 'GetMethods';

export function getMethods(dc) {
  return executeQuery(getMethodsRef(dc));
}

export const getMethodByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMethodById', inputVars);
}
getMethodByIdRef.operationName = 'GetMethodById';

export function getMethodById(dcOrVars, vars) {
  return executeQuery(getMethodByIdRef(dcOrVars, vars));
}

export const getServicesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServices');
}
getServicesRef.operationName = 'GetServices';

export function getServices(dc) {
  return executeQuery(getServicesRef(dc));
}

export const getServiceByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServiceById', inputVars);
}
getServiceByIdRef.operationName = 'GetServiceById';

export function getServiceById(dcOrVars, vars) {
  return executeQuery(getServiceByIdRef(dcOrVars, vars));
}

export const getServicesByCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServicesByCategory', inputVars);
}
getServicesByCategoryRef.operationName = 'GetServicesByCategory';

export function getServicesByCategory(dcOrVars, vars) {
  return executeQuery(getServicesByCategoryRef(dcOrVars, vars));
}

export const getFeaturedServicesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetFeaturedServices');
}
getFeaturedServicesRef.operationName = 'GetFeaturedServices';

export function getFeaturedServices(dc) {
  return executeQuery(getFeaturedServicesRef(dc));
}

export const getServiceMethodsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServiceMethods', inputVars);
}
getServiceMethodsRef.operationName = 'GetServiceMethods';

export function getServiceMethods(dcOrVars, vars) {
  return executeQuery(getServiceMethodsRef(dcOrVars, vars));
}

export const getMethodsForServiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMethodsForService', inputVars);
}
getMethodsForServiceRef.operationName = 'GetMethodsForService';

export function getMethodsForService(dcOrVars, vars) {
  return executeQuery(getMethodsForServiceRef(dcOrVars, vars));
}

export const getServicesForMethodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServicesForMethod', inputVars);
}
getServicesForMethodRef.operationName = 'GetServicesForMethod';

export function getServicesForMethod(dcOrVars, vars) {
  return executeQuery(getServicesForMethodRef(dcOrVars, vars));
}

export const getServiceWithMethodsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServiceWithMethods', inputVars);
}
getServiceWithMethodsRef.operationName = 'GetServiceWithMethods';

export function getServiceWithMethods(dcOrVars, vars) {
  return executeQuery(getServiceWithMethodsRef(dcOrVars, vars));
}

export const getTimeSlotsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTimeSlots', inputVars);
}
getTimeSlotsRef.operationName = 'GetTimeSlots';

export function getTimeSlots(dcOrVars, vars) {
  return executeQuery(getTimeSlotsRef(dcOrVars, vars));
}

export const getTimeSlotByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTimeSlotById', inputVars);
}
getTimeSlotByIdRef.operationName = 'GetTimeSlotById';

export function getTimeSlotById(dcOrVars, vars) {
  return executeQuery(getTimeSlotByIdRef(dcOrVars, vars));
}

export const getTimeSlotsInRangeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTimeSlotsInRange', inputVars);
}
getTimeSlotsInRangeRef.operationName = 'GetTimeSlotsInRange';

export function getTimeSlotsInRange(dcOrVars, vars) {
  return executeQuery(getTimeSlotsInRangeRef(dcOrVars, vars));
}

export const getUserBookingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserBookings', inputVars);
}
getUserBookingsRef.operationName = 'GetUserBookings';

export function getUserBookings(dcOrVars, vars) {
  return executeQuery(getUserBookingsRef(dcOrVars, vars));
}

export const getMyBookingsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyBookings');
}
getMyBookingsRef.operationName = 'GetMyBookings';

export function getMyBookings(dc) {
  return executeQuery(getMyBookingsRef(dc));
}

export const getBookingByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookingById', inputVars);
}
getBookingByIdRef.operationName = 'GetBookingById';

export function getBookingById(dcOrVars, vars) {
  return executeQuery(getBookingByIdRef(dcOrVars, vars));
}

export const getBookingHistoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookingHistory', inputVars);
}
getBookingHistoryRef.operationName = 'GetBookingHistory';

export function getBookingHistory(dcOrVars, vars) {
  return executeQuery(getBookingHistoryRef(dcOrVars, vars));
}

export const getStaffBookingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStaffBookings', inputVars);
}
getStaffBookingsRef.operationName = 'GetStaffBookings';

export function getStaffBookings(dcOrVars, vars) {
  return executeQuery(getStaffBookingsRef(dcOrVars, vars));
}

export const getBookingSamplesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookingSamples', inputVars);
}
getBookingSamplesRef.operationName = 'GetBookingSamples';

export function getBookingSamples(dcOrVars, vars) {
  return executeQuery(getBookingSamplesRef(dcOrVars, vars));
}

export const getSamplesByStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSamplesByStatus', inputVars);
}
getSamplesByStatusRef.operationName = 'GetSamplesByStatus';

export function getSamplesByStatus(dcOrVars, vars) {
  return executeQuery(getSamplesByStatusRef(dcOrVars, vars));
}

export const getSampleByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSampleById', inputVars);
}
getSampleByIdRef.operationName = 'GetSampleById';

export function getSampleById(dcOrVars, vars) {
  return executeQuery(getSampleByIdRef(dcOrVars, vars));
}

export const getStaffSamplesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStaffSamples', inputVars);
}
getStaffSamplesRef.operationName = 'GetStaffSamples';

export function getStaffSamples(dcOrVars, vars) {
  return executeQuery(getStaffSamplesRef(dcOrVars, vars));
}

export const getBookingTestResultsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookingTestResults', inputVars);
}
getBookingTestResultsRef.operationName = 'GetBookingTestResults';

export function getBookingTestResults(dcOrVars, vars) {
  return executeQuery(getBookingTestResultsRef(dcOrVars, vars));
}

export const getTestResultByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTestResultById', inputVars);
}
getTestResultByIdRef.operationName = 'GetTestResultById';

export function getTestResultById(dcOrVars, vars) {
  return executeQuery(getTestResultByIdRef(dcOrVars, vars));
}

export const getTestResultsByStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTestResultsByStatus', inputVars);
}
getTestResultsByStatusRef.operationName = 'GetTestResultsByStatus';

export function getTestResultsByStatus(dcOrVars, vars) {
  return executeQuery(getTestResultsByStatusRef(dcOrVars, vars));
}

export const getUserTestResultsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserTestResults', inputVars);
}
getUserTestResultsRef.operationName = 'GetUserTestResults';

export function getUserTestResults(dcOrVars, vars) {
  return executeQuery(getUserTestResultsRef(dcOrVars, vars));
}

export const getBookingPaymentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookingPayment', inputVars);
}
getBookingPaymentRef.operationName = 'GetBookingPayment';

export function getBookingPayment(dcOrVars, vars) {
  return executeQuery(getBookingPaymentRef(dcOrVars, vars));
}

export const getPaymentByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPaymentById', inputVars);
}
getPaymentByIdRef.operationName = 'GetPaymentById';

export function getPaymentById(dcOrVars, vars) {
  return executeQuery(getPaymentByIdRef(dcOrVars, vars));
}

export const getPaymentsByStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPaymentsByStatus', inputVars);
}
getPaymentsByStatusRef.operationName = 'GetPaymentsByStatus';

export function getPaymentsByStatus(dcOrVars, vars) {
  return executeQuery(getPaymentsByStatusRef(dcOrVars, vars));
}

export const getUserPaymentsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserPayments', inputVars);
}
getUserPaymentsRef.operationName = 'GetUserPayments';

export function getUserPayments(dcOrVars, vars) {
  return executeQuery(getUserPaymentsRef(dcOrVars, vars));
}

export const getBookingFeedbackRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookingFeedback', inputVars);
}
getBookingFeedbackRef.operationName = 'GetBookingFeedback';

export function getBookingFeedback(dcOrVars, vars) {
  return executeQuery(getBookingFeedbackRef(dcOrVars, vars));
}

export const getAllFeedbackRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAllFeedback', inputVars);
}
getAllFeedbackRef.operationName = 'GetAllFeedback';

export function getAllFeedback(dcOrVars, vars) {
  return executeQuery(getAllFeedbackRef(dcOrVars, vars));
}

export const getFeedbackByRatingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetFeedbackByRating', inputVars);
}
getFeedbackByRatingRef.operationName = 'GetFeedbackByRating';

export function getFeedbackByRating(dcOrVars, vars) {
  return executeQuery(getFeedbackByRatingRef(dcOrVars, vars));
}

export const getBlogsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBlogs', inputVars);
}
getBlogsRef.operationName = 'GetBlogs';

export function getBlogs(dcOrVars, vars) {
  return executeQuery(getBlogsRef(dcOrVars, vars));
}

export const getBlogByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBlogById', inputVars);
}
getBlogByIdRef.operationName = 'GetBlogById';

export function getBlogById(dcOrVars, vars) {
  return executeQuery(getBlogByIdRef(dcOrVars, vars));
}

export const getBlogsByUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBlogsByUser', inputVars);
}
getBlogsByUserRef.operationName = 'GetBlogsByUser';

export function getBlogsByUser(dcOrVars, vars) {
  return executeQuery(getBlogsByUserRef(dcOrVars, vars));
}

export const getMyBlogsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyBlogs');
}
getMyBlogsRef.operationName = 'GetMyBlogs';

export function getMyBlogs(dc) {
  return executeQuery(getMyBlogsRef(dc));
}

export const getUserNotificationsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserNotifications', inputVars);
}
getUserNotificationsRef.operationName = 'GetUserNotifications';

export function getUserNotifications(dcOrVars, vars) {
  return executeQuery(getUserNotificationsRef(dcOrVars, vars));
}

export const getMyNotificationsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyNotifications');
}
getMyNotificationsRef.operationName = 'GetMyNotifications';

export function getMyNotifications(dc) {
  return executeQuery(getMyNotificationsRef(dc));
}

export const getUnreadNotificationsCountRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUnreadNotificationsCount', inputVars);
}
getUnreadNotificationsCountRef.operationName = 'GetUnreadNotificationsCount';

export function getUnreadNotificationsCount(dcOrVars, vars) {
  return executeQuery(getUnreadNotificationsCountRef(dcOrVars, vars));
}

export const getNotificationByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetNotificationById', inputVars);
}
getNotificationByIdRef.operationName = 'GetNotificationById';

export function getNotificationById(dcOrVars, vars) {
  return executeQuery(getNotificationByIdRef(dcOrVars, vars));
}

export const getBookingStatsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookingStats');
}
getBookingStatsRef.operationName = 'GetBookingStats';

export function getBookingStats(dc) {
  return executeQuery(getBookingStatsRef(dc));
}

export const getServicePopularityRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServicePopularity');
}
getServicePopularityRef.operationName = 'GetServicePopularity';

export function getServicePopularity(dc) {
  return executeQuery(getServicePopularityRef(dc));
}

export const getMonthlyRevenueRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMonthlyRevenue', inputVars);
}
getMonthlyRevenueRef.operationName = 'GetMonthlyRevenue';

export function getMonthlyRevenue(dcOrVars, vars) {
  return executeQuery(getMonthlyRevenueRef(dcOrVars, vars));
}

export const createRoleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateRole', inputVars);
}
createRoleRef.operationName = 'CreateRole';

export function createRole(dcOrVars, vars) {
  return executeMutation(createRoleRef(dcOrVars, vars));
}

export const updateRoleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateRole', inputVars);
}
updateRoleRef.operationName = 'UpdateRole';

export function updateRole(dcOrVars, vars) {
  return executeMutation(updateRoleRef(dcOrVars, vars));
}

export const deleteRoleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteRole', inputVars);
}
deleteRoleRef.operationName = 'DeleteRole';

export function deleteRole(dcOrVars, vars) {
  return executeMutation(deleteRoleRef(dcOrVars, vars));
}

export const createOrUpdateUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateOrUpdateUser', inputVars);
}
createOrUpdateUserRef.operationName = 'CreateOrUpdateUser';

export function createOrUpdateUser(dcOrVars, vars) {
  return executeMutation(createOrUpdateUserRef(dcOrVars, vars));
}

export const updateUserProfileRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserProfile', inputVars);
}
updateUserProfileRef.operationName = 'UpdateUserProfile';

export function updateUserProfile(dcOrVars, vars) {
  return executeMutation(updateUserProfileRef(dcOrVars, vars));
}

export const updateUserRoleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserRole', inputVars);
}
updateUserRoleRef.operationName = 'UpdateUserRole';

export function updateUserRole(dcOrVars, vars) {
  return executeMutation(updateUserRoleRef(dcOrVars, vars));
}

export const updateUserAccountStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateUserAccountStatus', inputVars);
}
updateUserAccountStatusRef.operationName = 'UpdateUserAccountStatus';

export function updateUserAccountStatus(dcOrVars, vars) {
  return executeMutation(updateUserAccountStatusRef(dcOrVars, vars));
}

export const createServiceCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateServiceCategory', inputVars);
}
createServiceCategoryRef.operationName = 'CreateServiceCategory';

export function createServiceCategory(dcOrVars, vars) {
  return executeMutation(createServiceCategoryRef(dcOrVars, vars));
}

export const updateServiceCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateServiceCategory', inputVars);
}
updateServiceCategoryRef.operationName = 'UpdateServiceCategory';

export function updateServiceCategory(dcOrVars, vars) {
  return executeMutation(updateServiceCategoryRef(dcOrVars, vars));
}

export const createMethodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateMethod', inputVars);
}
createMethodRef.operationName = 'CreateMethod';

export function createMethod(dcOrVars, vars) {
  return executeMutation(createMethodRef(dcOrVars, vars));
}

export const updateMethodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateMethod', inputVars);
}
updateMethodRef.operationName = 'UpdateMethod';

export function updateMethod(dcOrVars, vars) {
  return executeMutation(updateMethodRef(dcOrVars, vars));
}

export const createServiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateService', inputVars);
}
createServiceRef.operationName = 'CreateService';

export function createService(dcOrVars, vars) {
  return executeMutation(createServiceRef(dcOrVars, vars));
}

export const updateServiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateService', inputVars);
}
updateServiceRef.operationName = 'UpdateService';

export function updateService(dcOrVars, vars) {
  return executeMutation(updateServiceRef(dcOrVars, vars));
}

export const createServiceMethodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateServiceMethod', inputVars);
}
createServiceMethodRef.operationName = 'CreateServiceMethod';

export function createServiceMethod(dcOrVars, vars) {
  return executeMutation(createServiceMethodRef(dcOrVars, vars));
}

export const deleteServiceMethodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteServiceMethod', inputVars);
}
deleteServiceMethodRef.operationName = 'DeleteServiceMethod';

export function deleteServiceMethod(dcOrVars, vars) {
  return executeMutation(deleteServiceMethodRef(dcOrVars, vars));
}

export const createTimeSlotRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTimeSlot', inputVars);
}
createTimeSlotRef.operationName = 'CreateTimeSlot';

export function createTimeSlot(dcOrVars, vars) {
  return executeMutation(createTimeSlotRef(dcOrVars, vars));
}

export const updateTimeSlotRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTimeSlot', inputVars);
}
updateTimeSlotRef.operationName = 'UpdateTimeSlot';

export function updateTimeSlot(dcOrVars, vars) {
  return executeMutation(updateTimeSlotRef(dcOrVars, vars));
}

export const updateTimeSlotBookingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTimeSlotBookings', inputVars);
}
updateTimeSlotBookingsRef.operationName = 'UpdateTimeSlotBookings';

export function updateTimeSlotBookings(dcOrVars, vars) {
  return executeMutation(updateTimeSlotBookingsRef(dcOrVars, vars));
}

export const createBookingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBooking', inputVars);
}
createBookingRef.operationName = 'CreateBooking';

export function createBooking(dcOrVars, vars) {
  return executeMutation(createBookingRef(dcOrVars, vars));
}

export const updateBookingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateBooking', inputVars);
}
updateBookingRef.operationName = 'UpdateBooking';

export function updateBooking(dcOrVars, vars) {
  return executeMutation(updateBookingRef(dcOrVars, vars));
}

export const assignBookingStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AssignBookingStaff', inputVars);
}
assignBookingStaffRef.operationName = 'AssignBookingStaff';

export function assignBookingStaff(dcOrVars, vars) {
  return executeMutation(assignBookingStaffRef(dcOrVars, vars));
}

export const createBookingHistoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBookingHistory', inputVars);
}
createBookingHistoryRef.operationName = 'CreateBookingHistory';

export function createBookingHistory(dcOrVars, vars) {
  return executeMutation(createBookingHistoryRef(dcOrVars, vars));
}

export const updateBookingHistoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateBookingHistory', inputVars);
}
updateBookingHistoryRef.operationName = 'UpdateBookingHistory';

export function updateBookingHistory(dcOrVars, vars) {
  return executeMutation(updateBookingHistoryRef(dcOrVars, vars));
}

export const createSampleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateSample', inputVars);
}
createSampleRef.operationName = 'CreateSample';

export function createSample(dcOrVars, vars) {
  return executeMutation(createSampleRef(dcOrVars, vars));
}

export const updateSampleStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateSampleStatus', inputVars);
}
updateSampleStatusRef.operationName = 'UpdateSampleStatus';

export function updateSampleStatus(dcOrVars, vars) {
  return executeMutation(updateSampleStatusRef(dcOrVars, vars));
}

export const createTestResultRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateTestResult', inputVars);
}
createTestResultRef.operationName = 'CreateTestResult';

export function createTestResult(dcOrVars, vars) {
  return executeMutation(createTestResultRef(dcOrVars, vars));
}

export const updateTestResultRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateTestResult', inputVars);
}
updateTestResultRef.operationName = 'UpdateTestResult';

export function updateTestResult(dcOrVars, vars) {
  return executeMutation(updateTestResultRef(dcOrVars, vars));
}

export const assignTestResultStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AssignTestResultStaff', inputVars);
}
assignTestResultStaffRef.operationName = 'AssignTestResultStaff';

export function assignTestResultStaff(dcOrVars, vars) {
  return executeMutation(assignTestResultStaffRef(dcOrVars, vars));
}

export const createPaymentRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePayment', inputVars);
}
createPaymentRef.operationName = 'CreatePayment';

export function createPayment(dcOrVars, vars) {
  return executeMutation(createPaymentRef(dcOrVars, vars));
}

export const updatePaymentStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePaymentStatus', inputVars);
}
updatePaymentStatusRef.operationName = 'UpdatePaymentStatus';

export function updatePaymentStatus(dcOrVars, vars) {
  return executeMutation(updatePaymentStatusRef(dcOrVars, vars));
}

export const addRefundDetailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddRefundDetail', inputVars);
}
addRefundDetailRef.operationName = 'AddRefundDetail';

export function addRefundDetail(dcOrVars, vars) {
  return executeMutation(addRefundDetailRef(dcOrVars, vars));
}

export const createFeedbackRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateFeedback', inputVars);
}
createFeedbackRef.operationName = 'CreateFeedback';

export function createFeedback(dcOrVars, vars) {
  return executeMutation(createFeedbackRef(dcOrVars, vars));
}

export const updateFeedbackRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateFeedback', inputVars);
}
updateFeedbackRef.operationName = 'UpdateFeedback';

export function updateFeedback(dcOrVars, vars) {
  return executeMutation(updateFeedbackRef(dcOrVars, vars));
}

export const createBlogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateBlog', inputVars);
}
createBlogRef.operationName = 'CreateBlog';

export function createBlog(dcOrVars, vars) {
  return executeMutation(createBlogRef(dcOrVars, vars));
}

export const updateBlogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateBlog', inputVars);
}
updateBlogRef.operationName = 'UpdateBlog';

export function updateBlog(dcOrVars, vars) {
  return executeMutation(updateBlogRef(dcOrVars, vars));
}

export const deleteBlogRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteBlog', inputVars);
}
deleteBlogRef.operationName = 'DeleteBlog';

export function deleteBlog(dcOrVars, vars) {
  return executeMutation(deleteBlogRef(dcOrVars, vars));
}

export const createNotificationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateNotification', inputVars);
}
createNotificationRef.operationName = 'CreateNotification';

export function createNotification(dcOrVars, vars) {
  return executeMutation(createNotificationRef(dcOrVars, vars));
}

export const markNotificationReadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkNotificationRead', inputVars);
}
markNotificationReadRef.operationName = 'MarkNotificationRead';

export function markNotificationRead(dcOrVars, vars) {
  return executeMutation(markNotificationReadRef(dcOrVars, vars));
}

export const markAllNotificationsReadRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'MarkAllNotificationsRead', inputVars);
}
markAllNotificationsReadRef.operationName = 'MarkAllNotificationsRead';

export function markAllNotificationsRead(dcOrVars, vars) {
  return executeMutation(markAllNotificationsReadRef(dcOrVars, vars));
}

export const deleteNotificationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteNotification', inputVars);
}
deleteNotificationRef.operationName = 'DeleteNotification';

export function deleteNotification(dcOrVars, vars) {
  return executeMutation(deleteNotificationRef(dcOrVars, vars));
}

