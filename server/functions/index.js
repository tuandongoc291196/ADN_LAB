const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const { swaggerUi, swaggerDocs } = require('./config/swagger');

const {addPayment} = require('./controllers/payments/addPayment');
const {getAllPayments, getPayment} = require('./controllers/payments/getPayment');
const {refundPayment} = require('./controllers/payments/refundPayment');
const {getHomePage} = require('./controllers/home/homeController');
const { onUserChange } = require('./triggers/userTrigger');

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

app.get('/', getHomePage);
app.post('/payments', addPayment);
app.get('/payments', getAllPayments);
app.get('/payments/:entryId', getPayment);
app.post('/refund/:entryId', refundPayment);
 
exports.app = functions.https.onRequest(app);
exports.onUserChange = onUserChange;