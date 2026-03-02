// Firebase Configuration - GoviConnect
const firebaseConfig = {
  apiKey: "AIzaSyAJBaIq9oElhG0iMbAos0TiWwUQLiADg7g",
  authDomain: "goviconnect-105c9.firebaseapp.com",
  projectId: "goviconnect-105c9",
  storageBucket: "goviconnect-105c9.firebasestorage.app",
  messagingSenderId: "173017898873",
  appId: "1:173017898873:web:eb3ad5936aabe5cbc119a8"
};

// Initialize Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

console.log('Firebase connected successfully! GoviConnect is ready!');