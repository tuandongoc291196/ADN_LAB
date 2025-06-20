const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const {swaggerUi, swaggerDocs} = require('./config/swagger');

const {getAllUsers, getOneUser} = require('./controllers/users/getUsers');
const {updateUserRole} = require('./controllers/users/updateUser');
const {updateUser} = require('./controllers/users/updateUser');

const {addService} = require('./controllers/services/addService');
const {getOneService, getAllServices} = require('./controllers/services/getServices');
const {updateService} = require('./controllers/services/updateService');

const {getMethodServices} = require('./controllers/methodService/getMethodServices');

const {getAllMethods, getOneMethod} = require('./controllers/methods/getMethods');

const {getAllRoles, getOneRole} = require('./controllers/roles/getRoles');
const {updateRole} = require('./controllers/roles/updateRole');
const {deleteRole} = require('./controllers/roles/deleteRole');
const {addRole} = require('./controllers/roles/addRole');

const {addPayment} = require('./controllers/payments/addPayment');

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

app.post('/services/add', addService);
app.get('/services', getAllServices);
app.post('/services', getOneService);
app.put('/services', updateService);

app.post('/services/methods', getMethodServices);
app.post('/services/method', getOneMethod);

app.get('/methods', getAllMethods);

app.get('/users', getAllUsers);
app.post('/users', getOneUser);
app.put('/users/role', updateUserRole);
app.put('/users', updateUser);

app.get('/roles', getAllRoles);
app.post('/roles', getOneRole);
app.put('/roles', updateRole);
app.delete('/roles', deleteRole);
app.post('/roles/add', addRole);

