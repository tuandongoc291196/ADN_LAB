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

const getUserRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUser', inputVars);
}
getUserRef.operationName = 'GetUser';
exports.getUserRef = getUserRef;

exports.getUser = function getUser(dcOrVars, vars) {
  return executeQuery(getUserRef(dcOrVars, vars));
};

const getUserByEmailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetUserByEmail', inputVars);
}
getUserByEmailRef.operationName = 'GetUserByEmail';
exports.getUserByEmailRef = getUserByEmailRef;

exports.getUserByEmail = function getUserByEmail(dcOrVars, vars) {
  return executeQuery(getUserByEmailRef(dcOrVars, vars));
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

const getStaffByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStaffById', inputVars);
}
getStaffByIdRef.operationName = 'GetStaffById';
exports.getStaffByIdRef = getStaffByIdRef;

exports.getStaffById = function getStaffById(dcOrVars, vars) {
  return executeQuery(getStaffByIdRef(dcOrVars, vars));
};

const getPositionsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPositions');
}
getPositionsRef.operationName = 'GetPositions';
exports.getPositionsRef = getPositionsRef;

exports.getPositions = function getPositions(dc) {
  return executeQuery(getPositionsRef(dc));
};

const getPositionByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPositionById', inputVars);
}
getPositionByIdRef.operationName = 'GetPositionById';
exports.getPositionByIdRef = getPositionByIdRef;

exports.getPositionById = function getPositionById(dcOrVars, vars) {
  return executeQuery(getPositionByIdRef(dcOrVars, vars));
};

const getStaffByPositionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStaffByPosition', inputVars);
}
getStaffByPositionRef.operationName = 'GetStaffByPosition';
exports.getStaffByPositionRef = getStaffByPositionRef;

exports.getStaffByPosition = function getStaffByPosition(dcOrVars, vars) {
  return executeQuery(getStaffByPositionRef(dcOrVars, vars));
};

const getManagersRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetManagers');
}
getManagersRef.operationName = 'GetManagers';
exports.getManagersRef = getManagersRef;

exports.getManagers = function getManagers(dc) {
  return executeQuery(getManagersRef(dc));
};

const getStaffCountByPositionRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStaffCountByPosition');
}
getStaffCountByPositionRef.operationName = 'GetStaffCountByPosition';
exports.getStaffCountByPositionRef = getStaffCountByPositionRef;

exports.getStaffCountByPosition = function getStaffCountByPosition(dc) {
  return executeQuery(getStaffCountByPositionRef(dc));
};

const getStaffByPositionIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStaffByPositionId', inputVars);
}
getStaffByPositionIdRef.operationName = 'GetStaffByPositionId';
exports.getStaffByPositionIdRef = getStaffByPositionIdRef;

exports.getStaffByPositionId = function getStaffByPositionId(dcOrVars, vars) {
  return executeQuery(getStaffByPositionIdRef(dcOrVars, vars));
};

const getPositionWithStaffCountRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPositionWithStaffCount', inputVars);
}
getPositionWithStaffCountRef.operationName = 'GetPositionWithStaffCount';
exports.getPositionWithStaffCountRef = getPositionWithStaffCountRef;

exports.getPositionWithStaffCount = function getPositionWithStaffCount(dcOrVars, vars) {
  return executeQuery(getPositionWithStaffCountRef(dcOrVars, vars));
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

const getServiceMethodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetServiceMethod', inputVars);
}
getServiceMethodRef.operationName = 'GetServiceMethod';
exports.getServiceMethodRef = getServiceMethodRef;

exports.getServiceMethod = function getServiceMethod(dcOrVars, vars) {
  return executeQuery(getServiceMethodRef(dcOrVars, vars));
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

const getMyBookingsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyBookings', inputVars);
}
getMyBookingsRef.operationName = 'GetMyBookings';
exports.getMyBookingsRef = getMyBookingsRef;

exports.getMyBookings = function getMyBookings(dcOrVars, vars) {
  return executeQuery(getMyBookingsRef(dcOrVars, vars));
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

const getBookingParticipantsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetBookingParticipants', inputVars);
}
getBookingParticipantsRef.operationName = 'GetBookingParticipants';
exports.getBookingParticipantsRef = getBookingParticipantsRef;

