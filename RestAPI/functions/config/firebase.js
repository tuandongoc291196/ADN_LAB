var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");
const { getDataConnect } = require("firebase-admin/data-connect");

const app = admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "su25-swp391-g8.firebasestorage.app"
});

const db = admin.firestore();
admin.firestore().settings({ignoreUndefinedProperties:true});
const bucket = admin.storage().bucket();
const getauth = admin.auth();

const dataConnect =  getDataConnect({
  serviceId: "su25-swp391-g8-service",
  location: "asia-east2"
}, app);

module.exports = {admin, db, getauth, bucket, dataConnect};