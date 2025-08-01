const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const {swaggerUi, swaggerDocs} = require('./config/swagger');
const {onSchedule} = require("firebase-functions/v2/scheduler");

const {cleanupExpiredBookings} = require("./controllers/scheduledTasks/cleanupExpiredBookings");
const {cleanupPendingPaymentBookings} = require("./controllers/scheduledTasks/cleanupPendingPaymentBookings");
const {cleanupStaffSlots} = require("./controllers/scheduledTasks/cleanupStaffSlots");

const {addUser} = require('./controllers/users/addUser');
const {getAllUsers, getOneUser, getUsersByRole} = require('./controllers/users/getUsers');
const {updateUserRoleToStaff, updateUserRoleToAdmin, updateUser, updateUserAccountStatus} = require('./controllers/users/updateUser');
const {deleteUser} = require('./controllers/users/deleteUser');

const {getStaffById, getStaffs, getStaffsByPosition} = require('./controllers/staffs/getStaffs');
const {updateStaff} = require('./controllers/staffs/updateStaff');

const {addService} = require('./controllers/services/addService');
const {getOneService, getAllServices, getServiceByCategoryId} = require('./controllers/services/getServices');
const {updateService, updateServiceStatus, updateServiceFeatured} = require('./controllers/services/updateService');
const {deleteService} = require('./controllers/services/deleteService');

const {getMethodServices, getServicesByMethodId} = require('./controllers/methodService/getMethodServices');

const {getAllMethods, getOneMethod} = require('./controllers/methods/getMethods');

const {getAllRoles, getOneRole} = require('./controllers/roles/getRoles');
const {updateRole} = require('./controllers/roles/updateRole');
const {deleteRole} = require('./controllers/roles/deleteRole');
const {addRole} = require('./controllers/roles/addRole');

const {addBooking} = require('./controllers/bookings/addBooking');
const {getAllBookings, getOneBooking, getBookingByTimeSlotId, getBookingByUserId, getBookingbyStaffId, getBookingsManager} = require('./controllers/bookings/getBookings');
const {deleteBookingById} = require('./controllers/bookings/deleteBooking');
const {cancelBookingByUser, cancelBookingByManager} = require('./controllers/bookings/cancelBooking');
const {updateBookingTime} = require('./controllers/bookings/updateBooking');

const {addBookingHistoryById} = require('./controllers/bookingHistory/addBookingHistory');
const {getBookingHistories} = require('./controllers/bookingHistory/getBookingHistory');

const {getUnavailableTimeSlots, getOneTimeSlot} = require('./controllers/timeSlots/getTimeSlot');

const {getSampleBybookingId} = require('./controllers/sample/getSamples');
const {updateSample} = require('./controllers/sample/updateSample');

const {getTestResultByBookingId, getTestResultByUserId, getTestResultSampleByManagerId} = require('./controllers/testResult/getTestResult');
const {updateTestResult} = require('./controllers/testResult/updateTestResult');

const {addPayment} = require('./controllers/payments/addPayment');
const {getAllPayments, getBookingPayments} = require('./controllers/payments/getPayments');
const {refundPayment} = require('./controllers/payments/refundPayment');

const {addBlog} = require('./controllers/blogs/addBlog');
const {getAllBlogs, getOneBlog} = require('./controllers/blogs/getBlogs');
const {deleteBlog} = require('./controllers/blogs/deleteBlog');
const {updateBlog} = require('./controllers/blogs/updateBlog');

const {addFeedback} = require('./controllers/feedback/addFeedback');
const {getAllFeedback, getBookingFeedback, getServiceFeedback} = require('./controllers/feedback/getFeedbacks');

const {getDashboardReports} = require('./controllers/reports/getReports');
const {getOverviewReports} = require('./controllers/reports/getOverview');

const app = express();

app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5001',
    'https://app-bggwpxm32a-uc.a.run.app'
  ]
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.get('/', (req, res) => {
  res.send("Hey there. We've been trying to reach you concerning your vehicle's extended warrant. For Swagger, visit /api-docs");
});

