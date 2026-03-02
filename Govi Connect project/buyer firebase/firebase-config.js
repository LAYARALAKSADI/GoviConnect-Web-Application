// firebase-config.js
const firebaseConfig = {
    apiKey: "AIzaSyAJBaIq9oElhG0iMbAos0TiWwUQLiADg7g",
    authDomain: "goviconnect-105c9.firebaseapp.com",
    projectId: "goviconnect-105c9",
    storageBucket: "goviconnect-105c9.firebasestorage.app",
    messagingSenderId: "173017898873",
    appId: "1:173017898873:web:eb3ad5936aabe5cbc119a8"
};

// Check if Firebase is already initialized
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app(); // if already initialized, use that one
}

const auth = firebase.auth();
const db = firebase.firestore();

console.log('Firebase configured successfully');