exports.getBookingParticipants = function getBookingParticipants(dcOrVars, vars) {
  return executeQuery(getBookingParticipantsRef(dcOrVars, vars));
};

const getParticipantByIdRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetParticipantById', inputVars);
}
getParticipantByIdRef.operationName = 'GetParticipantById';
exports.getParticipantByIdRef = getParticipantByIdRef;

exports.getParticipantById = function getParticipantById(dcOrVars, vars) {
  return executeQuery(getParticipantByIdRef(dcOrVars, vars));
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

const getSamplesByQualityRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetSamplesByQuality', inputVars);
}
getSamplesByQualityRef.operationName = 'GetSamplesByQuality';
exports.getSamplesByQualityRef = getSamplesByQualityRef;

exports.getSamplesByQuality = function getSamplesByQuality(dcOrVars, vars) {
  return executeQuery(getSamplesByQualityRef(dcOrVars, vars));
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

const getParticipantSamplesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetParticipantSamples', inputVars);
}
getParticipantSamplesRef.operationName = 'GetParticipantSamples';
exports.getParticipantSamplesRef = getParticipantSamplesRef;

exports.getParticipantSamples = function getParticipantSamples(dcOrVars, vars) {
  return executeQuery(getParticipantSamplesRef(dcOrVars, vars));
};

const getAllSamplesRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAllSamples', inputVars);
}
getAllSamplesRef.operationName = 'GetAllSamples';
exports.getAllSamplesRef = getAllSamplesRef;

exports.getAllSamples = function getAllSamples(dcOrVars, vars) {
  return executeQuery(getAllSamplesRef(dcOrVars, vars));
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

const getManagerTestResultsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetManagerTestResults', inputVars);
}
getManagerTestResultsRef.operationName = 'GetManagerTestResults';
exports.getManagerTestResultsRef = getManagerTestResultsRef;

exports.getManagerTestResults = function getManagerTestResults(dcOrVars, vars) {
  return executeQuery(getManagerTestResultsRef(dcOrVars, vars));
};

const getStaffTestResultsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStaffTestResults', inputVars);
}
getStaffTestResultsRef.operationName = 'GetStaffTestResults';
exports.getStaffTestResultsRef = getStaffTestResultsRef;

exports.getStaffTestResults = function getStaffTestResults(dcOrVars, vars) {
  return executeQuery(getStaffTestResultsRef(dcOrVars, vars));
};

const getTestResultsByTypeRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTestResultsByType', inputVars);
}
getTestResultsByTypeRef.operationName = 'GetTestResultsByType';
exports.getTestResultsByTypeRef = getTestResultsByTypeRef;

exports.getTestResultsByType = function getTestResultsByType(dcOrVars, vars) {
  return executeQuery(getTestResultsByTypeRef(dcOrVars, vars));
};

const getPositiveTestResultsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetPositiveTestResults');
}
getPositiveTestResultsRef.operationName = 'GetPositiveTestResults';
exports.getPositiveTestResultsRef = getPositiveTestResultsRef;

exports.getPositiveTestResults = function getPositiveTestResults(dc) {
  return executeQuery(getPositiveTestResultsRef(dc));
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

const getMyBlogsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyBlogs', inputVars);
}
getMyBlogsRef.operationName = 'GetMyBlogs';
exports.getMyBlogsRef = getMyBlogsRef;

exports.getMyBlogs = function getMyBlogs(dcOrVars, vars) {
  return executeQuery(getMyBlogsRef(dcOrVars, vars));
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

const getMyNotificationsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetMyNotifications', inputVars);
}
getMyNotificationsRef.operationName = 'GetMyNotifications';
exports.getMyNotificationsRef = getMyNotificationsRef;

exports.getMyNotifications = function getMyNotifications(dcOrVars, vars) {
  return executeQuery(getMyNotificationsRef(dcOrVars, vars));
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

const getStaffBySpecificationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStaffBySpecification', inputVars);
}
getStaffBySpecificationRef.operationName = 'GetStaffBySpecification';
exports.getStaffBySpecificationRef = getStaffBySpecificationRef;

