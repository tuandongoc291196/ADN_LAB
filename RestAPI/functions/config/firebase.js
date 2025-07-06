try {
    var admin = require("firebase-admin");
    var serviceAccount = require("./serviceAccountKey.json");
    const { getDataConnect } = require("firebase-admin/data-connect");
    
    if (!serviceAccount) {
        throw new Error("Service account key file not found");
    }

    const app = admin.initializeApp({
        credential: admin.credential.cert(serviceAccount),
        storageBucket: "su25-swp391-g8.firebasestorage.app"
    });

    const db = admin.firestore();
    admin.firestore().settings({ignoreUndefinedProperties:true});
    const bucket = admin.storage().bucket();
    const getauth = admin.auth();

    const dataConnect = getDataConnect({
        serviceId: "su25-swp391-g8-2-service",
        location: "asia-east2"
    }, app);

    module.exports = {admin, db, getauth, bucket, dataConnect};
} catch (error) {
    console.error("Error initializing Firebase configuration:", error);
    throw new Error("Failed to initialize Firebase configuration");
}