app.post('/blogs/add', addBlog);
app.put('/blogs', updateBlog);
app.get('/blogs', getAllBlogs);
app.post('/blogs', getOneBlog);
app.delete('/blogs', deleteBlog);

app.post('/services/add', addService);
app.get('/services', getAllServices);
app.post('/services', getOneService);
app.post('/services/category', getServiceByCategoryId);
app.put('/services', updateService);
app.put('/services/status', updateServiceStatus);
app.put('/services/featured', updateServiceFeatured);
app.delete('/services', deleteService);

app.post('/method/services', getMethodServices);
app.post('/service/methods', getServicesByMethodId);

app.post('/methods', getOneMethod);
app.get('/methods', getAllMethods);

app.post('/users/add', addUser);
app.get('/users', getAllUsers);
app.post('/users', getOneUser);
app.post('/users/role', getUsersByRole);
app.put('/users', updateUser);
app.put('/users/role/staff', updateUserRoleToStaff);
app.put('/users/role/admin', updateUserRoleToAdmin);
app.put('/users/status', updateUserAccountStatus);
app.delete('/users', deleteUser);

app.get('/staffs', getStaffs);
app.post('/staffs', getStaffById);
app.post('/staffs/position', getStaffsByPosition);
app.put('/staffs', updateStaff);

app.get('/roles', getAllRoles);
app.post('/roles', getOneRole);
app.put('/roles', updateRole);
app.delete('/roles', deleteRole);
app.post('/roles/add', addRole);

app.post('/bookings/add', addBooking);
app.get('/bookings', getAllBookings);
app.post('/bookings/manager', getBookingsManager);
app.post('/bookings', getOneBooking);
app.post('/bookings/timeslot', getBookingByTimeSlotId);
app.post('/bookings/user', getBookingByUserId);
app.post('/bookings/staff', getBookingbyStaffId);
app.delete('/bookings', deleteBookingById);
app.post('/bookings/cancel/user', cancelBookingByUser);
app.post('/bookings/cancel/manager', cancelBookingByManager);
app.put('/bookings/time', updateBookingTime);

app.post('/booking/history/add', addBookingHistoryById);
app.post('/booking/history', getBookingHistories);

app.post('/timeslots/unavailable', getUnavailableTimeSlots);
app.post('/timeslots', getOneTimeSlot);

app.post('/samples/booking', getSampleBybookingId);
app.put('/samples', updateSample);

app.post('/testresult/booking', getTestResultByBookingId);
app.post('/testresult/user', getTestResultByUserId);
app.post('/testresult&sample/manager', getTestResultSampleByManagerId);
app.put('/testresult', updateTestResult);

app.post('/payments/add', addPayment);
app.get('/payments', getAllPayments);
app.post('/payments/booking', getBookingPayments);
app.post('/payments/refund', refundPayment);

app.post('/feedbacks/add', addFeedback);
app.get('/feedbacks', getAllFeedback);
app.post('/feedbacks/booking', getBookingFeedback);
app.post('/feedbacks/service', getServiceFeedback);

app.post('/reports/dashboard', getDashboardReports);
app.get('/reports/overview', getOverviewReports);

exports.app = functions.https.onRequest(app);
exports.cleanupExpiredBookings = onSchedule('every 30 minutes', async (event) => {
  console.log('Running expired bookings cleanup...');
  await cleanupExpiredBookings();
});

exports.cleanupPendingPaymentBookings = onSchedule({
  schedule: '0 18 * * *',
  timeZone: 'Asia/Ho_Chi_Minh'
}, async (event) => {
  console.log('Running pending payment bookings cleanup at 18:00 GMT+7...');
  await cleanupPendingPaymentBookings();
});

exports.weeklyStaffSlotReset = onSchedule({
  schedule: '0 18 * * *',
  timeZone: 'Asia/Ho_Chi_Minh'
}, async (event) => {
  console.log('Running weekly staff slot reset at 18:00 GMT+7...');
  await cleanupStaffSlots();
});