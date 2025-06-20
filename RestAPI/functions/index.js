const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const {swaggerUi, swaggerDocs} = require('./config/swagger');

const {getAllUsers, getOneUser} = require('./controllers/users/getUsers');
const {updateUserRole} = require('./controllers/users/updateUser');
const {updateUser} = require('./controllers/users/updateUser');

const {addService} = require('./controllers/services/addService');
const {getAllServiceAndMethods, getOneServiceAndMethods} = require('./controllers/services/getServicesAndMethods');
const {updateService} = require('./controllers/services/updateService');
const {deleteService} = require('./controllers/services/deleteService');

const {getAllRoles, getOneRole} = require('./controllers/roles/getRoles');
const {updateRole} = require('./controllers/roles/updateRole');
const {deleteRole} = require('./controllers/roles/deleteRole');
const {addRole} = require('./controllers/roles/addRole');

const {addBooking} = require('./controllers/bookings/addBooking');
const {getAllBookings, getOneBooking} = require('./controllers/bookings/getBookings');

const {addPayment} = require('./controllers/payments/addPayment');

const {getUnavailableTimeSlots, getOneTimeSlot} = require('./controllers/timeSlots/getTimeSlot');

// Blog Controllers
const { addBlog } = require('./controllers/blogs/addBlog');
const { getAllBlogs } = require('./controllers/blogs/getBlog');
const { getBlogById } = require('./controllers/blogs/getBlogById');
const { updateBlog } = require('./controllers/blogs/updateBlog');
const { deleteBlog } = require('./controllers/blogs/deleteBlog');

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

app.get('/', (req, res) => {
  res.send("Hey there. We've been trying to reach you concerning your vehicle's extended warrant. For Swagger, visit /api-docs");
});

app.post('/services&methods/add', addService);
app.get('/services&methods', getAllServiceAndMethods);
app.post('/services&methods', getOneServiceAndMethods);
app.put('/services&methods', updateService);
app.delete('/services&methods', deleteService);

app.get('/users', getAllUsers);
app.post('/users', getOneUser);
app.put('/users/role', updateUserRole);
app.put('/users', updateUser);

app.get('/roles', getAllRoles);
app.post('/roles', getOneRole);
app.put('/roles', updateRole);
app.delete('/roles', deleteRole);
app.post('/roles/add', addRole);

app.get('/timeslots', getUnavailableTimeSlots);
app.post('/timeslots', getOneTimeSlot);

app.get('/bookings', getAllBookings);
app.post('/bookings', getOneBooking);
app.post('/bookings/add', addBooking);

app.post('/payments', addPayment);

// Blog Routes
app.get('/blogs', getAllBlogs);
app.get('/blogs/:id', getBlogById);
app.post('/blogs/add', addBlog);
app.put('/blogs/:id', updateBlog);
app.delete('/blogs/:id', deleteBlog);

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Health]
 *     summary: API Health Check
 *     description: |
 *       Basic health check endpoint to verify API availability and status.
 *       Returns a friendly message and confirms the API is running properly.
 *       
 *       **Use this endpoint to:**
 *       - Verify API connectivity
 *       - Check service availability
 *       - Get link to API documentation
 *     responses:
 *       200:
 *         description: API is running successfully
 *         content:
 *           text/plain:
 *             schema:
 *               type: string
 *               example: "Hey there. We've been trying to reach you concerning your vehicle's extended warrant. For Swagger, visit /api-docs"
 *         headers:
 *           X-Response-Time:
 *             description: Response time in milliseconds
 *             schema:
 *               type: string
 *               example: "12ms"
 *       503:
 *         description: Service unavailable
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 503
 *                 message:
 *                   type: string
 *                   example: "Service temporarily unavailable"
 */

/**
 * @swagger
 * /services&methods/add:
 *   post:
 *     tags: [Services]
 *     summary: Add a new service
 *     description: Create a new DNA service with collection methods
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [title, description, price]
 *             properties:
 *               title:
 *                 type: string
 *                 example: "DNA Paternity Test"
 *               description:
 *                 type: string
 *                 example: "Comprehensive DNA paternity testing service"
 *               fullDescription:
 *                 type: string
 *                 example: "Complete paternity analysis with 99.9% accuracy"
 *               price:
 *                 type: number
 *                 example: 750000
 *               duration:
 *                 type: string
 *                 example: "3-5 days"
 *               category:
 *                 type: string
 *                 example: "DNA Testing"
 *     responses:
 *       201:
 *         description: Service created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 */

