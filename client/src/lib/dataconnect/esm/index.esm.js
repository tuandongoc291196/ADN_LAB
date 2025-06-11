import { queryRef, executeQuery, mutationRef, executeMutation, validateArgs } from 'firebase/data-connect';

export const connectorConfig = {
  connector: 'default',
  service: 'be-sql-service',
  location: 'asia-east2'
};

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

export const createDnaServiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateDnaService', inputVars);
}
createDnaServiceRef.operationName = 'CreateDnaService';

export function createDnaService(dcOrVars, vars) {
  return executeMutation(createDnaServiceRef(dcOrVars, vars));
}

export const updateDnaServiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateDnaService', inputVars);
}
updateDnaServiceRef.operationName = 'UpdateDnaService';

export function updateDnaService(dcOrVars, vars) {
  return executeMutation(updateDnaServiceRef(dcOrVars, vars));
}

export const createKitRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateKit', inputVars);
}
createKitRef.operationName = 'CreateKit';

export function createKit(dcOrVars, vars) {
  return executeMutation(createKitRef(dcOrVars, vars));
}

export const updateKitStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateKitStatus', inputVars);
}
updateKitStatusRef.operationName = 'UpdateKitStatus';

export function updateKitStatus(dcOrVars, vars) {
  return executeMutation(updateKitStatusRef(dcOrVars, vars));
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

export const updateBookingStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateBookingStatus', inputVars);
}
updateBookingStatusRef.operationName = 'UpdateBookingStatus';

export function updateBookingStatus(dcOrVars, vars) {
  return executeMutation(updateBookingStatusRef(dcOrVars, vars));
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

export const addBookingItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddBookingItem', inputVars);
}
addBookingItemRef.operationName = 'AddBookingItem';

export function addBookingItem(dcOrVars, vars) {
  return executeMutation(addBookingItemRef(dcOrVars, vars));
}

export const updateBookingItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateBookingItem', inputVars);
}
updateBookingItemRef.operationName = 'UpdateBookingItem';

export function updateBookingItem(dcOrVars, vars) {
  return executeMutation(updateBookingItemRef(dcOrVars, vars));
}

export const removeBookingItemRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'RemoveBookingItem', inputVars);
}
removeBookingItemRef.operationName = 'RemoveBookingItem';

export function removeBookingItem(dcOrVars, vars) {
  return executeMutation(removeBookingItemRef(dcOrVars, vars));
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

export const verifyTestResultRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'VerifyTestResult', inputVars);
}
verifyTestResultRef.operationName = 'VerifyTestResult';

export function verifyTestResult(dcOrVars, vars) {
  return executeMutation(verifyTestResultRef(dcOrVars, vars));
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

export const getDnaServicesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDnaServices');
}
getDnaServicesRef.operationName = 'GetDnaServices';

export function getDnaServices(dc) {
  return executeQuery(getDnaServicesRef(dc));
}

export const getDnaServiceByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDnaServiceById', inputVars);
}
getDnaServiceByIdRef.operationName = 'GetDnaServiceById';

export function getDnaServiceById(dcOrVars, vars) {
  return executeQuery(getDnaServiceByIdRef(dcOrVars, vars));
}

export const getDnaServicesBySampleTypeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetDnaServicesBySampleType', inputVars);
}
getDnaServicesBySampleTypeRef.operationName = 'GetDnaServicesBySampleType';

export function getDnaServicesBySampleType(dcOrVars, vars) {
  return executeQuery(getDnaServicesBySampleTypeRef(dcOrVars, vars));
}

export const getAtHomeServicesRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAtHomeServices');
}
getAtHomeServicesRef.operationName = 'GetAtHomeServices';

export function getAtHomeServices(dc) {
  return executeQuery(getAtHomeServicesRef(dc));
}

export const getKitsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetKits');
}
getKitsRef.operationName = 'GetKits';

export function getKits(dc) {
  return executeQuery(getKitsRef(dc));
}

export const getAvailableKitsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAvailableKits');
}
getAvailableKitsRef.operationName = 'GetAvailableKits';

export function getAvailableKits(dc) {
  return executeQuery(getAvailableKitsRef(dc));
}

export const getKitByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetKitById', inputVars);
}
getKitByIdRef.operationName = 'GetKitById';

export function getKitById(dcOrVars, vars) {
  return executeQuery(getKitByIdRef(dcOrVars, vars));
}

export const getAvailableTimeSlotsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAvailableTimeSlots', inputVars);
}
getAvailableTimeSlotsRef.operationName = 'GetAvailableTimeSlots';

export function getAvailableTimeSlots(dcOrVars, vars) {
  return executeQuery(getAvailableTimeSlotsRef(dcOrVars, vars));
}

export const getTimeSlotsByStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTimeSlotsByStaff', inputVars);
}
getTimeSlotsByStaffRef.operationName = 'GetTimeSlotsByStaff';

export function getTimeSlotsByStaff(dcOrVars, vars) {
  return executeQuery(getTimeSlotsByStaffRef(dcOrVars, vars));
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

export const getBookingsByStatusRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookingsByStatus', inputVars);
}
getBookingsByStatusRef.operationName = 'GetBookingsByStatus';

export function getBookingsByStatus(dcOrVars, vars) {
  return executeQuery(getBookingsByStatusRef(dcOrVars, vars));
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

export const getBookingItemsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookingItems', inputVars);
}
getBookingItemsRef.operationName = 'GetBookingItems';

export function getBookingItems(dcOrVars, vars) {
  return executeQuery(getBookingItemsRef(dcOrVars, vars));
}

export const getBookingItemByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookingItemById', inputVars);
}
getBookingItemByIdRef.operationName = 'GetBookingItemById';

export function getBookingItemById(dcOrVars, vars) {
  return executeQuery(getBookingItemByIdRef(dcOrVars, vars));
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

