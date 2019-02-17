import admin from "firebase-admin";
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://simple-banking-webapp.firebaseio.com"
});

const db = admin.firestore();

export default db;
