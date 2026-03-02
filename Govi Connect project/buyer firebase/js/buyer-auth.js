// buyer-auth.js
import { auth, db } from './firebase-config.js';
import { 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    onAuthStateChanged 
} from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";
import { doc, setDoc, getDoc } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-firestore.js";

// Registration
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const fullName = document.getElementById('fullName').value;
        const phone = document.getElementById('phone').value;
        const email = document.getElementById('email').value;
        const nic = document.getElementById('nic').value;
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert("Passwords don't match!");
            return;
        }

        if (password.length < 6) {
            alert("Password must be at least 6 characters long!");
            return;
        }

        try {
            // Create user in Firebase Auth
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;

            // Create user document in Firestore
            await setDoc(doc(db, "users", user.uid), {
                fullName: fullName,
                phone: phone,
                email: email,
                nic: nic,
                userType: "buyer",
                createdAt: new Date(),
                status: "active"
            });

            alert("Registration successful! Welcome to GoviConnect!");
            window.location.href = "buyer-dashboard.html";
        } catch (error) {
            console.error("Registration error:", error);
            let errorMessage = "Registration failed: ";
            
            switch (error.code) {
                case 'auth/email-already-in-use':
                    errorMessage += "Email is already registered.";
                    break;
                case 'auth/invalid-email':
                    errorMessage += "Invalid email address.";
                    break;
                case 'auth/weak-password':
                    errorMessage += "Password is too weak.";
                    break;
                default:
                    errorMessage += error.message;
            }
            
            alert(errorMessage);
        }
    });
}

// Login
const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const submitBtn = e.target.querySelector('.btn-primary');

        try {
            submitBtn.textContent = 'Logging in...';
            submitBtn.disabled = true;

            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Verify user type in Firestore
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists()) {
                const userData = userDoc.data();
                if (userData.userType !== "buyer") {
                    await auth.signOut();
                    alert("Access denied. This is for buyers only.");
                    return;
                }
            }
            
            alert("Login successful! Welcome back!");
            window.location.href = "buyer-dashboard.html";
        } catch (error) {
            console.error("Login error:", error);
            let errorMessage = "Login failed: ";
            
            switch (error.code) {
                case 'auth/user-not-found':
                    errorMessage += "No account found with this email.";
                    break;
                case 'auth/wrong-password':
                    errorMessage += "Incorrect password.";
                    break;
                case 'auth/invalid-email':
                    errorMessage += "Invalid email address.";
                    break;
                default:
                    errorMessage += error.message;
            }
            
            alert(errorMessage);
        } finally {
            if (submitBtn) {
                submitBtn.textContent = 'Login to Account';
                submitBtn.disabled = false;
            }
        }
    });
}

// Add password toggle functionality
document.addEventListener('DOMContentLoaded', function() {
    // Password toggle functionality
    const toggleButtons = document.querySelectorAll('.toggle-password');
    toggleButtons.forEach(button => {
        button.addEventListener('click', function() {
            const passwordInput = this.parentElement.querySelector('input');
            const eyeIcon = this.querySelector('.eye-icon');
            
            if (passwordInput.type === 'password') {
                passwordInput.type = 'text';
                eyeIcon.textContent = '👁️';
            } else {
                passwordInput.type = 'password';
                eyeIcon.textContent = '👁️‍🗨️';
            }
        });
    });
});

// Check authentication state
onAuthStateChanged(auth, (user) => {
    if (user) {
        console.log("User is logged in:", user.email);
        
        // If on login/register page, redirect to dashboard
        if (window.location.pathname.includes('buyer-login.html') || 
            window.location.pathname.includes('buyer-register.html')) {
            window.location.href = 'buyer-dashboard.html';
        }
    } else {
        console.log("User is logged out");
        
        // If on protected pages, redirect to login
        if (window.location.pathname.includes('buyer-dashboard.html') ||
            window.location.pathname.includes('buyer-profile.html') ||
            window.location.pathname.includes('shopping-cart.html') ||
            window.location.pathname.includes('order-history.html')) {
            window.location.href = 'buyer-login.html';
        }
    }
});