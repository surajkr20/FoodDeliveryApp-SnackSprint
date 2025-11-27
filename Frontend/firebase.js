// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_APIKEY,
  authDomain: "snacksprint-auth.firebaseapp.com",
  projectId: "snacksprint-auth",
  storageBucket: "snacksprint-auth.firebasestorage.app",
  messagingSenderId: "309429151370",
  appId: "1:309429151370:web:5c9a898f131354e4916f73",
  measurementId: "G-ZNWY2ZHLFQ"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth(app);
export {app, auth};