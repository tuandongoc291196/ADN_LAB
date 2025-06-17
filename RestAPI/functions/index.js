const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const {swaggerUi, swaggerDocs} = require('./config/swagger');

const {addPayment} = require('./controllers/payments/addPayment');
const {getAllPayments, getPayment} = require('./controllers/payments/getPayment');

const {getAllUsers, getOneUser} = require('./controllers/users/getUsers');

const {getAllServiceAndMethods, getOneServiceAndMethods} = require('./controllers/services/getServicesAndMethods');

const {getAllRoles, getOneRole} = require('./controllers/roles/getRoles');
const {updateRole} = require('./controllers/roles/updateRole');
const {deleteRole} = require('./controllers/roles/deleteRole');
const {addRole} = require('./controllers/roles/addRole');

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

/**
 * @swagger
 * /services&methods:
 *   get:
 *     tags:
 *       - Services
 *     summary: Get all services and collection methods
 *     description: Retrieve a list of all DNA services and their associated collection methods
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Services and methods retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/ServicesResponse'
 *       500:
 *         description: Failed to retrieve services and methods
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/services&methods', getAllServiceAndMethods);

/**
 * @swagger
 * /services&methods:
 *   post:
 *     tags:
 *       - Services
 *     summary: Get specific service with methods
 *     description: Retrieve details of a specific DNA service and its collection methods
 *     security:
 *       - BearerAuth: []
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
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 200
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Service and methods retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     service:
 *                       $ref: '#/components/schemas/Service'
 *                     methods:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/ServiceCollectionMethod'
 *       400:
 *         description: serviceId is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Service not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to retrieve service and methods
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/services&methods', getOneServiceAndMethods);

/**
 * @swagger
 * /users:
 *   get:
 *     tags:
 *       - Users
 *     summary: Get all users
 *     description: Retrieve a list of all users in the system
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Users retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/UsersResponse'
 *       500:
 *         description: Failed to retrieve users
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/users', getAllUsers);

/**
 * @swagger
 * /users:
 *   post:
 *     tags:
 *       - Users
 *     summary: Get specific user details
 *     description: Retrieve details of a specific user by user ID
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
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: User retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     user:
 *                       $ref: '#/components/schemas/User'
 *       400:
 *         description: userId is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: User not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to retrieve user
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/users', getOneUser);

/**
 * @swagger
 * /roles:
 *   get:
 *     tags:
 *       - Roles
 *     summary: Get all roles
 *     description: Retrieve a list of all roles in the system
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/RolesResponse'
 *       404:
 *         description: No roles found in the database
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to retrieve roles
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/roles', getAllRoles);

/**
 * @swagger
 * /roles:
 *   post:
 *     tags:
 *       - Roles
 *     summary: Get a specific role by ID
 *     description: Retrieve details of a specific role using its ID
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
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Role retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     role:
 *                       $ref: '#/components/schemas/Role'
 *       400:
 *         description: roleId is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to retrieve role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/roles', getOneRole);

/**
 * @swagger
 * /roles:
 *   put:
 *     tags:
 *       - Roles
 *     summary: Update an existing role
 *     description: Update the name and description of an existing role
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
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Role updated successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Missing required fields (roleId, name, description)
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to update role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.put('/roles', updateRole);

/**
 * @swagger
 * /roles:
 *   delete:
 *     tags:
 *       - Roles
 *     summary: Delete a role
 *     description: Delete an existing role from the system
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
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Role deleted successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: roleId is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Role not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to delete role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.delete('/roles', deleteRole);

/**
 * @swagger
 * /roles/add:
 *   post:
 *     tags:
 *       - Roles
 *     summary: Create a new role
 *     description: Add a new role to the system with specified ID, name, and description
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
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 201
 *                 status:
 *                   type: string
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Role created successfully
 *                 data:
 *                   type: object
 *       400:
 *         description: Missing required fields (id, name, description) or database operation failed
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       409:
 *         description: Role with this ID already exists
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to create role
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/roles/add', addRole);

/**
 * @swagger
 * /payments:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Create a new payment
 *     description: Create a payment request for MOMO, VNPAY, or ZALOPAY and get payment URL
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
 *         description: Invalid payment data or missing required fields
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to create payment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/payments', addPayment);

/**
 * @swagger
 * /payments:
 *   get:
 *     tags:
 *       - Payments
 *     summary: Get all payments
 *     description: Retrieve a list of all payments in the system
 *     security:
 *       - BearerAuth: []
 *     responses:
 *       200:
 *         description: Payments retrieved successfully
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
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Payments retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     payments:
 *                       type: array
 *                       items:
 *                         $ref: '#/components/schemas/Payment'
 *       500:
 *         description: Failed to retrieve payments
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.get('/payments', getAllPayments);

/**
 * @swagger
 * /payments/details:
 *   post:
 *     tags:
 *       - Payments
 *     summary: Get specific payment details
 *     description: Retrieve details of a specific payment by payment ID
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: ['paymentId']
 *             properties:
 *               paymentId:
 *                 type: string
 *                 description: Payment ID to retrieve
 *                 example: 'PAY_12345'
 *     responses:
 *       200:
 *         description: Payment details retrieved successfully
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
 *                   example: success
 *                 message:
 *                   type: string
 *                   example: Payment retrieved successfully
 *                 data:
 *                   type: object
 *                   properties:
 *                     payment:
 *                       $ref: '#/components/schemas/Payment'
 *       400:
 *         description: paymentId is required
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       404:
 *         description: Payment not found
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 *       500:
 *         description: Failed to retrieve payment
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Error'
 */
app.post('/payments/details', getPayment);
 
exports.app = functions.https.onRequest(app);
