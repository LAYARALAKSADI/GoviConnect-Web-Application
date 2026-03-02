import { auth } from './firebase-config.js';
import { sendPasswordResetEmail } from "https://www.gstatic.com/firebasejs/9.22.0/firebase-auth.js";

document.getElementById('forgotPasswordForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const email = document.getElementById('email').value;
    const submitBtn = document.querySelector('.btn-primary');
    
    try {
        submitBtn.textContent = 'Sending...';
        submitBtn.disabled = true;
        
        await sendPasswordResetEmail(auth, email);
        
        alert('✅ Password reset email sent! Check your inbox.');
        window.location.href = 'buyer-login.html';
        
    } catch (error) {
        console.error("Password reset error:", error);
        
        let errorMessage = "Failed to send reset email: ";
        switch (error.code) {
            case 'auth/user-not-found':
                errorMessage += "No account found with this email.";
                break;
            case 'auth/invalid-email':
                errorMessage += "Invalid email address.";
                break;
            default:
                errorMessage += error.message;
        }
        
        alert(errorMessage);
    } finally {
        submitBtn.textContent = 'Send Reset Link';
        submitBtn.disabled = false;
    }
});