exports.getStaffBySpecification = function getStaffBySpecification(dcOrVars, vars) {
  return executeQuery(getStaffBySpecificationRef(dcOrVars, vars));
};

const getAvailableStaffRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAvailableStaff');
}
getAvailableStaffRef.operationName = 'GetAvailableStaff';
exports.getAvailableStaffRef = getAvailableStaffRef;

exports.getAvailableStaff = function getAvailableStaff(dc) {
  return executeQuery(getAvailableStaffRef(dc));
};

const getManagersBySpecificationRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetManagersBySpecification', inputVars);
}
getManagersBySpecificationRef.operationName = 'GetManagersBySpecification';
exports.getManagersBySpecificationRef = getManagersBySpecificationRef;

exports.getManagersBySpecification = function getManagersBySpecification(dcOrVars, vars) {
  return executeQuery(getManagersBySpecificationRef(dcOrVars, vars));
};

const getRevenueByCategoryRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetRevenueByCategory');
}
getRevenueByCategoryRef.operationName = 'GetRevenueByCategory';
exports.getRevenueByCategoryRef = getRevenueByCategoryRef;

exports.getRevenueByCategory = function getRevenueByCategory(dc) {
  return executeQuery(getRevenueByCategoryRef(dc));
};

const getStaffWorkloadRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStaffWorkload');
}
getStaffWorkloadRef.operationName = 'GetStaffWorkload';
exports.getStaffWorkloadRef = getStaffWorkloadRef;

exports.getStaffWorkload = function getStaffWorkload(dc) {
  return executeQuery(getStaffWorkloadRef(dc));
};

const getTestCompletionStatsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTestCompletionStats');
}
getTestCompletionStatsRef.operationName = 'GetTestCompletionStats';
exports.getTestCompletionStatsRef = getTestCompletionStatsRef;

exports.getTestCompletionStats = function getTestCompletionStats(dc) {
  return executeQuery(getTestCompletionStatsRef(dc));
};

const getCustomerSatisfactionStatsRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetCustomerSatisfactionStats');
}
getCustomerSatisfactionStatsRef.operationName = 'GetCustomerSatisfactionStats';
exports.getCustomerSatisfactionStatsRef = getCustomerSatisfactionStatsRef;

exports.getCustomerSatisfactionStats = function getCustomerSatisfactionStats(dc) {
  return executeQuery(getCustomerSatisfactionStatsRef(dc));
};

const getAvailableManagersForAssignmentRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAvailableManagersForAssignment');
}
getAvailableManagersForAssignmentRef.operationName = 'GetAvailableManagersForAssignment';
exports.getAvailableManagersForAssignmentRef = getAvailableManagersForAssignmentRef;

exports.getAvailableManagersForAssignment = function getAvailableManagersForAssignment(dc) {
  return executeQuery(getAvailableManagersForAssignmentRef(dc));
};

const getAvailableStaffForTestingRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetAvailableStaffForTesting');
}
getAvailableStaffForTestingRef.operationName = 'GetAvailableStaffForTesting';
exports.getAvailableStaffForTestingRef = getAvailableStaffForTestingRef;

exports.getAvailableStaffForTesting = function getAvailableStaffForTesting(dc) {
  return executeQuery(getAvailableStaffForTestingRef(dc));
};

const getStaffByPositionsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStaffByPositions', inputVars);
}
getStaffByPositionsRef.operationName = 'GetStaffByPositions';
exports.getStaffByPositionsRef = getStaffByPositionsRef;

exports.getStaffByPositions = function getStaffByPositions(dcOrVars, vars) {
  return executeQuery(getStaffByPositionsRef(dcOrVars, vars));
};

const getStaffPerformanceByPositionRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetStaffPerformanceByPosition');
}
getStaffPerformanceByPositionRef.operationName = 'GetStaffPerformanceByPosition';
exports.getStaffPerformanceByPositionRef = getStaffPerformanceByPositionRef;

exports.getStaffPerformanceByPosition = function getStaffPerformanceByPosition(dc) {
  return executeQuery(getStaffPerformanceByPositionRef(dc));
};

