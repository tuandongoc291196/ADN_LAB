const functions = require('firebase-functions');
const express = require('express');
const cors = require('cors');
const {swaggerUi, swaggerDocs} = require('./config/swagger');

const {addUser} = require('./controllers/users/addUser');
const {getAllUsers, getOneUser, getUsersByRole} = require('./controllers/users/getUsers');
const {updateUserRoleToStaff, updateUserRoleToAdmin, updateUser} = require('./controllers/users/updateUser');

const {addService} = require('./controllers/services/addService');
const {getOneService, getAllServices, getServiceByCategoryId} = require('./controllers/services/getServices');
const {updateService} = require('./controllers/services/updateService');
const {deleteService} = require('./controllers/services/deleteService');

const {getMethodServices, getServicesByMethodId} = require('./controllers/methodService/getMethodServices');

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
app.post('/services/category', getServiceByCategoryId);
app.put('/services', updateService);
app.delete('/services', deleteService);

app.post('/method/services', getMethodServices);
app.post('/service/methods', getServicesByMethodId);

app.post('/methods', getOneMethod);
app.get('/methods', getAllMethods);

app.post('/users/add', addUser);
app.get('/users', getAllUsers);
app.post('/users', getOneUser);
app.post ('/users/role', getUsersByRole);
app.put('/users/role/staff', updateUserRoleToStaff);
app.put('/users', updateUser);
app.put('/users/role/admin', updateUserRoleToAdmin);

app.get('/roles', getAllRoles);
app.post('/roles', getOneRole);
app.put('/roles', updateRole);
app.delete('/roles', deleteRole);
app.post('/roles/add', addRole);

app.post('/payments', addPayment);

exports.app = functions.https.onRequest(app);
