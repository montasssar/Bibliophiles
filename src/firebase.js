// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

// ✅ Firebase project config from your Firebase Console
const firebaseConfig = {
  apiKey: "AIzaSyBvHqRyAp6_lkvy7MFnxXsOFboS2cMIMTI",
  authDomain: "bibliophiles-7bf1d.firebaseapp.com",
  projectId: "bibliophiles-7bf1d",
  storageBucket: "bibliophiles-7bf1d.firebasestorage.app",
  messagingSenderId: "765628400016",
  appId: "1:765628400016:web:484684dcf0941906653315",
  measurementId: "G-0QNRF1KLZ6"
};

// 🔥 Initialize Firebase + Auth only (we don't need analytics right now)
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export { auth };
