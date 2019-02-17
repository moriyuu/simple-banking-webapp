import admin from "firebase-admin";
const serviceAccount = require("./serviceAccountKey.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://simple-banking-webapp.firebaseio.com"
});

const db = admin.firestore();
const depositsRef = db.collection("deposits");
const balancesRef = db.collection("balances");

export default db;
export { depositsRef, balancesRef };