app.post('/payments', addPayment);

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     BearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *       description: |
 *         JWT token obtained from Firebase Authentication.
 *         
 *         **To get your token:**
 *         1. Login to the application
 *         2. Open browser developer tools
 *         3. Go to Application/Storage tab
 *         4. Find the authentication token in localStorage or sessionStorage
 *         5. Copy the token value (without 'Bearer ' prefix)
 *         
 *         **Usage:**
 *         - Add to Authorization header: `Bearer <your-jwt-token>`
 *         - Token expires after 1 hour and needs to be refreshed
 *   
 *   schemas:
 *     Error:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           description: HTTP status code
 *           example: 400
 *         status:
 *           type: string
 *           enum: [success, error]
 *           example: "error"
 *         message:
 *           type: string
 *           description: Error message
 *           example: "Validation failed"
 *         errors:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               field:
 *                 type: string
 *                 example: "email"
 *               message:
 *                 type: string
 *                 example: "Invalid email format"
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2025-06-20T10:00:00Z"
 *         path:
 *           type: string
 *           example: "/api/users"
 *     
 *     Success:
 *       type: object
 *       properties:
 *         statusCode:
 *           type: integer
 *           description: HTTP status code
 *           example: 200
 *         status:
 *           type: string
 *           enum: [success, error]
 *           example: "success"
 *         message:
 *           type: string
 *           description: Success message
 *           example: "Operation completed successfully"
 *         data:
 *           type: object
 *           description: Response data
 *         timestamp:
 *           type: string
 *           format: date-time
 *           example: "2025-06-20T10:00:00Z"
 *   
 *   responses:
 *     BadRequest:
 *       description: Bad Request - Invalid input parameters
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Error'
 *               - type: object
 *                 properties:
 *                   statusCode:
 *                     example: 400
 *                   message:
 *                     example: "Invalid request parameters"
 *     
 *     Unauthorized:
 *       description: Unauthorized - Authentication required
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Error'
 *               - type: object
 *                 properties:
 *                   statusCode:
 *                     example: 401
 *                   message:
 *                     example: "Authentication token is required"
 *     
 *     Forbidden:
 *       description: Forbidden - Insufficient permissions
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Error'
 *               - type: object
 *                 properties:
 *                   statusCode:
 *                     example: 403
 *                   message:
 *                     example: "Insufficient permissions for this operation"
 *     
 *     NotFound:
 *       description: Not Found - Resource does not exist
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Error'
 *               - type: object
 *                 properties:
 *                   statusCode:
 *                     example: 404
 *                   message:
 *                     example: "Resource not found"
 *     
 *     Conflict:
 *       description: Conflict - Resource already exists
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Error'
 *               - type: object
 *                 properties:
 *                   statusCode:
 *                     example: 409
 *                   message:
 *                     example: "Resource already exists"
 *     
 *     InternalServerError:
 *       description: Internal Server Error
 *       content:
 *         application/json:
 *           schema:
 *             allOf:
 *               - $ref: '#/components/schemas/Error'
 *               - type: object
 *                 properties:
 *                   statusCode:
 *                     example: 500
 *                   message:
 *                     example: "Internal server error"
 * 
 * tags:
 *   - name: Health
 *     description: API health check and status endpoints
 *   - name: Services
 *     description: DNA testing services management
 *   - name: Service Methods
 *     description: DNA collection methods for services
 *   - name: Methods
 *     description: DNA sample collection methods
 *   - name: Users
 *     description: User account management and authentication
 *   - name: Roles
 *     description: User roles and permissions management
 *   - name: Payments
 *     description: Payment processing with MOMO, VNPAY, and ZALOPAY
 */

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
 * /services/add:
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
 *                 description: "The name of the DNA service"
 *               description:
 *                 type: string
 *                 example: "Comprehensive DNA paternity testing service"
 *                 description: "Brief description of the service"
 *               fullDescription:
 *                 type: string
 *                 example: "Complete paternity analysis with 99.9% accuracy using advanced genetic testing"
 *                 description: "Detailed description of the service"
 *               price:
 *                 type: number
 *                 example: 750000
 *                 description: "Price of the service in VND"
 *               duration:
 *                 type: string
 *                 example: "3-5 business days"
 *                 description: "Expected processing time"
 *               category:
 *                 type: string
 *                 example: "DNA Testing"
 *                 description: "Service category"
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/service-image.jpg"
 *                 description: "URL of the service image"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 description: "Whether the service is currently available"
 *     responses:
 *       201:
 *         description: Service created successfully
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
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Service created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     serviceId:
 *                       type: string
 *                       example: "service_12345"
 *       400:
 *         description: Bad request - Invalid input data
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Missing required fields"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /services:
 *   get:
 *     tags: [Services]
 *     summary: Get all services
 *     description: Retrieve all DNA services with their details and availability
 *     parameters:
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter services by category
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter by service availability status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of services to return (default 50)
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *         description: Number of services to skip for pagination
 *     responses:
 *       200:
 *         description: Services retrieved successfully
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
 *                   example: "Services retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       serviceId:
 *                         type: string
 *                         example: "service_12345"
 *                       title:
 *                         type: string
 *                         example: "DNA Paternity Test"
 *                       description:
 *                         type: string
 *                         example: "Comprehensive DNA paternity testing service"
 *                       price:
 *                         type: number
 *                         example: 750000
 *                       duration:
 *                         type: string
 *                         example: "3-5 business days"
 *                       category:
 *                         type: string
 *                         example: "DNA Testing"
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-20T10:00:00Z"
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 25
 *                     limit:
 *                       type: integer
 *                       example: 50
 *                     offset:
 *                       type: integer
 *                       example: 0
 *       500:
 *         description: Internal server error
 *   post:
 *     tags: [Services]
 *     summary: Get a specific service
 *     description: Retrieve details of a specific DNA service by service ID
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
 *                 example: "service_12345"
 *                 description: "Unique identifier of the service"
 *     responses:
 *       200:
 *         description: Service retrieved successfully
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
 *                   example: "Service retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     serviceId:
 *                       type: string
 *                       example: "service_12345"
 *                     title:
 *                       type: string
 *                       example: "DNA Paternity Test"
 *                     description:
 *                       type: string
 *                       example: "Comprehensive DNA paternity testing service"
 *                     fullDescription:
 *                       type: string
 *                       example: "Complete paternity analysis with 99.9% accuracy"
 *                     price:
 *                       type: number
 *                       example: 750000
 *                     duration:
 *                       type: string
 *                       example: "3-5 business days"
 *                     category:
 *                       type: string
 *                       example: "DNA Testing"
 *                     imageUrl:
 *                       type: string
 *                       example: "https://example.com/service-image.jpg"
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-20T10:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-20T10:00:00Z"
 *       400:
 *         description: Bad request - Invalid service ID
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
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
 *                 example: "service_12345"
 *                 description: "Unique identifier of the service to update"
 *               title:
 *                 type: string
 *                 example: "Updated DNA Test"
 *                 description: "New service title"
 *               description:
 *                 type: string
 *                 example: "Updated service description"
 *                 description: "New brief description"
 *               fullDescription:
 *                 type: string
 *                 example: "Updated detailed description"
 *                 description: "New detailed description"
 *               price:
 *                 type: number
 *                 example: 800000
 *                 description: "New price in VND"
 *               duration:
 *                 type: string
 *                 example: "2-4 business days"
 *                 description: "New processing time"
 *               category:
 *                 type: string
 *                 example: "DNA Testing"
 *                 description: "New service category"
 *               imageUrl:
 *                 type: string
 *                 example: "https://example.com/new-service-image.jpg"
 *                 description: "New image URL"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 description: "Service availability status"
 *     responses:
 *       200:
 *         description: Service updated successfully
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
 *                   example: "Service updated successfully"
 *       400:
 *         description: Bad request - Invalid input data
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /services/methods:
 *   post:
 *     tags: [Service Methods]
 *     summary: Get collection methods for services
 *     description: Retrieve available collection methods for specific DNA services
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               serviceIds:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["service_12345", "service_67890"]
 *                 description: "Array of service IDs to get methods for"
 *               serviceId:
 *                 type: string
 *                 example: "service_12345"
 *                 description: "Single service ID (alternative to serviceIds array)"
 *     responses:
 *       200:
 *         description: Service methods retrieved successfully
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
 *                   example: "Service methods retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       serviceId:
 *                         type: string
 *                         example: "service_12345"
 *                       serviceName:
 *                         type: string
 *                         example: "DNA Paternity Test"
 *                       methods:
 *                         type: array
 *                         items:
 *                           type: object
 *                           properties:
 *                             methodId:
 *                               type: string
 *                               example: "method_001"
 *                             name:
 *                               type: string
 *                               example: "Cheek Swab Collection"
 *                             description:
 *                               type: string
 *                               example: "Non-invasive DNA collection using cheek swabs"
 *                             price:
 *                               type: number
 *                               example: 50000
 *                             duration:
 *                               type: string
 *                               example: "15 minutes"
 *                             isAvailable:
 *                               type: boolean
 *                               example: true
 *       400:
 *         description: Bad request - Invalid service IDs
 *       404:
 *         description: Service not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /services/method:
 *   post:
 *     tags: [Service Methods]
 *     summary: Get specific collection method details
 *     description: Retrieve detailed information about a specific collection method
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [methodId]
 *             properties:
 *               methodId:
 *                 type: string
 *                 example: "method_001"
 *                 description: "Unique identifier of the collection method"
 *               serviceId:
 *                 type: string
 *                 example: "service_12345"
 *                 description: "Optional service ID for context"
 *     responses:
 *       200:
 *         description: Method details retrieved successfully
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
 *                   example: "Method details retrieved successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     methodId:
 *                       type: string
 *                       example: "method_001"
 *                     name:
 *                       type: string
 *                       example: "Cheek Swab Collection"
 *                     description:
 *                       type: string
 *                       example: "Non-invasive DNA collection using cheek swabs"
 *                     fullDescription:
 *                       type: string
 *                       example: "Safe and painless DNA collection method using sterile cotton swabs"
 *                     price:
 *                       type: number
 *                       example: 50000
 *                     duration:
 *                       type: string
 *                       example: "15 minutes"
 *                     requirements:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["No eating or drinking 30 minutes prior", "Valid ID required"]
 *                     isAvailable:
 *                       type: boolean
 *                       example: true
 *                     compatibleServices:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["service_12345", "service_67890"]
 *       400:
 *         description: Bad request - Invalid method ID
 *       404:
 *         description: Method not found
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /methods:
 *   get:
 *     tags: [Methods]
 *     summary: Get all collection methods
 *     description: Retrieve all available DNA collection methods
 *     parameters:
 *       - in: query
 *         name: isAvailable
 *         schema:
 *           type: boolean
 *         description: Filter by method availability
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *         description: Filter methods by category
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *         description: Number of methods to return
 *     responses:
 *       200:
 *         description: Collection methods retrieved successfully
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
 *                   example: "Collection methods retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       methodId:
 *                         type: string
 *                         example: "method_001"
 *                       name:
 *                         type: string
 *                         example: "Cheek Swab Collection"
 *                       description:
 *                         type: string
 *                         example: "Non-invasive DNA collection using cheek swabs"
 *                       price:
 *                         type: number
 *                         example: 50000
 *                       duration:
 *                         type: string
 *                         example: "15 minutes"
 *                       category:
 *                         type: string
 *                         example: "Standard Collection"
 *                       isAvailable:
 *                         type: boolean
 *                         example: true
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-20T10:00:00Z"
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /users:
 *   get:
 *     tags: [Users]
 *     summary: Get all users
 *     description: Retrieve all registered users with pagination and filtering options
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: role
 *         schema:
 *           type: string
 *         description: Filter users by role (admin, manager, staff, customer)
 *       - in: query
 *         name: accountStatus
 *         schema:
 *           type: string
 *           enum: [active, inactive, suspended, pending]
 *         description: Filter users by account status
 *       - in: query
 *         name: limit
 *         schema:
 *           type: integer
 *           minimum: 1
 *           maximum: 100
 *           default: 50
 *         description: Number of users to return
 *       - in: query
 *         name: offset
 *         schema:
 *           type: integer
 *           minimum: 0
 *           default: 0
 *         description: Number of users to skip for pagination
 *       - in: query
 *         name: search
 *         schema:
 *           type: string
 *         description: Search users by name or email
 *     responses:
 *       200:
 *         description: Users retrieved successfully
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
 *                   example: "Users retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       userId:
 *                         type: string
 *                         example: "user_12345"
 *                       email:
 *                         type: string
 *                         format: email
 *                         example: "john.doe@example.com"
 *                       fullname:
 *                         type: string
 *                         example: "John Doe"
 *                       phoneNumber:
 *                         type: string
 *                         example: "+84901234567"
 *                       role:
 *                         type: string
 *                         example: "customer"
 *                       accountStatus:
 *                         type: string
 *                         example: "active"
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-20T10:00:00Z"
 *                       lastLoginAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-20T15:30:00Z"
 *                       isEmailVerified:
 *                         type: boolean
 *                         example: true
 *                 pagination:
 *                   type: object
 *                   properties:
 *                     total:
 *                       type: integer
 *                       example: 150
 *                     limit:
 *                       type: integer
 *                       example: 50
 *                     offset:
 *                       type: integer
 *                       example: 0
 *                     hasMore:
 *                       type: boolean
 *                       example: true
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 401
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Authentication required"
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 *   post:
 *     tags: [Users]
 *     summary: Get a specific user
 *     description: Retrieve detailed information about a specific user by user ID
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
 *                 description: "Unique identifier of the user"
 *               includeHistory:
 *                 type: boolean
 *                 example: false
 *                 description: "Include user's booking and payment history"
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
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "user_12345"
 *                     email:
 *                       type: string
 *                       format: email
 *                       example: "john.doe@example.com"
 *                     fullname:
 *                       type: string
 *                       example: "John Doe"
 *                     phoneNumber:
 *                       type: string
 *                       example: "+84901234567"
 *                     dateOfBirth:
 *                       type: string
 *                       format: date
 *                       example: "1990-05-15"
 *                     address:
 *                       type: object
 *                       properties:
 *                         street:
 *                           type: string
 *                           example: "123 Main Street"
 *                         city:
 *                           type: string
 *                           example: "Ho Chi Minh City"
 *                         district:
 *                           type: string
 *                           example: "District 1"
 *                         postalCode:
 *                           type: string
 *                           example: "700000"
 *                     role:
 *                       type: string
 *                       example: "customer"
 *                     accountStatus:
 *                       type: string
 *                       example: "active"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-20T10:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-20T10:00:00Z"
 *                     lastLoginAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-20T15:30:00Z"
 *                     isEmailVerified:
 *                       type: boolean
 *                       example: true
 *                     preferences:
 *                       type: object
 *                       properties:
 *                         language:
 *                           type: string
 *                           example: "vi"
 *                         notifications:
 *                           type: object
 *                           properties:
 *                             email:
 *                               type: boolean
 *                               example: true
 *                             sms:
 *                               type: boolean
 *                               example: false
 *       400:
 *         description: Bad request - Invalid user ID
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 *   put:
 *     tags: [Users]
 *     summary: Update user information
 *     description: Update user profile information and account settings
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
 *                 description: "Unique identifier of the user to update"
 *               fullname:
 *                 type: string
 *                 example: "John Doe Updated"
 *                 description: "Updated full name"
 *               email:
 *                 type: string
 *                 format: email
 *                 example: "john.updated@example.com"
 *                 description: "Updated email address"
 *               phoneNumber:
 *                 type: string
 *                 example: "+84901234568"
 *                 description: "Updated phone number"
 *               dateOfBirth:
 *                 type: string
 *                 format: date
 *                 example: "1990-05-16"
 *                 description: "Updated date of birth"
 *               address:
 *                 type: object
 *                 properties:
 *                   street:
 *                     type: string
 *                     example: "456 New Street"
 *                   city:
 *                     type: string
 *                     example: "Ho Chi Minh City"
 *                   district:
 *                     type: string
 *                     example: "District 2"
 *                   postalCode:
 *                     type: string
 *                     example: "700001"
 *                 description: "Updated address information"
 *               accountStatus:
 *                 type: string
 *                 enum: [active, inactive, suspended, pending]
 *                 example: "active"
 *                 description: "Updated account status (admin only)"
 *               preferences:
 *                 type: object
 *                 properties:
 *                   language:
 *                     type: string
 *                     example: "en"
 *                   notifications:
 *                     type: object
 *                     properties:
 *                       email:
 *                         type: boolean
 *                         example: true
 *                       sms:
 *                         type: boolean
 *                         example: true
 *                 description: "Updated user preferences"
 *     responses:
 *       200:
 *         description: User updated successfully
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
 *                   example: "User updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     userId:
 *                       type: string
 *                       example: "user_12345"
 *                     updatedFields:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["fullname", "email", "phoneNumber"]
 *       400:
 *         description: Bad request - Invalid input data or validation errors
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: User not found
 *       409:
 *         description: Conflict - Email already exists
 *       500:
 *         description: Internal server error
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
 *     description: Retrieve all available user roles in the system
 *     security:
 *       - BearerAuth: []
 *     parameters:
 *       - in: query
 *         name: isActive
 *         schema:
 *           type: boolean
 *         description: Filter roles by active status
 *       - in: query
 *         name: includePermissions
 *         schema:
 *           type: boolean
 *           default: false
 *         description: Include detailed permissions for each role
 *     responses:
 *       200:
 *         description: Roles retrieved successfully
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
 *                   example: "Roles retrieved successfully"
 *                 data:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       roleId:
 *                         type: string
 *                         example: "admin"
 *                       roleName:
 *                         type: string
 *                         example: "Administrator"
 *                       description:
 *                         type: string
 *                         example: "Full system access with all administrative privileges"
 *                       level:
 *                         type: integer
 *                         example: 1
 *                         description: "Role hierarchy level (1 = highest)"
 *                       isActive:
 *                         type: boolean
 *                         example: true
 *                       permissions:
 *                         type: array
 *                         items:
 *                           type: string
 *                         example: ["user:read", "user:write", "service:manage", "role:manage"]
 *                       createdAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-20T10:00:00Z"
 *                       updatedAt:
 *                         type: string
 *                         format: date-time
 *                         example: "2025-06-20T10:00:00Z"
 *                       userCount:
 *                         type: integer
 *                         example: 5
 *                         description: "Number of users assigned to this role"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       500:
 *         description: Internal server error
 *   post:
 *     tags: [Roles]
 *     summary: Get a specific role
 *     description: Retrieve detailed information about a specific role by role ID
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roleId]
 *             properties:
 *               roleId:
 *                 type: string
 *                 example: "admin"
 *                 description: "Unique identifier of the role"
 *               includeUsers:
 *                 type: boolean
 *                 example: false
 *                 description: "Include list of users with this role"
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
 *                   type: object
 *                   properties:
 *                     roleId:
 *                       type: string
 *                       example: "admin"
 *                     roleName:
 *                       type: string
 *                       example: "Administrator"
 *                     description:
 *                       type: string
 *                       example: "Full system access with all administrative privileges"
 *                     level:
 *                       type: integer
 *                       example: 1
 *                     isActive:
 *                       type: boolean
 *                       example: true
 *                     permissions:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           permission:
 *                             type: string
 *                             example: "user:read"
 *                           description:
 *                             type: string
 *                             example: "View user information"
 *                           category:
 *                             type: string
 *                             example: "User Management"
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-20T10:00:00Z"
 *                     updatedAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-20T10:00:00Z"
 *                     users:
 *                       type: array
 *                       items:
 *                         type: object
 *                         properties:
 *                           userId:
 *                             type: string
 *                             example: "user_12345"
 *                           fullname:
 *                             type: string
 *                             example: "John Doe"
 *                           email:
 *                             type: string
 *                             example: "john.doe@example.com"
 *       400:
 *         description: Bad request - Invalid role ID
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Role not found
 *       500:
 *         description: Internal server error
 *   put:
 *     tags: [Roles]
 *     summary: Update a role
 *     description: Update an existing role's information and permissions
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roleId]
 *             properties:
 *               roleId:
 *                 type: string
 *                 example: "manager"
 *                 description: "Unique identifier of the role to update"
 *               roleName:
 *                 type: string
 *                 example: "Manager Updated"
 *                 description: "Updated role name"
 *               description:
 *                 type: string
 *                 example: "Updated role description with expanded responsibilities"
 *                 description: "Updated role description"
 *               level:
 *                 type: integer
 *                 example: 2
 *                 description: "Updated role hierarchy level"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 description: "Role availability status"
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["user:read", "service:read", "booking:manage"]
 *                 description: "Updated list of permissions"
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
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Role updated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     roleId:
 *                       type: string
 *                       example: "manager"
 *                     updatedFields:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["roleName", "description", "permissions"]
 *       400:
 *         description: Bad request - Invalid input data or validation errors
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Role not found
 *       409:
 *         description: Conflict - Role name already exists
 *       500:
 *         description: Internal server error
 *   delete:
 *     tags: [Roles]
 *     summary: Delete a role
 *     description: Delete an existing role (only if no users are assigned to it)
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roleId]
 *             properties:
 *               roleId:
 *                 type: string
 *                 example: "custom_role"
 *                 description: "Unique identifier of the role to delete"
 *               force:
 *                 type: boolean
 *                 example: false
 *                 description: "Force delete even if users are assigned (will reassign to default role)"
 *               replacementRoleId:
 *                 type: string
 *                 example: "customer"
 *                 description: "Role to assign to users when force deleting (required if force=true)"
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
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Role deleted successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     deletedRoleId:
 *                       type: string
 *                       example: "custom_role"
 *                     affectedUsers:
 *                       type: integer
 *                       example: 0
 *                       description: "Number of users that were reassigned"
 *       400:
 *         description: Bad request - Invalid role ID or missing replacement role
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Insufficient permissions
 *       404:
 *         description: Role not found
 *       409:
 *         description: Conflict - Role has assigned users and force=false
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /roles/add:
 *   post:
 *     tags: [Roles]
 *     summary: Create a new role
 *     description: Create a new user role with specific permissions and hierarchy level
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [roleId, roleName, level]
 *             properties:
 *               roleId:
 *                 type: string
 *                 example: "lab_technician"
 *                 description: "Unique identifier for the new role (lowercase, underscores allowed)"
 *                 pattern: "^[a-z][a-z0-9_]*$"
 *               roleName:
 *                 type: string
 *                 example: "Lab Technician"
 *                 description: "Display name for the role"
 *                 minLength: 2
 *                 maxLength: 50
 *               description:
 *                 type: string
 *                 example: "Laboratory technician responsible for DNA sample processing and analysis"
 *                 description: "Detailed description of the role's responsibilities"
 *                 maxLength: 500
 *               level:
 *                 type: integer
 *                 example: 4
 *                 minimum: 1
 *                 maximum: 10
 *                 description: "Role hierarchy level (1 = highest authority, 10 = lowest)"
 *               permissions:
 *                 type: array
 *                 items:
 *                   type: string
 *                 example: ["sample:read", "sample:update", "test:execute", "report:generate"]
 *                 description: "List of permissions assigned to this role"
 *               isActive:
 *                 type: boolean
 *                 example: true
 *                 default: true
 *                 description: "Whether the role is active and can be assigned to users"
 *               color:
 *                 type: string
 *                 example: "#4CAF50"
 *                 pattern: "^#[0-9A-Fa-f]{6}$"
 *                 description: "Hex color code for role display (optional)"
 *               canManageUsers:
 *                 type: boolean
 *                 example: false
 *                 default: false
 *                 description: "Whether users with this role can manage other users"
 *               maxUsers:
 *                 type: integer
 *                 example: 10
 *                 minimum: 1
 *                 description: "Maximum number of users that can be assigned to this role (optional)"
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
 *                   example: "success"
 *                 message:
 *                   type: string
 *                   example: "Role created successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     roleId:
 *                       type: string
 *                       example: "lab_technician"
 *                     roleName:
 *                       type: string
 *                       example: "Lab Technician"
 *                     level:
 *                       type: integer
 *                       example: 4
 *                     permissionCount:
 *                       type: integer
 *                       example: 4
 *                     createdAt:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-20T10:00:00Z"
 *       400:
 *         description: Bad request - Invalid input data or validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Invalid role ID format"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "roleId"
 *                       message:
 *                         type: string
 *                         example: "Role ID must be lowercase with underscores only"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       403:
 *         description: Forbidden - Insufficient permissions to create roles
 *       409:
 *         description: Conflict - Role ID or name already exists
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 409
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Role with this ID already exists"
 *                 data:
 *                   type: object
 *                   properties:
 *                     conflictField:
 *                       type: string
 *                       example: "roleId"
 *                     existingValue:
 *                       type: string
 *                       example: "lab_technician"
 *       422:
 *         description: Unprocessable Entity - Invalid permissions
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 422
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Some permissions are invalid"
 *                 data:
 *                   type: object
 *                   properties:
 *                     invalidPermissions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["invalid:permission", "unknown:action"]
 *                     availablePermissions:
 *                       type: array
 *                       items:
 *                         type: string
 *                       example: ["user:read", "user:write", "service:read", "service:write"]
 *       500:
 *         description: Internal server error
 */

