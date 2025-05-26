const functions = require('firebase-functions');
const express = require('express');

const {addPayment} = require('./controllers/payments/addPayment');
const {getAllPayments, getPayment} = require('./controllers/payments/getPayment');
const {refundPayment} = require('./controllers/payments/refundPayment');

const app = express();
app.get('/', (req, res) => res.status(200).send("Hey, hey! We've been trying to reach you about your car's extended warranty!"));

app.post('/payments', addPayment);
app.get('/payments', getAllPayments);
app.get('/payments/:entryId', getPayment);
app.post('/refund/:entryId', refundPayment);
 
exports.app = functions.https.onRequest(app);