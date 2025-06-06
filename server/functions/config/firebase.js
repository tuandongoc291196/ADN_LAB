var admin = require("firebase-admin");
var serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  storageBucket: "su25-swp391-g8.firebasestorage.app"
});

const db = admin.firestore();
admin.firestore().settings({ignoreUndefinedProperties:true});
const bucket = admin.storage().bucket();
const getauth = admin.auth();

module.exports = {admin, db, getauth, bucket};
