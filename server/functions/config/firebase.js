var admin = require("firebase-admin");
var serviceAccount = require("path/to/serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
admin.firestore().settings({ignoreUndefinedProperties:true});
const bucket = admin.storage().bucket();
const getauth = admin.auth();

module.exports = {admin, db, getauth, bucket};