/**
 * @swagger
 * /payments:
 *   post:
 *     tags: [Payments]
 *     summary: Create a payment transaction
 *     description: |
 *       Create a new payment transaction using one of the supported payment gateways:
 *       - **MOMO**: Mobile payment gateway popular in Vietnam
 *       - **VNPAY**: Vietnamese online payment gateway
 *       - **ZALOPAY**: Digital wallet and payment platform
 *       
 *       This endpoint generates a payment URL that redirects the user to the selected payment gateway.
 *     security:
 *       - BearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required: [amount, paymentMethod, orderId, returnUrl]
 *             properties:
 *               amount:
 *                 type: number
 *                 example: 750000
 *                 minimum: 1000
 *                 maximum: 500000000
 *                 description: "Payment amount in VND (minimum 1,000 VND)"
 *               paymentMethod:
 *                 type: string
 *                 enum: [MOMO, VNPAY, ZALOPAY]
 *                 example: "MOMO"
 *                 description: "Payment gateway to use"
 *               orderId:
 *                 type: string
 *                 example: "ORDER_20250620_001"
 *                 pattern: "^[A-Za-z0-9_-]+$"
 *                 maxLength: 50
 *                 description: "Unique order identifier (alphanumeric, underscore, hyphen only)"
 *               orderInfo:
 *                 type: string
 *                 example: "Payment for DNA Paternity Test - Service ID: service_12345"
 *                 maxLength: 255
 *                 description: "Order description for payment gateway"
 *               returnUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://su25-swp391-g8.web.app/payment/success"
 *                 description: "URL to redirect after successful payment"
 *               cancelUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://su25-swp391-g8.web.app/payment/cancel"
 *                 description: "URL to redirect after cancelled payment"
 *               notifyUrl:
 *                 type: string
 *                 format: uri
 *                 example: "https://app-bggwpxm32a-uc.a.run.app/payments/webhook"
 *                 description: "Webhook URL for payment status notifications"
 *               userId:
 *                 type: string
 *                 example: "user_12345"
 *                 description: "ID of the user making the payment"
 *               serviceId:
 *                 type: string
 *                 example: "service_12345"
 *                 description: "ID of the service being paid for"
 *               bookingId:
 *                 type: string
 *                 example: "booking_12345"
 *                 description: "ID of the associated booking (if applicable)"
 *               customerInfo:
 *                 type: object
 *                 properties:
 *                   fullname:
 *                     type: string
 *                     example: "Nguyen Van A"
 *                     description: "Customer full name"
 *                   email:
 *                     type: string
 *                     format: email
 *                     example: "nguyenvana@example.com"
 *                     description: "Customer email address"
 *                   phoneNumber:
 *                     type: string
 *                     example: "+84901234567"
 *                     description: "Customer phone number"
 *                 description: "Customer information for payment processing"
 *               extraData:
 *                 type: object
 *                 description: "Additional data to be stored with the payment"
 *                 example: {"bookingDate": "2025-06-25", "testType": "paternity"}
 *     responses:
 *       200:
 *         description: Payment URL generated successfully
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
 *                   example: "Payment URL generated successfully"
 *                 data:
 *                   type: object
 *                   properties:
 *                     paymentUrl:
 *                       type: string
 *                       format: uri
 *                       example: "https://payment.momo.vn/gw_payment/transactionProcessor"
 *                       description: "URL to redirect user for payment"
 *                     paymentId:
 *                       type: string
 *                       example: "payment_12345"
 *                       description: "Internal payment transaction ID"
 *                     orderId:
 *                       type: string
 *                       example: "ORDER_20250620_001"
 *                       description: "Order ID for tracking"
 *                     amount:
 *                       type: number
 *                       example: 750000
 *                       description: "Payment amount in VND"
 *                     paymentMethod:
 *                       type: string
 *                       example: "MOMO"
 *                       description: "Selected payment method"
 *                     expiryTime:
 *                       type: string
 *                       format: date-time
 *                       example: "2025-06-20T11:00:00Z"
 *                       description: "Payment URL expiry time"
 *                     qrCode:
 *                       type: string
 *                       example: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAA..."
 *                       description: "QR code for mobile payment (if supported by gateway)"
 *       400:
 *         description: Bad request - Invalid payment parameters
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 400
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Invalid payment amount"
 *                 errors:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       field:
 *                         type: string
 *                         example: "amount"
 *                       message:
 *                         type: string
 *                         example: "Amount must be at least 1,000 VND"
 *       401:
 *         description: Unauthorized - Invalid or missing authentication token
 *       402:
 *         description: Payment Required - Insufficient account balance or payment method issues
 *       422:
 *         description: Unprocessable Entity - Payment gateway validation errors
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 422
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Payment gateway validation failed"
 *                 data:
 *                   type: object
 *                   properties:
 *                     gateway:
 *                       type: string
 *                       example: "MOMO"
 *                     gatewayError:
 *                       type: string
 *                       example: "Invalid merchant configuration"
 *                     gatewayCode:
 *                       type: string
 *                       example: "MERCHANT_ERROR"
 *       500:
 *         description: Internal server error or payment gateway error
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 statusCode:
 *                   type: number
 *                   example: 500
 *                 status:
 *                   type: string
 *                   example: "error"
 *                 message:
 *                   type: string
 *                   example: "Payment processing failed"
 *                 data:
 *                   type: object
 *                   properties:
 *                     errorType:
 *                       type: string
 *                       example: "GATEWAY_ERROR"
 *                     retryAfter:
 *                       type: integer
 *                       example: 300
 *                       description: "Seconds to wait before retrying"
 */

exports.app = functions.https.onRequest(app);