const getTestResultStatsByPositionRef = (dc) => {
  const { dc: dcInstance} = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, 'GetTestResultStatsByPosition');
}
getTestResultStatsByPositionRef.operationName = 'GetTestResultStatsByPosition';
exports.getTestResultStatsByPositionRef = getTestResultStatsByPositionRef;

exports.getTestResultStatsByPosition = function getTestResultStatsByPosition(dc) {
  return executeQuery(getTestResultStatsByPositionRef(dc));
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
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
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

const createStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateStaff', inputVars);
}
createStaffRef.operationName = 'CreateStaff';
exports.createStaffRef = createStaffRef;

exports.createStaff = function createStaff(dcOrVars, vars) {
  return executeMutation(createStaffRef(dcOrVars, vars));
};

const updateStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateStaff', inputVars);
}
updateStaffRef.operationName = 'UpdateStaff';
exports.updateStaffRef = updateStaffRef;

exports.updateStaff = function updateStaff(dcOrVars, vars) {
  return executeMutation(updateStaffRef(dcOrVars, vars));
};

const assignStaffToPositionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AssignStaffToPosition', inputVars);
}
assignStaffToPositionRef.operationName = 'AssignStaffToPosition';
exports.assignStaffToPositionRef = assignStaffToPositionRef;

exports.assignStaffToPosition = function assignStaffToPosition(dcOrVars, vars) {
  return executeMutation(assignStaffToPositionRef(dcOrVars, vars));
};

const createStaffWithPositionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateStaffWithPosition', inputVars);
}
createStaffWithPositionRef.operationName = 'CreateStaffWithPosition';
exports.createStaffWithPositionRef = createStaffWithPositionRef;

exports.createStaffWithPosition = function createStaffWithPosition(dcOrVars, vars) {
  return executeMutation(createStaffWithPositionRef(dcOrVars, vars));
};

const createPositionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreatePosition', inputVars);
}
createPositionRef.operationName = 'CreatePosition';
exports.createPositionRef = createPositionRef;

exports.createPosition = function createPosition(dcOrVars, vars) {
  return executeMutation(createPositionRef(dcOrVars, vars));
};

const updatePositionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdatePosition', inputVars);
}
updatePositionRef.operationName = 'UpdatePosition';
exports.updatePositionRef = updatePositionRef;

exports.updatePosition = function updatePosition(dcOrVars, vars) {
  return executeMutation(updatePositionRef(dcOrVars, vars));
};

const deletePositionRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeletePosition', inputVars);
}
deletePositionRef.operationName = 'DeletePosition';
exports.deletePositionRef = deletePositionRef;

exports.deletePosition = function deletePosition(dcOrVars, vars) {
  return executeMutation(deletePositionRef(dcOrVars, vars));
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

const createParticipantRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'CreateParticipant', inputVars);
}
createParticipantRef.operationName = 'CreateParticipant';
exports.createParticipantRef = createParticipantRef;

exports.createParticipant = function createParticipant(dcOrVars, vars) {
  return executeMutation(createParticipantRef(dcOrVars, vars));
};

const updateParticipantRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateParticipant', inputVars);
}
updateParticipantRef.operationName = 'UpdateParticipant';
exports.updateParticipantRef = updateParticipantRef;

exports.updateParticipant = function updateParticipant(dcOrVars, vars) {
  return executeMutation(updateParticipantRef(dcOrVars, vars));
};

const deleteParticipantRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteParticipant', inputVars);
}
deleteParticipantRef.operationName = 'DeleteParticipant';
exports.deleteParticipantRef = deleteParticipantRef;

exports.deleteParticipant = function deleteParticipant(dcOrVars, vars) {
  return executeMutation(deleteParticipantRef(dcOrVars, vars));
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

const updateSampleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateSample', inputVars);
}
updateSampleRef.operationName = 'UpdateSample';
exports.updateSampleRef = updateSampleRef;

exports.updateSample = function updateSample(dcOrVars, vars) {
  return executeMutation(updateSampleRef(dcOrVars, vars));
};

const deleteSampleRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteSample', inputVars);
}
deleteSampleRef.operationName = 'DeleteSample';
exports.deleteSampleRef = deleteSampleRef;

