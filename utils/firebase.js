import admin from "firebase-admin";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const serviceAccount = require("../garbagecollectionsystem-bba0d-firebase-adminsdk-e65u6-210c1e25ea.json");
// import serviceAccount from '../garbagecollectionsystem-bba0d-firebase-adminsdk-e65u6-210c1e25ea.json' assert { type: 'json' };

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const firestore = admin.firestore();
const messaging = admin.messaging();

export { firestore, messaging }