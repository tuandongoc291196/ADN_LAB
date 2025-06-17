const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const {swaggerUi, swaggerDocs} = require('./config/swagger');

const {addPayment} = require('./controllers/payments/addPayment');
const {getAllPayments, getPayment} = require('./controllers/payments/getPayment');

const {getAllUsers, getOneUser} = require('./controllers/users/getUsers');

const {getAllServiceAndMethods, getOneServiceAndMethods} = require('./controllers/services/getServicesAndMethods');

const {createBlog} = require('./controllers/blogs/addBlog');
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

app.get('/services&methods', getAllServiceAndMethods);
app.post('/services&methods', getOneServiceAndMethods);

app.get('/users', getAllUsers);
app.post('/users', getOneUser);

app.post('/payments', addPayment);
app.get('/payments', getAllPayments);

 
exports.app = functions.https.onRequest(app);
