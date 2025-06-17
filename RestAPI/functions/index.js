const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const {swaggerUi, swaggerDocs} = require('./config/swagger');



// User controllers
const {getAllUsers, getOneUser} = require('./controllers/users/getUsers');

// Service controllers
const {getAllServiceAndMethods, getOneServiceAndMethods} = require('./controllers/services/getServicesAndMethods');

// Blog controllers
const { getAllBlogs, getBlogById } = require('./controllers/blogs/getBlog');
const { getBlogById } = require('./controllers/blogs/getBlogById');
const {createBlog} = require('./controllers/blogs/addBlog');
const { updateBlog } = require('./controllers/blogs/updateBlog');
const { deleteBlog } = require('./controllers/blogs/deleteBlog');

// Sample controllers
const GetSample = require('./controllers/sample/getSample');
const sampleController = new GetSample();
const { createSample } = require('./controllers/sample/addSample');
const { updateSampleStatus } = require('./controllers/sample/updateSampleStatus');

// Test Result controllers
const GetTestResult = require('./controllers/testResult/getTestResult');
const testResultController = new GetTestResult();
const { createTestResult } = require('./controllers/testResult/addTestResult');
const { updateTestResult } = require('./controllers/testResult/updateTestResult');

// Role controllers
const { getAllRoles } = require('./controllers/role/getRole');
const { createRole } = require('./controllers/role/createRole');
const { updateRole } = require('./controllers/role/updateRole');
const { deleteRole } = require('./controllers/role/deleteRole');

// Payment controller
const {getAllPayments, getPayment} = require('./controllers/payments/getPayment');
const {addPayment} = require('./controllers/payments/addPayment');
const { refundPayment } = require('./controllers/payments/refundPayment');

// Kit controllers
const GetKit = require('./controllers/kit/getKit');
const kitController = new GetKit();
const { createKit } = require('./controllers/kit/addKit');
const { updateKitStatus } = require('./controllers/kit/updateKitStatus');

// TimeSlot controllers
const GetTimeSlot = require('./controllers/timeslots/getTimeSlot');
const timeSlotController = new GetTimeSlot();
const UpdateTimeSlots = require('./controllers/timeslots/updateTimeSlot');
const updateTimeSlotsController = new UpdateTimeSlots();
const { createTimeSlot } = require('./controllers/timeslots/createTimeSlot');





const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors({
  origin: [
    'http://localhost:3000', 
    'http://localhost:5001',
    'https://su25-swp391-g8.web.app',
    'https://su25-swp391-g8.firebaseapp.com',
    'https://app-bggwpxm32a-uc.a.run.app'
  ]
}));

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));

/**
 * @swagger
 * /:
 *   get:
 *     tags:
 *       - Health
 *     summary: Health check endpoint
 *     description: Returns a welcome message and API documentation link
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Hey there. We've been trying to reach you concerning your vehicle's extended warrant. For Swagger, visit /api-docs"
 */
app.get('/', (req, res) => {
  res.send("Hey there. We've been trying to reach you concerning your vehicle's extended warrant. For Swagger, visit /api-docs");
});

// Service routes
app.get('/services&methods', getAllServiceAndMethods);
app.post('/services&methods', getOneServiceAndMethods);

// User routes
app.get('/users', getAllUsers);
app.post('/users', getOneUser);



// Blog routes
app.get('/blogs', getAllBlogs);
app.get('/blogs/category', getBlogByCategory);
app.get('/blogs/:id', getBlogById);
app.post('/blogs', createBlog);
app.put('/blogs/:id', updateBlog);
app.delete('/blogs/:id', deleteBlog);

// Sample routes
app.post('/samples', createSample);
app.put('/samples/:id', updateSampleStatus);
app.get('/samples/:sampleId', sampleController.getSampleById);
app.get('/samples', sampleController.getSamplesByStatus);
app.get('/samples/booking/:bookingId', sampleController.getBookingSamples);
app.get('/samples/staff/:staffId', sampleController.getStaffSamples);

// Test Result routes
app.post('/testResults', createTestResult);
app.put('/testResults/:id', updateTestResult);
app.get('/testResults/:resultId', testResultController.getTestResultById);
app.get('/testResults', testResultController.getTestResultsByStatus);
app.get('/testResults/user/:userId', testResultController.getUserTestResults);
app.get('/testResults/booking/:bookingId', testResultController.getBookingTestResults);


// Role routes
app.get('/roles', getRole);
app.post('/roles', createRole);
app.put('/roles/:id', updateRole);
app.delete('/roles/:id', deleteRole);

// Additional payment route
app.post('/payments', addPayment);
app.get('/payments', getAllPayments);
app.post('/payments/refund', refundPayment);
app.get('/payments/:id', getPayment);

// Kit routes
app.post('/kits', createKit);
app.put('/kits/:id', updateKitStatus);
app.get('/kits/:kitId', kitController.getKitById);
app.get('/kits/available', kitController.getAvailableKits);
app.get('/kits', kitController.getAllKits);

// TimeSlot routes
app.post('/timeslots', createTimeSlot);
app.put('/timeslots/:id', updateTimeSlotsController.updateTimeSlot);
app.put('/timeslots/bookings/:id', updateTimeSlotsController.updateTimeSlotBookings);
app.get('/timeslots/available', timeSlotController.getAvailableTimeSlots);
app.get('/timeslots/:id', timeSlotController.getTimeSlotById);
app.get('/timeslots/staff/:staffId', timeSlotController.getTimeSlotsByStaff);
app.get('/timeslots/booking/:bookingId', timeSlotController.getTimeSlotsInRange);


 
exports.app = functions.https.onRequest(app);
