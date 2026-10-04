/*
  CHILL PLANET FIREBASE SETUP
  ---------------------------
  Firebase Authentication + Firestore

  IMPORTANT:
  Firebase web config is safe to use in frontend code.
  Firestore Security Rules must protect admin-only writes.
  Never place service-account private keys in frontend files.
*/


// =========================================================
// FIREBASE STATUS
// =========================================================

export const FIREBASE_ENABLED = true;


// =========================================================
// FIREBASE WEB CONFIG
// =========================================================

export const firebaseConfig = {

  apiKey:
    "AIzaSyCCsDLoQR3R3d08b9eAeE8m45enI36q3aw",

  authDomain:
    "chill-planet.firebaseapp.com",

  projectId:
    "chill-planet",

  storageBucket:
    "chill-planet.firebasestorage.app",

  messagingSenderId:
    "19745825510",

  appId:
    "1:19745825510:web:14d169cd40cfa610c4d127"

};


// =========================================================
// FIREBASE INSTANCES
// =========================================================

let app = null;
let db = null;
let auth = null;


// =========================================================
// FIREBASE INITIALIZER
// =========================================================

export async function getFirebase() {

  if (!FIREBASE_ENABLED) {

    return {
      app: null,
      db: null,
      auth: null,
      enabled: false
    };

  }


  if (app && db && auth) {

    return {
      app,
      db,
      auth,
      enabled: true
    };

  }


  try {

    const {
      initializeApp,
      getApps,
      getApp
    } = await import(
      "https://www.gstatic.com/firebasejs/11.0.2/firebase-app.js"
    );


    const {
      getFirestore
    } = await import(
      "https://www.gstatic.com/firebasejs/11.0.2/firebase-firestore.js"
    );


    const {
      getAuth
    } = await import(
      "https://www.gstatic.com/firebasejs/11.0.2/firebase-auth.js"
    );


    app =
      getApps().length
        ? getApp()
        : initializeApp(firebaseConfig);


    db =
      getFirestore(app);


    auth =
      getAuth(app);


    console.log(
      "Chill Planet Firebase connected successfully."
    );


    return {
      app,
      db,
      auth,
      enabled: true
    };

  }

  catch (error) {

    console.error(
      "Chill Planet Firebase initialization failed:",
      error
    );


    return {
      app: null,
      db: null,
      auth: null,
      enabled: false,
      error
    };

  }

}


// =========================================================
// DIRECT SERVICE HELPERS
// =========================================================

export async function getFirebaseAuth() {

  const firebase =
    await getFirebase();

  return firebase.auth;

}


export async function getFirebaseDb() {

  const firebase =
    await getFirebase();

  return firebase.db;

}


// =========================================================
// CONNECTION TEST
// =========================================================

export async function testFirebaseConnection() {

  try {

    const firebase =
      await getFirebase();


    if (
      firebase.enabled &&
      firebase.app &&
      firebase.db &&
      firebase.auth
    ) {

      console.log(
        "Firebase connection test: SUCCESS"
      );

      return true;

    }


    console.warn(
      "Firebase connection test: NOT CONNECTED"
    );

    return false;

  }

  catch (error) {

    console.error(
      "Firebase connection test failed:",
      error
    );

    return false;

  }

}