exports.deleteSample = function deleteSample(dcOrVars, vars) {
  return executeMutation(deleteSampleRef(dcOrVars, vars));
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

const assignTestResultManagerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AssignTestResultManager', inputVars);
}
assignTestResultManagerRef.operationName = 'AssignTestResultManager';
exports.assignTestResultManagerRef = assignTestResultManagerRef;

exports.assignTestResultManager = function assignTestResultManager(dcOrVars, vars) {
  return executeMutation(assignTestResultManagerRef(dcOrVars, vars));
};

const assignTestResultStaffAndManagerRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AssignTestResultStaffAndManager', inputVars);
}
assignTestResultStaffAndManagerRef.operationName = 'AssignTestResultStaffAndManager';
exports.assignTestResultStaffAndManagerRef = assignTestResultStaffAndManagerRef;

exports.assignTestResultStaffAndManager = function assignTestResultStaffAndManager(dcOrVars, vars) {
  return executeMutation(assignTestResultStaffAndManagerRef(dcOrVars, vars));
};

const deleteTestResultRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteTestResult', inputVars);
}
deleteTestResultRef.operationName = 'DeleteTestResult';
exports.deleteTestResultRef = deleteTestResultRef;

exports.deleteTestResult = function deleteTestResult(dcOrVars, vars) {
  return executeMutation(deleteTestResultRef(dcOrVars, vars));
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

const addPaymentDetailsRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'AddPaymentDetails', inputVars);
}
addPaymentDetailsRef.operationName = 'AddPaymentDetails';
exports.addPaymentDetailsRef = addPaymentDetailsRef;

exports.addPaymentDetails = function addPaymentDetails(dcOrVars, vars) {
  return executeMutation(addPaymentDetailsRef(dcOrVars, vars));
};

const updateRefundDetailRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'UpdateRefundDetail', inputVars);
}
updateRefundDetailRef.operationName = 'UpdateRefundDetail';
exports.updateRefundDetailRef = updateRefundDetailRef;

exports.updateRefundDetail = function updateRefundDetail(dcOrVars, vars) {
  return executeMutation(updateRefundDetailRef(dcOrVars, vars));
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

const deleteServiceCategoryRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteServiceCategory', inputVars);
}
deleteServiceCategoryRef.operationName = 'DeleteServiceCategory';
exports.deleteServiceCategoryRef = deleteServiceCategoryRef;

exports.deleteServiceCategory = function deleteServiceCategory(dcOrVars, vars) {
  return executeMutation(deleteServiceCategoryRef(dcOrVars, vars));
};

const deleteMethodRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteMethod', inputVars);
}
deleteMethodRef.operationName = 'DeleteMethod';
exports.deleteMethodRef = deleteMethodRef;

exports.deleteMethod = function deleteMethod(dcOrVars, vars) {
  return executeMutation(deleteMethodRef(dcOrVars, vars));
};

const deleteServiceRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteService', inputVars);
}
deleteServiceRef.operationName = 'DeleteService';
exports.deleteServiceRef = deleteServiceRef;

exports.deleteService = function deleteService(dcOrVars, vars) {
  return executeMutation(deleteServiceRef(dcOrVars, vars));
};

const deleteTimeSlotRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteTimeSlot', inputVars);
}
deleteTimeSlotRef.operationName = 'DeleteTimeSlot';
exports.deleteTimeSlotRef = deleteTimeSlotRef;

exports.deleteTimeSlot = function deleteTimeSlot(dcOrVars, vars) {
  return executeMutation(deleteTimeSlotRef(dcOrVars, vars));
};

const deleteBookingRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteBooking', inputVars);
}
deleteBookingRef.operationName = 'DeleteBooking';
exports.deleteBookingRef = deleteBookingRef;

exports.deleteBooking = function deleteBooking(dcOrVars, vars) {
  return executeMutation(deleteBookingRef(dcOrVars, vars));
};

const deleteStaffRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars} = validateArgs(connectorConfig, dcOrVars, vars, true);
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, 'DeleteStaff', inputVars);
}
deleteStaffRef.operationName = 'DeleteStaff';
exports.deleteStaffRef = deleteStaffRef;

exports.deleteStaff = function deleteStaff(dcOrVars, vars) {
  return executeMutation(deleteStaffRef(dcOrVars, vars));
};
