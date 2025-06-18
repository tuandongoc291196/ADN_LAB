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
 
exports.app = functions.https.onRequest(app);