/**
 * @swagger
 * /services&methods:
 *   get:
 *     tags: [Services]
 *     summary: Get all services and collection methods
 *     description: Retrieve all DNA services with their available collection methods
 *     responses:
 *       200:
 *         description: Services and methods retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServicesResponse'
 *   post:
 *     tags: [Services]
 *     summary: Get a specific service with methods
 *     description: Retrieve a specific DNA service and its collection methods by service ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ServiceRequest'
 *     responses:
 *       200:
 *         description: Service and methods retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServicesResponse'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     tags: [Services]
 *     summary: Update a service
 *     description: Update an existing DNA service
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [serviceId]
 *             properties:
 *               serviceId:
 *                 type: string
 *                 example: "service_123"
 *               title:
 *                 type: string
 *                 example: "Updated DNA Test"
 *               description:
 *                 type: string
 *                 example: "Updated service description"
 *               price:
 *                 type: number
 *                 example: 800000
 *     responses:
 *       200:
 *         description: Service updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     tags: [Services]
 *     summary: Delete a service
 *     description: Delete an existing DNA service
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [serviceId]
 *             properties:
 *               serviceId:
 *                 type: string
 *                 example: "service_123"
 *     responses:
 *       200:
 *         description: Service deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     description: Retrieve all registered users
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     tags: [Users]
 *     summary: Get a specific user
 *     description: Retrieve a specific user by user ID
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UserRequest'
 *     responses:
 *       200:
 *         description: User retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "User retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/User'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     tags: [Users]
 *     summary: Update user information
 *     description: Update user profile information
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId]
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user_12345"
 *               fullname:
 *                 type: string
 *                 example: "John Doe Updated"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.updated@example.com"
 *               accountStatus:
 *                 type: string
 *                 example: "active"
 *     responses:
 *       200:
 *         description: User updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /users/role:
 *   put:
 *     tags: [Users]
 *     summary: Update user role
 *     description: Update a user's role assignment
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [userId, roleId]
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user_12345"
 *               roleId:
 *                 type: string
 *                 example: "admin"
 *     responses:
 *       200:
 *         description: User role updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /roles:
 *   get:
 *     tags: [Roles]
 *     summary: Get all roles
 *     description: Retrieve all available user roles
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RolesResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     tags: [Roles]
 *     summary: Get a specific role
 *     description: Retrieve a specific role by role ID  
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/RoleRequest'
 *     responses:
 *       200:
 *         description: Role retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Role retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Role'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   put:
 *     tags: [Roles]
 *     summary: Update a role
 *     description: Update an existing role
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/UpdateRoleRequest'
 *     responses:
 *       200:
 *         description: Role updated successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 *   delete:
 *     tags: [Roles]
 *     summary: Delete a role
 *     description: Delete an existing role
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DeleteRoleRequest'
 *     responses:
 *       200:
 *         description: Role deleted successfully
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /roles/add:
 *   post:
 *     tags: [Roles]
 *     summary: Create a new role
 *     description: Create a new user role
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateRoleRequest'
 *     responses:
 *       201:
 *         description: Role created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: Role already exists
 */

/**
 * @swagger
 * /timeslots:
 *   get:
 *     tags: [Time Slots]
 *     summary: Get unavailable time slots
 *     description: Retrieve all unavailable time slots for appointment scheduling
 *     responses:
 *       200:
 *         description: Time slots retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/TimeSlotsResponse'
 *   post:
 *     tags: [Time Slots]
 *     summary: Get a specific time slot
 *     description: Retrieve details of a specific time slot by ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/TimeSlotRequest'
 *     responses:
 *       200:
 *         description: Time slot retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Time slot retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/TimeSlot'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /bookings:
 *   get:
 *     tags: [Bookings]
 *     summary: Get all bookings
 *     description: Retrieve all appointment bookings
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Bookings retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/BookingsResponse'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *   post:
 *     tags: [Bookings]
 *     summary: Get a specific booking
 *     description: Retrieve details of a specific booking by ID
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/BookingRequest'
 *     responses:
 *       200:
 *         description: Booking retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Booking retrieved successfully"
 *                 data:
 *                   $ref: '#/components/schemas/Booking'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       404:
 *         $ref: '#/components/responses/NotFound'
 */

/**
 * @swagger
 * /bookings/add:
 *   post:
 *     tags: [Bookings]
 *     summary: Create a new booking
 *     description: Create a new appointment booking
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/CreateBookingRequest'
 *     responses:
 *       201:
 *         description: Booking created successfully
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       409:
 *         description: Time slot not available
 */

/**
 * @swagger
 * /payments:
 *   post:
 *     tags: [Payments]
 *     summary: Create a payment
 *     description: Create a new payment transaction with MOMO, VNPAY, or ZALOPAY
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentRequest'
 *     responses:
 *       200:
 *         description: Payment URL generated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentResponse'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       401:
 *         $ref: '#/components/responses/Unauthorized'
 *       500:
 *         description: Payment processing error
 */

exports.app = functions.https.onRequest(app);
