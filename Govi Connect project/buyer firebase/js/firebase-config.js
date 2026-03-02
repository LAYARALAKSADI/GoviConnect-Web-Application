// firebase-config.js
import { initializeApp } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Your GoviConnect Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAJBaIq9oElhG0iMbAos0TiWwUQLiADg7g",
  authDomain: "goviconnect-105c9.firebaseapp.com",
  projectId: "goviconnect-105c9",
  storageBucket: "goviconnect-105c9.firebasestorage.app",
  messagingSenderId: "173017898873",
  appId: "1:173017898873:web:eb3ad5936aabe5cbc119a8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };